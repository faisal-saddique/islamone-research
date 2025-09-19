"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type ArabicFont = "scheherazade" | "qalam" | "indopak" | "muhammadi" | "pdms";
export type UrduFont = "noto-nastaliq" | "gulzar";
export type EnglishTranslation = "saheeh" | "yousufAli" | "pickthall" | "maududi";
export type UrduTranslation = "maududi" | "jalandhary" | "junagarhi" | "taqi" | "ahmadRaza" | "tahirulQadri";

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

export const URDU_FONTS = {
  "noto-nastaliq": {
    name: "Noto Nastaliq Urdu",
    variable: "--font-noto-nastaliq-urdu",
    className: "font-noto-nastaliq-urdu",
    source: "Google Fonts",
    cssName: "var(--font-noto-nastaliq-urdu)"
  },
  gulzar: {
    name: "Gulzar",
    variable: "--font-gulzar",
    className: "font-gulzar",
    source: "Google Fonts",
    cssName: "var(--font-gulzar)"
  }
} as const;

export const ENGLISH_TRANSLATIONS = {
  saheeh: {
    name: "Saheeh International",
    description: "Clear and contemporary English translation"
  },
  yousufAli: {
    name: "Yusuf Ali",
    description: "Classic and eloquent translation"
  },
  pickthall: {
    name: "Pickthall",
    description: "Early 20th century translation"
  },
  maududi: {
    name: "Maududi (English)",
    description: "Tafheem-ul-Quran in English"
  }
} as const;

export const URDU_TRANSLATIONS = {
  maududi: {
    name: "مولانا مودودی",
    nameEnglish: "Maulana Maududi",
    description: "تفہیم القرآن - Tafheem-ul-Quran"
  },
  jalandhary: {
    name: "مولانا جالندھری",
    nameEnglish: "Maulana Jalandhri",
    description: "کلاسیکی اردو ترجمہ"
  },
  junagarhi: {
    name: "مولانا جونا گڑھی",
    nameEnglish: "Maulana Junagarhi",
    description: "سادہ اردو ترجمہ"
  },
  taqi: {
    name: "مولانا تقی عثمانی",
    nameEnglish: "Maulana Taqi Usmani",
    description: "آسان اردو ترجمہ"
  },
  ahmadRaza: {
    name: "احمد رضا خان",
    nameEnglish: "Ahmad Raza Khan",
    description: "کنز الایمان"
  },
  tahirulQadri: {
    name: "طاہر القادری",
    nameEnglish: "Tahir-ul-Qadri",
    description: "عرفان القرآن"
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
  currentUrduFont: UrduFont;
  setUrduFont: (font: UrduFont) => void;
  urduFontClass: string;
  currentEnglishTranslation: EnglishTranslation;
  setEnglishTranslation: (translation: EnglishTranslation) => void;
  currentUrduTranslation: UrduTranslation;
  setUrduTranslation: (translation: UrduTranslation) => void;
  showUrduTranslation: boolean;
  setShowUrduTranslation: (show: boolean) => void;
}

const FontContext = createContext<FontContextType | undefined>(undefined);

export function FontProvider({ children }: { children: React.ReactNode }) {
  const [currentFont, setCurrentFont] = useState<ArabicFont>("muhammadi");
  const [currentUrduFont, setCurrentUrduFont] = useState<UrduFont>("noto-nastaliq");
  const [currentEnglishTranslation, setCurrentEnglishTranslation] = useState<EnglishTranslation>("saheeh");
  const [currentUrduTranslation, setCurrentUrduTranslation] = useState<UrduTranslation>("maududi");
  const [showUrduTranslation, setShowUrduTranslation] = useState<boolean>(true);

  useEffect(() => {
    const saved = localStorage.getItem("arabic-font");
    if (saved && Object.keys(ARABIC_FONTS).includes(saved)) {
      setCurrentFont(saved as ArabicFont);
    }

    const savedUrdu = localStorage.getItem("urdu-font");
    if (savedUrdu && Object.keys(URDU_FONTS).includes(savedUrdu)) {
      setCurrentUrduFont(savedUrdu as UrduFont);
    }

    const savedEnglishTranslation = localStorage.getItem("english-translation");
    if (savedEnglishTranslation && Object.keys(ENGLISH_TRANSLATIONS).includes(savedEnglishTranslation)) {
      setCurrentEnglishTranslation(savedEnglishTranslation as EnglishTranslation);
    }

    const savedUrduTranslation = localStorage.getItem("urdu-translation");
    if (savedUrduTranslation && Object.keys(URDU_TRANSLATIONS).includes(savedUrduTranslation)) {
      setCurrentUrduTranslation(savedUrduTranslation as UrduTranslation);
    }

    const savedShowUrdu = localStorage.getItem("show-urdu-translation");
    if (savedShowUrdu !== null) {
      setShowUrduTranslation(savedShowUrdu === "true");
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

  const setUrduFont = (font: UrduFont) => {
    setCurrentUrduFont(font);
    localStorage.setItem("urdu-font", font);

    document.documentElement.style.setProperty(
      "--font-urdu-active",
      URDU_FONTS[font].cssName
    );
  };

  const setEnglishTranslation = (translation: EnglishTranslation) => {
    setCurrentEnglishTranslation(translation);
    localStorage.setItem("english-translation", translation);
  };

  const setUrduTranslation = (translation: UrduTranslation) => {
    setCurrentUrduTranslation(translation);
    localStorage.setItem("urdu-translation", translation);
  };

  const setShowUrduTranslationPref = (show: boolean) => {
    setShowUrduTranslation(show);
    localStorage.setItem("show-urdu-translation", show.toString());
  };

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--font-arabic-active",
      ARABIC_FONTS[currentFont].cssName
    );
  }, [currentFont]);

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--font-urdu-active",
      URDU_FONTS[currentUrduFont].cssName
    );
  }, [currentUrduFont]);

  const fontClass = ARABIC_FONTS[currentFont].className;
  const urduFontClass = URDU_FONTS[currentUrduFont].className;

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
    <FontContext.Provider value={{
      currentFont,
      setFont,
      fontClass,
      getAyahText,
      currentUrduFont,
      setUrduFont,
      urduFontClass,
      currentEnglishTranslation,
      setEnglishTranslation,
      currentUrduTranslation,
      setUrduTranslation,
      showUrduTranslation,
      setShowUrduTranslation: setShowUrduTranslationPref
    }}>
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