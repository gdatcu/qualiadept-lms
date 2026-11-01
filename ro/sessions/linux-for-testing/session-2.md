# Sesiunea 2: Inspectarea și Filtrarea Log-urilor de Server în QA

::: info 🎯 Obiective de Învățare
La finalul acestei sesiuni, vei fi capabil să:
- Înțelegi de ce **fișierele de log** reprezintă prima și cea mai importantă dovadă tehnică pe care un tester o atașează la un raport de bug de calitate superioară.
- Descifrezi anatomia unei linii de log: timestamp ISO, nivel de severitate (`DEBUG`, `INFO`, `WARN`, `ERROR`, `FATAL`), componenta apelată și stack trace-ul.
- Vizualizezi eficient fișiere text fără a bloca terminalul folosind `cat`, `head -n` și `tail -n`.
- Stăpânești tehnica esențială de **monitorizare în timp real** a log-urilor (`tail -f`) în timp ce execuți teste manuale sau automate.
- Aplici căutări chirurgicale cu instrumentul emblematic **`grep`**, combinând flag-urile vitale: `-i` (case-insensitive), `-n` (număr linie), `-c` (contorizare) și `-v` (eliminare zgomot).
- Extragi dovezile de eroare și să le redirecționezi (`>`) în fișiere de raport dedicate pentru investigații ulterioare.
- Rezolvi provocări practice direct în terminalul Linux interactiv integrat în browser.
:::

---

## Capitolul 1: De ce log-urile sunt prima linie de apărare a unui Tester? 📜

::: info 🧠 Perspectivă
Diferența dintre un tester începător și un inginer QA respectat de întreaga echipă de dezvoltare stă în calitatea informației furnizate:
- **Testerul începător** scrie în Jira: *„Butonul de Plată nu funcționează, pagina arată eroare albă.”*  
  Dezvoltatorul răspunde: *„Merge pe mașina mea, nu pot reproduce!”*
- **Inginerul QA experimentat** scrie în Jira: *„La click pe Plată, serverul aruncă HTTP 500 din cauza unui `Deadlock detected in table orders_queue` la ora 10:04:22 UTC. Dovada completă este extrasă din `/var/log/app.log`, linia 8.”*  
  Dezvoltatorul corectează bug-ul în 10 minute!
:::

Un log de server este o înregistrare cronologică, linie cu linie, a fiecărui eveniment petrecut în aplicație: cereri HTTP primite, autentificări, interogări de baze de date, avertismente de memorie și excepții netratate.

---

### 1.1 Anatomia unei Linii Tipice de Log

Iată o linie reală din log-ul aplicației noastre de test (`/var/log/app.log`):

```text
2026-10-31 10:01:02 ERROR [PaymentGateway] Connection timeout to payment provider gateway.stripe.local:443
```

1. **`2026-10-31 10:01:02` (Timestamp):** Momentul exact (an, lună, zi, oră, minut, secundă, adesea în UTC). Permite corelarea acțiunii din browser cu evenimentul de backend.
2. **`ERROR` (Nivelul de Severitate):**  
   - `DEBUG`: Detalii verbose folosite de dezvoltatori în timpul scrierii codului.
   - `INFO`: Evenimente normale de business (ex: utilizator logat, comandă plasată).
   - `WARN`: Situații neobișnuite, dar care nu opresc fluxul (ex: încercare de retry).
   - `ERROR`: O operațiune a eșuat (ex: plată refuzată, timeout la un serviciu extern).
   - `FATAL` / `CRITICAL`: Serviciul s-a prăbușit complet.
3. **`[PaymentGateway]` (Contextul / Componenta):** Modulul de cod care a generat evenimentul.
4. **`Connection timeout...` (Mesajul & Detaliile):** Descrierea exactă a defecțiunii.

---

## Capitolul 2: Instrumente de Vizualizare a Fișierelor (`cat`, `head`, `tail`) 👁️

### 2.1 `cat` — Concatenare și Afișare Completă

Comanda `cat` (concatenate) citește și afișează conținutul întregului fișier în consolă dintr-o singură lovitură:

```bash
cat /home/qa-tester/readme.txt
```

::: warning 🛑 Capcana `cat` pe fișiere uriașe de server
Dacă rulezi `cat /var/log/production_app.log` pe un server unde fișierul are 2 Gigabytes, terminalul tău va fi inundat de milioane de linii, procesul se va bloca, iar conexiunea SSH poate cădea!  
Folosește `cat` **doar** pentru fișiere mici de configurare (`config.json`, fișiere de test). Pentru log-uri mari, folosește `head`, `tail` sau `grep`!
:::

---

### 2.2 `head` — Inspectarea Începutului Fișierului

Comanda `head` afișează primele linii ale unui fișier (implicit primele 10 linii). Folosește opțiunea `-n` pentru a controla numărul de linii:

