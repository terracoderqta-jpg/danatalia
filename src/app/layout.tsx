import type { Metadata } from "next";
import { Playfair_Display, Montserrat } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Dana Talía | Lencería & Bikinis",
  description:
    "Lencería fina y trajes de baño de diseño propio. Diseños exclusivos con el sello Dana Talía. Reconquista, Santa Fe.",
  keywords: [
    "lencería",
    "bikinis",
    "ropa interior",
    "trajes de baño",
    "diseño propio",
    "Dana Talía",
    "Reconquista",
    "Santa Fe",
  ],
  openGraph: {
    title: "Dana Talía | Lencería & Bikinis",
    description:
      "Lencería fina y trajes de baño de diseño propio. Diseños exclusivos con el sello Dana Talía.",
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
    <html lang="es" className={`${playfair.variable} ${montserrat.variable}`}>
      <body className="min-h-screen flex flex-col antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
