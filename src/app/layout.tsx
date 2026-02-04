import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SmoothScrollProvider from "@/providers/SmoothScrollProvider";
import { ShopProvider } from "@/context/ShopContext";
import { AuthProvider } from "@/context/AuthContext";
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
  title: "Doree - It has a reason to buy",
  description: "Doree - Open Doors To A World Of Fashion",
  icons: {
    icon: "/favicon.ico?v=2",
    apple: "/favicon.ico?v=2",
  },
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
          <AuthProvider>
            <ShopProvider>
              <AnnouncementBar />
              <Header />
              <main>{children}</main>
              <Footer />
            </ShopProvider>
          </AuthProvider>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
