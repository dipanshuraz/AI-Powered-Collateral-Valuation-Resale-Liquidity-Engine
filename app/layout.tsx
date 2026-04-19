import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const sans = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "EstimateEngine",
    template: "%s | EstimateEngine",
  },
  description:
    "Collateral valuation and resale liquidity engine — range-based estimates (demo).",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const fontVars = [sans.variable, mono.variable].join(" ");

  return (
    <html lang="en" className={`${fontVars} scheme-light`}>
      <body className={`${sans.className} min-h-screen bg-white text-neutral-900 antialiased`}>
        {children}
      </body>
    </html>
  );
}
