import { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "Groomd — Men's Grooming Studio",
  description: "Groomd is a modern barbershop in Lusaka for cuts, fades, beard work and hot towel shaves, with online booking and clear prices.",
  openGraph: {
    title: "Groomd — Men's Grooming Studio",
    description: "Groomd is a modern barbershop in Lusaka for cuts, fades, beard work and hot towel shaves, with online booking and clear prices.",
    type: "website",
    locale: "en_ZM",
    siteName: "Groomd",
  },
};

export default function Home() {
  return (
    <>
      <Hero />
      <QuickInfo />
      <Values />
      <ServicesPreview />
      <CraftBand />
      <BarbersPreview />
      <VisitStudio />
      <HoneyInvitationBand />
    </>
  );
}