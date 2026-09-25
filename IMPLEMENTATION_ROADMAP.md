# Groomd — Implementation Roadmap

**Project:** Groomd — Men's Grooming Studio
**Document:** Implementation Roadmap
**Status:** Active
**Last Updated:** 24 September 2026

---

# 1. Purpose

This document converts the decisions in `PRD.md`, `DESIGN.md`, `CONTENT.md`, and `ARCHITECTURE.md` into an executable implementation sequence.

The roadmap defines:

* what to build
* the order to build it
* dependencies between tasks
* what must be tested
* when a milestone is considered complete

The roadmap is an execution guide, not a replacement for the product, design, content, or architecture documents.

The milestone order is based primarily on **implementation dependencies**, not page order.

---

# 2. Implementation Rules

Before starting implementation:

1. Treat `PRD.md` as the product requirements source of truth.
2. Treat `DESIGN.md` as the visual source of truth.
3. Treat `CONTENT.md` as the content source of truth.
4. Treat `ARCHITECTURE.md` as the technical source of truth.
5. Use this roadmap to determine execution order.
6. Do not invent new requirements during implementation.
7. Do not add features simply because they are technically interesting.
8. When a requirement is unclear, resolve it against the higher-authority documents before coding.
9. Make changes in small, testable increments.
10. After each meaningful task, run the appropriate checks before continuing.
11. Do not move past a milestone while its acceptance criteria contain known failures.
12. Keep the implementation simple enough to explain during an interview.

---

# 3. Priority System

Tasks are classified as:

### REQUIRED

Necessary to satisfy the assessment requirements.

### IMPORTANT

Necessary for a polished, professional submission but not an independent assessment feature.

### OPTIONAL

Only implement if all required functionality is complete and there is sufficient time.

Required functionality always takes priority over optional polish.

---

# 4. Milestone Status

Use these statuses:

* `[ ]` Not started
* `[~]` In progress
* `[x]` Complete
* `[!]` Blocked

A milestone may only be marked `[x]` after its acceptance criteria and required testing have passed.

---

# Milestone 0 — Product & Documentation Lock

**Status:** `[x]`

## Objective

Establish the product, visual, content, and technical foundations before implementation begins.

## Completed

* [x] Review and lock `PRD.md`
* [x] Review and lock `DESIGN.md`
* [x] Review and lock `CONTENT.md`
* [x] Review and lock `ARCHITECTURE.md`
* [x] Resolve contradictions between documents
* [x] Confirm fictional business details
* [x] Confirm service catalogue
* [x] Confirm barber data
* [x] Confirm booking rules
* [x] Confirm calendar requirements
* [x] Confirm assessment scope

## Acceptance Criteria

* Product requirements are defined.
* Visual system is defined.
* Approved content is defined.
* Technical architecture is defined.
* No known major contradiction exists between the documents.

---

# Milestone 1 — Project Foundation

**Status:** `[ ]`

## Objective

Create the application foundation and establish the development environment that every later milestone depends on.

## Tasks

### Application

* [ ] Create/configure the Next.js application.
* [ ] Confirm TypeScript.
* [ ] Confirm App Router.
* [ ] Confirm Tailwind CSS.
* [ ] Configure linting and formatting.
* [ ] Establish the initial project structure.

### Dependencies

Install and configure:

* [ ] React Hook Form
* [ ] Zod
* [ ] Prisma
* [ ] PostgreSQL client/database connection
* [ ] Lucide or approved icon library

### Environment

* [ ] Create local environment configuration.
* [ ] Configure database connection.
* [ ] Create `.env.example`.
* [ ] Confirm secrets are excluded from version control.

### Initial database setup

* [ ] Initialise Prisma.
* [ ] Configure PostgreSQL.
* [ ] Confirm Prisma can connect to the database.
* [ ] Establish migration workflow.

## Testing

* [ ] Application starts successfully.
* [ ] TypeScript check passes.
* [ ] Lint check passes.
* [ ] Production build succeeds.
* [ ] Database connection works.

## Acceptance Criteria

A clean Next.js application can be started locally, built successfully, and connected to PostgreSQL.

---

# Milestone 2 — Shared Data & Domain Foundation

**Status:** `[ ]`

## Objective

Create the authoritative business and booking data structures that the rest of the application depends on.

This milestone comes before page implementation because the pages, booking engine, and calendar system all consume this information.

