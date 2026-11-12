# Sesiunea 8: Structuri Avansate în TS și OOP (Pregătirea pentru POM)

<div style="display: flex; gap: 12px; flex-wrap: wrap; margin: 1.5rem 0 0.5rem 0;">
  <a href="/pdfs/sessions/premium/typescript-playwright/session-8.pdf" class="download-btn" target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24"><path d="M5 20h14v-2H5v2zm0-10h4V4h6v6h4l-7 7-7-7z"/></svg>Vizualizează suportul de curs (PDF)</a>
</div>

::: info 📊 Prezentare PowerPoint
Mai jos regăsești prezentarea PowerPoint interactivă aferentă acestei sesiuni. Poți parcurge slide-urile direct din browser sau poți descărca suportul de curs în format PDF folosind butonul de mai sus.
:::

<div style="position: relative; width: 100%; padding-bottom: 56.25%; height: 0; margin: 1.5rem 0; overflow: hidden; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
  <iframe 
    src="https://docs.google.com/presentation/d/e/2PACX-1vRk1nMmrpsr0psz-Fone0oz2hw6mXdh-aoCa1MXSZasCx1C8ffRnpgYBlxqYJIRY_YNzeaMeoQhB2ql/pubembed?start=true&loop=true&delayms=3000" 
    frameborder="0" 
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;" 
    allowfullscreen="true" 
    mozallowfullscreen="true" 
    webkitallowfullscreen="true">
  </iframe>
</div>

---

## Capitolul 1: Compoziția Interfețelor și Tipuri Utilitare (Utility Types)

::: info 🎯 Obiective de învățare
La finalul acestui capitol, vei fi capabil să:
- Înțelegi contextul istoric: cum a apărut nevoia exactă de a compune interfețe.
- Descoperi originile Tipurilor Utilitare (Utility Types) și ce probleme arhitecturale rezolvă ele.
- Înveți să folosești Pick, Omit și Partial direct pe scenarii de testare API E2E.
- Răspunzi la scenarii de interviu tehnic legate de "Sursa unică a adevărului" (Single Source of Truth).
- Înveți cum să controlezi asistenții AI pentru a nu-ți umple framework-ul de cod duplicat.
:::

### 1.1 Originea problemei: Cum a apărut nevoia de Compoziție?

::: tip 📝 Context Istoric
Când Microsoft a introdus primele versiuni de TypeScript, Interfețele (interface) au rezolvat problema obiectelor haotice, forțându-le să respecte un "contract". Însă, pe măsură ce companiile uriașe au început să migreze sisteme de mii de fișiere, a apărut o nouă problemă: duplicarea contractelor.
:::

