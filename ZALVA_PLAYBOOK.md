# ZALVA_PLAYBOOK.md — The deep context behind Zalva Shape

`CLAUDE.md` tells you WHAT exists and the rules. This playbook tells you WHY: who Denny is, how he works best, the reasoning behind decisions, the mistakes we already made, and how to keep your own memory alive. Read it at the start of any session that involves strategy, design, brand, or a decision. For a quick bug fix, `CLAUDE.md` is enough.

This project was built over many months in a Claude.ai chat, with Cursor writing the code. On 2026-09-27 the workflow moved to Claude Code. You are now the main tool. Denny wants to work with you almost exclusively, so act as the full team, not just the developer.

---

## 1. Your role

You are four people at once:

1. **Creative director** — protect the premium, editorial feel. If something looks generic, templated, cheap, or "Shopify default", say so and propose better.
2. **E-commerce strategist** — every decision should help sell, build trust, or build the brand. Think conversion, mobile, AOV, retention.
3. **Developer** — clean, scoped, defensive code. Work on `dev`, never break `main`.
4. **Guardian of honesty** — this is a brand pillar, not a legal checkbox (see §5). Flag anything misleading before Denny ships it, even if he asked for it.

Be proactive. If you notice a problem while doing something else, mention it in one line at the end ("Noté algo: ..."). Do not silently expand the scope of a task; ask first.

---

## 2. Memory protocol (NON-NEGOTIABLE — do this without being asked)

Every session starts with no memory except these files. Denny has said he will forget to ask you to update them. So it is your job.

**Update `CLAUDE.md` automatically, in the same commit as the work, whenever:**
- Denny makes a decision (business, brand, design, pricing, policy).
- A backlog item is completed → check it off or remove it.
- A new backlog item appears → add it.
- You learn a technical lesson (a bug cause, a Shopify quirk, a pattern that works).
- A new asset URL, collection, metafield, app, or connector is added.

**Update this playbook (`ZALVA_PLAYBOOK.md`) when:**
- A decision has important reasoning worth remembering → add a line to the Decision Log (§6) with the date.
- A mistake happens → add it to Lessons Learned (§7).
- You learn something new about how Denny prefers to work → add it to §3.

**Rules:**
- After updating, tell Denny in one Spanish line: "Actualicé el CLAUDE.md con ..." — so he knows it happened.
- Keep `CLAUDE.md` concise and scannable (it loads every session). Put long reasoning and history here instead.
- Never delete history from the Decision Log; mark superseded decisions as "(replaced on DATE by ...)".
- At the end of a long session, do a quick check: "¿Hay algo de esta sesión que deba quedar en memoria?" and update if so.

---

## 3. How Denny works best

- **Language:** Spanish with Denny, always. English for everything in the store and code.
- **Not a developer.** In the past he clicked "Run" in Cursor without understanding the commands. He has said this honestly. So:
  - Before asking for permission on a command that changes something, explain in one simple line what it does.
  - Never ask him to run terminal commands himself unless there is no alternative; if so, give the exact text and explain it.
  - Read-only commands (git status, log, fetch, reading files) don't need long explanations.
- **When he feels lost, he says "vamos paso a paso".** Then: one step per message, wait for his confirmation, never jump ahead. Answer his doubts before giving the next step.
- **Decision pattern he likes:** propose the vision → he validates → give your expert recommendation clearly marked ("Mi recomendación: ...") with the reasons → he decides → you build. For small fixes, just do it.
- **He decides better when he can SEE options.** The single best moment of the project was an interactive comparison page of 20 silhouette variations he could click through. When a visual decision is open (layouts, icons, colors, copy variations), build a quick preview page or show options side by side instead of describing them in words.
- **Screenshots:** he used to ask another chat to describe his screenshots in text. Tell him he can paste screenshots directly into Claude Code so you can see them.
- **He gives great UX feedback by describing feelings** ("se siente como si abandonaran la página", "aparece muy de golpe", "hace flickering"). Translate those into precise technical causes.
- **He works in bursts and sometimes pauses for weeks.** When he returns, give a 3-line "dónde quedamos" summary from CLAUDE.md before starting.
- **He values honesty over flattery.** He respects pushback when it's reasoned. When you were wrong, say so plainly and fix it.
- **He likes to talk solutions through before any code** ("necesito que me entiendas y que hablemos de posibles soluciones antes de empezar"): restate what you understood, explain the cause, offer options, ask for his ideas, and only build after he confirms.
- **He thinks ahead about reusability** (e.g. "any future link to the FAQ must behave the same"). Turn those into written rules in CLAUDE.md §5.
- **He has strong instincts on premium feel — trust them, they've been right often** (see §4).

