# Session 7: Static Typing (TypeScript)

<div style="display: flex; gap: 12px; flex-wrap: wrap; margin: 1.5rem 0 0.5rem 0;">
  <a href="/pdfs/sessions/premium/typescript-playwright/session-7-en.pdf" class="download-btn" target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24"><path d="M5 20h14v-2H5v2zm0-10h4V4h6v6h4l-7 7-7-7z"/></svg>View the PDF version of Session 7</a>
</div>

::: info 📊 PowerPoint Presentation
Below you will find the interactive PowerPoint presentation for this session. You can browse the slides directly in your browser or download the course material in PDF format using the button above.
:::

<div style="position: relative; width: 100%; padding-bottom: 56.25%; height: 0; margin: 1.5rem 0; overflow: hidden; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
  <iframe 
    src="https://docs.google.com/presentation/d/e/2PACX-1vQq5feaCEDBXF4OhS_lRFmU7ghd-7J068K8qrVtAdxyCuWIsLFU8m06KvQQ2UsnIGcTmZSPihyJXMRq/pubembed?start=false&loop=false&delayms=3000" 
    frameborder="0" 
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;" 
    allowfullscreen="true" 
    mozallowfullscreen="true" 
    webkitallowfullscreen="true">
  </iframe>
</div>

---

## Chapter 1: Introduction to TypeScript — Why did JavaScript evolve?

::: info 🎯 Learning Objectives
By the end of this chapter, you will be able to:
- Understand the concept of "Typing" and the fundamental difference between a dynamically typed language (JavaScript) and a statically typed one (TypeScript).
- Learn the story of TypeScript's creation and the reasons why the tech giant Microsoft built it.
- Successfully answer technical interview scenarios regarding TypeScript execution in the browser.
- Discover why Playwright and the entire Enterprise Software industry have adopted TypeScript as the absolute standard.
:::

### 1.1 What is TypeScript (TS)?

In previous modules, you learned **JavaScript (JS)**. This is the native language of web browsers, incredibly flexible, but sometimes... *too flexible*. This flexibility frequently leads to bugs that only appear when the user clicks a button (at *runtime*).

**TypeScript** is NOT a completely new language. It is a **"Superset"** of JavaScript, created and maintained by Microsoft.

Think of TypeScript as *JavaScript with strict rules, an automatic spell-checker, and an advanced error-radar system*.

* **The Golden Rule:** Any valid JavaScript code is automatically valid TypeScript code. But TypeScript adds layers of safety on top of it.
* **How does it run?** Browsers (Chrome, Firefox) and Node.js **DO NOT** know how to read TypeScript. Therefore, TS code must be translated (compiled/transpiled) back into clean JavaScript before it is run. Playwright does this translation for you automatically in the background!

### 1.2 What does "Typing" actually mean?

To understand why TypeScript was invented, we first need to define the concept of "Typing".

**Typing** represents the set of rules by which a programming language assigns a category (a "data type" like String, Number, Boolean) to your variables, and how strictly it enforces these rules.