## Tasks

### Business configuration

Create one authoritative source for:

* [ ] Groomd name
* [ ] Location
* [ ] Address
* [ ] Timezone
* [ ] Currency
* [ ] Phone
* [ ] Email
* [ ] Opening hours

### Booking configuration

Create authoritative configuration for:

* [ ] 30-day booking window
* [ ] 1-hour minimum notice
* [ ] 15-minute slot interval
* [ ] Sunday closure
* [ ] finish-before-close rule

### Services

Create the complete service catalogue from `CONTENT.md`.

Each service must contain:

* [ ] ID
* [ ] Name
* [ ] Description
* [ ] Price
* [ ] Duration
* [ ] Category

### Barbers

Create the three approved barbers.

Each barber must contain:

* [ ] ID
* [ ] Name
* [ ] Role
* [ ] Bio
* [ ] Specialities

### Shared types

Define TypeScript types/interfaces for the domain objects where appropriate.

## Testing

* [ ] Service data matches `CONTENT.md`.
* [ ] Barber data matches `CONTENT.md`.
* [ ] Business hours are correct.
* [ ] Timezone is correct.
* [ ] No duplicate business/service data exists in unrelated components.

## Acceptance Criteria

The application has one authoritative source for the core business data consumed by the rest of the system.

---

# Milestone 3 — Database & Booking Domain

**Status:** `[ ]`

## Objective

Build the persistent booking foundation before building the booking interface.

## Tasks

### Database schema

* [ ] Finalise Prisma booking schema.
* [ ] Create booking model.
* [ ] Create booking status representation.
* [ ] Add service relationship/reference.
* [ ] Add barber relationship/reference.
* [ ] Add start/end timestamps.
* [ ] Add customer information.
* [ ] Add notes.
* [ ] Add reference.
* [ ] Add creation timestamp.

### Database rules

* [ ] Ensure booking references are unique.
* [ ] Establish appropriate indexes.
* [ ] Establish the database transaction strategy for booking creation.
* [ ] Establish protection against overlapping confirmed bookings for the same barber.

### Booking data access

* [ ] Create server-side booking data access functions.
* [ ] Keep database access separate from UI components.

### Migrations

* [ ] Create migration.
* [ ] Apply migration locally.
* [ ] Confirm records can be created and retrieved.

## Testing

* [ ] Database migration succeeds.
* [ ] Booking can be stored.
* [ ] Booking can be retrieved.
* [ ] Unique reference constraint works.
* [ ] Invalid data is rejected appropriately.

## Acceptance Criteria

The application can reliably persist and retrieve booking records from PostgreSQL.

---

# Milestone 4 — Availability & Booking Engine

**Status:** `[ ]`

## Objective

Build and test the server-side business logic that determines what can actually be booked.

This milestone must be completed before the booking UI because the UI will consume this logic.

## Tasks

### Candidate slot generation

* [ ] Generate 15-minute candidate start times.
* [ ] Apply opening hours.
* [ ] Apply service duration.
* [ ] Apply finish-before-close rule.

### Date rules

* [ ] Enforce today through 30 days ahead.
* [ ] Disable Sundays.
* [ ] Distinguish Closed from Full.
* [ ] Apply one-hour same-day notice.

### Barber availability

* [ ] Check conflicts for a selected barber.
* [ ] Determine whether any barber is available for No preference.
* [ ] Assign an available barber server-side.

### Booking validation

* [ ] Validate service.
* [ ] Validate barber.
* [ ] Validate date.
* [ ] Validate time.
* [ ] Validate customer details.
* [ ] Validate booking rules.
* [ ] Recheck availability at confirmation.

### Conflict handling

* [ ] Implement atomic booking creation.
* [ ] Prevent overlapping confirmed bookings.
* [ ] Return a clean conflict response.
* [ ] Preserve customer-entered information after conflict.

## Testing

Test:

* [ ] Weekday slots
* [ ] Saturday slots
* [ ] Sunday
* [ ] 30-day boundary
* [ ] One-hour notice
* [ ] 30-minute service
* [ ] 45-minute service
* [ ] 75-minute service
* [ ] Exact closing boundary
* [ ] After-closing start
* [ ] Specific barber conflict
* [ ] No preference
* [ ] Concurrent booking attempt

## Acceptance Criteria