Să ne imaginăm că scrii teste pentru un API care manipulează utilizatori. Ai un User (cu id, nume, email) și un AdminUser (cu id, nume, email + drepturi de ștergere). Dacă scriai două interfețe separate, încălcai principala regulă a programării: **DRY (Don't Repeat Yourself)**. Dacă Backend-ul decidea să schimbe câmpul nume în numeComplet, tu trebuia să cauți manual în 50 de interfețe și să faci modificarea.

**Soluția:** Așa a apărut nevoia de **Compoziție (Composition)** prin cuvântul cheie extends. TS le-a permis inginerilor să creeze o interfață "Părinte" de bază, iar alte interfețe să o moștenească, adăugând doar diferențele.

🤔❓ **Testează Compoziția în TS Playground:**

```ts
// 1. Definim interfața de bază (Sursa Adevărului)
interface UtilizatorBaza {
    id: number;
    nume: string;
    email: string;
}

// 2. Extindem (Compunem) interfața pentru un cont cu privilegii
// Admin-ul primește automat id, nume, email, plus noile reguli!
interface Admin extends UtilizatorBaza {
    nivelAcces: "SuperAdmin" | "Moderator";
    poateStergeTaskuri: boolean;
}

// 3. Creăm un obiect de test care TREBUIE să respecte compoziția
const superUser: Admin = {
    id: 1,                    
    nume: "Alex QA",          
    email: "alex@qa.com",     
    nivelAcces: "SuperAdmin", 
    poateStergeTaskuri: true  
};
console.log(`Userul ${superUser.nume} are drept de ștergere? ${superUser.poateStergeTaskuri}`);
```

### 1.2 Tipurile Utilitare (Utility Types): Cine le-a introdus și de ce?

::: tip 💡 Știați că...?
Odată cu popularizarea framework-urilor moderne de frontend (ca React) și a testării REST API, a apărut o problemă și mai grea. Când citești o resursă (cerere GET), API-ul îți dă obiectul complet (ex: cu id și data_creare). Dar când creezi o resursă nouă (cerere POST), tu nu trimiți id sau data_creare, pentru că serverul le va genera automat!
:::

La început, dezvoltatorii creau două interfețe (UserDb și UserCreateRequest). Din nou, cod duplicat masiv.

Pentru a salva situația, echipa TypeScript de la Microsoft (începând cu versiunea 2.1) a introdus **Tipurile Utilitare (Utility Types)**. Acestea sunt niște "funcții" magice la nivel de compilator care iau o interfață existentă și o transformă din mers!

* **`Omit<Tip, 'chei'>`**: Elimină câmpurile de care nu ai nevoie (Perfect pentru POST).  
* **`Partial<Tip>`**: Face toate câmpurile opționale (Perfect pentru cereri de update tip PATCH).  
* **`Pick<Tip, 'chei'>`**: Păstrează exclusiv câmpurile menționate.

🤔❓ **Testează Scenariul E2E de API în TS Playground:**

```ts
// Modelul Bazei de date (Sursa Adevărului)
interface TaskComplet {
    id: number;
    titlu: string;
    completat: boolean;
    dataCreare: string;
}

// --- SCENARIUL 1: TEST POST (Creare) ---
// Tăiem 'id' și 'dataCreare'
type PayloadPOST = Omit<TaskComplet, 'id' | 'dataCreare'>;

const dateTrisatePentruPost: PayloadPOST = {
    titlu: "Învață Utility Types",
    completat: false
    // ❌ Dacă încerci să adaugi "id: 1" aici, TS dă eroare!
};

// --- SCENARIUL 2: TEST PATCH (Update parțial) ---
// TS transformă totul automat în opțional (?)
type PayloadPATCH = Partial<TaskComplet>;

const dateTrisatePentruPatch: PayloadPATCH = {
    completat: true // Trimitem un singur câmp, și TS e fericit!
};
```

### 1.3 💡 Știați că...?

::: tip 💡 Știați că...?
Sunt invizibile: Tipurile Utilitare există *exclusiv* în mintea compilatorului TypeScript. Când apeși "Run" și codul ajunge JavaScript pur în browser, absolut toate Omit-urile și Partial-urile tale se evaporează, rezultând un cod cu performanță maximă (zero overhead la execuție). Dicționarul Suprem (`Record<K, V>`): Există un utilitar numit Record. Este folosit masiv în automatizare pentru a stoca seturi de date de test (Data-Driven Testing). Ex: const users: `Record<string, string>` = { "admin": "parola1", "guest": "parola2" }; garantează că vei avea întotdeauna doar text mapat la text.
:::

### 1.4 🧠 Challenge de Interviu (Întrebare Tehnică)

::: warning 🧠 Challenge de Interviu (Întrebare Tehnică)
**Intervievatorul:** *"Observ în framework-ul tău de Playwright că pentru payload-urile de POST ai folosit type CreateUser = `Omit<User, 'id'>`. De ce ai făcut asta în loc să creezi pur și simplu o interfață nouă interface CreateUser care să conțină manual doar câmpurile de care ai nevoie?"*
:::

**Răspunsul tău de inginer:** *"Am folosit Omit pentru a respecta principiul **Single Source of Truth (Sursa Unică a Adevărului)**. Dacă aș fi creat două interfețe complet separate, aș fi adus cod duplicat. Dacă săptămâna viitoare echipa de Backend adaugă un câmp obligatoriu nou (ex: numarTelefon) în modelul de User, eu trebuie să actualizez codul într-un singur loc (pe interfața părinte). Tipul utilitar Omit va absorbi automat noua schimbare, păstrându-mi testele sigure și reducând la minimum efortul de mentenanță."*

### 1.5 🤖 Mentalitatea de Inginer în Era AI: Suprasaturarea cu Interfețe

::: tip 🤖 Mentalitatea de Inginer în Era AI
Codul Generat Duplicat Capcana (Unde AI-ul eșuează): Dacă îi ceri lui ChatGPT să-ți scrie testele de CRUD (Create, Read, Update, Delete) pentru o pagină nouă de "Produse", AI-ul va fi leneș arhitectural. El va genera o tonă de cod: va defini interface Product, interface ProductCreatePayload, interface ProductUpdatePayload, duplicând zeci de câmpuri de text. Când framework-ul ajunge la 1000 de teste, devine un infern de întreținut. Cum gândește un inginer QA: Inginerul respinge codul duplicat din PR (Pull Request) sau din Prompt. El instruiește AI-ul clar: *"Definește o singură interfață de bază IProduct. Pentru Payload-urile de test de tip POST și PATCH, forțează utilizarea tipurilor utilitare Omit și Partial derivate strict din interfața de bază."* Astfel, arhitectura framework-ului rămâne curată, agilă și ușor de modificat pe măsură ce aplicația crește.
:::

---

## Capitolul 2: Programarea Orientată pe Obiecte (OOP) - Disecarea celor 4 Piloni

::: info 🎯 Obiective de învățare
La finalul acestui capitol, vei fi capabil să:
- Înțelegi contextul istoric: de ce industria de testare a fugit de scripturile liniare și a adoptat arhitectura bazată pe Clase.
- Analizezi exhaustiv cei 4 Piloni ai OOP: Încapsulare, Moștenire, Polimorfism și Abstractizare.
- Compari exemple reale de cod "Așa NU" (Spaghetti code) vs. "Așa DA" (Arhitectură de producție Playwright E2E).
- Descoperi curiozități istorice despre originea Page Object Model-ului.
- Răspunzi corect la diferența tehnică dintre o interface și o abstract class.
- Folosești OOP-ul ca "scut" împotriva codului instabil generat de asistenții AI.
:::

### 2.1 Context Istoric: De la Scripting Liniar la Matrițe (Clase)

::: tip 📝 Context Istoric
La începuturile testării automate, testele erau doar o listă lungă de comenzi aruncate într-un fișier. Găseai un buton, dădeai click, scriai un text. Pe măsură ce aplicațiile au devenit uriașe (zeci de pagini, mii de teste), acest stil a dus la un colaps arhitectural: "Spaghetti Code". Dacă un dezvoltator schimba clasa CSS a unui buton de Login, trebuia să cauți manual în 500 de fișiere de test pentru a repara acel string.
:::

Pentru a face ordine, inginerii de QA au împrumutat **Programarea Orientată pe Obiecte (OOP)** de la programatorii de Backend. În loc să scriem acțiuni la grămadă, grupăm datele (selectorii CSS) și acțiunile (click, fill) în "cutii" logice numite **Clase**.

O Clasă este o **Matriță** (sau o schiță tehnică). Din ea generăm "Obiecte" reale (Instanțe) cu care interacționăm. În Playwright, mapăm fiecare pagină din aplicația web (ex: LoginPage, CheckoutPage) într-o Clasă dedicată. Acest Design Pattern suprem se numește **Page Object Model (POM)**.

Cei 4 piloni ai OOP nu sunt doar teorie; sunt regulile de supraviețuire ale acestui model.

### 2.2 Pilonul 1: Încapsularea (Securitatea Datelor și a Selectorilor)

::: tip 📝 Nevoia și Problema rezolvată
Într-o echipă cu 10 testeri, dacă selectorii (ex: #submit-btn) sunt lăsați la vedere (globali), oricine îi poate modifica accidental din interiorul unui test oarecare. Mai grav, dacă logica de extragere a unui text se află direct în fișierul de test, orice schimbare de UI rupe sute de teste simultan. Încapsularea rezolvă asta "ascunzând" datele sensibile (selectorii) în interiorul clasei și permițând interacțiunea cu ele doar prin uși bine păzite (metode asincrone).
:::

Folosim **Modificatori de Acces**:

* public (implicit): Poate fi apelat direct din fișierul de test.  
* private: Accesibil **DOAR** din interiorul clasei (perfect pentru selectorii CSS).  
* readonly: Constantă. Odată setată, nu mai poate fi schimbată (ex: URL-ul paginii).

#### ❌ Așa NU (Fără Încapsulare - Cod Fragil în Test)

Fișierul de test are acces direct la "măruntaiele" paginii.

```ts
// Fișier test: login.spec.ts
// Dacă mâine inputul devine "#user-email", trebuie să cauți acest string manual în 50 de teste!
await page.fill("#username-field", "admin");
await page.click(".btn-login");
```

#### ✅ Așa DA (Cu Încapsulare - Page Object Model real)

Ascundem selectorii în interiorul clasei. Testul nu știe absolut nimic despre CSS-ul paginii!

```ts
// Fișier POM: LoginPage.ts
import { Page } from 'playwright';

class LoginPage {
    // ÎNCAPSULARE: Selectorii sunt private. Nu pot fi accesați sau stricați din test!
    private selUsername = "input[data-testid='username']";
    private selBtnLogin = "button[data-testid='login']";
    readonly url = "https://app.ro/login";

    // Injectăm obiectul Page nativ din Playwright
    constructor(private page: Page) {}

    // Expunem o "ușă" publică. Testul doar o apelează, fără să-i pese CUM funcționează.
    public async executaLogin(user: string): Promise<void> {
        await this.page.fill(this.selUsername, user);
        await this.page.click(this.selBtnLogin);
    }
}

// Fișier test: login.spec.ts
const loginPage = new LoginPage(page);
// loginPage.selUsername = "hacked"; // ❌ TS EROARE: Property 'selUsername' is private!
await loginPage.executaLogin("admin"); // ✅ Test E2E curat, rezilient.
```

### 2.3 Pilonul 2: Moștenirea (Reutilizarea Codului - DRY)

**Nevoia și Problema rezolvată:** Aplicația ta E2E are 20 de pagini (Dashboard, Setări, Profil, etc.). Toate cele 20 de pagini au o bară de navigație (Navbar) cu un buton de Logout. Dacă scrii clasa pentru fiecare pagină de la zero, vei duplica selectorul de Logout și metoda click() de 20 de ori. Moștenirea rezolvă asta: creezi o clasă "Părinte" care conține elementele globale, iar restul claselor "Copil" absorb automat tot codul folosind cuvântul extends.

#### ❌ Așa NU (Cod Duplicat)

```ts
class DashboardPage {
    public async faLogout() { await this.page.click("#logout-btn"); }
}

class SettingsPage {
    public async faLogout() { await this.page.click("#logout-btn"); } // DUPLICAT!
}
```

#### ✅ Așa DA (Moștenire - Arhitectură Ierarhică E2E)

```ts
// PĂRINTELE (Conține elementele globale și primește Page-ul)
class BasePage {
    constructor(protected page: Page) {} // protected permite copiilor să folosească this.page!

    public async faLogout(): Promise<void> {
        await this.page.click("[data-testid='nav-logout']");
        await this.page.waitForURL('**/login'); // Așteptăm redirecționarea
    }
}

// COPILUL (Extinde Părintele, primind metodele lui gratuit)
class DashboardPage extends BasePage {
    private selGrafic = '.chart-container';

    constructor(page: Page) {
        super(page); // Pasăm instanța Playwright Page către Părinte!
    }

    public async verificaGrafic(): Promise<void> {
        await expect(this.page.locator(this.selGrafic)).toBeVisible();
    }
}

const dash = new DashboardPage(page);
await dash.verificaGrafic(); // Metoda proprie
await dash.faLogout();       // ✅ Succes! A făcut logout perfect, deși nu am scris codul în DashboardPage.
```

### 2.4 Pilonul 3: Polimorfismul (Suprascrierea Comportamentului)

**Nevoia și Problema rezolvată:** Uneori, logica Părintelui nu se potrivește 100% cu realitatea Copilului. Să presupunem că Părintele BasePage are o metodă asteaptaIncarcarea() care verifică un stadiu standard al rețelei. Dar pagina ta de Rapoarte Financiare (Copilul) apelează un API lent care durează 15 secunde. Polimorfismul permite Copilului să **suprascrie** metoda Părintelui, păstrând exact același nume (ca să nu confunde testerii care o apelează), dar schimbând logica internă!

#### ❌ Așa NU (Nume multiple, confuzie în teste)

```ts
class RapoartePage extends BasePage {
    // Testerul care folosește clasa nu mai știe dacă să apeleze 
    // metoda asteaptaIncarcarea() (de la părinte) sau asta nouă:
    public async asteaptaIncarcareExtraLungaSiGreaAPI() { ... } 
}
```

#### ✅ Așa DA (Polimorfism - Același contract, execuție E2E diferită)

```ts
class BasePage {
    constructor(protected page: Page) {}

    public async asteaptaIncarcarea(): Promise<void> {
        // Așteptare standard Playwright când traficul de rețea se calmează
        await this.page.waitForLoadState('networkidle'); 
    }
}

class RapoartePage extends BasePage {
    // POLIMORFISM: Suprascriem metoda părintelui!
    // Păstrăm EXACT același nume, dar schimbăm așteptarea cu una specifică pentru API-ul greu.
    public async asteaptaIncarcarea(): Promise<void> {
        console.log("Acest ecran e lent. Aștept răspunsul HTTP de la API-ul de rapoarte...");
        await this.page.waitForResponse(response => 
            response.url().includes('/api/rapoarte-grele') && response.status() === 200
        );
    }
}

const reports = new RapoartePage(page);
await reports.asteaptaIncarcarea(); // ✅ Va rula versiunea asincronă lentă, specifică doar acestei pagini!
```

### 2.5 Pilonul 4: Abstractizarea (Forțarea Regulilor Arhitecturale)

**Nevoia și Problema rezolvată:** Ești arhitectul framework-ului și lucrezi cu 5 QA Juniori. Cineva creează o Pagină nouă (ex: ProfilPage), dar "uită" să implementeze asertarea critică prin care se verifică dacă pagina chiar s-a deschis corect. Abstractizarea este rolul tău de Director Tehnic. O clasă marcată cu abstract este o clasă "fantomă": **NU** poți instanția obiecte din ea (nu poți da new BasePage()). Ea există exclusiv pentru a impune reguli. O metodă abstractă este o metodă fără logică în interior – ea este doar un contract strict, forțând copilul să scrie codul E2E!

#### ❌ Așa NU (Reguli opționale, teste Flaky)

```ts
class BasePage { ... }

class ProfilPage extends BasePage {
    // Juniorul uită să implementeze funcția de validare a stării paginii.
    // TypeScript nu se supără. Testele ajung în producție și crapă aleatoriu,
    // pentru că Playwright nu știe când pagina s-a încărcat cu adevărat.
}
```

#### ✅ Așa DA (Abstractizare - Contract forțat de compilatorul TS)

```ts
abstract class BasePage {
    constructor(protected page: Page) {}

    // Metodă comună care poate fi folosită de toți
    public async reloadPagina(): Promise<void> {
        await this.page.reload();
    }

    // METODĂ ABSTRACTĂ: Nu are cod, doar definește obligația!
    abstract valideazaIncarcareaPaginii(): Promise<void>; 
}

// ❌ const base = new BasePage(page); // EROARE TS: Nu poți instanția o clasă abstractă.

class ProfilPage extends BasePage {
    // Dacă ai șterge blocul de mai jos, TS ar sublinia 'ProfilPage' cu ROȘU:
    // "Non-abstract class 'ProfilPage' does not implement inherited abstract member 'valideazaIncarcareaPaginii'"
    
    public async valideazaIncarcareaPaginii(): Promise<void> {
        // Obligat de contract, testerul scrie asertarea clară a paginii!
        await expect(this.page).toHaveTitle(/Profilul Meu/);
        await expect(this.page.locator('.avatar-img')).toBeVisible();
    }
}
```

### 2.6 💡 Știați că...?

::: tip 💡 Știați că...?
Originea POM: Conceptul de "Page Object Model" nu a fost inventat de creatorii Playwright, ci a fost popularizat acum mai bine de 10 ani de comunitatea Selenium WebDriver (mai exact de Simon Stewart) și recunoscut formal ca un *Design Pattern* excelent de celebrul arhitect software Martin Fowler. Problema Diamantului (Diamond Problem): În TypeScript (și JavaScript), o clasă poate moșteni (prin extends) un singur Părinte. Limbajul interzice moștenirea multiplă pentru a evita situația în care două clase părinte au o metodă cu același nume și copilul nu știe pe care să o aleagă. Dacă ai nevoie de structuri multiple, trebuie să folosești interfețe (o clasă poate implementa oricâte interfețe dorește).
:::

### 2.7 🧠 Challenge de Interviu (Întrebare Tehnică)

::: warning 🧠 Challenge de Interviu (Întrebare Tehnică)
**Intervievatorul:** *"În TypeScript, pentru a forța o anumită structură pentru paginile din framework-ul tău E2E, putem folosi atât o interface, cât și o abstract class. Care este diferența majoră și pe care o alegi când construiești fundația unui Page Object Model (POM)?"*
:::

**Răspunsul tău de inginer:** *"Diferența principală este ce se întâmplă la compilare și ce pot conține. O interface este o simplă schiță invizibilă. Ea dispare complet când codul se transformă în JavaScript și **nu** poate conține nici măcar o singură linie de cod executabil (nicio implementare). O abstract class supraviețuiește compilării. Ea îmi permite o abordare hibridă: pot forța contracte stricte prin metode abstract (cum face o interfață), dar **pot să și scriu cod real Playwright, reutilizabil** (cum ar fi o metodă generală de faLogout()) pe care toți copiii îl vor moșteni direct. De aceea, pentru fundația unui framework E2E (BasePage), aleg întotdeauna o clasă abstractă!"*

### 2.8 🤖 Mentalitatea de Inginer în Era AI: Combate Codul "Spaghetti"

::: tip 🤖 Mentalitatea de Inginer în Era AI
Dezastrul Scripting-ului Liniar Capcana (Unde AI-ul eșuează): Dacă îi dai unui AI promptul *"Scrie-mi 3 teste Playwright pentru fluxul de cumpărături"*, comportamentul lui implicit este să genereze fișiere uriașe, unde declară selectorii #cart sau .buy-btn la nesfârșit în fiecare fișier, dând page.click() în mod brut. AI-ul rezolvă problema imediată, dar distruge viitorul mentenanței (dacă se schimbă id-ul #cart, 100 de teste generate de AI pică simultan). Cum gândește un inginer QA: Inginerul refuză prompturile superficiale. El se comportă ca un Arhitect pentru AI: *"Generează un Page Object pentru fluxul de cumpărături în Playwright. Încapsulează toți selectorii ca proprietăți private. Extinde clasa abstractă BasePage și implementează metoda obligatorie de validare a paginii. Asigură-te că fișierele mele de test (spec.ts) folosesc strict doar metodele publice expuse, fără niciun selector expus în test."* Rezultatul: Obligând AI-ul să respecte pilonii OOP, obții cod E2E scris cu viteză supraomenească, dar protejat de un blindaj arhitectural impenetrabil pe care îl poți scala la infinit.
:::


---

## Capitolul 3: Refactorizare Practică - Construirea POM-ului pentru "Task Tracker"

::: info 🎯 Obiective de învățare
La finalul acestui capitol, vei fi capabil să:
- Faci tranziția mentală de la codul aplicației (SUT - Software Under Test) la codul Framework-ului de Testare.
- Folosești atributele data-testid adăugate în Sesiunea 6 pentru a construi un Page Object Model infailibil.
- Aplici cei 4 piloni OOP (învățați anterior) pentru a mapa interfața aplicației Task Tracker.
- Simulezi tipurile din Playwright (Page, Locator) pentru a scrie un cod E2E strict tipizat.
:::

### 3.1 Podul către Modulul de Automatizare

::: tip 📝 Context Istoric
În Sesiunea 6, am jucat rolul de Front-End Developers și am construit aplicația "Task Tracker". Am adăugat atribute speciale precum data-testid="input-task-name". Acum, ne punem definitiv "pălăria" de QA Automation Engineers.
:::

Pentru a testa această aplicație fără a scrie *Spaghetti Code*, vom construi o structură arhitecturală de tip **Page Object Model (POM)**. Vom crea o clasă TaskTrackerPage care va servi drept manual de utilizare a aplicației pentru viitorul nostru robot Playwright.

### 3.2 Pregătirea Terenului (Mocking-ul Playwright)

Deoarece Playwright va fi instalat abia în Modulul următor, pentru a ne asigura că TypeScript nu ne dă erori în editor (deoarece nu cunoaște încă obiectul page), vom crea niște **Interfețe (Mock-uri)** care simulează contractul exact pe care Playwright ni-l va oferi.

Această practică este esențială în inginerie: programăm împotriva unor "contracte" (Interfețe), nu a implementărilor!

```ts
// 1. MOCK-URI: Așa arată interfețele native ascunse din interiorul Playwright!
// Le definim aici doar pentru a avea autocompletare și zero erori de compilare în TS.

interface Locator {
    click(): Promise<void>;
    fill(text: string): Promise<void>;
    innerText(): Promise<string>;
}

interface Page {
    goto(url: string): Promise<void>;
    locator(selector: string): Locator;
    waitForLoadState(stare: 'load' | 'networkidle'): Promise<void>;
}
```

### 3.3 Construirea Arhitecturii Părinte (BasePage)

Regula de aur a OOP-ului în testare este să nu duplicăm codul comun. Orice pagină din viitorul nostru framework (fie ea pagina de Login sau Task Tracker) va trebui să fie accesată prin URL și să aștepte încărcarea rețelei. Prin **Abstractizare** și **Moștenire**, impunem un contract strict.

```ts
// PĂRINTELE: Baza tuturor paginilor din framework-ul nostru E2E
abstract class BasePage {
    // Încapsulăm pagina Playwright primită, protejând-o, dar permițând copiilor accesul
    constructor(protected page: Page) {}

    // Metodă comună reutilizabilă E2E
    public async viziteaza(url: string): Promise<void> {
        console.log(`[Rețea] Navighez către: ${url}`);
        await this.page.goto(url);
    }

    // Abstractizare: Forțăm orice QA care creează o pagină nouă să scrie o funcție de validare!
    abstract asteaptaIncarcareaCompleta(): Promise<void>;
}
```

### 3.4 Crearea POM-ului pentru SUT-ul nostru (TaskTrackerPage)

Acesta este momentul adevărului. Vom scrie Clasa care mapează 1 la 1 aplicația noastră Task Tracker. Observă cum folosim **Încapsularea** pentru a bloca accesul direct la selectorii CSS și cum expunem metode publice, intuitive, bazate pe acțiuni de business (ex: adaugaTaskNou()).

```ts
// COPILUL: Page Object Model-ul dedicat aplicației noastre din Sesiunea 6
class TaskTrackerPage extends BasePage {
    
    // 1. ÎNCAPSULAREA SELECTORILOR: Folosim EXCLUSIV atributele data-testid puse de noi!
    private selInputTask = "[data-testid='input-task-name']";
    private selBtnSalveaza = "[data-testid='submit-task-btn']";
    private selListaTaskuri = "[data-testid='task-list']";
    private selEroare = "[data-testid='error-message']";

    constructor(page: Page) {
        super(page); // Pasăm controlul Playwright către părinte
    }

    // 2. POLIMORFISM: Implementarea obligatorie impusă de Părinte
    public async asteaptaIncarcareaCompleta(): Promise<void> {
        console.log("[TaskTracker] Aștept ca API-ul extern să termine de descărcat cele 5 task-uri inițiale...");
        await this.page.waitForLoadState('networkidle');
    }

    // 3. METODE E2E DE BUSINESS: Ascundem comenzile Playwright sub acțiuni ușor de citit
    public async adaugaTaskNou(numeTask: string): Promise<void> {
        console.log(`[Acțiune UI] Completez formularul cu task-ul: "${numeTask}"`);
        
        // Preluăm locatorul și executăm acțiuni asincrone simulate
        const inputLocator = this.page.locator(this.selInputTask);
        await inputLocator.fill(numeTask);
        
        const btnLocator = this.page.locator(this.selBtnSalveaza);
        await btnLocator.click();
    }

    public async obtineMesajEroare(): Promise<string> {
        const eroareLocator = this.page.locator(this.selEroare);
        return await eroareLocator.innerText();
    }
}
```

Acum, în Modulul 4, fișierele tale de test (spec.ts) vor arăta incredibil de curat. Testerul care scrie testul E2E va folosi doar acțiunile expuse, total decuplat de HTML sau de selectorii fragili:

```ts
// Cum va arăta testul tău Playwright real în Sesiunea 10:
/*
test('Utilizatorul poate adăuga un task valid', async ({ page }) => {
    const trackerApp = new TaskTrackerPage(page);
    
    await trackerApp.viziteaza('http://localhost:3000');
    await trackerApp.asteaptaIncarcareaCompleta();
    
    await trackerApp.adaugaTaskNou('Testare E2E POM');
    
    // Assert-ul de verificare
    await expect(page.locator("[data-testid='task-list']")).toContainText('Testare E2E POM');
});
*/
```

### 3.5 💡 Știați că...?

::: tip 💡 Știați că...?
Codul de Test este și el Software: Mulți QA începători tratează testele automate ca pe niște "scripturi aruncabile". Profesioniștii tratează framework-ul de testare cu același nivel de rigoare arhitecturală (OOP, Clean Code, PR Reviews) ca și aplicația pe care o testează (SUT). Un framework dezordonat devine imposibil de rulat în CI/CD după doar 6 luni. Separation of Concerns (SoC): Page Object Model este implementarea perfectă a principiului SoC. Separăm logica de găsire a elementelor pe pagină (Clasa) de logica care decide dacă testul trece sau pică (Fișierul spec.ts cu Assertions).
:::

### 3.6 🧠 Challenge de Interviu (Întrebare Tehnică)

::: warning 🧠 Challenge de Interviu (Întrebare Tehnică)
**Intervievatorul:** *"Mă uit la clasa ta TaskTrackerPage. De ce ai pus selectorii CSS ca proprietăți ale clasei (la început), în loc să îi pui ca variabile direct în interiorul funcției adaugaTaskNou()?"*
:::

**Răspunsul tău de inginer:** *"Am centralizat selectorii ca proprietăți private la nivel de clasă pentru a asigura **Mentenanța Centralizată (Single Source of Truth)**. Dacă aș fi pus selectorul [data-testid='input-task-name'] direct în interiorul funcției adaugaTaskNou(), și apoi l-aș fi refolosit în altă funcție verificaStareInput(), aș fi creat cod duplicat. Dacă dezvoltatorii Frontend modifică mâine atributul testid din HTML, prin această arhitectură OOP eu am nevoie să modific string-ul doar într-un singur loc (sus în clasă), iar TOATE funcțiile și testele E2E dependente de el se vor 'vindeca' automat și vor folosi noua valoare."*

### 3.7 🤖 Mentalitatea de Inginer în Era AI: Construirea Șabloanelor (Boilerplates)

::: tip 🤖 Mentalitatea de Inginer în Era AI
Prompts bazate pe SUT Ce face AI-ul bine: AI-ul este excepțional la a scrie cod plictisitor. Maparea a zeci de selectori dintr-o pagină HTML într-o clasă TypeScript durează timp manual. Cum gândește un inginer QA: Inginerul folosește AI-ul pentru "Heavy Lifting" (munca brută). El copiază întregul fișier index.html al aplicației SUT și îl introduce în ChatGPT împreună cu următorul Prompt Arhitectural: *"Acesta este HTML-ul aplicației. Generază-mi clasa Page Object Model în TypeScript. Extrage EXCLUSIV atributele data-testid și transformă-le în proprietăți private. Generează metode asincrone public care învelesc metodele Playwright (fill, click) doar pentru elementele interactive (formular, butoane)."* Rezultatul: Obții un Boilerplate perfect al clasei POM în secunde, respectând pilonii OOP (Încapsulare). Timpul economisit este apoi folosit de inginer pentru a scrie *logica de business* a asertărilor.
:::

---

## Capitolul 4: Structuri Avansate - Funcții Inteligente cu Generics (`<T>`)

::: info 🎯 Obiective de învățare
La finalul acestui capitol, vei fi capabil să:
- Înțelegi contextul istoric: cum duplicarea codului și tipul any au distrus primele framework-uri TS, ducând la inventarea Genericelor.
- Descoperi conceptul de "Generics" (Tipuri Parametrizate) ca fiind "imprimante 3D" pentru tipuri de date.
- Construiești un API Client E2E robust, folosind metode `GET<T>` și `POST<T, U>`.
- Descoperi cum folosește Playwright genericele nativ pentru a extrage date din DOM (`page.evaluate<T>`).
- Răspunzi la întrebări de interviu de nivel Mid-Senior despre siguranța datelor la runtime vs. compile-time.
:::

### 4.1 Originea și Problema: Framework-ul Sufocat de Duplicare

::: tip 📝 Context Istoric
Când companiile au început să folosească TypeScript pentru automatizarea testelor (QA), s-au lovit de o problemă majoră la testarea de API-uri sau la citirea datelor din fișiere JSON (Data-Driven Testing). Aplicația are zeci de entități: Utilizatori, Produse, Comenzi, Task-uri. Cum scrii o funcție reutilizabilă pentru a cere aceste date de la server? Înainte de Generics, inginerii aveau doar două opțiuni, ambele dezastruoase:
:::

#### ❌ Abordarea 1: Cod Duplicat la Infinit (Încălcarea DRY)

Trebuia să scrii o funcție unică pentru FIECARE tip de resursă. Dacă aveai 50 de endpoint-uri, scriai 50 de funcții care făceau exact același lucru (un simplu fetch), diferind doar interfața de retur.

```ts
async function fetchUser(url: string): Promise<User> { ... }
async function fetchTask(url: string): Promise<Task> { ... }
async function fetchProduct(url: string): Promise<Product> { ... }

```

**Rezultat:** Mii de linii de cod inutil. Mentenanță imposibilă.

#### ❌ Abordarea 2: Întoarcerea la JavaScript-ul Sălbatic (Folosirea lui any)

Pentru a scăpa de duplicare, programatorii leneși creau o singură funcție "universală" care returna any.

```ts
async function fetchDateUniversale(url: string): Promise<any> {
    const response = await fetch(url);
    return await response.json();
}

// În test:
const user = await fetchDateUniversale('/api/user/1');
console.log(user.numeCpmlet); // Nicio eroare în VS Code, dar testul crapă la rulare (era numeComplet).

```

**Rezultat:** Ai salvat spațiu, dar ai distrus complet scopul TypeScript-ului. Pierzi autocompletarea și siguranța (Type Safety) exact în momentul în care ai mai mare nevoie de ele: în asertările din teste.

### 4.2 Salvarea: Conceptul de Generics (`<T>`)

Pentru a rezolva acest impas, limbajele moderne (împrumutând conceptul din C# și Java) au introdus **Genericele (Generics)**. Gândește-te la ele ca la niște **parametri, dar nu pentru valori, ci pentru TIPURI**.

Prin convenție, folosim litera majusculă **`<T>`** (de la Type). O funcție generică acționează ca o imprimantă 3D: nu știe dinainte ce formă va printa, dar când îi introduci matrița (interfața ta), se mulează perfect pe ea și îți garantează rezultatul.

### 4.3 Exemplu E2E 1: Construirea unui APIClient de Producție (Așa DA)

În Playwright, nu vei face fetch la întâmplare. Vei construi o clasă utilitară pe care o vei folosi în toate testele. Observă cum folosim `<T>` pentru a face metodele universale și sigure.

```ts
// 1. Matrițele noastre (Interfețe)
interface UserData { id: number; username: string; }
interface TaskData { id: number; completed: boolean; }

// 2. Clasa Utilitară E2E
class ApiClient {
    
    // Metoda GET acceptă un tip T și garantează că returnează o Promisiune de acel tip T
    public async get<T>(url: string): Promise<T> {
        const response = await fetch(url);
        if (!response.ok) throw new Error("API a picat!");
        return (await response.json()) as T;
    }

    // Metoda POST e mai avansată: acceptă T (pentru Payload-ul trimis) 
    // și U (pentru Răspunsul primit), pentru că adesea diferă!
    public async post<T, U>(url: string, payload: T): Promise<U> {
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(payload)
        });
        return (await response.json()) as U;
    }
}

// 3. Execuția în Test (Aici se întâmplă Magia!)
const runApiTests = async () => {
    const api = new ApiClient();

    // Trimitem tipul <UserData> ca ARGUMENT DE TIP. 
    // Variabila `user` primește instantaneu autocompletare pentru .username!
    const user = await api.get<UserData>('https://api.ro/users/1');
    console.log(`Testăm userul: ${user.username}`);

    // Refolosim EXACT aceeași funcție, dar acum o transformăm în Task!
    const task = await api.get<TaskData>('https://api.ro/tasks/99');
    console.log(`Task completat? ${task.completed}`);
};

```

### 4.4 Exemplu E2E 2: Cum folosește Playwright Genericele în DOM

Genericele nu sunt doar pentru API-uri. Playwright le folosește intern în cele mai puternice metode ale sale.

Când vrei să extragi o informație complexă direct din interiorul browserului (contextul DOM) și să o aduci în testul tău (contextul Node.js), folosești metoda page.evaluate(). Fără Generice, TypeScript nu ar ști ce returnează browserul.

```ts
// Exemplu real dintr-un script Playwright E2E:
test('Extragere scor din UI', async ({ page }) => {
    
    // Playwright ne obligă să punem <number> aici. 
    // Îi garantăm framework-ului că scriptul injectat în browser va returna matematic un număr.
    const scorVizual = await page.evaluate<number>(() => {
        // Aici suntem în interiorul browserului Chrome!
        const text = document.querySelector('.scor-total')?.textContent;
        return text ? parseInt(text) : 0;
    });

    // Deoarece scorVizual este garantat a fi <number>, TS îmi permite să folosesc asertări matematice:
    expect(scorVizual).toBeGreaterThan(100); 
});

```

### 4.5 Exemplu E2E 3: Citirea Fișierelor de Date (Data-Driven Testing)

Un alt scenariu zilnic în QA este testarea condusă de date (Data-Driven). Vrei să rulezi același test de 10 ori, citind date dintr-un fișier .json. Funcția care citește fișierul trebuie să fie generică, pentru a se adapta oricărui fișier de test (utilizatori, parole, produse).

```ts
// Funcție generică (Mock) care citește un fișier și aplică tipul
const citesteFisierDeTest = async <T>(numeFisier: string): Promise<T[]> => {
    console.log(`Citesc date din ${numeFisier}...`);
    // Simulăm parsarea JSON-ului
    const dataBruta = '[{"id": 1, "nume": "Test1"}]'; 
    return JSON.parse(dataBruta) as T[];
};

interface CategorieTest { id: number; nume: string; }

const testDataDriven = async () => {
    // Array-ul rezultat primește automat metode specifice listelor de CategorieTest
    const categorii = await citesteFisierDeTest<CategorieTest>('categorii.json');
    
    categorii.forEach(cat => {
        console.log(`Asertăm categoria: ${cat.nume}`); // Autocompletare perfectă
    });
};

```

### 4.6 💡 Știați că...?

::: tip 💡 Știați că...?
Generice în constrângeri (extends): Genericele pot fi limitate. Nu trebuie să accepte "orice". Dacă scrii `<T extends { id: number }>`, îi spui compilatorului: *"Accept orice tip T vrei tu, atâta timp cât acel obiect are măcar o proprietate numită id de tip număr"*. Aceasta este esențială pentru construirea funcțiilor de ștergere (DELETE), care au mereu nevoie de un ID. Componentele UI Generice: În framework-urile de frontend (precum React) sau în cele de testare cu Component Testing, poți crea un Page Object Model Generic. O clasă TabelGeneric`<T>` poate mapa orice tabel de pe ecran, adaptându-și coloanele automat în funcție de tipul de date T pe care i-l pasezi.
:::

### 4.7 🧠 Challenge de Interviu (Întrebare Tehnică)

::: warning 🧠 Challenge de Interviu (Întrebare Tehnică)
**Intervievatorul:** *"Care este diferența dintre a scrie o funcție care returnează any și o funcție care folosește un tip Generic `<T>`? Nu e același lucru, din moment ce ambele acceptă orice fel de payload de la server?"*
:::

**Răspunsul tău de inginer:** *"Deși ambele acceptă orice date la intrare, diferența arhitecturală uriașă se află la **ieșire (la retur)**. Dacă funcția mea returnează any, TypeScript se închide. Pierd lanțul de validare (Type Safety) exact în momentul în care salvez rezultatul în variabila de test, deschizând ușa pentru Flaky Tests cauzate de greșeli de tastare. Genericele (`<T>`) creează un **canal de comunicare matematică invizibilă**. Când îi transmit funcției tipul `<User>`, acel tip traversează întreaga funcție și 'îngheață' returul. Editorul știe exact ce îmi returnează, îmi oferă autocompletare pe proprietățile lui User și garantează siguranța asertărilor E2E, eliminând complet necesitatea lui any."*

### 4.8 🤖 Mentalitatea de Inginer în Era AI: Funcții Utilitare Sigure

::: tip 🤖 Mentalitatea de Inginer în Era AI
Cod Helper "Prea Flexibil" Capcana (Unde AI-ul eșuează): Asistenții AI (Copilot, ChatGPT) au prostul obicei de a genera funcții "Helper" de tip "Swiss Army Knife". Dacă îi ceri un script care să interogheze baza de date pentru setup-ul testului, va genera o funcție frumoasă care returnează implicit any pentru a se asigura că scriptul său nu dă erori pe loc. Un astfel de fișier dbUtils.ts va 'otrăvi' arhitectura cu întoarceri netipizate. Cum gândește un inginer QA: Inginerul controlează calitatea codului la sursă. Când îi cere AI-ului să scrie metode utilitare de Setup/Teardown, folosește un prompt restrictiv și arhitectural: *"Creează un serviciu utilitar TypeScript pentru Database/API. Toate metodele de citire trebuie să fie Generice (`<T>`), nu folosi any. Parametrizează funcțiile astfel încât să pot pasa interfețele modelelor din testul E2E."* Rezultatul: Obții un framework incredibil de flexibil (poți cere orice resursă din DB) care nu sacrifică nicio secundă din siguranța strictă impusă de compilatorul TypeScript.
:::

---

## Capitolul 5: Tema Sesiunii 8 & Extra Practice (Spre nivelul de Senior)

### 5.1 Tema pentru Acasă (Proiect Arhitectural Sesiunea 8)

::: info 🎯 Obiectivul Temei
Demonstrarea stăpânirii celor 4 Piloni ai Programării Orientate pe Obiecte (OOP) și a Tipurilor Utilitare TypeScript prin construirea scheletului Page Object Model (POM) pentru un magazin online (E-Commerce).
:::

#### 🏢 Scenariul de Business

Echipa ta tocmai a început un proiect nou de QA Automation cu Playwright pentru aplicația "QA-Commerce". Aplicația are 3 pagini principale:

1. **Pagina de Start (HomePage):** Unde se caută produsele.  
2. **Pagina Produsului (ProductPage):** Unde se vizualizează detaliile și se adaugă în coș.  
3. **Pagina de Finalizare (CheckoutPage):** Unde se introduc datele de livrare și se dă comanda.

Misiunea ta, ca Test Architect, este să scrii **Structura de Clase (POM)** în TypeScript care să mapeze aceste pagini, pregătind terenul pentru colegii care vor scrie testele efective.

#### 📋 Cerințe Tehnice (Acceptance Criteria)

1. **Interfețele de Date (Sursa Adevărului):**  
   * Creează o interfață Produs cu id, nume, pret și inStoc.  
   * Folosind Tipuri Utilitare, creează un Tip numit ProdusTest care elimină (Omit) id-ul (pentru că nu avem nevoie de el când căutăm produsul pe site vizual).  
2. **Abstractizare & Moștenire (Clasa de Bază):**  
   * Creează o clasă abstract class BasePage.  
   * În constructor, aceasta trebuie să primească și să protejeze obiectul page (vom folosi tipul any temporar pentru page doar ca să nu dea eroare în TS Playground, simulând Playwright-ul).  
   * Adaugă o metodă abstractă obligatorie valideazaIncarcarea(): void;.  
   * Adaugă o metodă comună public navigeazaLa(url: string): void.  
3. **Încapsulare & Polimorfism (Clasele Copil):**  
   * Creează clasa HomePage care extinde BasePage. Încapsulează un selector privat pentru bara de căutare (#search-bar). Implementează metoda obligatorie de validare a încărcării.  
   * Creează clasa ProductPage care extinde BasePage. Încapsulează selectorul pentru butonul de "Adaugă în coș" (.add-to-cart-btn).  
   * **Cerință E2E:** Adaugă o metodă publică în ProductPage numită adaugaInCos(produs: ProdusTest). Funcția trebuie să primească interfața (matrița) definită la pasul 1 și să printeze în consolă numele produsului care este adăugat.

### 5.2 Provocarea Bonus (Nivel Mid-Senior): Interacțiuni cu Generics `<T>`

În BasePage, creează o metodă numită extrageDateDinPagina`<T>`(selector: string, dateSimulate: T): T. Această metodă va simula funcția page.evaluate() din Playwright. Metoda trebuie să accepte un tip Generic `<T>` și să returneze pur și simplu variabila dateSimulate. În instanțierea claselor, apelează această metodă pasându-i interfața Produs ca argument de tip, pentru a demonstra că ai înțeles extragerea tipizată a datelor!

### 5.3 🗝️ Cheile de Rezolvare (Soluții & Explicații)

*Regula de Aur: Nu citi soluția înainte de a te lupta cu propriul cod în TS Playground cel puțin 30 de minute!*

**Soluție Tema pentru Acasă (Structura POM E-Commerce):**

```ts
// --- 1. MATRIȚELE DE DATE ---
interface Produs {
    id: number;
    nume: string;
    pret: number;
    inStoc: boolean;
}

// Folosim Omit pentru a genera un payload curat pentru testele de UI
type ProdusTest = Omit<Produs, 'id'>;


// --- 2. CLASA DE BAZĂ (Abstractizare și Moștenire) ---
abstract class BasePage {
    // Folosim 'any' pentru page doar în acest mediu de testare. 
    // În Playwright, va fi: constructor(protected page: Page) {}
    constructor(protected page: any) {}

    public navigeazaLa(url: string): void {
        console.log(`[Acțiune Comună] Se navighează către: ${url}`);
    }

    // Metodă Generică (Provocarea Bonus)
    public extrageDateDinPagina<T>(selector: string, dateSimulate: T): T {
        console.log(`[Extragere Generic] Caut selectorul ${selector} și returnez structura T...`);
        return dateSimulate;
    }

    // Contract strict pentru toți copiii
    abstract valideazaIncarcarea(): void;
}


// --- 3. CLASELE DE PAGINĂ (Încapsulare și Polimorfism) ---

class HomePage extends BasePage {
    // Selectori securizați
    private selSearchBar = "#search-bar";
    private selSearchBtn = "#btn-search";

    constructor(page: any) {
        super(page); // Inițializăm Părintele
    }

    // Implementarea obligatorie
    public valideazaIncarcarea(): void {
        console.log("[HomePage] Validare: Bara de căutare este vizibilă pe ecran.");
    }

    public cautaProdus(numeProdus: string): void {
        console.log(`[HomePage] Scriu "${numeProdus}" în selectorul ${this.selSearchBar}`);
        console.log(`[HomePage] Dau click pe ${this.selSearchBtn}`);
    }
}


class ProductPage extends BasePage {
    // Selectori securizați
    private selAddToCartBtn = ".add-to-cart-btn";
    private selCartCounter = ".cart-counter";

    constructor(page: any) {
        super(page);
    }

    // Implementarea obligatorie cu logică specifică
    public valideazaIncarcarea(): void {
        console.log("[ProductPage] Validare: Butonul 'Adaugă în coș' este prezent și activ.");
    }

    // Folosim interfața ca un contract strict pentru Datele de Test!
    public adaugaInCos(produs: ProdusTest): void {
        console.log(`[ProductPage] Se adaugă produsul [${produs.nume}] cu prețul de ${produs.pret} lei.`);
        console.log(`[ProductPage] Dau click pe ${this.selAddToCartBtn}`);
    }
}


// --- 4. SIMULARE TEST E2E (Așa va arăta codul în Sesiunea 10) ---
console.log("=== Începe Testul E2E: Adăugare Produs ===");

// 1. Definim datele de test respectând contractul
const testLaptop: ProdusTest = {
    nume: "Laptop QA Pro",
    pret: 4500,
    inStoc: true
};

const mockPlaywrightPage = {}; // Simulare obiect din framework

// 2. Navigare și Căutare
const acasa = new HomePage(mockPlaywrightPage);
acasa.navigeazaLa("https://qa-commerce.ro");
acasa.valideazaIncarcarea();
acasa.cautaProdus(testLaptop.nume);

// 3. Adăugare în coș
const paginaProdus = new ProductPage(mockPlaywrightPage);
paginaProdus.valideazaIncarcarea();
paginaProdus.adaugaInCos(testLaptop);

// 4. Testare Funcție Generică (Bonus)
const produsExtrasDinDOM = paginaProdus.extrageDateDinPagina<Produs>(".product-data", {
    id: 99,
    nume: "Laptop QA Pro",
    pret: 4500,
    inStoc: true
});

console.log("=== Test Finalizat cu Succes ===");

```

🎉 **Felicitări!** Odată ce înțelegi și scrii confortabil acest tip de cod, ești oficial capabil să construiești un Framework de Testare Automatizată de la zero! Cu această temă, am acoperit toate cerințele tehnice pentru a face tranziția către Modulul de Playwright (Modulul 4).

---

## Capitolul 6: Workbook - Arhitectură E2E

::: info 📈 Scopul Workbook-ului
Trecerea de la un scriitor de teste (Scripter) la un Arhitect de Testare (Test Architect). Acest workbook nu mai conține doar "teorie aplicată", ci mini-framework-uri executabile. Vom simula motorul intern al Playwright pentru a vedea cum Tipurile Utilitare, Genericele și cei 4 Piloni OOP interacționează în cel mai complex mod posibil.
:::

🛠️ **Setup:** Deschide [**TypeScript Playground**](https://www.typescriptlang.org/play) (asigură-te că opțiunea strict: true este bifată în TS Config). Copiază fiecare exercițiu integral, apasă **Run** și studiază cu atenție Consola (Logs) pentru a înțelege cum rulează arhitectura ta în spate.

### 📍 Exercițiul 1: Manipularea Datelor Complexe (Omit, Partial, Pick)

**Context E2E:** Ești responsabil de testarea API-ului pentru un magazin de electronice. O resursă completă Produs din baza de date are 6 câmpuri. Când scrii un test pentru **POST** (Creare), nu ai voie să trimiți id și dataAdaugare (le face serverul). Când scrii un test de **PATCH** (Update), vrei să trimiți doar 1 sau 2 câmpuri. Iar pentru o validare sumară în UI, ai nevoie doar de nume și pret. Fără Tipuri Utilitare, ar trebui să scrii 4 interfețe diferite și să le întreții manual.

```ts
// 1. SURSA ADEVĂRULUI (Modelul complet din Baza de Date)
interface ProdusDB {
    id: number;
    nume: string;
    pret: number;
    categorie: string;
    inStoc: boolean;
    dataAdaugare: string;
}

// 2. TIPURI UTILITARE (Generăm contracte din mers, fără duplicare de cod!)
// POST: Tăiem ID-ul și data, restul rămân obligatorii
type CreareProdus = Omit<ProdusDB, 'id' | 'dataAdaugare'>;

// PATCH: Totul devine opțional (putem trimite doar prețul, de exemplu)
type ActualizareProdus = Partial<ProdusDB>;

// PICK: Păstrăm STRICT doar numele și prețul (pentru un test de UI sumar)
type SumarProdus = Pick<ProdusDB, 'nume' | 'pret'>;

// --- SIMULARE FRAMEWORK DE TESTARE API ---
class MockApiTestRunner {
    public testeazaCrearea(payload: CreareProdus): void {
        console.log("[POST] Payload valid primit pentru creare:", payload);
        // Validăm că nu s-a trimis ID-ul din greșeală
        if ('id' in payload) {
            console.error("❌ EROARE FATALĂ: Ai trimis un ID într-un request de POST!");
        } else {
            console.log("✅ SUCCES: Payload-ul de POST este arhitectural corect.");
        }
    }

    public testeazaUpdate(id: number, payload: ActualizareProdus): void {
        console.log(`[PATCH] Actualizăm produsul ${id} cu datele:`, payload);
    }
}

// --- EXECUȚIA TESTELOR ---
console.log("=== EXERCIȚIUL 1: RULARE TESTE API ===");
const apiRunner = new MockApiTestRunner();

// Crearea unui produs (TypeScript validează strict ca 'id' să lipsească)
const laptopNou: CreareProdus = {
    nume: "MacBook Pro M3",
    pret: 12000,
    categorie: "Laptopuri",
    inStoc: true
};
apiRunner.testeazaCrearea(laptopNou);

// Actualizarea (TypeScript validează ca datele trimise să fie o sub-mulțime din ProdusDB)
const updatePret: ActualizareProdus = {
    pret: 11500 // Trimitem doar prețul modificat
};
apiRunner.testeazaUpdate(101, updatePret);
```

### 📍 Exercițiul 2: Încapsularea și Simularea "Playwright Page"

**Context E2E:** Dacă lași selectorii liberi în script (await page.click('.btn')), vei crea un "Spaghetti Code" care crapă la prima schimbare de interfață. Încapsularea forțează ascunderea selectorilor în variabile private și definirea unor constante readonly. Vom construi propriul nostru obiect MockPage pentru a vedea exact cum funcționează Playwright sub capotă.

```ts
// 1. MOCK-UL PLAYWRIGHT (Așa arată interfața Page din culise)
interface PlaywrightPage {
    goto(url: string): Promise<void>;
    fill(selector: string, text: string): Promise<void>;
    click(selector: string): Promise<void>;
}

// 2. CLASA PAGE OBJECT MODEL (Cu încapsulare strictă)
class LoginPage {
    // 🛑 ÎNCAPSULARE: readonly - Nu se poate schimba URL-ul la runtime!
    public readonly url: string = "https://app-test.ro/login";

    // 🛑 ÎNCAPSULARE: private - Doar metodele din această clasă pot folosi acești selectori!
    private selUser = "input[data-testid='username']";
    private selPass = "input[data-testid='password']";
    private selBtnSubmit = "button[data-testid='login-submit']";

    constructor(private page: PlaywrightPage) {}

    // UȘA PUBLICĂ: Testul doar apelează această metodă de business
    public async executaAutentificarea(user: string, pass: string): Promise<void> {
        console.log(`[POM] Inițiez secvența de autentificare pentru ${user}...`);
        
        await this.page.goto(this.url);
        await this.page.fill(this.selUser, user);
        
        // Ascundem parola în log-urile de test
        console.log(`[Playwright] Fill pe [${this.selPass}] cu valoarea: [*** ASCUNS ***]`);
        
        await this.page.click(this.selBtnSubmit);
        console.log(`[POM] Secvența de autentificare a fost trimisă.`);
    }
}

// --- EXECUȚIA TESTELOR ---
console.log("\n=== EXERCIȚIUL 2: ÎNCAPSULARE ===");

// Creăm o instanță falsă de Playwright Page care loghează acțiunile în consolă
const simulatorPlaywright: PlaywrightPage = {
    goto: async (url) => console.log(`[Playwright] Navigare la: ${url}`),
    fill: async (sel, txt) => console.log(`[Playwright] Fill pe [${sel}] cu valoarea: [${txt}]`),
    click: async (sel) => console.log(`[Playwright] Click pe selectorul: [${sel}]`)
};

const paginaDeLogin = new LoginPage(simulatorPlaywright);

// ❌ Dacă decomentezi liniile de mai jos, TS dă eroare roșie:
// paginaDeLogin.url = "https://hacked.com"; // "Cannot assign to 'url' because it is a read-only property."
// paginaDeLogin.selUser = ".new-class"; // "Property 'selUser' is private."

// Rulăm testul curat
paginaDeLogin.executaAutentificarea("qa_ninja", "Parola123!");
```

### 📍 Exercițiul 3: Principiul DRY (Moștenire) în Arhitectura POM

**Context E2E:** Ai 30 de pagini în aplicația ta. Pe toate paginile ai un meniu superior (Navbar) cu un buton de Logout, o funcție comună de așteptare și o funcție de acceptare Cookies. În loc să scrii funcția acceptaCookies() de 30 de ori (încălcând regula *Don't Repeat Yourself*), o scriem o singură dată într-o clasă Părinte.

```ts
// 1. CLASA PĂRINTE (Conține elementele și metodele globale)
class BasePage {
    constructor(protected numePagina: string) {}

    public logheazaActiune(actiune: string): void {
        console.log(`[${this.numePagina}] ${actiune}`);
    }

    public acceptaCookies(): void {
        this.logheazaActiune("Dau click pe butonul '#accept-all-cookies'");
    }

    public navigheazaAcasa(): void {
        this.logheazaActiune("Dau click pe logo-ul din Navbar pentru redirecționare.");
    }
}

// 2. CLASA COPIL 1 (Extinde BasePage)
class DashboardPage extends BasePage {
    constructor() {
        super("Dashboard"); // Apelăm constructorul Părintelui
    }

    public verificaGrafic(): void {
        this.logheazaActiune("Verific vizibilitatea selectorului '.main-chart'");
    }
}

// 3. CLASA COPIL 2 (Extinde BasePage)
class SetariPage extends BasePage {
    constructor() {
        super("Setări Profil");
    }

    public schimbaTemaDark(): void {
        this.logheazaActiune("Dau click pe selectorul '.dark-mode-toggle'");
    }
}

// --- EXECUȚIA TESTELOR ---
console.log("\n=== EXERCIȚIUL 3: MOȘTENIRE (DRY) ===");

const dashPage = new DashboardPage();
// Metodă PĂRINTE folosită gratuit de COPIL
dashPage.acceptaCookies(); 
// Metodă proprie
dashPage.verificaGrafic();

console.log("-------------------");

const settingsPage = new SetariPage();
// Același cod părinte, dar rulează în contextul noului copil!
settingsPage.acceptaCookies(); 
settingsPage.schimbaTemaDark();
settingsPage.navigheazaAcasa();
```

### 📍 Exercițiul 4: Supraviețuirea la Flaky Tests (Polimorfismul)

**Context E2E:** Testul tău trebuie să aștepte încărcarea completă a paginii. Metoda standard (moștenită de la BasePage) este să aștepte liniștirea rețelei (networkidle). Dar pagina ta de Checkout este o excepție: ea așteaptă confirmarea unei plăți de la o bancă externă, care se comportă haotic. Polimorfismul ne permite să suprascriem inteligent metoda Părintelui exclusiv pentru această pagină.

```ts
class PaginăStandard {
    public asteaptaIncarcare(): void {
        console.log("Aștept 1 secundă: 'networkidle' (Niciun request de rețea în desfășurare).");
    }
}

// POLIMORFISM: CheckoutPage păstrează "forma" (numele metodei), dar schimbă "fondul" (logica)
class CheckoutLentPage extends PaginăStandard {
    
    // Suprascriem metoda părintelui!
    public asteaptaIncarcare(): void {
        console.log("⚠️ Așteptare POLIMORFICĂ (Suprascrisă): Pagina asta e critică.");
        console.log("Aștept 15 secunde! Verific specific răspunsul HTTP 200 de la '/api/stripe/confirmare'...");
    }

    public plateste(): void {
        console.log("Dau click pe 'Confirmă Plata'.");
    }
}

// --- EXECUȚIA TESTELOR ---
console.log("\n=== EXERCIȚIUL 4: POLIMORFISM ===");

const paginaNormala = new PaginăStandard();
console.log("-> Test pe pagină normală:");
paginaNormala.asteaptaIncarcare(); // Rulează logica Părintelui

console.log("\n-> Test pe pagină Checkout:");
const paginaDePlata = new CheckoutLentPage();
paginaDePlata.asteaptaIncarcare(); // Rulează logica Suprascrisă de Copil, izolând testul de erori Flaky!
paginaDePlata.plateste();
```

### 📍 Exercițiul 5: Directorul Tehnic (Abstractizarea)

**Context E2E:** Ești arhitectul echipei de testare. Ai observat că Juniorii adaugă constant Page Object-uri noi, dar "uită" să implementeze asertările de vizibilitate (verificăDacăPaginaSDeschis), cauzând teste false-pozitive care trec deși pagina a crăpat! Rezolvi asta transformând BasePage într-o **clasă abstractă**, forțând un contract de neîncălcat.

```ts
// CLASA ABSTRACTĂ: Nu o poți instanția cu 'new'. Există doar pentru a impune reguli!
abstract class PaginaObligatorie {
    public urlCurent: string;

    constructor(url: string) {
        this.urlCurent = url;
    }

    // Metodă implementată (comună)
    public afiseazaTitlu(): void {
        console.log(`Pagină inițializată pe: ${this.urlCurent}`);
    }

    // 🛑 METODĂ ABSTRACTĂ: Fără acolade, fără logică! OBLIGĂ copilul să o scrie.
    abstract asertarePaginaIncarcata(): boolean;
}

// Dacă un Junior scrie clasa de mai jos și uită să pună `asertarePaginaIncarcata`, 
// compilatorul îi va bloca tot fișierul instant cu roșu!
class RapoartePage extends PaginaObligatorie {
    constructor() {
        super("/rapoarte");
    }

    // Respectarea contractului forțat:
    public asertarePaginaIncarcata(): boolean {
        console.log("[Asertare Forțată] Validez că '.tabel-rapoarte' este vizibil pe ecran.");
        return true;
    }
}

// --- EXECUȚIA TESTELOR ---
console.log("\n=== EXERCIȚIUL 5: ABSTRACTIZARE ===");

const rapoarte = new RapoartePage();
rapoarte.afiseazaTitlu();
const eVizibil = rapoarte.asertarePaginaIncarcata();
console.log(`Pagina de rapoarte a trecut asertarea de siguranță? ${eVizibil}`);
```

### 📍 Exercițiul 6: Funcții "Imprimantă 3D" (Generics `<T>`)

**Context E2E:** Ai 50 de apeluri diferite de API în framework-ul tău (fetchUsers, fetchOrders, fetchInvoices). Pentru a scăpa de duplicare și a evita folosirea tipului any (care ucide autocompletarea), folosești Generice (`<T>`). Vei construi un Helper E2E care se adaptează ca un cameleon oricărui tip de date pe care i-l pasezi.

```ts
// Interfețele noastre
interface AngajatQA { id: string; nivel: "Junior" | "Senior"; tehnologie: string; }
interface ProdusSUT { sku: string; pret: number; }

// Clasa Helper folosind Generics
class PlaywrightApiHelper {
    
    // <T> indică faptul că metoda este GENERICĂ. Nu știe dinainte ce returnează.
    // Va afla abia în momentul în care testerul scrie codul E2E!
    public async extrageDate<T>(url: string, mockResponse: T): Promise<T> {
        console.log(`[API Helper] Interceptez GET către ${url}...`);
        console.log(`[API Helper] Forțez tipizarea și returnez datele ca tipul <T>.`);
        // Simulăm promisiunea rezolvată a unui răspuns HTTP JSON
        return Promise.resolve(mockResponse); 
    }
}

// --- EXECUȚIA TESTELOR ---
console.log("\n=== EXERCIȚIUL 6: GENERICE (<T>) ===");
const api = new PlaywrightApiHelper();

const demoGenerice = async () => {
    // Cerem un AngajatQA. Observă cum punem <AngajatQA> la apelare!
    const qa = await api.extrageDate<AngajatQA>("/api/echipa/1", {
        id: "QA-01",
        nivel: "Senior",
        tehnologie: "Playwright & TypeScript"
    });
    // VS Code știe 100% sigur că `qa` are proprietatea `.nivel`!
    console.log(`Date extrase cu succes: Aducem un QA ${qa.nivel} specializat în ${qa.tehnologie}`);

    // Refolosim EXACT ACEEAȘI METODĂ, dar cerem un ProdusSUT!
    const telefon = await api.extrageDate<ProdusSUT>("/api/produse/iphone", {
        sku: "IPH-15",
        pret: 5000
    });
    console.log(`Date extrase cu succes: Produsul cu SKU ${telefon.sku} costă ${telefon.pret} RON.`);
};

demoGenerice();
```

### 📍 Exercițiul 7: Marea Finală E2E - Framework-ul Asamblat

**Context E2E:** E timpul să asamblăm robotul. Vom lua o clasă abstractă (Pilonul 4), o vom moșteni (Pilonul 2), îi vom încapsula selectorii (Pilonul 1), vom suprascrie logica (Pilonul 3), vom extrage un profil din baza de date prin API (Generics) și vom manipula payload-ul cu un Type Utility (Omit).

```ts
// 1. Tipuri și Date
interface ProfilBaza { idDB: number; numeUser: string; varsta: number; }
// Tăiem ID-ul pentru a verifica doar UI-ul
type SumarUI = Omit<ProfilBaza, 'idDB'>;

// 2. Abstractizarea (Core-ul)
abstract class CorePage {
    constructor(protected nume: string) {}
    abstract asteaptaIncarcareElementeE2E(): void;
}

// 3. POM-ul Aplicației (Încapsulare + Moștenire + Polimorfism)
class UserProfilePage extends CorePage {
    private inpNume = "input#user-name";
    private inpVarsta = "input#user-age";

    constructor() { super("Pagină Profil"); }

    public asteaptaIncarcareElementeE2E(): void {
        console.log(`[POM] Verific asertările vitale pentru ${this.nume}...`);
        console.log(`[POM] Aștept selectorii privați: ${this.inpNume} și ${this.inpVarsta}`);
    }

    public verificaDateInDOM(dateVizuale: SumarUI): void {
        console.log(`[Asertare UI] Verific dacă numele de pe ecran este "${dateVizuale.numeUser}"`);
        console.log(`[Asertare UI] Verific dacă vârsta de pe ecran este "${dateVizuale.varsta}"`);
    }
}

// 4. API Generic Helper
const aduProfilDeLaBackend = <T>(mockData: T): T => {
    console.log("[Rețea] Descarc profilul original din DB (Backend)...");
    return mockData;
};

// --- EXECUȚIA INTEGRATĂ A TESTULUI E2E ---
console.log("\n========== EXERCIȚIUL 7: E2E FRAMEWORK INTEGRATION ==========");
const ruleazaScenariulSuprem = () => {
    // A. Extragem "Sursa Adevărului" din Baza de Date via API (Folosim Generics)
    const profilDB = aduProfilDeLaBackend<ProfilBaza>({
        idDB: 777123,
        numeUser: "Ninja.Automation",
        varsta: 30
    });

    // B. Transformăm datele din DB într-un payload pentru UI (Folosim Utility Types)
    const dateDeVerificatVizual: SumarUI = {
        numeUser: profilDB.numeUser,
        varsta: profilDB.varsta
    };

    // C. Interacționăm cu Aplicația Grafică (Folosim OOP și POM)
    const paginaProfil = new UserProfilePage();
    paginaProfil.asteaptaIncarcareElementeE2E();
    
    // D. Asertăm Că UI-ul se potrivește cu DB-ul (Testare Hibridă supremă)
    paginaProfil.verificaDateInDOM(dateDeVerificatVizual);
    
    console.log("================= E2E TEST PASSED ✅ =================");
};

ruleazaScenariulSuprem();
```

🎉 **Acest Workbook reprezintă Vârful Arhitecturii TypeScript în QA!** Analizează cu atenție consola după executarea întregului cod. Fiecare concept teoretic a fost demonstrat și "prins" într-o plasa de siguranță, demonstrând de ce framework-urile de testare moderne (Playwright/Cypress) refuză compromisurile JavaScript-ului clasic. Ești pregătit 100% pentru Sesiunea 9!

