---
title: "Knowing How to Write the Test No Longer Matters. Seeing Why the Agent's Test Checks Nothing Does."
description: "When an AI agent can write a Playwright test in 30 seconds, the QA technical interview can't keep measuring syntax. Written from an interviewer's point of view, this article covers which questions have gone, which exercises replaced them, and how candidates and hiring teams can prepare."
ogImage: "/images/articles/qa-interview-ai-agents-og.jpg"
---

# 🎯 Knowing How to Write the Test No Longer Matters. Seeing Why the Agent's Test Checks Nothing Does.

*How the QA Automation technical interview is changing now that AI agents write code, from an interviewer's point of view.*

*Published by QualiAdept Mentorship Team • November 21, 2026 • ⏱️ 7 min read*

![QA Automation Technical Interview in the Age of AI Agents](/images/articles/qa-interview-ai-agents-hero.jpg)
<span class="image-caption">Fig. 1 — The agent writes the test in 30 seconds, but the QA engineer must see why a passing test might check nothing at all</span>

---

## A Moment from a Recent Interview

A moment from a recent interview, kept generic and anonymized:

The candidate gets a classic exercise: an end-to-end test for adding a product to the cart. Within minutes they have a clean, well-structured Playwright test that passes on the first run. It looks good.

I ask: **"What exactly does this test check?"**

A long pause. Then: *"That the product gets added to the cart."*

**"If there were a bug and the product didn't get added, would the test fail?"**

Another pause. The candidate rereads the code and realizes it wouldn't. The test only checks that an element is on the page, and that element is there anyway.

The test wasn't the real problem. **The problem was that the person in front of me didn't know what they were putting their name on.**

Moments like that convinced me we have to change how we evaluate QA Automation candidates. If an agent writes the test in 30 seconds, the fact that the candidate can also write it doesn't tell me much.

---

## 📊 Why the Interview Is Changing Now

This isn't just my impression. Several large companies have already officially changed their interview format.

