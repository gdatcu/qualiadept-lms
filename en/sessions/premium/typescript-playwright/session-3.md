# Session 3: JavaScript for QA Automation

<div style="display: flex; gap: 12px; flex-wrap: wrap; margin: 1.5rem 0 0.5rem 0;">
  <a href="/pdfs/sessions/premium/typescript-playwright/session-3-en.pdf" class="download-btn" target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24"><path d="M5 20h14v-2H5v2zm0-10h4V4h6v6h4l-7 7-7-7z"/></svg>View the PDF version of Session 3</a>
</div>

::: info 📊 PowerPoint Presentation
Below you will find the interactive PowerPoint presentation for this session. You can navigate through the slides directly in your browser or download the PDF course material using the button above.
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

## Chapter 1: JS Programming Basics — Variables, Data Types, Control Structures, and Functions

::: info 🎯 Learning Objectives
By the end of this chapter, you will be able to:
- Understand the role of JavaScript (JS) in automated testing (Playwright) and know the environments where you can run it (IDE vs. Browser).
- Declare variables using `let` and `const` and understand the vital difference between them.
- Identify and use primitive data types (`String`, `Number`, `Boolean`).
- Control the execution flow using decision-making statements (`if`/`else`) and loops (`for`).
- Write reusable code blocks using classic functions and Arrow Functions.
:::

### 1.1 The Great Transition: Why do we learn JavaScript?

If HTML is the "skeleton" of the house, and CSS is the "design", **JavaScript (JS)** represents the "electrical system and plumbing". JS transforms a static web page into an interactive application.

For you, as a future QA Automation Engineer, JavaScript is *the language you will use to speak to your robot*. Playwright and Cypress are frameworks built on top of JavaScript (and its extension, TypeScript). You cannot write complex test scenarios, validate results, or manipulate data without mastering the basics of this language.

---

### 1.2 The Environment: Where do we write and run JS code?

The JavaScript language was initially created to run only in the browser, but today it runs everywhere. To test the examples in this course, you will use two main environments:

1. **The Browser Console (DevTools) — "The Fast Playground":**  
   The fastest way to run JS code is right in your Chrome browser.  
   * *How to access:* Press `F12` (or right-click -> *Inspect*) and go to the **Console** tab. There you can write JavaScript code directly, press Enter, and see the result instantly. It is perfect for testing small functions, checking logic, or debugging selectors on the spot.

2. **The IDE (Visual Studio Code) + Node.js — "The Professional Environment":**  
   When writing a real automation project, you can't write hundreds of lines of code directly in the browser. You will use an **IDE (Integrated Development Environment)**, such as *Visual Studio Code* (which you used for HTML). For your PC to understand JS outside the browser, in the following modules, we will install and use an engine called **Node.js**. In VS Code, you will write files with the `.js` (or `.ts` for TypeScript) extension and run them directly from an integrated terminal.

---

### 1.3 Variables: Memory Boxes (let vs const)

A variable is like an empty shoebox on which you put a label (the name). Inside it, you store information (the value) to reuse later. In modern JavaScript, we have two main ways to create these boxes:

1. **`const` (The Constant — The King of Automation):**  
   Used when the value in the "box" must **NEVER** change during the script's execution.  
   * *The Golden Rule:* In 90% of cases, in Playwright tests, you will use `const`.

```js
const platformUrl = "https://certify.qualiadept.eu";
const loginButton = page.locator('#login-btn');

// If you try later to write platformUrl = "google.com", 
// the code will crash with an error, protecting you from accidental mistakes!
```

2. **`let` (The Changeable Variable):**  
   Used ONLY when you know for sure that the value will change during execution (e.g., a loop counter or retry counter).

```js
let attemptCount = 0;
attemptCount = 1; // Allowed. The value is updated.
```

> **Note:** You may see the keyword `var` in older tutorials online. **Avoid it!** It is obsolete, leaks outside control blocks, and causes severe scoping bugs in modern applications.

