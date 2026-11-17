---
title: "QA Automation în 2029: ce dispare, ce rămâne și ce devine mai valoros"
description: "Agenții AI scriu și repară deja teste, iar asta schimbă ce înseamnă să fii QA Automation. Descoperă ce se automatizează, ce crește în valoare și cum se schimbă interviurile."
---

# 🚀 QA Automation în 2029: ce dispare, ce rămâne și ce devine mai valoros

*Publicat de comunitatea QualiAdept • 17 Noiembrie 2026 • ⏱️ 7 min lectură*

![QA Automation în 2029 – Inginerul QA și agenții autonomi](/images/articles/qa-automation-2029-hero.jpg)
<span class="image-caption">Fig. 1 — Inginerul QA din 2029 orchestrează agenți autonomi de testare și validează arhitectura de calitate a produsului</span>

---

## Întrebarea pe care o aud tot mai des

La finalul aproape fiecărui interviu tehnic las câteva minute pentru întrebările candidatului. Acum un an sau doi mă întrebau despre proiect, echipă sau stack. Acum o întrebare revine aproape de fiecare dată, uneori pe jumătate în glumă: **„Mai are viitor meseria asta, dacă AI-ul scrie deja teste?”**

E o întrebare legitimă și merită mai mult decât un „stai liniștit, AI-ul nu te înlocuiește”. Răspunsul meu scurt: **da, QA Automation are viitor**. Dar peste trei ani nu va mai arăta ca acum, iar cine se pregătește de pe acum va avea un avantaj real față de cine așteaptă să vadă ce se întâmplă.

Îți spun ce văd din două perspective: de **inginer care scrie și întreține teste** și de **intervievator care decide cine intră în echipă**.

---

## 📊 Ce spun datele, fără hype

Înainte de opinii, câteva cifre din surse cu metodologie clară:

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 16px; margin: 24px 0;">
  <div style="background: rgba(99, 102, 241, 0.1); border: 1px solid rgba(99, 102, 241, 0.35); border-radius: 14px; padding: 18px;">
    <div style="font-size: 2rem; font-weight: 800; color: #38bdf8; line-height: 1.1;">89%</div>
    <div style="font-weight: 700; margin-top: 6px;">pilotează GenAI în QA</div>
    <div style="font-size: 0.85rem; opacity: 0.8; margin-top: 4px;">Dar doar <strong>15%</strong> l-au extins la nivel de companie (World Quality Report 2025-26).</div>
  </div>
  <div style="background: rgba(168, 85, 247, 0.1); border: 1px solid rgba(168, 85, 247, 0.35); border-radius: 14px; padding: 18px;">
    <div style="font-size: 2rem; font-weight: 800; color: #c084fc; line-height: 1.1;">Doar 29%</div>
    <div style="font-weight: 700; margin-top: 6px;">au încredere în output-ul AI</div>
    <div style="font-size: 0.85rem; opacity: 0.8; margin-top: 4px;">În scădere de la 40% în 2024, deși 84% folosesc unelte AI (Stack Overflow 2025).</div>
  </div>
  <div style="background: rgba(56, 189, 248, 0.1); border: 1px solid rgba(56, 189, 248, 0.35); border-radius: 14px; padding: 18px;">
    <div style="font-size: 2rem; font-weight: 800; color: #38bdf8; line-height: 1.1;">70%</div>
    <div style="font-weight: 700; margin-top: 6px;">adopție până în 2028</div>
    <div style="font-size: 0.85rem; opacity: 0.8; margin-top: 4px;">Companii cu unelte de testare augmentate cu AI, față de ~20% în 2025 (Gartner).</div>
  </div>
</div>

> [!IMPORTANT]
> **Paradoxul care avantajează QA-ul:** AI-ul intră peste tot, dar oamenii au tot mai puțină încredere în ce produce. Pentru QA nu e o veste proastă — asta e chiar meseria noastră: **să nu avem încredere până nu verificăm**.

---

## 🤖 Ce se automatizează deja

Să fim cinstiți: o parte din ce facem azi nu va mai fi muncă de om peste trei ani.

Cel mai clar exemplu vine dintr-un framework pe care mulți dintre noi îl folosim. De la versiunea **1.56**, Playwright vine cu trei agenți:
- **Planner** — explorează aplicația și scrie un plan de testare;
- **Generator** — transformă planul în teste;
- **Healer** — rulează testele picate și încearcă să le repare.

![Arhitectura Hibridă QA în 2029: Agenții Playwright vs. Inginerul QA](/images/articles/playwright-agents-flow-ro.svg)
<span class="image-caption">Fig. 2 — Cum împart munca agenții Playwright (Planner, Generator, Healer) și inginerul QA</span>

Asta înseamnă că trei lucruri considerate azi „munca de bază” a unui automation engineer devin rapid ceva ce poate face oricine:

