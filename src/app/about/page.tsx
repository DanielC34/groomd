import { Metadata } from "next";
import {
  AboutHeader,
  WhyWeOpened,
  HowWeWork,
  AboutStatementBand,
  BarbersSection,
} from "@/components/about";

export const metadata: Metadata = {
  title: "About Us — Groomd · Men's Grooming Studio",
  description:
    "A modern barbershop in Kabulonga, built around one idea: good grooming should be easy to book and worth the chair time.",
  openGraph: {
    title: "About Us — Groomd · Men's Grooming Studio",
    description:
      "A modern barbershop in Kabulonga, built around one idea: good grooming should be easy to book and worth the chair time.",
    type: "website",
    locale: "en_ZM",
    siteName: "Groomd",
  },
};

export default function AboutPage() {
  return (
    <>
        <AboutHeader />
        <WhyWeOpened />
        <HowWeWork />
        <AboutStatementBand />
        <BarbersSection />
    </>
  );
}
