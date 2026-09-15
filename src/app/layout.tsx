import type { Metadata } from "next";
import { Bebas_Neue, Space_Grotesk } from "next/font/google";
import "./globals.css";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Adventures GI | Expediciones de Alpinismo en Mexico",
    template: "%s | Adventures GI",
  },
  description:
    "Expediciones de alpinismo y montanismo en Mexico y el mundo. Malinche, Nevado de Toluca, Iztaccihuatl, Pico de Orizaba, Ecuador, Peru y mas.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://adventuresgi.com"
  ),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      suppressHydrationWarning
      className={`${bebasNeue.variable} ${spaceGrotesk.variable}`}
    >
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
