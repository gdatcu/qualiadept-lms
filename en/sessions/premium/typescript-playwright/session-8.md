# Session 8: Advanced TS Structures and OOP (Preparing for POM)

<div style="display: flex; gap: 12px; flex-wrap: wrap; margin: 1.5rem 0 0.5rem 0;">
  <a href="/pdfs/sessions/premium/typescript-playwright/session-8.pdf" class="download-btn" target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24"><path d="M5 20h14v-2H5v2zm0-10h4V4h6v6h4l-7 7-7-7z"/></svg>View the PDF version of Session 8 (RO)</a>
</div>

::: info 📊 PowerPoint Presentation
Below you will find the interactive PowerPoint presentation for this session. You can browse the slides directly in your browser or download the course material in PDF format using the button above.
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

## Chapter 1: Interface Composition and Utility Types

::: info 🎯 Learning Objectives
By the end of this chapter, you will be able to:
- Understand the historical context: how the exact need to compose interfaces emerged.
- Discover the origins of Utility Types and what architectural problems they solve.
- Learn to use `Pick`, `Omit`, and `Partial` directly in API E2E testing scenarios.
- Answer technical interview scenarios related to the "Single Source of Truth" principle.
- Learn how to control AI assistants so they don't fill your framework with duplicate code.
:::

### 1.1 The Origin of the Problem: How Did the Need for Composition Arise?

::: tip 📝 Historical Context
When Microsoft introduced the first versions of TypeScript, Interfaces (`interface`) solved the problem of chaotic objects by forcing them to respect a "contract". However, as giant companies began migrating systems of thousands of files, a new problem emerged: contract duplication.
:::

Imagine you are writing tests for an API that manipulates users. You have a `User` (with `id`, `name`, `email`) and an `AdminUser` (with `id`, `name`, `email` + delete permissions). If you wrote two separate interfaces, you violated the #1 rule of programming: **DRY (Don't Repeat Yourself)**. If the Backend decided to rename the `name` field to `fullName`, you would have to manually search across 50 interfaces and make the change.

**The Solution:** This is how the need for **Composition** via the `extends` keyword appeared. TS allowed engineers to create a base "Parent" interface, and other interfaces could inherit from it, adding only the differences.

🤔❓ **Test Composition in TS Playground:**

```ts
// 1. Define the base interface (Source of Truth)
interface BaseUser {
    id: number;
    name: string;
    email: string;
}

// 2. Extend (Compose) the interface for a privileged account
// The Admin automatically receives id, name, email, plus the new rules!
interface Admin extends BaseUser {
    accessLevel: "SuperAdmin" | "Moderator";
    canDeleteTasks: boolean;
}

// 3. Create a test object that MUST respect the composition
const superUser: Admin = {
    id: 1,
    name: "Alex QA",
    email: "alex@qa.com",
    accessLevel: "SuperAdmin",
    canDeleteTasks: true
};
console.log(`Does user ${superUser.name} have delete rights? ${superUser.canDeleteTasks}`);
```

### 1.2 Utility Types: Who Introduced Them and Why?

::: tip 💡 Did you know...?
With the rise of modern frontend frameworks (like React) and REST API testing, an even harder problem appeared. When you read a resource (GET request), the API gives you the full object (e.g. with `id` and `createdAt`). But when you create a new resource (POST request), you don't send `id` or `createdAt`, because the server will generate them automatically!
:::

At first, developers created two interfaces (`UserDb` and `UserCreateRequest`). Once again, massive duplicate code.

To save the day, the TypeScript team at Microsoft (starting with version 2.1) introduced **Utility Types**. These are magical compiler-level "functions" that take an existing interface and transform it on the fly!

* **`Omit<Type, 'keys'>`**: Removes the fields you don't need (Perfect for POST).
* **`Partial<Type>`**: Makes all fields optional (Perfect for PATCH update requests).
* **`Pick<Type, 'keys'>`**: Keeps exclusively the mentioned fields.

🤔❓ **Test the API E2E Scenario in TS Playground:**

```ts
// Database Model (Source of Truth)
interface FullTask {
    id: number;
    title: string;
    completed: boolean;
    createdAt: string;
}

// --- SCENARIO 1: POST TEST (Create) ---
// Cut out 'id' and 'createdAt'
type PayloadPOST = Omit<FullTask, 'id' | 'createdAt'>;

const postTestData: PayloadPOST = {
    title: "Learn Utility Types",
    completed: false
    // ❌ If you try to add "id: 1" here, TS throws an error!
};

// --- SCENARIO 2: PATCH TEST (Partial update) ---
// TS automatically turns everything into optional (?)
type PayloadPATCH = Partial<FullTask>;

const patchTestData: PayloadPATCH = {
    completed: true // We send a single field, and TS is happy!
};
```

### 1.3 💡 Did you know...?

::: tip 💡 Did you know...?
They are invisible: Utility Types exist *exclusively* in the TypeScript compiler's mind. When you hit "Run" and the code becomes pure JavaScript in the browser, all your `Omit`s and `Partial`s evaporate, resulting in maximum-performance code (zero runtime overhead). The Supreme Dictionary (`Record<K, V>`): There is a utility called `Record`. It is heavily used in automation to store test data sets (Data-Driven Testing). Ex: `const users: Record<string, string> = { "admin": "pass1", "guest": "pass2" };` guarantees you will always have only text mapped to text.
:::

### 1.4 🧠 Interview Challenge (Technical Question)

::: warning 🧠 Interview Challenge (Technical Question)
**Interviewer:** *"I see in your Playwright framework that for POST payloads you used `type CreateUser = Omit<User, 'id'>`. Why did you do that instead of simply creating a new `interface CreateUser` that manually contains only the fields you need?"*
:::

**Your engineer's answer:** *"I used `Omit` to follow the **Single Source of Truth** principle. If I had created two completely separate interfaces, I would have introduced duplicate code. If next week the Backend team adds a new required field (e.g. `phoneNumber`) to the `User` model, I only have to update the code in one place (on the parent interface). The `Omit` utility type will automatically absorb the new change, keeping my tests safe and minimizing maintenance effort."*

### 1.5 🤖 Engineer Mindset in the AI Era: Interface Oversaturation

::: tip 🤖 Engineer Mindset in the AI Era
Duplicate Generated Code Trap (Where AI fails): If you ask ChatGPT to write CRUD (Create, Read, Update, Delete) tests for a new "Products" page, the AI will be architecturally lazy. It will generate a ton of code: defining `interface Product`, `interface ProductCreatePayload`, `interface ProductUpdatePayload`, duplicating dozens of text fields. When the framework reaches 1,000 tests, it becomes a maintenance nightmare. How a QA engineer thinks: The engineer rejects duplicate code in the PR (Pull Request) or in the Prompt. They instruct the AI clearly: *"Define a single base interface `IProduct`. For POST and PATCH test payloads, enforce using the `Omit` and `Partial` utility types derived strictly from the base interface."* This keeps the framework architecture clean, agile, and easy to modify as the application grows.
:::

