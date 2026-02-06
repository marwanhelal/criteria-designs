import type { Metadata } from "next";
import { Merriweather, Open_Sans, Libre_Franklin } from "next/font/google";
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
        className={`${merriweather.variable} ${openSans.variable} ${libreFranklin.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
