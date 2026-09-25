# PRD — Groomd · Men's Grooming Studio

> **Status:** Final Draft v1.0 — Milestone 0, Task 0.1
> **Authoritative source:** *Talent Forge — Junior Full-Stack Developer Practical Assessment — Barber Shop Website* (the "brief").
> **This document defines what the product must do.** Visual design → `DESIGN.md`. Final copy, prices and business details → `CONTENT.md`. Technology and system design → `ARCHITECTURE.md`. Sequencing → `IMPLEMENTATION_ROADMAP.md`.

### Tags

| Tag | Meaning |
|---|---|
| **[TF]** | Stated in the Talent Forge brief. Must be met. |
| **[GD]** | Groomd product decision, made to meet or strengthen a [TF] requirement. We can change it by agreement. |
| **[OPT]** | Optional. Only if time allows. Not needed to meet the brief. |
| **→ CONTENT / DESIGN / ARCH** | Detail deliberately deferred to that document. |

---

## 1. Product Overview

Groomd is a fictional men's grooming studio (a barbershop) in Lusaka, Zambia. Its website lets visitors understand the studio, browse services and prices, meet the barbers, find the studio, and book an appointment. After booking, they can add the appointment to Google Calendar or Apple Calendar.

The website is the only deliverable of a recruitment assessment. It must feel like a finished site that could launch for a real client.

## 2. Assessment Context [TF]

- Design, build, test and deploy a complete, professional website for a fictional barber shop.
- Submission is **one live website URL only**. No code, screenshots, ZIPs, PDFs, documentation or videos.
- Any tools may be used, including AI. We remain responsible for understanding, testing and correcting everything.
- Reviewers look at: visual design, user experience, functionality, booking experience, calendar integration, attention to detail (including edge cases), technical quality (reliability, responsiveness, performance) and completeness.
- The brief states no deadline. Delivering quickly is our own constraint **[GD]**.

**Implication:** reviewers judge only what they can use in a browser, so every feature must explain itself through the interface.

## 3. Goals

1. **[TF]** A coherent, professional barbershop brand across every page.
2. **[TF]** A booking journey that genuinely works end to end.
3. **[TF]** Customers can add *their own* booked appointment to Google Calendar or Apple Calendar with correct details.
4. **[TF]** Works properly on desktop, tablet and mobile.
5. **[TF]** No broken interactions, broken images, JavaScript errors, unfinished sections or debug information.
6. **[GD]** A small scope, finished to a high polish. Reliability matters more than the number of features.

## 4. Target User

- **[GD]** Men in Lusaka, roughly 18–45, who want a dependable modern haircut or beard service and prefer to book online, mostly on a phone. Secondary: parents booking a kids' cut.
- **Practical audience:** the Talent Forge reviewer, who will run the full journey on several screen sizes and look for anything broken.

## 5. Brand & Positioning

**[TF]**
- Create the name, brand, logo, colour palette, services, prices, barber profiles, content, imagery, contact information, opening hours and location. All of it must form **one coherent brand**.
- Logo incorporated properly, including in the header.
- Deliberate, consistent colour palette with good contrast.
- Fonts with clear hierarchy that are easy to read.
- High-quality, relevant barber/barbershop imagery. No stretched, pixelated, badly cropped or irrelevant images.
- Spacing, alignment, section sizes, buttons and cards must feel intentional and consistent.

**[GD] (locked)**
- Name: **Groomd**. Primary descriptor: **Men's Grooming Studio**.
- Copy uses "barber", "barbershop", "cut", "fade" and similar words so visitors know immediately that Groomd is a place you visit for grooming services.
- Groomd must **not** look like a grooming-product or e-commerce brand. External references (e.g. MANSCAPED, Tiege Hanley, Figma examples) are inspiration only and must not be copied → DESIGN.
- Tone: modern, confident, clean and welcoming.

## 6. Pages

### 6.1 Required by the brief [TF]

| Page | Minimum expectation |
|---|---|
| Home | Strong hero, professional imagery, clear calls to action, obvious route to booking. |
| Services | Services and pricing presented professionally. |
| About | The studio, its story and/or its barbers. |
| Contact / Booking | Useful business information and a working booking experience. |
| Terms & Conditions | Real, complete terms, reachable from the site (preferably a footer legal link). No placeholder. |

