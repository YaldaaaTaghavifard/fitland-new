import { useState } from "react";
import { Link } from "react-router-dom";
import { Dumbbell, Mail, CheckCircle2, ArrowRight, ArrowLeft } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

export default function ForgotPasswordPage() {
  const { t, isRtl } = useLanguage();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <Dumbbell size={30} />
        </div>

        <h1>{t("forgotPasswordTitle")}</h1>
        <p>{t("forgotPasswordSubtitle")}</p>

        {submitted ? (
          <div className="contact-success-banner text-center py-6">
            <CheckCircle2 size={44} className="text-emerald-500 mx-auto mb-3" />
            <h4>لینک بازیابی ارسال شد</h4>
            <p className="text-sm text-muted my-2">
              لینک شبیه‌سازی‌شده بازیابی رمز عبور به ایمیل {email} فرستاده شد.
            </p>
            <div className="demo-accounts mt-4 text-right">
              <strong>نکته محیط دمو دانشگاهی:</strong>
              <p>رمز عبور تمام حساب‌های آزمایشی (member, trainer, admin) عدد زیر است:</p>
              <strong className="text-primary font-mono text-base">123456</strong>
            </div>

            <Link to="/login" className="chic-btn chic-btn-primary w-full mt-6">
              <span>بازگشت به صفحه ورود</span>
              {isRtl ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <label>{t("emailLabel")}</label>
            <div className="auth-input">
              <Mail size={18} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@fitland.ir"
              />
            </div>

            <button className="primary-button mt-4" type="submit">
              {t("resetPasswordBtn")}
            </button>
          </form>
        )}

        <div className="auth-bottom mt-6">
          <Link to="/login">
            {isRtl ? "← بازگشت به صفحه ورود" : "← Back to Login"}
          </Link>
        </div>
      </div>
    </div>
  );
}
