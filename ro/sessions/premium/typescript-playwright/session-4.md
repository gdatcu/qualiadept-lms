# Sesiunea 4: Manipularea DOM-ului

<div style="display: flex; gap: 12px; flex-wrap: wrap; margin: 1.5rem 0 0.5rem 0;">
  <a href="/pdfs/sessions/premium/typescript-playwright/session-4.pdf" class="download-btn" target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24"><path d="M5 20h14v-2H5v2zm0-10h4V4h6v6h4l-7 7-7-7z"/></svg>Vizualizează suportul de curs (PDF)</a>
  <a href="/pdfs/sessions/premium/typescript-playwright/session-4-extra.pdf" class="download-btn" target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24"><path d="M5 20h14v-2H5v2zm0-10h4V4h6v6h4l-7 7-7-7z"/></svg>Vizualizează Workbook Suplimentar (PDF)</a>
</div>

::: info 📊 Prezentare PowerPoint
Mai jos regăsești prezentarea PowerPoint interactivă aferentă acestei sesiuni. Poți parcurge slide-urile direct din browser sau poți descărca suportul de curs în format PDF folosind butonul de mai sus.
:::

<div style="position: relative; width: 100%; padding-bottom: 56.25%; height: 0; margin: 1.5rem 0; overflow: hidden; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
  <iframe 
    src="https://docs.google.com/presentation/d/e/2PACX-1vQs6yeq_vR_d_4QiQ6uiDM7MzC57bN9P68IO1XHz5HjhS3tDtRM7XqFdgf4cy0EN92FJTprlvR5J_V9/pubembed?start=false&loop=false&delayms=3000" 
    frameborder="0" 
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;" 
    allowfullscreen="true" 
    mozallowfullscreen="true" 
    webkitallowfullscreen="true">
  </iframe>
</div>

---

## Capitolul 1: Conectarea JavaScript cu HTML-ul (Obiectul document și Selectoarele JS)

::: info 🎯 Obiective de învățare
La finalul acestui capitol, vei fi capabil să:
- Înțelegi rolul obiectului global `document` ca punte de legătură între codul tău JS și structura vizuală HTML.
- Folosești comanda `document.querySelector()` pentru a găsi elemente specifice în pagină, bazându-te pe selectoarele CSS învățate anterior.
- Faci diferența între selectarea unui singur element și selectarea unei liste de elemente cu `document.querySelectorAll()`.
- Descoperi paralela directă între selecția nativă din JavaScript și comenzile pe care le vei folosi mai târziu în Playwright (ex: `page.locator()`).
:::

### 1.1 document — Puntea de legătură (The Bridge)

Până acum (în Sesiunea 3), am rulat cod JavaScript în consolă pentru a face calcule matematice, pentru a lucra cu variabile și funcții. Dar codul nostru era oarecum orb. Nu știa absolut nimic despre butoanele sau textele din fișierul nostru HTML.

Când browserul încarcă pagina ta HTML, el o transformă într-o structură de date ascunsă numită **DOM (Document Object Model)**. Vestea bună? Browserul creează automat o variabilă globală în JavaScript numită **document**.

Această variabilă este "cheia universală" a aplicației tale. Ea reprezintă și conține întreaga pagină web!

![Diagrama interacțiunii dintre JavaScript și DOM](/images/sessions/premium/session-4/image1.png)
<span class="image-caption">**Fig. 1** — Diagrama ilustrează arhitectura interacțiunii dintre scriptul JavaScript și elementele unei pagini web. **Codul JavaScript** accesează structura HTML prin intermediul **obiectului global document**, care servește ca interfață de programare. Acesta interoghează **arborele DOM** pentru a identifica, citi și manipula elementele dinamice finale, precum **Butonul de Salvare** și **Input-ul de Text**.</span>

### 1.2 Instrumentul Suprem: document.querySelector()

Cum îi spunem lui JavaScript să "pună mâna" pe un buton ca să putem interacționa cu el mai târziu? Folosind exact "Selectoarele CSS" pe care le-ai învățat în Sesiunea 2 (clase, ID-uri, atribute)!

Cea mai importantă și modernă metodă este `document.querySelector('selector_css')`. Aceasta caută în pagină (de sus în jos) și returnează **primul element** care se potrivește cu descrierea ta.

**Exemple de utilizare:**

```js
// Găsim un element după ID (Recomandat)
const butonAdaugare = document.querySelector('#add-task-btn');

// Găsim un element după Clasă (Va aduce doar primul găsit!)
const primulTask = document.querySelector('.task-item');

// Găsim un element după un Atribut de Test (Stilul QA Automation)
const butonStergere = document.querySelector('[data-testid="delete-btn"]');

// Afișăm în consolă ce am găsit, pentru a fi siguri
console.log(butonAdaugare);
```

> 📎 **Analogie de QA:** `querySelector` este ca un câine de urmă. Îi dai să miroasă o haină (selectorul CSS), iar el aleargă prin tot blocul (DOM) și îți aduce înapoi primul om care se potrivește.

### 1.3 querySelectorAll() — Când vrem lista completă

Ce se întâmplă dacă vrei să numeri câte task-uri ai în aplicație? Dacă folosești `querySelector`, vei primi doar primul task, ignorându-le pe restul.

Pentru a primi o listă completă (foarte asemănătoare cu un Array), folosim `document.querySelectorAll()`.

```js
// Aducem TOATE elementele care au clasa .task-item
const listaToateTaskurile = document.querySelectorAll('.task-item');

// Acum putem folosi proprietatea .length (exact ca la Array-uri)
console.log("Avem un număr total de task-uri: " + listaToateTaskurile.length);
```

Acest concept este esențial pentru testele viitoare. În Playwright, când verifici dacă într-un coș de cumpărături s-au adăugat exact 3 produse, framework-ul execută în fundal un mecanism foarte asemănător pentru a număra elementele din DOM!

### 1.4 Știați că...?

::: tip 💡 Știați că...?
- **$0 în DevTools:** Există un truc secret în Consola Chrome. Dacă mergi în tab-ul *Elements*, dai click pe orice cod HTML, apoi treci în tab-ul *Console* și scrii pur și simplu `$0` și apeși Enter, JavaScript îți va returna instantaneu acel element fără să mai scrii niciun `querySelector`! Este genial pentru debugging rapid.
- **Metodele Legacy:** Pe site-uri vechi (sau în tutoriale din 2010), vei vedea des metode precum `document.getElementById('id')` sau `document.getElementsByClassName('clasa')`. Deși funcționează perfect și sunt puțin mai rapide la executare, industria modernă a standardizat folosirea lui `querySelector` pentru că îți permite să scrii interogări mult mai complexe și înlănțuite (ex: `.container > button:first-child`), folosind o singură comandă unificată.
:::

### 1.5 Exerciții Practice

*Deschide fișierul `index.html` al aplicației tale "Task Tracker" în browser, apasă F12 și mergi la tab-ul Console.*

👀 **Misiunea 1:**  
Folosește `document.querySelector` pentru a găsi câmpul de text unde utilizatorul scrie numele unui task (input-ul de text). Salvează-l într-o constantă numită `inputTask` și printează-l în consolă cu `console.log`.

👀 **Misiunea 2:**  
Folosește `document.querySelectorAll` pentru a găsi absolut toate tag-urile `<button>` de pe pagina ta. Câte butoane ai în total în aplicație la acest moment?

### 1.6 Soluții la Exerciții

::: details 💡 Soluție Misiunea 1
```js
// Presupunând că input-ul tău are id-ul "task-name" sau clasa "task-input"
const inputTask = document.querySelector('#task-name');
console.log(inputTask);
```
:::

::: details 💡 Soluție Misiunea 2
```js
const toateButoanele = document.querySelectorAll('button');
console.log(toateButoanele.length); // Îți va printa un număr, ex: 3
```
:::

### 1.7 🤖 Mentalitatea de Inginer în Era AI: Locul tău pe piață