![JavaScript Variable Declaration Diagram](/images/sessions/premium/session-3/image1-en.png)
<span class="image-caption">**Fig. 1** — Decision flow for variable declaration in JavaScript (const vs let).</span>

---

### 1.4 Data Types: What do we put in the boxes?

* **String (Text):** Text enclosed in quotes.
```js
const username = "John Doe";
const statusMessage = 'Test passed';
```

* **Number (Numbers):** Integer or floating-point numeric values (without quotes).
```js
const age = 25;
const price = 99.99;
```

* **Boolean (True / False):** Essential for test validation and assertions.
```js
const isAuthenticated = true;
const testFailed = false;
```

---

### 1.5 Control Structures: The Script's Intelligence

Allow you to branch logic depending on the application state:

```js
const responseStatus = 200;

if (responseStatus === 200) {
  console.log("Test Passed: Response received successfully!");
} else {
  console.log("Test Failed: Connection or server error!");
}
```

---

### 1.6 Functions: Reusable Recipes

Code blocks organized to prevent duplication:

```js
// Classic function
function add(a, b) {
  return a + b;
}

// Arrow Function — the standard in Playwright
const addArrow = (a, b) => a + b;
```

---

### 1.7 Did you know...?

::: tip 💡 Did you know...?
- **JavaScript is NOT Java:** JavaScript was created in 1995 by Brendan Eich in just 10 days! It was originally called *Mocha*, then *LiveScript*. The final name "JavaScript" was purely a marketing maneuver to capitalize on the massive popularity of "Java" at the time. As the industry saying goes: *“Java and JavaScript are as similar as ham and hamster”*.
- **Camel Case:** The standard naming convention for variables in JS is *camelCase*. The first word is lowercase, and each subsequent word starts with an uppercase letter without spaces (e.g., `newUserName`, `submitButtonLocator`).
- **From animations to enterprise automation:** While JS was originally invented just to make snowflakes fall on a screen or a button blink in Netscape Navigator, today, thanks to *Node.js*, you can run backend servers, program robots, and build enterprise-grade E2E test suites with a single language!
:::

---

### 1.8 Applied Story: „The JavaScript Kitchen”

::: note 📖 Applied Story: The JavaScript Kitchen
Think of your kitchen:
- **The IDE (VS Code)** is the kitchen itself, where you have all your professional tools and prepare complex recipes.
- **DevTools Console** is the microwave: fast and convenient, but only for quick tests and reheating small snippets.
- **Variables (`const` and `let`)** are your storage containers:
  - The salt jar is a `const` (it always remains salt; its identity never changes).
  - The salad bowl is a `let` (today it holds a tomato salad, tomorrow you wash it and put fruit inside).
- **Data Types** are the ingredients (`String` = Flour, `Number` = 3 eggs).
- **Control Structures (`if`/`else`)** are your decisions as a chef: *"If the soup is under-seasoned, add salt. Otherwise, turn off the stove."*
- **Functions** are the Recipes: you provide the ingredients (parameters), and the recipe delivers the finished dish (`return`).
:::

---

### 1.9 Practical Exercises

*To complete these exercises, open a new tab in Chrome, press F12, go to the **Console** tab, and run your code line by line!*

#### Exercise 1: Proper Declarations
1. Declare a constant named `appName` and assign it the value `"Task Tracker"`.  
2. Declare a variable (mutable) named `passedTests` and initialize it with `0`.  
3. Attempt to reassign the constant: `appName = "Other App"`. What error does the console display?

#### Exercise 2: Arrow Function for Age Verification
Write an **Arrow Function** named `checkLegalAge` that accepts a parameter called `age` (a `Number`). The function must use an `if`/`else` structure:
- If age is greater than or equal to (`>=`) 18, return `"Adult user"`.  
- Otherwise, return `"Access denied"`.  
- Call the function in the console with your age to test it!

---

### 1.10 Exercise Solutions

::: details 💡 Solutions for Exercises 1 & 2
**Solution for Exercise 1:**
```js
const appName = "Task Tracker";
let passedTests = 0;

// Attempting reassignment:
appName = "Other App"; 
// Throws: Uncaught TypeError: Assignment to constant variable.
```

