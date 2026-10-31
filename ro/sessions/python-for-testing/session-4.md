# Sesiunea 4: Clase, Obiecte și Paradigma OOP în Testare

::: info 🎯 Obiective de Învățare
La finalul acestei sesiuni, vei fi capabil să:
- Înțelegi de ce **Programarea Orientată pe Obiecte (OOP)** este standardul industrial pentru arhitecturile de testare automată (Page Object Model - POM, clienți de API și modele de date).
- Definești clase Python robuste, stăpânind constructorul `__init__`, rolul parametrului `self` și variabilele de instanță vs. variabilele de clasă.
- Aplici decoratorii esențiali de metode: `@staticmethod`, `@classmethod` și `@property` pentru interfețe curate și sigure.
- Implementezi cei **4 piloni fundamentali ai OOP** (Încapsulare, Moștenire, Polimorfism, Abstracție) adaptați specific pe nevoile unui framework de testare.
- Construiești o clasă `BasePage` scalabilă și reutilizabilă pentru Playwright sau Selenium.
- Înțelegi de ce **Compoziția** este adesea preferată **Moștenirii** în automatizarea modernă de interfețe grafice (widgets, tabele, headers).
- Utilizezi metode speciale (*dunder methods*: `__str__`, `__repr__`, `__eq__`) pentru a simplifica aserțiunile de egalitate între obiecte de test.
- Rezolvi provocări practice de cod direct în compilatorul integrat din browser.
:::

---

## Capitolul 1: De ce OOP în QA Automation? 🏛️

::: info 🧠 Perspectivă
În primele scripturi de testare, scrii comenzi linie cu linie: cauți un element web, dai click, citești un text, faci un `assert`. Când aplicația crește la sute de pagini și mii de scenarii, această abordare procedurală devine un coșmar: selectorii sunt duplicați în sute de fișiere, iar o simplă modificare de UI distruge întreaga suită.  
OOP nu este doar o teorie de examen — este **arma supremă de organizare a codului de testare**, permițându-ne să modelăm paginile web, utilizatorii și serviciile API ca entități inteligente și reutilizabile.
:::

---

### 1.1 Clase vs. Obiecte: Planul Arhitectural vs. Casa Construită

* **Clasa (`class`):** Reprezintă șablonul sau schița (blueprint-ul). Definește ce proprietăți (atribute) și ce comportamente (metode) vor avea entitățile create.
* **Obiectul (Instanța):** Este instanțierea concretă în memoria calculatorului a acelui șablon.

```python
# Definirea unei clase simple pentru reprezentarea unui utilizator de test
class TestUser:
    def __init__(self, username: str, email: str, role: str = "viewer"):
        # Atribute de instanță (specifice fiecărui utilizator)
        self.username = username
        self.email = email
        self.role = role
        self.is_authenticated = False

    def login(self) -> None:
        """Simulează autentificarea utilizatorului."""
        self.is_authenticated = True
        print(f"Utilizatorul '{self.username}' s-a autentificat cu succes ca {self.role}.")

# Crearea instanțelor (Obiectelor):
admin_user = TestUser(username="andrei_admin", email="admin@qa.ro", role="admin")
tester_user = TestUser(username="elena_qa", email="elena@qa.ro")

admin_user.login()
# Output: Utilizatorul 'andrei_admin' s-a autentificat cu succes ca admin.
```

---

### 1.2 Rolul lui `self` și Constructorul `__init__`

În Python, metoda specială `__init__` este **constructorul** clasei. Ea se execută automat la fiecare instanțiere (`TestUser(...)`).

Ce este `self`?
* `self` reprezintă **instanța curentă** a obiectului. Prin intermediul lui `self`, metodele din clasă știu la variabilele cărui obiect concret se referă.
* În Python, `self` este transmis automat ca prim parametru la orice apel de metodă de instanță (ex: `user.login()` este echivalent cu `TestUser.login(user)`).

::: danger 🛑 Capcana Atributelor de Clasă Partajate
Dacă declari o variabilă direct în corpul clasei (în afara lui `__init__`), acea variabilă devine un **atribut de clasă** partajat de toate instanțele! Dacă este o colecție mutabilă (`list`, `dict`), modificarea ei într-un test va altera starea tuturor celorlalte teste!
:::

