---
title: The Romanian CNP from a Software QA Perspective - Everything You Need to Know
description: Learn everything about testing the Romanian Personal Numeric Code (CNP) using boundary value analysis, equivalence partitioning, and 3-tier validation.
---

# 📋 The Romanian CNP from a Software QA Perspective: Everything You Need to Know

*Published by QualiAdept Community • ⏱️ 7 min read*

---

Hello, QualiAdept community! Today we are tackling a topic that is as common in Romanian applications as it is interesting from a testing point of view: **The Personal Numeric Code (CNP)**.

Whether you work on a banking app, an HR system, or an e-commerce portal that requires invoicing, you have certainly encountered it. But what exactly is the CNP beyond a string of 13 digits, and how do we, as QAs, ensure that our applications handle it correctly?

---

## What is the CNP? (In short)

The Personal Numeric Code is the unique identifier of every Romanian citizen (or resident), assigned at birth (or upon obtaining residency/citizenship). Its structure is not random; the 13 digits encode specific information following this format:

$$\text{S YY MM DD CC NNN Z}$$

* **S:** Sex and the century in which the person was born (e.g., `1`/`2` for 1900-1999, `5`/`6` for 2000-2099).
* **YY:** The last two digits of the birth year.
* **MM:** The month of birth (`01`-`12`).
* **DD:** The day of birth (`01`-`28`/`29`/`30`/`31`, depending on the month and leap year).
* **CC:** The county (or sector) code of birth (`01`-`52`).
* **NNN:** A sequential number allocated (`001`-`999`) to differentiate persons born on the same day and in the same county.
* **Z:** The control digit, calculated through a mathematical algorithm based on the first 12 digits.

---

## The CNP from a QA Perspective

As QA engineers, we do not view the CNP merely as a simple text field. To us, it is an algorithm, a business validation, sensitive data (PII - Personally Identifiable Information), and a potential source of bugs.

When testing a CNP field, we must consider several aspects:

![The CNP Validation Flow (3-Tier Architecture)](/images/articles/cnp-validation-flow-en.jpg)
<span class="image-caption">Fig. 1 - The CNP Validation Flow (3-Tier Architecture)</span>

* **Syntactic Validation (Format):** Does it allow only 13 characters? Does it allow only digits?
* **Semantic Validation (Structure):** Do the digits conform to the rules (valid months, valid days depending on the year/month)?
* **Mathematical Validation:** Is the control digit correct?
* **Business Validation:** Does the entered CNP correspond to the declared age? To the sex? Is it already registered (for uniqueness)?
* **Security and Privacy (GDPR):** How is it stored? How is it displayed (is it masked)?

---

## How to Test a CNP Field: Scenarios and Techniques

Here is a practical guide to exhaustively cover the testing of a CNP field, using test design techniques (**Boundary Value Analysis**, **Equivalence Partitioning**).

### 1. Basic Validation Testing (Positive & Negative)

* **Happy Path (Valid):** Enter a perfectly valid CNP. The application must accept it.
* **Incorrect length (Negative):**
  * 12 digits (too short).
  * 14 digits (too long).
* **Invalid characters (Negative):**
  * Letters (`190010112345a`).
  * Special characters (`190010112345@`).
  * Spaces (at the beginning, end, or middle).

---

### 2. Structure Testing (Equivalence Partitioning & Boundary Value Analysis)

Here we dive into the logic of the CNP structure. We test every component. Here is a useful summary for partitioning and boundary value techniques:

| Attribute / Field | Valid (Equivalence Classes) | Invalid (Negative Scenarios) |
| :--- | :--- | :--- |
| **Exact Length** | 13 characters | `< 13` characters, `> 13` characters |
| **Data Type** | Digits only (`0-9`) | Letters (`A-Z`), Special Characters, Spaces |
| **Boundary Values (Months)** | `01`, `12` | `00`, `13` |

#### Additional details for checking the structure:

* **S (Sex/Century):**
  * *Valid:* `1`, `2`, `5`, `6`, `7`, `8`, `9` (digits currently used).
  * *Invalid:* `0`, `3`, `4` (depending on the app's requirements, some might be historically valid, but are usually invalidated in modern systems).
* **MM (Month):**
  * *Valid:* `01`, `12`.
  * *Invalid:* `00`, `13`.
* **DD (Day) - Correlation with Month and Year (YY):** *This is a classic bug hotspot!*
  * Months with 31 days: Test `31` (valid), `32` (invalid).
  * Months with 30 days (e.g., April - 04): Test `30` (valid), `31` (invalid).
  * February (Leap year, e.g., year 24): Test `29` (valid), `30` (invalid).
  * February (Non-leap year, e.g., year 23): Test `28` (valid), `29` (invalid).
* **CC (County):**
  * *Valid:* `01` - `52` (county codes + Bucharest sectors + Călărași).
  * *Invalid:* `00`, `53+`.

---

### 3. Control Digit Testing (Z)

The application should (ideally) validate the CNP mathematically, not just the format. The algorithm multiplies the first 12 digits by the constant number `279146358279` and uses a modulo 11 to determine the final digit.

> [!TIP]
> **Test Case:** Generate a valid CNP (using an online tool or a script). Change the last digit to any other digit.  
> **Expected Result:** The application must reject the CNP, returning an *"Invalid CNP"* error.

---

### 4. Business Testing and Application Logic

* **Uniqueness:** If the application allows account creation, try to register two different users with the same CNP.
* **Data Correlation (Data Consistency):**
  * If in the form the user selects the sex *"Female"*, but the CNP starts with `"1"` (*Male*).
  * If an age restriction applies (e.g., only over 18), use a CNP that generates an age of 17. The application must correctly calculate the age from `YY MM DD` and restrict access.

---

### 5. Generating Test Data

> [!WARNING]
> You cannot use real data (colleagues' CNPs) due to **GDPR** regulations!

* **Online Generators:** There are websites (search *"CNP generator Romania"*) that create syntactically valid CNPs, useful for testing.
* **Custom Scripts:** Write a small script (in Python, JS, Java) to generate CNPs according to the official algorithm. This is the recommended approach for automation.
* **Control Digit Calculators:** There are tools that mathematically validate a CNP for you.

---

## Conclusion

Testing a CNP is an excellent example of how a seemingly banal field requires special attention. It is not enough to just test the length; we must verify the algorithm, the logic behind the data, and the alignment with business requirements.

How do you usually test CNPs in your projects? Do you use automated scripts or rely on external generators? Leave us a comment below!

*Happy Testing, QualiAdept community!*

<ArticleInteractions />
