# Sesiunea 2: Structuri de Date & Controlul Fluxului în Python

::: info 🎯 Obiective de Învățare
La finalul acestei sesiuni, vei fi capabil să:
- Stăpânești cele **4 structuri de date esențiale din Python** (`list`, `tuple`, `dict`, `set`) și să știi exact când și cum să le folosești în arhitectura testelor automate.
- Parsezi, interoghezi și manipulezi structuri complexe JSON returnate de API-uri fără a genera erori la runtime (`KeyError`, `IndexError`).
- Utilizezi **tupluri imuabile** pentru seturi de date de test cu parametri multipli (`@pytest.mark.parametrize`) și coordonate de conexiune la baze de date.
- Folosești **seturi (sets)** pentru verificări de unicitate de performanță $O(1)$ și pentru aserțiuni rapide prin scăderi de mulțimi între elementele așteptate și cele afișate în UI.
- Scrii logică elegantă de control al fluxului bazată pe conceptul Python de **Truthiness**, operatori logici (`and`, `or`, `not`, `in`) și evaluări condiționate.
- Înlocuiești buclele stufoase cu expresii concise de tip **List și Dictionary Comprehension** pentru filtrarea și pregătirea rapidă a datelor de test.
- Rezolvi provocări practice de cod direct în compilatorul integrat din browser.
:::

---

## Capitolul 1: Cele 4 Structuri de Date Fundamentale în QA Automation 🗄️

::: info 🧠 Perspectivă
În testarea manuală, lucrezi cu tabele în Excel și răspunsuri JSON în Postman. În testarea automată, aceste date devin structuri dinamice în memoria scriptului Python: liste de rezultate ale căutării, dicționare reprezentând profile de utilizatori, tupluri cu parametri de configurare și seturi cu permisiuni unice. Alegerea corectă a colecției îți garantează viteză de execuție, cod curat și elimină aserțiunile instabile.
:::

```python
# O privire rapidă: Cum trăiesc cele 4 colecții în testele automate
medii_testare = ["staging", "uat", "production"]                  # list: ordonată & modificabilă (mutabilă)
coordonate_bd = ("db.test.local", 5432)                           # tuple: ordonat & imuabil (nu se schimbă)
payload_utilizator = {"id": 42, "role": "admin", "activ": True}   # dict: mapare cheie-valoare (JSON)
permisiuni_atribuite = {"read:reports", "write:tests", "run:ci"}  # set: unic & neordonat
```

---

### 1.1 Listele (`list`) — Secvențe Ordonate și Modificabile

O listă (`list`) este un tablou dinamic care păstrează ordinea de inserare. În QA Automation, listele reprezintă:
- Rândurile returnate dintr-un tabel HTML (`page.locator("tr").all()`).
- Cozi de ID-uri de utilizatori de procesat secvențial.
- Liste cu cazuri de test descoperite dinamic.

```python
# Declararea unei liste de teste smoke
teste_smoke = ["test_login", "test_checkout", "test_logout"]

# 1. Adăugarea de noi teste la suită
teste_smoke.append("test_resetare_parola")

# 2. Accesarea elementelor: Indexare de la zero și indexare negativă
primul_test = teste_smoke[0]    # 'test_login'
ultimul_test = teste_smoke[-1]  # 'test_resetare_parola' (ultimul element!)

# 3. Slicing (felii de date)
teste_cheie = teste_smoke[0:2]  # ['test_login', 'test_checkout']

# 4. Ștergerea sigură a elementelor
teste_smoke.remove("test_logout")
test_extras = teste_smoke.pop()  # Șterge și returnează ultimul element

# 5. Sortarea listelor
teste_smoke.sort()  # Ordine alfabetică
```

::: tip 💡 Bune Practici QA: Indexarea negativă pentru elemente dinamice
Când testezi pagini web cu paginare sau infinite scrolling, frecvent trebuie să verifici *ultimul* rând adăugat la baza tabelului. În loc să scrii calcule greoaie de lungime precum `randuri[len(randuri) - 1]`, folosește indexarea negativă nativă din Python: `ultimul_rand = randuri[-1]`.
:::

