---
title: "Session 2: Data Structures & Collections in Testing — Lists, Sets, Maps & Functional Operations (Java Streams vs. Kotlin Collections)"
description: "Comprehensive practical comparison between Java 21 and Kotlin 2.0: immutability, List, Set, Map, Stream API vs. functional collection extensions, with an in-browser IDE."
---

# Session 2: Data Structures & Collections in Testing — Lists, Sets, Maps & Functional Operations (Java Streams vs. Kotlin Collections)

<CourseProgress />

In any production-grade automated testing suite — whether you are driving browsers with Playwright or Selenium, verifying microservices with RestAssured, or automating mobile apps with Appium — **data never exists in isolation**. Real-world QA automation is driven by groups of entities:
- A list of execution results across 50 automated test runs;
- A set of distinct test tags (`@Smoke`, `@Regression`, `@Checkout`) for targeted CI/CD execution;
- A dictionary (Map) of HTTP headers (`Authorization`, `Content-Type`) or environment configuration variables;
- Extracting and asserting row values across HTML data tables or deeply nested JSON payloads.

In this session, we compare how **Java 21 (via the Collections Framework & Stream API)** and **Kotlin 2.0 (via native read-only collections & higher-order extension functions)** solve these fundamental test data manipulation challenges.

---

## 1. Lists: Immutability vs. Mutability

A list is an ordered collection that permits duplicate elements and provides index-based random access.

### ☕ In Java 21
In legacy Java, most lists were mutable (`ArrayList`). Since Java 9+, the factory method `List.of(...)` provides **unmodifiable lists** (any invocation of `add()` throws an `UnsupportedOperationException` at runtime):

```java
// 1. Immutable list (recommended for constant test fixtures)
List<String> environments = List.of("staging", "preprod", "production");
// environments.add("dev"); // RUNTIME ERROR: UnsupportedOperationException!

// 2. Mutable list (used when dynamically accumulating results during a test)
List<String> failedTestNames = new ArrayList<>();
failedTestNames.add("test_checkout_coupon");
failedTestNames.add("test_login_invalid_password");

// Index-based access and size:
String firstEnv = environments.get(0);
int totalEnvs = environments.size();
```

### 🟣 In Kotlin 2.0
Kotlin integrates immutability directly into its type system: the standard `List<T>` interface is **read-only**, and if you need to mutate elements, you must explicitly declare a `MutableList<T>`:

```kotlin
// 1. Read-only (immutable) list: listOf(...)
val environments = listOf("staging", "preprod", "production")
// environments.add("dev") // COMPILATION ERROR directly in the IDE! The method does not exist.

// 2. Mutable list: mutableListOf(...)
val failedTestNames = mutableListOf<String>()
failedTestNames.add("test_checkout_coupon")
failedTestNames += "test_login_invalid_password" // Elegant += operator

// Index access with square brackets [] and .size property:
val firstEnv = environments[0]
val totalEnvs = environments.size
```

> [!TIP] 🧠 Kotlin QA Advantage
> In Kotlin, accidentally modifying an immutable list is rejected **at compile time**, before tests ever execute! In Java, the error only surfaces at runtime via `UnsupportedOperationException`.

---

## 2. Sets: Uniqueness & Deduplication

A `Set` is an unordered collection that **disallows duplicate elements**. In testing, sets are critical for:
1. Verifying that an API never returns duplicate user identifiers or transaction IDs;
2. Extracting unique tags across a large test repository;
3. Efficient `O(1)` membership lookups via hash tables.

### ☕ In Java 21
```java
// Immutable Set:
Set<String> criticalTags = Set.of("@Smoke", "@Security", "@Payment");

// Mutable Set based on HashSet:
Set<String> collectedUsers = new HashSet<>();
collectedUsers.add("user_qa_1");
collectedUsers.add("user_qa_2");
collectedUsers.add("user_qa_1"); // Silently ignored, no duplicates!

// Membership check:
boolean isSmoke = criticalTags.contains("@Smoke");
System.out.println("Unique users: " + collectedUsers.size()); // 2
```

