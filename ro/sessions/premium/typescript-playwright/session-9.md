# Sesiunea 9: Setup și Arhitectură Playwright

<div style="display: flex; gap: 12px; flex-wrap: wrap; margin: 1.5rem 0 0.5rem 0;">
  <a href="/pdfs/sessions/premium/typescript-playwright/session-9.pdf" class="download-btn" target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24"><path d="M5 20h14v-2H5v2zm0-10h4V4h6v6h4l-7 7-7-7z"/></svg>Vizualizează suportul de curs (PDF)</a>
</div>

---

## Capitolul 1: Peisajul Automatizării Web – Playwright vs. Selenium vs. Cypress

### Obiective de învățare

::: info 🎯 Obiective de învățare
La finalul acestui capitol, vei fi capabil să:
- Explici de ce, după 8 sesiuni în care am construit și tipizat aplicația Task Tracker, trecem acum la un instrument dedicat de automatizare.
- Povestești pe scurt istoria automatizării web: de la Selenium (2004) la Cypress (2017) și Playwright (2020).
- Descrii, la nivel de arhitectură, cum vorbește fiecare unealtă cu browserul și de ce acest detaliu decide viteza și stabilitatea testelor.
- Compari cele trei unelte pe criterii obiective (limbaje, browsere, paralelizare, auto-waiting, multi-tab, debugging).
- Argumentezi, ca un inginer, alegerea Playwright + TypeScript pentru un proiect nou.
:::

### 1.1 Podul dintre Modulul 3 și Modulul 4

În Sesiunile 1–6 am purtat „pălăria” de **Front-End Developer**: am construit aplicația Task Tracker cu HTML, CSS și JavaScript și am pus pe fiecare element important un atribut `data-testid`. În Sesiunile 7–8 am trecut la TypeScript: am tipizat modelele (`TaskItem`, `TaskStatus`) și am desenat, cu interfețe „mock”, scheletul unui **Page Object Model** (`BasePage`, `TaskTrackerPage`).

Problema? Interfețele `Page` și `Locator` din Sesiunea 8 erau **simulate**. Nu exista niciun robot care să deschidă un browser real. Din această sesiune, mock-urile dispar: instalăm motorul real, **Playwright**, și îi dăm cheile aplicației noastre.

::: tip 🔗
Firul roșu al cursului S6 → am livrat SUT-ul (System Under Test) cu `data-testid`. S7 → am migrat logica la TypeScript strict (Zero Any Policy). S8 → am învățat OOP și contractele POM, simulând `Page` și `Locator`. S9 (azi) → instalăm Playwright, configurăm `playwright.config.ts`, învățăm CLI-ul și generăm primul test cu Codegen. S10 → scriem manual primul test E2E complet (`goto`, `fill`, `click`, `check`, `select`).
:::

#### 🗺️ Harta SUT-ului: Task Tracker (Sesiunea 6)

Toate exemplele E2E din acest material rulează pe aplicația Task Tracker din Sesiunea 6, publicată pentru curs la adresa `https://tasktracker.qualiadept.eu`. Nu trebuie să pornești nimic pe calculatorul tău: deschizi adresa în browser sau o setezi ca `baseURL` în `playwright.config.ts`.

::: info 🌐
O singură aplicație, câte o copie pentru fiecare cursant Task-urile pe care le adaugi sau le ștergi există doar în browserul tău: API-ul public jsonplaceholder răspunde la cereri, dar nu salvează datele. De aceea toți cursanții pot rula teste în paralel pe aceeași adresă fără să se încurce. La fiecare reîncărcare a paginii pornești din nou de la cele 5 task-uri inițiale. Până la Capitolul 3, unde configurăm totul în detaliu, adaugă în `playwright.config.ts` generat de wizard linia `baseURL: 'https://tasktracker.qualiadept.eu'` în blocul `use`, ca exemplele cu `page.goto('/')` să deschidă aplicația. Vrei să testezi aplicația ta din Sesiunea 6? Rulezi testele cu `BASE_URL=http://localhost:3000` și pornești aplicația local (Capitolul 3.6 și exercițiul L5 din laborator).
:::

Iată ce „vede” robotul:

| Element / comportament | Detalii din Sesiunea 6 |
| ----- | ----- |
| Titlul paginii | `QA Task Tracker Pro` |
| Logo (`h1#logo`) și statusul rețelei | `QA Task Tracker` și `API Online` (`#network-status`) |
| `input-task-name` | Câmpul de text al formularului `#add-task-form` |
| `submit-task-btn` | Butonul **Salvează**: `disabled` la pornire, activ după prima literă, apoi din nou `disabled` după salvare |
| `error-message` | „Numele task-ului nu poate fi gol!” – apare când golești câmpul |
| `loading-spinner` | Vizibil până sosesc cele 5 task-uri inițiale (GET la jsonplaceholder) |
| `task-list` | Lista `<ul>`; fiecare rând este un `li.task-item` cu un `span.task-title` |
| `delete-btn-${id}` | Butonul **Șterge** al fiecărui rând (ex: `delete-btn-1`) |
| `close-promo-btn` | Închide pop-up-ul **Chaos**, care apare mereu, la 2–6 secunde după încărcare |

::: warning ⚠️
Pop-up-ul Chaos și exemplele din curs Pop-up-ul din Sesiunea 6 acoperă pagina și poate intercepta click-urile. Pentru exemplele din acest material, pune blocul de mai jos la începutul fiecărui fișier `.spec.ts`. Îl explicăm în detaliu în Capitolul 5.5. Ca să nu repetăm codul, exemplele următoare nu îl mai afișează.

**📋 Cod 1.01 · 📄 Bloc comun pentru fiecare fișier de test**

```ts
test.beforeEach(async ({ page }) => {
    await page.addLocatorHandler(page.getByTestId('close-promo-btn'), async (btn) => {
        await btn.click();
    });
});
```
:::

#### 🧪 Exemplu E2E 1.1 – De la Page-ul simulat (S8) la Page-ul real

În Sesiunea 8 am scris noi interfața `Page`. Acum o importăm din Playwright, iar funcția noastră tipizată primește un browser adevărat:

**📋 Cod 1.02** · `📄 tests/01-primul-contact.spec.ts`

```ts
import { test, expect, type Page } from '@playwright/test';

// În S8, Page era un mock. Acum este tipul REAL din Playwright.
const verificaAplicatiaPornita = async (page: Page): Promise<void> => {
  await expect(page).toHaveTitle('QA Task Tracker Pro');

  await expect(page.getByTestId('task-list')).toBeVisible();
};

test('Task Tracker se deschide într-un browser real', async ({ page }) => {
    await page.goto('/');

    await verificaAplicatiaPornita(page);
});
```

::: tip ✍️ Exercițiu de fixare 1.1
Adaugă în același fișier funcția `verificaFormularul = async (page: Page): Promise<void>`, care verifică faptul că `input-task-name` este vizibil și că `submit-task-btn` este dezactivat la pornire. Apeleaz-o într-un al doilea test. În VS Code, ține apăsat Ctrl și dă click pe tipul `Page`. Compară definiția reală cu interfața-mock din Sesiunea 8 și notează 3 metode care există în Playwright, dar nu existau în mock-ul nostru.
:::

**🗝️ Rezolvare 1.1**   *(încearcă singur înainte să citești)*

**📋 Cod 1.03** · `📄 tests/01-primul-contact.spec.ts (versiunea completă)`

```ts
import { test, expect, type Page } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.addLocatorHandler(page.getByTestId('close-promo-btn'), async (btn) => {
        await btn.click();
    });
});

const verificaAplicatiaPornita = async (page: Page): Promise<void> => {
  await expect(page).toHaveTitle('QA Task Tracker Pro');

  await expect(page.getByTestId('task-list')).toBeVisible();
};

const verificaFormularul = async (page: Page): Promise<void> => {
  await expect(page.getByTestId('input-task-name')).toBeVisible();

  await expect(page.getByTestId('submit-task-btn')).toBeDisabled();
};

test('Task Tracker se deschide într-un browser real', async ({ page }) => {
    await page.goto('/');

    await verificaAplicatiaPornita(page);
});

test('formularul pornește în starea corectă', async ({ page }) => {
    await page.goto('/');

    await verificaFormularul(page);
});
```

Metode care există doar în `Page`-ul real (oricare trei sunt corecte): `getByTestId()`, `getByRole()`, `reload()`, `screenshot()`, `waitForURL()`, `title()`, `addLocatorHandler()`, `evaluate()`.

### 1.2 Scurtă istorie a automatizării web

#### 2004 – Selenium: pionierul

Totul a început la **ThoughtWorks**, în 2004, când inginerul **Jason Huggins** s-a săturat să testeze manual, iar și iar, o aplicație internă de pontaj. A scris o bibliotecă JavaScript care „apăsa” singură butoanele din pagină: **JavaScriptTestRunner**, redenumită ulterior **Selenium Core**. Problema majoră: codul rula în interiorul paginii și se lovea de regulile de securitate ale browserului (Same-Origin Policy).

În paralel, **Simon Stewart** (tot de la ThoughtWorks, apoi Google) a construit **WebDriver**, un proiect care controla browserul **din exterior**, prin API-uri native. În 2011, cele două proiecte au fuzionat în **Selenium 2 (Selenium WebDriver)**, iar în 2018 protocolul a devenit **standard oficial W3C**. Selenium 4 (2021) a adoptat complet acest standard.

#### 2017 – Cypress și Puppeteer: revoluția JavaScript

Pe măsură ce aplicațiile au devenit „Single Page Applications” (React, Angular, Vue), testele Selenium au devenit lente și instabile („flaky”). Doi jucători noi au apărut aproape simultan:

* **Cypress** (Brian Mann, Cypress.io) – a luat o decizie radicală: testul rulează **în interiorul browserului**, în același „run-loop” cu aplicația. Rezultat: o experiență de debugging spectaculoasă (time-travel), dar și limite arhitecturale (un singur tab, limitări cross-origin, doar JavaScript/TypeScript).

* **Puppeteer** (echipa Chrome DevTools de la Google) – o bibliotecă Node.js care controla Chrome direct prin **Chrome DevTools Protocol (CDP)**, rapid și precis, dar doar pentru Chromium și fără un test runner propriu.

#### 2020 – Playwright: „Puppeteer, dar pentru toate browserele”

Inginerii care creaseră Puppeteer la Google s-au mutat la **Microsoft** și au pornit de la o întrebare simplă: *„Ce-ar fi dacă am păstra viteza lui Puppeteer, dar am suporta toate motoarele de browser și am construi un test runner gândit special pentru E2E?”* Așa s-a născut **Playwright** (prima versiune publică în ianuarie 2020, v1.0 în mai 2020). În 2021 a apărut **@playwright/test**, runner-ul oficial, împreună cu **Trace Viewer**, iar în 2023 **UI Mode**. Ritmul de lansare este de aproximativ o versiune minoră pe lună.

![Figura 1.1 – Evoluția uneltelor de automatizare web, 2004–2026](/images/sessions/premium/session-9/image1.png)

*Figura 1.1 – Evoluția uneltelor de automatizare web, 2004–2026*

#### 🧪 Exemplu E2E 1.2 – Același scenariu în trei epoci

Scenariul: utilizatorul adaugă un task și îl vede în listă. Iată cum arată în fiecare generație de unelte:

**📋 Cod 1.04** · `📄 Selenium WebDriver (JavaScript)`

```js
const { Builder, By, until } = require('selenium-webdriver');

const driver = await new Builder().forBrowser('chrome').build();
await driver.get('https://tasktracker.qualiadept.eu');
  const input = await driver.wait(
    until.elementLocated(By.css("[data-testid='input-task-name']")), 10000);
  await input.sendKeys('Task istoric');
  const btn = await driver.findElement(By.css("[data-testid='submit-task-btn']"));
  await driver.wait(until.elementIsEnabled(btn), 10000);   // așteptare manuală
  await btn.click();
  const lista = await driver.findElement(By.css("[data-testid='task-list']"));
  await driver.wait(until.elementTextContains(lista, 'Task istoric'), 10000);
  await driver.quit();
```

**📋 Cod 1.05** · `📄 Cypress`

```js
it('adaugă un task', () => {
    cy.visit('https://tasktracker.qualiadept.eu');

      cy.get("[data-testid='input-task-name']").type('Task istoric');

      cy.get("[data-testid='submit-task-btn']").click();

      cy.get("[data-testid='task-list']").should('contain', 'Task istoric');
  });
```

**📋 Cod 1.06** · `📄 Playwright Test`

```ts
test('adaugă un task', async ({ page }) => {
    await page.goto('/');

    await page.getByTestId('input-task-name').fill('Task istoric');

    await page.getByTestId('submit-task-btn').click();

    await expect(page.getByTestId('task-list')).toContainText('Task istoric');
});
```

::: tip ✍️ Exercițiu de fixare 1.2
Adaugă în toate cele trei variante un pas nou: înainte de a scrie textul, verifică faptul că butonul Salvează este dezactivat. Numără în varianta Selenium câte linii există doar pentru a aștepta (sincronizare). Câte astfel de linii are varianta Playwright? Explică într-o frază de unde vine diferența.
:::

**🗝️ Rezolvare 1.2**   *(încearcă singur înainte să citești)*

**📋 Cod 1.07** · `📄 Pasul nou în cele trei unelte`

```ts
// Selenium
const btnInitial = await driver.findElement(By.css("[data-testid='submit-task-btn']"));
if (await btnInitial.isEnabled()) throw new Error('Butonul trebuia să fie dezactivat');
// Cypress
cy.get("[data-testid='submit-task-btn']").should('be.disabled');
// Playwright
await expect(page.getByTestId('submit-task-btn')).toBeDisabled();
```

Selenium are 3 linii de sincronizare (`elementLocated`, `elementIsEnabled`, `elementTextContains`), iar Playwright are 0. Diferența vine din auto-waiting și din asertările web-first, care reîncearcă automat.

### 1.3 Arhitectura sub capotă: cine vorbește cu browserul și cum?

Aceasta este cea mai importantă secțiune teoretică a sesiunii. Diferențele de viteză și stabilitate dintre unelte nu vin din „magie”, ci din **canalul de comunicare** dintre test și browser.

![Figura 1.2 – Cele trei modele arhitecturale: WebDriver (HTTP), In-Browser (Cypress) și WebSocket + protocoale native (Playwright)](/images/sessions/premium/session-9/image2.png)

*Figura 1.2 – Cele trei modele arhitecturale: WebDriver (HTTP), In-Browser (Cypress) și WebSocket + protocoale native (Playwright)*

#### Selenium WebDriver – „Scrisoarea recomandată”

Fiecare comandă din test (`click`, `sendKeys`, `findElement`) devine o **cerere HTTP separată** (format JSON) trimisă unui program intermediar numit **driver** (`chromedriver`, `geckodriver`, `msedgedriver`). Driverul traduce comanda pentru browser și trimite înapoi un răspuns. Un test cu 200 de pași înseamnă sute de dus-întors HTTP. În plus, Selenium nu „știe” nativ dacă un element este gata de interacțiune: inginerul trebuie să scrie manual `WebDriverWait` / `ExpectedConditions`.

#### Cypress – „Spionul din interior”

Testul este injectat într-un `iframe` în același tab cu aplicația, iar un server Node.js face pe proxy-ul. Avantaj: acces direct la DOM, la rețea și la starea aplicației, fără latență de rețea. Dezavantaj: fiind „prizonier” în tab, Cypress nu poate controla nativ mai multe tab-uri sau ferestre, iar comenzile sale au un model propriu (lanțuri `cy.get().click()`, nu `async/await` clasic).

#### Playwright – „Linia telefonică deschisă permanent”

Test runner-ul (Node.js) deschide **o singură conexiune WebSocket persistentă** către serverul Playwright, care vorbește cu browserele prin protocoalele lor native (CDP pentru Chromium; protocoale dedicate pentru builduri special pregătite de Firefox și WebKit). Comenzile și evenimentele circulă în ambele direcții, în timp real. De aici vin trei superputeri:

* **Auto-waiting**: înainte de fiecare acțiune, Playwright verifică singur dacă elementul este atașat în DOM, vizibil, stabil (nu se animă), activat (`enabled`) și că primește evenimentele (nu e acoperit de un pop-up).

* **Browser Contexts**: un context este ca un profil „incognito” separat, creat în câteva milisecunde. Fiecare test primește contextul lui curat – zero cookies sau localStorage moștenite.

* **Cross-browser real**: același test rulează pe Chromium, Firefox și WebKit (motorul lui Safari), pe Windows, macOS și Linux.

![Figura 1.3 – Izolarea testelor: Browser → BrowserContext → Page](/images/sessions/premium/session-9/image3.png)

*Figura 1.3 – Izolarea testelor: Browser → BrowserContext → Page*

#### 🧪 Exemplu E2E 1.3 A – Auto-waiting în acțiune

Lista vine de pe rețea, iar butonul își schimbă starea în funcție de input. Testul nu conține nicio pauză fixă:

**📋 Cod 1.08** · `📄 tests/01-auto-waiting.spec.ts`

```ts
import { test, expect } from '@playwright/test';

test('Playwright așteaptă singur datele și butonul', async ({ page }) => {
    await page.goto('/');

    // GET-ul durează: expect reîncearcă până dispare spinner-ul și apar 5 rânduri

    await expect(page.getByTestId('loading-spinner')).toBeHidden();

    await expect(page.getByTestId('task-list').locator('.task-item')).toHaveCount(5);

    // Butonul este disabled până scriem ceva

    await expect(page.getByTestId('submit-task-btn')).toBeDisabled();

    await page.getByTestId('input-task-name').fill('Auto-waiting');

    await expect(page.getByTestId('submit-task-btn')).toBeEnabled();
});
```

#### 🧪 Exemplu E2E 1.3 B – Izolarea prin Browser Context

**📋 Cod 1.09** · `📄 tests/01-izolare-contexte.spec.ts`

```ts
import { test, expect } from '@playwright/test';

test('două contexte nu își împart starea', async ({ browser, baseURL }) => {
    const contextA = await browser.newContext({ baseURL });

    const contextB = await browser.newContext({ baseURL });

    const pageA = await contextA.newPage();

    const pageB = await contextB.newPage();

    await pageA.goto('/');

    await pageA.evaluate(() => localStorage.setItem('utilizator', 'Ana'));

    await pageB.goto('/');

    const valoareA = await pageA.evaluate(() => localStorage.getItem('utilizator'));

    const valoareB = await pageB.evaluate(() => localStorage.getItem('utilizator'));

    expect(valoareA).toBe('Ana');

    expect(valoareB).toBeNull();      // contextul B este un „profil incognito” separat

    await contextA.close();

    await contextB.close();
});
```

#### 🧪 Exemplu E2E 1.3 C – Același test, trei motoare de browser

**📋 Cod 1.10** · `📄 tests/01-cross-browser.spec.ts`

```ts
import { test, expect } from '@playwright/test';

test('Task Tracker funcționează pe orice motor', async ({ page, browserName }) => {
    console.log(`Rulez pe motorul: ${browserName}`);   // chromium / firefox / webkit

    await page.goto('/');

    await expect(page.getByTestId('task-list').locator('.task-item')).toHaveCount(5);
});
```

::: tip ✍️ Exercițiu de fixare 1.3
A. În exemplul 1.3 A, înlocuiește prima asertare cu `expect(await page.getByTestId('loading-spinner').isVisible()).toBe(false);`. Rulează testul de 10 ori (`--repeat-each=10`). Ce se întâmplă și de ce? B. În exemplul 1.3 B, adaugă în contextul A un cookie numit `tema` cu valoarea `dark` și demonstrează cu o asertare că, în contextul B, lista de cookies este goală. C. Rulează exemplul 1.3 C și notează în ce ordine apar mesajele din consolă. Este ordinea mereu aceeași? Ce îți spune asta despre paralelizare?
:::

**🗝️ Rezolvare 1.3**   *(încearcă singur înainte să citești)*

* **A.** `isVisible()` răspunde instantaneu, fără să aștepte. Dacă GET-ul nu s-a terminat încă, spinner-ul este vizibil și testul pică. Vei vedea rulări verzi și roșii amestecate, adică un test flaky. Asertarea web-first `toBeHidden()` reîncearcă până la 5 secunde și elimină problema.

* **B.** Testul complet:

**📋 Cod 1.11** · `📄 tests/01-izolare-cookies.spec.ts`

```ts
import { test, expect } from '@playwright/test';

test('un cookie din contextul A nu ajunge în contextul B', async ({ browser, baseURL }) => {
    const contextA = await browser.newContext({ baseURL });

    const contextB = await browser.newContext({ baseURL });

    await contextA.addCookies([{ name: 'tema', value: 'dark', url: 'https://tasktracker.qualiadept.eu' }]);

          expect(await contextA.cookies()).toHaveLength(1);

          expect(await contextB.cookies()).toHaveLength(0);   // izolare completă

          await contextA.close();

          await contextB.close();
      });
```

* **C.** Ordinea diferă de la o rulare la alta, pentru că testele rulează în paralel, în procese (workers) diferite. Concluzia: fiecare test trebuie să fie independent și să nu se bazeze pe ordinea de execuție.

### 1.4 Comparația directă

| Criteriu | Selenium | Cypress | Playwright |
| ----- | ----- | ----- | ----- |
| Anul apariției / autor | 2004 · ThoughtWorks (azi comunitate open-source) | 2017 · Cypress.io | 2020 · Microsoft |
| Limbaje | Java, Python, C\#, Ruby, JavaScript și altele | JavaScript / TypeScript | TypeScript / JavaScript, Python, Java, .NET |
| Browsere | Chrome, Firefox, Edge, Safari (browserele reale instalate) | Familia Chrome, Edge, Firefox; WebKit experimental | Chromium, Firefox, WebKit (+ Chrome / Edge de marcă) |
| Comunicare | HTTP (W3C WebDriver) prin driver | Rulează în browser, lângă aplicație | WebSocket persistent + CDP / protocoale native |
| Auto-waiting | Nu nativ (waits explicite) | Da (retry pe comenzi) | Da (actionability checks) + web-first assertions |
| Multi-tab / ferestre / iFrames | Da (cu switchTo) | Limitat (un singur tab) | Da, nativ |
| Paralelizare | Prin Selenium Grid / framework | Plătită / prin servicii externe | Nativă, gratuită (`workers`, `fullyParallel`, `shard`) |
| Test runner inclus | Nu (JUnit, TestNG, pytest etc.) | Da | Da (`@playwright/test`) |
| Debugging | Logs, screenshots manuale | Time-travel în Test Runner | Trace Viewer, UI Mode, Inspector, Codegen |
| Mobile | Nativ prin Appium | Doar viewport | Emulare dispozitive (viewport, touch, user agent) |

#### ❌ Așa NU (Selenium fără așteptări explicite)

**📋 Cod 1.12** · `📄 LoginTest.java (Selenium)`

```java
driver.get("https://tasktracker.qualiadept.eu");
  driver.findElement(By.id("task-name")).sendKeys("Test");
  // Butonul este încă disabled sau acoperit de spinner? Selenium nu știe!
  driver.findElement(By.cssSelector("[data-testid='submit-task-btn']")).click();
  // -> ElementClickInterceptedException / test flaky
```

#### ✅ Așa DA (Playwright cu auto-waiting)

**📋 Cod 1.13** · `📄 task-tracker.spec.ts (Playwright)`

```ts
await page.goto('https://tasktracker.qualiadept.eu');
  await page.getByTestId('input-task-name').fill('Test');
  // Playwright așteaptă AUTOMAT ca butonul să fie vizibil, stabil și enabled
  await page.getByTestId('submit-task-btn').click();
```

#### 🧪 Exemplu E2E 1.4 – Multi-tab nativ (imposibil în Cypress)

Două tab-uri deschise în **același** context partajează starea, exact ca într-un browser real:

**📋 Cod 1.14** · `📄 tests/01-multi-tab.spec.ts`

```ts
import { test, expect } from '@playwright/test';

test('două tab-uri din același context partajează localStorage', async ({ context }) => {
    const tab1 = await context.newPage();

    const tab2 = await context.newPage();

    await tab1.goto('/');

    await tab2.goto('/');

    await tab1.evaluate(() => localStorage.setItem('tema', 'dark'));

    await tab2.reload();

    expect(await tab2.evaluate(() => localStorage.getItem('tema'))).toBe('dark');
});
```

Compară cu exemplul 1.3 B: contexte diferite înseamnă izolare, iar același context înseamnă stare comună.

::: tip ✍️ Exercițiu de fixare 1.4
Rescrie exemplul „Așa NU” din Selenium (de mai sus) în Playwright, adăugând la final o asertare că task-ul apare în listă. Creează un fișier cu 3 teste independente (încărcarea listei, butonul dezactivat, adăugarea unui task). Rulează-l o dată cu `--workers=1` și o dată fără flag. Notează cele două durate totale din terminal.
:::

**🗝️ Rezolvare 1.4**   *(încearcă singur înainte să citești)*

Varianta Playwright a exemplului Selenium:

**📋 Cod 1.15** · `📄 tests/01-din-selenium-in-playwright.spec.ts`

```js
import { test, expect } from '@playwright/test';

test('rescrierea exemplului Selenium', async ({ page }) => {
    await page.goto('/');

    await page.getByTestId('input-task-name').fill('Test');

    await page.getByTestId('submit-task-btn').click();

    await expect(page.getByTestId('task-list')).toContainText('Test');
});
```

Fișierul cu trei teste independente:

**📋 Cod 1.16** · `📄 tests/01-paralel.spec.ts`

```ts
import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.addLocatorHandler(page.getByTestId('close-promo-btn'), async (btn) => {
        await btn.click();
    });

    await page.goto('/');
});

test('lista se încarcă', async ({ page }) => {
    await expect(page.getByTestId('task-list').locator('.task-item')).toHaveCount(5);
});

test('butonul Salvează este dezactivat', async ({ page }) => {
    await expect(page.getByTestId('submit-task-btn')).toBeDisabled();
});

test('se poate adăuga un task', async ({ page }) => {
    await page.getByTestId('input-task-name').fill('Task paralel');

    await page.getByTestId('submit-task-btn').click();

    await expect(page.getByTestId('task-list')).toContainText('Task paralel');
});
```

