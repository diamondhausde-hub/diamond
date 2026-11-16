import type { Metadata } from "next";
import type { ReactNode } from "react";
import { cairo, inter } from "@/lib/fonts";
import { withBasePath } from "@/lib/paths";
import "../globals.css";

export const metadata: Metadata = {
  title: "DIAMOND — Cleanliness You Can Trust",
  description:
    "Welcome to DIAMOND. Select your preferred language to enter the website.",
  robots: { index: false, follow: false },
  icons: { icon: withBasePath("/icon.svg") },
};

export default function GatewayRootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" dir="ltr" className={`${inter.variable} ${cairo.variable}`}>
      <body>{children}</body>
    </html>
  );
}
