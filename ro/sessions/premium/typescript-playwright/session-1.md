# Sesiunea 1: Arhitectura web, structura DOM-ului și fundamente HTML

<div style="display: flex; gap: 12px; flex-wrap: wrap; margin: 1.5rem 0 0.5rem 0;">
  <a href="/pdfs/sessions/premium/typescript-playwright/session-1.pdf" class="download-btn" target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24"><path d="M5 20h14v-2H5v2zm0-10h4V4h6v6h4l-7 7-7-7z"/></svg>Vizualizează suportul de curs (PDF)</a>
  <a href="/pdfs/sessions/premium/typescript-playwright/session-1-ppt.pdf" class="download-btn" target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24"><path d="M5 20h14v-2H5v2zm0-10h4V4h6v6h4l-7 7-7-7z"/></svg>Descarcă Prezentarea PDF (Slide-uri)</a>
  <a href="https://youtube.com/live/4KjmoJHsZ6M" class="download-btn" target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24"><path d="M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 22c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48 1.73-1.73.47-.13 1.33-.22 2.65-.28 1.3-.07 2.49-.1 3.59-.1L12 22c4.19 0 6.8.16 7.83.44.9.25 1.48.83 1.73 1.73z"/></svg>Vezi înregistrarea pe YouTube</a>
</div>

::: info 🎥 Înregistrarea Sesiunii Live
Mai jos regăsești înregistrarea video completă a sesiunii live. Poți urmări explicațiile pas cu pas, demonstrațiile practice și exercițiile de live coding direct din browser.
:::

<div style="position: relative; width: 100%; padding-bottom: 56.25%; height: 0; margin: 1.5rem 0; overflow: hidden; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
  <iframe 
    src="https://www.youtube.com/embed/4KjmoJHsZ6M" 
    title="Sesiunea 1: Arhitectura web, structura DOM-ului și fundamente HTML - Înregistrare Live" 
    frameborder="0" 
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
    referrerpolicy="strict-origin-when-cross-origin" 
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;" 
    allowfullscreen>
  </iframe>
</div>

::: info 📊 Prezentare PowerPoint
Mai jos regăsești prezentarea PowerPoint interactivă aferentă acestei sesiuni. Poți parcurge slide-urile direct din browser sau poți descărca versiunea PDF a acestora folosind butonul de mai sus.
:::

<div style="position: relative; width: 100%; padding-bottom: 56.25%; height: 0; margin: 1.5rem 0; overflow: hidden; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
  <iframe 
    src="https://docs.google.com/presentation/d/e/2PACX-1vTqaJsGpfhnoE764EmLa3pmrLFNcBJ26VdlSsiIqPJBzXah6zIdGOj-133rrdxNPw/embed?start=false&loop=false&delayms=3000" 
    frameborder="0" 
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;" 
    allowfullscreen="true" 
    mozallowfullscreen="true" 
    webkitallowfullscreen="true">
  </iframe>
</div> 

---

## Capitolul 1: Arhitectura Web — Cum funcționează Internetul și Browserele

::: info 🎯 Obiective de învățare
La finalul acestui capitol, vei fi capabil să:
- Explici diferența fundamentală dintre interfața utilizatorului (**Frontend**) și server (**Backend**).
- Înțelegi conceptele de **Client**, **Server** și **Bază de Date**.
- Urmărești traseul unei cereri HTTP de la apăsarea tastei Enter până la afișarea site-ului.
- Folosești tab-ul **Network** din DevTools pentru a intercepta și analiza primul tău Request.
:::

### 1.1 De la QA Manual la Automation: Schimbarea de perspectivă

În testarea manuală, interacționezi cu aplicația exact ca un utilizator final: dai click pe butoane, completezi formulare și verifici dacă rezultatul vizual este cel corect (*Black Box Testing*).

Ca viitor **QA Automation Engineer**, trebuie să mergi un nivel mai profund. Când un test automatizat eșuează (ex: Playwright nu găsește un buton), trebuie să știi **de ce** a eșuat. Pentru asta, trebuie să înțelegi drumul pe care îl parcurge codul de pe server până pe ecranul tău. Nu mai testăm doar "ceea ce se vede", ci testăm infrastructura din spate.

---

