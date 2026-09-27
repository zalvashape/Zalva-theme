# CLAUDE.md — Zalva Shape Shopify Theme

This file is read automatically at the start of every Claude Code session. It contains everything needed to continue building the Zalva Shape store without losing context. Keep it updated: when a decision is made or a pending item is completed, update the relevant section in the same commit.

---

## 1. How to work with Denny (READ FIRST)

- **Denny is the founder. He writes in Spanish. Always reply to him in Spanish.**
- **All store content, copy, and code comments are in English** (target market: United States).
- Denny is not a developer. After every task, explain in 2–4 simple Spanish sentences what you changed and how he can check it. Avoid jargon; if a technical term is unavoidable, explain it in one line.
- Denny likes this pattern: propose the vision first → he validates → give an expert recommendation → he decides → you build. For big or ambiguous changes, propose before building. For small fixes (padding, colors, copy), just do it.
- Give an honest recommendation when he asks for one. Push back kindly if something hurts the premium feel, performance, or honesty of the brand.
- Before asking Denny to describe what he sees, read the actual code yourself.

---

## 2. Git workflow (CRITICAL — this store is live)

- Repo: `zalvashape/Zalva-theme` on GitHub.
- **`main` = LIVE STORE.** Shopify auto-deploys `main` to the published theme at zalvashape.com. A broken push to `main` breaks the live store.
- **`dev` = PREVIEW.** Connected to an unpublished theme in Shopify for previewing.

Rules:
1. **All work happens on `dev`.** At the start of a session run `git status` and `git checkout dev`, then `git pull`.
2. Commit with clear conventional messages: `feat: ...`, `fix: ...`, `refactor: ...`, `docs: ...`.
3. After each task: commit and push to `dev`, then tell Denny to check the preview theme.
4. **Only merge `dev` into `main` when Denny explicitly says so** (e.g. "publícalo", "súbelo a la tienda", "pásalo a main"). Then: `git checkout main && git pull && git merge dev && git push && git checkout dev`.
5. **NEVER:** `git push --force`, `git reset --hard`, rewrite history, delete branches, or delete files unrelated to the task. Never commit secrets, API keys, or tokens.
6. If `git push` fails, stop and explain the error in Spanish. Do not try to work around authentication.
7. Save all files as **UTF-8 without BOM**.

---

## 3. Project overview

- **Brand:** Zalva Shape LLC (Texas). Premium shapewear, US market, Skims-inspired aesthetic.
- **Domain:** zalvashape.com (Cloudflare, SSL active).
- **Stack:** Shopify Basic + GitHub auto-deploy + Skeleton Theme as base.
- **Local path:** `C:\Users\Scraftk\Documents\Zalva Project\Zalva-theme`
- **Apps:** Judge.me (reviews, free), Klaviyo (free plan, not yet wired to forms).
- **Shipping:** Express $15 (1–2 days), Standard $8 (3–5 days), free over $75, US only. Taxes via Shopify Tax.
- **Catalog:** Bodysuits only for now (5–10 models planned). Sizes **XS–XXL only** (never promise 3XL–5XL).

---

## 4. Brand identity (LOCKED)

### Colors
| Name | Hex | Use |
|---|---|---|
| Ivory | `#FAF8F5` | Main background |
| Linen | `#F0E8DF` | Secondary background, default header bg |
| Blush Nude | `#D4B5A0` | Soft accents, text on dark |
| Champagne | `#C8A96E` | CTAs, eyebrows, dividers, accents |
| Warm Taupe | `#A07060` | Secondary text, labels |
| Deep Brown | `#3D2B24` | Body text on light |
| Noir | `#1A1A1A` | Primary text, dark sections |
| Error | `#A04040` | Form errors, remove links (subtle) |

### Typography
- **Cormorant Garamond** Light 200–300 (often italic) → headlines, product names, editorial text.
- **Jost** → body, buttons, UI, eyebrows (eyebrows: 10–11px uppercase, letter-spacing 0.25–0.3em).

