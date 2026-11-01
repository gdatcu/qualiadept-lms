---
title: "Sesiunea 1: Primii Pași în JVM — Sintaxă, Variabile, Tipuri de Date și Structuri de Control în Java vs. Kotlin"
description: "Comparație practică exhaustivă între Java 21 și Kotlin 2.0 pentru testare automată: structură, variabile, null safety, string-uri și structuri de control cu IDE interactiv."
---

# Sesiunea 1: Primii Pași în JVM — Sintaxă, Variabile, Tipuri de Date și Structuri de Control în Java vs. Kotlin

<CourseProgress />

Bine ai venit în universul **JVM (Java Virtual Machine)** pentru testare automată! Dacă ai testat vreodată cu Selenium, Playwright for Java, RestAssured sau Appium, ai pășit deja în cel mai robust și răspândit ecosistem de testare enterprise din lume.

În acest curs nu învățăm doar un limbaj, ci **analizăm în paralel două filozofii de programare**:
1. **☕ Java (standardul Java 21 LTS)**: Limbajul clasic, structurat, orientat pe obiecte pur, cu tipizare strictă și o adopție masivă în corporații.
2. **🟣 Kotlin (versiunea 2.0)**: Limbajul modern dezvoltat de JetBrains, adoptat oficial de Google, care aduce concizie extremă, siguranță împotriva `NullPointerException` direct din faza de compilare și eliminarea completă a codului boilerplate.

Orice concept din această sesiune va fi prezentat și rezolvat **de două ori: o dată în Java și o dată în Kotlin**.

---

## 1. Arhitectura JVM: De ce Testarea Trăiește pe Java Virtual Machine?

Înainte de a scrie cod, trebuie să înțelegem ce au în comun Java și Kotlin. Răspunsul este **Bytecode-ul JVM**:

```
[ Cod Sursă Java (.java) ]      ──javac──>  [ Bytecode JVM (.class) ] ──┐
                                                                          ├──> [ JVM Runtime (Linux, Mac, Win) ]
[ Cod Sursă Kotlin (.kt) ]      ──kotlinc─> [ Bytecode JVM (.class) ] ──┘
```

> [!NOTE] 💡 Interoperabilitate 100% Binară
> Deoarece ambele compilatoare (`javac` și `kotlinc`) generează același format de instrucțiuni pe octeți (`.class`), poți scrie un test în Kotlin care apelează direct o clasă de utilitare scrisă în Java acum 10 ani, fără niciun adaptor!

| Componentă | Rol în Testarea Automată |
| :--- | :--- |
| **JDK (Java Development Kit)** | Conține uneltele de compilare (`javac`, `kotlinc`), debugger-ul și mașina virtuală. Necesar pe mașina inginerului QA și în runner-ul de CI/CD. |
| **JRE (Java Runtime Environment)** | Mediul minim necesar strict pentru execuția bytecode-ului (fără compilatoare). |
| **JVM (Java Virtual Machine)** | Motorul care execută bytecode-ul, gestionează memoria (Garbage Collector) și oferă portabilitate („*Write Once, Run Anywhere*”). |

---

## 2. Structura Programului & Entrypoint: „Hello QA World!”

Să comparăm cel mai simplu program capabil să printeze un mesaj în consola de testare:

### ☕ În Java 21
În Java, **orice bucată de cod trebuie să fie încapsulată într-o clasă**. Punctul de intrare este metoda strictă `public static void main(String[] args)`:

```java
public class HelloWorldQA {
    public static void main(String[] args) {
        System.out.println("🚀 Suita de teste a pornit cu succes!");
    }
}
```

### 🟣 În Kotlin 2.0
Kotlin elimină nevoia de a crea o clasă fictivă doar pentru a rula un script sau o funcție `main`. Permite **funcții la nivel înalt (top-level functions)**:

```kotlin
fun main() {
    println("🚀 Suita de teste a pornit cu succes!")
}
```

