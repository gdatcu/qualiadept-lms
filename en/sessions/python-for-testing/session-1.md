# Session 1: First Steps in Python & Fundamental Data Types

::: info 🎯 Learning Objectives
By the end of this session, you will be able to:
- Understand why **Python** has become the industry-standard language for modern test automation frameworks.
- Master primitive data types (`str`, `int`, `float`, `bool`) and eliminate subtle type conversion pitfalls in test assertions.
- Apply surgical **string manipulation techniques** (slicing, f-strings, strip, split, replace) on DOM contents and API payloads.
- Use Regular Expressions (`re`) to extract authentication tokens, transaction IDs, and status codes.
- Apply Software Testing critical thinking to safeguard against unreliable AI-generated code.
- Solve interactive coding challenges directly inside the browser compiler.
:::

---

## Chapter 1: Why Python for QA Automation? 🐍

::: info 🧠 Perspective
In software quality engineering, the time required to write, read, and maintain a test is just as critical as its execution speed. A test suite written in a verbose language full of syntactic clutter quickly turns into an unmaintainable burden. Python conquered the test automation landscape because it removes friction between the testing concept and its execution.
:::

### 1.1 Pythonic Code — Why It Reads Like Plain English

While other programming languages demand extensive boilerplate (verbose class declarations, static type overhead, and rigid structure for even the simplest script), Python is driven by the principles of the **Zen of Python**:
- *"Readability counts."*
- *"Simple is better than complex."*

Python code reads almost like conversational English. This makes automated test scenarios crystal-clear and easily reviewable by developers, manual QA analysts, and Product Managers alike.

```python
# Quick Example: Verifying an API endpoint in Python
import requests

response = requests.get("https://api.github.com")
assert response.status_code == 200
print("API is working seamlessly!")
```

In just 4 concise lines, you have a fully functional automated API test.

### 1.2 The Premier Testing Ecosystem

1. **World-Class Test Runner:** The `pytest` framework is celebrated as the industry standard due to its modular fixtures, clean parameterization, and native assertion rewrites without bulky assertion helper classes.
2. **Modern Web Automation:** First-class native support for `Playwright` and `Selenium`, enabling rock-solid, ultra-fast end-to-end browser tests.
3. **API & Mocking Utilities:** With lightweight libraries like `requests` and `httpx`, testing API contracts and asserting JSON schemas takes mere minutes.

::: tip 💡 QualiAdept Analogy: Conversational English vs. Medieval Latin
Consider how you express a simple instruction:
- In **Java**, verifying text on a page often requires building an entire cathedral: declaring a public class, a static method, specifying every variable type, and importing boilerplate utilities — it is like drafting a notarized contract in medieval Latin just to order a coffee.
- In **Python**, you simply say: `if "Success" in response.text: print("Valid!")`. It is like clear, direct English: everyone grasps the intent instantly, and the risk of introducing bugs inside your testing code plummets!
:::

::: tip 💡 Did You Know...?
- **The Origin of the Name:** Python was not named after the snake, but after the legendary British surreal comedy troupe **Monty Python's Flying Circus**! Its creator, Guido van Rossum, wanted the language to be fun, concise, and enjoyable to read.
- **Mission-Critical Testing:** At **NASA**, Python scripts automate launch telemetry verifications for space rockets. At **Netflix**, Python serves as the backbone of Chaos Engineering tools, constantly testing the resilience of streaming systems under simulated catastrophic failures.
:::

---

## Chapter 2: Variables, Memory & Primitive Data Types 🧱

::: info 🧠 Perspective
Every software system is built on raw data: subscription prices, session tokens, response latency timestamps, or authentication flags. Understanding how Python stores, casts, and compares these values in memory is the foundation of becoming a resilient QA automation engineer.
:::

