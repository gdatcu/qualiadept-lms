# Session 1: Web Architecture, DOM Structure and HTML Fundamentals

<div style="display: flex; gap: 12px; flex-wrap: wrap; margin: 1.5rem 0 0.5rem 0;">
  <a href="/pdfs/sessions/premium/typescript-playwright/session-1-en.pdf" class="download-btn" target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24"><path d="M5 20h14v-2H5v2zm0-10h4V4h6v6h4l-7 7-7-7z"/></svg>View the PDF version of Session 1</a>
  <a href="https://youtube.com/live/4KjmoJHsZ6M" class="download-btn" target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24"><path d="M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 22c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48 1.73-1.73.47-.13 1.33-.22 2.65-.28 1.3-.07 2.49-.1 3.59-.1L12 2c4.19 0 6.8.16 7.83.44.9.25 1.48.83 1.73 1.73z"/></svg>Watch Session Recording on YouTube</a>
</div>

::: info 🎥 Session Recording
Below you will find the full recording of the live session. You can follow along with the explanations, live code demonstrations, and practical exercises directly in your browser.
:::

<div style="position: relative; width: 100%; padding-bottom: 56.25%; height: 0; margin: 1.5rem 0; overflow: hidden; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
  <iframe 
    src="https://www.youtube.com/embed/4KjmoJHsZ6M" 
    title="Session 1: Web Architecture, DOM Structure and HTML Fundamentals - Live Recording" 
    frameborder="0" 
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
    referrerpolicy="strict-origin-when-cross-origin" 
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;" 
    allowfullscreen>
  </iframe>
</div>

::: info 📊 PowerPoint Presentation
The PowerPoint presentation for this session is not yet available in English and is currently in preparation.
:::

---

## Chapter 1: Web Architecture — How the Internet and Browsers Work

::: info 🎯 Learning Objectives
At the end of this chapter, you will be able to:
- Explain the fundamental difference between the user interface (**Frontend**) and the server (**Backend**).
- Understand the core concepts of **Client**, **Server**, and **Database**.
- Follow the path of an HTTP request from pressing the Enter key to rendering the website on screen.
- Use the **Network** tab in Browser DevTools to intercept and analyze your first HTTP request.
:::

### 1.1 From Manual QA to Automation: Changing Perspective

In manual testing, you interact with the application exactly like an end user: you click buttons, fill out forms, and check if the visual result is correct (*Black Box Testing*).

As a future **QA Automation Engineer**, you need to go a level deeper. When an automated test fails (e.g. Playwright cannot find a button), you need to know **why** it failed. To do that, you need to understand the path the code takes from the server to your screen. We are no longer just testing "what you see" — we are testing the underlying infrastructure.

---

### 1.2 Basic Architecture: Client – Server

Almost every modern web application (including the "Task Tracker" application we are going to build) runs on a **Client-Server** architecture.

* **The Client:** The application that requests information. Most of the time, the client is the web **Browser** (Chrome, Firefox, Safari) from your laptop or phone. When we write automation scripts, our Playwright program acts as an automated "robot client".
* **The Server:** A powerful computer, connected 24/7 to the internet, that "serves" data. This is where the application logic (**Backend**) lives and where web assets (HTML, CSS, images) are hosted.
* **The Database:** The persistent storage system of the server. This is where long-term information is stored (e.g., user accounts, encrypted passwords, saved tasks).

![3-Tier Architecture](/images/sessions/premium/session-1/image1.png)
<span class="image-caption">**Fig. 1** — 3-Tier Architecture diagram. Bidirectional arrows indicate synchronous communication between Frontend, Backend, and Database.</span>

---

### 1.3 The Life Cycle of a Request: HTTP Request & Response

Communication between Client and Server is conducted through a standardized set of rules called the **HTTP Protocol** (*HyperText Transfer Protocol*). Think of HTTP as the common language that both computers speak.

Here is what happens step by step when you type `www.emag.ro` into your browser and press Enter:

1. **HTTP Request:** Your browser (Client) sends a message to the server: *"Hello, please send me the homepage"*. This message is called a **GET** request.
2. **Server Processing:** The server receives the request, queries the database for the latest products and data, assembles the web page, and prepares the payload.
3. **HTTP Response:** The server sends a packet back to the browser containing:
   - **Status Code:** (e.g., `200 OK` — everything succeeded, or `404 Not Found` — resource does not exist).
   - **HTML Code:** (the page structure).
   - **CSS and JavaScript:** (styling and interactivity).
4. **Rendering:** Your browser parses the payload from top to bottom and "paints" the visual elements, buttons, and images onto your screen.

---

### 1.4 Why is this Critical for a QA Engineer?

If a user clicks "Login" and the screen remains frozen, a manual QA might report:
> *"The login button does not work."*

A QA Automation Engineer who understands the architecture will open **DevTools**, inspect the **Network** tab, see that the request was dispatched, but the server returned `500 Internal Server Error`. The reported defect will be:
> *"Server returns HTTP 500 when dispatching POST to `/api/auth/login` endpoint."*

The first report is vague; the second enables the developer to identify and fix the root cause in minutes.

---

### 1.5 Did You Know That...?

::: tip 💡 Did You Know?
- **Lost Packets:** Data sent over the internet does not travel in one solid block. It is split into thousands of small packets that can take different routes across global networks and are reassembled by your browser upon arrival.
- **Universal HTTP Status Codes Rule:**
  - `2xx` – **Success:** Everything went well (e.g., `200 OK`, `201 Created`).
  - `3xx` – **Redirection:** Resource has moved (e.g., `301 Moved Permanently`).
  - `4xx` – **Client Error:** Invalid request (e.g., `400 Bad Request`, `401 Unauthorized`, `404 Not Found`).
  - `5xx` – **Server Error:** The server crashed or failed to process the request (e.g., `500 Internal Server Error`, `502 Bad Gateway`).
:::

---

### 1.6 Applied Story: "The Digital Restaurant"

::: note 📖 Applied Story: The Digital Restaurant
The best analogy for Client-Server architecture is a restaurant:
- **You are the Client (Browser):** You sit at the table and view the menu (**UI - User Interface**).
- **The Waiter is the HTTP Request:** You say to the waiter: *"I would like a pizza."* He takes your order to the kitchen.
- **The Kitchen is the Server (Backend):** The chef receives the order, gathers the ingredients, prepares the dish, and enforces business rules (e.g., "No onions").
- **The Pantry is the Database:** The storage room where raw ingredients and recipes are kept.
- **The Waiter Returns with the HTTP Response:** He delivers the dish to your table along with a status (*"Enjoy your meal!"* = `200 OK`, or *"We are out of dough"* = `404 Not Found`).

As an Automation Tester, your job is not just to taste the pizza (**UI Testing**), but also to intercept the waiter midway (**API Mocking & Contract Testing**) to ensure orders are transmitted accurately.
:::

---

### 1.7 Practical Exercises

#### Exercise 1: Intercepting your own Request (Network Inspector)
Let's practice with Browser DevTools:
1. Open Google Chrome.
2. Right-click anywhere on a blank page and select **Inspect** (or press `F12` / `Ctrl+Shift+I`).
3. In the top navigation of the developer panel, switch to the **Network** tab.
4. Type `www.wikipedia.org` in your browser address bar and press Enter.
5. **Your Task:** Observe the waterfall list of resources. Click on the very first document (`wikipedia.org`) and check the **Headers** panel to find its **Status Code**.

---

### 1.8 Answers & Solutions

::: details 💡 Solution: Exercise 1
If you followed the steps correctly, the first item in the Network tab is the main HTML document. Clicking it opens the **Headers** sub-panel where under **General** you will find **Status Code: 200 OK** (highlighted in green).

::: tip 📝 Key Takeaway
Congratulations! You have intercepted and inspected your first Client-Server transaction. Developing this habit will save you countless hours when debugging automated test failures.
:::
:::

---

## Chapter 2: Introduction to HTML and Semantic Tags

::: info 🎯 Learning Objectives
At the end of this chapter, you will be able to:
- Understand the role of HTML in structuring web applications.
- Write valid HTML elements adhering to opening and closing syntax.
- Understand testability attributes essential for test automation (`id`, `class`, `data-testid`).
- Build a semantically structured webpage ready for automated Playwright locators.
:::

### 2.1 What is HTML? (It is Not a Programming Language!)

