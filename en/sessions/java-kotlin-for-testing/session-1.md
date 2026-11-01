---
title: "Session 1: First Steps in the JVM — Syntax, Variables, Data Types & Control Structures in Java vs. Kotlin"
description: "Comprehensive practical comparison between Java 21 and Kotlin 2.0 for automated testing: structure, variables, null safety, string templates, and control structures with interactive in-browser compiler."
---

# Session 1: First Steps in the JVM — Syntax, Variables, Data Types & Control Structures in Java vs. Kotlin

<CourseProgress />

Welcome to the **JVM (Java Virtual Machine)** universe for automated testing! If you have ever tested with Selenium, Playwright for Java, RestAssured, or Appium, you have already stepped into the most robust and widely adopted enterprise testing ecosystem in the world.

In this course, we do not simply study one language; instead, we **analyze two complementary programming philosophies side-by-side**:
1. **☕ Java (Java 21 LTS standard)**: The classic, structured, purely object-oriented language with strict static typing and massive enterprise adoption.
2. **🟣 Kotlin (version 2.0)**: The modern language created by JetBrains and officially championed by Google, featuring extreme conciseness, compile-time `NullPointerException` prevention, and the elimination of boilerplate code.

Every single concept and challenge in this course is demonstrated and solved **twice: once in Java and once in Kotlin**.

---

## 1. JVM Architecture: Why Does Testing Live on the Java Virtual Machine?

Before writing code, we must understand what Java and Kotlin share. The common foundation is **JVM Bytecode**:

```
[ Java Source Code (.java) ]      ──javac──>  [ JVM Bytecode (.class) ] ──┐
                                                                           ├──> [ JVM Runtime (Linux, Mac, Win) ]
[ Kotlin Source Code (.kt) ]      ──kotlinc─> [ JVM Bytecode (.class) ] ──┘
```

> [!NOTE] 💡 100% Binary Interoperability
> Because both compilers (`javac` and `kotlinc`) produce the exact same bytecode format (`.class`), you can write a test in Kotlin that directly invokes a Java utility class written 10 years ago without any wrappers or adapters!

| Component | Role in Automated Testing |
| :--- | :--- |
| **JDK (Java Development Kit)** | Contains compiler tools (`javac`, `kotlinc`), debugger, and virtual machine. Required on the QA engineer machine and CI/CD test runner. |
| **JRE (Java Runtime Environment)** | Minimal environment required strictly for bytecode execution (without compilers). |
| **JVM (Java Virtual Machine)** | Execution engine that runs bytecode, manages memory (Garbage Collector), and provides portability (“*Write Once, Run Anywhere*”). |

---

## 2. Program Structure & Entrypoint: “Hello QA World!”

Let's compare the simplest program capable of printing a message to the test runner console:

### ☕ In Java 21
In Java, **every piece of code must be encapsulated inside a class**. The entrypoint is the strict `public static void main(String[] args)` method:

```java
public class HelloWorldQA {
    public static void main(String[] args) {
        System.out.println("🚀 Test suite started successfully!");
    }
}
```

### 🟣 In Kotlin 2.0
Kotlin eliminates the ceremony of creating dummy classes just to execute a script or a `main` function. It supports **top-level functions**:

```kotlin
fun main() {
    println("🚀 Test suite started successfully!")
}
```

> [!TIP] 🧠 Readability Comparison
> - In Java: You need at least 5 lines of boilerplate and keywords like `public class`, `public static void` just to print text.
> - In Kotlin: A single `fun main()` function in 3 lines (or a single line expression: `fun main() = println(...)`).

---

## 3. Variables, Immutability & Typing

In automated testing, a cornerstone of test reliability is **immutability**: test fixtures and configuration (base URLs, credentials, timeouts) should never be accidentally mutated during test execution.

### ☕ In Java: Explicit Types & `final`
In Java, the variable type is declared before its identifier, and immutability is enforced via the `final` keyword:

```java
// Mutable variable (value can be reassigned)
int retryCount = 0;
retryCount = retryCount + 1;

// Immutable variable (local constant - reassignment causes a compilation error)
final String baseUrl = "https://staging.api.qualiadept.eu";
final int defaultTimeoutSeconds = 30;

// Type inference introduced in modern Java via 'var'
var environment = "production"; // compiler automatically infers String
```

