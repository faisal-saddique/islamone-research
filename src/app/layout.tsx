import "~/styles/globals.css";

import { type Metadata } from "next";
import { Inter } from "next/font/google";
import { Scheherazade_New } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import { AuthProvider } from "~/providers/auth-provider";
import { ToastProvider } from "~/contexts/toast-context";
import { Header } from "~/components/layout/header";
import { Footer } from "~/components/layout/footer";
import { ToastContainer } from "~/components/ui/toast";

export const metadata: Metadata = {
  title: "IslamOne Research",
  description: "Comprehensive Islamic research platform with Quran, Hadith, and Islamic literature",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const scheherazadeNew = Scheherazade_New({
  subsets: ["arabic", "latin"],
  variable: "--font-scheherazade",
  weight: ["400", "500", "600", "700"],
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${scheherazadeNew.variable}`}>
      <body className="bg-neutral-100 min-h-screen flex flex-col">
        <TRPCReactProvider>
          <ToastProvider>
            <AuthProvider>
              <Header />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
              <ToastContainer />
            </AuthProvider>
          </ToastProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