**HTML (HyperText Markup Language)** is a **markup language**, not a programming language. It does not contain conditional branching (`if / else`) or mathematical logic.

Its sole purpose is to structure content and define meaning for the browser:
- *"This is a top-level heading"* (`<h1>`)
- *"This is a paragraph"* (`<p>`)
- *"This is a clickable action button"* (`<button>`)

For a QA Automation Engineer, HTML is the blueprint map. If you cannot read the map, automated frameworks like Playwright cannot locate elements accurately.

---

### 2.2 Anatomy of an HTML Element

Most HTML elements follow a 3-part structure:

```html
<button>Submit Order</button>
```

1. **Opening Tag (`<button>`):** Declares the start of the element and holds optional attributes.
2. **Content (`Submit Order`):** The visible text or child elements presented to the user.
3. **Closing Tag (`</button>`):** Signals the termination of the element, marked by the forward slash (`/`).

![Anatomy of an HTML Element](/images/sessions/premium/session-1/image2.png)
<span class="image-caption">**Fig. 2** — Anatomy of an HTML element: Start tag (green), content (blue), and end tag (red).</span>

> [!NOTE]
> **Self-Closing Elements:** Some elements cannot hold text content and do not require closing tags, such as images (`<img src="logo.png" alt="Logo">`) and input fields (`<input type="text">`).

---

### 2.3 Basic Structure of an HTML Document (Boilerplate)

Every valid HTML document conforms to a standard boilerplate structure:

```html
<!DOCTYPE html>
<!-- 1. Document type declaration: Tells the browser to parse HTML5 standard -->
<html lang="en">
  <head>
    <!-- 3. Metadata & Configuration (Not rendered visually on the canvas) -->
    <meta charset="UTF-8">
    <title>My QA App</title>
  </head>

  <body>
    <!-- 4. Visible DOM Body: All user-facing elements to test live here -->
    <h1>Welcome to Task Tracker!</h1>
    <p>This is where we will add our tasks.</p>
  </body>
</html>
```

---

### 2.4 Semantic HTML: Why it Matters for QA

HTML5 introduced **Semantic Elements** that describe their own purpose rather than generic `<div>` containers:

| Semantic Tag | Purpose | QA Significance |
| :--- | :--- | :--- |
| `<header>` | Page or card heading banner | Great anchor for top-level navigation tests |
| `<nav>` | Navigation link container | Target for menu and routing tests |
| `<main>` | Primary unique page content | Used by Playwright accessible role locators |
| `<section>` | Thematic grouping of content | Ideal container for scoping locators |
| `<footer>` | Copyright, links, legal info | Target for footer assertions |

---

### 2.5 HTML Attributes: The Anchors of Automation

Attributes provide additional properties to elements and are **always declared inside the opening tag**:

$$\text{attribute\_name} = \text{"value"}$$

| Attribute | Example | Explanation & Relevance for QA |
| :--- | :--- | :--- |
| `id` | `<button id="login-btn">` | **High Priority:** Must be unique within the page. Preferred for fast locator queries (`#login-btn`). |
| `class` | `<p class="error-text">` | Shared styling class. Multiple elements can share classes; ideal for list iterations. |
| `type` | `<input type="checkbox">` | Identifies the input variant (`text`, `password`, `checkbox`, `radio`, `date`). |
| `name` | `<input name="email">` | Form field identifier sent in payloads. Great secondary locator. |
| `data-*` | `<button data-testid="submit-login">` | **The Gold Standard for Automation:** Dedicated test hooks (`data-testid`, `data-qa`) that survive UI and CSS refactoring! |

---

### 2.6 Did You Know That...?

::: tip 💡 Did You Know?
- **HTML is Case-Insensitive:** `<BUTTON>` and `<button>` behave identically in browsers, but modern industry standards strictly enforce lowercase notation.
- **Duplicate IDs Break Automation:** Browsers forgivingly render duplicate IDs, but automation engines like Playwright will select only the first match or fail with strict mode violation errors!
:::

---

### 2.7 Applied Story: "The Foundation and the Bricks of the House"

