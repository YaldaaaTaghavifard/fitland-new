import { Languages } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

export default function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      type="button"
      className="lang-toggle-btn"
      onClick={toggleLanguage}
      aria-label="Toggle language"
      title={language === "fa" ? "Switch to English" : "تغییر به فارسی"}
    >
      <Languages size={17} />
      <span className="lang-label">{language === "fa" ? "EN" : "فا"}</span>
    </button>
  );
}
