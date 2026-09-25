# CONTENT.md — Groomd · Men's Grooming Studio

> **Status:** Revised Draft v0.2 — Milestone 0, Task 0.3. Review corrections R1–R16 and decisions D1–D7 applied. **Ready to lock as v1.0 on approval.**

---

## 1. Content Authority & Status

**Purpose.** This document is the single source of truth for everything the Groomd website *says and displays*: names, copy, CTAs, services, prices, durations, barbers, business details, booking messages, promotional copy, calendar event text, legal copy, social destinations and image/alt-text direction. Implementation should read its words and data from here, not invent them in code.

**Authority order**
1. `PRD.md`: product requirements
2. `DESIGN.md`: visual and design system
3. `CONTENT.md`: approved words and business data *(this document)*
4. `ARCHITECTURE.md`: technical implementation

`CONTENT.md` must not contradict `PRD.md` or `DESIGN.md`. If it does, the higher document wins and the conflict is recorded in §19.

**Belongs here:** all user-facing text and business data.
**Does not belong here:** colours, typography, layout or component styling (→ DESIGN). Data models, validation logic, APIs, storage or hosting (→ ARCHITECTURE).

**Fictional business notice.** Groomd, its address, phone number, email, barbers and history are **fictional**, created for a Talent Forge practical assessment. None of it describes a real business or person.

### Implementation conventions (accessibility)
- **Uppercase headings:** headings shown in capitals here (e.g. "SERVICES & PRICES") show the *display style*. Store and mark them up in normal case ("Services & prices") and apply uppercase through styling (DESIGN §4), so screen readers don't spell words out.
- **Eyebrow dot "●":** a decorative DESIGN motif, not text. Render it as decoration and hide it from assistive technology.
- **Arrows "→"** in link text (e.g. "View all services →") are icons, hidden from assistive technology.

### Tags

| Tag | Meaning |
|---|---|
| `[LOCKED]` | Fixed by PRD/DESIGN |
| `[APPROVED]` | Drafted here and approved by Daniel (D7) |
| `[APPROVED]` | Drafted here; needs approval (none remaining) |
| `[PROPOSED FICTIONAL CONTENT]` | Invented narrative content (people/story); needs explicit approval |
| `[PENDING]` | Can't be finalised yet |
| `{placeholder}` | Filled dynamically at runtime |

---

## 2. Brand Content

| Item | Content |
|---|---|
| Full brand name `[LOCKED]` | Groomd — Men's Grooming Studio |
| Short name `[LOCKED]` | Groomd |
| Descriptor `[LOCKED]` | Men's Grooming Studio |
| Short description `[APPROVED]` | Groomd is a modern barbershop in Lusaka for cuts, fades, beard work and hot towel shaves, with online booking and clear prices. |
| One-sentence positioning `[APPROVED]` | A modern Lusaka barbershop where looking sharp feels effortless. |
| Tagline | None as a separate brand element. The hero headline "Look sharp. Effortlessly." `[APPROVED]` serves that role on the Home page only. |

Pronunciation guidance is omitted because the name is self-explanatory ("groomed").

### 2.1 Voice
Modern, confident, warm, concise, straightforward. Talk like a good barber: friendly, direct, no hype. Short sentences. Second person ("you", "your cut").

### 2.2 Approved terminology

| Use | Instead of |
|---|---|
| barbershop, studio, barber | salon, spa, boutique, atelier |
| cut, fade, line-up, beard trim, shave | "treatment", "experience", "ritual" |
| book, appointment, your chair | reservation, table, order, checkout |
| service | product, item |
| pay in-store | checkout, payment, cart |
| first visit | "new customer deal", "sale" |
| Add to Google Calendar / Add to Apple Calendar | Sync, Connect calendar |

### 2.3 Avoid
"world-class", "best in Lusaka", "unmatched", "luxury", "exclusive", "bespoke experience", "indulge", "curated", "elevate", "vintage", "pour", "blend", "notes of", "reserve", "cellar", "shop now", "add to cart", "limited time", "hurry", forced slang, testimonials, reviews, star ratings, awards, years-in-business claims presented as fact beyond the fictional barber bios.

"Premium" may appear at most once site-wide, and ideally not at all.

---

## 3. Global Navigation `[LOCKED labels per PRD §7 / DESIGN §7]`

| Element | Text |
|---|---|
| Header nav links | Home · Services · About · Contact |
| Header primary CTA | Book Now |
| Header Book Now when on /book | Visible text stays **Book Now**. The current page is indicated for screen readers only (`aria-current`, DESIGN §7.2); "current page" is never shown as text |
| Logo accessible name | Groomd — Home |
| Menu button (closed) | Open menu |
| Menu button (open) / close button | Close menu |
| Mobile menu landmark label | Main menu |
| Main nav landmark label | Main navigation |
| Footer nav landmark label | Footer navigation |
| Skip link | Skip to main content |
| Mobile menu footer info | {phone} · Today: {open}–{close} / Today: Closed |

**Book.** Per PRD §7.2 and DESIGN §7.1, "Book" is **not** a separate text link in the header. It's the **Book Now** button, which leads to `/book`. In the footer the booking link reads **Book an appointment** (DESIGN §16). See §19 conflict note C-1.

---