::: warning 🛡️ QA vs. AI: Tranziția către Gândirea de Automatizare
- **Ce face AI-ul bine:** Dacă îi ceri unui AI (ex: ChatGPT, GitHub Copilot) să scrie cod pentru a manipula o pagină, el îți va genera cod instantaneu.
- **Capcana (Unde AI-ul eșuează):** AI-ul a fost antrenat pe milioane de linii de cod vechi de peste un deceniu. Dacă nu ești specific, AI-ul îți va genera adesea selectoare bazate pe `document.getElementsByTagName` sau se va lega de clase CSS specifice designului (ex: `.bg-blue-500`) pentru a găsi elementele. Această abordare generează scripturi "fragile", care se vor rupe imediat ce UI-ul suferă mici modificări vizuale.
- **Cum gândește un inginer QA:** Inginerul QA știe că testabilitatea este rege. El va scrie (sau va instrui AI-ul să scrie) selecții bazate exclusiv pe `querySelector` folosind atribute stabile de test, de tipul `[data-testid="submit-btn"]`. De ce? Pentru că atunci când vei trece la Playwright (Modulul 4), comanda nativă `document.querySelector('[data-testid="submit-btn"]')` se va traduce arhitectural 1:1 în `page.getByTestId('submit-btn')`.
- **De ce vei rămâne relevant pe piață:** Un simplu executant copiază orbește codul oferit de AI. Tu, în schimb, acționezi ca un "Arhitect de Testare". Forțând o anumită metodologie de selectare a elementelor chiar și în JavaScript-ul de bază, tu te asiguri că aplicația și testele vor "vorbi" exact aceeași limbă, reducând drastic timpul de mentenanță pe termen lung pentru întreaga echipă.
:::

---

## Capitolul 2: Dăm viață paginii — Ascultătorii de evenimente (addEventListener)

::: info 🎯 Obiective de învățare
La finalul acestui capitol, vei fi capabil să:
- Înțelegi ce este un eveniment (Event) în contextul unui browser web.
- Folosești metoda `addEventListener` pentru a face elementele HTML să reacționeze la acțiunile utilizatorului.
- Lucrezi cu funcții de tip *Callback* (Arrow Functions) care se execută doar la momentul potrivit.
- Corelezi evenimentele native din JavaScript cu acțiunile de testare pe care le vei executa mai târziu cu Playwright.
:::

### 2.1 Ce este un Eveniment (Event)?

Imediat ce pagina web s-a încărcat, browserul stă și "ascultă" în liniște. Când utilizatorul mișcă mouse-ul, dă un click, apasă o tastă sau face scroll, browserul generează un **Eveniment**.

Fără cod JavaScript care să reacționeze la aceste evenimente, click-urile tale ar lovi elementele HTML fără să se întâmple absolut nimic (în afară de elementele native, cum sunt link-urile `<a>`).

Aici intră în scenă **Ascultătorul de Evenimente (Event Listener)**. Acesta este ca un agent de pază pe care îl pui lângă un buton și căruia îi spui: *"Stai aici și urmărește acest buton. Când cineva dă click pe el, declanșează imediat alarma (funcția mea)!"*

![Fluxul de gestionare a evenimentelor](/images/sessions/premium/session-4/image2.png)
<span class="image-caption">**Fig. 2** — Diagrama de secvență ilustrează fluxul asincron de gestionare a evenimentelor în browser (*Event Handling*). Procesul începe cu **interacțiunea utilizatorului** (click), moment în care **elementul DOM** capturează acțiunea și emite un semnal către **JavaScript**. Scriptul interceptează asincron evenimentul prin structura de tip *Event Listener*, execută funcția de răspuns (*callback*) și reflectă instantaneu modificările rezultate în interfața grafică.</span>

### 2.2 Sintaxa: addEventListener

Structura standard prin care legăm o acțiune de un element este:

```js
element.addEventListener('nume_eveniment', () => {
    // Codul care se execută DOAR când se întâmplă evenimentul
});
```

Observi că al doilea argument este o **Arrow Function** (funcție săgeată)? Aceasta se numește **funcție Callback**. Ea nu se execută imediat când browserul citește fișierul, ci "stă la pândă" și se declanșează exclusiv când utilizatorul face acțiunea specificată.

### 2.3 Tipuri comune de evenimente pentru QA

În testarea automatizată, vei emula în principal următoarele tipuri de evenimente:

* `'click'` — Utilizatorul apasă cu mouse-ul pe buton/link.
* `'submit'` — Trimiterea unui formular (la apăsarea tastei Enter sau a butonului de Submit).
* `'input'` sau `'change'` — Utilizatorul tastează într-un câmp sau alege o opțiune dintr-un dropdown.
* `'keydown'` — O tastă fizică a fost apăsată de la tastatură.

### 2.4 Știați că...?

::: tip 💡 Știați că...?
În Playwright, comanda `await page.click('#btn')` emite automat în fundal evenimentele native de `pointerdown`, `mousedown`, `pointerup` și `click`, emulând 100% comportamentul degetului sau mouse-ului uman!
:::

### 2.5 Exercițiu Practic (Cap-Coadă)

**Scenariul:** Vrem ca atunci când utilizatorul apasă butonul "Salvează Task", butonul să își schimbe textul în "Task Salvat! ✅" și culoarea în verde, pentru a oferi feedback vizual.

**Pasul 1: Pregătirea terenului**

Deschide fișierul tău `index.html` (din Sesiunea 1) în Chrome. Apasă F12 și mergi la tab-ul **Console**.

* **Codul HTML complet (`index.html`):**

Acesta este scheletul din Sesiunea 1, la care am adăugat linia `<script src="app.js"></script>` jos, fix înainte de închiderea `</body>`, pentru a lega logica.

```html
<!DOCTYPE html>
<html lang="ro">
  <head>
    <meta charset="UTF-8">
    <title>Task Tracker Pro - QA Edition</title>
    <style>
      /* Un pic de CSS de bază pentru a vedea efectul frumos */
      body {
        font-family: 'Montserrat', sans-serif;
        padding: 20px;
      }

      button {
        padding: 10px 20px;
        cursor: pointer;
        border: none;
        border-radius: 5px;
        background-color: #007bff;
        color: white;
        transition: 0.3s;
      }
    </style>
  </head>
  <body>
    <header>
      <h1>Task Tracker Pro - QA Edition</h1>
    </header>
    <main>
      <!-- Secțiunea de adăugare task -->
      <section class="task-input-section">
        <h2>Adaugă un Task Nou</h2>
        <form id="add-task-form">
          <label for="task-name">Nume Task:</label>
          <input type="text" id="task-name" data-testid="input-task-name" placeholder="Ex: Scrie scenarii E2E" required>
          <br>
          <br>
          <!-- Butonul țintă pentru exercițiul nostru -->
          <button type="submit" id="add-task-btn" data-testid="submit-new-task">Salvează Task</button>
        </form>
      </section>
      <section class="task-list-section">
        <h2>Task-uri Active</h2>
        <!-- Acesta este elementul CRITIC pe care îl caută JavaScript-ul tău! -->
        <ul id="active-tasks-list">
          <!-- Aici vor apărea dinamic noile <li>-uri adăugate de tine -->
        </ul>
      </section>
    </main>
    <!-- Legătura către fișierul JavaScript -->
    <script src="app.js"></script>
  </body>
</html>
```

* **Codul JavaScript complet (`app.js`):**

Acest cod conține exercițiul exact așa cum a fost gândit, pus într-un fișier separat pentru a respecta bunele practici (Separation of Concerns). Dacă se dorește rularea doar în DevTools Console, putem pur și simplu să dăm copy-paste acestui bloc direct acolo.

```js
// PASUL 1: Găsim elementul pe pagină (Selectarea)
const butonSalvare = document.querySelector('#add-task-btn');

// PASUL 2: "Ascultăm" interacțiunea utilizatorului
// Parametrul 'event' (sau 'e') prinde detaliile acțiunii fizice de click
butonSalvare.addEventListener('click', (event) => {
    // TRUC VITAL: Oprim comportamentul nativ al formularului!
    // Dacă nu punem asta, pagina își dă refresh instant și pierdem starea.
    event.preventDefault();

    // PASUL 3: Modificăm DOM-ul live (Schimbăm Textul)
    butonSalvare.textContent = "Task Salvat! ✅";

    // PASUL 4: Modificăm CSS-ul prin JavaScript (Schimbăm Culoarea)
    butonSalvare.style.backgroundColor = "#28a745"; // Verde de succes
    butonSalvare.style.transform = "scale(1.1)";    // Îl facem puțin mai mare pentru efect

    // Raportăm în consolă pentru QA
    console.log("Interacțiune detectată! Funcția a oprit refresh-ul și a modificat DOM-ul.");
});
```