* **Dynamic Typing (The JavaScript approach):** The computer "guesses" the data type on the fly, only when the code is actually running (at *runtime*). A box (`let`) can hold a number on one line of code, and 5 lines later receive text, without the language complaining. It is a fast system for building prototypes, but dangerous when scaling up.
* **Static Typing (The TypeScript / Java / C# approach):** You, as the programmer, declare the data type *in advance*, at the moment you write the code. If you declare that a box holds numbers, it becomes strict. If you try to put text in it, your editor will block your script (at *compile-time*) and throw an error before you even get to run the test.

![Dynamic Typing vs Static Typing](/images/sessions/premium/session-7/image1.png)

*Fig. 1 — Dynamic Typing vs Static Typing*

### 1.3 Brief History: Why Microsoft and why now?

::: tip 📝 Historical Context
The JavaScript language was created in 1995 in just 10 days, aimed at making small animations on web pages (like snow falling on the screen). Nobody thought it would be used for massive systems.

Then came the era of massive web applications (Web 2.0). Microsoft was trying to build the Office 365 suite directly in the browser. They had millions of lines of JavaScript code. Because of JS flexibility (dynamic typing), one team would change a variable from Number to Text, and another team across the world had a mathematical function relying on that variable. The result? The system crashed completely.

To save the situation, in 2012, Microsoft (led by [Anders Hejlsberg](https://github.com/ahejlsberg), the genius behind the C# language) released TypeScript. The goal was not to destroy JavaScript, but to bring the rigor and discipline (Static Typing) of Enterprise languages (like Java or C#) into it, allowing companies to build huge applications without the fear of introducing "silent bugs".
:::

### 1.4 Dynamic Typing (JS) vs. Static Typing (TS): Practical Examples

The biggest difference between the two is the **exact moment** you find out you made a mistake.

**Example 1: Changing data types (Variables)**

* **JS (Dynamic):** The computer doesn't complain until it actually runs the code.

```javascript
// JS: No protection
let price = 100;
price = "One hundred"; // I put text instead of a number. JS says "That's OK!"
let discount = price - 20;
console.log(discount); // At runtime we get NaN (Not a Number)! The test fails!
```

* **TS (Static):** Errors are flagged directly in your editor (VS Code), *before* you run the test!

```typescript
// TS: Active protection
let price: number = 100; // We declare explicitly: This box accepts ONLY numbers!
price = "One hundred";   // ❌ INSTANT ERROR IN VS CODE (Underlined in red):
                         // "Type 'string' is not assignable to type 'number'."
```

**Example 2: Function Parameters**

Suppose you have a function that clicks the "X-th" element in a list.

* **JS:** The function is blind.

```javascript
function clickOnElement(index) {
  // If you receive text instead of a number, the internal logic breaks.
}
clickOnElement("two"); // JS will accept this and crash later.
```

* **TS:** We define a strict contract (Signature).

```typescript
function clickOnElement(index: number) {
  // ...
}
clickOnElement("two"); // ❌ Error: Argument of type 'string' is not assignable to parameter of type 'number'.
```

**Example 3: Working with Objects (Auto-completion / IntelliSense)**

* **JS:** If you have a `user` object, VS Code does not know what it contains. If you try to read `user.name` but the property was actually called `user.fullName`, JS will silently return `undefined`. Your test will get a false positive or fail mysteriously.
* **TS:** Thanks to static typing (we will learn about *Interfaces* in Chapter 3), the editor knows exactly what the object contains. When you type `user.`, VS Code opens an autocompletion menu with only the valid properties, saving you hours of searching and debugging.

### 1.5 Why does Playwright use TypeScript?

If TS requires us to write more code (declaring types), why do major tech companies and Playwright prefer it?

* **Catching Bugs at Code Time (Compile Time):** As an automation engineer, you don't want to launch 500 tests in CI/CD, wait 20 minutes, just to discover you typed `usrname` instead of `username`.
* **Easy Maintenance:** When the UI changes and Frontend developers modify data structures, TS will instantly underline in red all 50 tests in your project that need to be updated, without you having to run them blindly.
* **Self-Documenting Code:** When you read a TypeScript function written by a colleague, you know exactly what kind of data it expects and what it returns, without having to inspect its internal implementation.

### 1.6 💡 Did You Know?

::: tip 💡 Did You Know?
- **TypeScript does not exist in production:** Although developers write and test code in TS, before the application is deployed to the internet, all TS code passes through a compiler (e.g. `tsc` or Babel) that removes all rules and types, leaving clean, vanilla JavaScript. All the "magic" of TypeScript lives purely on your laptop (during the Development/Testing phase)!
- **Massive Adoption:** According to annual StackOverflow surveys, TypeScript is consistently ranked in the top 3 "Most Loved Programming Languages", and today nearly all major libraries (including React) rely on it.
- **Used by NASA:** Control panel frameworks used by NASA for Mars rovers employ strict typed JavaScript variants, precisely to prevent unexpected runtime crashes.
:::

### 1.7 🧠 Interview Challenge

::: warning 🧠 Technical Interview Challenge
This is a favorite question in interviews for QA Automation Engineer roles:

**The Interviewer:** *"I notice that you wrote your Playwright framework in TypeScript. Tell me: if the tests had been written in plain JavaScript, would they execute slower in Google Chrome than those written in TypeScript? Does TypeScript make tests run faster?"*

**Your Engineer Answer:** *"No, execution in the browser takes the exact same amount of time. Web browsers (like Chrome) cannot understand or run TypeScript directly. Playwright compiles my TypeScript code into clean JavaScript in the background, right before launching the browser. The advantage of TypeScript is not runtime speed, but code authoring speed and reliability (compile-time safety). TS helps me, as an engineer, catch errors directly in the editor before the test even reaches the browser."*
:::

### 1.8 🤖 Engineer Mindset in the AI Era: The "Hallucination-Free" Context

::: tip 🤖 Engineer Mindset in the AI Era
**QA vs. AI: Why AI loves TypeScript**

- **Context:** Generative AI models (like ChatGPT, GitHub Copilot) work by predicting the next logical token based on the context you provide.
- **The Problem with JS:** If you ask the AI to *"write a test that validates a product"*, in JavaScript it does not know what properties "product" has. It might guess `product.title`, but your application uses `product.name`. The AI starts hallucinating code that looks correct, but fails the test.
- **The TypeScript Advantage:** In TS, you define interfaces strictly (we will learn this in Chapter 3). When you ask the AI to write the test, it reads the TS typing and clearly sees that your application uses `product.name`. Thus, the accuracy of AI-generated code on TypeScript projects increases from 60% to over 95%!
- **Your Future:** By adopting TypeScript, you not only write safer code, but you also provide your AI assistant with the guardrails needed to assist you at full capacity, transforming you from a simple script tester into an "AI-Assisted Test Architect".
:::

---

## Chapter 2: First Lines of Code — Primitive Types, any, unknown, and void

::: info 🎯 Learning Objectives
By the end of this chapter, you will be able to:
- Discover the testing environment (TypeScript Playground) to write TS directly in the browser.
- Understand how to add data types to variables using "Type Annotations".
- Learn to leverage "Type Inference", letting TypeScript deduce types automatically.
- Discover the essential difference between `any` (the quality killer) and `unknown` (the defensive approach) through live examples.
- Use the `void` type to write clean test functions.
:::

### 2.1 Where do we run the code? Playwright Magic vs. Browser Reality

Unlike past modules, we have a major technical reality: **Web browsers (Chrome, Firefox, Safari) DO NOT understand TypeScript.** They only speak basic web languages: HTML, CSS, and clean JavaScript.

If you open Chrome Console (F12) and type `let age: number = 30`, you get an immediate syntax error because the browser doesn't recognize `: number`. TypeScript code must always be **compiled** (transpiled and stripped of types) into a JavaScript file before execution.

🚀 **Why does the industry love Playwright? (The Out-of-the-box Magic)**

Traditionally, to perform this translation, developers had to install complex compilers and manually run terminal commands (like `tsc`) every time they touched a line of code.

Playwright revolutionized testing because **it handles everything for us in the background!** When you write your first Playwright test in a `.ts` file and hit "Run", the framework compiles your TypeScript code into JavaScript in milliseconds, without asking for any manual build configuration. You write strictly, Playwright runs fast!

Until we install Playwright, to practice the concepts in this module, we will use Microsoft's official interactive simulator: **TypeScript Playground**.

🤔❓ **Set up your workspace:**
* Open a new browser tab and visit: [**www.typescriptlang.org/play**](https://www.typescriptlang.org/play)
* In the left panel, write your TypeScript code.
* Notice the magic: in the right panel, you see your code translated in real-time into vanilla JavaScript! Any typing mistakes will be underlined in red on the left.

### 2.2 Primitive Type Annotations

TypeScript's core syntax involves appending a colon (`:`) followed by the data type, right after the variable or parameter name.

```typescript
// Syntax: let variableName: Type = value;
let username: string = "admin_qa";
let testTimeout: number = 5000;
let isLoggedIn: boolean = true;
```

🤔❓ **Test in Playground:**

Paste the lines above into the TS Playground. Then, on a new line, try writing: `testTimeout = "five seconds";`.

You will immediately see the code highlighted with a red squiggly line. You were protected from a bug before even running the application!

#### TypeScript Magic: Type Inference

Do we always have to write `: string` or `: number`? **No!**

TypeScript is extremely smart. If you assign an initial value to a variable at the moment you declare it, TS automatically "infers" the type and locks it in.

```typescript
// How professionals write code (cleaner, more concise)
let platformUrl = "https://platform.com";
// ^ TypeScript saw the string and silently applied ": string" under the hood.

// platformUrl = 100; // If you uncomment this, it throws an error!
```

*The Golden Rule:* Use manual type annotations (`: type`) primarily when declaring an uninitialized variable that will receive values later, or when defining function parameters.

### 2.3 The "Bad Boy" of TypeScript: The any Type

When Microsoft created TypeScript on top of JavaScript, they had to provide an "escape hatch" to help developers migrate legacy code easily. That escape hatch is called **any**.

When you use `any`, you tell the TypeScript compiler: *"Close your eyes, turn off the error radar, I know what I'm doing!"*. Essentially, you strip away all the benefits of the language and return to wild JavaScript.

🤔❓ **Test the Danger in Playground:**

```typescript
let mysteryVariable: any = "Hello, I am text";

// Let's try calling a math method on a string!
let faultyCalculation = mysteryVariable.toFixed(2);
console.log(faultyCalculation);
```

**Notice the issue?** TypeScript does NOT give you any red warning. Your editor assumes everything is fine. But when you hit the **"Run"** button in Playground (which executes the compiled code in the browser), the console crashes with a fatal error: `TypeError: mysteryVariable.toFixed is not a function`. `any` lied to you and masked the bug!

In top tech companies, Code Review rules are strict: ***No any in the codebase!***

### 2.4 The Smart Alternative: The unknown Type

If we aren't allowed to use `any`, what do we do when making an API call with `fetch` and we truly *don't know* in advance what data structure the server will return? This is where **unknown** steps in.

When a variable is typed as `unknown`, TypeScript allows you to put any value into it, but **will NOT allow you to use it** until you explicitly check (narrow) its type!

🤔❓ **Test Safety in Playground:**

```typescript
let apiResponse: unknown = "200 OK";

// 1. Try using a String method directly.
// The line below WILL THROW AN ERROR in the editor because TS protects you!
// let upperText = apiResponse.toUpperCase();

// 2. The QA Approach: Type Narrowing
if (typeof apiResponse === "string") {
  // Inside this 'if' block, TS knows 100% that it's a string.
  // Now it allows you to use string methods and even provides autocompletion!
  let upperText = apiResponse.toUpperCase();
  console.log(upperText);
}
```

*As an automation engineer*, **unknown** is ideal for API testing, forcing you to write defensive assertions before handling data.

### 2.5 Functions and the void Type (Nothing)

We discussed data types for variables, but functions also return data. In JavaScript, if a function just clicks a button and lacks a `return` statement, it implicitly returns `undefined`.

In TypeScript, a function that executes an action without returning any value is marked with the **void** type. This explicitly signals to anyone reading your code that attempting to store its result in a variable is meaningless.

```typescript
// This function returns a calculated Number
const calculateSum = (a: number, b: number): number => {
  return a + b;
};

// This function only performs an action, returning no data. Type is : void
const logToConsole = (message: string): void => {
  console.log("Message is: " + message);
  // No 'return' here!
};
```

### 2.6 🧠 Interview Challenge (Technical Question)

::: warning 🧠 Technical Interview Question
**The Interviewer:** *"I'm reviewing your Pull Request. You used any to handle an API response because our staging server is unstable. Why did I ask you to change it to unknown? What is the technical difference?"*

**Your Engineer Answer:** *"If I use `any`, I completely disable TypeScript's type checker. The editor will allow me to execute mathematical methods (like `.toFixed()`) on that response even when the server sends back a String, resulting in a fatal runtime crash. If I use `unknown`, I preserve architectural type safety. TypeScript will force me (at compile-time) to write a type guard check (`typeof response === 'number'`) before attempting to access properties or methods. `unknown` forces resilient tests, whereas `any` invites silent bugs."*
:::

### 2.7 🤖 Engineer Mindset in the AI Era: The "Laziness" of Generative Assistants

::: tip 🤖 Engineer Mindset in the AI Era
**QA vs. AI: The any Trap in Autogeneration**

- **What AI does well:** Generative AI models grasp business logic quickly and can draft E2E tests in seconds.
- **The Trap (Where AI fails):** Often, when you ask an assistant (like ChatGPT) to write a test helper function and your data model is complex, the AI takes shortcuts. To guarantee code that compiles on the first try, it annotates function parameters with `: any`.
- **How a QA Engineer thinks:** The engineer immediately rejects generated code containing `any`. They know the AI just introduced technical debt into the test architecture. The engineer replaces `any` with `unknown` (forcing defensive checks) or defines a strict interface (covered in the next chapter). You must be the Strictness Gatekeeper when working with generative tools!
:::

---

## Chapter 3: Advanced Structures — Interfaces and Custom Types

::: info 🎯 Learning Objectives
By the end of this chapter, you will be able to:
- Understand the limits of plain JavaScript objects and the necessity of strict contracts.
- Create Type Aliases and use "Union Types" for variables with multiple allowed options.
- Define Interfaces, the industry gold standard for mapping API payloads.
- Use optional properties (`?`) and immutability modifiers (`readonly`).
- Connect Interfaces with QA assertions in Playwright test suites.
:::

### 3.1 The Problem: Chaotic Objects in JavaScript

In JavaScript, an Object is simply a collection of properties. You can create an object, add properties on the fly, delete existing ones, or reference properties that don't even exist (which silently returns `undefined`).

```javascript
// Classic JS: No guarantees
let newTask = {
  title: "Write Login Test",
  completed: false
};

// Later in the code, a typo happens:
console.log(newTask.titlu); // Prints undefined (should have been 'title')
```

When testing an API that returns 100 users, your test framework cannot afford to guess the structure of a user object. You need a strict contract. This is where Custom Types and Interfaces come in.

### 3.2 Custom Types (Type Aliases) and Union Types

To define a custom type, we use the **type** keyword. It allows you to create reusable type aliases just like you use `string` or `number`.

One of the most powerful tools for QA is the **Union Type**, represented by the pipe symbol `|` (meaning OR).

🤔❓ **Test in TS Playground:**

```typescript
// Create a custom type that accepts ONLY 3 specific states
type TestStatus = "PASSED" | "FAILED" | "SKIPPED";

let myResult: TestStatus;
myResult = "PASSED"; // ✅ Perfectly valid!
// myResult = "PENDING"; // ❌ ERROR: Type '"PENDING"' is not assignable to type 'TestStatus'.

// Very useful for IDs (some APIs return ID as a number: 12, others as a string: "12")
type TestId = string | number;
let currentId: TestId = 100;
currentId = "A-100"; // Both are accepted without errors!
```

### 3.3 The Gold Standard for Data: Interfaces

While `type` is great for primitives and unions, when it comes to **Objects** (such as JSON payloads from an API), the software industry standard is **interface**.

An Interface is a structural blueprint or contract. It tells the compiler: *"Any object claiming to be of this type MUST have exactly these keys and these corresponding value types."*

```typescript
// 1. Define the contract (Interface names use PascalCase)
interface User {
  name: string;
  email: string;
  age: number;
  isAdmin: boolean;
}

// 2. Create an object and enforce the contract
const employee: User = {
  name: "Alex",
  email: "alex@qa.com",
  age: 30,
  isAdmin: true
  // If you omit a property or add an unauthorized one (e.g. address), TS throws an error!
};
```

### 3.4 Interface Superpowers: Optional (?) and readonly

Not all properties are always present in every payload, and some should never be mutated.

* **Optional Properties (`?`):** When a field might be omitted by an API, append `?` before the colon.
* **Readonly Properties (`readonly`):** For IDs generated by the database that should never be overwritten accidentally.

🤔❓ **Test the QA Scenario in TS Playground:**

```typescript
interface TestCase {
  readonly id: number;      // Cannot be reassigned after creation
  title: string;
  riskLevel?: "High" | "Low"; // The question mark means this field can be omitted!
}

const loginTest: TestCase = {
  id: 1,
  title: "Validate credentials"
  // Notice that 'riskLevel' was omitted and TypeScript raises no errors!
};

// Attempting to modify the ID (Simulating an accidental reassignment)
// loginTest.id = 2; // ❌ INSTANT ERROR: Cannot assign to 'id' because it is a read-only property.
```

### 3.5 How do we use Interfaces in Playwright Automation?

When you write an E2E test intercepting an HTTP response from our "Task Tracker" application (built in Session 6), the code looks like this:

```typescript
// Define the blueprint for what we expect from the backend API
interface TaskTracker {
  id: number;
  title: string;
  completed: boolean;
}

test('Verify task retrieval', async ({ request }) => {
  // Fetch data and CAST it to an array of TaskTracker
  const response = await request.get('/api/tasks');
  const tasks = await response.json() as TaskTracker[];

  // When you type "tasks[0].", VS Code autocompletes "title" and "completed"!
  // If developers change the API contract, your test highlights errors immediately.
  expect(tasks[0].title).toBe("Login validation test");
});
```

### 3.6 🧠 Interview Challenge (Technical Question)

::: warning 🧠 Technical Interview Question
**The Interviewer:** *"In TypeScript, you can define the shape of an object using both type and interface. What is the difference between them, and which do you prefer when documenting an API response?"*

**Your Engineer Answer:** *"The practical differences have significantly narrowed in recent TS versions. However, I prefer using `interface` for API responses and entity models because interfaces support 'Declaration Merging' (extending models across modules) and produce clearer error messages. Conversely, I use `type` when creating 'Union Types' (e.g., `string | number`), tuples, or primitive aliases that interfaces cannot natively represent."*
:::

### 3.7 🤖 Engineer Mindset in the AI Era: "Contract-Based Prompting"

::: tip 🤖 Engineer Mindset in the AI Era
**QA vs. AI: Generating Test Data (Mock Data)**

- **The Problem:** One of the most time-consuming tasks for QA is generating mock datasets. If you ask an AI *"Generate 5 test products in JSON"*, it invents an arbitrary schema that your application will likely reject.
- **How a QA Engineer thinks:** The engineer uses TypeScript Interfaces as the perfect prompt guardrail. They paste the interface directly into the AI prompt:
  ```typescript
  interface Product {
    id: string;
    price: number;
    inStock?: boolean;
  }
  ```
  With the instruction: *"Strictly adhere to this TypeScript interface and generate an array of 50 mock objects for my E2E tests"*.
- **The Result:** The generative assistant delivers an exact JSON payload in seconds, with 100% type fidelity (no accidental strings in number fields). Interfaces turn the AI into a precision partner.
:::

---

## Chapter 4: Command Center — Configuring tsconfig.json

::: info 🎯 Learning Objectives
By the end of this chapter, you will be able to:
- Understand why `tsconfig.json` was invented and how it defines a "Project".
- Explore fundamental compiler flags through hands-on missions in TS Playground.
- Understand why `strictNullChecks` and `noImplicitAny` are essential for QA stability.
- Answer environment configuration interview questions confidently.
:::

### 4.1 Why was tsconfig.json needed? (Historical Context)

In the early days of TypeScript, compiling **.ts** files into JavaScript meant running complex manual commands in your terminal:

```bash
tsc file1.ts file2.ts file3.ts --target ES2015 --module commonjs --strict true --removeComments true --noImplicitAny true...
```

This approach was fragile and difficult to maintain across teams. If a developer forgot `--strict`, buggy code could pass into production.

::: tip 💡 Architectural Decision
Microsoft introduced **tsconfig.json**. Its presence in a directory tells the compiler: *"This is the root of a TypeScript project. Do not wait for manual CLI flags. Read configuration rules directly from this file and apply them automatically across the entire project!"*
:::

### 4.2 Interactive Lab: How Compiler Flags Change Your Code

*Open [TS Playground](https://www.typescriptlang.org/play). Click the **"TS Config"** dropdown in the top bar to toggle rules in real-time.*

#### Mission 1: target (The Time Machine)

This setting dictates the JavaScript version generated by TypeScript (in the right-hand panel).

**Execution:**

* Paste this code in the left panel:

```typescript
const greet = () => console.log("Hello QA!");
greet(); // Call the function to inspect output
```

* Open **TS Config** and find **Target**.
* 🔴 **Set to ES5 (Legacy JS from 2009):**
  Inspect the right panel. Your modern arrow function is converted into an ES5 function expression:

```javascript
var greet = function () {
  return console.log("Hello QA!");
};
greet();
```

* 🟢 **Set to ESNext (Modern JS):**
  Inspect the right panel. The code stays identical to what you wrote (`const` and `=>`) because modern browsers support modern ECMAScript natively.

#### Mission 2: noImplicitAny (The Sloth Detector)

When enabled, TS refuses to fall back to `any` implicitly, forcing you to specify parameter types.

**Execution:**

* Paste this code in the left panel:

```typescript
// Intentionally omitted the type for parameter 'price'
function calculateTotal(price) {
  return price * 1.19;
}
console.log(calculateTotal(100)); // Prints 119
```

* Open **TS Config** and locate **noImplicitAny**.
* 🔴 **Disable it:** The code compiles cleanly. But tomorrow, someone might call `calculateTotal("One hundred")`, producing `NaN`.
* 🟢 **Enable it:** `price` is instantly flagged with a red squiggly line: *Parameter 'price' implicitly has an 'any' type.* TS forces you to annotate `(price: number)`.

#### Mission 3: strictNullChecks (The Flaky Test Eliminator)

In QA, we frequently query DOM elements that might not exist yet. If we don't verify their existence, tests crash with runtime errors.

**Execution:**

* Paste this code in the left panel:

```typescript
// Querying a non-existent button on the page
const deleteBtn = document.querySelector('.fake-delete-btn');

// Attempting to click it directly
deleteBtn.click();
```

* Open **TS Config** and locate **strictNullChecks**.
* 🔴 **Disable it:** The editor shows no errors. Hit "Run", and the console crashes: `TypeError: Cannot read properties of null (reading 'click')`.
* 🟢 **Enable it:** `deleteBtn` is immediately underlined in red (*Object is possibly 'null'*). TS forces you to write defensive code:

```typescript
const deleteBtn = document.querySelector('.fake-delete-btn');
if (deleteBtn) {
  // Only executed if element actually exists in DOM!
  deleteBtn.click();
} else {
  console.log("Button not found on page.");
}
```

#### The Ultimate Rule: "strict": true

In production `tsconfig.json` files, you don't enable every rule individually. Setting `"strict": true` turns on `noImplicitAny`, `strictNullChecks`, and 5 additional safety rules simultaneously. It is the gold standard for Playwright projects.

### 4.3 Minimal tsconfig.json for Playwright

When initializing a Playwright project, the framework creates a root `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": [
    "tests/**/*",
    "utils/**/*"
  ]
}
```

### 4.4 💡 Did You Know?

::: tip 💡 Did You Know?
**TypeScript can help even in plain JavaScript:** If you have an existing project in plain JS and don't want to convert files to `.ts`, you can add a `tsconfig.json` file at the root. Set `"allowJs": true` and `"checkJs": true`. VS Code will immediately start type-checking your `.js` files and highlighting bugs in-place!
:::

### 4.5 🧠 Interview Challenge (Technical Question)

::: warning 🧠 Technical Interview Question
**The Interviewer:** *"I inherited a test framework from an engineer who left. I see that strict mode is commented out in tsconfig.json. What happens if I enable strict: true today before running the test suite?"*

**Your Engineer Answer:** *"If strict is disabled, the codebase likely contains un-annotated parameters (implicit any) and unchecked DOM selections that risk null dereferencing. Enabling `strict: true` will cause the compiler to flag dozens of type errors across the suite. While fixing them requires effort, enabling strict mode is the single most effective way to eliminate flaky tests caused by unhandled null or undefined states."*
:::

### 4.6 🤖 Engineer Mindset in the AI Era

::: tip 🤖 Engineer Mindset in the AI Era
**QA vs. AI: Prompting for Strict Environments**

AI generates code matching the constraints it assumes. If you give a brief prompt (*"write a function to click a menu"*), it will write brief code assuming relaxed rules, omitting null checks.

As an engineer, specify your environment constraints in your prompts: *"Write a menu click helper assuming a TypeScript project running under strict: true"*. This single instruction forces the AI to output defensive type guards and null checks, saving you debugging time in VS Code.
:::

---

## Chapter 5: Advanced Concepts (Bonus) — Type Assertions

::: info 🎯 Learning Objectives
By the end of this chapter, you will be able to:
- Understand the limits of type inference when querying the Document Object Model (DOM).
- Learn how to use the `as` keyword for Type Casting.
- Recognize the danger of lying to the compiler with reckless assertions.
- Connect type casting with advanced Playwright methods like `page.evaluate()`.
:::

### 5.1 The Problem: When TypeScript Knows Less Than You

TypeScript is smart, but it cannot see the rendered web page. When you call `document.querySelector('.my-class')`, TS only knows that it returns a generic **Element** (or `null`).

The problem? A generic `Element` does not possess a `.value` property (which belongs to inputs) or a `.disabled` property (which belongs to buttons).

🤔❓ **Inspect the ERROR in TS Playground:**

```typescript
// Querying an element. TS assumes it is a generic "Element".
const emailInput = document.querySelector('.email-field');

if (emailInput) {
  emailInput.value = "test@qa.com";
}
```

With `strict: true` enabled, `value` is underlined in red: *Property 'value' does not exist on type 'Element'.*

### 5.2 The Solution: The as Keyword (Type Casting)

This is where **Type Assertions** come in. Using `as`, you provide explicit context to the compiler: *"I have inspected the DOM and guarantee this element is an HTMLInputElement. Treat it as such!"*

🤔❓ **Test in TS Playground:**

```typescript
// 1. (Setup) Inject a test input into Playground memory
const mockInput = document.createElement('input');
mockInput.className = 'email-field';
document.body.appendChild(mockInput);

// 2. (Test) Query the element and cast it with "as HTMLInputElement"
const inputFound = document.querySelector('.email-field') as HTMLInputElement;

if (inputFound) {
  inputFound.value = "test@qa.com";
  console.log("Success! Input value set to:", inputFound.value);
}
```

*Common DOM types in QA:*
* `as HTMLInputElement` (provides access to `.value`, `.checked`)
* `as HTMLButtonElement` (provides access to `.disabled`)
* `as HTMLSelectElement` (provides access to dropdown options)

### 5.3 The Hidden Danger: Lying to the Compiler

Type assertion bypasses TypeScript's safety checks for that specific expression. The compiler takes your word for it.

If your assumption is wrong, your application will crash at runtime just like plain JavaScript:

```typescript
// Deliberately misrepresenting a button as an input:
const submitBtn = document.querySelector('.btn-submit') as HTMLInputElement;

// Compiles cleanly, but causes runtime issues or fails silently:
submitBtn.value = "Hacked";
```

**Senior Rule of Thumb:** Use `as` only when you have a valid architectural reason (such as DOM querying) and 100% certainty. Never use `as any` just to suppress an editor error!

### 5.4 Connecting with Playwright: page.evaluate()

In standard Playwright tests (`await page.click()`), Playwright handles element typing automatically.

However, in advanced scenarios—such as extracting hidden attributes or inspecting complex DOM trees—you will use **page.evaluate()** to execute code directly inside the browser context:

```typescript
// Advanced Playwright evaluation
const buttonDisabled = await page.evaluate(() => {
  // Executed inside the browser runtime
  const btn = document.querySelector('#submit-btn') as HTMLButtonElement;
  return btn.disabled;
});

expect(buttonDisabled).toBe(true);
```

Without knowing how to use `as`, writing browser evaluation scripts in TypeScript would be impossible.

### 5.5 🤖 Engineer Mindset in the AI Era: Blind Assertions

::: tip 🤖 Engineer Mindset in the AI Era
**QA vs. AI: Type Casting Abuse**

- **The Trap:** AI assistants sometimes use double casting (`response as any as User`) to silence stubborn compiler errors. This is dangerous because it hides structural mismatches from the backend.
- **How a QA Engineer thinks:** The engineer avoids double casting. They use runtime validation schemas (e.g., Zod) or custom *Type Guards*, reserving the `as` keyword exclusively for verified DOM element selections.
:::

---

## Chapter 6: Session 7 Homework & Extra Practice (Towards Senior Level)

### 6.1 Homework Project (Session 7) & QualiAdept Cloud Evaluation

::: info 🎯 Homework Objective
Refactor the "Task Tracker" application from Session 6 by adding a robust TypeScript static typing layer. Secure all variables, data models, and helper functions, eliminating `undefined` risks and enforcing a Zero Any policy.
:::

#### 🏢 Business Scenario

::: tip 📝 Business Context
Your team delivered Version 1.0 of the "Task Tracker" application in Session 6. Before writing automated Playwright tests in Session 9, the Lead Architect and QA team decided to migrate the codebase to TypeScript to ensure enterprise-grade stability.

Your mission is to transform the application logic into a typed module (`app.ts`). You will introduce explicit types for all data structures and eliminate all usages of the `any` keyword.
:::

#### 📋 Technical Acceptance Criteria

* **Primitive Typing & Configuration:**
  * Declare explicit primitive types for configuration constants:
    * `apiUrl: string`
    * `maxTasksLimit: number`
    * `isAppReady: boolean`
* **Union Type for Task Status:**
  * Define a `TaskStatus` type alias accepting strictly: `'todo' | 'in-progress' | 'completed'`.
* **Typed Data Model (TaskItem):**
  * Define a `TaskItem` type alias representing a task in memory:
    * `id: number;`
    * `title: string;`
    * `status: TaskStatus;`
    * `completed: boolean;`
    * `priority?: 'low' | 'medium' | 'high';` *(optional)*
  * Declare the main array `taskList` as a typed collection: `TaskItem[]` (or `Array<TaskItem>`).
* **Function Signatures (Zero Any Policy):**
  * **Add Task Function (`processNewTask`):**
    * Parameter `taskObj: TaskItem`
    * Return type: `boolean`
  * **Display Task Function (`displayTask`):**
    * Parameter `id: number`
    * Return type: `void`
  * **Zero Any Rule:** Any usage of `: any` will fail automated platform grading!
* **Typed Async Function (Fetch API & Promises):**
  * `loadInitialTasks` must explicitly return `Promise<void>`.
  * Response data from `await response.json()` must be cast using `as TaskItem[]`.

#### 💡 QA Automation Analogy (Why this matters for Playwright)

In Playwright, you will work exclusively with TypeScript:
* Locators return strictly-typed `Locator` objects.
* Actions (`click`, `fill`, `goto`) return `Promise<void>`.
* In Data-Driven Testing, strongly-typed models prevent testing non-existent fields before tests even run!

### 6.2 Bonus Challenge (Optional): Total Safety with unknown

**Scenario:** You cast the server response using `as TaskItem[]`. In mission-critical environments, this risks masking breaking changes if the backend schema changes unexpectedly.

**Your Mission:**
Save the result of `await response.json()` into an `unknown` variable. Write a Type Guard function checking if the data is an array before storing it into `taskList`.

### 6.3 🗝️ Solution Keys & Explanations

Try solving the challenge on your own before checking the solution!

**Homework Solution (app.ts):**

```typescript
// 1. Primitive Typing
const apiUrl: string = 'https://jsonplaceholder.typicode.com/todos';
const maxTasksLimit: number = 5;
let isAppReady: boolean = false;

// 2. Union Type
type TaskStatus = 'todo' | 'in-progress' | 'completed';

// 3. Typed Data Model
type TaskItem = {
  id: number;
  title: string;
  status: TaskStatus;
  completed: boolean;
  priority?: 'low' | 'medium' | 'high'; // Optional property
};

// Typed collection declaration
let taskList: TaskItem[] = [];

// 4. Function Signatures (Zero Any Policy)
const processNewTask = (taskObj: TaskItem): boolean => {
  if (!taskObj.title) {
    console.error("Error: Task must have a title!");
    return false;
  }
  taskList.push(taskObj);
  console.log(`Task "${taskObj.title}" was added.`);
  return true;
};

const displayTask = (id: number): void => {
  const foundTask = taskList.find(task => task.id === id);
  if (foundTask) {
    console.log(`[${foundTask.status.toUpperCase()}] ${foundTask.title}`);
  } else {
    console.log(`Task with ID ${id} not found.`);
  }
};

// 5. Typed Async Function
const loadInitialTasks = async (): Promise<void> => {
  try {
    const response = await fetch(`${apiUrl}?_limit=${maxTasksLimit}`);
    if (!response.ok) {
      throw new Error("API connection error");
    }
    // Assert response payload type
    const serverData = await response.json() as TaskItem[];
    // Populate collection
    taskList = serverData;
    isAppReady = true;
    console.log(`Loaded ${taskList.length} tasks.`);
  } catch (error) {
    console.error("Error encountered:", error);
  }
};

// Simulate execution
loadInitialTasks().then(() => {
  const newTask: TaskItem = {
    id: 999,
    title: "Run Playwright test suite",
    status: "todo",
    completed: false,
    priority: "high"
  };
  processNewTask(newTask);
  displayTask(999);
});
```

🎉 **Congratulations!** This is your first production-ready TypeScript code. You are architecturally prepared for advanced Playwright automation!

---

## Workbook Session 7 — TypeScript Core

::: info 📈 Workbook Goal
Build muscle memory for Playwright test development. All exercises below are complete executable scripts featuring type declarations, instantiation, method calls, and console assertions.

🛠️ **Setup:** Open [TypeScript Playground](https://www.typescriptlang.org/play) (with `strict: true` enabled). Paste each code block into the left editor and hit **Run** to check console output!
:::

### 📍 Exercise 1: Functions, Primitives, and Type Inference

**Scenario:** A validation function calculating whether a test took too long to run.

```typescript
// 1. Define function with typed parameters and explicit return
const validateExecutionTime = (testName: string, durationMs: number, maxLimit: number): boolean => {
  console.log(`[RUN] Test "${testName}" took ${durationMs}ms.`);
  return durationMs <= maxLimit;
};

// 2. Execute and test scenarios (Pass and Fail)
const loginTest = validateExecutionTime("Successful Login", 1200, 2000);
const checkoutTest = validateExecutionTime("Card Checkout", 3500, 2000);

// 3. Verify results
console.log(`Login Result: ${loginTest ? "✅ PASSED" : "❌ FAILED"}`);
console.log(`Checkout Result: ${checkoutTest ? "✅ PASSED" : "❌ FAILED"}`);
```

### 📍 Exercise 2: Union Types & Literal Types (Restricted Options)

**Scenario:** A helper simulating button clicks restricted to 3 allowable states.

```typescript
// 1. Define permitted literal states
type ButtonState = "active" | "disabled" | "hidden";

// 2. Testing utility function
const clickButton = (selector: string, state: ButtonState): void => {
  if (state === "disabled") {
    console.log(`❌ ERROR: Cannot click ${selector} because it is disabled!`);
    return;
  }
  if (state === "hidden") {
    console.log(`❌ ERROR: Selector ${selector} is not visible on screen!`);
    return;
  }
  console.log(`✅ Successfully clicked ${selector}.`);
};

// 3. Call method in different contexts
clickButton("#btn-submit", "active");
clickButton("#btn-cancel", "disabled");

// ❌ Uncommenting the line below triggers a compile-time error!
// clickButton("#btn-fake", "non-existent");
```

### 📍 Exercise 3: Safety with unknown (Type Guards)

**Scenario:** Handling untrusted data from an external source using defensive checks before calling methods.

```typescript
// 1. Function handling unverified payloads
const processMysteryData = (data: unknown): void => {
  console.log("[PROCESSING] Inspecting received data...");

  // TYPE GUARD: Verify string
  if (typeof data === "string") {
    console.log(`String detected! Uppercase: ${data.toUpperCase()}`);
  }
  // TYPE GUARD: Verify number
  else if (typeof data === "number") {
    console.log(`Number detected! Price with VAT: ${data * 1.19}`);
  }
  else {
    console.log("⚠️ Unknown format. Ignoring.");
  }
};

// 2. Call function testing compiler safety
processMysteryData("secret-server-token");
processMysteryData(250);
processMysteryData(true); // Falls into unknown format branch
```

### 📍 Exercise 4: Interfaces and Arrays (Data Handling)

**Scenario:** Contract for user objects, filtering admin users from a test dataset.

```typescript
// 1. Define Interface contract
interface TestUser {
  readonly id: number;
  username: string;
  isAdmin: boolean;
}

// 2. Typed database array
const qaUserDatabase: TestUser[] = [
  { id: 101, username: "john_doe", isAdmin: false },
  { id: 102, username: "super_qa", isAdmin: true },
  { id: 103, username: "dev_lead", isAdmin: true }
];

// 3. Helper to filter admin users
const findAdmins = (list: TestUser[]): TestUser[] => {
  return list.filter(user => user.isAdmin === true);
};

// 4. Verify results
const adminUsers = findAdmins(qaUserDatabase);
console.log(`Found ${adminUsers.length} Admin users.`);
adminUsers.forEach(admin => {
  console.log(`- Privileged account: ${admin.username} (ID: ${admin.id})`);
});
```

### 📍 Exercise 5: Classes and Encapsulation (Page Object Model)

**Scenario:** Page Object Model architecture encapsulating selectors and exposing clean public test actions.

```typescript
// 1. Define Class
class LoginPage {
  // Private selectors (protected from test scripts)
  private userSelector = "#input-email";
  private passSelector = "#input-password";
  private loginBtn = "#btn-submit";

  public url: string;

  constructor(startUrl: string) {
    this.url = startUrl;
    console.log(`[POM] Initialized login page for: ${this.url}`);
  }

  // 2. Public Methods (Actions called from tests)
  public enterCredentials(user: string, pass: string): void {
    console.log(`Typing '${user}' into [${this.userSelector}]...`);
    console.log(`Typing password into [${this.passSelector}]...`);
  }

  public clickLogin(): void {
    console.log(`Clicking selector: [${this.loginBtn}]`);
  }
}

// 3. Execute Test
const loginPage = new LoginPage("https://app.com/login");

console.log("--- Starting E2E Scenario ---");
loginPage.enterCredentials("admin@qa.com", "Password123!");
loginPage.clickLogin();
console.log("--- Scenario Completed ---");

// ❌ Error: loginPage.userSelector = ".other-class"; (Private property!)
```

### 📍 Exercise 6: Inheritance (Extends & Super)

**Scenario:** Sharing common UI elements across pages using a `BasePage` parent class.

```typescript
// 1. Parent Class
class BasePage {
  constructor(protected pageName: string) {}

  public verifyTitle(): void {
    console.log(`[BasePage] Verifying page title contains '${this.pageName}'`);
  }

  public logout(): void {
    console.log("[BasePage] Clicked 'Logout' in top navigation bar.");
  }
}

// 2. Child Class extending Parent
class DashboardPage extends BasePage {
  constructor() {
    super("Main Dashboard");
  }

  public generateReport(): void {
    console.log("[DashboardPage] Downloading test report...");
  }
}

// 3. Calling Inherited Methods
const myDashboard = new DashboardPage();

// Inherited from parent
myDashboard.verifyTitle();

// Child-specific method
myDashboard.generateReport();

// Inherited from parent
myDashboard.logout();
```

### 📍 Exercise 7: DOM Manipulation and Type Casting (as)

**Scenario:** Browser evaluation test casting a queried element to `HTMLInputElement`.

```typescript
// 1. (SETUP): Create input in Playground memory
const DOM = document.body;
DOM.innerHTML = `<input type="text" id="email-test" value="old@qa.com">
                 <button id="save-btn" disabled>Save</button>`;

// 2. (REAL TEST): Type Casting
const inputField = document.querySelector('#email-test') as HTMLInputElement;
const submitBtn = document.querySelector('#save-btn') as HTMLButtonElement;

// 3. Inspect and modify DOM
if (inputField && submitBtn) {
  console.log(`INITIAL input value: ${inputField.value}`);
  console.log(`Save button is DISABLED? : ${submitBtn.disabled}`);

  // Action: update text and enable button
  inputField.value = "new@qa.com";
  submitBtn.disabled = false;

  console.log(`UPDATED input value: ${inputField.value}`);
  console.log(`Save button is DISABLED? : ${submitBtn.disabled}`);
}
```

🎉 **This is production-quality TypeScript!** You have mastered types, interfaces, configuration, compiler flags, and DOM manipulation—empowering you to write robust, maintainable Playwright test suites.
