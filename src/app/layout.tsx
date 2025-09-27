import "~/styles/globals.css";

import { type Metadata } from "next";
import { Inter } from "next/font/google";
import { Scheherazade_New } from "next/font/google";
import { Noto_Nastaliq_Urdu } from "next/font/google";
import { Gulzar } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import { AuthProvider } from "~/providers/auth-provider";
import { ToastProvider } from "~/contexts/toast-context";
import { FontProvider } from "~/contexts/font-context";
import { FontPreloader } from "~/components/font-preloader";
import { Header } from "~/components/layout/header";
import { Footer } from "~/components/layout/footer";
import { ToastContainer } from "~/components/ui/toast";

export const metadata: Metadata = {
  title: "IslamOne Research",
  description: "Collaborative platform for reviewing and verifying Quran translations with precision",
  icons: [
    { rel: "icon", url: "/islamone-logo.png" },
    { rel: "apple-touch-icon", url: "/islamone-logo.png" },
    { rel: "shortcut icon", url: "/islamone-logo.png" }
  ],
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

const notoNastaliqUrdu = Noto_Nastaliq_Urdu({
  subsets: ["arabic", "latin"],
  variable: "--font-noto-nastaliq-urdu",
  weight: ["400", "500", "600", "700"],
});

const gulzar = Gulzar({
  subsets: ["arabic", "latin"],
  variable: "--font-gulzar",
  weight: ["400"],
});


export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${scheherazadeNew.variable} ${notoNastaliqUrdu.variable} ${gulzar.variable}`}>
      <body className="bg-neutral-100 min-h-screen flex flex-col">
        <TRPCReactProvider>
          <ToastProvider>
            <AuthProvider>
              <FontProvider>
                <FontPreloader />
                <Header />
                <main className="flex-1">
                  {children}
                </main>
                <Footer />
                <ToastContainer />
              </FontProvider>
            </AuthProvider>
          </ToastProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