**Pasul 2: Selectarea butonului în Consolă**

În consolă, scrie următoarea linie și apasă Enter pentru a prinde butonul într-o constantă:

```js
const btnAdauga = document.querySelector('[data-testid="submit-new-task"]');
```

*(Dacă nu ai pus atributul `data-testid`, folosește `querySelector('#add-task-btn')`)*.

**Pasul 3: Adăugarea Ascultătorului și a Logicii (Execuția)**

Scrie (sau copiază) următorul bloc de cod în consolă și apasă Enter. Atenție, codul folosește obiectul `.style` pentru a modifica direct CSS-ul din JavaScript!

```js
btnAdauga.addEventListener('click', () => {
    // 1. Schimbăm textul din interiorul butonului
    btnAdauga.textContent = "Task Salvat! ✔️";

    // 2. Modificăm proprietatea CSS de fundal (observă scrierea camelCase)
    btnAdauga.style.backgroundColor = "#28a745";

    // 3. Schimbăm culoarea textului în alb pentru contrast
    btnAdauga.style.color = "white";
});
```

**Pasul 4: Testarea Manuală (Momentul de Magie!)**

După ce ai dat Enter în consolă (browserul va afișa `undefined`, e normal), închide DevTools. Du-te cu mouse-ul și **dă click** fizic pe butonul tău din pagină. Ai observat cum interfața a reacționat instantaneu și s-a colorat în verde? Tocmai ai scris prima ta logică de interacțiune Frontend!

<div style="display: flex; gap: 16px; flex-wrap: wrap; margin: 1rem 0;">
  <img src="/images/sessions/premium/session-4/button-initial.png" alt="Butonul înainte de click" style="max-height: 50px; border-radius: 4px;" />
  <img src="/images/sessions/premium/session-4/button-clicked.png" alt="Butonul după click" style="max-height: 50px; border-radius: 4px;" />
</div>

### 2.6 Cum se traduce asta în munca unui QA?

Exercițiul de mai sus reprezintă exact ceea ce face un developer Front-End. Rolul tău ca inginer de automatizare este să verifici dacă acest `addEventListener` a funcționat. Mai târziu în curs, testul tău Playwright pentru acest scenariu va arăta fix așa:

```js
// Așa va arăta testul tău E2E în Modulul 4!
await page.getByTestId('submit-new-task').click();
await expect(page.getByTestId('submit-new-task')).toHaveText('Task Salvat! ✔️');
```

### 2.7 🤖 Mentalitatea de Inginer în Era AI: Locul tău pe piață

::: warning 🛡️ QA vs. AI: Capcana "onClick" și Testabilitatea
- **Ce face AI-ul bine:** Când îi ceri unui asistent de programare (ex: GitHub Copilot) să adauge interactivitate unui buton într-un proiect, o va face rapid.
- **Capcana (Unde AI-ul eșuează):** Uneori, mai ales pe proiecte de tip prototip, un AI leneș îți va altera direct fișierul HTML și va adăuga atributul `<button onclick="trimiteFormular()">` (Inline events), în loc să folosească arhitectura modernă cu `addEventListener` în fișierul JS.
- **Cum gândește un inginer QA:** Inginerul se uită imediat pe cod (Code Review) și respinge această abordare. El știe că logica amestecată cu UI-ul face aplicația mult mai greu de testat. Dacă un event listener este atașat curat în JavaScript, poți "moca" (simula/intercepta) funcția `trimiteFormular()` mult mai ușor în timpul testelor de Componentă. Inginerul va cere refactorizarea codului pentru a menține aplicația curată și la standarde Enterprise.
- **De ce vei rămâne relevant pe piață:** Valoarea ta nu este de a scrie repede o funcție care dă "click" (AI-ul face asta într-o secundă). Valoarea ta este să aperi arhitectura și bunele practici. Aplicațiile care ocolesc standardele devin cu timpul o "mlaștină" imposibil de menținut. Ca QA, tu ești vocea calității încă de la nivelul codului sursă.
:::

---

## Capitolul 3: Adăugarea și Ștergerea Dinamică a Elementelor în DOM

::: info 🎯 Obiective de învățare
La finalul acestui capitol, vei fi capabil să:
- Înțelegi diferența dintre un element creat în memoria JavaScript și un element vizibil pe ecran.
- Folosești `document.createElement()` pentru a genera elemente HTML noi din cod.
- Injectezi elementele noi în structura paginii folosind `appendChild()` sau `append()`.
- Elimini elemente din pagină folosind metoda `remove()`.
- Corelezi aceste concepte cu provocările reale din testarea automatizată (elemente care apar cu întârziere).
:::

### 3.1 Nașterea unui Element: document.createElement()

În aplicațiile web moderne (scrise în React sau Angular), HTML-ul inițial este adesea aproape gol. Interfața este construită "din mers" (dinamic) de către JavaScript, pe măsură ce datele vin de la server sau utilizatorul interacționează cu pagina.

Pentru a crea un element nou direct din JavaScript, folosim comanda `document.createElement('nume_tag')`.

```js
// 1. Creăm un element de listă <li> în MEMORIA browserului
const taskNou = document.createElement('li');

// 2. Îl configurăm (îi dăm text, clase, atribute)
taskNou.textContent = "Învață Playwright";
taskNou.className = "task-item";
```

> **Atenție:** În acest moment, elementul `taskNou` există doar în memoria temporară JavaScript. El **NU** este vizibil pe ecran pentru că nu a fost atașat în "Arborele Genealogic" al DOM-ului.

### 3.2 Inserarea în Pagină: appendChild()

Pentru a face elementul vizibil, trebuie să îl agățăm de un "Părinte" deja existent în HTML. Gândește-te la asta ca la asamblarea unui set de Lego: mai întâi construiești piesa nouă în mână (`createElement`), apoi o fixezi pe placa de bază (`appendChild`).

```js
// Găsim părintele din pagină (ex: lista noastră de task-uri <ul>)
const listaTaskuri = document.querySelector('#active-tasks-list');

// Atașăm noul element la sfârșitul listei de copii
listaTaskuri.appendChild(taskNou);
```

Acum s-a produs magia! Elementul a apărut pe ecran instantaneu, fără ca pagina să își dea refresh.

### Ciclul de Viață al unui Element Dinamic

Iată vizualizarea procesului complet, de la idee până la afișarea pe ecran:

![Ciclul de viață al unui element dinamic](/images/sessions/premium/session-4/image3.png)
<span class="image-caption">**Fig. 3** — Diagrama detaliază ciclul complet de viață al unui nod HTML gestionat dinamic prin JavaScript. Fluxul cuprinde patru etape: **crearea inițială în memoria RAM** (createElement), **configurarea atributelor** (clase CSS, text intern), **atașarea în structura vizibilă a paginii** (appendChild) și, în final, **eliminarea nodului din interfața grafică** (remove sau removeChild). Această ultimă etapă întrerupe legătura elementului cu arborele DOM și permite browserului să elibereze resursele de memorie asociate.</span>

### 3.3 Distrugerea unui Element: remove()

Ștergerea unui element este mult mai simplă decât crearea lui. Dacă ai referința către acel element, apelezi pur și simplu metoda `.remove()`.

```js
// Găsim primul buton de ștergere de pe pagină
const butonSterge = document.querySelector('.delete-btn');

// Îl eliminăm complet din DOM
butonSterge.remove();
```

> 📎 **Notă QA:** În automatizare, verificarea ștergerii este o asertare critică (ex: `expect(locator).not.toBeVisible()`).

### 3.4 Workshop Practic: Task Tracker Funcțional!

Hai să unim tot ce am învățat în Sesiunea 4 (Selectare + Evenimente + DOM Dinamic). Vom face formularul tău să adauge efectiv task-uri reale în listă!

*Deschide fișierul tău `app.js` și înlocuiește codul vechi cu acesta. Apoi testează aplicația în browser!*

