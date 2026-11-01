---
title: "Sesiunea 2: Structuri de Date & Colecții în Testare — Liste, Seturi, Map-uri și Operații Funcționale (Java Streams vs. Kotlin Collections)"
description: "Ghid practic comparativ între Java 21 și Kotlin 2.0: imutabilitate, List, Set, Map, Stream API vs. funcții de extensie funcționale și provocări în IDE integrat."
---

# Sesiunea 2: Structuri de Date & Colecții în Testare — Liste, Seturi, Map-uri și Operații Funcționale (Java Streams vs. Kotlin Collections)

<CourseProgress />

În orice proiect serios de testare automată — fie că lucrezi cu Selenium, Playwright, RestAssured sau Appium — **datele nu vin niciodată izolate**. Testele manipulate într-un framework real implică grupuri de entități:
- O listă cu rezultatele execuției a 50 de teste automate;
- Un set de tag-uri unice (`@Smoke`, `@Regression`, `@Checkout`) pentru filtrare în CI/CD;
- Un dicționar (Map) de headere HTTP (`Authorization`, `Content-Type`) sau parametri de configurare per mediu de test;
- Extragerea și asertarea valorilor dintr-un tabel HTML cu sute de rânduri sau dintr-un payload JSON complex.

În această sesiune, explorăm în paralel modul în care **Java 21 (prin Collections Framework & Stream API)** și **Kotlin 2.0 (prin colecții imutabile native & funcții de extensie de ordin înalt)** rezolvă aceleași probleme fundamentale de manipulare a datelor de testare.

---

## 1. Liste: Imutabilitate vs. Mutabilitate

O listă este o colecție ordonată de elemente care permite duplicate și acces direct prin index.

### ☕ În Java 21
În Java clasic, cele mai multe liste erau mutabile (`ArrayList`). Începând cu Java 9+, avem metoda fabrică `List.of(...)` care creează **liste imutabile** (orice apel `add()` aruncă `UnsupportedOperationException` la runtime):

```java
// 1. Listă imutabilă (recomandată pentru date de test constante)
List<String> environments = List.of("staging", "preprod", "production");
// environments.add("dev"); // EROARE la runtime: UnsupportedOperationException!

// 2. Listă mutabilă (când acumulăm dinamic rezultate în timpul testului)
List<String> failedTestNames = new ArrayList<>();
failedTestNames.add("test_checkout_coupon");
failedTestNames.add("test_login_invalid_password");

// Acces prin index și dimensiune:
String firstEnv = environments.get(0);
int totalEnvs = environments.size();
```

### 🟣 În Kotlin 2.0
Kotlin tratează imutabilitatea direct la nivelul sistemului de tipuri: interfața de bază `List<T>` este **doar de citire (read-only)**, iar dacă dorești să modifici elemente, trebuie să folosești explicit `MutableList<T>`:

```kotlin
// 1. Listă read-only (imutabilă): listOf(...)
val environments = listOf("staging", "preprod", "production")
// environments.add("dev") // EROARE DE COMPILARE direct în IDE! Metoda nici nu există.

// 2. Listă mutabilă: mutableListOf(...)
val failedTestNames = mutableListOf<String>()
failedTestNames.add("test_checkout_coupon")
failedTestNames += "test_login_invalid_password" // Operatorul += elegant

// Acces prin index cu paranteze drepte [] și proprietatea .size:
val firstEnv = environments[0]
val totalEnvs = environments.size
```

> [!TIP] 🧠 Avantaj QA Kotlin
> În Kotlin, încercarea de a modifica o listă imutabilă este respinsă **înainte de execuție**, direct la compilare! În Java, greșeala se descoperă abia în timpul rulării testelor prin `UnsupportedOperationException`.

---

## 2. Seturi: Unicitate și Eliminarea Duplicatelor

Un `Set` este o colecție care **nu permite elemente duplicate**. În testare, seturile sunt esențiale pentru:
1. Verificarea că un API nu returnează ID-uri sau coduri de eroare duplicate;
2. Extragerea tag-urilor unice dintr-o suită de teste;
3. Căutarea rapidă a apartenenței cu complexitate `O(1)` prin tabele de dispersie (hash table).

