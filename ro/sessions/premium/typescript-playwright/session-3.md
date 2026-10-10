# Sesiunea 3: JavaScript pentru QA Automation

<div style="display: flex; gap: 12px; flex-wrap: wrap; margin: 1.5rem 0 0.5rem 0;">
  <a href="/pdfs/sessions/premium/typescript-playwright/session-3.pdf" class="download-btn" target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24"><path d="M5 20h14v-2H5v2zm0-10h4V4h6v6h4l-7 7-7-7z"/></svg>Vizualizează suportul de curs (PDF)</a>
  <a href="https://www.youtube.com/live/T19oxxx5iKs" class="download-btn" target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24"><path d="M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 22c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48 1.73-1.73.47-.13 1.33-.22 2.65-.28 1.3-.07 2.49-.1 3.59-.1L12 2c4.19 0 6.8.16 7.83.44.9.25 1.48.83 1.73 1.73z"/></svg>Vezi înregistrarea pe YouTube</a>
</div>

::: info 🎥 Înregistrarea Sesiunii Live
Mai jos regăsești înregistrarea video completă a sesiunii live. Poți urmări explicațiile pas cu pas, demonstrațiile practice și exercițiile de live coding direct din browser.
:::

<div style="position: relative; width: 100%; padding-bottom: 56.25%; height: 0; margin: 1.5rem 0; overflow: hidden; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
  <iframe 
    src="https://www.youtube.com/embed/T19oxxx5iKs" 
    title="Sesiunea 3: JavaScript pentru QA Automation - Înregistrare Live" 
    frameborder="0" 
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
    referrerpolicy="strict-origin-when-cross-origin" 
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;" 
    allowfullscreen>
  </iframe>
</div>

::: info 📊 Prezentare PowerPoint
Mai jos regăsești prezentarea PowerPoint interactivă aferentă acestei sesiuni. Poți parcurge slide-urile direct din browser sau poți descărca suportul de curs în format PDF folosind butonul de mai sus.
:::

<div style="position: relative; width: 100%; padding-bottom: 56.25%; height: 0; margin: 1.5rem 0; overflow: hidden; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
  <iframe 
    src="https://docs.google.com/presentation/d/e/2PACX-1vQpVzjo4Oyp6tMVZT71WIkJrI5u8QtomwPJNTWQ5S4GpEOoaGdnFVxekV-ZT9R7Hrh3N1ROj8dCvXMr/pubembed?start=false&loop=false&delayms=3000" 
    frameborder="0" 
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;" 
    allowfullscreen="true" 
    mozallowfullscreen="true" 
    webkitallowfullscreen="true">
  </iframe>
</div> 

---

## Capitolul 1: Bazele programării în JS — Variabile, Tipuri de date, Structuri de control și Funcții

::: info 🎯 Obiective de învățare
La finalul acestui capitol, vei fi capabil să:
- Înțelegi rolul JavaScript-ului (JS) în testarea automatizată (Playwright) și să cunoști mediile în care îl poți executa (IDE vs. Browser).
- Declari variabile folosind `let` și `const` și să înțelegi diferența vitală dintre ele.
- Identifici și utilizezi tipurile de date primitive (`String`, `Number`, `Boolean`).
- Controlezi fluxul execuției folosind instrucțiuni decizionale (`if`/`else`) și bucle (`for`).
- Scrii blocuri de cod reutilizabile folosind funcții clasice și funcții săgeată (Arrow Functions).
:::

### 1.1 Marea trecere: De ce învățăm JavaScript?

Dacă HTML-ul este "scheletul" casei, iar CSS-ul "designul", **JavaScript (JS)** reprezintă "sistemul electric și instalația de apă". JS transformă o pagină web statică într-o aplicație interactivă.

Pentru tine, ca viitor QA Automation Engineer, JavaScript este *limba în care vei vorbi cu robotul tău*. Playwright și Cypress sunt framework-uri construite pe bază de JavaScript (și extensia sa, TypeScript). Nu poți scrie scenarii de testare complexe, nu poți valida rezultate și nu poți manipula date fără a stăpâni elementele de bază ale acestui limbaj.

---

### 1.2 Mediul de lucru: Unde scriem și rulăm codul JS?

Limbajul JavaScript a fost creat inițial doar pentru a rula în browser, dar astăzi rulează oriunde. Pentru a testa exemplele din acest curs, vei folosi două medii principale:

1. **Consola Browserului (DevTools) — "Terenul de joacă rapid":**  
   Cel mai rapid mod de a rula cod JS este chiar browserul tău Chrome.  
   * *Cum accesezi:* Apeși `F12` (sau click-dreapta -> *Inspect*) și mergi pe tab-ul **Console**. Acolo poți scrie direct cod JavaScript, apeși Enter și vezi rezultatul instantaneu. Este perfect pentru a testa funcții mici, a verifica logica sau a depista selectoare pe loc.

2. **IDE-ul (Visual Studio Code) + Node.js — "Mediul Profesionist":**  
   Când scrii un proiect real de automatizare, nu poți scrie sute de linii de cod direct în browser. Vei folosi un **IDE (Integrated Development Environment)**, precum *Visual Studio Code* (pe care l-ai folosit la HTML). Pentru ca PC-ul tău să înțeleagă JS în afara browserului, în modulele următoare vom instala și folosi un motor numit **Node.js**. În VS Code, vei scrie fișiere cu extensia `.js` (sau `.ts` pentru TypeScript) și le vei rula direct dintr-un terminal integrat.

