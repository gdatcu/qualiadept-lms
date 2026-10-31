# Session 4: Classes, Objects & OOP Paradigm in Testing

::: info 🎯 Learning Objectives
By the end of this session, you will be able to:
- Understand why **Object-Oriented Programming (OOP)** serves as the industry standard for test automation architectures (Page Object Model - POM, API clients, and data models).
- Define robust Python classes, mastering the `__init__` constructor, the role of `self`, and instance variables vs. class variables.
- Apply essential method decorators: `@staticmethod`, `@classmethod`, and `@property` for clean and expressive test interfaces.
- Implement the **4 core pillars of OOP** (Encapsulation, Inheritance, Polymorphism, Abstraction) tailored specifically for test engineering frameworks.
- Build a modular and scalable `BasePage` architecture for Playwright or Selenium.
- Understand why **Composition** is frequently preferred over **Inheritance** when modeling complex UI components (widgets, tables, headers).
- Leverage special methods (*dunder methods*: `__str__`, `__repr__`, `__eq__`) to simplify object equality assertions in test suites.
- Solve interactive coding challenges directly inside the browser compiler.
:::

---

## Chapter 1: Why OOP in QA Automation? 🏛️

::: info 🧠 Perspective
When writing your first test scripts, you execute commands line-by-line: locate an element, click, read text, assert. But when an enterprise application grows to hundreds of pages and thousands of regression scenarios, this procedural approach collapses: locator strings are duplicated across hundreds of files, and a minor UI redesign breaks the entire test suite.  
OOP is not merely academic theory — it is **the ultimate weapon for organizing test code**, allowing us to model web pages, users, and API services as reusable, intelligent software entities.
:::

---

### 1.1 Classes vs. Objects: The Architectural Blueprint vs. The Built House

* **Class (`class`):** The blueprint or schema. It defines the state (attributes) and behavior (methods) that created entities will possess.
* **Object (Instance):** The actual in-memory incarnation of that blueprint.

```python
# Defining a class representing an automated test user
class TestUser:
    def __init__(self, username: str, email: str, role: str = "viewer"):
        # Instance attributes (unique to each object instance)
        self.username = username
        self.email = email
        self.role = role
        self.is_authenticated = False

    def login(self) -> None:
        """Simulates authenticating this user."""
        self.is_authenticated = True
        print(f"User '{self.username}' successfully authenticated as {self.role}.")

# Creating instances (Objects):
admin_user = TestUser(username="andrei_admin", email="admin@qa.com", role="admin")
tester_user = TestUser(username="elena_qa", email="elena@qa.com")

admin_user.login()
# Output: User 'andrei_admin' successfully authenticated as admin.
```

---

### 1.2 The Role of `self` and the `__init__` Constructor

In Python, the special method `__init__` is the class **constructor**. It runs automatically whenever a new instance is created (`TestUser(...)`).

What is `self`?
* `self` refers to the **current active instance** of the class. Through `self`, methods know which specific object's data they are operating on.
* Python automatically passes the instance as the first argument to any instance method (e.g., `user.login()` is equivalent under the hood to `TestUser.login(user)`).

::: danger 🛑 The Shared Class Attribute Gotcha
If you declare a variable directly in the class body (outside of `__init__`), that variable becomes a **class attribute** shared across all instances! If it is a mutable object (`list`, `dict`), modifications in one test case will leak into all other test cases!
:::

```python
# ❌ DANGEROUS: The list is shared across all sessions!
class BrokenSession:
    visited_urls = []  # Class attribute (shared globally!)

s1 = BrokenSession()
s1.visited_urls.append("/dashboard")

s2 = BrokenSession()
print(s2.visited_urls)  # ['/dashboard'] -> State leaked between isolated tests!
```

```python
# ✅ CORRECT: Initialize state strictly inside __init__
class SafeSession:
    def __init__(self):
        self.visited_urls = []  # Instance attribute (isolated per object)
```

---

## Chapter 2: Method Decorators (`@property`, `@staticmethod`, `@classmethod`) 🎛️

