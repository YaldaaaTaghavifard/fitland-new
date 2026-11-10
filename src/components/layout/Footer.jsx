import { Dumbbell, Phone, Mail, MapPin, Briefcase, GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";

export default function Footer() {
  const { t, isRtl } = useLanguage();

  return (
    <footer className="footer">
      <div className="container footer-content">
        <div className="footer-brand">
          <div className="footer-logo">
            <span className="footer-logo-icon">
              <Dumbbell size={22} />
            </span>
            <span className="footer-brand-name">
              Fit<strong>Land</strong>
            </span>
          </div>

          <p>
            {t("brandSubtitle")}. {t("tagline")}.
          </p>

          <div className="footer-academic-badge">
            <GraduationCap size={16} />
            <span>{isRtl ? "پروژه دانشگاهی مهندسی نرم‌افزار — دانشگاه یزد" : "Academic Software Engineering Project — Yazd University"}</span>
          </div>
        </div>

        <div className="footer-links">
          <h3>{isRtl ? "بخش‌های عمومی" : "Public Pages"}</h3>
          <Link to="/">{t("navHome")}</Link>
          <Link to="/about">{t("navAbout")}</Link>
          <Link to="/plans">{t("navPlans")}</Link>
          <Link to="/trainers">{t("navTrainers")}</Link>
          <Link to="/classes">{t("navClasses")}</Link>
          <Link to="/store">{t("navStore")}</Link>
        </div>

        <div className="footer-links">
          <h3>{isRtl ? "پرونده و راهنما" : "Case & Support"}</h3>
          <Link to="/business-case" className="footer-highlight-link">
            <Briefcase size={14} />
            <strong>{t("navBusinessCase")}</strong>
          </Link>
          <Link to="/faq">{t("navFaq")}</Link>
          <Link to="/contact">{t("navContact")}</Link>
          <Link to="/login">{t("navLogin")}</Link>
          <Link to="/register">{t("navRegister")}</Link>
        </div>

        <div className="footer-contact">
          <h3>{t("navContact")}</h3>
          <p><Phone size={17} /> <span dir="ltr">۰۲۱-۱۲۳۴۵۶۷۸</span></p>
          <p><Mail size={17} /> <span>support@fitland.ir</span></p>
          <p><MapPin size={17} /> <span>{isRtl ? "یزد، دانشگاه یزد، مرکز فناوری" : "Yazd, Yazd University, Innovation Hub"}</span></p>
        </div>
      </div>

      <div className="container footer-bottom">
        <p>
          {isRtl
            ? "تمامی حقوق این پروژه متعلق به فیت‌لند (دانشگاه یزد) است. نسخه آزمایشی و آموزشی."
            : "All rights reserved for FitLand (Yazd University). Educational & Demo Project."}
        </p>
        <span>© 2026 FitLand Academic Project</span>
      </div>
    </footer>
  );
}