The brief allows additional pages where they improve the customer experience.

### 6.2 Groomd page set [GD] (locked)

| Page | Purpose |
|---|---|
| **Home** | Hero with Book Now; service highlights; barbers teaser; location and hours summary; booking call to action. First-visit popup appears here. |
| **Services** | Full service menu grouped by category. Each service offers a "Book" action. |
| **About** | Studio story and values; profiles of all barbers. |
| **Book** | Dedicated booking experience (§11) and confirmation with calendar actions (§12). |
| **Contact** | Address, directions/map, phone, email, opening hours, social links, booking call to action. |
| **Terms & Conditions** | Booking, cancellation, lateness, no-shows, pricing and payment in-store, first-visit offer terms, liability. |
| **Privacy Policy** | Required because bookings store personal data (§11.6). Also means the footer has "legal links" in the plural. |
| **Not found (404)** | Branded page linking to Home and Book. |

Contact and Book are **separate pages**. Together they satisfy the brief's "Contact / Booking" page.

## 7. Navigation

### 7.1 Header
- **[TF]** Logo/branding, working links to the important pages, a clearly visible **Book Now** action.
- **[TF]** Mobile navigation must work.
- **[GD]** Links: Home, Services, About, Contact, plus Book Now as a distinct button. Logo links to Home. Current page is indicated.
- **[GD]** On mobile, Book Now stays visible without opening the menu.
- **[GD]** The mobile menu opens and closes reliably, closes after a link is chosen, can be closed with Escape and a close control, and works with the keyboard.

### 7.2 Footer
- **[TF]** Navigation, contact details, opening hours, social links, booking link, legal links, copyright.
- **[GD]** Legal links: Terms & Conditions and Privacy Policy. Copyright: "© {current year} Groomd".
- **[GD]** Phone and email are tappable (start a call / open the email app). The address links to a map.
- **[GD] Social links (locked):** no fake profiles, and no URLs that could belong to a real person or business. Each social link goes either to a **real Groomd account we create**, or to the **platform's homepage**. Platforms we don't want to link are omitted. Social links open in a new tab and have accessible labels. See §17, open item 1.

## 8. Services

- **[TF]** Services and prices presented professionally. The customer can select a service when booking.
- **[GD]** Each service has: name, short description, price in **ZMW**, duration in minutes, category.
- **[GD]** The catalogue covers the kinds of services the brief gives as examples: haircuts, fades, beard work, packages, kids' cuts. Roughly 6–8 services in total.
- **[GD]** All durations are multiples of 15 minutes, so they line up with the 15-minute time slots.
- **[GD]** One service catalogue feeds the Services page, the booking flow, the confirmation and the calendar event. A service's price and duration are identical everywhere.
- **[GD]** Choosing "Book" on a service opens the booking flow with that service pre-selected.
- **[GD]** One service per booking. Packages cover combined services.
- → CONTENT: final service names, descriptions, prices and durations.

## 9. Barbers

- **[TF]** Barber profiles are part of the site content. Booking lets the customer choose a barber "where applicable".
- **[GD]** 3 barbers, each with name, photo, role, short bio and specialities. Photos consistent in style.
- **[GD]** Every barber performs every service and works all opening hours. There are no barber-specific shifts or days off.
- **[GD]** Booking offers each barber plus **"No preference"** (see §11.3 for how it is assigned).
- → CONTENT: names, bios, specialities. → DESIGN: photo style.

## 10. Business Information

- **[TF]** Fictional but coherent contact information, opening hours and location.
- **[GD] (locked):**
  - Location: **Lusaka, Zambia**. Fictional but plausible street address. It must not be the address of an existing business.
  - Currency: **ZMW** (shown as "K" or "ZMW", used consistently → CONTENT).
  - Timezone: **Africa/Lusaka (CAT, UTC+2)**. All booking times are studio local time.
  - Phone in Zambian format (+260 …). Groomd-branded email address.
  - Opening hours: **Mon–Fri 09:00–18:00 · Sat 08:00–16:00 · Sun closed.**