### Voice & taglines
- "She wears herself." (hero) · "Sculpted for you." · "Sculpted to feel held." · "For every body."
- Direction: sensual femininity + self-love. Editorial, calm, confident. Premium brands insinuate; they don't over-explain.
- **Honesty rules:** no "Made in Italy", "Sourced in Italy", "Designed in the US", or "mass-produced" claims. No promises we can't keep. No placeholder/"coming soon" links in navigation. No "Wholesale" anywhere (dilutes premium feel).

### Recurring design elements
- Decorative line: 1px × 24–40px Champagne, centered.
- Eyebrow → italic Cormorant headline → Jost subtitle.
- Primary button: Noir bg + Champagne text, Jost 11px uppercase letter-spacing 0.3em; hover → Champagne bg + Noir text.
- Close (X) buttons: rotate 90° + Champagne on hover (and :active on mobile).
- Custom scrollbars: 2px, track `rgba(200,169,110,0.15)`, thumb Champagne, radius 0. Same style everywhere (search dropdown, Cabinet menu, cart drawer).
- Toasts: Noir bg, Ivory text, 1px Champagne border, Jost 11–12px uppercase.

---

## 5. Critical technical patterns (always follow)

1. **CSS scoping:** every section scopes its CSS with a `.zs-*` class (e.g. `.zs-faq`, `.zs-cart-drawer`, `.zs-product`).
2. **Defensive visibility:** animated elements start visible (`opacity:1; transform:none`). IntersectionObserver adds `.is-visible` for the entrance animation, plus a `reveal-settled` fallback after ~1s. On load, if an element is already in the viewport (getBoundingClientRect), apply `reveal-settled` immediately. Never ship content that depends on JS to become visible.
3. **Adaptive header:** every full-width section needs `data-header-bg="#HEX"` and `data-header-text="#HEX"`. The header reads them via IntersectionObserver. Default: Linen bg / Noir text.
4. **Header pull-up (inner pages):** the header is `position: fixed`. `assets/critical.css` defines `--zs-header-stack` (mobile `32px + 72px`, desktop `36px + 96px`) and adds it as body `padding-top`. The first section of inner pages uses `data-zs-page-pull-up` → `margin-top: calc(-1 * var(--zs-header-stack))` and `padding-top: calc(var(--zs-header-stack) + extra)` so its background fills behind the header with no color band. Homepage hero uses `body.zalva-home [data-main-hero-section]`.
5. **iOS zoom:** all inputs/selects/textareas are ≥16px font-size on mobile.
6. **Custom search clear button:** native `::-webkit-search-cancel-button` hidden; replaced by a left-arrow icon button. Applies to header search, FAQ search, and search results page.
7. **Overlays/drawers:** `overscroll-behavior: contain` to prevent scroll chaining.
8. **Shopify schema safety:** NEVER use `\n` inside schema default values — Shopify silently rejects the section. Use comma-separated lists and split with Liquid. Presets use `"category": "Custom"`. If a section exists in the repo but not in Shopify, check the schema first.
9. **Header script lesson:** `sections/header.liquid` runs one IIFE. A single undeclared variable (e.g. a missing `const cfgEl = root.querySelector('[data-zs-search-config]')`) throws and kills MENU, search, and cart. After editing header JS, re-read the whole script for undeclared references.
10. **Touch vs scroll:** interactive drags (like the before/after slider) accept pointer input only on the handle, with `touch-action: pan-y` on the container so the page still scrolls on mobile.
11. **Performance:** `requestAnimationFrame` for scroll/drag work, passive listeners, `loading="lazy"` except above-the-fold (`eager` + `fetchpriority="high"`).

---

## 6. What exists (inventory)

