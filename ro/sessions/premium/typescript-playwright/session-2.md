# Sesiunea 2: CSS modern și selectoare DOM

<div style="display: flex; gap: 12px; flex-wrap: wrap; margin: 1.5rem 0 0.5rem 0;">
  <a href="/pdfs/sessions/premium/typescript-playwright/session-2.pdf" class="download-btn" target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24"><path d="M5 20h14v-2H5v2zm0-10h4V4h6v6h4l-7 7-7-7z"/></svg>Vizualizează suportul de curs (PDF)</a>
</div>

::: info 📊 Prezentare PowerPoint
Mai jos regăsești prezentarea PowerPoint interactivă aferentă acestei sesiuni. Poți parcurge slide-urile direct din browser sau poți descărca suportul de curs în format PDF folosind butonul de mai sus.
:::

<div style="position: relative; width: 100%; padding-bottom: 56.25%; height: 0; margin: 1.5rem 0; overflow: hidden; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
  <iframe 
    src="https://docs.google.com/presentation/d/e/2PACX-1vQN1ShMk5SHdYpCeaflhV82kmNmivPDUEvusR0qbIW5eTG9D3Ae1LBv9OUhQnuLqLCJssgxkswuijMc/pubembed?start=false&loop=false&delayms=3000" 
    frameborder="0" 
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;" 
    allowfullscreen="true" 
    mozallowfullscreen="true" 
    webkitallowfullscreen="true">
  </iframe>
</div> 

---

## Capitolul 1: Fundamentele CSS și Box Model — De la Schelet HTML la Prezentare Vizuală

::: info 🎯 Obiective de învățare
La finalul acestui capitol, vei fi capabil să:
- Explici rolul CSS-ului în ecosistemul web și conceptul de **Separation of Concerns**.
- Conectezi corect regulile de stil la un document HTML folosind metoda recomandată în industrie (fișier extern).
- Descompui anatomia unei reguli CSS și să identifici erorile de sintaxă.
- Înțelegi **Modelul Cutiei (Box Model)** pentru a investiga de ce elementele se suprapun sau blochează interacțiunile.
- Corelezi proprietățile CSS de vizibilitate cu potențialele erori din testele automatizate End-to-End (E2E).
:::

### 1.1 Ce este CSS-ul și de ce contează pentru QA?

Dacă în Sesiunea 1 am stabilit că HTML-ul reprezintă "cărămizile și structura" casei, CSS-ul (*Cascading Style Sheets*) reprezintă vopseaua, tapetul, mobila și dimensiunile exacte ale încăperilor. HTML definește *ce* este un element (un buton, un paragraf), iar CSS definește *cum arată și unde este poziționat* acel element pe ecran.

Ca viitor QA Automation Engineer, te-ai putea întreba: *"De ce trebuie să învăț design web dacă eu voi scrie teste de funcționalitate?"*

Răspunsul stă în provocările zilnice ale automatizării:

* **Localizarea Elementelor:** Playwright și Cypress folosesc nativ Selectoare CSS pentru a găsi elemente în pagină. Fără a stăpâni CSS, nu vei ști cum să-i indici robotului cu precizie chirurgicală unde să acționeze.  
* **Stările de Vizibilitate:** Foarte multe bug-uri și teste picate apar pentru că un element este prezent în DOM (deci HTML-ul este corect), dar o regulă CSS îl face invizibil (`display: none`, `visibility: hidden` sau `opacity: 0`). Playwright, fiind construit să emuleze un utilizator uman, va refuza să dea click pe un element ascuns.  
* **Interceptarea Click-urilor:** Un alt element invizibil poate fi randat *peste* butonul tău (ex: un overlay de încărcare). Cunoașterea CSS te ajută să depistezi "inamicul" în DevTools.

---

### 1.2 Metode de aplicare a CSS-ului (Separation of Concerns)

Există trei moduri de a aplica stiluri pe un element HTML, dar industria folosește predominant doar unul:

1. **Inline CSS (Direct pe element):** Se aplică folosind atributul `style` direct pe tag-ul HTML. Este greu de menținut și evitat în aplicațiile moderne:
   ```html
   <button style="color: red;">Click</button>
   ```
2. **Internal CSS (În `<head>`):** Se scrie între etichetele `<style>` în interiorul documentului HTML. Este util doar pentru pagini foarte simple.
3. **External CSS (Fișier extern — Standardul Industriei):** Păstrează codul curat. HTML-ul stă într-un fișier, designul în altul (ex: `style.css`). Aceasta respectă principiul de *Separation of Concerns*.