```bash
# Afișează primele 3 evenimente din log (ex: verificarea configurării la pornirea serverului):
head -n 3 /var/log/app.log

# Afișează antetul unui fișier CSV de test:
head -n 1 /app/users.csv
# Output: id,username,email,role,status
```

---

### 2.3 `tail` — Inspectarea Sfârșitului Fișierului (Unde trăiesc cele mai noi erori)

Deoarece log-urile sunt scrise cronologic, cele mai recente erori se află **întotdeauna la sfârșitul fișierului**. Comanda `tail` este cel mai frecvent instrument de inspecție:

```bash
# Afișează ultimele 5 linii din log:
tail -n 5 /var/log/app.log
```

---

### 2.4 ⚡ Superputerea QA: Monitorizarea în Timp Real cu `tail -f`

Opțiunea `-f` (follow) instruiește comanda să mențină fișierul deschis și să afișeze instantaneu pe ecran orice linie nouă pe măsură ce este scrisă pe disk de server!

```bash
tail -f /var/log/app.log
```

**Fluxul de lucru profesional în testare:**
1. Deschizi o fereastră de terminal și tastezi `tail -f /var/log/app.log`.
2. Deschizi browserul sau Postman și apeși butonul „Trimite Comanda”.
3. Privești terminalul: în secunda în care apare o eroare de server, vezi imediat excepția și cauza din spate!
4. Apeși `Ctrl + C` pentru a opri urmărirea.

---

## Capitolul 3: Căutarea Chirurgicală cu `grep` 🔍

`grep` (Global Regular Expression Print) este cel mai puternic și versatil utilitar de căutare text din ecosistemul Linux. El scanează fișiere de milioane de linii și returnează doar rândurile care respectă un tipar (pattern) dat.

$$\text{grep} \quad [\text{opțiuni}] \quad \text{'pattern'} \quad [\text{fișier}]$$

```bash
# Căutare simplă: găsește toate liniile ce conțin cuvântul 'timeout'
grep 'timeout' /var/log/app.log
```

---

### 3.1 Cele 5 Opțiuni Esențiale `grep` pentru orice Tester

| Opțiune | Nume | Ce face? | Exemplu QA |
| :--- | :--- | :--- | :--- |
| **`-i`** | Ignore Case | Caută insensibil la majuscule/minuscule (`error`, `ERROR`, `Error`). | `grep -i 'error' /var/log/app.log` |
| **`-n`** | Line Number | Afișează numărul liniei din fișier pentru fiecare potrivire găsită. | `grep -n 'Deadlock' /var/log/app.log` |
| **`-c`** | Count | Numără aparițiile fără a afișa textul complet pe ecran. | `grep -c '500' /var/log/nginx_access.log` |
| **`-v`** | Invert Match | **Exclude** liniile care conțin pattern-ul (elimină zgomotul de fond). | `grep -v 'INFO' /var/log/app.log` |
| **`-E`** | Extended Regex | Permite căutări avansate cu operatorul OR `\|`. | `grep -E 'ERROR\|WARN' /var/log/app.log` |

---

### 3.2 Exemple Practice pe Log-uri Reale

#### Scenariul 1: Numărarea erorilor HTTP 500 din log-ul Nginx
Când testezi rezistența unui server sub încărcare (Load Testing), vrei să știi câte cereri s-au soldat cu eroare internă:

```bash
grep -c ' 500 ' /var/log/nginx_access.log
# Output: 2 (știm instant că exact 2 cereri au picat cu 500!)
```

#### Scenariul 2: Curățarea zgomotului cu `-v`
Dacă log-ul conține mii de mesaje `INFO` normale care îți îngreunează căutarea:

```bash
# Afișează doar liniile care NU conțin 'INFO':
grep -v 'INFO' /var/log/app.log
```

#### Scenariul 3: Căutare combinată `-in`
Vrei să găsești erorile legate de plăți și să știi exact pe ce rânduri se află în fișier:

```bash
grep -in 'payment' /var/log/app.log
# 3:2026-10-31 10:01:02 ERROR [PaymentGateway] Connection timeout...
# 4:2026-10-31 10:01:05 WARN [OrderService] Payment retry 1 initiated...
# 5:2026-10-31 10:01:12 ERROR [PaymentGateway] Transaction declined...
```

---

## Capitolul 4: Salvarea Dovenzilor de Bug prin Redirecționare (`>`) 💾

Când raportezi un defect, nu este profesionist să copiezi manual fragmente rupte cu mouse-ul. Poți redirecționa ieșirea comenzii `grep` direct într-un fișier nou de raport:

```bash
# Creează fișierul /tmp/payment_failures.txt care conține doar erorile de plată:
grep 'PaymentGateway' /var/log/app.log > /tmp/payment_failures.txt

# Verifici conținutul fișierului salvat:
cat /tmp/payment_failures.txt
```

---

## Capitolul 5: Matricea de Decizie QualiAdept 🧭

