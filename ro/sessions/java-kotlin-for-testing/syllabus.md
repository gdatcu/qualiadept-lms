# **Java vs. Kotlin pentru Testare Automată: Paralelă Practică & Ecosistemul JVM**

- ☕ **Java 21 LTS** vs 🟣 **Kotlin 2.0**
- 🎯 **Nivel:** Începător / Intermediar (QA Manual spre QA Automation & Arhitectură Testare)
- ⏱️ **Durată:** 8 Sesiuni Exhaustive
- 💻 **Focus:** Fiecare concept și provocare se rezolvă de două ori — în Java și în Kotlin, cu IDE & compilator interactiv integrat în browser!

---

## **🎯 De ce o Paralelă Java vs. Kotlin pentru QA?**

Ecosistemul **JVM (Java Virtual Machine)** este fundamentul absolut al testării automate enterprise la nivel mondial:
- **Selenium WebDriver**, **Playwright for Java**, **RestAssured**, **Appium**, **TestNG**, **JUnit 5** și **Kotest** rulează toate pe JVM.
- Timp de două decenii, **Java** a fost standardul industrial indubitabil. Însă în ingineria modernă de calitate, **Kotlin** a revoluționat productivitatea prin **concizie extremă, Null Safety la nivel de compilator, eliminarea codului boilerplate și suport nativ pentru DSL-uri de testare fluente**.
- Deoarece Java și Kotlin au **interoperabilitate 100% binară**, poți folosi biblioteci Java într-un proiect Kotlin și invers, fără overhead.

Acest curs te învață să gândești ca un adevărat inginer JVM: vei înțelege **cum se traduce fiecare linie de cod în ambele limbaje**, care sunt avantajele fiecăruia și cum să alegi unealta optimă pentru proiectele tale de testare!

---

## **📅 Structura Curriculei (Syllabus)**

### **Modulul 1: Fundamentele Limbajelor & Sintaxă Comparată**

*4 Sesiuni | De la Hello World la OOP & Null Safety*

> * **[Sesiunea 1: Primii Pași în JVM — Sintaxă, Variabile, Tipuri de Date și Structuri de Control în Java vs. Kotlin](/ro/sessions/java-kotlin-for-testing/session-1.html)** <SessionBadge :challenges="['jvm-s1-c1', 'jvm-s1-c2']" lang="ro" />  
>   * Arhitectura JVM pentru QA: Bytecode, JDK vs. JRE, rolul mașinii virtuale.  
>   * Structura programului & Entrypoint: `public static void main` vs. `fun main()`.  
>   * Variabile & Imutabilitate: `final` în Java vs. `val` și `var` în Kotlin.  
>   * Null Safety & Coșmarul NPE: De ce `NullPointerException` e bug-ul #1 în teste și cum îl elimină Kotlin din faza de compilare (`String?`, Elvis `?:`, safe call `?.`).  
>   * String-uri & Rapoarte: Concatenare și `String.format` vs. String Templates native `$var` și `${expr}`.  
>   * Structuri de control: `if-else` ca instrucțiune vs. `if` ca expresie și structura `when` versus `switch-case`.  
>   * Bucle și iterații: for clasic vs. for-each și range-uri Kotlin (`0..10`, `until`, `step`).  
>   * *Provocări în IDE:* Validarea codurilor HTTP de răspuns și formatarea rapoartelor de execuție cu Null Safety.
>
> * **[Sesiunea 2: Structuri de Date & Colecții în Testare (Java vs. Kotlin)](/ro/sessions/java-kotlin-for-testing/session-2.html)** <SessionBadge :challenges="['jvm-s2-c1', 'jvm-s2-c2']" lang="ro" />  
>   * Colecții imutabile vs. mutabile: `List.of` / `ArrayList` vs. `listOf` / `mutableListOf`.  
>   * Seturi (`Set`) și Dicționare (`Map` / `HashMap`): Organizarea datelor de test, header-e HTTP și payload-uri JSON.  
>   * Operații funcționale de filtrare și transformare: `Stream API` (`.filter()`, `.map()`, `.collect()`) în Java vs. funcții de extensie native în Kotlin (`.filter`, `.map`, `.associateBy`).  
>   * *Provocări în IDE:* Filtrarea testelor eșuate dintr-un set de rezultate de testare și căutarea rapidă după tag-uri.
>
> * **Sesiunea 3: Funcții, Metode & Gestiunea Erorilor în QA**  
>   * Definirea metodelor: Signaturi explicite în Java vs. parametri default și parametri numiți în Kotlin (`retry(count = 3, timeoutMs = 1000)`).  
>   * Gestiunea excepțiilor: Checked Exceptions în Java vs. Unchecked Exceptions în Kotlin; blocurile `try-catch-finally`.  
>   * Noțiuni de Extension Functions în Kotlin: Cum adaugi metode noi claselor existente fără moștenire (ex: `WebElement.shouldBeVisible()`).  
>   * *Provocări în IDE:* Un mecanism de retry rezilient pentru acțiuni flaky de UI și validarea aserțiunilor.
>
> * **Sesiunea 4: Programare Orientată pe Obiecte (OOP) & Data Classes**  
>   * Clase, constructori și încapsulare: Boilerplate-ul clasic Java (getters, setters, `equals`, `hashCode`, `toString`) vs. **Kotlin Data Classes** (`data class User(val email: String, val role: String)`).  
>   * Moștenire și Polimorfism: Clasa `BaseTest` și `BasePage` în arhitecturile de testare.  
>   * Interfețe și clase abstracte: Definirea contractelor de testare pentru drivere multiple (Chrome, Firefox, Mobile).  
>   * *Provocări în IDE:* Modelarea unui payload complet de utilizator și cont de client pentru teste de API.

---

### **Modulul 2: Arhitectură de Testare & Framework-uri Moderne**

*4 Sesiuni | JUnit 5, Mocking, RestAssured & POM*

> * **Sesiunea 5: Unit Testing & Aserțiuni cu JUnit 5 & Kotest**  
>   * Adnotările de ciclu de viață: `@Test`, `@BeforeEach`, `@AfterEach`, `@BeforeAll`, `@AfterAll`.  
>   * Tehnici avansate de aserțiuni: `Assertions.assertEquals` vs. Fluent Matchers (`assertThat` și Kotest assertions `shouldBe`).  
>   * Teste parametrizate: `@ParameterizedTest`, `@ValueSource`, `@CsvSource` pentru Data-Driven Testing.
>
> * **Sesiunea 6: Testarea API-urilor REST cu RestAssured în Java & Kotlin**  
>   * Structura Given / When / Then în RestAssured.  
>   * Serializarea și deserializarea automată cu Jackson / Gson / Kotlinx Serialization.  
>   * Validarea codurilor de stare, a schemelor JSON și a timpilor de răspuns (SLA).
>
> * **Sesiunea 7: Arhitectura Page Object Model (POM) în Selenium & Playwright**  
>   * De ce POM rămâne standardul de aur în automatizarea Web UI.  
>   * Implementarea POM în Java: `FindBy`, inițializarea elementelor, sincronizări explicite.  
>   * Implementarea POM în Kotlin: Lazy loading (`by lazy`), proprietăți concise și DSL-uri lizibile.
>
> * **Sesiunea 8: Proiect Final Capstone & Integrare CI/CD**  
>   * Construirea unui framework hibrid complet (API + UI).  
>   * Generarea rapoartelor vizuale cu Allure Report.  
>   * Rularea testelor în GitHub Actions și bune practici pentru pipeline-uri robuste.