---

### 1.2 Tuplurile (`tuple`) — Contracte Imuabile

Un tuplu (`tuple`) este o colecție ordonată care **nu mai poate fi modificată** după creare (`imuabilitate`). Odată instanțiat, nu poți adăuga, șterge sau reasigna elemente.

De ce are nevoie un inginer de automatizare de imuabilitate?
- **Design Defensiv:** Nu vrei ca o funcție utilitară să altereze din greșeală coordonatele de conexiune sau endpoint-urile de bază.
- **Parametrizare în Pytest:** Tuplurile sunt structura standard de transmitere a perechilor de date de intrare și rezultate așteptate în `@pytest.mark.parametrize`.
- **Chei de dicționare:** Deoarece tuplurile sunt imuabile (și prin urmare hashable), ele pot fi folosite ca și chei compuse în dicționare, lucru imposibil pentru liste!

```python
# Coordonate fixe de server (host, port)
SERVER_STAGING = ("10.0.4.15", 8080)

# Deconstrucția (unpacking) elegantă a tuplurilor în variabile
host, port = SERVER_STAGING
print(f"Ne conectăm la {host} pe portul {port}...")

# Date de testare parametrizată pentru Pytest
scenarii_login = [
    ("utilizator_valid@qa.com", "Parola123!", 200),
    ("utilizator_blocat@qa.com", "Parola123!", 403),
    ("utilizator_invalid@qa.com", "Gresita", 401),
]

for email, parola, status_asteptat in scenarii_login:
    print(f"Testăm {email} -> ne așteptăm la HTTP {status_asteptat}")
```

---

### 1.3 Dicționarele (`dict`) — Inima Datelor de API

Dicționarul (`dict`) este regele necontestat al testării de backend. Orice endpoint REST API trimite și primește date în format JSON, care în Python devin instantaneu dicționare.

```python
# Răspunsul unui API reprezentat ca dicționar Python
raspuns_api = {
    "status": "success",
    "data": {
        "user_id": 9921,
        "username": "qa_master",
        "email": "master@qualiadept.ro",
        "roluri": ["tester", "admin"]
    },
    "meta": {
        "durata_cerere_ms": 48.2
    }
}

# 1. Accesarea valorilor imbricate
user_id = raspuns_api["data"]["user_id"]
rol_principal = raspuns_api["data"]["roluri"][0]

# 2. Acces defensiv cu .get() pentru a preveni căderea testului
avatar = raspuns_api["data"].get("avatar_url", "https://default.avatar/png")
camp_inexistent = raspuns_api.get("cheie_care_nu_exista")  # Returnează None în loc de eroare KeyError!

# 3. Iterarea cheilor și valorilor
for cheie, valoare in raspuns_api["data"].items():
    print(f"Câmpul '{cheie}' are valoarea '{valoare}'")
```

::: warning ⚠️ Capcana mortală `KeyError` în suitele automate
În testarea manuală, dacă un câmp lipsește dintr-un răspuns JSON, îl observi cu ochiul liber. În Python, dacă scrii `raspuns["user"]["token"]` iar câmpul `"token"` lipsește, Python aruncă instant o eroare fatală `KeyError`, prăbușind testul înainte ca aserțiunile tale să poată raporta un defect de business.  
**Folosește întotdeauna `.get(cheie, valoare_default)`** când validezi proprietăți opționale!
:::

---

### 1.4 Seturile (`set`) — Unicitate și Interogare Instantanee

Un set (`set`) este o colecție neordonată de elemente **unice**. Seturile elimină automat duplicatele și oferă verificări instantanee de apartenență $O(1)$ (`element in set`).

În QA Automation, seturile sunt ideale pentru:
- Detectarea duplicatelor (de exemplu, adrese de email duplicate la migrarea unei baze de date).
- Compararea permisiunilor așteptate vs. permisiunilor efective returnate de un serviciu IAM.
- Identificarea link-urilor lipsă dintr-un meniu prin scăderea mulțimilor.