---

### 1.3 Variabile: Cutiile cu Memorie (let vs const)

O variabilă este ca o cutie de pantofi goală pe care pui o etichetă (numele). În ea stochezi o informație (valoarea) pentru a o refolosi mai târziu. În JavaScript-ul modern, avem două moduri principale de a crea aceste cutii:

1. **`const` (Constanta — Regele automatizării):**  
   Se folosește atunci când valoarea din "cutie" **NU** trebuie să se mai schimbe niciodată pe parcursul rulării scriptului.  
   * *Regula de aur:* În 90% din cazuri, în testele Playwright, vei folosi `const`.

```js
const urlPlatforma = "https://certify.qualiadept.eu";
const butonLogin = page.locator('#login-btn');

// Dacă încerci mai târziu să scrii urlPlatforma = "google.com", 
// codul va genera o eroare, protejându-te de greșeli accidentale!
```

2. **`let` (Variabila schimbătoare):**  
   Se folosește DOAR când știi sigur că valoarea se va modifica pe parcursul execuției (ex: un contor).

```js
let numarIncercari = 0;
numarIncercari = 1; // Permis. Valoarea s-a actualizat.
```

> **Notă:** S-ar putea să vezi în tutoriale foarte vechi pe internet cuvântul `var`. **Evită-l!** Este perimat, "scapă" din structurile de control și cauzează bug-uri grave de memorie în aplicațiile moderne.

![Diagramă declarare variabile în JavaScript](/images/sessions/premium/session-3/image1.png)
<span class="image-caption">**Fig. 1** — Fluxul de decizie la declararea unei variabile în JavaScript (const vs let).</span>

---

### 1.4 Tipuri de Date: Ce punem în cutii?

* **String (Text):** Text cuprins între ghilimele.
```js
const numeUtilizator = "Ion Popescu";
const mesaj = 'Test reusit';
```

* **Number (Numere):** Valori numerice întregi sau zecimale (fără ghilimele).
```js
const varsta = 25;
const pret = 99.99;
```

* **Boolean (Adevărat / Fals):** Esențial în validarea testelor.
```js
const esteAutentificat = true;
const testPicat = false;
```

---

### 1.5 Structuri de Control: Inteligența Scriptului

Permit luarea deciziilor în funcție de starea aplicației:

```js
const statusRaspuns = 200;

if (statusRaspuns === 200) {
  console.log("Test Passed: Răspuns primit cu succes!");
} else {
  console.log("Test Failed: Eroare de comunicare!");
}
```

---

### 1.6 Funcții: Rețetele reutilizabile

Blocuri de cod organizate pentru a evita duplicarea:

```js
// Funcție clasică
function aduna(a, b) {
  return a + b;
}

// Funcție săgeată (Arrow Function) — preferată în Playwright
const adunaArrow = (a, b) => a + b;
```

---

### 1.7 Știați că...?

::: tip 💡 Știați că...?
- **JavaScript NU este Java:** Limbajul JavaScript a fost creat în anul 1995 de către Brendan Eich în doar 10 zile! Inițial s-a numit *Mocha*, apoi *LiveScript*. Numele final de "JavaScript" a fost doar o manevră de marketing pentru a profita de popularitatea uriașă pe care o avea limbajul "Java" în acea perioadă. După cum se spune în industrie: *„Java și JavaScript se aseamănă la fel de mult precum ham (șuncă) și hamster”*.
- **Camel Case:** Standardul de scriere a numelor de variabile în JS se numește *camelCase* (ca o cocoașă de cămilă). Primul cuvânt e mereu cu literă mică, iar următoarele încep cu literă mare, lipite, fără spații (ex: `numeUtilizatorNou`, `butonTrimiteFormular`).
- **De la animații la servere și roboți:** Dacă inițial JS a fost inventat doar pentru a face o zăpadă să cadă pe ecran sau un buton să clipească în browser, astăzi, datorită platformei *Node.js*, poți rula servere complexe, poți programa roboți fizici și poți scrie sisteme de testare enterprise, totul cu un singur limbaj!
:::

---

### 1.8 Poveste Aplicată: „Bucătăria JavaScript”

::: note 📖 Poveste Aplicată: Bucătăria JavaScript
Gândește-te la bucătăria ta:
- **IDE-ul (VS Code)** este bucătăria însăși, unde ai toate instrumentele și unde prepari rețetele complexe.
- **DevTools Console** este cuptorul cu microunde: rapid, dar doar pentru teste/încălziri mici.
- **Variabilele (`const` și `let`)** sunt recipientele tale:
  - Borcanul cu sare este un `const` (rămâne mereu sare, nu se schimbă).
  - Bolul de salată este un `let` (azi faci salată de roșii, mâine îl speli și pui fructe).
- **Tipurile de date** sunt ingredientele (`String` = Făină, `Number` = 3 ouă).
- **Structurile de control (`if`/`else`)** sunt deciziile tale ca bucătar: *"Dacă supa e prea nesărată, mai pun sare. Altfel, o opresc."*
- **Funcția** este Rețeta. Ai o rețetă scrisă (funcția), îi dai ingredientele (parametrii) și ea îți returnează preparatul (`return`).
:::