In June 2025, Canva announced that it expects backend, frontend and machine learning candidates to use AI tools such as Copilot, Cursor or Claude during technical interviews ([*Yes, You Can Use AI in Our Interviews. In fact, we insist*](https://canva.dev/blog/engineering/yes-you-can-use-ai-in-our-interviews/)). Their interviewers say the strongest candidates use AI strategically while staying in charge of the technical decisions ([*AI Interview Success: An Interviewer's Inside Guide*](https://canva.dev/blog/engineering/ai-interview-success/)). Meanwhile, more and more companies have added coding rounds where working with an AI assistant is part of the test. The format varies a lot from one company to another ([*Ten companies now put an AI in the coding interview*](https://maxnyriev.substack.com/p/ten-companies-now-put-an-ai-in-the)), and many still work on the rule "assume AI isn't allowed unless you're told otherwise" ([*AI-Assisted Coding Interviews: What to Expect*](https://www.greatfrontend.com/blog/ai-assisted-coding-interviews-for-frontend-developers)).

There's also a paradox that hits us in QA directly. According to the [Stack Overflow Developer Survey 2025](https://survey.stackoverflow.co/2025/ai):

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 16px; margin: 24px 0;">
  <div style="background: rgba(99, 102, 241, 0.1); border: 1px solid rgba(99, 102, 241, 0.35); border-radius: 14px; padding: 18px;">
    <div style="font-size: 2rem; font-weight: 800; color: #38bdf8; line-height: 1.1;">84%</div>
    <div style="font-weight: 700; margin-top: 6px;">use or plan to use AI</div>
    <div style="font-size: 0.85rem; opacity: 0.8; margin-top: 4px;">Of developers already use or plan to use AI tools in development (Stack Overflow 2025).</div>
  </div>
  <div style="background: rgba(168, 85, 247, 0.1); border: 1px solid rgba(168, 85, 247, 0.35); border-radius: 14px; padding: 18px;">
    <div style="font-size: 2rem; font-weight: 800; color: #c084fc; line-height: 1.1;">Only 29%</div>
    <div style="font-weight: 700; margin-top: 6px;">trust AI output accuracy</div>
    <div style="font-size: 0.85rem; opacity: 0.8; margin-top: 4px;">Down from <strong>40%</strong> the year before (<a href="https://try.stackoverflow.co/internal/resources/2025-stack-overflow-developer-survey-for-leaders/ai-adoption" target="_blank">Stack Overflow</a>).</div>
  </div>
  <div style="background: rgba(244, 63, 94, 0.1); border: 1px solid rgba(244, 63, 94, 0.35); border-radius: 14px; padding: 18px;">
    <div style="font-size: 2rem; font-weight: 800; color: #fb7185; line-height: 1.1;">46% vs. 33%</div>
    <div style="font-weight: 700; margin-top: 6px;">active distrust</div>
    <div style="font-size: 0.85rem; opacity: 0.8; margin-top: 4px;">More developers actively distrust the accuracy of AI tools (46%) than trust it (33%).</div>
  </div>
</div>

For a QA engineer, the gap between how much AI gets used and how much you can rely on it isn't an abstract discussion. **It is exactly what our job is about.**

---

## ❌ What I No Longer Ask (or Ask Much Less Often)

I've mostly dropped the questions that test memory:

- "What's the difference between `@BeforeMethod` and `@BeforeClass` in TestNG?"
- "Write me an XPath for the third element in a list."
- "Write a login test from scratch."

I'm not saying fundamentals don't matter. They do, and I'll come back to that below. But these questions no longer tell candidates apart. An agent answers all of them correctly, so a candidate who recites the answers shows me nothing a tool couldn't.

---

## ✅ What I Ask Now: 4 Types of Exercises

### 1. Reviewing an AI-Generated Test

This is my favorite exercise. The candidate gets a passing test and has to tell me what's wrong with it. For example:

```typescript
test('user can add product to cart', async ({ page }) => {
  await page.goto('https://shop.example.com/products/42');
  await page.click('text=Add to cart');
  await page.waitForTimeout(3000);

  const cartIcon = page.locator('.cart-icon');
  await expect(cartIcon).toBeVisible();
});
```

It looks fine and it passes. A good candidate finds at least three problems within a few minutes:

- **The assertion checks nothing relevant.** The cart icon is visible either way, with or without a product. The test should check the number of items in the cart or what's in it.
- **`waitForTimeout(3000)` is a clear flakiness signal.** Playwright has auto-waiting and web-first assertions. Fixed pauses make a test either slow or unstable.
- **The test data is hardcoded**, and the starting state isn't controlled. What happens if product `42` goes out of stock, or the cart wasn't empty to begin with?

A better version looks like this:

```typescript
await page.getByRole('button', { name: 'Add to cart' }).click();
await expect(page.getByTestId('cart-count')).toHaveText('1');
```

> [!IMPORTANT]
> One thing matters most, and it separates strong candidates from the rest right away: **a test you've never seen fail isn't a test yet.** The best candidates ask themselves, without being prompted: *"How would I make this test fail on purpose, to see that it catches the bug?"*

---

### 2. Strategy Before Code

*"You have a `POST /orders` endpoint. Don't write anything. Tell me what you'd test, in what order, and what you'd deliberately leave untested."*

The agent can generate 40 tests for that endpoint. What it doesn't tell you is which 5 actually matter: idempotency on retry, amount validation, authorization on another user's orders, behavior at zero stock. Prioritizing by risk is still a human skill, at least for now.

---

### 3. How You Steer the Agent

When the interview format allows AI, I watch *how* the candidate uses it, not just the result:

- Do they give it context: the stack, the project's conventions, what the test needs to verify? Or do they just type *"write a test for checkout"*?
- Do they break the problem into small steps and check each one?
- Do they know when to stop and write three lines themselves instead of trying five more prompts?
- Do they run the generated code before saying it's done?

That's roughly what other teams running AI-assisted interviews see as well: plan first, prompt in small steps, test often and explain what you're doing as you go ([*AI-Enabled Coding Interviews 2026*](https://techscreen.app/articles/ai-enabled-coding-interview-guide-2026)).

---

### 4. Ownership

I almost always finish with questions about code that, technically, the candidate didn't write:

- "Walk me through this line."
- "What happens if the API returns `200` but the body is empty?"
- "Why did you accept this suggestion and not the other one?"

The message for the candidate is simple: **if the test is in your PR, it's your test.** Nobody will accept *"the agent wrote it"* in a code review.

---

## 🚦 Red Flags and Green Flags

**🔴 Red flags:**

- accepts the agent's first output without reading it carefully;
- says the test is done without having run it;
- can't explain a line of the code they're presenting;
- confuses "the test is green" with "the feature works";
- freezes completely when the agent gets something wrong.

**🟢 Green flags:**

- questions the assertions before anything else;
- makes the test fail on purpose to validate it;
- explains their reasoning out loud;
- pushes back on an agent suggestion with clear reasons;
- falls back on fundamentals (HTTP, the DOM, synchronization, test design) when something doesn't work.

---

## 🎓 For Candidates: How to Prepare

1. **Practice reviewing, not just writing.** Have an agent generate 10 tests for a demo app and look for the problems in each one. It's the best training I can recommend right now.
2. **Learn to explain your decisions out loud.** *"I rejected this suggestion because it uses a fragile CSS selector"* is worth more than perfect code you can't explain.
3. **Don't let your fundamentals get rusty.** To evaluate an agent's output, you need to understand what it's actually doing better than it does. Without a grasp of HTTP, async or test design, you can't review anything.
4. **Find out the interview rules in advance.** Ask the recruiter whether AI is allowed, which tools, and in which round. If nobody tells you, assume it isn't.
5. **Make a habit of asking "how would this test fail?"** Say the question out loud in the interview so the interviewer can see how you think.

---

## 👥 For Interviewers and Hiring Teams

- **Replace some of the code-writing exercises with review exercises.** An AI-generated test with 3–4 hidden problems tells you more in 15 minutes than an hour of live coding.
- **Set clear criteria.** You're evaluating reasoning, prioritization and ownership, not how well the candidate knows a particular tool.
- **Announce the rules upfront.** Candidates need to know whether they can use AI. Otherwise you're testing how well they guess the format, not what they know.
- **Don't turn the interview into a tooling quiz.** Copilot, Cursor and Playwright Agents change from month to month. Critical thinking about what makes a good test stays valuable for a long time.

---

## 📌 Key Takeaways

- Knowing the syntax no longer sets a candidate apart, because every agent knows it.
- The most useful interview signal is how well the candidate reviews a generated test: assertions, flakiness, test data.
- **A test you've never seen fail isn't a test yet.**
- Strategy, risk-based prioritization and ownership are now at the center of the interview.
- Fundamentals matter more than before, because without them you can't evaluate the agent's work.

---

## Conclusion

**The agent writes the test, but the QA engineer is accountable for it.** That is the whole shift. The QA Automation technical interview is measuring less and less how fast you can produce code, and more and more how well you can judge and verify code you didn't write.

What have you changed in your interviews, as an interviewer or as a candidate? Or are you still being asked to write XPaths by hand? 👇

---

### Sources

1. [Canva Engineering — "Yes, You Can Use AI in Our Interviews. In fact, we insist"](https://canva.dev/blog/engineering/yes-you-can-use-ai-in-our-interviews/)
2. [Canva Engineering — "AI Interview Success: An Interviewer's Inside Guide"](https://canva.dev/blog/engineering/ai-interview-success/)
3. [Ten companies now put an AI in the coding interview](https://maxnyriev.substack.com/p/ten-companies-now-put-an-ai-in-the)
4. [GreatFrontEnd — "AI-Assisted Coding Interviews: What to Expect"](https://www.greatfrontend.com/blog/ai-assisted-coding-interviews-for-frontend-developers)
5. [TechScreen — "AI-Enabled Coding Interviews 2026"](https://techscreen.app/articles/ai-enabled-coding-interview-guide-2026)
6. [Stack Overflow Developer Survey 2025, AI section](https://survey.stackoverflow.co/2025/ai)
7. [Stack Overflow — "AI adoption is accelerating, but trust is declining"](https://try.stackoverflow.co/internal/resources/2025-stack-overflow-developer-survey-for-leaders/ai-adoption)

<ArticleInteractions />