### ☕ În Java 21
```java
// Set imutabil creat rapid:
Set<String> criticalTags = Set.of("@Smoke", "@Security", "@Payment");

// Set mutabil bazat pe HashSet:
Set<String> collectedUsers = new HashSet<>();
collectedUsers.add("user_qa_1");
collectedUsers.add("user_qa_2");
collectedUsers.add("user_qa_1"); // Ignorat automat, nu generează eroare!

// Verificare apartenență:
boolean isSmoke = criticalTags.contains("@Smoke");
System.out.println("Useri unici colectați: " + collectedUsers.size()); // 2
```

### 🟣 În Kotlin 2.0
```kotlin
// Set imutabil: setOf(...)
val criticalTags = setOf("@Smoke", "@Security", "@Payment")

// Set mutabil: mutableSetOf(...)
val collectedUsers = mutableSetOf("user_qa_1", "user_qa_2", "user_qa_1")

// Verificare apartenență cu operatorul nativ 'in':
val isSmoke = "@Smoke" in criticalTags
println("Useri unici colectați: ${collectedUsers.size}") // 2
```

---

## 3. Dicționare (Map-uri): Headere HTTP & Configurație

Un `Map` asociază chei unice cu valori (perechi `Key -> Value`). În QA, este structura ideală pentru payload-uri de request, parametri URL, cookie-uri și headere HTTP.

### ☕ În Java 21: `Map.of` și `HashMap`
```java
// Map imutabil de până la 10 perechi (cheie, valoare alternativ):
Map<String, String> defaultHeaders = Map.of(
    "Content-Type", "application/json",
    "Accept", "application/json",
    "X-Client-Version", "2.4.0"
);

// Map mutabil bazat pe HashMap:
Map<String, Object> testContext = new HashMap<>();
testContext.put("browser", "chromium");
testContext.put("headless", true);
testContext.put("timeoutMs", 5000);

// Preluare cu valoare implicită fallback:
String authToken = (String) testContext.getOrDefault("token", "ANON_TOKEN");
```

### 🟣 În Kotlin 2.0: `mapOf` și Sintaxa `to`
Kotlin oferă o sintaxă expresivă de perechi folosind funcția infix `to`:

```kotlin
// Map imutabil: mapOf(...)
val defaultHeaders = mapOf(
    "Content-Type" to "application/json",
    "Accept" to "application/json",
    "X-Client-Version" to "2.4.0"
)

// Map mutabil: mutableMapOf(...)
val testContext = mutableMapOf<String, Any>(
    "browser" to "chromium",
    "headless" to true,
    "timeoutMs" to 5000
)

// Modificare și acces cu paranteze drepte []:
testContext["browser"] = "firefox"
val authToken = testContext.getOrDefault("token", "ANON_TOKEN")
```

---

## 4. Operații Funcționale: Java Stream API vs. Funcții Kotlin

Una dintre cele mai mari diferențe de productivitate dintre Java și Kotlin apare la filtrarea și transformarea colecțiilor:

### Scenariul QA:
Avem o listă cu rezultatele testelor: `["AUTH_PASS", "PAYMENT_FAIL", "CART_PASS", "ORDER_FAIL"]`. Dorim să filtrăm doar testele eșuate (`FAIL`), să le extragem numele curat și să le numărăm.

### ☕ În Java: `list.stream().filter(...).map(...).toList()`
În Java, colecțiile nu au metode funcționale directe; trebuie să creezi mai întâi un flux prin `.stream()`, să aplici operațiile intermediare și apoi să închizi fluxul printr-o operație terminală precum `.toList()` sau `.collect()`:

```java
List<String> rawResults = List.of("AUTH_PASS", "PAYMENT_FAIL", "CART_PASS", "ORDER_FAIL");

List<String> failedTests = rawResults.stream()
    .filter(res -> res.contains("FAIL"))
    .map(res -> res.replace("_FAIL", ""))
    .toList();

System.out.println("Eșuate: " + failedTests); // [PAYMENT, ORDER]
```

### 🟣 În Kotlin: Operații Directe pe Colecție (`.filter`, `.map`)
În Kotlin, nu este nevoie de niciun `.stream()`. Orice colecție are zeci de funcții funcționale native care primesc lambda-uri concise cu parametrul implicit `it`:

```kotlin
val rawResults = listOf("AUTH_PASS", "PAYMENT_FAIL", "CART_PASS", "ORDER_FAIL")

val failedTests = rawResults
    .filter { it.contains("FAIL") }
    .map { it.replace("_FAIL", "") }

println("Eșuate: $failedTests") // [PAYMENT, ORDER]
```