### 1.2 Arhitectura de bază: Client – Server

Aproape orice aplicație web modernă (inclusiv aplicația "Task Tracker" pe care o vom construi) funcționează pe baza arhitecturii **Client-Server**.

* **Clientul:** Este aplicația care cere informații. De cele mai multe ori, clientul este **Browser-ul web** (Chrome, Firefox, Safari) de pe laptopul sau telefonul tău. Când vom scrie scripturi de automatizare, programul nostru Playwright va acționa ca un "client robot".  
* **Serverul:** Este un calculator puternic, conectat non-stop la internet, care "servește" date. Aici locuiește "creierul" aplicației (**Backend-ul**) și aici sunt stocate fișierele (HTML, CSS, imagini).  
* **Baza de date (Database):** Este spațiul de stocare pe termen lung al serverului. Aici sunt salvate conturile utilizatorilor, parolele criptate, task-urile și setările.

![Diagramă de Arhitectură 3-Tier](/images/sessions/premium/session-1/image1.png)
<span class="image-caption">**Fig. 1** — Diagramă de arhitectură 3-Tier. Săgețile bidirecționale indică comunicarea sincronă între Frontend, Backend și Database.</span>

---

### 1.3 Ciclul de viață al unei cereri: HTTP Request & Response

Comunicarea dintre Client și Server se face printr-un set de reguli numit **Protocolul HTTP** (*HyperText Transfer Protocol*). Gândește-te la HTTP ca la limba comună pe care o vorbesc ambele calculatoare.

Iată ce se întâmplă, pas cu pas, când scrii `www.emag.ro` în browser și apeși Enter:

1. **HTTP Request (Cererea):** Browserul tău (Clientul) trimite un mesaj către serverul eMAG. Mesajul spune: *"Salut, dă-mi te rog pagina principală"*. Acest mesaj se numește cerere de tip **GET**.  
2. **Procesarea pe Server:** Serverul primește mesajul, interoghează Baza de Date pentru a prelua cele mai noi date, asamblează pagina web și o pregătește de livrare.  
3. **HTTP Response (Răspunsul):** Serverul trimite înapoi un "pachet" către browser care conține:  
   - Un **Status Code** (ex: `200 OK` — totul e perfect, sau `404 Not Found` — pagina nu există).  
   - **Codul HTML** (structura paginii).  
   - **CSS și JavaScript** (designul și logica vizuală).  
4. **Randarea (Afișarea):** Browserul tău primește pachetul, citește codul de sus în jos și "desenează" butoanele și imaginile pe ecranul tău.

---

### 1.4 De ce este acest lucru critic pentru un QA Engineer?

Dacă un utilizator dă click pe "Login" și ecranul rămâne blocat, un QA Manual va scrie un bug:
> *"Butonul de login nu merge."*

Un QA Automation care înțelege arhitectura va deschide **DevTools**, va vedea că Request-ul către server a plecat, dar Serverul a returnat `500 Internal Server Error`. Bug-ul raportat va fi:
> *"Serverul returnează HTTP 500 la accesarea endpoint-ului de login la trimiterea unui POST."*

Primul raport este vag; al doilea ajută dezvoltatorul să repare problema în 5 minute.

---

### 1.5 Știați că...?

::: tip 💡 Știați că...?
- **Pachetele pierdute:** Datele trimise prin internet nu călătoresc ca o singură bucată mare. Ele sunt tăiate în mii de "pachete" mici, care pot lua rute diferite prin lume. Browserul tău le reasamblează la destinație.
- **Status Codes de bază:** Există o regulă universală pentru codurile de răspuns HTTP pe care orice QA trebuie să le știe:
  - `2xx` – **Succes:** Totul a mers bine (ex: `200 OK`, `201 Created`).
  - `3xx` – **Redirect:** Pagina a fost mutată (ex: `301 Moved Permanently`).
  - `4xx` – **Eroare la Client:** Tu ai greșit (ex: ai căutat un URL care nu există – `404 Not Found`).
  - `5xx` – **Eroare la Server:** A crăpat serverul (ex: `500 Internal Server Error`).
:::

---

### 1.6 Poveste Aplicată: „Restaurantul Digital”