In test automation, we want our test assertions and page interfaces to read like natural language:

### 2.1 Clean State Getters with `@property`

The `@property` decorator allows you to access a method like a regular attribute without parentheses `()`. It is ideal for live state evaluations:

```python
class ApiTestClient:
    def __init__(self, base_url: str, token: str = None):
        self.base_url = base_url.rstrip("/")
        self.token = token

    @property
    def is_authenticated(self) -> bool:
        """Dynamically checks if client possesses a valid JWT token."""
        return bool(self.token and len(self.token) > 10)

client = ApiTestClient("https://api.test.com", token="eyJhbGciOiJIUzI1NiIsIn...")
# Reads cleanly without function parentheses:
if client.is_authenticated:
    print("Client is authorized to dispatch secure requests.")
```

---

### 2.2 Static Utility Methods with `@staticmethod`

A static method does not receive `self` and does not depend on instance state. It acts as a cohesive utility function bundled logically inside the class:

```python
class LocatorHelper:
    @staticmethod
    def format_test_id(test_id: str) -> str:
        """Generates standard data-testid selector."""
        return f"[data-testid='{test_id}']"

# Call without creating an instance:
selector = LocatorHelper.format_test_id("submit-order-button")
print(selector)  # [data-testid='submit-order-button']
```

---

## Chapter 3: The 4 OOP Pillars in Test Automation 🏛️

```
        The 4 OOP Pillars in QA Engineering
  ┌──────────────┬──────────────┬──────────────┬──────────────┐
  │ Encapsulation│ Inheritance  │ Polymorphism │ Abstraction  │
  ├──────────────┼──────────────┼──────────────┼──────────────┤
  │ Hide raw     │ BasePage     │ Same call    │ Declarative  │
  │ selectors in │ inherited by │ for Chrome,  │ high-level   │
  │ page methods │ LoginPage    │ Firefox, etc.│ API hiding   │
  └──────────────┴──────────────┴──────────────┴──────────────┘
```

### 3.1 Encapsulation: Separating Locators from Test Logic

Encapsulation packages data and operations together while hiding internal implementation mechanics.  
Tests should not know whether a login button is identified by an XPath, CSS selector, or test-id:

```python
class CartComponent:
    def __init__(self):
        # Locators are private/internal to the component
        self._checkout_btn = "#btn-checkout"
        self._promo_input = "input[name='coupon']"

    def apply_coupon(self, coupon_code: str) -> None:
        """The test simply calls this business action without caring about DOM IDs."""
        print(f"Entering coupon '{coupon_code}' into {self._promo_input}")
```

---

### 3.2 Inheritance: Building the `BasePage` Hierarchy

Inheritance allows child classes (`subclasses`) to acquire all attributes and methods of a parent class (`superclass`). In UI automation, this forms the foundation of all Page Objects:

```python
class BasePage:
    """Parent class containing universal browser operations."""
    def __init__(self, driver, base_url: str = "https://app.qualiadept.com"):
        self.driver = driver
        self.base_url = base_url

    def navigate_to(self, path: str) -> None:
        url = f"{self.base_url}{path}"
        print(f"[Driver] Navigating to {url}")

    def find_element(self, locator: str) -> str:
        print(f"[Driver] Waiting and locating element: {locator}")
        return f"Element({locator})"

# LoginPage inherits from BasePage
class LoginPage(BasePage):
    def __init__(self, driver):
        # super().__init__() executes the BasePage constructor
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
        print(f"[Login] Login dispatched for {user}")
```

---

### 3.3 Composition vs. Inheritance in Page Objects

::: tip 💡 Core Architecture Rule: „Favor Composition over Inheritance”
A Checkout Page **is not** a Header, and it **is not** a Shopping Cart. A Checkout Page **has** a Header and **has** a Shopping Cart!  
Using inheritance for everything leads to fragile monolithic monsters (`CheckoutPage extends BaseWithHeaderAndFooterAndSidebar`).  
Instead, use **Composition**: embed components as attributes inside page classes!
:::