```js
// 1. Selectăm elementele de care avem nevoie
const formular = document.querySelector('#add-task-form');
const inputTask = document.querySelector('#task-name');
const listaTaskuri = document.querySelector('#active-tasks-list');

// 2. Ascultăm evenimentul de 'submit' (trimitere) al formularului
formular.addEventListener('submit', (event) => {
    // Oprim reîncărcarea paginii
    event.preventDefault();

    // Extragem valoarea (textul) scrisă de utilizator în input
    const textNou = inputTask.value;

    // 3. Creăm un element nou <li>
    const liNou = document.createElement('li');
    liNou.className = 'task-item';
    liNou.textContent = textNou;

    // 4. Îl injectăm în DOM (în interiorul <ul>)
    listaTaskuri.appendChild(liNou);

    // 5. Curățăm input-ul pentru a face loc următorului task
    inputTask.value = '';

    console.log("Task adăugat cu succes: " + textNou);
});
```

**Testează-l!** Scrie "Învață TypeScript" în căsuță și apasă "Salvează Task". Vei vedea cum lista se mărește live, sub ochii tăi! Aplicația ta prinde contur real.

![Task Tracker UI](/images/sessions/premium/session-4/task-tracker.png)

### 3.5 🤖 Mentalitatea de Inginer în Era AI: "Acul care se mișcă în carul cu fân"

::: warning 🛡️ QA vs. AI: Iluzia unui DOM Static
- **Ce face AI-ul bine:** Asistenții bazați pe LLM înțeleg perfect cum să scrie o funcție care dă click pe un element. Ei presupun logic: *Găsește elementul X -> Execută acțiunea Y*.
- **Capcana (Unde AI-ul eșuează):** AI-ul abordează o pagină web ca pe un document PDF (ceva static și neschimbat). Dar tu tocmai ai văzut cum elementele se creează și se șterg în milisecunde (`createElement`, `remove`). Dacă un test generat de AI încearcă să valideze textul unui task imediat după ce a dat click pe "Salvează", testul poate pica brusc (Flaky Test). De ce? Pentru că AI-ul nu a luat în calcul cele 50 de milisecunde în care JavaScript-ul se execută pentru a injecta elementul în DOM cu `appendChild`. Scriptul a fost prea rapid pentru interfață!
- **Cum gândește un inginer QA:** Inginerul știe că DOM-ul este un organism viu. Când un inginer QA scrie un test E2E (sau corectează codul AI-ului), el nu presupune că elementul este acolo. El folosește metode cu Așteptare Activă (Auto-Waiting). În Playwright, tu vei scrie comenzi de tipul: *„Așteaptă până când elementul cu textul X este atașat în DOM (State: attached), și abia apoi validează-l”*.
- **De ce vei rămâne relevant pe piață:** Diferența dintre un tester mediocru și un Senior Automation Engineer este capacitatea de a stabiliza testele. Înțelegând exact mecanica prin care framework-urile Frontend adaugă elemente în pagină, vei ști de ce testele tale pică și, mai important, cum să scrii asertări reziliente la latențele de randare ale browserului.
:::

---

## Capitolul 4: Concepte Avansate (Bonus) — Latența și Propagarea Evenimentelor

::: info 🎯 Obiective de învățare
La finalul acestui capitol, vei fi capabil să:
- Înțelegi fenomenul de latență (delay) în aplicațiile web folosind `setTimeout`.
- Conștientizezi cum latența cauzează teste "Flaky" (instabile) și de ce asertările stricte pică.
- Descoperi conceptul de "Event Bubbling" (propagarea evenimentelor) în DOM.
- Corelezi aceste mecanisme avansate JavaScript cu funcțiile de Auto-Waiting din Playwright.
:::

### 4.1 Inamicul numărul 1 al Automatizării: Latența (setTimeout)

În exemplele noastre de până acum, când dădeai click pe un buton, textul sau elementul nou apărea instantaneu (în zero milisecunde). În lumea reală, lucrurile nu stau așa. Când adaugi un produs în coș pe un magazin online, **browserul** trebuie să **trimită** datele la **server**, să **aștepte confirmarea** și abia apoi să îți **afișeze mesajul** de succes pe ecran. Acest drum poate dura între **100ms** și câteva **secunde**.

Pentru a simula această întârziere (latență) în JavaScript, folosim funcția `setTimeout()`.

```js
const butonComanda = document.querySelector('#plaseaza-comanda');

butonComanda.addEventListener('click', () => {
    console.log("Comanda se procesează...");

    // Simulăm răspunsul serverului cu o întârziere de 3 secunde (3000 milisecunde)
    setTimeout(() => {
        butonComanda.textContent = "Comandă Plasată!";
        butonComanda.style.backgroundColor = "green";
        console.log("UI-ul a fost actualizat după 3 secunde.");
    }, 3000);
});
```

### 4.2 Cum distruge Latența testele QA?

Dacă ai scrie un test E2E clasic (stil vechi, cum era Selenium la începuturi) pentru codul de mai sus, testul tău ar arăta cam așa:

1. Dă click pe `#plaseaza-comanda`
2. Validează că textul butonului este "Comandă Plasată!" -> **TEST PICAT! ❌**

*De ce a picat?* Pentru că robotul tău execută pasul 2 în exact 5 milisecunde după pasul 1. Butonul nu a apucat să se facă verde, pentru că serverul (simulat de `setTimeout`) avea nevoie de 3000 de milisecunde! Acesta este faimosul **Flaky Test** (test care pică și trece aparent aleator, în funcție de viteza internetului).

**Soluția Playwright:** Când vom ajunge la modulul de Playwright, asertările noastre vor arăta așa:

```js
await expect(butonComanda).toHaveText("Comandă Plasată!");
```

Cuvântul cheie aici este *Auto-Waiting*. Playwright nu verifică doar o dată și pică. El verifică de zeci de ori pe secundă, așteptând (până la un timeout maxim de 5 secunde) ca acel `setTimeout` din JavaScript să își termine treaba și să modifice DOM-ul!

![Ciclul de viață extins al elementelor din DOM](/images/sessions/premium/session-4/image4.png)
<span class="image-caption">**Fig. 4** — Diagrama detaliază ciclul complet de viață al unui nod HTML gestionat dinamic prin JavaScript. Fluxul cuprinde patru etape: **crearea inițială în memoria RAM** (createElement), **configurarea atributelor** (clase CSS, text intern), **inserarea în structura web vizibilă** (appendChild) și, în final, **eliminarea elementului din interfața grafică** (remove sau removeChild). Această ultimă etapă întrerupe legătura elementului cu arborele DOM, permițând browserului să elibereze resursele de memorie asociate.</span>

### 4.3 Secretul interfețelor: Event Bubbling (Bulele de săpun)

Imaginați-vă că aveți un buton de ștergere în interiorul unui paragraf, care la rândul lui este în interiorul unui formular.

Ce se întâmplă când dai click pe buton?

În JavaScript, evenimentele "fierb" și se ridică la suprafață exact ca bulele de aer din apă (Event Bubbling).

Când dai click pe `<button>`, browserul declanșează:
- Click pe `<button>` (Copil)
- Apoi Click pe `<p>` (Părinte)
- Apoi Click pe `<form>` (Bunic)
- Apoi Click pe `<body>`... până sus la Rădăcină!

```js
// Dacă aveai ascultători pe fiecare, un singur click va declanșa 3 acțiuni!
button.addEventListener('click', () => console.log("Click pe buton"));
paragraph.addEventListener('click', () => console.log("Click pe paragraf"));
form.addEventListener('click', () => console.log("Click pe formular"));
```

### 4.4 Oprirea propagării (stopPropagation)

Uneori, programatorii folosesc metoda `event.stopPropagation()` pentru a bloca "bula" să mai urce mai sus de elementul apăsat.

Ca QA, te vei lovi de acest concept când vei încerca să dai click pe un icon mic (ex: o bifă) aflat într-un chenar mare, dar din cauza modului în care a fost gestionată propagarea pe Frontend, click-ul tău s-ar putea să "lovească" doar părintele, iar evenimentul să nu ajungă niciodată la logica dorită, dacă scrii selectorul greșit.

### 4.5 🤖 Mentalitatea de Inginer în Era AI