Python is **dynamically typed** yet **strongly typed**:
- **Dynamically typed:** You do not explicitly declare variable types (you don't write `int status = 200`). The Python runtime infers the type automatically at execution.
- **Strongly typed:** Python refuses to perform unsafe implicit type coercions. The operation `"200" + 5` immediately raises a `TypeError`, unlike weakly typed languages like JavaScript that would silently produce the string `"2005"`.

### 2.1 The 4 Fundamental Primitive Types

```python
# 1. Strings (str)
endpoint = "/api/v1/orders"
auth_scheme = "Bearer"

# 2. Integers (int)
expected_status = 200
retry_count = 3

# 3. Floating-Point Numbers (float)
response_time_seconds = 0.425
threshold_limit = 1.50

# 4. Booleans (bool)
is_authenticated = True
has_errors = False
```

### 2.2 Truthy and Falsy Values

In Python, every value can be evaluated within a boolean context (such as an `if` statement). Certain values are inherently considered **Falsy**:
- `None` (absence of value)
- `False`
- Numeric zeros: `0`, `0.0`
- Empty containers or strings: `""`, `[]`, `()`, `{}`

Everything else evaluates to **Truthy** (including a string containing a single space `" "` or negative integers like `-1`).

### 2.3 Type Casting

In test automation, values extracted from web elements (DOM) or CSV test datasets always arrive as strings (`str`), even when representing numbers or logical flags:

```python
# Raw data extracted from web UI:
raw_price = "149.99"
raw_quantity = "3"

# Explicit type casting:
unit_price = float(raw_price)   # 149.99 (float)
quantity = int(raw_quantity)    # 3 (int)
total = unit_price * quantity   # 449.97 (float)
```

::: tip 💡 QualiAdept Analogy: The Toolbox with Removable Stickers
In statically typed languages (like C++ or Java), a variable is a cast-iron toolbox: if stamped with "Integers", you can never place text inside it without breaking the box.

In **Python**, a variable name is simply a removable paper sticker affixed to an object in memory. The label `status` is currently pasted onto the number `200`. You can peel off `status` and stick it onto the string `"OK"` anytime. However, the object itself strictly enforces its nature: you cannot force the number to behave like text without conscious conversion.
:::

::: warning 🕵️ The Tester's Eye: Dynamic Typing Pitfalls & The Equality Illusion
The most elusive bugs in automated testing originate from false assumptions about types:

* **The Equality Illusion `"200" == 200`:**
  In Python, `"200" == 200` evaluates to **`False`**! If you retrieve an HTTP status code from an HTML attribute (which arrives as `"200"`) and assert `assert actual_status == 200`, your test will fail falsely, generating unnecessary triage noise.
* **The Floating-Point Trap:**
  Try evaluating this in Python: `0.1 + 0.2 == 0.3`. The result is surprisingly **`False`**!  
  Due to the IEEE 754 binary floating-point specification, `0.1 + 0.2` is represented as `0.30000000000000004`.  
  *Golden QA Rule:* When asserting prices, taxes, or currency rates, never use strict equality `==` on floats! Use `round(total, 2) == 0.3` or `math.isclose(a, b, abs_tol=1e-5)`.
* **The `bool("False")` Conversion Trap:**
  If an API query parameter is `"false"` and you convert it using `bool("False")`, it evaluates to **`True`**! In Python, any non-empty string is `True`. Only the empty string `""` evaluates to `False`.
:::

::: info 🧪 Reflection Exercise: The bool() Trap in REST APIs
Imagine you are testing a payment gateway API where an optional URL parameter is `?is_discount_applied=false`.  
A developer wrote this in the backend:
```python
is_discount = bool(request.query_params.get("is_discount_applied"))
```
*Why will all store customers receive a free discount even when the parameter was explicitly sent as `false`? How would you design a test suite to detect this flaw?*
:::

---

## Chapter 3: String Manipulation & Regex in Real-World QA 🔍

::: info 🧠 Perspective
Over 80% of an automation engineer's daily work involves parsing and validating text: stripping whitespace from DOM elements, isolating bearer tokens from authorization headers, formatting dynamic XPath locators, and analyzing log files.
:::

### 3.1 Slicing and Indexing

Strings are ordered, immutable sequences of characters. Characters can be accessed using forward indexes `0` through `N - 1`, or negative indexes counting backwards from `-1`:

```python
status_code_raw = "STATUS:503_SERVICE_UNAVAILABLE"

# Indexing
first_char = status_code_raw[0]    # 'S'
last_char = status_code_raw[-1]     # 'E'

# Slicing: [start : stop : step]
code = status_code_raw[7:10]        # '503'
prefix = status_code_raw[:6]        # 'STATUS'
```

### 3.2 F-Strings (Modern String Formatting)

`f-strings` are the standard, most performant way to build dynamic locators and formatted log entries in modern Python:

```python
env = "staging"
user_id = 9481
test_run_id = "RUN-2026-X"

# Dynamic URL and log construction
target_url = f"https://{env}.qualiadept.eu/api/users/{user_id}/orders"
log_entry = f"[{test_run_id}] Dispatching request to {target_url}"
```

### 3.3 DOM Data Sanitization: `strip()`, `replace()`, `split()`

Web elements scraped via Selenium or Playwright frequently contain invisible non-breaking spaces, trailing newlines, or currency formatting that will break raw assertions:

```python
raw_dom_text = "   \n Total Due: $1,450.00 USD \t "

# 1. strip() cleans leading and trailing whitespaces, newlines (\n), and tabs (\t)
trimmed_text = raw_dom_text.strip() # "Total Due: $1,450.00 USD"

# 2. replace() eliminates symbols and normalizes separators
numeric_part = trimmed_text.replace("Total Due: $", "").replace(" USD", "").replace(",", "")
total_val = float(numeric_part)     # 1450.0

# 3. split() breaks text by a designated delimiter
parts = trimmed_text.split(": ")    # ['Total Due', '$1,450.00 USD']
```

### 3.4 Regular Expressions (`re`) for QA Validation

When target patterns do not have fixed lengths (e.g. dynamically generated tokens or transaction IDs), regex is indispensable:

```python
import re

log_message = "2026-10-11 [INFO] User 741 generated transaction TXN-984211 successfully."

# Match pattern TXN- followed by digits
match = re.search(r"TXN-\d+", log_message)
if match:
    transaction_id = match.group(0) # "TXN-984211"
    print(f"Extracted Transaction ID: {transaction_id}")
```

::: tip 💡 QualiAdept Analogy: The Airport Luggage Conveyor Belt
Think of a string as an airport luggage conveyor belt:
- Index `[0]` is the first suitcase arriving at the belt.
- Index `[-1]` is the very last suitcase on the line, without having to manually count every preceding piece of luggage.
- Slicing `[2:5]` is like a customs officer inspecting only suitcases at positions 2, 3, and 4.
- And `.strip()` is the cleaning crew removing dust and detached tags from either end of the conveyor belt, leaving clean luggage ready for processing!
:::

::: warning 🕵️ The Tester's Eye: Invisible DOM Characters & Regex Traps
Why do automated tests pass locally on desktop but fail intermittently in CI pipelines?

* **The Non-Breaking Space (`\u00a0`):**
  In HTML, the space between numbers and currency (e.g. `100 USD`) is frequently rendered as `&nbsp;` (`\u00a0`) to prevent awkward line wrapping.  
  If your Python assertion expects `assert element.text == "100 USD"`, it will fail because standard keyboard space (ASCII 32) does not match `\u00a0` (ASCII 160)!  
  *Solution:* Always sanitize with `element.text.replace('\u00a0', ' ').strip()`.
* **Greedy (`.*`) vs. Non-Greedy (`.*?`) Regex:**
  If parsing a response containing `[TAG: A] middle text [TAG: B]` with `r"\[TAG: (.*)\]"`, a greedy regex matches all the way from the first bracket to the final bracket.  
  To safely isolate individual tokens, use non-greedy `.*?` or negated character classes `r"\[TAG: ([^\]]+)\]"`.
:::

::: info 🧪 Reflection Exercise: Unicode Characters & Diacritic Testing
What happens when your test framework processes user names containing international diacritics (`"José Müller"`) and calculates length using `len()`? Does Python 3 handle multi-byte Unicode seamlessly compared to older legacy languages?
:::

---

## Chapter 4: 📖 Applied Real-World Story: When a Type Assumption Costs Millions 💸

::: tip 📖 Applied Story: The Knight Capital Catastrophe & The UK CSV Health Incident
Software developers naturally focus on the happy path: assuming input is always pristine, numbers never overflow, and users conform to specifications. In reality, software quality is proven only when confronted with edge cases and unexpected inputs.

#### 1. The Knight Capital Collapse — $440 Million in 45 Minutes (2012)
On August 1, 2012, financial trading firm Knight Capital deployed new software for order routing. During deployment, a configuration flag previously used for a dormant high-speed test harness was mistakenly reactivated.  
Upon initialization, the servers interpreted incoming market orders as a command to buy high and sell low incessantly. Within 45 minutes, millions of erroneous trades accumulated a catastrophic loss of **$440 million**, driving the firm into bankruptcy within days. A single automated regression check validating configuration states would have prevented total annihilation in second one.

#### 2. The 16,000 Lost COVID Contact Tracing Cases in the UK (2020)
In late 2020, health authorities discovered that over 16,000 positive lab results were missing from contact tracing records.  
The technical culprit? Labs sent data in standard CSV files, but an automated ingestion pipeline imported the data into legacy Excel `.XLS` spreadsheets. The legacy format had a hard cap of **65,536 rows** (the 16-bit integer boundary). Any data row exceeding that threshold was silently truncated without triggering any alert!  
A quality engineer trained in **Boundary Value Analysis (BVA)** would have immediately tested boundaries at 65,535, 65,536, and 100,000 rows, heading off a nationwide public health crisis.
:::

---

## Chapter 5: 🤖 How Can We Survive AI? (AI vs. QA Automation) 🛡️

::: danger 🤖 How Can We Survive AI? Why GenAI Cannot Replace QA Critical Thinking
Today, anyone can prompt an AI assistant:  
*“Write a Python script to test a login form.”*  
In three seconds, AI generates beautifully formatted, syntactically clean code with comments. If AI writes code this fast, why hasn't test automation engineering been replaced?

The answer is simple: **AI generates syntax, but it does not understand system reality.**

#### 1. The Assertion Hallucination (False Positive Trap)
Large language models are optimized to generate agreeable, plausible responses. When producing automated tests, AI routinely constructs naive assertions:
```python
# Typical careless AI-generated test:
response = client.post("/api/login", json=payload)
assert response.status_code is not None  # Passes even if server returns 500!
assert "token" in response.text          # Passes even if body says "token error"!
```
AI-written tests frequently pass with flying colors even when the underlying software is completely broken, giving leadership a dangerous illusion of security.

#### 2. Lack of an Adversarial Mindset
AI is trained on standard, conventional examples ("the happy path"). It tests the ideal customer who inputs clean names and valid credit card numbers.  
A top-tier QA engineer is compensated precisely for **thinking like an attacker and thinking like chaos**:
- What happens if the password contains 10,000 Unicode emojis?
- What happens if a user double-clicks the checkout button within 5 milliseconds?
- What happens if the payment database times out halfway through the order?

#### 3. The Survival Blueprint: Become the AI Supervisor & Deterministic Verifier
Do not try to out-type an AI. Instead, use AI as a junior assistant for boilerplate speed, and apply your QA expertise to supervise it:
- **Audit Assertions:** Ensure every assertion is strict, deterministic, and verifies business truth.
- **Perform Mutation Testing:** Intentionally introduce subtle bugs into your application. If your automated test doesn't fail, the test is useless!
- **Master Python Fundamentals:** When you deeply understand data types, memory, and error handling, you can spot a hallucinated edge case inside a 200-line AI script in ten seconds.
:::

::: warning 🕵️ The Tester's Eye: The Golden Rule of AI-Assisted Code
*“If you cannot confidently explain every single line of code generated by AI, you are not allowed to commit it to the repository.”*

An automated test that you do not master is more dangerous than having no tests at all, because it provides false confidence to the entire engineering team!
:::

---

<script setup>
const challenge1Initial = `def parse_cart_price(raw_text: str) -> float:
    # TODO: 1. Clean whitespace with strip()
    # TODO: 2. Remove prefix "Total Price: $" and suffix " USD"
    # TODO: 3. Remove comma "," separators
    # TODO: 4. Cast to float and return
    pass

# Verification run:
test_sample = "  Total Price: $2,450.50 USD \\n"
print("Your function result:", parse_cart_price(test_sample))
`

const challenge1TestCases = [
  {
    name: "Price with thousands and decimals",
    call: "parse_cart_price('  Total Price: $2,450.50 USD \\n')",
    expected: 2450.50
  },
  {
    name: "Simple price without thousands",
    call: "parse_cart_price('Total Price: $99.99 USD')",
    expected: 99.99
  },
  {
    name: "Large rounded price",
    call: "parse_cart_price('   Total Price: $10,000.00 USD  ')",
    expected: 10000.0
  }
]

const challenge1Solution = `def parse_cart_price(raw_text: str) -> float:
    cleaned = raw_text.strip().replace("Total Price: $", "").replace(" USD", "")
    normalized = cleaned.replace(",", "")
    return float(normalized)
`

const challenge2Initial = `import re

def extract_auth_token(email_body: str) -> str:
    # TODO: Use re.search() to locate the pattern [AUTH-TOKEN: ...]
    # TODO: Extract and return only the inner code
    pass

sample_email = "Activate your account using security code: [AUTH-TOKEN: 894-321-AB] valid for 15 minutes."
print("Extracted token:", extract_auth_token(sample_email))
`

const challenge2TestCases = [
  {
    name: "Standard token extraction",
    call: "extract_auth_token('Activate your account using security code: [AUTH-TOKEN: 894-321-AB] valid for 15 minutes.')",
    expected: "894-321-AB"
  },
  {
    name: "Token with extra whitespace",
    call: "extract_auth_token('Your verification code is [AUTH-TOKEN:  XYZ-999-QA  ]. Do not share it.')",
    expected: "XYZ-999-QA"
  },
  {
    name: "Message with no token (negative test)",
    call: "extract_auth_token('Standard confirmation message without token attached.')",
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

## Chapter 6: 💻 Interactive Compiler Challenges

Write, run, and verify your Python code **directly in your browser** using the interactive compiler below. Your code and completion progress are automatically preserved.

### Challenge 1: Sanitizing and Parsing Cart Prices
**Scenario:** A Selenium/Playwright script extracted the raw text `"  Total Price: $2,450.50 USD \n"` from the checkout page.  
**Requirement:** Complete the `parse_cart_price(raw_text)` function to return the numeric `float` value (`2450.50`).

<PythonCompiler
  challenge-id="py-s1-c1"
  title="Challenge 1: Sanitizing and Parsing Cart Prices"
  description="Write logic to sanitize DOM text and cast it to float for reliable automated assertions."
  :initial-code="challenge1Initial"
  :test-cases="challenge1TestCases"
  :solution="challenge1Solution"
  hint="Use .strip(), eliminate the prefix and suffix with .replace(), remove thousands separators ',', then return float()."
/>

---

### Challenge 2: Extracting Authentication Tokens
**Scenario:** Upon user registration, a mocked email service delivers:  
`"Activate your account using security code: [AUTH-TOKEN: 894-321-AB] valid for 15 minutes."`  
**Requirement:** Write `extract_auth_token(email_body)` returning the clean token string (`"894-321-AB"`).

<PythonCompiler
  challenge-id="py-s1-c2"
  title="Challenge 2: Extracting Authentication Tokens"
  description="Use the re module to extract the security token inside [AUTH-TOKEN: ...]."
  :initial-code="challenge2Initial"
  :test-cases="challenge2TestCases"
  :solution="challenge2Solution"
  hint="Use re.search with a capture group: r'\\[AUTH-TOKEN:\\s*([^\\]]+)\\]' and call .strip() on group(1)."
/>
