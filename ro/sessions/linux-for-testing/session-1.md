# Sesiunea 1: Primii Pași în Terminal & Navigarea în Sistemul de Fișiere

::: info 🎯 Obiective de Învățare
La finalul acestei sesiuni, vei fi capabil să:
- Înțelegi rolul critic pe care îl joacă sistemul de operare **Linux** în ecosistemul modern de QA (servere de backend, containere Docker, runneri CI/CD).
- Descifrezi anatomia oricărei comenzi Bash: nume comandă, opțiuni/flag-uri (`-a`, `-l`, `-h`) și argumente de cale.
- Navighezi cu precizie în arborele de directoare Linux utilizând comenzi fundamentale (`pwd`, `cd`, `ls`).
- Înțelegi diferența vitală dintre **căile absolute** (care pornesc de la `/`) și **căile relative**, precum și utilizarea scurtăturilor `~` (home), `..` (părinte) și `.` (director curent).
- Manipulezi fișiere și directoare de test folosind `mkdir -p`, `touch`, `cp -r`, `mv` și `rm -rf`.
- Folosești **terminalul Linux interactiv integrat direct în această pagină** pentru a exersa și valida comenzile în timp real.
:::

---

## Capitolul 1: De ce este Linux esențial pentru un Tester Software? 🐧

::: info 🧠 Perspectivă
În testarea manuală pe desktop sau în primele teste automate locale, lucrezi pe Windows sau macOS cu ferestre grafice. Dar în momentul în care aplicația este trimisă către un mediu de testare (**Staging**, **UAT**) sau într-un pipeline de integrare continuă (**GitHub Actions**, **GitLab CI**, **Jenkins**), interfața grafică dispare complet.  
Acolo există doar **Linux în mod Headless (fără ecran)**. Dacă un test pică la ora 2 noaptea pe server, nu poți deschide un explorator de fișiere cu mouse-ul. Singurul tău mod de a investiga, de a citi log-urile, de a verifica fișierele generate și de a reporni serviciul este linia de comandă.
:::

---

### 1.1 Anatomia unei Comenzi Bash

Orice comandă tastată în terminalul Linux urmează o formulă simplă și predictibilă:

$$\text{comandă} \quad [\text{opțiuni / flag-uri}] \quad [\text{argumente}]$$

```bash
ls -la /var/log
```

1. **`ls` (Comanda):** Programul pe care îi cerem sistemului să îl execute (în acest caz, *list* — listează fișierele).
2. **`-la` (Opțiuni / Flag-uri):** Modifică comportamentul comenzii.  
   - `-l` activează formatul lung detaliat (arată permisiunile, dimensiunea, data).  
   - `-a` (all) forțează afișarea fișierelor ascunse (cele care încep cu punct `.`).  
   - În Linux, opțiunile scurte pot fi combinate: `-l -a` devine `-la`.
3. **`/var/log` (Argumentul):** Ținta asupra căreia acționează comanda (calea către directorul dorit).

---

## Capitolul 2: Harta Sistemului de Fișiere Linux 🗺️