---

## Chapter 2: Object-Oriented Programming (OOP) - Dissecting the 4 Pillars

::: info 🎯 Learning Objectives
By the end of this chapter, you will be able to:
- Understand the historical context: why the testing industry moved away from linear scripts and adopted Class-based architecture.
- Exhaustively analyze the 4 Pillars of OOP: Encapsulation, Inheritance, Polymorphism, and Abstraction.
- Compare real code examples of "Don't do this" (Spaghetti code) vs. "Do this" (Production Playwright E2E architecture).
- Discover historical trivia about the origin of the Page Object Model.
- Correctly answer the technical difference between an `interface` and an `abstract class`.
- Use OOP as a "shield" against unstable code generated by AI assistants.
:::

### 2.1 Historical Context: From Linear Scripting to Blueprints (Classes)

::: tip 📝 Historical Context
In the early days of test automation, tests were just a long list of commands dumped into a file. You found a button, clicked it, typed some text. As applications grew huge (dozens of pages, thousands of tests), this style led to an architectural collapse: "Spaghetti Code". If a developer changed the CSS class of a Login button, you had to manually search across 500 test files to fix that string.
:::

To bring order, QA engineers borrowed **Object-Oriented Programming (OOP)** from Backend developers. Instead of writing actions in a heap, we group data (CSS selectors) and actions (`click`, `fill`) into logical "boxes" called **Classes**.

A Class is a **Blueprint** (or a technical sketch). From it, we generate real "Objects" (Instances) that we interact with. In Playwright, we map every page in the web application (e.g., `LoginPage`, `CheckoutPage`) into a dedicated Class. This supreme Design Pattern is called **Page Object Model (POM)**.

The 4 pillars of OOP are not just theory; they are the survival rules of this model.

### 2.2 Pillar 1: Encapsulation (Securing Data and Selectors)

::: tip 📝 The Need and the Problem Solved
In a team of 10 testers, if selectors (e.g., `#submit-btn`) are left exposed (global), anyone can accidentally modify them from inside a random test. Worse, if the logic for extracting text lives directly in the test file, any UI change breaks hundreds of tests at once. Encapsulation solves this by "hiding" sensitive data (selectors) inside the class and allowing interaction with them only through well-guarded doors (asynchronous methods).
:::

We use **Access Modifiers**:

* `public` (default): Can be called directly from the test file.
* `private`: Accessible **ONLY** from inside the class (perfect for CSS selectors).
* `readonly`: Constant. Once set, it can never be changed (e.g., the page URL).

#### ❌ Don't Do This (Without Encapsulation - Fragile Code in Test)

The test file has direct access to the "innards" of the page.

```ts
// Test file: login.spec.ts
// If tomorrow the input becomes "#user-email", you must manually search for this string in 50 tests!
await page.fill("#username-field", "admin");
await page.click(".btn-login");
```

#### ✅ Do This (With Encapsulation - Real Page Object Model)

We hide the selectors inside the class. The test knows nothing at all about the page's CSS!

```ts
// POM file: LoginPage.ts
import { Page } from 'playwright';

class LoginPage {
    // ENCAPSULATION: Selectors are private. They cannot be accessed or broken from the test!
    private selUsername = "input[data-testid='username']";
    private selBtnLogin = "button[data-testid='login']";
    readonly url = "https://app.com/login";

    // Inject the native Playwright Page object
    constructor(private page: Page) {}

    // Expose a public "door". The test just calls it, without caring HOW it works.
    public async performLogin(user: string): Promise<void> {
        await this.page.fill(this.selUsername, user);
        await this.page.click(this.selBtnLogin);
    }
}

// Test file: login.spec.ts
const loginPage = new LoginPage(page);
// loginPage.selUsername = "hacked"; // ❌ TS ERROR: Property 'selUsername' is private!
await loginPage.performLogin("admin"); // ✅ Clean, resilient E2E test.
```

### 2.3 Pillar 2: Inheritance (Code Reuse - DRY)

**The Need and the Problem Solved:** Your E2E app has 20 pages (Dashboard, Settings, Profile, etc.). All 20 pages have a navigation bar (Navbar) with a Logout button. If you write the class for each page from scratch, you will duplicate the Logout selector and the `click()` method 20 times. Inheritance solves this: you create a "Parent" class that holds the global elements, and the rest of the "Child" classes automatically absorb all the code using the `extends` keyword.

#### ❌ Don't Do This (Duplicate Code)

```ts
class DashboardPage {
    public async logout() { await this.page.click("#logout-btn"); }
}

class SettingsPage {
    public async logout() { await this.page.click("#logout-btn"); } // DUPLICATE!
}
```

#### ✅ Do This (Inheritance - Hierarchical E2E Architecture)

```ts
// THE PARENT (Holds global elements and receives Page)
class BasePage {
    constructor(protected page: Page) {} // protected allows children to use this.page!

    public async logout(): Promise<void> {
        await this.page.click("[data-testid='nav-logout']");
        await this.page.waitForURL('**/login'); // Wait for redirect
    }
}

// THE CHILD (Extends the Parent, getting its methods for free)
class DashboardPage extends BasePage {
    private selChart = '.chart-container';

    constructor(page: Page) {
        super(page); // Pass the Playwright Page instance to the Parent!
    }

    public async verifyChart(): Promise<void> {
        await expect(this.page.locator(this.selChart)).toBeVisible();
    }
}

const dash = new DashboardPage(page);
await dash.verifyChart(); // Own method
await dash.logout();      // ✅ Success! Logged out cleanly, even though we didn't write the code in DashboardPage.
```

### 2.4 Pillar 3: Polymorphism (Overriding Behavior)

**The Need and the Problem Solved:** Sometimes, the Parent's logic does not fit 100% with the Child's reality. Suppose the `BasePage` Parent has a `waitForLoad()` method that checks a standard network state. But your Financial Reports page (the Child) calls a slow API that takes 15 seconds. Polymorphism allows the Child to **override** the Parent's method, keeping the exact same name (so it doesn't confuse testers calling it), while changing the internal logic!

#### ❌ Don't Do This (Multiple names, confusion in tests)

```ts
class ReportsPage extends BasePage {
    // The tester using the class no longer knows whether to call 
    // waitForLoad() (from the parent) or this new one:
    public async waitForExtraLongHeavyAPILoad() { ... } 
}
```

#### ✅ Do This (Polymorphism - Same contract, different E2E execution)

```ts
class BasePage {
    constructor(protected page: Page) {}

    public async waitForLoad(): Promise<void> {
        // Standard Playwright wait when network traffic settles
        await this.page.waitForLoadState('networkidle'); 
    }
}

class ReportsPage extends BasePage {
    // POLYMORPHISM: We override the parent's method!
    // We keep the EXACT same name, but swap the wait for one specific to the heavy API.
    public async waitForLoad(): Promise<void> {
        console.log("This screen is slow. Waiting for the HTTP response from the reports API...");
        await this.page.waitForResponse(response => 
            response.url().includes('/api/heavy-reports') && response.status() === 200
        );
    }
}

const reports = new ReportsPage(page);
await reports.waitForLoad(); // ✅ Will run the slow async version, specific only to this page!
```

