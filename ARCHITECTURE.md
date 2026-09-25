# Groomd — Architecture

**Project:** Groomd — Men's Grooming Studio
**Document:** Technical Architecture
**Status:** Locked v1.0
**Last Updated:** 24 September 2026

---

## 1. Purpose

This document defines how the Groomd website is technically structured and how its core functionality works.

It translates the requirements in `PRD.md`, visual system in `DESIGN.md`, and approved content in `CONTENT.md` into implementation decisions.

This document is the technical source of truth for implementation.

### Authority order

1. `PRD.md` — product requirements
2. `DESIGN.md` — visual and interaction design
3. `CONTENT.md` — approved business content
4. `ARCHITECTURE.md` — technical implementation
5. `IMPLEMENTATION_ROADMAP.md` — execution order

If an implementation decision conflicts with a higher-level document, the higher-level document takes precedence.

---

# 2. Architecture Principles

Groomd is intentionally designed as a small, production-style website rather than an over-engineered application.

The architecture follows these principles:

* Keep the stack small and understandable.
* Keep business rules on the server.
* Use a single source of truth for services, barbers, business hours, and booking rules.
* Validate data on both the client and server.
* Never trust prices, durations, availability, or barber assignments supplied by the browser.
* Generate availability from rules rather than maintaining a manually hardcoded calendar.
* Recheck availability when a booking is submitted.
* Preserve user-entered information when a booking fails.
* Keep calendar generation dynamic from the confirmed booking.
* Avoid accounts, payments, messaging systems, admin dashboards, or other functionality outside the assessment scope.
* Prefer reliable simple implementations over unnecessary abstractions.

---

# 3. Technology Stack

## 3.1 Application

**Framework:** Next.js
**Language:** TypeScript
**Rendering:** Next.js App Router

Next.js provides routing, server-side functionality, page rendering, API endpoints, and deployment support in one application.

TypeScript is used throughout the application to make the booking data structures and business rules explicit.

---

## 3.2 Styling

**CSS framework:** Tailwind CSS

Tailwind will implement the visual system defined in `DESIGN.md`, including:

* Groomd colour tokens
* typography
* spacing
* responsive layouts
* buttons
* forms
* cards
* navigation
* modal states
* focus states

The four brand colours remain the primary visual palette.

Functional states such as errors and success may use documented functional colours where required for accessibility and usability.

---

## 3.3 Forms and Validation

**Forms:** React Hook Form
**Schema validation:** Zod

React Hook Form manages the booking form state and user interaction.

Zod provides shared validation rules where practical.

Client-side validation exists primarily for immediate user feedback.

Server-side validation remains authoritative.

---

## 3.4 Database

**Database:** PostgreSQL

PostgreSQL stores confirmed bookings.

The database is the persistent source of truth for booking records.

The application does not require user accounts.

---

## 3.5 ORM

**ORM:** Prisma

Prisma provides the database schema, type-safe database access, and migrations for PostgreSQL.

---

## 3.6 Deployment

The application will be deployed as a public HTTPS website.

Production configuration must use environment variables for database credentials and other secrets.

No secrets may be committed to the repository or exposed to the browser.

---

# 4. Application Structure

The application uses the Next.js App Router.

Conceptually, the structure is:

```text
app/
├── page.tsx
├── services/
│   └── page.tsx
├── about/
│   └── page.tsx
├── book/
│   └── page.tsx
├── contact/
│   └── page.tsx
├── terms/
│   └── page.tsx
├── privacy/
│   └── page.tsx
├── not-found.tsx
└── api/
    └── bookings/
        ├── availability/
        │   └── route.ts
        └── route.ts

components/
├── layout/
├── navigation/
├── home/
├── services/
├── about/
├── booking/
├── contact/
└── ui/

lib/
├── booking/
├── calendar/
├── validation/
└── data/

prisma/
└── schema.prisma
```

The exact file structure may change during implementation if a simpler organisation proves more appropriate, but responsibilities should remain separated.

---

# 5. Shared Business Data

The following information must have one authoritative implementation source.

### Business

* Name: Groomd
* Location: Lusaka, Zambia
* Timezone: `Africa/Lusaka`
* Currency: ZMW
* Address: `Shop 3, Mopani Court, Kabulonga, Lusaka, Zambia`