Pentru metoda externă (pe care o vom folosi la aplicația "Task Tracker"), facem legătura folosind tag-ul `<link>` în secțiunea `<head>`:

```html
<head>
  <title>Task Tracker</title>
  <!-- Legătura critică între structură și design -->
  <link rel="stylesheet" href="style.css">
</head>
```

---

### 1.3 Anatomia unei reguli CSS

Codul CSS este compus dintr-o listă de reguli. Fiecare regulă îi spune browserului cum să deseneze unul sau mai multe elemente:

```css
button {
  background-color: #3498db;
  color: white;
  border-radius: 5px;
}
```

Să o descompunem:

* **Selectorul (`button`):** Indică ținta din documentul HTML (*"Găsește absolut toate butoanele de pe pagină!"*).  
* **Blocul de declarații (`{ ... }`):** Acoladele încadrează pachetul de reguli vizuale care se vor aplica țintei.  
* **Proprietatea (`background-color`, `color`):** Ce caracteristică specifică vrem să schimbăm (ex: culoarea de fundal, culoarea textului).  
* **Valoarea (`#3498db`, `white`):** Cum vrem să setăm acea proprietate.  
* **Atenție maximă:** Fiecare declarație (pereche proprietate-valoare) se desparte prin două puncte (`:`) și **se termină obligatoriu cu punct și virgulă (`;`)**. Omiterea acelui `;` va strica regula următoare.

---

### 1.4 Modelul Cutiei (The Box Model) — Concept Vital pentru QA

Unul dintre cele mai importante secrete pe care trebuie să le știi este că, pentru browser, **absolut fiecare element HTML este o cutie dreptunghiulară**. Chiar dacă un buton arată rotund (`border-radius`), amprenta lui fizică pe ecran este un dreptunghi.

Acest dreptunghi este definit de **Box Model**, care are 4 straturi (dinspre interior spre exterior):

* **Content (Conținutul):** Inima cutiei. Textul sau imaginea propriu-zisă.  
* **Padding (Umplutura):** Spațiul *interior*, dintre text și marginea cutiei. Face butonul să pară mai voluminos și mai ușor de apăsat. Dacă dai click pe padding, dai click pe buton.  
* **Border (Chenarul):** Linia care delimitează marginea elementului. Poate fi invizibilă, continuă sau punctată.  
* **Margin (Marginea exterioară):** Spațiul *exterior*, gol, dintre acest element și elementele vecine. Marginea împinge alte elemente la distanță. **Dacă un QA încearcă să dea click pe "Margin", click-ul trece prin el și lovește elementul din spate!**

---

### 1.5 Știați că...?

::: tip 💡 Știați că...?
- **De ce se numește "Cascading" (în cascadă)?** Dacă scrii două reguli CSS contradictorii pentru același element, browserul va aplica regula citită ultima. Designul curge în cascadă de sus în jos. Singura excepție este adăugarea flag-ului `!important`, care forțează suprascrierea cascadei.
- **`pointer-events: none;` — Inamicul invizibil al QA-ului:** Dezvoltatorii o folosesc frecvent pentru a dezactiva temporar un element. Butonul arată complet normal pe ecran, dar dacă încerci să dai click pe el (manual sau din Playwright), click-ul trece pur și simplu prin el.
:::

---

### 1.6 Poveste Aplicată: „Designerul și Zona de Confort”

::: note 📖 Poveste Aplicată: Designerul și Zona de Confort
Gândește-te la un Tablou pe care vrei să-l agăți pe perete:
- **HTML:** Pânza însăși (**Content**).
- **Designerul CSS:**
  - *"Pune-i un Passepartout alb, lat de 5 cm, între pânză și ramă"* (**Padding**).
  - *"Pune-i o ramă groasă de lemn de stejar"* (**Border**).
  - *"Nu agăța niciun alt tablou la o distanță mai mică de 20 de centimetri de acesta. Are nevoie de spațiu să respire!"* (**Margin**).

Când programezi robotul Playwright să dea click pe tablou, robotul va da click fix în mijlocul Content-ului. Dar dacă Margin-ul unui alt tablou uriaș se suprapune accidental peste tabloul tău, robotul va lovi Margin-ul transparent al celuilalt element și va eșua! Așa se nasc multe dintre testele E2E eșuate în viața reală.
:::

---

### 1.7 Exerciții Practice

