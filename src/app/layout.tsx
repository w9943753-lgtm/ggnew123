import type { Metadata, Viewport } from "next";
import "./globals.css";
import ClientProviders from "@/components/shared/client-providers";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import MobileNav from "@/components/layout/mobile-nav";


export const metadata: Metadata = {
  title: {
    default: "Hafiz Store - Quality Groceries at Best Prices",
    template: "%s | Hafiz Store",
  },
  description: "Pakistan's premium online grocery store. Fresh vegetables, fruits, meat, dairy, snacks & household essentials delivered to your doorstep.",
  keywords: ["grocery", "online grocery", "pakistan", "fresh", "delivery", "hafiz store", "supermarket"],
  openGraph: {
    type: "website",
    locale: "en_PK",
    siteName: "Hafiz Store",
    title: "Hafiz Store - Quality Groceries at Best Prices",
    description: "Pakistan's premium online grocery store.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hafiz Store - Quality Groceries at Best Prices",
    description: "Pakistan's premium online grocery store.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#16A34A",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col bg-surface">
        <ClientProviders>
          <Navbar />
          <main className="flex-1 pb-16 lg:pb-0">{children}</main>
          <Footer />
          <MobileNav />
        </ClientProviders>
      </body>
    </html>
  );
}
