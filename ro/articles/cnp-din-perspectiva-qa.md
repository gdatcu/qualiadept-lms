---
title: CNP-ul din Perspectiva unui Software QA - Tot Ce Trebuie Să Știi
description: Află cum să testezi riguros un câmp de CNP folosind tehnici de test design, validare pe 3 niveluri și calculul cifrei de control.
---

# 📋 CNP-ul din Perspectiva unui Software QA: Tot Ce Trebuie Să Știi

*Publicat de comunitatea QualiAdept • ⏱️ 7 min lectură*

---

Salutare, comunitate QualiAdept! Astăzi abordăm un subiect pe cât de comun în aplicațiile din România, pe atât de interesant din punct de vedere al testării: **Codul Numeric Personal (CNP)**.

Fie că lucrezi la o aplicație bancară, la un sistem de resurse umane sau la un portal e-commerce care necesită facturare, te-ai lovit cu siguranță de el. Dar ce este mai exact CNP-ul dincolo de un șir de 13 cifre și cum ne asigurăm noi, ca QA, că aplicațiile noastre îl gestionează corect?

---

## Ce este CNP-ul? (Pe scurt)

Codul Numeric Personal este identificatorul unic al fiecărui cetățean român (sau rezident), atribuit la naștere (sau la obținerea rezidenței/cetățeniei). Structura sa nu este aleatoare; cele 13 cifre codifică informații specifice după următorul format:

$$\text{S AA LL ZZ JJ NNN C}$$

* **S:** Sexul și secolul în care s-a născut persoana (ex: `1`/`2` pentru 1900-1999, `5`/`6` pentru 2000-2099).
* **AA:** Ultimele două cifre ale anului nașterii.
* **LL:** Luna nașterii (`01`-`12`).
* **ZZ:** Ziua nașterii (`01`-`28`/`29`/`30`/`31`, în funcție de lună și an bisect).
* **JJ:** Codul județului (sau sectorului) nașterii (`01`-`52`).
* **NNN:** Un număr secvențial alocat (`001`-`999`) pentru a diferenția persoanele născute în aceeași zi și județ.
* **C:** Cifra de control, calculată printr-un algoritm matematic pe baza primelor 12 cifre.

---

## CNP-ul din Perspectiva QA

Ca ingineri QA, nu privim CNP-ul doar ca pe un simplu câmp de text. Pentru noi, este un algoritm, o validare de business, date sensibile (PII - Personally Identifiable Information) și o potențială sursă de bug-uri.

Când testăm un câmp de CNP, trebuie să avem în vedere mai multe aspecte:

![Fluxul Validării CNP-ului](/images/articles/cnp-validation-flow.jpg)
<span class="image-caption">Fig. 1 - Arhitectura pe 3 niveluri a validării CNP-ului (UI, API și Bază de Date)</span>

* **Validarea Sintactică (Formatul):** Permite doar 13 caractere? Permite doar cifre?
* **Validarea Semantică (Structura):** Se conformează cifrele regulilor (luni valide, zile valide în funcție de an/lună)?
* **Validarea Matematică:** Este cifra de control corectă?
* **Validarea de Business:** Corespunde CNP-ul introdus cu vârsta declarată? Cu sexul? Este deja înregistrat (pentru unicitate)?
* **Securitate și Privacy (GDPR):** Cum este stocat? Cum este afișat (este mascat)?

---

## Cum Testăm un Câmp de CNP: Scenarii și Tehnici

Iată un ghid practic pentru a acoperi exhaustiv testarea unui câmp CNP, folosind tehnici de test design (**Boundary Value Analysis**, **Equivalence Partitioning**).

### 1. Testarea Validării de Bază (Positive & Negative)

* **Happy Path (Valid):** Introdu un CNP perfect valid. Aplicația trebuie să îl accepte.
* **Lungime incorectă (Negative):**
  * 12 cifre (prea scurt).
  * 14 cifre (prea lung).
* **Caractere invalide (Negative):**
  * Litere (`190010112345a`).
  * Caractere speciale (`190010112345@`).
  * Spații (la început, la sfârșit, la mijloc).

---

### 2. Testarea Structurii (Equivalence Partitioning & Boundary Value Analysis)

