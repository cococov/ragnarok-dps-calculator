import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Calculadora DPS - Ragnarok Online",
  description: "Calcula el DPS de skills de Ragnarok Online con presets y parámetros personalizados.",
  icons: {
    icon: "/icon.svg",
  },
  openGraph: {
    title: "Calculadora DPS - Ragnarok Online",
    description: "Calcula el DPS de skills de Ragnarok Online con presets y parámetros personalizados.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "ROLA Replays - Ragnarok Online LATAM replay analyzer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Calculadora DPS - Ragnarok Online",
    description: "Calcula el DPS de skills de Ragnarok Online con presets y parámetros personalizados.",
    images: ["/twitter-image"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