::: note 📖 Poveste Aplicată: Restaurantul Digital
Cea mai bună analogie pentru arhitectura Client-Server este un restaurant:
- **Tu ești Clientul (Browserul):** Stai la masă și te uiți pe meniu (**Interfața - UI**).
- **Chelnerul este HTTP Request-ul:** Tu îi spui chelnerului: *"Vreau o pizza."* El ia comanda ta și o duce la bucătărie.
- **Bucătăria este Serverul (Backend):** Bucătarul ia comanda, strânge ingredientele, prepară pizza și aplică regulile de business (ex: "Fără ceapă").
- **Cămara cu alimente este Baza de Date:** De acolo ia bucătarul ingredientele brute.
- **Chelnerul se întoarce (HTTP Response):** Îți aduce pizza la masă împreună cu un status (*"Poftă bună!"* = `200 OK`, sau *"Nu mai avem blat"* = `404 Not Found`).

Ca Automation Tester, treaba ta nu este doar să guști pizza (**Testare UI**), ci uneori să interceptezi chelnerul pe drum (**API Mocking**) pentru a vedea dacă a notat comanda corect.
:::

---

### 1.7 Exerciții Practice

#### Exercițiul 1: Interceptarea propriului Request (Inspectorul Network)

Vom folosi arma principală a oricărui inginer QA: Browser DevTools.

1. Deschide Google Chrome.  
2. Dă click-dreapta oriunde pe o pagină goală și alege **Inspect** (sau apasă `F12` / `Ctrl+Shift+I`).  
3. În meniul de sus al panoului care s-a deschis, dă click pe tab-ul **Network** (Rețea).  
4. Scrie în bara de adrese a browserului `www.wikipedia.org` și apasă Enter.  
5. **Sarcina ta:** Privește cascada de fișiere care apar în tab-ul Network. Găsește primul fișier din listă (de obicei se numește `wikipedia.org`). Dă click pe el și identifică în secțiunea "Headers" care este **Status Code-ul** primit.

---

### 1.8 Răspunsuri la Întrebări & Soluții la Exerciții

::: details 💡 Soluție Exercițiul 1
Dacă ai urmat pașii corect, primul element din tab-ul Network reprezintă Documentul HTML principal. Când dai click pe el, în panoul lateral din dreapta, sub secțiunea **General**, vei vedea câmpul Status Code. Ar trebui să fie **200 OK** (verde).

::: tip 📝 Recomandare
Felicitări! Tocmai ai interceptat și analizat cu succes prima ta tranzacție Client-Server. Acest obicei te va salva de nenumărate ore de frustrare când vom face debugging pe testele noastre automatizate.
:::
:::

---

## Capitolul 2: Introducere în HTML și Tag-uri Semantice

::: info 🎯 Obiective de învățare
La finalul acestui capitol, vei fi capabil să:
- Explici rolul limbajului HTML în construirea unei pagini web.
- Scrii corect elemente HTML, respectând sintaxa de deschidere și închidere.
- Înțelegi diferența și importanța atributelor critice pentru automatizare (`id`, `class`, `data-testid`).
- Construiești o pagină web simplă, structurată semantic, gata să fie interceptată de un script Playwright.
:::

### 2.1 Ce este HTML-ul? (Nu este un limbaj de programare!)

Este o confuzie frecventă la început de drum. **HTML (HyperText Markup Language)** NU este un limbaj de programare. Nu poți scrie cu el o logică de tipul „dacă 2+2=4, atunci afișează o alertă”.

HTML este un **limbaj de marcare**. Rolul său unic și exclusiv este de a structura informația, spunându-i browserului *ce* reprezintă fiecare bucată de text:
- *"Acesta este un titlu major"* (`<h1>`)
- *"Acesta este un paragraf"* (`<p>`)
- *"Aici avem o listă"* (`<ul>`, `<li>`)
- *"Acesta este un buton pe care se poate da click"* (`<button>`)

Ca QA Automation Engineer, HTML-ul este harta ta. Dacă nu știi să citești harta, robotul tău (Playwright) se va rătăci.

---

### 2.2 Anatomia unui Element HTML: Tag-uri și Conținut

Pentru a „marca” textul, HTML folosește **Tag-uri** (etichete), scrise mereu între paranteze unghiulare `< >`.

Majoritatea elementelor HTML au o structură din 3 părți:

