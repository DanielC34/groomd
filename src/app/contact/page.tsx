import { Metadata } from "next";
import {
  ContactHeader,
  DirectChannels,
  ContactHoursBand,
  GettingHereMap,
  NeedATimeNotice,
  FictionalNotice,
} from "@/components/contact";

export const metadata: Metadata = {
  title: "Visit Groomd — Contact & Location · Men's Grooming Studio",
  description:
    "Find us in Kabulonga, give us a call, or book your chair online.",
  openGraph: {
    title: "Visit Groomd — Contact & Location · Men's Grooming Studio",
    description:
      "Find us in Kabulonga, give us a call, or book your chair online.",
    type: "website",
    locale: "en_ZM",
    siteName: "Groomd",
  },
};

export default function ContactPage() {
  return (
    <>
        <ContactHeader />
        <DirectChannels />
        <ContactHoursBand />
        <GettingHereMap />
        <NeedATimeNotice />
        <FictionalNotice />
    </>
  );
}
