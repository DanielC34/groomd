import { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
  AboutHeader,
  WhyWeOpened,
  HowWeWork,
  AboutStatementBand,
  BarbersSection,
} from "@/components/about";
import { HoneyInvitationBand } from "@/components/layout/HoneyInvitationBand";

export const metadata: Metadata = {
  title: "About Us — Groomd · Men's Grooming Studio",
  description:
    "Learn about Groomd in Kabulonga, Lusaka. Dedicated to craftsmanship, clear prices, and unhurried barbering from our three master barbers.",
  openGraph: {
    title: "About Us — Groomd · Men's Grooming Studio",
    description:
      "Learn about Groomd in Kabulonga, Lusaka. Dedicated to craftsmanship, clear prices, and unhurried barbering from our three master barbers.",
    type: "website",
    locale: "en_ZM",
    siteName: "Groomd",
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-background)]">
      <Header />
      <main id="main-content" className="flex-1">
        <AboutHeader />
        <WhyWeOpened />
        <HowWeWork />
        <AboutStatementBand />
        <BarbersSection />
        <HoneyInvitationBand
          eyebrow="YOUR CHAIR IS WAITING"
          headline="READY FOR A FRESH CUT?"
          body="Choose your service and book your chair online."
          ctaText="Book an appointment"
          ctaHref="/book"
        />
      </main>
      <Footer />
    </div>
  );
}