```html
<button>Trimite Comanda</button>
```

1. **Tag-ul de deschidere (`<button>`):** Marchează începutul elementului.
2. **Conținutul (`Trimite Comanda`):** Ceea ce va vedea efectiv utilizatorul pe ecran.
3. **Tag-ul de închidere (`</button>`):** Marchează sfârșitul elementului. Se distinge prin adăugarea unui slash `/` (bară oblică).

![Anatomia unui Element HTML](/images/sessions/premium/session-1/image2.png)
<span class="image-caption">**Fig. 2** — Anatomia unui element HTML. Descompunerea etichetei `<p>` în tag de start (verde), conținut (albastru) și tag de închidere (roșu).</span>

> [!NOTE]
> **Elemente cu auto-închidere:** Există anumite elemente care nu conțin text și nu au nevoie de tag separat de închidere, cum ar fi imaginile (`<img src="poza.jpg" alt="Descriere">`) și câmpurile de text (`<input type="text">`).

---

### 2.3 Structura de bază a unui document HTML (Boilerplate)

Orice fișier HTML valid din lume respectă un schelet (*boilerplate*) standard:

```html
<!DOCTYPE html>
<!-- 1. Declarația tipului de document: Îi spune browserului că folosim HTML5 (cea mai nouă versiune). -->
<html lang="ro">
  <!-- 2. Elementul Rădăcină (Root): Tot codul stă înăuntrul acestui tag. -->
  <head>
    <!-- 3. Partea de "Creier" (Metadate) -->
    <!-- Aici stau informații PENTRU browser, NU pentru utilizator. Nimic de aici nu e vizibil pe pagina albă (excepție: titlul din tab-ul de sus). -->
    <meta charset="UTF-8">
    <title>Aplicația Mea QA</title>
  </head>

  <body>
    <!-- 4. Partea "Vizibilă" -->
    <!-- Aici pui ABSOLUT TOT ce vrei să vadă utilizatorul pe ecran și tot ce vei testa automatizat: butoane, formulare, texte, imagini. -->
    <h1>Bine ai venit la Task Tracker!</h1>
    <p>Aici vom adăuga task-urile noastre.</p>
  </body>
</html>
```

---

### 2.4 HTML Semantic: De ce contează pentru noi, ca testeri?

În anii 2000, dezvoltatorii foloseau tag-ul generic `<div>` pentru a împărți pagina (`<div id="sus">`, `<div id="jos">`). Era un haos greu de citit.

HTML5 a introdus **Tag-urile Semantice**. Acestea sunt etichete care își descriu clar rolul:

| Tag Semantic | Rol | Importanță pentru QA |
| :--- | :--- | :--- |
| `<header>` | Antetul paginii sau al unei secțiuni | Punct de ancorare excelent pentru bara de sus |
| `<nav>` | Secțiune cu link-uri de navigare (Meniu) | Ideal pentru testarea meniurilor și rutării |
| `<main>` | Conținutul principal și unic al paginii | Folosit de Playwright pentru rolul accesibil `main` |
| `<section>` | Secțiune tematică generică | Bun pentru gruparea locatoarelor de test |
| `<footer>` | Subsolul paginii (Copyright, Contact) | Validarea linkurilor din subsol |

---

### 2.5 Atributele HTML: Ancorele Automatizării

Dacă Tag-urile spun *ce este* un element, **Atributele** oferă *informații suplimentare* despre acel element. Atributele se scriu **întotdeauna în tag-ul de deschidere**.

Sintaxa este: `nume_atribut="valoare"`.

Aceste atribute vor fi "cârligele" de care te vei agăța în codul tău Playwright pentru a găsi elementele pe pagină:

| Atribut | Exemplu | Explicație & Relevanță pentru QA |
| :--- | :--- | :--- |
| `id` | `<button id="login-btn">` | **CRITIC!** ID-ul trebuie să fie unic pe pagină. Este cel mai rapid și stabil mod de localizare (`page.locator('#login-btn')`). |
| `class` | `<p class="error-text">` | Definește o clasă de elemente (stil CSS). Îl folosim pentru a selecta sau număra liste de elemente. |
| `type` | `<input type="checkbox">` | Precizează tipul de input (text, password, checkbox, radio). |
| `name` | `<input name="email">` | Folosit la formulare pentru trimiterea datelor către server. Excelent ca selector. |
| `data-*` | `<button data-testid="submit-login">` | **Sfântul Graal al Automatizării!** (`data-testid`, `data-qa`). Atribute special puse pentru teste, protejate de schimbările de CSS. |