#### Exercițiul 1: Investighează CSS-ul în DevTools
1. Deschide Google Chrome și intră pe `www.wikipedia.org`.
2. Dă click-dreapta pe butonul central de căutare (lupa) și alege **Inspect**.
3. În panoul DevTools, sub tab-ul **Elements**, găsește secțiunea **Styles**.
4. **Misiune:** Găsește proprietatea `background-color` (sau `color`) și schimb-o din paleta de culori. Observă modificarea live.

#### Exercițiul 2: Explorează Box Model-ul (Investigație Avansată)
1. Tot în DevTools, lângă tab-ul **Styles**, accesează tab-ul **Computed**.
2. Examinează diagrama interactivă Box Model (albastru, verde, galben, portocaliu).
3. **Misiune:** Trece cu mouse-ul peste dreptunghiul verde (padding) și cel portocaliu (margin). Observă cum Chrome colorează zonele pe ecran.

---

### 1.8 Răspunsuri la Întrebări & Soluții la Exerciții

::: details 💡 Soluție Exercițiile 1 & 2
Panoul **Computed** este instrumentul de top al unui QA pentru a rezolva erorile de tipul *"Playwright dă click pe elementul greșit"*. Când treci cu mouse-ul peste margin/padding în acea diagramă, Chrome evidențiază direct pe pagină spațiile invizibile care împing elementele unele în altele.
:::

---

### 1.9 🛡️ Mentalitatea de Inginer în Era AI: Locul tău pe piață

::: warning 🛡️ QA vs. AI: De ce cunoașterea CSS-ului te face de neînlocuit
- **Ce face AI-ul bine:** Generează sintaxă instantaneu (`page.click('button')`, `background-color: blue;`).
- **Capcana (Unde AI-ul eșuează):** AI-ul este orb la contextul vizual din runtime. Când un click e blocat de un overlay sau margin, AI sugerează superficial parametrul `{ force: true }`, ascunzând un bug real!
- **Cum gândește un inginer:** Un inginer deschide DevTools, inspectează panoul Computed și identifică rădăcina problemei: *"Header-ul are un padding prea mare care se suprapune peste zona de conținut"*.
- **De ce vei rămâne relevant:** AI scrie sintaxă; tu ești arhitectul stabilității și cel care depanează cauzele fundamentale.
:::

---

## Capitolul 2: Selectoare CSS de bază — Instrumentele de precizie ale QA-ului

::: info 🎯 Obiective de învățare
La finalul acestui capitol, vei fi capabil să:
- Identifici și scrii selectoare CSS de bază: **Element**, **ID**, **Clasă**.
- Înțelegi specificitatea selectoarelor și de ce ID-ul este suveran.
- Scrii selectoare bazate pe atribute (`data-testid`), fundamentale în testarea E2E.
- Eviți capcanele claselor dinamice generate de framework-urile moderne (React, Tailwind).
:::

### 2.1 Sintaxa de bază: Element, ID și Clasă

1. **Selectorul de Element (Tag) — Cel mai slab (Generic):**
   - **HTML:** `<button>Salvează</button>`
   - **CSS:** `button { background-color: blue; }`
   - **Playwright:** `page.locator('button')`
   - *Problemă:* Țintește toate butoanele din pagină, provocând erori de ambiguitate (*strict mode violation*).

2. **Selectorul de Clasă — Moderat (Grup):**
   - **HTML:** `<div class="product-card">...</div>`
   - **CSS:** `.product-card { border: 1px solid black; }`
   - **Playwright:** `page.locator('.product-card')`
   - *Utilizare:* Excelent pentru numărarea produselor dintr-o listă.

3. **Selectorul de ID — Puternic (Unic):**
   - **HTML:** `<input id="email-field">`
   - **CSS:** `#email-field { width: 100%; }`
   - **Playwright:** `page.locator('#email-field')`
   - *Avantaj:* ID-ul este unic per pagină, garantând găsirea precisă a elementului.

---

### 2.2 Selectoarele de Atribute: „Sfântul Graal” al Automatizării

În aplicațiile moderne (React, Vue, Angular), clasele se pot schimba la fiecare build (`class="btn_v2_xyz789"`).

Cum rezolvăm această instabilitate? Folosind **Selectoare de Atribute**!

```html
<!-- HTML -->
<button data-testid="submit-login">Log In</button>
```

```css
/* CSS */
[data-testid="submit-login"] {
  color: white;
}
```

```javascript
// Playwright
page.locator('[data-testid="submit-login"]');
// Sau comanda dedicată mai rapidă:
page.getByTestId('submit-login');
```