---

### 1.9 Exerciții Practice

*Pentru a rezolva aceste exerciții, deschide un tab nou în Chrome, apasă F12, mergi la tab-ul **Console** și scrie codul acolo, apăsând Enter după fiecare linie!*

#### Exercițiul 1: Declararea corectă
1. Declară o constantă numită `numeAplicatie` și dă-i valoarea `"Task Tracker"`.  
2. Declară o variabilă (care se poate schimba) numită `testeTrecute` și inițializeaz-o cu valoarea `0`.  
3. Încearcă să schimbi valoarea constantei: `numeAplicatie = "Alta Aplicație"`. Ce eroare îți afișează consola?

#### Exercițiul 2: Arrow Function pentru Vârstă
Scrie o **funcție săgeată (arrow function)** numită `verificaMajorat` care primește un parametru numit `varsta` (un `Number`). Funcția trebuie să aibă o structură `if`/`else`:
- Dacă vârsta este mai mare sau egală (`>=`) cu 18, să dea return `"Utilizator major"`.  
- Dacă nu, să dea return `"Acces interzis"`.  
- Apelează funcția în consolă cu vârsta ta pentru a o testa!

---

### 1.10 Soluții la Exerciții

::: details 💡 Soluții Exercițiile 1 & 2
**Soluție Exercițiul 1:**
```js
const numeAplicatie = "Task Tracker";
let testeTrecute = 0;

// Încercarea de reatribuire:
numeAplicatie = "Alta Aplicatie"; 
// Va genera eroarea: Uncaught TypeError: Assignment to constant variable.
```

**Soluție Exercițiul 2:**
```js
const verificaMajorat = (varsta) => {
  if (varsta >= 18) {
    return "Utilizator major";
  } else {
    return "Acces interzis";
  }
};

console.log(verificaMajorat(20)); // Afișează: Utilizator major
console.log(verificaMajorat(16)); // Afișează: Acces interzis
```
:::

---

### 1.11 🛡️ Mentalitatea de Inginer în Era AI: Locul tău pe piață

::: warning 🛡️ QA vs. AI: Iluzia codului perfect generat
- **Ce face AI-ul bine:** Dacă îi ceri *"scrie-mi o funcție JS care validează formatul unui email"*, AI-ul îți va da în 2 secunde un cod complex pe care probabil ți-ar fi luat 20 de minute să-l scrii de la zero. E un asistent grozav.
- **Capcana (Unde AI-ul eșuează):** AI-ul este predispus la "halucinații logice" și la practici slabe de arhitectură dacă nu primește contextul perfect. El ar putea scrie un întreg scenariu de test folosind doar `let` în loc de `const`, expunând datele testului tău la modificări accidentale (mutation bugs). Sau ar putea genera o buclă `for` infinită care îți va bloca complet serverul sau browser-ul.
- **Cum gândește un inginer QA:** Inginerul citește codul generat de AI la fel cum un profesor corectează teza unui elev. El va spune: *"Mulțumesc pentru scheletul logic, dar ai folosit `var` în loc de `let`, iar logica ta de `if`/`else` nu acoperă scenariul în care formularul este complet gol."* Inginerul QA va corecta și refactoriza funcția generată în IDE-ul său pentru a o face robustă (bulletproof).
- **De ce vei rămâne relevant pe piață:** Nu te bat roboții care scriu cod, te bat oamenii care știu ce să le ceară roboților și cum să le valideze rezultatul. Cunoașterea profundă a fundamentelor (Memorie, Bucle, Logica Decizională) te face Arhitectul sistemului de testare, în timp ce AI-ul rămâne doar un executant rapid.
:::

---

## Capitolul 2: Ce punem în cutii? Tipurile de date fundamentale

::: info 🎯 Obiective de învățare
La finalul acestui capitol, vei fi capabil să:
- Identifici și utilizezi tipurile de date primitive (`String`, `Number`, `Boolean`).
- Înțelegi diferența vitală dintre `undefined` și `null`.
- Lucrezi cu tipuri de date complexe: Array-uri (liste) și Obiecte (colecții).
- Investigi datele folosind operatorul `typeof`.
:::

### 2.1 Tipuri Primitive: Ingredientele de bază

Dacă variabilele (`let` și `const`) sunt "cutiile", tipurile de date ne spun ce fel de obiecte se află în acele cutii. În JavaScript, ca în orice limbaj, avem câteva tipuri simple, numite "primitive".

1. **String (Text):** Orice șir de caractere. În JS, textul trebuie **întotdeauna** îmbrăcat în ghilimele (simple `'...'`, duble `"..."`, sau backticks `` `...` ``).
```js
const mesajEroare = "Parola este incorectă!";
```

2. **Number (Numere):** Spre deosebire de alte limbaje care fac diferența între numere întregi și zecimale, JS le numește pe toate simplu, `Number`. Nu se pun în ghilimele!
```js
const timpAsteptare = 5000; // 5 secunde în milisecunde
const pretProdus = 99.99;
```

3. **Boolean (Adevărat/Fals):** Are doar două valori posibile: `true` sau `false` (fără ghilimele). Este fundamental pentru logica decizională.
```js
let esteVizibil = true;
let utilizatorLogat = false;
```

