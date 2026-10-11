# Sesiunea 1: Primii Pași în Python & Tipuri de Date Fundamentale

::: info 🎯 Obiective de Învățare
La finalul acestei sesiuni, vei fi capabil să:
- Înțelegi de ce **Python** este limbajul favorit pentru crearea rapidă de framework-uri de testare automate.
- Lucrezi cu tipurile primitive de date (`str`, `int`, `float`, `bool`) și să eviți erorile subtile de tipizare în aserțiuni.
- Aplici tehnici chirurgicale de **manipulare a șirurilor de caractere** (slicing, f-strings, strip, split, replace) pe date extrase din DOM și API-uri.
- Folosești expresii regulate (`re`) pentru a extrage token-uri de autentificare și coduri de stare din răspunsurile serverului.
- Aplici gândirea critică de Software Tester pentru a depăși capcanele codului generat de AI.
- Rezolvi provocări practice de cod direct în compilatorul integrat din browser.
:::

---

## Capitolul 1: De ce Python în QA Automation? 🐍

::: info 🧠 Perspectivă
În ingineria calității software, timpul necesar pentru a scrie, citi și întreține un test este la fel de critic ca viteza de execuție. Un test scris într-un limbaj stufos, plin de zgomot sintactic, devine rapid o povară imposibil de menținut. Python a cucerit industria de QA tocmai pentru că elimină barierele dintre ideea de test și execuția ei.
:::

### 1.1 Pythonic Code — De ce codul arată ca limba engleză

În timp ce alte limbaje impun mult cod boilerplate (declarații lungi de tipuri, clase obligatorii și configurări rigide chiar și pentru cel mai simplu script), Python se remarcă prin principiile din **Zen of Python**:
- *„Readability counts”* (Lizibilitatea contează).
- *„Simple is better than complex”* (Simplu este mai bun decât complex).

Codul Python se citește aproape ca limba engleză vorbită. Acest lucru face scenariile de testare transparente și ușor de auditat nu doar de către dezvoltatori, ci și de către colegii de QA Manual, Product Owners sau Business Analysts.

```python
# Exemplu rapid: Verificarea unui endpoint de API în Python
import requests

response = requests.get("https://api.github.com")
assert response.status_code == 200
print("API-ul funcționează impecabil!")
```

În doar 4 linii clare ai un test automat de API complet funcțional.

### 1.2 Ecosistemul de Aur pentru Testare

1. **Test Runner de clasă mondială:** Biblioteca `pytest` este considerată standardul de aur în industrie datorită sistemului modular de fixtures, parametrizării elegante și aserțiunilor native fără metode redundante.
2. **Automatizare Web modernă:** Suport nativ de primă clasă pentru `Playwright` și `Selenium`, permițând scrierea de teste end-to-end rapide și rezistente la instabilitate (flakiness).
3. **Automatizare API & Mocking:** Cu biblioteci precum `requests` și `httpx`, testarea contractelor API și verificarea răspunsurilor JSON devin operațiuni de câteva minute.

::: tip 💡 Analogia QualiAdept: Engleza colocvială vs. Latina medievală
Gândește-te la modul în care comunici o sarcină simplă:
- În **Java**, pentru a verifica un simplu text, trebuie să construiești o catedrală: declari o clasă publică, o metodă statică, declari tipurile fiecărei variabile și imporți clase utilitare greoaie — este ca și cum ai scrie un act notarial în latina medievală doar pentru a cere o cafea.
- În **Python**, spui pur și simplu: `if "Success" in response.text: print("Valid!")`. Este ca engleza simplă și directă: toată lumea înțelege intenția instantaneu, iar riscul de a introduce bug-uri chiar în codul de testare scade dramatic!
:::

::: tip 💡 Știați că...?
- **Originea numelui:** Python nu a fost denumit după faimoasa reptilă, ci după trupa britanică de comedie suprarealistă **Monty Python's Flying Circus**! Creatorul său, Guido van Rossum, a dorit un limbaj care să fie distractiv, concis și plăcut la citire.
- **Folosirea în misiuni critice:** La **NASA**, scripturile Python automatizează verificările telemetrice ale rachetelor înainte de lansare. La **Netflix**, Python este coloana vertebrală din spatele instrumentelor de Chaos Engineering care testează rezistența infrastructurii de streaming la căderi neașteptate.
:::

