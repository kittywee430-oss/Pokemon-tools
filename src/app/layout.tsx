import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pokemon TCG Toolbox",
  description: "A toolbox for Pokemon Trading Card Game matchups and analysis",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <header className="bg-gray-800 dark:bg-gray-900 text-white p-4">
          <div className="container mx-auto">
            <h1 className="text-xl font-bold">Pokemon TCG Toolbox</h1>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