### Opening hours

* Monday–Friday: 09:00–18:00
* Saturday: 08:00–16:00
* Sunday: Closed

### Booking rules

* Booking window: today through 30 days ahead
* Minimum notice: 1 hour
* Slot interval: 15 minutes
* Appointment must finish by closing time
* Sunday is closed
* Payment is in-store

### Services

The service catalogue must match `CONTENT.md`.

Each service has:

```text
id
name
description
price
durationMinutes
category
```

### Barbers

The application contains exactly three barbers as defined in `CONTENT.md`.

Each barber has:

```text
id
name
role
bio
specialities
```

All three barbers:

* perform all listed services
* work during all studio opening hours
* have no individual schedules

This means individual barber schedules are not required.

---

# 6. Timezone and Date Handling

All booking times are interpreted in the Groomd business timezone:

```text
Africa/Lusaka
```

The application must not rely on the user's browser timezone for determining appointment availability.

Dates and times shown to customers are Lusaka local time.

The booking system must account for timezone conversion when:

* calculating availability
* validating appointments
* storing appointment timestamps
* generating Google Calendar events
* generating `.ics` calendar files

The confirmed appointment represents one specific point in time.

Appointment timestamps are stored in a consistent absolute representation in PostgreSQL, while booking calculations and customer-facing date/time values use `Africa/Lusaka`.

---

# 7. Booking Flow

The booking experience follows this sequence:

```text
Service
   ↓
Barber
   ↓
Date
   ↓
Time
   ↓
Customer Details
   ↓
Review
   ↓
Confirm
   ↓
Server Validation
   ↓
Booking Created
   ↓
Confirmation
   ↓
Add to Calendar
```

The customer selects exactly one service.

The customer may select:

* a specific barber
* No preference

If No preference is selected, the server assigns an available barber when the booking is confirmed.

---

# 8. Availability Architecture

Availability is calculated dynamically.

The application should not store every possible 15-minute slot in the database.

Instead, availability is generated from:

1. business opening hours
2. selected date
3. selected service duration
4. selected barber, if applicable
5. existing confirmed bookings
6. minimum notice rule
7. booking window
8. Sunday closure

---

## 8.1 Generating Candidate Slots

Candidate start times are generated in 15-minute increments.

For example:

```text
09:00
09:15
09:30
09:45
10:00
...
```

A candidate slot is valid only if:

```text
start time + service duration <= closing time
```

For the 75-minute Cut & Beard service:

* Weekday latest start: 16:45
* Saturday latest start: 14:45

---

## 8.2 Same-Day Availability

When the selected date is today, candidate start times must provide at least one hour of notice.

For example, if the current Lusaka time is 13:20, slots before 14:20 must not be offered.

The final availability calculation must happen using the server's current time.

---

## 8.3 Sundays

Sunday is always:

```text
Closed
```

It must not be represented as a day that is open but fully booked.

---

## 8.4 Full Days

A day is considered **Full** when:

* the studio is open
* but no valid appointment slots remain for the selected conditions

A day is considered **Closed** when:

* the studio does not operate that day

These are different states and must remain distinguishable in the UI.

---

# 9. Barber Availability

When a specific barber is selected:

```text
Available slot =
candidate slot does not overlap an existing booking
for that barber
```

When No preference is selected:

```text
Available slot =
at least one barber can perform the appointment
```

The server then assigns one available barber during booking creation.

The assignment is made from the actual availability at confirmation time.

The browser must never decide the final barber assignment.

---

# 10. Booking Persistence

Confirmed bookings are stored in PostgreSQL.

A booking record contains the information required to fulfil and identify the appointment.

Conceptually:

```text
Booking
├── id
├── reference
├── serviceId
├── barberId
├── startAt
├── endAt
├── customerName
├── customerPhone
├── customerEmail
├── notes
├── createdAt
└── status
```

The status field records the current state of the booking. The initial public booking flow creates confirmed bookings. The architecture does not require a public cancellation or rescheduling workflow.

The public assessment does not require customer accounts or an administrative cancellation interface.

---

# 11. Booking References

Every successful booking receives a unique human-readable reference.