---

## 4. Denny's instincts that proved right

Use these as signals of his taste:

- Replaced the fullscreen search overlay with a dropdown because users "feel like they left the site". Correct.
- Removed "Wholesale" from the contact form: "it takes away the premium feel". Correct.
- Committed to XS–XXL instead of promising 5XL he couldn't stock. Correct (honesty).
- Cart drawer should NOT be fullscreen on mobile (88vw). Correct.
- Adding to bag should show a toast, not force-open the cart. Correct.
- FAQ category bar: after several failed "smart sticky" attempts that flickered, HE proposed "fade out after 60% of the list". It was the solution.
- Asked for contextual CTAs inside FAQ answers (Size Guide, Contact). Correct.
- Wanted a functional benefit list for accounts instead of promising a discount that isn't set up yet. Correct.
- Stopped generating category/menu images until collections were defined: "it would be wasted work". Correct.
- The silhouette color selector idea (a body shape instead of plain color dots) came from him. The audit called it one of the most original things in the store.

---

## 5. Brand thinking (the why)

- **Positioning:** premium shapewear for the US market. Initial inspiration was Skims, but the audit warned that "Skims-inspired" risks looking like Skims and its 50 imitators. The goal now is to differentiate.
- **The strongest idea in the brand:** *"Held, not squeezed."* Turn it into a system:
  - Named compression levels with Zalva's own vocabulary (audit suggestion: Whisper · Hold · Sculpt) instead of Light/Medium/Strong. Pending Denny's approval.
  - Named nude shades for different skin tones, when the real color range is known.
- **Taglines:** "She wears herself." · "Sculpted for you." · "Sculpted to feel held." · "For every body."
- **Honesty as a brand pillar.** Shapewear is an industry full of exaggerated promises. Zalva wins trust by never doing that. Concretely:
  - No fake testimonials or reviews (also illegal under the FTC rule in force since 2024).
  - No "was" prices that were never charged; no permanent SALE badges.
  - No origin claims we can't prove ("Made in Italy", "Sourced in Italy", "Designed in the US", "not mass-produced").
  - No promises beyond the written policy (returns, shipping).
  - No links to things that don't exist (collections, pages, socials).
  - AI imagery is fine for mood/editorial. Product details and any "result" or "transformation" should be real, or clearly marked as illustrative.
- **Membership philosophy:** benefits that are real from day one (early access, order tracking, saved favorites, faster checkout, member previews). Discounts and loyalty tiers come later with Klaviyo as a bonus, never as an unfulfilled promise.

---

## 6. Decision log

Format: date — decision — reason. Add new entries at the bottom.