Aici intrăm în logica structurii CNP-ului. Testăm fiecare componentă:

| Atribut / Câmp | Valid (Clase de Echivalență) | Invalid (Scenarii Negative) |
| :--- | :--- | :--- |
| **Lungime Exactă** | 13 caractere | `< 13` caractere, `> 13` caractere |
| **Tip de Date** | Doar cifre (`0-9`) | Litere (`A-Z`), Caractere Speciale, Spații |
| **Valori Limită (Luni)** | `01`, `12` | `00`, `13` |

#### Detalii suplimentare pentru verificarea structurii:

* **S (Sex/Secol):**
  * *Valide:* `1`, `2`, `5`, `6`, `7`, `8`, `9` (cifre folosite în mod curent).
  * *Invalide:* `0`, `3`, `4` (în funcție de cerințele aplicației, unele pot fi valide istoric, dar de obicei sunt invalidate în sisteme moderne).
* **LL (Luna):**
  * *Valide:* `01`, `12`.
  * *Invalide:* `00`, `13`.
* **ZZ (Ziua) - Corelarea cu Luna și Anul (AA):** *Acesta este un punct clasic de bug-uri!*
  * Luni cu 31 zile: Testează `31` (valid), `32` (invalid).
  * Luni cu 30 zile (ex: Aprilie - 04): Testează `30` (valid), `31` (invalid).
  * Februarie (An bisect, ex: anul 24): Testează `29` (valid), `30` (invalid).
  * Februarie (An non-bisect, ex: anul 23): Testează `28` (valid), `29` (invalid).
* **JJ (Județ):**
  * *Valide:* `01` - `52` (codurile județelor + sectoare București + Călărași/Giurgiu).
  * *Invalide:* `00`, `53+`.

---

### 3. Testarea Cifrei de Control (C)

Aplicația ar trebui (în mod ideal) să valideze CNP-ul matematic, nu doar formatul. Algoritmul înmulțește primele 12 cifre cu numărul constant `279146358279` și folosește un modulo 11 pentru a determina cifra finală.

> [!TIP]
> **Scenariu de test:** Generează un CNP valid (folosind un tool online sau un script). Schimbă ultima cifră cu oricare altă cifră.  
> **Rezultat Așteptat:** Aplicația trebuie să respingă CNP-ul, returnând o eroare de tipul *"CNP invalid"*.

---

### 4. Testarea de Business și Logica Aplicației

* **Unicitate:** Dacă aplicația permite crearea de conturi, încearcă să înregistrezi doi utilizatori diferiți cu același CNP.
* **Corelarea Datelor (Data Consistency):**
  * Dacă în formular utilizatorul selectează sexul *"Feminin"*, dar CNP-ul începe cu `"1"` (*Masculin*).
  * Dacă se aplică o restricție de vârstă (ex: doar peste 18 ani), folosește un CNP care generează o vârstă de 17 ani. Aplicația trebuie să calculeze corect vârsta din `AA LL ZZ` și să restricționeze accesul.

---

### 5. Generarea Datelor de Test

> [!WARNING]
> Nu poți folosi date reale (CNP-urile colegilor) din cauza reglementărilor **GDPR**!

* **Generatoare Online:** Există instrumente dedicate care creează CNP-uri valide sintactic și algoritmic, ideale pentru testare.
* **Scripturi Custom:** Scrie un mic script (în TypeScript/JavaScript/Python) care să genereze CNP-uri conform algoritmului oficial. Aceasta este abordarea recomandată pentru automatizare.
* **Calculatoare de Cifră de Control:** Tool-uri care îți validează matematic un CNP.

---

## Concluzie

Testarea unui CNP este un exemplu excelent despre cum un câmp aparent banal necesită o atenție deosebită. Nu este suficient să testăm doar lungimea; trebuie să verificăm algoritmul, logica din spatele datelor și alinierea cu cerințele de business.

Tu cum testezi de obicei CNP-urile în proiectele tale? Folosești scripturi automate sau te bazezi pe generatoare externe? Lasă-ne un comentariu mai jos!

*Happy Testing, comunitate QualiAdept!*

<ArticleInteractions />
