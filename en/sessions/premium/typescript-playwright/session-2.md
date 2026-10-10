# Session 2: Modern CSS and DOM Selectors

<div style="display: flex; gap: 12px; flex-wrap: wrap; margin: 1.5rem 0 0.5rem 0;">
  <a href="/pdfs/sessions/premium/typescript-playwright/session-2-en.pdf" class="download-btn" target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24"><path d="M5 20h14v-2H5v2zm0-10h4V4h6v6h4l-7 7-7-7z"/></svg>View the PDF version of Session 2</a>
  <a href="https://youtube.com/live/D6XhJsii658" class="download-btn" target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24"><path d="M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 22c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48 1.73-1.73.47-.13 1.33-.22 2.65-.28 1.3-.07 2.49-.1 3.59-.1L12 2c4.19 0 6.8.16 7.83.44.9.25 1.48.83 1.73 1.73z"/></svg>Watch Session Recording on YouTube</a>
</div>

::: info 🎥 Session Recording
Below you will find the full recording of the live session. You can follow along with the explanations, live code demonstrations, and practical exercises directly in your browser.
:::

<div style="position: relative; width: 100%; padding-bottom: 56.25%; height: 0; margin: 1.5rem 0; overflow: hidden; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
  <iframe 
    src="https://www.youtube.com/embed/D6XhJsii658" 
    title="Session 2: Modern CSS and DOM Selectors - Live Recording" 
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

## Chapter 1: CSS Fundamentals and Box Model — From HTML Skeleton to Visual Presentation

::: info 🎯 Learning Objectives
By the end of this chapter, you will be able to:
- Explain the role of CSS in the web ecosystem and the concept of **Separation of Concerns**.
- Correctly link style rules to an HTML document using the industry-recommended external method.
- Break down the anatomy of a CSS rule and identify syntax errors.
- Understand the **Box Model** to investigate why elements overlap or block interactions.
- Correlate CSS visibility properties with potential errors in End-to-End (E2E) automated tests.
:::

### 1.1 What is CSS and Why Does it Matter for QA?

If in Session 1 we established that HTML represents the "bricks and structure" of the house, CSS (*Cascading Style Sheets*) represents the paint, wallpaper, furniture, and exact dimensions of the rooms. HTML defines *what* an element is (a button, a paragraph), while CSS defines *how it looks and where it is positioned* on the screen.

As a future QA Automation Engineer, you might ask yourself: *"Why do I need to learn web design if I'm going to write functional tests?"* The answer lies in the daily challenges of automation:

* **Locating Elements:** Playwright and Cypress natively use CSS Selectors to find elements on the page. Without mastering CSS, you won't know how to point the robot with surgical precision to where it needs to act.  
* **Visibility States:** Many bugs and failed tests occur because an element is present in the DOM (so the HTML is correct), but a CSS rule makes it invisible (`display: none`, `visibility: hidden`, or `opacity: 0`). Playwright, built to emulate a human, will refuse to click on a hidden element.  
* **Intercepting Clicks:** Another invisible element might be rendered *over* your button (e.g., a loading overlay). Knowing CSS helps you spot the obstacle in DevTools.

---

### 1.2 Methods of Applying CSS (Separation of Concerns)

There are three ways to style an HTML element, but the industry predominantly uses only one. It is important to recognize all of them during code inspection:

1. **Inline CSS (Directly on the element):** Applied using the `style` attribute directly on the HTML tag. Hard to maintain and avoided in modern applications:
   ```html
   <button style="color: red;">Click</button>
   ```
2. **Internal CSS (In `<head>`):** Written between `<style>` tags inside the HTML document. Useful only for very simple, isolated pages.
3. **External CSS (External file — Industry Standard):** Keeps the code clean. HTML stays in one file, design in another (e.g., `style.css`). This respects the *Separation of Concerns* principle.

For the external method (which we will use for the "Task Tracker" app), we make the connection using the `<link>` tag in the `<head>` section:

```html
<head>
  <title>Task Tracker</title>
  <!-- The critical link between structure and design -->
  <link rel="stylesheet" href="style.css">
</head>
```

---

### 1.3 Anatomy of a CSS Rule

CSS code consists of a list of rules. Each rule tells the browser how to draw one or more elements. Here is what a complete and correct rule looks like:

```css
button {
  background-color: #3498db;
  color: white;
  border-radius: 5px;
}
```

Let's break it down:

* **The Selector (`button`):** Indicates the target in the HTML document (*"Find absolutely all buttons on the page!"*).  
* **The Declaration Block (`{ ... }`):** The curly braces enclose the package of visual rules that will apply to the target.  
* **The Property (`background-color`, `color`):** What specific feature we want to change (e.g., background color, text color).  
* **The Value (`#3498db`, `white`):** How we want to set that property.  
* **Important:** Each declaration (property-value pair) is separated by a colon (`:`) and **must end with a semicolon (`;`)**. Omitting that `;` will break the next rule.

---

### 1.4 The Box Model — A Vital Concept for QA

One of the most important secrets you need to know is that, to the browser, **absolutely every HTML element is a rectangular box**. Even if a button looks round (`border-radius`), its physical footprint on the screen is a rectangle.

This rectangle is defined by the **Box Model**, which has 4 layers (from inside out):

* **Content:** The heart of the box. The actual text or image.  
* **Padding:** The *inner* space between the text and the edge of the box. Makes the button look thicker and easier to click. If you click on the padding, you click on the button.  
* **Border:** The line that delineates the edge of the element. It can be invisible, solid, or dotted.  
* **Margin:** The *outer*, empty space between this element and neighboring elements. The margin pushes other elements away. **If a QA tries to click on the "Margin", the click passes right through it and hits the element behind it!**

---

### 1.5 Did You Know That...?

::: tip 💡 Did You Know?
- **Why is it called "Cascading"?** If you write two conflicting CSS rules for the same element, the browser will apply the rule read last. Design "cascades" from top to bottom. The only exception is adding the `!important` flag, which forces the override of the cascade.
- **`pointer-events: none;` — The Invisible Obstacle:** Developers frequently use this property to temporarily disable an element. The button looks completely normal on the screen, but if you try to click on it (manually or via Playwright code), the click passes right through it.
:::

---

### 1.6 Applied Story: "The Designer and the Comfort Zone"

::: note 📖 Applied Story: The Designer and the Comfort Zone
Think of a Painting you want to hang on a wall:
- **HTML:** The canvas itself (**Content**).
- **CSS Designer:**
  - *"Put a white Passepartout, 5 cm wide, between the canvas and the frame"* (**Padding**).
  - *"Put a thick oak wood frame on it"* (**Border**).
  - *"Don't hang any other painting closer than 20 cm to this one. It needs space to breathe!"* (**Margin**).

When you program Playwright to click on the painting, the robot clicks in the middle of the Content. But if the Margin of another huge painting accidentally overlaps yours, the robot hits the transparent Margin and fails! This is how 30% of unexpected E2E test failures occur in real life.
:::

---

### 1.7 Practical Exercises

#### Exercise 1: Investigate CSS in DevTools
1. Open Google Chrome and go to `www.wikipedia.org`.
2. Right-click on the central search button (magnifying glass) and choose **Inspect**.
3. In the DevTools panel, under the **Elements** tab, locate the **Styles** section.
4. **Mission:** Find the `background-color` (or `color`) property and change it from the color palette. Observe the live modification.

#### Exercise 2: Explore the Box Model (Advanced Investigation)
1. In DevTools, next to the **Styles** tab, select the **Computed** tab.
2. Inspect the interactive Box Model diagram (blue, green, yellow, orange).
3. **Mission:** Hover over the green rectangle (padding) and orange one (margin). Notice how Chrome highlights the dead zones on the live page.

---

### 1.8 Answers & Solutions

::: details 💡 Solution: Exercises 1 & 2
The **Computed** panel is a QA engineer's primary tool for resolving errors like *"Playwright is clicking on the wrong element"*. When you hover over margin/padding in that diagram, Chrome highlights the invisible spaces pushing elements into each other.
:::

---

### 1.9 🛡️ Engineer Mindset in the AI Era: Your Place in the Market

::: warning 🛡️ QA vs. AI: Why knowing CSS makes you irreplaceable
- **What AI does well:** AI generates syntax instantly (`page.click('button')`, `background-color: blue;`).
- **The Trap (Where AI fails):** AI is blind to visual runtime context. If an element is intercepted by an invisible layer or an overlapping margin, AI blindly suggests adding `{ force: true }`, which masks a real user-facing bug!
- **How an engineer thinks:** An engineer opens DevTools, inspects the Computed Box Model, and files a proper bug report: *"Header padding overlaps the main CTA container"*.
- **Why you stay relevant:** AI writes syntax; you architect stability and diagnose visual root causes.
:::

---

## Chapter 2: Basic CSS Selectors — The QA's Precision Tools

