# Session 2: Data Structures & Control Flow in Python

::: info 🎯 Learning Objectives
By the end of this session, you will be able to:
- Master the **4 core Python data collections** (`list`, `tuple`, `dict`, `set`) and understand exactly when to use each in test automation architectures.
- Seamlessly parse, query, and mutate complex nested API JSON structures without triggering runtime errors (`KeyError`, `IndexError`).
- Use **immutable tuples** for reliable multi-parameter test datasets (`@pytest.mark.parametrize`) and database coordinates.
- Leverage **sets** for blazing-fast $O(1)$ duplicate detection and set-difference assertions between expected and actual UI elements.
- Write Pythonic control flow using **truthiness**, logical operators (`and`, `or`, `not`, `in`), and conditional evaluations.
- Replace verbose multi-line loops with elegant **List and Dictionary Comprehensions** for rapid test data preparation.
- Solve interactive coding challenges directly inside the browser compiler.
:::

---

## Chapter 1: The 4 Core Python Collections in QA Automation 🗄️

::: info 🧠 Perspective
In manual testing, you inspect test matrices in Excel spreadsheets and JSON responses in Postman. In automated testing, these data representations become live in-memory Python structures: lists of search results, dictionaries of user profiles, tuples of configuration parameters, and sets of unique permissions. Selecting the right collection guarantees speed, readability, and prevents flaky assertions.
:::

```python
# Quick Look: How the 4 collections live in automated tests
test_environments = ["staging", "uat", "production"]              # list: ordered & mutable
db_credentials = ("db.test.local", 5432)                          # tuple: ordered & immutable
user_payload = {"id": 42, "role": "admin", "active": True}        # dict: key-value mapping
assigned_permissions = {"read:reports", "write:tests", "run:ci"}  # set: unique & unordered
```

---

### 1.1 Lists (`list`) — Ordered, Mutable Test Sequences

A `list` is a dynamic array that preserves insertion order. In QA automation, lists represent:
- Rows returned from an HTML table (`page.locator("tr").all()`).
- Batches of user IDs to process sequentially.
- Execution queues of test cases.

```python
# Declaring a list of discovered test cases
smoke_tests = ["test_login", "test_checkout", "test_logout"]

# 1. Appending new tests to the suite
smoke_tests.append("test_password_reset")

# 2. Accessing elements: Zero-based and Negative indexing
first_test = smoke_tests[0]    # 'test_login'
last_test = smoke_tests[-1]    # 'test_password_reset' (last element)

# 3. Slicing subsets
core_tests = smoke_tests[0:2]  # ['test_login', 'test_checkout']

# 4. Removing items safely
smoke_tests.remove("test_logout")
popped_test = smoke_tests.pop()  # Removes and returns the last element

# 5. Sorting test lists
smoke_tests.sort()  # Alphabetical order
```

::: tip 💡 QA Best Practice: Negative Indexing for Dynamic Elements
When testing web pages with pagination or infinite scrolling, you frequently need to assert the *newest* item added to the bottom of the list. Instead of writing verbose length calculations like `items[len(items) - 1]`, simply use Python's clean negative indexing: `last_item = items[-1]`.
:::

---

### 1.2 Tuples (`tuple`) — Immutable Contracts

A `tuple` is an ordered collection that **cannot be modified** after creation (`immutable`). Once created, you cannot append, remove, or reassign elements.

Why do automation engineers need immutability?
- **Defensive Design:** You do not want a test helper function to accidentally overwrite critical baseline coordinates or server endpoints.
- **Pytest Parameterization:** Tuples form the standard data structure for passing input/expected pairs into `@pytest.mark.parametrize`.
- **Dictionary Keys:** Because tuples are immutable (and therefore hashable), they can serve as composite dictionary keys, whereas lists cannot!

```python
# Fixed server coordinate contract (host, port)
STAGING_SERVER = ("10.0.4.15", 8080)

# Unpacking tuples cleanly into variables
host, port = STAGING_SERVER
print(f"Connecting to {host} on port {port}...")

# Parameterized test data definition for Pytest
login_scenarios = [
    ("valid_user@qa.com", "Password123!", 200),
    ("locked_user@qa.com", "Password123!", 403),
    ("invalid_user@qa.com", "WrongPass", 401),
]

for email, password, expected_status in login_scenarios:
    print(f"Testing {email} -> expecting HTTP {expected_status}")
```

---

### 1.3 Dictionaries (`dict`) — Key-Value API Mappings

