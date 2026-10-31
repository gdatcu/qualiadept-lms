# Sesiunea 3: Funcții, Gestionarea Erorilor & Fișiere (I/O) în Testare

::: info 🎯 Obiective de Învățare
La finalul acestei sesiuni, vei fi capabil să:
- Structurezi cod modular și reutilizabil prin **funcții Python idiomatice** (`def`), utilizând parametri opționali, valori implicite, `*args` și `**kwargs`.
- Aplici **Type Hints (`typing`)** pentru a asigura claritatea contractelor de date între pașii de testare și pentru a beneficia de autocompletare completă în IDE.
- Înțelegi și eviți capcana critică a **argumentelor implicite mutabile** (`mutable default arguments`), un bug subtil care compromite des suitele de testare.
- Construiești suite de testare reziliente folosind mecanismul robust de **gestionare a excepțiilor** (`try`, `except`, `else`, `finally`, `raise`).
- Creezi **clase de excepții personalizate** dedicate framework-ului de testare pentru a diferenția defectele reale ale aplicației de erorile de infrastructură.
- Manipulezi date externe de test prin **Context Managers (`with open(...)`)** pentru fișiere text, CSV și JSON (`json.loads`, `json.dumps`).
- Utilizezi biblioteca modernă `pathlib.Path` pentru gestionarea căilor de fișiere compatibile cross-platform (Windows, macOS, containere Docker și Linux CI).
- Rezolvi provocări practice de cod direct în compilatorul integrat din browser.
:::

---

## Capitolul 1: Anatomia Funcțiilor Reutilizabile în Testare ⚙️

::: info 🧠 Perspectivă
În testarea manuală, dacă trebuie să parcurgi 10 pași repetitivi pentru a crea un cont de utilizator înaintea fiecărui caz de test, pierzi timp prețios. În testarea automată, dacă copiezi și lipești aceleași 15 linii de cod în fiecare test, creezi o bombă cu ceas: în momentul în care un selector sau un câmp din API se modifică, va trebui să corectezi zeci de fișiere. Funcțiile sunt cărămizile fundamentale care transformă pașii manuali în acțiuni modulare, sigure și ușor de întreținut.
:::

O funcție în Python este un bloc organizat și reutilizabil de cod, definit prin cuvântul cheie `def`, urmat de numele funcției, o listă de parametri între paranteze rotunde și două puncte (`:`).

```python
# O funcție simplă de aserțiune pentru timpii de răspuns
def assert_response_sla(duration_seconds: float, max_threshold: float = 1.0) -> None:
    """Validează dacă durata unei cereri se încadrează în SLA-ul de performanță."""
    assert duration_seconds <= max_threshold, (
        f"SLA Depășit! Răspunsul a durat {duration_seconds:.2f}s "
        f"(limita admisă: {max_threshold:.2f}s)"
    )

# Apelare simplă:
assert_response_sla(0.42)           # Folosește pragul implicit de 1.0s
assert_response_sla(1.85, 2.0)      # Suprascrie pragul la 2.0s
```

---

### 1.1 Parametri Poziționali vs. Parametri Numiți (Keyword Arguments)

În Python, parametrii pot fi transmiși fie în funcție de poziția lor, fie specificându-le numele explicit (`nume_parametru=valoare`).

```python
def build_auth_header(token: str, token_type: str = "Bearer", prefix_env: str = "PROD") -> dict:
    return {
        "Authorization": f"{token_type} {token}",
        "X-Environment-Tag": prefix_env
    }

# 1. Apel pozițional (ordinea contează)
header1 = build_auth_header("xyz-secret-token", "ApiKey", "STAGING")

# 2. Apel prin cuvinte cheie (lizibil și flexibil, ordinea nu contează)
header2 = build_auth_header(
    prefix_env="DEV",
    token="abc-admin-key",
    token_type="Bearer"
)

# 3. Folosirea valorilor implicite
header3 = build_auth_header("standard-token")
# Rezultat: {'Authorization': 'Bearer standard-token', 'X-Environment-Tag': 'PROD'}
```

::: tip 💡 Bune Practici în QA: Numește explicit parametrii în teste!
Când citești un raport de testare sau revizuiești un Pull Request, o linie precum:  
`create_order("cart_99", 5, True, False, 120.0)` este obscură. Ce înseamnă `True`? Ce înseamnă `False`?  
Scrierea cu argumente numite:  
`create_order(cart_id="cart_99", items_count=5, apply_discount=True, express_delivery=False, total_price=120.0)`  
face scenariul de testare auto-documentat și transparent pentru întreaga echipă.
:::

