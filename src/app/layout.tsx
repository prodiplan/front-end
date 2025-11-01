import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Essay Preparedness Grader - ProdiPlan",
  description:
    "Platform inovatif untuk menganalisis kesiapan siswa memilih jurusan kuliah dengan AI-powered conversational agent",
  keywords: [
    "essay grader",
    "AI",
    "jurusan kuliah",
    "prodiplan",
    "kesiapan mahasiswa",
  ],
  authors: [{ name: "ProdiPlan Team" }],
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#3b82f6",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="h-full">
      <body className={`${inter.className} h-full`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