**Solution for Exercise 2:**
```js
const checkLegalAge = (age) => {
  if (age >= 18) {
    return "Adult user";
  } else {
    return "Access denied";
  }
};

console.log(checkLegalAge(20)); // Output: Adult user
console.log(checkLegalAge(16)); // Output: Access denied
```
:::

---

### 1.11 🛡️ Engineer Mindset in the AI Era: Your Place in the Market

::: warning 🛡️ QA vs. AI: The Illusion of Perfectly Generated Code
- **What AI does well:** If you ask an AI *"write a JS function to validate an email format"*, it will generate a complex regular expression in 2 seconds that might take 20 minutes to craft from scratch. It is a formidable assistant.
- **The Trap (Where AI fails):** AI is prone to logical hallucinations and poor architectural choices without strict guidelines. It might generate an entire Playwright test using only `let` instead of `const`, exposing test state to mutation bugs. Or it might introduce an infinite `for` loop that freezes your CI/CD runner.
- **How a QA Engineer thinks:** An engineer reviews AI-generated code with the critical eye of a code reviewer. You spot when it uses obsolete keywords or misses edge-case validations when fields are empty.
- **Why you remain indispensable:** You are not competing with machines that write syntax; you are competing with engineers who know how to prompt, review, and harden automated suites. Mastery of core programming concepts turns you into the Architect of quality.
:::

---

## Chapter 2: What do we put in the boxes? Fundamental Data Types

::: info 🎯 Learning Objectives
By the end of this chapter, you will be able to:
- Identify and use primitive data types (`String`, `Number`, `Boolean`).
- Understand the critical difference between `undefined` and `null`.
- Work with complex data structures: Arrays (lists) and Objects (collections).
- Inspect data types using the `typeof` operator.
:::

### 2.1 Primitive Types: The Basic Ingredients

If variables (`let` and `const`) are the "boxes", data types define what kind of contents are inside. In JavaScript, we have simple types called "primitives":

1. **String (Text):** Any sequence of characters. In JS, strings must **always** be wrapped in quotes (single `'...'`, double `"..."`, or backticks `` `...` ``).
```js
const errorMessage = "Invalid password!";
```

2. **Number (Numbers):** Unlike languages that distinguish between integers and floats, JS treats all numbers as `Number` (no quotes needed).
```js
const waitTimeout = 5000; // 5 seconds in milliseconds
const productPrice = 99.99;
```

3. **Boolean (True/False):** Has only two possible values: `true` or `false` (without quotes). Fundamental for test assertions.
```js
let isVisible = true;
let isUserLoggedIn = false;
```

![Data Types in JavaScript](/images/sessions/premium/session-3/image2-en.png)
<span class="image-caption">**Fig. 2** — Classification of Data Types in JavaScript: Primitive Types vs. Complex Types.</span>

---

### 2.2 The Mystery of "Nothingness": undefined vs null

As a QA engineer, you will frequently encounter these two concepts when locators or API responses fail to return data:

* **`undefined`:** Means the variable box has been declared, but ***nothing has been placed inside yet***. The engine does not know its value.
```js
let targetElement;
console.log(targetElement); // Output: undefined
```

* **`null`:** Represents an *intentional* absence of any object value. You explicitly tell the engine: *"This variable is currently empty"*.
```js
let userData = null; // We will populate this once login succeeds
```

---

### 2.3 Complex Structures: Arrays and Objects

In automated testing, we rarely work with isolated scalar values; we interact with collections of test data:

1. **Arrays (Lists):** An ordered list of values enclosed in square brackets `[ ]`. Each item has a zero-based index:
```js
const supportedBrowsers = ["Chrome", "Firefox", "Webkit"];
// "Chrome" is at index 0, "Firefox" is at index 1
console.log(supportedBrowsers[0]); // Output: Chrome
```

