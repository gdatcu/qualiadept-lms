---
title: "Nu mai contează dacă știi să scrii testul. Contează dacă vezi de ce testul scris de agent nu verifică nimic."
description: "Când un agent AI scrie un test Playwright în 30 de secunde, interviul tehnic de QA nu mai poate măsura sintaxa. Din perspectiva de interviewer, articolul arată ce întrebări au dispărut, ce exerciții le-au luat locul și cum se pot pregăti candidații și echipele de hiring."
ogImage: "/images/articles/qa-interview-ai-agents-og.jpg"
---

# 🎯 Nu mai contează dacă știi să scrii testul. Contează dacă vezi de ce testul scris de agent nu verifică nimic.

*Cum se schimbă interviul tehnic de QA Automation acum că agenții AI scriu cod, din perspectiva unui interviewer.*

*Publicat de comunitatea QualiAdept • 21 Noiembrie 2026 • ⏱️ 7 min lectură*

![Interviul QA Automation în era agenților AI – Review-ul testului generat](/images/articles/qa-interview-ai-agents-hero.jpg)
<span class="image-caption">Fig. 1 — Agentul scrie testul în 30 de secunde, dar inginerul QA trebuie să vadă de ce un test verde poate să nu verifice nimic</span>

---

## Un moment dintr-un interviu recent

Un moment dintr-un interviu recent, redat generic și anonimizat:

Candidatul primește un exercițiu clasic: un test end-to-end pentru un flow de adăugare în coș. În câteva minute are un test Playwright curat și bine structurat, care trece din prima. Arată bine.

Îl întreb: **„Ce anume verifică testul ăsta?”**

Urmează o pauză lungă. Apoi: *„Că produsul se adaugă în coș.”*

**„Dacă ar exista un bug și produsul nu s-ar adăuga, ar pica testul?”**

Altă pauză. Candidatul recitește codul și realizează că nu. Testul verifică doar că pe pagină apare un element care există oricum.

Testul nu era problema. **Problema era că omul din fața mea nu știa ce semnează.**

Din momente ca acesta am înțeles că felul în care evaluăm candidații de QA Automation trebuie să se schimbe. Dacă un agent scrie testul în 30 de secunde, faptul că și candidatul îl poate scrie nu mai spune mare lucru despre el.

---

## 📊 De ce se schimbă interviul acum

Nu e o impresie personală. Câteva companii mari au schimbat deja oficial formatul interviului.