```python
# 1. Eliminarea automată a duplicatelor
optiuni_dropdown = ["România", "Germania", "Franța", "România", "Germania", "Spania"]
tari_unice = set(optiuni_dropdown)
print(tari_unice)  # {'Franța', 'Germania', 'România', 'Spania'}

# 2. Operații de mulțimi folosite în aserțiuni
linkuri_asteptate = {"Acasă", "Cursuri", "Practică", "Profil", "Delogare"}
linkuri_afisate_ui = {"Acasă", "Cursuri", "Profil", "Delogare"}

# Scăderea de mulțimi: Ce linkuri lipsesc din interfață?
linkuri_lipsa = linkuri_asteptate - linkuri_afisate_ui
print(f"Elemente lipsă din navigare: {linkuri_lipsa}")  # {'Practică'}

# Intersecția: Ce elemente există în ambele seturi?
linkuri_comune = linkuri_asteptate & linkuri_afisate_ui
```

---

## Capitolul 2: Matricea de Decizie QualiAdept 🧭

Cum alegi structura de date potrivită pentru scenariul tău de testare?

| Structură | Sintaxă | Ordonată? | Mutabilă? | Permite Duplicate? | Rol Principal în QA Automation |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **Listă** (`list`) | `[1, 2, 3]` | ✅ Da | ✅ Da | ✅ Da | Rânduri de tabel web, rezultate căutare, liste de rulare a testelor. |
| **Tuplu** (`tuple`) | `(1, 2, 3)` | ✅ Da | ❌ Nu | ✅ Da | Cazuri de test parametrizate, coordonate DB, setări de bază imuabile. |
| **Dicționar** (`dict`) | `{"a": 1}` | ✅ Da* | ✅ Da | Chei: ❌ Nu<br>Valori: ✅ Da | Payload-uri de API, răspunsuri JSON, fișiere de mapare. |
| **Set** (`set`) | `{1, 2, 3}` | ❌ Nu | ✅ Da | ❌ Nu | Validarea unicității, detectarea permisiunilor lipsă, căutări rapide. |

*\* Notă: Începând cu Python 3.7+, dicționarele standard păstrează ordinea de inserare.*

::: tip 💡 Analogia QualiAdept din Viața Reală
- **Lista:** Lista de cumpărături la supermarket. Are o ordine precisă, poți tăia produse sau poți trece „Lapte” de două ori.
- **Tuplul:** Biletul de avion imprimat. Numele, locul și poarta de îmbarcare nu mai pot fi modificate după emitere.
- **Dicționarul:** Agenda telefonică. Cauți după numele persoanei (cheie unică) pentru a-i afla numărul (valoare).
- **Setul:** Lista de invitați VIP la un eveniment privat. Niciun nume nu poate fi de două ori, iar paza verifică dacă ești pe listă într-o fracțiune de secundă!
:::

---

## Capitolul 3: Controlul Fluxului & Operatori Logici 🔀

::: info 🧠 Perspectivă
Testarea automată este în esență luarea deciziilor: *Dacă statusul este 200, validăm datele; dacă statusul este 422, verificăm mesajul de eroare; altfel eșuăm testul imediat.* Înțelegerea evaluării condiționale din Python te scapă de aserțiuni false și face scripturile extrem de ușor de citit.
:::

### 3.1 Conceptul de Truthiness în Python

În Python, nu este nevoie să scrii `if len(rezultate) > 0:` sau `if token != "":`. Python evaluează direct colecțiile și variabilele în context boolean:

| Valori Falsy (evaluate la `False`) | Valori Truthy (evaluate la `True`) |
| :--- | :--- |
| `0`, `0.0` | Orice număr diferit de zero (`1`, `-5`, `3.14`) |
| `""` (șir de caractere gol) | Șiruri nevide (`"admin"`, `" "`) |
| `[]` (listă goală) | Liste cu cel puțin un element (`["valoare"]`) |
| `{}` (dicționar gol) | Dicționare cu date (`{"id": 1}`) |
| `set()` (set gol) | Seturi populate (`{"element"}`) |
| `None` | Orice referință activă de obiect |