### Homepage (`templates/index.json`, in order)
1. `main-hero` — 100vh, "She wears herself.", `<picture>` desktop/mobile images
2. `brand-statement` — "This isn't about hiding. It's about feeling held."
3. `featured-signature` — Contour Bodysuit editorial spread (Linen)
4. `texture-detail` — 4-image craftsmanship grid ⚠️ copy corrections pending (see §9)
5. `before-after-slider` — "THE TRANSFORMATION", drag-handle only, auto-demo once, labels "without"/"with" (Cormorant italic, Ivory)
6. `category-grid` — triptych
7. `real-women` — rotating testimonials, no faces
8. `size-inclusivity` — Noir, "XS to XXL. No exceptions."
9. `editorial-cta` — "It starts with how you feel underneath."
10. `brand-marquee` — "SCULPTED · SUPPORTED · SEEN"

### Global
- **Header** (`sections/header.liquid`): fixed, 3 columns (MENU / logo / search-account-bag), handbag cart icon, rotating announcement bar, adaptive colors.
- **Cabinet menu:** desktop 40% nav + 60% hover image preview; primary links larger, secondary smaller (Deep Brown). Mobile: card layout (Bodysuits, Waist Trainers, Fajas, Shop All) + secondary links (The Story, Size Guide, FAQ, Contact) + Editor's Pick + tagline + socials. Sticky top bar with close.
- **Search dropdown:** expands from header, popular searches + quick links, live results via `/search/suggest.json` (300ms debounce), compact horizontal cards, sticky input, auto-scroll to top when typing, Champagne progress scrollbar.
- **Footer** (`sections/footer.liquid`): Zone 1 newsletter (Noir, placeholder — wire to Klaviyo later), Zone 2 link map (Linen, 4 columns), Zone 3 signature (Noir, rotating tagline, payment icons). Back-to-top button. Email click copies to clipboard.
- **Cart drawer** (`sections/cart-drawer.liquid`): slide from right, 480px desktop / 88vw mobile, free-shipping progress bar ($75), AJAX cart, compact sticky bottom on mobile. **Adding to cart never auto-opens the drawer** → toast "Added to bag · VIEW BAG →" + cart icon pulse.

### Pages
- **Search results** (`main-search`): persistent search bar, product grid, sort, empty state.
- **Size Guide** (`main-size-guide`): how to measure, chart XS–XXL with inches/cm toggle, between sizes, promise.
- **FAQ** (`main-faq`): 18 questions, 6 category chips (fade out after 60% of the list and while searching; horizontal scroll on mobile), smart multi-word search with `data-faq-keywords`, one-open accordion, 3 contextual CTAs.
- **Contact** (`main-contact`): 3 cards (email copy-to-clipboard, Instagram, form), FAQ strip, Shopify contact form (subjects: Order Issues, Sizing Help, Returns & Exchanges, Other), smooth scroll to form.
- **404** (`main-404`): Linen, giant "404", "Lost in transition."
- **Product page** (`main-product`): architecture built with 8 zones (hero + gallery, The Details, Crafted For, Reviews/Judge.me, Find Your Fit, Pairs Well With, Multi-Outfit placeholder (hidden), Product FAQ). Desktop gallery shows ONE image at a time, thumbnails swap it, NOT sticky. Mobile: carousel with dots.

---

## 7. Product system

### Metafields (Shopify Admin → Settings → Custom data → Products) — to be created with the first real product
- `custom.short_description` (single line, ~120 chars)
- `custom.compression_level` → `Light` | `Medium` | `Strong` (drives the 3-bar indicator; default Medium)
- `custom.coverage` → `Light` | `Mid` | `Full`
- `custom.fabric_care` (multi-line)
- `custom.details` (multi-line)
- `custom.color_hex` (per variant, optional)
Always use `| default:` fallbacks in Liquid.

### Compression indicator
3 horizontal bars, Champagne active / taupe inactive. Must also appear later on collection page product cards.