---

### 2.6 Știați că...?

::: tip 💡 Știați că...?
- **HTML nu este "Case Sensitive":** Browserului nu îi pasă dacă scrii `<BUTTON>`, `<Button>` sau `<button>`. Totuși, standardul strict recomandat în industrie este scrierea exclusivă cu litere mici (*lowercase*).
- **Id-urile duplicate strică testele automatizate:** Dacă un developer greșește și pune `id="submit"` pe două butoane diferite, browserul Chrome afișează pagina fără erori vizibile. Dar Playwright vede primul element cu acel ID, interacționează cu el și îl ignoră pe al doilea. Multe teste instabile (*flaky tests*) apar din această greșeală!
:::

---

### 2.7 Poveste Aplicată: „Fundația și Cărămizile Casei”

::: note 📖 Poveste Aplicată: Fundația și Cărămizile Casei
Dacă te gândești la o pagină web ca la o casă:
- **Structura Boilerplate** (`<html>`, `<head>`, `<body>`) reprezintă fundația, acoperișul și pereții exteriori.
- **Tag-urile HTML** (`<h1>`, `<p>`, `<button>`) sunt cărămizile, ferestrele și ușile: *"Aici punem o ușă"*.
- **Atributele** (`id`, `class`) sunt etichetele pe care le lipești pentru echipa de control. Dacă îi spui unui robot: *"Verifică elementul cu `id='usa-intrare-principala'`"*, se va duce direct la țintă, fără nicio confuzie.
:::

---

### 2.8 Exerciții Practice

#### Exercițiul 1: Vânătoarea de Atribute (DevTools)
1. Deschide Google Chrome și intră pe `www.emag.ro` (sau alt site mare).
2. Dă click dreapta pe bara principală de căutare și apasă **Inspect**.
3. În panoul Elements, identifică și notează ce **id** și ce atribut **type** are acel `<input>` de căutare.

#### Exercițiul 2: Scrie propriul cod Semantic
Scrie un bloc de cod HTML (ce ar veni în interiorul `<body>`), care să conțină:
- O zonă `<header>` cu un titlu `<h1>` având textul "Magazinul Meu".
- O zonă `<main>` cu un `<input>` de tip text (`id="search-box"`) și un `<button>` cu `data-testid="search-btn"` și textul "Caută Produs".

---

### 2.9 Răspunsuri la Întrebări & Soluții la Exerciții

::: details 💡 Soluție Exercițiul 1
Bara de căutare este un `<input type="text">` sau `<input type="search">`. ID-ul este de obicei foarte descriptiv, de tipul `id="searchboxTrigger"` sau `id="search"`. Așa l-ai localiza într-un test automatizat!
:::

::: details 💡 Soluție Exercițiul 2
Iată cum arată codul scris corect, respectând standardele pe care ne vom baza în Playwright:

```html
<header>
  <h1>Magazinul Meu</h1>
</header>
<main>
  <input type="text" id="search-box">
  <button data-testid="search-btn">Caută Produs</button>
</main>
```

*Dacă ai reușit să scrii acest snippet corect, ești gata să intri în Structura DOM-ului în capitolul următor!*
:::

---

## Capitolul 3: Structura DOM-ului și Workshop Practic (Task Tracker)

::: info 🎯 Obiective de învățare
La finalul acestui capitol, vei fi capabil să:
- Explici ce este **Document Object Model (DOM)** și cum diferă acesta de codul HTML brut.
- Identifici relațiile de rudenie (**Părinte-Copil-Frate**) între elementele web dintr-o pagină.
- Înțelegi exact cum interacționează Playwright direct cu structura DOM-ului, ocolind interfața grafică clasică.
- Construiești o interfață HTML complexă (formulare, selecții, tabele) pentru aplicația web "Task Tracker", adăugând atribute de testabilitate.
:::

### 3.1 Ce este DOM-ul (Document Object Model)?