### 2.5 Pillar 4: Abstraction (Enforcing Architectural Rules)

**The Need and the Problem Solved:** You are the framework architect working with 5 Junior QAs. Someone creates a new Page (e.g., `ProfilePage`), but "forgets" to implement the critical assertion that verifies whether the page actually opened properly. Abstraction is your role as Technical Director. A class marked with `abstract` is a "ghost" class: you **CANNOT** instantiate objects from it (you cannot run `new BasePage()`). It exists exclusively to enforce rules. An abstract method is a method with no logic inside — it is only a strict contract, forcing the child to write the E2E code!

#### ❌ Don't Do This (Optional rules, Flaky tests)

```ts
class BasePage { ... }

class ProfilePage extends BasePage {
    // The junior forgets to implement the page state validation function.
    // TypeScript doesn't complain. Tests reach production and crash randomly,
    // because Playwright doesn't know when the page has truly loaded.
}
```

#### ✅ Do This (Abstraction - Contract enforced by the TS compiler)

```ts
abstract class BasePage {
    constructor(protected page: Page) {}

    // Common method that can be used by everyone
    public async reloadPage(): Promise<void> {
        await this.page.reload();
    }

    // ABSTRACT METHOD: Has no code, only defines the obligation!
    abstract validatePageLoad(): Promise<void>; 
}

// ❌ const base = new BasePage(page); // TS ERROR: Cannot create an instance of an abstract class.

class ProfilePage extends BasePage {
    // If you deleted the block below, TS would underline 'ProfilePage' in RED:
    // "Non-abstract class 'ProfilePage' does not implement inherited abstract member 'validatePageLoad'"
    
    public async validatePageLoad(): Promise<void> {
        // Forced by the contract, the tester writes the clear page assertion!
        await expect(this.page).toHaveTitle(/My Profile/);
        await expect(this.page.locator('.avatar-img')).toBeVisible();
    }
}
```

### 2.6 💡 Did you know...?

::: tip 💡 Did you know...?
Origin of POM: The "Page Object Model" concept was not invented by Playwright's creators; it was popularized more than 10 years ago by the Selenium WebDriver community (specifically by Simon Stewart) and formally recognized as an excellent *Design Pattern* by famed software architect Martin Fowler. The Diamond Problem: In TypeScript (and JavaScript), a class can inherit (`extends`) only a single Parent. The language forbids multiple inheritance to avoid the situation where two parent classes have a method with the same name and the child doesn't know which one to pick. If you need multiple structures, you must use interfaces (a class can implement as many interfaces as it wants).
:::

### 2.7 🧠 Interview Challenge (Technical Question)

::: warning 🧠 Interview Challenge (Technical Question)
**Interviewer:** *"In TypeScript, to enforce a certain structure for the pages in your E2E framework, we can use either an `interface` or an `abstract class`. What is the major difference, and which one do you choose when building the foundation of a Page Object Model (POM)?"*
:::

**Your engineer's answer:** *"The main difference is what happens at compile time and what they can contain. An `interface` is a simple invisible blueprint. It disappears completely when the code compiles to JavaScript and **cannot** contain even a single line of executable code (no implementation). An `abstract class` survives compilation. It allows me a hybrid approach: I can enforce strict contracts through `abstract` methods (like an interface does), **and I can also write real, reusable Playwright code** (such as a general `logout()` method) that all children will directly inherit. That is why, for the foundation of an E2E framework (`BasePage`), I always choose an abstract class!"*

### 2.8 🤖 Engineer Mindset in the AI Era: Fight "Spaghetti" Code

::: tip 🤖 Engineer Mindset in the AI Era
The Linear Scripting Disaster Trap (Where AI fails): If you give an AI the prompt *"Write me 3 Playwright tests for the checkout flow"*, its default behavior is to generate huge files where it declares `#cart` or `.buy-btn` selectors endlessly in every file, calling raw `page.click()`. The AI solves the immediate problem, but destroys future maintenance (if the `#cart` id changes, 100 AI-generated tests fail simultaneously). How a QA engineer thinks: The engineer refuses superficial prompts. They act as an Architect for the AI: *"Generate a Page Object for the checkout flow in Playwright. Encapsulate all selectors as private properties. Extend the abstract `BasePage` class and implement the mandatory page validation method. Make sure my test files (`spec.ts`) strictly use only the exposed public methods, with no selectors exposed in the test."* Result: By forcing the AI to respect OOP pillars, you get E2E code written at superhuman speed, yet protected by impenetrable architectural armor that you can scale infinitely.
:::

---

## Chapter 3: Practical Refactoring - Building the POM for "Task Tracker"

::: info 🎯 Learning Objectives
By the end of this chapter, you will be able to:
- Make the mental transition from application code (SUT - Software Under Test) to Test Framework code.
- Use the `data-testid` attributes added in Session 6 to build a rock-solid Page Object Model.
- Apply the 4 OOP pillars (learned earlier) to map the Task Tracker application interface.
- Mock Playwright types (`Page`, `Locator`) to write strictly typed E2E code.
:::

### 3.1 The Bridge to the Automation Module

::: tip 📝 Historical Context
In Session 6, we played the role of Front-End Developers and built the "Task Tracker" application. We added special attributes like `data-testid="input-task-name"`. Now, we put on our QA Automation Engineers hat for good.
:::

To test this application without writing *Spaghetti Code*, we will build a **Page Object Model (POM)** architectural structure. We will create a `TaskTrackerPage` class that will serve as an application user manual for our future Playwright robot.

### 3.2 Setting the Stage (Mocking Playwright)

Because Playwright will only be installed in the next Module, to make sure TypeScript doesn't give us editor errors (since it doesn't know the `page` object yet), we will create some **Interfaces (Mocks)** that simulate the exact contract Playwright will provide us.

This practice is essential in engineering: we program against "contracts" (Interfaces), not implementations!

```ts
// 1. MOCKS: This is what the hidden native interfaces inside Playwright look like!
// We define them here just to get autocomplete and zero TS compile errors.

interface Locator {
    click(): Promise<void>;
    fill(text: string): Promise<void>;
    innerText(): Promise<string>;
}

interface Page {
    goto(url: string): Promise<void>;
    locator(selector: string): Locator;
    waitForLoadState(state: 'load' | 'networkidle'): Promise<void>;
}
```

### 3.3 Building the Parent Architecture (BasePage)

The golden rule of OOP in testing is not to duplicate common code. Every page in our future framework (be it the Login page or Task Tracker) will need to be visited by URL and wait for the network to load. Through **Abstraction** and **Inheritance**, we enforce a strict contract.

```ts
// THE PARENT: The base of all pages in our E2E framework
abstract class BasePage {
    // Encapsulate the received Playwright page, protecting it while allowing children access
    constructor(protected page: Page) {}

    // Common reusable E2E method
    public async visit(url: string): Promise<void> {
        console.log(`[Network] Navigating to: ${url}`);
        await this.page.goto(url);
    }

    // Abstraction: Force any QA creating a new page to write a validation function!
    abstract waitForFullLoad(): Promise<void>;
}
```