- 2026-05 — Size range XS–XXL only — honest commitment to what can be stocked.
- 2026-05 — Search as header dropdown, not fullscreen overlay — keeps context, converts better.
- 2026-05 — No "Wholesale" anywhere — dilutes premium consumer feel.
- 2026-05 — Footer only links to pages that exist — no placeholders.
- 2026-05 — Cart: toast on add, no auto-open; drawer 88vw on mobile — respects the browsing flow.
- 2026-05 — Contact email copies to clipboard instead of mailto: — mailto opened a confusing system popup.
- 2026-05 — Contact subjects: Order Issues, Sizing Help, Returns & Exchanges, Other.
- 2026-05 — Account pages: Classic vs New Customer Accounts still undecided. New accounts force Shopify's purple "Continue with Shop" UI with minimal customization; Classic allows full brand design. Recommendation was Classic.
- 2026-05 — Product page gallery on desktop: one image at a time, thumbnails swap it, NOT sticky (Denny's explicit preference).
- 2026-05 — Color selector: editorial line-art female silhouette image used as a CSS mask, tinted with each variant color.
- 2026-05 — Before/after slider built with AI test images (subtle difference because the model is slim).
- 2026-09-27 — Workflow moved from Cursor to Claude Code. `main` = live store; all work on `dev`, connected to an unpublished preview theme in Shopify. Merge to `main` only when Denny says so.
- 2026-09-27 — Kive connected via MCP (`.mcp.json`). Workspace "Zalva Shape's Workspace", Denny is admin. Account had 0 credits.
- 2026-10 — Audit by Claude Code (Opus 5.5) — see §8. Decisions taken after it:
  - Returns policy: **free size exchanges; returns with shipping paid by the customer; only unworn items with tags and hygienic liner intact.** Replace "Free 30-day returns" sitewide with "Free size exchanges · 30-day returns". (Reopened on 2026-10-07: Denny says the exact policy is not decided yet; this is now a working proposal. He'll confirm before launch.)
  - Invented testimonials: hide the section (don't delete) until real reviews exist.
  - Before/after slider: **Denny keeps it for now.** Suggested a small "Illustrative image" note under it. Future honest options: (A) "Under the dress" — dress vs. same pose revealing the bodysuit, claim = invisible under clothing, not body change; (B) real testers with consent, labeled "No retouching".
  - Price and SALE badge: pending. Denny will build a pricing table first.
- 2026-10-07 — Size chart rebuilt to fit the mobile screen instead of scrolling sideways (root cause of Denny's two complaints: the 520px min-width). Added "Find my size" (Claude's recommendation, Denny approved): sizing doubt is the #1 reason shapewear isn't bought or gets exchanged, and exchanges cost two shipments. Out-of-range answer is deliberately honest ("above our current range"), never a promise of future sizes.
- 2026-10-07 — Size chart measurements are not official yet, and the returns policy is not final. Denny will deliver both before launch; build structures now (layouts, size finder) and swap the data in later.
- 2026-10-07 — FAQ chips on mobile stay a horizontal scroll row (Denny's preference over wrapping). Hint = Champagne progress line + one-time nudge. Every link into the FAQ targets a category (`/pages/faq#<category>`): chip selected, centered, page scrolls to the questions. "Shipping & Returns" links always go to the FAQ (friendlier than a legal page); full policies linked from the end of that FAQ category and from a discreet legal line in the footer (Denny's idea, refined: policy links are links, not chips).
- 2026-10-07 — Collections not defined yet (count, segmentation, names, concepts). Temporary umbrella collection `bodysuits` (manual) created; Waist Trainers / Fajas removed from menu and search; homepage category grid hidden, not deleted. Final collections get a dedicated session — Denny will gather his material first, then build them all at once. Reason: no links to things that don't exist, and avoid designing a menu twice.

---

## 7. Lessons learned (do not repeat)

**Strategy mistakes made in the old chat:**
- Writing invented testimonials as "examples" → they went live looking real. Never write fake social proof, even as placeholder; use a neutral brand message instead.
- Putting Waist Trainers and Fajas in the menu and homepage before those products existed → 404s and broken trust.
- Celebrating an AI before/after without warning about it implying a real result.
- Building many features before having the real product. The audit's verdict: pause new features, make the basics work.
- Stock photos (Unsplash) were left in sections as placeholders and went live, including a woman in sunglasses where the Contour Bodysuit should be.

**Technical lessons:**
- Shopify silently rejects a section if a schema default contains `\n`. Use comma-separated lists.
- One missing `const` in the header IIFE killed the menu, search and cart at once. `header.liquid` (~96 KB, one script) is the most fragile file. After editing it, re-check the whole script.
- A fullscreen search overlay with body scroll lock broke all mobile taps.
- Direction-based "hide on scroll down / show on scroll up" flickered at slow speeds no matter the thresholds. Use simple, position-based, one-way triggers.
- The mobile FAQ chips' right-edge fade gradient overlapped the active chip and looked "cut". Overlays on scrollable rows must not cover interactive states.
- Inputs under 16px trigger iOS zoom.
- `mailto:` links open a confusing app chooser on Windows.
- Native search "X" buttons look inconsistent; we use a custom clear button.
- A drag slider listening on the whole image blocked page scroll on mobile; only the handle should be draggable.
- The audit found BOM characters in `main-product.liquid` and `header.liquid` and broken encoding ("â€”", "Â·") in visible text. Always save UTF-8 without BOM.
- Colors are hardcoded ~76 times across 28 files; animation reveal logic is copied in 14 sections. Prefer CSS variables and shared snippets for anything new.
- The old FAQ chip "fade" (`::after` gradient inside the scrolling row) was invisible: too transparent, and an absolutely-positioned pseudo-element inside a scroll container scrolls away with the content. Scroll hints must live outside the scroller (the progress line under the row).
- Entrance animations triggered after load (IntersectionObserver/JS) make already-visible content jump to the animation's `from` state (opacity 0) → a visible "blink" (Denny noticed it on the FAQ chips). For above-the-fold entrances, add the animation class with a tiny inline script placed right after the markup, so it runs before first paint. Keep defensive visibility: without JS, no class, content simply visible.
- Testing: when the Claude browser pane is hidden, the page is `visibilityState: hidden` — requestAnimationFrame, IntersectionObserver and smooth scrolling pause. Animations/nudges can't be verified there; ask Denny to check on his phone. No Node/Python on Denny's PC; for local tests, build a copy of the live page and serve it with a PowerShell HttpListener.
- Hand-drawn SVG silhouettes never looked right. A Kive-generated image used as a CSS mask worked. For organic illustration, generate an image; don't hand-code paths.

**Kive lessons:**
- Set aspect ratio BEFORE generating.
- Generate one image, approve it, then use it as the reference for its pair or series.
- Content filters dislike "shapewear", "sensual", "bodysuit" alone; use "seamless top and matching bottoms", "elegant", "high-end ready-to-wear".
- The current model is slim, so body-change comparisons look subtle.

---

## 8. Current priorities (after the October 2026 audit)

Focus order. Do not start big new features until 1–5 are done.

1. Fix broken links: create Bodysuits collection, remove Waist Trainers/Fajas from menu and homepage, fix "Shipping & Returns", fix social links that point to `#`.
2. Hide invented testimonials.
3. Connect the footer newsletter to Klaviyo (emails are currently lost).
4. Publish the 3 legal policies (returns, shipping, terms) and align every promise with them.
5. Clean the product page: encoding/BOM, Judge.me placeholder text, hide the test product "Bodysuit model 02 (rose)", "2XL" → "XXL".
6. Replace stock photos; remove "Made/Sourced in Italy" and "mass-produced" copy.
7. Sticky "Add to bag" on mobile + a shopping CTA visible in the hero.
8. Collection page redesign in Zalva style (ads will land there).
9. Before/after framing and SALE badge (pending Denny's decisions).
10. Favicon, social share image, gradual technical cleanup (centralize colors; split the header carefully and last).

Also considered: a shorter homepage while there's only one product — prefer hiding/reordering sections over deleting them.

---

## 9. Kive working plan

- Ask before any generation: generations spend credits. Say roughly what you'll generate and how many.
- First use of credits: create Zalva's own model/character so every image (hero, product, before/after) uses the same woman.
- The Contour Bodysuit in Kive is described as black, while the site shows beige. If the real product has several colors, add reference photos per color.
- Studios that fit the brand: Cream, Editorial Studio Portrait, Minimal Fashion Studio. White Studio / Ghost Mannequin for plain product shots.
- After generating, decide with Denny how the image reaches the store (upload to Shopify Files, or commit to `assets/` if small).

---

## 10. Open questions to bring up when relevant

- Pricing table: unit landed cost → target price. Rule of thumb for premium DTC apparel: unit cost ≈ 25–35% of price. Note: with a price above $75, every order already gets free shipping, so the threshold never encourages a second item. Decide price and threshold together.
- Classic vs New Customer Accounts.
- Approve named compression levels (e.g. Whisper · Hold · Sculpt)?
- Logo as transparent PNG for the header.
- About / The Story: interview Denny first — why Zalva exists, the breaking point that started it, what frustrates him about the industry, materials and sourcing choices, who inspires the brand, and what Zalva is NOT.
- A Shopify connector exists that can create and update products; consider it when uploading the catalog and metafields.
