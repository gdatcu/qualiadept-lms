# Session 3: Functions, Error Handling & File I/O in Testing

::: info 🎯 Learning Objectives
By the end of this session, you will be able to:
- Structure modular and maintainable code using **idiomatic Python functions** (`def`), leveraging optional parameters, default values, `*args`, and `**kwargs`.
- Apply **Type Hints (`typing`)** to enforce strict data contracts between testing steps and unlock rich IDE autocompletion.
- Recognize and eliminate the critical trap of **mutable default arguments**, a subtle bug that frequently corrupts test suites.
- Architect resilient test executions using Python's complete **exception handling mechanism** (`try`, `except`, `else`, `finally`, `raise`).
- Build **custom test exception classes** to clearly distinguish genuine product defects from environmental or infrastructure failures.
- Manage external test datasets safely using **Context Managers (`with open(...)`)** for plain text, CSV, and JSON (`json.loads`, `json.dumps`).
- Leverage `pathlib.Path` for cross-platform file paths that run seamlessly across Windows, macOS, Docker containers, and Linux CI runners.
- Solve interactive coding challenges directly inside the browser compiler.
:::

---

## Chapter 1: Anatomy of Reusable Test Functions ⚙️

::: info 🧠 Perspective
In manual testing, repeating 10 identical steps to set up a test user drains your productivity. In automated testing, copy-pasting the same 15 setup lines across multiple test files creates a maintenance disaster: the moment an API payload schema changes, you must manually rewrite dozens of tests. Functions are the foundational building blocks that transform repetitive manual procedures into clean, modular, and resilient automation actions.
:::

In Python, a function is a named, reusable block of code defined with the `def` keyword, followed by the function name, a parameter list in parentheses, and a colon (`:`).

```python
# A simple SLA assertion function for response durations
def assert_response_sla(duration_seconds: float, max_threshold: float = 1.0) -> None:
    """Asserts that a request duration satisfies performance SLA thresholds."""
    assert duration_seconds <= max_threshold, (
        f"SLA Breached! Request took {duration_seconds:.2f}s "
        f"(allowable limit: {max_threshold:.2f}s)"
    )

# Invocation:
assert_response_sla(0.42)           # Uses the default 1.0s threshold
assert_response_sla(1.85, 2.0)      # Overrides the threshold to 2.0s
```

---

### 1.1 Positional vs. Keyword Arguments

In Python, arguments can be passed by their position or explicitly by name (`parameter_name=value`).

```python
def build_auth_header(token: str, token_type: str = "Bearer", prefix_env: str = "PROD") -> dict:
    return {
        "Authorization": f"{token_type} {token}",
        "X-Environment-Tag": prefix_env
    }

# 1. Positional call (order matters)
header1 = build_auth_header("xyz-secret-token", "ApiKey", "STAGING")

# 2. Keyword call (readable and flexible, order does not matter)
header2 = build_auth_header(
    prefix_env="DEV",
    token="abc-admin-key",
    token_type="Bearer"
)

# 3. Default values applied
header3 = build_auth_header("standard-token")
# Result: {'Authorization': 'Bearer standard-token', 'X-Environment-Tag': 'PROD'}
```

::: tip 💡 QA Best Practice: Use Keyword Arguments in Tests!
When reviewing a test failure log or inspecting a PR, a call like:  
`create_order("cart_99", 5, True, False, 120.0)` is opaque. What does `True` represent? What does `False` toggle?  
Writing explicit keyword arguments:  
`create_order(cart_id="cart_99", items_count=5, apply_discount=True, express_delivery=False, total_price=120.0)`  
makes the test scenario crystal clear and self-documenting for every engineer on your team.
:::

---

### 1.2 The Deadly Trap: Mutable Default Arguments

This is one of the most notorious gotchas in Python programming, frequently committed by junior engineers and careless AI assistants.

::: danger 🛑 The Mutable Default Trap
In Python, default parameter values are evaluated **only once**, at the time the function is defined by the interpreter, **NOT** on every invocation! If you assign a list `[]` or dictionary `{}` as a default value, every caller that omits that argument will share the **exact same memory instance**!
:::

