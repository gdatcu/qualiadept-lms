# **Python for Test Automation: From Fundamentals to Selenium & Selene**

- 🐍 **Format:** Theory & Live Coding
- 🎯 **Level:** Beginner / Intermediate (Manual QA to QA Automation)
- ⏱️ **Duration:** 10 Sessions
- 💻 **Focus:** Interactive Practice & In-Browser Code Challenges


## **🎯 Program Objectives**

This course is specifically tailored for **Software Quality Assurance Engineers** who want to master Python and build modern, production-grade test automation frameworks.

Unlike generic introductory programming courses, every concept in this curriculum is directly tied to real-world QA engineering challenges:
- From **string parsing and Regular Expressions** for log analysis and API token extraction,
- To **Object-Oriented Programming (OOP)** structured from day one for the **Page Object Model (POM)** architecture,
- Leading up to automated REST API testing with **pytest & requests** and robust Web UI end-to-end automation with **Selenium WebDriver** and **Selene** (the official Python port of the popular *Selenide* philosophy).

---

## **📅 Course Curriculum (Syllabus)**

### **Module 1: Python Core Essentials for QA**

*3 Sessions | Core Syntax, Data Structures & Control Flow*

> * **Session 1: First Steps in Python & Fundamental Data Types**  
>   * Why Python for QA Automation: readability, development speed, and ecosystem.  
>   * Variables, primitive data types (`str`, `int`, `float`, `bool`), and dynamic typing.  
>   * String manipulation (slicing, strip, split, replace, f-strings).  
>   * Introduction to Regular Expressions (`re` module) to extract error codes, URLs, and auth tokens.  
>   * *Compiler Challenges:* Parsing a server error log and validating email/national ID formats.
>
> * **Session 2: Data Structures & Control Flow**  
>   * Essential collections: Lists (`list`), Tuples (`tuple`), Dictionaries (`dict`), and Sets (`set`).  
>   * When and why to use each collection in test automation (test data tables, API payload mapping).  
>   * Conditional statements (`if`, `elif`, `else`) and logical operators.  
>   * Loops (`for`, `while`), `enumerate`, `zip`, and *List Comprehensions*.  
>   * *Compiler Challenges:* Filtering API response object lists and detecting data discrepancies.
>
> * **Session 3: Functions, Error Handling & File I/O**  
>   * Defining functions (`def`), default arguments, `*args`, and `**kwargs`.  
>   * Return values and type hinting basics (`typing`).  
>   * Exception handling (`try`, `except`, `finally`, `raise`) to build resilient test routines.  
>   * File reading and writing: text files, CSV, and JSON (`json.loads`, `json.dumps`).  
>   * *Compiler Challenges:* Building a reusable test data loader and validator from JSON files.

---

### **Module 2: Object-Oriented Programming (OOP) for Testing**

*1 Session | Class Architecture & Preparing for Page Object Model*

> * **Session 4: Classes, Objects, and Relationships**  
>   * The OOP paradigm through the lens of automated test architecture.  
>   * Class definition, object instantiation, the role of `self`, and the `__init__` constructor.  
>   * Instance methods, static methods (`@staticmethod`), and properties (`@property`).  
>   * Inheritance: building a reusable and modular `BasePage` class.  
>   * Encapsulation and composition vs. inheritance in test frameworks.  
>   * *Compiler Challenges:* Implementing a LoginPage class with element action and validation methods.

---

### **Module 3: Test Engine (pytest) & REST API Testing**

*3 Sessions | The Modern Standard for Python Testing*

> * **Session 5: Pytest Fundamentals & Native Assertions**  
>   * Why `pytest` is the industry standard (comparison with `unittest`).  
>   * Discovery and naming conventions (`test_*.py`, classes, functions).  
>   * Native `assert` statements and pytest's detailed error introspection.  
>   * Running tests from the command line and essential flags (`-v`, `-s`, `-k`, `-m`).  
>   * Custom test markers (`@pytest.mark.smoke`, `@pytest.mark.skip`, `@pytest.mark.xfail`).  
>   * *Compiler Challenges:* Writing unit tests with assertions for an e-commerce discount calculator.
>
> * **Session 6: Fixtures, Parametrization & Configuration Files**  
>   * Understanding `fixtures` and replacing classic `setUp` / `tearDown` boilerplate.  
>   * Fixture scopes (`scope="function"`, `"class"`, `"module"`, `"session"`).  
>   * Centralizing shared fixtures with `conftest.py`.  
>   * Data-driven testing with `@pytest.mark.parametrize`.  
>   * Configuring runs with `pytest.ini` and dependency management with `requirements.txt`.  
>   * *Compiler Challenges:* Implementing parametrized login scenarios testing boundary combinations.
>
> * **Session 7: Automated REST API Testing with Python**  
>   * HTTP fundamentals and the `requests` library (GET, POST, PUT, DELETE, PATCH).  
>   * Sending authentication headers (Bearer tokens, API keys).  
>   * Validating HTTP status codes, response times, and JSON schema contracts.  
>   * Serializing and deserializing payloads.  
>   * Designing an API client fixture integrated with pytest.  
>   * *Compiler Challenges:* End-to-end CRUD test scenario interacting with a mock REST API.

---

### **Module 4: Web UI Automation (Selenium & Selene)**

*3 Sessions | From WebDriver Mechanics to Fluent Syntax & Reporting*

> * **Session 8: Introduction to Selenium WebDriver & Locator Strategies**  
>   * Selenium 4 architecture and the W3C WebDriver standard.  
>   * Browser driver initialization (`webdriver.Chrome`, headless mode options).  
>   * Robust locator strategies: advanced CSS Selectors vs. relative XPath.  
>   * Avoiding fragile locators and locating dynamic elements.  
>   * Basic interactions: `click()`, `send_keys()`, `clear()`, `text`, `get_attribute()`.
>
> * **Session 9: Explicit Waits & Advanced Browser Interactions**  
>   * The pitfalls of `time.sleep()` and dangers of `implicitly_wait()`.  
>   * Mastering explicit waits: `WebDriverWait` and `expected_conditions` (EC).  
>   * Complex elements: multiple windows/tabs, modals, native browser alerts, and iFrames.  
>   * Working with dropdowns (`Select`), checkboxes, and JavaScript execution.  
>   * Automatic test failure screenshot capturing.
>
> * **Session 10: Selene (Selenide for Python) & Page Object Model (POM)**  
>   * Introduction to **Selene**: the concise, fluent Python equivalent to Java's *Selenide* (`browser.element('#submit').click()`).  
>   * Comparing traditional Selenium WebDriver code with Selene.  
>   * Structuring the end-to-end project using the **Page Object Model (POM)**.  
>   * Generating executive HTML test reports with **Allure Report**.  
>   * Running automated suites in Continuous Integration (GitHub Actions).

---

## **🏆 Student Portfolio & Final Deliverables**

By completing this bootcamp, students will publish a production-ready GitHub repository containing:
1. **Core Automation Utilities:** Reusable test data loaders and an authenticated REST API client.
2. **E2E Test Framework:** Built with `pytest`, `Selenium WebDriver` / `Selene`, structured cleanly with the `Page Object Model`.
3. **Multi-Browser & Headless CI Integration:** Configured to run on GitHub Actions with Allure reporting.
