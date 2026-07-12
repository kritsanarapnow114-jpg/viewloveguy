import type { Metadata } from "next";
import { Mali, IBM_Plex_Sans_Thai, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const mali = Mali({
  variable: "--font-mali",
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
});

const plexSansThai = IBM_Plex_Sans_Thai({
  variable: "--font-plex-sans-thai",
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "กำไรและวิว — ระบบจัดการเงินกู้และบัญชี",
  description: "ระบบจัดการเงินกู้และบัญชี ธนาคาร เงินสด รายรับ-รายจ่าย",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className={`${mali.variable} ${plexSansThai.variable} ${plexMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