- **[GD]** All business details and booking rules come from **one shared source**. Hours, address and contact details must never disagree between the header, footer, Contact page, booking, Terms and calendar events.
- → CONTENT: exact address, phone number, email, map location.

## 11. Booking

### 11.1 Requirements from the brief [TF]
- A **working** booking experience.
- The customer selects or provides **service, barber (where applicable), date, time and customer information**.
- A button that only looks like booking but does nothing does not count.
- The journey Home → Services → Booking → Select appointment → Complete booking → Add to calendar must work.

### 11.2 Flow [GD]

**Service → Barber → Date → Time → Customer details → Review → Confirm → Confirmation → Add to Calendar**

| Step | Behaviour |
|---|---|
| 1. Service | Choose exactly one. Show name, price and duration. Pre-selected when arriving from a service's "Book" action. |
| 2. Barber | Choose a barber or "No preference". |
| 3. Date | Choose an allowed date (§11.4). Unavailable dates are visibly disabled. |
| 4. Time | Choose from the available start times for that service, barber and date (§11.4). |
| 5. Customer details | Full name (required), mobile phone (required), email (required), notes (optional). Terms agreement checkbox (required); the Terms link must not lose booking progress. |
| 6. Review | Summary: service, barber, date, start–end time, duration, price, customer details, and the note "First visit? Mention **FIRST15** when you arrive" (§13). Each part can be edited. |
| 7. Confirm | Submitting shows a clear in-progress state. The booking cannot be submitted twice. |
| 8. Confirmation | Success message, booking reference, full appointment summary (including the assigned barber), what to expect on arrival, how to cancel (by phone, per Terms), and the calendar actions (§12). |

### 11.3 Barber assignment and conflicts [GD]
- **Conflict rule:** a barber can't have two bookings whose times overlap. Overlap is judged on the full time range (start → start + duration), not just the start time.
- **Specific barber:** only start times where that barber is free for the whole service duration are offered.
- **No preference:** a start time is offered if **at least one** barber is free for the whole duration. When the booking is confirmed, a free barber is assigned and shown on the confirmation and in the calendar event.
- **Double-booking race:** if the chosen time is taken by someone else before the customer confirms, the booking is rejected with a friendly message. The customer goes back to time selection with every other detail kept, and sees the updated available times.
- Availability information must not reveal any other customer's details.

### 11.4 Availability rules [GD] (locked)
- Bookable dates: from **today up to 30 days ahead**, where "today" is the current date in Lusaka.
- Sundays are closed and cannot be selected.
- Start times are offered in **15-minute steps** from opening time.
- A start time is valid only if **start + service duration ≤ closing time** that day. Examples: a 45-minute service on a weekday can start at 17:15 at the latest; a 75-minute service (the longest, Cut & Beard) can start at 16:45 on weekdays and 14:45 on Saturday at the latest.
- For today, start times less than **1 hour** from the current Lusaka time are not offered.
- If a date has no available times, the customer sees a clear "No times available on this day, please choose another date" message and can go straight back to pick another date.
- All times are shown and stored as Lusaka time, whatever timezone the visitor's device is set to. Times are written unambiguously, e.g. "Sat 10 Oct 2026, 14:30–16:00".
- The availability rules above come from the shared business configuration (§10).

### 11.5 Validation and error states [GD]
- The customer cannot move past a step without a valid choice. The booking cannot be submitted without service, date, time, valid customer details and Terms agreement. Barber defaults to "No preference".
- **Invalidated choices are handled, not ignored:**
  - Changing the date clears the chosen time.
  - Changing the service or barber re-checks the chosen time. If it's no longer valid (e.g. a longer service no longer fits before closing, or that barber is busy), the time is cleared and a short explanation is shown.
- Field rules: name at least 2 characters (after trimming spaces); valid email format; phone accepts Zambian and international formats (digits, spaces, leading +) of sensible length.
- Error messages appear next to the relevant field, in plain language, and are accessible to screen readers.
- If the server can't be reached or returns an error, the customer sees a clear message and can retry without re-entering details. A booking is never shown as confirmed unless it was actually saved.
- Refreshing or going back never leaves the page broken. The flow either keeps progress or restarts cleanly.