---

### 1.2 Capcana Mortală: Argumente Implicite Mutabile (`Mutable Default Arguments`)

Aceasta este una dintre cele mai frecvente erori întâlnite în codul scris de testeri începători (și generat adesea de asistenți AI neatenți).

::: danger 🛑 Capcana: Liste sau Dicționare ca Valori Implicite
În Python, valorile implicite ale parametrilor sunt evaluate o **singură dată**, în momentul în care funcția este definită de interpret, **NU** la fiecare apel al funcției! Dacă folosești o listă `[]` sau un dicționar `{}` ca valoare implicită, toți apelanții care omit parametrul vor împărți **aceeași instanță de memorie**!
:::

```python
# ❌ GREȘIT: Toate testele vor polua aceeași listă partajată!
def register_test_log(message: str, log_collector: list = []) -> list:
    log_collector.append(message)
    return log_collector

test_1_logs = register_test_log("Eroare la pasul 1: Buton indisponibil")
print(test_1_logs)  # ['Eroare la pasul 1: Buton indisponibil']

test_2_logs = register_test_log("Eroare la pasul 2: Timeout API")
# Surpriză neplăcută! Testul 2 conține și erorile de la Testul 1:
print(test_2_logs)  # ['Eroare la pasul 1: Buton indisponibil', 'Eroare la pasul 2: Timeout API']
```

```python
# ✅ CORECT: Folosește None ca valoare santinelă și inițializează colecția în interiorul funcției
from typing import Optional, List

def register_test_log(message: str, log_collector: Optional[List[str]] = None) -> List[str]:
    if log_collector is None:
        log_collector = []
    log_collector.append(message)
    return log_collector

test_1_logs = register_test_log("Eroare la pasul 1: Buton indisponibil")
print(test_1_logs)  # ['Eroare la pasul 1: Buton indisponibil']

test_2_logs = register_test_log("Eroare la pasul 2: Timeout API")
print(test_2_logs)  # ['Eroare la pasul 2: Timeout API'] -> Izolat și curat!
```

---

### 1.3 Parametri Dinamici: `*args` și `**kwargs`

Când construiești utilitare flexibile pentru framework-ul de testare, nu știi întotdeauna dinainte câte argumente va trimite fiecare test.

* `*args` (Arguments): Colectează argumentele poziționale suplimentare într-un **tuplu**.
* `**kwargs` (Keyword Arguments): Colectează argumentele numite suplimentare într-un **dicționar**.

```python
# Verificarea prezenței simultane a mai multor statusuri sau etichete
def assert_all_tags_present(page_title: str, *required_tags: str) -> bool:
    print(f"Verificăm pagina '{page_title}' pentru tag-urile: {required_tags}")
    # required_tags este un tuplu: ('checkout', 'payment', 'v2')
    for tag in required_tags:
        assert len(tag) > 0, f"Tag-ul nu poate fi gol!"
    return True

assert_all_tags_present("Pagina Plată", "checkout", "payment", "v2")

# Constructor dinamic de payload pentru cereri HTTP API
def build_request_payload(endpoint: str, **custom_fields) -> dict:
    payload = {
        "target": endpoint,
        "timestamp_utc": "2026-10-31T20:00:00Z",
        "client": "QA_Automation_Core"
    }
    # custom_fields este un dicționar cu toate perechile cheie-valoare trimise
    payload.update(custom_fields)
    return payload

user_payload = build_request_payload(
    "/api/users",
    username="alex_qa",
    role="admin",
    is_active=True,
    quota_limit=500
)
print(user_payload)
# {'target': '/api/users', 'timestamp_utc': '...', 'client': 'QA_Automation_Core', 'username': 'alex_qa', 'role': 'admin', 'is_active': True, 'quota_limit': 500}
```

---

### 1.4 Type Hints (`typing`) — Contracte Stricte în Arhitectura de Teste