Spre deosebire de Windows, unde fișierele sunt împărțite pe litere de unități (`C:\`, `D:\`), în Linux există **o singură rădăcină universală**, simbolizată prin caracterul slash `/` (Root).  
Toate discurile, folderele, serviciile și fișierele sunt ramuri ale acestui arbore unic.

```
                      / (Root - Rădăcina Sistemului)
     ┌──────────┬──────────┬──────────┬──────────┬──────────┐
   /home       /var       /app       /etc       /tmp       /usr
     │          │          │          │          │
/qa-tester     /log    (cod sursă) (config)  (date temp)
(directorul  (log-uri  (containere) (setări)  (rapoarte)
  nostru)     server)
```

### Directoarele Esențiale pe care orice Tester trebuie să le cunoască:

| Director | Ce conține? | De ce este esențial în QA? |
| :--- | :--- | :--- |
| **`/home/qa-tester`** (sau `~`) | Directorul personal al utilizatorului curent. | Aici se descarcă rapoartele de test, cheile SSH, fișierele de configurare locale. |
| **`/var/log`** | Fișierele de log ale întregului sistem și ale serverelor web. | **Prima destinație a testerului** când un API dă eroare HTTP 500 sau când un worker se blochează (`app.log`, `nginx/error.log`). |
| **`/etc`** | Fișiere de configurare globală ale sistemului. | Verificarea mapărilor de rețea (`/etc/hosts`), a certificatelor SSL și a versiunii de OS (`/etc/os-release`). |
| **`/tmp`** | Fișiere temporare cu drepturi de scriere pentru toți utilizatorii. | Locul ideal unde testele automate pot crea fișiere scratch, descărca fișiere Excel sau exporta capturi de ecran fără erori de permisiuni. |
| **`/app`** | Rădăcina aplicației sub test (tipic în containere Docker). | Inspectarea codului backend, a schemelor de date și a fișierelor `config.json`. |

---

## Capitolul 3: Orientare & Navigare de Bază (`pwd`, `cd`, `ls`) 🧭

### 3.1 `pwd` — Unde mă aflu acum? (Print Working Directory)

Terminalul nu are o bară de adrese vizuală ca un browser. Comanda `pwd` îți afișează calea absolută a directorului curent de lucru:

```bash
pwd
# Rezultat: /home/qa-tester
```

---

### 3.2 `cd` — Schimbarea Directorului (Change Directory)

Comanda `cd` îți permite să călătorești prin sistemul de fișiere:

```bash
# 1. Navigare prin cale absolută (începe mereu cu '/')
cd /var/log

# 2. Navigare înapoi către directorul părinte ('..')
cd ..
# Acum te afli în /var

# 3. Navigare către directorul personal de acasă ('~' sau fără argumente)
cd ~
# Acum te afli în /home/qa-tester

# 4. Salt rapid la directorul în care te aflai anterior ('-')
cd -
# Te întoarce automat în /var
```

::: tip 💡 Căi Absolute vs. Căi Relative
- **Cale Absolută:** Începe întotdeauna cu `/` (rădăcina). Este completă și funcționează indiferent unde te afli:  
  `cd /var/log/nginx`
- **Cale Relativă:** Pornește de la directorul curent (nu are slash la început):  
  Dacă te afli deja în `/var`, comanda `cd log` te va duce în `/var/log`.
:::

---

### 3.3 `ls` — Inspectarea Fișierelor din Director

```bash
# Listare simplă:
ls
# Output: readme.txt  test_notes.txt

# Listare detaliată (-l):
ls -l
# -rw-r--r-- 1 qa-tester qa-tester 145 Oct 31 10:00 readme.txt
# -rw-r--r-- 1 qa-tester qa-tester 102 Oct 31 10:00 test_notes.txt

# Listare completă cu fișiere ascunse (-la):
ls -la
# drwxr-xr-x 1 qa-tester qa-tester 4096 Oct 31 10:00 .
# drwxr-xr-x 1 qa-tester qa-tester 4096 Oct 31 10:00 ..
# -rw-r--r-- 1 qa-tester qa-tester  145 Oct 31 10:00 readme.txt
```

---

## Capitolul 4: Crearea, Copierea și Curățarea Fișierelor 📁

În testarea automată, fiecare execuție generează rapoarte, capturi de ecran și fișiere de log. Gestionarea acestora este o sarcină zilnică:

### 4.1 `mkdir` — Crearea Directoarelor (`-p` este obligatoriu!)

```bash
# Crearea unui singur folder:
mkdir reports

# ⚡ Superputerea QA: Crearea de ierarhii adânci dintr-o singură lovitură (-p / parents)
# Fără flag-ul -p, comanda crapă dacă folderele intermediare nu există!
mkdir -p /home/qa-tester/test-suites/regression/screenshots
```

---

### 4.2 `touch` — Crearea Fișierelor Goale de Test

Comanda `touch` creează instantaneu un fișier gol dacă acesta nu există, sau îi actualizează data ultimei modificări:

```bash
touch /home/qa-tester/execution.log
touch smoke_test.py regression_test.py
```

---

### 4.3 `cp` — Copierea Fișierelor și a Directoarelor

```bash
# Copierea unui fișier simplu:
cp /app/config.json /home/qa-tester/config_backup.json

# Copierea recursivă a unui întreg director (flag-ul -r este obligatoriu!):
cp -r /app/test_data /tmp/test_data_copy
```

---

### 4.4 `mv` — Mutarea și Redenumirea Fișierelor

În Linux, mutarea unui fișier în același director cu un alt nume este exact operațiunea de **redenumire**:

```bash
# Redenumirea unui raport:
mv test_notes.txt sprint_42_notes.txt

# Mutarea unui fișier în alt director:
mv sprint_42_notes.txt /tmp/
```

---

### 4.5 `rm` — Ștergerea Fișierelor și Curățarea Mediului

::: danger ⚠️ Atenție Maximă cu `rm`: În Linux NU există Trash / Recycle Bin!
Fișierele șterse cu `rm` sunt distruse imediat și ireversibil. Nu executa niciodată comenzi cu `sudo rm -rf` fără să verifici de două ori calea!
:::

```bash
# Ștergerea unui fișier simplu:
rm /tmp/old_report.txt

# Ștergerea recursivă și forțată a unui director de artifacte temporare:
rm -rf /home/qa-tester/test-suites
```

---

## Capitolul 5: Matricea de Decizie QualiAdept 🧭

| Operațiune QA | Comanda Recomandată | De ce? |
| :--- | :--- | :--- |
| **Aflarea locației curente pe server** | `pwd` | Esențial înainte de rularea oricărui script de curățare. |
| **Crearea structurii pentru rapoarte Allure / Playwright** | `mkdir -p results/allure-raw` | Flag-ul `-p` previne erorile dacă folderele părinte nu există încă. |
| **Descoperirea fișierelor de configurare secrete (`.env`)** | `ls -la` | Fișierele ascunse încep cu punct și nu sunt afișate de `ls` simplu. |
| **Salvarea unei copii a bazei de date de test înainte de rulare** | `cp test.db test.db.bak` | Permite restaurarea rapidă a stării inițiale după testare. |
| **Curățarea artifactelor vechi la începutul unui pipeline** | `rm -rf target/ test-results/` | Asigură un mediu curat (clean build) fără rezultate false din rulările precedente. |

---

## Capitolul 6: 🛡️ The Tester's Eye & AI Guardrails

::: info 🧠 Capcane frecvente generate de AI în comenzi Linux
Asistenții AI produc adesea greșeli subtile când sugerează comenzi de terminal pentru teste:
1. **Separator de cale Windows:** AI generează des căi cu backslash `cd test\fixtures\data`. În Linux, caracterul `\` este folosit pentru *escaping*, nu pentru foldere! Folosește exclusiv slash `/`.
2. **Uitarea flag-ului `-p` la `mkdir`:** Dacă folderul părinte nu există, scriptul din CI pipeline se prăbușește cu `No such file or directory`.
3. **Uitarea flag-ului `-r` la copierea directoarelor:** Comanda `cp folder1 folder2` eșuează cu mesajul `cp: -r not specified; omitting directory`.
4. **Comenzi distructive fără căi sigure:** AI scrie adesea `rm -rf $DIR/*`. Dacă variabila `$DIR` este goală din greșeală, comanda devine `rm -rf /*`, ștergând întregul sistem de operare!
:::

---

<script setup>
const challenge1Initial = `# Scrie comenzile pentru a crea structura completă de rapoarte
# și navighează în directorul nou creat:
`

const challenge1TestCases = [
  {
    name: "Directorul /home/qa-tester/reports/artifacts a fost creat",
    type: "file_exists",
    expectedPath: "/home/qa-tester/reports/artifacts"
  },
  {
    name: "Navigare confirmată în directorul creat",
    type: "stdout_exact",
    expected: "/home/qa-tester/reports/artifacts"
  }
]

const challenge1Solution = `mkdir -p /home/qa-tester/reports/artifacts
cd /home/qa-tester/reports/artifacts
pwd
`

const challenge2Initial = `# 1. Creează o copie de backup a fișierului de configurare /app/config.json
#    în directorul /home/qa-tester cu numele config_backup.json
# 2. Creează un fișier gol de log numit test_execution.log în /home/qa-tester
`

const challenge2TestCases = [
  {
    name: "Fișierul de backup /home/qa-tester/config_backup.json există",
    type: "file_exists",
    expectedPath: "/home/qa-tester/config_backup.json"
  },
  {
    name: "Fișierul de backup conține configurarea corectă",
    type: "file_contains",
    expectedPath: "/home/qa-tester/config_backup.json",
    expected: "qa_ecommerce"
  },
  {
    name: "Fișierul test_execution.log a fost creat în /home/qa-tester",
    type: "file_exists",
    expectedPath: "/home/qa-tester/test_execution.log"
  }
]

const challenge2Solution = `cp /app/config.json /home/qa-tester/config_backup.json
touch /home/qa-tester/test_execution.log
`
</script>

## Capitolul 7: 💻 Provocări Interactive în Terminal

Exersează navigarea și organizarea fișierelor direct în terminalul Linux integrat de mai jos. Poți folosi modul **Script** pentru a scrie soluția completă și a o verifica, sau comuta pe modul **Live CLI** pentru a rula comenzi una câte una ca pe un server real!

### Provocarea 1: Crearea Structurii de Rapoarte și Navigarea
**Scenariu:** La inițializarea unui framework de testare automată, trebuie să asiguri existența structurii de directoare pentru rapoartele de execuție.  
**Cerință:** Creează ierarhia completă `/home/qa-tester/reports/artifacts` folosind comanda `mkdir` cu opțiunea potrivită, schimbă directorul curent în acesta (`cd`) și afișează locația curentă cu `pwd`.

<LinuxTerminal
  challenge-id="linux-s1-c1"
  title="Provocarea 1: Crearea Structurii de Rapoarte și Navigare"
  description="Folosește mkdir -p pentru a genera structura completă a folderelor de rapoarte și confirmă locația cu pwd."
  :initial-code="challenge1Initial"
  :test-cases="challenge1TestCases"
  :solution="challenge1Solution"
  hint="Scrie trei comenzi succesive: mkdir -p /home/qa-tester/reports/artifacts, urmat de cd /home/qa-tester/reports/artifacts și apoi pwd."
/>

---

### Provocarea 2: Backup de Configurare și Inițializarea Log-ului de Test
**Scenariu:** Înaintea execuției unui test de integrare, este critic să salvezi o copie a configurației serverului și să creezi fișierul în care vor fi scrise rezultatele.  
**Cerință:**  
1. Copiază fișierul `/app/config.json` în `/home/qa-tester/config_backup.json`.  
2. Creează un fișier gol numit `test_execution.log` în `/home/qa-tester`.

<LinuxTerminal
  challenge-id="linux-s1-c2"
  title="Provocarea 2: Backup de Configurare și Inițializare Log"
  description="Copiază fișierul de configurare și creează fișierul de log pentru testare."
  :initial-code="challenge2Initial"
  :test-cases="challenge2TestCases"
  :solution="challenge2Solution"
  hint="Folosește cp /app/config.json /home/qa-tester/config_backup.json, apoi touch /home/qa-tester/test_execution.log."
/>

