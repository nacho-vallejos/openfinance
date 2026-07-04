import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/AppShell";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "OpenFinance+ | Finanzas abiertas para Santa Fe",
  description:
    "MVP fintech para comercios, profesionales y pymes santafesinas. Consolida cuentas, wallets, datos fiscales y ofertas de credito en pesos argentinos.",
  keywords: ["Fintech", "Santa Fe", "Open Finance", "ARCA", "Credito Pyme", "Pesos Argentinos"],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} h-full`} suppressHydrationWarning>
      <body className="h-full bg-slate-50 text-slate-800 antialiased selection:bg-emerald-100 selection:text-emerald-800 dark:bg-slate-950 dark:text-slate-100">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