```python
# ❌ PERICULOS: Lista este partajată între toți utilizatorii!
class BrokenSession:
    visited_urls = []  # Atribut de clasă (comun tuturor!)

s1 = BrokenSession()
s1.visited_urls.append("/dashboard")

s2 = BrokenSession()
print(s2.visited_urls)  # ['/dashboard'] -> Date scurse dintr-o sesiune în alta!
```

```python
# ✅ CORECT: Inițializează atributele în interiorul lui __init__
class SafeSession:
    def __init__(self):
        self.visited_urls = []  # Atribut de instanță (izolat per obiect!)
```

---

## Capitolul 2: Decoratori de Metode (`@property`, `@staticmethod`, `@classmethod`) 🎛️

În testare automată, dorim ca interfața claselor noastre să fie cât mai intuitivă. Decoratorii standard din Python ne ajută să obținem acest lucru:

### 2.1 Proprietăți cu `@property` (Getters Curați)

Decoratorul `@property` îți permite să accesezi o metodă ca și cum ar fi o variabilă, fără a folosi parantezele `()`. Este ideal pentru verificări de stare:

```python
class ApiTestClient:
    def __init__(self, base_url: str, token: str = None):
        self.base_url = base_url.rstrip("/")
        self.token = token

    @property
    def is_authenticated(self) -> bool:
        """Proprietate calculată dinamic: verifică dacă avem token valid."""
        return bool(self.token and len(self.token) > 10)

client = ApiTestClient("https://api.test.com", token="eyJhbGciOiJIUzI1NiIsIn...")
# Se citește curat, ca un atribut simplu:
if client.is_authenticated:
    print("Clientul este gata pentru trimiterea cererilor securizate.")
```

---

### 2.2 Metode Statice (`@staticmethod`)

O metodă statică nu are acces la `self` și nu depinde de starea vreunei instanțe. Ea funcționează ca o funcție utilitară grupată logic în interiorul clasei:

```python
class LocatorHelper:
    @staticmethod
    def format_test_id(test_id: str) -> str:
        """Generează selectorul standard data-testid."""
        return f"[data-testid='{test_id}']"

# Apel fără a instanția clasa:
selector = LocatorHelper.format_test_id("submit-order-button")
print(selector)  # [data-testid='submit-order-button']
```

---

## Capitolul 3: Cei 4 Piloni OOP Aplicați în QA Automation 🏛️

```
        Cei 4 Piloni OOP în Testare
  ┌──────────────┬──────────────┬──────────────┬──────────────┐
  │ Încapsulare  │  Moștenire   │  Polimorfism │  Abstracție  │
  ├──────────────┼──────────────┼──────────────┼──────────────┤
  │ Ascundem     │ BasePage     │ Același apel │ Interfață    │
  │ selectorii   │ moștenită de │ pentru browsere│ declarativă,│
  │ în metode    │ LoginPage    │ diferite     │ detalii de   │
  │ de business  │              │              │ driver ascunse│
  └──────────────┴──────────────┴──────────────┴──────────────┘
```

### 3.1 Încapsularea: Separarea Selectorilor de Scenariile de Test

Încapsularea înseamnă gruparea datelor și a metodelor care operează pe acele date în interiorul unei clase, ascunzând detaliile tehnice de implementare.  
În loc ca testul să conțină selectori XPath greoi și clicuri brute, el apelează o metodă clară de business:

```python
class CartComponent:
    def __init__(self):
        # Selectorii sunt privați/protejați în cadrul componentei
        self._checkout_btn = "#btn-checkout"
        self._promo_input = "input[name='coupon']"

    def apply_coupon(self, coupon_code: str) -> None:
        """Testul apelează această metodă fără să îi pese ce ID are input-ul."""
        print(f"Scriem cuponul '{coupon_code}' în {self._promo_input}")
```

---

### 3.2 Moștenirea (Inheritance): Arhitectura `BasePage`