2. **Objects:** Used to represent an entity with structured attributes. Written in curly braces `{ }` with *key: value* pairs. This is the standard JSON structure used in REST APIs:
```js
const testUser = {
  username: "qa_expert",
  password: "Test1234!",
  isAdmin: true
};

// Accessing properties via dot notation:
console.log(testUser.username); // Output: qa_expert
```

---

### 2.4 Did you know...?

::: tip 💡 Did you know...?
- **The Type Inspector:** JavaScript has a built-in operator named `typeof` that you can run in DevTools: `typeof 42` returns `"number"`, while `typeof "42"` returns `"string"`.
- **Everything is an Object:** Under the hood, arrays in JavaScript are specialized objects with numerical keys!
- **Type Coercion Pitfall:** In JS, `5 + "5"` equals `"55"`, not `10`. JavaScript implicitly converts the number into text and concatenates them. This is why strict type checks are critical in test assertions.
:::

---

### 2.5 Practical Exercises

#### Your Mission:
1. Declare a variable `age` (`Number`) with your age.  
2. Declare an Object named `testProduct` with 3 properties: `name` (`String`), `price` (`Number`), and `inStock` (`Boolean`).  
3. Use `console.log()` to print the product price using dot notation.  
4. Run `typeof testProduct.inStock` and verify the output in the console.

---

### 2.6 Exercise Solutions

::: details 💡 Solutions for Chapter 2 Exercises
```js
let age = 28;

const testProduct = {
  name: "Wireless Headphones",
  price: 299.99,
  inStock: true
};

console.log(testProduct.price); // Output: 299.99
console.log(typeof testProduct.inStock); // Output: "boolean"
```
:::

---

### 2.7 🛡️ Engineer Mindset in the AI Era: Your Place in the Market

::: warning 🛡️ QA vs. AI: Type Coercion Confusion
- **What AI does well:** Generates extensive test data mock payloads with dozens of realistic fields instantaneously.
- **The Trap (Where AI fails):** In JavaScript, `==` (loose equality) coerces types, so `0 == false` evaluates to `true`. An AI might generate a test assertion that passes even when a backend API incorrectly returns a string `"200"` instead of numeric `200`.
- **How a QA Engineer thinks:** You enforce strict equality (`===`) in all assertions. Strict equality verifies both the value AND the data type, preventing silent bugs from entering production.
- **Why you remain indispensable:** Quality assurance is about data integrity. You prevent subtle edge-case failures that automated generators overlook.
:::

---

## Chapter 3: Application Logic — Control Structures (if/else, for)

::: info 🎯 Learning Objectives
By the end of this chapter, you will be able to:
- Understand top-to-bottom execution flow and how control structures branch execution.
- Write decision statements (`if` / `else if` / `else`) for multi-scenario testing.
- Implement `for` loops to automate repetitive testing actions.
- Iterate over Arrays of test data with loops and assertions.
:::

### 3.1 Making Decisions: The if / else Statement

By default, JavaScript executes code sequentially from top to bottom. Control structures allow us to divert this flow based on runtime conditions:

```js
let isElementVisible = true;

if (isElementVisible === true) {
  // Executes only if the condition is true
  console.log("Clicking the target button!");
} else {
  // Executes if the condition evaluates to false
  console.log("Waiting for the element to appear...");
}
```

![Conditional if/else Logic in Automation](/images/sessions/premium/session-3/image3-en.png)
<span class="image-caption">**Fig. 3** — Conditional execution (if/else logic) in an automated test flow.</span>

---

### 3.2 Multiple Branches: else if

When verifying HTTP status codes from API endpoints, we handle multiple possible responses using `else if`:

```js
const statusCode = 404;

if (statusCode === 200) {
  console.log("Test Passed: Page loaded successfully.");
} else if (statusCode === 404) {
  console.log("Test Failed: Resource not found (Client Error).");
} else if (statusCode === 500) {
  console.log("Test Failed: Internal Server Error!");
} else {
  console.log("Unknown status code received.");
}
```

---

### 3.3 Repetition: The for Loop

