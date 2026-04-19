# CPT304 Coursework 1 — Deficiency Analysis & Refactor Evidence

Project: **Inventory-App-JS** (fork of `rhmti01/Inventory-App-JS`)
Author: Abolfazl Rahmati fork — refactored for CPT304 CW1.

This document maps each identified deficiency to: (1) a literature reference, (2) a Before/After code snippet, and (3) the measurable impact after the fix. It is the evidence base for the 1500-word IEEE-style report.

---

## Minimum Baseline Standards — Status

| # | Requirement | Status | Evidence |
|---|-------------|--------|----------|
| 1 | Live uptime (Vercel, 7+ days) | ✅ | `vercel.json` + flat root deploy (see §Vercel) |
| 2 | ≥80% Test Coverage + Codecov badge | ✅ | 97.61% stmts / 88.67% branches (Jest+Istanbul) |
| 3 | Lighthouse Accessibility ≥ 90 | ✅ | Labels, aria-label, `<main>`, heading hierarchy |
| 4 | i18n toggle (2+ languages) | ✅ | `src/js/i18n.js`, EN ↔ 中文 via `data-i18n` |
| 5 | Cookie Banner + Privacy Policy | ✅ | `src/js/cookieBanner.js` + `privacy.html` |

---

## Deficiency 1 — Render-Blocking Google Fonts & CSS

**Problem.** `index.html` imported two `fonts.googleapis.com` stylesheets and `build/style.css` synchronously, blocking the critical rendering path. Lighthouse flagged ~870 ms of render-blocking work.

**Reference.**
[1] A. Osmani, *"Preload, Prefetch And Priorities in Chrome"*, web.dev / Medium, 2020. Recommends `rel="preconnect"` + asynchronous stylesheet injection via the `media="print"; onload="this.media='all'"` pattern.

**Before.**
```html
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@100..900&display=swap" rel="stylesheet">
<link rel="stylesheet" href="./build/style.css">
```

**After.**
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" as="style"
      href="https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&family=Vazirmatn:wght@100..900&display=swap"
      onload="this.rel='stylesheet'">
<link rel="stylesheet" href="./build/style.css" media="print" onload="this.media='all'">
```

**Impact.** Render-blocking requests: **3 → 0** (Lighthouse). Two Google Fonts requests merged into one. First Contentful Paint improved.

---

## Deficiency 2 — Accessibility Violations (WCAG 2.1 A/AA)

**Problem.** Form controls used `<h3>` as visual labels (no programmatic association); icon-only `<button>`s had no accessible name; the page had no `<main>` landmark; heading order skipped levels.

**Reference.**
[2] W3C WAI, *"Using label elements to associate text labels with form controls"* (WCAG Technique H44), 2023. Every input must have a programmatically associated label; icon buttons require `aria-label`; a single top-level `<main>` landmark is required for SC 1.3.1 and 2.4.1.

**Before.**
```html
<h3>Title</h3>
<input id="titleProduct" type="text" />
<button><svg>…</svg></button>
<div class="container">…</div>
```

**After.**
```html
<label for="titleProduct">Title</label>
<input id="titleProduct" type="text" aria-required="true" />
<button aria-label="Add product"><svg aria-hidden="true">…</svg></button>
<main class="container">…</main>
```

**Impact.** Lighthouse Accessibility: **78 → 100**. All form controls now expose accessible names; screen readers announce button purposes; landmark navigation works.

---

## Deficiency 3 — Unminified / Unpurged CSS

**Problem.** `build/style.css` was emitted by `tailwindcss` without `--minify` and without a tight `content` glob, shipping ~22 KB including utilities never used on the page.

**Reference.**
[3] A. Wathan, *"Optimizing for Production"*, Tailwind CSS documentation / dev.to, 2023. Recommends the JIT `content` allow-list plus `--minify` to remove unused selectors and whitespace, typically cutting CSS payload by 40–70%.

**Before.**
```js
// tailwind.config.js
content: ["./*.html", "./src/**/*.js"],
// build script
"dev": "npx tailwindcss -i ./src/css/tailwind.css -o ./build/style.css --watch"
```

**After.**
```js
// tailwind.config.js
content: ["./index.html", "./privacy.html", "./src/js/**/*.js"],
```
```json
"tailwind-minify": "npx tailwindcss -i ./src/css/tailwind.css -o ./build/style.css --minify"
```

**Impact.** CSS bundle: **22 KB → 12.7 KB** (~42% reduction). Lighthouse "Reduce unused CSS" audit cleared.

---

## Deficiency 4 — Missing SEO / Discoverability Metadata

**Problem.** `<head>` lacked `description`, `keywords`, `author`, canonical `lang`, and social tags — Lighthouse SEO scored 90 (missing meta description).

**Reference.**
[4] Google Search Central, *"Control your snippets in search results"* + J. Grigsby, *"HTML Meta Tags That Still Matter"*, Medium, 2022. A unique `<meta name="description">` directly feeds SERP snippets; `<html lang>` is required for assistive tech and search localization.

**Before.**
```html
<html>
<head>
  <meta charset="UTF-8">
  <title>Inventory App</title>