### 🟣 In Kotlin: `val` vs. `var`
Kotlin bakes immutability directly into the language keywords:

```kotlin
// Mutable variable: 'var' (Read/Write)
var retryCount = 0
retryCount += 1

// Immutable variable: 'val' (Read-Only / Constant - Recommended in 95% of QA code)
val baseUrl = "https://staging.api.qualiadept.eu"
val defaultTimeoutSeconds = 30

// Type inference is automatic, but explicit type annotations are available:
val environment: String = "production"
```

---

## 4. Null Safety: The Billion-Dollar Mistake Solved

The `NullPointerException` (NPE) is the most notorious error in automated testing: an element not found on page, a missing JSON field in an API response, or an uninitialized WebDriver session causes the test to crash immediately.

### ☕ In Java: Defensive `null` Checks & Optional
Java allows any reference type to be `null`. Protection requires explicit `if (obj != null)` guards or `Optional<T>`:

```java
String responseToken = null;

// Defensive check to avoid NullPointerException:
if (responseToken != null) {
    System.out.println("Token length: " + responseToken.length());
} else {
    System.out.println("Token is missing!");
}
```

### 🟣 In Kotlin: Compile-Time Null Safety
Kotlin distinguishes nullable types from non-nullable types directly in the type system at compile time:

```kotlin
// Non-nullable type: cannot hold null under any circumstance!
var authToken: String = "Bearer token-xyz"
// authToken = null // COMPILATION ERROR! The compiler rejects this.

// Nullable type: marked explicitly with the question mark (?)
var optionalSessionId: String? = null

// Safe Call Operator (?.) - only executes length if the object is not null:
println("Session length: ${optionalSessionId?.length}") // prints 'null' without throwing an exception!

// Elvis Operator (?:) - provides a default fallback if null:
val activeSession = optionalSessionId ?: "ANONYMOUS_GUEST"
println("User session: $activeSession")
```

---

## 5. String Manipulation & String Templates

In QA assertions and test logging, building detailed diagnostic messages is an everyday task.

### ☕ In Java: Concatenation, `String.format` & Text Blocks
```java
String testCase = "AUTH_LOGIN_01";
int statusCode = 401;
double responseTime = 142.5;

// Classic concatenation:
String log1 = "Test [" + testCase + "] received status " + statusCode + " in " + responseTime + "ms";

// String.format:
String log2 = String.format("Test [%s] received status %d in %.1fms", testCase, statusCode, responseTime);
```

### 🟣 In Kotlin: Native String Templates
Kotlin supports string interpolation directly inside double quotes using `$variable` or `${expression}`:

```kotlin
val testCase = "AUTH_LOGIN_01"
val statusCode = 401
val responseTime = 142.5

// Clean, readable string template:
val log = "Test [$testCase] received status $statusCode in ${responseTime}ms"
println(log)

// Direct expressions inside templates:
println("Status category: ${if (statusCode in 200..299) "SUCCESS" else "ERROR"}")
```

---

## 6. Conditionals: `if`, `switch` vs. `when`

### ☕ In Java: `if/else` and Switch Expression
Modern Java 21 supports switch expressions, but traditional conditionals remain prevalent:

```java
int httpCode = 200;
String category;

if (httpCode >= 200 && httpCode <= 299) {
    category = "SUCCESS";
} else if (httpCode >= 400 && httpCode <= 499) {
    category = "CLIENT_ERROR";
} else {
    category = "OTHER";
}
```

### 🟣 In Kotlin: `if` as an Expression & Powerful `when`
In Kotlin, `if` is an expression that returns a value. Additionally, `when` replaces switch with range checks:

```kotlin
val httpCode = 200

// 'if' as an expression:
val status = if (httpCode == 200) "OK" else "UNEXPECTED"

// 'when' pattern matching with ranges:
val category = when (httpCode) {
    in 200..299 -> "SUCCESS"
    in 400..499 -> "CLIENT_ERROR"
    in 500..599 -> "SERVER_ERROR"
    else -> "OTHER"
}
```