> [!TIP] 🧠 Comparație de lizibilitate
> - În Java: Ai nevoie de minim 5 linii de cod și de cuvintele cheie `public class`, `public static void` doar pentru a afișa un text.
> - În Kotlin: O singură funcție `fun main()` pe 3 linii (sau chiar pe o singură linie: `fun main() = println(...)`).

---

## 3. Variabile, Imutabilitate și Tipizare

În testarea automată, o regulă de aur a fiabilității este **imutabilitatea**: datele de test (URL-ul de bază, credențialele, timeout-urile) nu ar trebui să fie modificate accidental în timpul rulării unui test.

### ☕ În Java: Tipuri Explicite & `final`
În Java, tipul variabilei se declară de obicei înainte de nume, iar pentru imutabilitate se folosește cuvântul cheie `final`:

```java
// Variabilă mutabilă (valoarea poate fi reatribuită)
int retryCount = 0;
retryCount = retryCount + 1;

// Variabilă imutabilă (constantă locală - reatribuirea dă eroare de compilare)
final String baseUrl = "https://staging.api.qualiadept.eu";
final int defaultTimeoutSeconds = 30;

// Type inference introdus în Java modern prin cuvântul 'var'
var environment = "production"; // compilatorul deduce automat String
```

### 🟣 În Kotlin: `val` vs. `var`
Kotlin a integrat imutabilitatea direct în sintaxa de bază a variabilelor:

```kotlin
// Variabilă mutabilă: 'var' (Read/Write)
var retryCount = 0
retryCount += 1

// Variabilă imutabilă: 'val' (Read-Only / Constantă - Recomandat în 95% din codul de QA)
val baseUrl = "https://staging.api.qualiadept.eu"
val defaultTimeoutSeconds = 30

// Tipizare explicită opțională (Type Inference este activat nativ):
val token: String = "eyJhbGciOiJIUzI1NiIsIn..."
```

---

## 4. Null Safety & Coșmarul `NullPointerException` (NPE)

Întreabă orice inginer QA care lucrează în Java care este cea mai frecventă eroare întâlnită într-o suită automată: răspunsul este aproape mereu **`java.lang.NullPointerException`**!

### ☕ În Java: Risc Permanent de NPE
În Java clasic, orice variabilă obiect poate conține valoarea `null`. Dacă încerci să apelezi o metodă pe un obiect null fără o verificare prealabilă, testul se prăbușește:

```java
String responseToken = getAuthTokenFromApi(); // Poate returna null dacă API-ul eșuează

// Cod riscant: dacă responseToken e null -> CRASH cu NullPointerException!
if (responseToken.startsWith("Bearer")) {
    System.out.println("Autentificare validă");
}

// Soluția defensivă în Java (necesită verificări manuale peste tot):
if (responseToken != null && responseToken.startsWith("Bearer")) {
    System.out.println("Autentificare validă");
}
```

### 🟣 În Kotlin: Null Safety Garantat la Compilare
Kotlin separă strict tipurile care **pot fi null** de cele care **nu pot fi niciodată null**:

```kotlin
// 1. Tip Non-Nullable (Compilatorul REFUZĂ să primească null):
var userEmail: String = "tester@qualiadept.eu"
// userEmail = null  <-- Eroare de compilare! Codul nici măcar nu se construiește!

// 2. Tip Nullable (marcat explicit cu semnul '?'):
var authToken: String? = getAuthTokenFromApi()

// 3. Safe Call Operator (?.): apelează metoda DOAR dacă obiectul nu este null
println(authToken?.length) // Returnează lungimea sau null, dar NU se prăbușește niciodată!

// 4. Elvis Operator (?:): oferă o valoare de rezervă (fallback) dacă e null
val tokenFinal = authToken ?: "ANONYMOUS_GUEST"
```

> [!IMPORTANT] 🛡️ De ce este crucial în testare?
> Când un test automate inspectează un răspuns JSON de la un server și un câmp lipsește, în Java testul crapă instant cu `NullPointerException`. În Kotlin, folosind `response?.data?.user?.email ?: "missing"`, codul rămâne robust și aserțiunea produce un mesaj clar de eroare de business, nu un crash tehnic de limbaj!