## 4. Global Business Information (authoritative block)

Every page, the booking flow, the Terms, the Privacy Policy and the calendar event use **only** these values.

### Business

| Field | Value |
|---|---|
| Name | Groomd `[LOCKED]` |
| Descriptor | Men's Grooming Studio `[LOCKED]` |
| Location | Lusaka, Zambia `[LOCKED]` |
| Currency | ZMW, displayed as `K 250` (K, space, whole number, no decimals) `[LOCKED]` |
| Timezone | Africa/Lusaka (CAT, UTC+2). All times are Lusaka local time `[LOCKED]` |
| Time format | 24-hour, e.g. `14:30` |
| Date format | `Sat 10 Oct 2026` (short weekday, day, short month, year) |

### Contact `[APPROVED]`

| Field | Value | Notes |
|---|---|---|
| Address (full, one line) | Shop 3, Mopani Court, Kabulonga, Lusaka, Zambia | Fictional. The building and shop number are invented, with no street, so it can't point to a real business. Kabulonga is a real suburb, used only for plausibility |
| Address (short) | Kabulonga, Lusaka | Hero trust line, quick-info strip |
| Address (multi-line) | Shop 3, Mopani Court / Kabulonga / Lusaka, Zambia | Footer, Contact page |
| Phone (display) | +260 97 000 0000 | **Placeholder number** in Zambian mobile format. The zero-filled number signals "not a real line". Groomd does not control any real phone line |
| Phone (tel link) | +260970000000 | Kept tappable (PRD §7.4). The Contact page's fictional notice (§11) says it isn't a working line |
| Email | hello@groomd.example | Uses the reserved `.example` domain, which can never belong to anyone, so no real inbox is implied or reached. The mailto link opens the user's mail app only |
| Map link | Opens a Google Maps search for "Kabulonga, Lusaka" (suburb level, **not** a pin on a real building) | Avoids pointing at a real business |

### Opening hours `[LOCKED]`

| Day | Hours |
|---|---|
| Monday–Friday | 09:00–18:00 |
| Saturday | 08:00–16:00 |
| Sunday | Closed |

Short form: `Mon–Fri 09:00–18:00 · Sat 08:00–16:00 · Sun Closed`

Dynamic "today" line (Lusaka date): `Today: {open}–{close}` / `Today: Closed`. Always true regardless of the current time; no open-now/closed-now logic.

### Booking rules as user-facing facts `[LOCKED per PRD §11.4]`
Book up to 30 days ahead · 15-minute start times · at least 1 hour's notice · appointments must finish by closing time · payment in-store · cancellations by phone.

---

## 5. Social Links

The PRD forbids fake social accounts. **No Groomd social accounts exist.**

| Platform | Proposed | Destination | Accessible name / label |
|---|---|---|---|
| Instagram | Yes `[APPROVED]` | `https://www.instagram.com/` (platform homepage) | "Instagram (opens instagram.com)" |
| Facebook | Yes `[APPROVED]` | `https://www.facebook.com/` (platform homepage) | "Facebook (opens facebook.com)" |
| TikTok | Omitted | — | — |

**Decision (D3):** no social accounts are created for the assessment. Links go to platform homepages only, labelled as such.

Rules:
- **Never** use `instagram.com/groomd` or any guessed handle. It may belong to someone else.
- With homepage fallbacks, the footer heading is **"Social"**, not "Follow us". No copy may imply a Groomd profile exists.

---

## 6. Home Page Content `[APPROVED]`

### 6.1 Hero

| Element | Copy |
|---|---|
| Eyebrow | ● MEN'S GROOMING STUDIO · LUSAKA |
| Headline (display) | LOOK SHARP. **EFFORTLESSLY.** *(the honey-highlighted word is "EFFORTLESSLY.")* |
| Supporting paragraph | Precision cuts, clean fades and proper beard work from barbers who take their time. Book your chair online in about a minute. |
| Primary CTA | Book an appointment |
| Secondary CTA | View services *(justified: price-checkers are a key audience)* |
| Trust line | {Today: 09:00–18:00 \| Today: Closed} · Kabulonga, Lusaka |

The page's only `h1` is the headline.

### 6.2 Quick-info strip

| Item | Copy |
|---|---|
| Location | Kabulonga, Lusaka |
| Hours | Mon–Fri 09:00–18:00 · Sat 08:00–16:00 |
| Booking | Book online, any time |

Walk-ins are **not** mentioned (not decided).

### 6.3 Values

- Eyebrow: ● WHY GROOMD
- H2: A barbershop that respects your time.

| Title | Line |
|---|---|
| Time set aside for you | Every appointment is booked for the full length of your service, so nobody rushes your cut. |
| Prices you can see | Every service is listed with its price and time before you book. No surprises at the chair. |
| Your barber, your call | Pick the barber you trust, or choose no preference and we'll seat you with whoever is free. |

### 6.4 Services preview
- Eyebrow: ● SERVICES
- H2: Cuts, fades and beard work
- Intro: A short menu, done properly.
- Cards (from §7, exactly as written there): **Signature Cut**, **Skin Fade**, **Beard Trim & Shape**, **Cut & Beard**
- Link: View all services →