Moștenirea permite unei clase fiu (`subclass`) să preia toate atributele și metodele unei clase părinte (`superclass`). În testarea UI, acesta este fundamentul claselor de tip pagină:

```python
class BasePage:
    """Clasa părinte care conține logica comună tuturor paginilor aplicației."""
    def __init__(self, driver, base_url: str = "https://app.qualiadept.ro"):
        self.driver = driver
        self.base_url = base_url

    def navigate_to(self, path: str) -> None:
        url = f"{self.base_url}{path}"
        print(f"[Driver] Navigare către {url}")

    def find_element(self, locator: str) -> str:
        print(f"[Driver] Așteptare și localizare element: {locator}")
        return f"Element({locator})"

# LoginPage moștenește BasePage
class LoginPage(BasePage):
    def __init__(self, driver):
        # super().__init__() apelează constructorul clasei de bază
        super().__init__(driver)
        self.username_input = "#username"
        self.password_input = "#password"
        self.submit_btn = "button[type='submit']"

    def open(self) -> None:
        self.navigate_to("/login")

    def login(self, user: str, passw: str) -> None:
        self.find_element(self.username_input)
        self.find_element(self.password_input)
        self.find_element(self.submit_btn)
        print(f"[Login] Autentificare declanșată pentru {user}")
```

---

### 3.3 Compoziție vs. Moștenire în Page Objects

::: tip 💡 Principiul de Aur: „Favor Composition over Inheritance”
O pagină de Checkout **nu este** un Header și **nu este** un Footer. O pagină de Checkout **are** un Header și **are** un Footer!  
Dacă folosești moștenire pentru tot, ajungi la ierarhii imposibil de întreținut (`CheckoutPage extends BasePageWithHeaderAndCartAndFooter`).  
Folosește **Compoziția**: include componentele ca atribute în pagină!
:::

```python
class NavigationHeader:
    def click_logo(self): print("Navigare către Home")
    def search(self, query: str): print(f"Căutare după: {query}")

class CheckoutPage(BasePage):
    def __init__(self, driver):
        super().__init__(driver)
        # Compoziție: pagina include componenta header
        self.header = NavigationHeader()
        self.order_summary = "#order-summary"

# Utilizare în test:
checkout = CheckoutPage("driver_instance")
checkout.header.search("iPhone 15")  # Clar, modular și reutilizabil!
```

---

### 3.4 Metode Dunder (`__repr__` și `__eq__`) pentru Aserțiuni Curate

Când compari obiecte în teste (`assert actual_user == expected_user`), Python compară implicit adresele de memorie, nu valorile! Prin implementarea metodei `__eq__`, testul devine capabil să compare direct câmpurile:

```python
class UserProfile:
    def __init__(self, user_id: int, email: str, role: str):
        self.user_id = user_id
        self.email = email
        self.role = role

    def __repr__(self) -> str:
        """Reprezentare utilă în rapoartele de aserțiune Pytest."""
        return f"UserProfile(id={self.user_id}, email='{self.email}', role='{self.role}')"

    def __eq__(self, other) -> bool:
        """Permite asertarea directă: assert u1 == u2"""
        if not isinstance(other, UserProfile):
            return False
        return (self.user_id == other.user_id and 
                self.email == other.email and 
                self.role == other.role)

u1 = UserProfile(10, "dan@qa.ro", "admin")
u2 = UserProfile(10, "dan@qa.ro", "admin")

assert u1 == u2  # True! Fără __eq__, aserțiunea ar fi picat deoarece sunt două instanțe separate în memorie!
```

---

## Capitolul 4: Matricea de Decizie QualiAdept 🧭

| Structură / Paradigma | Când o folosim în QA? | Exemplu tipic |
| :--- | :--- | :--- |
| **Funcții Simple (`def`)** | Operațiuni utilitare pure, parsare de date, transformări fără stare internă. | `parse_date()`, `extract_token()`, `clean_price()` |
| **Clase Complete (`class`)** | Paginile web (Page Object Model), API Clients, servicii de gestiune a bazei de date. | `LoginPage`, `PaymentClient`, `DatabaseSession` |
| **Compoziție (Componente)** | Secțiuni de UI reutilizabile prezente pe mai multe pagini diferite. | `NavbarComponent`, `PaginationWidget`, `CookieConsent` |
| **Moștenire (`BasePage`)** | Comportamente universale partajate de toate ecranele din framework. | Navigare URL, screenshot la eșec, așteptare explicită |

