# **Python for Test Automation: De la Fundamente la Selenium & Selene**

- 🐍 **Format:** Sesiuni Teoretice & Live Coding
- 🎯 **Nivel:** Începător / Intermediar (QA Manual spre QA Automation)
- ⏱️ **Durată:** 10 Sesiuni
- 💻 **Focus:** Practică interactivă & provocări de cod direct în browser


## **🎯 Obiectivele Programului**

Acest curs este conceput specific pentru **inginerii de testare software** care doresc să stăpânească limbajul Python și să construiască framework-uri profesionale de testare automată.

Spre deosebire de cursurile teoretice generice de programare, fiecare concept din acest curs este ancorat direct în scenarii reale de QA:
- De la **manipularea string-urilor și a regex-urilor** pentru validarea log-urilor și a token-urilor API,
- La **programarea orientată pe obiecte (OOP)** gândită din prima clipă pentru arhitectura **Page Object Model (POM)**,
- Până la testarea automată a API-urilor REST cu **pytest & requests** și automatizarea fluxurilor Web UI complexe folosind **Selenium WebDriver** și **Selene** (portul Python pentru conceptul consacrat de *Selenide*).

---

## **📅 Structura Curriculei (Syllabus)**

### **Modulul 1: Fundamente Python pentru QA (Python Core Essentials)**

*3 Sesiuni | Noțiuni de Bază, Structuri de Date & Controlul Fluxului*

> * **Sesiunea 1: Primii Pași în Python & Tipuri de Date Fundamentale**  
>   * De ce Python în QA Automation: lizibilitate, viteză de scriere și ecosistem.  
>   * Variabile, tipuri primitive (`str`, `int`, `float`, `bool`) și tipizare dinamică.  
>   * Manipularea șirurilor de caractere (slicing, strip, split, replace, f-strings).  
>   * Introducere în Expresii Regulate (`re` module) pentru extragere de coduri de eroare, URL-uri și token-uri.  
>   * *Provocări în compiler:* Parsarea unui log de server și validarea unui format de email/CNP.
>
> * **Sesiunea 2: Structuri de Date & Controlul Fluxului**  
>   * Colecții esențiale: Liste (`list`), Tupluri (`tuple`), Dicționare (`dict`) și Seturi (`set`).  
>   * Când și de ce folosim fiecare structură în testare (test data tables, mapare payload-uri).  
>   * Instrucțiuni condiționale (`if`, `elif`, `else`) și operatori logici.  
>   * Bucle (`for`, `while`), `enumerate`, `zip` și noțiuni de *List Comprehensions*.  
>   * *Provocări în compiler:* Filtrarea răspunsurilor din liste de obiecte și detectarea anomaliilor de date.
>
> * **Sesiunea 3: Funcții, Gestionarea Erorilor & Fișiere (I/O)**  
>   * Definirea funcțiilor (`def`), parametri default, `*args` și `**kwargs`.  
>   * Returnarea valorilor și noțiuni de Type Hints (`typing`).  
>   * Tratarea excepțiilor (`try`, `except`, `finally`, `raise`) pentru a preveni căderea scripturilor de testare.  
>   * Citirea și scrierea fișierelor: Lucrul cu fișiere text, CSV și JSON (`json.loads`, `json.dumps`).  
>   * *Provocări în compiler:* Un modul reutilizabil de citire și validare a datelor de test dintr-un fișier JSON.

---

### **Modulul 2: Programare Orientată pe Obiecte (OOP) pentru Testare**

*1 Sesiune | Arhitectura Claselor & Pregătirea pentru POM*

> * **Sesiunea 4: Clase, Obiecte și Relații între Ele**  
>   * Paradigma OOP explicată din prisma testării automate.  
>   * Definirea claselor, instanțierea obiectelor, rolul lui `self` și constructorul `__init__`.  
>   * Metode de instanță, metode statice (`@staticmethod`) și proprietăți (`@property`).  
>   * Moștenirea (Inheritance): Crearea unei clase `BasePage` reutilizabile.  
>   * Încapsulare și compoziție versus moștenire în arhitecturile de testare.  
>   * *Provocări în compiler:* Construirea unei structuri clasă pentru un panou de login cu metode de acțiune și validare.

---

### **Modulul 3: Motorul de Testare (pytest) & Testare API**

*3 Sesiuni | Standardul Modern de Testare în Python*