### 🟣 In Kotlin 2.0
```kotlin
// Immutable Set: setOf(...)
val criticalTags = setOf("@Smoke", "@Security", "@Payment")

// Mutable Set: mutableSetOf(...)
val collectedUsers = mutableSetOf("user_qa_1", "user_qa_2", "user_qa_1")

// Membership check with native 'in' operator:
val isSmoke = "@Smoke" in criticalTags
println("Unique users: ${collectedUsers.size}") // 2
```

---

## 3. Dictionaries (Maps): HTTP Headers & Test Configuration

A `Map` maps unique keys to values (key-value pairs). In QA automation, it is the standard structure for request payloads, query parameters, cookies, and HTTP headers.

### ☕ In Java 21: `Map.of` and `HashMap`
```java
// Immutable Map:
Map<String, String> defaultHeaders = Map.of(
    "Content-Type", "application/json",
    "Accept", "application/json",
    "X-Client-Version", "2.4.0"
);

// Mutable Map based on HashMap:
Map<String, Object> testContext = new HashMap<>();
testContext.put("browser", "chromium");
testContext.put("headless", true);
testContext.put("timeoutMs", 5000);

// Value retrieval with safe default fallback:
String authToken = (String) testContext.getOrDefault("token", "ANON_TOKEN");
```

### 🟣 In Kotlin 2.0: `mapOf` and Infix `to` Syntax
Kotlin provides a clean pair syntax using the infix function `to`:

```kotlin
// Immutable Map: mapOf(...)
val defaultHeaders = mapOf(
    "Content-Type" to "application/json",
    "Accept" to "application/json",
    "X-Client-Version" to "2.4.0"
)

// Mutable Map: mutableMapOf(...)
val testContext = mutableMapOf<String, Any>(
    "browser" to "chromium",
    "headless" to true,
    "timeoutMs" to 5000
)

// Index access and modification via square brackets []:
testContext["browser"] = "firefox"
val authToken = testContext.getOrDefault("token", "ANON_TOKEN")
```

---

## 4. Functional Operations: Java Stream API vs. Kotlin Native Collections

One of the most noticeable daily productivity differences between Java and Kotlin lies in collection processing:

### QA Scenario:
We have a list of raw test run strings: `["AUTH_PASS", "PAYMENT_FAIL", "CART_PASS", "ORDER_FAIL"]`. We want to filter out only failing test runs (`FAIL`), extract their clean test name, and count them.

### ☕ In Java: `list.stream().filter(...).map(...).toList()`
Java collections do not feature direct functional transformations; you must convert the collection into a stream via `.stream()`, chain intermediate operations, and conclude with a terminal operation like `.toList()`:

```java
List<String> rawResults = List.of("AUTH_PASS", "PAYMENT_FAIL", "CART_PASS", "ORDER_FAIL");

List<String> failedTests = rawResults.stream()
    .filter(res -> res.contains("FAIL"))
    .map(res -> res.replace("_FAIL", ""))
    .toList();

System.out.println("Failed: " + failedTests); // [PAYMENT, ORDER]
```

### 🟣 In Kotlin: Direct Collection Operations (`.filter`, `.map`)
In Kotlin, no `.stream()` wrapper is needed. Every collection directly provides dozens of built-in functional operations accepting trailing lambdas with the implicit `it` parameter:

```kotlin
val rawResults = listOf("AUTH_PASS", "PAYMENT_FAIL", "CART_PASS", "ORDER_FAIL")

val failedTests = rawResults
    .filter { it.contains("FAIL") }
    .map { it.replace("_FAIL", "") }

println("Failed: $failedTests") // [PAYMENT, ORDER]
```

> [!NOTE] ⚡ Syntax Comparison Matrix
> | Operation | ☕ Java 21 | 🟣 Kotlin 2.0 |
> | :--- | :--- | :--- |
> | **Stream Initiation** | `list.stream()` | Direct on `list` |
> | **Filtering** | `.filter(item -> item.isValid())` | `.filter { it.isValid() }` |
> | **Mapping / Projection** | `.map(item -> item.getName())` | `.map { it.name }` |
> | **Terminal Collection** | `.toList()` or `.collect(...)` | Returns a new list directly |
> | **Conditional Count** | `.filter(...).count()` | `.count { ... }` |
> | **Existence Check** | `.anyMatch(...)` | `.any { ... }` |

