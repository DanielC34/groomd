import { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
  Hero,
  QuickInfo,
  Values,
  ServicesPreview,
  CraftBand,
  BarbersPreview,
  VisitStudio,
} from "@/components/home";
import { HoneyInvitationBand } from "@/components/layout/HoneyInvitationBand";
import { FirstVisitModal } from "@/components/ui/FirstVisitModal";

export const metadata: Metadata = {
  title: "Groomd — Men's Grooming Studio",
  description:
    "Groomd is a modern barbershop in Lusaka for cuts, fades, beard work and hot towel shaves, with online booking and clear prices.",
  openGraph: {
    title: "Groomd — Men's Grooming Studio",
    description:
      "Groomd is a modern barbershop in Lusaka for cuts, fades, beard work and hot towel shaves, with online booking and clear prices.",
    type: "website",
    locale: "en_ZM",
    siteName: "Groomd",
  },
};

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-background)]">
      <Header />
      <main id="main-content" className="flex-1">
        <Hero />
        <QuickInfo />
        <Values />
        <ServicesPreview />
        <CraftBand />
        <BarbersPreview />
        <VisitStudio />
        <HoneyInvitationBand />
      </main>
      <Footer />
      <FirstVisitModal />
    </div>
  );
}