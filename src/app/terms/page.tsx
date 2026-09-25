import { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { businessInfo } from "@/lib/data/business";

export const metadata: Metadata = {
  title: "Terms & Conditions · Groomd",
  description: "Terms and conditions for booking appointments at Groomd Men's Grooming Studio in Lusaka.",
  openGraph: {
    title: "Terms & Conditions · Groomd",
    description: "Terms and conditions for booking appointments at Groomd.",
    type: "website",
    locale: "en_ZM",
    siteName: "Groomd",
  },
};

const today = new Date();
const deploymentDate = today.toLocaleDateString("en-US", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "Africa/Lusaka",
});

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-background)]">
      <Header />
      <main id="main-content" className="flex-1">
        <section className="bg-[var(--color-brand-primary)] text-[var(--color-text-on-strong)] py-16 lg:py-24" aria-labelledby="terms-heading">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <span className="block font-body text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--color-brand-accent)] mb-2">
                LEGAL
              </span>
              <h1 id="terms-heading" className="font-display font-extrabold uppercase tracking-tight text-3xl md:text-4xl text-[var(--color-brand-light)] mb-4">
                TERMS & CONDITIONS
              </h1>
              <p className="font-body text-base text-[var(--color-text-on-strong-secondary)]">
                Last updated: {deploymentDate}
              </p>
            </div>
            <div className="max-w-3xl mx-auto">
              <p className="font-body text-base text-[var(--color-text-on-strong-secondary)] leading-relaxed mb-8">
                These terms explain how booking and appointments work at Groomd. They&apos;re written in plain language. By booking, you agree to them.
              </p>

              <article className="space-y-8">
                <section>
                  <h2 className="font-display font-bold text-xl text-[var(--color-brand-light)] mb-3">1. Booking an appointment</h2>
                  <p className="font-body text-base text-[var(--color-text-on-strong-secondary)] leading-relaxed">
                    You can book online up to 30 days ahead. A booking is confirmed only when you see the confirmation screen with a booking reference. Your confirmation appears on screen. We don&apos;t send confirmation emails or text messages, so note your reference or add the appointment to your calendar. Please give accurate contact details so we can reach you if something changes.
                  </p>
                </section>

                <section>
                  <h2 className="font-display font-bold text-xl text-[var(--color-brand-light)] mb-3">2. One service per booking</h2>
                  <p className="font-body text-base text-[var(--color-text-on-strong-secondary)] leading-relaxed">
                    Each booking covers one service. For a cut and beard together, choose the Cut & Beard package. If you&apos;d like extra work on the day, ask your barber. We&apos;ll help if time allows.
                  </p>
                </section>

                <section>
                  <h2 className="font-display font-bold text-xl text-[var(--color-brand-light)] mb-3">3. Arrival and timing</h2>
                  <p className="font-body text-base text-[var(--color-text-on-strong-secondary)] leading-relaxed">
                    Please arrive 5 minutes before your appointment. Appointment lengths are estimates and may run slightly shorter or longer.
                  </p>
                </section>

                <section>
                  <h2 className="font-display font-bold text-xl text-[var(--color-brand-light)] mb-3">4. Late arrival</h2>
                  <p className="font-body text-base text-[var(--color-text-on-strong-secondary)] leading-relaxed">
                    If you&apos;re more than 10 minutes late, we may need to shorten your service or rebook you so the next client isn&apos;t kept waiting.
                  </p>
                </section>

                <section>
                  <h2 className="font-display font-bold text-xl text-[var(--color-brand-light)] mb-3">5. Cancellations and changes</h2>
                  <p className="font-body text-base text-[var(--color-text-on-strong-secondary)] leading-relaxed">
                    To cancel or change a booking, call us on {businessInfo.phone.display}, ideally at least 2 hours before your appointment. Bookings can&apos;t be changed or cancelled online.
                  </p>
                </section>

                <section>
                  <h2 className="font-display font-bold text-xl text-[var(--color-brand-light)] mb-3">6. No-shows</h2>
                  <p className="font-body text-base text-[var(--color-text-on-strong-secondary)] leading-relaxed">
                    If you can&apos;t make it, please call us so someone else can have your time. Missed appointments without notice make it harder for us to keep times available for everyone.
                  </p>
                </section>

                <section>
                  <h2 className="font-display font-bold text-xl text-[var(--color-brand-light)] mb-3">7. Prices and payment</h2>
                  <p className="font-body text-base text-[var(--color-text-on-strong-secondary)] leading-relaxed">
                    Prices are in Zambian Kwacha (ZMW) and are shown on our website. Payment is made in-store after your appointment. No payment is taken online. Prices may change, but the price shown when you booked applies to that booking.
                  </p>
                </section>

                <section id="first-visit-offer">
                  <h2 className="font-display font-bold text-xl text-[var(--color-brand-light)] mb-3">8. First visit offer (FIRST15)</h2>
                  <p className="font-body text-base text-[var(--color-text-on-strong-secondary)] leading-relaxed">
                    New clients get 15% off one service on their first visit (one booking = one service). Mention FIRST15 when you arrive. The discount is applied in-store. The offer applies once per person, can&apos;t be combined with other offers, and can&apos;t be exchanged for cash. Groomd may end the offer at any time.
                  </p>
                </section>

                <section>
                  <h2 className="font-display font-bold text-xl text-[var(--color-brand-light)] mb-3">9. Barbers</h2>
                  <p className="font-body text-base text-[var(--color-text-on-strong-secondary)] leading-relaxed">
                    You can choose a barber or select No preference, in which case we&apos;ll assign the first available barber. Occasionally we may need to change your barber. We&apos;ll let you know when you arrive or by phone.
                  </p>
                </section>

                <section>
                  <h2 className="font-display font-bold text-xl text-[var(--color-brand-light)] mb-3">10. Kids&apos; cuts</h2>
                  <p className="font-body text-base text-[var(--color-text-on-strong-secondary)] leading-relaxed">
                    Kids&apos; Cut appointments are for kids aged 12 and under. A parent or guardian must stay during the appointment.
                  </p>
                </section>

                <section>
                  <h2 className="font-display font-bold text-xl text-[var(--color-brand-light)] mb-3">11. Services and wellbeing</h2>
                  <p className="font-body text-base text-[var(--color-text-on-strong-secondary)] leading-relaxed">
                    Please tell your barber about any skin sensitivity, allergies or scalp conditions before we start. We may decline or adjust a service if we believe it isn&apos;t safe or suitable.
                  </p>
                </section>

                <section>
                  <h2 className="font-display font-bold text-xl text-[var(--color-brand-light)] mb-3">12. Liability</h2>
                  <p className="font-body text-base text-[var(--color-text-on-strong-secondary)] leading-relaxed">
                    We take care with every service. We&apos;re not responsible for results affected by information you didn&apos;t share with us, or for personal belongings left at the studio.
                  </p>
                </section>

                <section>
                  <h2 className="font-display font-bold text-xl text-[var(--color-brand-light)] mb-3">13. Conduct</h2>
                  <p className="font-body text-base text-[var(--color-text-on-strong-secondary)] leading-relaxed">
                    We aim to keep Groomd friendly and relaxed. We may refuse service to anyone who is abusive or disruptive.
                  </p>
                </section>

                <section>
                  <h2 className="font-display font-bold text-xl text-[var(--color-brand-light)] mb-3">14. Your information</h2>
                  <p className="font-body text-base text-[var(--color-text-on-strong-secondary)] leading-relaxed">
                    We use your booking details only to manage your appointment. See our <a href="/privacy" className="underline hover:text-[var(--color-brand-accent)]">Privacy Policy</a>.
                  </p>
                </section>

                <section>
                  <h2 className="font-display font-bold text-xl text-[var(--color-brand-light)] mb-3">15. Changes to these terms</h2>
                  <p className="font-body text-base text-[var(--color-text-on-strong-secondary)] leading-relaxed">
                    We may update these terms. The version on this page applies to new bookings.
                  </p>
                </section>
              </article>

              <div className="mt-10 pt-8 border-t border-[var(--color-brand-secondary)]/50">
                <p className="font-body text-sm text-[var(--color-text-on-strong-muted)] mb-4">
                  <strong className="text-[var(--color-brand-light)]">Questions?</strong> Call {businessInfo.phone.display} or email hello@groomd.example.
                </p>
                <nav className="flex flex-col sm:flex-row items-center gap-4">
                  <Link href="/" className="font-body text-sm font-semibold underline text-[var(--color-brand-accent)] hover:text-[var(--color-brand-light)]">
                    Back to home
                  </Link>
                  <Link href="/book" className="font-body text-sm font-semibold underline text-[var(--color-brand-accent)] hover:text-[var(--color-brand-light)]">
                    Book an appointment
                  </Link>
                </nav>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer omitInvitationBand />
    </div>
  );
}