---

## 5. Interactive Laboratory: Java & Kotlin Practice

Put collection fundamentals into practice directly inside our interactive in-browser compiler. Run code with **"Run Code"** and validate automated assertions using **"Verify Solution"**!

<script setup>
const challenge1Java = `public class TestFilter {
    // Filters and returns only test cases that contain "FAIL" or "FLAKY":
    public static List<String> getProblematicTests(List<String> testResults) {
        // TODO: Filter and return only elements containing "FAIL" or "FLAKY"
        return List.of();
    }

    public static void main(String[] args) {
        List<String> sample = List.of("LOGIN_PASS", "CHECKOUT_FAIL", "API_FLAKY", "SEARCH_PASS");
        System.out.println("Problems: " + getProblematicTests(sample));
    }
}`

const challenge1Kotlin = `// Filters and returns only test cases that contain "FAIL" or "FLAKY":
fun getProblematicTests(testResults: List<String>): List<String> {
    // TODO: Filter and return only elements containing "FAIL" or "FLAKY" (hint: .filter { ... })
    return listOf()
}

fun main() {
    val sample = listOf("LOGIN_PASS", "CHECKOUT_FAIL", "API_FLAKY", "SEARCH_PASS")
    println("Problems: \${getProblematicTests(sample)}")
}`

const challenge1JavaSolution = `public class TestFilter {
    public static List<String> getProblematicTests(List<String> testResults) {
        return testResults.stream()
            .filter(t -> t.contains("FAIL") || t.contains("FLAKY"))
            .toList();
    }
}`

const challenge1KotlinSolution = `fun getProblematicTests(testResults: List<String>): List<String> {
    return testResults.filter { it.contains("FAIL") || it.contains("FLAKY") }
}`

const challenge1Tests = [
  {
    name: 'Filters FAIL and FLAKY from mixed test results',
    call: 'getProblematicTests(["LOGIN_PASS", "PAYMENT_FAIL", "CART_FLAKY", "PROFILE_PASS"])',
    expected: ["PAYMENT_FAIL", "CART_FLAKY"]
  },
  {
    name: 'Returns empty list when all tests are PASS',
    call: 'getProblematicTests(["T1_PASS", "T2_PASS", "T3_PASS"])',
    expected: []
  },
  {
    name: 'Preserves all items when all tests are failures',
    call: 'getProblematicTests(["AUTH_FAIL", "DB_FAIL"])',
    expected: ["AUTH_FAIL", "DB_FAIL"]
  }
]

const challenge2Java = `public class TagExtractor {
    // Cleans up a test tag list:
    // 1. Deduplicates tags using a Set or .distinct()
    // 2. Converts each tag to uppercase (toUpperCase)
    // Returns the clean list of unique uppercase tags
    public static List<String> getUniqueUpperTags(List<String> rawTags) {
        // TODO: Deduplicate tags and convert each to uppercase
        return List.of();
    }

    public static void main(String[] args) {
        List<String> tags = List.of("smoke", "regression", "smoke", "api", "api");
        System.out.println("Unique tags: " + getUniqueUpperTags(tags));
    }
}`

const challenge2Kotlin = `// Cleans up a test tag list:
// 1. Converts each tag to uppercase (toUpperCase)
// 2. Deduplicates tags (using .distinct() or toSet())
fun getUniqueUpperTags(rawTags: List<String>): List<String> {
    // TODO: Deduplicate tags and convert each to uppercase
    return listOf()
}

fun main() {
    val tags = listOf("smoke", "regression", "smoke", "api", "api")
    println("Unique tags: \${getUniqueUpperTags(tags)}")
}`

const challenge2JavaSolution = `public class TagExtractor {
    public static List<String> getUniqueUpperTags(List<String> rawTags) {
        return rawTags.stream()
            .map(String::toUpperCase)
            .distinct()
            .toList();
    }
}`