### Silhouette color selector
Buttons use an editorial line-art silhouette image as a CSS mask filled with the variant color:
`https://cdn.shopify.com/s/files/1/0998/1086/9562/files/kive-image-1779405324889.png?v=1779405135`
Color fallback map: Beige/Beige Nude `#D4B5A0`, Cocoa `#6F4E37`, Noir/Black `#1A1A1A`, Ivory `#FAF8F5`, Champagne `#C8A96E`, Warm Taupe `#A07060`, Deep Brown `#3D2B24`.
Should become a reusable snippet (`snippets/color-silhouette.liquid`) for collection cards, search results, cart drawer.

---

## 8. Images & Kive

Kive is connected through MCP (`.mcp.json` → `https://mcp.kive.ai/mcp`). Generated images must be uploaded to Shopify Files and referenced by `cdn.shopify.com` URL.

### Current assets
- Hero desktop: `https://cdn.shopify.com/s/files/1/0998/1086/9562/files/GENERA_1.png?v=1778876800`
- Hero mobile: `https://cdn.shopify.com/s/files/1/0998/1086/9562/files/Hero_banner_mobile_2.png?v=1778879980`
- Before (mobile test): `https://cdn.shopify.com/s/files/1/0998/1086/9562/files/Prueba_Before_1.png?v=1779046754`
- After (mobile test): `https://cdn.shopify.com/s/files/1/0998/1086/9562/files/Prueba_After_1.png?v=1779074765`

### Kive rules learned
- Content filters: avoid "shapewear", "sensual", "bodysuit" alone. Prefer "seamless top and matching bottoms", "elegant", "like high-end ready-to-wear brands".
- Ratios: 16:9 hero desktop, 9:16 hero mobile, 4:5 product/category/before-after.
- Consistency workflow: generate ONE image (1 variation), approve it, then use it as the reference for its counterparts (back, side, detail, before/after). Never generate a pair in one batch.
- Always set the aspect ratio BEFORE generating.
- Our model is slim, so before/after differences are subtle; a curvier model may be needed.
- Explore Kive's trained face/character model to keep the same model across all images.

---

## 9. Backlog (update as items are done)

### Content corrections (honesty — do soon)
- [ ] Remove "Sourced in Italy" caption (texture-detail image #1)
- [ ] Remove "Made in Italy" from featured-signature description
- [ ] Replace "Nothing about this is mass-produced." in texture-detail

### Waiting on Denny
- [ ] First real product (photos, specs, variants) → create metafields, test product page, refine
- [ ] Define bodysuit sub-categories → collections → final menu → category/menu images in Kive
- [ ] Classic vs New Customer Accounts decision (recommended: Classic, for full design control). Then rebuild Login/Register/Dashboard/Orders/Addresses/Reset. Member benefits are functional only (early access, track orders, save favorites, faster checkout, member previews) — no discount promise yet.
- [ ] Before/After feedback from testers; desktop before/after images
- [ ] About / The Story — ask Denny deep questions first (why Zalva, breaking point, industry frustrations, materials/sourcing, inspiration, what the brand is NOT)
- [ ] Logo: transparent PNG for header
- [ ] IRS Letter 147C → update Shopify Payments registered name (currently "DUOMO USA LLC")

### Future sessions
- [ ] Collection page redesign (with compression indicator on cards)
- [ ] Adaptive header audit across every page (data attributes, pull-up, no color bands)
- [ ] Mobile optimization pass (80%+ traffic)
- [ ] Klaviyo Pro: welcome series, abandoned cart, post-purchase, browse abandonment, wire footer newsletter, member discount + loyalty tiers
- [ ] Google Analytics + Meta Pixel (before paid traffic)
- [ ] hello@zalvashape.com forwarding (Cloudflare Email Routing)
- [ ] Multi-outfit transformation slider on product page
- [ ] When 20+ products: search filters, sort chips, recently viewed in search dropdown, "You might also love" in cart drawer (only when 1 item)
- [ ] Final polish pass of the whole site