Python este un limbaj cu tipizare dinamică, dar adăugarea de adnotări de tip (**Type Hints**) aduce avantaje majore în proiectele de automatizare:
1. **Autocompletare instantanee în IDE:** Când tastezi `user.`, IDE-ul știe exact ce metode sau chei există.
2. **Validare statică (cu `mypy`):** Prinde erorile de tip înainte ca testul să ruleze în CI pipeline.
3. **Claritate:** Colegii de echipă înțeleg imediat ce date așteaptă și ce returnează un helper.

```python
from typing import List, Dict, Optional, Union, Tuple

def parse_http_codes(raw_codes: List[Union[int, str]]) -> Dict[str, int]:
    """Convertește o listă mixtă de coduri HTTP într-un raport statistic."""
    summary: Dict[str, int] = {"success": 0, "client_error": 0, "server_error": 0}
    for item in raw_codes:
        code = int(item)
        if 200 <= code < 300:
            summary["success"] += 1
        elif 400 <= code < 500:
            summary["client_error"] += 1
        elif code >= 500:
            summary["server_error"] += 1
    return summary
```

---

## Capitolul 2: Robustez & Gestionarea Defensivă a Erorilor 🛡️

::: info 🧠 Perspectivă
În lumea reală a testării software, mediile pică, serverele au latență, conexiunile la baze de date expiră, iar paginile web încarcă componente asincron. Un script naiv de testare care se prăbușește necontrolat la primul hop generează teste **flaky** (instabile), erodând încrederea echipei în automatizare. Un inginer de automatizare matur știe cum să captureze erorile tranzitorii, cum să elibereze resursele și cum să semnaleze distinct defectele reale ale produsului.
:::

---

### 2.1 Ierarhia Excepțiilor în Python

Toate erorile din Python sunt clase derivate din `BaseException`. În codul de zi cu zi, interceptăm subclasele lui `Exception`:

```
BaseException
 ├── KeyboardInterrupt (apăsare Ctrl+C)
 └── Exception (baza tuturor excepțiilor comune)
      ├── TypeError (tipuri incompatibile, ex: "5" + 2)
      ├── ValueError (valoare incorectă, ex: int("abc"))
      ├── KeyError (cheie lipsă în dicționar)
      ├── IndexError (index în afara listei)
      ├── FileNotFoundError (fișier inexistent pe disk)
      ├── TimeoutError (operațiunea a expirat)
      └── AssertionError (picarea unei verificări de test assert)
```

::: warning ⚠️ Regula de Aur: Niciodată `except:` fără tip (Bare Except)
Nu intercepta niciodată `except:` fără să specifici tipul erorii și nu folosi niciodată `except Exception: pass` pentru a ascunde problema! Dacă faci asta, vei intercepta chiar și întreruperea manuală `KeyboardInterrupt` sau erori de sintaxă, iar testele vor continua să ruleze raportând fals-pozitive ("Verde fals"), ascunzând bug-uri grave din sistem!
:::

---

### 2.2 Arhitectura Completă: `try`, `except`, `else`, `finally`

Python oferă o structură elegantă cu 4 componente pentru tratarea sigură a fluxurilor:

```python
def fetch_user_balance_safe(api_client, user_id: int) -> float:
    balance = 0.0
    try:
        # 1. Blocul de execuție riscantă
        response = api_client.get_user(user_id)
        balance = float(response["account"]["balance"])
    except KeyError as err:
        # 2. Interceptarea specifică a lipsei câmpului din JSON
        print(f"[EROARE API SCHEMA] Câmpul {err} lipsește din răspunsul primit!")
        raise
    except ValueError as err:
        # 3. Interceptarea conversiei eșuate (ex: soldul a venit ca text invalid 'N/A')
        print(f"[EROARE FORMAT DATE] Valoarea soldului nu poate fi convertită la număr: {err}")
        return 0.0
    else:
        # 4. Se execută DOAR dacă NU a apărut nicio excepție în blocul try
        print(f"[SUCCES] Soldul utilizatorului {user_id} a fost validat: {balance} RON")
        return balance
    finally:
        # 5. Se execută ÎNTOTDEAUNA (indiferent dacă a fost eroare sau succes)
        # Esențial pentru teardown, eliberare de conexiuni sau scriere în log
        print(f"[CLEANUP] Tranzacția de interogare pentru user #{user_id} a fost închisă.")
```

---

### 2.3 Crearea de Excepții Personalizate de Testare

Când o aserțiune sau o precondiție de business eșuează, folosirea unor excepții generice precum `ValueError` nu oferă suficient context în rapoartele de rulare CI. Putem crea clase de excepții specifice:

```python
# Ierarhie de excepții custom pentru un framework QA
class AutomationFrameworkError(Exception):
    """Excepție de bază pentru erorile din framework-ul de testare."""
    pass

class TestDataCorruptedException(AutomationFrameworkError):
    """Aruncată când datele extrase din baza de date sau fișier sunt invalide."""
    pass

class ServiceUnavailableException(AutomationFrameworkError):
    """Aruncată când mediul de testare nu răspunde (503/504)."""
    pass

# Utilizare într-un test automat:
def verify_test_environment(status_code: int):
    if status_code in (502, 503, 504):
        raise ServiceUnavailableException(
            f"Mediul UAT este picat (HTTP {status_code}). Rularea a fost oprită de urgență!"
        )
```

---

## Capitolul 3: Lucrul cu Fișiere & Date Externe (File I/O) 📂

::: info 🧠 Perspectivă
Testarea bazată pe date (**Data-Driven Testing**) este piatra de temelie a automatizării scalabile. În loc să scrii 50 de teste aproape identice pentru 50 de formulare diferite, scrii un singur test parametrizat care citește combinațiile de date dintr-un fișier extern (JSON, CSV, YAML) și verifică comportamentul aplicației.
:::

---

### 3.1 Context Managerul `with open(...)`

Când lucrezi cu fișiere în Python, **nu apela niciodată `f = open()` urmat manual de `f.close()`**. Dacă o aserțiune aruncă o eroare înainte de `f.close()`, fișierul rămâne blocat în sistemul de operare.

Folosește întotdeauna sintaxa `with open(...) as f:`. Aceasta garantează închiderea automată și sigură a fișierului, chiar dacă scriptul crapă cu excepție!

```python
# Scrierea log-urilor de execuție într-un fișier text
def save_test_log(filename: str, log_lines: list) -> None:
    # 'w' = write (suprascriere), encoding='utf-8' = suport pentru diacritice
    with open(filename, mode="w", encoding="utf-8") as file:
        for line in log_lines:
            file.write(f"{line}\n")

# Adăugarea (append) la finalul unui fișier existent
def append_audit_trail(filename: str, event_message: str) -> None:
    # 'a' = append (nu șterge conținutul anterior)
    with open(filename, mode="a", encoding="utf-8") as file:
        file.write(f"[AUDIT] {event_message}\n")
```

---

### 3.2 Lucrul cu Fișiere JSON (`json` module)

Formatul JSON (JavaScript Object Notation) este limbajul comun al API-urilor moderne. Modulul nativ `json` din Python oferă 4 metode esențiale:

| Metodă | Direcție | Sursă / Destinație |
| :--- | :--- | :--- |
| **`json.loads(text)`** | String $\to$ Dicționar Python | Convertește un string JSON (primit din API sau consolă). |
| **`json.load(file)`** | Fișier $\to$ Dicționar Python | Citește direct dintr-un fișier `.json` de pe disk. |
| **`json.dumps(dict)`** | Dicționar $\to$ String JSON | Convertește date Python în text JSON formatat. |
| **`json.dump(dict, file)`** | Dicționar $\to$ Fișier `.json` | Salvează structura de date direct într-un fișier pe disk. |

```python
import json

# 1. json.loads(): Parsarea unui răspuns primit de la server
raw_server_response = '{"status": 200, "user": {"id": 101, "email": "alex@qa.ro"}}'
data = json.loads(raw_server_response)
print(data["user"]["email"])  # alex@qa.ro

# 2. json.dumps(): Serializarea pentru trimiterea unui payload frumos formatat (indent=2)
new_user_payload = {
    "name": "Maria Pop",
    "roles": ["tester", "automation_specialist"],
    "preferences": {"notifications": True, "theme": "dark"}
}
json_string = json.dumps(new_user_payload, indent=2, ensure_ascii=False)
print(json_string)

# 3. json.dump() & json.load(): Salvarea și încărcarea seturilor de date de test
test_data_path = "test_credentials.json"

# Scrierea pe disk:
with open(test_data_path, "w", encoding="utf-8") as f:
    json.dump(new_user_payload, f, indent=2)

# Citirea de pe disk:
with open(test_data_path, "r", encoding="utf-8") as f:
    loaded_credentials = json.load(f)
assert loaded_credentials["name"] == "Maria Pop"
```

---