::: warning 🛡️ QA vs. AI: Thread.sleep() vs Așteptare Inteligentă
- **Ce face AI-ul bine:** Dacă îi ceri unui AI să scrie un test pentru o pagină unde elementele apar cu întârziere, îți va scrie codul de click.
- **Capcana (Unde AI-ul eșuează):** Un AI prost instruit, atunci când este confruntat cu un test care pică din cauza latenței descrise la secțiunea 4.1, va sugera cea mai toxică practică din QA: Așteptarea statică (Hard Sleep). Îți va genera o linie de cod care spune `await page.waitForTimeout(3000);` (Oprește testul complet 3 secunde). Dacă ai 200 de teste și AI-ul îți bagă 3 secunde pauză în fiecare, suita ta de teste va rula în 10 minute în loc de 30 de secunde!
- **Cum gândește un inginer QA:** Inginerul știe cum funcționează de fapt `setTimeout` și DOM-ul. El va șterge așteptarea fixă (sleep-ul) și se va asigura că folosește comenzi bazate pe Stare (State-based waiting), cerându-i lui Playwright să acționeze dinamic: *"Așteaptă doar cât este necesar ca DOM-ul să atingă starea corectă"*.
:::

---

## Capitolul 5: Tema Sesiunii 4 & Provocarea Bonus

### 5.1 Tema pentru Acasă (Proiect Sesiunea 4)

🔍 **Sarcina ta (Task-ul de business):**

În sesiunile anterioare am pregătit interfața (HTML/CSS) pentru aplicația noastră "Task Tracker", inclusiv un tabel unde vom ține istoricul task-urilor. 

Acum a sosit momentul să conectăm JavaScript-ul! Sarcina ta este să interceptezi formularul de adăugare și să injectezi noile task-uri direct ca rânduri noi în tabelul HTML, fiecare venind "la pachet" cu propriul buton funcțional de ștergere.

> 📝 **Notă pentru execuție:** Vei scrie acest cod în fișierul tău `app.js`. Testează de fiecare dată în browser dând refresh la pagina `index.html`, iar la final validează-ți munca în **platforma QualiAdept**!

**Cerințe Tehnice (Acceptance Criteria pentru platforma de validare):**

* **Conectarea fișierului:** Asigură-te că fișierul `app.js` este inclus în `index.html` folosind tag-ul `<script>`.
* **Selectarea Elementelor DOM:** Folosește `document.querySelector(...)` sau `getElementById(...)` pentru a găsi formularul (`#add-task-form`), câmpul de text (`#task-name`) și corpul tabelului (`tbody` sau `#task-list`).
* **Ascultător de Eveniment:** Adaugă un ascultător de eveniment pentru formular folosind `addEventListener('submit', ...)`.
* **Prevenirea Reîncărcării:** În interiorul ascultătorului, apelează metoda `e.preventDefault()` (sau `event.preventDefault()`) pentru a opri reîncărcarea nativă a paginii.
* **Crearea Dinamică:** Extrage textul din input, apoi creează un element de rând nou folosind comanda `document.createElement('tr')`.
* **Structura Rândului:** Asigură-te că noul rând conține celulele necesare (`<td>`), inclusiv un buton de ștergere care are obligatoriu clasa `delete-row`.
* **Inserarea în DOM:** Adaugă noul rând în corpul tabelului folosind metoda `.appendChild(...)` sau `.append(...)`.
* **Curățarea Inputului:** Resetează valoarea câmpului de input la un string gol (`input.value = ''`) după salvarea task-ului.
* **Ștergerea Dinamică:** Implementează logica de ștergere la apăsarea butonului, folosind metoda `.remove()` pe rândul părinte (`<tr>`).

> 📎 **Analogie QA:** Acest scenariu reprezintă testul suprem de End-to-End: Create & Delete. În Playwright, tu vei completa câmpul, vei da click pe 'Adaugă Task', vei valida că rândul a apărut în tabel, apoi vei da click pe butonul său de 'Șterge' și vei valida cu `expect(locator).not.toBeVisible()` că a dispărut!

### 5.2 Provocarea Bonus (Opțional): Dezactivarea Inteligentă a Butonului

💎 **Scenariul:**

În aplicațiile moderne de top (Enterprise), butonul de "Adaugă Task" este dezactivat vizual (gri, imposibil de apăsat) atâta timp cât câmpul de text este gol, pentru a preveni trimiterea de task-uri invizibile.

🤯 **Misiunea ta:**

Găsește butonul de "Adaugă Task" din HTML. Găsește input-ul. Pune un `addEventListener` de tip `'input'` pe câmpul de text (acesta se declanșează la fiecare literă tastată de utilizator).

Scrie o logică astfel încât:
* Dacă valoarea input-ului este un string gol (`""`), butonul primește atributul de blocare (folosind `buton.disabled = true;`).
* Dacă input-ul are cel puțin un caracter, butonul devine activ (`buton.disabled = false;`).

### 5.3 🗝️ Cheile de Rezolvare (Soluții & Explicații)

> 🛑🚫🚨 **Nu trișa!** Citește asta doar după ce te-ai blocat sau ai încercat să scrii codul singur **minim 20 de minute**. Codul de mai jos este garantat să treacă de toate validările statice (**Regex**) ale platformei QualiAdept.

::: details 💡 Soluție Tema pentru Acasă
```js
// 1. Selectare elemente DOM
const form = document.querySelector('#add-task-form');
const input = document.getElementById('task-name');
const tbody = document.querySelector('tbody');

// 2 & 3. Ascultător eveniment 'submit' și prevenirea reîncărcării
form.addEventListener('submit', function(e) {
    e.preventDefault();

    // 4. Creăm dinamic elementul de rând nou
    const tr = document.createElement('tr');

    // 5. Generăm structura rândului, incluzând butonul cu clasa 'delete-row'
    tr.innerHTML = '<td>#1003</td><td>' + input.value + '</td><td><button class="delete-row">Sterge</button></td>';

    // 6. Adăugăm noul rând în corpul tabelului
    tbody.appendChild(tr);

    // 7. Curățăm inputul după adăugare
    input.value = '';
});

// 8 & 9. Ștergere Dinamică din DOM folosind Event Delegation
document.addEventListener('click', function(e) {
    // Verificăm dacă elementul apăsat are clasa 'delete-row'
    if (e.target.classList.contains('delete-row')) {
        // Căutăm cel mai apropiat părinte de tip <tr> și îl ștergem cu .remove()
        e.target.closest('tr').remove();
    }
});
```
:::

::: details 💡 Soluție Provocarea Bonus (Validare Live)
```js
// Găsim butonul de submit pe care vrem să-l manipulăm
const butonSubmit = document.querySelector('[data-testid="submit-task-btn"]');

// Setăm starea inițială: când deschidem pagina, câmpul e gol, deci dezactivăm butonul
butonSubmit.disabled = true;

// Ascultăm la fiecare literă pe care utilizatorul o tastează în input
input.addEventListener('input', () => {
    // Dacă lungimea textului este 0 (adică e gol), disable rămâne true
    if (input.value.length === 0) {
        butonSubmit.disabled = true;
    } else {
        // Altfel, dacă a scris ceva, activăm butonul
        butonSubmit.disabled = false;
    }
});
```
:::

---

## Capitolul 6: Workbook Suplimentar — Simulator QA & Mega-Suită de 15 Exerciții DOM

::: info 📈 Despre acest Workbook
Acest capitol conține aplicația web de bază pentru exersare (**Simulatorul QA**) și o suită completă de **15 exerciții practice** (împărțite pe niveluri de dificultate: Intermediar și Masterclass) pentru a aprofunda practic selectoarele, ascultătorii de evenimente, manipularea dinamică a DOM-ului, latența (`setTimeout`) și propagarea evenimentelor (*Event Bubbling*).

Poți parcurge materialul direct în această pagină sau poți consulta ghidul dedicat în format PDF:
<div style="margin-top: 0.85rem;">
  <a href="/pdfs/sessions/premium/typescript-playwright/session-4-extra.pdf" class="download-btn" target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24"><path d="M5 20h14v-2H5v2zm0-10h4V4h6v6h4l-7 7-7-7z"/></svg>Vizualizează Workbook Suplimentar (PDF)</a>
</div>
:::

### 6.1 Codul Aplicației: Simulatorul QA (`index.html`)

Acesta este codul complet al aplicației de test. Creează un fișier local numit `index.html`, lipește codul de mai jos în el și deschide-l în browser (Chrome, Edge sau Firefox), apoi deschide consola cu <kbd>F12</kbd> (sau <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>I</kbd>) pentru a rula scripturile din exerciții.