### 6.5 Craft / story (Mid Wine band)
- Eyebrow: ● THE CRAFT
- H2: Good cuts take time.
- Paragraph 1: At Groomd, every appointment starts with a conversation. How you wear your hair, how fast it grows, what works for your week. Then we get to work: clean sections, sharp lines and a finish that still looks right a week later.
- Paragraph 2: We keep the menu short so every service gets our full attention, from a quick line-up to a full cut with a hot towel shave.
- Link: More about Groomd →

### 6.6 Barbers preview
- Eyebrow: ● THE BARBERS
- H2: Meet the team
- Intro: Three barbers, each offering the full menu.
- Cards: Mwila Banda (Head Barber) · Chanda Mulenga (Senior Barber) · Kondwani Phiri (Barber), using the card descriptions in §8.
- Link: About the team →

### 6.7 Visit
- Eyebrow: ● VISIT
- H2: Find the studio
- Body: We're in Kabulonga, a short drive from the city centre. Book ahead to secure your time.
- Address block, hours table (with today marked "Today"), phone.
- CTA (Outline): Get directions

### 6.8 Final booking CTA (honey invitation band, shared with other marketing pages)
- H2: Ready for a fresh cut?
- Body: Choose your service, barber and a time that suits you.
- CTA: Book Now

---

## 7. Services Catalogue `[APPROVED names, descriptions and prices · LOCKED rules]`

Seven services, one price and one duration each. All durations are multiples of 15 minutes (DESIGN §8 / PRD §8). One service per booking.

**Pricing logic:** a mid-to-upper Lusaka barbershop. Quick services sit at K 150; full haircuts at K 220–250; the package costs slightly less than booking the two services separately (K 220 + K 150 = K 370 → K 350). Prices are always shown at the standard rate.

| # | Category | Service name | Short description | Price | Duration | Booking CTA |
|---|---|---|---|---|---|---|
| 1 | Haircuts | **Signature Cut** | A consultation, precision cut and styled finish. Scissors, clippers or both, whatever suits your hair. | K 220 | 45 min | Book this |
| 2 | Haircuts | **Skin Fade** | A clean fade taken down to the skin, blended smoothly and finished with a sharp line-up. | K 250 | 45 min | Book this |
| 3 | Haircuts | **Buzz Cut & Line-Up** | One all-over clipper length with crisp edges around the hairline and neck. | K 150 | 30 min | Book this |
| 4 | Beard | **Beard Trim & Shape** | Your beard trimmed to length, shaped to your face and lined up with a straight razor. | K 150 | 30 min | Book this |
| 5 | Beard | **Hot Towel Shave** | A traditional straight-razor shave with hot towels, a warm lather and a cooling finish. | K 200 | 45 min | Book this |
| 6 | Packages | **Cut & Beard** | A Signature Cut or Skin Fade with a full Beard Trim & Shape in one appointment. Choose your cut with your barber on the day, or add it in the notes. | K 350 | 75 min | Book this |
| 7 | Kids | **Kids' Cut** | A patient, tidy cut for kids aged 12 and under. A parent or guardian stays during the appointment. | K 120 | 30 min | Book this |

**Category headings and intros (Services page)**

| Category | H2 | Intro |
|---|---|---|
| Haircuts | Haircuts | Classic, modern or somewhere in between. |
| Beard | Beard & shave | Shape, line and a close, comfortable shave. |
| Packages | Packages | Cut and beard in one visit. |
| Kids | Kids | Good first haircuts, without the fuss. |

**Availability test values (R1 / PRD AC-B6):** the longest service is **Cut & Beard (75 min)**. Latest start: **16:45 on weekdays** and **14:45 on Saturday**. The shortest services (30 min) can start at 17:30 on weekdays and 15:30 on Saturday.

**"Book this" accessible names (R9):** the visible text stays "Book this", but each link's accessible name includes the service, e.g. "Book Signature Cut". The same applies to "Book with {first name}" → "Book with Mwila Banda".

**Service card meta format:** `{duration} min` with a clock icon, e.g. "45 min". Price format: `K 220`.
**Badges:** none by default. A "Popular" badge would be an unsupported claim for a fictional shop; DESIGN allows it but doesn't require it.

**Services page**
- Eyebrow: ● SERVICES
- H1: SERVICES & PRICES
- Intro: Every service includes a consultation with your barber and a finish you'll be happy walking out with.
- Note: All prices in ZMW · Pay in-store
- Category jump chips: Haircuts · Beard · Packages · Kids
- Final band: the honey invitation band (§6.8).

---

## 8. Barber Profiles `[APPROVED FICTIONAL CONTENT]`

All three barbers perform **every** service and work **all** opening hours. There are no individual schedules `[LOCKED per PRD §9]`.

### 8.1 Mwila Banda
- **Role:** Head Barber
- **Card description:** Precise fades and tapers, with a calm hand and a sharp eye.
- **Bio:** Mwila has been cutting hair in Lusaka for over ten years, starting in his uncle's shop in Kabwata. He's known for patient consultations and fades that grow out cleanly. As head barber, he keeps standards consistent across the studio.
- **Specialities:** Skin fades · Tapers · Line-ups
- **Image direction:** 4:5 portrait, head to mid-chest, warm plaster backdrop, soft window light, relaxed confident expression, black barber's apron, clippers held naturally at chest height or resting on a station.
- **Alt text:** Mwila Banda, head barber at Groomd, standing in the studio wearing a black apron.