```python
# ❌ INCORRECT: All test cases will corrupt the same shared list!
def register_test_log(message: str, log_collector: list = []) -> list:
    log_collector.append(message)
    return log_collector

test_1_logs = register_test_log("Step 1 failed: Button missing")
print(test_1_logs)  # ['Step 1 failed: Button missing']

test_2_logs = register_test_log("Step 2 failed: API timeout")
# Unwanted surprise! Test 2 contains leaked errors from Test 1:
print(test_2_logs)  # ['Step 1 failed: Button missing', 'Step 2 failed: API timeout']
```

```python
# ✅ CORRECT: Use None as a sentinel and initialize inside the function
from typing import Optional, List

def register_test_log(message: str, log_collector: Optional[List[str]] = None) -> List[str]:
    if log_collector is None:
        log_collector = []
    log_collector.append(message)
    return log_collector

test_1_logs = register_test_log("Step 1 failed: Button missing")
print(test_1_logs)  # ['Step 1 failed: Button missing']

test_2_logs = register_test_log("Step 2 failed: API timeout")
print(test_2_logs)  # ['Step 2 failed: API timeout'] -> Completely isolated!
```

---

### 1.3 Dynamic Arguments: `*args` and `**kwargs`

When building flexible test helpers and API clients, you often cannot foresee how many parameters a specific test will require.

* `*args` (Arguments): Gathers extra positional arguments into a **tuple**.
* `**kwargs` (Keyword Arguments): Gathers extra keyword arguments into a **dictionary**.

```python
# Verifying multiple page tags simultaneously
def assert_all_tags_present(page_title: str, *required_tags: str) -> bool:
    print(f"Checking '{page_title}' for tags: {required_tags}")
    # required_tags is a tuple: ('checkout', 'payment', 'v2')
    for tag in required_tags:
        assert len(tag) > 0, "Tag cannot be empty!"
    return True

assert_all_tags_present("Checkout Page", "checkout", "payment", "v2")

# Dynamic API payload builder
def build_request_payload(endpoint: str, **custom_fields) -> dict:
    payload = {
        "target": endpoint,
        "timestamp_utc": "2026-10-31T20:00:00Z",
        "client": "QA_Automation_Core"
    }
    # custom_fields is a dictionary containing all passed keyword args
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

### 1.4 Type Hints (`typing`) — Enforcing Strong Contracts

While Python is dynamically typed, adding **Type Hints** yields massive engineering benefits in test automation architectures:
1. **Instant IDE Autocompletion:** As soon as you type `user.`, VS Code or PyCharm reveals available properties and methods.
2. **Static Code Analysis (`mypy`):** Catch type mismatches in CI before tests even start executing.
3. **Clarity:** New team members instantly understand what data structures an assertion or helper expects.

```python
from typing import List, Dict, Optional, Union, Tuple

def parse_http_codes(raw_codes: List[Union[int, str]]) -> Dict[str, int]:
    """Converts a mixed list of HTTP status codes into an aggregate health report."""
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

## Chapter 2: Robustness & Defensive Error Handling 🛡️

::: info 🧠 Perspective
In real-world software testing, environments experience outages, servers drop connections, databases hit deadlocks, and asynchronous UI elements render unpredictably. A naive test script that crashes unhandled on the first hiccup produces **flaky tests**, destroying trust in automation. A senior QA engineer builds resilient tests that catch transient failures, release system resources cleanly, and highlight authentic software bugs.
:::

---

### 2.1 The Python Exception Hierarchy

All Python exceptions inherit from `BaseException`. In everyday test automation, we catch subclasses of `Exception`:

```
BaseException
 ├── KeyboardInterrupt (Ctrl+C pressed)
 └── Exception (Base of all standard runtime errors)
      ├── TypeError (Incompatible types, e.g., "5" + 2)
      ├── ValueError (Invalid value, e.g., int("abc"))
      ├── KeyError (Missing dictionary key)
      ├── IndexError (Sequence index out of range)
      ├── FileNotFoundError (File missing on disk)
      ├── TimeoutError (Operation timed out)
      └── AssertionError (Raised when an assert check fails)
```

::: warning ⚠️ The Fatal Bare `except:` Anti-Pattern
Never write a bare `except:` without an exception type, and never write `except Exception: pass`! Doing so silences real bugs, intercepts system exit commands (`KeyboardInterrupt`), and creates dangerous false positives where broken applications are marked as "Passing".
:::

---

### 2.2 Complete Error Flow: `try`, `except`, `else`, `finally`

Python provides a 4-part structure for robust execution:

