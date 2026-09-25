import { Metadata } from "next";
import Link from "next/link";
import { LEGAL_LAST_UPDATED } from "@/lib/data/legal";
import { businessInfo } from "@/lib/data/business";

export const metadata: Metadata = {
  title: "Privacy Policy · Groomd",
  description: "This policy explains what information Groomd collects when you book, and how we use it.",
  openGraph: {
    title: "Privacy Policy · Groomd",
    description: "This policy explains what information Groomd collects when you book, and how we use it.",
    type: "website",
    locale: "en_ZM",
    siteName: "Groomd",
  },
};

export default function PrivacyPage() {
  return (
    <>
        <section className="bg-[var(--color-background)] text-[var(--color-brand-primary)] py-16 lg:py-24" aria-labelledby="privacy-heading">
          <div className="container-narrow">
            <div className="mb-10">
              <span className="block font-body text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--color-brand-primary)] mb-2">
                LEGAL
              </span>
              <h1 id="privacy-heading" className="font-display font-extrabold uppercase tracking-tight text-3xl md:text-4xl text-[var(--color-brand-primary)] mb-4">
                PRIVACY POLICY
              </h1>
              <p className="font-body text-sm text-[var(--color-text-muted)]">
                Last updated {LEGAL_LAST_UPDATED}
              </p>
            </div>
            <div>
              <p className="font-body text-base text-[var(--color-brand-primary)] leading-[1.7] max-w-[68ch] mb-8">
                This policy explains what information Groomd collects when you book, and how we use it.
              </p>

              <article className="space-y-8">
                <section>
                  <h2 className="font-display font-bold text-xl text-[var(--color-brand-primary)] mb-3">1. What we collect</h2>
                  <p className="font-body text-base text-[var(--color-brand-primary)] leading-[1.7] max-w-[68ch]">
                    When you book, we collect your full name, mobile number, email address, any notes you add, and your booking details: service, barber, date, time and booking reference.
                  </p>
                </section>

                <section>
                  <h2 className="font-display font-bold text-xl text-[var(--color-brand-primary)] mb-3">2. Why we collect it</h2>
                  <p className="font-body text-base text-[var(--color-brand-primary)] leading-[1.7] max-w-[68ch]">
                    Only to manage your appointment: to hold your time, prepare for your visit, and contact you if something about your booking changes.
                  </p>
                </section>

                <section>
                  <h2 className="font-display font-bold text-xl text-[var(--color-brand-primary)] mb-3">3. How we use it</h2>
                  <p className="font-body text-base text-[var(--color-brand-primary)] leading-[1.7] max-w-[68ch]">
                    Your details are stored securely with your booking. We don&apos;t use them for marketing, and we don&apos;t send promotional emails or messages.
                  </p>
                </section>

                <section>
                  <h2 className="font-display font-bold text-xl text-[var(--color-brand-primary)] mb-3">4. We don&apos;t sell your information</h2>
                  <p className="font-body text-base text-[var(--color-brand-primary)] leading-[1.7] max-w-[68ch]">
                    We never sell, rent or trade your personal information.
                  </p>
                </section>

                <section>
                  <h2 className="font-display font-bold text-xl text-[var(--color-brand-primary)] mb-3">5. How long we keep it</h2>
                  <p className="font-body text-base text-[var(--color-brand-primary)] leading-[1.7] max-w-[68ch]">
                    We keep booking records for up to 12 months after your appointment, then delete them.
                  </p>
                </section>

                <section>
                  <h2 className="font-display font-bold text-xl text-[var(--color-brand-primary)] mb-3">6. Calendar events</h2>
                  <p className="font-body text-base text-[var(--color-brand-primary)] leading-[1.7] max-w-[68ch]">
                    If you choose &ldquo;Add to Google Calendar&rdquo;, your appointment details are passed to Google so Google can create the event in your account. If you choose &ldquo;Add to Apple Calendar&rdquo;, an .ics file is created on your device. What happens next is governed by your calendar provider. This is a one-off event, not a connection between Groomd and your calendar.
                  </p>
                </section>

                <section>
                  <h2 className="font-display font-bold text-xl text-[var(--color-brand-primary)] mb-3">7. Keeping it safe</h2>
                  <p className="font-body text-base text-[var(--color-brand-primary)] leading-[1.7] max-w-[68ch]">
                    We take reasonable steps to protect your information and limit access to what&apos;s needed to run your booking.
                  </p>
                </section>

                <section>
                  <h2 className="font-display font-bold text-xl text-[var(--color-brand-primary)] mb-3">8. Your choices</h2>
                  <p className="font-body text-base text-[var(--color-brand-primary)] leading-[1.7] max-w-[68ch]">
                    You can ask us what booking information we hold about you, or ask us to correct or delete it, by contacting us below.
                  </p>
                </section>

                <section>
                  <h2 className="font-display font-bold text-xl text-[var(--color-brand-primary)] mb-3">9. Contact</h2>
                  <p className="font-body text-base text-[var(--color-brand-primary)] leading-[1.7] max-w-[68ch]">
                    Questions about privacy? Email {businessInfo.email} or call {businessInfo.phone.display}.
                  </p>
                </section>
              </article>

              <div className="mt-10 pt-8 border-t border-[var(--color-border)]">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <Link href="/" className="font-body text-sm font-semibold underline text-[var(--color-brand-primary)] hover:text-[var(--color-brand-secondary)]">
                    Back to home
                  </Link>
                  <Link href="/book" className="font-body text-sm font-semibold underline text-[var(--color-brand-primary)] hover:text-[var(--color-brand-secondary)]">
                    Book an appointment
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
    </>
  );
}