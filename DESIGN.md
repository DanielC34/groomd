# DESIGN.md — Groomd · Men's Grooming Studio

> **Status:** Revised Draft v1.1 — Milestone 0, Task 0.2
> **Revision note (v1.1, final palette):** The Groomd brand palette is now a locked **four-colour system**: **Vino Oscuro `#44040F`**, **Miel Cremosa `#FBDE9C`**, **Mid Wine `#6B2A33`** and **Light Cream `#FFF3D6`**. The core visual concept is **"Wine on Honey"**. This replaces every earlier palette: the v1.0 Ink/Copper/Bone palette, and the interim v1.1 two-colour version with its warm-white `#FAF7F2` background and extra wine shades. Structure, typography, spacing, layout, booking principles, motion and QA carry over, with colours updated.
> **Authority:** `PRD.md` defines *what* the product does. This document defines *how it looks and feels*. If they conflict, the PRD wins (§25).
> **Out of scope here:** final copy, prices and business details → `CONTENT.md`. Technology → `ARCHITECTURE.md`.
> **Reference note:** no Figma files were available in the workspace. If references are supplied later, check this document against them (§24, D-1).

### Tags used

| Tag | Meaning |
|---|---|
| **[PRD]** | Locked by `PRD.md` / the Talent Forge brief |
| **[LOCKED]** | Locked brand decision (the four-colour palette, Wine on Honey) |
| **[DS]** | Proposed design decision made in this document |
| **[DEFER]** | Deferred to `CONTENT.md`, `ARCHITECTURE.md` or implementation |

---

## 1. Design Overview

### 1.1 Visual direction — "Wine on Honey"
Groomd is designed around one relationship: **deep wine set against warm honey**, with **soft cream** giving the pages room to breathe and **mid wine** adding depth.

- **Vino Oscuro** is the foundation: the header, hero, footer, and the brand's type colour on light surfaces.
- **Miel Cremosa** is the spark: the Book Now action, the logo's full stop, active and selected highlights.
- **Light Cream** is the canvas: most of the page area, and every content-heavy reading surface.
- **Mid Wine** gives depth: hover states, supporting bands and panels, secondary text, subtle hierarchy.

The feel is a well-lit modern Lusaka studio: warm lamps, dark wood and leather, cream walls, focused barbers, a client checking his fade in the mirror. It's rich and confident, but clean, uncluttered, and clearly a barbershop, not a wine label, restaurant or luxury retailer.

**The formula:** simple structure + strong typography + wine-on-honey contrast + excellent photography + polished spacing.

### 1.2 Personality → design expression

| Trait | How it shows up |
|---|---|
| Rich, warm | Deep wine foundation, honey highlights, cream canvas, warm-lit photography |
| Premium without pretension | Generous space, restrained accents, upfront prices, no metallics, crests or script fonts |
| Confident, masculine without aggression | Big Archivo headings in wine (uppercase used selectively for display/page-heading moments), strong contrast, no distressed or "tough" clichés |
| Modern | Flat colour, crisp radius, grotesk type, minimal ornament |
| Welcoming | Cream and honey warmth, friendly copy, smiling barbers and clients |
| Distinctive | Wine on Honey. The honey full stop in **GROOMD.** |

### 1.3 Emotional impression
In three seconds, without reading the name: *"A proper modern barbershop. Premium, warm, clear prices, easy to book."* **Photography and service language say "barbershop"; the palette says "Groomd".**

### 1.4 Design principles
1. **Booking is always one obvious tap away.** Honey is the primary accent for important actions and selected states, with booking as its primary use.
2. **Photography sells the service.** Real cuts, real chairs, real people.
3. **Hierarchy of colour, not equality.** Wine leads, honey highlights, cream breathes, mid wine supports.
4. **One system, repeated.** Shared tokens for colour, type, spacing and radius.
5. **Clarity before decoration.** Booking and legal pages stay calm and legible.
6. **Mobile first.** Design at 360px, then scale up.

### 1.5 What makes it distinctly Groomd
- The **GROOMD.** wordmark, cream letters with a **honey full stop** on wine.
- **The dot motif:** honey on wine, wine on cream. Used for the active nav, eyebrows, the favicon and "today" markers, nothing else.
- **Wine on Honey** as the signature pairing in the moments that matter: the Book button, selected options, the offer, the footer invitation.
- Cream reading surfaces make the richness feel welcoming rather than heavy.

### 1.6 Support for the assessment
- Identity, palette, typography, imagery and layout cover the brief's *Branding & Visual Design* and *Header & Footer* requirements.
- The booking UI (§10–11) makes the booking and calendar journey clear, with states that don't depend on colour.
- Responsive rules (§6, §18) are defined for every PRD test width.
- Contrast is documented (§3.3), and the state rules (§19) support "everything interactive works" and "attention to detail".
- A small system (four brand colours, a few functional colours, two fonts, no effects) keeps it quick to build and polish.

---

## 2. Brand Identity

**Identity = Vino Oscuro + Miel Cremosa + Light Cream + restrained Mid Wine + strong Archivo typography + high-quality grooming photography.** The four-colour palette and the Wine on Honey concept are **[LOCKED]**.

Guardrails: Groomd must read as **premium grooming without pretension**. No wine-bottle, vineyard, restaurant or "luxury house" cues (crests, script fonts, gold foil, serif monograms).

### 2.1 Wordmark [DS]
- **Primary logo (on Vino Oscuro):** `GROOMD.` in **Archivo 800, uppercase, letter-spacing +0.04em**. Letters in **Light Cream `#FFF3D6`** (15.0:1), the full stop in **Miel Cremosa `#FBDE9C`** (12.6:1). Used in the header, footer and mobile menu.
- **On Light Cream / white:** letters and full stop in **Vino Oscuro** (15.0:1 on cream). Honey is never used on cream (1.19:1).
- **On Miel Cremosa** (e.g. the footer invitation band): all **Vino Oscuro** (12.6:1).
- **Descriptor lockup:** the wordmark plus `MEN'S GROOMING STUDIO` (Archivo 600, uppercase, +0.2em, about 28% of cap height, left-aligned). Honey on wine, wine on cream or honey.
- **Mark / favicon `G.`:** a cream "G" with a honey full stop on a Vino Oscuro square with a 6px radius.
- Delivered as outlined SVGs (on-wine and on-light versions) plus the favicon set [DEFER: implementation].
- No scissors, clippers, barber poles, razors, moustaches, crests or badges.

### 2.2 Sizing and usage

| Context | Height | Version |
|---|---|---|
| Desktop header | 24px | On-wine |
| Mobile/tablet header, menu | 20px | On-wine |
| Footer | 28px | Descriptor lockup, on-wine |
| Light pages (404, confirmation) | 32–40px | On-light (wine) |
| Favicon | 16/32/180/512px | `G.` |

- **Minimum size:** 16px high. **Clear space:** at least the height of the "G".
- **Allowed backgrounds:** Vino Oscuro and Mid Wine (on-wine version, cream letters 9.5:1 on Mid Wine). Light Cream, white and Honey (wine version). Never directly on photography.
- Always links Home (accessible name "Groomd — Home").

### 2.3 Misuse (don't)
- Honey logo elements on cream or white.
- Mid Wine letters on Vino Oscuro (1.58:1).
- Stretching, outlines, shadows, gradients, metallic or foil effects.
- Other taglines. In body copy the name is **Groomd** [PRD].

---

## 3. Colour System

### 3.1 Core brand palette [LOCKED]

| Token | Name | HEX | Purpose |
|---|---|---|---|
| `brand-primary` | Vino Oscuro / Wine | **`#44040F`** | Dominant brand colour: header, hero, footer, headings and body text on light, solid buttons, selected fills, links, focus ring on light |
| `brand-accent` | Miel Cremosa / Honey | **`#FBDE9C`** | Primary accent: Book Now/booking CTAs, logo dot, highlights on wine, selected-option fill, active nav, focus ring on wine, the offer |
| `brand-secondary` | Mid Wine | **`#6B2A33`** | Supporting depth: hover for wine buttons, supporting bands and panels, raised surfaces on wine, secondary text on light, hover borders |
| `brand-light` | Light Cream | **`#FFF3D6`** | Primary light background: page canvas, large sections, reading surfaces, primary text on wine |

No other brand colours exist. Everything below is a **functional UI colour** (neutral, state or feedback) and must never be used decoratively.

**Colour discipline:** implementation must **not** invent additional brand colours or arbitrary new shades during development. Use only the four locked brand colours and the functional colours documented in §3.2. Any new colour needs an explicit design decision recorded in this document.

### 3.2 Semantic tokens

**Backgrounds and surfaces**

| Token | Value | Use |
|---|---|---|
| `background` | `#FFF3D6` (brand-light) | Default page background |
| `background-strong` | `#44040F` (brand-primary) | Header, hero panel, page-header bands, footer, modal |
| `background-support` | `#6B2A33` (brand-secondary) | At most one supporting band per page; raised panels on wine; hover rows in the menu |
| `background-accent` | `#FBDE9C` (brand-accent) | **Small or slim areas only:** the footer invitation band, selected options, the offer highlight, badges |
| `surface` | `#FFFFFF` *(functional)* | Cards, form fields, booking panels, summary. Gives practical contrast against cream |
| `surface-muted` | `#F5E9D0` *(functional)* | Disabled fills, empty states, skeletons, reference chip, alternating section bands where cream-on-cream needs separation |