Dacă HTML-ul este codul sursă (textul) trimis de server, **DOM-ul (Document Object Model)** este reprezentarea "vie" a acelui cod, construită de browser în memoria sa RAM sub forma unui arbore de noduri.

Când browserul primește fișierul `.html`, el îl parsează și îl transformă într-o structură interactivă. DOM-ul permite limbajelor precum JavaScript să modifice pagina în timp real (de exemplu, adăugând un element nou fără reîncărcarea paginii).

---

### 3.2 Arborele Genealogic: Părinți, Copii și Frați

Pentru a putea localiza elemente cu Playwright, trebuie să înțelegem ierarhia DOM-ului:

* **Root (Rădăcina):** Punctul de plecare, mereu elementul `<html>`.  
* **Parent (Părinte):** Un element care conține direct alt element. De exemplu, `<body>` este părintele tuturor elementelor vizibile.  
* **Child (Copil):** Un element aflat direct în interiorul altui element. Un `<h1>` pus în interiorul unui `<header>` este copilul header-ului.  
* **Siblings (Frați):** Elemente care împart exact același părinte. Două tag-uri `<p>` aflate unul sub altul într-un `<div>` sunt frați.

![Structura Ierarhică DOM](/images/sessions/premium/session-1/image3.png)
<span class="image-caption">**Fig. 3** — Structura ierarhică a unui document HTML (Tree Graph) cu relațiile de tip Părinte-Copil.</span>

---

### 3.3 De ce este DOM-ul „Terenul de joacă” al automatizării?

> [!IMPORTANT]
> **Regula de Aur a Automatizării:** Roboții de testare (Playwright, Selenium) **NU au ochi**. Ei nu analizează pixelii de pe ecran, ci interoghează arborele DOM din memorie.

Când îi ceri lui Playwright să dea click pe butonul de Login, el caută un nod din DOM corespunzător selectorului specificat (`#login-btn`). Dacă un element există în DOM dar este ascuns prin CSS (`display: none`), Playwright va raporta că elementul nu este vizibil pentru interacțiune.

---

### 3.4 Cum „citește” Playwright DOM-ul?

Playwright se conectează direct la motorul intern al browserului prin *Chrome DevTools Protocol (CDP)*:

* **Viteza luminii:** Interoghează arborele DOM din memoria RAM în doar câteva milisecunde.
* **Auto-Waiting Inteligent:** Playwright așteaptă automat ca elementul să fie atașat în DOM, să devină vizibil, stabil și interactiv înainte de a executa acțiunea.
* **Interacțiuni Forțate:** Dacă un element este parțial acoperit de un banner transparent, Playwright poate executa `element.click({ force: true })` pentru a trimite evenimentul JavaScript direct nodului din DOM.

---

### 3.5 Workshop Practic: Crearea scheletului extins pentru „Task Tracker”

Să construim scheletul HTML pentru aplicația noastră **Task Tracker**.

Deschide `index.html` și adaugă următorul cod în interiorul `<body>`:

```html
<header>
  <h1>Task Tracker Pro - QA Edition</h1>
  <p>Platforma completă de exersare a automatizării</p>
</header>

<main>
  <!-- Secțiunea de adăugare task -->
  <section class="task-input-section">
    <h2>Adaugă un Task Nou</h2>
    <form id="add-task-form">
      <label for="task-name">Nume Task:</label>
      <input type="text" id="task-name" data-testid="input-task-name" placeholder="Ex: Scrie scenarii E2E" required>

      <label for="task-priority">Prioritate:</label>
      <select id="task-priority" data-testid="select-priority">
        <option value="low">Scăzută</option>
        <option value="medium" selected>Medie</option>
        <option value="high">Critică</option>
      </select>

      <label for="due-date">Termen limită:</label>
      <input type="date" id="due-date" data-testid="input-due-date">

      <button type="submit" id="add-task-btn" data-testid="submit-new-task">Salvează Task</button>
    </form>
  </section>

  <!-- Secțiunea de afișare task-uri (Tip Listă) -->
  <section class="task-list-section">
    <h2>Task-uri Active</h2>
    <ul id="active-tasks-list">
      <li class="task-item" data-task-status="pending">
        <input type="checkbox" class="complete-checkbox" data-testid="check-task-1">
        <span>Învață arhitectura DOM</span>
        <span class="badge priority-high">Critică</span>
        <button class="delete-btn" data-testid="delete-task-1">Șterge</button>
      </li>
    </ul>
  </section>

  <!-- Secțiunea de istoric (Tip Tabel) -->
  <section class="task-history-section">
    <h2>Istoric Task-uri Finalizate</h2>
    <table id="history-table" border="1">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nume Task</th>
          <th>Data Finalizării</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>#1001</td>
          <td>Setare Boilerplate HTML</td>
          <td>09-Aug-2026</td>
        </tr>
      </tbody>
    </table>
  </section>
</main>

<footer>
  <p>(c) 2026 QualiAdept Bootcamp</p>
</footer>
```