**📋 Cod 1.17** · `📄 Terminal`

```bash
npx playwright test tests/01-paralel.spec.ts --project=chromium --workers=1
npx playwright test tests/01-paralel.spec.ts --project=chromium
```

Cu un singur worker, testele rulează unul după altul, iar durata totală este aproximativ suma duratelor. Fără flag, ele rulează în paralel și durata scade vizibil.

### 1.5 Când alegi fiecare unealtă?

Un inginer matur nu este „fanul” unei unelte, ci alege în funcție de context. Selenium rămâne coloana vertebrală a multor corporații (sisteme bancare cu mii de teste Java, testare mobilă prin Appium). Cypress este iubit de echipele de frontend pentru component testing. Pentru un proiect **nou** de testare E2E web, cu TypeScript, CI/CD și cerințe cross-browser, Playwright este alegerea implicită a pieței.

![Figura 1.4 – Arbore de decizie simplificat](/images/sessions/premium/session-9/image4.png)

*Figura 1.4 – Arbore de decizie simplificat*

::: tip ✍️ Exercițiu de fixare 1.5 (noțiune conceptuală)
Alege unealta potrivită pentru fiecare situație și justifică alegerea în maximum două fraze: O bancă are 3.000 de teste Selenium în Java și trebuie să testeze și aplicația mobilă nativă. O echipă de frontend React vrea să testeze componente izolate, direct din procesul de dezvoltare. O platformă SaaS nouă trebuie testată pe Chrome, Firefox și Safari, cu rulare în GitHub Actions la fiecare commit.
:::

**🗝️ Rezolvare 1.5**   *(încearcă singur înainte să citești)*

1. Selenium (ecosistemul Java existent și Appium pentru mobil nativ). 2. Cypress (component testing integrat în fluxul de frontend). 3. Playwright (cross-browser real, inclusiv WebKit, cu paralelizare gratuită în CI).

### 1.6 💡 Știați că...?

::: tip 💡 Știați că… Numele Selenium este o glumă
pe vremea aceea, cel mai popular tool comercial de testare era produs de compania Mercury Interactive. Jason Huggins a remarcat că seleniul este antidotul pentru otrăvirea cu mercur. Numele a rămas. Playwright înseamnă „dramaturg”: cel care scrie scenariul pe care actorii (browserele) îl joacă pe scenă. De aceea logo-ul conține măștile de teatru, iar fișierele de test se numesc „spec” (specificații ale scenei). Playwright a depășit Cypress la descărcările săptămânale npm încă din 2024, iar la începutul lui 2026 diferența ajunsese la aproximativ 30 de milioane versus 6,5 milioane descărcări pe săptămână. WebKit-ul din Playwright rulează și pe Windows: poți verifica comportamentul motorului Safari fără să deții un Mac. În noiembrie 2026, Playwright a ajuns la versiunea 1.65, care a adăugat inclusiv suport pentru runtime-ul Bun în test runner.
:::

### 1.7 📖 Poveste Aplicată: „Cei trei curieri”

::: info 📖
Trebuie să livrezi 100 de colete (comenzi) într-un bloc de birouri (browserul). Curierul Selenium este un om de încredere, care vorbește orice limbă (Java, Python, C\#). Pentru fiecare colet, însă, merge la recepție (driverul), completează un formular (cererea HTTP), așteaptă confirmarea și abia apoi urcă. Dacă ușa biroului e închisă (elementul nu e gata), se întoarce cu coletul și raportează eroare – doar dacă nu i-ai spus explicit „așteaptă 10 secunde la ușă”. Curierul Cypress s-a angajat direct în firma din bloc. Are acces la toate birourile de pe etajul lui și vede totul în timp real. Dar nu are voie să iasă din clădire (alt domeniu) și nu poate deschide o a doua clădire (al doilea tab). Curierul Playwright are o stație radio deschisă permanent cu toate clădirile din oraș (Chromium, Firefox, WebKit). Înainte să bată la ușă, verifică singur dacă cineva este acolo și dacă ușa e liberă (auto-waiting). Și, cel mai important, poate trimite 10 colegi în paralel, fiecare cu cheia lui de acces (Browser Context), fără să se încurce între ei.
:::

### 1.8 🧠 Challenge de Interviu (Întrebare Tehnică)

::: info 📝 Intervievatorul
„Echipa noastră are 2.000 de teste Selenium în Java, care rulează în 3 ore. Managerul vrea să migrăm totul la Playwright pentru că «e mai rapid». Ce îi recomanzi?”
:::

**Răspunsul tău de inginer:** *„Nu aș recomanda o rescriere «big bang». Mai întâi aș măsura de unde vine lentoarea: așteptări fixe (\`Thread.sleep\`), lipsa paralelizării, setup-ul prin UI în loc de API sau infrastructura Grid. O parte din câștig se poate obține și în Selenium. Dacă decizia de migrare se ia, aș face-o incremental, folosind Strangler Pattern: testele noi se scriu în Playwright, iar suitele cele mai instabile și mai lente se migrează primele. Avantajele arhitecturale ale Playwright – auto-waiting, Browser Contexts, paralelizare nativă, Trace Viewer – vor reduce timpul de execuție și numărul de teste flaky, dar migrarea trebuie justificată prin metrici (durata pipeline-ului, procentul de teste instabile), nu prin «hype».”*

### 1.9 🤖 Mentalitatea de Inginer în Era AI: Valoarea ta pe piață

::: warning 🛡️
QA vs. AI: Cine alege unealta și arhitectura? Ce face AI-ul bine: Dacă îi ceri unui asistent AI „scrie-mi un test de login”, va genera în câteva secunde cod Selenium, Cypress sau Playwright – oricare i-ai cere. Capcana (Unde AI-ul eșuează): AI-ul nu cunoaște contextul echipei tale: ce limbaj știu colegii, ce browsere folosesc clienții, cât costă infrastructura de CI, dacă aplicația deschide pop-up-uri în tab-uri noi. Mai mult, modelele AI au o „dată de expirare” a cunoștințelor și amestecă adesea API-uri vechi (de exemplu `page.waitForTimeout(5000)` sau selectori XPath lungi) cu sintaxa modernă. Cum gândește un inginer QA: Inginerul ia decizia de arhitectură pe baza unor criterii (Capitolul 1.4) și îi dă AI-ului un context precis: *„Folosim Playwright Test cu TypeScript, \`baseURL\` din config, locatori \`getByTestId\`/\`getByRole\`, fără \`waitForTimeout\`, fără XPath.”* De ce vei rămâne relevant pe piață: Companiile nu plătesc pe cineva ca să tasteze cod – AI-ul tastează mai repede. Plătesc pe cineva care alege unealta corectă, justifică alegerea cu argumente tehnice și validează ce produce AI-ul. Un QA care poate explica diferența dintre HTTP WebDriver și o conexiune WebSocket persistentă este un QA pe care niciun generator de cod nu îl poate înlocui.
:::

### 1.10 Exerciții Practice

**Exercițiul 1 – Detectivul de arhitectură.** Completează, pe o foaie sau într-un fișier text, tabelul de mai jos pentru aplicația ta Task Tracker și argumentează alegerea uneltei:

| Întrebare | Răspunsul tău |
| ----- | ----- |
| Ce browsere vor folosi utilizatorii? | ... |
| Aplicația deschide tab-uri sau ferestre noi? | ... |
| Ce limbaj cunoaște echipa? | ... |
| Avem nevoie de paralelizare gratuită în CI? | ... |

**🗝️ Rezolvare – Exercițiul 1**   *(încearcă singur înainte să citești)*

| Întrebare | Răspuns pentru Task Tracker |
| ----- | ----- |
| Ce browsere vor folosi utilizatorii? | Chrome, Edge, Firefox și Safari (inclusiv pe iPhone) → avem nevoie de Chromium, Firefox și WebKit |
| Aplicația deschide tab-uri sau ferestre noi? | Nu încă, dar aplicațiile reale o fac (login cu Google, plăți, PDF-uri) → vrem o unealtă care o permite |
| Ce limbaj cunoaște echipa? | TypeScript (Sesiunile 7–8) |
| Avem nevoie de paralelizare gratuită în CI? | Da: vom rula testele în GitHub Actions la fiecare push (Sesiunea 19) |

**Concluzie:** Playwright. Acoperă toate cele trei motoare de browser, are suport nativ pentru TypeScript, paralelizare gratuită și un test runner inclus. Selenium ar cere mai multă infrastructură (drivere, Grid), iar Cypress nu acoperă la fel de bine WebKit și scenariile cu mai multe tab-uri.

**Exercițiul 2 – Adevărat sau Fals?**

1. Selenium trimite fiecare comandă către browser printr-o cerere HTTP separată.

2. Cypress poate controla nativ două tab-uri deschise simultan.

3. Playwright poate rula WebKit (motorul Safari) și pe Windows.

4. Un Browser Context din Playwright partajează cookies cu celelalte contexte din același browser.

**🗝️ Rezolvare – Exercițiul 2**   *(încearcă singur înainte să citești)*

1. **Adevărat.** Protocolul W3C WebDriver înseamnă câte o cerere HTTP (JSON) către driver pentru fiecare comandă.

2. **Fals.** Cypress rulează în interiorul unui singur tab și nu poate controla nativ un al doilea tab.

3. **Adevărat.** Playwright descarcă propriul build WebKit, compilat și pentru Windows și Linux.

4. **Fals.** Fiecare context are propriile cookies și propriul storage. Demonstrația practică este Exemplul E2E 1.3 B și rezolvarea exercițiului de fixare 1.3 B.

---

## Capitolul 2: Instalarea și Anatomia unui Proiect Playwright

### Obiective de învățare

::: info 🎯 Obiective de învățare
La finalul acestui capitol, vei fi capabil să:
- Îți pregătești mediul de lucru: Node.js (LTS), VS Code și extensia oficială Playwright Test for VS Code.
- Inițializezi un proiect Playwright de la zero cu `npm init playwright@latest` și înțelegi fiecare întrebare a wizard-ului.
- Explici rolul fiecărui fișier și folder generat (`tests/`, `playwright.config.ts`, `package.json`, `.gitignore`).
- Instalezi și actualizezi browserele Playwright (`npx playwright install`).
- Rulezi primul test, citești rezultatul din terminal și deschizi raportul HTML.
:::

### 2.1 Prerechizite: ce trebuie să ai pe calculator?

Playwright Test este un pachet **Node.js**. Asta înseamnă că testele tale TypeScript sunt executate de Node.js, nu de browser – exact „mediul de execuție” despre care am vorbit în Sesiunea 7.

| Unealtă | Cum verifici | Observații |
| ----- | ----- | ----- |
| Node.js LTS (recomandat 20, 22 sau 24) | `node -v` | Descarcă de pe nodejs.org varianta LTS. Include automat `npm` și `npx`. |
| npm | `npm -v` | Managerul de pachete. `npx` rulează comenzi din pachete fără instalare globală. |
| VS Code | — | Editorul folosit pe tot parcursul cursului. |
| Extensia Playwright Test for VS Code (Microsoft) | Panoul Testing (iconița cu eprubetă) | Rulare cu un click, debugging, „Record new”, „Pick locator”. |
| Git (opțional azi, obligatoriu în S18) | `git --version` | Vom urca proiectul pe GitHub în Modulul 8. |

**📋 Cod 2.01** · `📄 Terminal (PowerShell / bash)`

```bash
node -v        # ex: v22.x.x
npm -v         # ex: 10.x.x
npx -v

# aceeași versiune ca npm
```

::: warning ⚠️
Atenție la versiunile vechi de Node.js Playwright suportă doar versiunile de Node.js aflate încă în ciclul de suport (LTS activ sau maintenance). Dacă `node -v` îți afișează o versiune foarte veche (ex: v14 sau v16), instalarea va eșua sau vei primi erori criptice. Actualizează întâi Node.js.
:::

#### 🧪 Exemplu E2E 2.1 – Două lumi: Node.js și browserul

Sesiunea 7 a explicat că testul rulează în Node.js, iar aplicația în browser. Testul de mai jos le atinge pe amândouă:

**📋 Cod 2.02** · `📄 tests/02-mediu.spec.ts`

```ts
import { test, expect } from '@playwright/test';

test('testul rulează în Node.js, aplicația în browser', async ({ page }) => {
    console.log(`Node.js: ${process.version}`);                 // lumea Node.js

    await page.goto('/');

    const userAgent = await page.evaluate(() => navigator.userAgent);  // lumea browserului

    console.log(`Browser: ${userAgent}`);

    expect(process.version.startsWith('v')).toBeTruthy();
});
```

::: tip ✍️ Exercițiu de fixare 2.1
Adaugă o asertare care verifică faptul că versiunea majoră de Node.js este cel puțin 20. (Indiciu: `process.version` are forma `v22.11.0`.) Scrie în test, în afara lui `page.evaluate`, linia `console.log(document.title);`. Rulează testul. Ce eroare primești și de ce?
:::

**🗝️ Rezolvare 2.1**   *(încearcă singur înainte să citești)*

**📋 Cod 2.03** · `📄 Asertarea pentru versiunea Node.js`

```js
const versiuneMajora = Number(process.version.slice(1).split('.')[0]);
expect(versiuneMajora).toBeGreaterThanOrEqual(20);
```

Linia `console.log(document.title)` produce eroarea *ReferenceError: document is not defined*. Codul testului rulează în Node.js, unde nu există DOM. Ca să citești titlul, folosești `await page.title()` sau `page.evaluate(() => document.title)`.

### 2.2 Inițializarea proiectului: npm init playwright@latest

Vom crea un proiect **separat** de aplicația Task Tracker. Aceasta este o regulă de arhitectură importantă: codul aplicației (SUT) și codul de test pot sta în același repository, dar în foldere clar delimitate. Pentru curs, vom folosi structura:

**📋 Cod 2.04** · `📄 Structura recomandată pentru curs`

```bash
qa-bootcamp/
├── task-tracker/          ← aplicația din Sesiunile 1–7 (index.html, style.css, app.js)
└── task-tracker-e2e/      ← proiectul Playwright pe care îl creăm azi
```

**📋 Cod 2.05** · `📄 Terminal`

```bash
cd qa-bootcamp
mkdir task-tracker-e2e
cd task-tracker-e2e
npm init playwright@latest
```

Comanda descarcă utilitarul `create-playwright` și pornește un **wizard interactiv** care îți pune 4 întrebări:

1. **TypeScript sau JavaScript?** → alegem **TypeScript** (tot ce am învățat în S7–S8).

2. **Unde vrei testele end-to-end?** → `tests` (valoarea implicită; devine `testDir` în config).

3. **Adaug un workflow GitHub Actions?** → **Nu** deocamdată (îl construim manual în Sesiunea 19, ca să înțelegi fiecare linie).

4. **Instalez browserele Playwright?** → **Da** (descarcă Chromium, Firefox și WebKit).

Pe Linux apare și o a 5-a întrebare: instalarea dependențelor de sistem de operare (`--with-deps`).

![Figura 2.1 – Wizard-ul de inițializare în PowerShell (ilustrativ; versiunile pot diferi)](/images/sessions/premium/session-9/image5.png)

*Figura 2.1 – Wizard-ul de inițializare în PowerShell (ilustrativ; versiunile pot diferi)*

::: tip 🧭 Alternative de instalare Proiect existent
`npm i -D @playwright/test` urmat de `npx playwright install`. Din VS Code: Command Palette (Ctrl+Shift+P) → „Install Playwright” – extensia rulează același wizard. Doar un browser: `npx playwright install chromium` – util pe laptopuri cu spațiu redus sau în CI.
:::

::: tip ✍️ Exercițiu de fixare 2.2
Deschide `package.json` generat de wizard și răspunde: Ce pachete apar în `devDependencies`? De ce sunt „dev” și nu dependențe normale? La ce folosește pachetul `@types/node` într-un proiect de testare? Șterge folderul `node_modules`, rulează `npm install` și apoi `npx playwright test`. Ce s-a recuperat automat și ce nu a fost nevoie să reinstalezi?
:::

**🗝️ Rezolvare 2.2**   *(încearcă singur înainte să citești)*

1. `@playwright/test` și `@types/node`. Sunt unelte de dezvoltare și testare, nu cod livrat utilizatorilor. 2. Oferă tipurile TypeScript pentru API-urile Node.js (`process`, `fs`, `path`), deci autocompletare și verificare. 3. `npm install` refac `node_modules` exact după `package-lock.json`. Browserele nu trebuie reinstalate, pentru că sunt în cache-ul global, nu în proiect.

### 2.3 Anatomia proiectului generat

După wizard, deschide folderul în VS Code (`code .`). Vei vedea următoarea structură:

![Figura 2.2 – Fișierele și folderele unui proiect Playwright nou](/images/sessions/premium/session-9/image6.png)

*Figura 2.2 – Fișierele și folderele unui proiect Playwright nou*

| Fișier / folder | Rol |
| ----- | ----- |
| `tests/` | Folderul în care Playwright caută testele (`testDir`). Orice fișier `*.spec.ts` sau `*.test.ts` de aici este descoperit automat. |
| `tests/example.spec.ts` | Un test demo care verifică titlul site-ului playwright.dev. Îl vom rula azi, apoi îl vom șterge. |
| `playwright.config.ts` | Centrul de comandă al framework-ului (Capitolul 3). |
| `package.json` | Lista dependențelor (`@playwright/test`, `@types/node`) și locul unde vom adăuga scripturi npm. |
| `package-lock.json` | „Fotografia” exactă a versiunilor instalate. Garantează că tu, colegii tăi și CI-ul folosiți aceeași versiune. |
| `.gitignore` | Exclude din Git `node_modules/`, `test-results/`, `playwright-report/`, `blob-report/` și cache-ul Playwright. |
| `node_modules/` | Codul tuturor dependențelor. Nu se modifică manual și nu se urcă niciodată în Git. |
| `playwright-report/` și `test-results/` | Apar abia după prima rulare: raportul HTML, respectiv trace-urile, capturile și video-urile. |

Să ne uităm în fișierul de test generat. Recunoști sintaxa? Este exact `async/await` din Sesiunea 5 și tipizarea din Sesiunea 7:

**📋 Cod 2.06** · `📄 tests/example.spec.ts`

```ts
import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
    await page.goto('https://playwright.dev/');

      // Așteaptă ca titlul să conțină subșirul "Playwright"

      await expect(page).toHaveTitle(/Playwright/);
  });

  test('get started link', async ({ page }) => {
      await page.goto('https://playwright.dev/');

        await page.getByRole('link', { name: 'Get started' }).click();

        await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
    });
```

Patru concepte noi, pe care le vom aprofunda în sesiunile următoare:

* `test(titlu, callback)` – definește un caz de test. Callback-ul este o funcție **async**.

* `{ page }` – un **fixture**: Playwright îți „injectează” automat un obiect `Page` real (cel pe care l-am simulat cu o interfață în S8), creat într-un Browser Context curat.

* `expect(...)` – asertările **web-first**: reîncearcă automat până la 5 secunde (implicit) până când condiția devine adevărată.

* `page.getByRole(...)` – un **locator** modern, bazat pe rolul de accesibilitate (Sesiunea 11).

#### 🧪 Exemplu E2E 2.3 – Primul tău fișier de test pe Task Tracker

Creează în `tests/` primul fișier propriu. `test.describe` grupează testele aceleiași funcționalități:

**📋 Cod 2.07** · `📄 tests/task-tracker-smoke.spec.ts`

```ts
import { test, expect } from '@playwright/test';

test.describe('Task Tracker – smoke', () => {
    test('are titlul corect în tab-ul browserului', async ({ page }) => {
        await page.goto('/');

        await expect(page).toHaveTitle('QA Task Tracker Pro');
    });

    test('afișează logo-ul și statusul API', async ({ page }) => {
        await page.goto('/');

        await expect(page.getByRole('heading', { name: 'QA Task Tracker' })).toBeVisible();

        await expect(page.locator('#network-status')).toHaveText('API Online');
    });
});
```

::: tip ✍️ Exercițiu de fixare 2.3
Redenumește fișierul în `smoke.test.ts`, apoi în `smoke.ts`. După fiecare redenumire, rulează `npx playwright test --list`. Ce observi? Adaugă un al treilea test în `describe`, care verifică faptul că lista conține exact 5 task-uri după încărcare.
:::

**🗝️ Rezolvare 2.3**   *(încearcă singur înainte să citești)*

`smoke.test.ts` este descoperit (tiparul implicit acceptă `.spec` și `.test`), dar `smoke.ts` nu mai apare în listă. Al treilea test:

**📋 Cod 2.08** · `📄 Al treilea test din describe`

```ts
test('încarcă cele 5 task-uri inițiale', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByTestId('task-list').locator('.task-item')).toHaveCount(5);
});
```

### 2.4 Browserele Playwright

Playwright **nu** folosește Chrome-ul tău personal, ci descarcă builduri proprii, testate și versionate împreună cu fiecare release:

* **Chromium** – motorul open-source din spatele Chrome și Edge.

* **Firefox** – un build Firefox ușor modificat pentru automatizare.

* **WebKit** – motorul din spatele Safari, compilat și pentru Windows și Linux.

Browserele se instalează într-un cache global (pe Windows: `%USERPROFILE%\AppData\Local\ms-playwright`), nu în proiect. De aceea, după fiecare actualizare a pachetului `@playwright/test`, trebuie rulat din nou `npx playwright install`, altfel vei primi eroarea *„Executable doesn't exist… Looks like Playwright was just updated”*.

**📋 Cod 2.09** · `📄 Terminal`

```bash
npx playwright install            # toate browserele
npx playwright install chromium   # doar Chromium
npx playwright install --with-deps  # + biblioteci de sistem (Linux / CI)
npx playwright --version          # versiunea Playwright instalată
```

::: tip 💡
Browserele „de marcă” Dacă vrei să testezi pe Google Chrome sau Microsoft Edge reale (cele instalate pe calculator), le poți configura ca `channel: 'chrome'` sau `channel: 'msedge'` în `projects` (Capitolul 3.4).
:::

#### 🧪 Exemplu E2E 2.4 – Testul știe pe ce browser rulează

**📋 Cod 2.10** · `📄 tests/02-browsere.spec.ts`

```ts
import { test, expect } from '@playwright/test';

test(
  'afișez motorul și versiunea browserului'
  , async ({ browser, browserName }) => {
    console.log(`${browserName} – versiunea ${browser.version()}`);

    expect(['chromium', 'firefox', 'webkit']).toContain(browserName);
});

test('o funcționalitate neacceptată încă pe Safari', async ({ page, browserName }) => {
    test.skip(browserName === 'webkit', 'Exemplu: bug cunoscut pe WebKit');

    await page.goto('/');

    await expect(page.getByTestId('task-list')).toBeVisible();
});
```

::: tip ✍️ Exercițiu de fixare 2.4
Rulează fișierul doar pe WebKit. Cum apare al doilea test în terminal și în raportul HTML? Înlocuiește `test.skip(...)` cu `test.fixme(...)`. Care este diferența de intenție dintre cele două?
:::

**🗝️ Rezolvare 2.4**   *(încearcă singur înainte să citești)*

**📋 Cod 2.11** · `📄 Terminal`

```bash
npx playwright test tests/02-browsere.spec.ts --project=webkit
```

Al doilea test apare ca *skipped* (în terminal cu simbolul `-`), iar în raportul HTML apare în filtrul **Skipped**, cu motivul „Exemplu: bug cunoscut pe WebKit”.

**📋 Cod 2.12** · `📄 Varianta cu test.fixme`

```ts
test('o funcționalitate neacceptată încă pe Safari', async ({ page, browserName }) => {
    test.fixme(browserName === 'webkit', 'Bug TT-17: lista nu se randează pe WebKit');

    await page.goto('/');

    await expect(page.getByTestId('task-list')).toBeVisible();
});
```

`test.skip` înseamnă „nu se aplică aici, în mod intenționat”. `test.fixme` înseamnă „ar trebui să meargă, dar e stricat și trebuie reparat”: este o datorie tehnică vizibilă în raport.

### 2.5 Primul run și raportul HTML

**📋 Cod 2.13** · `📄 Terminal`

```bash
npx playwright test
```

Playwright citește `playwright.config.ts`, descoperă cele 2 teste din `tests/`, le multiplică pe cele 3 browsere (proiecte) și le rulează în **paralel**, cu mai mulți „workers” (procese separate):

![Figura 2.3 – Rezultatul primului run: 2 teste × 3 browsere = 6 execuții](/images/sessions/premium/session-9/image7.png)

*Figura 2.3 – Rezultatul primului run: 2 teste × 3 browsere \= 6 execuții*

Implicit, testele rulează **headless** (fără fereastră vizibilă) – exact cum vor rula în CI. La final, deschide raportul:

**📋 Cod 2.14** · `📄 Terminal`

```bash
npx playwright show-report
```

Comanda pornește un mic server local și deschide raportul HTML în browser. Raportul se deschide și automat dacă un test eșuează.

![Figura 2.4 – Raportul HTML: filtre, proiecte (browsere), durate și erori (ilustrativ)](/images/sessions/premium/session-9/image8.png)

*Figura 2.4 – Raportul HTML: filtre, proiecte (browsere), durate și erori (ilustrativ)*

#### 🧪 Exemplu E2E 2.5 – Un raport HTML ușor de citit cu test.step

**📋 Cod 2.15** · `📄 tests/02-raport.spec.ts`

```ts
import { test, expect } from '@playwright/test';