::: info 🎯 Learning Objectives
By the end of this chapter, you will be able to:
- Identify and write basic CSS selectors: **Element**, **ID**, and **Class**.
- Understand selector specificity and why the ID is king.
- Write attribute-based selectors (e.g., `data-testid`), fundamental in E2E testing.
- Avoid the traps of dynamic classes generated by modern frameworks (React, Tailwind).
:::

### 2.1 Basic Syntax: Element, ID, and Class

Just as a postal service needs an address to deliver a letter, CSS needs **Selectors** to know which element to apply rules to. Later, you will use *this exact same address* to tell Playwright where to interact!

1. **The Element Selector (Type Selector) — Weakest (Generic):**
   - **HTML:** `<button>Save</button>`
   - **CSS:** `button { background-color: blue; }`
   - **Playwright:** `page.locator('button')`
   - *Limitation:* Targets *all* buttons on the page, often causing strict mode violation errors.

2. **The Class Selector — Moderate (Group):**
   - **HTML:** `<div class="product-card">...</div>`
   - **CSS:** `.product-card { border: 1px solid black; }`
   - **Playwright:** `page.locator('.product-card')`
   - *Usage:* Great for counting collections of items (e.g. products in cart).

3. **The ID Selector — Powerful (Unique):**
   - **HTML:** `<input id="email-field">`
   - **CSS:** `#email-field { width: 100%; }`
   - **Playwright:** `page.locator('#email-field')`
   - *Advantage:* IDs must be unique across the document, ensuring zero ambiguity.

---

### 2.2 Attribute Selectors: The "Holy Grail" of Automation

In modern frameworks (React, Vue, Angular), CSS classes change constantly due to CSS-in-JS hashing (e.g., `class="btn_v2_xyz789"`).

How does a QA solve this? By using **Attribute Selectors**!

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
// Or using the dedicated locator helper:
page.getByTestId('submit-login');
```

This decouples design modifications from testing logic.

---

### 2.3 Applied Story: "Package Delivery"

::: note 📖 Applied Story: Package Delivery
Think of selectors as ways to find a resident in a large apartment building:
- **Element Selector (`button`):** *"Look for a human!"* (Too many humans in the building; ambiguous).
- **Class Selector (`.blond-hair`):** *"Look for blond-haired residents!"* (Multiple matches possible).
- **ID Selector (`#ssn-1900101123456`):** *"Look for the person with this National ID."* (Unique, but subject to administrative updates).
- **Attribute Selector (`[data-role="building-admin"]`):** *"Give the package to whoever holds the official admin badge."* (The ultimate QA approach: stable regardless of visual changes).
:::

---

### 2.4 Practical Exercises

#### Exercise 1: Selector Hunt (DevTools)
1. Go to `www.google.com`.
2. Inspect the search button.
3. Note down its class, ID (if any), and special attributes like `aria-label` or `data-*`.

#### Exercise 2: Write your own Attribute Selector
Given the following HTML snippet:
```html
<div id="container-99" class="wrapper-blue" data-test="user-profile-card">John Doe</div>
```
Write a CSS selector using square brackets that binds strictly to the test attribute.

---

### 2.5 Answers & Solutions

::: details 💡 Solution: Exercise 2
The correct and resilient CSS selector is:
```css
[data-test="user-profile-card"]
```
:::

---

### 2.6 🛡️ Engineer Mindset in the AI Era: The Code Generator Trap

::: warning 🛡️ QA vs. AI: The Code Generator Trap
- **What AI does well:** Playwright Codegen or AI tools rapidly generate lines like `page.locator('.bg-blue-500.hover\\:bg-blue-700.text-white').click()`.
- **The Trap:** When designers switch from `bg-blue-500` to `bg-blue-600`, 500 tests fail instantly.
- **How an engineer thinks:** The engineer requests or adds `data-testid="login-button"` and writes resilient tests: `page.getByTestId('login-button').click()`.
:::

---

## Chapter 3: Advanced CSS Selectors & Pseudo-classes — Complex DOM Navigation

::: info 🎯 Learning Objectives
By the end of this chapter, you will be able to:
- Use relational selectors (**Child**, **Descendant**, **Sibling**) to navigate complex HTML structures.
- Understand and apply state pseudo-classes (`:hover`, `:disabled`, `:checked`).
- Utilize structural pseudo-classes (`:nth-child`, `:first-child`) to target items in dynamic tables and lists.
- Correctly chain multiple selectors for surgical precision.
:::

