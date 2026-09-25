import { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { businessInfo } from "@/lib/data/business";

export const metadata: Metadata = {
  title: "Privacy Policy · Groomd",
  description: "Privacy policy for Groomd Men's Grooming Studio in Lusaka. How we collect, use, and protect your booking information.",
  openGraph: {
    title: "Privacy Policy · Groomd",
    description: "Privacy policy for Groomd Men's Grooming Studio in Lusaka.",
    type: "website",
    locale: "en_ZM",
    siteName: "Groomd",
  },
};

const deploymentDate = new Date().toLocaleDateString("en-US", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "Africa/Lusaka",
});

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-background)]">
      <Header />
      <main id="main-content" className="flex-1">
        <section className="bg-[var(--color-brand-primary)] text-[var(--color-text-on-strong)] py-16 lg:py-24" aria-labelledby="privacy-heading">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <span className="block font-body text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--color-brand-accent)] mb-2">
                LEGAL
              </span>
              <h1 id="privacy-heading" className="font-display font-extrabold uppercase tracking-tight text-3xl md:text-4xl text-[var(--color-brand-light)] mb-4">
                PRIVACY POLICY
              </h1>
              <p className="font-body text-base text-[var(--color-text-on-strong-secondary)]">
                Last updated: {deploymentDate}
              </p>
            </div>
            <div className="max-w-3xl mx-auto">
              <p className="font-body text-base text-[var(--color-text-on-strong-secondary)] leading-relaxed mb-8">
                This policy explains what information Groomd collects when you book, and how we use it.
              </p>

              <article className="space-y-8">
                <section>
                  <h2 className="font-display font-bold text-xl text-[var(--color-brand-light)] mb-3">1. What we collect</h2>
                  <p className="font-body text-base text-[var(--color-text-on-strong-secondary)] leading-relaxed">
                    When you book, we collect your full name, mobile number, email address, any notes you add, and your booking details: service, barber, date, time and booking reference.
                  </p>
                </section>

                <section>
                  <h2 className="font-display font-bold text-xl text-[var(--color-brand-light)] mb-3">2. Why we collect it</h2>
                  <p className="font-body text-base text-[var(--color-text-on-strong-secondary)] leading-relaxed">
                    Only to manage your appointment: to hold your time, prepare for your visit, and contact you if something about your booking changes.
                  </p>
                </section>

                <section>
                  <h2 className="font-display font-bold text-xl text-[var(--color-brand-light)] mb-3">3. How we use it</h2>
                  <p className="font-body text-base text-[var(--color-text-on-strong-secondary)] leading-relaxed">
                    Your details are stored securely with your booking. We don&apos;t use them for marketing, and we don&apos;t send promotional emails or messages.
                  </p>
                </section>

                <section>
                  <h2 className="font-display font-bold text-xl text-[var(--color-brand-light)] mb-3">4. We don&apos;t sell your information</h2>
                  <p className="font-body text-base text-[var(--color-text-on-strong-secondary)] leading-relaxed">
                    We never sell, rent or trade your personal information.
                  </p>
                </section>

                <section>
                  <h2 className="font-display font-bold text-xl text-[var(--color-brand-light)] mb-3">5. How long we keep it</h2>
                  <p className="font-body text-base text-[var(--color-text-on-strong-secondary)] leading-relaxed">
                    We keep booking records for up to 12 months after your appointment, then delete them.
                  </p>
                </section>

                <section>
                  <h2 className="font-display font-bold text-xl text-[var(--color-brand-light)] mb-3">6. Calendar events</h2>
                  <p className="font-body text-base text-[var(--color-text-on-strong-secondary)] leading-relaxed">
                    If you choose &ldquo;Add to Google Calendar&rdquo;, your appointment details are passed to Google so Google can create the event in your account. If you choose &ldquo;Add to Apple Calendar&rdquo;, an .ics file is created on your device. What happens next is governed by your calendar provider. This is a one-off event, not a connection between Groomd and your calendar.
                  </p>
                </section>

                <section>
                  <h2 className="font-display font-bold text-xl text-[var(--color-brand-light)] mb-3">7. Keeping it safe</h2>
                  <p className="font-body text-base text-[var(--color-text-on-strong-secondary)] leading-relaxed">
                    We take reasonable steps to protect your information and limit access to what&apos;s needed to run your booking.
                  </p>
                </section>

                <section>
                  <h2 className="font-display font-bold text-xl text-[var(--color-brand-light)] mb-3">8. Your choices</h2>
                  <p className="font-body text-base text-[var(--color-text-on-strong-secondary)] leading-relaxed">
                    You can ask us what booking information we hold about you, or ask us to correct or delete it, by contacting us below.
                  </p>
                </section>

                <section>
                  <h2 className="font-display font-bold text-xl text-[var(--color-brand-light)] mb-3">9. Contact</h2>
                  <p className="font-body text-base text-[var(--color-text-on-strong-secondary)] leading-relaxed">
                    Questions about privacy? Email hello@groomd.example or call {businessInfo.phone.display}.
                  </p>
                </section>
              </article>

              <div className="mt-10 pt-8 border-t border-[var(--color-brand-secondary)]/50">
                <p className="font-body text-xs text-[var(--color-text-on-strong-muted)]">
                  *No legal regimes, certifications or compliance claims are made.
                </p>
                <div className="mt-4 flex flex-col sm:flex-row items-center gap-4">
                  <Link href="/" className="font-body text-sm font-semibold underline text-[var(--color-brand-accent)] hover:text-[var(--color-brand-light)]">
                    Back to home
                  </Link>
                  <Link href="/book" className="font-body text-sm font-semibold underline text-[var(--color-brand-accent)] hover:text-[var(--color-brand-light)]">
                    Book an appointment
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer omitInvitationBand />
    </div>
  );
}