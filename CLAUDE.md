# CLAUDE.md — Zalva Shape Shopify Theme

> **For any strategy, design, brand, or decision session, also read `ZALVA_PLAYBOOK.md`. Its §2 Memory protocol is mandatory in every session.**

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

- **Brand:** Zalva Shape LLC (Texas). Premium shapewear, US market, premium editorial aesthetic — differentiated from Skims (not a Skims look-alike).
- **Domain:** zalvashape.com (Cloudflare, SSL active).
- **Stack:** Shopify Basic + GitHub auto-deploy + Skeleton Theme as base.
- **Local path:** `C:\Users\Scraftk\Documents\Zalva Project\Zalva-theme`
- **Apps:** Judge.me (reviews, free), Klaviyo (free plan, not yet wired to forms).
- **Shipping:** Express $15 (1–2 days), Standard $8 (3–5 days), free over $75, US only. Taxes via Shopify Tax.
- **Returns: NOT final.** Working proposal (Oct 2026): free size exchanges; returns with shipping paid by the customer; only unworn items with tags and hygienic liner intact. Denny will confirm the exact policy before launch — don't hardcode new return promises until then; when confirmed, update every mention (announcement bar, cart drawer, product trust line, FAQ, Size Guide "Our promise", policies).
- **Catalog:** Bodysuits only for now (5–10 models planned). Sizes **XS–XXL only** (never promise 3XL–5XL).
- **Collections:** `bodysuits` (manual, created Oct 2026, contains only Contour Bodysuit) is the temporary umbrella collection. Final collections (how many, segmentation, names, concepts) will be defined in a dedicated session when Denny brings his material. Until then, nav links only to `/collections/bodysuits` and Shop All.

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
  - No invented testimonials or reviews, not even as placeholders (also illegal under the FTC rule since 2024). Use a neutral brand message instead.
  - No "was" prices that were never charged; no permanent SALE badges.
  - No promises beyond the written policies (returns, shipping).
  - AI imagery is fine for mood/editorial. Any "result" or "transformation" must be real or clearly marked as illustrative.

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
11. **Links to the FAQ (RULE):** every link into the FAQ from anywhere in the store (footer, product page, cart, policies…) must target its category: `/pages/faq#<category>`. Categories: `sizing-fit`, `compression`, `shipping-returns`, `care-materials`, `orders-payment`. On arrival the FAQ selects that chip, centers it in the mobile row, and scrolls smoothly to the questions under the sticky bar. Inside FAQ answers, use `data-zs-faq-jump-category="<category>"` buttons (same behavior). A new category needs a chip with `data-zs-faq-category` and items with `data-faq-category`.
12. **Performance:** `requestAnimationFrame` for scroll/drag work, passive listeners, `loading="lazy"` except above-the-fold (`eager` + `fetchpriority="high"`).

---

## 6. What exists (inventory)