---

### 3.6 Știați că...?

::: tip 💡 Știați că...?
- **DOM-ul se actualizează "Live":** Spre deosebire de fișierul static `index.html` de pe disc, DOM-ul se poate modifica constant în timpul execuției. În tab-ul "Elements" din DevTools vezi DOM-ul curent din memorie, inclusiv elementele adăugate dinamic prin JavaScript.
- **Atributul `data-testid` nu afectează randarea:** Este invizibil pentru utilizatori, dar acționează ca un far stabil pentru locatoarele Playwright (`page.getByTestId()`).
:::

---

### 3.7 Poveste Aplicată: „Arborele Genealogic al Familiei Web”

::: note 📖 Poveste Aplicată: Arborele Genealogic al Familiei Web
Să ne imaginăm DOM-ul ca pe o familie:
- Bunicul suprem este **Documentul**.
- Bunicul are doi copii: `<head>` (copilul introvertit, creierul cu metadate) și `<body>` (copilul extravertit, vizibil).
- În `<body>` locuiesc nepoții: `<header>`, `<main>` și `<footer>` (frați între ei).

Dacă îi spui lui Playwright: *"Găsește un buton"*, s-ar putea să existe și în formular, și în lista de task-uri. Pentru a fi precis, îi spui: *"Mergi la Părintele `<form>`, iar în interiorul lui găsește Copilul `<button>`"*. Această navigare se numește **DOM Traversal**.
:::

---

### 3.8 Exerciții Practice

#### Exercițiul 1: Inspectează noile elemente (DevTools)
1. Deschide `index.html` în Chrome și apasă `F12`.
2. Inspectează elementul `<select id="task-priority">` și extinde-l.
3. *Întrebare:* Tag-urile `<option>` din interior sunt Părinți, Copii sau Frați pentru `<select>`?

#### Exercițiul 2: Adaugă o funcționalitate nouă în tabel
Adaugă un al doilea rând în tabelul de istoric (`<tbody>`), cu datele: ID `#1002`, Nume "Înțelegere Arhitectură Client-Server", Data "10-Aug-2026".

---

### 3.9 Răspunsuri la Întrebări & Soluții la Exerciții

::: details 💡 Soluție Exercițiul 1
Tag-urile `<option>` sunt **Copiii (Children)** tag-ului `<select>`, iar `<select>` este Părintele lor.
:::

::: details 💡 Soluție Exercițiul 2
Interiorul etichetei `<tbody>` ar trebui să arate astfel:

```html
<tbody>
  <tr>
    <td>#1001</td>
    <td>Setare Boilerplate HTML</td>
    <td>09-Aug-2026</td>
  </tr>
  <!-- Rândul adăugat de tine: -->
  <tr>
    <td>#1002</td>
    <td>Înțelegere Arhitectură Client-Server</td>
    <td>10-Aug-2026</td>
  </tr>
</tbody>
```
:::

---

## Capitolul 4: Memoria Browserului, Metode HTTP și Tema Sesiunii 1

::: info 🎯 Obiective de învățare
La finalul acestui capitol, vei fi capabil să:
- Faci diferența între un request de tip **GET** și unul de tip **POST** și să știi când se folosește fiecare.
- Inspectezi tab-ul **Application** din DevTools pentru a investiga cookies și local storage.
- Realizezi prima ta temă independentă: o pagină de Autentificare structurată pentru testare automată.
- Folosești platforma de validare QualiAdept pentru a-ți evalua codul și a debloca progresul.
:::