---

## Capitolul 2: Variabile, Memorie și Tipurile Primitive de Date 🧱

::: info 🧠 Perspectivă
La baza oricărui sistem software stau datele brute: prețul unui abonament, un ID de sesiune, un timp de răspuns sau un indicator de autentificare. Înțelegerea profundă a modului în care Python stochează și compară aceste valori este primul pas pentru a deveni un inginer QA redutabil.
:::

Python este un limbaj cu **tipizare dinamică** și **puternică**:
- **Dinamică:** Nu este nevoie să declari tipul variabilei în mod explicit (nu scrii `int status = 200`). Interpretul deduce tipul automat la rulare.
- **Puternică (Strong Typing):** Python refuză să facă conversii riscante între tipuri incompatibile. Operația `"200" + 5` va arunca imediat o excepție `TypeError`, spre deosebire de limbaje cu tipizare slabă (precum JavaScript) care ar produce în mod periculos șirul `"2005"`.

### 2.1 Cele 4 Tipuri Primitive Fundamentale

```python
# 1. Șiruri de caractere (Strings - str)
endpoint = "/api/v1/orders"
auth_scheme = "Bearer"

# 2. Numere întregi (Integers - int)
expected_status = 200
retry_count = 3

# 3. Numere cu virgulă mobilă (Floats - float)
response_time_seconds = 0.425
threshold_limit = 1.50

# 4. Valori booleene (Booleans - bool)
is_authenticated = True
has_errors = False
```

### 2.2 Conceptul de Truthy și Falsy

În Python, orice valoare poate fi evaluată într-un context boolean (de exemplu, într-o clauză `if`). Anumite valori sunt considerate automat **Falsy**:
- `None` (absența oricărei valori)
- `False`
- `0`, `0.0`
- Colecții sau texte goale: `""`, `[]`, `()`, `{}`

Orice altceva este considerat **Truthy** (inclusiv textul care conține un spațiu `" "` sau numărul `-1`).

### 2.3 Conversii de Tip (Type Casting)

În testare, datele extrase din interfața grafică (DOM) sau din fișiere CSV sosesc întotdeauna ca șiruri de caractere (`str`), chiar dacă reprezintă numere sau valori logice:

```python
# Date brute extrase din UI:
raw_price = "149.99"
raw_quantity = "3"

# Conversie explicită:
unit_price = float(raw_price)   # 149.99 (float)
quantity = int(raw_quantity)    # 3 (int)
total = unit_price * quantity   # 449.97 (float)
```

::: tip 💡 Analogia QualiAdept: Cutia de unelte cu etichete mobile
În limbajele statice (precum C++ sau Java), o variabilă este o cutie turnată din fontă: dacă este ștanțată cu eticheta „Numere Întregi”, nu poți pune niciodată un text în ea fără să spargi cutia.

În **Python**, o variabilă este doar o etichetă din hârtie lipită temporar pe un obiect din memorie. Numele `status` este lipit acum pe obiectul `200`. Dacă dorești, poți dezlipi eticheta `status` și o poți lipi pe șirul `"OK"`. Totuși, obiectul în sine își cunoaște cu strictețe natura: nu poți forța numărul să se comporte ca un text fără o transformare conștientă.
:::

::: warning 🕵️ Ochiul de Tester: Capcanele tipizării dinamice și iluzia egalității
Bug-urile cele mai periculoase din testele automate se nasc din presupuneri greșite despre tipuri:

* **Iluzia egalității `"200" == 200`:**
  În Python, expresia `"200" == 200` returnează **`False`**! Dacă extragi statusul dintr-un atribut HTML (care vine ca `"200"`) și faci `assert actual_status == 200`, testul tău va eșua pe nedrept (False Failure), generând panică în echipa de dezvoltare.
* **Capcana numerelor cu virgulă mobilă (Floating Point Trap):**
  Încearcă să calculezi în Python: `0.1 + 0.2 == 0.3`. Rezultatul este uluitor: **`False`**!  
  Din cauza modului în care procesoarele reprezintă fracțiile zecimale în baza 2 (standardul IEEE 754), `0.1 + 0.2` este de fapt `0.30000000000000004`.  
  *Regula de aur pentru QA:* Când asertezi prețuri, comisioane sau rate de conversie, nu folosi niciodată egalitate strictă `==` pe `float`! Folosește `round(total, 2) == 0.3` sau funcția dedicată `math.isclose(a, b, abs_tol=1e-5)`.
