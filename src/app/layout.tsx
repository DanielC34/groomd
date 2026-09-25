import type { Metadata } from "next";
import { Archivo, Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Groomd — Men's Grooming Studio",
  description: "Groomd is a modern barbershop in Lusaka for cuts, fades, beard work and hot towel shaves, with online booking and clear prices.",
  metadataBase: new URL("https://groomd.example"),
  openGraph: {
    title: "Groomd — Men's Grooming Studio",
    description: "Groomd is a modern barbershop in Lusaka for cuts, fades, beard work and hot towel shaves, with online booking and clear prices.",
    type: "website",
    locale: "en_ZM",
    siteName: "Groomd",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${archivo.variable} ${inter.variable} h-full antialiased`}>
      <head>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-full flex flex-col bg-[var(--color-background)] text-[var(--color-text-primary)]">
        <Header />
        <main id="main-content" className="flex-1" role="main">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}