### 3.1 Tree Navigation: Relational Selectors (Combinators)

When multiple items share identical classes and lack IDs, **Combinators** allow us to navigate through the DOM tree:

1. **The Descendant Selector (Space) — "Deep Search":**
   - **Syntax:** `ElementA ElementB` (separated by a space).
   - **Example:** `#menu a` — Finds all links `<a>` located anywhere inside `#menu`.

2. **The Direct Child Selector (`>`) — "Strict Search":**
   - **Syntax:** `ElementA > ElementB`
   - **Example HTML:**
     ```html
     <ul class="main-list">
       <li>Item 1</li>
       <li>
         <ul class="sublist">
           <li>Sub-Item 1</li> <!-- Grandchild to .main-list -->
         </ul>
       </li>
     </ul>
     ```
   - **CSS:** `.main-list > li` — Selects only top-level `<li>` elements, ignoring nested sub-items.

3. **Chaining (No Space):**
   - **Syntax:** `button.btn-danger[data-status="error"]`
   - **Meaning:** Finds an element that matches **all** conditions simultaneously.

---

### 3.2 State Pseudo-classes: Testing Dynamism

Pseudo-classes represent interactive states:

* `:hover` — Element hovered by mouse cursor (`page.locator(...).hover()`).
* `:focus` — Active input field receiving keyboard input.
* `:disabled` — Inactive form element:
  ```javascript
  await expect(page.locator('button[type="submit"]')).toBeDisabled();
  ```
* `:checked` — Checked checkbox or radio button.

---

### 3.3 Structural Pseudo-classes: Finding the "Needle in the Haystack"

* `:first-child` / `:last-child` — Selects first or last sibling (`ul.menu > li:last-child`).
* `:nth-child(n)` — Targets an exact numerical index:
  ```css
  /* Target the 3rd row in a table */
  tr:nth-child(3)
  ```
* Alternating rows: `tr:nth-child(even)` / `tr:nth-child(odd)`.

---

### 3.4 Applied Story: "The Full Address"

::: note 📖 Applied Story: The Full Address
Imagine delivering a package in a skyscraper:
- **Simple Selector (`.door`):** Search any door in the building (ambiguous).
- **Descendant Selector (`#floor-5 .door`):** Search all doors on the 5th floor.
- **Direct Child Selector (`#main-hallway > .door`):** Enter only doors directly on the hallway.
- **Structural Pseudo-class (`#main-hallway > .door:nth-child(3)`):** Open the 3rd door in the hallway.
- **Chaining (`#main-hallway > .door.red:disabled`):** Open the door that is red AND locked.
:::

---

### 3.5 Practical Exercises

#### Exercise 1: The Problematic Table
Target strictly the second row in the table body of `#history-table` using a descendant combinator and `:nth-child`.

#### Exercise 2: DevTools Navigation
1. Go to `www.wikipedia.org`.
2. Press `Ctrl+F` inside the Elements panel.
3. Test `div.central-featured-lang > strong` vs `div.central-featured-lang strong`.

---

### 3.6 Answers & Solutions

::: details 💡 Solution: Exercise 1
The safest and most precise selector is:
```css
#history-table tbody tr:nth-child(2)
```
:::

---

### 3.7 🛡️ Engineer Mindset in the AI Era: DOM Traversal

::: warning 🛡️ QA vs. AI: Navigating Complex Hierarchies
- **The Trap:** AI often produces fragile deep chains: `div > table > tbody > tr:nth-child(5) > td:nth-child(3)`.
- **How an engineer thinks:** Scope to a resilient anchor ID: `#data-table tr:nth-child(5) td:nth-child(3)`.
:::

---

## Chapter 4: Modern Layout (Basic Flexbox) & Session 2 Assignment

::: info 🎯 Learning Objectives
By the end of this chapter, you will be able to:
- Understand the Flexbox model (**Container** and **Items**).
- Correlate responsive layout behavior with multi-resolution test automation (Desktop vs. Mobile).
- Use the DevTools `flex` inspector badge.
- Complete the Session 2 Project.
:::

### 4.1 Why Should a QA Understand Flexbox?

Modern responsive web apps adapt dynamically across viewports. When screen width shrinks, Flexbox wraps items, hides menus in drawers, or stacks buttons vertically. Understanding Flexbox helps diagnose why tests pass on Desktop (1920x1080) but fail on Mobile (375x667).

---

### 4.2 Flexbox: Core Properties