Format:

```text
GRD-XXXXXX
```

The six-character portion uses uppercase letters and numbers while excluding visually ambiguous characters such as:

```text
0
O
1
I
```

The reference must be unique.

It is displayed on the confirmation screen and included in the calendar event.

---

# 12. Creating a Booking

The booking confirmation request is sent to the server.

The server then:

1. Validates the submitted data.
2. Looks up the selected service from the authoritative service catalogue.
3. Gets the service price and duration from the server-side data.
4. Validates the selected date and time.
5. Validates the opening hours.
6. Validates the minimum notice rule.
7. Rechecks availability.
8. Assigns a barber if No preference was selected.
9. Generates the booking end time from the service duration.
10. Creates a unique booking reference.
11. Stores the booking.
12. Returns the confirmed booking information.

The browser must not be trusted to supply:

* service price
* service duration
* opening hours
* barber availability
* final barber assignment

---

# 13. Race Conditions

Two customers may attempt to book the same barber and time at approximately the same moment.

Therefore, availability shown in the UI is not considered a guarantee.

The server performs a final availability check during booking creation.

If the selected slot becomes unavailable:

* the booking is not created
* the customer receives a clear conflict message
* entered customer details are retained
* the customer is prompted to select another available time
* no booking data is partially or misleadingly confirmed

Booking creation must use a database transaction or equivalent atomic server-side operation so that the final availability check and booking creation cannot be separated by another competing booking request. The implementation must prevent overlapping confirmed bookings for the same barber.

The user should not receive information about another customer's booking.

---

# 14. Booking API

The booking functionality is exposed through server-side route handlers.

Conceptually:

```text
GET /api/bookings/availability
POST /api/bookings
```

### Availability request

The availability endpoint accepts the information needed to determine slots, such as:

```text
service
barber
date
```

It returns available booking information for that date.

### Booking request

The booking endpoint accepts the validated customer booking details.

The server is responsible for the final validation and persistence.

The API must return useful error responses for:

* invalid input
* unavailable date
* unavailable time
* booking conflict
* server failure

Internal errors must not expose sensitive implementation details.

---

# 15. Client and Server Responsibilities

## Client

The client is responsible for:

* displaying the booking interface
* collecting customer input
* providing immediate validation feedback
* requesting availability
* showing available slots
* showing selected booking details
* preventing obvious duplicate submissions
* displaying loading and error states
* displaying the confirmation result

## Server

The server is responsible for:

* authoritative validation
* business rules
* availability calculation
* conflict checking
* barber assignment
* booking persistence
* reference generation
* calendar data generation inputs

The server is always the final authority.

---

# 16. Form Validation

Required fields:

* Full name
* Mobile number
* Email
* Terms acceptance

Notes are optional.

Validation includes:

### Name

* trimmed
* minimum two characters

### Phone

Accepts sensible Zambian/international phone formats containing digits, spaces, and `+` where appropriate.

### Email

Must be a valid email format.

### Terms

Must be explicitly accepted.

### Booking selection

The server must verify:

* service exists
* barber exists or represents No preference
* date is valid
* time is valid
* selected combination is available

Validation errors should be shown close to the relevant fields where possible.

---

# 17. Booking State Management

The booking UI maintains the customer's current selections while moving through the steps.

Changing an earlier selection can invalidate later selections.

Therefore:

### Changing service

Recheck availability and clear an incompatible selected time.

### Changing barber

Recheck availability and clear an incompatible selected time.

### Changing date

Clear the selected time.

### Booking failure

Do not clear customer-entered details unnecessarily.

This prevents the user from having to restart the entire booking process after a temporary conflict or server error.

---

# 18. Double Submission Protection

The Confirm Booking button becomes disabled while a booking request is being processed.

A loading state is displayed.

The server must also protect against duplicate booking creation where possible.

The UI must not allow a user to accidentally create multiple bookings by repeatedly clicking Confirm.

---

# 19. Confirmation

After successful booking creation, the confirmation screen displays:

* booking confirmation
* customer's first name
* unique reference
* service
* barber
* date
* start and end time
* price
* arrival information
* cancellation/change instructions
* calendar actions