---

## 7. Loops, Ranges & Iterations

### ☕ In Java
```java
// Traditional for loop:
for (int attempt = 1; attempt <= 3; attempt++) {
    System.out.println("Retry attempt #" + attempt);
}

// While loop:
int retry = 0;
while (retry < 3) {
    retry++;
}
```

### 🟣 In Kotlin
```kotlin
// Range loop with '..':
for (attempt in 1..3) {
    println("Retry attempt #$attempt")
}

// Range with step or downTo:
for (i in 10 downTo 0 step 2) {
    print("$i ")
}
```

---

## 8. Interactive Laboratory: Java vs. Kotlin Practice

Put your knowledge into practice right now inside our interactive in-browser compiler. Solve each challenge in **Java** or **Kotlin**, switch between tabs to compare approaches, and hit **"Verify Solution"** to validate against automated test assertions!

<script setup>
const challenge1Java = `public class StatusCodeValidator {
    // Validates if an HTTP response status code indicates success (200 to 299 inclusive):
    public static boolean isSuccess(int statusCode) {
        // TODO: Return true if statusCode is in 200..299 range, false otherwise
        return false;
    }

    public static void main(String[] args) {
        System.out.println("200 -> " + isSuccess(200));
        System.out.println("404 -> " + isSuccess(404));
    }
}`

const challenge1Kotlin = `// Validates if an HTTP response status code indicates success (200 to 299 inclusive):
fun isSuccess(statusCode: Int): Boolean {
    // TODO: In Kotlin you can use the 'in' range operator directly (e.g. statusCode in 200..299)
    return false
}

fun main() {
    println("200 -> \${isSuccess(200)}")
    println("404 -> \${isSuccess(404)}")
}`

const challenge1JavaSolution = `public class StatusCodeValidator {
    public static boolean isSuccess(int statusCode) {
        return statusCode >= 200 && statusCode <= 299;
    }
}`

const challenge1KotlinSolution = `fun isSuccess(statusCode: Int): Boolean = statusCode in 200..299

fun main() {
    println("200 -> \${isSuccess(200)}")
    println("404 -> \${isSuccess(404)}")
}`

const challenge1Tests = [
  { name: '200 OK is success code', call: 'isSuccess(200)', expected: true },
  { name: '201 Created is success code', call: 'isSuccess(201)', expected: true },
  { name: '204 No Content is success code', call: 'isSuccess(204)', expected: true },
  { name: '299 Upper boundary success', call: 'isSuccess(299)', expected: true },
  { name: '301 Redirect is not success', call: 'isSuccess(301)', expected: false },
  { name: '400 Bad Request is not success', call: 'isSuccess(400)', expected: false },
  { name: '404 Not Found is not success', call: 'isSuccess(404)', expected: false },
  { name: '500 Server Error is not success', call: 'isSuccess(500)', expected: false }
]

const challenge2Java = `public class ReportFormatter {
    // Formats a test log with null-pointer protection:
    // Required format: "[TEST: <name>] Status: <status>, Duration: <ms>ms"
    // If testName is null, replace it safely with "UNKNOWN"
    public static String formatTestLog(String testName, String status, int durationMs) {
        // TODO: Write implementation here
        return "";
    }

    public static void main(String[] args) {
        System.out.println(formatTestLog("LOGIN_API", "PASSED", 120));
        System.out.println(formatTestLog(null, "FAILED", 450));
    }
}`

const challenge2Kotlin = `// Formats a test log with Null Safety:
// Required format: "[TEST: <name>] Status: <status>, Duration: <ms>ms"
// If testName is null, use the Elvis operator ?: with fallback "UNKNOWN"
fun formatTestLog(testName: String?, status: String, durationMs: Int): String {
    // TODO: Write implementation here (hint: Elvis operator ?: and string templates)
    return ""
}

fun main() {
    println(formatTestLog("LOGIN_API", "PASSED", 120))
    println(formatTestLog(null, "FAILED", 450))
}`

const challenge2JavaSolution = `public class ReportFormatter {
    public static String formatTestLog(String testName, String status, int durationMs) {
        String safeName = (testName != null) ? testName : "UNKNOWN";
        return "[TEST: " + safeName + "] Status: " + status + ", Duration: " + durationMs + "ms";
    }
}`