- scrierea testelor de rutină pentru fluxuri simple;
- repararea locatorilor după fiecare schimbare de UI;
- transformarea unui test case manual în cod.

Dacă CV-ul tău se sprijină în principal pe *„știu să scriu teste Selenium”*, e momentul să construiești ceva peste asta. Selenium nu dispare, dar scrisul testului în sine nu te mai diferențiază.

---

## 💎 Ce crește în valoare

### 1. Gândirea critică (Capcana „Testului Verde, dar Orb”)

În analiza PractiTest a rezultatelor State of Testing, **gândirea critică** a trecut pe primul loc între abilitățile testerilor, înaintea comunicării. Explicația lor: când AI-ul generează cod, teste și rapoarte în câteva secunde, ce contează e să le poți valida.

Iată cum arată asta în practică. Un asistent AI generează un test pentru un cod de reducere:

> [!WARNING]
> **❌ Varianta generată de AI — trece mereu, dar nu verifică efectul de business**

```java
@Test
void userCanApplyDiscountCode() {
    page.navigate(BASE_URL + "/cart");
    page.getByLabel("Discount code").fill("BLACKFRIDAY");
    page.getByRole(AriaRole.BUTTON,
        new Page.GetByRoleOptions().setName("Apply")).click();

    assertThat(page.getByText("Total")).isVisible();
}
```

Testul trece. Arată curat, are un nume bun și folosește locatorii recomandați. **Problema e că nu verifică nimic:** eticheta „Total” e pe pagină și când reducerea funcționează, și când nu. Testul ăsta rămâne verde și în ziua în care reducerea se strică.

Iată varianta scrisă de cineva care se gândește la ce verifică:

> [!TIP]
> **✅ Varianta scrisă de un inginer QA — verifică starea inițială, acțiunea și efectul concret**

```java
@Test
void discountCodeReducesTotalBy20Percent() {
    page.navigate(BASE_URL + "/cart");
    Locator total = page.getByTestId("cart-total");
    assertThat(total).hasText("€100.00");

    page.getByLabel("Discount code").fill("BLACKFRIDAY");
    page.getByRole(AriaRole.BUTTON,
        new Page.GetByRoleOptions().setName("Apply")).click();

    assertThat(total).hasText("€80.00");
    assertThat(page.getByTestId("discount-line")).containsText("-20%");
}
```

Diferența nu ține de sintaxă, ci de **intenție**: verifici starea de dinainte, faci acțiunea și confirmi efectul ei concret. Un agent poate genera prima variantă de o sută de ori pe zi. Pentru a doua îți trebuie cineva care înțelege ce ar trebui să facă produsul.

### 2. Strategia de testare (+20.000$ diferență salarială)

State of Testing 2026 vine cu o cifră care ar trebui să dea de gândit oricărui senior: **testerii seniori care rămân doar pe execuția tehnică câștigă cu aproape 20.000 de dolari pe an mai puțin** decât cei care au trecut spre strategie.

Strategie nu înseamnă documente lungi. Înseamnă să poți răspunde la întrebări ca acestea:
- Ce testăm la nivel de **API** și ce la nivel de **UI**?
- Ce rulăm la **fiecare commit** și ce **o dată pe noapte**?
- Unde e **cel mai mare risc** în release-ul ăsta?

![Redistribuirea timpului unui QA Automation Engineer (2026 vs. 2029)](/images/articles/qa-evolution-2026-2029-ro.svg)
<span class="image-caption">Fig. 3 — Tranziția de la execuția repetitivă de scripturi la strategie bazată pe risc, audit AI și evaluare LLM</span>

### 3. Testarea bazată pe risc

Când poți genera teste aproape gratuit, tentația e să generezi mii. Rezultatul sunt suite lente și instabile, pe care nu le mai înțelege nimeni. Valoarea se mută spre decizia despre **ce *nu* testezi**. Peste trei ani, un QA bun nu va fi cel cu cele mai multe teste, ci cel care poate explica de ce are exact testele pe care le are.

---

## 🧠 Competențe noi pe care le vei folosi

| Competență 2029 | De ce devine esențială | Ce înlocuiește / completează |
| :--- | :--- | :--- |
| **Testarea aplicațiilor bazate pe LLM** | Același input poate da răspunsuri diferite, toate corecte — sau o halucinație formulată foarte convingător. | Înlocuiește `assertEquals` simplu cu seturi de evaluare, rubrici de calitate și **LLM-as-a-Judge**. |
| **Revizuirea testelor generate de AI** | Agenții produc rapid cod curat sintactic, dar adesea fără aserțiuni de business relevante. | Transformă QA-ul din autor de cod boilerplate în **auditor de calitate a suitei**. |
| **Calitatea în producție (Shift-Right)** | Nu toate comportamentele emergente (mai ales AI/cloud) pot fi prinse în staging. | Completează shift-left cu **observabilitate, feature flags și analiză de incidente**. |

