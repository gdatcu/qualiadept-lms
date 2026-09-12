# **Session 2: Modern CSS and DOM Selectors**

<div style="display: flex; gap: 12px; flex-wrap: wrap; margin: 1.5rem 0 0.5rem 0;">
  <a href="/pdfs/sessions/premium/typescript-playwright/session-2-en.pdf" class="download-btn" target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24"><path d="M5 20h14v-2H5v2zm0-10h4V4h6v6h4l-7 7-7-7z"/></svg>View the PDF version of Session 2</a>
</div>

::: info 📊 PowerPoint Presentation
The PowerPoint presentation for this session is not yet available in English and is currently in preparation.
:::

## **Chapter 1: CSS Fundamentals and Box Model \- From HTML Skeleton to Visual Presentation** {#chapter-1:-css-fundamentals-and-box-model---from-html-skeleton-to-visual-presentation}

#### **Learning Objectives**

|  ?? By the end of this chapter, you will be able to: ??Explain the role of CSS in the web ecosystem and the concept of Separation of Concerns. ??Correctly link style rules to an HTML document using the industry-recommended method. ??Break down the anatomy of a CSS rule and identify syntax errors. ??Understand the "Box Model" to investigate why elements overlap or block interactions. ??Correlate CSS visibility properties with potential errors in E2E (End-to-End) tests. |
| :---- |

#### **1.1 What is CSS and why does it matter for QA?**

If in Session 1 we established that HTML represents the "bricks and structure" of the house, CSS (Cascading Style Sheets) represents the paint, wallpaper, furniture, and exact dimensions of the rooms. HTML defines *what* an element is (a button, a paragraph), while CSS defines *how it looks and where it is positioned* on the screen.

As a future QA Automation Engineer, you might ask yourself: *"Why do I need to learn web design if I'm going to write functional tests?"* The answer lies in the daily challenges of automation:

* **Locating Elements:** Playwright and Cypress natively use "CSS Selectors" to find elements on the page. Without mastering CSS, you won't know how to point the robot with surgical precision to where it needs to act.  
* **Visibility States:** Many bugs and failed tests occur because an element is present in the DOM (so the HTML is correct), but a CSS rule makes it invisible (display: none, visibility: hidden, or opacity: 0). Playwright, built to emulate a human, will refuse to click on a hidden element.  
* **Intercepting Clicks:** Another invisible element might be rendered *over* your button (e.g., a loading overlay). Knowing CSS helps you spot the "enemy" in DevTools.

#### **1.2 Methods of applying CSS (Separation of Concerns)**

There are three ways to style an HTML element, but the industry predominantly uses only one. It is important to recognize all of them during code inspection:

* **Inline CSS (Directly on the element):** Applied using the style attribute directly on the HTML tag. Hard to maintain and avoided in modern applications. \<button style="color: red;"\>Click\</button\>  
* **Internal CSS (In \<head\>):** Written between \<style\> tags inside the HTML document. Useful only for very simple pages.  
* **External CSS (External file \- Industry Standard):** Keeps the code clean. HTML stays in one file, design in another (e.g., style.css). This respects the *Separation of Concerns* principle.

For the external method (which we will use for the "Task Tracker" app), we make the connection using the \<link\> tag in the \<head\> section:

| \<head\>    \<title\>Task Tracker\</title\>    \<\!-- The critical link between structure and design \--\>    \<link rel="stylesheet" href="style.css"\>\</head\> |
| :---- |

&nbsp;

#### **1.3 Anatomy of a CSS rule**

CSS code consists of a list of rules. Each rule tells the browser how to draw one or more elements. Here is what a complete and correct rule looks like:

| button {    background-color: \#3498db;    color: white;    border-radius: 5px;}&nbsp; |
| :---- |

Let's break it down:

* **The Selector (button):** Indicates the target in the HTML document. (We're telling the browser: "Find absolutely all buttons on the page\!").  
* **The Declaration Block ({ ... }):** The curly braces enclose the package of visual rules that will apply to the target.  
* **The Property (background-color, color):** What specific feature we want to change (e.g., background color, text color).  
* **The Value (\#3498db, white):** How we want to set that property.  
* **Maximum attention:** Each declaration (property-value pair) is separated by a colon (:) and MUST end with a semicolon (;)\! Omitting that ; will break the next rule.

#### **1.4 The Box Model \- A Vital Concept for QA**

One of the most important secrets you need to know is that, to the browser, **ABSOLUTELY EVERY HTML ELEMENT IS A RECTANGULAR BOX**. Even if a button looks round (border-radius), its physical "footprint" on the screen is a rectangle.

This rectangle is defined by the **Box Model**, which has 4 layers (from inside out):

* **Content:** The heart of the box. The actual text or image.  
* **Padding:** The *inner* space between the text and the edge of the box. Makes the button look "fatter" and easier to click. If you click on the padding, you click on the button.  
* **Border:** The line that delineates the edge of the element. It can be invisible, solid, or dotted.  
* **Margin:** The *outer*, empty space between this element and neighboring elements. The margin pushes other elements away. **If a QA tries to click on the "Margin", the click passes right through it and hits the element behind it\!**

#### **1.5 Did you know...?**

| ?’¡ Did you know??Why is it called "Cascading"? If you write two CSS rules that conflict for the same element (e.g., above you write that the button is red, below you write it is green), the browser will apply the rule read last. Design "cascades" from top to bottom. The only exception is adding the \!important flag at the end of a rule, which forces the override of the cascade. The pointer-events: none; property is the invisible enemy of QA. Developers frequently use it to temporarily disable an element (a "disabled" effect). The button looks completely normal on the screen, but if you try to click on it (manually or via Playwright code), the click simply passes through it. Without CSS knowledge, you would report that Playwright is broken\! |
| :---- |

#### **1.6 Applied Story: "The Designer and the Comfort Zone"**

Think of a Painting you want to hang on a wall. The **HTML** is the canvas itself (Content). The **CSS Designer** comes in and says:

* "Put a white Passepartout, 5 centimeters wide, between the canvas and the frame" (This is the **Padding**).  
* "Put a thick oak wood frame on it" (This is the **Border**).  
* "Don't hang any other painting closer than 20 centimeters to this one. It needs space to breathe\!" (This is the **Margin**).

When you, as an Automation Tester, program the Playwright robot to click on the painting, the robot will click right in the middle of the Content. But if the Margin of another huge painting accidentally overlaps yours (due to poorly written CSS by developers), the robot will hit the transparent Margin of the other element and fail\! This is how 30% of failed E2E tests are born in real life.

#### **1.7 Practical Exercises**

**Exercise 1: Investigate CSS in DevTools**

* Open Google Chrome and go to www.wikipedia.org.  
* Right-click on the central search button (the one with a magnifying glass) and choose **Inspect**.  
* In the DevTools panel, under the "Elements" tab, you will see the **Styles** section.  
* **Mission 1:** Find the background-color (or color) property and change it from the color palette. Observe the live modification.

**Exercise 2: Explore the Box Model (Advanced Investigation)**

* Still in DevTools, next to the "Styles" tab, look for the **Computed** tab (or scroll to the end of the Styles panel if you are on a small screen).  
* You will see a diagram with some colored boxes inside each other (blue, green, yellow, orange). This is the Box Model rendered graphically by Chrome\!  
* **Mission 2:** Hover your mouse over the green rectangle (padding) and the orange one (margin). Notice how on the actual screen (on the site), Chrome will color the inner space of the element green and the outer space orange. How many pixels is the top padding of that button?

#### **1.8 Answers to Questions & Exercise Solutions**

**Solution Exercise 1 & 2:** If you followed the steps, you managed to visualize both the raw style rules and the **Box Model** calculated by the browser\! The **Computed** panel is a QA's top tool for resolving errors like *"Playwright is clicking on the wrong element"*. When you hover over margin/padding in that diagram, Chrome highlights directly on the page the "dead" zones or invisible spaces pushing elements into each other. You have taken a huge step towards professional debugging\!

#### **1.9 ?? Engineer Mindset in the AI Era: Your Place in the Market**

| ?›¡ï¸?QA vs. AI: Why knowing CSS makes you irreplaceable ??What AI does well (and how to use it): AI is an excellent syntax generator. You can ask it to "generate a CSS class for a round blue button" or "write the Playwright command to click the button". It will execute quickly: page.click('button').  The Trap (Where AI fails): AI is blind to the visual context. In production, that button might be covered by a transparent Margin of a neighboring element (as we learned in the Box Model section). When you run the AI-generated test, it will fail with an error like: "Element is intercepted". If you feed the error back to the AI, it will suggest superficial, "band-aid" solutions (e.g., use the { force: true } parameter), which force the click bypassing UI rules. By doing this, the AI just helped you hide a real bug that a human user would experience\! How an engineer thinks: An engineer knows that { force: true } is a dangerous compromise. They will open DevTools, look at the Computed panel, and investigate the layers of the box (Box Model). The engineer will draw an architectural conclusion: "The problem isn't the test; the problem is that the header has too much padding overlapping the content area". Why you will stay relevant in the market: In the AI era, your role evolves from "the one who writes code from scratch" to Orchestrator, Investigator, and Architect. Robots can write code, but they cannot visually debug applications and do not understand the intent behind the design. Your fundamental knowledge (how CSS and HTML actually work "under the hood") becomes your debugging superpower. You are the one guiding the AI, validating its results, and preventing "blind solutions" from being introduced into the system. |
| :---- |

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;

## **Chapter 2: Basic CSS Selectors \- The QA's Precision Tools** {#chapter-2:-basic-css-selectors---the-qa's-precision-tools}

&nbsp;

#### **Learning Objectives**

| ?? By the end of this chapter, you will be able to: ??Identify and write basic CSS selectors: Element, ID, Class. ??Understand selector specificity and why the ID is king. ??Write attribute-based selectors (e.g., data-testid), fundamental in E2E testing. ??Avoid the "traps" of dynamic classes generated by modern frameworks (React, Angular). |
| :---- |

#### **2.1 Basic Syntax: Element, ID, and Class**

Just as a postman needs an address to deliver a letter, CSS needs **Selectors** to know which element to apply rules to. Later, you will use *this exact same address* to tell Playwright where to click\!

There are three fundamental methods of selection:

**1\. The Element Selector (Type Selector): The Weakest (Generic)**

* **What it looks like:** Uses the HTML tag name directly.  
* **CSS Example:** button { background-color: blue; }  
* **In Playwright:** page.locator('button')  
* **The Problem:** It will target *absolutely all* buttons on the page. If you have a "Login" button and a "Cancel" button, this selector will hit both, and your test will fail because it's too ambiguous (error: strict mode violation).

**2\. The Class Selector: The Moderate (Group)**

* **What it looks like in HTML:** \<div class="product-card"\>...\</div\>  
* **CSS Syntax:** Always starts with a dot (.) followed by the class name.  
* **CSS Example:** .product-card { border: 1px solid black; }  
* **In Playwright:** page.locator('.product-card')  
* **How we use it:** A class can be applied to dozens of different elements. As a QA, you use the class selector when you want to count how many products are in a cart, not when you want to click on a *specific* product.

**3\. The ID Selector: The Powerful (Unique)**

* **What it looks like in HTML:** \<input id="email-field"\>  
* **CSS Syntax:** Always starts with a pound/hashtag (\#).  
* **CSS Example:** \#email-field { width: 100%; }  
* **In Playwright:** page.locator('\#email-field')  
* **Why it is preferred:** According to HTML rules, an ID must be unique across the entire page. If you tell the robot "Find \#email-field", it will have zero hesitation.

#### **2.2 Attribute Selectors: The "Holy Grail" of Automation**

In complex modern applications (built with React, Vue, or Angular), classes and IDs often change dynamically or automatically (e.g., a class might look like this: \<button class="btn\_v2\_xyz789"\>). If you write a test based on such a class, your test will fail tomorrow when the code becomes btn\_v2\_abc123.

How does a QA solve this instability problem? By using **Attribute Selectors**\!

* **What it looks like in HTML:** \<button data-testid="submit-login"\>Log In\</button\>  
* **CSS Syntax:** Written inside square brackets \[ \].  
* **CSS Example:** \[data-testid="submit-login"\] { color: white; }  
* **In Playwright:** page.locator('\[data-testid="submit-login"\]') or the special, fast command page.getByTestId('submit-login').

This method completely decouples design (classes/ids that change often) from testing logic\!

#### **2.3 Applied Story: "Package Delivery"**

Think of selectors as ways to find a person in an apartment building:

* **Element Selector (button):** "Look for a Human\!" (There are many humans in the building; you don't know who to leave the package with).  
* **Class Selector (.blond-haired-boy):** "Look for blond-haired boys\!" (You might find 3 on the same staircase; it's still unclear).  
* **ID Selector (\#ssn-1900101123456):** "Look for the human with this SSN" (Perfect, you found them, they are unique. But what if they changed their address and didn't tell you?).  
* **Attribute Selector (\[data-role="building-admin"\]):** "Give the package to whoever has the official building admin badge." (This is the ultimate QA approach. Even if they change their haircut (class) or ID card (ID), the badge remains stable\!).

#### **2.4 Practical Exercises**

**Exercise 1: Selector Hunt (DevTools)**

* Go to google.com (or any search engine you prefer).  
* Inspect the "Google Search" button (or equivalent).  
* In the HTML (Elements) panel, look closely at the \<input\> or \<button\> tag.  
* **Mission 1:** What is a CSS class applied to this button? What ID does it have (if any)? Does it have any special attribute, like data-ved or aria-label?

**Exercise 2: Write your own Attribute Selector**

In the "Task Tracker" app, the developer added the following code: \<div id="container-99" class="wrapper-blue" data-test="user-profile-card"\>John Doe\</div\>

How would you write a valid CSS selector (using square brackets) that ties strictly to the test attribute, ignoring the ID and class? Write it down.

#### **2.5 Answers to Questions & Exercise Solutions**

**Solution Exercise 2:** The correct CSS selector (the safest one for your future automated test) is: \[data-test="user-profile-card"\]

Bravo\! If you know how to write this, you know how to write the core of 80% of Playwright actions.

#### **2.6 ?? Engineer Mindset in the AI Era: Your Place in the Market** {#2.6-??-engineer-mindset-in-the-ai-era:-your-place-in-the-market}

| ?›¡ï¸?QA vs. AI: The Code Generator Trap ??What AI does well (and how to use it): Tools like GitHub Copilot or the recording feature (Codegen) in Playwright are brilliant at rapidly generating dozens of lines of test code. You press "Record", click a login button, and the AI generates: page.locator('.bg-blue-500.hover:bg-blue-700.text-white.font-bold').click(). It worked fast\! The Trap (Where AI fails): AI (or a generator) is often lazy or blind to intent. The selector above, based on utility classes (e.g., Tailwind CSS), is a "brittle selector". If tomorrow the designer decides the login button should be a slightly lighter color (bg-blue-400), your test will fail catastrophically, even though the business logic is intact. A company cannot afford to fix 500 tests just because a shade of blue changed. How an engineer thinks: The QA engineer knows that tests must be independent of design. They will delete the brittle AI-generated code and ask developers: "We need a data-testid="login-button" here". Then they will rewrite the line themselves: page.getByTestId('login-button').click(). Why you will stay relevant in the market: AI can write code quickly, but you are the Architect of Stability. Your role is not just to create scripts, but to build a robust testing system, immune to minor visual changes. Your value lies in strategic decisions (what selectors we use at a team level), not in simple text generation. |
| :---- |

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;

## **Chapter 3: Advanced CSS Selectors & Pseudo-classes \- Complex DOM Navigation** {#chapter-3:-advanced-css-selectors-&-pseudo-classes---complex-dom-navigation}

&nbsp;

#### **Learning Objectives**

|  ?? By the end of this chapter, you will be able to: ??Use relational selectors (Child, Descendant, Sibling) to navigate complex HTML structures. ??Understand and apply state pseudo-classes (e.g., :hover, :disabled) to test user interactions. ??Utilize structural pseudo-classes (e.g., :nth-child) to find specific elements in lists or tables, essential when IDs are missing. ??Correctly chain multiple selectors to achieve maximum precision in targeting elements (Chaining). |
| :---- |

#### **3.1 Tree Navigation: Relational Selectors (Combinators)**

So far, we've targeted elements directly, as if we had their exact address (ID or Class). But what do you do when you have a list of 10 products, all with the exact same .product class, with no ID, and you want to click only on the product in the "Recommendations" section?

This is where **Combinators** come in. They allow us to describe the path through the DOM (the Parent-Child-Sibling hierarchy learned in Session 1).

**1\. The Descendant Selector (Empty Space): "Deep Search"**

* **Syntax:** ElementA ElementB (separated by a space).  
* **How it works:** Finds all ElementBs that are located *anywhere inside* ElementA (whether they are direct children, grandchildren, or great-grandchildren).  
* **Example:** \#menu a { ... } \- Will find all links (\<a\>) inside the element with the menu ID, ignoring links in the page footer.

**2\. The Direct Child Selector (\>): "Strict Search"**

* **Syntax:** ElementA \> ElementB.  
* **How it works:** Finds ElementB ONLY if it is the immediate, 1st-degree child of ElementA. Ignores grandchildren.  
* **HTML Example:**

| \<ul class="main-list"\>    \<li\>Item 1\</li\>    \<li\>        \<ul class="sublist"\>            \<li\>Sub-Item 1\</li\> \<\!-- This is a grandchild to .main-list \--\>        \</ul\>    \</li\>\</ul\> |
| :---- |

* **CSS Example:** .main-list \> li { ... } \- Will only select "Item 1" and the \<li\> element containing the sublist. It will NOT select "Sub-Item 1", because that is not a direct child of the .main-list class.

**3\. Chaining: "No Space\!"**

* **Syntax:** ElementA.ClassB\#IdC (with absolutely no space between them).  
* **How it works:** Combines conditions *on the same element*. "Find a button THAT HAS BOTH the alert class AND the data-test attribute".  
* **Example:** button.btn-danger\[data-status="error"\] \- Extremely useful in automation for filtering elements with surgical precision.

#### **3.2 State Pseudo-classes: Testing Dynamism**

Web pages aren't pictures; they react to the user. A button looks one way when the page loads, another when you hover over it, and another when it's disabled. CSS handles these states through **Pseudo-classes** (recognized by the colon : sign at the beginning).

* **:hover**: When the mouse cursor is over the element.  
  * *QA Focus:* We often check if a hidden menu becomes visible only on :hover. (In Playwright we will use the page.locator(...).hover() command).  
* **:focus**: When the element (usually an \<input\>) is active, having been selected with the Tab key or clicked into to type.  
* **:disabled**: Finds form elements that are blocked (e.g., the "Submit" button before checking "I agree to terms").  
  * *Playwright Example:* expect(page.locator('button\[type="submit"\]')).toBeDisabled(); (This assertion relies directly on the DOM state reflected by the :disabled pseudo-class).  
* **:checked**: Finds checkboxes or radio buttons that are ticked.

#### **3.3 Structural Pseudo-classes: Finding the "Needle in the Haystack"**

This is the QA's "combat" technique. You are facing a table with 50 rows. They are all identical. The developer went on vacation and forgot to put data-testid attributes on them. How do you click on the 3rd row?

* **:first-child / :last-child**: Selects the first or last element from a group of siblings.  
  * *Example:* ul.menu \> li:last-child (Always targets the last link in the menu, regardless of how many the programmer adds in the future).  
* **:nth-child(n)**: Here is the magic\! You can specify an exact number (index).  
  * *Example:* tr:nth-child(3) (Finds the 3rd row in a table).  
  * *Advanced Trick:* You can use odd or even to target alternating rows. tr:nth-child(even) { background-color: grey; }.

#### **3.4 Applied Story: "The Full Address"**

Imagine you have to deliver a package in a skyscraper.

* **Simple Selector (.door):** You look for any door in the building. Mission impossible.  
* **Descendant Selector (\#floor-5 .door):** "Go to the 5th floor, search through all offices, closets, and technical rooms, and find anything labeled 'door'." (Still a large search area).  
* **Direct Child Selector (\#main-hallway \> .door):** "Go to the main hallway and enter ONLY the first door you see attached to this hallway. Don't go deeper into rooms\!". (Maximum efficiency).  
* **Structural Pseudo-class (\#main-hallway \> .door:nth-child(3)):** "Go to the main hallway, count the doors, open the 3rd one". This is what a QA does when they have no IDs\!  
* **Chaining (\#main-hallway \> .door.red:disabled):** "The 3rd door was broken? Fine. Go to the main hallway, find the door that is red AND has a padlock on it (disabled)".

#### **3.5 Practical Exercises**

**Exercise 1: The Problematic Table**

Open our "Task Tracker" app from Session 1 (index.html file in the browser). You have a "Task History" table there. Imagine the table has 5 \<tr\> rows and you want to write a CSS selector that targets *strictly* the second row in the table (the one with id \#1002 if you added it in the previous exercise). How would you write this selector using the descendant selector and the :nth-child pseudo-class? Write it on a piece of paper\!

**Exercise 2: DevTools Navigation (Investigation)**

* Go to www.wikipedia.org.  
* Inspect the list of languages (the one around the central globe).  
* In the Elements panel, press Ctrl+F (or Cmd+F on Mac). A search bar will appear at the bottom of the HTML code. Here you can write CSS selectors to see if you find elements\!  
* **Your Mission:** Write the selector div.central-featured-lang \> strong in that search bar. How many results do you get? What happened if you replace the \> sign with a simple space (descendant selector)?

#### **3.6 Answers to Questions & Exercise Solutions**

**Solution Exercise 1:** The safest and most precise selector for the second row in the table body would be: \#history-table tbody tr:nth-child(2)

We combined the table ID (to isolate the search only to that table area), the tbody descendant (to avoid the thead header), and tr:nth-child(2) for the desired row. This is the level of precision expected from a QA Automation engineer\!

#### **3.7 ?? Engineer Mindset in the AI Era: Your Place in the Market** {#3.7-??-engineer-mindset-in-the-ai-era:-your-place-in-the-market}

| ?›¡ï¸?QA vs. AI: Navigating Complex Hierarchies (DOM Traversal) ??What AI does well (and how to use it): If you give AI an HTML structure with a table and ask it: "I want a Playwright selector that gives me the text from column 3, row 5", tools like ChatGPT or Copilot will generate almost instantly a long CSS or XPath string, sometimes perfectly functional in the moment, for example: page.locator('div \> table \> tbody \> tr:nth-child(5) \> td:nth-child(3)').textContent(). It's an excellent assistant for a quick memory shortcut. The Trap (Where AI fails): AI is mostly fixated on the current structure it "sees". The selector generated above (div \> table \> ...) is extremely fragile. Such a blindly chained selector is a ticking time bomb. If tomorrow the developer adds a small design div container (\<div class="wrapper"\>) right before the table, the parent-child structure changes. The AI-created test will fail in production with "Timeout \- Element not found". How an engineer thinks: A QA Automation Engineer thinks in terms of "resilience". They look at the AI's selector and say: "I won't rely on 5 levels of parents and children, it's too dangerous." They will narrow the search using an anchor element (a nearby ID) and only then use a descendant selector. They will optimize the AI's suggestion into: page.locator('\#date-table-id tr:nth-child(5) td:nth-child(3)').textContent(). They eliminated useless steps, and the test became resistant to the addition of new design divs (because the empty space allows searching at any depth). Why you will stay relevant in the market: While LLMs are good at generating "first impulse responses" based on statistical syntax models, they cannot evaluate the risk of future changes to the company's codebase. As an engineer, you are not hired to write syntax (AI does that), you are hired to predict what will break and build tests that survive code refactors. Maintenance represents 80% of automation costs; your value is reducing this cost through smart architectural decisions. |
| :---- |

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;

## **Chapter 4: Modern Layout (Basic Flexbox) & Session 2 Assignment** {#chapter-4:-modern-layout-(basic-flexbox)-&-session-2-assignment}

&nbsp;

#### **Learning Objectives**

| ?? By the end of this chapter, you will be able to: ??Understand the Flexbox concept and the Parent-Child (Container-Items) relationship visually. ??Correlate flexible element behavior with running E2E tests on different resolutions (Mobile vs. Desktop). ??Use the flex badge in DevTools to debug element overlaps. ??Complete Session 2 Assignment, applying classes, IDs, and flexible structures, ready for platform validation. |
| :---- |

#### **4.1 Why should a QA understand Flexbox?**

In the past, arranging elements on a page (layout) was a nightmare: hidden tables or complicated math calculations with pixels were used. Today, 99% of modern applications use **Flexbox** (Flexible Box Layout) or CSS Grid.

As a QA Automation Engineer, you will encounter Flexbox in a classic scenario: **Multi-resolution testing (Responsiveness)**.

Playwright allows running the exact same test on a desktop resolution (e.g., 1920x1080) and on an iPhone resolution (e.g., 375x667). When the screen shrinks, a *Flexbox* container will move buttons, hide them in a "hamburger menu", or stack them on top of each other. If you don't understand how this elastic behavior works, you won't know why your test passes on desktop but crashes on mobile with the error *"Element is not visible"*.

#### **4.2 Flexbox: Basic Concepts (The shortest explanation)**

The Flexbox system relies strictly on the Parent-Child relationship learned in Chapter 3\.

**1\. The Flex Container (The Parent):**

To activate the magic, we must add the display: flex; property on the parent element.

| .nav-menu {    display: flex;} |
| :---- |

&nbsp;

From that moment on, all direct children of this menu become "Flex Items" and will implicitly sit on a single row (like beads on a string).

**2\. Main axis alignment (justify-content):**

This property controls how elements are distributed along the row:

* flex-start: All elements gather to the left.  
* center: All elements stay in the middle.  
* space-between: The first element sticks to the left, the last to the right, and the rest have equal space between them (extremely used for navigation bars: Logo on the left, Login Button on the right).

**3\. Moving to a new row (flex-wrap):**

If you have 10 buttons on a small phone screen, they will overflow off the screen. The flex-wrap: wrap; property allows them to fall onto the next row when they run out of space, preventing visual clipping (and saving your automated tests\!).

#### **4.3 Applied Story: "The Supermarket Shelf"**

Imagine a long shelf in a supermarket (This is the **Parent / Flex Container**).

On the shelf, you put 5 cereal boxes (These are the **Children / Flex Items**).

* If the store manager says: *"Push all boxes to the left"* \-\> That's what justify-content: flex-start; does.  
* If the manager says: *"Put one box at one end, one at the other, and leave equal space between the rest"* \-\> That's what justify-content: space-between; does.  
* If a customer comes and pushes the shelf making it shorter (Simulating viewing on a phone), the boxes would be crushed. But if the manager put the rule flex-wrap: wrap;, the box that no longer fits on the shelf automatically "falls" to the shelf below, staying in plain sight. This is exactly what a good UI does to prevent visual bugs\!

#### **4.4 Practical Exercises**

**Exercise 1: The Flex Badge in DevTools**

Chrome DevTools has a brilliant graphic tool for Flexbox, hidden in plain sight.

* Open Google Chrome and go to www.github.com.  
* Right-click on the top menu (navigation bar with logo, search, sign in) and hit **Inspect**.  
* In the Elements panel, look for HTML tags (\<header\>, \<div\>, \<nav\>). Next to some of them, you will see a small gray button (badge) that says flex.  
* **Your Mission:** Click on that flex badge. What happens on the screen?

#### **4.5 Answers to Questions & Exercise Solutions**

**Solution Exercise 1:**

When you click on the flex badge in DevTools, Chrome will "draw" on the screen (via a hatched grid) the exact invisible structure of the flexible container. It will show you the empty spaces (space-between) and the exact margins of the children. This is the fastest visual way to check why a button isn't sitting where it should or why it's covering another element\!

#### **4.6 Homework (Session 2 Project)**

**Your Task (The Business Task):**

You must transform the simple HTML skeleton of the "Task Tracker" from Session 1 into a structured application, prepared both visually (with a basic flexible layout) and technically (with classes, ids, and data-testids) for our first interaction with Playwright.

**Technical Requirements (Acceptance Criteria for platform validation):**

* **External CSS File:** Your HTML document must have a \<link\> to an external CSS file (even if currently you only submit the HTML to the platform, the link tag must exist for architecture, having href="style.css").  
* **Flexible Menu (Navbar):**  
  * In \<header\>, add a \<nav\> that has the class navbar.  
  * Inside this \<nav\>, there must be an element with the id logo and a login button having the attribute data-testid="btn-login".  
* **Structural Selector (The Table):**  
  * You have the task history table. Ensure that the 3rd row in \<tbody\> (meaning the \<tr\> element) contains a "Delete" button having the class delete-row. (This will prove you can use the :nth-child(3) pseudo-class later in Playwright).  
* **Dynamic State Button:**  
  * In the add task form, add a "Submit" \<button\> and natively apply the HTML attribute disabled to it (meaning the button should be disabled by default, simulating an empty form). It must have data-testid="submit-task-btn".

&nbsp;

#### **4.7 ?? Engineer Mindset in the AI Era: Your Place in the Market** {#4.7-??-engineer-mindset-in-the-ai-era:-your-place-in-the-market}

| ?›¡ï¸?QA vs. AI: Debugging Layout Anomalies (Responsiveness) ?? What AI does well (and how to use it): If you ask an AI (Claude, ChatGPT): "Write me Flexbox CSS code for a navigation menu that puts the logo on the left and the menu on the right", it will generate perfectly valid code in 2 seconds with display: flex; justify-content: space-between;. It's a great assistant for writing CSS boilerplate. The Trap (Where AI fails): When you run the Playwright test suite on CI/CD (GitHub Actions), one of the tests might run in a narrow viewport (iPad Mini simulation). The AI wrote the menu, but forgot to test what happens when the text is too long: the Flexbox elements will squash into each other, and your "Login" button will be covered by another layer. The test will suddenly fail. If you give the error to the AI, it might suggest a more complicated selector or using { force: true }, bypassing the real problem entirely. How an engineer thinks: A QA Automation Engineer doesn't sweep dirt under the rug. They run the test in UI mode or use Playwright Trace Viewer, observe the shrunken screen, and figure out the Flexbox behavior. The engineer opens a frontend bug: "On resolutions below 768px, the Flex container in the header doesn't wrap, causing the Login button to be intercepted by the Logo area". Why you will stay relevant in the market: AI analyzes static code, but applications are dynamic and fluid environments. You are not paid to memorize Flexbox syntax; you are paid to understand how the physics behind web layout impacts user actions (and, implicitly, your scripts). Your ability to link a failed E2E test to erroneous CSS Flexbox behavior makes you a true engineer, capable of investigating, not just a simple script runner. |
| :---- |

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;

## **Chapter 5: Bonus & Extra Practice \- Advanced Level (For Future Seniors)** {#chapter-5:-bonus-&-extra-practice---advanced-level-(for-future-seniors)}

**This chapter is 100% optional**. If you understood the basic concepts in chapters 1-4, you are already prepared for Playwright. But if you are the kind of engineer who likes to take things apart to see how they work and you want to be ready for the toughest technical interviews, you've come to the right place\!

Here we no longer work in ideal environments (where developers nicely put data-testid everywhere). Here we work in the "Wild West" of legacy code.

#### **5.1 Challenge 1: The Dynamic Classes Nightmare (Tailwind CSS)**

**Scenario:**

You are hired at a startup that uses a modern CSS framework (like Tailwind or Styled Components). The HTML classes look like alphabet soup and change with every code release. You are not allowed to modify the source code to add an ID.

You have the following HTML code for a shopping cart:

| \<div class="flex-col w-full px-4 py-2 mt-8 wrapper-xyz"\>    \<div class="item-row flex justify-between border-b pb-2"\>        \<span class="text-sm font-bold"\>Premium Subscription\</span\>        \<button class="bg-red-500 hover:bg-red-700 text-white rounded px-2" aria-label="Delete Subscription"\>X\</button\>    \</div\>    \<div class="item-row flex justify-between border-b pb-2 mt-4"\>        \<span class="text-sm font-bold"\>Processing Fee\</span\>        \<button class="bg-gray-300 text-gray-500 rounded px-2" disabled\>X\</button\>    \</div\>        \<div class="checkout-area mt-10"\>        \<button class="btn-primary flex items-center justify-center w-full py-4 rounded-lg bg-green-500 text-white font-bold" aria-label="Checkout"\>            \<span\>Proceed to Payment\</span\>            \<svg class="icon-arrow"\>...\</svg\>        \</button\>    \</div\>\</div\> |
| :---- |

&nbsp;

**Mission 1.A:** Write an ultra-robust CSS selector that finds the "Proceed to Payment" button. You are NOT allowed to use *any CSS class* (.btn-primary, .bg-green-500 etc.) because they might change tomorrow.

**Mission 1.B:** Write a single CSS selector that targets *only* the delete buttons ("X") that are **active** (meaning you ignore the disabled one from "Processing Fee"). Hint: Use the negation pseudo-class :not().

#### **5.2 Challenge 2: The Invisible Enemy (Z-Index & Overlays)**

**Scenario:**

You run the Playwright test that clicks the "Save" button. The test fails with the error:

| Error: locator.click: Target closed. Element \<button id="save-btn"\>Save\</button\> is intercepted by \<div class="loading-overlay"\>\</div\>. |
| :---- |

You go to the browser to check manually. The "Save" button is perfectly visible on the screen. You click it and it works. You are confused. Why does the robot say it's intercepted if it works for you?

**Mission 2:**

You open the code and notice this:

| \<button id="save-btn"\>Save Data\</button\>\<div class="loading-overlay"\>\</div\>&nbsp; |
| :---- |

And the following CSS written by a Junior colleague:

| .loading-overlay {    position: absolute;    top: 0;    left: 0;    width: 100vw;    height: 100vh;    opacity: 0; /\* They made the overlay invisible\! \*/    z-index: 9999;} |
| :---- |

&nbsp;

How do you explain to the developer why your test failed (what did they do wrong regarding the Box Model / Visibility)? And what magic **CSS property** should they add to .loading-overlay so your "click" actually passes through that transparent overlay and hits the button?

#### **5.3 ??ï¸?Solution Keys (Answers & Explanations)** {#5.3-??ï¸?solution-keys-(answers-&-explanations)}

Don't cheat\! Read this only after trying to solve the challenges yourself.

**Solution Challenge 1 (The Classes Nightmare):**

* **1.A (Proceed to Payment Button):** When classes are volatile, we rely on accessibility attributes (aria-\*). These are stable because they are used by screen readers for the visually impaired.  
  **Correct selector:**&nbsp;

| button\[aria-label="Checkout"\] |
| :---- |

*Explanation:* This selector is immune to redesigns. No matter how much the Tailwind classes change, the button's function remains the same.

* **1.B (Negation):** We combine the accessibility attribute with the :not() pseudo-class.  
  **Correct selector:**&nbsp;

| button\[aria-label="Delete Subscription"\]:not(:disabled) |
| :---- |

*Explanation:* We tell the robot "Find the buttons that have the delete label, BUT exclude the ones that have the :disabled state". This is a Senior-level selector\!

**Solution Challenge 2 (The Invisible Enemy):**

* **Explanation for the Developer:** "Hi\! You set opacity: 0 on the overlay. This makes it 100% transparent to the human eye, but **physically, its box (Box Model) is still drawn on the screen** above all elements (because it has z-index: 9999). When I (or Playwright) click, we are actually hitting this transparent div, not the button underneath. The fact that it worked manually was a coincidence (probably the overlay disappeared from the DOM right after you finished moving your mouse)."  
* **The CSS Solution:** The magic property that solves this is pointer-events: none;.  
  If the developer adds pointer-events: none; to .loading-overlay, the browser will know to completely ignore that layer for any mouse interaction, allowing the click to "fall" directly onto the \#save-btn underneath\!

| ??Congratulations\! If you understood these two concepts (aria-labels and pointer-events), you have already overcome 80% of the problems automation testers face in their first 6 months of their career\! |
| :---- |

&nbsp;

&nbsp;