* **Capcana conversiei `bool("False")`:**
  Dacă un query param din URL este `"false"` și încerci să-l convertești cu `bool("False")`, rezultatul este **`True`**! În Python, orice șir nevid este considerat `True`. Singurul șir care produce `False` este șirul gol `""`.
:::

::: info 🧪 Exercițiu de reflexie: Capcana lui bool() în API-uri
Imaginează-ți că testezi un API de plăți unde un parametru opțional din URL este `?is_discount_applied=false`.  
Un dezvoltator junior a scris în codul de backend:
```python
is_discount = bool(request.query_params.get("is_discount_applied"))
```
*De ce toți clienții magazinului vor primi discount gratuit, chiar dacă parametrul a fost trimis explicit cu valoarea `false`? Cum ai testa acest scenariu din perspectiva unui QA Engineer?*
:::

---

## Capitolul 3: Manipularea Textului (Strings) și Regex în Testarea Reală 🔍

::: info 🧠 Perspectivă
Peste 80% din activitatea unui inginer de automatizare implică parsarea textului: curățarea textelor cu spații din pagini web, izolarea token-urilor JWT din antete HTTP, formatarea selectorilor XPath dinamici și validarea rapoartelor de log.
:::

### 3.1 Slicing și Indexare

Șirurile de caractere sunt secvențe ordonate și imutabile. Fiecare caracter are un index de la `0` la `N - 1`, dar și un index negativ pornind de la dreapta (`-1` este ultimul caracter):

```python
status_code_raw = "STATUS:503_SERVICE_UNAVAILABLE"

# Indexare
first_char = status_code_raw[0]    # 'S'
last_char = status_code_raw[-1]     # 'E'

# Slicing: [start : stop : pas]
code = status_code_raw[7:10]        # '503'
prefix = status_code_raw[:6]        # 'STATUS'
```

### 3.2 F-Strings (Formatarea Modernă)

`f-strings` reprezintă modul recomandat și cel mai performant de a compune mesaje și URL-uri dinamice în testele moderne de Python:

```python
env = "staging"
user_id = 9481
test_run_id = "RUN-2026-X"

# Construirea dinamică a URL-ului și a mesajului de log
target_url = f"https://{env}.qualiadept.eu/api/users/{user_id}/orders"
log_entry = f"[{test_run_id}] Trimitere request către {target_url}"
```

### 3.3 Curățarea Datelor din DOM: `strip()`, `replace()`, `split()`

Elementele din paginile web extrase cu Selenium sau Playwright conțin frecvent caractere invizibile, spații albe sau simboluri valutare care împiedică aserțiunile:

```python
raw_dom_text = "   \n Total Plată: $1,450.00 RON \t "

# 1. strip() elimină spațiile albe, caracterele newline (\n) și tab-urile (\t)
trimmed_text = raw_dom_text.strip() # "Total Plată: $1,450.00 RON"

# 2. replace() elimină simbolurile nedorite și normalizează separatorii
numeric_part = trimmed_text.replace("Total Plată: $", "").replace(" RON", "").replace(",", "")
total_val = float(numeric_part)     # 1450.0

# 3. split() împarte textul după un separator
parts = trimmed_text.split(": ")    # ['Total Plată', '$1,450.00 RON']
```

### 3.4 Expresii Regulate (`re`) pentru Validarea Răspunsurilor

Când un text nu are o lungime fixă (de exemplu, un ID de sesiune generat dinamic), folosim expresii regulate:

```python
import re

log_message = "2026-10-11 [INFO] Utilizatorul 741 a generat tranzacția TXN-984211 cu succes."

# Căutăm tiparul TXN- urmat de cifre
match = re.search(r"TXN-\d+", log_message)
if match:
    transaction_id = match.group(0) # "TXN-984211"
    print(f"ID Tranzacție extras: {transaction_id}")
```