```python
def fetch_user_balance_safe(api_client, user_id: int) -> float:
    balance = 0.0
    try:
        # 1. Risky operation block
        response = api_client.get_user(user_id)
        balance = float(response["account"]["balance"])
    except KeyError as err:
        # 2. Specifically catch missing JSON schema fields
        print(f"[API SCHEMA ERROR] Key {err} missing from payload!")
        raise
    except ValueError as err:
        # 3. Catch invalid data conversions (e.g., balance was 'N/A')
        print(f"[DATA FORMAT ERROR] Could not cast balance to float: {err}")
        return 0.0
    else:
        # 4. Executes ONLY if NO exception was raised in try
        print(f"[SUCCESS] User #{user_id} balance verified: {balance}")
        return balance
    finally:
        # 5. ALWAYS executes (regardless of success or failure)
        # Essential for closing sessions, releasing locks, and logging
        print(f"[CLEANUP] Query transaction for user #{user_id} finished.")
```

---

### 2.3 Creating Custom Test Exceptions

When asserting application preconditions or custom business constraints, generic exceptions like `ValueError` provide poor diagnostic details. Custom exception classes give your test framework clear domain clarity:

```python
# Custom Exception Hierarchy for a QA Framework
class AutomationFrameworkError(Exception):
    """Base exception for all test framework failures."""
    pass

class TestDataCorruptedException(AutomationFrameworkError):
    """Raised when extracted test fixtures or CSV data are malformed."""
    pass

class ServiceUnavailableException(AutomationFrameworkError):
    """Raised when the target environment fails health checks (503/504)."""
    pass

# Usage in a test runner:
def verify_environment_health(status_code: int):
    if status_code in (502, 503, 504):
        raise ServiceUnavailableException(
            f"UAT environment is down (HTTP {status_code}). Aborting test suite execution!"
        )
```

---

## Chapter 3: Working with External Data & Files (File I/O) 📂

::: info 🧠 Perspective
**Data-Driven Testing** is the cornerstone of scalable test automation. Rather than authoring 50 repetitive tests for 50 form permutations, you write one parameterized test that reads external data files (JSON, CSV, YAML) and verifies the system dynamically.
:::

---

### 3.1 The `with open(...)` Context Manager

When handling files in Python, **never call `f = open()` followed manually by `f.close()`**. If an assertion fails before `f.close()`, the file descriptor remains locked by the OS.

Always use `with open(...) as f:`. This guarantees that the file will be closed immediately when the block exits, even if an unhandled exception occurs!

```python
# Saving execution logs to disk
def save_test_log(filename: str, log_lines: list) -> None:
    # 'w' = overwrite mode, encoding='utf-8' = universal character support
    with open(filename, mode="w", encoding="utf-8") as file:
        for line in log_lines:
            file.write(f"{line}\n")

# Appending to an existing audit file
def append_audit_trail(filename: str, event_message: str) -> None:
    # 'a' = append mode (preserves previous content)
    with open(filename, mode="a", encoding="utf-8") as file:
        file.write(f"[AUDIT] {event_message}\n")
```

---

### 3.2 Parsing and Writing JSON (`json` module)

JSON is the universal lingua franca of modern REST APIs. Python's built-in `json` module provides 4 essential methods:

| Method | Direction | Source / Target |
| :--- | :--- | :--- |
| **`json.loads(text)`** | String $\to$ Python dict | Parses a raw JSON string (e.g., from an HTTP response). |
| **`json.load(file)`** | File $\to$ Python dict | Reads and deserializes a `.json` file from disk. |
| **`json.dumps(dict)`** | Python dict $\to$ JSON string | Serializes Python data into a formatted JSON string. |
| **`json.dump(dict, file)`** | Python dict $\to$ `.json` file | Writes structured data directly into a file on disk. |

```python
import json

# 1. json.loads(): Parsing raw API responses
raw_response = '{"status": 200, "user": {"id": 101, "email": "alex@qa.com"}}'
payload = json.loads(raw_response)
print(payload["user"]["email"])  # alex@qa.com

# 2. json.dumps(): Pretty-printing payloads with indent=2
new_user = {
    "name": "Maria Pop",
    "roles": ["tester", "automation_engineer"],
    "preferences": {"notifications": True, "theme": "dark"}
}
json_string = json.dumps(new_user, indent=2)
print(json_string)

# 3. json.dump() & json.load(): Persisting and retrieving test fixtures
fixture_path = "test_user_fixture.json"

# Write fixture:
with open(fixture_path, "w", encoding="utf-8") as f:
    json.dump(new_user, f, indent=2)

# Load fixture:
with open(fixture_path, "r", encoding="utf-8") as f:
    loaded_data = json.load(f)
assert loaded_data["name"] == "Maria Pop"
```

