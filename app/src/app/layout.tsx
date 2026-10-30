import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AATIS | Sistem Intelijen Trading AI Otonom",
  description: "Sistem riset kuantitatif multi-agen, pengujian strategi, dan pengelolaan risiko berbasis AI.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body className="bg-[#f5f7fb] text-slate-800 min-h-screen antialiased">{children}</body>
    </html>
  );
}