```html
<!DOCTYPE html>
<html lang="ro">
<head>
    <meta charset="UTF-8">
    <title>Simulator QA - Manipularea DOM-ului</title>
    <style>
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            background-color: #f4f4f9; 
            padding: 20px; 
        }
        .card { 
            background: white; 
            padding: 20px; 
            border-radius: 8px; 
            box-shadow: 0 4px 6px rgba(0,0,0,0.1); 
            max-width: 500px; 
            margin: auto; 
        }
        .form-group { 
            margin-bottom: 15px; 
        }
        input[type="text"] { 
            width: 100%; 
            padding: 10px; 
            box-sizing: border-box; 
            border: 1px solid #ccc; 
            border-radius: 4px; 
        }
        button { 
            background: #007bff; 
            color: white; 
            border: none; 
            padding: 10px 15px; 
            cursor: pointer; 
            border-radius: 4px; 
            transition: 0.3s;
        }
        button:disabled { 
            background: #ccc; 
            cursor: not-allowed; 
        }
        ul { 
            list-style-type: none; 
            padding: 0; 
        }
        li { 
            background: #e9ecef; 
            margin-bottom: 8px; 
            padding: 12px; 
            display: flex; 
            justify-content: space-between; 
            align-items: center; 
            border-radius: 4px; 
        }
        .delete-btn { 
            background: #dc3545; 
            padding: 5px 10px; 
            font-size: 12px; 
        }
        .loading { 
            display: none; 
            color: #ffc107; 
            font-weight: bold; 
            margin-top: 10px; 
            font-size: 14px; 
        }
        .completed { 
            text-decoration: line-through; 
            color: #6c757d; 
        }
    </style>
</head>
<body>
    <div class="card">
        <h2>QA Event & DOM Simulator</h2>
        <form id="qa-form">
            <div class="form-group">
                <label for="task-input">Adaugă Scenariu de Test:</label><br><br>
                <input type="text" id="task-input" placeholder="Ex: Test login valid...">
                <small id="char-count" style="color: gray; display: block; margin-top: 5px;">0 caractere introduse</small>
            </div>
            <!-- Butonul pornește dezactivat -->
            <button type="submit" id="submit-btn" data-testid="save-btn" disabled>Salvează (Latență 2s)</button>
            <p id="loading-msg" class="loading">Se comunică cu serverul...</p>
        </form>
        <hr>
        <h3>Scenarii Active</h3>
        <ul id="task-list">
            <!-- Elementele vor fi adăugate aici de JS -->
        </ul>
    </div>

    <script>
        // 1. Selectarea Elementelor (Obiectul document)
        const form = document.querySelector('#qa-form');
        const input = document.querySelector('#task-input');
        const submitBtn = document.querySelector('#submit-btn');
        const taskList = document.querySelector('#task-list');
        const charCount = document.querySelector('#char-count');
        const loadingMsg = document.querySelector('#loading-msg');

        // 2. Ascultător pentru Evenimentul 'input' - Validare Live
        input.addEventListener('input', () => {
            const text = input.value.trim();
            charCount.textContent = `${text.length} caractere introduse`;
            
            if (text.length === 0) {
                submitBtn.disabled = true;
            } else {
                submitBtn.disabled = false;
            }
        });

        // 3. Ascultător pentru Evenimentul 'submit' - Latență & Creare Dinamică
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const taskText = input.value.trim();
            
            submitBtn.disabled = true;
            loadingMsg.style.display = 'block';

            setTimeout(() => {
                const li = document.createElement('li');
                li.className = 'task-item';
                li.innerHTML = `<span class="task-text">${taskText}</span> <button class="delete-btn" data-testid="del-btn">Șterge</button>`;
                
                taskList.appendChild(li);
                
                input.value = '';
                charCount.textContent = '0 caractere introduse';
                loadingMsg.style.display = 'none';
            }, 2000);
        });

        // 4. Ștergerea Dinamică (Event Delegation / Bubbling)
        taskList.addEventListener('click', (e) => {
            if (e.target.classList.contains('delete-btn')) {
                e.target.closest('li').remove();
            }
        });
    </script>
</body>
</html>
```

![Simulator QA - Manipularea DOM-ului](/images/sessions/premium/session-4/extra/image1.png)
<span class="image-caption">**Fig. 6.1** — Interfața aplicației de test „QA Event & DOM Simulator” randată în browser.</span>

---

### 6.2 Suita de Exerciții — Nivel Intermediar (Exercițiile 1 - 10)

> 💡 **Instrucțiuni:** Deschide aplicația de mai sus în browser, apasă <kbd>F12</kbd> -> tab-ul **Console** și rezolvă cerințele direct în linia de comandă a browserului.

#### Secțiunea A: Selectoare și Proprietăți (DOM Retrieval)

**Exercițiul 1: Numărarea elementelor adăugate dinamic (querySelectorAll)**
- **Scenariu:** Trebuie să verifici de câte ori s-a randat clasa `.task-item` pe ecran.
- 🤔❓ **Cerință:** Adaugă manual 3 task-uri în formular. Scrie un script în consolă care găsește toate elementele cu clasa `task-item` și le colorează fundalul în galben (`#fff3cd`).

::: details 💡 Soluție Exercițiul 1
```js
const toateTaskurile = document.querySelectorAll('.task-item');
for (let i = 0; i < toateTaskurile.length; i++) {
    toateTaskurile[i].style.backgroundColor = "#fff3cd";
}
```
:::

![Exercițiul 1 - Soluție în consolă](/images/sessions/premium/session-4/extra/image2.png)
<span class="image-caption">**Fig. 6.2** — Evidențierea cu fundal galben a elementelor `.task-item` în urma execuției comenzii `querySelectorAll`.</span>

**Exercițiul 2: Găsirea elementelor după atribute de test (Stil Playwright)**
- **Scenariu:** Butonul de submit are ID-ul `#submit-btn`, dar echipa de QA preferă selectorul bazat pe atributul `data-testid="save-btn"`.
- 🤔❓ **Cerință:** Selectează butonul "Salvează" folosind strict atributul `data-testid` și forțează-l să devină activ (`disabled = false`), schimbându-i totodată textul în `"Hacked (Activ!)"`, chiar dacă input-ul este gol.

::: details 💡 Soluție Exercițiul 2
```js
const btnSalveaza = document.querySelector('[data-testid="save-btn"]');
btnSalveaza.disabled = false;
btnSalveaza.textContent = "Hacked (Activ!)";
```
:::

![Exercițiul 2 - Forțare buton activ](/images/sessions/premium/session-4/extra/image3.png)
<span class="image-caption">**Fig. 6.3** — Selectarea butonului prin atributul `[data-testid="save-btn"]` și activarea forțată cu schimbarea textului.</span>

**Exercițiul 3: Extragerea textelor (Verificare Assertions)**
- **Scenariu:** Vrei să te asiguri că titlul aplicației este exact cel agreat cu echipa de produs.
- 🤔❓ **Cerință:** Găsește elementul `<h2>` și printează în consolă textul său folosind proprietatea `textContent`.

::: details 💡 Soluție Exercițiul 3
```js
const h2 = document.querySelector('h2');
console.log("Titlul curent este: " + h2.textContent);
```
:::

![Exercițiul 3 - Extragere text din h2](/images/sessions/premium/session-4/extra/image4.png)
<span class="image-caption">**Fig. 6.4** — Extragerea proprietății `textContent` a titlului `<h2>` și afișarea valorii în consola DevTools.</span>

---

#### Secțiunea B: Evenimente și Interactivitate (Event Listeners)

**Exercițiul 4: Evenimentul de tastatură (keydown)**
- **Scenariu:** Vrem ca utilizatorul să poată goli câmpul de text instantaneu la apăsarea tastei <kbd>Escape</kbd>.
- 🤔❓ **Cerință:** Găsește input-ul `#task-input`. Adaugă un ascultător pentru evenimentul `keydown`. Dacă proprietatea `e.key` este `"Escape"`, resetează valoarea input-ului la un string gol `""`.

::: details 💡 Soluție Exercițiul 4
```js
const campText = document.querySelector('#task-input');
campText.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        campText.value = '';
    }
});
```
:::