### 8.2 Chanda Mulenga
- **Role:** Senior Barber
- **Card description:** Beard shaping and straight-razor shaves, done slowly and properly.
- **Bio:** Chanda moved into barbering after years of cutting friends' hair at university in Kitwe. Seven years on, beards are his speciality: shaping, lining and hot towel shaves that leave skin comfortable, not irritated.
- **Specialities:** Beard shaping · Hot towel shaves · Classic cuts
- **Image direction:** same backdrop, lighting and framing as the others. Short, well-groomed beard, friendly half-smile.
- **Alt text:** Chanda Mulenga, senior barber at Groomd, smiling in the studio.

### 8.3 Kondwani Phiri
- **Role:** Barber
- **Card description:** Modern textured cuts and easy-going kids' appointments.
- **Bio:** Kondwani trained in Lusaka and joined Groomd after four years in busy city-centre shops. He enjoys modern textured styles and working with younger clients. He's also great with first haircuts.
- **Specialities:** Textured cuts · Kids' cuts · Styling
- **Image direction:** same backdrop, lighting and framing, open, approachable expression.
- **Alt text:** Kondwani Phiri, barber at Groomd, standing at a barber station.

*The bios' histories are fictional narrative for the assessment, not factual claims about real people.*

---

## 9. Booking Content `[APPROVED]`

### 9.1 Page header
- H1: BOOK AN APPOINTMENT
- Subline: Takes about a minute. No payment needed.

### 9.2 Step labels (DESIGN §11)

| Step | Stepper label (short) | Step heading (h3) |
|---|---|---|
| 1 | Service | Choose a service |
| 2 | Barber & time | Pick your barber and time |
| 3 | Your details | Your details |
| 4 | Review & confirm | Review your booking |

- Mobile progress: `Step {n} of 4 · {stepper label}`
- Buttons: **Continue** · **Back** · (step 4) **Confirm booking**
- Collapsed summary line: `{Service} · {Short date} · {HH:MM}`. Change link: **Change**
- Live summary empty value: Not selected yet

### 9.3 Service selection
- Heading: Choose a service
- Helper: One service per appointment. Want a cut and beard? Choose the Cut & Beard package.
- Option format: `{Service name}` · `{duration} min` · `K {price}`
- Selected state: announced by the control's native checked state. Don't add "selected" to labels.

### 9.4 Barber selection
- Heading: Choose your barber
- Helper: All our barbers offer every service.
- No preference option: **No preference**. Helper: "We'll assign the first available barber."
- Barber option: `{Name}` · `{Role}`
- Context line when No preference is chosen: "We'll show your barber on the confirmation."

### 9.5 Date selection
- Heading: Pick a date
- Helper: You can book up to 30 days ahead.
- Today label: Today
- **Closed** label: Closed. Accessible name: `{Day date}, closed. The studio is not open on this day.`
- **Full** label: Full. Accessible name: `{Day date}, fully booked. No times left for this service.`
- *Closed = the studio is not operating that day (Sundays). Full = the studio is open but no bookable time remains for the chosen service and barber.*

### 9.6 Time selection
- Heading: Pick a time
- Context line: Showing times for **{Service} ({duration} min)** with **{Barber name | the first available barber}** on **{Sat 10 Oct}**
- Group labels: Morning · Afternoon · Evening
- Helper: All times are Lusaka time.
- Group rules: Morning = before 12:00 · Afternoon = 12:00–16:59 · Evening = 17:00 onwards. Hide a group with no times (e.g. Evening on Saturdays).
- Loading: Checking availability…
- No availability heading: No times available on {Sat 10 Oct}
- No availability body: Please choose another date.
- No availability action (optional, only if the next open date is easy to determine): See next available day
- Selected state: native checked/pressed state only (no "selected" text in the label).

### 9.7 Customer details

| Field | Label | Helper / placeholder |
|---|---|---|
| Full name | Full name | Placeholder: e.g. Mutale Zulu |
| Mobile number | Mobile number | Helper: We'll only call if something changes with your booking. Placeholder: +260 97 123 4567 |
| Email | Email | Helper: In case we need to reach you about this booking. We don't send marketing. Placeholder: you@example.com |
| Notes | Notes (optional) | Helper: Anything your barber should know, like a style you have in mind or if it's your first visit. |
| Terms | I agree to the [Terms & Conditions] | Keep the Terms link separate from the clickable checkbox area, so tapping the link doesn't tick the box |

### 9.8 Validation messages

| Case | Message |
|---|---|
| Missing name | Please enter your full name. |
| Invalid name | Your name needs at least 2 characters. |
| Missing phone | Please enter your mobile number. |
| Invalid phone | Please enter a valid phone number, e.g. +260 97 123 4567. |
| Missing email | Please enter your email address. |
| Invalid email | Please enter a valid email address, e.g. name@example.com. |
| Missing Terms | Please agree to the Terms & Conditions to continue. |
| Missing service | Please choose a service. |
| Missing barber | Please choose a barber or select No preference. *(Normally not shown: barber defaults to No preference.)* |
| Missing date | Please pick a date. |
| Missing time | Please pick a time. |
| Invalidated time (service/barber changed) | Your chosen time was cleared because it no longer fits your new selection. Please pick another time. |
| Invalid/expired selection (e.g. time has passed or is inside the 1-hour notice window) | That time is no longer available. Please pick another. |
| Slot taken (conflict) | Sorry, {HH:MM} was just booked by someone else. Here are the latest available times. |
| Server/network error | We couldn't reach the booking service. Your details are still here. Please try again. **Button:** Try again |
| Error summary (top of step) | Please fix the errors below. *(Optionally list each error as a link to its field.)* |