The `dict` is the undisputed monarch of backend test automation. Every REST API endpoint receives and returns JSON, which translates directly into Python dictionaries.

```python
# An API Response dictionary
response_body = {
    "status": "success",
    "data": {
        "user_id": 9921,
        "username": "qa_master",
        "email": "master@qualiadept.com",
        "roles": ["tester", "admin"]
    },
    "meta": {
        "request_duration_ms": 48.2
    }
}

# 1. Accessing nested values
user_id = response_body["data"]["user_id"]
primary_role = response_body["data"]["roles"][0]

# 2. Defensive access with .get() to prevent KeyError crashes
user_avatar = response_body["data"].get("avatar_url", "https://default.avatar/png")
missing_field = response_body.get("non_existent_key")  # Returns None instead of throwing KeyError!

# 3. Iterating keys and values
for key, value in response_body["data"].items():
    print(f"Field '{key}' has value '{value}'")
```

::: warning ⚠️ The Fatal `KeyError` Pitfall in Automated Suites
In manual testing, if a key is missing from a response, you notice it visually. In Python automation, writing `response["user"]["token"]` when `"token"` is missing immediately raises an unhandled `KeyError`, crashing the entire test before your assertions can report a proper business failure.  
**Always use `.get(key, default_value)`** when inspecting optional API properties!
:::

---

### 1.4 Sets (`set`) — Unique Elements & Lightning-Fast Membership

A `set` is an unordered collection of **unique** elements. Sets automatically eliminate duplicate entries and provide instantaneous $O(1)$ membership checks (`item in my_set`).

In QA automation, sets are invaluable for:
- Detecting duplicate user emails or invoice numbers in database exports.
- Comparing expected permissions vs. actual permissions returned by an IAM service.
- Finding missing UI menu items through set subtraction.

```python
# 1. Automatic Deduplication
raw_country_dropdown = ["Romania", "Germany", "France", "Romania", "Germany", "Spain"]
unique_countries = set(raw_country_dropdown)
print(unique_countries)  # {'France', 'Germany', 'Romania', 'Spain'}

# 2. Powerful Set Operations in Assertions
expected_nav_links = {"Home", "Courses", "Practice", "Profile", "Logout"}
actual_nav_links = {"Home", "Courses", "Profile", "Logout"}

# Set Difference: What links are missing from the UI?
missing_links = expected_nav_links - actual_nav_links
print(f"Missing navigation elements: {missing_links}")  # {'Practice'}

# Set Intersection: What elements exist in both sets?
common_links = expected_nav_links & actual_nav_links
```

---

## Chapter 2: The QualiAdept Decision Matrix 🧭

How do you decide which data structure to choose when designing an automated test suite?

| Data Structure | Syntax | Ordered? | Mutable? | Allows Duplicates? | Primary QA Automation Use Case |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **List** (`list`) | `[1, 2, 3]` | ✅ Yes | ✅ Yes | ✅ Yes | UI table rows, search results, queue of test cases to run. |
| **Tuple** (`tuple`) | `(1, 2, 3)` | ✅ Yes | ❌ No | ✅ Yes | Parameterized test fixtures, DB coordinates, fixed settings. |
| **Dictionary** (`dict`) | `{"a": 1}` | ✅ Yes* | ✅ Yes | Keys: ❌ No<br>Values: ✅ Yes | API payloads, JSON responses, configuration maps. |
| **Set** (`set`) | `{1, 2, 3}` | ❌ No | ✅ Yes | ❌ No | Verifying unique constraints, detecting missing permissions, fast lookup. |

*\* Note: Starting with Python 3.7+, standard dictionaries preserve insertion order.*

::: tip 💡 QualiAdept Real-World Analogy
- **List:** A supermarket shopping list. Items have a specific order, you can cross items off, and you can write "Milk" twice.
- **Tuple:** A sealed flight boarding pass. Your seat number and gate cannot be altered once printed.
- **Dictionary:** A digital address book. You search by person's name (unique key) to retrieve their contact info (value).
- **Set:** A secure VIP guest list. You cannot be on the list twice, and the security guard checks your name in a fraction of a second!
:::

---

## Chapter 3: Control Flow & Logical Operators 🔀

::: info 🧠 Perspective
Testing is fundamentally decision-making: *If the status is 200, verify the payload; elif the status is 422, verify the error message; else fail the test immediately.* Writing clean, idiomatic control flow keeps your test logic concise and eliminates flaky false-positives.
:::

### 3.1 Pythonic Truthiness (`bool`)