> * **Sesiunea 5: Pytest Fundamentals & Asertări Native**  
>   * De ce `pytest` domină ecosistemul Python (comparație cu `unittest`).  
>   * Convenții de numire pentru fișiere (`test_*.py`), clase și funcții de test.  
>   * Asertări native `assert` și rapoartele inteligente de eșec generate de pytest.  
>   * Rularea testelor din linia de comandă, flag-uri utile (`-v`, `-s`, `-k`, `-m`).  
>   * Marcaje de test (`@pytest.mark.smoke`, `@pytest.mark.skip`, `@pytest.mark.xfail`).  
>   * *Provocări în compiler:* Suită de teste unitare cu asertări pentru o componentă de calcul prețuri cu reduceri.
>
> * **Sesiunea 6: Fixtures, Parametrizare & Fișiere de Configurare**  
>   * Ce sunt `fixtures` și cum înlocuiesc vechiul model `setUp` / `tearDown`.  
>   * Domeniul de viață al unui fixture (`scope="function"`, `"class"`, `"module"`, `"session"`).  
>   * Organizarea fixture-urilor globale în `conftest.py`.  
>   * Teste conduse de date prin `@pytest.mark.parametrize`.  
>   * Fișierul de configurare `pytest.ini` și gestionarea dependențelor prin `requirements.txt`.  
>   * *Provocări în compiler:* Scenarii de testare parametrizate pentru login cu combinații de credențiale valide/invalide.
>
> * **Sesiunea 7: Testarea Automată a API-urilor REST cu Python**  
>   * Protocolul HTTP și biblioteca `requests` (GET, POST, PUT, DELETE, PATCH).  
>   * Trimiterea headerelor de autentificare (Bearer tokens, API keys).  
>   * Validarea codurilor de status HTTP, a timpilor de răspuns și a schemelor JSON.  
>   * Serializarea și deserializarea payload-urilor complexe.  
>   * Construirea unui client HTTP custom integrat cu fixtures din pytest.  
>   * *Provocări în compiler:* Test E2E de creare, interogare și ștergere resursă prin API REST.

---

### **Modulul 4: Testare Automată Web UI (Selenium & Selene)**

*3 Sesiuni | De la WebDriver la Sintaxă Fluentă & Raportare*

> * **Sesiunea 8: Introducere în Selenium WebDriver & Strategii de Localizare**  
>   * Arhitectura Selenium 4 și protocolul W3C WebDriver.  
>   * Inițializarea driverului de browser (`webdriver.Chrome`, opțiuni headless).  
>   * Strategii moderne de localizare a elementelor: CSS Selectors avansate vs. XPath relativ.  
>   * Evitarea selectoarelor fragile și identificarea corectă a elementelor dinamice.  
>   * Interacțiuni de bază: `click()`, `send_keys()`, `clear()`, `text`, `get_attribute()`.
>
> * **Sesiunea 9: Așteptări Explicite & Interacțiuni Web Avansate**  
>   * Capcana `time.sleep()` și pericolele `implicitly_wait()`.  
>   * Stăpânirea așteptărilor explicite: `WebDriverWait` și `expected_conditions` (EC).  
>   * Manipularea elementelor complexe: ferestre multiple, pop-ups, alerte native și iFrames.  
>   * Lucrul cu dropdown-uri (`Select`), checkboxes și scroll prin pagină cu JavaScript Executor.  
>   * Capturi de ecran automate la eșecul testelor.
>
> * **Sesiunea 10: Selene (Selenide în Python) & Page Object Model (POM)**  
>   * Introducere în **Selene**: conceptul de "Selenide for Python" (concise, smart auto-waiting, syntaxă fluentă `browser.element('#btn').click()`).  
>   * Selenium WebDriver tradițional vs. Selene: comparație directă de cod.  
>   * Construirea framework-ului final conform arhitecturii **Page Object Model (POM)**.  
>   * Generarea de rapoarte vizuale profesionale cu **Allure Report**.  
>   * Rularea testelor în pipeline-uri de CI/CD (GitHub Actions).

---

## **🏆 Livrabilele Finale ale Cursanților (Portofoliu GitHub)**

La finalul cursului, fiecare cursant va deține un repository GitHub profesional cu:
1. **Core Automation Utilities:** Modul Python de parsare date de test și clienți API REST.
2. **Framework de Teste E2E:** Construit cu `pytest`, `Selenium WebDriver` / `Selene` și structurat curat prin `Page Object Model`.
3. **Suport Multi-browser & Headless:** Configurat pentru rulare locală sau în GitHub Actions cu rapoarte Allure.