![Exercițiul 4 - Resetare input la tasta Escape](/images/sessions/premium/session-4/extra/image5.png)
<span class="image-caption">**Fig. 6.5** — Atașarea ascultătorului de `keydown` pentru tasta Escape și golirea automată a valorii din câmp.</span>

**Exercițiul 5: Manipularea live a claselor și culorilor (Input Validation)**
- **Scenariu:** Vrem un avertisment vizual în timp real dacă textul introdus este prea lung (depășește 15 caractere).
- 🤔❓ **Cerință:** Selectează elementul `#char-count`. Adaugă un ascultător de tip `input` pe câmpul de text `#task-input`. Dacă lungimea textului este mai mare de 15 caractere, colorează contorul în roșu (`red`), altfel păstrează culoarea gri (`gray`).

::: details 💡 Soluție Exercițiul 5
```js
const contor = document.querySelector('#char-count');
const campInput = document.querySelector('#task-input');

campInput.addEventListener('input', () => {
    if (campInput.value.length > 15) {
        contor.style.color = "red";
    } else {
        contor.style.color = "gray";
    }
});
```
:::

![Exercițiul 5 - Avertisment vizual contor caractere](/images/sessions/premium/session-4/extra/image6.png)
<span class="image-caption">**Fig. 6.6** — Modificarea dinamică a culorii contorului în roșu când lungimea textului depășește 15 caractere.</span>

**Exercițiul 6: Prevenirea acțiunilor implicite (preventDefault)**
- **Scenariu:** Vrem să blocăm meniul contextual nativ (click dreapta) pe întreaga pagină.
- 🤔❓ **Cerință:** Adaugă un ascultător pe `document` pentru evenimentul `"contextmenu"` și folosește `e.preventDefault()`. Afișează în consolă mesajul `"Click dreapta blocat!"`.

::: details 💡 Soluție Exercițiul 6
```js
document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    console.log("Click dreapta blocat!");
});
```
:::

![Exercițiul 6 - Blocare meniu contextual](/images/sessions/premium/session-4/extra/image7.png)
<span class="image-caption">**Fig. 6.7** — Interceptarea evenimentului `contextmenu` și apelarea `e.preventDefault()` pentru a bloca meniul nativ.</span>

---

#### Secțiunea C: Manipulare Dinamică a DOM-ului

**Exercițiul 7: Inserarea unui lot de date deodată (Bulk Rendering)**
- **Scenariu:** Randează un Array de scenarii de test în DOM fără interacțiune prin click (simularea inițializării datelor din backend).
- 🤔❓ **Cerință:** Pornind de la array-ul `['Test UI', 'Test API']`, selectează `#task-list` și folosește o buclă `for...of` împreună cu `document.createElement('li')` pentru a genera și atașa fiecare element în listă.

::: details 💡 Soluție Exercițiul 7
```js
const scenariiNoi = ['Test UI', 'Test API'];
const lista = document.querySelector('#task-list');

for (let nume of scenariiNoi) {
    const li = document.createElement('li');
    li.className = 'task-item';
    li.innerHTML = `<span class="task-text">${nume}</span> <button class="delete-btn">Șterge</button>`;
    lista.appendChild(li);
}
```
:::

![Exercițiul 7 - Randare dinamică din Array](/images/sessions/premium/session-4/extra/image8.png)
<span class="image-caption">**Fig. 6.8** — Iterarea printr-un array de date și inserarea secvențială a noilor elemente `<li>` în DOM.</span>

**Exercițiul 8: Adăugarea unui indicator de "Test Picat" (prepend)**
- **Scenariu:** Vrei să inserezi un tag vizual roșu `[FAILED]` înaintea textului din primul element din listă.
- 🤔❓ **Cerință:** Găsește primul element `.task-item`. Creează dinamic un tag `<span>`, setează-i conținutul la `"[FAILED] "`, aplică-i culoarea roșie și adaugă-l folosind metoda `.prepend()`.

::: details 💡 Soluție Exercițiul 8
```js
const primulLi = document.querySelector('.task-item');

if (primulLi) {
    const failedTag = document.createElement('span');
    failedTag.textContent = "[FAILED] ";
    failedTag.style.color = "red";
    primulLi.prepend(failedTag);
}
```
:::

![Exercițiul 8 - Inserare tag [FAILED] la început](/images/sessions/premium/session-4/extra/image9.png)
<span class="image-caption">**Fig. 6.9** — Crearea dinamică a tag-ului `<span>` roșu și inserarea lui la începutul primului rând prin `.prepend()`.</span>

---

#### Secțiunea D: Latență și Propagare Avansată (Bubbling)

**Exercițiul 9: Latența Distructivă (Testarea Flaky)**
- **Scenariu:** Un element dispare de pe ecran brusc după un interval de timp, simulând un comportament instabil de UI.
- 🤔❓ **Cerință:** Găsește butonul de salvare `#submit-btn`. Adaugă un timer `setTimeout` care după 3000 de milisecunde (3 secunde) elimină complet butonul din DOM apelând metoda `.remove()`.

::: details 💡 Soluție Exercițiul 9
```js
const butonulSalvare = document.querySelector('#submit-btn');
setTimeout(() => {
    butonulSalvare.remove();
}, 3000);
```
:::

![Exercițiul 9 - Eliminare element prin setTimeout](/images/sessions/premium/session-4/extra/image10.png)
<span class="image-caption">**Fig. 6.10** — Simularea latenței asincrone cu `setTimeout` și distrugerea definitivă a butonului prin `.remove()`.</span>

**Exercițiul 10: Event Delegation Peste Tot — Bulele de Săpun (Status "Passed")**
- **Scenariu:** Vrem ca testerul să poată da click *oriunde* pe rândul unui scenariu pentru a-l marca puternic vizual ca „Passed”. Folosirea simplă a lui `e.target` poate fi înșelătoare dacă utilizatorul dă click pe marginea goală a elementului `li` și nu direct pe text.
- 🤔❓ **Cerință:** Adaugă un ascultător de `click` pe `#task-list`. Folosește `e.target.closest('.task-item')` pentru a identifica întotdeauna cutia rândului, indiferent unde s-a dat click. Dacă s-a dat click pe butonul roșu de ștergere, ignoră comanda (pentru a nu bloca ștergerea). Dacă s-a găsit rândul valid, schimbă-i fundalul în verde deschis (`#d4edda`), adaugă-i un `border-left` verde aprins (`5px solid #28a745`) și marchează textul cu clasa `completed`.

::: details 💡 Soluție Exercițiul 10
```js
const listaPrincipala = document.querySelector('#task-list');

listaPrincipala.addEventListener('click', (e) => {
    // 1. Dacă click-ul a fost fix pe butonul roșu de "Șterge", ieșim imediat (acela are altă treabă)
    if (e.target.classList.contains('delete-btn')) return;

    // 2. Căutăm cel mai apropiat element părinte care este rândul nostru (cutia completă)
    const randApasat = e.target.closest('.task-item');

    // 3. Dacă am dat click în interiorul unui rând, îl transformăm vizual în starea "Passed"
    if (randApasat) {
        randApasat.style.backgroundColor = '#d4edda';
        randApasat.style.borderLeft = '5px solid #28a745';
        
        // Tăiem și textul prin adăugarea clasei completed pe span-ul din rând
        const textSpan = randApasat.querySelector('.task-text');
        if (textSpan) {
            textSpan.classList.add('completed');
        }
    }
});
```
:::

![Exercițiul 10 - Delegarea evenimentelor și marcare Passed](/images/sessions/premium/session-4/extra/image11.png)
<span class="image-caption">**Fig. 6.11** — Utilizarea `e.target.closest('.task-item')` pe lista părinte pentru a intercepta click-ul și a aplica stilul vizual „Passed”.</span>

---

### 6.3 Nivelul "Masterclass" — Exerciții Avansate pentru QA Automation

Aceste exerciții simulează exact tehnicile pe care Playwright le utilizează intern pentru a citi, naviga relativ și forța stările elementelor din pagină.