![Clasificarea Tipurilor de Date în JavaScript](/images/sessions/premium/session-3/image2.png)
<span class="image-caption">**Fig. 2** — Clasificarea Tipurilor de Date în JavaScript: Tipuri Primitive vs. Tipuri Complexe.</span>

---

### 2.2 Misterul "Nimicului": undefined vs null

Ca QA, vei întâlni des aceste două concepte când robotul caută ceva pe pagină și nu găsește:

* **`undefined` (Nedefinit):** Înseamnă că ai creat cutia, dar ***încă nu ai pus nimic în ea***. Calculatorul nu știe ce este.
```js
let elementCautat;
console.log(elementCautat); // Afișează: undefined
```

* **`null` (Nul):** Înseamnă "nimic", dar este un nimic *intenționat*. Tu îi spui explicit calculatorului: *"Această cutie este goală pe moment"*.
```js
let dateUtilizator = null; // Vom pune datele aici după ce se loghează
```

---

### 2.3 Structuri Complexe: Array-uri și Obiecte

Adesea, nu vrem să lucrăm cu o singură valoare, ci cu o colecție de date.

1. **Array-ul (Lista):** O listă ordonată de valori, scrisă între paranteze drepte `[ ]`. Gândește-te la o cutie compartimentată. Fiecare element are un index (o poziție), dar atenție: **numărătoarea începe mereu de la 0!**
```js
const browsereSuportate = ["Chrome", "Firefox", "Webkit"];
// "Chrome" este la poziția 0, "Firefox" la poziția 1
console.log(browsereSuportate[0]); // Afișează: Chrome
```

2. **Obiectul (Object):** Folosit pentru a descrie o "entitate" cu multiple caracteristici. Se scrie între acolade `{ }` și conține perechi *cheie: valoare*. Este formatul standard (JSON) în care aplicațiile web comunică între ele (API-uri).
```js
const utilizatorTest = {
  username: "qa_expert",
  parola: "Test1234!",
  esteAdmin: true
};

// Pentru a accesa o proprietate, folosim punctul (.):
console.log(utilizatorTest.username); // Afișează: qa_expert
```

---

### 2.4 Știați că...?

::: tip 💡 Știați că...?
- **Detectorul de tipuri:** JavaScript are un operator numit `typeof` pe care îl poți folosi în Consolă ca să afli ce se ascunde într-o variabilă. Dacă scrii `typeof 42`, îți va răspunde `"number"`. Dacă scrii `typeof "42"`, îți va răspunde `"string"`.
- **Totul e un obiect:** Sub capotă, în JavaScript, inclusiv Array-urile sunt considerate o formă specială de "Obiect" cu chei numerice!
- **Atenție la adunări (Type Coercion):** Ce se întâmplă dacă aduni un Number cu un String? `5 + "5"` în JavaScript nu face `10`, ci `"55"`. JS transformă numărul în text și le lipește! Acesta este motivul pentru care tipurile de date sunt critice.
:::

---

### 2.5 Exerciții Practice

*Deschide VS Code (creează un fișier test.js și rulează-l cu Node.js) sau folosește tab-ul **Console** din DevTools (Chrome).*

#### Misiunea ta:
1. Declară o variabilă `varsta` (`Number`) cu valoarea ta.  
2. Declară un Obiect numit `produsTest` care să aibă 3 proprietăți: `nume` (`String`), `pret` (`Number`) și `inStoc` (`Boolean`).  
3. Folosește comanda `console.log()` pentru a afișa prețul produsului (folosind sintaxa cu punct).  
4. Rulează comanda `typeof produsTest.inStoc` și observă ce îți afișează consola.

---

### 2.6 Soluții la Exerciții

::: details 💡 Soluție Exerciții Capitolul 2
```js
let varsta = 28;

const produsTest = {
  nume: "Căști Wireless",
  pret: 299.99,
  inStoc: true
};

console.log(produsTest.pret); // Va afișa: 299.99
console.log(typeof produsTest.inStoc); // Va afișa: "boolean"
```
:::

---

### 2.7 🛡️ Mentalitatea de Inginer în Era AI: Locul tău pe piață

::: warning 🛡️ QA vs. AI: Confuzia Tipurilor de Date (Type Coercion)
- **Ce face AI-ul bine:** Dacă îi ceri unui asistent AI *"generează-mi un profil de utilizator pentru un test"*, va genera imediat un obiect complex, structurat perfect vizual, cu zeci de proprietăți în format corect.
- **Capcana (Unde AI-ul eșuează):** În JavaScript există o mare capcană: `==` (egalitate vagă) vs `===` (egalitate strictă). Un AI care nu înțelege logica exactă de business a aplicației tale ar putea genera un test care verifică dacă `0 == false` (ceea ce în JS este `true`, deoarece forțează conversia de tip). Sau ar putea trimite către server (via API) un preț sub formă de `"100"` (String) în loc de `100` (Number). Serverul va arunca o eroare 500, iar AI-ul se va învârti în cerc fără a depista cauza.
- **Cum gândește un inginer QA:** Inginerul este dedicat utilizării **Tipurilor Stricte**. El analizează scriptul generat de AI și observă că aserțiunea (validarea) este fragilă. Inginerul va corecta testul pentru a folosi mereu `===` (care verifică atât valoarea, CÂT ȘI tipul de date). El știe că un String nu are voie niciodată să treacă drept Number într-un sistem financiar.
- **De ce vei rămâne relevant pe piață:** Valoarea ta majoră în echipa de dezvoltare nu este doar "să dai click pe butoane automat", ci **Asigurarea Calității Datelor**. Tu previi acele bug-uri invizibile, silențioase, pe care un AI le introduce accidental.
:::