### 3.3 Lucrul cu Fișiere CSV (`csv.DictReader`)

Pentru tabele mari de date de intrare (utilizatori de test, coduri poștale, produse de e-commerce), fișierele CSV sunt extrem de populare deoarece pot fi editate în Excel sau Google Sheets de către orice coleg de echipă.

```python
import csv

# Să presupunem fișierul 'users_test_data.csv':
# username,password,expected_role
# admin_qa,Pass123!,admin
# standard_user,User987!,viewer
# blocked_user,WrongPass,unauthorized

def load_csv_test_cases(file_path: str) -> list:
    test_cases = []
    with open(file_path, mode="r", encoding="utf-8") as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            test_cases.append(row)
    return test_cases

# Fiecare rând devine automat un dicționar cu cheile din antet:
# [
#   {"username": "admin_qa", "password": "Pass123!", "expected_role": "admin"},
#   {"username": "standard_user", "password": "User987!", "expected_role": "viewer"},
#   ...
# ]
```

---

### 3.4 Căi Moderne cu `pathlib.Path` (Cross-Platform)

Una dintre marile dureri de cap în echipele de QA apare atunci când un script scris pe Windows (`C:\tests\data\file.json`) rulează în containerul Linux din GitLab/GitHub Actions (`/tests/data/file.json`) și crapă cu `FileNotFoundError`.

Biblioteca standard `pathlib` rezolvă definitiv această problemă folosind obiecte orientate pe căi:

```python
from pathlib import Path

# Obținerea folderului în care se află fișierul curent de test:
CURRENT_DIR = Path(__file__).parent

# Construirea unei căi sigure folosind operatorul slash '/'
DATA_FILE = CURRENT_DIR / "fixtures" / "user_data.json"

print("Calea absolută:", DATA_FILE.resolve())
print("Există fișierul?:", DATA_FILE.exists())

# Citire directă într-o singură linie:
if DATA_FILE.exists():
    content = DATA_FILE.read_text(encoding="utf-8")
```

---

## Capitolul 4: Matricea de Decizie QualiAdept 🧭

| Scenariu QA | Abordarea Recomandată | De ce? |
| :--- | :--- | :--- |
| **Generare de payload-uri API cu câmpuri opționale** | Funcție cu `**kwargs` sau parametri cu `None` | Permite fiecărui test să suprascrie doar câmpurile relevante pentru scenariul său. |
| **Interogare server instabil (timeout aleator)** | Bloc `try ... except (TimeoutError, ConnectionError):` cu mecanism de retry | Previne testele false-negative din cauza instabilității rețelei. |
| **Date de test tabulare (mii de rânduri)** | `csv.DictReader` | Ușor de exportat din baze de date și ușor de editat în Excel de către colegii non-tehnici. |
| **Seturi complexe de date ierarhice (API contracts)** | Fișiere `.json` cu `json.load()` | Păstrează fidel structura obiectelor, array-urilor și tipurilor de date booleene/numerice. |
| **Localizarea fișierelor de configurare în CI** | `pathlib.Path(__file__).parent` | Garantează căutarea relativă indiferent de sistemul de operare pe care rulează jobul de testare. |

---

## Capitolul 5: 🛡️ The Tester's Eye & AI Guardrails

::: info 🧠 Capcanele generate de AI în funcții și I/O
Asistenții AI produc adesea cod superficial atunci când sunt rugați să creeze funcții utilitare de testare:
1. **`except Exception: pass`:** Cel mai distructiv anti-pattern în QA. Dacă API-ul dă eroare sau fișierul lipsește, funcția continuă tăcută și testul validează date nule sau inexistente!
2. **Ignorarea codării caracterelor (`encoding="utf-8"`):** Pe Windows, Python folosește implicit codarea CP1252. Dacă un nume conține diacritice românești (ex: „Ștefan”, „Timișoara”), scriptul crapă cu `UnicodeDecodeError` pe serverul de CI!
3. **Căi hardcodate absolute:** AI generează adesea `open("C:/Users/tester/Documents/data.json")`, cod care va fi 100% nefuncțional pe calculatoarele colegilor tăi sau pe agenții cloud.
4. **Uitarea deconstruirii resurselor:** Folosirea `f = open(...)` fără `with` duce la blocarea fișierelor pe disc, în special pe Windows, împiedicând curățarea directorului temporar la finalul rulării.
:::

