import type { Metadata } from "next";
import { Merriweather, Open_Sans, Libre_Franklin, Playfair_Display } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { prisma } from "@/lib/db";

export const revalidate = 0

const merriweather = Merriweather({
  variable: "--font-merriweather",
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
});

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const libreFranklin = Libre_Franklin({
  variable: "--font-libre-franklin",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

const franklinGothic = localFont({
  src: [
    { path: "../../public/fonts/FranklinGothic.ttf",     weight: "400", style: "normal" },
    { path: "../../public/fonts/FranklinGothicBold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-franklin-gothic",
});

const icomoon = localFont({
  src: [{ path: "../../public/fonts/icomoon.ttf", weight: "400", style: "normal" }],
  variable: "--font-icomoon",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await prisma.siteSettings.findUnique({ where: { id: 'main' } }).catch(() => null)
  const favicon = settings?.favicon
  return {
    title: "Criteria Designs | Architecture, Interior Design & Urban Planning",
    description: "Criteria Designs (CDG) is a multidisciplinary architecture and interior design firm delivering award-winning spaces across Egypt and 12+ countries. From concept to completion — we design with purpose.",
    icons: favicon ? { icon: favicon } : undefined,
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${merriweather.variable} ${openSans.variable} ${libreFranklin.variable} ${playfairDisplay.variable} ${franklinGothic.variable} ${icomoon.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
