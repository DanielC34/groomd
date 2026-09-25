import { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
  ContactHeader,
  DirectChannels,
  ContactHoursBand,
  GettingHereMap,
  NeedATimeNotice,
  FictionalNotice,
} from "@/components/contact";
import { HoneyInvitationBand } from "@/components/layout/HoneyInvitationBand";

export const metadata: Metadata = {
  title: "Visit Groomd — Contact & Location · Men's Grooming Studio",
  description:
    "Find Groomd at Shop 3, Mopani Court, Kabulonga, Lusaka. Phone, email, opening hours, directions, and online booking information.",
  openGraph: {
    title: "Visit Groomd — Contact & Location · Men's Grooming Studio",
    description:
      "Find Groomd at Shop 3, Mopani Court, Kabulonga, Lusaka. Phone, email, opening hours, directions, and online booking information.",
    type: "website",
    locale: "en_ZM",
    siteName: "Groomd",
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-background)]">
      <Header />
      <main id="main-content" className="flex-1">
        <ContactHeader />
        <DirectChannels />
        <ContactHoursBand />
        <GettingHereMap />
        <NeedATimeNotice />
        <FictionalNotice />
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