---

### 3.3 Parsing CSV Files (`csv.DictReader`)

For large tables of test cases (login permutations, zip codes, product catalogs), CSV files remain a QA staple because manual testers and product owners can easily edit them in Excel.

```python
import csv

# Given 'test_users.csv':
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

# Every row automatically parses into a dict mapping header names to row values:
# [
#   {"username": "admin_qa", "password": "Pass123!", "expected_role": "admin"},
#   {"username": "standard_user", "password": "User987!", "expected_role": "viewer"},
#   ...
# ]
```

---

### 3.4 Cross-Platform Paths with `pathlib.Path`

A frequent source of CI failure occurs when path separators work on Windows (`C:\tests\data\file.json`) but crash with `FileNotFoundError` on Linux CI workers (`/tests/data/file.json`).

The standard `pathlib` module eliminates cross-platform path issues completely:

```python
from pathlib import Path

# Locate current test directory dynamically:
CURRENT_DIR = Path(__file__).parent

# Safely construct cross-platform paths using the '/' operator:
DATA_FILE = CURRENT_DIR / "fixtures" / "user_data.json"

print("Absolute Path:", DATA_FILE.resolve())
print("File exists?:", DATA_FILE.exists())

# Read file directly in one clean line:
if DATA_FILE.exists():
    content = DATA_FILE.read_text(encoding="utf-8")
```

---

## Chapter 4: QualiAdept Decision Matrix 🧭

| QA Automation Scenario | Recommended Approach | Key Advantage |
| :--- | :--- | :--- |
| **Building flexible API test payloads** | Helper functions with `**kwargs` and `None` sentinels | Allows individual test scenarios to override only target fields. |
| **Handling unstable network requests** | `try ... except (TimeoutError, ConnectionError):` with retries | Prevents intermittent false-negatives in automated pipelines. |
| **Tabular test data (hundreds of rows)** | `csv.DictReader` | Easily exported from databases and editable in spreadsheets. |
| **Complex nested API test contracts** | External `.json` fixtures with `json.load()` | Accurately preserves nested hierarchies, arrays, booleans, and nulls. |
| **Referencing test data files in CI** | `pathlib.Path(__file__).parent` | Guarantees correct path resolution on Windows, macOS, and Linux containers. |

---

## Chapter 5: 🛡️ The Tester's Eye & AI Guardrails

::: info 🧠 AI Traps in Functions & File I/O
AI assistants often produce fragile code when generating test helpers:
1. **`except Exception: pass`:** The most dangerous antipattern in QA. When an API call fails or a file is missing, the code silently continues, validating empty or corrupted variables.
2. **Missing `encoding="utf-8"`:** On Windows, Python defaults to CP1252. Special characters or accented names will crash the test with `UnicodeDecodeError` in CI environments.
3. **Hardcoded absolute paths:** AI frequently generates paths like `open("C:/Users/tester/data.json")`, which instantly fail on any other developer machine or Docker image.
4. **Unclosed file descriptors:** Writing `f = open(...)` without `with` locks files on disk, preventing cleanup routines from deleting temporary test artifacts.
:::

::: warning 🕵️ The Tester's Eye: Code Review Checklist
Before approving a test helper or automation script:
- [ ] Are default parameters using mutable objects (`[]` or `{}`)? Replace with `None`.
- [ ] Are type hints attached to all arguments and return values?
- [ ] Are caught exceptions specific (`KeyError`, `FileNotFoundError`, not bare `Exception`)?
- [ ] Are files opened strictly inside `with open(..., encoding="utf-8")` blocks?
- [ ] Are file paths constructed with `pathlib.Path` relative to the script location?
:::

---

<script setup>
const challenge1Initial = `import json

def parse_and_validate_user(raw_payload: str) -> dict:
    # TODO: 1. Parse raw_payload using json.loads()
    #       If invalid JSON syntax is encountered (raises json.JSONDecodeError),
    #       return: {"valid": False, "error": "Invalid JSON format"}
    #
    # TODO: 2. Check for the presence of mandatory keys: "user_id", "email", and "role"
    #       If any mandatory key is missing,
    #       return: {"valid": False, "error": "Missing mandatory keys"}
    #
    # TODO: 3. If payload is valid, return:
    #       {"valid": True, "user_id": user_id, "email": email, "role": role}
    pass

# Sample test run:
sample_good = '{"user_id": 404, "email": "tester@qa.com", "role": "admin"}'
print("Valid payload parsed:", parse_and_validate_user(sample_good))
`