**Text**

| Token | Value | Use |
|---|---|---|
| `text-primary` | `#44040F` (brand-primary) | Headings **and** body on cream, white and honey |
| `text-secondary` | `#6B2A33` (brand-secondary) | Supporting copy, descriptions, labels on cream and white |
| `text-muted` | `#7A5A5F` *(functional)* | Captions, helper text, meta on cream, white and surface-muted |
| `text-on-strong` | `#FFF3D6` (brand-light) | Headings and primary text on wine and mid wine |
| `text-on-strong-accent` | `#FBDE9C` (brand-accent) | Eyebrows, highlights, prices and links on wine and mid wine |
| `text-on-strong-secondary` | `#E8D5CC` *(functional)* | Longer body copy on wine (softer than cream) |
| `text-on-strong-muted` | `#C9A9A5` *(functional)* | Captions and meta on wine only (7.6:1). On mid wine it's 4.8:1 (AA; ≥14px only) |
| `text-on-accent` | `#44040F` / `#6B2A33` | Text on honey: wine for labels/headings, mid wine for supporting text |

**Borders**

| Token | Value | Use |
|---|---|---|
| `border` | `#EBDDC3` *(functional)* | Decorative dividers and card outlines on cream/white |
| `border-strong` | `#8C6E72` *(functional)* | Interactive boundaries on light: inputs, unselected options, slot/date chips (4.15:1 on cream, 4.58:1 on white) |
| `border-hover` | `#6B2A33` (brand-secondary) | Hover boundary on light |
| `border-selected` | `#44040F` (brand-primary) | 2px selected / focus-within boundary on light |
| `border-on-strong` | `#6B2A33` (brand-secondary) | Decorative dividers on wine only (1.58:1, never interactive) |
| `border-on-strong-interactive` | `#FBDE9C` (brand-accent) | Interactive outlines on wine (outline buttons, social buttons) |

**States (functional)**

| Token | Value | Use |
|---|---|---|
| `accent-hover` | `#FDE8B8` | Hover fill for honey buttons (a state shade of Honey, not a new colour) |
| `accent-pressed` | `#F3CF7E` | Pressed fill for honey buttons |
| `primary-hover` | `#6B2A33` (brand-secondary) | Hover fill for wine buttons |
| `success` / `success-tint` | `#1F7A4D` / `#E6F2EC` | Confirmation, success alerts |
| `error` / `error-tint` | `#B3261E` / `#FDECEC` | Error text, borders, icons / error alert and invalid-field background |
| `warning` / `warning-tint` | `#8A5A00` / `#FBF1DC` | Warnings |
| `info` | uses `text-primary` on `surface-muted` | Neutral notices (no extra colour) |
| `focus-on-light` | `#44040F` | 2px ring, 2px offset on cream, white and honey |
| `focus-on-strong` | `#FBDE9C` | 2px ring, 2px offset on wine and mid wine |
| `overlay` | `rgba(68,4,15,0.72)` (brand-primary at 72%) | Modal and menu backdrop |
| `photo-scrim` | brand-primary 0 → 80% linear | Only if text ever sits on a photo (normally avoided). The only gradient |

### 3.3 Contrast

**Verified by the brand team (part of the spec):**

| Pair | Ratio |
|---|---|
| **Wine `#44040F` on Honey `#FBDE9C`** | **12.6:1** |
| **Wine `#44040F` on Light Cream `#FFF3D6`** | **15.0:1** |
| **Mid Wine `#6B2A33` on Honey `#FBDE9C`** | **8.0:1** |
| **Honey `#FBDE9C` on Wine `#44040F`** | **12.6:1** |

**Additional pairs evaluated for this document (WCAG 2.x relative luminance):**

| Pair | Ratio | Verdict / permitted use |
|---|---|---|
| Light Cream on Wine | 15.0 | AAA, any text |
| Light Cream on Mid Wine | 9.5 | AAA, any text |
| Honey on Mid Wine | 8.0 | AAA (honey button hover on mid wine, eyebrows in supporting bands) |
| Mid Wine on Light Cream / White | 9.5 / 10.5 | AAA, secondary text |
| Wine on White | 16.5 | AAA |
| Wine on accent-hover / accent-pressed | 13.7 / 11.1 | AAA (honey button states) |
| Wine on surface-muted `#F5E9D0` | 13.7 | AAA |
| Text-on-strong-secondary on Wine / Mid Wine | 11.7 / 7.4 | AAA |
| Text-on-strong-muted on Wine / Mid Wine | 7.6 / 4.8 | AAA / AA |
| Text-muted on Cream / White / surface-muted | 5.5 / 6.1 / 5.1 | AA |
| Border-strong on Cream / White | 4.15 / 4.58 | ≥3:1 non-text ✓ |
| Error on Cream / White / error-tint | 5.9 / 6.5 / 5.7 | AA |
| Success on Cream / success-tint | 4.8 / 4.6 | AA |
| Warning on Cream / warning-tint | 5.4 / 5.3 | AA |
| Focus ring: Wine on Cream / Honey on Wine | 15.0 / 12.6 | ≥3:1 ✓ |
| ❌ **Honey on Light Cream / White** | **1.19 / 1.31** | **Fails.** No honey text, icons, thin borders or focus rings on light. A honey *fill* on cream must carry wine text **and** a wine border (§8) |
| ❌ **Mid Wine on Wine** | **1.58** | **Fails.** Decorative only (dividers, raised panels). Never text or interactive boundaries |
| ❌ Honey on Cream as adjacent areas | 1.19 | A honey band touching a cream section needs no text across the join, and should be separated by spacing or a wine element to read as intentional |

### 3.4 Colour relationship and proportions

| Role | Colour | Typical share of a page |
|---|---|---|
| Breathing room | Light Cream (+ white surfaces) | **~55–65%** |
| Foundation | Vino Oscuro | **~25–30%** (header, hero or page band, footer) |
| Supporting depth | Mid Wine | **~5–10%** (one supporting band, hovers, secondary text) |
| Accent | Miel Cremosa | **~5–8%** (Book buttons, selected states, dots, one slim band) |

**Usage map**

| Vino Oscuro | Miel Cremosa | Light Cream | Mid Wine |
|---|---|---|---|
| Header, mobile menu, hero panel, page-header bands, footer, modal | Book Now / booking CTAs | Page background | Hover of wine buttons |
| All headings and body text on light | Logo dot and dot motif on wine | Reading surfaces (services, booking, legal) | One supporting band per page (e.g. Home story, Contact hours) |
| Solid buttons (non-booking primary actions) | Active nav, eyebrows and prices on wine | Text on wine | Secondary text on light |
| Selected time/date fills | Selected option fill (with wine border) | Wine-on-cream headings and body | Hover borders on light |
| Focus ring on light | Focus ring on wine | — | Raised panels and dividers on wine |
| Links on light | The footer invitation band, the offer highlight | — | Social button hover on wine |

**Rules of thumb**
- On wine, the highlight is **honey** and text is **cream**. On cream, text is **wine** and the highlight is a **honey fill with a wine edge**.
- **Wine on Honey** is reserved for moments that matter: Book, selected choices, the offer, the footer invitation.
- Content-heavy areas are always cream or white.
- Honey never becomes a full page section except the single slim footer invitation band. Too much honey reads as food or hospitality.
- Mid wine never sits directly against Vino Oscuro as a meaningful boundary. It's too close in value.
- Error red and wine are related hues. **Errors always add an icon, the error tint and message text**, and selected states use fills with ✓, never a lone red-looking outline (§19).

---

## 4. Typography

*(Fonts and scale unchanged from v1.0. Colour assignments updated in §4.3.)*

### 4.1 Fonts [DS]
- **Display / headings:** **Archivo** (600, 700, 800). Sturdy, modern grotesk. Its weight holds up against Vino Oscuro and gives masculine confidence without vintage clichés.
- **Body / UI:** **Inter** (400, 500, 600) with **tabular numerals** for prices, times, dates and references.
- Fallbacks: `Archivo, "Helvetica Neue", Arial, sans-serif` / `Inter, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`.
- Two families, six weights. [DEFER: loading strategy → ARCH]
- No serif or script fonts. They would push the pairing towards wine/restaurant branding.

### 4.2 Type scale (mobile → desktop at ≥1024px; midpoint at 768px)