**Exercițiul 11: Colectarea datelor într-un Array real (Data Scraping & Extraction)**
- **Scenariu:** În automatizarea E2E, adesea dorești să extragi textele tuturor elementelor dintr-o listă pentru a valida ordonarea alfabetică sau potrivirea exactă cu un set de date așteptat.
- 🤔❓ **Cerință:** Asigură-te că ai adăugat cel puțin 3 task-uri pe ecran. `querySelectorAll` returnează un `NodeList`, însă ai nevoie de un `Array` clasic de string-uri. Selectează toate `.task-text`, folosește `Array.from()` și metoda `.map()` pentru a extrage proprietatea `textContent` a fiecăruia într-un nou array.

::: details 💡 Soluție Exercițiul 11
```js
const spanuriTexte = document.querySelectorAll('.task-text');

// Transformăm NodeList într-un Array nativ și mapăm fiecare nod către textul său
const listaTexte = Array.from(spanuriTexte).map(span => span.textContent);
console.log("Textele extrase sunt:", listaTexte);

// În Playwright, asertarea corespunzătoare va fi:
// await expect(page.locator('.task-text')).toHaveText(['Task 1', 'Task 2', 'Task 3']);
```
:::

![Exercițiul 11 - Extragere date cu Array.from și map](/images/sessions/premium/session-4/extra/image12.png)
<span class="image-caption">**Fig. 6.12** — Transformarea unui `NodeList` într-un array nativ de string-uri gata pentru validări în Playwright.</span>

**Exercițiul 12: Navigarea Relativă în DOM (Element Matching & Siblings)**
- **Scenariu:** Ai o listă cu multiple rânduri similare. Vrei să găsești butonul de "Șterge" asociat strict task-ului numit `"Test API"`, fără a le afecta pe celelalte.
- 🤔❓ **Cerință:** Găsește toate elementele `.task-text` și iterează prin ele. Când găsești elementul al cărui `textContent` este strict `"Test API"`, folosește proprietatea `nextElementSibling` pentru a accesa butonul de lângă el, colorează-l în mov (`purple`) și setează-i textul la `"Țintit!"`.

::: details 💡 Soluție Exercițiul 12
```js
const toateSpanurile = document.querySelectorAll('.task-text');

for (let span of toateSpanurile) {
    if (span.textContent === 'Test API') {
        // Am identificat textul țintă! Navigăm direct la elementul frate (butonul de lângă el)
        const butonulLui = span.nextElementSibling;
        butonulLui.style.backgroundColor = "purple";
        butonulLui.textContent = "Țintit!";
        break; 
    }
}
```
:::

![Exercițiul 12 - Identificare element frate prin nextElementSibling](/images/sessions/premium/session-4/extra/image13.png)
<span class="image-caption">**Fig. 6.13** — Navigarea de la textul găsit direct la butonul asociat folosind `nextElementSibling` și schimbarea stilului în mov.</span>

**Exercițiul 13: Declanșarea Programatică a Evenimentelor (Event Dispatching & Bypass)**
- **Scenariu:** Când setezi valoarea unui input direct din script (`input.value = 'Text'`), framework-urile frontend reactive (React, Vue, Angular) nu detectează modificarea deoarece nu s-a produs evenimentul nativ de tastare.
- 🤔❓ **Cerință:** Setează valoarea input-ului `#task-input` la `"Test ascuns creat de script"`. Apoi apelează metoda `dispatchEvent(new Event('input'))` pe acel element pentru a notifica browserul, forțând actualizarea contorului de caractere și activarea butonului de salvare.

::: details 💡 Soluție Exercițiul 13
```js
const camp = document.querySelector('#task-input');
camp.value = "Test ascuns creat de script";

// Fără linia de mai jos, ascultătorul de 'input' nu s-ar activa, iar butonul ar rămâne disabled!
camp.dispatchEvent(new Event('input'));
console.log("Am forțat declanșarea evenimentului 'input'!");
```
:::

![Exercițiul 13 - Declanșare programatică cu dispatchEvent](/images/sessions/premium/session-4/extra/image14.png)
<span class="image-caption">**Fig. 6.14** — Transmiterea evenimentului sintetic `input` pentru a activa validările automate ale formularului.</span>

**Exercițiul 14: Simulare Checkbox "Terms & Conditions" (Manipulare Dinamică & Condiții Multiple)**
- **Scenariu:** Introducem o constrângere nouă de business: formularul nu se poate trimite decât dacă utilizatorul bifează o căsuță de confirmare.
- 🤔❓ **Cerință:** Creează dinamic un element `<input type="checkbox">` (cu `id="terms"`) și un `<label>` cu textul `" Confirm că testul este valid "`. Inserează-le înaintea butonului `#submit-btn` folosind `form.insertBefore()`. Modifică logica de validare astfel încât butonul să fie activ (`disabled = false`) **doar dacă** ambele condiții sunt îndeplinite: input-ul conține text ȘI checkbox-ul este bifat (`checkbox.checked === true`).

::: details 💡 Soluție Exercițiul 14
```js
// 1. Selectăm elementele existente
const formularul = document.querySelector('#qa-form');
const btn = document.querySelector('#submit-btn');
const inputPrincipal = document.querySelector('#task-input');

// 2. Creăm elementele dinamice
const checkbox = document.createElement('input');
checkbox.type = 'checkbox';
checkbox.id = 'terms';

const label = document.createElement('label');
label.textContent = " Confirm că testul este valid ";

// 3. Le inserăm în DOM înaintea butonului de trimitere
formularul.insertBefore(checkbox, btn);
formularul.insertBefore(label, btn);

// 4. Definim funcția de validare combinată
function valideazaFormular() {
    if (inputPrincipal.value.trim().length > 0 && checkbox.checked) {
        btn.disabled = false;
    } else {
        btn.disabled = true;
    }
}

// 5. Atașăm validarea la ambele evenimente
inputPrincipal.addEventListener('input', valideazaFormular);
checkbox.addEventListener('change', valideazaFormular);
```
:::

![Exercițiul 14 - Inserare dinamică checkbox și validare combinată](/images/sessions/premium/session-4/extra/image15.png)
<span class="image-caption">**Fig. 6.15** — Inserarea elementelor cu `insertBefore()` și condiționarea activării butonului de bifarea căsuței.</span>

**Exercițiul 15: Validarea vizibilității reale (getComputedStyle vs CSS Display)**
- **Scenariu:** În testarea E2E cu Playwright, o asertare de tip `expect(locator).toBeVisible()` verifică dacă elementul este vizibil în arborele de randare, nu doar prezent în DOM.
- 🤔❓ **Cerință:** Elementul `#loading-msg` comută între stările vizibil și ascuns prin `style.display`. Scrie o logică ce citește stilul calculat al elementului folosind `window.getComputedStyle(element)`. Dacă `stilCalculat.display === 'none'`, afișează în consolă: `"Asertare trecută: Elementul este ASCUNS pe ecran."`, altfel afișează: `"Asertare picată: Elementul este încă VIZIBIL pe ecran!"`.

::: details 💡 Soluție Exercițiul 15
```js
const mesajLoading = document.querySelector('#loading-msg');

// getComputedStyle returnează stilurile finale calculate de browser la momentul execuției
const stilCalculat = window.getComputedStyle(mesajLoading);

if (stilCalculat.display === 'none') {
    console.log("Asertare trecută: Elementul este ASCUNS pe ecran.");
} else {
    console.log("Asertare picată: Elementul este încă VIZIBIL pe ecran!");
}
```
:::

![Exercițiul 15 - Verificare vizibilitate cu getComputedStyle](/images/sessions/premium/session-4/extra/image16.png)
<span class="image-caption">**Fig. 6.16** — Citirea stilului computat real al elementului pentru a confirma starea de afișare pe ecran.</span>

---

🎉 **Felicitări masive și aplauze furtunoase!** Prin parcurgerea acestei sesiuni și rezolvarea scenariilor din Workbook ai asimilat fundamentele cheie ale manipulării DOM-ului (Sesiunile 1 - 4). Acum deții "cheile" interfeței web: știi cum sunt structurate paginile (HTML/CSS), cum reacționează la evenimente (JS) și cum se comportă elementele dinamice.

Următoarea ta oprire? Vom face pasul către **Asincronism (Event Loop, Promises, Fetch API)** și către **Playwright**! Vei prelua controlul complet, înlocuind interacțiunile manuale cu scripturi de automatizare rapide, robuste și profesionale!