> [!NOTE] ⚡ Comparație Sintactică
> | Operație | ☕ Java 21 | 🟣 Kotlin 2.0 |
> | :--- | :--- | :--- |
> | **Inițiere procesare** | `list.stream()` | Direct pe `list` |
> | **Filtrare** | `.filter(item -> item.isValid())` | `.filter { it.isValid() }` |
> | **Transformare** | `.map(item -> item.getName())` | `.map { it.name }` |
> | **Finalizare** | `.toList()` sau `.collect(...)` | Returnează direct o nouă listă |
> | **Numărare condiționată** | `.filter(...).count()` | `.count { ... }` |
> | **Verificare existență** | `.anyMatch(...)` | `.any { ... }` |

---

## 5. Laborator Interactiv: Provocări cu Colecții în Java & Kotlin

Rezolvă fiecare provocare în compilatorul integrat, testează rezultatele apăsând **„Rulează Codul”** și validează suita de aserțiuni automate cu **„Verifică Soluția”**!

<script setup>
const challenge1Java = `public class TestFilter {
    // Filtreaza si returneaza doar testele care contin "FAIL" sau "FLAKY":
    public static List<String> getProblematicTests(List<String> testResults) {
        // TODO: Filtreaza si returneaza doar elementele care contin "FAIL" sau "FLAKY"
        return List.of();
    }

    public static void main(String[] args) {
        List<String> sample = List.of("LOGIN_PASS", "CHECKOUT_FAIL", "API_FLAKY", "SEARCH_PASS");
        System.out.println("Probleme: " + getProblematicTests(sample));
    }
}`

const challenge1Kotlin = `// Filtreaza si returneaza doar testele care contin "FAIL" sau "FLAKY":
fun getProblematicTests(testResults: List<String>): List<String> {
    // TODO: Filtreaza si returneaza doar elementele care contin "FAIL" sau "FLAKY" (indiciu: .filter { ... })
    return listOf()
}

fun main() {
    val sample = listOf("LOGIN_PASS", "CHECKOUT_FAIL", "API_FLAKY", "SEARCH_PASS")
    println("Probleme: \${getProblematicTests(sample)}")
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
    name: 'Filtrează corect FAIL și FLAKY dintr-o suită mixtă',
    call: 'getProblematicTests(["LOGIN_PASS", "PAYMENT_FAIL", "CART_FLAKY", "PROFILE_PASS"])',
    expected: ["PAYMENT_FAIL", "CART_FLAKY"]
  },
  {
    name: 'Returnează listă goală când toate testele sunt PASS',
    call: 'getProblematicTests(["T1_PASS", "T2_PASS", "T3_PASS"])',
    expected: []
  },
  {
    name: 'Păstrează toate elementele când toate sunt eșuate',
    call: 'getProblematicTests(["AUTH_FAIL", "DB_FAIL"])',
    expected: ["AUTH_FAIL", "DB_FAIL"]
  }
]

const challenge2Java = `public class TagExtractor {
    // Curata o lista de tag-uri:
    // 1. Elimina duplicatele (folosind Set sau .distinct())
    // 2. Converteste fiecare tag la majuscule (toUpperCase)
    // Returneaza lista de tag-uri unice
    public static List<String> getUniqueUpperTags(List<String> rawTags) {
        // TODO: Elimina duplicatele si trece tag-urile la majuscule
        return List.of();
    }

    public static void main(String[] args) {
        List<String> tags = List.of("smoke", "regression", "smoke", "api", "api");
        System.out.println("Tag-uri unice: " + getUniqueUpperTags(tags));
    }
}`

const challenge2Kotlin = `// Curata o lista de tag-uri:
// 1. Converteste fiecare tag la majuscule (toUpperCase)
// 2. Elimina duplicatele (folosind .distinct() sau toSet())
fun getUniqueUpperTags(rawTags: List<String>): List<String> {
    // TODO: Elimina duplicatele si trece tag-urile la majuscule
    return listOf()
}