```python
class NavigationHeader:
    def click_logo(self): print("Navigating to Home")
    def search(self, query: str): print(f"Searching for: {query}")

class CheckoutPage(BasePage):
    def __init__(self, driver):
        super().__init__(driver)
        # Composition: Checkout embeds the reusable header component
        self.header = NavigationHeader()
        self.order_summary = "#order-summary"

# In your test:
checkout = CheckoutPage("driver_instance")
checkout.header.search("MacBook Pro")  # Modular, expressive, and resilient!
```

---

### 3.4 Dunder Methods (`__repr__` and `__eq__`) for Clean Assertions

When comparing objects in automated assertions (`assert actual_user == expected_user`), Python compares memory references by default, not values! Implementing `__eq__` enables direct value comparison:

```python
class UserProfile:
    def __init__(self, user_id: int, email: str, role: str):
        self.user_id = user_id
        self.email = email
        self.role = role

    def __repr__(self) -> str:
        """Informative string output in Pytest failure reports."""
        return f"UserProfile(id={self.user_id}, email='{self.email}', role='{self.role}')"

    def __eq__(self, other) -> bool:
        """Enables direct assertions: assert u1 == u2"""
        if not isinstance(other, UserProfile):
            return False
        return (self.user_id == other.user_id and 
                self.email == other.email and 
                self.role == other.role)

u1 = UserProfile(10, "dan@qa.com", "admin")
u2 = UserProfile(10, "dan@qa.com", "admin")

assert u1 == u2  # True! Without __eq__, this would fail because they are two distinct instances!
```

---

## Chapter 4: QualiAdept Decision Matrix 🧭

| Paradigm / Structure | When to Use in QA? | Typical Example |
| :--- | :--- | :--- |
| **Simple Functions (`def`)** | Pure utility helpers, text parsing, transformations without internal state. | `parse_date()`, `extract_token()`, `clean_price()` |
| **Complete Classes (`class`)** | Web pages (Page Object Model), API Clients, Database session handlers. | `LoginPage`, `PaymentClient`, `DatabaseSession` |
| **Composition (Components)** | Reusable UI widgets present across multiple screens. | `NavbarComponent`, `PaginationWidget`, `CookieBanner` |
| **Inheritance (`BasePage`)** | Universal capabilities shared across every screen in the framework. | Base navigation, screenshot capture on failure, explicit waits |

---

## Chapter 5: 🛡️ The Tester's Eye & AI Guardrails

::: info 🧠 AI Gotchas in OOP Code
AI models generate neat-looking classes that frequently break architectural rules:
1. **Deep, Fragile Inheritance Hierarchies:** AI creates deep hierarchies (`LoginPage extends FormPage extends SecuredPage extends Page extends Base extends Object`). Altering a method high up breaks dozens of descendant tests. Keep inheritance flat (1 level: `BasePage` $\to$ `SubPage`).
2. **Missing `super().__init__()` Calls:** If a child page forgets `super().__init__(driver)`, the driver remains uninitialized and tests fail with `AttributeError: 'LoginPage' object has no attribute 'driver'`.
3. **Cross-Test State Pollution:** AI often declares mutable attributes at the class level instead of inside `__init__`, causing random test flakiness in parallel test executions.
:::

---

<script setup>
const challenge1Initial = `class LoginPage:
    def __init__(self):
        # TODO: 1. Initialize instance locators:
        #          - self.username_selector = "#user-input"
        #          - self.password_selector = "#pass-input"
        #          - self.login_button_selector = "#submit-btn"
        # TODO: 2. Initialize instance state:
        #          - self.is_logged_in = False
        #          - self.logged_in_username = None
        pass

    def perform_login(self, username: str, password: str) -> bool:
        # TODO: 3. If username is not empty and password has at least 6 characters:
        #          - set self.is_logged_in = True
        #          - set self.logged_in_username = username
        #          - return True
        #       Otherwise:
        #          - return False
        pass

# Sample test run:
page = LoginPage()
print("Login successful?:", page.perform_login("alex_qa", "Secur3Pass!"))
print("Current logged user:", page.logged_in_username)
`

