import { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
  ServicesHeader,
  CategoryNav,
  ServiceCategorySection,
  GroomdApproachBand,
} from "@/components/services";
import { HoneyInvitationBand } from "@/components/layout/HoneyInvitationBand";

export const metadata: Metadata = {
  title: "Services & Prices — Groomd · Men's Grooming Studio",
  description:
    "Browse precision haircuts, skin fades, beard trims, hot towel shaves, and packages at Groomd in Lusaka. Clear ZMW prices and durations.",
  openGraph: {
    title: "Services & Prices — Groomd · Men's Grooming Studio",
    description:
      "Browse precision haircuts, skin fades, beard trims, hot towel shaves, and packages at Groomd in Lusaka. Clear ZMW prices and durations.",
    type: "website",
    locale: "en_ZM",
    siteName: "Groomd",
  },
};

export default function ServicesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-background)]">
      <Header />
      <main id="main-content" className="flex-1">
        <ServicesHeader />
        <CategoryNav />
        <ServiceCategorySection />
        <GroomdApproachBand />
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