::: warning 🕵️ The Tester's Eye: Checklist-ul de Revizuire a Codului
Înainte de a include o funcție în suita de automatizare:
- [ ] Are parametri cu valori mutabile (`[]` sau `{}`)? Dacă da, refactorizează cu `None`.
- [ ] Are adnotări de tipuri (`typing`) pentru parametri și valoarea returnată?
- [ ] Excepțiile interceptate sunt specifice (`KeyError`, `ValueError`, nu `Exception` generos)?
- [ ] Fișierele sunt deschise exclusiv în blocuri `with open(..., encoding="utf-8")`?
- [ ] Căile sunt construite cu `pathlib.Path` relativ la fișierul curent?
:::

---

<script setup>
const challenge1Initial = `import json

def parse_and_validate_user(raw_payload: str) -> dict:
    # TODO: 1. Parsează șirul raw_payload folosind json.loads()
    #       Dacă JSON-ul este invalid (aruncă json.JSONDecodeError),
    #       returnează dicționarul: {"valid": False, "error": "Invalid JSON format"}
    #
    # TODO: 2. Verifică prezența cheilor obligatorii: "user_id", "email" și "role"
    #       Dacă oricare dintre ele lipsește,
    #       returnează: {"valid": False, "error": "Missing mandatory keys"}
    #
    # TODO: 3. Dacă totul este valid, returnează:
    #       {"valid": True, "user_id": user_id, "email": email, "role": role}
    pass

# Rulare demonstrativă:
sample_good = '{"user_id": 404, "email": "tester@qa.ro", "role": "admin"}'
print("Rezultat payload valid:", parse_and_validate_user(sample_good))
`

const challenge1TestCases = [
  {
    name: "Validare cu succes a unui payload corect",
    call: `parse_and_validate_user('{"user_id": 101, "email": "ana@test.ro", "role": "tester"}')`,
    expected: {
      "valid": true,
      "user_id": 101,
      "email": "ana@test.ro",
      "role": "tester"
    }
  },
  {
    name: "Capturare format JSON invalid (syntax error)",
    call: `parse_and_validate_user('{"user_id": 102, "email": invalid_no_quotes}')`,
    expected: {
      "valid": false,
      "error": "Invalid JSON format"
    }
  },
  {
    name: "Detectare cheie obligatorie lipsă ('role')",
    call: `parse_and_validate_user('{"user_id": 103, "email": "george@qa.com"}')`,
    expected: {
      "valid": false,
      "error": "Missing mandatory keys"
    }
  },
  {
    name: "Payload gol sau corupt",
    call: `parse_and_validate_user('')`,
    expected: {
      "valid": false,
      "error": "Invalid JSON format"
    }
  }
]

const challenge1Solution = `import json

def parse_and_validate_user(raw_payload: str) -> dict:
    try:
        data = json.loads(raw_payload)
    except (json.JSONDecodeError, TypeError):
        return {"valid": False, "error": "Invalid JSON format"}
        
    required_keys = {"user_id", "email", "role"}
    if not required_keys.issubset(data.keys()):
        return {"valid": False, "error": "Missing mandatory keys"}
        
    return {
        "valid": True,
        "user_id": data["user_id"],
        "email": data["email"],
        "role": data["role"]
    }
`

const challenge2Initial = `def build_execution_metrics(*test_results: dict) -> dict:
    # TODO: Primește un număr variabil de dicționare cu rezultate de teste (*args).
    # Fiecare dicționar are structura: {"test_name": str, "passed": bool, "duration_ms": float}
    #
    # Calculează și returnează un dicționar cu:
    # - "total_tests": numărul total de teste procesate (int)
    # - "passed_tests": numărul de teste unde passed == True (int)
    # - "failed_tests": numărul de teste unde passed == False (int)
    # - "average_duration_ms": durata medie a testelor rotunjită la 2 zecimale (float)
    #
    # Dacă nu este transmis niciun test (*test_results este gol), returnează:
    # {"total_tests": 0, "passed_tests": 0, "failed_tests": 0, "average_duration_ms": 0.0}
    pass

# Rulare demonstrativă:
t1 = {"test_name": "test_login", "passed": True, "duration_ms": 120.5}
t2 = {"test_name": "test_checkout", "passed": False, "duration_ms": 340.0}
print("Metrice calculate:", build_execution_metrics(t1, t2))
`