---

## Capitolul 5: 🛡️ The Tester's Eye & AI Guardrails

::: info 🧠 Capcanele generate de AI în codul OOP
Modelele AI generează frecvent clase atractive la prima vedere, dar defectuoase arhitectural:
1. **Ierarhii adânci și fragile de moștenire:** AI tinde să creeze `LoginPage extends SecurePage extends FormPage extends Page extends Base extends Object`. Modificarea unei metode din vârf sparge zeci de teste descendente. Limitează moștenirea la 1 nivel (`BasePage` $\to$ `SubPage`).
2. **Lipsa lui `super().__init__()`:** Dacă o subclasă uită să apeleze `super().__init__(driver)`, driverul rămâne neinițializat și testul crapă cu `AttributeError: 'LoginPage' object has no attribute 'driver'`.
3. **Păstrarea stării între teste (State Leaks):** AI adaugă adesea atribute de clasă sau stochează date specifice unui test în instanțe globale de pagini, cauzând eșecuri intermitente în rulările paralele.
:::

---

<script setup>
const challenge1Initial = `class LoginPage:
    def __init__(self):
        # TODO: 1. Inițializează selectorii de instanță:
        #          - self.username_selector = "#user-input"
        #          - self.password_selector = "#pass-input"
        #          - self.login_button_selector = "#submit-btn"
        # TODO: 2. Inițializează starea:
        #          - self.is_logged_in = False
        #          - self.logged_in_username = None
        pass

    def perform_login(self, username: str, password: str) -> bool:
        # TODO: 3. Dacă username nu este gol și password are lungimea minim 6 caractere:
        #          - setează self.is_logged_in = True
        #          - setează self.logged_in_username = username
        #          - returnează True
        #       Altfel:
        #          - returnează False
        pass

# Rulare demonstrativă:
page = LoginPage()
print("Autentificare reușită?:", page.perform_login("alex_qa", "Secur3Pass!"))
print("Utilizator curent:", page.logged_in_username)
`

const challenge1TestCases = [
  {
    name: "Autentificare validă cu credențiale conforme",
    call: `LoginPage().perform_login("alex_qa", "Secur3Pass!")`,
    expected: true
  },
  {
    name: "Respingere parolă prea scurtă (< 6 caractere)",
    call: `LoginPage().perform_login("maria", "123")`,
    expected: false
  },
  {
    name: "Respingere username gol",
    call: `LoginPage().perform_login("", "ValidPassword99!")`,
    expected: false
  }
]

const challenge1Solution = `class LoginPage:
    def __init__(self):
        self.username_selector = "#user-input"
        self.password_selector = "#pass-input"
        self.login_button_selector = "#submit-btn"
        self.is_logged_in = False
        self.logged_in_username = None

    def perform_login(self, username: str, password: str) -> bool:
        if username and len(password) >= 6:
            self.is_logged_in = True
            self.logged_in_username = username
            return True
        return False
`

const challenge2Initial = `class BasePage:
    def __init__(self, base_url: str):
        self.base_url = base_url.rstrip("/")
        self.actions_log = []

    def log_action(self, action_name: str) -> None:
        self.actions_log.append(action_name)

class ProductCatalogPage(BasePage):
    def __init__(self, base_url: str):
        # TODO: 1. Apelează constructorul clasei părinte folosind super()
        # TODO: 2. Inițializează o listă de instanță: self.products_list = []
        pass

    def add_product(self, product_id: int, product_name: str, in_stock: bool) -> None:
        # TODO: 3. Adaugă un dicționar cu cele 3 proprietăți în self.products_list
        # TODO: 4. Înregistrează acțiunea apelând self.log_action(f"Adăugat {product_name}")
        pass

    def get_in_stock_products(self) -> list:
        # TODO: 5. Returnează o listă doar cu numele produselor care au in_stock == True
        pass

def check_catalog_stock(items: list) -> list:
    page = ProductCatalogPage("https://magazin.ro")
    for pid, name, in_stock in items:
        page.add_product(pid, name, in_stock)
    return page.get_in_stock_products()

# Rulare demonstrativă:
sample_items = [(1, "Laptop", True), (2, "Căști", False), (3, "Monitor", True)]
print("Produse în stoc:", check_catalog_stock(sample_items))
`