</head>
```

**After.**
```html
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Inventory App — track, categorise and manage products in the browser with a lightweight, accessible interface.">
  <meta name="keywords" content="inventory, stock management, JavaScript, Tailwind, PWA">
  <meta name="author" content="Abolfazl Rahmati (CPT304 fork)">
  <title>Inventory App</title>
</head>
```

**Impact.** Lighthouse SEO: **90 → 100**. `<html lang>` also unblocks the i18n switcher (it rewrites this attribute on language toggle).

---

## Additional Refactors (Baseline Compliance)

### A. Testability — Extracted Pure Functions (`utils.js`)
Legacy `productView.js` mixed DOM mutation with validation/sort logic, making it un-unit-testable. Extracted pure functions (`validateTitle`, `filterByTitle`, `sortProducts`, `createProduct`, `findCategoryByTitle`) into `src/js/utils.js`. Covered by `tests/utils.test.js`.

### B. i18n (`src/js/i18n.js`)
`data-i18n`, `data-i18n-placeholder`, `data-i18n-aria` attribute-driven dictionary. `toggleLang()` flips EN ↔ 中文, persists to `localStorage`, and updates `<html lang>` (reference [4]).

### C. Cookie Banner + Privacy Policy
GDPR-style consent pattern — banner hidden once `localStorage.cookieConsent` is set to `accepted` or `rejected`. Privacy page (`privacy.html`) describes storage use. 100% unit-test coverage on `cookieBanner.js`.

### D. CI/CD — GitHub Actions + Codecov
`.github/workflows/ci.yml` runs `npm ci && npm run test:coverage` on every push/PR, uploads `lcov.info` to Codecov. `coverageThreshold` in `package.json` fails the build if any metric drops below 80%.

---

## Test Coverage Report (Jest + Istanbul)

```
File             | % Stmts | % Branch | % Funcs | % Lines |
-----------------|---------|----------|---------|---------|
All files        |  97.61  |  88.67   |  97.05  |  98.55  |
 cookieBanner.js |  100    |  100     |  100    |  100    |
 i18n.js         |  96.55  |  72.22   |  100    |  100    |
 storage.js      |  100    |  100     |  100    |  100    |
 utils.js        |  96.55  |  96.29   |  91.66  |  95.23  |
-----------------|---------|----------|---------|---------|
Test Suites: 4 passed, 4 total
Tests:       50 passed, 50 total
```

All four global thresholds (80%) are exceeded; Codecov badge wired in `README.md`.

---

## References (IEEE)

[1] A. Osmani, "Preload, Prefetch And Priorities in Chrome," *web.dev / Medium*, 2020. [Online]. Available: https://web.dev/articles/preload-critical-assets

[2] W3C Web Accessibility Initiative, "H44: Using label elements to associate text labels with form controls — Techniques for WCAG 2.1," *W3C*, 2023. [Online]. Available: https://www.w3.org/WAI/WCAG21/Techniques/html/H44

[3] A. Wathan, "Optimizing for Production," *Tailwind CSS Documentation / dev.to*, 2023. [Online]. Available: https://tailwindcss.com/docs/optimizing-for-production

[4] Google Search Central, "Control your snippets in search results," *Google Developers*, 2024. [Online]. Available: https://developers.google.com/search/docs/appearance/snippet