---

## 🎤 Cum se schimbă interviurile

Asta e partea pe care o văd direct. Nu mă mai interesează dacă un candidat știe pe de rost diferența dintre `findElement` și `findElements`. Mă interesează **cum gândește**.

| ❌ Întrebarea clasică (înainte) | ✅ Întrebarea pe care o pun acum | 🎯 Ce urmăresc în răspuns |
| :--- | :--- | :--- |
| *„Scrie-mi un locator pentru butonul ăsta.”* | *„Un agent ți-a generat 20 de teste pentru un modul nou. Cum decizi care sunt bune și pe care le arunci?”* | Capacitatea de a evalua oracolul de test, redundanța și valoarea de business. |
| *„Ce e un Page Object?”* | *„Ai 2.000 de teste UI care rulează în trei ore. Ce faci?”* | Coborârea testelor în piramidă (API/component), paralelizare și eliminare de teste fără risc. |
| *„Ce tipuri de testare cunoști?”* | *„Cum ai testa un chatbot de suport pentru clienți?”* | Gândire probabilistică: acuratețe factuală, prompt injection, latență și eșantionare umană. |

Cele mai bune răspunsuri pe care le-am auzit nu au fost cele mai tehnice. Au fost cele în care candidatul a întrebat întâi despre **riscuri**, despre **utilizatori** și despre **ce înseamnă „corect”** pentru produsul respectiv.

---

## 🛠️ Ce poți face începând de luni

Nu-ți trebuie un curs de șase luni. Începe cu trei lucruri:

1. **Încearcă agenții Playwright pe un proiect personal.** Lasă-i să genereze teste pentru o aplicație demo, apoi revizuiește-le ca și cum le-ar fi scris un coleg junior. Notează ce au ratat. Exercițiul ăsta îți antrenează exact abilitatea care va conta.
2. **Învață bazele evaluării aplicațiilor cu LLM.** Ia un chatbot simplu, scrie 20 de întrebări cu răspunsurile așteptate și definește ce înseamnă un răspuns „bun”. Vei vedea repede de ce testarea clasică nu mai ajunge.
3. **Exersează să-ți explici strategia.** Data viitoare când scrii teste pentru un feature, scrie și trei fraze: *ce ai testat, ce nu ai testat și de ce*. Dacă nu reușești, ai găsit la ce să lucrezi.

---

## 📌 Concluzii cheie

- **Execuția de rutină se comoditizează:** AI-ul preia scrierea testelor simple și întreținerea locatorilor.
- **Scepticismul informat devine super-putere:** încrederea în ce produce AI-ul e mică (29%), așa că validarea rezultatelor ajunge în centrul meseriei.
- **Strategia plătește mai bine:** gândirea critică, strategia de testare și testarea bazată pe risc cresc în valoare, inclusiv salarial (+20.000$/an).
- **Noile fundamente:** testarea aplicațiilor cu LLM și revizuirea testelor generate de AI devin competențe de bază.
- **Interviurile s-au schimbat:** de la *„știi să scrii teste?”* la *„știi să decizi și să verifici?”*.

---

## Încheiere

Peste trei ani, QA Automation nu va dispărea. Va dispărea doar versiunea meseriei în care valoarea ta se măsoară în numărul de scripturi scrise. Locul ei îl ia ceva mai interesant: **omul care știe ce trebuie verificat, care nu se lasă păcălit de un test verde și care poate testa inclusiv sistemele care „gândesc”**.

Acum vreau să aud de la voi: **ce parte din munca ta de azi crezi că va fi automatizată prima?** Scrieți-mi în comentarii, sunt curios cât de diferit vedem lucrurile. 👇

---

### Surse

1. [World Quality Report 2025-26 (OpenText, Capgemini, Sogeti)](https://www.capgemini.com/be-en/news/press-releases/world-quality-report-2025-ai-adoption-surges-in-quality-engineering-but-enterprise-level-scaling-remains-elusive/)
2. [Stack Overflow Developer Survey 2025 – AI Section](https://survey.stackoverflow.co/2025/ai)
3. [Stack Overflow – AI adoption is accelerating, but trust is declining](https://try.stackoverflow.co/internal/resources/2025-stack-overflow-developer-survey-for-leaders/ai-adoption)
4. [Gartner Magic Quadrant for AI-Augmented Software Testing Tools, Oct 2025](https://images.g2crowd.com/uploads/attachment/file/1730744/Gartner-MQ-AI-augmented---Oct-2025(2).pdf)
5. [Playwright Documentation – Test Agents](https://playwright.dev/docs/test-agents)
6. [PractiTest – Top QA Skills from State of Testing](https://www.practitest.com/resource-center/blog/top-qa-skills/)
7. [PractiTest – State of Testing 2026](https://www.practitest.com/state-of-testing/)

<ArticleInteractions />
