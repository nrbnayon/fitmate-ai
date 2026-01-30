// app\layout.tsx
import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from "sonner";
import StoreProvider from "@/redux/StoreProvider";
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ),
  title: {
    default: "FitMate AI - AI Powered Xandra Platform",
    template: "%s | FitMate AI",
  },
  description:
    "FitMate AI - AI Powered Xandra Platform for managing your Match Fever Lipstick journey. Streamline your workflow with our intuitive admin panel.",
  keywords: [
    "FitMate AI",
    "Xandra Platform",
    "Management System",
    "Admin Panel",
    "User Management",
    "Vehicle Management",
    "Driver Management",
    "Route Management",
    "Admin Dashboard",
    "Track Parcel",
    "Customer Dashboard",
    "Seller Dashboard",
    "Super Admin Dashboard",
    "coverage",
    "privacy policy",
    "terms and conditions",
    "about us",
    "contact us",
    "faq",
    "blog",
    "help center",
    "support",
    "career",
    ""
  ],
  // PWA Configuration
  manifest: "/manifest.json",
  authors: [{ name: "Nayon" }],
  creator: "Nayon",
  publisher: "Nayon",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "FitMate AI",
    title: "FitMate AI - AI Powered Xandra Platform",
    description:
      "FitMate AI - AI Powered Xandra Platform for managing your Match Fever Lipstick.",
    images: [
      {
        url: "/icons/logo.png",
        width: 1200,
        height: 630,
        alt: "FitMate AI Dashboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FitMate AI - AI Powered Xandra Platform",
    description:
      "FitMate AI - AI Powered Xandra Platform for managing your Match Fever Lipstick.",
    images: ["/icons/logo.png"],
    creator: "@nrbnayon",
  },
  alternates: {
    canonical: "/",
  },
  category: "Software",
  classification: "Dashboard Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5"
        />
        <meta name="theme-color" content="#F3A6BE" />
        <link rel="icon" href="/favicon-96x96.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "FitMate AI",
              applicationCategory: "Dashboard Management System",
              operatingSystem: "Web",
              description:
                "FitMate AI - AI Powered Xandra Platform for managing your Match Fever Lipstick journey.",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "5",
                ratingCount: "1",
              },
            }),
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${geistMono.variable} antialiased bg-background font-sans`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
          forcedTheme="light"
        >
          <StoreProvider>
              {children}
              <Toaster richColors position="top-center" />
          </StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