| Style | Font / weight | Size | Line height | Tracking | Case | Use |
|---|---|---|---|---|---|---|
| `display` | Archivo 800 | 40 → 72px | 1.0 | −0.01em | UPPER | Home hero headline only |
| `h1` | Archivo 800 | 34 → 52px | 1.05 | −0.01em | UPPER | Page titles |
| `h2` | Archivo 700 | 28 → 40px | 1.1 | 0 | UPPER (selective) or Sentence | Section headings |
| `h3` | Archivo 700 | 20 → 24px | 1.25 | 0 | Sentence | Card titles, step titles |
| `h4` | Inter 600 | 17 → 18px | 1.35 | 0 | Sentence | Sub-headings |
| `eyebrow` | Inter 600 | 12 → 13px | 1.2 | +0.16em | UPPER | Label above headings, preceded by the dot "●" |
| `body-lg` | Inter 400 | 18 → 20px | 1.6 | 0 | — | Intros, hero subline |
| `body` | Inter 400 | 16px | 1.6 | 0 | — | Default |
| `body-sm` | Inter 400 | 14px | 1.5 | 0 | — | Card descriptions, footer |
| `caption` | Inter 500 | 12 → 13px | 1.4 | +0.02em | — | Meta, helper text |
| `nav` | Inter 500 | 15px | 1 | +0.01em | Sentence | Header links |
| `button` | Inter 600 | 15px (16 on lg) | 1 | +0.02em | Sentence | Buttons |
| `label` | Inter 600 | 14px | 1.3 | 0 | Sentence | Form labels |
| `input` | Inter 400 | **16px** | 1.4 | 0 | — | Field text (prevents iOS zoom) |
| `price` | Inter 600, tnum | 18 → 20px | 1.2 | 0 | — | Service prices |
| `price-lg` | Archivo 700 | 24 → 28px | 1.1 | 0 | — | Summary price |
| `meta` | Inter 500, tnum | 14px | 1.3 | 0 | — | Durations, slot times |
| `error` | Inter 500 | 14px | 1.4 | 0 | — | Field errors, with an icon |
| `legal-body` | Inter 400 | 16 → 17px | 1.7 | 0 | — | Terms/Privacy, max 68ch |

### 4.3 Colour assignment

| Style | On Light Cream / white | On Vino Oscuro / Mid Wine | On Honey |
|---|---|---|---|
| display / h1 / h2 / h3 | Wine | Cream. One honey-highlighted word/phrase allowed per hero or offer | Wine |
| eyebrow | Wine + wine dot | Honey + honey dot | Mid Wine |
| body / body-lg | Wine | `text-on-strong-secondary` | Wine |
| secondary copy | Mid Wine | `text-on-strong-secondary` | Mid Wine |
| captions / meta | `text-muted` | `text-on-strong-muted` | Mid Wine |
| price | Wine | Honey | Wine |
| links | Wine, underlined; hover Mid Wine | Honey, underlined; hover cream | Wine, underlined |