### 3.4 Creating the POM for Our SUT (TaskTrackerPage)

This is the moment of truth. We will write the Class that maps 1-to-1 to our Task Tracker application. Notice how we use **Encapsulation** to block direct access to CSS selectors and how we expose public, intuitive methods based on business actions (e.g., `addNewTask()`).

```ts
// THE CHILD: The dedicated Page Object Model for our Session 6 application
class TaskTrackerPage extends BasePage {
    
    // 1. SELECTOR ENCAPSULATION: We use EXCLUSIVELY the data-testid attributes we added!
    private selInputTask = "[data-testid='input-task-name']";
    private selBtnSave = "[data-testid='submit-task-btn']";
    private selTaskList = "[data-testid='task-list']";
    private selError = "[data-testid='error-message']";

    constructor(page: Page) {
        super(page); // Pass Playwright control to the parent
    }

    // 2. POLYMORPHISM: Mandatory implementation enforced by the Parent
    public async waitForFullLoad(): Promise<void> {
        console.log("[TaskTracker] Waiting for the external API to finish downloading the 5 initial tasks...");
        await this.page.waitForLoadState('networkidle');
    }

    // 3. BUSINESS E2E METHODS: Hide Playwright commands behind easy-to-read actions
    public async addNewTask(taskName: string): Promise<void> {
        console.log(`[UI Action] Filling form with task: "${taskName}"`);
        
        // Grab the locator and execute simulated async actions
        const inputLocator = this.page.locator(this.selInputTask);
        await inputLocator.fill(taskName);
        
        const btnLocator = this.page.locator(this.selBtnSave);
        await btnLocator.click();
    }

    public async getErrorMessage(): Promise<string> {
        const errorLocator = this.page.locator(this.selError);
        return await errorLocator.innerText();
    }
}
```

Now, in Module 4, your test files (`spec.ts`) will look remarkably clean. The tester writing the E2E test will use only the exposed actions, completely decoupled from HTML or fragile selectors:

```ts
// What your real Playwright test will look like in Session 10:
/*
test('User can add a valid task', async ({ page }) => {
    const trackerApp = new TaskTrackerPage(page);
    
    await trackerApp.visit('http://localhost:3000');
    await trackerApp.waitForFullLoad();
    
    await trackerApp.addNewTask('E2E POM Testing');
    
    // Verification assertion
    await expect(page.locator("[data-testid='task-list']")).toContainText('E2E POM Testing');
});
*/
```

### 3.5 💡 Did you know...?

::: tip 💡 Did you know...?
Test Code is Software Too: Many beginner QAs treat automated tests like "throwaway scripts". Professionals treat the test framework with the same level of architectural rigor (OOP, Clean Code, PR Reviews) as the application they test (SUT). A messy framework becomes impossible to run in CI/CD after just 6 months. Separation of Concerns (SoC): Page Object Model is the perfect implementation of the SoC principle. We separate the logic for finding elements on the page (the Class) from the logic that decides whether the test passes or fails (the `spec.ts` file with Assertions).
:::

### 3.6 🧠 Interview Challenge (Technical Question)

::: warning 🧠 Interview Challenge (Technical Question)
**Interviewer:** *"I'm looking at your `TaskTrackerPage` class. Why did you put the CSS selectors as class properties (at the top), instead of putting them as variables directly inside the `addNewTask()` function?"*
:::

**Your engineer's answer:** *"I centralized the selectors as private class-level properties to ensure **Centralized Maintenance (Single Source of Truth)**. If I had placed the `[data-testid='input-task-name']` selector directly inside `addNewTask()`, and then reused it in another function `verifyInputState()`, I would have created duplicate code. If Frontend developers change the `testid` attribute in HTML tomorrow, with this OOP architecture I only need to change the string in one place (at the top of the class), and ALL functions and E2E tests depending on it will automatically 'self-heal' and use the new value."*

### 3.7 🤖 Engineer Mindset in the AI Era: Building Boilerplates

::: tip 🤖 Engineer Mindset in the AI Era
SUT-Based Prompts — What AI does well: AI is exceptional at writing boring code. Mapping dozens of selectors from an HTML page into a TypeScript class takes manual time. How a QA engineer thinks: The engineer uses AI for "Heavy Lifting". They copy the entire `index.html` file of the SUT application and feed it into ChatGPT along with the following Architectural Prompt: *"Here is the application's HTML. Generate a Page Object Model class in TypeScript. Extract EXCLUSIVELY `data-testid` attributes and turn them into private properties. Generate `public` async methods wrapping Playwright methods (`fill`, `click`) only for interactive elements (form, buttons)."* Result: You get a perfect POM class Boilerplate in seconds, respecting OOP pillars (Encapsulation). The time saved is then used by the engineer to write the *business logic* of the assertions.
:::

---

## Chapter 4: Advanced Structures - Smart Functions with Generics (`<T>`)

::: info 🎯 Learning Objectives
By the end of this chapter, you will be able to:
- Understand the historical context: how code duplication and the `any` type destroyed early TS frameworks, leading to the invention of Generics.
- Discover the concept of "Generics" (Parameterized Types) as "3D printers" for data types.
- Build a robust E2E API Client using `GET<T>` and `POST<T, U>` methods.
- Discover how Playwright uses generics natively to extract data from the DOM (`page.evaluate<T>`).
- Answer Mid-Senior level interview questions about runtime vs. compile-time data safety.
:::

### 4.1 Origin and Problem: The Framework Suffocated by Duplication

::: tip 📝 Historical Context
When companies began using TypeScript for test automation (QA), they hit a major problem when testing APIs or reading data from JSON files (Data-Driven Testing). The application has dozens of entities: Users, Products, Orders, Tasks. How do you write a reusable function to request this data from the server? Before Generics, engineers had only two options, both disastrous:
:::

#### ❌ Approach 1: Infinite Duplicate Code (Violating DRY)

You had to write a unique function for EACH resource type. If you had 50 endpoints, you wrote 50 functions doing the exact same thing (a simple `fetch`), differing only in the return interface.

```ts
async function fetchUser(url: string): Promise<User> { ... }
async function fetchTask(url: string): Promise<Task> { ... }
async function fetchProduct(url: string): Promise<Product> { ... }
```

**Result:** Thousands of lines of useless code. Impossible maintenance.

#### ❌ Approach 2: Returning to the Wild West of JavaScript (Using `any`)

To escape duplication, lazy programmers created a single "universal" function returning `any`.

```ts
async function fetchUniversalData(url: string): Promise<any> {
    const response = await fetch(url);
    return await response.json();
}

// In the test:
const user = await fetchUniversalData('/api/user/1');
console.log(user.fulName); // No error in VS Code, but the test crashes at runtime (it was fullName).
```

