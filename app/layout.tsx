import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

const resolvedAppUrl = process.env.APP_URL ?? "https://dps.rolatools.com";
const absoluteOgImage = resolvedAppUrl
  ? new URL("/opengraph-image", resolvedAppUrl).toString()
  : "/opengraph-image";
const absoluteTwitterImage = resolvedAppUrl
  ? new URL("/twitter-image", resolvedAppUrl).toString()
  : "/twitter-image";

export const metadata: Metadata = {
  metadataBase: resolvedAppUrl ? new URL(resolvedAppUrl) : undefined,
  title: "Calculadora DPS - Ragnarok Online",
  description: "Calcula el DPS de skills de Ragnarok Online con presets y parámetros personalizados.",
  icons: {
    icon: "/icon.svg",
  },
  openGraph: {
    title: "Calculadora DPS - Ragnarok Online",
    description: "Calcula el DPS de skills de Ragnarok Online con presets y parámetros personalizados.",
    url: resolvedAppUrl ?? undefined,
    images: [
      {
        url: absoluteOgImage,
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
    images: [absoluteTwitterImage],
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