---

## Capitolul 3: Logica aplicației — Structuri de Control (if/else, for)

::: info 🎯 Obiective de învățare
La finalul acestui capitol, vei fi capabil să:
- Înțelegi cum se execută codul (fluxul de control de sus în jos) și cum îl poți devia.
- Scrii instrucțiuni decizionale (`if` / `else if` / `else`) pentru a trata diferite scenarii.
- Utilizezi bucla `for` pentru a repeta automat blocuri de cod.
- Combini Array-urile cu buclele `for` pentru a itera prin liste de date.
:::

### 3.1 Luarea Deciziilor: Instrucțiunea if / else

În mod normal, JavaScript citește codul tău exact cum citești tu o carte: linie cu linie, de sus în jos. Structurile de control ne permit să schimbăm această ordine.

Cea mai simplă și folosită decizie este instrucțiunea **dacă / altfel (`if` / `else`)**. Îi spune calculatorului: *"Dacă această condiție este adevărată, execută blocul A. Altfel, execută blocul B."*

```js
let elementVizibil = true;

if (elementVizibil === true) {
  // Acest cod se execută DOAR dacă condiția din paranteze este adevărată (true)
  console.log("Click pe buton!");
} else {
  // Acest cod se execută dacă condiția este falsă (false)
  console.log("Așteaptă ca elementul să apară...");
}
```

![Logica decizională if / else în testare](/images/sessions/premium/session-3/image3.png)
<span class="image-caption">**Fig. 3** — Execuția condiționată (Logica if/else) într-un scenariu de testare automatizată.</span>

---

### 3.2 Mai multe ramuri: else if

În viața reală de QA, nu avem doar alb și negru. Ce se întâmplă când testăm un API și vrem să verificăm răspunsul (Status Code)? Avem nevoie de mai multe opțiuni, folosind `else if`:

```js
const statusCode = 404;

if (statusCode === 200) {
  console.log("Test Passed: Pagina s-a încărcat corect.");
} else if (statusCode === 404) {
  console.log("Test Failed: Pagina nu a fost găsită (Eroare de client).");
} else if (statusCode === 500) {
  console.log("Test Failed: Serverul a picat complet!");
} else {
  console.log("Eroare necunoscută.");
}
// Deoarece statusCode este 404, consola va printa al doilea mesaj.
```

---

### 3.3 Repetiția: Bucla for (The for Loop)

