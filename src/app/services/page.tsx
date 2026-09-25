import { Metadata } from "next";
import {
  ServicesHeader,
  CategoryNav,
  ServiceCategorySection,
} from "@/components/services";

export const metadata: Metadata = {
  title: "Services & Prices — Groomd · Men's Grooming Studio",
  description:
    "Every service includes a consultation with your barber and a finish you'll be happy walking out with.",
  openGraph: {
    title: "Services & Prices — Groomd · Men's Grooming Studio",
    description:
      "Every service includes a consultation with your barber and a finish you'll be happy walking out with.",
    type: "website",
    locale: "en_ZM",
    siteName: "Groomd",
  },
};

export default function ServicesPage() {
  return (
    <>
        <ServicesHeader />
        <CategoryNav />
        <ServiceCategorySection />
    </>
  );
}