---

## 5. String-uri, Concatenare și Rapoarte de Testare

Generarea mesajelor de aserțiune și a log-urilor necesită combinarea textului cu variabile.

### ☕ În Java: Concatenare cu `+`, `String.format` & Text Blocks
```java
String testCase = "AUTH_LOGIN_01";
int statusCode = 200;
long durationMs = 145L;

// 1. Concatenare clasică:
String log1 = "Testul " + testCase + " a returnat codul " + statusCode + " in " + durationMs + "ms";

// 2. String.format:
String log2 = String.format("Testul %s a returnat codul %d in %dms", testCase, statusCode, durationMs);
```

### 🟣 În Kotlin: String Templates Native (`$var` și `${expr}`)
Kotlin suportă interpolarea nativă a variabilelor și a expresiilor direct în interiorul ghilimelelor, fără operatorul `+`:

```kotlin
val testCase = "AUTH_LOGIN_01"
val statusCode = 200
val durationMs = 145L

// Interpolare simplă cu '$' și expresii complexe cu '${...}':
val log = "Testul $testCase a returnat codul $statusCode in ${durationMs}ms (Status: ${if (statusCode == 200) "PASS" else "FAIL"})"
```

---

## 6. Structuri de Control: Condiționale & Decizii în Testare

Să comparăm cum evaluăm codurile de stare HTTP ale unui apel de API:

### ☕ În Java: `if-else` și `switch` Clasic
```java
public class StatusCodeValidator {
    public static String evaluate(int status) {
        if (status >= 200 && status < 300) {
            return "SUCCESS";
        } else if (status >= 400 && status < 500) {
            return "CLIENT_ERROR";
        } else if (status >= 500) {
            return "SERVER_ERROR";
        } else {
            return "UNKNOWN";
        }
    }
}
```

### 🟣 În Kotlin: `if` ca Expresie și Structura `when`
În Kotlin, `if` poate returna o valoare direct. Iar în loc de switch, avem structura expresivă `when` care suportă intervale (`in 200..299`):

```kotlin
// Varianta 1: 'when' cu intervale (extrem de curată și lizibilă)
fun evaluate(status: Int): String = when (status) {
    in 200..299 -> "SUCCESS"
    in 400..499 -> "CLIENT_ERROR"
    in 500..599 -> "SERVER_ERROR"
    else -> "UNKNOWN"
}

// Varianta 2: 'if' folosit direct ca expresie de atribuire
val verdict = if (status == 200) "PASSED" else "FAILED"
```

---

## 7. Bucle și Iterații peste Date de Test (Data-Driven Testing)

Când vrem să rulăm același test pentru 5 conturi de utilizator diferite:

### ☕ În Java
```java
// Bucle peste colecții
List<String> endpoints = List.of("/api/users", "/api/orders", "/api/products");

// For-each standard
for (String endpoint : endpoints) {
    System.out.println("Verificare SLA pentru endpoint: " + endpoint);
}

// Bucle cu contor
for (int attempt = 1; attempt <= 3; attempt++) {
    System.out.println("Incercarea #" + attempt);
}
```

### 🟣 În Kotlin
```kotlin
val endpoints = listOf("/api/users", "/api/orders", "/api/products")

// Iterație naturală peste colecții
for (endpoint in endpoints) {
    println("Verificare SLA pentru endpoint: $endpoint")
}

// Iterație pe intervale (Ranges)
for (attempt in 1..3) {
    println("Incercarea #$attempt")
}
```

---

## 8. Laborator Practic: Provocări Interactive în IDE

Exersează conceptele învățate folosind compilatorul integrat! Poți scrie codul în **Java 21**, în **Kotlin 2.0**, sau poți apăsa butonul **„⚔️ Compară Java vs Kotlin”** pentru a vedea ambele execuții în paralel.