const challenge2KotlinSolution = `fun formatTestLog(testName: String?, status: String, durationMs: Int): String {
    val safeName = testName ?: "UNKNOWN"
    return "[TEST: $safeName] Status: $status, Duration: \${durationMs}ms"
}`

const challenge2Tests = [
  { 
    name: 'Valid log with supplied name', 
    call: 'formatTestLog("CHECKOUT_FLOW", "PASSED", 250)', 
    expected: '[TEST: CHECKOUT_FLOW] Status: PASSED, Duration: 250ms' 
  },
  { 
    name: 'Defensive log when test name is null', 
    call: 'formatTestLog(null, "FAILED", 600)', 
    expected: '[TEST: UNKNOWN] Status: FAILED, Duration: 600ms' 
  },
  { 
    name: 'Log for timeout test case', 
    call: 'formatTestLog("PAYMENT_GATEWAY", "TIMEOUT", 5000)', 
    expected: '[TEST: PAYMENT_GATEWAY] Status: TIMEOUT, Duration: 5000ms' 
  }
]
</script>

### Challenge 1: HTTP Response Status Code Validation (Java & Kotlin)

<JavaKotlinCompiler
  challenge-id="jvm-s1-c1"
  title="Challenge 1: HTTP Response Status Code Validation"
  description="Implement the isSuccess(statusCode) function/method returning true if the HTTP status code is within 200..299 inclusive, and false otherwise. You can solve in Java or Kotlin and press 'Verify Solution'!"
  :initial-java="challenge1Java"
  :initial-kotlin="challenge1Kotlin"
  :java-solution="challenge1JavaSolution"
  :kotlin-solution="challenge1KotlinSolution"
  hint="In Java use 'statusCode >= 200 && statusCode <= 299'. In Kotlin use the clean range expression: 'statusCode in 200..299'!"
  :test-cases="challenge1Tests"
/>

---

### Challenge 2: Test Report Formatting & Null Safety

<JavaKotlinCompiler
  challenge-id="jvm-s1-c2"
  title="Challenge 2: Test Report Formatting & Null Safety"
  description="Construct formatTestLog(testName, status, durationMs) generating a log line in the format '[TEST: name] Status: status, Duration: ms'. If testName is null, safely fall back to 'UNKNOWN'!"
  :initial-java="challenge2Java"
  :initial-kotlin="challenge2Kotlin"
  :java-solution="challenge2JavaSolution"
  :kotlin-solution="challenge2KotlinSolution"
  hint="In Java check '(testName != null) ? testName : \'UNKNOWN\''. In Kotlin use the Elvis operator: 'val safeName = testName ?: \'UNKNOWN\'' along with string templates!"
  :test-cases="challenge2Tests"
/>

---

## 9. Key Differences Summary (Cheat Sheet)

| Concept | ☕ Java 21 LTS | 🟣 Kotlin 2.0 | QA Advantage |
| :--- | :--- | :--- | :--- |
| **Mandatory Class** | Yes (`public class Main`) | No (top-level functions) | Kotlin eliminates boilerplate class wrappers for test utilities. |
| **Constant Variables** | `final int count = 5;` | `val count = 5` | `val` is much shorter and encourages immutability. |
| **Null Safety** | Conventions / `Optional<T>` | `String` vs `String?` at compile-time | Kotlin eliminates `NullPointerException` crashes in test runs. |
| **String Formatting** | `"Test " + id + " OK"` | `"Test $id OK"` | String templates in Kotlin are exceptionally readable in assertions. |
| **Complex Conditionals** | `switch (val) { case ... }` | `when (val) { in 200..299 -> ... }` | `when` supports native range checking and smart casting. |
| **Range Loops** | `for (int i = 0; i <= 10; i++)` | `for (i in 0..10)` | Native ranges in Kotlin simplify retry and paging loops. |

In the next session, we will explore **Data Structures & Collections (Lists, Sets, Maps)** and how to transform raw test data using the Java Stream API versus Kotlin's fluent collection operations!