::: tip 💡 Analogia QualiAdept: Șirul de caractere ca o bandă de bagaje din aeroport
Imaginează-ți un șir de caractere ca pe banda rulantă de la aeroport unde sosesc valizele pasagerilor:
- Indexul `[0]` este prima valiză care apare pe bandă.
- Indexul `[-1]` este ultima valiză aflată la coadă, fără să trebuiască să le numeri pe toate cele dinaintea ei.
- Slicing-ul `[2:5]` este ca un inspector vamal care oprește doar valizele din pozițiile 2, 3 și 4 pentru scanare.
- Iar funcția `.strip()` este personalul de curățenie care aruncă praful și etichetele rupte de la capetele benzii, lăsând conținutul curat gata de procesare!
:::

::: warning 🕵️ Ochiul de Tester: Capcanele caracterelor invizibile din DOM
De ce pică testele automate în CI/CD când pe ecranul testerului totul pare corect?

* **Spațiul alb non-breaking (`\u00a0`):**
  În HTML, spațiul dintre un număr și o monedă (ex: `100 RON`) este adesea randat ca `&nbsp;` (`\u00a0`) pentru a preveni ruperea textului pe două rânduri.  
  Dacă în testul tău Python verifici `assert element.text == "100 RON"`, aserțiunea va pica cu un mesaj de eroare confuz, deoarece spațiul normal de la tastatură (ASCII 32) nu este identic cu `\u00a0` (ASCII 160)!  
  *Soluție:* Folosește `element.text.replace('\u00a0', ' ').strip()`.
* **Regex „Lacom” (Greedy) vs. „Modest” (Non-Greedy):**
  Dacă ai un mesaj de tipul `[TAG: A] alt text [TAG: B]` și cauți cu `r"\[TAG: (.*)\]"`, regex-ul lacom va potrivi de la primul paranteză până la ultima paranteză din tot textul (`A] alt text [TAG: B`).  
  Pentru a extrage doar primul tag, folosește varianta lazy `.*?` sau setul negat `r"\[TAG: ([^\]]+)\]"`.
:::

::: info 🧪 Exercițiu de reflexie: Diacritice și Encoding UTF-8
Ce se întâmplă dacă un sistem de raportare automată extrage numele unui utilizator cu diacritice românești (`"Ștefan Țăranu"`) și încearcă să calculeze lungimea numelui cu `len()`? Ocupă litera `Ș` mai multe caractere în Python 3 față de Python 2? De ce alegerea Python 3 a salvat industria de QA de coșmarul numit *Mojibake*?
:::

---

## Capitolul 4: 📖 Povestea Aplicată: Când o conversie de tip distruge un sistem de milioane de dolari 💸

::: tip 📖 Povestea aplicată: Dezastrul Knight Capital și incidentul medical CSV din Marea Britanie
Dezvoltatorii tind să presupună scenariul ideal: că datele introduse sunt întotdeauna valide, că numerele nu depășesc limitele și că utilizatorii respectă formatele cerute. În lumea reală, calitatea software-ului se măsoară la contactul cu haosul.

#### 1. Colapsul Knight Capital — 440 de milioane de dolari în 45 de minute (2012)
Pe 1 august 2012, firma americană de tranzacționare financiară Knight Capital a activat un nou modul software de rutare a ordinelor bursiere. Dintr-o neatenție la deploy, noul cod a reutilizat un parametru numeric mai vechi (un flag numeric intern care în versiunea anterioară activa un mod de testare nesfârșit).  
Când sistemul a pornit, serverele au interpretat valoarea numerică ca o instrucțiune de a cumpăra continuu acțiuni la preț mare și de a le vinde la preț mic. În doar 45 de minute, compania a efectuat milioane de tranzacții eronate, acumulând o pierdere catastrofală de **440 de milioane de dolari** și intrând în faliment câteva zile mai târziu. Un simplu test automat de regresie care să verifice flag-ul și starea contului ar fi oprit dezastrul în secunda 1.

#### 2. Incidentul celor 16.000 de cazuri COVID pierdute în Marea Britanie (2020)
În toamna anului 2020, autoritățile sanitare britanice au constatat cu stupoare că peste 16.000 de pacienți confirmați pozitiv nu fuseseră contactați pentru ancheta epidemiologică.  
Cauza tehnică? Laboratoarele trimiteau datele în format CSV, dar sistemul automatizat de procesare importa datele într-un fișier Excel vechi în format `.XLS`. Formatul vechi accepta o limită strictă de **65.536 de rânduri** (limita pe 16 biți a unui fișier Excel tradițional). Orice rând care depășea această graniță era ignorat silențios, fără nicio eroare explicită!  
Un inginer de testare pregătit pe tehnica **Boundary Value Analysis (BVA)** ar fi testat imediat comportamentul sistemului la 65.535, 65.536 și 100.000 de înregistrări, prevenind o criză sanitară națională.
:::