The server can correctly determine whether a requested appointment is valid and can safely create a booking without allowing conflicting appointments.

---

# Milestone 5 — Server API & Validation Layer

**Status:** `[ ]`

## Objective

Expose the booking engine through clean server-side endpoints that the UI can safely consume.

## Tasks

### Availability API

Implement:

```text
GET /api/bookings/availability
```

It must accept the required booking context and return valid available times.

### Booking API

Implement:

```text
POST /api/bookings
```

It must:

1. Validate input.
2. Resolve authoritative service data.
3. Resolve barber information.
4. Recheck availability.
5. Assign a barber where required.
6. Generate booking end time.
7. Generate a unique reference.
8. Persist the booking.
9. Return the confirmed booking.

### Error responses

Implement clean responses for:

* [ ] invalid input
* [ ] unavailable date
* [ ] unavailable time
* [ ] booking conflict
* [ ] server failure

### Security

* [ ] Never trust client-provided price.
* [ ] Never trust client-provided duration.
* [ ] Never trust client-provided availability.
* [ ] Never trust client-provided barber assignment.
* [ ] Do not expose internal errors.

## Testing

* [ ] Valid availability request works.
* [ ] Invalid availability request is rejected.
* [ ] Valid booking works.
* [ ] Invalid booking is rejected.
* [ ] Conflict is handled correctly.
* [ ] Server errors are safe and user-friendly.

## Acceptance Criteria

The booking system can be accessed through reliable server endpoints without relying on client-side business rules.

---

# Milestone 6 — Design System & Global UI

**Status:** `[ ]`

## Objective

Implement the shared visual and interaction foundation used by every page.

## Tasks

### Typography

* [ ] Add Archivo.
* [ ] Add Inter.
* [ ] Configure typography hierarchy.
* [ ] Establish heading/body styles.

### Colour system

Implement:

* [ ] Light Cream `#FFF3D6`
* [ ] Miel Cremosa `#FBDE9C`
* [ ] Mid Wine `#6B2A33`
* [ ] Vino Oscuro `#44040F`

### Global components

* [ ] Header
* [ ] Desktop navigation
* [ ] Mobile navigation
* [ ] Book Now CTA
* [ ] Footer
* [ ] Buttons
* [ ] Links
* [ ] Cards
* [ ] Form controls
* [ ] Focus states
* [ ] Skip link

### Responsive foundation

* [ ] Establish mobile-first responsive behaviour.
* [ ] Confirm no horizontal overflow.
* [ ] Confirm minimum 44px interactive targets.

## Testing

Check at:

* [ ] 360px
* [ ] 390px
* [ ] 768px
* [ ] 1024px
* [ ] 1280px
* [ ] 1440px

## Acceptance Criteria

The shared Groomd visual system is implemented and reusable across all pages.

The header, navigation, Book Now CTA, footer, buttons, and common form elements work correctly.

---

# Milestone 7 — Core Site Pages

**Status:** `[ ]`

## Objective

Build the informational pages that establish the complete site structure before connecting the final booking journey.

---

## 7.1 Home

### Tasks

* [ ] Hero
* [ ] Hero imagery
* [ ] Primary booking CTA
* [ ] Services preview
* [ ] Quick information
* [ ] Values
* [ ] Craft/story section
* [ ] Barber preview
* [ ] Visit studio section
* [ ] Final booking CTA
* [ ] Footer

### Acceptance Criteria

The first viewport clearly communicates that Groomd is a barbershop and gives visitors an obvious route to booking.

---

## 7.2 Services

### Tasks

* [ ] Services page header
* [ ] Category navigation
* [ ] Seven service cards
* [ ] Descriptions
* [ ] Prices
* [ ] Durations
* [ ] Book this actions
* [ ] Pay-in-store information

### Booking integration

Each service CTA must route to `/book` with the selected service available for preselection.

### Acceptance Criteria

Visitors can understand every service and begin booking with their selected service preserved.

---

## 7.3 About

### Tasks

* [ ] About page header
* [ ] Why we opened
* [ ] How we work
* [ ] Values
* [ ] Groomd team statement
* [ ] Three barber profiles
* [ ] Barber imagery

### Acceptance Criteria

The page communicates the Groomd identity and introduces all three approved barbers.

---

## 7.4 Contact

### Tasks