```python
erori_inregistrate = []

# În loc de: if len(erori_inregistrate) == 0:
if not erori_inregistrate:
    print("Test Validat: Nu s-a înregistrat nicio eroare!")
else:
    print(f"Test Eșuat cu erorile: {erori_inregistrate}")
```

---

### 3.2 Operatori Logici: `and`, `or`, `not` și `in`

```python
status_code = 200
timp_raspuns_sec = 0.45
este_autentificat = True

# Combinarea condițiilor
if status_code == 200 and timp_raspuns_sec < 1.0:
    print("SLA-ul funcțional și de performanță este respectat!")

# Operatorul de apartenență 'in'
banner_eroare = "Cont blocat: Ai depășit numărul maxim de încercări (Cod: AUTH_09)"

if "blocat" in banner_eroare and "AUTH_09" in banner_eroare:
    print("Bannerul corect de securitate este afișat utilizatorului.")

roluri_permise = ["admin", "super_admin", "auditor"]
rol_curent = "tester"

if rol_curent not in roluri_permise:
    print(f"Acces restricționat conform specificațiilor pentru rolul: {rol_curent}")
```

---

## Capitolul 4: Bucle și List Comprehensions 🔁

### 4.1 Funcția `enumerate()` — Numerotarea iterațiilor în teste

Când iterezi peste rândurile unui tabel din browser, adesea ai nevoie de numărul rândului pentru a raporta *exact unde* a picat testul. Nu gestiona manual un contor (`i = 0 ... i += 1`). Folosește `enumerate()`:

```python
randuri_utilizatori = ["Ion Popescu - Activ", "Maria Ionescu - Inactiv", "George Radu - Activ"]

for index, rand in enumerate(randuri_utilizatori, start=1):
    print(f"Rândul #{index}: Se validează datele -> {rand}")
```

---

### 4.2 Funcția `zip()` — Compararea paralelă a colecțiilor

Când vrei să compari lista de antete așteptate cu lista celor citite din interfață:

```python
antete_asteptate = ["ID", "Client", "Sumă", "Status"]
antete_afisate = ["ID", "Client", "Total", "Status"]

for exp, act in zip(antete_asteptate, antete_afisate):
    assert exp == act, f"Neconcordanță antet! Așteptat: '{exp}', dar găsit: '{act}'"
```

---

### 4.3 List Comprehensions — Superputerea Pythonică în QA

Expresiile de tip *List Comprehension* îți permit să filtrezi și să transformi date într-o singură linie clară de cod. În QA, frecvent trebuie să extragi un anumit câmp dintr-o listă de dicționare primite de la backend:

```python
# Răspuns tipic de API: Listă de produse
produse_api = [
    {"id": 101, "nume": "Laptop Pro", "pret": 1200, "in_stoc": True},
    {"id": 102, "nume": "Mouse Wireless", "pret": 25, "in_stoc": False},
    {"id": 103, "nume": "Monitor 4K", "pret": 450, "in_stoc": True},
    {"id": 104, "nume": "Hub USB-C", "pret": 45, "in_stoc": True},
]

# 1. Varianta clasică lungă (4 linii)
nume_disponibile = []
for p in produse_api:
    if p["in_stoc"]:
        nume_disponibile.append(p["nume"])

# 2. Varianta modernă List Comprehension (1 linie!)
nume_disponibile = [p["nume"] for p in produse_api if p["in_stoc"]]
print(nume_disponibile)  # ['Laptop Pro', 'Monitor 4K', 'Hub USB-C']

# 3. Extragerea și filtrarea prețurilor mai mari de 50
preturi_mari = [p["pret"] for p in produse_api if p["pret"] > 50]
print(preturi_mari)  # [1200, 450]
```

---

## Capitolul 5: 🛡️ The Tester's Eye & AI Guardrails