const challenge2KotlinSolution = `fun getUniqueUpperTags(rawTags: List<String>): List<String> {
    return rawTags.map { it.toUpperCase() }.distinct()
}`

const challenge2Tests = [
  {
    name: 'Deduplicates tags and normalizes to uppercase',
    call: 'getUniqueUpperTags(["smoke", "regression", "smoke"])',
    expected: ["SMOKE", "REGRESSION"]
  },
  {
    name: 'Handles already unique tag list',
    call: 'getUniqueUpperTags(["e2e", "ui"])',
    expected: ["E2E", "UI"]
  },
  {
    name: 'Returns empty list for empty input',
    call: 'getUniqueUpperTags([])',
    expected: []
  }
]
</script>

### Challenge 1: Filtering Flaky & Failing Tests

<JavaKotlinCompiler
  challenge-id="jvm-s2-c1"
  title="Challenge 1: Filtering Flaky and Failing Tests"
  description="Implement getProblematicTests(testResults) taking a list of test run strings and returning only elements that contain 'FAIL' or 'FLAKY'. Solve in Java or Kotlin and verify your solution against the test runner!"
  :initial-java="challenge1Java"
  :initial-kotlin="challenge1Kotlin"
  :java-solution="challenge1JavaSolution"
  :kotlin-solution="challenge1KotlinSolution"
  hint="In Java use 'testResults.stream().filter(t -> t.contains(\'FAIL\') || t.contains(\'FLAKY\')).toList()'. In Kotlin use 'testResults.filter { it.contains(\'FAIL\') || it.contains(\'FLAKY\') }'!"
  :test-cases="challenge1Tests"
/>

---

### Challenge 2: Deduplicating and Normalizing Test Tags

<JavaKotlinCompiler
  challenge-id="jvm-s2-c2"
  title="Challenge 2: QA Tag Deduplication and Normalization"
  description="Implement getUniqueUpperTags(rawTags) taking a list of tags (e.g. ['smoke', 'regression', 'smoke']), converting each to uppercase, and removing all duplicates!"
  :initial-java="challenge2Java"
  :initial-kotlin="challenge2Kotlin"
  :java-solution="challenge2JavaSolution"
  :kotlin-solution="challenge2KotlinSolution"
  hint="In Java use 'stream().map(t -> t.toUpperCase()).distinct().toList()' or a HashSet. In Kotlin use 'rawTags.map { it.toUpperCase() }.distinct()'!"
  :test-cases="challenge2Tests"
/>

---

## 6. Key Differences Summary (Cheat Sheet)

| Concept | ☕ Java 21 LTS | 🟣 Kotlin 2.0 | QA Recommendation |
| :--- | :--- | :--- | :--- |
| **Read-Only List** | `List.of("A", "B")` (runtime unmodifiable) | `listOf("A", "B")` (compile-time read-only) | Use read-only lists for test fixtures; Kotlin protects against accidental mutation at compile time. |
| **Mutable List** | `new ArrayList<>()` | `mutableListOf()` | Use mutable lists for accumulating test results or failed steps dynamically. |
| **Set & Deduplication** | `Set.of(...)` / `new HashSet<>()` | `setOf(...)` / `mutableSetOf()` | Useful for validating the uniqueness of generated IDs (UUIDs, error codes, national IDs). |
| **Map & HTTP Headers** | `Map.of("k", "v")` / `new HashMap<>()` | `mapOf("k" to "v")` / `mutableMapOf()` | Kotlin's infix `to` syntax makes request payload and header configuration exceptionally readable. |
| **Collection Filtering** | `list.stream().filter(...).toList()` | `list.filter { it... }` | Kotlin removes boilerplate `.stream()` and `.collect()` calls, cutting collection processing code in half. |
| **Transformation (Mapping)** | `list.stream().map(...).toList()` | `list.map { it... }` | Fast projection of test data (e.g., mapping a list of response entities to a list of status codes). |

In the next session, we will explore **Functions, Methods & Error Handling in QA**: default and named arguments in Kotlin vs. method overloading in Java, Checked vs. Unchecked Exceptions, and writing custom **Extension Functions** for resilient test assertions!