### 9.9 Review
- Heading: Review your booking
- Group labels: **Appointment** · **Your details**. Edit action: **Change**
- Row labels: Service · Barber · Date · Time · Duration · Price · Name · Mobile · Email · Notes
- Barber value for No preference: First available barber
- Time value: `{HH:MM}–{HH:MM}`
- Notes empty: None
- FIRST15 note: First visit? Mention **FIRST15** when you arrive.
- Confirm button: **Confirm booking**. Loading: Confirming…
- Caption: No payment needed now · Pay in-store

### 9.10 Confirmation
- Eyebrow: BOOKING CONFIRMED
- Heading: See you soon, {first name}.
- Message: Your appointment is booked. We don't send a confirmation message, so add it to your calendar or take a screenshot. Keep your reference handy.
- Reference label: Booking reference. Value: `GRD-XXXXXX` (6 characters, capital letters and numbers, excluding 0, O, 1 and I). Copy button: Copy · copied state: Copied
- Summary labels: Service · Barber · Date · Time · Duration · Price · Name
- Assigned barber wording (No preference): `{Barber name}` with helper text "Assigned: first available barber"
- Calendar heading: Add to your calendar
- Google CTA: **Add to Google Calendar**
- Apple CTA: **Add to Apple Calendar**. Caption: Downloads an .ics file. Also works with Outlook and other calendar apps.
- What to expect (heading): Before you arrive
  - Arrive 5 minutes early so we can start on time.
  - Payment is taken in-store after your appointment.
  - Need to cancel or change? Call us on {phone}, ideally at least 2 hours before.
- Address line: Groomd, {full address}
- Links: **Book another appointment** · **Back to home**

No copy may say or imply "we've emailed/texted/WhatsApped you".

### 9.11 Calendar event content (one-way event generation) `[LOCKED structure per PRD §12 · APPROVED wording]`

| Field | Content |
|---|---|
| Title | `{Service} at Groomd`, e.g. "Skin Fade at Groomd" |
| Start / End | Selected date and start time / start + service duration, Africa/Lusaka |
| Location | Groomd, Shop 3, Mopani Court, Kabulonga, Lusaka, Zambia |
| Description *(⏎ = line break; never type the symbol)* | Service: {Service} ({duration} min)⏎Barber: {Barber name}⏎Price: K {price} (pay in-store)⏎Booking reference: {GRD-XXXXXX}⏎Name: {Customer name}⏎⏎Please arrive 5 minutes early. To cancel or change, call Groomd on +260 97 000 0000.⏎Terms: {site URL}/terms |
| Location note | Map apps may not find this fictional address. This is accepted as a known limitation |
| .ics file name | `groomd-appointment-{YYYY-MM-DD}.ics` |
| Reminder (optional per PRD) | 1 hour before: "Your Groomd appointment starts in 1 hour." |

The event is a one-off copy. Later changes to the booking aren't synced.

---

## 10. FIRST15 Promotion `[APPROVED wording · LOCKED mechanics]`