### 4.1 Metode HTTP: GET vs. POST

* **GET (Cere informații):** Metoda implicită a browserului. Parametrii apar direct în URL (`site.ro/search?q=laptop`).  
  * *Regulă QA:* Nu trimitem niciodată date sensibile sau parole prin GET!
* **POST (Trimite informații):** Datele călătoresc ascunse în corpul cererii (*HTTP Request Body*). Folosit pentru formulare de Login, Register și crearea de resurse.

---

### 4.2 Memoria Browserului: Cookies, Local Storage și Session Storage

* **Cookies:** Date text mici (până la 4KB) trimise automat către server la fiecare cerere HTTP. Folosite pentru managementul sesiunii.
* **Local Storage:** Spațiu de stocare de până la 5-10MB care persistă chiar și după închiderea browserului. Ideal pentru Bearer Tokens și setări.
* **Session Storage:** Similar cu Local Storage, dar datele se șterg automat când tab-ul este închis.

---

### 4.3 DevTools: Tab-ul Application

Tab-ul **Application** îți permite să vizualizezi și să modifici datele stocate în browser:

![Tab-ul Application DevTools](/images/sessions/premium/session-1/image4.png)
<span class="image-caption">**Fig. 4** — Panoul Chrome DevTools cu tab-ul "Application" și secțiunile Cookies și Local Storage.</span>

---

### 4.4 Știați că...?

::: tip 💡 Știați că...?
- **Cookie-urile au inventat "Coșul de Cumpărături":** Primul cookie a fost creat în 1994 de Lou Montulli la Netscape pentru a permite magazinelor online să țină minte produsele adăugate în coș de la o pagină la alta.
- **Capacitate de stocare:** Un cookie suportă maximum 4KB, în timp ce Local Storage oferă până la 5MB.
:::

---

### 4.5 Poveste Aplicată: „Cartea Poștală și Coletul Blindat”

::: note 📖 Poveste Aplicată: Cartea Poștală și Coletul Blindat
- **Request-ul GET este ca o Carte Poștală:** Mesajul este scris pe spate, vizibil oricui îl manipulează. Excelent pentru căutări publice, periculos pentru parole.
- **Request-ul POST este ca un Colet Blindat:** Conținutul este sigilat în interiorul pachetului (Request Body), ferit de privirile din jur.
:::

---

### 4.6 Exerciții Practice

#### Exercițiul 1: Vânătoarea de Cookie-uri
1. Deschide Chrome pe un site unde ești autentificat (ex: GitHub, YouTube).
2. Apasă `F12` și mergi la tab-ul **Application** -> **Cookies**.
3. Identifică cookie-ul de sesiune (`auth`, `sess`, `token`), dă click-dreapta -> **Delete**, apoi reîncarcă pagina.
4. *Ce s-a întâmplat?*

---

### 4.7 Răspunsuri la Întrebări & Soluții la Exerciții

::: details 💡 Soluție Exercițiul 1
După ștergerea cookie-ului de sesiune și reîncărcarea paginii, ai fost delogat automat. Așa validăm că securitatea endpoint-urilor depinde corect de prezența token-ului de sesiune.
:::

---

### 4.8 Tema pentru Acasă & Platforma QualiAdept Cloud Evaluation

Construiește o pagină HTML de "Login și Înregistrare" pentru aplicația *Task Tracker*.

**Cerințe Tehnice (Acceptance Criteria):**
- Structură Boilerplate HTML5 validă.
- Titlu pagină: `Task Tracker Login`.
- Formular `<form>` în interiorul unui `<div class="login-container">`:
  - Input Email: `id="login-email"`, `data-testid="input-email"`.
  - Input Parolă: `type="password"`, `id="login-password"`, `data-testid="input-password"`.
  - Buton Submit: `data-testid="btn-submit-login"`, text: "Log In".

#### Cum te Auto-Validezi
1. Scrie codul în VS Code și testează-l în browser.
2. Intră pe [certify.qualiadept.eu](https://certify.qualiadept.eu) și autentifică-te cu GitHub.
3. Deschide Workspace-ul pentru **Modulul 01**, lipește codul și apasă **Submit**.
4. Verifică scorul și obține statusul **✅ Promovat**.