The **DRY (Don't Repeat Yourself)** principle states that repetitive tasks should be automated. If you need to validate 5 table rows, use a loop rather than repeating the same locators:

The three parts of a `for` loop:
1. **Start (Initialization):** Where counting starts (e.g., `let i = 1`).  
2. **Stop Condition:** When to terminate (e.g., `i <= 3`).  
3. **Step (Increment):** How much the counter increments each cycle (`i++`).

```js
for (let i = 1; i <= 3; i++) {
  console.log("Executing test step number: " + i);
}
// Console output:
// Executing test step number: 1
// Executing test step number: 2
// Executing test step number: 3
```

---

### 3.4 Iterating through Lists (Combining Loops with Arrays)

Iterate over an array of test accounts or rows dynamically using the `.length` property:

```js
const testUsers = ["admin", "editor", "viewer"];

// Zero-indexed iteration
for (let i = 0; i < testUsers.length; i++) {
  console.log("Testing authentication for user: " + testUsers[i]);
}
```

---

### 3.5 Did you know...?

::: tip 💡 Did you know...?
- **The Infinite Loop Danger:** If the loop termination condition never evaluates to `false` (e.g., forgetting `i++`), the JavaScript engine will run indefinitely until the browser tab or Node process crashes.
- **Truthiness & Falsiness:** In JS, conditionals evaluate several non-boolean values as falsy: `0`, `""` (empty string), `null`, `undefined`, and `NaN`. All other values are truthy.
:::

---

### 3.6 Practical Exercises

#### Exercise 1: Password Error Validation
- Declare a variable `isPasswordIncorrect` and set it to `true`.  
- Write an `if`/`else` block: if `true`, log `"Display UI error toast"`. Otherwise, log `"Redirect to Dashboard"`.

#### Exercise 2: Table Row Iteration
- Write a `for` loop that counts from 1 to 4.  
- Inside the loop, log: `"Verifying row number X"` (where X is your counter).

---

### 3.7 Exercise Solutions

::: details 💡 Solutions for Chapter 3 Exercises
**Solution for Exercise 1:**
```js
let isPasswordIncorrect = true;

if (isPasswordIncorrect === true) {
  console.log("Display UI error toast");
} else {
  console.log("Redirect to Dashboard");
}
```

**Solution for Exercise 2:**
```js
for (let i = 1; i <= 4; i++) {
  console.log("Verifying row number " + i);
}
```
:::

---

### 3.8 🛡️ Engineer Mindset in the AI Era: Your Place in the Market

::: warning 🛡️ QA vs. AI: Infinite Loops and Edge-Case Blindness
- **What AI does well:** Rapidly drafts repetitive procedural code and boilerplate loops.
- **The Trap (Where AI fails):** AI often assumes the *Happy Path*. If an API response returns an empty list or `null` instead of an expected array, an unchecked `for` loop generated by AI will throw runtime exceptions.
- **How a QA Engineer thinks:** You apply **Boundary Value Analysis** defensively:
  ```js
  if (!items || items.length === 0) {
    console.log("Validation Failed: Empty item list received");
    return;
  }
  ```
- **Why you remain indispensable:** Critical thinking, negative testing, and anticipating asynchronous race conditions are skills that AI assistance cannot replace.
:::

---

## Chapter 4: Code Reusability — Classic Functions and Arrow Functions

::: info 🎯 Learning Objectives
By the end of this chapter, you will be able to:
- Explain the function concept and modular software design principles.
- Define and invoke classic functions with the `function` keyword.
- Master modern **Arrow Functions** (`=>`), the foundation of Playwright test suites.
- Pass parameters and capture returned values with `return`.
:::

### 4.1 What is a function and why do we need it?

A function is a reusable, self-contained block of logic that receives inputs (parameters), computes them, and optionally outputs a result (`return`):

* **Parameters (Inputs):** Data provided to the function to perform its task.  
* **Function Body (Processing):** The sequential code executed when called.  
* **Return (Output):** The final computed result returned to the caller.

![Anatomy of a Function in JavaScript](/images/sessions/premium/session-3/image4-en.png)
<span class="image-caption">**Fig. 4** — Conceptual anatomy of a JavaScript function: Inputs, Processing, and Return value.</span>

---

### 4.2 The Classic Function

The traditional syntax in JavaScript uses the `function` keyword:

```js
// Function declaration
function calculateTotalPrice(basePrice, taxRate) {
  let finalPrice = basePrice + taxRate;
  return finalPrice;
}

// Function call
let cartTotal = calculateTotalPrice(100, 19);
console.log("Total payment due: " + cartTotal); // Output: 119
```

---

### 4.3 The Arrow Function — The Modern Standard

Introduced in ES6, **Arrow Functions** (`=>`) provide a cleaner, concise syntax and lexical scoping:

```js
const calculateTotalPrice = (basePrice, taxRate) => {
  let finalPrice = basePrice + taxRate;
  return finalPrice;
};

console.log(calculateTotalPrice(50, 5)); // Output: 55
```

**Why Arrow Functions are Essential in Playwright:**  
Every test in Playwright is structured as an Arrow Function passed into the test runner:

```js
test("Verify Login button works", async ({ page }) => {
  // Your E2E automation logic resides here
});
```

---

### 4.4 Did you know...?

::: tip 💡 Did you know...?
- **Implicit Return:** Single-expression arrow functions omit curly braces and the `return` keyword:
  ```js
  const doubleValue = (num) => num * 2;
  ```
- **Zero-parameter functions:** Empty parentheses denote functions with no arguments:
  ```js
  const triggerPing = () => { console.log("Ping sent!"); };
  ```
- **First-Class Functions:** JavaScript treats functions as first-class citizens: they can be assigned to variables, stored in arrays, and passed into other functions as callbacks.
:::

---

### 4.5 Practical Exercises

#### Exercise 1: Classic Greeting Function
Write a classic function named `greetUser` that accepts a parameter `name` (`String`) and logs: `"Welcome, [name]!"`. Test it with your name.

#### Exercise 2: Arrow Function Access Gate
Write an **Arrow Function** named `checkAccess` that takes two parameters: `isAdmin` (`Boolean`) and `isLoggedIn` (`Boolean`).
- If both are true (`&&`), return: `"Access granted to Dashboard"`.
- Otherwise, return: `"Access denied"`.
- Test it with (`true, true`) and (`false, true`).

---

### 4.6 Exercise Solutions

::: details 💡 Solutions for Chapter 4 Exercises
**Solution for Exercise 1:**
```js
function greetUser(name) {
  console.log("Welcome, " + name + "!");
}

greetUser("Alex");
```

**Solution for Exercise 2:**
```js
const checkAccess = (isAdmin, isLoggedIn) => {
  if (isAdmin === true && isLoggedIn === true) {
    return "Access granted to Dashboard";
  } else {
    return "Access denied";
  }
};

console.log(checkAccess(true, true));  // Output: Access granted to Dashboard
console.log(checkAccess(false, true)); // Output: Access denied
```
:::

---

### 4.7 🛡️ Engineer Mindset in the AI Era: Your Place in the Market

::: warning 🛡️ QA vs. AI: Modular Architecture vs. Spaghetti Code
- **What AI does well:** Rapidly drafts procedural scripts for single isolated actions.
- **The Trap (Where AI fails):** AI often copies duplicate setup code across dozens of test files instead of factoring logic into shared helpers.
- **How a QA Engineer thinks:** You design modular test frameworks with the **Page Object Model (POM)** and custom fixtures, ensuring single-source-of-truth maintenance.
- **Why you remain indispensable:** Strategic test architecture, flaky test remediation, and CI/CD resilience require human engineering judgment.
:::

---

## Chapter 5: Session 3 Assignment & Extra Practice (Advanced Level)

### 5.1 Homework Assignment (Session 3 Project)

![Validation Acceptance Criteria](/images/sessions/premium/session-3/image5-en.png)
<span class="image-caption">**Fig. 5** — Validation flow and acceptance criteria diagram for adding a new task.</span>

#### Your Business Task:
You previously built the markup skeleton (**Session 1**) and visual styles (**Session 2**) for our **"Task Tracker"** application. Now it's time to build its core operational logic. You will write a **JavaScript** script that manages and processes the task list, validating data *before* it is displayed.

> **Note:** Write this code either in an external file `app.js` (linked before `</body>` via `<script src="app.js"></script>`) or test it directly in Chrome DevTools Console.

#### 🔗 Technical Acceptance Criteria:
1. **E2E Data Structure (Arrays & Objects):**
   - Declare a constant named `taskLists` (or `taskList`) as an Array.
   - Initialize it with the two tasks from your previous HTML table. Each task must be an Object with 3 properties: `id` (`Number`), `name` (`String`), and `completed` (`Boolean`).
   - *Example:* `[{ id: 1001, name: "HTML Boilerplate Setup", completed: true }, ...]`
2. **Validation Arrow Function (Business Logic):**
   - Write an **Arrow Function** named `processNewTask` that receives one parameter: `taskObj` (an Object).
   - **Strict Validation (if/else):** Check if the task name is empty (`""`) OR `undefined`.
   - If invalid, log: `"Error: Task must have a valid name!"`.
   - If valid, append the object to `taskLists` using `.push()` and log: `"Task added successfully!"`.
3. **Reporting Loop:**
   - After testing the function with a new valid task (e.g., `id: 1003`), write a `for` loop.
   - The loop must traverse the array and log each task's name to the console.

---

### 5.2 Bonus Challenge (Optional): The API "Falsy" Trap

#### Scenario:
Your application receives an API response with a numeric status code. A colleague wrote this helper:

```js
const verifyServer = (statusCode) => {
  if (!statusCode) { // Relies on falsy evaluation
    console.log("Server Error or Missing Response");
  } else {
    console.log("Status OK: " + statusCode);
  }
};
```

When the backend returns status code `0` (e.g. idle/standby state), `0` is evaluated as *Falsy* in JS, falsely reporting an error when the server is actually functional!

#### Your Mission:
Refactor the logic using **strict type verification (`===` and `typeof`)**. Your function, `verifyServerStrict(statusCode)`, must return `"Status OK: " + statusCode` ONLY if the argument is strictly of type `Number`. For `null`, `undefined`, or strings (e.g., `"200"`), it must return `"Server data format error"`.

---

### 5.3 🗝️ Solution Keys (Answers & Explanations)

::: details 💡 Homework & Bonus Solutions
**Homework Assignment Solution:**

```js
// 1. Array of Objects (In-memory database)
const taskLists = [
  { id: 1001, name: "HTML Boilerplate Setup", completed: true },
  { id: 1002, name: "Client-Server Architecture Setup", completed: false }
];

// 2. Validation Arrow Function
const processNewTask = (taskObj) => {
  // Using || (logical OR) and === (strict equality)
  if (taskObj.name === "" || taskObj.name === undefined) {
    console.log("Error: Task must have a valid name!");
  } else {
    taskLists.push(taskObj);
    console.log("Task added successfully!");
  }
};

// Simulating user actions:
processNewTask({ id: 1003, name: "", completed: false }); // Output: Error
processNewTask({ id: 1004, name: "Write first Playwright test", completed: false }); // Output: Success

// 3. Reporting loop
console.log("--- Task Report ---");
for (let i = 0; i < taskLists.length; i++) {
  console.log("Task " + taskLists[i].id + ": " + taskLists[i].name);
}
```

**Bonus Challenge Solution:**

```js
const verifyServerStrict = (statusCode) => {
  // Validate data contract strictly: must be a number
  if (typeof statusCode === "number") {
    return "Status OK: " + statusCode;
  } else {
    return "Server data format error";
  }
};

console.log(verifyServerStrict(0));     // Output: "Status OK: 0" (Bug resolved!)
console.log(verifyServerStrict("200")); // Output: "Server data format error"
```
:::

🎉 **Congratulations!** By integrating this script into `app.js` and connecting it to your HTML from Sessions 1 and 2, you have established the foundation of your first functional frontend application. When we advance to Playwright, your automated tests will interact with the DOM to trigger these exact business validations!