Această metodă decuplează complet designul vizual de logica de testare!

---

### 2.3 Poveste Aplicată: „Livrarea Pachetului”

::: note 📖 Poveste Aplicată: Livrarea Pachetului
Gândește-te la selectoare ca la moduri de a găsi o persoană într-un bloc:
- **Selector de Element (`button`):** *"Caută un om!"* (Sunt mulți oameni în bloc; confuzie).
- **Selector de Clasă (`.baiat-blond`):** *"Caută băieți blonzi!"* (Poți găsi 3 pe aceeași scară).
- **Selector de ID (`#cnp-1900101123456`):** *"Caută omul cu acest CNP."* (Unic și clar).
- **Selector de Atribut (`[data-role="administrator-bloc"]`):** *"Dă pachetul cui are insigna oficială de administrator."* (Abordarea optimă QA: stabilă chiar dacă omul își schimbă tunsoarea sau buletinul!).
:::

---

### 2.4 Exerciții Practice

#### Exercițiul 1: Vânătoarea de Selectoare (DevTools)
1. Intră pe `www.google.com`.
2. Inspectează butonul "Căutare Google".
3. Notează clasa CSS, ID-ul și orice atribut special (`aria-label`, `data-*`).

#### Exercițiul 2: Scrie propriul Selector de Atribut
Având codul HTML:
```html
<div id="container-99" class="wrapper-blue" data-test="user-profile-card">Ion Popescu</div>
```
Scrie un selector CSS cu paranteze drepte legat strict de atributul de testare.

---

### 2.5 Răspunsuri la Întrebări & Soluții la Exerciții

::: details 💡 Soluție Exercițiul 2
Selectorul corect și robust este:
```css
[data-test="user-profile-card"]
```
:::

---

### 2.6 🛡️ Mentalitatea de Inginer în Era AI: Capcana Generatoarelor de Cod

::: warning 🛡️ QA vs. AI: Capcana Generatoarelor de Cod
- **Ce face AI-ul bine:** Generează rapid linii precum `page.locator('.bg-blue-500.hover\\:bg-blue-700.text-white').click()`.
- **Capcana:** Când designerul modifică nuanța de albastru, toate testele pică în cascadă.
- **Cum gândește inginerul:** Cere sau adaugă `data-testid="login-button"` și scrie teste stabile: `page.getByTestId('login-button').click()`.
:::

---

## Capitolul 3: Selectoare CSS avansate & Pseudo-clase — Navigarea Complexă în DOM

::: info 🎯 Obiective de învățare
La finalul acestui capitol, vei fi capabil să:
- Folosești selectoare relaționale (**Copil**, **Descendent**, **Frate**) pentru a naviga structuri HTML complexe.
- Înțelegi și aplici pseudo-clase de stare (`:hover`, `:disabled`, `:checked`).
- Utilizezi pseudo-clase structurale (`:nth-child`, `:first-child`) pentru a găsi elemente în tabele și liste dinamice.
- Combini multiple criterii într-un singur selector (*Chaining*) pentru precizie maximă.
:::

### 3.1 Navigarea în arbore: Selectoare Relaționale (Combinators)

1. **Selectorul de Descendent (Spațiu) — „Căutare în adâncime”:**
   - **Sintaxă:** `ElementA ElementB`
   - **Exemplu:** `#menu a` — Găsește toate linkurile `<a>` din interiorul lui `#menu`.

2. **Selectorul de Copil Direct (`>`) — „Căutare strictă”:**
   - **Sintaxă:** `ElementA > ElementB`
   - **Exemplu HTML:**
     ```html
     <ul class="main-list">
       <li>Element 1</li>
       <li>
         <ul class="sublist">
           <li>Sub-Element 1</li> <!-- Nepot pentru .main-list -->
         </ul>
       </li>
     </ul>
     ```
   - **CSS:** `.main-list > li` — Selectează doar elementele `<li>` directe, ignorând sub-listele imbricate.

3. **Înlănțuirea (Fără spațiu):**
   - **Sintaxă:** `button.btn-danger[data-status="error"]`
   - **Semnificație:** Găsește un element care respectă **toate** condițiile simultan.

---

### 3.2 Pseudo-clase de Stare: Testarea Dinamismului

* `:hover` — Cursorul mouse-ului este deasupra elementului (`page.locator(...).hover()`).
* `:focus` — Elementul activ care primește date de la tastatură.
* `:disabled` — Element de formular dezactivat:
  ```javascript
  await expect(page.locator('button[type="submit"]')).toBeDisabled();
  ```
