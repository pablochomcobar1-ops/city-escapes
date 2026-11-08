import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { ThemeScript } from "@/components/theme/ThemeScript";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { Grain } from "@/components/motion/Grain";
import { CursorRing } from "@/components/motion/CursorRing";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { LightLeak } from "@/components/bg/LightLeak";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "City Escapes · Your escape, within the city.",
    template: "%s · City Escapes",
  },
  description:
    "3 & 4 BHK residences on SG Highway, Ahmedabad. A concept project by Pablo Chomcobar.",
  authors: [{ name: "Pablo Chomcobar" }],
};

export const viewport: Viewport = {
  themeColor: "#0e0d0b",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-theme="night"
      className={`${cormorant.variable} ${manrope.variable}`}
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
      </head>
      <body id="top">
        <LightLeak />
        <SmoothScroll />
        <Nav />
        <main id="main">{children}</main>
        <Footer />
        <Grain />
        <CursorRing />
      </body>
    </html>
  );
}
