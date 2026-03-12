import type { Metadata } from "next";
import { Merriweather, Open_Sans, Libre_Franklin, Playfair_Display } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

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

export const metadata: Metadata = {
  title: "Criteria Designs | Architecture & Interior Design",
  description:
    "Leading architecture and interior design firm. We build quality real estate projects since 1978.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${merriweather.variable} ${openSans.variable} ${libreFranklin.variable} ${playfairDisplay.variable} ${franklinGothic.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