* [ ] Address
* [ ] Phone
* [ ] Email
* [ ] Opening hours
* [ ] Map link
* [ ] Booking CTA
* [ ] Fictional business notice

### Acceptance Criteria

Visitors can find the studio, understand its hours, access contact actions, and reach booking.

---

# Milestone 8 — Booking UI

**Status:** `[ ]`

## Objective

Connect the completed booking engine and APIs to the customer-facing booking experience.

## Tasks

### Booking steps

Implement:

* [ ] Service selection
* [ ] Barber selection
* [ ] No preference
* [ ] Date selection
* [ ] Time selection
* [ ] Customer details
* [ ] Terms checkbox
* [ ] Review
* [ ] Confirmation

### Booking state

Implement:

* [ ] Loading states
* [ ] Validation errors
* [ ] Availability errors
* [ ] Conflict state
* [ ] Network/server errors
* [ ] Retry behaviour
* [ ] Duplicate-submit protection
* [ ] Preserve customer details after failure

### Selection behaviour

* [ ] Changing service rechecks availability.
* [ ] Changing barber rechecks availability.
* [ ] Changing date clears selected time.
* [ ] Invalid selected times are cleared.

### Summary

Display:

* [ ] Service
* [ ] Barber
* [ ] Date
* [ ] Time
* [ ] Price
* [ ] Duration
* [ ] Change/edit actions

### Confirmation

Display:

* [ ] Confirmation message
* [ ] Customer first name
* [ ] Reference
* [ ] Service
* [ ] Barber
* [ ] Date
* [ ] Time
* [ ] Price
* [ ] Arrival information
* [ ] Cancellation/change instructions
* [ ] Calendar actions

## Testing

Run the complete booking journey.

Also test:

* [ ] invalid form
* [ ] Sunday
* [ ] Full day
* [ ] unavailable slot
* [ ] changing selections
* [ ] No preference
* [ ] booking conflict
* [ ] repeated Confirm clicks
* [ ] server failure

## Acceptance Criteria

A visitor can create a real booking through the public UI and receive an accurate confirmation.

---

# Milestone 9 — Calendar Integration

**Status:** `[ ]`

## Objective

Allow confirmed appointments to be added to external calendar applications.

## Google Calendar

* [ ] Generate event dynamically.
* [ ] Include service.
* [ ] Include barber.
* [ ] Include date/time.
* [ ] Include duration.
* [ ] Include address.
* [ ] Include reference.
* [ ] Include appointment instructions.

## ICS

* [ ] Generate valid `.ics`.
* [ ] Generate unique event ID.
* [ ] Set correct start/end.
* [ ] Set correct timezone.
* [ ] Include appointment details.
* [ ] Escape special characters.
* [ ] Use required filename format.

## Confirmation

* [ ] Add to Google Calendar button.
* [ ] Add to Apple Calendar button.
* [ ] Explain ICS compatibility where appropriate.

## Testing

* [ ] Google Calendar opens correctly.
* [ ] ICS downloads correctly.
* [ ] Apple Calendar accepts it.
* [ ] Outlook-compatible behaviour works.
* [ ] Duration is correct.
* [ ] Timezone is correct.
* [ ] Address is correct.
* [ ] Reference is correct.

## Acceptance Criteria

A confirmed appointment can be added to Google Calendar and Apple-compatible calendars with correct details.

---

# Milestone 10 — Secondary Interaction & Legal Features

**Status:** `[ ]`

## Objective

Complete the remaining required site functionality.

---

## 10.1 First-Visit Offer Modal

### Tasks

* [ ] Home-page-only modal
* [ ] FIRST15 offer
* [ ] Delayed appearance
* [ ] Close button
* [ ] Backdrop close
* [ ] Escape close
* [ ] Booking CTA
* [ ] Terms link
* [ ] Once-per-visitor persistence
* [ ] Keyboard focus management
* [ ] Mobile bottom-sheet behaviour

### Testing

* [ ] Modal appears correctly.
* [ ] Modal closes correctly.
* [ ] Escape works.
* [ ] Focus is accessible.
* [ ] Modal does not appear on `/book`.
* [ ] Modal does not repeatedly appear after dismissal.
* [ ] Modal fits at 360px.

---

## 10.2 Terms & Privacy

### Tasks