test('adăugarea unui task, pas cu pas în raport', async ({ page }) => {
    await test.step(
      'Deschid aplicația'
      , async () => {
        await page.goto('/');
    });

    await test.step(
      'Completez și salvez task-ul'
      , async () => {
        await page.getByTestId('input-task-name').fill('Task din raport');

        await page.getByTestId('submit-task-btn').click();
    });

    await test.step('Verific că task-ul apare în listă', async () => {
        await expect(page.getByTestId('task-list')).toContainText('Task din raport');
    });
});
```

În raportul HTML, testul apare împărțit în cei trei pași, cu durata fiecăruia. Un coleg non-tehnic înțelege imediat ce a verificat testul.

::: tip ✍️ Exercițiu de fixare 2.5
Atașează la raport o captură de ecran făcută la finalul testului, folosind `test.info().attach(...)`. Adaugă testului o adnotare de tip `issue` cu descrierea `TT-42`. Găsește ambele elemente în raportul HTML.
:::

**🗝️ Rezolvare 2.5**   *(încearcă singur înainte să citești)*

**📋 Cod 2.16** · `📄 Atașament și adnotare`

```ts
test('adăugarea unui task, pas cu pas în raport', async ({ page }) => {
    test.info().annotations.push({ type: 'issue', description: 'TT-42' });

    // ... pașii din exemplu ...
    await test.info().attach('starea finală', {
        body: await page.screenshot(),
        contentType: 'image/png',
    });
});
```

### 2.6 💡 Știați că...?

::: tip 💡 Știați că… Același `{ page }`, alt univers
fiecare test primește propriul Browser Context. Dacă testul 1 se autentifică, testul 2 pornește tot nelogat. Această izolare este motivul pentru care testele Playwright pot rula în orice ordine. `npx` vine de la „npm execute”: caută comanda întâi în `node_modules/.bin` al proiectului. De aceea `npx playwright` folosește exact versiunea din `package.json`, nu una globală. Un singur fișier `example.spec.ts` \= 6 execuții: numărul de rulări este *teste × proiecte*. O suită de 100 de teste pe 3 browsere și 2 dispozitive mobile înseamnă 500 de execuții. De aceea paralelizarea nativă e vitală. Raportul HTML este o aplicație statică: folderul `playwright-report/` poate fi publicat ca artefact în CI (Sesiunea 19) și deschis de oricine, fără Playwright instalat.
:::

### 2.7 📖 Poveste Aplicată: „Bucătăria profesională”

::: info 📖
Până acum ai gătit acasă (TS Playground, consola F12). `npm init playwright@latest` este momentul în care te muți într-o bucătărie profesională. Wizard-ul este firma care îți montează echipamentele: `node_modules/` sunt aparatele (nu le desfaci tu), `package.json` este lista de inventar, `package-lock.json` este factura cu seriile exacte ale fiecărui aparat, iar `playwright.config.ts` este fișa de reguli a bucătăriei – la ce temperatură se gătește, câți bucătari lucrează simultan, ce se întâmplă dacă o farfurie iese prost. Folderul `tests/` este caietul cu rețete. Fiecare `test()` este o rețetă, iar fiecare `expect()` este „degustarea” care confirmă că preparatul e corect. Raportul HTML este fișa de inspecție sanitară de la sfârșitul zilei.
:::

### 2.8 🧠 Challenge de Interviu (Întrebare Tehnică)

::: info 📝 Intervievatorul
„Un coleg a urcat în Git folderul node_modules și a șters package-lock.json «ca să nu încurce». Pe CI, testele trec, dar pe laptopul tău pică exact aceleași teste. Ce s-a întâmplat și cum repari?”
:::

**Răspunsul tău de inginer:** *„Fără \`package-lock.json\`, fiecare \`npm install\` poate rezolva alte versiuni minore ale dependențelor, deci CI-ul și laptopul meu rulează, cel mai probabil, versiuni diferite de \`@playwright/test\` și de browsere. Aș readuce \`package-lock.json\` în repository, aș scoate \`node_modules/\` din Git (îl adaug în \`.gitignore\`), iar în CI aș folosi \`npm ci\`, care instalează exact versiunile din lock file. După fiecare actualizare a Playwright rulez și \`npx playwright install\`, ca versiunea browserelor să corespundă versiunii bibliotecii.”*

### 2.9 🤖 Mentalitatea de Inginer în Era AI: Instrucțiuni de instalare expirate

::: warning 🛡️
QA vs. AI: „Copiază comanda asta…” Capcana: Asistenții AI și tutorialele vechi recomandă adesea comenzi depășite: `npm install playwright` (biblioteca, fără test runner), `npm i -g playwright` (instalare globală, care creează conflicte de versiuni) sau API-uri din versiuni de acum câțiva ani. Cum gândește un inginer QA: Verifică sursa oficială (playwright.dev → Installation) și versiunea curentă (`npx playwright --version`). Când lucrează cu un AI, îi dă contextul exact: *„Proiect Playwright Test, TypeScript, versiunea instalată este X; folosește doar \`@playwright/test\`, fără instalări globale.”* Valoarea ta pe piață: Un inginer care poate face un setup curat, reproductibil (lock file, `npm ci`, versiuni fixate) în 10 minute este cel căruia i se dă proiectul nou al echipei. Setup-ul este prima impresie pe care o lași într-un proiect.
:::

### 2.10 Exerciții Practice

**Exercițiul 1 – Setup complet.** Creează proiectul `task-tracker-e2e` cu wizard-ul (TypeScript, `tests`, fără GitHub Actions, cu browsere). Rulează `npx playwright test` și notează: câte teste au rulat, câți workers, cât a durat.

**🗝️ Rezolvare – Exercițiul 1**   *(încearcă singur înainte să citești)*

**📋 Cod 2.17** · `📄 Terminal`

```bash
mkdir task-tracker-e2e
cd task-tracker-e2e
npm init playwright@latest      # TypeScript · tests · false · true
npx playwright test
```

**📋 Cod 2.18** · `📄 Rezultatul tipic`

```text
Running 6 tests using 4 workers

6 passed (6.2s)

To open last HTML report run:

npx playwright show-report
```

Au rulat **6 execuții**: 2 teste × 3 browsere (proiecte). Numărul de workers depinde de procesor: implicit este jumătate din nucleele logice. Durata variază între câteva secunde și zece secunde, în funcție de calculator și de viteza internetului (testele demo deschid playwright.dev).

**Exercițiul 2 – Scripturi npm.** Adaugă în `package.json` trei scripturi, pentru a nu mai tasta comenzi lungi:

**📋 Cod 2.19** · `📄 package.json (fragment)`

```json
"scripts": {
  "test": "playwright test",
  "test:headed": "playwright test --headed",
  "report": "playwright show-report"
}
```

Rulează `npm test` și apoi `npm run report`.

**🗝️ Rezolvare – Exercițiul 2**   *(încearcă singur înainte să citești)*

**📋 Cod 2.20** · `📄 package.json (complet, după exercițiu)`

```json
{
  "name": "task-tracker-e2e",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "test": "playwright test",
    "test:headed": "playwright test --headed",
    "report": "playwright show-report"
  },
  "devDependencies": {
    "@playwright/test": "^1.65.0",
    "@types/node": "^22.0.0"
  }
}
```

**📋 Cod 2.21** · `📄 Terminal`

```bash
npm test
npm run test:headed -- --project=chromium   # argumentele de după -- ajung la Playwright
npm run report
```

În scripturile npm nu mai este nevoie de `npx`, pentru că npm adaugă automat `node_modules/.bin` în PATH. `npm test` este o scurtătură pentru `npm run test`. Versiunile din `devDependencies` vor fi cele instalate efectiv la tine.

**Exercițiul 3 – Spargerea intenționată.** În `example.spec.ts`, schimbă `/Playwright/` cu `/Selenium/`. Rulează testele. Ce se întâmplă cu raportul HTML? Cât timp așteaptă `expect` înainte să cedeze?

**🗝️ Rezolvare – Exercițiul 3**   *(încearcă singur înainte să citești)*

**📋 Cod 2.22** · `📄 tests/example.spec.ts (modificat)`

```ts
test('has title', async ({ page }) => {
    await page.goto('https://playwright.dev/');

      await expect(page).toHaveTitle(/Selenium/);

      // greșit intenționat
  });
```

**📋 Cod 2.23** · `📄 Rezultatul (prescurtat)`

```text
✘  1 \[chromium\] › tests/example.spec.ts:3:5 › has title (5.4s)
Error: expect(page).toHaveTitle(expected) failed

Expected pattern: /Selenium/

Received string:  "Fast and reliable end-to-end testing for modern web apps | Playwright"

Timeout: 5000ms

3 failed

3 passed
```

Testul „has title” pică pe toate cele 3 browsere, iar raportul HTML se deschide automat, pentru că există eșecuri. `toHaveTitle()` reîncearcă timp de **5 secunde** (timeout-ul implicit pentru asertări), apoi afișează diferența dintre valoarea așteptată și cea primită. Titlul exact al site-ului se poate schimba în timp. Revino apoi la `/Playwright/`.

---

## Capitolul 3: Centrul de Comandă – playwright.config.ts

### Obiective de învățare

::: info 🎯 Obiective de învățare
La finalul acestui capitol, vei fi capabil să:
- Explici de ce un framework de testare are nevoie de un fișier central de configurare (Single Source of Truth).
- Citești și modifici fiecare secțiune din `defineConfig`: opțiunile globale, blocul `use`, `projects` și `webServer`.
- Configurezi `baseURL`, `testIdAttribute`, `trace`, `screenshot`, `video` și timeout-urile corecte.
- Rulezi aceleași teste pe Chromium, Firefox, WebKit și pe dispozitive mobile emulate.
- Construiești configurația completă pentru aplicația Task Tracker, gata pentru CI/CD.
:::

### 3.1 De ce un fișier de configurare? (Contextul)

În Sesiunea 7 am învățat că `tsconfig.json` este „centrul de comandă” al compilatorului TypeScript. `playwright.config.ts` joacă același rol pentru **test runner**. Fără el, fiecare test ar trebui să-și declare singur URL-ul aplicației, browserul, timeout-urile și ce se întâmplă la eșec – adică exact „spaghetti code-ul” împotriva căruia am luptat în Sesiunea 8.

#### ❌ Așa NU (configurare împrăștiată în teste)

**📋 Cod 3.01** · `📄 tests/adauga-task.spec.ts`

```ts
test('adaugă task', async ({ page }) => {
    test.setTimeout(60000);                          // timeout „hardcodat”

    await page.goto('https://tasktracker.qualiadept.eu/index.html'); // URL repetat în 200 de teste

      await page.locator('[data-testid="input-task-name"]').fill('Task');
  });
  // Când aplicația se mută pe https://staging.qualiadept.eu, modifici 200 de fișiere.
```

#### ✅ Așa DA (configurare centralizată)

**📋 Cod 3.02** · `📄 tests/adauga-task.spec.ts`

```ts
test('adaugă task', async ({ page }) => {
    await page.goto('/');                                 // baseURL vine din config

    await page.getByTestId('input-task-name').fill('Task'); // testIdAttribute vine din config
});
// Schimbarea mediului = o singură linie în playwright.config.ts (sau o variabilă de mediu).
```

![Figura 3.1 – Cele patru blocuri ale fișierului playwright.config.ts](/images/sessions/premium/session-9/image9.png)

*Figura 3.1 – Cele patru blocuri ale fișierului playwright.config.ts*

::: tip ✍️ Exercițiu de fixare 3.1
Refactorizează testul de mai jos astfel încât să depindă exclusiv de configurație. Folosește `baseURL`, `getByTestId` și timeout-ul implicit.

**📋 Cod 3.03 · 📄 tests/03-de-refactorizat.spec.ts**

```ts
test('lista se încarcă', async ({ page }) => {
    test.setTimeout(90000);

    await page.goto('https://tasktracker.qualiadept.eu/index.html');

      await expect(page.locator('[data-testid="task-list"] .task-item')).toHaveCount(5);
  });
```
:::

**🗝️ Rezolvare 3.1**   *(încearcă singur înainte să citești)*

**📋 Cod 3.04** · `📄 tests/03-de-refactorizat.spec.ts (refactorizat)`

```ts
test('lista se încarcă', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByTestId('task-list').locator('.task-item')).toHaveCount(5);
});
```

### 3.2 Fișierul generat, linie cu linie

Iată (ușor simplificat) ce generează wizard-ul. Observă că este **cod TypeScript**, nu JSON: poți folosi variabile, condiții (`process.env.CI ? 2 : 0`) și autocompletare.

**📋 Cod 3.05** · `📄 playwright.config.ts (generat de wizard)`

```ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './tests',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: 'html',
    use: {
      // baseURL: 'http://localhost:3000',
      trace: 'on-first-retry',
    },
    projects: [
      { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
      { name: 'firefox',  use: { ...devices['Desktop Firefox'] } },
      { name: 'webkit',   use: { ...devices['Desktop Safari'] } },
    ],
    // webServer: { command: 'npm run start', url: 'http://localhost:3000', reuseExistingServer: !process.env.CI },
});
```

::: info 🔍
De ce `defineConfig()`? `defineConfig` este o funcție-helper care primește obiectul tău și îl returnează neschimbat. Rolul ei este tipizarea: datorită ei, VS Code îți oferă autocompletare și îți subliniază cu roșu o opțiune scrisă greșit (de exemplu `retires` în loc de `retries`). Este aplicarea directă a lecției din S7: lasă compilatorul să prindă greșelile înaintea rulării.
:::

#### 🧪 Exemplu E2E 3.2 – forbidOnly și retries în acțiune

**📋 Cod 3.06** · `📄 tests/03-only.spec.ts`

```ts
import { test, expect } from '@playwright/test';

test.only('doar acest test rulează cât timp există test.only', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByTestId('task-list')).toBeVisible();
});

test('acest test este ignorat local', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle('QA Task Tracker Pro');
});
```

::: tip ✍️ Exercițiu de fixare 3.2
Rulează fișierul local. Câte teste rulează? Simulează un server de CI setând variabila `CI` și rulează din nou: în PowerShell `$env:CI="true"; npx playwright test`, apoi șterge variabila cu `Remove-Item Env:CI`. Ce se întâmplă și ce linie din config a provocat comportamentul?
:::

**🗝️ Rezolvare 3.2**   *(încearcă singur înainte să citești)*

**📋 Cod 3.07** · `📄 PowerShell (Windows)`

```bash
npx playwright test tests/03-only.spec.ts          # local: rulează doar testul cu test.only
$env:CI="true"; npx playwright test tests/03-only.spec.ts
Remove-Item Env:CI
```

**📋 Cod 3.08** · `📄 bash (macOS / Linux / Git Bash)`

```bash
CI=true npx playwright test tests/03-only.spec.ts
```

Local rulează un singur test. Cu `CI` setat, rularea eșuează imediat, cu mesajul că `test.only` nu este permis. Cauza este linia `forbidOnly: !!process.env.CI`. Tot din cauza lui `CI`, `retries` devine 2, iar `workers` devine 1.

### 3.3 Opțiunile globale: CE rulăm și CUM se comportă runner-ul

| Opțiune | Valoare tipică | Ce face și de ce contează pentru QA |
| ----- | ----- | ----- |
| `testDir` | `'./tests'` | Folderul în care sunt căutate testele. |
| `testMatch` | `'**/*.spec.ts'` | Tiparul fișierelor considerate teste (implicit `*.spec` și `*.test`, .ts/.js). |
| `timeout` | `30_000` | Timpul maxim pentru UN test, în milisecunde. Implicit 30 de secunde. |
| `expect.timeout` | `5_000` | Cât reîncearcă o asertare web-first. Implicit 5 secunde. |
| `fullyParallel` | `true` | Rulează în paralel și testele din același fișier, nu doar fișierele între ele. |
| `workers` | `undefined` / `1` / `'50%'` | Numărul de procese paralele. Implicit: jumătate din nucleele logice. |
| `retries` | `process.env.CI ? 2 : 0` | De câte ori se reia un test picat. Local 0 (vrei să vezi eșecul), în CI 2. |
| `forbidOnly` | `!!process.env.CI` | Blochează pipeline-ul dacă cineva a uitat un `test.only` în cod. |
| `reporter` | `'html'` sau `[['list'], ['html']]` | Formatul raportului: list, line, dot, html, json, junit, blob, github. |
| `outputDir` | `'test-results'` | Unde se salvează trace-urile, capturile și video-urile. |

::: warning ⚠️
Retries nu sunt o soluție pentru teste instabile Un test care trece doar la a doua încercare este marcat în raport ca flaky. Retries ne ajută să nu blocăm pipeline-ul din cauza unei probleme de rețea, dar fiecare test flaky trebuie investigat (Sesiunea 17). Nu crește `retries` la 5 ca să „ascunzi” un bug.
:::

#### 🧪 Exemplu E2E 3.3 – Trei niveluri de timeout

**📋 Cod 3.09** · `📄 tests/03-timeouts.spec.ts`

```ts
import { test, expect } from '@playwright/test';

test('asertare cu timeout propriu pentru o rețea lentă', async ({ page }) => {
    await page.goto('/');

    // expect.timeout (5 s implicit) suprascris doar pentru această asertare

    await expect(page.getByTestId('loading-spinner')).toBeHidden({ timeout: 10_000 });
});

test('un test marcat ca lent', async ({ page }) => {
    test.slow();          // triplează timeout-ul acestui test (30 s -> 90 s)

    await page.goto('/');

    await page.getByTestId('input-task-name').fill('Test lent');

    await page.getByTestId('submit-task-btn').click();

    await expect(page.getByTestId('task-list')).toContainText('Test lent');
});

test('afișez worker-ul care rulează testul', async ({ page }) => {
    console.log(`Worker: ${test.info().workerIndex}`);

    // fullyParallel în acțiune
    await page.goto('/');

    await expect(page.getByTestId('submit-task-btn')).toBeDisabled();
});
```

::: tip ✍️ Exercițiu de fixare 3.3
Setează temporar în config `expect: { timeout: 100 }` și rulează fișierul. Care teste pică și de ce? Revino apoi la valoarea implicită. Setează `fullyParallel: false` și rulează din nou. Ce se schimbă în valorile `workerIndex` afișate pentru testele din acest fișier?
:::

**🗝️ Rezolvare 3.3**   *(încearcă singur înainte să citești)*

**📋 Cod 3.10** · `📄 playwright.config.ts (modificare temporară)`

```ts
export default defineConfig({
    // ...

    expect: { timeout: 100 },   // doar pentru experiment! Revino apoi la 5_000

    fullyParallel: false,
    // a doua parte a exercițiului
});
```

Cu `expect.timeout` de 100 ms pică asertările care depind de rețea: dispariția spinner-ului și apariția task-ului nou după POST. Asertarea cu `{ timeout: 10_000 }` trece, pentru că opțiunea locală are prioritate. Cu `fullyParallel: false`, toate testele din același fișier rulează în același worker, deci `workerIndex` este identic pentru ele.

### 3.4 Blocul use: CUM interacționează robotul cu aplicația

Tot ce pui în `use` devine valoarea implicită pentru fiecare test: opțiunile browserului, ale contextului și ale paginii.

| Opțiune | Exemplu | Explicație |
| ----- | ----- | ----- |
| `baseURL` | `'https://tasktracker.qualiadept.eu'` | Permite `page.goto('/')`. URL-ul relativ se lipește de baseURL. |
| `testIdAttribute` | `'data-testid'` | Atributul folosit de `getByTestId()`. Implicit este deja `data-testid`; îl schimbi dacă echipa folosește `data-qa` sau `data-test`. |
| `headless` | `true` | Fără fereastră vizibilă (implicit). Local poți folosi `--headed`. |
| `viewport` | `{ width: 1280, height: 720 }` | Dimensiunea ferestrei. |
| `trace` | `'on-first-retry'` | Înregistrează „cutia neagră” a testului: DOM, rețea, consolă, pași. Alte valori: `'off'`, `'on'`, `'retain-on-failure'`. |
| `screenshot` | `'only-on-failure'` | Captură automată la eșec (`'off'`, `'on'`, `'only-on-failure'`). |
| `video` | `'retain-on-failure'` | Video doar pentru testele picate (`'off'`, `'on'`, `'on-first-retry'`). |
| `actionTimeout` | `10_000` | Timp maxim pentru o singură acțiune (`click`, `fill`). Implicit fără limită (limitat doar de timeout-ul testului). |
| `navigationTimeout` | `15_000` | Timp maxim pentru `page.goto()` și navigări. |
| `locale` / `timezoneId` | `'ro-RO'` / `'Europe/Bucharest'` | Limba și fusul orar ale browserului – critice la testarea datelor calendaristice. |

**📋 Cod 3.11** · `📄 Exemplu: blocul use pentru Task Tracker`

```ts
use: {
  baseURL: 'https://tasktracker.qualiadept.eu',
  testIdAttribute: 'data-testid',   // atributele puse de noi în Sesiunea 6

  trace: 'on-first-retry',
  screenshot: 'only-on-failure',
  video: 'retain-on-failure',
  actionTimeout: 10_000,
  locale: 'ro-RO',
},
```

::: tip 💡
Știați că `30_000` este un număr valid? Din ES2021, JavaScript și TypeScript acceptă separatorul `_` în numere, pentru lizibilitate: `30_000` este identic cu `30000`. De aceea vei vedea des `timeout: 30_000` sau `timeout: 30 * 1000` în configurațiile Playwright.
:::

#### 🧪 Exemplu E2E 3.4 – use global și test.use local

Opțiunile din config se aplică tuturor testelor, dar un fișier le poate suprascrie local cu `test.use()`:

**📋 Cod 3.12** · `📄 tests/03-use.spec.ts`

```ts
import { test, expect } from '@playwright/test';

// Doar pentru acest fișier: ecran de telefon și limba română
test.use({ locale: 'ro-RO', viewport: { width: 375, height: 667 } });

