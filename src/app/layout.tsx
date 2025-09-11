import "~/styles/globals.css";

import { type Metadata } from "next";
import { Inter } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import { AuthProvider } from "~/providers/auth-provider";
import { Header } from "~/components/layout/header";
import { Footer } from "~/components/layout/footer";

export const metadata: Metadata = {
  title: "IslamOne Research",
  description: "Comprehensive Islamic research platform with Quran, Hadith, and Islamic literature",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body className="bg-neutral-100 min-h-screen flex flex-col">
        <TRPCReactProvider>
          <AuthProvider>
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </AuthProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
