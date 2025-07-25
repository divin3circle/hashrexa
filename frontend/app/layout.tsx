import type { Metadata } from "next";
import { Geist, Geist_Mono, Ubuntu_Mono, Ubuntu } from "next/font/google";
import "./globals.css";

const ubuntuMono = Ubuntu_Mono({
  weight: "400",
  variable: "--font-ubuntu-mono",
  subsets: ["latin"],
});

const ubuntuSans = Ubuntu({
  weight: "400",
  variable: "--font-ubuntu-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hashrexa",
  description: "Tokenize stock for use in DeFi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${ubuntuSans.variable} ${ubuntuMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