În iunie 2025, Canva a anunțat că le cere candidaților pentru backend, frontend și machine learning să folosească tool-uri AI precum Copilot, Cursor sau Claude în timpul interviurilor tehnice ([*Yes, You Can Use AI in Our Interviews. In fact, we insist*](https://canva.dev/blog/engineering/yes-you-can-use-ai-in-our-interviews/)). Interviewerii lor spun că cei mai buni candidați folosesc AI-ul strategic, dar își păstrează controlul asupra deciziilor tehnice ([*AI Interview Success: An Interviewer's Inside Guide*](https://canva.dev/blog/engineering/ai-interview-success/)). Între timp, tot mai multe companii au introdus runde de coding în care lucrul cu un asistent AI face parte din test. Formatul diferă mult de la o companie la alta ([*Ten companies now put an AI in the coding interview*](https://maxnyriev.substack.com/p/ten-companies-now-put-an-ai-in-the)), iar multe încă lucrează după regula „presupune că AI-ul nu e permis până nu ți se spune altfel” ([*AI-Assisted Coding Interviews: What to Expect*](https://www.greatfrontend.com/blog/ai-assisted-coding-interviews-for-frontend-developers)).

Mai e și un paradox care ne privește direct pe noi, cei din QA. Conform [Stack Overflow Developer Survey 2025](https://survey.stackoverflow.co/2025/ai):

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 16px; margin: 24px 0;">
  <div style="background: rgba(99, 102, 241, 0.1); border: 1px solid rgba(99, 102, 241, 0.35); border-radius: 14px; padding: 18px;">
    <div style="font-size: 2rem; font-weight: 800; color: #38bdf8; line-height: 1.1;">84%</div>
    <div style="font-weight: 700; margin-top: 6px;">folosesc sau plănuiesc AI</div>
    <div style="font-size: 0.85rem; opacity: 0.8; margin-top: 4px;">Dintre developeri au adoptat deja sau plănuiesc să folosească tool-uri AI (Stack Overflow 2025).</div>
  </div>
  <div style="background: rgba(168, 85, 247, 0.1); border: 1px solid rgba(168, 85, 247, 0.35); border-radius: 14px; padding: 18px;">
    <div style="font-size: 2rem; font-weight: 800; color: #c084fc; line-height: 1.1;">Doar 29%</div>
    <div style="font-weight: 700; margin-top: 6px;">au încredere în rezultate</div>
    <div style="font-size: 0.85rem; opacity: 0.8; margin-top: 4px;">În scădere de la <strong>40%</strong> cu un an înainte (<a href="https://try.stackoverflow.co/internal/resources/2025-stack-overflow-developer-survey-for-leaders/ai-adoption" target="_blank">Stack Overflow</a>).</div>
  </div>
  <div style="background: rgba(244, 63, 94, 0.1); border: 1px solid rgba(244, 63, 94, 0.35); border-radius: 14px; padding: 18px;">
    <div style="font-size: 2rem; font-weight: 800; color: #fb7185; line-height: 1.1;">46% vs. 33%</div>
    <div style="font-weight: 700; margin-top: 6px;">neîncredere activă</div>
    <div style="font-size: 0.85rem; opacity: 0.8; margin-top: 4px;">Mai mulți developeri nu au încredere în acuratețea tool-urilor AI (46%) decât au (33%).</div>
  </div>
</div>

Pentru un inginer QA, diferența dintre cât de mult e folosit AI-ul și cât de mult te poți baza pe el nu e un subiect de discuție abstract. **Exact de asta se ocupă meseria noastră.**

---

## ❌ Ce nu mai întreb (sau întreb mult mai rar)

Am renunțat în mare parte la întrebările care testează memoria:

- „Care e diferența dintre `@BeforeMethod` și `@BeforeClass` în TestNG?”
- „Scrie-mi un XPath pentru al treilea element dintr-o listă.”
- „Scrie de la zero un test de login.”

Nu spun că fundamentele nu mai contează. Contează, și revin mai jos la asta. Dar întrebările astea nu mai diferențiază candidații. Un agent răspunde corect la toate, deci un candidat care le recită nu-mi arată nimic ce nu-mi arată și un tool.

---

## ✅ Ce întreb acum: 4 tipuri de exerciții

### 1. Review pe un test generat de AI

E exercițiul meu preferat. Candidatul primește un test care trece și trebuie să-mi spună ce e în neregulă cu el. De exemplu:

```typescript
test('user can add product to cart', async ({ page }) => {
  await page.goto('https://shop.example.com/products/42');
  await page.click('text=Add to cart');
  await page.waitForTimeout(3000);

  const cartIcon = page.locator('.cart-icon');
  await expect(cartIcon).toBeVisible();
});
```

Arată în regulă și trece. Un candidat bun găsește în câteva minute cel puțin trei probleme:

- **Aserțiunea nu verifică nimic relevant.** Iconița coșului e vizibilă oricum, cu sau fără produs. Testul ar trebui să verifice numărul de produse din coș sau conținutul coșului.
- **`waitForTimeout(3000)` e un semnal clar de flakiness.** Playwright are auto-waiting și aserțiuni web-first. Pauzele fixe fac testul fie lent, fie instabil.
- **Datele de test sunt hardcodate, iar starea inițială nu e controlată.** Ce se întâmplă dacă produsul `42` nu mai e pe stoc sau dacă coșul nu era gol la început?

O variantă mai bună arată cam așa:

```typescript
await page.getByRole('button', { name: 'Add to cart' }).click();
await expect(page.getByTestId('cart-count')).toHaveText('1');
```

> [!IMPORTANT]
> Cel mai mult contează un singur lucru, care desparte imediat candidații buni de ceilalți: **un test pe care nu l-ai văzut niciodată picând nu e încă un test.** Cei mai buni candidați se întreabă singuri, fără să-i întreb eu: *„Cum aș face testul ăsta să pice intenționat, ca să văd că prinde bug-ul?”*

---

### 2. Strategie înainte de cod

*„Ai un endpoint `POST /orders`. Nu scrie nimic. Spune-mi ce ai testa, în ce ordine și ce ai lăsa deliberat netestat.”*

Agentul îți poate genera 40 de teste pentru endpoint-ul ăsta. Nu-ți spune însă care 5 contează cu adevărat: idempotența la retry, validarea sumelor, autorizarea pe comenzile altui user, comportamentul la stoc zero. Prioritizarea în funcție de risc rămâne o abilitate umană, cel puțin deocamdată.

---

### 3. Cum conduci agentul

Când formatul interviului permite AI, mă uit la *cum* îl folosește candidatul, nu doar la rezultat:

- Îi dă context, adică stack-ul, convențiile proiectului și ce trebuie să verifice testul? Sau scrie doar *„write a test for checkout”*?
- Sparge problema în pași mici și verifică fiecare pas?
- Știe când să se oprească și să scrie singur trei linii, în loc să mai încerce cinci prompt-uri?
- Rulează codul generat înainte să spună că e gata?

E cam ce observă și alte echipe care fac interviuri asistate de AI: contează să-ți faci un plan, să dai prompt-uri în pași mici, să testezi des și să explici ce faci pe parcurs ([*AI-Enabled Coding Interviews 2026*](https://techscreen.app/articles/ai-enabled-coding-interview-guide-2026)).

---

### 4. Ownership

Închei aproape mereu cu întrebări despre cod care, tehnic, nu a fost scris de candidat:

- „Explică-mi linia asta.”
- „Ce se întâmplă dacă API-ul returnează `200`, dar body-ul e gol?”
- „De ce ai acceptat sugestia asta și nu pe cealaltă?”

Mesajul pentru candidat e simplu: **dacă testul e în PR-ul tău, e testul tău.** Nimeni nu va accepta în code review explicația *„l-a scris agentul”*.

---

## 🚦 Semnale roșii și semnale verzi

**🔴 Semnale roșii:**

- acceptă primul output al agentului fără să-l citească cu atenție;
- spune că testul e gata fără să-l fi rulat;
- nu poate explica o linie din codul pe care îl prezintă;
- confundă „testul e verde” cu „funcționalitatea merge”;
- se blochează complet când agentul greșește.

**🟢 Semnale verzi:**

- pune sub semnul întrebării aserțiunile înainte de orice altceva;
- face testul să pice intenționat ca să-l valideze;
- își explică raționamentul cu voce tare;
- respinge argumentat o sugestie a agentului;
- revine la fundamente (HTTP, DOM, sincronizare, design de teste) când ceva nu merge.

---

## 🎓 Pentru candidați: cum te pregătești

1. **Exersează review-ul, nu doar scrierea.** Generează cu un agent 10 teste pentru o aplicație demo și caută problemele din fiecare. E cel mai bun antrenament pe care ți-l pot recomanda acum.
2. **Învață să-ți explici deciziile cu voce tare.** *„Am respins sugestia asta pentru că folosește un selector CSS fragil”* valorează mai mult decât un cod perfect pe care nu-l poți explica.
3. **Nu-ți lăsa fundamentele să ruginească.** Ca să evaluezi output-ul unui agent trebuie să știi mai mult decât el despre ce face de fapt. Fără să înțelegi HTTP, async sau design de teste, nu poți face review.
4. **Află dinainte regulile interviului.** Întreabă recruiterul dacă AI-ul e permis, care tool-uri și în ce rundă. Dacă nu ți se spune nimic, presupune că nu e permis.
5. **Fă-ți obiceiul să întrebi „cum ar pica testul ăsta?”** Spune întrebarea cu voce tare la interviu, ca interviewerul să vadă cum gândești.

---

## 👥 Pentru intervieweri și echipe de hiring

- **Înlocuiește o parte din exercițiile de scris cod cu exerciții de review.** Un test generat de AI cu 3–4 probleme ascunse îți spune mai mult într-un sfert de oră decât o oră de live coding.
- **Stabilește criterii clare.** Evaluezi raționamentul, prioritizarea și ownership-ul, nu cât de bine stăpânește candidatul un anumit tool.
- **Anunță regulile dinainte.** Candidatul trebuie să știe dacă poate folosi AI. Altfel testezi cât de bine ghicește formatul, nu ce știe.
- **Nu transforma interviul într-un test despre tool-uri.** Copilot, Cursor sau Playwright Agents se schimbă de la o lună la alta. Gândirea critică despre ce înseamnă un test bun rămâne valoroasă mult timp.

---

## 📌 Key takeaways

- Faptul că știi sintaxa nu mai deosebește un candidat de altul, pentru că orice agent o știe.
- Cel mai util semnal la interviu este cât de bine face candidatul review pe un test generat: aserțiuni, flakiness, date de test.
- **Un test pe care nu l-ai văzut niciodată picând nu e încă un test.**
- Strategia, prioritizarea după risc și ownership-ul au devenit centrul interviului.
- Fundamentele contează mai mult decât înainte, pentru că fără ele nu poți evalua munca agentului.

---

## Concluzie

**Agentul scrie testul, dar inginerul QA răspunde pentru el.** Aici e toată schimbarea. Interviul tehnic de QA Automation măsoară tot mai puțin cât de repede poți produce cod și tot mai mult cât de bine poți judeca și verifica un cod pe care nu l-ai scris tu.

Tu ce ai schimbat în interviurile tale, ca interviewer sau ca și candidat? Sau încă ți se cere să scrii XPath-uri de mână? 👇

---

### Surse

1. [Canva Engineering — „Yes, You Can Use AI in Our Interviews. In fact, we insist”](https://canva.dev/blog/engineering/yes-you-can-use-ai-in-our-interviews/)
2. [Canva Engineering — „AI Interview Success: An Interviewer's Inside Guide”](https://canva.dev/blog/engineering/ai-interview-success/)
3. [Ten companies now put an AI in the coding interview](https://maxnyriev.substack.com/p/ten-companies-now-put-an-ai-in-the)
4. [GreatFrontEnd — „AI-Assisted Coding Interviews: What to Expect”](https://www.greatfrontend.com/blog/ai-assisted-coding-interviews-for-frontend-developers)
5. [TechScreen — „AI-Enabled Coding Interviews 2026”](https://techscreen.app/articles/ai-enabled-coding-interview-guide-2026)
6. [Stack Overflow Developer Survey 2025, secțiunea AI](https://survey.stackoverflow.co/2025/ai)
7. [Stack Overflow — „AI adoption is accelerating, but trust is declining”](https://try.stackoverflow.co/internal/resources/2025-stack-overflow-developer-survey-for-leaders/ai-adoption)

<ArticleInteractions />