---

## Capitolul 5: 🤖 Cum putem supraviețui AI-ului? (AI vs. QA Automation) 🛡️

::: danger 🤖 Cum putem supraviețui AI-ului? De ce GenAI nu poate înlocui gândirea critică de tester
Astăzi, oricine poate deschide ChatGPT, Copilot sau Claude și poate scrie un prompt simplu:  
*„Scrie-mi un script Python care testează un formular de autentificare.”*  
În 3 secunde, AI-ul generează un cod cu o sintaxă impecabilă, frumos indentat și cu comentarii elegante. Dacă AI-ul scrie cod atât de repede, de ce nu sunt testerii de automatizare concediați?

Răspunsul este simplu: **AI-ul produce sintaxă, dar nu înțelege realitatea.**

#### 1. Halucinația de Aserțiune (The False Positive Trap)
Modelele LLM sunt proiectate să ofere răspunsuri plăcute și conforme cu așteptările statistice. Atunci când generează teste, AI-ul creează adesea aserțiuni banale sau tautologice:
```python
# Cod tipic generat neglijent de AI:
response = client.post("/api/login", json=payload)
assert response.status_code is not None  # Testul trece ÎNTOTDEAUNA, chiar dacă serverul a crăpat!
assert "token" in response.text          # Dar dacă textul este "token invalid"? Testul tot va trece!
```
Testele generate de AI trec adesea cu brio atunci când sistemul este defect, creând o iluzie periculoasă de calitate.

#### 2. Absența instinctului adversar (Lipsește Ochiul de Tester)
AI-ul este antrenat pe milioane de exemple convenționale („Happy Path”). El testează utilizatorul model care introduce un email corect și o parolă sigură.  
Un Software Tester uman de elită este plătit tocmai pentru că **gândește ca un atacator și ca haosul**:
- Ce se întâmplă dacă parola conține 10.000 de caractere chinezești?
- Ce se întâmplă dacă utilizatorul dă dublu-click pe butonul de plată într-un interval de 5 milisecunde?
- Ce se întâmplă dacă conexiunea la baza de date are un timeout de rețea la jumătatea tranzacției?

#### 3. Formula Supraviețuirii: Devino „AI Supervisor” și Verificator Determinist
Nu te lupta cu inteligența artificială încercând să tastezi mai repede decât ea. Folosește AI-ul ca pe un asistent junior capabil de viteză mare, dar aplică-ți expertiza de QA pentru a-l superviza:
- **Auditează aserțiunile:** Verifică dacă fiecare aserțiune este deterministă și strictă.
- **Injectează defecte intenționate (Mutation Testing):** Schimbă intenționat codul aplicației pentru a vedea dacă testul pică! Dacă testul nu eșuează când aplicația este stricată, testul este inutil.
- **Stăpânește fundamentele de Python:** Când știi exact cum funcționează tipurile de date, excepțiile și manipularea memoriei, poți detecta în 10 secunde o halucinație ascunsă într-un script de 200 de linii generat de AI.
:::

::: warning 🕵️ Ochiul de Tester: Regula de aur a codului asistat de AI
*„Dacă nu poți explica fără ezitare fiecare rând de cod pe care AI-ul l-a generat, nu ai voie să îl incluzi în repository-ul de teste al echipei.”*

Un test automat pe care nu îl stăpânești până la ultimul caracter este mai dăunător decât absența oricărui test, deoarece conferă o falsă siguranță întregii echipe de ingineri!
:::

---

<script setup>
const challenge1Initial = `def parse_cart_price(raw_text: str) -> float:
    # TODO: 1. Curăță spațiile cu strip()
    # TODO: 2. Elimină prefixul "Preț Total: " și sufixul " RON"
    # TODO: 3. Înlocuiește separatorul de mii "." și schimbă virgula "," în punct "."
    # TODO: 4. Convertește și returnează ca float
    pass

# Rulare de verificare:
test_sample = "  Preț Total: 2.450,50 RON \\n"
print("Rezultatul funcției tale:", parse_cart_price(test_sample))
`