In Python, you do not need to write `if len(results) > 0:` or `if user_token != "":`. Python evaluates data structures natively for **truthiness**:

| Falsy Values (Evaluate to `False`) | Truthy Values (Evaluate to `True`) |
| :--- | :--- |
| `0`, `0.0` | Any non-zero number (`1`, `-5`, `3.14`) |
| `""` (empty string) | Non-empty strings (`"admin"`, `" "`) |
| `[]` (empty list) | Non-empty lists (`["item"]`) |
| `{}` (empty dict) | Non-empty dicts (`{"id": 1}`) |
| `set()` (empty set) | Non-empty sets (`{"a"}`) |
| `None` | Any active object instance |

```python
# Clean Pythonic test check:
response_errors = []

# Instead of: if len(response_errors) == 0:
if not response_errors:
    print("Test Passed: No error messages were registered!")
else:
    print(f"Test Failed with errors: {response_errors}")
```

---

### 3.2 Logical Operators: `and`, `or`, `not`, and `in`

```python
status_code = 200
response_time_sec = 0.45
is_authenticated = True

# Combining conditions
if status_code == 200 and response_time_sec < 1.0:
    print("Performance & Functional SLA satisfied!")

# The 'in' Membership Operator
error_banner = "Account locked: Maximum login attempts exceeded (Code: AUTH_09)"

if "locked" in error_banner and "AUTH_09" in error_banner:
    print("Correct error banner displayed to the user.")

allowed_roles = ["admin", "super_admin", "auditor"]
user_role = "tester"

if user_role not in allowed_roles:
    print(f"Access correctly denied for role: {user_role}")
```

---

## Chapter 4: Loops & List Comprehensions 🔁

### 4.1 The `enumerate()` Function — Numbering Your Test Iterations

When iterating over an array of UI rows or API items, you often need the index to report *which* specific row failed an assertion. Avoid manually managing counter variables (`i = 0 ... i += 1`). Use `enumerate()`:

```python
user_rows = ["Alice - Active", "Bob - Inactive", "Charlie - Active"]

for index, row in enumerate(user_rows, start=1):
    print(f"Row #{index}: Verifying data -> {row}")
```

---

### 4.2 The `zip()` Function — Parallel Comparison

When comparing expected test results against actual UI outcomes:

```python
expected_headers = ["ID", "Customer", "Amount", "Status"]
actual_headers = ["ID", "Customer", "Total", "Status"]

for exp, act in zip(expected_headers, actual_headers):
    assert exp == act, f"Header mismatch! Expected '{exp}', but found '{act}'"
```

---

### 4.3 List Comprehensions — The Automation Engineer's Superpower

List comprehensions allow you to filter and transform data in a single, ultra-readable line. In QA, you frequently need to pluck a specific field from an array of dictionaries:

```python
# Typical API payload: List of product records
api_products = [
    {"id": 101, "name": "Laptop Pro", "price": 1200, "in_stock": True},
    {"id": 102, "name": "Wireless Mouse", "price": 25, "in_stock": False},
    {"id": 103, "name": "4K Monitor", "price": 450, "in_stock": True},
    {"id": 104, "name": "USB-C Hub", "price": 45, "in_stock": True},
]

# 1. Traditional verbose approach (4 lines)
available_names = []
for p in api_products:
    if p["in_stock"]:
        available_names.append(p["name"])

# 2. Modern Pythonic List Comprehension (1 line!)
available_names = [p["name"] for p in api_products if p["in_stock"]]
print(available_names)  # ['Laptop Pro', '4K Monitor', 'USB-C Hub']

# 3. Extracting and converting prices above $50
premium_prices = [p["price"] for p in api_products if p["price"] > 50]
print(premium_prices)  # [1200, 450]
```

---

## Chapter 5: 🛡️ The Tester's Eye & AI Guardrails

::: info 🧠 AI Guardrails in Practice
Generative AI models (ChatGPT, GitHub Copilot) excel at writing standard loops, but frequently introduce dangerous antipatterns into test suites:
1. **Mutating a list while iterating over it:** AI often writes `for item in items: if condition: items.remove(item)`. This silently skips elements because index offsets shift dynamically during iteration!
2. **KeyError Assumptions:** AI assumes API schemas never change. When the backend renames `"user_name"` to `"username"`, AI-generated tests explode with unhandled errors instead of logging clean assertion diagnostics.
3. **Set Ordering Delusions:** AI sometimes assumes sets preserve order, writing tests like `list(my_set)[0]`. Sets are unordered; this leads to random test flakiness across different execution runs!
:::