test('formularul funcționează pe un ecran mic, în română', async ({ page }) => {
    await page.goto('/');                                     // baseURL din config

    expect(await page.evaluate(() => navigator.language)).toBe('ro-RO');

    expect(page.viewportSize()?.width).toBe(375);

    await page.getByTestId('input-task-name').fill('Ecran mic'); // testIdAttribute

    await expect(page.getByTestId('submit-task-btn')).toBeEnabled();
});
```

::: tip ✍️ Exercițiu de fixare 3.4
Schimbă temporar în config `testIdAttribute: 'data-qa'` și rulează testul. Ce eroare primești? Ce ar trebui modificat în aplicație pentru ca testul să treacă din nou? Revino apoi la `data-testid`. Setează `trace: 'on'` doar pentru acest fișier, folosind `test.use`. Rulează testul și deschide trace-ul din raportul HTML.
:::

**🗝️ Rezolvare 3.4**   *(încearcă singur înainte să citești)*

Testul pică cu timeout la `getByTestId(...)`, pentru că Playwright caută acum atributul `data-qa`, care nu există în HTML. Ar trebui ca aplicația să folosească `data-qa`. Pentru trace local: `test.use({ locale: 'ro-RO', viewport: { width: 375, height: 667 }, trace: 'on' });`.

### 3.5 projects: UNDE rulăm (cross-browser și mobile)

Un **proiect** este o combinație de setări sub care rulează aceleași teste. Cel mai des, un proiect \= un browser sau un dispozitiv. Obiectul `devices` conține peste 100 de profile predefinite (viewport, user agent, touch, device scale factor).

**📋 Cod 3.13** · `📄 projects (cross-browser + mobile)`

```ts
projects: [
  { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  { name: 'firefox',  use: { ...devices['Desktop Firefox'] } },
  { name: 'webkit',   use: { ...devices['Desktop Safari'] } },
  { name: 'Mobile Chrome', use: { ...devices['Pixel 7'] } },
  { name: 'Mobile Safari', use: { ...devices['iPhone 15'] } },
  { name: 'Google Chrome', use: { ...devices['Desktop Chrome'], channel: 'chrome' } },
],
```

Operatorul `...` (spread, Sesiunea 3) copiază toate proprietățile profilului într-un obiect nou, peste care poți suprascrie ce vrei. Rulezi un singur proiect cu `npx playwright test --project=chromium`.

::: info 🔭
Privire spre Sesiunea 15 Proiectele pot depinde unele de altele (`dependencies: ['setup']`). Așa vom construi, în Sesiunea 15, un proiect „setup” care se autentifică o singură dată și salvează sesiunea pentru toate celelalte teste.
:::

#### 🧪 Exemplu E2E 3.5 – Un test care se adaptează proiectului

**📋 Cod 3.14** · `📄 tests/03-projects.spec.ts`

```ts
import { test, expect } from '@playwright/test';

test('layout-ul se adaptează dispozitivului', async ({ page, isMobile }, testInfo) => {
    await page.goto('/');

    const latime = page.viewportSize()?.width ?? 0;

    console.log(`[${testInfo.project.name}] mobil=${isMobile}, lățime=${latime}px`);

    if (isMobile) {
      expect(latime).toBeLessThan(500);
    } else {
      expect(latime).toBeGreaterThanOrEqual(1280);
    }

    await expect(page.getByTestId('task-list')).toBeVisible();
});
```

::: tip ✍️ Exercițiu de fixare 3.5
Adaugă în config proiectul `Mobile Chrome` (profilul `Pixel 7`) și rulează doar acest fișier pe toate proiectele. Câte execuții vezi și ce valori afișează consola? Configurează proiectul mobil astfel încât să ruleze doar testele marcate `@smoke`. (Indiciu: un proiect acceptă opțiunea `grep`.)
:::

**🗝️ Rezolvare 3.5**   *(încearcă singur înainte să citești)*

**📋 Cod 3.15** · `📄 playwright.config.ts (fragment projects)`

```ts
{
  name: 'Mobile Chrome',
  use: { ...devices['Pixel 7'] },
  grep: /@smoke/,
},
```

Cu 4 proiecte apar 4 execuții. Proiectul mobil afișează `mobil=true` și o lățime sub 500 px, iar cele desktop afișează `mobil=false` și `1280px`.

### 3.6 webServer: PE CE aplicație (pornirea automată a unui SUT local)

Aplicația cursului este publicată la `https://tasktracker.qualiadept.eu`, deci pentru ea **nu ai nevoie** de `webServer`: `baseURL` este suficient. Blocul devine util când aplicația testată rulează pe calculatorul tău: aplicația ta din Sesiunea 6, o versiune nouă pe care o dezvolți sau, în CI, exact codul unui commit, înainte să fie publicat. Dacă aplicația locală nu rulează, toate testele pică cu `net::ERR_CONNECTION_REFUSED`. Blocul `webServer` îi spune lui Playwright: *„Înainte de teste, pornește aplicația și așteaptă până răspunde la acest URL.”*

**📋 Cod 3.16** · `📄 webServer pentru Task Tracker rulat local (fișiere statice)`

```ts
webServer: {
  command: 'npx serve ../task-tracker -l 3000',
  // servește index.html, style.css, app.js
  url: 'http://localhost:3000',
  reuseExistingServer: !process.env.CI,
  // local: folosește serverul deja pornit
  timeout: 120_000,                              // cât așteaptă pornirea
},
```

Pentru a folosi varianta locală, `baseURL` trebuie să fie `http://localhost:3000` (de exemplu rulând cu `BASE_URL=http://localhost:3000`, vezi 3.7). Folderul `task-tracker/` cu aplicația de referință se află în arhiva laboratorului (Capitolul 8). Alternativ, poți porni aplicația manual, de exemplu cu extensia **Live Server** din VS Code, care servește implicit pe portul 5500, și seta `baseURL: 'http://127.0.0.1:5500'`.

#### 🧪 Exemplu E2E 3.6 – Verific că serverul aplicației răspunde

Fixture-ul `request` trimite cereri HTTP direct, fără browser, și folosește tot `baseURL`. Testul funcționează la fel pe adresa publică și pe un server local:

**📋 Cod 3.17** · `📄 tests/03-webserver.spec.ts`

```ts
import { test, expect } from '@playwright/test';

test('serverul livrează fișierele aplicației', async ({ request }) => {
    const pagina = await request.get('/');

    expect(pagina.status()).toBe(200);

    expect(await pagina.text()).toContain('QA Task Tracker Pro');

    const script = await request.get('/app.js');

    expect(script.ok()).toBeTruthy();
});
```

::: tip ✍️ Exercițiu de fixare 3.6
Lucrează pe varianta locală: copiază folderul `task-tracker/` din arhiva laboratorului lângă proiectul tău, adaugă în config blocul `webServer` de mai sus și rulează testele cu `BASE_URL=http://localhost:3000`. Pornește manual aplicația pe portul 3000, setează în config `reuseExistingServer: false` și rulează testele. Ce mesaj primești? De ce în CI vrem totuși `false`? Oprește orice server și șterge blocul `webServer` din config, păstrând `BASE_URL=http://localhost:3000`. Ce eroare apare în teste? Ce se întâmplă dacă rulezi din nou fără `BASE_URL`?
:::

**🗝️ Rezolvare 3.6**   *(încearcă singur înainte să citești)*

**📋 Cod 3.18** · `📄 playwright.config.ts (fragment)`

```ts
webServer: {
  command: 'npx serve ../task-tracker -l 3000',
  url: 'http://localhost:3000',
  reuseExistingServer: false,   // experiment: nu refolosi serverul pornit manual
},
```

**📋 Cod 3.19** · `📄 Terminal`

```bash
# PowerShell (Windows)
$env:BASE_URL="http://localhost:3000"; npx playwright test tests/03-webserver.spec.ts
# bash (macOS / Linux / Git Bash)
BASE_URL=http://localhost:3000 npx playwright test tests/03-webserver.spec.ts
```

Cu portul deja ocupat, Playwright refuză să pornească și spune că `http://localhost:3000` este deja folosit. În CI vrem `false`, ca testele să ruleze mereu pe o instanță pornită curat, din codul exact al commit-ului.

Fără blocul `webServer` și fără server pornit, testele pică la `page.goto('/')` cu eroarea `net::ERR_CONNECTION_REFUSED`. Fără `BASE_URL`, `baseURL` revine la adresa publică, iar testele trec din nou: nu mai depind de un server local. În PowerShell, șterge variabila cu `Remove-Item Env:BASE_URL`.

### 3.7 Configurația completă pentru Task Tracker

![Figura 3.2 – Ce face Playwright, pas cu pas, când rulezi testele](/images/sessions/premium/session-9/image10.png)

*Figura 3.2 – Ce face Playwright, pas cu pas, când rulezi testele*

**📋 Cod 3.20** · `📄 playwright.config.ts (Task Tracker – versiunea finală S9)`

```ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './tests',
    timeout: 30_000,
    expect: { timeout: 5_000 },
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: [['list'], ['html', { open: 'never' }]],
    use: {
      baseURL: process.env.BASE_URL ?? 'https://tasktracker.qualiadept.eu',
      testIdAttribute: 'data-testid',
      trace: 'on-first-retry',
      screenshot: 'only-on-failure',
      video: 'retain-on-failure',
      actionTimeout: 10_000,
    },
    projects: [
      { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
      { name: 'firefox',  use: { ...devices['Desktop Firefox'] } },
      { name: 'webkit',   use: { ...devices['Desktop Safari'] } },
    ],
    // Fără webServer: aplicația cursului este publicată la https://tasktracker.qualiadept.eu.

    // Pentru o aplicație locală, adaugă blocul webServer din 3.6.
});
```

Operatorul `??` (nullish coalescing) folosește variabila de mediu `BASE_URL` dacă există; altfel, adresa publică a aplicației. Astfel, același config funcționează pe adresa cursului, pe aplicația ta locală și pe orice alt mediu: `BASE_URL=http://localhost:3000 npx playwright test`.

#### 🧪 Exemplu E2E 3.7 – Pe ce mediu rulez?

**📋 Cod 3.21** · `📄 tests/03-mediu-tinta.spec.ts`

```ts
import { test, expect } from '@playwright/test';

test('testul rulează pe mediul configurat', async ({ page, baseURL }) => {
    console.log(`Mediu țintă: ${baseURL}`);

    await page.goto('/');

    await expect(page).toHaveURL(`${baseURL}/`);

    await expect(page).toHaveTitle('QA Task Tracker Pro');
});
```

::: tip ✍️ Exercițiu de fixare 3.7
Rulează testul de două ori: o dată normal și o dată cu `BASE_URL=http://localhost:3000`, cu aplicația pornită local (3.6). Ce valoare afișează consola de fiecare dată? Ce linie din config face posibilă schimbarea fără să modifici niciun test?
:::

**🗝️ Rezolvare 3.7**   *(încearcă singur înainte să citești)*

Prima rulare afișează `https://tasktracker.qualiadept.eu`, a doua `http://localhost:3000`. Linia responsabilă este `baseURL: process.env.BASE_URL ?? 'https://tasktracker.qualiadept.eu'`.

### 3.8 💡 Știați că...?

::: tip 💡 Știați că… `testIdAttribute
'data-testid'` este deja valoarea implicită. Mulți ingineri îl scriu explicit ca documentație vie: oricine deschide config-ul înțelege imediat convenția echipei. Dacă echipa ta de frontend folosește `data-qa`, aceasta este singura linie pe care o schimbi. Trace-ul este o „cutie neagră” de avion: un fișier `trace.zip` conține capturi ale DOM-ului pentru fiecare pas, cererile de rețea, log-urile din consolă și codul sursă al testului. Îl deschizi cu `npx playwright show-trace` sau pe trace.playwright.dev, direct în browser. Poți avea mai multe config-uri: `npx playwright test --config=playwright.smoke.config.ts`. Unele echipe au un config separat pentru testele rapide de tip smoke și altul pentru regresia completă de noapte.
:::

### 3.9 📖 Poveste Aplicată: „Panoul de control al pilotului”

::: info 📖
Testele tale sunt pasagerii. playwright.config.ts este cockpitul. Înainte de decolare, pilotul nu reconfigurează avionul pentru fiecare pasager. Setează o singură dată destinația (`baseURL`), altitudinea maximă și timpul de zbor (`timeout`), câte piste folosește simultan (`workers`), ruta alternativă dacă vremea e rea (`retries`) și pornește cutia neagră (`trace`), care înregistrează totul în caz de incident. `projects` sunt avioanele diferite din flotă (Chromium, Firefox, WebKit) care zboară exact aceeași rută. Când aeroportul de destinație e chiar pe propria pistă (o aplicație locală), `webServer` este turnul de control: nu se decolează până când aplicația nu confirmă că este deschisă.
:::

### 3.10 🧠 Challenge de Interviu (Întrebare Tehnică)

::: info 📝 Intervievatorul
„Care este diferența dintre timeout, expect.timeout și actionTimeout în Playwright? Un test îți pică cu «Test timeout of 30000ms exceeded». Ce verifici?”
:::

**Răspunsul tău de inginer:** *„Sunt trei niveluri diferite. \`timeout\` este bugetul total al unui test (implicit 30 de secunde), care include și fixture-urile. \`expect.timeout\` este cât reîncearcă o singură asertare web-first (implicit 5 secunde). \`actionTimeout\` limitează o singură acțiune, ca \`click\` sau \`fill\` (implicit nelimitată, deci practic limitată de timeout-ul testului). Dacă testul a depășit 30 de secunde, nu cresc imediat timeout-ul: deschid trace-ul și caut pasul blocat. De obicei, un click așteaptă un element care nu devine niciodată acționabil – e acoperit de un pop-up (ca modul Chaos din Sesiunea 6), e disabled sau locatorul nu se potrivește. Setez un \`actionTimeout\` rezonabil, ca eroarea să apară rapid și să indice exact acțiunea problematică.”*

### 3.11 🤖 Mentalitatea de Inginer în Era AI: Config-ul „umflat”

::: warning 🛡️
QA vs. AI: Opțiuni care nu există și setări periculoase Capcana: Cere-i unui AI un `playwright.config.ts` „complet” și vei primi adesea zeci de opțiuni: unele inutile, altele inventate (halucinate) sau mutate din alte unelte (de exemplu `defaultCommandTimeout`, care este o opțiune Cypress). Frecvent vei vedea și `retries: 3` peste tot sau `timeout: 120000`, care ascund probleme reale. Cum gândește un inginer QA: Fiecare linie din config trebuie să aibă o justificare. Inginerul păstrează config-ul minimal, verifică opțiunile în documentația oficială (sau lasă TypeScript să le valideze prin `defineConfig`) și cere AI-ului: *„Generează un config Playwright Test pentru o aplicație statică publicată la https\://tasktracker.qualiadept.eu, cu baseURL din variabila BASE_URL, trace on-first-retry, screenshot only-on-failure și 3 proiecte desktop. Explică fiecare opțiune într-un comentariu.”* Valoarea ta pe piață: Config-ul este codul cu cel mai mare impact din tot framework-ul: o linie greșită afectează toate testele. Inginerul care îl înțelege linie cu linie este cel care deține framework-ul.
:::

### 3.12 Exerciții Practice

**Exercițiul 1 – baseURL.** Setează `baseURL` în config și modifică `example.spec.ts` astfel încât să folosească `page.goto('/')`. (Indiciu: baseURL \= `https://playwright.dev`.)

**🗝️ Rezolvare – Exercițiul 1**   *(încearcă singur înainte să citești)*

**📋 Cod 3.22** · `📄 playwright.config.ts (fragment)`

```ts
use: {
  baseURL: 'https://playwright.dev',
  trace: 'on-first-retry',
},
```

**📋 Cod 3.23** · `📄 tests/example.spec.ts (cu baseURL)`

```ts
import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(/Playwright/);
});

test('get started link', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('link', { name: 'Get started' }).click();

    await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});
```

**Exercițiul 2 – Doar Chromium, vizibil.** Fără să modifici config-ul, rulează testele doar pe Chromium, cu fereastra vizibilă.

**🗝️ Rezolvare – Exercițiul 2**   *(încearcă singur înainte să citești)*

**📋 Cod 3.24** · `📄 Terminal`

```bash
npx playwright test --project=chromium --headed
```

**Exercițiul 3 – Mobil.** Adaugă un proiect `Mobile Safari` cu profilul `devices['iPhone 15']` (sau alt iPhone disponibil în autocompletare) și rulează doar acest proiect.

**🗝️ Rezolvare – Exercițiul 3**   *(încearcă singur înainte să citești)*

**📋 Cod 3.25** · `📄 playwright.config.ts (fragment projects)`

```ts
projects: [
  { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  { name: 'firefox',  use: { ...devices['Desktop Firefox'] } },
  { name: 'webkit',   use: { ...devices['Desktop Safari'] } },
  { name: 'Mobile Safari', use: { ...devices['iPhone 15'] } },
],
```

**📋 Cod 3.26** · `📄 Terminal`

```bash
npx playwright test --project="Mobile Safari"
```

Ghilimelele sunt necesare din cauza spațiului din nume. Profilul iPhone folosește motorul WebKit.

**Exercițiul 4 – Dovada la eșec.** Configurează `screenshot: 'only-on-failure'` și `trace: 'retain-on-failure'`, strică intenționat un test și găsește în `test-results/` captura și fișierul `trace.zip`.

**🗝️ Rezolvare – Exercițiul 4**   *(încearcă singur înainte să citești)*

**📋 Cod 3.27** · `📄 playwright.config.ts (fragment use)`

```ts
use: {
  baseURL: 'https://playwright.dev',
  screenshot: 'only-on-failure',
  trace: 'retain-on-failure',
},
```

**📋 Cod 3.28** · `📄 tests/example.spec.ts (stricat intenționat)`

```ts
test('has title', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(/Titlu inexistent/);
});
```

**📋 Cod 3.29** · `📄 Structura din test-results/ după rulare`

```text
test-results/
└── example-has-title-chromium/     ├── test-failed-1.png      ← captura de ecran
└── trace.zip              ← „cutia neagră”
```

**📋 Cod 3.30** · `📄 Terminal`

```bash
npx playwright test --project=chromium
npx playwright show-trace test-results/example-has-title-chromium/trace.zip
```

Numele exact al folderului poate diferi ușor (Playwright îl scurtează și adaugă un hash dacă e prea lung). Testele care trec nu lasă artefacte, datorită opțiunilor `only-on-failure` și `retain-on-failure`.

---

## Capitolul 4: CLI-ul Playwright – Telecomanda Framework-ului

### Obiective de învățare

::: info 🎯 Obiective de învățare
La finalul acestui capitol, vei fi capabil să:
- Rulezi testele în toate modurile importante: headless, headed, un singur proiect, un singur fișier, un singur test.
- Filtrezi testele după titlu, tag sau linie de cod și reiei doar testele picate.
- Folosești modurile de debugging: `--debug` (Inspector), `--ui` (UI Mode) și `show-trace` (Trace Viewer).
- Gestionezi browserele și rapoartele din linia de comandă.
- Ai la îndemână un „cheat-sheet” cu comenzile pe care le vei folosi zilnic ca QA Automation Engineer.
:::

### 4.1 Ce este un CLI și de ce îl folosim?

**CLI** (Command Line Interface) înseamnă că dai comenzi scrise în terminal, în loc să apeși butoane. Pentru un QA Automation Engineer, CLI-ul este vital din două motive: (1) este mai rapid decât orice interfață grafică, odată ce îl stăpânești; (2) **pipeline-ul CI/CD (Sesiunea 19) nu are mouse**. Tot ce face GitHub Actions este să ruleze exact aceleași comenzi pe care le înveți azi.

Toate comenzile încep cu `npx playwright`. Subcomanda `test` este runner-ul; celelalte (`codegen`, `show-report`, `show-trace`, `install`) sunt unelte auxiliare.

**📋 Cod 4.01** · `📄 Terminal`

```bash
npx playwright --help         # lista tuturor subcomenzilor
npx playwright test --help

# toate opțiunile runner-ului
```

::: tip ✍️ Exercițiu de fixare 4.1 (noțiune conceptuală)
Rulează `npx playwright test --help` și găsește în listă trei opțiuni care nu apar în acest capitol. Pentru fiecare, scrie într-o frază ce face și când ți-ar putea fi utilă.
:::

**🗝️ Rezolvare 4.1**   *(încearcă singur înainte să citești)*

Exemple valide: `--shard` (împarte suita pe mai multe mașini), `--timeout` (suprascrie timeout-ul testelor), `--reporter` (alege reporterul fără să modifici config-ul), `--update-snapshots` (actualizează capturile de referință), `--pass-with-no-tests`.

### 4.2 Comenzile de rulare

**📋 Cod 4.02** · `📄 Rulare de bază`

```ts
npx playwright test                         # toate testele, toate proiectele, headless
npx playwright test --headed                # cu fereastra browserului vizibilă
npx playwright test --project=chromium      # doar un proiect (browser)
npx playwright test tests/task-tracker.spec.ts

# doar un fișier
npx playwright test task-tracker

# fișierele care conțin „task-tracker” în cale
npx playwright test tests/task-tracker.spec.ts:12  # doar testul de la linia 12
npx playwright test --workers=1

# secvențial (util la debugging)
```

#### 🧪 Exemplu E2E 4.2 – Un fișier de antrenament pentru CLI

Folosește acest fișier pentru toate exercițiile de rulare și filtrare. Numerele liniilor contează în exercițiu:

**📋 Cod 4.03** · `📄 tests/04-cli.spec.ts`

```bash
import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
await page.goto('/');
});

test('lista inițială are 5 task-uri', async ({ page }) => {
await expect(page.getByTestId('task-list').locator('.task-item')).toHaveCount(5);
});

test('butonul Salvează este dezactivat inițial', async ({ page }) => {
await expect(page.getByTestId('submit-task-btn')).toBeDisabled();
});

test('mesajul de eroare apare când golesc câmpul', async ({ page }) => {
const input = page.getByTestId('input-task-name');

await input.fill('x');

await input.fill('');

await expect(page.getByTestId('error-message')).toBeVisible();
});
```

::: tip ✍️ Exercițiu de fixare 4.2
Scrie comanda care: rulează doar testul de la linia 15; rulează doar testul despre butonul Salvează, folosind titlul; rulează tot fișierul doar pe Firefox, cu fereastra vizibilă; rulează tot fișierul secvențial, cu un singur worker.
:::

**🗝️ Rezolvare 4.2**   *(încearcă singur înainte să citești)*

**📋 Cod 4.04** · `📄 Soluții`

```ts
npx playwright test tests/04-cli.spec.ts:15
npx playwright test -g "butonul Salvează"
npx playwright test tests/04-cli.spec.ts --project=firefox --headed
npx playwright test tests/04-cli.spec.ts --workers=1
```

### 4.3 Filtrare și selecție

Pe măsură ce suita crește de la 5 la 500 de teste, nu vei mai rula totul la fiecare modificare. Playwright oferă mai multe „site” de filtrare:

| Comandă | Ce face |
| ----- | ----- |
| `-g "adaugă task"` sau `--grep` | Rulează doar testele al căror titlu se potrivește cu textul / expresia regulată. |
| `--grep-invert "@slow"` | Exclude testele care se potrivesc. |
| `--grep @smoke` | Rulează testele etichetate cu tag-ul `@smoke`. |
| `--last-failed` | Reia doar testele picate la rularea anterioară. |
| `--only-changed` | Rulează testele din fișierele modificate față de Git. |
| `--list` | Afișează testele care ar rula, fără să le execute. |
| `--repeat-each=10` | Rulează fiecare test de 10 ori – vânătoare de teste flaky. |
| `-x` sau `--max-failures=1` | Se oprește la primul eșec. |

Tag-urile se adaugă direct în definiția testului:

**📋 Cod 4.05** · `📄 tests/task-tracker.spec.ts`

```ts
test('pagina se încarcă', { tag: '@smoke' }, async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(/Task Tracker/);
});

test(
  'ștergerea unui task pe rețea'
  , { tag: ['@regression', '@slow'] }, async ({ page }) => {
    // ...
});
```

::: warning ⚠️
test.only și test.skip În cod poți folosi `test.only(...)` pentru a rula temporar un singur test și `test.skip(...)` pentru a-l sări. Un `test.only` uitat în cod ar face ca în CI să ruleze un singur test din 500, iar pipeline-ul să pară „verde”. De aceea config-ul are `forbidOnly: !!process.env.CI`: în CI, un `test.only` uitat face rularea să eșueze imediat.
:::

::: tip ✍️ Exercițiu de fixare 4.3
Etichetează primele două teste din `04-cli.spec.ts` cu `@smoke`, iar pe al treilea cu `@regression`. Scrie comenzile care rulează: doar `@smoke`; tot în afară de `@regression`; testul cu mesajul de eroare de 5 ori la rând. Rulează `--last-failed` imediat după o rulare fără eșecuri. Ce se întâmplă?
:::

**🗝️ Rezolvare 4.3**   *(încearcă singur înainte să citești)*

**📋 Cod 4.06** · `📄 Soluții`

```ts
npx playwright test --grep @smoke
npx playwright test --grep-invert @regression
npx playwright test -g "mesajul de eroare" --repeat-each=5
```

Tag-urile se adaugă astfel: `test('lista inițială are 5 task-uri', { tag: '@smoke' }, async ({ page }) => { ... })`. După o rulare fără eșecuri, `--last-failed` nu găsește teste de reluat și raportează că nu există teste de rulat.

### 4.4 Debugging: Inspector, UI Mode și Trace Viewer

#### --debug – Playwright Inspector

**📋 Cod 4.07** · `📄 Terminal`

```bash
npx playwright test tests/task-tracker.spec.ts --debug
```

Rulează testul cu fereastra vizibilă, cu un singur worker și fără timeout, și deschide **Playwright Inspector**. Testul se oprește înaintea primei acțiuni, iar tu avansezi pas cu pas (Step over), vezi locatorul evidențiat în pagină și poți edita locatorii live. În cod, același efect îl obții cu `await page.pause()`.

#### --ui – UI Mode

**📋 Cod 4.08** · `📄 Terminal`

```bash
npx playwright test --ui
```

UI Mode este „centrul de comandă vizual”: lista tuturor testelor, rulare cu un click, **mod watch** (re-rulează testul la fiecare salvare a fișierului) și o cronologie (timeline) în care vezi, pentru fiecare pas, starea DOM-ului înainte și după acțiune, rețeaua și consola. Este cel mai bun mod de lucru zilnic.

#### show-trace și show-report

**📋 Cod 4.09** · `📄 Terminal`

```bash
npx playwright show-report                       # raportul HTML al ultimei rulări
npx playwright show-trace test-results/.../trace.zip   # deschide o „cutie neagră”
npx playwright test --trace on                   # forțează trace pentru toate testele
```

#### 🧪 Exemplu E2E 4.4 – Pauză controlată cu page.pause()

**📋 Cod 4.10** · `📄 tests/04-debug.spec.ts`

```ts
import { test, expect } from '@playwright/test';

test(
  'investighez ștergerea unui task'
  , async ({ page }) => {
    await page.goto('/');

    await expect(page.getByTestId('task-list').locator('.task-item')).toHaveCount(5);

    await page.pause();   // se deschide Inspectorul: explorează pagina, apoi Resume

    await page.getByTestId('delete-btn-1').click();

    await expect(page.getByTestId('delete-btn-1')).toHaveCount(0);

    await expect(page.getByTestId('task-list').locator('.task-item')).toHaveCount(4);
});
```

Rulează-l cu `npx playwright test tests/04-debug.spec.ts --headed --project=chromium`. Testul se oprește la `page.pause()`, iar tu poți inspecta locatorii înainte de ștergere.

::: tip ✍️ Exercițiu de fixare 4.4
Rulează același test în UI Mode. În cronologie, selectează pasul `click` și găsește în tab-ul Network cererea `DELETE`. Ce URL și ce status are? Rulează testul cu `--trace on`, deschide trace-ul cu `show-trace` și notează textul afișat pe buton în timpul ștergerii (snapshot-ul „After” al pasului `click`).
:::

**🗝️ Rezolvare 4.4**   *(încearcă singur înainte să citești)*

Cererea este `DELETE https://jsonplaceholder.typicode.com/todos/1`, cu status 200. În timpul ștergerii, butonul afișează „Se șterge...”, iar rândul devine semitransparent (opacity 0.6), exact logica scrisă în Sesiunea 6.

### 4.5 Gestionarea browserelor și utilitare

**📋 Cod 4.11** · `📄 Terminal`

```bash
npx playwright install                 # instalează / actualizează browserele
npx playwright install --with-deps

# \+ dependențele de sistem (Linux, CI)
npx playwright uninstall               # curăță browserele din cache
npx playwright --version               # versiunea instalată
npx playwright open https://tasktracker.qualiadept.eu        # deschide un browser Playwright pe URL
npx playwright screenshot https://tasktracker.qualiadept.eu home.png   # captură rapidă din CLI
```

#### 🧪 Exemplu E2E 4.5 – Captura din CLI vs. captura din test

**📋 Cod 4.12** · `📄 Terminal – captură rapidă, fără test`

```bash
npx playwright screenshot --full-page https://tasktracker.qualiadept.eu task-tracker.png
```

**📋 Cod 4.13** · `📄 tests/04-captura.spec.ts`

```ts
import { test, expect } from '@playwright/test';

test('captură completă după încărcarea datelor', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByTestId('loading-spinner')).toBeHidden();

    await page.screenshot({ path: 'test-results/task-tracker-full.png', fullPage: true });
});
```

::: tip ✍️ Exercițiu de fixare 4.5
Compară cele două capturi. În care dintre ele se vede spinner-ul „Se încarcă datele de la server...” și de ce? Ce ai adăuga comenzii CLI ca să aștepte lista? (Indiciu: `npx playwright screenshot --help`.)
:::

**🗝️ Rezolvare 4.5**   *(încearcă singur înainte să citești)*

Captura din CLI se face imediat după `load`, înainte să sosească datele, deci prinde spinner-ul. Testul așteaptă explicit `toBeHidden()`. În CLI poți adăuga `--wait-for-selector="[data-testid='task-list'] .task-item"`.

### 4.6 Cheat-sheet CLI (de printat și lipit lângă monitor)

| Comandă | Când o folosești |
| ----- | ----- |
| `npx playwright test` | Rularea completă (cum rulează în CI) |
| `npx playwright test --ui` | Lucrul zilnic: scrii, rulezi, depanezi |
| `npx playwright test --headed --project=chromium` | Vrei să vezi ce face robotul |
| `npx playwright test -g "titlu"` | Rulezi un singur scenariu după nume |
| `npx playwright test --last-failed` | Repari testele picate, unul câte unul |
| `npx playwright test --debug` | Pas cu pas, în Inspector |
| `npx playwright test --repeat-each=20 --workers=4` | Verifici dacă un test e flaky |
| `npx playwright show-report` | Analizezi rezultatele |
| `npx playwright show-trace trace.zip` | Investighezi un eșec din CI |
| `npx playwright codegen https://tasktracker.qualiadept.eu` | Înregistrezi un flux nou (Capitolul 5) |
| `npx playwright install` | După fiecare actualizare a Playwright |

::: tip ✍️ Exercițiu de fixare 4.6
Acoperă tabelul de mai sus și scrie din memorie comanda pentru fiecare situație: Vrei să vezi ce face robotul în Chromium. Ai reparat un bug și vrei să rulezi doar testele picate anterior. Un coleg ți-a trimis fișierul `trace.zip` din CI. Bănuiești că un test este flaky. Ai instalat o versiune nouă de Playwright.
:::

**🗝️ Rezolvare 4.6**   *(încearcă singur înainte să citești)*

1. `npx playwright test --headed --project=chromium` 2. `npx playwright test --last-failed` 3. `npx playwright show-trace trace.zip` 4. `npx playwright test -g "titlu" --repeat-each=20` 5. `npx playwright install`

### 4.7 💡 Știați că...?

::: tip 💡 Știați că… Trace Viewer rulează și fără Playwright instalat
la adresa trace.playwright.dev poți încărca un `trace.zip`, iar fișierul este procesat local, în browserul tău, fără să fie trimis pe vreun server. Poți trimite trace-ul unui developer care nu are proiectul instalat. `--shard=1/4` împarte suita în 4 bucăți care pot rula pe 4 mașini de CI diferite. Rapoartele se combină apoi cu `npx playwright merge-reports`. Așa reduc companiile mari regresia de 2 ore la 20 de minute. Extensia de VS Code folosește același CLI în spate: butonul verde de „Run” de lângă fiecare test execută `playwright test` cu filtrele potrivite. Tot ce înveți în terminal funcționează identic și în editor.
:::

### 4.8 📖 Poveste Aplicată: „Telecomanda televizorului”

::: info 📖
Suita ta de teste este un televizor cu 500 de canale. `npx playwright test` îl pornește pe toate canalele deodată. `--project=chromium` alege un singur post. `-g "login"` este căutarea după numele emisiunii. `--last-failed` este butonul „înapoi la canalul anterior”, iar `--repeat-each` este reluarea aceleiași scene de 10 ori ca să vezi dacă imaginea „sare”. `--debug` este butonul de pauză cu derulare cadru cu cadru, iar `--ui` este ghidul TV interactiv, unde vezi tot programul și pornești orice emisiune cu un click. Un inginer bun nu se uită la toate canalele deodată când caută un singur meci.
:::

### 4.9 🧠 Challenge de Interviu (Întrebare Tehnică)

::: info 📝 Intervievatorul
„Un test pică în CI aproximativ o dată din 10 rulări, dar local trece mereu. Descrie-mi, comandă cu comandă, cum îl investighezi.”
:::

**Răspunsul tău de inginer:** *„Mai întâi descarc artefactele din CI și deschid trace-ul testului picat cu \`npx playwright show-trace\`, ca să văd exact pasul, starea DOM-ului și rețeaua la momentul eșecului. Apoi încerc să reproduc local condițiile din CI: rulez headless, cu mai mulți workers, de multe ori – \`npx playwright test -g "numele testului" --repeat-each=30 --workers=4\`. Dacă pică doar în paralel, suspectez date de test partajate între teste. Dacă pică pe un anumit browser, filtrez cu \`--project\`. Odată reprodus, folosesc \`--debug\` sau UI Mode pentru a găsi cauza: un pop-up aleatoriu, o asertare fără web-first sau un răspuns API lent. Nu rezolv problema crescând numărul de \`retries\`.”*

### 4.10 🤖 Mentalitatea de Inginer în Era AI: Terminalul ca sursă de adevăr

::: warning 🛡️
QA vs. AI: Comenzi inventate Capcana: AI-ul poate „inventa” flag-uri plauzibile care nu există (de exemplu `--browser=all` combinat cu proiecte sau `--retry-failed`) sau poate confunda opțiunile Playwright cu cele din Jest, Cypress ori Selenium. Cum gândește un inginer QA: Rulează `npx playwright test --help`. Ieșirea comenzii este documentația exactă a versiunii tale, mereu actualizată. Inginerul lipește acest output în promptul AI-ului: *„Acestea sunt opțiunile CLI disponibile în versiunea mea. Construiește comanda folosind doar aceste flag-uri.”* Valoarea ta pe piață: Diferența dintre un junior și un mid este adesea viteza de diagnostic. Un inginer care știe să combine `--grep`, `--project`, `--repeat-each` și `show-trace` găsește în 10 minute cauza unui test flaky pe care alții îl „repară” zile întregi prin încercări.
:::

### 4.11 Exerciții Practice

**Exercițiul 1.** Rulează doar testul „get started link” din `example.spec.ts`, doar pe Firefox, cu fereastra vizibilă.

**🗝️ Rezolvare – Exercițiul 1**   *(încearcă singur înainte să citești)*

**📋 Cod 4.14** · `📄 Terminal`

```bash
npx playwright test -g "get started link" --project=firefox --headed
```

**Exercițiul 2.** Adaugă tag-ul `@smoke` testului „has title” și rulează doar testele `@smoke`.

**🗝️ Rezolvare – Exercițiul 2**   *(încearcă singur înainte să citești)*

**📋 Cod 4.15** · `📄 tests/example.spec.ts (fragment)`

```ts
test('has title', { tag: '@smoke' }, async ({ page }) => {
    await page.goto('https://playwright.dev/');

      await expect(page).toHaveTitle(/Playwright/);
  });
```

**📋 Cod 4.16** · `📄 Terminal`

```bash
npx playwright test --grep @smoke
```

Rulează 3 execuții: testul „has title” pe cele 3 proiecte.

**Exercițiul 3.** Afișează lista tuturor testelor fără să le rulezi. Câte rânduri vezi și de ce?

**🗝️ Rezolvare – Exercițiul 3**   *(încearcă singur înainte să citești)*

**📋 Cod 4.17** · `📄 Terminal`

```bash
npx playwright test --list
```

**📋 Cod 4.18** · `📄 Rezultatul`

```text
Listing tests:

[chromium] › example.spec.ts:3:5 › has title

[chromium] › example.spec.ts:10:5 › get started link

[firefox] › example.spec.ts:3:5 › has title

[firefox] › example.spec.ts:10:5 › get started link

[webkit] › example.spec.ts:3:5 › has title

[webkit] › example.spec.ts:10:5 › get started link
Total: 6 tests in 1 file
```

Vezi 6 rânduri: 2 teste × 3 proiecte. Fiecare combinație test–proiect este o execuție separată.

**Exercițiul 4.** Deschide UI Mode, activează modul watch pentru un test și modifică textul unei asertări. Ce observi?

**🗝️ Rezolvare – Exercițiul 4**   *(încearcă singur înainte să citești)*

**📋 Cod 4.19** · `📄 Terminal`

```bash
npx playwright test --ui
```

În lista din stânga, treci cu mouse-ul peste test și apasă iconița în formă de ochi (**Watch**). Modifică în VS Code `/Playwright/` cu `/Selenium/` și salvează (Ctrl+S). UI Mode re-rulează automat testul, iar acesta devine roșu. Revino la text, salvează din nou și testul redevine verde. Feedback-ul vine în câteva secunde, fără nicio comandă.

---

## Capitolul 5: Playwright Codegen – Robotul care învață privindu-te

### Obiective de învățare

::: info 🎯 Obiective de învățare
La finalul acestui capitol, vei fi capabil să:
- Explici ce este Playwright Codegen și cum alege locatorii pentru elementele pe care dai click.
- Pornești Codegen din terminal cu opțiunile utile (URL, fișier de ieșire, dispozitiv, viewport, limbaj).
- Folosești Playwright Inspector: Record, Pick locator și instrumentele de asertare.
- Înregistrezi primul flux E2E pe aplicația Task Tracker construită de tine.
- Transformi codul brut generat într-un test curat, robust, gata de code review.
- Recunoști limitele Codegen și momentele în care NU trebuie să te bazezi pe el.
:::

### 5.1 Ce este Codegen?

**Codegen** (Code Generator) este un înregistrator: deschide un browser, „privește” ce faci (click-uri, completări de text, selecții) și scrie, în timp real, codul Playwright echivalent. Este cel mai rapid mod de a învăța sintaxa și de a obține o primă ciornă pentru un flux nou.

![Figura 5.1 – De la înregistrare la cod de producție: pasul 6 este responsabilitatea inginerului](/images/sessions/premium/session-9/image11.png)

*Figura 5.1 – De la înregistrare la cod de producție: pasul 6 este responsabilitatea inginerului*

**Cum alege Codegen locatorii?** Pentru fiecare element pe care interacționezi, generatorul analizează DOM-ul și caută cel mai robust locator **unic**. Ordinea de preferință este: atributul de test (`data-testid`, prin `getByTestId`), apoi rolul de accesibilitate cu numele accesibil (`getByRole`), apoi eticheta, placeholder-ul, textul și, abia la final, selectorii CSS. Dacă locatorul găsit se potrivește cu mai multe elemente, generatorul îl rafinează până devine unic.

::: tip 🏆
Recompensa pentru munca din Sesiunea 6 Pentru că în Sesiunea 6 ai pus `data-testid` pe input, pe buton, pe listă și pe mesajul de eroare, Codegen va genera pentru aplicația ta locatori ca `getByTestId('input-task-name')` – stabili, scurți, independenți de CSS și de texte. Pe o aplicație fără atribute de test, același click ar fi produs ceva fragil, de tipul `locator('div:nth-child(3) > form > button')`.
:::

#### 🧪 Exemplu E2E 5.1 – Ordinea de preferință a locatorilor, pe Task Tracker

Nu toate elementele din aplicație au `data-testid`. Pentru acestea, Codegen coboară în ordinea de preferință:

**📋 Cod 5.01** · `📄 tests/05-prioritate-locatori.spec.ts`

```ts
import { test, expect } from '@playwright/test';

test('locatorii pe care Codegen i-ar alege', async ({ page }) => {
    await page.goto('/');

    // 1. Are data-testid -> prioritate maximă

    await expect(page.getByTestId('task-list')).toBeVisible();

    // 2. Fără data-testid, dar cu rol de accesibilitate (h1) -> getByRole

    await expect(page.getByRole('heading', { name: 'QA Task Tracker' })).toBeVisible();

    // 3. Fără rol relevant (un simplu span) -> textul vizibil

    await expect(page.getByText('API Online')).toBeVisible();
});
```

::: tip ✍️ Exercițiu de fixare 5.1
Înainte să deschizi Codegen, prezice locatorul pe care îl va genera pentru: butonul Salvează, titlul secțiunii de listă (`h2`), textul primului task și butonul Șterge al acestuia. Verifică apoi cu Pick locator și notează unde ai greșit.
:::

**🗝️ Rezolvare 5.1**   *(încearcă singur înainte să citești)*

`getByTestId('submit-task-btn')` (are atribut de test), `getByRole('heading', { name: 'Scenarii de Testare (Live)' })` (titlul `h2` al listei din S6), `getByText('delectus aut autem')` și `getByTestId('delete-btn-1')`. Greșeala cea mai frecventă este să alegi un selector CSS când există un rol sau un text unic.

**📋 Cod 5.02** · `📄 tests/05-predictie-locatori.spec.ts`

```ts
import { test, expect } from '@playwright/test';

test('locatorii preziși există și sunt unici', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByTestId('submit-task-btn')).toHaveCount(1);

    await expect(page.getByRole('heading', { name: 'Scenarii de Testare (Live)' })).toHaveCount(1);

    await expect(page.getByText('delectus aut autem')).toHaveCount(1);

    await expect(page.getByTestId('delete-btn-1')).toHaveCount(1);
});
```

### 5.2 Pornirea Codegen și opțiunile utile

**📋 Cod 5.03** · `📄 Terminal`

```bash
# Pornește Codegen direct pe aplicația cursului
npx playwright codegen https://tasktracker.qualiadept.eu

