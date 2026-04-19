import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FoodOS - Mfumo wa Usimamizi wa Mgahawa",
  description: "Simamia mgahawa wako kutoka simu yako. POS, Stoku, Gharama, Faida halisi — yote katika mfumo mmoja.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sw" className={`${geist.variable} h-full`} suppressHydrationWarning>
      <body className="min-h-full font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