### 11.6 Persistence and server validation [GD] (locked: Option B)
- A confirmed booking is sent to the server and **stored**.
- The server **re-checks every rule** in §11.4–11.5 and the conflict rule in §11.3. It does not rely on the browser's checks alone.
- The server generates the booking reference (short, readable, unique, e.g. `GRD-XXXXXX` → CONTENT).
- Stored data is limited to what the appointment needs: service, barber, date/time, customer name, phone, email, notes, reference, created time. The Privacy Policy states what is collected and why.
- Confirmation is **on screen only**. No email, SMS or WhatsApp messages are sent, and no Terms, Privacy or UI copy may promise them.
- **Fallback (Option A):** if deployment risk becomes too high, bookings may be confirmed without storage. In that case, conflict prevention (§11.3) and AC-B9 are dropped, and the Privacy Policy is adjusted to match. This needs an explicit team decision.
- → ARCH: technology, data storage, endpoint design.

## 12. Calendar

### 12.1 Requirements from the brief [TF]
- After choosing a date and time, the customer can add the appointment to their calendar.
- Supports **Google Calendar** and **Apple Calendar-compatible** events.
- The event uses the **customer's selected booking details**. No hard-coded appointment.
- The event carries: shop name, service, selected date, correct start time, appropriate end time, location, useful appointment details.

### 12.2 Groomd decisions [GD]
- Calendar actions appear on the **confirmation screen** after the booking is saved, so events are only created for real bookings.
- Two clearly labelled actions:
  - **Add to Google Calendar**: opens Google Calendar with the event pre-filled, in a new tab.
  - **Add to Apple Calendar**: provides a standard calendar (`.ics`) file. Helper text notes it also works with Outlook and other calendar apps.
- Event content, taken entirely from the confirmed booking:

| Field | Content |
|---|---|
| Title | "{Service} at Groomd" |
| Date & start | Selected date and start time, Africa/Lusaka |
| End | Start + service duration |
| Location | Full Groomd studio address |
| Details | Barber, service, duration, price (ZMW), booking reference, studio phone, short cancellation/lateness reminder |

- **Quality requirements:**
  - **Timezone correctness:** the event must show the correct Lusaka appointment time, converted properly, even on a device set to another timezone.
  - **Special characters:** apostrophes, commas, semicolons, ampersands, accents, emoji and line breaks in any field must not break the Google link or the `.ics` file, and must display correctly.
  - Each booking produces a distinct event (unique identifier and sensible file name, e.g. including the date).
- **[OPT]** A reminder alert (e.g. 1 hour before) in the `.ics` event.

## 13. Popup / Modal

- **[TF]** At least one purposeful popup/modal that fits naturally and **can be closed**.
- **[GD] Purpose:** first-visit offer, e.g. "New to Groomd? 15% off your first visit — mention FIRST15 when you arrive." Final wording and percentage → CONTENT.
- **[GD] Behaviour:**
  - Appears on the Home page only, once per visitor, after a short delay. Never appears over the booking flow.
  - Closes via a visible close button, clicking outside the popup, Escape, and its call to action. The call to action leads to Book.
  - Stays dismissed on later visits in the same browser.
  - Keyboard accessible (focus moves into the popup and returns on close). Fits a 360px-wide screen.
- **[GD]** The discount is applied **in-store**. There are no promo codes or discount calculations in booking. Prices in booking are always standard prices. The offer's terms are in the Terms & Conditions.

## 14. Responsive Behaviour

- **[TF]** Works properly on desktop, tablet and mobile. No overflowing content; navigation stays usable; images resize correctly; forms and buttons stay usable.
- **[GD]** Checked at 360, 390, 768, 1024, 1280 and 1440px widths. No horizontal scrolling.
- **[GD]** The booking flow, including date and time selection and the calendar actions, is fully usable by touch.
- **[GD]** Images keep their proportions and are cropped sensibly at every size.

## 15. Interactivity, Accessibility & Usability

- **[TF]** Everything presented as interactive works: navigation, buttons, links, forms, booking, calendar actions, popup, mobile menu, calls to action, legal links and social links.
- **[GD]** No dead links, placeholder links, buttons that do nothing, or "coming soon" items.
- **[GD]** Visible hover and keyboard focus states. All interactive elements can be reached and used with the keyboard.
- **[GD]** Text contrast meets WCAG AA. Images have meaningful alt text. Form fields have labels.
- **[GD]** Tap targets are comfortably sized on mobile.
- **[OPT]** Subtle motion, an FAQ, testimonials. Only if they don't compromise polish or performance.