<script setup>
const challenge1Java = `public class Solution {
    // Returneaza true daca statusCode este un cod HTTP de succes (intre 200 si 299 inclusiv)
    public static boolean isSuccess(int statusCode) {
        // TODO: Returneaza true daca statusCode este in intervalul 200..299, false altfel
        return false;
    }

    public static void main(String[] args) {
        System.out.println("Status 200: " + isSuccess(200));
        System.out.println("Status 404: " + isSuccess(404));
    }
}`

const challenge1Kotlin = `// Returneaza true daca statusCode este un cod HTTP de succes (200..299)
fun isSuccess(statusCode: Int): Boolean {
    // TODO: In Kotlin poti folosi direct operatorul 'in' (ex: statusCode in 200..299)
    return false
}

fun main() {
    println("Status 200: \${isSuccess(200)}")
    println("Status 404: \${isSuccess(404)}")
}`

const challenge1JavaSolution = `public class Solution {
    public static boolean isSuccess(int statusCode) {
        return statusCode >= 200 && statusCode <= 299;
    }

    public static void main(String[] args) {
        System.out.println("200 -> " + isSuccess(200));
        System.out.println("404 -> " + isSuccess(404));
    }
}`

const challenge1KotlinSolution = `fun isSuccess(statusCode: Int): Boolean = statusCode in 200..299

fun main() {
    println("200 -> \${isSuccess(200)}")
    println("404 -> \${isSuccess(404)}")
}`

const challenge1Tests = [
  { name: '200 OK este cod de succes', call: 'isSuccess(200)', expected: true },
  { name: '201 Created este cod de succes', call: 'isSuccess(201)', expected: true },
  { name: '204 No Content este cod de succes', call: 'isSuccess(204)', expected: true },
  { name: '299 Margine superioară succes', call: 'isSuccess(299)', expected: true },
  { name: '301 Redirect nu este succes', call: 'isSuccess(301)', expected: false },
  { name: '400 Bad Request nu este succes', call: 'isSuccess(400)', expected: false },
  { name: '404 Not Found nu este succes', call: 'isSuccess(404)', expected: false },
  { name: '500 Server Error nu este succes', call: 'isSuccess(500)', expected: false }
]

const challenge2Java = `public class ReportFormatter {
    // Formateaza un log de test cu protectie impotriva valorilor null:
    // Format cerut: "[TEST: <name>] Status: <status>, Durata: <ms>ms"
    // Daca name este null, inlocuieste-l cu "UNKNOWN"
    public static String formatTestLog(String testName, String status, int durationMs) {
        // TODO: Scrie implementarea aici
        return "";
    }

    public static void main(String[] args) {
        System.out.println(formatTestLog("LOGIN_API", "PASSED", 120));
        System.out.println(formatTestLog(null, "FAILED", 450));
    }
}`

const challenge2Kotlin = `// Formateaza un log de test cu Null Safety:
// Format cerut: "[TEST: <name>] Status: <status>, Durata: <ms>ms"
// Daca testName este null, foloseste Elvis operator ?: pentru fallback-ul "UNKNOWN"
fun formatTestLog(testName: String?, status: String, durationMs: Int): String {
    // TODO: Scrie implementarea aici (indiciu: operatorul Elvis ?: si string templates)
    return ""
}

fun main() {
    println(formatTestLog("LOGIN_API", "PASSED", 120))
    println(formatTestLog(null, "FAILED", 450))
}`

const challenge2JavaSolution = `public class ReportFormatter {
    public static String formatTestLog(String testName, String status, int durationMs) {
        String safeName = (testName != null) ? testName : "UNKNOWN";
        return "[TEST: " + safeName + "] Status: " + status + ", Durata: " + durationMs + "ms";
    }
}`

const challenge2KotlinSolution = `fun formatTestLog(testName: String?, status: String, durationMs: Int): String {
    val safeName = testName ?: "UNKNOWN"
    return "[TEST: $safeName] Status: $status, Durata: \${durationMs}ms"
}`

