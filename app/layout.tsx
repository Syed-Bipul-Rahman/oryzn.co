import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://orizn-store.vercel.app"),
  title: {
    default: "Orizn - Fresh Groceries Delivered to Your Door",
    template: "%s | Orizn Grocery Store",
  },
  description:
    "Shop fresh fruits, vegetables, dairy, and groceries online at Orizn. Get quality organic produce delivered fast with great deals and discounts.",
  keywords: [
    "online grocery store",
    "fresh vegetables",
    "organic fruits",
    "grocery delivery",
    "buy groceries online",
    "fresh produce",
    "dairy products",
    "frozen food",
    "Orizn store",
  ],
  authors: [{ name: "Orizn Store" }],
  creator: "Orizn",
  publisher: "Orizn",
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
    url: "https://orizn-store.vercel.app",
    siteName: "Orizn Grocery Store",
    title: "Orizn - Fresh Groceries Delivered to Your Door",
    description:
      "Shop fresh fruits, vegetables, dairy, and groceries online at Orizn. Quality organic produce delivered fast.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Orizn Grocery Store - Fresh Groceries Online",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Orizn - Fresh Groceries Delivered to Your Door",
    description:
      "Shop fresh fruits, vegetables, dairy, and groceries online at Orizn.",
    images: ["/og-image.png"],
  },
  verification: {
    google: "your-google-verification-code",
  },
  alternates: {
    canonical: "https://orizn-store.vercel.app",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        {/* Google Material Icons */}
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined"
          rel="stylesheet"
        />
        {/* Font Awesome */}
        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
          rel="stylesheet"
          crossOrigin="anonymous"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "GroceryStore",
              name: "Orizn",
              description: "Fresh groceries delivered to your door",
              url: "https://orizn-store.vercel.app",
              telephone: "+9888-256-666",
              address: {
                "@type": "PostalAddress",
                streetAddress: "23/A Mark Street Road",
                addressLocality: "New York City",
                addressCountry: "US",
              },
              openingHoursSpecification: {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: [
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday",
                ],
                opens: "00:00",
                closes: "23:59",
              },
              sameAs: [
                "https://facebook.com/orizn",
                "https://instagram.com/orizn",
                "https://twitter.com/orizn",
              ],
            }),
          }}
        />
      </head>
      <body className="bg-background-light dark:bg-background-dark text-gray-800 dark:text-gray-200 transition-colors duration-200">
        {children}
      </body>
    </html>
  );
}
