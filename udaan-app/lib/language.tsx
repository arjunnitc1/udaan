"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Lang = "en" | "hi" | "bn" | "ml";

export const LANG_NAMES: Record<Lang, string> = {
  en: "English",
  hi: "हिन्दी",
  bn: "বাংলা",
  ml: "മലയാളം",
};

export const LANG_CODES: Record<Lang, string> = {
  en: "en-IN",
  hi: "hi-IN",
  bn: "bn-IN",
  ml: "ml-IN",
};

type LangContextType = {
  lang: Lang;
  setLang: (l: Lang) => void;
  langCode: string;
};

const LangContext = createContext<LangContextType | null>(null);
const STORAGE_KEY = "udaan_language";

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Lang | null;
    if (stored && ["en", "hi", "bn", "ml"].includes(stored)) {
      setLangState(stored);
    }
    setMounted(true);
  }, []);

  function setLang(l: Lang) {
    setLangState(l);
    localStorage.setItem(STORAGE_KEY, l);
  }

  if (!mounted) return null;

  return (
    <LangContext.Provider value={{ lang, setLang, langCode: LANG_CODES[lang] }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used within LangProvider");
  return ctx;
}

// Common UI translations for all languages
export const COMMON_UI: Record<Lang, {
  dashboard: string;
  coach: string;
  finance: string;
  goals: string;
  piggyBank: string;
  community: string;
  signOut: string;
  back: string;
  language: string;
}> = {
  en: {
    dashboard: "Dashboard",
    coach: "My Coach",
    finance: "Finance",
    goals: "Goals",
    piggyBank: "Piggy Bank",
    community: "Community",
    signOut: "Sign out",
    back: "Back",
    language: "Language",
  },
  hi: {
    dashboard: "डैशबोर्ड",
    coach: "मेरी कोच",
    finance: "फाइनेंस",
    goals: "लक्ष्य",
    piggyBank: "गुल्लक",
    community: "समुदाय",
    signOut: "साइन आउट",
    back: "वापस",
    language: "भाषा",
  },
  bn: {
    dashboard: "ড্যাশবোর্ড",
    coach: "আমার কোচ",
    finance: "ফাইনান্স",
    goals: "লক্ষ্য",
    piggyBank: "পিগি ব্যাংক",
    community: "কমিউনিটি",
    signOut: "সাইন আউট",
    back: "ফিরে যান",
    language: "ভাষা",
  },
  ml: {
    dashboard: "ഡാഷ്‌ബോർഡ്",
    coach: "എന്റെ കോച്ച്",
    finance: "ഫൈനാൻസ്",
    goals: "ലക്ഷ്യങ്ങൾ",
    piggyBank: "പിഗ്ഗി ബാങ്ക്",
    community: "കമ്മ്യൂണിറ്റി",
    signOut: "സൈൻ ഔട്ട്",
    back: "തിരികെ",
    language: "ഭാഷ",
  },
};