Unul dintre principiile de bază în programare este **DRY (Don't Repeat Yourself — Nu te repeta)**. Dacă vrei să dai click pe 5 butoane identice, nu scrii comanda de click de 5 ori. Folosești o "buclă" pentru a automatiza repetiția.

Structura buclei `for` are 3 părți în interiorul parantezelor:
1. **Start (Inițializarea):** De unde începem să numărăm? (ex: `let i = 1`)  
2. **Condiția de oprire:** Până când repetăm? (ex: `i <= 5`)  
3. **Pasul (Incrementarea):** Cu cât creștem contorul la finalul fiecărui pas? (ex: `i++` înseamnă că îl creștem cu 1).

```js
for (let i = 1; i <= 3; i++) {
  console.log("Execut acțiunea numărul: " + i);
}
// Output în Consolă:
// Execut acțiunea numărul: 1
// Execut acțiunea numărul: 2
// Execut acțiunea numărul: 3
```

---

### 3.4 Iterarea prin Liste (Combinarea Buclelor cu Array-urile)

Aici devine totul extrem de relevant pentru un Automation Engineer. Imaginează-ți că ai un Array cu nume de utilizatori și vrei să testezi login-ul pentru fiecare în parte. Vei folosi o buclă `for` care să treacă prin fiecare element, folosind proprietatea `.length` (care ne spune câte elemente are lista).

```js
const utilizatoriTest = ["admin", "editor", "cititor"];

// i pornește de la 0 pentru că indexul Array-urilor începe de la 0!
for (let i = 0; i < utilizatoriTest.length; i++) {
  console.log("Testăm login pentru utilizatorul: " + utilizatoriTest[i]);
}
```

---

### 3.5 Știați că...?

::: tip 💡 Știați că...?
- **Bucla Infinită (Coșmarul Programatorului):** Dacă greșești condiția de oprire într-un `for`, bucla nu se va termina niciodată. Calculatorul va repeta acțiunea la infinit până i se epuizează memoria și se blochează. De exemplu, dacă uiți să scrii `i++`, variabila `i` rămâne mereu 1, iar condiția `1 <= 5` va fi mereu adevărată.
- **Truthiness & Falsiness:** În JS, o condiție din `if` nu are nevoie strict de `true` sau `false`. Anumite valori sunt evaluate direct ca fiind false: `0`, `""` (string gol), `null` și `undefined`. Astfel, `if ("") { ... }` nu se va executa niciodată.
:::

---

### 3.6 Exerciții Practice

*Deschide DevTools (tab-ul Console) în browser sau folosește un fișier în VS Code pentru a rezolva următoarele exerciții:*

#### Misiunea 1: Verificarea Parolei
- Declară o variabilă `parolaIncorecta` și asignează-i valoarea `true`.  
- Scrie un bloc `if`/`else`. Dacă `parolaIncorecta` este `true`, afișează: `"Afișează mesaj de eroare UI"`. Altfel, afișează: `"Redirecționează către Dashboard"`.

#### Misiunea 2: Căutarea în tabel
- Scrie o buclă `for` care să numere de la 1 la 4.  
- În interiorul buclei, folosește `console.log()` pentru a afișa: `"Verific rândul numărul X"` (unde X este contorul tău).

---

### 3.7 Soluții la Exerciții

::: details 💡 Soluții Exerciții Capitolul 3
**Soluție Misiunea 1:**
```js
let parolaIncorecta = true;

if (parolaIncorecta === true) {
  console.log("Afișează mesaj de eroare UI");
} else {
  console.log("Redirecționează către Dashboard");
}
```

**Soluție Misiunea 2:**
```js
for (let i = 1; i <= 4; i++) {
  console.log("Verific rândul numărul " + i);
}
```
:::

---

### 3.8 🛡️ Mentalitatea de Inginer în Era AI: Locul tău pe piață

::: warning 🛡️ QA vs. AI: Bucle infinite și logica oarbă la cazuri limită (Edge Cases)
- **Ce face AI-ul bine:** Generatoarele de cod sunt foarte rapide în a genera sintaxa pentru structuri repetitive. Dacă îi spui *"parcurge un array de produse și dă click"*, îți va genera imediat o buclă `for` corectă sintactic.
- **Capcana (Unde AI-ul eșuează):** AI-ul suferă adesea de "miopie de context". El scrie codul pe traseul ideal (*Happy Path*). Dar ce se întâmplă dacă array-ul de produse vine gol de la server? AI-ul ar putea genera o logică de `if` / `else` care presupune că produsul există mereu. Când rulezi testul în Pipeline (CI/CD) și rețeaua e lentă, array-ul e gol, testul pică, iar AI-ul îți sugerează eronat să adaugi pauze artificiale (sleeps/timeouts).
- **Cum gândește un inginer:** Un inginer QA aplică **Analiza Valorilor de Frontieră (Boundary Value Analysis)** direct pe cod. Se uită la bucla `for` generată de AI și adaugă o validare defensivă înainte de ea:
  ```js
  if (produse.length === 0) {
    console.log("Test eșuat: Nu s-au încărcat produsele");
    return;
  }
  ```
- **De ce vei rămâne relevant pe piață:** Valoarea ta nu stă în a cunoaște pe de rost sintaxa unui `for`, ci în **Gândirea Critică**. AI-ul codifică algoritmul; tu ești cel care întreabă: *"Ce se întâmplă dacă condiția asta e negativă? Ce se întâmplă dacă primesc null în loc de array?"*.
:::

---

## Capitolul 4: Reutilizarea codului — Funcții clasice și Funcții Săgeată (Arrow Functions)

::: info 🎯 Obiective de învățare
La finalul acestui capitol, vei fi capabil să:
- Explici conceptul de funcție și beneficiile modularizării codului.
- Scrii și apelezi funcții clasice folosind cuvântul cheie `function`.
- Stăpânești sintaxa modernă **Arrow Functions** (`=>`), standardul utilizat în Playwright.
- Transmiți parametri și să gestionezi valorile returnate (`return`).
:::

### 4.1 Ce este o funcție și de ce avem nevoie de ea?

O funcție este o bucată de cod reutilizabilă care primește date de intrare (parametri), le procesează și poate returna un rezultat:

* **Parametrii (Ingredientele):** Ceea ce îi transmiți funcției la început pentru a procesa (ex: user și parolă).  
* **Corpul funcției (Gătitul):** Codul propriu-zis care execută pașii logici în interior.  
* **Return (Preparatul final):** Rezultatul procesat pe care funcția ți-l dă înapoi după ce a terminat (ex: semnal că autentificarea a reușit).

![Anatomia unei Funcții în JavaScript](/images/sessions/premium/session-3/image4.png)
<span class="image-caption">**Fig. 4** — Anatomia conceptuală a unei funcții în JavaScript: Parametri de intrare, Procesare și Rezultat (Return).</span>

---

### 4.2 Funcția Clasică

Sintaxa tradițională în JavaScript folosește cuvântul cheie `function`:

```js
// Declararea funcției
function calculeazaPretTotal(pretBaza, taxa) {
  let pretFinal = pretBaza + taxa;
  return pretFinal; // Returnează valoarea calculată către apelant
}

// Apelarea funcției
let totalCos = calculeazaPretTotal(100, 19);
console.log("Totalul de plată este: " + totalCos); // Afișează în consolă: 119
```

---

### 4.3 Funcția Săgeată (Arrow Function) — Standardul Modern

În 2015 (ES6), JavaScript a introdus o sintaxă mult mai compactă și mai curată: **Arrow Function** (`=>`).

Aceasta este **cea mai importantă sintaxă din acest modul**. Playwright, Cypress și toate framework-urile moderne de testare sunt scrise bazându-se pe Arrow Functions.

Transformarea funcției clasice într-o funcție săgeată:

```js
const calculeazaPretTotal = (pretBaza, taxa) => {
  let pretFinal = pretBaza + taxa;
  return pretFinal;
};

console.log(calculeazaPretTotal(50, 5)); // Afișează: 55
```

**De ce le folosim în Playwright?**  
Fiecare test scris în Playwright folosește această sintaxă:

```js
test("Verifică butonul de Login", async ({ page }) => {
  // Aici vine corpul funcției de test! Toată logica ta E2E se scrie aici.
});
```

Testul în sine este pur și simplu o **Arrow Function** pe care framework-ul Playwright o execută automat!

---

### 4.4 Știați că...?

::: tip 💡 Știați că...?
- **Return implicit:** Dacă funcția ta săgeată are o singură linie de cod care doar returnează un rezultat, poți renunța complet la acolade `{}` și la cuvântul `return`:
  ```js
  const dubleaza = (numar) => numar * 2;
  ```
- **Funcții fără parametri:** Dacă o funcție nu are nevoie de niciun argument de intrare, parantezele rămân goale:
  ```js
  const saluta = () => { console.log("Salut QA!"); };
  ```
- **First-Class Citizens:** În JavaScript, funcțiile pot fi transmise ca argumente în alte funcții (conceptul de *Callback*), pe care se bazează arhitectura asincronă din Playwright.
:::

---

### 4.5 Exerciții Practice

#### Misiunea 1: Funcție Clasică
Scrie o funcție clasică numită `salutUtilizator` care primește un parametru `nume` (`String`) și afișează în consolă: `"Bine ai venit, [nume]!"`. Apelează funcția dându-i ca parametru numele tău.

#### Misiunea 2: Validare cu Arrow Function
Scrie o **funcție săgeată (arrow function)** numită `verificaAcces` care primește doi parametri: `esteAdmin` (`Boolean`) și `esteLogat` (`Boolean`).
- În corpul funcției, folosește `if`. Dacă ambele condiții sunt adevărate (folosind operatorul logic `&&`), returnează: `"Acces permis la Dashboard"`.
- Altfel, returnează: `"Acces interzis"`.
- Testează apelul cu perechile: (`true, true`) și (`false, true`).

---

### 4.6 Soluții la Exerciții

::: details 💡 Soluții Exerciții Capitolul 4
**Soluție Misiunea 1:**
```js
function salutUtilizator(nume) {
  console.log("Bine ai venit, " + nume + "!");
}

salutUtilizator("Alex");
```

**Soluție Misiunea 2:**
```js
const verificaAcces = (esteAdmin, esteLogat) => {
  if (esteAdmin === true && esteLogat === true) {
    return "Acces permis la Dashboard";
  } else {
    return "Acces interzis";
  }
};

console.log(verificaAcces(true, true));  // Va afișa: Acces permis la Dashboard
console.log(verificaAcces(false, true)); // Va afișa: Acces interzis
```
:::

---

### 4.7 🛡️ Mentalitatea de Inginer în Era AI: Locul tău pe piață

::: warning 🛡️ QA vs. AI: Arhitectura Modulară vs. Codul Spaghetti
- **Ce face AI-ul bine:** Asistenții de cod sunt extrem de rapizi în a genera cod funcțional pentru o sarcină punctuală.
- **Capcana (Unde AI-ul eșuează):** Modelele LLM tind să genereze cod monolitic și duplicat dacă nu primesc instrucțiuni arhitecturale stricte. Dacă ai 50 de teste de Checkout generate de AI, logica de completare a formularului de livrare riscă să fie duplicată în toate cele 50 de fișiere. Dacă un selector se modifică, mentenanța devine un coșmar.
- **Cum gândește un inginer QA:** Inginerul structurează codul modular. El extrage pașii repetați în funcții reutilizabile și clase de pagină (**Page Object Model**). La o schimbare de interfață, modificarea se face într-un singur loc.
- **De ce vei rămâne relevant pe piață:** Capacitatea de a concepe framework-uri scalabile, robuste și ușor de întreținut pe termen lung este o decizie strategică pe care AI-ul nu o poate lua singur.
:::

---

## Capitolul 5: Tema Sesiunii 3 & Extra Practice (Nivel Avansat)

### 5.1 Tema pentru Acasă (Proiect Sesiunea 3)

![Criterii de acceptare pentru funcția de validare](/images/sessions/premium/session-3/image5.png)
<span class="image-caption">**Fig. 5** — Diagrama fluxului de validare și criterii de acceptare pentru adăugarea unui task nou.</span>

#### Sarcina ta (Task-ul de business):
Până acum ai construit scheletul (**Sesiunea 1**) și designul (**Sesiunea 2**) aplicației noastre **"Task Tracker"**. Acum este momentul să îi dăm viață construindu-i prima parte din logica de bază. Trebuie să scrii un script **JavaScript** care stochează și procesează lista de task-uri, validând datele *înainte* de a fi afișate pe ecran.

> **Notă:** Vei scrie acest cod fie într-un fișier separat `app.js` (pe care îl legi în HTML cu `<script src="app.js"></script>` la finalul tag-ului `<body>`), fie direct în tab-ul Console din Chrome DevTools pentru testare rapidă.

#### 🔗 Cerințe Tehnice (Acceptance Criteria):
1. **Structura Datelor E2E (Arrays & Objects):**
   - Declară o constantă numită `listaTaskuri` de tip Array.
   - Inițializează acest Array cu cele două task-uri existente deja în tabelul tău HTML din sesiunile precedente. Fiecare task trebuie să fie un Obiect cu 3 proprietăți: `id` (`Number`), `nume` (`String`) și `completat` (`Boolean`).
   - *Exemplu:* `[{ id: 1001, nume: "Setare Boilerplate HTML", completat: true }, ...]`
2. **Funcția Săgeată de Validare (Business Logic):**
   - Scrie o **Arrow Function** numită `proceseazaTaskNou` care primește un singur parametru: `taskObj` (un Obiect).
   - **Validare strictă (if/else):** Verifică dacă numele task-ului lipsește (`""`) SAU este `undefined`.
   - Dacă datele sunt invalide, afișează în consolă: `"Eroare: Task-ul trebuie să aibă un nume!"`.
   - Dacă datele sunt corecte, adaugă noul obiect în `listaTaskuri` (folosind `.push()`) și afișează: `"Task adăugat cu succes!"`.
3. **Bucla de Raportare (Repetiția):**
   - După ce ai testat funcția adăugând un task valid (ex: `id: 1003`), scrie o buclă `for`.
   - Bucla trebuie să parcurgă întregul Array `listaTaskuri` și să afișeze în consolă doar numele fiecărui task existent în memorie.

---

### 5.2 Provocarea Bonus (Opțional): Capcana "Falsy" a API-urilor

#### Scenariul:
Aplicația ta Task Tracker este în producție. Primești de la server un răspuns API cu un cod de status. Trebuie să scrii o funcție simplă de logare: dacă statusul e 200, printezi "OK", altfel printezi "Eroare Server".

Un coleg scrie acest cod:

```js
const verificaServer = (statusCode) => {
  if (!statusCode) { // Se bazează pe conceptul de Falsy
    console.log("Eroare Server sau Lipsă Răspuns");
  } else {
    console.log("Status OK: " + statusCode);
  }
};
```

Testul tău rulează și dă un *False Positive*. Într-o zi, serverul returnează un cod valid pe care colegul nu l-a prevăzut (de ex, codul `0` pentru starea de "așteptare" a unui serviciu intern). Deoarece `0` este evaluat ca *Falsy* în JS, funcția dă eroare, deși serverul funcționează normal!

#### Misiunea ta:
Rescrie acel bloc `if`/`else` aplicând o **verificare strictă de tip (`===` și `typeof`)**. Funcția ta, numită `verificaServerStrict(statusCode)`, trebuie să returneze `"Status OK: " + statusCode` DOAR dacă parametrul primit este de tipul `Number`. Dacă primește `null`, `undefined` sau orice `String` (ex: `"200"`), trebuie să returneze `"Eroare format date server"`.

---

### 5.3 🗝️ Cheile de Rezolvare (Soluții & Explicații)

::: details 💡 Soluție Tema pentru Acasă & Provocarea Bonus
**Soluție Tema pentru Acasă:**

```js
// 1. Array de Obiecte (Baza noastră de date temporară în memorie)
const listaTaskuri = [
  { id: 1001, nume: "Setare Boilerplate HTML", completat: true },
  { id: 1002, nume: "Înțelegere Arhitectură Client-Server", completat: false }
];

// 2. Funcția de Validare (Arrow Function)
const proceseazaTaskNou = (taskObj) => {
  // Folosim || (SAU logic) și === (egalitate strictă)
  if (taskObj.nume === "" || taskObj.nume === undefined) {
    console.log("Eroare: Task-ul trebuie să aibă un nume!");
  } else {
    listaTaskuri.push(taskObj);
    console.log("Task adăugat cu succes!");
  }
};

// Simulăm acțiunea utilizatorului:
proceseazaTaskNou({ id: 1003, nume: "", completat: false }); // Afișează: Eroare
proceseazaTaskNou({ id: 1004, nume: "Scrie primul test Playwright", completat: false }); // Afișează: Succes

// 3. Bucla de raportare (Lista are acum 3 elemente valide)
console.log("--- Raport Task-uri ---");
for (let i = 0; i < listaTaskuri.length; i++) {
  console.log("Task-ul " + listaTaskuri[i].id + ": " + listaTaskuri[i].nume);
}
```

**Soluție Provocarea Bonus (Verificarea Strictă):**

```js
const verificaServerStrict = (statusCode) => {
  // În loc să ne bazăm pe Falsy, validăm explicit contractul de date: trebuie să fie Număr!
  if (typeof statusCode === "number") {
    return "Status OK: " + statusCode;
  } else {
    return "Eroare format date server";
  }
};

console.log(verificaServerStrict(0));     // Returnează: "Status OK: 0" (Rezolvat bug-ul!)
console.log(verificaServerStrict("200")); // Returnează: "Eroare format date server"
```
:::

🎉 **Felicitări!** Integrând acest script în `app.js` și legându-l la HTML-ul tău din Sesiunile 1 și 2, tocmai ai pus bazele primei tale aplicații funcționale (Frontend-Logic). Când vom trece la Playwright, testele tale automate vor interacționa cu DOM-ul pentru a declanșa exact aceste funcții de validare pe care le-ai scris astăzi!