const challenge1TestCases = [
  {
    name: "Preț cu mii și zecimale",
    call: "parse_cart_price('  Preț Total: 2.450,50 RON \\n')",
    expected: 2450.50
  },
  {
    name: "Preț simplu fără mii",
    call: "parse_cart_price('Preț Total: 99,99 RON')",
    expected: 99.99
  },
  {
    name: "Sumă mare rotunjită",
    call: "parse_cart_price('   Preț Total: 10.000,00 RON  ')",
    expected: 10000.0
  }
]

const challenge1Solution = `def parse_cart_price(raw_text: str) -> float:
    cleaned = raw_text.strip().replace("Preț Total: ", "").replace(" RON", "")
    normalized = cleaned.replace(".", "").replace(",", ".")
    return float(normalized)
`

const challenge2Initial = `import re

def extract_auth_token(email_body: str) -> str:
    # TODO: Folosește re.search() pentru a găsi pattern-ul [AUTH-TOKEN: ...]
    # TODO: Extrage și returnează doar codul din interior
    pass

sample_email = "Activează contul tău folosind codul de securitate: [AUTH-TOKEN: 894-321-AB] valabil 15 minute."
print("Token extras:", extract_auth_token(sample_email))
`

const challenge2TestCases = [
  {
    name: "Extragere token standard",
    call: "extract_auth_token('Activează contul tău folosind codul de securitate: [AUTH-TOKEN: 894-321-AB] valabil 15 minute.')",
    expected: "894-321-AB"
  },
  {
    name: "Token cu spații suplimentare",
    call: "extract_auth_token('Codul tău de autentificare este [AUTH-TOKEN:  XYZ-999-QA  ]. Nu îl împărtăși.')",
    expected: "XYZ-999-QA"
  },
  {
    name: "Mesaj fără token (caz negativ)",
    call: "extract_auth_token('Mesaj de confirmare fără niciun token atașat.')",
    expected: ""
  }
]

const challenge2Solution = `import re

def extract_auth_token(email_body: str) -> str:
    match = re.search(r"\\[AUTH-TOKEN:\\s*([^\\]]+)\\]", email_body)
    if match:
        return match.group(1).strip()
    return ""
`
</script>

## Capitolul 6: 💻 Provocări Practice de Cod (Compiler Challenges)

Poți scrie, rula și verifica soluția **direct în browser** folosind compilatorul interactiv de mai jos. Codul tău și starea de finalizare se salvează automat.

### Provocarea 1: Curățarea și Validarea Prețului din Coș
**Scenariu:** Un test Selenium a extras din coșul de cumpărături textul brut `"  Preț Total: 2.450,50 RON \n"`.  
**Cerință:** Completează funcția Python `parse_cart_price(raw_text)` pentru a returna valoarea numerică de tip `float` (`2450.50`).

<PythonCompiler
  challenge-id="py-s1-c1"
  title="Provocarea 1: Curățarea și Validarea Prețului din Coș"
  description="Scrie logica pentru curățarea textului extras din DOM și conversia lui la tip float pentru asertări automate."
  :initial-code="challenge1Initial"
  :test-cases="challenge1TestCases"
  :solution="challenge1Solution"
  hint="Folosește .strip(), elimină prefixul și sufixul, apoi elimină punctele '.' și înlocuiește virgula ',' cu punct '.' înainte de float()."
/>

---

### Provocarea 2: Extragerea Token-ului de Confirmare
**Scenariu:** La înregistrarea unui utilizator, serverul trimite un email simulat cu conținutul:  
`"Activează contul tău folosind codul de securitate: [AUTH-TOKEN: 894-321-AB] valabil 15 minute."`  
**Cerință:** Scrie o funcție `extract_auth_token(email_body)` care returnează codul curat (`"894-321-AB"`).

<PythonCompiler
  challenge-id="py-s1-c2"
  title="Provocarea 2: Extragerea Token-ului de Confirmare"
  description="Folosește modulul re pentru a extrage token-ul din interiorul marcajului [AUTH-TOKEN: ...]."
  :initial-code="challenge2Initial"
  :test-cases="challenge2TestCases"
  :solution="challenge2Solution"
  hint="Folosește re.search cu un grup de captură: r'\\[AUTH-TOKEN:\\s*([^\\]]+)\\]' și apelează .strip() pe grupul extras."
/>