1. **The Flex Container (Parent):**
   ```css
   .nav-menu {
     display: flex;
   }
   ```
2. **Main Axis Alignment (`justify-content`):**
   - `flex-start` — Aligns children to start.
   - `center` — Centers children.
   - `space-between` — Places first child at start, last at end, with equal distribution (standard for navigation bars).
3. **Wrapping (`flex-wrap`):**
   ```css
   .button-group {
     flex-wrap: wrap;
   }
   ```

---

### 4.3 Applied Story: "The Supermarket Shelf"

::: note 📖 Applied Story: The Supermarket Shelf
- **Parent / Flex Container:** The supermarket shelf.
- **Children / Flex Items:** Cereal boxes placed on the shelf.
- `justify-content: space-between` places one box at the far left, one at the far right, and spreads the rest evenly.
- `flex-wrap: wrap` lets extra boxes drop onto the next shelf row instead of spilling out.
:::

---

### 4.4 Practical Exercises

#### Exercise 1: The Flex Badge in DevTools
1. Go to `www.github.com`.
2. Inspect the top navigation bar.
3. Click the `flex` badge in DevTools Elements to view overlay grid guidelines.

---

### 4.5 Answers & Solutions

::: details 💡 Solution: Exercise 1
Clicking the `flex` badge overlays interactive guidelines showing margins, alignments, and wrapping behavior directly on screen.
:::

---

### 4.6 Homework (Session 2 Project)

**Technical Acceptance Criteria:**
1. **External CSS File:** Link `<link rel="stylesheet" href="style.css">` inside `<head>`.
2. **Flexible Navbar:**
   - `<nav class="navbar">` inside `<header>`.
   - Element `#logo` and button `data-testid="btn-login"`.
3. **Structural Table Row:**
   - 3rd row (`<tr>`) inside `<tbody>` must contain `<button class="delete-row">`.
4. **Dynamic State Button:**
   - Add `<button disabled data-testid="submit-task-btn">` in the task form.

---

### 4.7 🛡️ Engineer Mindset in the AI Era: Layout Debugging

::: warning 🛡️ QA vs. AI: Debugging Layout Anomalies
AI analyzes static code, but layout operates dynamically across resolutions. An engineer links CI/CD failures on small viewports to missing `flex-wrap` rules rather than treating it as a locator timeout.
:::

---

## Chapter 5: Bonus & Extra Practice — Advanced Level

### 5.1 Challenge 1: The Dynamic Classes Nightmare (Tailwind CSS)

```html
<div class="flex-col w-full px-4 py-2 mt-8 wrapper-xyz">
  <div class="item-row flex justify-between border-b pb-2">
    <span class="text-sm font-bold">Premium Subscription</span>
    <button class="bg-red-500 hover:bg-red-700 text-white rounded px-2" aria-label="Delete Subscription">X</button>
  </div>
  <div class="item-row flex justify-between border-b pb-2 mt-4">
    <span class="text-sm font-bold">Processing Fee</span>
    <button class="bg-gray-300 text-gray-500 rounded px-2" disabled>X</button>
  </div>

  <div class="checkout-area mt-10">
    <button class="btn-primary flex items-center justify-center w-full py-4 rounded-lg bg-green-500 text-white font-bold" aria-label="Checkout">
      <span>Proceed to Payment</span>
    </button>
  </div>
</div>
```

**Missions:**
- **Mission 1.A:** Write a robust selector for "Proceed to Payment" without using class names.
- **Mission 1.B:** Target only the active delete button using `:not(:disabled)`.

---

### 5.2 Challenge 2: The Invisible Enemy (Z-Index & Overlays)

```html
<button id="save-btn">Save Data</button>
<div class="loading-overlay"></div>
```

```css
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  opacity: 0; /* Visually transparent, but intercepting pointer clicks! */
  z-index: 9999;
}
```

---

### 5.3 💡 Solution Keys

::: details 💡 Solutions: Challenges 1 & 2
- **Challenge 1.A:**
  ```css
  button[aria-label="Checkout"]
  ```
- **Challenge 1.B:**
  ```css
  button[aria-label="Delete Subscription"]:not(:disabled)
  ```
- **Challenge 2:** Add `pointer-events: none;` to `.loading-overlay` so mouse clicks pass through to the button underneath:
  ```css
  .loading-overlay {
    pointer-events: none;
  }
  ```

::: tip 📝 Milestone Reached
Understanding `aria-labels` and `pointer-events` equips you to solve 80% of tricky automation issues encountered in enterprise testing!
:::
:::