const challenge2TestCases = [
  {
    name: "Moștenire corectă și filtrare produse în stoc",
    call: `check_catalog_stock([(10, "Monitor 4K", True), (20, "Tastatură", False), (30, "Mouse", True)])`,
    expected: ["Monitor 4K", "Mouse"]
  },
  {
    name: "Catalog fără produse disponibile",
    call: `check_catalog_stock([(1, "Produs Epuizat", False)])`,
    expected: []
  },
  {
    name: "Toate produsele disponibile în stoc",
    call: `check_catalog_stock([(101, "Căști Gaming", True), (102, "Webcam HD", True)])`,
    expected: ["Căști Gaming", "Webcam HD"]
  }
]

const challenge2Solution = `class BasePage:
    def __init__(self, base_url: str):
        self.base_url = base_url.rstrip("/")
        self.actions_log = []

    def log_action(self, action_name: str) -> None:
        self.actions_log.append(action_name)

class ProductCatalogPage(BasePage):
    def __init__(self, base_url: str):
        super().__init__(base_url)
        self.products_list = []

    def add_product(self, product_id: int, product_name: str, in_stock: bool) -> None:
        self.products_list.append({
            "id": product_id,
            "name": product_name,
            "in_stock": in_stock
        })
        self.log_action(f"Adăugat {product_name}")

    def get_in_stock_products(self) -> list:
        return [p["name"] for p in self.products_list if p["in_stock"]]

def check_catalog_stock(items: list) -> list:
    page = ProductCatalogPage("https://magazin.ro")
    for pid, name, in_stock in items:
        page.add_product(pid, name, in_stock)
    return page.get_in_stock_products()
`
</script>

## Capitolul 6: 💻 Provocări Interactive în Compilator

Testează și aplică principiile OOP construind componente de testare direct în compilatorul integrat din browser.

### Provocarea 1: Modelarea Panoului de Autentificare (`LoginPage`)
**Scenariu:** Creează o clasă de Page Object dedicată formularului de login.  
**Cerință:** Implementează clasa `LoginPage` inițializând selectorii de pagină, gestionând starea de conectare (`is_logged_in`) și scriind logica din `perform_login(username, password)`.

<PythonCompiler
  challenge-id="py-s4-c1"
  title="Provocarea 1: Modelarea Panoului de Autentificare (LoginPage)"
  description="Construiește o clasă de Page Object cu atribute de instanță și logică de autentificare."
  :initial-code="challenge1Initial"
  :test-cases="challenge1TestCases"
  :solution="challenge1Solution"
  hint="Definește în __init__ atributele self.username_selector, self.is_logged_in etc. În perform_login verifică if username and len(password) >= 6: actualizează starea și returnează True."
/>

---

### Provocarea 2: Moștenirea Clasei `BasePage` & Gestiunea Catalogului
**Scenariu:** Creează o pagină de catalog `ProductCatalogPage` care moștenește comportamentul de bază din `BasePage` și oferă metode pentru adăugarea și filtrarea produselor în stoc.  
**Cerință:** Apelează `super().__init__(base_url)`, gestionează lista de produse și apelează metoda moștenită `log_action`.

<PythonCompiler
  challenge-id="py-s4-c2"
  title="Provocarea 2: Moștenirea Clasei BasePage & Gestiunea Catalogului"
  description="Aplică moștenirea OOP cu super() și metode de filtrare pe colecții de instanță."
  :initial-code="challenge2Initial"
  :test-cases="challenge2TestCases"
  :solution="challenge2Solution"
  hint="În constructor folosește super().__init__(base_url). În get_in_stock_products folosește o list comprehension: [p['name'] for p in self.products_list if p['in_stock']]."
/>