::: note 📖 Applied Story: The Foundation and the Bricks
If a webpage is a building:
- **The Boilerplate (`<html>`, `<head>`, `<body>`)** is the foundation, structural pillars, and roof.
- **HTML Tags (`<h1>`, `<p>`, `<button>`)** are the individual bricks, windows, and doorways.
- **Attributes (`id`, `data-testid`)** are the barcode labels attached to each fixture. When you instruct a robotic worker: *"Inspect door with ID `main-entrance-door`"*, it locates the target instantly without ambiguity.
:::

---

### 2.8 Practical Exercises

#### Exercise 1: Attribute Hunt (DevTools)
1. Open Google Chrome and navigate to any major website (e.g., `www.emag.ro` or `www.wikipedia.org`).
2. Right-click on the search input box and select **Inspect**.
3. Locate the highlighted `<input>` element in the Elements tab and identify its `id` and `type` attributes.

#### Exercise 2: Write Semantic Code
Write a clean HTML snippet representing:
- A `<header>` with an `<h1>` containing `"My Store"`.
- A `<main>` containing an `<input>` with `id="search-box"` and a `<button>` with `data-testid="search-btn"` and text `"Search Product"`.

---

### 2.9 Answers & Solutions

::: details 💡 Solution: Exercise 1
Search boxes typically render as `<input type="search">` or `<input type="text">` with descriptive IDs such as `id="searchboxTrigger"` or `id="search"`.
:::

::: details 💡 Solution: Exercise 2
```html
<header>
  <h1>My Store</h1>
</header>

<main>
  <input type="text" id="search-box">
  <button data-testid="search-btn">Search Product</button>
</main>
```
:::

---

## Chapter 3: DOM Structure and Practical Workshop (Task Tracker)

::: info 🎯 Learning Objectives
At the end of this chapter, you will be able to:
- Explain what the **Document Object Model (DOM)** is and how it differs from static HTML.
- Identify hierarchical relationships (**Parent**, **Child**, **Sibling**) in the DOM tree.
- Understand how Playwright interacts directly with the DOM.
- Construct an HTML interface (forms, dropdowns, tables) for the "Task Tracker" application with testability hooks.
:::

### 3.1 What is the DOM (Document Object Model)?

HTML is the text transferred over the network; the **DOM (Document Object Model)** is the live, in-memory tree representation constructed by the browser engine upon parsing that HTML.

Once the DOM tree is built, the browser paints the pixels on screen. JavaScript can subsequently read and mutate the DOM dynamically without requiring a full page refresh.

---

### 3.2 Family Tree: Parents, Children, and Siblings

Locating elements in test automation relies on traversing the DOM hierarchy:
- **Root:** The top-most ancestor node (`<html>`).
- **Parent:** A node directly enclosing another node (e.g., `<body>` is the parent of visible elements).
- **Child:** A node nested directly inside another node (e.g., an `<h1>` inside `<header>` is a child of `<header>`).
- **Siblings:** Nodes sharing the exact same parent node (e.g., consecutive `<li>` elements inside a `<ul>`).

![DOM Hierarchy Tree](/images/sessions/premium/session-1/image3.png)
<span class="image-caption">**Fig. 3** — The hierarchical tree structure of an HTML document representing parent-child relationships.</span>

---

### 3.3 Why is the DOM the Playground of Automation?

Automation engines like Playwright **do not look at screen pixels**. They interact directly with the DOM tree.

When you execute `page.getByRole('button', { name: 'Save' }).click()`, Playwright queries the accessibility tree and DOM nodes directly in browser memory, verifying that the node is attached, visible, and interactive.

---

### 3.4 How Playwright Interacts with the DOM

- **Chrome DevTools Protocol (CDP) & WebSockets:** Queries DOM nodes directly inside memory in milliseconds.
- **Auto-Waiting:** Automatically waits for DOM mutations and element actionability before executing clicks or typing.
- **Actionability Checks:** Ensures elements are visible, enabled, stable, and not obscured by overlaying elements.

---

### 3.5 Practical Workshop: Task Tracker HTML Skeleton