::: info 🧠 Capcanele generate de AI în lucrul cu date
Modelele de inteligență artificială (ChatGPT, Copilot) sunt excelente la bucle de bază, dar introduc frecvent anti-pattern-uri subtile:
1. **Modificarea unei liste în timp ce o parcurgi:** AI scrie adesea `for x in lista: if conditie: lista.remove(x)`. Acest lucru sare peste elemente fără avertisment deoarece indecșii se decalează în timpul parcurgerii!
2. **Presupunerea că cheile există mereu (`KeyError`):** AI presupune că API-ul returnează întotdeauna schema ideală. Dacă backend-ul redenumește un câmp, testul se prăbușește fără o aserțiune utilă.
3. **Iluzia ordinii în seturi:** AI uită uneori că seturile nu sunt ordonate și încearcă să acceseze `list(my_set)[0]`, creând teste instabile (flaky).
:::

::: warning 🕵️ The Tester's Eye: Regula de Aur Defensivă
1. Nu modifica niciodată o listă în interiorul buclei care o parcurge — folosește o list comprehension pentru a crea o copie filtrată.
2. Folosește `.get(cheie)` cu valoare implicită când preiei câmpuri din payload-uri JSON.
3. Folosește seturile pentru unicitate și apartenență, dar nu te baza niciodată pe ordinea elementelor din ele.
:::

---

<script setup>
const challenge1Initial = `def filter_high_value_orders(orders: list, min_total: float) -> list:
    # TODO: 1. Filtrează comenzile care au statusul "completed" și total >= min_total
    # TODO: 2. Extrage ID-urile acestora ("order_id")
    # TODO: 3. Returnează lista de ID-uri sortată crescător numeric
    pass

# Rulare demonstrativă:
comenzi_test = [
    {"order_id": 501, "status": "completed", "total": 120.0},
    {"order_id": 502, "status": "pending", "total": 350.0},
    {"order_id": 503, "status": "completed", "total": 45.0},
    {"order_id": 504, "status": "completed", "total": 290.0},
]
print("Comenzi de valoare mare:", filter_high_value_orders(comenzi_test, 100.0))
`

const challenge1TestCases = [
  {
    name: "Filtrare comenzi finalizate peste pragul de 100 lei",
    call: `filter_high_value_orders([
      {"order_id": 1, "status": "completed", "total": 150.0},
      {"order_id": 2, "status": "pending", "total": 500.0},
      {"order_id": 3, "status": "completed", "total": 99.9},
      {"order_id": 4, "status": "completed", "total": 250.0}
    ], 100.0)`,
    expected: [1, 4]
  },
  {
    name: "Returnare listă goală dacă nicio comandă nu întrunește criteriul",
    call: `filter_high_value_orders([
      {"order_id": 10, "status": "failed", "total": 900.0},
      {"order_id": 11, "status": "cancelled", "total": 400.0}
    ], 50.0)`,
    expected: []
  },
  {
    name: "Asigurare sortare crescătoare a ID-urilor",
    call: `filter_high_value_orders([
      {"order_id": 99, "status": "completed", "total": 300.0},
      {"order_id": 12, "status": "completed", "total": 150.0},
      {"order_id": 55, "status": "completed", "total": 200.0}
    ], 100.0)`,
    expected: [12, 55, 99]
  }
]

const challenge1Solution = `def filter_high_value_orders(orders: list, min_total: float) -> list:
    matching_ids = [
        o["order_id"]
        for o in orders
        if o.get("status") == "completed" and o.get("total", 0.0) >= min_total
    ]
    return sorted(matching_ids)
`

const challenge2Initial = `def find_user_discrepancies(primary_users: list, secondary_users: list) -> dict:
    # TODO: 1. Identifică utilizatorii prezenți în primary_users dar absenți din secondary_users
    # TODO: 2. Identifică numele de utilizator duplicate din secondary_users
    # TODO: 3. Returnează un dicționar cu cheile:
    #          "missing_in_secondary": listă sortată cu utilizatorii lipsă
    #          "duplicates_in_secondary": listă sortată cu utilizatorii duplicați
    pass

# Rulare demonstrativă:
primary = ["alice", "bob", "charlie", "david"]
secondary = ["alice", "bob", "bob", "eve", "charlie", "charlie"]
print("Discrepanțe identificate:", find_user_discrepancies(primary, secondary))
`

