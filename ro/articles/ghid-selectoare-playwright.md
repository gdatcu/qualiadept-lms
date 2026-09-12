---
title: Ghid Complet - Cum să alegi cele mai robuste selectoare în Playwright
description: Învață cum să scrii locatoare rezistente la schimbări de UI în Playwright și cum să eviți selectoarele fragile.
---

# 🎯 Ghid Complet: Cum să alegi cele mai robuste selectoare în Playwright

*Publicat de echipa de mentori QualiAdept • 12 Septembrie 2026 • ⏱️ 6 min lectură*

---

Una dintre cele mai mari provocări în automatizarea testelor E2E este **flakiness-ul cauzat de selectoare fragile**. O simplă schimbare de stil sau refactorizare a arborelui DOM poate distruge zeci de teste dacă strategia de localizare este greșită.

În acest articol, vom explora ierarhia recomandată de Playwright pentru a alege selectoare stabile și ușor de întreținut.

---

## 1. Ierarhia de aur a locatoarelor în Playwright

Playwright recomandă localizarea elementelor din perspectiva utilizatorului final (rol accesibil, text vizibil, etichete).

### 🥇 Nivelul 1: Locatoare axate pe accesibilitate (Recomandat)

Acestea sunt cele mai rezistente deoarece reflectă modul în care utilizatorul sau tehnologiile asistive percep pagina.

```typescript
// ✅ Foarte robust: caută după rolul ARIA și textul vizibil
await page.getByRole('button', { name: 'Salvează modificările' }).click();

// ✅ Căutare după etichetă (Label) pentru input-uri de formular
await page.getByLabel('Adresă de e-mail').fill('student@qualiadept.ro');

// ✅ Căutare după placeholder
await page.getByPlaceholder('Introdu parola').fill('Secret123!');
```

### 🥈 Nivelul 2: Locatoare explicite de test (`data-testid`)

Când un element nu are un text sau un rol unic accesibil (de exemplu, un buton cu iconiță sau un rând dintr-un tabel dinamic), folosește atributul dedicat de test.

```html
<!-- În codul sursă HTML -->
<button data-testid="user-profile-avatar" class="rounded-full p-2">
  <img src="/avatar.png" alt="Avatar" />
</button>
```

```typescript
// În testul Playwright
await page.getByTestId('user-profile-avatar').click();
```

### 🥉 Nivelul 3: Selectoare de text și conținut

```typescript
await page.getByText('Autentificare reușită').toBeVisible();
```

---

## 2. Ce trebuie să EVIȚI cu orice preț

> [!CAUTION]
> Nu folosi niciodată XPath-uri absolute sau clase de utilitate CSS fragile!

```typescript
// ❌ FOARTE FRAGIL: Orice div intermediar adăugat va strica testul
await page.locator('xpath=/html/body/div[2]/div[1]/form/div[3]/button').click();

// ❌ FRAGIL: Clasele Tailwind sau cele generate dinamic se pot schimba la build
await page.locator('button.bg-indigo-600.hover\\:bg-indigo-700.text-white').click();
```

---

## 3. Filtrarea și înlănțuirea locatoarelor

Când ai liste sau carduri similare, poți filtra elegant fără a crea XPath-uri complexe:

```typescript
// Găsește cardul de curs care conține textul "TypeScript & Playwright" și dă click pe butonul de start
const courseCard = page.locator('.article-card').filter({ hasText: 'TypeScript & Playwright' });
await courseCard.getByRole('link', { name: 'Vezi detalii' }).click();
```

---

## Concluzie

Alegerea unor selectoare robuste transformă o suită de teste dintr-o sursă constantă de alarme false într-un instrument de încredere pentru echipa de dezvoltare.

Ai întrebări sau vrei să împărtășești tehnica ta preferată de localizare? Lasă o reacție sau un comentariu mai jos! 👇

<ArticleInteractions />
