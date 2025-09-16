"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type ArabicFont = "scheherazade" | "qalam" | "indopak" | "muhammadi" | "pdms";

export const ARABIC_FONTS = {
  scheherazade: {
    name: "Scheherazade New",
    variable: "--font-scheherazade",
    className: "font-scheherazade",
    source: "Google Fonts",
    cssName: "var(--font-scheherazade)",
    textField: "AyahTextPlain"
  },
  qalam: {
    name: "Al Qalam",
    variable: "--font-qalam",
    className: "font-qalam",
    source: "Local",
    cssName: "Qalam",
    textField: "AyahTextQalam"
  },
  indopak: {
    name: "IndoPak",
    variable: "--font-indopak",
    className: "font-indopak",
    source: "Local",
    cssName: "IndoPak",
    textField: "AyahTextIndoPakForIOS"
  },
  muhammadi: {
    name: "Muhammadi",
    variable: "--font-muhammadi",
    className: "font-muhammadi",
    source: "Local",
    cssName: "Muhammadi",
    textField: "AyahTextMuhammadi"
  },
  pdms: {
    name: "PDMS",
    variable: "--font-pdms",
    className: "font-pdms",
    source: "Local",
    cssName: "PDMS",
    textField: "AyahTextPdms"
  }
} as const;

export interface AyahData {
  AyahTextQalam?: string | null;
  AyahTextMuhammadi?: string | null;
  AyahTextPdms?: string | null;
  AyahTextPlain?: string | null;
  AyahTextIndoPakForIOS?: string | null;
  [key: string]: unknown;
}

interface FontContextType {
  currentFont: ArabicFont;
  setFont: (font: ArabicFont) => void;
  fontClass: string;
  getAyahText: (ayah: AyahData) => string;
}

const FontContext = createContext<FontContextType | undefined>(undefined);

export function FontProvider({ children }: { children: React.ReactNode }) {
  const [currentFont, setCurrentFont] = useState<ArabicFont>("muhammadi");

  useEffect(() => {
    const saved = localStorage.getItem("arabic-font");
    if (saved && Object.keys(ARABIC_FONTS).includes(saved)) {
      setCurrentFont(saved as ArabicFont);
    }
  }, []);

  const setFont = (font: ArabicFont) => {
    setCurrentFont(font);
    localStorage.setItem("arabic-font", font);

    document.documentElement.style.setProperty(
      "--font-arabic-active",
      ARABIC_FONTS[font].cssName
    );
  };

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--font-arabic-active",
      ARABIC_FONTS[currentFont].cssName
    );
  }, [currentFont]);

  const fontClass = ARABIC_FONTS[currentFont].className;

  const getAyahText = (ayah: AyahData): string => {
    const textField = ARABIC_FONTS[currentFont].textField as keyof AyahData;

    // Priority order based on availability
    const text = (ayah[textField] as string | null | undefined) ??
                 ayah.AyahTextMuhammadi ??
                 ayah.AyahTextQalam ??
                 ayah.AyahTextPlain ??
                 "";

    return text;
  };

  return (
    <FontContext.Provider value={{ currentFont, setFont, fontClass, getAyahText }}>
      {children}
    </FontContext.Provider>
  );
}

export function useFont() {
  const context = useContext(FontContext);
  if (context === undefined) {
    throw new Error("useFont must be used within a FontProvider");
  }
  return context;
}