## 16. Testing & Quality

- **[TF]** Before submission, test the full journey **Home → Services → Booking → Select appointment → Complete booking → Add appointment to calendar.**
- **[TF]** The deployed site has no obvious JavaScript errors, broken images, missing pages, unfinished sections or development/debug information.
- **[GD]** Manual testing is done **on the live URL**, covering:
  - Chrome (desktop and Android), Safari (macOS and iOS), and Firefox or Edge.
  - Real calendar checks: the event is saved in Google Calendar, and the `.ics` is imported into Apple Calendar, with details checked in both.
  - A calendar check with the device set to a timezone other than Lusaka.
  - The booking edge cases in §11.3–11.5.
  - The acceptance criteria in §19.
- **[GD] Quality target (not a hard requirement):** Lighthouse mobile scores of about 90+ across categories.
- **[OPT]** Automated tests, especially for availability rules and calendar event generation. Recommended where cheap, but not required by the brief.

## 17. Deployment

- **[TF]** Publicly accessible. No local setup, installation, downloads, access requests or logins for reviewers.
- **[TF]** Submission is exactly one live URL.
- **[GD]** Served over HTTPS at a clean, professional URL, with a Groomd favicon and page titles.
- **[GD]** Stays live, fast and reliable throughout the review period, including the booking service (no expired or sleeping services that break booking).
- **[GD]** No test bookings, dev banners or debug output visible to reviewers.
- → ARCH: hosting and configuration.

## 18. Non-Goals

Explicitly **not** built:
- Customer accounts or login
- Online payments or deposits
- Admin dashboard or barber portal
- Online cancellation or rescheduling (by phone, per Terms)
- Email, SMS or WhatsApp confirmations or reminders
- Two-way calendar sync or calendar APIs that need the customer to sign in
- Promo-code or discount engine
- Product shop or e-commerce
- Barber-specific shifts, breaks or days off
- Public-holiday closures (see open item 2)
- Multiple locations, multiple languages, CMS, blog, loyalty or gift cards

## 19. Acceptance Criteria (live-site checklist)

**Pages & content**
- [ ] AC-P1 Home, Services, About, Book, Contact, Terms, Privacy and the 404 page all load on the live URL.
- [ ] AC-P2 Home has a strong hero with professional imagery and a Book Now action visible without scrolling, on desktop and mobile.
- [ ] AC-P3 Services lists every service with name, description, ZMW price and duration.
- [ ] AC-P4 About presents the studio story and all 3 barber profiles with photos.
- [ ] AC-P5 Contact shows address, map/directions, phone, email, hours, social links and a booking call to action.
- [ ] AC-P6 Terms and Privacy contain real, complete content consistent with how the site actually works (in-store payment, phone cancellation, no email/SMS, first-visit offer, data stored for bookings).
- [ ] AC-P7 No placeholder text, "coming soon", broken images or unfinished sections anywhere.

**Brand & consistency**
- [ ] AC-C1 Logo is sharp in the header and footer and links to Home.
- [ ] AC-C2 Colours, fonts, buttons and cards are consistent across pages. Text contrast is AA.
- [ ] AC-C3 Business name, address, phone, email, hours, prices and durations are identical everywhere they appear, including the calendar event.
- [ ] AC-C4 The site reads clearly as a barbershop / grooming studio, not a product brand.

**Navigation & footer**
- [ ] AC-N1 Header on every page has the logo, working links and a visible Book Now. The current page is indicated.
- [ ] AC-N2 On mobile, the menu opens, shows all links, closes via its close control, a link or Escape, and Book Now is reachable.
- [ ] AC-N3 Footer contains navigation, contact details, hours, social links, a booking link, Terms and Privacy links, and "© {current year} Groomd".
- [ ] AC-N4 Every link works. Phone and email links open the correct apps. Social links go only to real Groomd accounts or platform homepages, in a new tab.