* [ ] Terms & Conditions page
* [ ] Privacy Policy page
* [ ] Footer legal links
* [ ] Booking Terms link
* [ ] Page titles
* [ ] Responsive layouts

### Testing

* [ ] Terms page loads.
* [ ] Privacy page loads.
* [ ] Footer links work.
* [ ] Booking Terms link works.
* [ ] No dead legal links.

## Acceptance Criteria

All required secondary interactions and legal pages are functional and reachable.

---

# Milestone 11 — Responsive, Accessibility & Visual QA

**Status:** `[ ]`

## Objective

Perform a dedicated quality pass across the complete site.

## Responsive testing

Test:

* [ ] 360px
* [ ] 390px
* [ ] 768px
* [ ] 1024px
* [ ] 1280px
* [ ] 1440px

Check:

* [ ] no horizontal overflow
* [ ] no clipped text
* [ ] no overlapping elements
* [ ] navigation works
* [ ] Book Now remains accessible
* [ ] forms remain usable
* [ ] buttons remain usable
* [ ] modal fits
* [ ] footer remains readable

## Accessibility

* [ ] Keyboard navigation
* [ ] Focus-visible states
* [ ] Form labels
* [ ] Error messages
* [ ] Selected states
* [ ] Closed/Full distinction
* [ ] Modal focus trap
* [ ] Escape handling
* [ ] Skip link
* [ ] Image alt text
* [ ] Touch targets
* [ ] Reduced motion
* [ ] No state communicated through colour alone

## Visual QA

* [ ] Typography matches design.
* [ ] Colour palette is respected.
* [ ] Spacing is consistent.
* [ ] Cards are used intentionally.
* [ ] No unnecessary gradients.
* [ ] No tinted photography.
* [ ] No accidental luxury/wine-brand aesthetic.
* [ ] Site clearly reads as a barbershop.

## Acceptance Criteria

The complete site is usable, accessible, and visually coherent across all required viewport sizes.

---

# Milestone 12 — Full Functional QA

**Status:** `[ ]`

## Objective

Test the website as a real visitor would use it before deployment.

## Full Journey

Perform:

```text
Home
  ↓
Services
  ↓
Book
  ↓
Select service
  ↓
Select barber/date/time
  ↓
Enter details
  ↓
Review
  ↓
Confirm booking
  ↓
Confirmation
  ↓
Add to Calendar
```

## Interaction QA

Verify:

* [ ] Header navigation
* [ ] Mobile navigation
* [ ] Book Now
* [ ] Service CTAs
* [ ] Booking form
* [ ] Calendar controls
* [ ] Modal
* [ ] Map link
* [ ] Phone link
* [ ] Email link
* [ ] Footer navigation
* [ ] Legal links

## Error QA

Verify:

* [ ] invalid name
* [ ] invalid phone
* [ ] invalid email
* [ ] missing Terms acceptance
* [ ] invalid service
* [ ] invalid barber
* [ ] invalid date
* [ ] invalid time
* [ ] Sunday
* [ ] Full day
* [ ] unavailable slot
* [ ] booking conflict
* [ ] server failure
* [ ] duplicate submission

## Browser QA

* [ ] Chrome
* [ ] Firefox
* [ ] Edge
* [ ] Safari where available
* [ ] Mobile Safari
* [ ] Android Chrome

## Console QA

* [ ] No obvious JavaScript errors.
* [ ] No failed required network requests.
* [ ] No broken images.
* [ ] No development/debug output visible to users.

## Acceptance Criteria

The complete application passes the required user journey locally before production deployment.

---

# Milestone 13 — Production Deployment

**Status:** `[ ]`

## Objective

Deploy the completed application publicly over HTTPS.

## Tasks

* [ ] Configure production environment variables.
* [ ] Configure production database.
* [ ] Run production migrations.
* [ ] Deploy application.
* [ ] Configure production URL.
* [ ] Verify HTTPS.
* [ ] Verify production build.
* [ ] Verify database connectivity.
* [ ] Verify booking persistence.
* [ ] Verify calendar generation.

## Production Cleanup

* [ ] Remove test bookings that should not remain.
* [ ] Remove debug banners.
* [ ] Remove development-only UI.
* [ ] Remove test data.
* [ ] Confirm no secrets are exposed.
* [ ] Confirm legal pages are live.
* [ ] Confirm favicon and metadata.

## Acceptance Criteria

