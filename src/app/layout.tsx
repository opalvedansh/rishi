import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SmoothScrollProvider from "@/providers/SmoothScrollProvider";
import { ShopProvider } from "@/context/ShopContext";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Doree - Fashion Store",
  description: "Doree - Open Doors To A World Of Fashion",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${playfair.variable} antialiased`}
      >
        <SmoothScrollProvider>
          <ShopProvider>
            <AnnouncementBar />
            <Header />
            <main>{children}</main>
            <Footer /> {/* Added Footer component */}
          </ShopProvider>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
