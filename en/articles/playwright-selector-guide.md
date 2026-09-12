---
title: Complete Guide - Writing Resilient Selectors in Playwright
description: Learn how to write UI refactor-proof locators in Playwright and avoid fragile selectors.
---

# 🎯 Complete Guide: Writing Resilient Selectors in Playwright

*Published by QualiAdept Mentorship Team • September 12, 2026 • ⏱️ 6 min read*

---

One of the greatest challenges in E2E test automation is **test flakiness caused by fragile selectors**. A minor CSS change or DOM refactoring can easily break dozens of tests if your locator strategy is flawed.

In this guide, we will explore Playwright's recommended locator hierarchy to build resilient, maintainable test suites.

---

## 1. Playwright's Golden Locator Hierarchy

Playwright strongly recommends locating elements from the perspective of an end user (accessible roles, visible text, labels).

### 🥇 Tier 1: User-Facing Accessible Locators (Recommended)

These are the most resilient because they mirror how users and assistive technologies interact with your application.

```typescript
// ✅ High resilience: searches by ARIA role and accessible text
await page.getByRole('button', { name: 'Save Changes' }).click();

// ✅ Search by form field label
await page.getByLabel('Email address').fill('student@qualiadept.ro');

// ✅ Search by placeholder text
await page.getByPlaceholder('Enter your password').fill('Secret123!');
```

### 🥈 Tier 2: Explicit Test Locators (`data-testid`)

When an element lacks a unique accessible name or role (such as an icon-only button or dynamic table cell), use explicit test IDs.

```html
<!-- Inside HTML template -->
<button data-testid="user-profile-avatar" class="rounded-full p-2">
  <img src="/avatar.png" alt="Avatar" />
</button>
```

```typescript
// Inside Playwright test
await page.getByTestId('user-profile-avatar').click();
```

### 🥉 Tier 3: Text & Content Locators

```typescript
await page.getByText('Login successful').toBeVisible();
```

---

## 2. What to AVOID at All Costs

> [!CAUTION]
> Never use absolute XPaths or transient utility CSS classes!

```typescript
// ❌ HIGHLY FRAGILE: Any added intermediate container breaks this test
await page.locator('xpath=/html/body/div[2]/div[1]/form/div[3]/button').click();

// ❌ FRAGILE: Tailwind or compiled CSS classes frequently shift during builds
await page.locator('button.bg-indigo-600.hover\\:bg-indigo-700.text-white').click();
```

---

## 3. Filtering and Chaining Locators

When dealing with list items or cards, filter them cleanly without convoluted selectors:

```typescript
// Locate the course card containing "TypeScript & Playwright" and click its action button
const courseCard = page.locator('.article-card').filter({ hasText: 'TypeScript & Playwright' });
await courseCard.getByRole('link', { name: 'View Details' }).click();
```

---

## Summary

Choosing resilient selectors turns an automation suite from a constant source of false alarms into a dependable safety net for the development lifecycle.

Have questions or want to share your favorite locator trick? Leave a reaction or comment below! 👇

<ArticleInteractions />