const challenge1TestCases = [
  {
    name: "Successful login with valid credentials",
    call: `LoginPage().perform_login("alex_qa", "Secur3Pass!")`,
    expected: true
  },
  {
    name: "Reject short password (< 6 chars)",
    call: `LoginPage().perform_login("maria", "123")`,
    expected: false
  },
  {
    name: "Reject empty username",
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
        # TODO: 1. Call parent class constructor using super()
        # TODO: 2. Initialize an instance list: self.products_list = []
        pass

    def add_product(self, product_id: int, product_name: str, in_stock: bool) -> None:
        # TODO: 3. Append dictionary with all 3 properties to self.products_list
        # TODO: 4. Record action by invoking self.log_action(f"Added {product_name}")
        pass

    def get_in_stock_products(self) -> list:
        # TODO: 5. Return list of product names where in_stock == True
        pass

def check_catalog_stock(items: list) -> list:
    page = ProductCatalogPage("https://store.com")
    for pid, name, in_stock in items:
        page.add_product(pid, name, in_stock)
    return page.get_in_stock_products()

# Sample test run:
sample_items = [(1, "Laptop", True), (2, "Headphones", False), (3, "Monitor", True)]
print("In stock:", check_catalog_stock(sample_items))
`

const challenge2TestCases = [
  {
    name: "Inheritance and in-stock product filtering",
    call: `check_catalog_stock([(10, "4K Monitor", True), (20, "Keyboard", False), (30, "Mouse", True)])`,
    expected: ["4K Monitor", "Mouse"]
  },
  {
    name: "Catalog with zero in-stock products",
    call: `check_catalog_stock([(1, "Out of Stock Item", False)])`,
    expected: []
  },
  {
    name: "All products available in stock",
    call: `check_catalog_stock([(101, "Gaming Headset", True), (102, "HD Webcam", True)])`,
    expected: ["Gaming Headset", "HD Webcam"]
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
        self.log_action(f"Added {product_name}")

    def get_in_stock_products(self) -> list:
        return [p["name"] for p in self.products_list if p["in_stock"]]

def check_catalog_stock(items: list) -> list:
    page = ProductCatalogPage("https://store.com")
    for pid, name, in_stock in items:
        page.add_product(pid, name, in_stock)
    return page.get_in_stock_products()
`
</script>

## Chapter 6: 💻 Interactive Compiler Challenges

Solidify your OOP and Page Object architecture skills directly inside the browser compiler below.

### Challenge 1: Modeling the Login Page Object (`LoginPage`)
**Scenario:** Build a Page Object class dedicated to a web application login form.  
**Requirement:** Implement the `LoginPage` class, defining instance locators, tracking authentication state (`is_logged_in`), and implementing validation logic in `perform_login(username, password)`.

<PythonCompiler
  challenge-id="py-s4-c1"
  title="Challenge 1: Modeling the Login Page Object (LoginPage)"
  description="Build a Page Object class with instance attributes and login validation logic."
  :initial-code="challenge1Initial"
  :test-cases="challenge1TestCases"
  :solution="challenge1Solution"
  hint="Define self.username_selector etc. in __init__. In perform_login check if username and len(password) >= 6: update state and return True."
/>

---

### Challenge 2: `BasePage` Inheritance & Catalog Management
**Scenario:** Create a `ProductCatalogPage` that inherits base navigation and action tracking from `BasePage`, while providing catalog filtering operations.  
**Requirement:** Call `super().__init__(base_url)`, manage the instance product list, and invoke the inherited `log_action` method.

<PythonCompiler
  challenge-id="py-s4-c2"
  title="Challenge 2: BasePage Inheritance & Catalog Management"
  description="Apply OOP inheritance with super() and filter in-stock products from instance collections."
  :initial-code="challenge2Initial"
  :test-cases="challenge2TestCases"
  :solution="challenge2Solution"
  hint="In __init__ invoke super().__init__(base_url). In get_in_stock_products use [p['name'] for p in self.products_list if p['in_stock']]."
/>

