import type { Metadata, Viewport } from "next";
import { Fraunces, Nunito } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Cocina en Calma — menús antiinflamatorios según tu síntoma",
  description:
    "Termina el día más ligera, sin pesar ni contar calorías. Menús antiinflamatorios según tu síntoma y lo que tienes en casa. Pago único de $14.99.",
};

export const viewport: Viewport = { themeColor: "#4F6F2B", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${fraunces.variable} ${nunito.variable} h-full antialiased`}>
      <body className="min-h-dvh flex flex-col">{children}</body>
    </html>
  );
}
