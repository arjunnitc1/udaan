import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Udaan — Your skill. Your business. Your flight.",
  description:
    "An AI business coach that turns a woman's existing skill into her first independent income — in her language, on her phone, judgment-free.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