const challenge1TestCases = [
  {
    name: "Successfully parse and validate compliant payload",
    call: `parse_and_validate_user('{"user_id": 101, "email": "ana@test.com", "role": "tester"}')`,
    expected: {
      "valid": true,
      "user_id": 101,
      "email": "ana@test.com",
      "role": "tester"
    }
  },
  {
    name: "Catch invalid JSON syntax",
    call: `parse_and_validate_user('{"user_id": 102, "email": invalid_no_quotes}')`,
    expected: {
      "valid": false,
      "error": "Invalid JSON format"
    }
  },
  {
    name: "Detect missing mandatory key ('role')",
    call: `parse_and_validate_user('{"user_id": 103, "email": "george@qa.com"}')`,
    expected: {
      "valid": false,
      "error": "Missing mandatory keys"
    }
  },
  {
    name: "Empty or corrupted string input",
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
    # TODO: Receives a variable number of test result dictionaries (*args).
    # Each dictionary has the format: {"test_name": str, "passed": bool, "duration_ms": float}
    #
    # Calculate and return a summary dictionary with:
    # - "total_tests": total number of tests (int)
    # - "passed_tests": number of tests where passed == True (int)
    # - "failed_tests": number of tests where passed == False (int)
    # - "average_duration_ms": average test duration rounded to 2 decimal places (float)
    #
    # If no tests are supplied (*test_results is empty), return:
    # {"total_tests": 0, "passed_tests": 0, "failed_tests": 0, "average_duration_ms": 0.0}
    pass

# Sample test run:
t1 = {"test_name": "test_login", "passed": True, "duration_ms": 120.5}
t2 = {"test_name": "test_checkout", "passed": False, "duration_ms": 340.0}
print("Metrics calculated:", build_execution_metrics(t1, t2))
`

const challenge2TestCases = [
  {
    name: "Calculate metrics for mixed test execution suite",
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
    name: "Handle edge case with zero supplied test arguments",
    call: `build_execution_metrics()`,
    expected: {
      "total_tests": 0,
      "passed_tests": 0,
      "failed_tests": 0,
      "average_duration_ms": 0.0
    }
  },
  {
    name: "All passing tests with precise durations",
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

## Chapter 6: 💻 Interactive Compiler Challenges

Test and sharpen your understanding of functions, defensive error handling, and structured data handling directly inside the browser compiler below.

### Challenge 1: Defensive JSON Parsing and Schema Validation
**Scenario:** A data ingestion module receives raw JSON payloads from an external service. You need a defensive parser that validates data integrity before downstream assertions run.  
**Requirement:** Implement `parse_and_validate_user(raw_payload)` per the instructions, catching `json.JSONDecodeError` and asserting the presence of mandatory keys (`user_id`, `email`, `role`).

<PythonCompiler
  challenge-id="py-s3-c1"
  title="Challenge 1: Defensive JSON Parsing and Schema Validation"
  description="Handle JSON decoding exceptions and validate schemas to protect against fatal KeyError crashes."
  :initial-code="challenge1Initial"
  :test-cases="challenge1TestCases"
  :solution="challenge1Solution"
  hint="Wrap json.loads in a try/except block. Then check required_keys.issubset(data.keys()) to verify schema integrity."
/>

---

### Challenge 2: Dynamic Test Execution Metrics Generator (`*args`)
**Scenario:** Following an automated test run, individual test result dictionaries must be aggregated into an executive summary report.  
**Requirement:** Implement `build_execution_metrics(*test_results)` accepting variable arguments and generating statistics (`total_tests`, `passed_tests`, `failed_tests`, `average_duration_ms`).

<PythonCompiler
  challenge-id="py-s3-c2"
  title="Challenge 2: Dynamic Test Execution Metrics Generator (*args)"
  description="Build a flexible aggregator using *args to calculate test pass rates and average execution times."
  :initial-code="challenge2Initial"
  :test-cases="challenge2TestCases"
  :solution="challenge2Solution"
  hint="Check if not test_results for the empty case. Otherwise count passed/failed tests and compute the average duration."
/>