const challenge2Tests = [
  { 
    name: 'Log valid cu nume furnizat', 
    call: 'formatTestLog("CHECKOUT_FLOW", "PASSED", 250)', 
    expected: '[TEST: CHECKOUT_FLOW] Status: PASSED, Durata: 250ms' 
  },
  { 
    name: 'Log defensiv cand numele testului este null', 
    call: 'formatTestLog(null, "FAILED", 600)', 
    expected: '[TEST: UNKNOWN] Status: FAILED, Durata: 600ms' 
  },
  { 
    name: 'Log pentru test de timeout', 
    call: 'formatTestLog("PAYMENT_GATEWAY", "TIMEOUT", 5000)', 
    expected: '[TEST: PAYMENT_GATEWAY] Status: TIMEOUT, Durata: 5000ms' 
  }
]
</script>

### Provocarea 1: Validarea Codurilor HTTP de Răspuns (Java & Kotlin)

<JavaKotlinCompiler
  challenge-id="jvm-s1-c1"
  title="Provocarea 1: Validarea Codurilor HTTP de Răspuns"
  description="Implementează metoda/funcția isSuccess(statusCode) care returnează true dacă codul HTTP este în intervalul 200..299 (inclusiv) și false altfel. Poți rezolva în Java sau în Kotlin și să apeși 'Verifică Soluția'!"
  :initial-java="challenge1Java"
  :initial-kotlin="challenge1Kotlin"
  :java-solution="challenge1JavaSolution"
  :kotlin-solution="challenge1KotlinSolution"
  hint="În Java folosește 'statusCode >= 200 && statusCode <= 299'. În Kotlin poți scrie direct expresia curată: 'statusCode in 200..299'!"
  :test-cases="challenge1Tests"
/>

---

### Provocarea 2: Formatarea Raportului de Execuție & Null Safety

<JavaKotlinCompiler
  challenge-id="jvm-s1-c2"
  title="Provocarea 2: Formatarea Raportului de Execuție & Null Safety"
  description="Construiește funcția formatTestLog(testName, status, durationMs) care generează un șir de log în formatul '[TEST: name] Status: status, Durata: ms'. Dacă testName este null, înlocuiește-l sigur cu 'UNKNOWN'!"
  :initial-java="challenge2Java"
  :initial-kotlin="challenge2Kotlin"
  :java-solution="challenge2JavaSolution"
  :kotlin-solution="challenge2KotlinSolution"
  hint="În Java verifică '(testName != null) ? testName : \'UNKNOWN\''. În Kotlin folosește operatorul Elvis: 'val safeName = testName ?: \'UNKNOWN\'' împreună cu string templates!"
  :test-cases="challenge2Tests"
/>

---

## 9. Rezumatul Diferențelor Cheie (Cheat Sheet)

| Concept | ☕ Java 21 LTS | 🟣 Kotlin 2.0 | Avantaj QA |
| :--- | :--- | :--- | :--- |
| **Clasă obligatorie** | Da (`public class Main`) | Nu (top-level functions) | Kotlin elimină clasele sterile pentru utilitare de test. |
| **Variabile constante** | `final int count = 5;` | `val count = 5` | `val` este mult mai scurt și încurajează imutabilitatea. |
| **Null Safety** | Doar convenții / `Optional<T>` | `String` vs `String?` la compilare | Kotlin elimină crash-urile de tip `NullPointerException`. |
| **String Formatting** | `"Test " + id + " OK"` | `"Test $id OK"` | String templates în Kotlin sunt extrem de lizibile în aserțiuni. |
| **Condiționale complexe** | `switch (val) { case ... }` | `when (val) { in 200..299 -> ... }` | `when` permite intervale și verificări de tip fără casting. |
| **Bucle pe intervale** | `for (int i = 0; i <= 10; i++)` | `for (i in 0..10)` | Ranges native în Kotlin simplifică buclele de retry & paging. |

În sesiunea următoare, vom explora **Structurile de Date și Colecțiile (Liste, Seturi, Map-uri)** și cum transformăm datele brute de test folosind Java Stream API versus funcțiile funcționale native din Kotlin!