::: warning 🕵️ The Tester's Eye: Defensive QA Rule
When parsing data collections in automated tests:
1. Never modify a list in-place while looping over it — use a list comprehension to create a filtered copy.
2. Use `.get(key)` with default values when extracting fields from external JSON.
3. Use sets for membership and uniqueness checks, but never rely on set iteration order.
:::

---

<script setup>
const challenge1Initial = `def filter_high_value_orders(orders: list, min_total: float) -> list:
    # TODO: 1. Filter orders where status is "completed" and total >= min_total
    # TODO: 2. Extract their "order_id"s
    # TODO: 3. Return the order_ids sorted in ascending numerical order
    pass

# Sample test run:
sample_orders = [
    {"order_id": 501, "status": "completed", "total": 120.0},
    {"order_id": 502, "status": "pending", "total": 350.0},
    {"order_id": 503, "status": "completed", "total": 45.0},
    {"order_id": 504, "status": "completed", "total": 290.0},
]
print("High value orders:", filter_high_value_orders(sample_orders, 100.0))
`

const challenge1TestCases = [
  {
    name: "Filter completed orders over $100 threshold",
    call: `filter_high_value_orders([
      {"order_id": 1, "status": "completed", "total": 150.0},
      {"order_id": 2, "status": "pending", "total": 500.0},
      {"order_id": 3, "status": "completed", "total": 99.9},
      {"order_id": 4, "status": "completed", "total": 250.0}
    ], 100.0)`,
    expected: [1, 4]
  },
  {
    name: "Return empty list when no order matches criteria",
    call: `filter_high_value_orders([
      {"order_id": 10, "status": "failed", "total": 900.0},
      {"order_id": 11, "status": "cancelled", "total": 400.0}
    ], 50.0)`,
    expected: []
  },
  {
    name: "Ensure results are properly sorted ascending",
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
    # TODO: 1. Identify users present in primary_users but absent in secondary_users
    # TODO: 2. Identify duplicate usernames inside secondary_users
    # TODO: 3. Return a dict with keys:
    #          "missing_in_secondary": sorted list of missing users
    #          "duplicates_in_secondary": sorted list of duplicated usernames
    pass

# Sample test run:
primary = ["alice", "bob", "charlie", "david"]
secondary = ["alice", "bob", "bob", "eve", "charlie", "charlie"]
print("Discrepancies:", find_user_discrepancies(primary, secondary))
`

const challenge2TestCases = [
  {
    name: "Detect missing users and duplicates",
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
    name: "Clean sync with no missing users and no duplicates",
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
    name: "Complete mismatch between microservices",
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

## Chapter 6: 💻 Interactive Compiler Challenges

Test and solidify your understanding of Python data structures and control flow directly inside the browser compiler below.

### Challenge 1: Filtering and Sorting High-Value Orders
**Scenario:** An E-commerce backend returns an array of customer order dictionaries. You need to extract all verified high-value transactions.  
**Requirement:** Complete `filter_high_value_orders(orders, min_total)` to return a sorted list of `order_id`s where `status == "completed"` and `total >= min_total`.

<PythonCompiler
  challenge-id="py-s2-c1"
  title="Challenge 1: Filtering and Sorting High-Value Orders"
  description="Use list comprehensions, dictionary filtering, and sorting to extract verified order IDs."
  :initial-code="challenge1Initial"
  :test-cases="challenge1TestCases"
  :solution="challenge1Solution"
  hint="Use a list comprehension: [o['order_id'] for o in orders if o.get('status') == 'completed' and o.get('total', 0) >= min_total], then wrap with sorted()."
/>

---

### Challenge 2: Detecting Data Discrepancies Across Services
**Scenario:** You are validating a database sync between two microservices. The secondary service must receive all users from the primary service without duplicates.  
**Requirement:** Implement `find_user_discrepancies(primary_users, secondary_users)` returning a dictionary with `"missing_in_secondary"` (users in primary but missing in secondary) and `"duplicates_in_secondary"` (users repeated in secondary).

<PythonCompiler
  challenge-id="py-s2-c2"
  title="Challenge 2: Detecting Data Discrepancies Across Services"
  description="Apply set operations and frequency tracking to detect sync anomalies."
  :initial-code="challenge2Initial"
  :test-cases="challenge2TestCases"
  :solution="challenge2Solution"
  hint="Use set(primary) - set(secondary) for missing users. Track duplicates by inspecting a seen set during secondary iteration."
/>