Let's build the complete HTML structure for our **Task Tracker** practice application:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Task Tracker Pro - QA Edition</title>
</head>
<body>
  <header>
    <h1>Task Tracker Pro - QA Edition</h1>
    <p>Complete automation practice platform</p>
  </header>

  <main>
    <!-- Add Task Section -->
    <section class="task-input-section">
      <h2>Add a New Task</h2>
      <form id="add-task-form">
        <label for="task-name">Task Name:</label>
        <input 
          type="text" 
          id="task-name" 
          data-testid="input-task-name" 
          placeholder="Ex: Write E2E scripts" 
          required
        >

        <label for="task-priority">Priority:</label>
        <select id="task-priority" data-testid="select-priority">
          <option value="low">Low</option>
          <option value="medium" selected>Medium</option>
          <option value="high">Critical</option>
        </select>

        <label for="due-date">Deadline:</label>
        <input 
          type="date" 
          id="due-date" 
          data-testid="input-due-date"
        >

        <button type="submit" id="add-task-btn" data-testid="submit-new-task">Save Task</button>
      </form>
    </section>

    <!-- Active Tasks Section (List Type) -->
    <section class="task-list-section">
      <h2>Active Tasks</h2>
      <ul id="active-tasks-list">
        <li class="task-item" data-task-status="pending">
          <input type="checkbox" class="complete-checkbox" data-testid="check-task-1">
          <span>Learn DOM architecture</span>
          <span class="badge priority-high">Critical</span>
          <button class="delete-btn" data-testid="delete-task-1">Delete</button>
        </li>
      </ul>
    </section>

    <!-- History Section (Table Type) -->
    <section class="task-history-section">
      <h2>Completed Tasks History</h2>
      <table id="history-table" border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>Task Name</th>
            <th>Completion Date</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>#1001</td>
            <td>HTML Boilerplate Setup</td>
            <td>09-Aug-2026</td>
          </tr>
        </tbody>
      </table>
    </section>
  </main>

  <footer>
    <p>© 2026 QualiAdept Bootcamp</p>
  </footer>
</body>
</html>
```

---

### 3.6 Did You Know That...?

::: tip 💡 Did You Know?
- **Live DOM vs Static Source:** Viewing page source displays the initial HTML file delivered from the server. The DOM in DevTools displays the active, live state modified by JavaScript executions.
- **The `data-testid` Attribute:** Does not alter visual rendering or performance. It serves exclusively as a stable selector beacon for automated test scripts (`page.getByTestId('submit-new-task')`).
:::

---

### 3.7 Applied Story: "The Web Family Tree"

::: note 📖 Applied Story: The Web Family Tree
Imagine the DOM as an extended family tree:
- **`document`** is the head of the household.
- **`<head>` and `<body>`** are sibling children. `<head>` manages memory and metadata, while `<body>` handles visual interaction.
- Inside `<body>`, `<header>`, `<main>`, and `<footer>` are sibling descendants.
- When querying elements with ambiguous names (e.g. multiple Save buttons), specifying the parental ancestry (e.g. `form.locator('button')`) ensures exact locator scoping.
:::

---

### 3.8 Practical Exercises

#### Exercise 1: Inspect Dropdowns in DevTools
1. Open your `index.html` in Chrome and open DevTools (`F12`).
2. Inspect the `<select id="task-priority">` element.
3. **Question:** What is the relationship between `<select>` and `<option>`?

#### Exercise 2: Extend the History Table
Add a second row (`<tr>`) to the `<tbody>` with:
- ID: `#1002`
- Task: `Understanding Client-Server Architecture`
- Date: `10-Aug-2026`

---

### 3.9 Answers & Solutions

::: details 💡 Solution: Exercise 1
The `<option>` elements are nested directly inside `<select>`, making them **Children** of `<select>` (and `<select>` is their Parent).
:::

::: details 💡 Solution: Exercise 2
```html
<tbody>
  <tr>
    <td>#1001</td>
    <td>HTML Boilerplate Setup</td>
    <td>09-Aug-2026</td>
  </tr>
  <!-- Newly added row -->
  <tr>
    <td>#1002</td>
    <td>Understanding Client-Server Architecture</td>
    <td>10-Aug-2026</td>
  </tr>
</tbody>
```
:::

---

## Chapter 4: Browser Storage, HTTP Methods, and Hands-on Project