The confirmation screen must not imply that Groomd has sent an email, SMS, or WhatsApp confirmation.

---

# 20. Calendar Integration

Calendar actions are generated from the confirmed booking.

Two actions are provided:

```text
Add to Google Calendar
Add to Apple Calendar
```

---

## 20.1 Google Calendar

The application generates a Google Calendar event URL containing the confirmed appointment details.

The event includes:

* title
* start date/time
* end date/time
* location
* description

The appointment data is generated dynamically from the confirmed booking.

No OAuth or two-way calendar synchronisation is required.

---

## 20.2 Apple Calendar / ICS

The application generates an `.ics` calendar file.

The event contains:

* unique event identifier
* Groomd appointment title
* start time
* end time
* timezone information
* full studio address
* service
* barber
* price
* booking reference
* customer name
* arrival information
* cancellation/change instructions
* Terms URL

The filename follows:

```text
groomd-appointment-{YYYY-MM-DD}.ics
```

The `.ics` file must use correct escaping and valid calendar syntax.

The file should also be usable by other calendar applications that support ICS, including Outlook.

---

## 20.3 Calendar Timezone

Calendar events must represent the appointment in:

```text
Africa/Lusaka
```

The event must not shift to an incorrect local time when opened by a calendar application in another timezone.

---

# 21. Static Business Information

Business information such as:

* address
* phone
* email
* hours
* timezone
* currency

must come from shared data rather than being independently typed into multiple components.

This prevents pages from displaying conflicting information.

The phone and email are intentionally fictional assessment placeholders as documented in `CONTENT.md`.

---

# 22. Navigation and Layout

The site uses shared layout components for:

* header
* navigation
* mobile menu
* footer
* buttons
* common UI elements

The header and footer must use the approved content from `CONTENT.md`.

Navigation routes must point to real pages.

The Book Now CTA always points to:

```text
/book
```

The mobile navigation must remain fully usable at the smallest required viewport.

---

# 23. First-Visit Offer Modal

The first-visit offer is implemented as a client-side modal.

The modal:

* appears on the Home page only
* appears after a short delay
* appears at most once per visitor
* can be closed
* closes with Escape
* closes through the backdrop where appropriate
* provides a booking CTA
* does not appear inside the booking flow

Persistence may use browser storage to remember that the visitor has already seen or dismissed the offer.

No full promotion engine is required.

The `FIRST15` offer is content-driven and must not change normal service prices displayed on the site.

---

# 24. Accessibility Architecture

Accessibility is treated as part of implementation rather than a final cosmetic pass.

The application must provide:

* semantic HTML
* labelled form controls
* keyboard navigation
* visible focus states
* accessible error messages
* accessible selected states
* accessible mobile navigation
* accessible modal focus management
* Escape handling
* sufficient touch target sizes
* descriptive image alt text
* skip-to-content navigation

Important booking states must not rely on colour alone.

Examples:

```text
Selected + check indicator
Closed + text label
Full + text label
Error + text/message
```

Reduced-motion preferences must be respected.

---

# 25. Responsive Architecture

The layout must support:

```text
360px
390px
768px
1024px
1280px
1440px
```

The application must not depend on a desktop-only layout.

Particular attention is required for:

* header navigation
* Book Now CTA
* booking controls
* service cards
* barber profiles
* modal
* footer
* calendar buttons

Horizontal overflow is considered a defect.

---

# 26. Error Handling

The application must provide clear user-facing states for:

### Invalid form

Tell the user what needs correction.

### No availability

Explain that no suitable times are currently available and provide the next useful action where possible.

### Booking conflict

Tell the user the selected time is no longer available and allow them to choose another time.

### Network/server error

Tell the user the booking could not be completed and allow a retry.

### Unexpected server error

Show a generic user-friendly message.

Technical stack traces, database errors, environment variables, or internal implementation details must never be shown to the public.

---

# 27. Security

This is a public booking application, so basic defensive practices are required.

The implementation must:

* validate all server input
* never trust client-provided prices or durations
* avoid exposing database credentials
* use environment variables for secrets
* avoid rendering unsanitised user content as HTML
* avoid exposing internal error details
* use HTTPS in production
* use database queries safely
* prevent duplicate booking submission where practical