# Varianta locală (aplicația ta din S6, pornită cu npx serve, vezi 3.6)
npx playwright codegen http://localhost:3000
```

| Opțiune | Efect |
| ----- | ----- |
| `-o tests/inregistrare.spec.ts` | Salvează direct codul generat într-un fișier. |
| `--target=playwright-test` | Limbajul generat: `playwright-test` (TS, implicit), `javascript`, `python-pytest`, `java`, `csharp` etc. |
| `--browser=firefox` (sau `-b webkit`) | Înregistrează într-un alt motor de browser. |
| `--device="iPhone 15"` | Emulează un dispozitiv mobil (viewport, touch, user agent). |
| `--viewport-size="1280,720"` | Fixează dimensiunea ferestrei. |
| `--color-scheme=dark` | Emulează tema întunecată a sistemului. |
| `--lang=ro-RO` / `--timezone="Europe/Bucharest"` | Limba și fusul orar ale browserului. |
| `--test-id-attribute=data-qa` | Dacă echipa folosește alt atribut de test decât `data-testid`. |
| `--save-storage=auth.json` / `--load-storage=auth.json` | Salvează / reîncarcă cookies și localStorage (vom folosi la autentificare, în Sesiunea 15). |

#### 🧪 Exemplu E2E 5.2 – Un test înregistrat cu --device, după curățare

**📋 Cod 5.04** · `📄 tests/05-codegen-mobil.spec.ts`

```ts
import { test, expect, devices } from '@playwright/test';

// Generat cu: npx playwright codegen --device="iPhone 15" https://tasktracker.qualiadept.eu
test.use({ ...devices['iPhone 15'] });

test('pe iPhone, utilizatorul adaugă un task', async ({ page }) => {
    await page.goto('/');

    await page.getByTestId('input-task-name').fill('Task de pe mobil');

    await page.getByTestId('submit-task-btn').tap();     // atingere, nu click

    await expect(page.getByTestId('task-list')).toContainText('Task de pe mobil');
});
```

::: tip ✍️ Exercițiu de fixare 5.2
Înregistrează același flux cu `--target=python-pytest` și salvează-l cu `-o tests/flux.py`. Notează trei diferențe față de varianta TypeScript. Înregistrează fluxul cu `--viewport-size="800,600" --color-scheme=dark`. Ce linie nouă apare în codul generat?
:::

**🗝️ Rezolvare 5.2**   *(încearcă singur înainte să citești)*

Codul generat pentru Python arată aproximativ așa:

**📋 Cod 5.05** · `📄 tests/flux.py (generat cu --target=python-pytest)`

```ts
import re
from playwright.sync_api import Page, expect

def test_example(page: Page) -> None:

page.goto("https://tasktracker.qualiadept.eu/")

  page.get_by_test_id("input-task-name").fill("Testare Codegen")

  page.get_by_test_id("submit-task-btn").click()

  expect(page.get_by_test_id("task-list")).to_contain_text("Testare Codegen")
```

Trei diferențe față de TypeScript: API sincron (fără `await`), metode în stil `snake_case` (`get_by_test_id`, `to_contain_text`) și testul este o funcție pytest care primește `page: Page` ca parametru.

Cu `--viewport-size="800,600" --color-scheme=dark`, la începutul fișierului apare un bloc de configurare:

**📋 Cod 5.06** · `📄 Linia nouă din codul generat`

```ts
test.use({
    colorScheme: 'dark',
    viewport: { width: 800, height: 600 },
});
```

### 5.3 Playwright Inspector: cele două ferestre

Codegen deschide **două ferestre**: în stânga, un browser Chromium controlat de Playwright; în dreapta, **Playwright Inspector**, unde apare codul.

![Figura 5.2 – Browserul înregistrat (stânga) și Inspectorul cu codul generat (dreapta) – ilustrativ](/images/sessions/premium/session-9/image12.png)

*Figura 5.2 – Browserul înregistrat (stânga) și Inspectorul cu codul generat (dreapta) – ilustrativ*

| Buton din Inspector | Rol |
| ----- | ----- |
| ● Record | Pornește / oprește înregistrarea. Este activ implicit. |
| Pick locator | Treci cu mouse-ul peste un element și vezi locatorul propus, fără să înregistrezi o acțiune. Perfect pentru a „împrumuta” un locator. |
| Assert visibility | Click pe un element → generează `expect(...).toBeVisible()`. |
| Assert text | Click pe un element → generează `expect(...).toContainText(...)`. |
| Assert value | Click pe un input → generează `expect(...).toHaveValue(...)`. |
| Target (meniul din dreapta) | Schimbi limbajul codului generat (TypeScript Test, Python, Java, C\#). |
| Copy | Copiază codul în clipboard. |

::: info 🧩
Codegen direct din VS Code În panoul Testing al extensiei Playwright găsești: Record new (creează un fișier de test nou și înregistrează), Record at cursor (înregistrează acțiuni și le inserează exact unde se află cursorul, într-un test existent) și Pick locator. Pentru un test existent, poți pune `await page.pause();` în cod: la rulare, se deschide Inspectorul cu butonul Record disponibil.
:::

#### 🧪 Exemplu E2E 5.3 – Cele trei asertări generate din Inspector

**📋 Cod 5.07** · `📄 tests/05-asertari-inspector.spec.ts`

```ts
import { test, expect } from '@playwright/test';

test('asertările generate cu butoanele Assert', async ({ page }) => {
    await page.goto('/');

    await page.getByTestId('input-task-name').fill('Assert value');

    // Assert value

    await expect(page.getByTestId('input-task-name')).toHaveValue('Assert value');

    // Assert visibility

    await expect(page.getByTestId('submit-task-btn')).toBeVisible();

    await page.getByTestId('submit-task-btn').click();

    // Assert text

    await expect(page.getByTestId('task-list')).toContainText('Assert value');
});
```

::: tip ✍️ Exercițiu de fixare 5.3
Deschide testul de mai sus în VS Code, pune cursorul înainte de ultima linie și folosește Record at cursor. Cu Assert value, adaugă o verificare că, după salvare, câmpul de text a revenit gol. Ce linie a fost inserată?
:::

**🗝️ Rezolvare 5.3**   *(încearcă singur înainte să citești)*

Linia inserată este `await expect(page.getByTestId('input-task-name')).toBeEmpty();` sau `toHaveValue('')`, în funcție de versiunea Playwright. Ambele verifică același lucru.

### 5.4 Înregistrare live pe Task Tracker (pas cu pas)

**Scenariul:** Utilizatorul deschide aplicația, așteaptă încărcarea celor 5 task-uri inițiale, adaugă task-ul „Testare Codegen” și verifică faptul că apare în listă.

1. Deschide `https://tasktracker.qualiadept.eu` în browser și verifică faptul că se încarcă cele 5 task-uri.

2. Rulează `npx playwright codegen https://tasktracker.qualiadept.eu`.

3. Când apare pop-up-ul promoțional din **modul Chaos** (Sesiunea 6, după 2–6 secunde), închide-l. Observă că și acest click este înregistrat.

4. Click în câmpul de text și scrie `Testare Codegen`.

5. Click pe butonul **Salvează**.

6. În Inspector, alege **Assert text** și dă click pe lista de task-uri. Confirmă textul `Testare Codegen`.

7. Oprește înregistrarea (Record) și copiază codul.

Codul brut generat va arăta aproximativ așa:

**📋 Cod 5.08** · `📄 Cod brut generat de Codegen (neprelucrat)`

```ts
import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
    await page.goto('https://tasktracker.qualiadept.eu/');

      await page.getByTestId('close-promo-btn').click();

      await page.getByTestId('input-task-name').click();

      await page.getByTestId('input-task-name').fill('Testare Codegen');

      await page.getByTestId('submit-task-btn').click();

      await page.getByText('delectus aut autem').click();

      await expect(page.getByTestId('task-list')).toContainText('Testare Codegen');
  });
```

::: tip ✍️ Exercițiu de fixare 5.4
Înregistrează cu Codegen un flux nou: dai click pe titlul primului task („delectus aut autem”) pentru a-l marca drept finalizat (clasa `.completed` din Sesiunea 6). Codegen nu poate genera o asertare pentru o clasă CSS. Adaugă-o tu manual. (Funcția de finalizare este cerința 9 a temei S6. Aplicația publicată la `https://tasktracker.qualiadept.eu` o are deja.)
:::

**🗝️ Rezolvare 5.4**   *(încearcă singur înainte să citești)*

**📋 Cod 5.09** · `📄 tests/05-completare-task.spec.ts`

```ts
test('utilizatorul marchează un task ca finalizat', async ({ page }) => {
    await page.goto('/');

    const titlu = page.locator('.task-title', { hasText: 'delectus aut autem' });

    await titlu.click();

    await expect(titlu).toHaveClass(/completed/);   // adăugată manual
});
```

Dacă în Sesiunea 6 ai pus clasa pe rândul `li`, verifică `page.locator('.task-item', { hasText: 'delectus aut autem' })`.

### 5.5 De la cod brut la cod de producție

Codegen a făcut o treabă foarte bună cu locatorii. Ca inginer, însă, vezi imediat cinci probleme:

| Problemă în codul brut | De ce este periculoasă |
| ----- | ----- |
| `test('test', ...)` | Titlul nu spune nimic. În raport și în CI, nimeni nu va ști ce a picat. |
| URL absolut `https://tasktracker.qualiadept.eu/` | Testul este legat de un singur mediu: nu poate rula pe aplicația ta locală sau pe altă instanță. Trebuie `page.goto('/')` + `baseURL`. |
| Click fix pe `close-promo-btn` | Pop-up-ul Chaos apare mereu, dar la un moment **aleatoriu** (între 2 și 6 secunde). Pasul fix face testul dependent de momentul înregistrării: fie așteaptă inutil până la 6 secunde, fie overlay-ul apare înaintea pasului de închidere și interceptează click-ul pe Salvează. Pe un mediu unde promoția e dezactivată, pasul pică cu timeout. |
| Click inutil pe input înainte de `fill` | `fill()` dă singur focus elementului. Este zgomot. |
| Click pe „delectus aut autem” | Un click accidental pe un task (datele vin din API și se pot schimba). Poate chiar declanșa toggle-ul `.completed`. |

#### ❌ Așa NU (codul Codegen urcat direct în repository)

Codul de mai sus, fără modificări, ar trece code review-ul doar într-o echipă fără standarde. Va fi lent sau instabil din cauza pop-up-ului și nu va funcționa pe alt mediu.

#### ✅ Așa DA (codul refactorizat de inginer)

**📋 Cod 5.10** · `📄 tests/task-tracker.spec.ts (după refactorizare)`

```ts
import { test, expect } from '@playwright/test';

test.describe('Task Tracker – adăugare task', () => {
    test.beforeEach(async ({ page }) => {
        // Pop-up-ul Chaos apare la un moment aleatoriu (2-6 s):

        // îl închidem automat, oricând ar apărea în timpul testului.

        await page.addLocatorHandler(page.getByTestId('close-promo-btn'), async (btn) => {
            await btn.click();
        });

        await page.goto('/');                       // baseURL din playwright.config.ts
    });

    test('utilizatorul adaugă un task nou și îl vede în listă', async ({ page }) => {
        const numeTask = 'Testare Codegen';

        await page.getByTestId('input-task-name').fill(numeTask);

        await page.getByTestId('submit-task-btn').click();

        await expect(page.getByTestId('task-list')).toContainText(numeTask);
    });
});
```

Ce am schimbat și de ce:

* **Titlu descriptiv** + `test.describe` pentru gruparea scenariilor aceleiași funcționalități.

* `page.goto('/')` – dependență de `baseURL`, deci același test rulează pe orice mediu.

* `page.addLocatorHandler(...)` – un „paznic” care închide pop-up-ul **doar când apare**, înaintea oricărei acțiuni. Testul devine determinist.

* Am eliminat click-urile redundante sau accidentale.

* Datele de test sunt într-o variabilă (`numeTask`) – primul pas spre Data-Driven Testing (Sesiunea 14).

::: tip 💡 Pasul următor
POM-ul din Sesiunea 8 Observi că selectorii `getByTestId(...)` apar direct în test? În Sesiunea 13 îi vom muta în clasa `TaskTrackerPage` pe care ai schițat-o în Sesiunea 8, de data aceasta cu tipurile reale `Page` și `Locator`, importate din `@playwright/test`. Codegen produce ingredientele, POM-ul le organizează.
:::

::: tip ✍️ Exercițiu de fixare 5.5
Curăță codul brut de mai jos, înregistrat pentru validarea formularului. Aplică regulile din tabelul anterior.

**📋 Cod 5.11 · 📄 Cod brut (validarea formularului)**

```ts
test('test', async ({ page }) => {
    await page.goto('https://tasktracker.qualiadept.eu/');

      await page.getByTestId('input-task-name').click();

      await page.getByTestId('input-task-name').fill('a');

      await page.getByTestId('input-task-name').press('Backspace');

      await page.getByTestId('input-task-name').fill('');

      await page.locator('section').filter({ hasText: 'Adaugă' }).click();

      await expect(page.getByTestId('error-message')).toBeVisible();
  });
```
:::

**🗝️ Rezolvare 5.5**   *(încearcă singur înainte să citești)*

**📋 Cod 5.12** · `📄 tests/05-validare-formular.spec.ts`

```ts
test('golirea câmpului afișează eroarea și blochează salvarea', async ({ page }) => {
    await page.goto('/');

    const input = page.getByTestId('input-task-name');

    await input.fill('a');

    await input.fill('');

    await expect(page.getByTestId('error-message')).toBeVisible();

    await expect(page.getByTestId('submit-task-btn')).toBeDisabled();
});
```

Am eliminat: titlul generic, URL-ul absolut, click-ul redundant, `press('Backspace')` (dublat de `fill('')`) și click-ul accidental pe `section`. Am adăugat verificarea butonului.

### 5.6 Limitele Codegen: când NU te baza pe el

* **Nu înțelege intenția de business.** Înregistrează ce faci, nu ce *ar trebui* verificat. Asertările importante le adaugi tu.

* **Nu generează logică:** fără bucle, condiții, date parametrizate sau setup prin API.

* **Înregistrează și greșelile:** click-uri accidentale, pași redundanți, pop-up-uri aleatorii.

* **Hardcodează URL-uri și date** care se schimbă între medii.

* **Nu știe de arhitectura ta:** nu folosește POM-ul, fixtures sau helpers.