| Element | Copy |
|---|---|
| Eyebrow | ● NEW TO GROOMD? |
| Heading | **15% off** your first visit |
| Body | Get 15% off one service. Just mention **FIRST15** when you arrive. The discount is applied in-store. |
| Code | FIRST15 |
| CTA | Book your first visit |
| Dismiss | No thanks |
| Close button accessible name | Close offer |
| Terms note | First visit only. [See terms] *(links to /terms#first-visit-offer)* |
| Dialog accessible name | First visit offer |

Also shown: the Review note (§9.9). No countdowns, urgency copy, codes to enter online, or discounted prices anywhere `[LOCKED per PRD §13]`.

---

## 11. Contact Page `[APPROVED]`

- Eyebrow: ● CONTACT
- H1: VISIT GROOMD
- Intro: Find us in Kabulonga, give us a call, or book your chair online.
- **Address** card: title "Address", the multi-line address, CTA "Get directions" (opens the suburb-level Google Maps search)
- **Phone** card: title "Phone", +260 97 000 0000, helper "Call to cancel or change a booking."
- **Email** card: title "Email", hello@groomd.example, helper "For general questions. For bookings, use online booking."
- **Opening hours** panel: title "Opening hours", hours table, today marker "Today", "Sunday — Closed"
- **Map section:** heading "Getting here". Body: "We're in Kabulonga, east of the city centre. Search 'Kabulonga, Lusaka' in your maps app or tap below." CTA: Open in Google Maps
- **Fictional notice (small caption under the map) `[APPROVED]`:** "Groomd is a fictional studio created for a design assessment. The address, phone number and email are illustrative and not monitored."
- **Contact guidance:** "The quickest way to get a time is to book online. We can't take bookings by email."
- Final band: the honey invitation band (§6.8).

---

## 12. About Page `[APPROVED]`

- Eyebrow: ● ABOUT
- H1: ABOUT GROOMD
- Intro: A modern barbershop in Kabulonga, built around one idea: good grooming should be easy to book and worth the chair time.

**Story (split 1)**
- H2: Why we opened
- Body: Groomd started from a simple frustration: long waits, unclear prices and cuts rushed to clear the queue. So we built a studio that works the other way. Book a time, know the price, and get a barber who gives your cut the attention it needs.

**Approach (split 2)**
- H2: How we work
- Body: A short menu. Proper consultations. Clean tools for every client. Appointments booked for the full length of your service. It's not complicated, just done consistently, every time.

**Values row**
- Eyebrow: ● WHAT WE STAND FOR

| Title | Line |
|---|---|
| Consistency | The same care on your tenth visit as your first. |
| Clean and tidy | Sanitised tools and a fresh setup for every client. |
| Straight talk | Honest advice on what will suit you, even if it's a smaller job. |

**Mid Wine supporting panel (default, no founder)**
- Eyebrow: ● OUR APPROACH
- Statement: "Take the time to get it right. Every cut, every client."
- Attribution: The Groomd team

**Founder section:** not used (D6). The team statement above is final.

**Barbers section**
- Eyebrow: ● THE BARBERS
- H2: Meet the barbers
- Intro: Three barbers, each with their own strengths. All of them offer every service on the menu.
- Cards: full profiles from §8. Optional per-card link "Book with {first name}" (DESIGN marks this optional).

Final band: the honey invitation band (§6.8).

---

## 13. Footer Content

| Block | Content |
|---|---|
| Brand | GROOMD. / MEN'S GROOMING STUDIO (lockup). Line: "A modern barbershop in Kabulonga, Lusaka." |
| Explore (heading) | Home · Services · About · Contact · Book an appointment *(see C-1)* |
| Visit (heading) | {multi-line address} · +260 97 000 0000 · hello@groomd.example |
| Hours (heading) | Monday–Friday 09:00–18:00 · Saturday 08:00–16:00 · Sunday Closed |
| Social (heading) | Per §5 (approved destinations only) |
| Legal | Terms & Conditions · Privacy Policy |
| Copyright | © {current year} Groomd. All rights reserved. |

**Invitation band** (marketing pages only, not /book or legal pages): see §6.8.

---

## 14. Terms & Conditions `[APPROVED]`

- Eyebrow: LEGAL
- H1: TERMS & CONDITIONS
- Last updated: {deployment date, e.g. 24 September 2026}
- Intro: These terms explain how booking and appointments work at Groomd. They're written in plain language. By booking, you agree to them.

**1. Booking an appointment**
You can book online up to 30 days ahead. A booking is confirmed only when you see the confirmation screen with a booking reference. Your confirmation appears on screen. We don't send confirmation emails or text messages, so note your reference or add the appointment to your calendar. Please give accurate contact details so we can reach you if something changes.

**2. One service per booking**
Each booking covers one service. For a cut and beard together, choose the Cut & Beard package. If you'd like extra work on the day, ask your barber. We'll help if time allows.

**3. Arrival and timing**
Please arrive 5 minutes before your appointment. Appointment lengths are estimates and may run slightly shorter or longer.

**4. Late arrival**
If you're more than 10 minutes late, we may need to shorten your service or rebook you so the next client isn't kept waiting.

**5. Cancellations and changes**
To cancel or change a booking, call us on +260 97 000 0000, ideally at least 2 hours before your appointment. Bookings can't be changed or cancelled online.

**6. No-shows**
If you can't make it, please call us so someone else can have your time. Missed appointments without notice make it harder for us to keep times available for everyone.

**7. Prices and payment**
Prices are in Zambian Kwacha (ZMW) and are shown on our website. Payment is made in-store after your appointment. No payment is taken online. Prices may change, but the price shown when you booked applies to that booking.

**8. First visit offer (FIRST15)** {anchor: first-visit-offer}
New clients get 15% off one service on their first visit (one booking = one service). Mention FIRST15 when you arrive. The discount is applied in-store. The offer applies once per person, can't be combined with other offers, and can't be exchanged for cash. Groomd may end the offer at any time.

**9. Barbers**
You can choose a barber or select No preference, in which case we'll assign the first available barber. Occasionally we may need to change your barber. We'll let you know when you arrive or by phone.

**10. Kids' cuts**
Kids' Cut appointments are for kids aged 12 and under. A parent or guardian must stay during the appointment.

**11. Services and wellbeing**
Please tell your barber about any skin sensitivity, allergies or scalp conditions before we start. We may decline or adjust a service if we believe it isn't safe or suitable.

**12. Liability**
We take care with every service. We're not responsible for results affected by information you didn't share with us, or for personal belongings left at the studio.

**13. Conduct**
We aim to keep Groomd friendly and relaxed. We may refuse service to anyone who is abusive or disruptive.

**14. Your information**
We use your booking details only to manage your appointment. See our Privacy Policy.

**15. Changes to these terms**
We may update these terms. The version on this page applies to new bookings.

**Questions?** Call +260 97 000 0000 or email hello@groomd.example.
Links: Back to home · Book an appointment

---

## 15. Privacy Policy `[APPROVED]`

- Eyebrow: LEGAL
- H1: PRIVACY POLICY
- Last updated: {deployment date}
- Intro: This policy explains what information Groomd collects when you book, and how we use it.

**1. What we collect**
When you book, we collect your full name, mobile number, email address, any notes you add, and your booking details: service, barber, date, time and booking reference.

**2. Why we collect it**
Only to manage your appointment: to hold your time, prepare for your visit, and contact you if something about your booking changes.

**3. How we use it**
Your details are stored securely with your booking. We don't use them for marketing, and we don't send promotional emails or messages.

**4. We don't sell your information**
We never sell, rent or trade your personal information.

**5. How long we keep it**
We keep booking records for up to 12 months after your appointment, then delete them.

**6. Calendar events**
If you choose "Add to Google Calendar", your appointment details are passed to Google so Google can create the event in your account. If you choose "Add to Apple Calendar", an .ics file is created on your device. What happens next is governed by your calendar provider. This is a one-off event, not a connection between Groomd and your calendar.

**7. Keeping it safe**
We take reasonable steps to protect your information and limit access to what's needed to run your booking.

**8. Your choices**
You can ask us what booking information we hold about you, or ask us to correct or delete it, by contacting us below.

**9. Contact**
Questions about privacy? Email hello@groomd.example or call +260 97 000 0000.

Links: Back to home · Book an appointment

*No legal regimes, certifications or compliance claims are made.*

---

## 16. 404 Page `[APPROVED]`

| Element | Copy |
|---|---|
| Decorative label | 404 |
| H1 | This page took a little off the top. |
| Message | The page you're looking for doesn't exist or has moved. |
| Primary CTA | Book an appointment |
| Secondary CTA | Back to home |

---

## 17. Image Content & Alt Text `[APPROVED direction · PENDING sources]`

Nine images in total. All documentary-style, in a modern Lusaka studio (dark wood, leather chairs, cream plaster walls, matte black and subtle brass fittings, plants), warm practical or window light, Black African barbers and clients, natural skin tones, no colour filters, no wine glasses, cosmetics, fashion poses, barber poles or AI artefacts.

| # | Page / section | Subject | Ratio | Purpose | Alt text |
|---|---|---|---|---|---|
| 1 | Home hero | Barber finishing a skin fade on a seated client, trimmer at the temple, client's face visible in profile | 4:5 on lg (7-col crop) / 4:3 on sm / 16:9 on md | Instantly says "barbershop" | A Groomd barber finishing a skin fade on a client in a leather barber chair. |
| 2 | Home craft band | Close-up of hands lining up a beard with a straight razor | 4:5 | Craft and precision | Close-up of a barber lining up a client's beard with a straight razor. |
| 3 | Home visit / Contact | Studio interior: two stations, leather chairs, mirrors, plants, warm light, no people or blurred people | 3:2 | Shows the space | The Groomd studio interior with leather barber chairs, mirrors and warm lighting. |
| 4–6 | Barber cards (Home, About) | Portraits of Mwila, Chanda, Kondwani (see §8) | 4:5, matched | Barber profiles | See §8 alt text |
| 7 | About story split 1 | Barber and client talking in the mirror before a cut | 4:5 | Consultation / approach | A barber talking with a client in the mirror before starting a haircut. |
| 8 | About story split 2 | Father watching his young son get a haircut | 4:5 | Welcoming, kids' cuts | A young boy getting a haircut while his father watches from the next chair. |
| 9 | Modal (md+ only) and OG image | Hot towel being placed on a relaxed client | 16:9 | First-visit offer | A client relaxing under a hot towel during a shave. *(Modal image may be decorative, with empty alt, if the offer text carries the message.)* |

Optional (not required): a Services page header image (reuse #3 or #1 crop). Decorative images use empty alt.

Final sources (stock or AI-generated) and technical processing are `[PENDING]` (→ implementation / ARCHITECTURE).

---

## 18. Content Consistency Rules

1. Always write **Groomd**: never GroomD, Groom'd, Groomed or GROOMD in body text (GROOMD. is the logo only).
2. Prices: `K {number}`, whole numbers, ZMW. No decimals, no "ZMW 250" in UI (ZMW is only mentioned in notes and Terms).
3. Times: 24-hour, Lusaka time. Dates: `Sat 10 Oct 2026`. Ranges with an en dash: `14:30–15:15`.
4. Service names, prices and durations are exactly as in §7 everywhere (Home, Services, Booking, Review, Confirmation, calendar event).
5. Barber names and roles are exactly as in §8 everywhere.
6. Business details are exactly as in §4 everywhere.
7. CTA wording: **Book Now** (header, invitation band), **Book an appointment** (hero, 404, legal links, footer), **Book this** (service cards), **Book your first visit** (offer popup), **Confirm booking** (step 4). Never "Reserve", "Order" or "Checkout".
8. No services, policies or offers outside this document.
9. No testimonials, reviews, ratings, awards, client counts or "best" claims.
10. FIRST15 is never shown as a reduced price.
11. Never imply online payment, deposits or card capture.
12. Never imply email, SMS or WhatsApp confirmations or reminders.
13. Calendar copy says "Add to…", never "Sync" or "Connect".
14. Never present a platform homepage as a Groomd profile.
15. Headings may use uppercase selectively (display/h1 per DESIGN). Otherwise sentence case.
16. Use "Closed" only for non-operating days and "Full" only for operating days with no availability.
17. "No preference" is the option name. Its result is always "the first available barber".
18. Contact details are placeholders (`+260 97 000 0000`, `hello@groomd.example`). Never replace them with real-looking numbers or domains Groomd doesn't control.

---

## 19. Content Decisions & Pending Items

### LOCKED (from PRD / DESIGN)

| Item | Value |
|---|---|
| Brand | Groomd — Men's Grooming Studio |
| Location | Lusaka, Zambia |
| Currency / format | ZMW, `K 250` |
| Timezone | Africa/Lusaka (CAT, UTC+2) |
| Opening hours | Mon–Fri 09:00–18:00 · Sat 08:00–16:00 · Sun Closed |
| Booking rules | 30 days ahead, 15-minute steps, 1-hour notice, finish by closing |
| Barbers | Exactly 3, all services, all hours |
| Catalogue requirements | Haircuts, fades, beard, package, kids; one price and duration each; multiples of 15 minutes |
| Offer | FIRST15, first visit, applied in-store, Home popup, no discount pricing |
| Booking terminology | 4 visual steps; No preference; Closed ≠ Full; reference `GRD-XXXXXX` |
| Calendar | Google Calendar + Apple-compatible .ics, one-way, title `{Service} at Groomd` |
| Payment | In-store only |
| Confirmation | On screen only |
| Social | No fake accounts; platform homepages only (Instagram, Facebook), labelled as such (D3) |
| Contact details | Placeholder phone `+260 97 000 0000`, reserved-domain email `hello@groomd.example`, fictional notice on Contact (D2, D4) |
| Retention | 12 months; test bookings cleared before submission (D5) |
| About | Team statement; no founder (D6) |
| Nav | Home · Services · About · Contact + Book Now |

### APPROVED (D7, after R1–R16)
Service names, descriptions, prices (K 120–350) and durations (§7) · barber names, roles, bios and specialities (§8) · address (§4) · all page copy, including the hero "Look sharp. Effortlessly." (§6, §11, §12) · offer wording (§10) · booking, validation and confirmation copy (§9) · calendar description (§9.11) · Terms (2-hour cancellation guidance, 10-minute late rule, kids 12 and under, liability) (§14) · Privacy (12-month retention) (§15) · fictional notice (§11) · image list and alt text (§17).

### PENDING

| # | Item | Blocked by |
|---|---|---|
| P-1 | Final image sources (stock vs AI) | Implementation |
| P-2 | Calendar/event technical details (encoding, UID, timezone handling) | ARCHITECTURE.md |
| P-3 | Mechanism for clearing test bookings before submission (requirement approved in D5) | ARCHITECTURE.md |
| P-4 | Deployment date for "Last updated" on legal pages | Implementation |

### Conflicts / notes vs PRD & DESIGN
- **C-1 Footer booking label:** "Book an appointment", per DESIGN §16. Resolved; no change needed.
- **C-2 "Popular" badge:** optional in DESIGN, not used (it would be an unsupported claim). Resolved.
- **C-3 AC-B6 90-minute example:** PRD §11.4 and AC-B6 updated to the 75-minute Cut & Beard (D1). DESIGN had no 90-minute example left to change. Resolved.

---

## Quality-Control Check

| # | Check | Result |
|---|---|---|
| 1 | Every required page has content | ✅ Home, Services, About, Book, Contact, Terms, Privacy, 404 |
| 2 | Every service has a price and duration | ✅ 7/7 |
| 3 | Required categories | ✅ Haircuts, fade (Skin Fade), beard, package, kids |
| 4 | Exactly three barbers | ✅ |
| 5 | No barber schedules | ✅ |
| 6 | Hours consistent | ✅ §4 is the only source; all pages reference it |
| 7 | ZMW consistent | ✅ `K` format throughout |
| 8 | Booking terminology matches PRD/DESIGN | ✅ 4 steps, No preference, Continue/Back/Confirm booking |
| 9 | Closed ≠ Full | ✅ §9.5, rule 16 |
| 10 | No discount-price UI | ✅ |
| 11 | No payment content | ✅ "Pay in-store" only |
| 12 | No email/SMS/WhatsApp promises | ✅ Terms §1 and the confirmation screen say no confirmation messages are sent |
| 13 | No calendar sync implied | ✅ §9.11, §15.6 |
| 14 | Social honesty | ✅ §5: platform homepages, honestly labelled |
| 15 | Legal concise | ✅ 15 short Terms sections (including liability), 9 Privacy sections |
| 16 | No fake testimonials, reviews or awards | ✅ Barber bios are labelled fictional narrative |
| 17 | Not wine/luxury/cosmetics/e-commerce | ✅ Avoid list, barbering vocabulary |
| 18 | Copy fits layouts | ✅ Hero paragraph 2 sentences; card descriptions ≤ about 20 words |
| 19 | Hero says barbering | ✅ "Precision cuts, clean fades and proper beard work…" |
| 20 | No conflict with the visual system | ✅ Honey-highlight word, eyebrows and bands follow DESIGN |