### Homepage (`templates/index.json`, in order)
1. `main-hero` — 100vh, "She wears herself.", `<picture>` desktop/mobile images
2. `brand-statement` — "This isn't about hiding. It's about feeling held."
3. `featured-signature` — Contour Bodysuit editorial spread (Linen)
4. `texture-detail` — 4-image craftsmanship grid ⚠️ copy corrections pending (see §9)
5. `before-after-slider` — "THE TRANSFORMATION", drag-handle only, auto-demo once, labels "without"/"with" (Cormorant italic, Ivory). Uses AI test images. Denny keeps it for now; pending: small "Illustrative image" note (see playbook §6).
6. `category-grid` — triptych. **Hidden** (`"disabled": true` in `index.json`) until the real collections are defined; its schema defaults still point to Waist Trainers / Fajas — update them in the collections session.
7. `real-women` — rotating testimonials, no faces ⚠️ testimonials are invented → decided: hide the section (don't delete) until real reviews exist
8. `size-inclusivity` — Noir, "XS to XXL. No exceptions."
9. `editorial-cta` — "It starts with how you feel underneath."
10. `brand-marquee` — "SCULPTED · SUPPORTED · SEEN"

### Global
- **Header** (`sections/header.liquid`): fixed, 3 columns (MENU / logo / search-account-bag), handbag cart icon, rotating announcement bar, adaptive colors.
- **Cabinet menu:** desktop 40% nav + 60% hover image preview; primary links larger, secondary smaller (Deep Brown). Mobile: card layout (Bodysuits hero card + Shop All strip card; Waist Trainers / Fajas removed Oct 2026 until those collections exist) + secondary links (The Story, Size Guide, FAQ, Contact) + Editor's Pick + tagline + socials. Sticky top bar with close.
- **Search dropdown:** expands from header, popular searches + quick links, live results via `/search/suggest.json` (300ms debounce), compact horizontal cards, sticky input, auto-scroll to top when typing, Champagne progress scrollbar.
- **Social icons** (`snippets/zs-social-links.liquid`): used in footer + Cabinet menu (mobile and desktop). URLs live in Theme settings → Social media (`settings.social_instagram_url`, `social_tiktok_url`, `social_pinterest_url`); an icon renders only when its URL is set. Never hardcode social links or use `#`.
- **Footer** (`sections/footer.liquid`): Zone 1 newsletter (Noir; ⚠️ not wired — emails are lost, audit priority #3), Zone 2 link map (Linen, 4 columns), Zone 3 signature (Noir, rotating tagline, payment icons). Back-to-top button. Email click copies to clipboard.
- **Cart drawer** (`sections/cart-drawer.liquid`): slide from right, 480px desktop / 88vw mobile, free-shipping progress bar ($75), AJAX cart, compact sticky bottom on mobile. **Adding to cart never auto-opens the drawer** → toast "Added to bag · VIEW BAG →" + cart icon pulse.

### Pages
- **Search results** (`main-search`): persistent search bar, product grid, sort, empty state.
- **Size Guide** (`main-size-guide`): how to measure, chart XS–XXL with inches/cm toggle, between sizes, promise. Chart redesigned Oct 2026: fits the screen on mobile (no sideways scroll, `table-layout: fixed`), max 760px on desktop; tap/click a row to highlight it (Linen + Champagne inset line). **"Find my size"** finder above the chart: bust/waist/hips → recommended size + highlighted row; reads ranges from the table's `data-in`/`data-cm` (single source of truth — to change measurements, edit only the table cells). Rules: fullest point wins (largest size needed); within 0.5in/1cm of a shared edge = "between" (smaller = more sculpting, larger = more comfort); above XXL = honest "above our current range" (never promise more sizes); inputs convert when switching units.
- **FAQ** (`main-faq`): 18 questions, 6 category chips. Mobile chip row scrolls sideways with a 128×3px Champagne progress line under it. Once per page view (mobile, not on deep links, not with reduced motion) the chips glide in from the right one after another (1000ms each, 80ms stagger, cubic-bezier(0.22,1,0.36,1)) and the progress line rides along — the hint that the row continues to the right. The `is-entering` class is added by an inline script right after the chips (before first paint) to avoid a load "blink"; the main script only removes it when the line's animation ends. ✅ Approved by Denny on his phone (Oct 2026). Chip centering and deep-link page scroll use a custom eased tween (easeInOutCubic, 650ms chips / 1100ms page) — softer than native smooth scroll; user touch/wheel cancels it. The "slide left and back" nudge was tried and rejected by Denny (felt abrupt). (fade out after 60% of the list and while searching; horizontal scroll on mobile), smart multi-word search with `data-faq-keywords`, one-open accordion, 3 contextual CTAs.
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

### Current priorities (Oct 2026 audit — do in order; no big new features until 1–5 are done)
1. [x] Fix broken links ✅ Oct 2026: Bodysuits collection created; Waist Trainers/Fajas removed from menu, search and homepage; footer "Shipping & Returns" → `/pages/faq#shipping-returns` (temporary, switch to policy pages in #4); social icons now come from Theme settings → Social media (Instagram set; TikTok exists but Denny must paste its link there; no Pinterest account yet)
2. [ ] Hide invented testimonials (`real-women`)
3. [ ] Connect the footer newsletter to Klaviyo (today the form shows "Thanks!" but discards the email)
4. [ ] Publish the 3 legal policies (returns, shipping, terms) and align every promise with them (replace "Free 30-day returns" sitewide, including FAQ answers). Status Oct 2026: only Privacy policy exists (Shopify automated). Return & refund, Terms of service, Shipping, Contact information, Legal notice and return rules are all empty. Claude drafts in English → Denny pastes in Admin → Settings → Policies → point footer "Shipping & Returns" to `/policies/shipping-policy` and `/policies/refund-policy`.
5. [ ] Clean the product page: broken encoding + BOM in `main-product.liquid`/`header.liquid`, Judge.me placeholder text, hide test product "Bodysuit model 02 (rose)", "2XL" → "XXL"
6. [ ] Replace stock (Unsplash) photos; remove "Sourced in Italy" (texture-detail #1), "Made in Italy" (featured-signature), "Nothing about this is mass-produced." (texture-detail)
7. [ ] Sticky "Add to bag" on mobile + shopping CTA visible in the hero
8. [ ] Collection page redesign in Zalva style (with compression indicator on cards)
9. [ ] Before/after "Illustrative image" note; price/SALE badge (pending Denny's pricing table)
10. [ ] Favicon, social share image, gradual technical cleanup (centralize colors; split the header carefully and last)

### Before launch (Denny will provide — then update everything that depends on it)
- [ ] Official size measurements (bust/waist/hips per size, inches + cm) — current Size Guide numbers are NOT confirmed (the "Find my size" finder uses them too; update only the table cells in `main-size-guide.liquid`)
- [ ] Final returns/exchanges policy → then write the 3 policies and align all promises (priority #4)
- [ ] Whether all bodysuits share one size chart or each model has its own

### To review later
- [ ] Size chart redesign + "Find my size" built Oct 2026 — waiting for Denny's review on the dev preview (mobile + desktop)
- [ ] Later: reuse the size finder on the product page next to the size selector
- [ ] Priority #4 add-ons (agreed Oct 2026): footer "Shipping & Returns" keeps going to the FAQ (friendlier); add a discreet legal line in the footer's Noir zone (Shipping Policy · Return Policy · Terms · Privacy) for Google/Meta/payment compliance; at the end of the FAQ "Shipping & Returns" category add "Read our full Shipping Policy →" / "Return Policy →" links (links, not chips — chips only filter). FAQ answers must be short, faithful summaries of the policies.
- [ ] TikTok link: Denny pastes it in Theme settings → Social media when he has it (the icon appears automatically)
- [ ] `snippets/color-silhouette.liquid` already exists — check whether it is actually used (product page, collection cards, search, cart drawer) or half-done

### Waiting on Denny
- [ ] First real product (photos, specs, variants) → create metafields, test product page, refine
- [ ] Define bodysuit sub-categories → collections → final menu → category/menu images in Kive
- [ ] Classic vs New Customer Accounts decision (recommended: Classic, for full design control). Then rebuild Login/Register/Dashboard/Orders/Addresses/Reset. Member benefits are functional only (early access, track orders, save favorites, faster checkout, member previews) — no discount promise yet.
- [ ] Before/After feedback from testers; desktop before/after images
- [ ] About / The Story — ask Denny deep questions first (why Zalva, breaking point, industry frustrations, materials/sourcing, inspiration, what the brand is NOT)
- [ ] Logo: transparent PNG for header
- [ ] IRS Letter 147C → update Shopify Payments registered name (currently "DUOMO USA LLC")

### Future sessions
- [ ] Adaptive header audit across every page (data attributes, pull-up, no color bands)
- [ ] Mobile optimization pass (80%+ traffic)
- [ ] Klaviyo Pro: welcome series, abandoned cart, post-purchase, browse abandonment, member discount + loyalty tiers (footer newsletter wiring is priority #3 above)
- [ ] Google Analytics + Meta Pixel (before paid traffic)
- [ ] hello@zalvashape.com forwarding (Cloudflare Email Routing)
- [ ] Multi-outfit transformation slider on product page
- [ ] When 20+ products: search filters, sort chips, recently viewed in search dropdown, "You might also love" in cart drawer (only when 1 item)
- [ ] Final polish pass of the whole site