fun main() {
    val tags = listOf("smoke", "regression", "smoke", "api", "api")
    println("Tag-uri unice: \${getUniqueUpperTags(tags)}")
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
    name: 'Elimină duplicatele și trece la majuscule',
    call: 'getUniqueUpperTags(["smoke", "regression", "smoke"])',
    expected: ["SMOKE", "REGRESSION"]
  },
  {
    name: 'Funcționează corect pe o listă deja unică',
    call: 'getUniqueUpperTags(["e2e", "ui"])',
    expected: ["E2E", "UI"]
  },
  {
    name: 'Returnează listă goală pentru input gol',
    call: 'getUniqueUpperTags([])',
    expected: []
  }
]
</script>

### Provocarea 1: Filtrarea Testelor Flaky & Eșuate

<JavaKotlinCompiler
  challenge-id="jvm-s2-c1"
  title="Provocarea 1: Filtrarea Testelor Eșuate și Flaky"
  description="Construiește funcția getProblematicTests(testResults) care primește o listă de string-uri cu rezultate și returnează doar acele elemente care conțin 'FAIL' sau 'FLAKY'. Rezolvă în Java sau în Kotlin și validează aserțiunile!"
  :initial-java="challenge1Java"
  :initial-kotlin="challenge1Kotlin"
  :java-solution="challenge1JavaSolution"
  :kotlin-solution="challenge1KotlinSolution"
  hint="În Java folosește 'testResults.stream().filter(t -> t.contains(\'FAIL\') || t.contains(\'FLAKY\')).toList()'. În Kotlin scrie direct 'testResults.filter { it.contains(\'FAIL\') || it.contains(\'FLAKY\') }'!"
  :test-cases="challenge1Tests"
/>

---

### Provocarea 2: Extragerea și Normalizarea Tag-urilor de Testare

<JavaKotlinCompiler
  challenge-id="jvm-s2-c2"
  title="Provocarea 2: Deduplicarea și Normalizarea Tag-urilor QA"
  description="Implementează metoda getUniqueUpperTags(rawTags) care primește o listă de tag-uri (ex: ['smoke', 'regression', 'smoke']), convertește fiecare tag la majuscule și elimină toate duplicatele!"
  :initial-java="challenge2Java"
  :initial-kotlin="challenge2Kotlin"
  :java-solution="challenge2JavaSolution"
  :kotlin-solution="challenge2KotlinSolution"
  hint="În Java poți folosi stream().map(t -> t.toUpperCase()).distinct().toList() sau un HashSet. În Kotlin poți scrie direct 'rawTags.map { it.toUpperCase() }.distinct()'!"
  :test-cases="challenge2Tests"
/>

---

## 6. Rezumatul Diferențelor Cheie (Cheat Sheet)

| Concept | ☕ Java 21 LTS | 🟣 Kotlin 2.0 | Recomandare în QA |
| :--- | :--- | :--- | :--- |
| **Listă Read-Only** | `List.of("A", "B")` (runtime unmodifiable) | `listOf("A", "B")` (compile-time read-only) | Folosește liste read-only pentru date de test fixe; Kotlin te protejează direct la compilare. |
| **Listă Mutabilă** | `new ArrayList<>()` | `mutableListOf()` | Folosește liste mutabile pentru stocarea rezultatelor dinamice în timpul execuției suitei. |
| **Set & Deduplicare** | `Set.of(...)` / `new HashSet<>()` | `setOf(...)` / `mutableSetOf()` | Util pentru validarea unicității identificatorilor (UUID, coduri de eroare, CNP). |
| **Map & Headere HTTP** | `Map.of("k", "v")` / `new HashMap<>()` | `mapOf("k" to "v")` / `mutableMapOf()` | Sintaxa `to` din Kotlin face configurarea headerelor și a payload-urilor extrem de curată. |
| **Filtrare Colecții** | `list.stream().filter(...).toList()` | `list.filter { it... }` | Kotlin elimină nevoia de `.stream()` și `.collect()`, reducând codul de procesare la jumătate. |
| **Transformare (Map)** | `list.stream().map(...).toList()` | `list.map { it... }` | Proiecția rapidă a entităților (ex: extragerea numelor dintr-o listă de obiecte `TestCaseResult`). |

În sesiunea următoare, vom trece la **Funcții, Metode & Gestiunea Erorilor în QA**: vom învăța despre parametri default și parametri numiți în Kotlin versus supraincărcarea metodelor în Java, Checked vs. Unchecked Exceptions și crearea de **Extension Functions** pentru acțiuni reziliente de testare!