* **Este o ciornă, nu un livrabil.** Regula echipelor mature: niciun cod Codegen nu intră în `main` fără refactorizare și code review.

#### 🧪 Exemplu E2E 5.6 – Asertările de business pe care Codegen nu le vede

**📋 Cod 5.13** · `📄 tests/05-reguli-business.spec.ts`

```ts
import { test, expect } from '@playwright/test';

test('după salvare, formularul revine la starea inițială', async ({ page }) => {
    await page.goto('/');

    const input = page.getByTestId('input-task-name');

    const buton = page.getByTestId('submit-task-btn');

    const randuri = page.getByTestId('task-list').locator('.task-item');

    await expect(randuri).toHaveCount(5);

    await input.fill('Verificare de business');

    await buton.click();

    await expect(page.getByTestId('task-list')).toContainText('Verificare de business');

    // Reguli din Sesiunea 6, pe care un recorder nu le poate deduce:

    await expect(randuri).toHaveCount(6);

    await expect(input).toHaveValue('');

    await expect(buton).toBeDisabled();

    await expect(buton).toHaveText('Salvează');
});
```

::: tip ✍️ Exercițiu de fixare 5.6
Scrie un test pentru regula: „Un nume format doar din spații nu este valid.” Completează câmpul cu trei spații și verifică starea butonului și a mesajului de eroare. Apoi explică de ce Codegen nu ar fi generat singur acest scenariu.
:::

**🗝️ Rezolvare 5.6**   *(încearcă singur înainte să citești)*

**📋 Cod 5.14** · `📄 tests/05-spatii.spec.ts`

```ts
test(
  'un nume format doar din spații nu este valid'
  , async ({ page }) => {
    await page.goto('/');

    await page.getByTestId('input-task-name').fill('   ');

    await expect(page.getByTestId('submit-task-btn')).toBeDisabled();

    await expect(page.getByTestId('error-message')).toBeVisible();
});
```

Codegen înregistrează doar ce faci. Ideea de a încerca spații vine din gândirea de tester (partiții de echivalență, cazuri limită), nu din interfață.

### 5.7 💡 Știați că...?

::: tip 💡
Știați că… Codegen poate genera și Python, Java sau C\# din aceeași înregistrare: schimbi „Target” în Inspector, iar codul este retradus instantaneu. Este un instrument excelent pentru a compara sintaxa între limbaje. Pick locator este cel mai subestimat buton: mulți ingineri seniori nu înregistrează aproape niciodată fluxuri întregi, dar folosesc zilnic „Pick locator” pentru a găsi rapid locatorul optim al unui element. `--save-storage=auth.json` îți permite să te autentifici o dată, manual, în Codegen și să salvezi sesiunea (cookies + localStorage). Este exact mecanismul pe care îl vom automatiza în Sesiunea 15 (Authentication State). `page.addLocatorHandler()` a fost introdus special pentru „inamicii invizibili” ai automatizării: bannere de cookies, pop-up-uri de newsletter, dialoguri „Ești sigur?”. Ce am simulat în modul Chaos din Sesiunea 6 este o problemă reală a fiecărui site comercial.
:::

### 5.8 📖 Poveste Aplicată: „Stenografa și Editorul”

::: info 📖
Codegen este o stenografă extrem de rapidă. Notează absolut tot ce spui într-o ședință, cuvânt cu cuvânt, inclusiv „ăăă”, glumele și frazele începute și abandonate. Transcrierea este 100% fidelă, dar nimeni nu ar publica-o ca atare într-un ziar. Tu ești Editorul. Iei transcrierea, păstrezi ideile esențiale (acțiunile de business), elimini zgomotul (click-urile redundante), dai un titlu clar articolului (numele testului), verifici faptele (asertările) și te asiguri că textul are sens și mâine, în alt context (baseURL, date variabile). Stenografa te face de 10 ori mai rapid; Editorul face articolul publicabil.
:::

### 5.9 🧠 Challenge de Interviu (Întrebare Tehnică)

::: info 📝 Intervievatorul
„Dacă Playwright Codegen generează teste automat, de ce mai avem nevoie de QA Automation Engineers? Nu putem pune un manual tester să înregistreze toate fluxurile?”
:::

**Răspunsul tău de inginer:** *„Codegen generează cod pentru acțiuni, nu un framework de testare. O suită înregistrată de un tester manual ar avea URL-uri hardcodate, date fixe, nicio asertare de business în afară de cele bifate explicit, cod duplicat în sute de fișiere și pași aleatorii care produc teste flaky. La prima schimbare de UI, sute de teste ar trebui reînregistrate. Rolul meu este să proiectez arhitectura (config, POM, fixtures, date de test), să decid ce se verifică și la ce nivel (UI sau API) și să integrez totul în CI/CD. Folosesc Codegen ca accelerator – pentru locatori și prima ciornă – dar codul care intră în repository este refactorizat, revizuit și aliniat la arhitectura echipei.”*

### 5.10 🤖 Mentalitatea de Inginer în Era AI: Codegen + AI \= viteză, Inginerul \= calitate

::: warning 🛡️
QA vs. AI: Generatoarele de cod nu își asumă responsabilitatea Ce fac bine uneltele: Codegen alege locatori excelenți pentru că vede DOM-ul real. Asistenții AI sunt foarte buni la refactorizare: îi dai codul brut și primești un test frumos formatat. În plus, Playwright oferă acum integrări de tip MCP (Model Context Protocol), prin care agenții AI pot controla direct un browser Playwright. Capcana: Combinația „înregistrez cu Codegen + îi cer AI-ului să curețe” poate produce cod care *arată* profesionist, dar ascunde aceleași probleme: AI-ul poate „rezolva” pop-up-ul aleatoriu cu `{ force: true }`, cu `waitForTimeout(3000)` sau cu un `try/catch` gol, adică exact anti-pattern-urile care ascund bug-uri reale. Cum gândește un inginer QA: Folosește un prompt cu reguli clare: *„Refactorizează acest cod Codegen: titlu descriptiv, \`page.goto('/')\` cu baseURL, elimină click-urile redundante, gestionează pop-up-ul \`close-promo-btn\` cu \`page.addLocatorHandler\`, fără \`force: true\`, fără \`waitForTimeout\`, fără \`try/catch\` gol, asertări web-first.”* Apoi verifică rezultatul rulând testul de 20 de ori (`--repeat-each=20`). Valoarea ta pe piață: În 2026, a genera cod de test este ieftin. Valoroasă este încrederea în suita de teste. Inginerul care poate garanta că un test verde înseamnă „aplicația funcționează” – nu „testul a fost păcălit să treacă” – este profilul pe care companiile îl caută.
:::

### 5.11 Exerciții Practice

**Exercițiul 1 – Prima înregistrare.** Înregistrează cu Codegen scenariul din 5.4 și salvează-l direct într-un fișier: `npx playwright codegen https://tasktracker.qualiadept.eu -o tests/codegen-brut.spec.ts`.

**🗝️ Rezolvare – Exercițiul 1**   *(încearcă singur înainte să citești)*

**📋 Cod 5.15** · `📄 Terminal`

```bash
npx playwright codegen https://tasktracker.qualiadept.eu -o tests/codegen-brut.spec.ts
```

După ce închizi fereastra browserului, fișierul este salvat. Conținutul arată aproximativ așa (ordinea pașilor depinde de momentul în care a apărut pop-up-ul):

**📋 Cod 5.16** · `📄 tests/codegen-brut.spec.ts (generat)`

```ts
import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
    await page.goto('https://tasktracker.qualiadept.eu/');

      await page.getByTestId('close-promo-btn').click();

      await page.getByTestId('input-task-name').click();

      await page.getByTestId('input-task-name').fill('Testare Codegen');

      await page.getByTestId('submit-task-btn').click();

      await expect(page.getByTestId('task-list')).toContainText('Testare Codegen');
  });
```

**Exercițiul 2 – Vânătoarea de locatori.** Folosind doar **Pick locator** (fără înregistrare), notează locatorii propuși pentru: câmpul de text, butonul Salvează, lista de task-uri, butonul de ștergere al primului task.

**🗝️ Rezolvare – Exercițiul 2**   *(încearcă singur înainte să citești)*

| Element | Locatorul propus |
| ----- | ----- |
| Câmpul de text | `getByTestId('input-task-name')` |
| Butonul Salvează | `getByTestId('submit-task-btn')` |
| Lista de task-uri | `getByTestId('task-list')` |
| Ștergerea primului task | `getByTestId('delete-btn-1')` |

Toate folosesc `data-testid`, pentru că are prioritate maximă în generator. Id-ul butonului de ștergere vine din datele serverului (`delete-btn-${id}`, Sesiunea 6), deci pentru task-urile adăugate de tine va fi un număr generat de `Date.now()`.

**Exercițiul 3 – Mobile.** Înregistrează același flux emulând un iPhone: `npx playwright codegen --device="iPhone 15" https://tasktracker.qualiadept.eu`. Diferă codul generat? De ce?

**🗝️ Rezolvare – Exercițiul 3**   *(încearcă singur înainte să citești)*

**📋 Cod 5.17** · `📄 tests/codegen-iphone.spec.ts (generat, aproximativ)`

```ts
import { test, expect, devices } from '@playwright/test';

test.use({
    ...devices['iPhone 15'],
});

test('test', async ({ page }) => {
    await page.goto('https://tasktracker.qualiadept.eu/');

      await page.getByTestId('input-task-name').fill('Testare Codegen');

      await page.getByTestId('submit-task-btn').click();

      await expect(page.getByTestId('task-list')).toContainText('Testare Codegen');
  });
```

Diferă doar blocul `test.use(...)` cu profilul dispozitivului. În funcție de versiune, unele atingeri pot fi înregistrate ca `tap()`. Locatorii rămân identici, pentru că se bazează pe `data-testid`, nu pe poziția din pagină.

**Exercițiul 4 – Code review.** Aplică regulile din 5.5 pe fișierul de la Exercițiul 1 și rulează-l de 10 ori: `npx playwright test codegen-brut --repeat-each=10`.

**🗝️ Rezolvare – Exercițiul 4**   *(încearcă singur înainte să citești)*

**📋 Cod 5.18** · `📄 tests/codegen-brut.spec.ts (după code review)`

```ts
import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.addLocatorHandler(page.getByTestId('close-promo-btn'), async (btn) => {
        await btn.click();
    });

    await page.goto('/');
});

test('utilizatorul adaugă un task înregistrat cu Codegen', async ({ page }) => {
    await page.getByTestId('input-task-name').fill('Testare Codegen');

    await page.getByTestId('submit-task-btn').click();

    await expect(page.getByTestId('task-list')).toContainText('Testare Codegen');
});
```

**📋 Cod 5.19** · `📄 Terminal`

```bash
npx playwright test codegen-brut --project=chromium --repeat-each=10
```

Fără `addLocatorHandler`, fiecare rulare așteaptă pop-up-ul până la 6 secunde la pasul de închidere. Dacă l-ai închis la înregistrare abia după alt click, unele rulări pică cu „element intercepts pointer events”, pentru că overlay-ul acoperă butonul Salvează. Cu handler-ul, cele 10 rulări trec, iar pop-up-ul este închis doar în momentul în care apare.

---

## Capitolul 6: Tema Sesiunii 9 & Platforma QualiAdept Cloud Evaluation

### 6.1 Tema pentru Acasă (Proiect Sesiunea 9)

::: info 🎯
Obiectivul Temei Inițializarea oficială a framework-ului de automatizare pentru aplicația Task Tracker: configurarea completă a runner-ului Playwright în `playwright.config.ts` și transcrierea, curățată, a primului test generat cu Playwright Codegen în `task-tracker.spec.ts`. Vei demonstra că știi să faci setup-ul unui proiect și că tratezi codul generat automat ca pe o ciornă, nu ca pe un livrabil.
:::

#### 🏢 Scenariul de Business

::: info 📝 Lead QA Architect-ul echipei îți scrie pe Slack
*„Ai finalizat aplicația Task Tracker (S6), migrarea la TypeScript (S7) și arhitectura OOP (S8). Acum este momentul să inițializezi oficial framework-ul de automatizare cu Playwright. Configurează \`playwright.config.ts\` astfel încât să țintească aplicația Task Tracker publicată la \`https\://tasktracker.qualiadept.eu\`, să folosească atributul \`data-testid\` pe care l-ai pus în Sesiunea 6 și să păstreze trace-uri pentru investigarea eșecurilor. Apoi înregistrează cu Codegen fluxul de adăugare a unui task, curăță codul și livrează-l ca primul nostru smoke test în \`task-tracker.spec.ts\`.”*
:::

**Notă pentru execuție:** Lucrezi local în proiectul `task-tracker-e2e` (Capitolul 2), unde rulezi efectiv testul cu `npx playwright test`. Pe platformă, în **Workspace-ul Modulului 09**, vei avea **două fișiere**: `playwright.config.ts` și `task-tracker.spec.ts`. Copiezi conținutul celor două fișiere din VS Code în editoarele corespunzătoare și apeși **Submit**. Atenție: fișierul `task-tracker.spec.ts` din Workspace pornește cu un **cod brut generat de Codegen**, pe care trebuie să-l curăți conform cerințelor 6–11. Regula 11 verifică tot textul fișierului, inclusiv comentariile.

#### 📋 Cerințe Tehnice (Acceptance Criteria pentru platforma de validare)

**Fișierul 1: `playwright.config.ts` (Setup & Arhitectură)**

1. **Importurile corecte:** importă `defineConfig` și `devices` din `@playwright/test`.

2. **Folderul de teste:** exportă implicit `defineConfig({ ... })` și setează `testDir: './tests'`.

3. **Timeout și paralelizare:** setează explicit timeout-ul unui test la 30 de secunde (`timeout: 30_000`, `30000` sau `30 * 1000`) și activează `fullyParallel: true`.

4. **Blocul `use`:** setează `baseURL: 'https://tasktracker.qualiadept.eu'`, `testIdAttribute: 'data-testid'` și `trace: 'on-first-retry'`. (Platforma acceptă și `http://localhost:3000`, dacă testezi aplicația ta locală, precum și varianta `process.env.BASE_URL ?? '...'`.)

5. **Proiecte de browser:** configurează cel puțin proiectul `chromium` folosind `devices['Desktop Chrome']` (recomandat: și `firefox`, `webkit`).

**Fișierul 2: `task-tracker.spec.ts` (Smoke Test generat cu Codegen și curățat)**

1. **Importul runner-ului:** `import { test, expect } from '@playwright/test';`

2. **Testul cu fixture-ul `page`:** definește un `test('...', async ({ page }) => { ... })` cu un **titlu descriptiv** (nu titlul implicit `'test'` generat de Codegen).

3. **Navigarea relativă:** navighează cu `await page.goto('/')`, bazându-te pe `baseURL` din config (fără URL absolut).

4. **Interacțiunea cu locatorii Codegen:** completează câmpul `page.getByTestId('input-task-name')` cu `.fill(...)` și apasă butonul `page.getByTestId('submit-task-btn')` cu `.click()`.

5. **Asertarea smoke:** verifică cu o asertare web-first că lista conține noul task: `await expect(page.getByTestId('task-list')).toContainText(...)`.

6. **Zero Hard-Wait Policy (Regulă strictă QA):** în fișierul de test sunt interzise `page.waitForTimeout(...)`, opțiunea `{ force: true }` și URL-urile absolute în `page.goto(...)`. Orice apariție duce la eșuarea validării automate!

#### 💡 Analogie QA Automation (De ce este vital pentru următoarele sesiuni)

* În **Sesiunea 10**, vei scrie manual teste complete pe acest config: `check`, `selectOption`, ștergeri, validări de erori.

* În **Sesiunea 13**, locatorii `getByTestId(...)` din test vor fi mutați în clasa `TaskTrackerPage` din Sesiunea 8 – cu tipurile reale `Page` și `Locator`.

* În **Sesiunea 19**, GitHub Actions va rula exact acest config, cu `process.env.CI` setat automat.

#### Cum te Auto-Validezi (Predarea Temei)

1. **Pasul 1:** Rulează local `npx playwright test` și asigură-te că testul trece pe toate proiectele configurate. Deschide raportul cu `npx playwright show-report`.

2. **Pasul 2:** Accesează platforma **certify.qualiadept.eu** și autentifică-te cu contul tău de GitHub.

3. **Pasul 3:** În Tabloul de Bord, localizează **Modulul 09** și apasă **Deschide Workspace**.

4. **Pasul 4:** Copiază conținutul fișierelor `playwright.config.ts` și `task-tracker.spec.ts` în tab-urile corespunzătoare din editor și apasă **Submit**.

5. **Pasul 5 (Feedback):** La 100%, primești bannerul verde și se pregătește deblocarea Modulului 10. Dacă o verificare pică, citește raportul de erori (fiecare criteriu are mesajul lui), corectează și retrimite.

### 6.2 Provocarea Bonus (Nivel Mid): Code Review pe un cod Codegen „murdar”

Un coleg junior a înregistrat fluxul de ștergere și l-a trimis direct în Pull Request. Fă code review și rescrie testul. Găsește **cel puțin 6 probleme**.

**📋 Cod 6.01** · `📄 tests/codegen-junior.spec.ts (de refactorizat)`

```ts
import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
    await page.goto('https://tasktracker.qualiadept.eu/index.html');

      await page.waitForTimeout(3000);

      await page.getByTestId('close-promo-btn').click();

      await page.getByTestId('input-task-name').click();

      await page.getByTestId('input-task-name').fill(
        'Task de șters'
      );

      await page.getByTestId('submit-task-btn').click();

      await page.locator('#active-tasks-list > li:nth-child(6) > button').click({ force: true });

      await page.locator('body').click();
  });
```

### 6.3 🗝️ Cheile de Rezolvare (Soluții & Explicații)

*Regula de Aur: nu citi soluția înainte de a te lupta cu propriul cod cel puțin 30 de minute!*

**Soluție – Fișierul 1:**

**📋 Cod 6.02** · `📄 playwright.config.ts`

```ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './tests',                 // Criteriul 2

    timeout: 30_000,                    // Criteriul 3

    fullyParallel: true,                // Criteriul 3

    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: 'html',
    use: {                              // Criteriul 4

      baseURL: 'https://tasktracker.qualiadept.eu',
      testIdAttribute: 'data-testid',
      trace: 'on-first-retry',
      screenshot: 'only-on-failure',
    },
    projects: [                         // Criteriul 5

      { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
      { name: 'firefox',  use: { ...devices['Desktop Firefox'] } },
      { name: 'webkit',   use: { ...devices['Desktop Safari'] } },
    ],
});
```

**Soluție – Fișierul 2:**

**📋 Cod 6.03** · `📄 tests/task-tracker.spec.ts`

```ts
import { test, expect } from '@playwright/test';             // Criteriul 6

test('utilizatorul adaugă un task nou și îl vede în listă', async ({ page }) => {  // Criteriul 7

    // Pop-up-ul Chaos (S6) apare la un moment aleatoriu: îl închidem automat

    await page.addLocatorHandler(page.getByTestId('close-promo-btn'), async (btn) => {
        await btn.click();
    });

    await page.goto('/');                                       // Criteriul 8

    await page.getByTestId('input-task-name').fill('Primul meu test Playwright');  // Criteriul 9

    await page.getByTestId('submit-task-btn').click();                              // Criteriul 9

    await expect(page.getByTestId('task-list')).toContainText('Primul meu test Playwright'); // Criteriul 10
});
// Criteriul 11: niciun hard wait, niciun click forțat, nicio adresă absolută.
```

**Soluție – Provocarea Bonus:**

| \# | Problema | Corectura |
| ----- | ----- | ----- |
| 1 | Titlul `'test'` | Titlu care descrie comportamentul: „utilizatorul poate șterge un task adăugat”. |
| 2 | URL absolut cu `index.html` | `page.goto('/')` + `baseURL`. |
| 3 | `waitForTimeout(3000)` (hard wait) | Eliminat: Playwright așteaptă automat; asertările web-first reîncearcă. |
| 4 | Click fix pe `close-promo-btn` | `page.addLocatorHandler(...)` – pop-up-ul apare la un moment aleatoriu (2–6 s). |
| 5 | Locator CSS fragil cu `nth-child(6)` | Locator bazat pe conținut: rândul care conține textul task-ului, apoi butonul de ștergere din acel rând. |
| 6 | `{ force: true }` | Eliminat: ascunde bug-uri reale (element acoperit / disabled). |
| 7 | Click pe `body` + click redundant pe input | Zgomot înregistrat – eliminat. |
| 8 | Nicio asertare | Testul nu verifică nimic! Adăugăm `expect(...).not.toContainText(...)`. |

**📋 Cod 6.04** · `📄 tests/sterge-task.spec.ts (refactorizat)`

```ts
import { test, expect } from '@playwright/test';

test('utilizatorul poate șterge un task adăugat', async ({ page }) => {
    const numeTask =
    'Task de șters'
    ;

    await page.addLocatorHandler(page.getByTestId('close-promo-btn'), async (btn) => {
        await btn.click();
    });

    await page.goto('/');

    await page.getByTestId('input-task-name').fill(numeTask);

    await page.getByTestId('submit-task-btn').click();

    const lista = page.getByTestId('task-list');

    await expect(lista).toContainText(numeTask);

    // Găsim rândul după text, apoi butonul de ștergere din interiorul lui

    const randTask = lista.getByRole('listitem').filter({ hasText: numeTask });

    await randTask.getByRole('button').click();

    await expect(lista).not.toContainText(numeTask);
});
```

::: info 🔭 Notă
filter() și getByRole() `filter({ hasText })` și `getByRole('listitem')` sunt locatori pe care îi vom studia în detaliu în Sesiunea 11 (Filosofia Locatorilor). Le folosim aici ca alternativă robustă la `nth-child`. Dacă rândul tău are mai multe butoane, folosește-l pe cel cu `data-testid` de forma `delete-btn-${id}`.
:::

---

## Capitolul 7: Workbook – Setup, Config, CLI & Codegen

::: info 📈
Scopul workbook-ului Acest workbook transformă teoria în reflexe. Fiecare exercițiu se lucrează în proiectul real `task-tracker-e2e`, pe aplicația Task Tracker publicată la `https://tasktracker.qualiadept.eu`. Ordinea este progresivă: de la depanarea unui config, la un mini-framework cu mai multe medii, tag-uri și proiecte.
:::

🛠️ **Setup:** deschide un terminal în VS Code, în folderul `task-tracker-e2e`. Aplicația nu trebuie pornită: este disponibilă online la `https://tasktracker.qualiadept.eu`. Doar exercițiul 5 folosește varianta locală. Rezolvarea fiecărui exercițiu se află imediat după enunț: încearcă singur înainte să o citești.

### 📍 Exercițiul 1: Detectivul de Config (5 bug-uri ascunse)

**Context E2E:** Un coleg a modificat config-ul și acum nimic nu mai rulează. Găsește cele 5 greșeli fără să rulezi testele, apoi confirmă cu VS Code (unde vezi sublinieri roșii?).

**📋 Cod 7.01** · `📄 playwright.config.ts (cu bug-uri)`

```ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './test',
    retires: 2,
    use: {
      baseURL: 'https://tasktracker.qualiadept.eu/index.html',
      trace: 'always',
    },
    projects: [
      { name: 'chromium', use: { ...devices['Desktop Chromium'] } },
    ],
});
```

**🗝️ Rezolvare – Exercițiul 1**   *(încearcă singur înainte să citești)*

1. `testDir: './test'` → folderul generat este `./tests` (altfel: „No tests found”).

2. `retires` → `retries` (TypeScript subliniază opțiunea necunoscută datorită lui `defineConfig`).

3. `baseURL` nu trebuie să conțină pagina; corect: `'https://tasktracker.qualiadept.eu'`.

4. `trace: 'always'` nu există → `'on'`, `'on-first-retry'` sau `'retain-on-failure'`.

5. `devices['Desktop Chromium']` nu există → `devices['Desktop Chrome']`.

### 📍 Exercițiul 2: Un config, trei medii (variabile de mediu)

**Context E2E:** Aceleași teste trebuie să ruleze atât pe aplicația cursului, cât și pe aplicația ta pornită local. Modifică `baseURL` astfel încât să citească variabila `BASE_URL`, cu fallback pe `https://tasktracker.qualiadept.eu`. Apoi rulează testele împotriva aplicației locale (`http://localhost:3000`, pornită cu `npx serve`, vezi 3.6), din PowerShell și din bash.

**🗝️ Rezolvare – Exercițiul 2**   *(încearcă singur înainte să citești)*

**📋 Cod 7.02** · `📄 playwright.config.ts (fragment)`

```ts
use: {
  baseURL: process.env.BASE_URL ?? 'https://tasktracker.qualiadept.eu',
},
```

**📋 Cod 7.03** · `📄 Terminal`

```bash
# PowerShell (Windows)
$env:BASE_URL="http://localhost:3000"; npx playwright test
Remove-Item Env:BASE_URL          # revii la adresa publică
# bash (macOS / Linux / Git Bash)
BASE_URL=http://localhost:3000 npx playwright test
```

### 📍 Exercițiul 3: Smoke vs. Regression (tag-uri + scripturi npm)

**Context E2E:** La fiecare commit vrei doar testele rapide (`@smoke`), iar noaptea toată suita. Etichetează testul de încărcare a paginii cu `@smoke` și testul de adăugare cu `@regression`. Creează scripturile `test:smoke` și `test:regression` în `package.json`.

**🗝️ Rezolvare – Exercițiul 3**   *(încearcă singur înainte să citești)*

**📋 Cod 7.04** · `📄 tests/task-tracker.spec.ts (fragment)`

```ts
test('pagina Task Tracker se încarcă', { tag: '@smoke' }, async ({ page }) => {
    await page.goto('/');

    await expect(page.getByTestId('task-list')).toBeVisible();
});

test('utilizatorul adaugă un task', { tag: '@regression' }, async ({ page }) => {
    // ...
});
```

**📋 Cod 7.05** · `📄 package.json (fragment)`

```json
"scripts": {
  "test:smoke": "playwright test --grep @smoke",
  "test:regression": "playwright test --grep @regression"
}
```

### 📍 Exercițiul 4: Matricea de proiecte