**Booking**
- [ ] AC-B1 Book is reachable in one click from every page.
- [ ] AC-B2 A service's "Book" action opens booking with that service pre-selected.
- [ ] AC-B3 The customer can choose one service, a barber or "No preference", a date and a time, and enter name, phone, email and optional notes.
- [ ] AC-B4 Past dates, Sundays and dates more than 30 days ahead cannot be chosen.
- [ ] AC-B5 Today's times less than 1 hour away are not offered. "Today" and "now" follow Lusaka time, even on a device set to another timezone.
- [ ] AC-B6 Offered times respect duration and closing time. The 75-min Cut & Beard is not offered after 16:45 on weekdays or after 14:45 on Saturday.
- [ ] AC-B7 Changing date, service or barber after choosing a time clears or re-checks it, with a clear message.
- [ ] AC-B8 Missing or invalid details, or no Terms agreement, show inline errors and block submission. Opening Terms does not lose progress.
- [ ] AC-B9 After a booking with a specific barber at a given time, that barber's overlapping times are no longer offered. If all barbers are booked at a time, "No preference" no longer offers that time either.
- [ ] AC-B10 If a slot is taken just before confirming, the customer gets a friendly message, returns to time selection and keeps their other details.
- [ ] AC-B11 Submitting shows an in-progress state. Repeated clicks do not create duplicate bookings.
- [ ] AC-B12 If the server is unavailable, the customer sees an error and can retry. No false confirmation is shown.
- [ ] AC-B13 Confirmation shows a booking reference and the exact service, barber (assigned if "No preference"), date, start–end time, price and customer name.
- [ ] AC-B14 Days with no available times say so clearly.

**Calendar**
- [ ] AC-K1 Confirmation offers "Add to Google Calendar" and "Add to Apple Calendar".
- [ ] AC-K2 A 45-minute service booked for 15:00 on a chosen date gives a Google Calendar event titled "{Service} at Groomd" on that date, 15:00–15:45, with the studio address and details including barber, reference and phone.
- [ ] AC-K3 The `.ics` file opens or imports in Apple Calendar (iOS or macOS) with the same title, date, 15:00–15:45 time, location and details.
- [ ] AC-K4 Two different bookings produce two different, correct events. Nothing is hard-coded.
- [ ] AC-K5 With the device set to a different timezone, the event still corresponds to 15:00 Lusaka time.
- [ ] AC-K6 A name or notes containing apostrophes, commas, semicolons, ampersands, emoji or line breaks still produce valid, correctly displayed events.

**Popup**
- [ ] AC-M1 The first-visit popup appears once on Home, never over the booking flow, and its call to action leads to Book.
- [ ] AC-M2 It closes via the close button, clicking outside it, and Escape. It does not reappear after dismissal.
- [ ] AC-M3 It fits a 360px screen and can be used with the keyboard.

**Responsive & usability**
- [ ] AC-R1 At 360, 390, 768, 1024, 1280 and 1440px: no horizontal scroll, no overlapping or clipped content, images scale correctly.
- [ ] AC-R2 The full booking and calendar journey can be completed by touch on a real iPhone (Safari) and Android phone (Chrome).
- [ ] AC-R3 All interactive elements have visible focus states and can be used with the keyboard. Form fields have labels.

**Quality & deployment**
- [ ] AC-D1 No errors in the browser console on any page during the full journey.
- [ ] AC-D2 No debug output, dev banners or visible test data.
- [ ] AC-D3 The live HTTPS URL works from a private browsing window on a different network, with no login or access request.
- [ ] AC-D4 Unknown URLs show the branded 404 page.
- [ ] AC-D5 The full journey Home → Services → Book → select appointment → confirm → add to calendar has been completed successfully on the live URL on desktop and mobile.

## 20. Open Items

| # | Item | Needed before |
|---|---|---|
| 1 | **Social links:** create real Groomd accounts (e.g. Instagram, Facebook, TikTok), or link to platform homepages? Homepage links are legitimate but less convincing. | CONTENT.md |
| 2 | **Public holidays:** Zambian public holidays are currently bookable (listed as a non-goal). Accept, or add a small list of closed dates? | ARCHITECTURE.md (small impact) |
| 3 | **Privacy / data retention:** how long stored bookings are kept, and whether test bookings are cleared before submission. | CONTENT.md (Privacy wording) |