* `:checked` — Casete de selectare sau butoane radio bifate.

---

### 3.3 Pseudo-clase Structurale: Găsirea acului în carul cu fân

* `:first-child` / `:last-child` — Primul sau ultimul frate dintr-un grup (`ul.menu > li:last-child`).
* `:nth-child(n)` — Selectează un index exact:
  ```css
  /* Al 3-lea rând dintr-un tabel */
  tr:nth-child(3)
  ```
* Rânduri pare/impare: `tr:nth-child(even)` / `tr:nth-child(odd)`.

---

### 3.4 Poveste Aplicată: „Adresa Completă”

::: note 📖 Poveste Aplicată: Adresa Completă
Imaginează-ți că trebuie să livrezi un colet într-o clădire de birouri:
- **Selector Simplu (`.usa`):** Caută orice ușă din clădire (ambiguu).
- **Selector de Descendent (`#etaj-5 .usa`):** Caută ușile de la etajul 5.
- **Selector de Copil Direct (`#hol-principal > .usa`):** Intră doar pe ușile de pe holul principal.
- **Pseudo-clasă Structurală (`#hol-principal > .usa:nth-child(3)`):** Deschide a 3-a ușă de pe hol.
- **Înlănțuire (`#hol-principal > .usa.rosie:disabled`):** Deschide ușa care este roșie ȘI încuiată.
:::

---

### 3.5 Exerciții Practice

#### Exercițiul 1: Tabelul Problematic
Țintește strict al doilea rând din corpul tabelului `#history-table` folosind un combinator descendent și `:nth-child`.

#### Exercițiul 2: Navigarea în DevTools
1. Intră pe `www.wikipedia.org`.
2. Apasă `Ctrl+F` în panoul Elements.
3. Testează `div.central-featured-lang > strong` comparativ cu `div.central-featured-lang strong`.

---

### 3.6 Răspunsuri la Întrebări & Soluții la Exerciții

::: details 💡 Soluție Exercițiul 1
Cel mai sigur selector este:
```css
#history-table tbody tr:nth-child(2)
```
:::

---

### 3.7 🛡️ Mentalitatea de Inginer în Era AI: Navigarea Ierarhiilor Complexe

::: warning 🛡️ QA vs. AI: Navigarea Ierarhiilor Complexe
- **Capcana:** AI generează des lanțuri fragile: `div > table > tbody > tr:nth-child(5) > td:nth-child(3)`.
- **Cum gândește inginerul:** Se ancorează de un ID stabil: `#date-table tr:nth-child(5) td:nth-child(3)`.
:::

---

## Capitolul 4: Layout Modern (Flexbox de Bază) & Tema Sesiunii 2

::: info 🎯 Obiective de învățare
La finalul acestui capitol, vei fi capabil să:
- Înțelegi modelul Flexbox (**Container** și **Elemente**).
- Corelezi comportamentul flexibil cu rularea testelor E2E pe diferite rezoluții (Desktop vs. Mobile).
- Folosești badge-ul `flex` din Chrome DevTools.
- Rezolvi Tema Sesiunii 2.
:::

### 4.1 De ce ar trebui un QA să înțeleagă Flexbox?

Aplicațiile moderne se adaptează pe diverse ecrane. Când ecranul se micșorează, un container Flexbox rearanjează butoanele, le ascunde într-un meniu hamburger sau le plasează pe mai multe rânduri. Înțelegerea Flexbox explică de ce testele trec pe Desktop (1920x1080) dar pică pe rezoluții Mobile (375x667).

---

### 4.2 Proprietăți de bază în Flexbox

1. **Containerul Flex (Părintele):**
   ```css
   .nav-menu {
     display: flex;
   }
   ```
2. **Alinierea pe axa principală (`justify-content`):**
   - `flex-start` — Toate elementele la stânga.
   - `center` — Elementele în mijloc.
   - `space-between` — Primul element la stânga, ultimul la dreapta, spațiu egal între restul.
3. **Trecerea pe rând nou (`flex-wrap`):**
   ```css
   .button-group {
     flex-wrap: wrap;
   }
   ```

---

### 4.3 Poveste Aplicată: „Raftul de Supermarket”

::: note 📖 Poveste Aplicată: Raftul de Supermarket
- **Containerul Flex:** Raftul de supermarket.
- **Elementele Flex:** Cutiile de cereale așezate pe raft.
- `justify-content: space-between` pune o cutie la un capăt, una la celălalt și le distribuie uniform pe restul.
- `flex-wrap: wrap` face ca produsele care nu mai au loc să treacă automat pe raftul de dedesubt.
:::