**Context E2E:** Product Owner-ul spune că 40% din utilizatori vin de pe mobil. Adaugă proiectele `Mobile Chrome` (Pixel 7) și `Microsoft Edge` (`channel: 'msedge'`) pe lângă cele 3 desktop. Ai 4 teste în suită. Câte execuții vor apărea la `npx playwright test --list`? Rulează doar proiectele mobile.

**🗝️ Rezolvare – Exercițiul 4**   *(încearcă singur înainte să citești)*

**📋 Cod 7.06** · `📄 projects (fragment)`

```ts
{ name: 'Mobile Chrome', use: { ...devices['Pixel 7'] } },
{ name: 'Microsoft Edge', use: { ...devices['Desktop Edge'], channel: 'msedge' } },
```

Cu 5 proiecte și 4 teste: **4 × 5 \= 20 de execuții**. Doar mobil: `npx playwright test --project="Mobile Chrome"` (poți repeta `--project` de mai multe ori pentru mai multe proiecte).

### 📍 Exercițiul 5: Pick locator pe pagina de Login (Sesiunea 1)

**Context E2E:** Pagina de Login din tema Sesiunii 1 nu face parte din aplicația publicată, așa că exercițiul folosește varianta locală. Copiază pagina în folderul `task-tracker/` din arhiva laboratorului, sub numele `login.html`, și pornește aplicația cu `npx serve ../task-tracker -l 3000`. Pagina are atributele `input-email`, `input-password` și `btn-submit-login`. Folosind doar **Pick locator** din Codegen (`npx playwright codegen http://localhost:3000/login.html`), notează locatorii propuși pentru cele trei elemente. Apoi scrie un test care completează formularul și verifică titlul `Task Tracker Login`, și rulează-l cu `BASE_URL=http://localhost:3000`.

**🗝️ Rezolvare – Exercițiul 5**   *(încearcă singur înainte să citești)*

**📋 Cod 7.07** · `📄 tests/login.spec.ts`

```ts
import { test, expect } from '@playwright/test';

test('formularul de login poate fi completat', async ({ page }) => {
    await page.goto('/login.html');

    await expect(page).toHaveTitle('Task Tracker Login');

    await page.getByTestId('input-email').fill('qa@qualiadept.eu');

    await page.getByTestId('input-password').fill('Parola123!');

    await expect(page.getByTestId('btn-submit-login')).toBeEnabled();
});
```

### 📍 Exercițiul 6: Debugging cu UI Mode și Trace Viewer

**Context E2E:** Strică intenționat testul de adăugare: caută în listă textul „Task inexistent”. Rulează testul în UI Mode, identifică pasul care pică și citește mesajul de eroare. Apoi rulează aceeași greșeală cu `--trace on` și deschide trace-ul. Notează trei informații pe care le oferă trace-ul și nu le vezi în terminal.

**🗝️ Rezolvare – Exercițiul 6**   *(încearcă singur înainte să citești)*

În UI Mode, pasul `toContainText` este marcat cu roșu, iar mesajul arată valoarea așteptată, textul primit și faptul că asertarea a reîncercat timp de 5 secunde. Trace-ul oferă, în plus: (1) captura DOM-ului înainte și după fiecare acțiune (poți inspecta elementele ca în DevTools), (2) tab-ul **Network** cu cererile GET/POST către API și statusurile lor, (3) tab-ul **Console** cu log-urile și erorile aplicației, plus durata exactă a fiecărui pas și locatorul folosit.

### 📍 Exercițiul 7: Marea Finală – Primul tău Framework Playwright

**Context E2E:** Asamblează tot ce ai învățat într-un proiect curat, gata de urcat pe GitHub în Sesiunea 18:

* `playwright.config.ts` complet (baseURL din variabila de mediu, cu fallback pe `https://tasktracker.qualiadept.eu`, testIdAttribute, trace, screenshot, 3 proiecte desktop).

* `tests/task-tracker.spec.ts` cu **3 teste**: încărcarea paginii (`@smoke`), adăugarea unui task (`@smoke`), ștergerea unui task (`@regression`).

* Pop-up-ul Chaos gestionat cu `addLocatorHandler` într-un `beforeEach`.

* Scripturile npm `test`, `test:smoke`, `test:ui`, `report`.

* Verificarea stabilității: `npx playwright test --repeat-each=10` trebuie să treacă fără niciun eșec.

**🗝️ Rezolvare – Exercițiul 7**   *(încearcă singur înainte să citești)*

**📋 Cod 7.08** · `📄 tests/task-tracker.spec.ts`

```ts
import { test, expect } from '@playwright/test';

test.describe('Task Tracker – smoke & regression', () => {
    test.beforeEach(async ({ page }) => {
        await page.addLocatorHandler(page.getByTestId('close-promo-btn'), async (btn) => {
            await btn.click();
        });

        await page.goto('/');
    });

    test('pagina se încarcă și afișează lista de task-uri', { tag: '@smoke' }, async ({ page }) => {
        await expect(page.getByTestId('task-list')).toBeVisible();

        await expect(page.getByTestId('submit-task-btn')).toBeVisible();
    });

    test('utilizatorul adaugă un task nou', { tag: '@smoke' }, async ({ page }) => {
        await page.getByTestId('input-task-name').fill('Task Marea Finală');

        await page.getByTestId('submit-task-btn').click();

        await expect(page.getByTestId('task-list')).toContainText('Task Marea Finală');
    });

    test('utilizatorul șterge un task adăugat', { tag: '@regression' }, async ({ page }) => {
        const nume = 'Task temporar';

        const lista = page.getByTestId('task-list');

        await page.getByTestId('input-task-name').fill(nume);

        await page.getByTestId('submit-task-btn').click();

        await expect(lista).toContainText(nume);

        await lista.getByRole('listitem').filter({ hasText: nume }).getByRole('button').click();

        await expect(lista).not.toContainText(nume);
    });
});
```

**📋 Cod 7.09** · `📄 package.json (fragment)`

```json
"scripts": {
  "test": "playwright test",
  "test:smoke": "playwright test --grep @smoke",
  "test:ui": "playwright test --ui",
  "report": "playwright show-report"
}
```

---

## Capitolul 8: Laborator E2E – Suite Playwright gata de rulat

### Obiective de învățare

::: info 🎯 Obiective de învățare
La finalul acestui capitol, vei fi capabil să:
- Rulezi trei suite complete de teste Playwright: una pe aplicația noastră Task Tracker și două pe aplicații publice de antrenament.
- Configurezi un singur `playwright.config.ts` care testează aplicații diferite, fiecare cu propriul `baseURL`, `testIdAttribute` și set de browsere.
- Citești teste reale, organizate pe funcționalități: smoke, validare, CRUD, rețea, pop-up-uri.
- Verifici și cererile de rețea (POST, DELETE), nu doar ce se vede pe ecran.
- Controlezi timpul paginii cu `page.clock`, ca un pop-up aleatoriu să devină un scenariu de test determinist.
- Extinzi singur suitele cu teste noi.
:::

### 8.1 Ce conține laboratorul

Până acum, fiecare noțiune a avut un exemplu scurt. Laboratorul pune totul cap la cap: un proiect Playwright complet, care testează trei aplicații dintr-un singur config.

![Figura 8.1 – Laboratorul: un config, cinci proiecte, trei aplicații testate](/images/sessions/premium/session-9/image13.png)

*Figura 8.1 – Laboratorul: un config, cinci proiecte, trei aplicații testate*

| Suită | Aplicația testată | Ce exersezi |
| ----- | ----- | ----- |
| A – Task Tracker | SUT-ul nostru din Sesiunea 6, publicat la `https://tasktracker.qualiadept.eu` (sau aplicația ta, local) | Smoke, validarea formularului, POST, finalizare, DELETE, pop-up-ul Chaos, cross-browser |
| B – TodoMVC | `https://demo.playwright.dev/todomvc/`, aplicația demo întreținută de echipa Playwright | Liste, checkbox-uri, filtre, editare cu dublu-click, persistență după reload |
| C – SauceDemo | `https://www.saucedemo.com`, magazinul demo creat de Sauce Labs pentru antrenament | Login pozitiv și negativ, coș de cumpărături, sortare, alt atribut de test (`data-test`) |

Toate fișierele se află în arhiva **`S9 - Laborator E2E.zip`**, cu următoarea structură:

**📋 Cod 8.01** · `📄 S9-laborator/`

```ts
S9-laborator/
├── README.md
├── task-tracker/                ← copie locală a SUT-ului (opțională)
│   ├── index.html │   ├── style.css │   └── app.js └── task-tracker-e2e/            ← proiectul Playwright     ├── package.json     ├── playwright.config.ts     ├── .gitignore     └── tests/         ├── helpers/chaos.ts         ├── task-tracker/        ← Suita A (6 fișiere)         ├── todomvc/             ← Suita B (1 fișier)         └── saucedemo/           ← Suita C (2 fișiere)
```

::: info 🧩
SUT-ul de referință Aplicația publicată la `https://tasktracker.qualiadept.eu` este aplicația din Sesiunea 6, asamblată din codul din material: `index.html`, `style.css` și `app.js`. Am adăugat doar funcția de finalizare a unui task (click pe titlu → clasa `.completed`, tăiat cu o linie), care este cerința 9 a temei S6 de pe platformă. Astfel, suitele rulează identic pentru toți cursanții, fără să pornească nimic local. Folderul `task-tracker/` din arhivă conține exact aceleași fișiere. Îl folosești doar când vrei să testezi local: fără internet, sau cu aplicația ta din S6 copiată peste el (exercițiul L5).
:::

### 8.2 Pornirea laboratorului pas cu pas

**📋 Cod 8.02** · `📄 Terminal (PowerShell sau bash)`

```bash
# 1. Dezarhivează S9 - Laborator E2E.zip și intră în proiectul de test
cd S9-laborator/task-tracker-e2e

# 2. Instalează dependențele (Playwright, tipurile Node.js și serverul static „serve”, folosit doar în varianta locală)
npm install

# 3. Instalează browserele Playwright
npx playwright install

# 4. Rulează toate suitele (suita A rulează pe https://tasktracker.qualiadept.eu)
npx playwright test

# 5. Deschide raportul HTML
npx playwright show-report

# Varianta locală: suita A pe aplicația din folderul ../task-tracker (webServer pornește serverul singur)
# PowerShell:  $env:BASE_URL="http://localhost:3000"; npm run test:tracker
# bash:        BASE_URL=http://localhost:3000 npm run test:tracker
```

**📋 Cod 8.03** · `📄 package.json`

```json
{
  "name": "task-tracker-e2e",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "test": "playwright test",
    "test:tracker": "playwright test --project=task-tracker-chromium --project=task-tracker-firefox --project=task-tracker-webkit",
    "test:todomvc": "playwright test --project=todomvc",
    "test:saucedemo": "playwright test --project=saucedemo",
    "test:smoke": "playwright test --grep @smoke",
    "test:ui": "playwright test --ui",
    "report": "playwright show-report"
  },
  "devDependencies": {
    "@playwright/test": "^1.65.0",
    "@types/node": "^22.0.0",
    "serve": "^14.2.0"
  }
}
```

Config-ul laboratorului aplică tot ce am învățat în Capitolul 3. Elementul nou este că fiecare proiect are propriul `testDir`, propriul `baseURL` și, la nevoie, propriul `testIdAttribute`. În plus, `webServer` este activat doar când `BASE_URL` indică o adresă locală:

**📋 Cod 8.04** · `📄 playwright.config.ts`

```ts
import { defineConfig, devices } from '@playwright/test';

const TASK_TRACKER_URL = process.env.BASE_URL ?? 'https://tasktracker.qualiadept.eu';
const RULARE_LOCALA = /localhost|127\.0\.0\.1/.test(TASK_TRACKER_URL);

export default defineConfig({
    testDir: './tests',
    timeout: 30_000,
    expect: { timeout: 5_000 },
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: [['list'], ['html', { open: 'never' }]],
    // Opțiuni comune tuturor proiectelor
    use: {
      trace: 'on-first-retry',
      screenshot: 'only-on-failure',
      video: 'retain-on-failure',
      actionTimeout: 10_000,
    },
    projects: [
      // Suita A – aplicația noastră, pe cele trei motoare de browser

      {
        name: 'task-tracker-chromium',
        testDir: './tests/task-tracker',
        use: { ...devices['Desktop Chrome'], baseURL: TASK_TRACKER_URL, testIdAttribute: 'data-testid' },
      },
      {
        name: 'task-tracker-firefox',
        testDir: './tests/task-tracker',
        use: { ...devices['Desktop Firefox'], baseURL: TASK_TRACKER_URL, testIdAttribute: 'data-testid' },
      },
      {
        name: 'task-tracker-webkit',
        testDir: './tests/task-tracker',
        use: { ...devices['Desktop Safari'], baseURL: TASK_TRACKER_URL, testIdAttribute: 'data-testid' },
      },
      // Suita B – aplicația demo a echipei Playwright (URL-ul are o cale: /todomvc/)
      {
        name: 'todomvc',
        testDir: './tests/todomvc',
        use: { ...devices['Desktop Chrome'], baseURL: 'https://demo.playwright.dev/todomvc/' },
        },
        // Suita C – magazinul demo SauceDemo, care folosește atributul data-test
        {
          name: 'saucedemo',
          testDir: './tests/saucedemo',
          use: { ...devices['Desktop Chrome'], baseURL: 'https://www.saucedemo.com', testIdAttribute: 'data-test' },
          },
        ],
        // Doar în varianta locală (BASE_URL=http://localhost:3000) pornim SUT-ul din ../task-tracker

        webServer: RULARE_LOCALA

        ? {
          command: 'npx serve ../task-tracker -l 3000',
          url: 'http://localhost:3000',
          reuseExistingServer: !process.env.CI,
        }

        : undefined,
    });
```

Helper-ul pentru pop-up-ul Chaos este scris o singură dată și importat în fiecare fișier al suitei A. Este primul pas spre fixtures (Sesiunea 14):

**📋 Cod 8.05** · `📄 tests/helpers/chaos.ts`

```ts
import type { Page } from '@playwright/test';

// Pop-up-ul Chaos (S6) apare la 2-6 secunde după încărcare și acoperă pagina.
// Handler-ul îl închide automat, oricând ar apărea, înaintea oricărei acțiuni sau asertări.
export const inchidePromoAutomat = async (page: Page): Promise<void> => {
  await page.addLocatorHandler(page.getByTestId('close-promo-btn'), async (buton) => {
      await buton.click();
  });
};
```

### 8.3 Suita A – Task Tracker (SUT-ul nostru)

Suita are 27 de teste în 6 fișiere și rulează pe 3 browsere, deci 81 de execuții. Fiecare fișier acoperă o funcționalitate. Observă că toate testele așteaptă încărcarea celor 5 task-uri inițiale înainte de a modifica lista: altfel, un POST rapid ar putea ajunge în pagină înaintea datelor de la GET.

#### A1. Smoke – aplicația pornește corect

| Test | Ce verifică |
| ----- | ----- |
| titlul, logo-ul și statusul API | `<title>`, `h1#logo`, `#network-status` |
| secțiunile principale | cele două titluri `h2` |
| cele 5 task-uri inițiale | spinner-ul dispare, apar 5 rânduri, primul este „delectus aut autem” |
| starea inițială a formularului | câmp gol, buton dezactivat, eroare ascunsă |

**📋 Cod 8.06** · `📄 tests/task-tracker/smoke.spec.ts`

```ts
import { test, expect } from '@playwright/test';
import { inchidePromoAutomat } from '../helpers/chaos';

test.describe('Task Tracker – smoke', { tag: '@smoke' }, () => {
    test.beforeEach(async ({ page }) => {
        await inchidePromoAutomat(page);

        await page.goto('/');
    });

    test(
      'pagina are titlul, logo-ul și statusul API'
      , async ({ page }) => {
        await expect(page).toHaveTitle('QA Task Tracker Pro');

        await expect(page.getByRole('heading', { name: 'QA Task Tracker', exact: true })).toBeVisible();

        await expect(page.locator('#network-status')).toHaveText('API Online');
    });

    test(
      'secțiunile principale sunt afișate'
      , async ({ page }) => {
        await expect(page.getByRole('heading', { name: 'Adaugă un Scenariu Nou' })).toBeVisible();

        await expect(page.getByRole('heading', { name: 'Scenarii de Testare (Live)' })).toBeVisible();
    });

    test('cele 5 task-uri inițiale se încarcă de pe server', async ({ page }) => {
        await expect(page.getByTestId('loading-spinner')).toBeHidden();

        const randuri = page.getByTestId('task-list').locator('.task-item');

        await expect(randuri).toHaveCount(5);

        await expect(randuri.first()).toContainText('delectus aut autem');
    });

    test('formularul pornește în starea corectă', async ({ page }) => {
        await expect(page.getByTestId('input-task-name')).toBeEmpty();

        await expect(page.getByTestId('submit-task-btn')).toBeDisabled();

        await expect(page.getByTestId('error-message')).toBeHidden();
    });
});
```

#### A2. Validarea formularului

Ultimul bloc din fișier este un exemplu de **data-driven testing** simplu: o buclă `for` generează câte un test pentru fiecare valoare. Vom aprofunda tehnica în Sesiunea 14.

**📋 Cod 8.07** · `📄 tests/task-tracker/validare-formular.spec.ts`

```ts
import { test, expect } from '@playwright/test';
import { inchidePromoAutomat } from '../helpers/chaos';

test.describe('Task Tracker – validarea formularului', () => {
    test.beforeEach(async ({ page }) => {
        await inchidePromoAutomat(page);

        await page.goto('/');

        await expect(page.getByTestId('task-list').locator('.task-item')).toHaveCount(5);
    });

    test('butonul devine activ după prima literă', async ({ page }) => {
        await page.getByTestId('input-task-name').fill('A');

        await expect(page.getByTestId('submit-task-btn')).toBeEnabled();

        await expect(page.getByTestId('error-message')).toBeHidden();
    });

    test('golirea câmpului afișează eroarea și blochează butonul', async ({ page }) => {
        const input = page.getByTestId('input-task-name');

        await input.fill('A');

        await input.fill('');

        await expect(page.getByTestId('error-message')).toHaveText('Numele task-ului nu poate fi gol!');

        await expect(page.getByTestId('submit-task-btn')).toBeDisabled();
    });

    test(
      'un nume format doar din spații nu este valid'
      , async ({ page }) => {
        await page.getByTestId('input-task-name').fill('   ');

        await expect(page.getByTestId('submit-task-btn')).toBeDisabled();

        await expect(page.getByTestId('error-message')).toBeVisible();
    });

    test('Enter pe un câmp gol nu trimite formularul', async ({ page }) => {
        const input = page.getByTestId('input-task-name');

        await input.press('Enter');            // butonul este dezactivat: formularul nu se trimite

        await input.fill('Task valid');

        await page.getByTestId('submit-task-btn').click();

        await expect(page.getByTestId('task-list')).toContainText('Task valid');

        // 5 inițiale + 1 valid. Dacă Enter ar fi trimis formularul, am avea 7 rânduri.

        await expect(page.getByTestId('task-list').locator('.task-item')).toHaveCount(6);
    });

    // Data-driven: același test pentru mai multe valori valide
    for (const valoare of ['x', 'Test 123', 'Testare ăîșțâ',
        '  spații în jur  '
    ]) {
      test(`acceptă valoarea „${valoare.trim()}”`, async ({ page }) => {
          await page.getByTestId('input-task-name').fill(valoare);

          await expect(page.getByTestId('submit-task-btn')).toBeEnabled();
      });
    }
});
```

#### A3. Adăugarea unui task (POST)

Testul „trimite un POST corect” verifică **rețeaua**, nu doar ecranul. `page.waitForResponse()` se pornește înainte de click, ca să nu ratăm răspunsul, iar `postDataJSON()` ne arată exact ce a trimis aplicația: titlul fără spațiile de la capete, ca efect al `trim()` din `app.js`.

**📋 Cod 8.08** · `📄 tests/task-tracker/adaugare-task.spec.ts`

```ts
import { test, expect } from '@playwright/test';
import { inchidePromoAutomat } from '../helpers/chaos';

test.describe('Task Tracker – adăugarea unui task (POST)', () => {
    test.beforeEach(async ({ page }) => {
        await inchidePromoAutomat(page);

        await page.goto('/');

        await expect(page.getByTestId('task-list').locator('.task-item')).toHaveCount(5);
    });

    test('task-ul nou apare la finalul listei', { tag: '@smoke' }, async ({ page }) => {
        const randuri = page.getByTestId('task-list').locator('.task-item');

        await page.getByTestId('input-task-name').fill('Scriu primul test E2E');

        await page.getByTestId('submit-task-btn').click();

        await expect(randuri).toHaveCount(6);

        await expect(randuri.last()).toContainText('Scriu primul test E2E');
    });

    test('după salvare, formularul revine la starea inițială', async ({ page }) => {
        const input = page.getByTestId('input-task-name');

        const buton = page.getByTestId('submit-task-btn');

        await input.fill('Resetare formular');

        await buton.click();

        await expect(page.getByTestId('task-list')).toContainText('Resetare formular');

        await expect(input).toBeEmpty();

        await expect(buton).toBeDisabled();

        await expect(buton).toHaveText('Salvează');
    });

    test('aplicația trimite un POST corect către API', async ({ page }) => {
        // Pornim „ascultarea” înainte de click

        const raspunsPromis = page.waitForResponse(
          (raspuns) => raspuns.url().includes('/todos') && raspuns.request().method() === 'POST',
        );

        await page.getByTestId('input-task-name').fill(
          '  Task pe rețea  '
        );

        await page.getByTestId('submit-task-btn').click();

        const raspuns = await raspunsPromis;

        expect(raspuns.status()).toBe(201);

        expect(raspuns.request().postDataJSON()).toMatchObject({ title:
            'Task pe rețea'
            , completed: false });

        await expect(page.getByTestId('task-list')).toContainText(
          'Task pe rețea'
        );
    });

    test('tasta Enter salvează task-ul', async ({ page }) => {
        const input = page.getByTestId('input-task-name');

        await input.fill('Salvat cu Enter');

        await input.press('Enter');

        await expect(page.getByTestId('task-list')).toContainText('Salvat cu Enter');
    });

    test('se pot adăuga mai multe task-uri la rând', async ({ page }) => {
        const taskuri = ['Setup Playwright', 'Configurare', 'Codegen'];

        for (const nume of taskuri) {
          await page.getByTestId('input-task-name').fill(nume);

          await page.getByTestId('submit-task-btn').click();

          await expect(page.getByTestId('task-list')).toContainText(nume);
        }

        await expect(page.getByTestId('task-list').locator('.task-item')).toHaveCount(5 + taskuri.length);
    });
});
```

#### A4. Finalizarea unui task

`toHaveCSS()` verifică stilul calculat de browser, adică ce vede utilizatorul. Nu e suficient că elementul are clasa corectă: dacă cineva șterge regula CSS `.completed`, doar acest test va observa.

**📋 Cod 8.09** · `📄 tests/task-tracker/finalizare-task.spec.ts`

```ts
import { test, expect } from '@playwright/test';
import { inchidePromoAutomat } from '../helpers/chaos';

test.describe('Task Tracker – finalizarea unui task', () => {
    test.beforeEach(async ({ page }) => {
        await inchidePromoAutomat(page);

        await page.goto('/');

        await expect(page.getByTestId('task-list').locator('.task-item')).toHaveCount(5);
    });

    test('click pe titlu marchează task-ul ca finalizat', async ({ page }) => {
        const titlu = page.locator('.task-title', { hasText: 'delectus aut autem' });

        await titlu.click();

        await expect(titlu).toHaveClass(/completed/);

        await expect(titlu).toHaveCSS('text-decoration-line', 'line-through');
    });

    test('al doilea click anulează finalizarea', async ({ page }) => {
        const titlu = page.locator('.task-title', { hasText: 'delectus aut autem' });

        await titlu.click();

        await titlu.click();

        await expect(titlu).not.toHaveClass(/completed/);
    });

    test('finalizarea unui task nu le afectează pe celelalte', async ({ page }) => {
        await page.locator('.task-title').first().click();

        await expect(page.locator('.task-title.completed')).toHaveCount(1);
    });
});
```

#### A5. Ștergerea unui task (DELETE)

**📋 Cod 8.10** · `📄 tests/task-tracker/stergere-task.spec.ts`

```ts
import { test, expect } from '@playwright/test';
import { inchidePromoAutomat } from '../helpers/chaos';

test.describe(
  'Task Tracker – ștergerea unui task (DELETE)'
  , () => {
    test.beforeEach(async ({ page }) => {
        await inchidePromoAutomat(page);

        await page.goto('/');

        await expect(page.getByTestId('task-list').locator('.task-item')).toHaveCount(5);
    });

    test('ștergerea primului task trimite DELETE și elimină rândul', async ({ page }) => {
        const raspunsPromis = page.waitForResponse((raspuns) => raspuns.request().method() === 'DELETE');

        await page.getByTestId('delete-btn-1').click();

        const raspuns = await raspunsPromis;

        expect(raspuns.url()).toContain('/todos/1');

        expect(raspuns.ok()).toBeTruthy();

        await expect(page.getByTestId('delete-btn-1')).toHaveCount(0);

        await expect(page.getByTestId('task-list')).not.toContainText('delectus aut autem');

        await expect(page.getByTestId('task-list').locator('.task-item')).toHaveCount(4);
    });

    test('pot șterge un task adăugat de mine', async ({ page }) => {
        const lista = page.getByTestId('task-list');

        await page.getByTestId('input-task-name').fill('Task temporar');

        await page.getByTestId('submit-task-btn').click();

        await expect(lista).toContainText('Task temporar');

        // Găsim rândul după text, apoi butonul Șterge din interiorul lui

        await lista.locator('.task-item', { hasText: 'Task temporar' }).getByRole('button', { name:
            'Șterge'
        }).click();

        await expect(lista).not.toContainText('Task temporar');

        await expect(lista.locator('.task-item')).toHaveCount(5);
    });

    test(
      'se pot șterge toate cele 5 task-uri inițiale'
      , async ({ page }) => {
        for (const id of [1, 2, 3, 4, 5]) {
          await page.getByTestId(`delete-btn-${id}`).click();

          await expect(page.getByTestId(`delete-btn-${id}`)).toHaveCount(0);
        }

        await expect(page.getByTestId('task-list').locator('.task-item')).toHaveCount(0);
    });
});
```