const challenge2TestCases = [
  {
    name: "Calcul metrice pentru o suită mixtă de teste",
    call: `build_execution_metrics(
      {"test_name": "t1", "passed": True, "duration_ms": 100.0},
      {"test_name": "t2", "passed": True, "duration_ms": 200.0},
      {"test_name": "t3", "passed": False, "duration_ms": 300.0}
    )`,
    expected: {
      "total_tests": 3,
      "passed_tests": 2,
      "failed_tests": 1,
      "average_duration_ms": 200.0
    }
  },
  {
    name: "Gestionare caz limită cu listă goală de argumente",
    call: `build_execution_metrics()`,
    expected: {
      "total_tests": 0,
      "passed_tests": 0,
      "failed_tests": 0,
      "average_duration_ms": 0.0
    }
  },
  {
    name: "Toate testele trecute cu durate precise",
    call: `build_execution_metrics(
      {"test_name": "smoke_1", "passed": True, "duration_ms": 45.25},
      {"test_name": "smoke_2", "passed": True, "duration_ms": 54.75}
    )`,
    expected: {
      "total_tests": 2,
      "passed_tests": 2,
      "failed_tests": 0,
      "average_duration_ms": 50.0
    }
  }
]

const challenge2Solution = `def build_execution_metrics(*test_results: dict) -> dict:
    total = len(test_results)
    if total == 0:
        return {
            "total_tests": 0,
            "passed_tests": 0,
            "failed_tests": 0,
            "average_duration_ms": 0.0
        }
        
    passed = sum(1 for t in test_results if t.get("passed") is True)
    failed = total - passed
    total_duration = sum(t.get("duration_ms", 0.0) for t in test_results)
    avg_duration = round(total_duration / total, 2)
    
    return {
        "total_tests": total,
        "passed_tests": passed,
        "failed_tests": failed,
        "average_duration_ms": avg_duration
    }
`
</script>

## Capitolul 6: 💻 Provocări Interactive în Compilator

Testează și aprofundează lucrul cu funcții, tratarea erorilor și datele structurate direct în compilatorul integrat din browser.

### Provocarea 1: Parsarea Defensivă și Validarea Datelor de Test JSON
**Scenariu:** Un modul de import primește răspunsuri brute de tip JSON de la un serviciu extern. Ai nevoie de o funcție defensivă care să parseze payload-ul și să verifice integritatea datelor înainte de rularea aserțiunilor.  
**Cerință:** Implementează funcția `parse_and_validate_user(raw_payload)` conform instrucțiunilor din comentarii, gestionând excepțiile `json.JSONDecodeError` și verificând cheile esențiale (`user_id`, `email`, `role`).

<PythonCompiler
  challenge-id="py-s3-c1"
  title="Provocarea 1: Parsarea Defensivă și Validarea Datelor JSON"
  description="Tratează excepțiile de decodare JSON și validează schema de date pentru a preveni erorile de tip KeyError."
  :initial-code="challenge1Initial"
  :test-cases="challenge1TestCases"
  :solution="challenge1Solution"
  hint="Folosește try: data = json.loads(raw_payload) except json.JSONDecodeError: return {'valid': False, 'error': 'Invalid JSON format'}. Apoi verifică {'user_id', 'email', 'role'}.issubset(data.keys())."
/>

---

### Provocarea 2: Generator Dinamic de Metrice de Execuție cu `*args`
**Scenariu:** După fiecare rulare a unei suite de teste automate, rezultatele individuale ale cazurilor de test sunt colectate pentru raportul de sumar către echipă.  
**Cerință:** Implementează funcția `build_execution_metrics(*test_results)` care primește un număr variabil de dicționare de rezultate și generează statisticile agregate (`total_tests`, `passed_tests`, `failed_tests`, `average_duration_ms`).

<PythonCompiler
  challenge-id="py-s3-c2"
  title="Provocarea 2: Generator Dinamic de Metrice de Execuție (*args)"
  description="Construiește o funcție flexibilă cu *args pentru agregarea rezultatelor și calculul indicatorilor de performanță."
  :initial-code="challenge2Initial"
  :test-cases="challenge2TestCases"
  :solution="challenge2Solution"
  hint="Verifică if not test_results pentru cazul fără argumente. Altfel calculează numărul de teste trecute/eșuate și durata medie cu sum() și len()."
/>