---

### 4.4 Exerciții Practice

#### Exercițiul 1: Badge-ul Flex din DevTools
1. Intră pe `www.github.com`.
2. Inspectează bara de navigare de sus.
3. Dă click pe insigna (badge-ul) `flex` din panoul Elements pentru a vizualiza grila elastică direct pe ecran.

---

### 4.5 Răspunsuri la Întrebări & Soluții la Exerciții

::: details 💡 Soluție Exercițiul 1
La apăsarea pe badge-ul `flex`, Chrome desenează pe ecran structura vizuală a containerului flexibil, afișând spațiile libere și marginile copiilor.
:::

---

### 4.6 Tema pentru Acasă (Proiect Sesiunea 2)

**Cerințe Tehnice:**
1. **Fișier CSS Extern:** Documentul HTML trebuie să conțină `<link rel="stylesheet" href="style.css">` în interiorul `<head>`.
2. **Meniu Flexibil (Navbar):**
   - `<nav class="navbar">` în interiorul `<header>`.
   - Element cu `id="logo"` și buton cu `data-testid="btn-login"`.
3. **Selector Structural (Tabel):**
   - Al 3-lea rând (`<tr>`) din `<tbody>` trebuie să conțină un buton cu clasa `delete-row`.
4. **Buton cu Stare Dinamică:**
   - Adaugă `<button disabled data-testid="submit-task-btn">` în formularul de adăugare task.

---

### 4.7 🛡️ Mentalitatea de Inginer în Era AI: Depanarea Anomaliilor de Layout

::: warning 🛡️ QA vs. AI: Depanarea Anomaliilor de Layout
AI analizează cod static, însă layout-ul funcționează dinamic pe diferite rezoluții. Un inginer leagă testele picate în CI/CD de lipsa proprietății `flex-wrap`, raportând un defect clar de Frontend.
:::

---

## Capitolul 5: Provocări & Exerciții Avansate (Nivel Senior)

### 5.1 Provocarea 1: Coșmarul Claselor Dinamice (Tailwind CSS)

```html
<div class="flex-col w-full px-4 py-2 mt-8 wrapper-xyz">
  <div class="item-row flex justify-between border-b pb-2">
    <span class="text-sm font-bold">Abonament Premium</span>
    <button class="bg-red-500 hover:bg-red-700 text-white rounded px-2" aria-label="Delete Subscription">X</button>
  </div>
  <div class="item-row flex justify-between border-b pb-2 mt-4">
    <span class="text-sm font-bold">Taxă de Procesare</span>
    <button class="bg-gray-300 text-gray-500 rounded px-2" disabled>X</button>
  </div>

  <div class="checkout-area mt-10">
    <button class="btn-primary flex items-center justify-center w-full py-4 rounded-lg bg-green-500 text-white font-bold" aria-label="Checkout">
      <span>Continuă spre Plată</span>
    </button>
  </div>
</div>
```

**Misiuni:**
- **Misiunea 1.A:** Scrie un selector robust pentru butonul de plată fără a folosi clase CSS.
- **Misiunea 1.B:** Țintește doar butonul de ștergere activ folosind `:not(:disabled)`.

---

### 5.2 Provocarea 2: Inamicul Invizibil (Z-Index & Overlay-uri)

```html
<button id="save-btn">Salvează Datele</button>
<div class="loading-overlay"></div>
```

```css
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  opacity: 0; /* Invizibil pe ecran, dar interceptează click-urile mouse-ului! */
  z-index: 9999;
}
```

---

### 5.3 💡 Soluții & Explicații

::: details 💡 Soluții: Provocările 1 & 2
- **Provocarea 1.A:**
  ```css
  button[aria-label="Checkout"]
  ```
- **Provocarea 1.B:**
  ```css
  button[aria-label="Delete Subscription"]:not(:disabled)
  ```
- **Provocarea 2:** Adăugarea proprietății `pointer-events: none;` pe `.loading-overlay` permite click-urilor să treacă direct la butonul `#save-btn`:
  ```css
  .loading-overlay {
    pointer-events: none;
  }
  ```

::: tip 📝 Concluzie Importantă
Stăpânirea atributelor `aria-label` și a proprietății `pointer-events` te ajută să rezolvi peste 80% din blocajele apărute în testarea E2E din companii mari!
:::
:::