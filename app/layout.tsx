import type { Metadata } from "next";
import { Geist_Mono, Libre_Baskerville } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const libreBaskerville = Libre_Baskerville({
  variable: "--font-baskerville",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const TITLE = "The Genome Computer Company";
const TWITTER_TITLE =
  "The Genome Computer Company - The fastest, safest way to download and read your genome.";
const DESCRIPTION =
  "The fastest, safest way to download and read your genome. CLIA-, CAP-, and NATA-accredited sequencing. Delivered as a .genome bundle with the readmygenome.md skill; VCF on request.";

export const metadata: Metadata = {
  metadataBase: new URL("https://genome.computer"),
  title: TITLE,
  description: DESCRIPTION,
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  openGraph: {
    type: "website",
    url: "https://genome.computer",
    title: TITLE,
    description: DESCRIPTION,
    siteName: "The Genome Computer Company",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "The Genome Computer Company",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@genomecomputer",
    creator: "@genomecomputer",
    title: TWITTER_TITLE,
    description: DESCRIPTION,
    images: [
      { url: "/og-image.png", alt: "The Genome Computer Company" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${libreBaskerville.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