#### A6. Modul Chaos – pop-up-ul ca scenariu de test

Aici **nu** închidem automat pop-up-ul: el este chiar subiectul testelor. Ca să nu așteptăm până la 6 secunde reale și să nu depindem de noroc, folosim **`page.clock`**: instalăm un ceas controlat de test, apoi „sărim” 6 secunde în timpul paginii cu `fastForward`. Timer-ul aleatoriu din `app.js` se declanșează instantaneu și testul devine determinist.

**📋 Cod 8.11** · `📄 tests/task-tracker/chaos-popup.spec.ts`

```ts
import { test, expect } from '@playwright/test';
import { inchidePromoAutomat } from '../helpers/chaos';

test.describe(
  'Task Tracker – modul Chaos (pop-up promoțional)'
  , () => {
    test.beforeEach(async ({ page }) => {
        await page.clock.install();          // timpul paginii este controlat de test

        await page.goto('/');

        await expect(page.getByTestId('task-list').locator('.task-item')).toHaveCount(5);
    });

    test('pop-up-ul apare în cel mult 6 secunde', async ({ page }) => {
        await page.clock.fastForward(6_000);

        const overlay = page.getByTestId('promo-overlay');

        await expect(overlay).toBeVisible();

        await expect(overlay).toContainText('Ofertă Specială');
    });

    test(
      'butonul „Nu, mulțumesc” închide pop-up-ul'
      , async ({ page }) => {
        await page.clock.fastForward(6_000);

        await page.getByTestId('close-promo-btn').click();

        await expect(page.getByTestId('promo-overlay')).toHaveCount(0);
    });

    test('fără handler, pop-up-ul blochează click-ul pe Salvează', async ({ page }) => {
        await page.clock.fastForward(6_000);

        await expect(page.getByTestId('promo-overlay')).toBeVisible();

        await page.getByTestId('input-task-name').fill('Sunt blocat?');

        // Overlay-ul interceptează click-ul: acțiunea expiră după 2 secunde

        await expect(page.getByTestId('submit-task-btn').click({ timeout: 2_000 })).rejects.toThrow();
    });

    test('cu addLocatorHandler, fluxul de adăugare reușește', async ({ page }) => {
        await inchidePromoAutomat(page);

        await page.clock.fastForward(6_000);

        await page.getByTestId('input-task-name').fill('Trec de pop-up');

        await page.getByTestId('submit-task-btn').click();

        await expect(page.getByTestId('task-list')).toContainText('Trec de pop-up');
    });
});
```

::: info 🔍
De ce `fill` merge, dar `click` nu? Înainte de un `click`, Playwright verifică și dacă elementul primește evenimentele mouse-ului, adică dacă nu e acoperit de alt element. `fill` scrie direct în câmp după ce verifică vizibilitatea și faptul că poate fi editat, așa că nu e blocat de overlay. Diferența apare și în mesajul de eroare din trace: „… intercepts pointer events”.
:::

### 8.4 Suita B – TodoMVC (aplicație publică)

Aplicația **TodoMVC** de la `demo.playwright.dev` este întreținută chiar de echipa Playwright pentru exemple și antrenament. Are deja atribute `data-testid` (`todo-item`, `todo-title`, `todo-count`), deci folosim valoarea implicită `testIdAttribute`.

::: warning ⚠️
Capcana `baseURL` cu cale `baseURL` pentru TodoMVC este `https://demo.playwright.dev/todomvc/`. Dacă scrii `page.goto('/')`, ajungi pe `https://demo.playwright.dev/`, pentru că `/` înseamnă rădăcina domeniului. Pentru un `baseURL` care are o cale, folosește o adresă relativă: `page.goto('./')`. Bara `/` de la finalul lui `baseURL` este obligatorie.
:::

**📋 Cod 8.12** · `📄 tests/todomvc/todomvc.spec.ts`

```ts
import { test, expect, type Page } from '@playwright/test';

const TODOS = ['Instalez Playwright', 'Configurez playwright.config.ts', 'Generez un test cu Codegen'];

const adaugaTodos = async (page: Page, texte: string[]): Promise<void> => {
  const input = page.getByPlaceholder('What needs to be done?');

  for (const text of texte) {
    await input.fill(text);

    await input.press('Enter');
  }
};

test.beforeEach(async ({ page }) => {
    await page.goto('./');          // baseURL: https://demo.playwright.dev/todomvc/
});

test.describe('TodoMVC – adăugare', () => {
    test('adaugă un element și golește câmpul', { tag: '@smoke' }, async ({ page }) => {
        await adaugaTodos(page, [TODOS[0]]);

        await expect(page.getByTestId('todo-title')).toHaveText([TODOS[0]]);

        await expect(page.getByPlaceholder('What needs to be done?')).toBeEmpty();
    });

    test('păstrează ordinea și actualizează contorul', async ({ page }) => {
        await adaugaTodos(page, TODOS);

        await expect(page.getByTestId('todo-title')).toHaveText(TODOS);

        await expect(page.getByTestId('todo-count')).toContainText('3');
    });
});

test.describe('TodoMVC – finalizare', () => {
    test.beforeEach(async ({ page }) => {
        await adaugaTodos(page, TODOS);
    });

    test('bifarea unui element îl marchează ca finalizat', async ({ page }) => {
        const primul = page.getByTestId('todo-item').first();

        await primul.getByRole('checkbox').check();

        await expect(primul).toHaveClass(/completed/);

        await expect(page.getByTestId('todo-count')).toContainText('2');
    });

    test('„Mark all as complete” finalizează toate elementele', async ({ page }) => {
        await page.getByLabel('Mark all as complete').check();

        await expect(page.getByTestId('todo-item')).toHaveClass([/completed/, /completed/, /completed/]);
    });
});

test.describe('TodoMVC – filtre', () => {
    test.beforeEach(async ({ page }) => {
        await adaugaTodos(page, TODOS);

        await page.getByTestId('todo-item').nth(1).getByRole('checkbox').check();
    });

    test('Active afișează doar elementele nefinalizate', async ({ page }) => {
        await page.getByRole('link', { name: 'Active' }).click();

        await expect(page.getByTestId('todo-title')).toHaveText([TODOS[0], TODOS[2]]);
    });

    test('Completed afișează doar elementele finalizate', async ({ page }) => {
        await page.getByRole('link', { name: 'Completed' }).click();

        await expect(page.getByTestId('todo-title')).toHaveText([TODOS[1]]);
    });

    test('All afișează din nou toate elementele', async ({ page }) => {
        await page.getByRole('link', { name: 'Active' }).click();

        await page.getByRole('link', { name: 'All' }).click();

        await expect(page.getByTestId('todo-title')).toHaveText(TODOS);
    });
});

test.describe('TodoMVC – editare, ștergere și persistență', () => {
    test.beforeEach(async ({ page }) => {
        await adaugaTodos(page, TODOS);
    });

    test('dublu-click permite editarea unui element', async ({ page }) => {
        const alDoilea = page.getByTestId('todo-item').nth(1);

        await alDoilea.dblclick();

        const editor = alDoilea.getByRole('textbox', { name: 'Edit' });

        await editor.fill('Configurez proiectele');

        await editor.press('Enter');

        await expect(page.getByTestId('todo-title')).toHaveText([TODOS[0], 'Configurez proiectele', TODOS[2]]);
    });

    test('„Clear completed” elimină elementele finalizate', async ({ page }) => {
        await page.getByTestId('todo-item').first().getByRole('checkbox').check();

        await page.getByRole('button', { name: 'Clear completed' }).click();

        await expect(page.getByTestId('todo-title')).toHaveText([TODOS[1], TODOS[2]]);
    });

    test('datele rămân după reîncărcarea paginii', async ({ page }) => {
        await page.getByTestId('todo-item').first().getByRole('checkbox').check();

        await page.reload();

        await expect(page.getByTestId('todo-title')).toHaveText(TODOS);

        await expect(page.getByTestId('todo-item').first()).toHaveClass(/completed/);
    });
});
```

`toHaveText([...])` primește un **array** și verifică dintr-o singură asertare atât numărul de elemente, cât și textul și ordinea fiecăruia.

### 8.5 Suita C – SauceDemo (aplicație publică)

**SauceDemo** este un magazin online fictiv, creat de Sauce Labs pentru exersarea automatizării. Utilizatorii și parola sunt publice și apar chiar pe pagina de login (`standard_user`, `locked_out_user`, parola `secret_sauce`). Elementele au atributul **`data-test`**, nu `data-testid`. De aceea proiectul `saucedemo` din config setează `testIdAttribute: 'data-test'`, iar `getByTestId('username')` funcționează fără nicio altă modificare. Este exact scenariul din Capitolul 3.4.

**📋 Cod 8.13** · `📄 tests/saucedemo/login.spec.ts`

```ts
import { test, expect } from '@playwright/test';

const PAROLA = 'secret_sauce';   // parola publică, afișată pe pagina de login

test.describe('SauceDemo – autentificare', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('utilizatorul standard ajunge la lista de produse', { tag: '@smoke' }, async ({ page }) => {
        await page.getByTestId('username').fill('standard_user');

        await page.getByTestId('password').fill(PAROLA);

        await page.getByTestId('login-button').click();

        await expect(page).toHaveURL(/inventory\.html/);

        await expect(page.locator('.title')).toHaveText('Products');

        await expect(page.locator('.inventory_item')).toHaveCount(6);
    });

    test(
      'utilizatorul blocat primește un mesaj de eroare'
      , async ({ page }) => {
        await page.getByTestId('username').fill('locked_out_user');

        await page.getByTestId('password').fill(PAROLA);

        await page.getByTestId('login-button').click();

        await expect(page.getByTestId('error')).toContainText('locked out');

        await expect(page).not.toHaveURL(/inventory\.html/);
    });

    test('fără username apare eroarea de validare', async ({ page }) => {
        await page.getByTestId('login-button').click();

        await expect(page.getByTestId('error')).toContainText('Username is required');
    });

    test('cu parolă greșită autentificarea eșuează', async ({ page }) => {
        await page.getByTestId('username').fill('standard_user');

        await page.getByTestId('password').fill('parola_gresita');

        await page.getByTestId('login-button').click();

        await expect(page.getByTestId('error')).toContainText('do not match');
    });
});
```

**📋 Cod 8.14** · `📄 tests/saucedemo/cos-si-sortare.spec.ts`

```ts
import { test, expect, type Page } from '@playwright/test';

const autentificare = async (page: Page): Promise<void> => {
  await page.goto('/');

  await page.getByTestId('username').fill('standard_user');

  await page.getByTestId('password').fill('secret_sauce');

  await page.getByTestId('login-button').click();

  await expect(page).toHaveURL(/inventory\.html/);
};

test.describe(
  'SauceDemo – coș și sortare'
  , () => {
    test.beforeEach(async ({ page }) => {
        await autentificare(page);
    });

    test('adăugarea unui produs actualizează coșul', async ({ page }) => {
        await page.getByTestId('add-to-cart-sauce-labs-backpack').click();

        await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

        await expect(page.getByTestId('remove-sauce-labs-backpack')).toBeVisible();
    });

    test(
      'scoaterea produsului golește coșul'
      , async ({ page }) => {
        await page.getByTestId('add-to-cart-sauce-labs-backpack').click();

        await page.getByTestId('remove-sauce-labs-backpack').click();

        await expect(page.locator('.shopping_cart_badge')).toHaveCount(0);
    });

    test('produsul adăugat apare în pagina coșului', async ({ page }) => {
        await page.getByTestId('add-to-cart-sauce-labs-backpack').click();

        await page.locator('.shopping_cart_link').click();

        await expect(page).toHaveURL(/cart\.html/);

        await expect(page.locator('.inventory_item_name')).toHaveText(['Sauce Labs Backpack']);
    });

    test('sortarea după preț crescător ordonează produsele', async ({ page }) => {
        await page.getByTestId('product-sort-container').selectOption('lohi');

        // Așteptăm întâi ca lista să fie re-randată (cel mai ieftin produs costă 7.99 $)

        await expect(page.locator('.inventory_item_price').first()).toHaveText('$7.99');

        const texte = await page.locator('.inventory_item_price').allTextContents();

        const preturi = texte.map((text) => Number(text.replace('$', '')));

        expect(preturi).toEqual([...preturi].sort((a, b) => a - b));
    });
});
```

::: warning ⚠️
Aplicațiile publice se pot schimba TodoMVC și SauceDemo nu sunt controlate de noi. Dacă un test pică brusc, deși nu ai modificat nimic, verifică întâi aplicația: deschide-o în browser și folosește Pick locator din Codegen (Capitolul 5.3). Poate s-a schimbat un text, o clasă sau un atribut. Locatorii bazați pe clase CSS (`.title`, `.inventory_item_price`) sunt cei mai expuși. Este un exercițiu foarte bun de mentenanță, nu o greșeală a ta. Testele pe site-uri publice sunt pentru antrenament; nu le pune în pipeline-ul de CI al echipei.
:::

### 8.6 Rularea și interpretarea rezultatelor

| Comandă | Execuții | Durată orientativă |
| ----- | ----- | ----- |
| `npx playwright test` | 81 + 10 + 8 \= 99 | 1–3 minute |
| `npm run test:tracker` | 27 × 3 \= 81 | 1–2 minute |
| `npm run test:todomvc` | 10 | sub 30 de secunde |
| `npm run test:saucedemo` | 8 | sub 30 de secunde |
| `npm run test:smoke` | toate testele `@smoke` | sub 1 minut |
| `npx playwright test --project=task-tracker-chromium --ui` | lucru interactiv | — |

Duratele depind de calculator și de viteza internetului: suita A rulează pe `https://tasktracker.qualiadept.eu` și folosește API-ul public jsonplaceholder, iar B și C sunt site-uri publice.

| Simptom | Cauză și soluție |
| ----- | ----- |
| Suita A nu poate deschide `https://tasktracker.qualiadept.eu` | Verifică adresa în browser și conexiunea la internet (proxy, firewall de firmă). Dacă nu ai acces, rulează varianta locală cu `BASE_URL=http://localhost:3000`. |
| `net::ERR_CONNECTION_REFUSED` în varianta locală | Serverul local nu a pornit. Verifică dacă folderul `../task-tracker` există, dacă portul 3000 este liber și dacă `BASE_URL` conține `localhost`. |
| `Executable doesn't exist ...` | Lipsesc browserele: rulează `npx playwright install`. |
| Suita A pică la „cele 5 task-uri inițiale” | API-ul jsonplaceholder nu răspunde (rețea, proxy, firewall). Deschide `https://jsonplaceholder.typicode.com/todos?_limit=5` în browser. |
| `getByTestId(...)` nu găsește nimic pe SauceDemo | Proiectul nu are `testIdAttribute: 'data-test'` sau rulezi fișierul cu alt proiect. |
| TodoMVC deschide pagina principală playwright.dev | Ai folosit `goto('/')` în loc de `goto('./')` (vezi 8.4). |
| Un test trece local, dar pică pe WebKit | Deschide trace-ul proiectului `task-tracker-webkit` din raport. Diferențele dintre motoare sunt exact ce caută testele cross-browser. |

### 8.7 💡 Știați că...?

::: tip 💡
Știați că… `page.clock` transformă timpul într-o variabilă de test. Poți testa în câteva milisecunde un banner care apare după 5 minute, expirarea unei sesiuni sau un ceas de pe pagină. Pentru a „îngheța” ora exactă există `page.clock.setFixedTime()`. `toHaveText()` cu array verifică numărul de elemente, textele și ordinea lor. Este una dintre cele mai puternice asertări pentru liste și înlocuiește o buclă întreagă de verificări. SauceDemo are utilizatori cu bug-uri intenționate (de exemplu `problem_user` sau `performance_glitch_user`), creați special ca testerii să-și exerseze gândirea critică. Un singur config poate testa zeci de aplicații. În companiile mari, un repository de teste conține adesea proiecte pentru aplicația web, panoul de administrare și API, fiecare cu propriul `baseURL` și propriile setări.
:::

### 8.8 📖 Poveste Aplicată: „Simulatorul de zbor”

::: info 📖
Un pilot nu învață să zboare direct cu pasageri la bord. Înainte de primul zbor real, trece prin ore de simulator: aeroporturi cunoscute, condiții controlate, aceleași manevre repetate până devin reflex. TodoMVC și SauceDemo sunt simulatoarele tale: aplicații stabile, făcute pentru exercițiu, pe care poți greși fără consecințe. Task Tracker este avionul tău: l-ai construit cu mâna ta în Sesiunile 1–6, îi cunoști fiecare piesă și știi unde ar putea ceda. Un pilot bun alternează: învață manevra în simulator, apoi o aplică pe propriul avion. La fel vei face și tu cu fiecare tehnică nouă din sesiunile următoare.
:::

### 8.9 🧠 Challenge de Interviu (Întrebare Tehnică)

::: info 📝 Intervievatorul
„Aplicația voastră afișează un banner promoțional la un moment aleatoriu. Cum scrii teste E2E stabile pentru restul aplicației și cum testezi chiar banner-ul?”
:::

**Răspunsul tău de inginer:** *„Separ cele două probleme. Pentru restul aplicației, banner-ul este zgomot, așa că înregistrez un \`page.addLocatorHandler()\` pe butonul lui de închidere. Playwright îl închide automat oricând apare, înaintea oricărei acțiuni sau asertări, fără \`waitForTimeout\` și fără \`force: true\`. Pentru banner-ul în sine, scriu teste separate în care elimin aleatoriul: instalez \`page.clock\` înainte de încărcarea paginii și avansez timpul cu \`fastForward\`, astfel încât banner-ul apare exact când vreau. Verific că apare, că se închide corect și că, fără handler, blochează click-urile. Astfel am teste deterministe pentru un comportament care, în producție, este aleatoriu.”*

### 8.10 🤖 Mentalitatea de Inginer în Era AI: Suite generate, verificate de tine

::: warning 🛡️
QA vs. AI: „Scrie-mi 50 de teste pentru site-ul ăsta” Ce face AI-ul bine: Poate genera în câteva secunde zeci de teste pentru o aplicație publică precum SauceDemo, pentru că a văzut-o de multe ori în datele de antrenament. Capcana: Exact din acest motiv folosește adesea locatori vechi (versiuni anterioare ale site-ului), texte inventate sau asertări care trec mereu, de exemplu `expect(lista).toBeVisible()` după o operație care trebuia să modifice lista. Mai grav, pentru aplicația ta (Task Tracker) nu are de unde să știe ID-urile, textele sau regulile de business. Cum gândește un inginer QA: Îi dă AI-ului contextul real: HTML-ul paginii, config-ul și un fișier de test existent ca model de stil. Cere asertări de business precise (număr de rânduri, text exact, cereri de rețea). Rulează fiecare test generat de mai multe ori (`--repeat-each=10`) și îl strică intenționat (de exemplu, schimbă textul așteptat) ca să verifice că poate pica. Un test care nu poate pica nu testează nimic. Valoarea ta pe piață: Echipele nu duc lipsă de teste generate, ci de teste în care pot avea încredere. Inginerul care poate demonstra, cu trace-uri și rulări repetate, că o suită este stabilă și relevantă devine persoana de referință pentru calitate în echipă.
:::

### 8.11 Exerciții de fixare pentru laborator

::: tip ✍️ Exercițiu L1 – Un test nou în suita A În
`finalizare-task.spec.ts`, adaugă testul „un task adăugat de mine poate fi marcat ca finalizat”: adaugi task-ul „Task de finalizat”, dai click pe titlul lui și verifici clasa `completed`.
:::

**🗝️ Rezolvare L1**   *(încearcă singur înainte să citești)*

**📋 Cod 8.15** · `📄 tests/task-tracker/finalizare-task.spec.ts (test nou, în același describe)`

```ts
test('un task adăugat de mine poate fi marcat ca finalizat', async ({ page }) => {
    await page.getByTestId('input-task-name').fill('Task de finalizat');

    await page.getByTestId('submit-task-btn').click();

    const titlu = page.locator('.task-title', { hasText: 'Task de finalizat' });

    await expect(titlu).toBeVisible();

    await titlu.click();

    await expect(titlu).toHaveClass(/completed/);
});
```

::: tip ✍️ Exercițiu L2 – TodoMVC: „Mark all” de două ori Scrie un test care
bifează „Mark all as complete”, apoi îl debifează, și verifică faptul că niciun element nu mai este finalizat.
:::

**🗝️ Rezolvare L2**   *(încearcă singur înainte să citești)*

**📋 Cod 8.16** · `📄 tests/todomvc/todomvc.spec.ts (test nou, în describe-ul „finalizare”)`

```ts
test('debifarea „Mark all” anulează finalizarea tuturor elementelor', async ({ page }) => {
    const toggleAll = page.getByLabel('Mark all as complete');

    await toggleAll.check();

    await toggleAll.uncheck();

    for (const element of await page.getByTestId('todo-item').all()) {
      await expect(element).not.toHaveClass(/completed/);
    }

    await expect(page.getByTestId('todo-count')).toContainText('3');
});
```

`locator.all()` întoarce lista elementelor găsite în acel moment. Este sigur aici pentru că lista are deja cele 3 elemente, adăugate în `beforeEach`.

::: tip ✍️ Exercițiu L3 – SauceDemo data-driven Transformă testele de login
într-un singur test parametrizat, pentru utilizatorii `standard_user`, `problem_user` (ajung la produse) și `locked_out_user` (primește eroare).
:::

**🗝️ Rezolvare L3**   *(încearcă singur înainte să citești)*

**📋 Cod 8.17** · `📄 tests/saucedemo/login-data-driven.spec.ts`

```ts
import { test, expect } from '@playwright/test';

type CazLogin = { utilizator: string; reuseste: boolean };

const cazuri: CazLogin[] = [
  { utilizator: 'standard_user', reuseste: true },
  { utilizator: 'problem_user', reuseste: true },
  { utilizator: 'locked_out_user', reuseste: false },
];

for (const caz of cazuri) {
  test(`login pentru ${caz.utilizator}`, async ({ page }) => {
      await page.goto('/');

      await page.getByTestId('username').fill(caz.utilizator);

      await page.getByTestId('password').fill('secret_sauce');

      await page.getByTestId('login-button').click();

      if (caz.reuseste) {
        await expect(page).toHaveURL(/inventory\.html/);
      } else {
        await expect(page.getByTestId('error')).toContainText('locked out');
      }
  });
}
```

Tipul `CazLogin` (Sesiunea 7) garantează că fiecare caz are exact câmpurile necesare. O greșeală de tipar în `reuseste` este prinsă de TypeScript înainte de rulare.

::: tip ✍️ Exercițiu L4 – Investigația pe WebKit Rulează doar suita A pe
WebKit, cu trace pentru toate testele, apoi deschide raportul și trace-ul unui test.
:::

**🗝️ Rezolvare L4**   *(încearcă singur înainte să citești)*

**📋 Cod 8.18** · `📄 Terminal`

```bash
npx playwright test --project=task-tracker-webkit --trace on
npx playwright show-report
```

În raport, deschide un test și apasă pe secțiunea **Traces**. În Trace Viewer vezi fiecare pas, snapshot-urile DOM, cererile GET/POST către jsonplaceholder și log-urile din consolă (inclusiv mesajul `[Chaos Mode] Promo modal a apărut după ...ms!`).

::: tip ✍️ Exercițiu L5 – Suita A pe aplicația ta Rulează suita A pe
aplicația pe care ai construit-o tu în Sesiunea 6, nu pe cea de referință. Ce trebuie să schimbi și ce teste ar putea pica?
:::

**🗝️ Rezolvare L5**   *(încearcă singur înainte să citești)*

Suita rulează implicit pe aplicația publicată, deci trebuie să o îndrepți spre aplicația ta, rulată local.

Varianta 1 – înlocuiești copia locală: copiezi `index.html`, `style.css` și `app.js` ale tale peste cele din `S9-laborator/task-tracker/` și rulezi suita cu adresa locală. Config-ul vede `localhost` în `BASE_URL` și pornește singur serverul:

**📋 Cod 8.19** · `📄 Terminal`

```bash
# PowerShell
$env:BASE_URL="http://localhost:3000"; npm run test:tracker
# bash
BASE_URL=http://localhost:3000 npm run test:tracker
```

Varianta 2 – păstrezi aplicația unde este și schimbi doar calea din `webServer`, apoi rulezi cu aceeași variabilă `BASE_URL`:

**📋 Cod 8.20** · `📄 playwright.config.ts (fragment)`

```ts
webServer: {
  command: 'npx serve ../../aplicatia-mea/task-tracker -l 3000',   // calea către aplicația ta

  url: 'http://localhost:3000',
  reuseExistingServer: !process.env.CI,
},
```

Testele care pică cel mai des și cauza lor:

* **Finalizarea (A4):** dacă ai pus clasa `.completed` pe rândul `li`, nu pe `span.task-title`, schimbă locatorul în `page.locator('.task-item', { hasText: '...' })`. Dacă nu ai implementat încă funcția (cerința 9 din tema S6), testele A4 pică: este semnalul că aplicația ta are un bug față de cerință.

* **Textele:** dacă titlurile `h2` sau mesajul de eroare diferă de cele din material, actualizează textele așteptate în teste sau aliniază aplicația la cerințe.

* **Atributele de test:** dacă ai folosit alte valori `data-testid`, testele îți arată imediat ce lipsește. Exact pentru asta am făcut auditul de testabilitate din Sesiunea 6.

::: tip 🎉
Felicitări! Ai trecut de la interfețe simulate (Sesiunea 8) la un framework Playwright real: instalat corect, configurat dintr-un singur loc, rulat din CLI pe trei motoare de browser și alimentat cu un prim test generat și curățat de tine, plus trei suite complete pe care le poți rula și extinde. În Sesiunea 10 vom renunța la Codegen ca punct de plecare și vom scrie manual teste E2E complete, folosind Playwright Inspector pentru a înțelege fiecare acțiune: `click`, `fill`, `check` și `selectOption`.
:::