The site is publicly accessible over HTTPS without login or local setup and all required functionality works in production.

---

# Milestone 14 — Final Recruiter Test & Submission

**Status:** `[ ]`

## Objective

Perform one final assessment-focused review using the live URL.

Do not make major architectural changes at this stage unless a critical defect is discovered.

## Recruiter Simulation

Open the production URL as a first-time visitor.

### First impression

* [ ] Groomd immediately reads as a barbershop.
* [ ] Branding is coherent.
* [ ] Hero is clear.
* [ ] Book Now is obvious.

### Navigation

* [ ] Home works.
* [ ] Services works.
* [ ] About works.
* [ ] Contact works.
* [ ] Book Now works.
* [ ] Mobile menu works.

### Services

* [ ] All services are visible.
* [ ] Prices are correct.
* [ ] Durations are correct.
* [ ] Booking CTAs work.

### Booking

* [ ] Service selection works.
* [ ] Barber selection works.
* [ ] Date selection works.
* [ ] Time selection works.
* [ ] Customer details work.
* [ ] Review is correct.
* [ ] Booking persists.
* [ ] Confirmation is correct.
* [ ] Reference is generated.
* [ ] Calendar buttons work.

### Polish

* [ ] Modal works.
* [ ] Legal pages work.
* [ ] No broken images.
* [ ] No dead links.
* [ ] No horizontal overflow.
* [ ] No obvious console errors.
* [ ] No debug information.
* [ ] No unfinished sections.

### Submission

* [ ] Final live URL copied.
* [ ] URL opens in a private/incognito window.
* [ ] No login required.
* [ ] No local setup required.
* [ ] Final test booking cleaned up if necessary.
* [ ] Only the required live URL is submitted.

## Acceptance Criteria

The site passes the complete recruiter journey on the production URL.

---

# 5. Definition of Done

The Groomd project is complete when:

1. All required pages exist.
2. The visual system matches `DESIGN.md`.
3. Content matches `CONTENT.md`.
4. Navigation works.
5. Mobile navigation works.
6. Booking works end-to-end.
7. Bookings persist correctly.
8. Availability rules work.
9. Booking conflicts are prevented.
10. Barber assignment works.
11. Google Calendar works.
12. ICS/Apple Calendar works.
13. Modal works.
14. Legal pages work.
15. Responsive testing passes.
16. Accessibility checks pass.
17. No critical console errors remain.
18. No broken images or links remain.
19. The production site is publicly accessible over HTTPS.
20. The final recruiter journey passes on the live URL.

---

# 6. Scope Protection

If implementation time becomes limited, work should be reduced in this order.

## Never sacrifice

1. Booking functionality
2. Booking persistence
3. Availability correctness
4. Calendar integration
5. Required pages
6. Responsive behaviour
7. Core accessibility
8. Navigation
9. Visual consistency

## Sacrifice first

1. Optional animations
2. Optional visual flourishes
3. Non-essential micro-interactions
4. Optional performance enhancements
5. Any feature not required by the assessment

The goal is a complete, reliable website rather than a larger but unfinished one.

---

# 7. Execution Rule

Implementation proceeds one milestone at a time.

For each milestone:

```text
Read requirements
      ↓
Implement smallest useful piece
      ↓
Run/test
      ↓
Fix issues
      ↓
Verify acceptance criteria
      ↓
Mark complete
      ↓
Move to next milestone
```

Do not build the entire application first and postpone testing until the end.

The earlier a defect is discovered, the cheaper it is to fix.

---

# 8. Dependency Principle

The roadmap deliberately follows the application's dependency chain:

```text
Documentation
      ↓
Project Foundation
      ↓
Shared Business Data
      ↓
Database
      ↓
Booking Domain
      ↓
Availability Engine
      ↓
Server API
      ↓
Global UI
      ↓
Site Pages
      ↓
Booking UI
      ↓
Calendar Integration
      ↓
Secondary Features
      ↓
QA
      ↓
Deployment
      ↓
Final Recruiter Test
```

A later milestone should consume stable functionality from earlier milestones rather than rebuilding or duplicating it.

---

# 9. Final Principle

> **Build the required experience completely before adding anything extra.**

Groomd is successful when a real visitor can discover the barbershop, understand its services, book an appointment, receive a reliable confirmation, and add the appointment to their calendar — smoothly on both desktop and mobile.