| Obiectiv QA | Instrument Recomandat | Sintaxă Rapidă |
| :--- | :--- | :--- |
| **Urmărirea live a erorilor în timpul testului** | `tail -f` | `tail -f /var/log/app.log` |
| **Aflarea celor mai recente 20 de evenimente** | `tail -n 20` | `tail -n 20 /var/log/app.log` |
| **Găsirea rapidă a unui cod de eroare specific** | `grep -i` | `grep -i "PAY_ERR_04" /var/log/app.log` |
| **Numărarea erorilor pentru raportul de testare** | `grep -c` | `grep -c "ERROR" /var/log/app.log` |
| **Verificarea antetului sau a primelor rânduri de date** | `head -n` | `head -n 5 /app/users.csv` |

---

## Capitolul 6: 🛡️ The Tester's Eye & AI Guardrails

::: info 🧠 Capcane frecvente generate de AI la analiza log-urilor
1. **Uitarea ghilimelelor la pattern-ul de căutare:** Dacă pattern-ul conține spații sau caractere speciale, scrierea `grep Connection timeout app.log` va căuta cuvântul *Connection* în fișierele *timeout* și *app.log*! Pune întotdeauna ghilimele: `grep "Connection timeout" app.log`.
2. **Confuzia între `cat` și `tail`:** AI folosește adesea `cat log.txt | grep ...`. Această sintaxă creează un proces suplimentar inutil (*Useless Use of Cat*). Scrie direct `grep pattern log.txt`.
3. **Căutare sensibilă la majuscule când formatul e imprevizibil:** Dezvoltatorii pot loga `Error`, `error`, `ERROR` sau `Err`. Folosirea flag-ului `-i` este obligatorie pentru a nu rata dovezi critice.
:::

---

<script setup>
const challenge1Initial = `# Extrage toate liniile care conțin "ERROR" din fișierul /var/log/app.log
# și salvează-le în /tmp/critical_errors.log
`

const challenge1TestCases = [
  {
    name: "Fișierul /tmp/critical_errors.log a fost creat",
    type: "file_exists",
    expectedPath: "/tmp/critical_errors.log"
  },
  {
    name: "Fișierul conține eroarea de timeout",
    type: "file_contains",
    expectedPath: "/tmp/critical_errors.log",
    expected: "Connection timeout to payment provider"
  },
  {
    name: "Fișierul conține eroarea de deadlock",
    type: "file_contains",
    expectedPath: "/tmp/critical_errors.log",
    expected: "Deadlock detected in table orders_queue"
  }
]

const challenge1Solution = `grep ERROR /var/log/app.log > /tmp/critical_errors.log
`

const challenge2Initial = `# Numără câte cereri HTTP cu codul de status 500 apar în /var/log/nginx_access.log
# Afișează doar numărul (folosește flag-ul adecvat al comenzii grep):
`

const challenge2TestCases = [
  {
    name: "Numărare precisă a aparițiilor codului HTTP 500",
    type: "stdout_exact",
    expected: "2"
  }
]

const challenge2Solution = `grep -c "500" /var/log/nginx_access.log
`
</script>

## Capitolul 7: 💻 Provocări Interactive în Terminal

Aplică tehnicile de inspecție și filtrare direct pe fișierele reale de log din sandbox-ul de mai jos.

### Provocarea 1: Extragerea și Salvarea Erorilor Critice
**Scenariu:** Echipa de backend solicită un fișier curat care să conțină doar incidentele critice raportate de aplicație în timpul nopții.  
**Cerință:** Folosește `grep` pentru a căuta liniile ce conțin `ERROR` în fișierul `/var/log/app.log` și redirecționează rezultatul (`>`) în fișierul `/tmp/critical_errors.log`.

<LinuxTerminal
  challenge-id="linux-s2-c1"
  title="Provocarea 1: Extragerea și Salvarea Erorilor Critice"
  description="Filtrează erorile din app.log și creează fișierul de raport critical_errors.log în /tmp."
  :initial-code="challenge1Initial"
  :test-cases="challenge1TestCases"
  :solution="challenge1Solution"
  hint="Scrie comanda: grep ERROR /var/log/app.log > /tmp/critical_errors.log"
/>

---

### Provocarea 2: Contorizarea Incidentelor HTTP 500 din Nginx
**Scenariu:** În timpul unui test de anduranță, trebuie să raportezi numărul exact de cereri client care s-au soldat cu codul `500` (Internal Server Error).  
**Cerință:** Folosește comanda `grep` cu opțiunea de contorizare (`-c`) pe fișierul `/var/log/nginx_access.log` pentru a afișa numărul de linii afectate.

<LinuxTerminal
  challenge-id="linux-s2-c2"
  title="Provocarea 2: Contorizarea Incidentelor HTTP 500"
  description="Numără direct aparițiile statusului 500 în log-ul de acces al serverului web."
  :initial-code="challenge2Initial"
  :test-cases="challenge2TestCases"
  :solution="challenge2Solution"
  hint="Folosește opțiunea -c a comenzii grep: grep -c '500' /var/log/nginx_access.log"
/>