Using wine for body text (instead of v1.0's near-black) makes the whole cream canvas feel part of the brand while staying at 15.0:1.

### 4.4 Rules
- One `display` per site (Home hero). One `h1` per page.
- **Headings may use uppercase styling selectively, primarily for display/page-heading moments** (`display`, `h1`, and `h2` where it helps). Other headings are sentence case.
- Prose max 65ch. No all caps beyond about 6 words (except display/h1/h2 headings).
- No serif or script fonts. They would push the palette towards wine or restaurant branding.
- Price format `K 250` [DEFER: CONTENT].

---

## 5. Spacing System

*(Unchanged from v1.0.)*

### 5.1 Scale (4px base)

| Token | px | Typical use |
|---|---|---|
| `space-1` | 4 | Icon nudge |
| `space-2` | 8 | Label → field, chip padding |
| `space-3` | 12 | Slot gaps, small stacks |
| `space-4` | 16 | Default gap, mobile card gap |
| `space-5` | 20 | Mobile gutter, compact card padding |
| `space-6` | 24 | Card padding, grid gaps |
| `space-8` | 32 | Heading → content, desktop gutter |
| `space-10` | 40 | Between form sections |
| `space-12` | 48 | Mobile section spacing |
| `space-16` | 64 | Tablet section spacing |
| `space-24` | 96 | Desktop section spacing |
| `space-32` | 128 | Large hero spacing (sparingly) |

### 5.2 Application

| Area | Mobile (<768) | Tablet | Desktop (≥1024) |
|---|---|---|---|
| Section vertical padding | 48 | 64 | 96 |
| Container gutter | 20 | 32 | 32 |
| Eyebrow → heading | 8 | 8 | 12 |
| Heading → intro | 12 | 16 | 16 |
| Section header → content | 32 | 40 | 48 |
| Card padding | 20 | 24 | 24–32 |
| Card grid gap | 16 | 24 | 24 |
| Label → field | 8 | 8 | 8 |
| Field → field | 20 | 24 | 24 |
| Between form sections/steps | 40 | 40 | 40 |
| Button group gap | 12 | 12 | 16 |
| Time-slot gap | 8 | 12 | 12 |

---

## 6. Layout and Grid

*(Unchanged from v1.0 except the hero pattern.)*

### 6.1 Containers
- `container` max 1200px. `container-narrow` max 760px (legal, booking on sm/md, confirmation). `container-wide` full bleed (hero, bands).

### 6.2 Breakpoints

| Name | Range | Columns | PRD widths |
|---|---|---|---|
| `sm` | 0–767 | 4 | 360, 390 |
| `md` | 768–1023 | 8 | 768 |
| `lg` | 1024–1279 | 12 | 1024 |
| `xl` | ≥1280 | 12 (capped 1200) | 1280, 1440 |

Grid gap 16px (sm), 24px (md+).

### 6.3 Standard layouts

| Pattern | sm | md | lg / xl |
|---|---|---|---|
| **Home hero** | Wine text panel (with CTAs) first, photo (4:3) below | Same, photo 16:9 | **Split:** wine panel 5 columns (text left), full-bleed photo 7 columns right |
| Page header band | Wine band, text only | Same | Wine band; optional image at 5 columns on the right |
| Split (image + text) | Stacked, image first | Stacked or 50/50 | 6/6 or 7/5, alternating |
| Service cards | 1 col | 2 col | 3 col |
| Barber cards | 1 col | 2 + 1 centred or 3 compact | 3 col |
| Info cards | 1 col | 2 col | 3 col |
| Booking | Single column + collapsible summary | Single 760px | 8/4, sticky summary |
| Footer | Stacked | 2×2 | 4 col |

### 6.4 Alignment
Left-aligned by default. Centre only short intros and single-CTA bands. Section intros max 60ch. Cards in the same repeated grid should align cleanly; equal heights are preferred where they improve consistency (CTAs pinned to the bottom when heights match).

### 6.5 Overflow prevention (hard rules)
- No fixed widths >320px on elements visible at `sm`.
- Media `max-width: 100%`, sized by aspect ratio.
- Long strings wrap (`overflow-wrap: anywhere`). Grid/flex children can shrink (`min-width: 0`).
- Full-bleed uses 100%, never `100vw`.
- No horizontal scroll at 360px on any page, with the menu or modal open, or at any booking step.

---

## 7. Header and Navigation

### 7.1 Desktop header (≥1024px)
- **Vino Oscuro** background, height **72px**, **sticky**, always solid. Over the wine hero or page band it merges seamlessly. Over cream content it gains `shadow-1`.
- Layout: on-wine logo (left) · nav links (right-grouped, 32px gap) · **Book Now** (honey fill, wine label, `md`).
- Links: Home, Services, About, Contact [PRD]. `nav` style in **Light Cream** (15.0:1). Hover → honey text + 2px honey underline 6px below.
- **Active:** honey text (12.6:1), weight 600, a 6px honey dot beneath, and `aria-current="page"`.
- The header uses exactly three colours (wine, cream, honey), so it reads as rich rather than busy. Honey appears only on the Book button, the logo dot and the active link.

### 7.2 Mobile/tablet header (<1024px)
- Height **64px**, sticky, Vino Oscuro.
- Logo · compact honey **Book Now** (`sm`, 40px high with a 44px tap area) · menu button (48×48, cream icon).
- About 310px of content at 360px, so it fits [PRD 7.1].
- On `/book`: the header Book Now shows its **current** state (transparent, 1.5px honey outline, honey label, `aria-current`) so the flow's own actions lead.

### 7.3 Mobile menu
- Right panel `min(100%, 400px)`, **Vino Oscuro**, `shadow-3`, wine `overlay` behind it.
- Contents: logo + close (✕, 48px, cream) · links in `h3` (Archivo 700, 24px, cream), 56px rows, **Mid Wine** dividers (decorative); row hover/press → Mid Wine fill · full-width honey **Book Now** · phone and hours in `text-on-strong-muted`.
- Active link: honey text + honey dot before it.
- 250ms slide, scroll lock, focus to ✕ and back to the menu button on close. Closes via ✕, overlay, Escape or a link [PRD]. `aria-expanded` kept in sync.

---

## 8. Buttons and CTAs

### 8.1 Variants

| Variant | On Light Cream / white | On Vino Oscuro / Mid Wine | On Honey band | Use |
|---|---|---|---|---|
| **Primary CTA: "Book" (Wine on Honey)** | Honey fill, wine label, **1.5px wine border** (the border is needed because honey vs cream is only 1.19:1) | Honey fill, wine label (12.6:1), no border | *Swaps to Solid Wine* | Book Now, Book this, Book your first visit, **Confirm booking** |
| **Solid Wine** | Wine fill, honey label (12.6:1) | *Not used* (use Outline on wine) | Wine fill, honey label | Non-booking primary actions: Continue, Add to Google Calendar, Try again, Get directions (when primary) |
| **Outline** | Transparent, 1.5px wine border, wine label | Transparent, 1.5px honey border, honey label | 1.5px wine border, wine label | Secondary actions: View services, Add to Apple Calendar, Back to home |
| **Text / link** | Wine, underline on hover (hover colour Mid Wine) | Honey, underline; hover cream | Wine | "Change", "Back", "View all services →" |

**Prominence rules**
- **Honey is the primary accent for important actions and selected states, with booking as its primary use.** Booking CTAs get the strongest use of Honey: the honey Book button is the most eye-catching element on any view. At most one honey button per viewport region, plus the header's Book Now.
- On a page's honey band, the booking CTA becomes Solid Wine (wine on honey is still the concept).
- Pair a filled button with an Outline, never two filled buttons side by side.

### 8.2 Sizes (unchanged)

| Size | Height | Padding X | Font |
|---|---|---|---|
| `sm` | 40px (44px tap area) | 16px | 14px/600 |
| `md` | 48px | 24px | 15px/600 |
| `lg` | 56px | 32px | 16px/600 |

Radius **6px**. Tap target ≥44×44. Full-width for primary actions in booking, modal and menu on mobile. Icons 20px, 8px gap, trailing → only for navigation. Icon-only buttons have accessible labels.

### 8.3 States

| State | Book (honey) | Solid Wine | Outline | Text |
|---|---|---|---|---|
| Hover | `accent-hover` fill (wine label 13.7:1); on light the wine border stays | **Mid Wine** fill, honey label (8.0:1) | On light: wine fill + honey label. On wine: honey fill + wine label | Underline, colour shift |
| Focus-visible | 2px ring, 2px offset: wine on light / honey on wine | Same | Same | Same |
| Active | `accent-pressed`, scale 0.98 | Wine fill restored, scale 0.98 | Scale 0.98 | — |
| Disabled | `surface-muted` fill, `text-muted` label, `border-strong` dashed border, `aria-disabled` | Same | Muted border and label | Muted |
| Loading | Label → "Confirming…" + 16px wine spinner, fixed width, `aria-busy`, non-interactive | Same with honey spinner | Same | — |

Disabled buttons are used sparingly. Prefer allowing the tap and showing a validation message (§11.2).

---

## 9. Cards and Surfaces

Cards are only for repeated or selectable items. Prose sections sit directly on the page. Most cards are **white on cream**. Coloured cards are the exception, used only where they help hierarchy.

| Card | Background | Border | Radius | Shadow | Padding | Hover |
|---|---|---|---|---|---|---|
| **Service card** | White (`surface`) on cream | 1px `border` | 12px | none | 24px | Border → Mid Wine, `shadow-1`, 150ms |
| **Barber card** | White | 1px `border` | 12px | none | image 0 / body 20–24px | Image zoom 1.03 (pointer only) |
| **Booking summary** | White | 1px `border` + **4px wine top edge** | 12px | `shadow-1` | 24px | — |
| **Info card** (light) | White on cream, or `surface-muted` | none / 1px `border` | 12px | none | 24px | Only if a link |
| **Supporting panel** | **Mid Wine**, cream text, honey labels | none | 12px | none | 24–32px | — |
| **Offer / invitation** | Vino Oscuro (modal) or Honey (footer band) | none | 16px (modal) | `shadow-3` (modal only) | 32px | — |

### 9.1 Service card
1. Name (`h3`, wine) with price (`price`, wine, right) on the same row; the price wraps below on narrow cards.
2. Clock icon + duration (`meta`, Mid Wine).
3. Description (`body-sm`, Mid Wine).
4. **Book this →** text button (wine), pinned to the bottom, pre-selects the service [PRD 8].
5. Badges: **Popular** = honey fill + wine text (12.6:1) with a 1px wine border. **Category** (Home preview only) = `surface-muted` + wine text.

Not a product tile: no cart, product photo or ratings.

### 9.2 Barber card
Portrait 4:5 → name (`h3`, wine) → role (`eyebrow`, Mid Wine) → bio (`body-sm`, wine) → specialities as neutral badges (`surface-muted`, Mid Wine text) → optional "Book with {name}" text link [DS optional].

---

## 10. Forms and Booking UI

Booking lives on **Light Cream with white panels**. Wine and honey mark the brand at decisive points: headings, selections, the stepper and the Book action. They never sit as backgrounds behind a grid of choices.

### 10.1 Form fields
- Label above (`label`, wine). Optional fields say "(optional)" in `text-muted`.
- Input: 48px (textarea at least 112px), **white**, 1px `border-strong`, radius 8px, 12×16 padding, 16px wine text.
- Placeholder (examples only) and helper text: `text-muted`.
- **Hover:** Mid Wine border. **Focus:** 2px wine border + wine focus ring.
- **Invalid:** 2px `error` border + **error-tint** field background + ⚠ icon + message in `error`, with `aria-invalid`/`aria-describedby`. Validate on blur or Continue.
- **Disabled:** `surface-muted`, `text-muted`.
- Order: Full name → Mobile phone → Email → Notes (optional) → Terms [PRD 11.2]. [DEFER: input types/autofill]

### 10.2 Selectable option (service, barber): Wine on Honey when selected

| State | Look |
|---|---|
| **Available** | White, 1px `border-strong`, radius 12px, empty 20px radio (`border-strong`) |
| Hover | Mid Wine border |
| **Selected** | **Honey fill + 2px wine border + wine-filled radio with a honey ✓**, label weight 600, all text wine (12.6:1) / Mid Wine (8.0:1) |
| Focus | Wine ring (2px offset) |
| Disabled | `surface-muted`, `text-muted`, "Unavailable" label (not used in v1) |

- **Service option:** name (`h4`) · duration (`meta`) · price (`price`, right), grouped under wine category eyebrows. A pre-selected option is shown selected and scrolled into view.
- **Barber option:** 48px portrait · name · role. **"No preference"** first, with a users icon and "We'll assign the first available barber". 1 column on sm, 2 on md+.

### 10.3 Date strip
Horizontal scroll, today to +30 days [PRD 11.4]. 64×72px chips, radius 8px.

| State | Look |
|---|---|
| **Available** | White, 1px `border-strong`, wine text |
| Hover | Mid Wine border |
| **Selected** | **Wine fill, honey text** (12.6:1), ✓ under the date |
| Today | "Today" caption + a small wine dot (combined with any state; honey dot when selected) |
| **Closed** (the business is not operating that date, e.g. Sunday) | `surface-muted`, no border, `text-muted`, strikethrough day, "Closed" label, `aria-disabled` |
| **Full** (the business is operating, but no bookable availability remains) | Same muted/disabled look, **no strikethrough**, "Full" label, `aria-disabled`. The accessible name says "Fully booked" |

**Closed ≠ Full.** Both look muted and can't be selected, but they are different states and must be labelled and announced differently. Closed comes from opening hours; Full comes from availability.

Arrows on md+. Scrolls inside its container and never overflows the page.

### 10.4 Time slots
- **Morning / Afternoon / Evening** wine eyebrows. 3 columns (sm) / 4 (md) / 5 (lg). 48px high, radius 8px, 24-hour `meta` [PRD 11.4].

| State | Look |
|---|---|
| **Available** | White, 1px `border-strong`, wine text |
| Hover | 2px Mid Wine border |
| **Selected** | **Wine fill, honey text, ✓ before the time**, `aria-pressed/checked` |
| Focus | Wine ring, offset (visible around selected chips too) |
| **Unavailable** | Not shown (PRD: "not offered") |

- Context line: "Showing times for **Skin Fade (45 min)** with **Any barber** on **Sat 10 Oct**" (Mid Wine, bold values in wine).
- **Loading:** `surface-muted` skeleton chips (gentle pulse, off with reduced motion) + "Checking availability…".

### 10.5 No availability
A `surface-muted` panel, radius 12px, 32px padding: calendar-x icon (wine), "No times available on Sat 10 Oct" (`h4`, wine), "Please choose another date." (Mid Wine), and an Outline button "See next available day" (if known) [PRD 11.4].

### 10.6 Terms checkbox
24px box, 2px `border-strong`, radius 4px. **Checked = wine fill + honey ✓.** 44px tap area over the label. "Terms & Conditions" is a wine underlined link. Terms & Conditions are clearly reachable; opening behavior follows the implementation's normal accessibility and navigation convention. Booking progress must not be lost [PRD 11.2]. Errors match field errors.

### 10.7 Review
- White summary card (4px wine top edge), "Review your booking", with rows for Service, Barber, Date, Time (start–end), Duration, Price, Name, Phone, Email, Notes. Labels Mid Wine, values wine.
- A "Change" text button per group.
- Price `price-lg`, wine.
- **FIRST15 note:** a slim **honey strip** (wine tag icon, wine text, 1px wine left edge): "First visit? Mention **FIRST15** when you arrive." [PRD 13]. Prices are always standard.
- Full-width **Book-style (honey, wine border) "Confirm booking"** + caption "No payment needed now · Pay in-store".

### 10.8 Confirmation
- 56px ✓ in a `success-tint` circle (**green**, so success is never confused with brand accents). Eyebrow "BOOKING CONFIRMED" (wine), h2 "See you soon, {first name}." (wine).
- Reference chip `GRD-XXXXXX` (Inter 600 tnum) on `surface-muted`, with a copy button [DEFER: format].
- Read-only summary card including the **assigned barber**.
- **Calendar block:** h3 "Add to your calendar", **Solid Wine** "Add to Google Calendar" (calendar icon, new tab) + **Outline** "Add to Apple Calendar" (download icon), caption "Downloads an .ics file — also works with Outlook and other calendar apps." Inline on md+, stacked on sm.
- **One-way event generation only.** Both actions create a single event from the confirmed booking. There is **no** two-way calendar synchronization, **no** OAuth calendar connection, and **no** ongoing calendar updates. UI copy must not imply syncing (use "Add to…", never "Sync with…" or "Connect").
- "What to expect", address, phone, and text links "Back to home" · "Book another appointment". Focus moves to the heading.

### 10.9 Alerts

| Type | Look | Examples |
|---|---|---|
| Error | error-tint, 4px `error` left border, ⚠, title in `error`, body wine | "We couldn't reach the booking service." + **Try again** (Solid Wine sm), details kept [PRD 11.5] |
| Warning | warning-tint, `warning` border + icon | "Your selected time was cleared because the new service doesn't fit before closing." |
| Conflict | Warning style at the top of the time step | "Sorry, 14:30 was just booked. Here are the latest available times." [PRD 11.3] |
| Success | success-tint, `success` border + ✓ | Rare |
| Info | `surface-muted`, wine left border, info icon | Neutral notices |

16px padding, radius 8px, `body-sm`, title weight 600. `role="alert"` for errors, `status` otherwise.

---

## 11. Booking Progress Design

Four visual steps grouping the PRD's eight stages (order unchanged) [DS]:

| Visual step | PRD stages | Title |
|---|---|---|
| 1 | Service | Choose a service |
| 2 | Barber, Date, Time | Pick barber & time |
| 3 | Customer details | Your details |
| 4 | Review → Confirm | Review & confirm |
| (done) | Confirmation + Add to Calendar | No stepper |

### 11.1 Indicator
md+: horizontal stepper (28px circles, 2px connectors, `caption` labels). sm: "Step 2 of 4 · Pick barber & time" + a 4px bar (wine fill on `surface-muted` track).

| State | Look |
|---|---|
| Upcoming | `border-strong` outline, number in `text-muted`, muted label, not clickable |
| **Current** | **Wine fill, honey number**, wine label 600, `aria-current="step"` |
| **Completed** | **Honey fill, 1.5px wine border, wine ✓** (Wine on Honey), label is an edit link, connector solid wine |
| Error | `error` border + ⚠ (e.g. conflict sends the user back to step 2) |

### 11.2 Step layout and editing
- `h3` step title (wine), content, then an action bar: **Back** (text) · **Continue** (Solid Wine). On step 4 the primary is **Confirm booking** (honey Book style). On mobile the bar is sticky at the bottom: white, top `border`, `shadow-2`, safe-area aware, full-width primary.
- Continue always responds. If the step is incomplete it scrolls to and shows the error.
- Completed steps collapse into a summary line with "Change". Invalidated later choices show the Warning alert [PRD 11.5].

### 11.3 Live summary
- lg+: sticky right column (`top: 96px`), white summary card, empty rows "Not selected yet" (`text-muted`).
- sm/md: a collapsible bar above the action bar ("Skin Fade · Sat 10 Oct · 14:30 ▾"), on `surface-muted`.

---

## 12. Modal / Promotional Popup

[PRD 13] The first-visit offer on Home only, styled as a **Groomd invitation**, not an ad.

- **Size:** `min(100% − 32px, 480px)`, max-height `calc(100vh − 32px)` with internal scroll.
- **Position:** centred on md+. **Bottom sheet on sm** (16px margins).
- **Overlay:** wine at 72%. Clicking it closes the modal.
- **Surface:** **Vino Oscuro**, radius 16px, `shadow-3`. A 4px **honey top rule** gives the premium signature. An optional 16:9 natural grooming photo on md+ only.
- **Hierarchy:**
  1. Eyebrow in honey: "● NEW TO GROOMD?"
  2. h2 in cream (28/32px): "**15% off** your first visit", with "15% off" in honey [DEFER: wording]
  3. `body-sm` in `text-on-strong-secondary`: "Book any service and mention **FIRST15** when you arrive. Discount applied in-store."
  4. **Honey Book button (wine label)**: "Book your first visit", full-width
  5. Text button "No thanks" (honey, underline)
  6. Caption link to the offer terms (`text-on-strong-muted`, underlined)
- **Close:** ✕ top-right, 44×44, cream icon, honey focus ring, "Close offer" label.
- **Focus:** into the dialog, trapped, Escape closes it, restored on close, scroll locked.
- **Motion:** overlay 200ms fade, dialog 250ms fade + 12px rise (sheet slide on sm). Instant with reduced motion.
- About 4 seconds after load on Home, once per visitor. Never on `/book` [PRD 13].
- **At 360px:** the sheet is about 328px wide with 24px padding; headline 28px wraps to 2 lines; all actions are full-width 48px; total height about 380px, so no scrolling is needed on a 640px-tall screen.

---

## 13. Imagery and Art Direction

### 13.1 Direction
**Documentary-style, warm, realistic barbering.** The palette appears in photos through **real surroundings**, not filters: dark wood and wine/oxblood leather chairs (echoing Vino Oscuro), cream walls and towels (Light Cream), warm lamp light and subtle brass (Honey).

- **Subjects:** Black African barbers and clients reflecting Lusaka. Ages 20s–50s, plus a kid's cut. Fades, line-ups, beard shaping, hot towel shaves, the styling finish, smiles in the mirror. Confident, natural portraits.
- **Setting:** a modern studio with dark wood, leather chairs, cream or warm plaster walls, matte black and subtle brass fittings, plants, clean stations.
- **Lighting:** warm practical and window light. Rich but readable shadows. No flash, neon or crushed blacks.
- **Skin tones:** natural and accurate. Never pushed red, orange or yellow.
- **Grade:** one gentle, consistent warmth. **No wine/honey tints, duotones or colour overlays.**
- **Composition:** hands-at-work close-ups, barber + client medium shots, eye-contact portraits. Leave clean space where images meet wine or cream panels.
- **Avoid:** wine glasses, bars or restaurants, vineyards, candle-lit tables, cosmetic bottles on marble, skincare flat-lays, fashion poses, shirtless models, "luxury man in a suit", barber poles, AI artefacts.
- **Three-second test:** the hero image alone must say "barbershop" (chair, cape, clippers, a fade in progress).

### 13.2 Usage and ratios

| Placement | Ratio | Notes |
|---|---|---|
| Home hero | 7-column full-bleed on lg (min-height 88vh, max 820px); **4:3 below the text panel on sm**, 16:9 on md | A barber finishing a fade, faces visible, subject facing the wine panel |
| Page header bands | Optional 4:5 / 3:2 on the right at lg; hidden on sm | Text on the wine band |
| Split sections | 4:5 or 1:1 | Story, craft, interior |
| Barber portraits | **4:5**, identical cream-plaster or dark-wood backdrop, lighting and framing | All three must match |
| Service category images (optional) | 3:2 | At most one per category |
| Contact | 3:2 | Entrance or reception |
| Modal | 16:9 | md+ only |
| OG image | 1200×630 | Hero photo + wine panel with the descriptor lockup |

- Images must look sharp and high quality at every breakpoint, cropped to the ratios above with defined focal points. Faces are never cut at the eyes or chin.
- [DEFER: ARCHITECTURE.md] Image pipeline details: source resolution, responsive sources, formats, loading and cropping technique.
- Meaningful alt text; decorative images use empty alt [PRD 15]. About 6–10 images, stock or AI allowed [PRD 2].

---

## 14. Iconography

- **Family:** Lucide (or equivalent), outline, 1.75px stroke, rounded, `currentColor`.
- **Colour:** wine on cream/white, honey or cream on wine, wine on honey. Feedback icons use their state colour. **Never honey icons on light.**
- **Sizes:** 16 / 20 / 24 / 32 / 56.
- **Use for:** clock, calendar/calendar-plus, map-pin, phone, mail, users, check, alert-triangle, info, x, menu, chevrons/arrow-right, download, external-link, copy, tag, social glyphs.
- **Social buttons (footer):** 40px circles (44px target), 1.5px honey outline, cream glyph. Hover = honey fill with a wine glyph.
- **Don't:** decorative icons on every heading, scissors/razor ornaments, unlabeled icons.

---

## 15. Borders, Radius, Shadows & Depth

**Borders:** 1px `border` (decorative, light) · 1px `border-strong` (interactive, light) · 1px/2px Mid Wine (hover) · 2px wine (selected option, focus-within) · 1.5px wine (honey buttons/badges on light) · 2px `error` + tint + icon (invalid) · 1px Mid Wine (decorative on wine) · 1.5px honey (interactive outline on wine).

**Radius scale** (unchanged)

| Token | Value | Use |
|---|---|---|
| `radius-xs` | 4px | Checkbox, badges |
| `radius-sm` | 6px | Buttons |
| `radius-md` | 8px | Inputs, slots, date chips, alerts |
| `radius-lg` | 12px | Cards, options, panels |
| `radius-xl` | 16px | Modal |
| `radius-full` | 999px | Avatars, social buttons, dots |

**Shadows** (wine-tinted, subtle, no glows)

| Token | Value | Use |
|---|---|---|
| `shadow-1` | `0 1px 2px rgba(68,4,15,.06), 0 2px 8px rgba(68,4,15,.06)` | Card hover, sticky header over cream, summary |
| `shadow-2` | `0 -8px 24px rgba(68,4,15,.10)` | Sticky mobile action bar |
| `shadow-3` | `0 24px 64px rgba(68,4,15,.35)` | Modal, mobile menu |

**Elevation:** page (0) → cards (0, bordered) → sticky header/summary (1) → action bar (2) → menu/modal + overlay (3).

---

## 16. Footer

The footer ends marketing pages with the full Wine on Honey statement: **a slim honey invitation band, then the wine footer.** The honey band is **omitted on /book and on legal pages (Terms, Privacy)**. Those pages show the wine footer only.

- **Invitation band:** **Miel Cremosa** full-width, 48px (sm) / 64px (lg) vertical padding, separated from the cream section above by the section spacing (it never touches a cream area without spacing). h2 in wine: "Ready for a fresh cut?" [DEFER: copy], `body` in Mid Wine (8.0:1), **Solid Wine "Book Now"** (honey label) [PRD 7.3]. Centred on sm, split (text left, button right) on lg.
- **Footer body:** **Vino Oscuro**. Column headings `eyebrow` in honey. Links and body in `text-on-strong-secondary`. Meta in `text-on-strong-muted`.
- **Columns (lg, 4):** Brand (descriptor lockup + one line + social buttons) · Explore (Home, Services, About, Contact, Book an appointment) · Visit (address → map, `tel:`, `mailto:`, 16px honey icons) · Opening hours (tabular, cream times, "Sunday — Closed" muted).
- **Bottom bar:** 1px Mid Wine divider. "© {year} Groomd. All rights reserved." · Terms & Conditions · Privacy Policy (`caption`).
- **Links:** hover honey + underline. Focus ring honey.
- Spacing: 64px top (lg) / 48px (sm). Heading → list 16px, items 12px apart.
- **Mobile:** stacked Brand → Visit → Hours → Explore (32px apart), rows at least 44px, legal links first in the bottom bar. **Tablet:** 2×2.

---

## 17. Page-Specific Visual Direction

**Colour budget per page:** wine header + (wine hero or wine page band) + at most **one Mid Wine supporting band/panel** + honey invitation band (not on /book or legal pages) + wine footer. Everything else is Light Cream with white cards.

### Home
1. **Hero (split): wine foundation, honey CTA, cream supporting content.**
   - The wine panel holds a honey eyebrow "● MEN'S GROOMING STUDIO · LUSAKA", a `display` headline in cream with at most one honey word (e.g. "Look sharp. *Effortlessly.*" [DEFER: CONTENT]), a `body-lg` subline in `text-on-strong-secondary` naming the services (cuts, fades, beard work), **honey "Book an appointment"** (lg) + honey-outline "View services", and a trust line in `text-on-strong-muted` ("Open today 09:00–18:00 · {short address}").
   - Photo on the right on lg, below on sm. A natural, un-tinted barber-at-work image.
   - Directly beneath, a **cream quick-info strip** (hours today · address · "Book online in a minute") with wine icons, the "cream supporting content" that grounds the hero.
2. **Intro / values:** cream. A wine h2 plus 3 value points (wine icons, h4, one line). No cards.
3. **Services preview:** cream with white service cards (3–4) + "View all services →".
4. **Craft/story split:** the page's single **Mid Wine supporting band**. Image 4:5 + honey eyebrow, cream h2, `text-on-strong-secondary` copy, honey text link to About.
5. **Barbers preview:** cream. 3 compact white barber cards.
6. **Visit us:** cream. A white info card with the hours table (wine, today marked with a wine dot + "Today") + address + Outline "Get directions", with an image beside it.
7. **Honey invitation band + wine footer.**
The first-visit modal appears here (§12). About 6 sections.

### Services
- **Page header band (wine):** honey eyebrow, cream `h1` "Services & Prices", 1–2 line intro, "All prices in ZMW · Pay in-store" in `text-on-strong-muted`.
- **Category jump chips** on cream: white fill, `border-strong`, wine text; hover Mid Wine border. Wrap on mobile.
- **Per category:** wine eyebrow + wine `h2`, white service cards on cream (`surface-muted` bands may separate categories if needed). Card hierarchy: **name (wine, strongest) → price (wine, bold, right) → duration (Mid Wine + icon) → description (Mid Wine) → Book this (wine link)**. "Popular" = honey badge with a wine border.
- Honey invitation band + footer. No other coloured band, so the catalogue stays calm and scannable.

### About
- **Page header band (wine):** `h1` + intro, with an optional studio image on the right.
- **Story:** up to 2 alternating image/text splits on cream. A **values row** of 3 items (wine icons, h4, one line).
- **Founder pull quote (conditional):** only if `CONTENT.md` contains an approved founder and quote. Shown as the page's Mid Wine supporting panel: Archivo 700 in cream, a honey dot, attribution in honey, no ornamental quote marks. **Do not invent a founder, name, quote or biography.** Without approved content, the Mid Wine panel holds another approved section (e.g. a studio value statement or "Our approach" summary) with the same visual hierarchy.
- **Meet the barbers:** 3 full white barber cards on cream.
- Honey invitation band + footer.

### Book
- A compact **page header band (wine)** (about 160px on lg, 128px on sm): `h1` "Book an appointment" + "Takes about a minute. No payment needed."
- Below it, everything is **cream with white panels**: stepper, steps and the sticky summary. Brand colour appears only in headings, the stepper, selected states and buttons. No Mid Wine band.
- The confirmation replaces the flow in place, with the calendar actions as the focus.
- **The honey invitation band is omitted on /book** (its "Book Now" would be redundant). The wine footer stays. The modal never appears.

### Contact
- **Page header band (wine):** `h1` "Visit Groomd" + intro.
- **Main (cream):** a split. On the left, white info cards (wine icons, h4 labels, wine details, tappable phone and email, Outline "Get directions"). On the right, the map treatment (4:3, radius 12px; static styled map or location card with "Open in Google Maps" [DS; final → ARCH]).
- **Opening hours:** the page's **Mid Wine supporting panel**, with honey day labels, cream times, today marked with a honey dot + "Today", and "Sunday — Closed" in `text-on-strong-muted`.
- Honey invitation band + footer.

### Terms & Conditions / Privacy Policy
- **No coloured bands.** A light header on cream: wine eyebrow "LEGAL", wine `h1`, "Last updated {date}" in `text-muted`.
- `container-narrow`, `legal-body` in wine on cream (15.0:1), `h2` wine, `h4` Mid Wine. Links wine, underlined.
- Optional sticky "On this page" list on lg (the current item in wine with a wine dot); at the top on sm.
- Ends with contact details and "Back to home" / "Book an appointment" links.
- **No honey invitation band on legal pages**, and no other coloured marketing sections. The standard wine header and wine footer provide the brand presence. The content stays focused and readable.

### 404
- Cream, centred, min-height 60vh. A large decorative "404" in Archivo 800 at 96px in `surface-muted` tone (`aria-hidden`), a wine `h1` "This page took a little off the top." [DEFER: copy], **honey Book button (wine border) "Book an appointment"** + Outline "Back to home".

---

## 18. Responsive Behaviour

| Component | 360–767 (sm) | 768–1023 (md) | 1024–1279 (lg) | ≥1280 (xl) |
|---|---|---|---|---|
| Header | 64px wine: logo + honey Book Now + menu | Same | 72px, full nav + Book Now | Same, capped at 1200 |
| Hero | Wine text panel first (headline 40px, stacked full-width CTAs; Book Now visible without scrolling at 360×640), photo 4:3 below, then the cream quick-info strip stacked | Panel, photo 16:9, info strip in a row | Split 5/7, headline 64–72px, min-height 88vh (max 820), info strip in a row | Text column ≤5 columns |
| Page header bands | Wine, text only, 128–160px | Same | Optional image on the right | Same |
| Typography | Mobile sizes | Midpoint (h1 about 42, h2 about 34) | Desktop sizes | No growth |
| Section spacing | 48px | 64px | 96px | 96px |
| Service cards | 1 col; price wraps below the name if needed | 2 col | 3 col | 3 col |
| Barber cards | 1 col (portrait max 400px centred) | 2 + 1 or 3 compact | 3 col | 3 col |
| Mid Wine band / panel | Stacked, image first | Stacked / 50/50 | 50/50 or 7/5 | Same |
| Honey invitation band | Centred, full-width button | Centred | Text left, button right | Same |
| Booking layout | Single column, collapsible summary, sticky action bar | Single 760px, sticky action bar | 8/4 with sticky summary | Same |
| Options | 1 col | Barbers 2 col; services 1 col | Same | Same |
| Date strip | Swipe, about 4.5 chips visible | Arrows, about 8 | About 9 | Same |
| Time slots | 3 col | 4 col | 5 col | 5 col |
| Forms | Full-width | Phone + email in 2 columns | Same | Same |
| Calendar buttons | Stacked full-width | Inline | Inline | Inline |
| Modal | Wine bottom sheet, no image | Centred 480px with image | Same | Same |
| Footer | Stacked | 2×2 | 4 col | 4 col |
| Legal | Contents list at the top | Same | Sticky contents (optional) | Same |
| Images | Mobile crops | — | Desktop crops | Never upscaled; hero max 820px |

---

## 19. Accessibility & Interaction States

State is **never** communicated by brand colour alone.

| State | On Light Cream / white | On Wine / Mid Wine | Non-colour cue |
|---|---|---|---|
| **Focus-visible** | 2px wine ring, 2px offset (15.0:1) | 2px honey ring, 2px offset (12.6:1 / 8.0:1) | Ring shape; always shown for keyboard focus |
| Hover | Mid Wine border / underline | Honey text / underline | Border or underline change |
| Active | Pressed shade, scale 0.98 | Same | Scale |
| **Available** | White + `border-strong` outline, wine text | — | Outlined, regular weight |
| **Selected** | Slots/dates: wine fill + honey text. Options: honey fill + 2px wine border (Wine on Honey) | Honey fill + wine text | **✓ icon + weight 600** + `aria-checked/pressed` |
| **Current** (nav/step) | Step: wine fill + honey number. Legal contents: wine + dot | Nav: honey + dot | Dot/fill + weight + `aria-current` |
| **Completed** (step) | Honey fill + wine border + wine ✓ | — | ✓ icon |
| **Disabled** | `surface-muted`, `text-muted`, no border | Mid Wine fill, muted text | **"Closed" label + strikethrough (not operating) or "Full" label (operating, no availability)**. Distinct labels, `aria-disabled` |
| Loading | Spinner + text | Same | "Checking availability…", "Confirming…", `aria-busy` |
| **Error** | Red border + error-tint + ⚠ + message | Not used on wine | Icon + text; focus moves to the first invalid field |
| **Success** | Green ✓ in success-tint + heading | — | Icon + text |
| Empty | `surface-muted` panel + icon + heading + action | — | Text instruction |

- Use the verified pairs by default: **wine on cream (15.0), wine on honey (12.6), honey on wine (12.6), mid wine on honey (8.0)**. Other pairs are only as evaluated in §3.3.
- Forbidden: honey on cream/white (1.19/1.31) and mid wine on wine (1.58) for text or interactive boundaries.
- Touch targets ≥44×44px, with ≥8px between them.
- Skip-to-content link: honey fill, wine text, 1.5px wine border, top-left on focus.
- Menu and modal trap focus and close with Escape. Logical tab order. Reduced motion respected (§20).
- One `h1` per page, ordered headings, labelled fields, alt text. [DEFER: implementation]

---

## 20. Motion

*(Unchanged from v1.0.)*

| Use | Spec |
|---|---|
| Hover colour/border | 150ms ease-out |
| Button press | 100ms scale 0.98 |
| Mobile menu | translateX 250ms `cubic-bezier(.2,.8,.2,1)`, overlay fade 200ms |
| Modal | Overlay 200ms; dialog fade + 12px rise / sheet slide 250ms |
| Booking step change | 150ms crossfade + smooth scroll to the step top (instant with reduced motion) |
| Selected slot/option | 120ms background/border |
| Barber image hover | Scale 1.03 over 300ms, pointer only |
| Scroll reveals | **Not used.** [OPT] Subtle 200ms fade-up once, only if time allows |
| Spinner | 800ms linear |

Animate only `opacity`/`transform`. No parallax, carousels, video backgrounds, shimmer/gold sweeps, or bouncing. With reduced motion, transitions are instant and the spinner becomes a static "…".

---

## 21. Reusable Component Inventory

> **Implementation should favour reusable components with composable variants rather than creating separate bespoke components for every visual state listed here.**

| Component | Variants / states | § |
|---|---|---|
| Logo | On-wine, on-light, descriptor lockup, `G.` | 2 |
| Header | Desktop, mobile, over cream (shadow), `/book` current state | 7 |
| Mobile menu | Open/closed | 7.3 |
| Hero + cream quick-info strip | — | 17 |
| Page header band (wine) | Text-only, with image | 17 |
| Mid Wine supporting band / panel | Story split, pull quote (if approved in CONTENT.md) or other approved section, hours panel | 9, 17 |
| Honey invitation band + wine footer | (band omitted on /book and legal pages) | 16 |
| Button | Book (honey) / Solid Wine / Outline / Text × surface × size × state | 8 |
| Section header | Eyebrow + h2 + intro, per surface | 4 |
| Split section | Image left/right | 6.3 |
| Service card | Standard, compact, Popular badge | 9.1 |
| Barber card | Full, compact | 9.2 |
| Info card | White, surface-muted | 9 |
| Hours table | On white, on Mid Wine, on wine (footer), today marker | 16, 17 |
| Form field | Text, tel, email, textarea × states | 10.1 |
| Checkbox | States | 10.6 |
| Selectable option | Service, barber, no preference × states | 10.2 |
| Date chip | Available, today, selected, closed, full | 10.3 |
| Time-slot chip | Available, hover, selected, focus | 10.4 |
| Stepper | Desktop / mobile × upcoming, current, completed, error | 11 |
| Booking summary | Live, review, confirmation | 10.7, 11.3 |
| FIRST15 note | Honey strip | 10.7 |
| Alert | Error (+retry), warning, conflict, success, info | 10.9 |
| Empty state | No availability | 10.5 |
| Reference chip | With copy | 10.8 |
| Calendar actions block | One-way event generation (Google link, .ics download) | 10.8 |
| Modal / bottom sheet | Offer (wine + honey rule) | 12 |
| Badge | Popular (honey + wine), category/speciality (neutral), Today, Closed | 9, 10.3 |
| Skeleton / spinner | — | 8.3, 10.4 |
| Skip link | — | 19 |
| Legal layout | With/without contents | 17 |

---

## 22. Visual Hierarchy Rules

1. **Strongest emphasis = the honey Book action.** Honey is the primary accent for important actions and selected states, with booking as its primary use. Other primary actions are Solid Wine, secondary actions are Outline.
2. **Honey is scarce:** one honey button per viewport region (plus the header), small highlights, selected choices, and one slim band. Large honey areas are wrong.
3. **Wine is the foundation, not wallpaper.** Follow the colour budget (§17). Content-heavy areas stay Light Cream.
4. **Mid Wine supports, never leads:** one supporting band or panel per page, plus hovers and secondary text.
5. **Headings are wine on cream or cream on wine, and big. Headings may use uppercase styling selectively, primarily for display/page-heading moments. Body is calm wine on cream.** h2 is at least 1.75× body size.
6. **Prices are clear, never shouted:** Inter 600 wine, right-aligned, "K" prefix, tabular. No discount or strikethrough prices (PRD).
7. **Duration always accompanies price.**
8. **Whitespace signals premium.** One idea per section.
9. **Density:** marketing pages are low density. Booking is medium, with one question per step.
10. **Photography carries "barbershop". Colour carries "Groomd".**

---

## 23. Design QA Checklist

Test at **360, 390, 768, 1024, 1280 and 1440px** [PRD 14], plus a real iPhone and a real Android phone.

**Brand & palette**
- [ ] Only the four brand colours (`#44040F`, `#FBDE9C`, `#6B2A33`, `#FFF3D6`) plus the documented functional colours. No drifted hex values, no fifth brand colour, no arbitrary new shades added during development.
- [ ] Proportions look right: cream breathes, wine anchors, mid wine supports, honey highlights. No large honey areas beyond the invitation band.
- [ ] No honey text, icons, thin borders or focus rings on cream or white. Honey buttons on cream have a wine border.
- [ ] Mid Wine never carries text on Vino Oscuro.
- [ ] No gradients (apart from a scrim if ever used), metallic or gold effects, or tinted photos.
- [ ] The first viewport reads as a barbershop without reading the name, not a wine brand, restaurant or luxury retailer.

**Logo**
- [ ] Cream letters + honey dot on the wine header on every page. Wine version on light pages. Links Home.
- [ ] The `G.` favicon shows.

**Typography**
- [ ] Only Archivo + Inter. One `h1` per page. Scale respected. Prose ≤75 characters per line.
- [ ] Wine text on cream, cream text on wine, honey accents on wine only. Tabular numbers for prices and times.

**Contrast**
- [ ] Text uses the verified or evaluated pairs (§3.3). Interactive borders ≥3:1. Focus visible on cream (wine) and on wine (honey).

**Spacing & alignment**
- [ ] 48/64/96 section rhythm. Consistent card padding and gaps. Aligned container edges. Cards in the same repeated grid align cleanly (equal heights preferred where they improve consistency).

**Responsive**
- [ ] **No horizontal scroll** at any test width, with the menu or modal open, or at any booking step.
- [ ] Hero headline and honey Book CTA visible without clipping at 360px. Images keep ratio and focal point.

**Navigation**
- [ ] Desktop: cream links, honey active + dot. Mobile: honey Book Now visible at 360px. The menu opens and closes (✕, overlay, Escape, link), locks scrolling, restores focus.

**Buttons**
- [ ] Book = honey (wine border on light). Solid Wine for other primaries. Outline/Text correct per surface. Hover, focus, active, disabled and loading states exist. ≥44px. No layout shift.

**Booking UI**
- [ ] Available, selected, current, completed, disabled, error and success are distinguishable **in greyscale** (✓, labels, icons, weight, fills).
- [ ] Selected options = honey fill + wine border + ✓. Selected slots/dates = wine fill + honey text + ✓.
- [ ] Closed (not operating) and Full (operating, no availability) dates are labelled and announced distinctly. Slots 48px, 3 columns at 360px.
- [ ] No-availability, loading, conflict, invalidated-selection and server-error states render correctly.
- [ ] The sticky action bar never hides fields or errors, and respects the safe area.
- [ ] Review shows all details + the honey FIRST15 strip. Confirm (honey) shows loading.
- [ ] Confirmation: green success, reference, summary with barber, **both calendar buttons**.

**Forms**
- [ ] White fields on cream, visible labels, 16px text, wine focus, red + tint + icon + text errors, focus moves to the first error. Terms checkbox 44px. The Terms link is clearly reachable and booking progress is not lost.

**Images**
- [ ] Natural grade and skin tones. Environments echo the palette without filters. Barber portraits match. Alt text present.

**Modal**
- [ ] Home only. Wine surface with honey top rule and honey CTA. Fits 360px as a bottom sheet. Closes via ✕, overlay, "No thanks" and Escape. Focus trapped and restored.

**Footer**
- [ ] Honey invitation band (not on /book or legal pages) + wine footer. Logo, nav, contact (tappable), hours, social, Book link, Terms, Privacy, © current year. Readable, 44px rows on mobile.

**Finish**
- [ ] No placeholders, empty sections, unstyled elements or removed focus outlines.

---

## 24. Decisions vs Proposals

### Locked
- **[LOCKED] Light Cream `#FFF3D6`**: primary light background.
- **[LOCKED] Miel Cremosa / Honey `#FBDE9C`**: primary accent / CTA.
- **[LOCKED] Mid Wine `#6B2A33`**: secondary / supporting.
- **[LOCKED] Vino Oscuro / Wine `#44040F`**: primary / dominant.
- **[LOCKED] Core visual concept: "Wine on Honey."**
- **[LOCKED] Verified contrast:** Wine on Honey 12.6, Wine on Light Cream 15.0, Mid Wine on Honey 8.0, Honey on Wine 12.6.
- *Replaced and withdrawn:* the v1.0 Ink `#14161A` / Copper `#C98A4B` / Copper-deep `#9A5B26` / Bone `#F7F4EF`, and the interim v1.1 warm white `#FAF7F2`, `#F2ECE4`, Wine deep `#2E0209`, Wine raised `#5A0A18`, Wine hover `#6B0F1F`, near-black text `#1F1416`.
- [PRD] Brand **Groomd — Men's Grooming Studio**, clearly a barbershop. Lusaka, ZMW, 24-hour Lusaka times.
- [PRD] Pages: Home, Services, About, Book, Contact, Terms, Privacy, 404. Separate Book and Contact.
- [PRD] Header (logo, nav, visible Book Now, mobile menu). Footer contents.
- [PRD] Booking flow and states, no preference, conflicts, errors, reference. Calendar actions (Google + Apple .ics) on confirmation.
- [PRD] Home-only closable popup, never over booking. FIRST15 in-store, no discount logic.
- [PRD] Test widths. WCAG AA. Keyboard access. Alt text. Non-goals.

### Proposed [DS]
- **Functional colours:** white surface `#FFFFFF`, `surface-muted #F5E9D0`, `text-muted #7A5A5F`, `border #EBDDC3`, `border-strong #8C6E72`, on-wine text tints `#E8D5CC` / `#C9A9A5`, honey state shades `#FDE8B8` / `#F3CF7E`, and the success, error and warning set. These are functional, not brand colours.
- Colour proportions and per-page budget (§3.4, §17).
- Button system: **Honey is the primary accent for important actions and selected states, with booking as its primary use** (honey Book CTAs, with a wine border on light), Solid Wine for other primaries, Outline, Text.
- Wine body text on cream.
- Honey invitation band above the wine footer (omitted on /book and legal pages).
- One Mid Wine supporting band/panel per page (Home story, About quote if approved in CONTENT.md or another approved section, Contact hours).
- Always-solid wine header. Split Home hero with a cream quick-info strip. Wine page-header bands (not legal/404).
- Wordmark: cream letters with a honey dot on wine.
- Carried from v1.0: Archivo + Inter, type scale, spacing, grid, radius, shadows (now wine-tinted), Lucide, 4-step booking, date strip, hidden unavailable slots, sticky summary/action bar, bottom-sheet modal, static map preferred, optional "Book with {barber}".

### Deferred
- **CONTENT.md:** all copy (including the hero headline and its honey-highlighted word, and the invitation-band line), services, prices, durations, bios, address, phone, email, offer wording and percentage, reference format, social platforms (PRD open item 1), legal text, alt text.
- **ARCHITECTURE.md:** font loading, map approach, image pipeline, availability loading behaviour.
- **Implementation:** SVG logo, image selection/generation, exact icons, token naming in code.
- **D-1:** check against Figma references if supplied.

---

## 25. Audit Against PRD.md and Palette Consistency

### 25.1 PRD coverage

| PRD requirement | Design support | Status |
|---|---|---|
| Required pages (§6) | §17, all eight pages | ✅ |
| Clear barbershop identity (§5) | §13 three-second test, §22 rule 10, service language in the hero | ✅ |
| Visible Book Now (§7.1) | Honey Book Now in the wine header at all widths; fits at 360px | ✅ |
| Mobile navigation | §7.3 | ✅ |
| Footer contents (§7.3) | §16 (booking link in both the invitation band and the Explore column) | ✅ (social destinations pending PRD open item 1) |
| Services, ZMW price + duration, pre-select (§8) | §9.1, §17 Services | ✅ |
| Barber profiles (§9) | §9.2, §13 | ✅ |
| Business info consistency (§10) | Shared hours/contact components on white, Mid Wine and wine | ✅ |
| Booking flow and rules (§11) | §10–11, colour-independent states | ✅ |
| Calendar actions (§12) | §10.8, one-way event generation (Google + Apple-compatible .ics), no sync | ✅ |
| Popup (§13) | §12, 360px budget checked | ✅ |
| Responsive (§14) | §6, §18 | ✅ |
| Accessibility (§15) | §3.3, §19 | ✅ |
| Non-goals (§18) | No payment UI, discount prices or email promises | ✅ |
| Practical implementation | Four brand colours, a few functional colours, two fonts, no effects | ✅ |

### 25.2 Palette consistency audit

| Area | Result |
|---|---|
| Brand identity / logo | Four-colour identity locked. Cream + honey dot on wine; wine on cream/honey ✅ |
| Colour system | Semantic tokens map to the four brand colours. Functional colours labelled. Withdrawn colours listed ✅ |
| Typography | Colour table for cream / wine / honey surfaces ✅ |
| Header | Wine + cream + honey only ✅ |
| Hero | Wine panel, honey CTA, cream quick-info strip ✅ |
| Buttons | Honey = primary accent for important actions and selected states, booking first (wine border on light), Solid Wine hover → Mid Wine, Outline per surface ✅ |
| Cards | White on cream by default. Mid Wine panel once per page. Honey only in badges ✅ |
| Services / About / Contact | Wine page band, cream content, one Mid Wine element (About quote if approved or another approved section, Contact hours) ✅ |
| Booking / forms / slots | Cream + white. Selected option = Wine on Honey. Selected slot/date = honey on wine. Green success, red + tint errors ✅ |
| Confirmation | Green success, Solid Wine + Outline calendar buttons ✅ |
| Modal | Wine with honey rule and CTA, 360px checked ✅ |
| Footer | Honey invitation band + wine footer ✅ |
| Legal / 404 | Cream reading layout, wine type, standard wine header/footer. No honey band or coloured marketing sections on legal pages ✅ |
| Responsive / accessibility | Band behaviour per breakpoint. Failing pairs explicitly banned ✅ |
| Imagery | Palette through real environments, no filters ✅ |

### 25.3 Conflicts and adjustments
1. **Honey on Light Cream (1.19:1):** honey CTAs on light surfaces get a 1.5px wine border so the button shape is visible. Honey is never used as text or thin lines on light.
2. **Mid Wine on Vino Oscuro (1.58:1):** used only for decorative dividers and hovers on wine. Honey outlines are used for interactive boundaries on wine.
3. **Honey invitation band on /book and legal pages:** omitted on /book to avoid a redundant Book CTA while booking, and on Terms/Privacy to keep legal content focused and readable.
4. **Wine vs error red:** errors always add an icon, tint and text.
5. **Carried from v1.0/v1.1:** four visual steps (presentation only), hidden unavailable slots ("not offered"), Terms clearly reachable without losing booking progress (opening behavior follows the implementation's normal accessibility and navigation convention), no discounted prices shown.