**Result:** You saved space, but completely destroyed the purpose of TypeScript. You lose autocomplete and safety (Type Safety) right when you need them most: in test assertions.

### 4.2 The Rescue: The Concept of Generics (`<T>`)

To solve this impasse, modern languages (borrowing the concept from C# and Java) introduced **Generics**. Think of them as **parameters, not for values, but for TYPES**.

By convention, we use the capital letter **`<T>`** (for Type). A generic function acts like a 3D printer: it doesn't know in advance what shape it will print, but when you feed it the mold (your interface), it fits it perfectly and guarantees the result.

### 4.3 E2E Example 1: Building a Production APIClient (Do This)

In Playwright, you won't call `fetch` randomly. You will build a utility class used across all tests. Notice how we use `<T>` to make the methods universal and safe.

```ts
// 1. Our molds (Interfaces)
interface UserData { id: number; username: string; }
interface TaskData { id: number; completed: boolean; }

// 2. E2E Utility Class
class ApiClient {
    
    // The GET method accepts a type T and guarantees it returns a Promise of that type T
    public async get<T>(url: string): Promise<T> {
        const response = await fetch(url);
        if (!response.ok) throw new Error("API failed!");
        return (await response.json()) as T;
    }

    // The POST method is more advanced: it accepts T (for the sent Payload) 
    // and U (for the received Response), because they often differ!
    public async post<T, U>(url: string, payload: T): Promise<U> {
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(payload)
        });
        return (await response.json()) as U;
    }
}

// 3. Test Execution (Here is where the Magic happens!)
const runApiTests = async () => {
    const api = new ApiClient();

    // Pass the <UserData> type as a TYPE ARGUMENT. 
    // The `user` variable instantly gets autocomplete for .username!
    const user = await api.get<UserData>('https://api.example.com/users/1');
    console.log(`Testing user: ${user.username}`);

    // Reuse the EXACT same function, but now transform it into a Task!
    const task = await api.get<TaskData>('https://api.example.com/tasks/99');
    console.log(`Task completed? ${task.completed}`);
};
```

### 4.4 E2E Example 2: How Playwright Uses Generics in the DOM

Generics are not just for APIs. Playwright uses them internally in its most powerful methods.

When you want to extract complex information directly from inside the browser (DOM context) and bring it into your test (Node.js context), you use the `page.evaluate()` method. Without Generics, TypeScript wouldn't know what the browser returns.

```ts
// Real example from a Playwright E2E script:
test('Extract score from UI', async ({ page }) => {
    
    // Playwright lets us specify <number> here. 
    // We guarantee to the framework that the script injected into the browser will mathematically return a number.
    const visualScore = await page.evaluate<number>(() => {
        // Here we are inside the Chrome browser!
        const text = document.querySelector('.total-score')?.textContent;
        return text ? parseInt(text) : 0;
    });

    // Because visualScore is guaranteed to be <number>, TS lets me use numeric assertions:
    expect(visualScore).toBeGreaterThan(100); 
});
```

### 4.5 E2E Example 3: Reading Data Files (Data-Driven Testing)

Another daily QA scenario is Data-Driven Testing. You want to run the same test 10 times, reading data from a `.json` file. The function reading the file must be generic, to adapt to any test file (users, passwords, products).

```ts
// Generic function (Mock) that reads a file and applies the type
const readTestFile = async <T>(fileName: string): Promise<T[]> => {
    console.log(`Reading data from ${fileName}...`);
    // Simulate JSON parsing
    const rawData = '[{"id": 1, "name": "Test1"}]'; 
    return JSON.parse(rawData) as T[];
};

interface TestCategory { id: number; name: string; }

const testDataDriven = async () => {
    // The resulting array automatically gets methods specific to lists of TestCategory
    const categories = await readTestFile<TestCategory>('categories.json');
    
    categories.forEach(cat => {
        console.log(`Asserting category: ${cat.name}`); // Perfect autocomplete
    });
};
```

### 4.6 💡 Did you know...?

::: tip 💡 Did you know...?
Constrained Generics (`extends`): Generics can be limited. They don't have to accept "anything". If you write `<T extends { id: number }>`, you tell the compiler: *"Accept any type T you want, as long as that object has at least a property named `id` of type number"*. This is essential for building delete functions (DELETE), which always need an ID. Generic UI Components: In frontend frameworks (like React) or Component Testing frameworks, you can create a Generic Page Object Model. A `GenericTable<T>` class can map any table on the screen, automatically adapting its columns depending on the data type T you pass to it.
:::

### 4.7 🧠 Interview Challenge (Technical Question)

::: warning 🧠 Interview Challenge (Technical Question)
**Interviewer:** *"What is the difference between writing a function that returns `any` and a function that uses a Generic type `<T>`? Isn't it the same thing, since both accept any kind of payload from the server?"*
:::

**Your engineer's answer:** *"Although both accept any input data, the huge architectural difference is at the **output (the return)**. If my function returns `any`, TypeScript shuts down. I lose the validation chain (Type Safety) right when I save the result into the test variable, opening the door to Flaky Tests caused by typos. Generics (`<T>`) create an **invisible mathematical communication channel**. When I pass the `<User>` type to the function, that type travels through the entire function and 'freezes' the return type. The editor knows exactly what it returns to me, gives me autocomplete on `User` properties, and guarantees the safety of E2E assertions, completely eliminating the need for `any`."*

### 4.8 🤖 Engineer Mindset in the AI Era: Safe Utility Functions

::: tip 🤖 Engineer Mindset in the AI Era
"Overly Flexible" Helper Code Trap (Where AI fails): AI assistants (Copilot, ChatGPT) have a bad habit of generating "Swiss Army Knife" Helper functions. If you ask for a script to query the database for test setup, it will generate a pretty function that implicitly returns `any` to make sure its script doesn't throw immediate errors. Such a `dbUtils.ts` file will 'poison' the architecture with untyped returns. How a QA engineer thinks: The engineer controls code quality at the source. When asking the AI to write Setup/Teardown utility methods, they use a restrictive architectural prompt: *"Create a TypeScript utility service for Database/API. All read methods must be Generic (`<T>`), do not use `any`. Parameterize the functions so I can pass model interfaces from the E2E test."* Result: You get an incredibly flexible framework (you can query any resource from the DB) without sacrificing a single second of the strict safety enforced by the TypeScript compiler.
:::

---

## Chapter 5: Session 8 Homework & Extra Practice (Towards Senior Level)

### 5.1 Homework (Session 8 Architectural Project)

::: info 🎯 Homework Objective
Demonstrate mastery of the 4 Pillars of Object-Oriented Programming (OOP) and TypeScript Utility Types by building the Page Object Model (POM) skeleton for an online store (E-Commerce).
:::

#### 🏢 Business Scenario

Your team has just started a new QA Automation project with Playwright for the "QA-Commerce" application. The application has 3 main pages:

1. **Home Page (`HomePage`):** Where products are searched.
2. **Product Page (`ProductPage`):** Where details are viewed and items are added to the cart.
3. **Checkout Page (`CheckoutPage`):** Where shipping details are entered and the order is placed.

Your mission, as a Test Architect, is to write the **Class Structure (POM)** in TypeScript that maps these pages, paving the way for colleagues who will write the actual tests.

#### 📋 Technical Requirements (Acceptance Criteria)

1. **Data Interfaces (Source of Truth):**
   * Create an interface `Product` with `id`, `name`, `price`, and `inStock`.
   * Using Utility Types, create a Type named `TestProduct` that removes (`Omit`) the `id` (because we don't need it when searching for the product visually on the site).
2. **Abstraction & Inheritance (Base Class):**
   * Create an `abstract class BasePage`.
   * In the constructor, it must receive and protect the `page` object (we will temporarily use type `any` for `page` just so it doesn't error in TS Playground, simulating Playwright).
   * Add a mandatory abstract method `validateLoad(): void;`.
   * Add a common method `public navigateTo(url: string): void`.
3. **Encapsulation & Polymorphism (Child Classes):**
   * Create the `HomePage` class extending `BasePage`. Encapsulate a private selector for the search bar (`#search-bar`). Implement the mandatory load validation method.
   * Create the `ProductPage` class extending `BasePage`. Encapsulate the selector for the "Add to cart" button (`.add-to-cart-btn`).
   * **E2E Requirement:** Add a public method in `ProductPage` named `addToCart(product: TestProduct)`. The function must accept the interface (blueprint) defined in step 1 and print to the console the name of the product being added.

### 5.2 Bonus Challenge (Mid-Senior Level): Interactions with Generics `<T>`

In `BasePage`, create a method named `extractPageData<T>(selector: string, mockData: T): T`. This method will simulate Playwright's `page.evaluate()` function. The method must accept a Generic type `<T>` and simply return the `mockData` variable. When instantiating the classes, call this method passing the `Product` interface as a type argument, to demonstrate you understood typed data extraction!

### 5.3 🗝️ Answer Keys (Solutions & Explanations)

*Golden Rule: Do not read the solution before wrestling with your own code in TS Playground for at least 30 minutes!*

**Homework Solution (E-Commerce POM Structure):**

```ts
// --- 1. DATA BLUEPRINTS ---
interface Product {
    id: number;
    name: string;
    price: number;
    inStock: boolean;
}

// Use Omit to generate a clean payload for UI tests
type TestProduct = Omit<Product, 'id'>;


// --- 2. BASE CLASS (Abstraction and Inheritance) ---
abstract class BasePage {
    // We use 'any' for page only in this test environment. 
    // In Playwright, it will be: constructor(protected page: Page) {}
    constructor(protected page: any) {}

    public navigateTo(url: string): void {
        console.log(`[Common Action] Navigating to: ${url}`);
    }

    // Generic Method (Bonus Challenge)
    public extractPageData<T>(selector: string, mockData: T): T {
        console.log(`[Generic Extract] Finding selector ${selector} and returning structure T...`);
        return mockData;
    }

    // Strict contract for all children
    abstract validateLoad(): void;
}


// --- 3. PAGE CLASSES (Encapsulation and Polymorphism) ---

class HomePage extends BasePage {
    // Secured selectors
    private selSearchBar = "#search-bar";
    private selSearchBtn = "#btn-search";

    constructor(page: any) {
        super(page); // Initialize the Parent
    }

    // Mandatory implementation
    public validateLoad(): void {
        console.log("[HomePage] Validation: Search bar is visible on screen.");
    }

    public searchProduct(productName: string): void {
        console.log(`[HomePage] Typing "${productName}" into selector ${this.selSearchBar}`);
        console.log(`[HomePage] Clicking ${this.selSearchBtn}`);
    }
}


class ProductPage extends BasePage {
    // Secured selectors
    private selAddToCartBtn = ".add-to-cart-btn";
    private selCartCounter = ".cart-counter";

    constructor(page: any) {
        super(page);
    }

    // Mandatory implementation with specific logic
    public validateLoad(): void {
        console.log("[ProductPage] Validation: 'Add to cart' button is present and active.");
    }

    // Use the interface as a strict contract for Test Data!
    public addToCart(product: TestProduct): void {
        console.log(`[ProductPage] Adding product [${product.name}] priced at ${product.price} USD.`);
        console.log(`[ProductPage] Clicking ${this.selAddToCartBtn}`);
    }
}


// --- 4. E2E TEST SIMULATION (How code will look in Session 10) ---
console.log("=== Starting E2E Test: Add Product ===");

// 1. Define test data respecting the contract
const testLaptop: TestProduct = {
    name: "Laptop QA Pro",
    price: 4500,
    inStock: true
};

const mockPlaywrightPage = {}; // Framework object simulation

// 2. Navigation and Search
const home = new HomePage(mockPlaywrightPage);
home.navigateTo("https://qa-commerce.com");
home.validateLoad();
home.searchProduct(testLaptop.name);

// 3. Add to Cart
const productPage = new ProductPage(mockPlaywrightPage);
productPage.validateLoad();
productPage.addToCart(testLaptop);

// 4. Test Generic Function (Bonus)
const productExtractedFromDOM = productPage.extractPageData<Product>(".product-data", {
    id: 99,
    name: "Laptop QA Pro",
    price: 4500,
    inStock: true
});

console.log("=== Test Completed Successfully ===");
```

🎉 **Congratulations!** Once you understand and comfortably write this kind of code, you are officially capable of building an Automated Testing Framework from scratch! With this homework, we have covered all technical requirements to transition to the Playwright Module (Module 4).

---

## Chapter 6: Workbook - E2E Architecture

::: info 📈 Workbook Goal
Transitioning from a test scripter (Scripter) to a Test Architect. This workbook no longer contains just "applied theory", but executable mini-frameworks. We will simulate Playwright's internal engine to see how Utility Types, Generics, and the 4 OOP Pillars interact in the most complex way possible.
:::

🛠️ **Setup:** Open [**TypeScript Playground**](https://www.typescriptlang.org/play) (make sure `strict: true` is checked in TS Config). Copy each exercise in full, press **Run**, and carefully study the Console (Logs) to understand how your architecture runs under the hood.

### 📍 Exercise 1: Manipulating Complex Data (Omit, Partial, Pick)

**E2E Context:** You are responsible for testing the API of an electronics store. A complete `Product` resource in the database has 6 fields. When writing a **POST** (Create) test, you are not allowed to send `id` and `addedAt` (the server creates them). When writing a **PATCH** (Update) test, you want to send only 1 or 2 fields. And for a summary UI validation, you only need `name` and `price`. Without Utility Types, you would have to write 4 different interfaces and maintain them manually.

```ts
// 1. SOURCE OF TRUTH (Full Database Model)
interface ProductDB {
    id: number;
    name: string;
    price: number;
    category: string;
    inStock: boolean;
    addedAt: string;
}

// 2. UTILITY TYPES (Generate contracts on the fly, zero code duplication!)
// POST: Cut ID and date, the rest remain required
type CreateProduct = Omit<ProductDB, 'id' | 'addedAt'>;

// PATCH: Everything becomes optional (we can send just the price, for example)
type UpdateProduct = Partial<ProductDB>;

// PICK: Keep STRICTLY only name and price (for a summary UI test)
type ProductSummary = Pick<ProductDB, 'name' | 'price'>;

// --- API TEST FRAMEWORK SIMULATION ---
class MockApiTestRunner {
    public testCreate(payload: CreateProduct): void {
        console.log("[POST] Valid payload received for creation:", payload);
        // Validate that ID was not accidentally sent
        if ('id' in payload) {
            console.error("❌ FATAL ERROR: You sent an ID in a POST request!");
        } else {
            console.log("✅ SUCCESS: POST payload is architecturally correct.");
        }
    }

    public testUpdate(id: number, payload: UpdateProduct): void {
        console.log(`[PATCH] Updating product ${id} with data:`, payload);
    }
}

// --- TEST EXECUTION ---
console.log("=== EXERCISE 1: RUNNING API TESTS ===");
const apiRunner = new MockApiTestRunner();

// Creating a product (TypeScript strictly validates that 'id' is missing)
const newLaptop: CreateProduct = {
    name: "MacBook Pro M3",
    price: 12000,
    category: "Laptops",
    inStock: true
};
apiRunner.testCreate(newLaptop);

// Updating (TypeScript validates that sent data is a subset of ProductDB)
const priceUpdate: UpdateProduct = {
    price: 11500 // Send only the updated price
};
apiRunner.testUpdate(101, priceUpdate);
```

### 📍 Exercise 2: Encapsulation and Simulating "Playwright Page"

**E2E Context:** If you leave selectors exposed in the script (`await page.click('.btn')`), you will create "Spaghetti Code" that breaks at the first UI change. Encapsulation forces hiding selectors in private variables and defining `readonly` constants. We will build our own `MockPage` object to see exactly how Playwright works under the hood.

```ts
// 1. PLAYWRIGHT MOCK (What the Page interface looks like behind the scenes)
interface PlaywrightPage {
    goto(url: string): Promise<void>;
    fill(selector: string, text: string): Promise<void>;
    click(selector: string): Promise<void>;
}

// 2. PAGE OBJECT MODEL CLASS (With strict encapsulation)
class LoginPage {
    // 🛑 ENCAPSULATION: readonly - URL cannot be changed at runtime!
    public readonly url: string = "https://app-test.com/login";

    // 🛑 ENCAPSULATION: private - Only methods in this class can use these selectors!
    private selUser = "input[data-testid='username']";
    private selPass = "input[data-testid='password']";
    private selBtnSubmit = "button[data-testid='login-submit']";

    constructor(private page: PlaywrightPage) {}

    // PUBLIC DOOR: The test only calls this business method
    public async performAuthentication(user: string, pass: string): Promise<void> {
        console.log(`[POM] Initiating authentication sequence for ${user}...`);
        
        await this.page.goto(this.url);
        await this.page.fill(this.selUser, user);
        
        // Hide password in test logs
        console.log(`[Playwright] Fill on [${this.selPass}] with value: [*** HIDDEN ***]`);
        
        await this.page.click(this.selBtnSubmit);
        console.log(`[POM] Authentication sequence submitted.`);
    }
}

// --- TEST EXECUTION ---
console.log("\n=== EXERCISE 2: ENCAPSULATION ===");

// Create a fake Playwright Page instance that logs actions to console
const playwrightSimulator: PlaywrightPage = {
    goto: async (url) => console.log(`[Playwright] Navigating to: ${url}`),
    fill: async (sel, txt) => console.log(`[Playwright] Fill on [${sel}] with value: [${txt}]`),
    click: async (sel) => console.log(`[Playwright] Click on selector: [${sel}]`)
};

const loginPage = new LoginPage(playwrightSimulator);

// ❌ If you uncomment the lines below, TS gives a red error:
// loginPage.url = "https://hacked.com"; // "Cannot assign to 'url' because it is a read-only property."
// loginPage.selUser = ".new-class"; // "Property 'selUser' is private."

// Run the clean test
loginPage.performAuthentication("qa_ninja", "Password123!");
```

### 📍 Exercise 3: The DRY Principle (Inheritance) in POM Architecture

**E2E Context:** You have 30 pages in your application. On all pages you have a top menu (Navbar) with a Logout button, a common wait function, and a cookie-acceptance function. Instead of writing `acceptCookies()` 30 times (violating *Don't Repeat Yourself*), we write it once in a Parent class.

```ts
// 1. PARENT CLASS (Contains global elements and methods)
class BasePage {
    constructor(protected pageName: string) {}

    public logAction(action: string): void {
        console.log(`[${this.pageName}] ${action}`);
    }

    public acceptCookies(): void {
        this.logAction("Clicking button '#accept-all-cookies'");
    }

    public navigateHome(): void {
        this.logAction("Clicking Navbar logo to redirect.");
    }
}

// 2. CHILD CLASS 1 (Extends BasePage)
class DashboardPage extends BasePage {
    constructor() {
        super("Dashboard"); // Call Parent constructor
    }

    public verifyChart(): void {
        this.logAction("Checking visibility of selector '.main-chart'");
    }
}

// 3. CHILD CLASS 2 (Extends BasePage)
class SettingsPage extends BasePage {
    constructor() {
        super("Profile Settings");
    }

    public toggleDarkMode(): void {
        this.logAction("Clicking selector '.dark-mode-toggle'");
    }
}

// --- TEST EXECUTION ---
console.log("\n=== EXERCISE 3: INHERITANCE (DRY) ===");

const dashPage = new DashboardPage();
// PARENT method used for free by CHILD
dashPage.acceptCookies(); 
// Own method
dashPage.verifyChart();

console.log("-------------------");

const settingsPage = new SettingsPage();
// Same parent code, but runs in the new child's context!
settingsPage.acceptCookies(); 
settingsPage.toggleDarkMode();
settingsPage.navigateHome();
```

### 📍 Exercise 4: Surviving Flaky Tests (Polymorphism)

**E2E Context:** Your test needs to wait for the full page load. The standard method (inherited from `BasePage`) is to wait for the network to settle (`networkidle`). But your Checkout page is an exception: it waits for payment confirmation from an external bank, which behaves erratically. Polymorphism lets us smartly override the Parent's method exclusively for this page.

```ts
class StandardPage {
    public waitForLoad(): void {
        console.log("Waiting 1 second: 'networkidle' (No network requests in flight).");
    }
}

// POLYMORPHISM: CheckoutPage keeps the "form" (method name), but changes the "substance" (logic)
class SlowCheckoutPage extends StandardPage {
    
    // Override parent's method!
    public waitForLoad(): void {
        console.log("⚠️ POLYMORPHIC Wait (Overridden): This page is critical.");
        console.log("Waiting 15 seconds! Specifically checking HTTP 200 response from '/api/stripe/confirm'...");
    }

    public pay(): void {
        console.log("Clicking 'Confirm Payment'.");
    }
}

// --- TEST EXECUTION ---
console.log("\n=== EXERCISE 4: POLYMORPHISM ===");

const normalPage = new StandardPage();
console.log("-> Test on normal page:");
normalPage.waitForLoad(); // Runs Parent's logic

console.log("\n-> Test on Checkout page:");
const paymentPage = new SlowCheckoutPage();
paymentPage.waitForLoad(); // Runs Child's Overridden logic, isolating the test from Flaky errors!
paymentPage.pay();
```

### 📍 Exercise 5: The Technical Director (Abstraction)

**E2E Context:** You are the architect of the testing team. You've noticed Juniors constantly add new Page Objects, but "forget" to implement visibility assertions (`verifyPageOpened`), causing false-positive tests that pass even though the page crashed! You solve this by turning `BasePage` into an **abstract class**, enforcing an unbreakable contract.

```ts
// ABSTRACT CLASS: You cannot instantiate it with 'new'. It exists only to enforce rules!
abstract class MandatoryPage {
    public currentUrl: string;

    constructor(url: string) {
        this.currentUrl = url;
    }

    // Implemented (common) method
    public showTitle(): void {
        console.log(`Page initialized at: ${this.currentUrl}`);
    }

    // 🛑 ABSTRACT METHOD: No braces, no logic! FORCES the child to write it.
    abstract assertPageLoaded(): boolean;
}

// If a Junior writes the class below and forgets `assertPageLoaded`, 
// the compiler will instantly block the entire file with red errors!
class ReportsPage extends MandatoryPage {
    constructor() {
        super("/reports");
    }

    // Fulfilling the enforced contract:
    public assertPageLoaded(): boolean {
        console.log("[Enforced Assertion] Validating that '.reports-table' is visible on screen.");
        return true;
    }
}

// --- TEST EXECUTION ---
console.log("\n=== EXERCISE 5: ABSTRACTION ===");

const reports = new ReportsPage();
reports.showTitle();
const isVisible = reports.assertPageLoaded();
console.log(`Did the reports page pass the safety assertion? ${isVisible}`);
```

### 📍 Exercise 6: "3D Printer" Functions (Generics `<T>`)

**E2E Context:** You have 50 different API calls in your framework (`fetchUsers`, `fetchOrders`, `fetchInvoices`). To eliminate duplication and avoid using the `any` type (which kills autocomplete), you use Generics (`<T>`). You will build an E2E Helper that adapts like a chameleon to any data type you pass to it.

```ts
// Our interfaces
interface QAEmployee { id: string; level: "Junior" | "Senior"; technology: string; }
interface SUTProduct { sku: string; price: number; }

// Helper Class using Generics
class PlaywrightApiHelper {
    
    // <T> indicates the method is GENERIC. It doesn't know in advance what it returns.
    // It will only find out when the tester writes the E2E code!
    public async extractData<T>(url: string, mockResponse: T): Promise<T> {
        console.log(`[API Helper] Intercepting GET to ${url}...`);
        console.log(`[API Helper] Enforcing typing and returning data as type <T>.`);
        // Simulate resolved promise of an HTTP JSON response
        return Promise.resolve(mockResponse); 
    }
}

// --- TEST EXECUTION ---
console.log("\n=== EXERCISE 6: GENERICS (<T>) ===");
const api = new PlaywrightApiHelper();

const demoGenerics = async () => {
    // Request a QAEmployee. Notice how we pass <QAEmployee> at the call site!
    const qa = await api.extractData<QAEmployee>("/api/team/1", {
        id: "QA-01",
        level: "Senior",
        technology: "Playwright & TypeScript"
    });
    // VS Code knows 100% that `qa` has the `.level` property!
    console.log(`Data extracted successfully: Bringing in a ${qa.level} QA specialized in ${qa.technology}`);

    // Reuse the EXACT SAME METHOD, but request a SUTProduct!
    const phone = await api.extractData<SUTProduct>("/api/products/iphone", {
        sku: "IPH-15",
        price: 5000
    });
    console.log(`Data extracted successfully: Product with SKU ${phone.sku} costs ${phone.price} RON.`);
};

demoGenerics();
```

### 📍 Exercise 7: The Grand E2E Finale - The Assembled Framework

**E2E Context:** It's time to assemble the robot. We will take an abstract class (Pillar 4), inherit from it (Pillar 2), encapsulate its selectors (Pillar 1), override logic (Pillar 3), extract a profile from the database via API (Generics), and manipulate the payload with a Utility Type (`Omit`).

```ts
// 1. Types and Data
interface BaseProfile { dbId: number; username: string; age: number; }
// Cut out the ID to verify only the UI
type UISummary = Omit<BaseProfile, 'dbId'>;

// 2. Abstraction (The Core)
abstract class CorePage {
    constructor(protected name: string) {}
    abstract waitForE2EElements(): void;
}

// 3. Application POM (Encapsulation + Inheritance + Polymorphism)
class UserProfilePage extends CorePage {
    private inpName = "input#user-name";
    private inpAge = "input#user-age";

    constructor() { super("Profile Page"); }

    public waitForE2EElements(): void {
        console.log(`[POM] Checking vital assertions for ${this.name}...`);
        console.log(`[POM] Waiting for private selectors: ${this.inpName} and ${this.inpAge}`);
    }

    public verifyDataInDOM(visualData: UISummary): void {
        console.log(`[UI Assertion] Verifying that on-screen name is "${visualData.username}"`);
        console.log(`[UI Assertion] Verifying that on-screen age is "${visualData.age}"`);
    }
}

// 4. Generic API Helper
const fetchProfileFromBackend = <T>(mockData: T): T => {
    console.log("[Network] Downloading original profile from DB (Backend)...");
    return mockData;
};

// --- INTEGRATED E2E TEST EXECUTION ---
console.log("\n========== EXERCISE 7: E2E FRAMEWORK INTEGRATION ==========");
const runSupremeScenario = () => {
    // A. Extract "Source of Truth" from Database via API (Using Generics)
    const dbProfile = fetchProfileFromBackend<BaseProfile>({
        dbId: 777123,
        username: "Ninja.Automation",
        age: 30
    });

    // B. Transform DB data into a UI payload (Using Utility Types)
    const dataToVerifyVisually: UISummary = {
        username: dbProfile.username,
        age: dbProfile.age
    };

    // C. Interact with the Graphical Application (Using OOP and POM)
    const profilePage = new UserProfilePage();
    profilePage.waitForE2EElements();
    
    // D. Assert That UI matches DB (Supreme Hybrid Testing)
    profilePage.verifyDataInDOM(dataToVerifyVisually);
    
    console.log("================= E2E TEST PASSED ✅ =================");
};

runSupremeScenario();
```

🎉 **This Workbook represents the Pinnacle of TypeScript Architecture in QA!** Carefully analyze the console after running all the code. Every theoretical concept has been demonstrated and "caught" in a safety net, proving why modern testing frameworks (Playwright/Cypress) refuse the compromises of classic JavaScript. You are 100% ready for Session 9!
