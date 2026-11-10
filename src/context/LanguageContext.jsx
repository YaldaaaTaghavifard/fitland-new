import { createContext, useContext, useEffect, useState, useMemo } from "react";
import { fa } from "../translations/fa";
import { en } from "../translations/en";

const LanguageContext = createContext(null);

const translations = { fa, en };

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem("fitland_language") || "fa";
  });

  const isRtl = language === "fa";
  const dir = isRtl ? "rtl" : "ltr";

  useEffect(() => {
    document.documentElement.setAttribute("lang", language);
    document.documentElement.setAttribute("dir", dir);
    localStorage.setItem("fitland_language", language);

    // Apply font styling
    if (language === "fa") {
      document.body.style.fontFamily = '"Vazirmatn", Tahoma, sans-serif';
    } else {
      document.body.style.fontFamily = '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    }
  }, [language, dir]);

  const setLanguage = (lang) => {
    if (lang === "fa" || lang === "en") {
      setLanguageState(lang);
    }
  };

  const toggleLanguage = () => {
    setLanguageState((prev) => (prev === "fa" ? "en" : "fa"));
  };

  const t = (key, fallback = "") => {
    const currentDict = translations[language] || translations.fa;
    if (currentDict && currentDict[key] !== undefined) {
      return currentDict[key];
    }
    // Fallback to Persian if missing in English
    if (translations.fa && translations.fa[key] !== undefined) {
      return translations.fa[key];
    }
    return fallback || key;
  };

  const formatNumber = (val) => {
    if (val === undefined || val === null) return "۰";
    const num = Number(val);
    if (isNaN(num)) return String(val);
    if (language === "fa") {
      return new Intl.NumberFormat("fa-IR").format(num);
    }
    return new Intl.NumberFormat("en-US").format(num);
  };

  const formatCurrency = (amount) => {
    const formatted = formatNumber(amount);
    return language === "fa" ? `${formatted} تومان` : `${formatted} TOMAN`;
  };

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      toggleLanguage,
      isRtl,
      dir,
      t,
      formatNumber,
      formatCurrency,
    }),
    [language, isRtl, dir]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