::: info 🎯 Learning Objectives
At the end of this chapter, you will be able to:
- Distinguish between **GET** and **POST** requests and identify their QA implications.
- Inspect and manipulate browser storage (**Cookies**, **LocalStorage**, **SessionStorage**) in DevTools.
- Build a dedicated Login/Register page optimized for automated testability.
- Validate your project using the QualiAdept Cloud Evaluation platform.
:::

### 4.1 HTTP Methods: GET vs. POST

| Method | Request Payload Location | Browser Caching | QA Security Rule |
| :--- | :--- | :--- | :--- |
| **GET** | Appended to URL query parameters (`/search?q=laptop`) | Cached by default | **NEVER** transmit passwords or sensitive tokens via GET! |
| **POST** | Enclosed securely inside the HTTP Request Body | Not cached by default | Used for form submissions, user logins, and data creation. |

---

### 4.2 Browser Storage: Cookies, LocalStorage, and SessionStorage

Web protocols are stateless. To retain user identity and state across requests, browsers leverage storage mechanisms:

- **Cookies (Max 4KB):** Automatically attached by the browser to every outgoing HTTP request header to validate sessions.
- **LocalStorage (Max ~5-10MB):** Persistent key-value storage that remains intact across browser restarts until cleared.
- **SessionStorage (Max ~5MB):** Ephemeral storage tied to the lifetime of the active tab.

---

### 4.3 DevTools: The Application Tab

![Chrome DevTools Application Tab](/images/sessions/premium/session-1/image4.png)
<span class="image-caption">**Fig. 4** — Chrome DevTools Application tab displaying Storage, Local Storage, and Cookies panels.</span>

In automated test suites with Playwright, instead of repeatedly submitting the login form for 100 tests (costing 300+ seconds), we perform login once via API or UI, save the authentication storage state, and reuse the storage tokens across tests!

---

### 4.4 Did You Know That...?

::: tip 💡 Did You Know?
- **The Origin of Cookies:** Lou Montulli invented web cookies at Netscape in 1994 to enable e-commerce shopping carts to persist across page navigations.
- **Storage Capacity:** While a cookie holds at most 4KB of data, LocalStorage holds up to 5MB — enough for an entire book!
:::

---

### 4.5 Applied Story: "The Postcard and the Sealed Parcel"

::: note 📖 Applied Story: The Postcard and the Sealed Parcel
- **GET Request:** Like a postcard. The message is written on the outside; anyone handling the mail can view the contents. Great for public search queries, terrible for passwords.
- **POST Request:** Like a sealed, tamper-evident parcel. The address is visible on the label, but the contents (HTTP Body) remain protected inside.
:::

---

### 4.6 Practical Exercises

#### Exercise 1: Cookie Invalidation Experiment
1. Open Chrome and visit a service where you are currently authenticated (e.g. GitHub or YouTube).
2. Open DevTools (`F12`), switch to the **Application** tab, and expand **Cookies**.
3. Locate the session token cookie, right-click and choose **Delete**.
4. Refresh the page. Observe that your session is instantly invalidated.

---

### 4.7 Answers & Solutions

::: details 💡 Solution: Exercise 1
Deleting the authentication session cookie causes the server to reject subsequent requests with unauthenticated status, redirecting you immediately to the login view.
:::

---

### 4.8 Homework Project: Login & Register Interface

#### Business Requirements:
Build a standalone `login.html` webpage structured for automated testing.

#### Technical Acceptance Criteria:
- Valid HTML5 boilerplate (`<!DOCTYPE html>`, `<html>`, `<head>`, `<body>`).
- Document title: `Task Tracker Login`.
- A `<form>` containing:
  - Email input (`id="login-email"`, `data-testid="input-email"`).
  - Password input (`type="password"`, `id="login-password"`, `data-testid="input-password"`).
  - Submit button with text `"Log In"` and `data-testid="btn-submit-login"`.
- Enclosing container `<div class="login-container">`.

---

### How to Validate on the QualiAdept Platform

1. Save your code in your local editor and verify it displays correctly in the browser.
2. Log in to [certify.qualiadept.eu](https://certify.qualiadept.eu) with your GitHub account.
3. Open **Module 01 Workspace**, paste your HTML code, and click **Submit**.
4. Review the automated static inspection results and achieve **100% Passed** to unlock the subsequent module!