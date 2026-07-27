import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { StoreProvider } from "@/lib/store";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Dana Talía | Cosmética, Lencería & Bikinis",
  description:
    "Cosmética botánica cruelty free, lencería fina y trajes de baño de diseño propio. Envíos a todo el país. Opciones mayoristas disponibles.",
  keywords: [
    "cosmética", "skincare", "maquillaje", "perfumes", "lencería",
    "bikinis", "ropa interior", "mayorista", "Dana Talía",
    "Reconquista", "Santa Fe", "cruelty free",
  ],
  openGraph: {
    title: "Dana Talía | Cosmética, Lencería & Bikinis",
    description:
      "Cosmética botánica cruelty free, lencería fina y trajes de baño de diseño propio.",
    type: "website",
    locale: "es_AR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${playfair.variable} ${jakarta.variable}`}>
      <body className="min-h-screen flex flex-col antialiased">
        <StoreProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <WhatsAppButton />
        </StoreProvider>
      </body>
    </html>
  );
}
