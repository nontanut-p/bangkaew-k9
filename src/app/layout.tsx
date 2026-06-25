import type { Metadata } from "next";
import { headers } from "next/headers";
import { Noto_Sans_Thai, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const notoSansThai = Noto_Sans_Thai({
  subsets: ["thai", "latin"],
  variable: "--font-noto-sans-thai",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bangkaew K9 | Agentic Cybersecurity Guard Platform",
  description:
    "An Agentic Cybersecurity platform that detects, analyzes, recommends responses, and generates incident reports from Wazuh, Shuffle, Kali, and AI Agents.",
  keywords: [
    "cybersecurity",
    "Wazuh",
    "SOAR",
    "AI security",
    "Bangkaew K9",
    "Bangkaew",
  ],
};

function getLang(pathname: string): "th" | "en" {
  return pathname.startsWith("/th") ? "th" : "en";
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? "/";
  const lang = getLang(pathname);

  return (
    <html lang={lang} className="dark" suppressHydrationWarning>
      <body
        className={`${notoSansThai.variable} ${jetbrainsMono.variable} font-sans`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