No authentication system is required because the public site does not provide customer accounts.

---

# 28. Data Retention

Booking information is retained for up to 12 months as stated in `CONTENT.md`.

The assessment does not require an automated retention-deletion system unless implementation time permits.

The application must not collect information that is outside the booking requirements.

No marketing subscription is created from the booking form.

---

# 29. Scope Boundaries

The following are intentionally excluded from the architecture:

* customer accounts
* login
* online payments
* admin dashboard
* barber dashboard
* online cancellation
* online rescheduling
* email confirmation
* SMS confirmation
* WhatsApp confirmation
* two-way calendar synchronisation
* OAuth calendar connection
* loyalty system
* gift cards
* e-commerce
* CMS
* blog
* multiple locations
* multilingual support
* public holiday scheduling
* barber-specific shifts
* promotion engine

These features may be appropriate for a larger production system but are outside the assessment scope.

---

# 30. Testing Strategy

Testing will happen at multiple levels.

## Functional testing

Verify:

* every navigation link
* mobile menu
* Book Now buttons
* service selection
* barber selection
* date selection
* time selection
* customer validation
* terms checkbox
* review
* booking confirmation
* reference generation
* Google Calendar action
* Apple/ICS action
* modal
* legal pages
* map link
* responsive layout

---

## Booking edge cases

Test:

* Sunday selection
* fully booked day
* earliest valid same-day appointment
* one-hour notice
* appointment ending exactly at closing
* appointment extending beyond closing
* changing service after selecting a time
* changing barber after selecting a time
* changing date after selecting a time
* unavailable barber
* No preference assignment
* simultaneous/conflicting booking attempt
* invalid customer data
* repeated Confirm clicks
* temporary server/network failure

---

## Calendar testing

Test:

* Google Calendar
* Apple Calendar / ICS
* Outlook-compatible ICS behaviour
* appointment duration
* address
* reference
* barber
* timezone
* alternate timezone viewing

---

## Browser and device testing

At minimum:

* Chrome desktop
* Firefox
* Edge
* Safari where available
* mobile Safari
* Android Chrome

Required viewport checks:

```text
360
390
768
1024
1280
1440
```

---

# 31. Production Readiness

Before submission, the live site must:

* use HTTPS
* load publicly without authentication
* contain no debug information
* contain no development banners
* have no broken images
* have no missing pages
* have no obvious JavaScript errors
* have no horizontal overflow
* have working booking persistence
* have working calendar actions
* have working mobile navigation
* have working modal behaviour
* have correct page titles
* have favicon/brand identity
* contain no test bookings that should not remain in the submitted system

The complete recruiter journey must be tested on the deployed site:

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

---

# 32. Architectural Decision Summary

| Decision          | Choice                 | Reason                                                              |
| ----------------- | ---------------------- | ------------------------------------------------------------------- |
| Framework         | Next.js                | One application for pages and server functionality                  |
| Language          | TypeScript             | Safer data and clearer application contracts                        |
| Styling           | Tailwind CSS           | Efficient implementation of the locked design system                |
| Forms             | React Hook Form        | Practical multi-step form state                                     |
| Validation        | Zod                    | Consistent input validation                                         |
| Database          | PostgreSQL             | Reliable booking persistence                                        |
| Booking authority | Server                 | Prevents client-side manipulation of business rules                 |
| Availability      | Calculated dynamically | Avoids maintaining a large slot table                               |
| Barber assignment | Server                 | Correctly handles No preference and race conditions                 |
| Calendar          | Google URL + ICS       | Covers Google and Apple-compatible calendar workflows without OAuth |
| Accounts          | None                   | Outside assessment scope                                            |
| Payments          | None                   | Outside assessment scope                                            |
| Messaging         | None                   | Outside assessment scope                                            |
| Deployment        | Public HTTPS           | Required for live recruiter testing                                 |

---

# 33. Final Architecture Rule

The most important rule in the Groomd application is:

> **The UI may suggest what is available, but the server decides what can actually be booked.**

Everything involving appointment validity must ultimately be checked against the authoritative business rules and current booking data on the server.

The website should remain simple enough to understand, but robust enough that a user cannot create an invalid appointment simply by manipulating the browser.
