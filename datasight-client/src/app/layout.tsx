import type { Metadata } from "next";
import { Inter, Libre_Franklin  } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const libreFranklin = Libre_Franklin({ subsets: ["latin"], variable: '--font-libre-franklin' });

export const metadata: Metadata = {
  title: "Data Sight",
  description: "A capstone project for group 3b.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${libreFranklin.variable}`}>{children}</body>    
    </html>
  );
}