const challenge2TestCases = [
  {
    name: "Detectare utilizatori lipsă și duplicate",
    call: `find_user_discrepancies(
      ["alice", "bob", "charlie", "david"],
      ["alice", "bob", "bob", "eve", "charlie", "charlie"]
    )`,
    expected: {
      "missing_in_secondary": ["david"],
      "duplicates_in_secondary": ["bob", "charlie"]
    }
  },
  {
    name: "Sincronizare perfectă fără utilizatori lipsă sau duplicate",
    call: `find_user_discrepancies(
      ["user1", "user2"],
      ["user1", "user2"]
    )`,
    expected: {
      "missing_in_secondary": [],
      "duplicates_in_secondary": []
    }
  },
  {
    name: "Discrepanță totală între microservicii",
    call: `find_user_discrepancies(
      ["alpha", "beta"],
      ["gamma", "delta", "gamma"]
    )`,
    expected: {
      "missing_in_secondary": ["alpha", "beta"],
      "duplicates_in_secondary": ["gamma"]
    }
  }
]

const challenge2Solution = `def find_user_discrepancies(primary_users: list, secondary_users: list) -> dict:
    primary_set = set(primary_users)
    secondary_set = set(secondary_users)
    
    missing = sorted(list(primary_set - secondary_set))
    
    seen = set()
    duplicates = set()
    for user in secondary_users:
        if user in seen:
            duplicates.add(user)
        else:
            seen.add(user)
            
    return {
        "missing_in_secondary": missing,
        "duplicates_in_secondary": sorted(list(duplicates))
    }
`
</script>

## Capitolul 6: 💻 Provocări Interactive în Compilator

Testează și aprofundează structurile de date și controlul fluxului direct în compilatorul integrat din browser.

### Provocarea 1: Filtrarea și Sortarea Comenzilor de Valoare Mare
**Scenariu:** Un API de E-commerce returnează o listă de comenzi. Ai nevoie să extragi toate comenzile finalizate cu valoare mare.  
**Cerință:** Completează `filter_high_value_orders(orders, min_total)` pentru a returna o listă sortată de `order_id`-uri unde `status == "completed"` și `total >= min_total`.

<PythonCompiler
  challenge-id="py-s2-c1"
  title="Provocarea 1: Filtrarea Comenzilor de Valoare Mare"
  description="Folosește list comprehensions, filtrarea din dicționare și sortarea pentru extragerea ID-urilor valide."
  :initial-code="challenge1Initial"
  :test-cases="challenge1TestCases"
  :solution="challenge1Solution"
  hint="Folosește o list comprehension: [o['order_id'] for o in orders if o.get('status') == 'completed' and o.get('total', 0) >= min_total], apoi aplică sorted()."
/>

---

### Provocarea 2: Detectarea Anomaliilor de Sincronizare a Datelor
**Scenariu:** Validezi sincronizarea conturilor între două servicii. Serviciul secundar trebuie să conțină toți utilizatorii din serviciul primar, fără duplicate.  
**Cerință:** Implementează `find_user_discrepancies(primary_users, secondary_users)` care returnează un dicționar cu `"missing_in_secondary"` (utilizatori din primar care lipsesc din secundar) și `"duplicates_in_secondary"` (utilizatori care apar de mai multe ori în secundar).

<PythonCompiler
  challenge-id="py-s2-c2"
  title="Provocarea 2: Detectarea Anomaliilor de Sincronizare"
  description="Aplică operații pe seturi și mecanisme de frecvență pentru detectarea anomaliilor de sincronizare."
  :initial-code="challenge2Initial"
  :test-cases="challenge2TestCases"
  :solution="challenge2Solution"
  hint="Folosește set(primary) - set(secondary) pentru utilizatorii lipsă. Pentru duplicate, ține evidența unui set 'seen' în timpul parcurgerii listei secundare."
/>
