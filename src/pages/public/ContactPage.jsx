import { useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
} from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

export default function ContactPage() {
  const { t } = useLanguage();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 4000);
  };

  return (
    <div className="page-container contact-page">
      <section className="page-hero">
        <span className="eyebrow">{t("navContact")}</span>
        <h1>ارتباط با تیم فیت‌لند</h1>
        <p>
          پرسش، پیشنهاد همکاری یا نیاز به راهنمایی دارید؟ مشتاقانه پاسخگوی شما هستیم.
        </p>
      </section>

      <div className="contact-grid">
        {/* Contact Info Col */}
        <div className="contact-info-col">
          <div className="contact-card">
            <h3>راه‌های ارتباطی مستقیم</h3>
            <p>
              تیم پشتیبانی فیت‌لند همه‌روزه از ساعت ۸ صبح تا ۱۰ شب آماده پاسخگویی به ورزشکاران، مربیان و مدیران باشگاه‌هاست.
            </p>

            <div className="contact-list">
              <div className="contact-item">
                <div className="contact-icon bg-orange">
                  <Phone size={18} />
                </div>
                <div>
                  <small>تلفن تماس پشتیبانی</small>
                  <strong dir="ltr">۰۲۱-۱۲۳۴۵۶۷۸</strong>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon bg-blue">
                  <Mail size={18} />
                </div>
                <div>
                  <small>ایمیل سازمانی</small>
                  <strong>support@fitland.ir</strong>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon bg-green">
                  <MapPin size={18} />
                </div>
                <div>
                  <small>آدرس مرکز نوآوری</small>
                  <strong>یزد، صفاییه، دانشگاه یزد، مرکز فناوری و کارآفرینی</strong>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon bg-purple">
                  <Clock size={18} />
                </div>
                <div>
                  <small>ساعات پاسخگویی</small>
                  <strong>شنبه تا پنجشنبه: ۸:۰۰ الی ۲۲:۰۰</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Col */}
        <div className="contact-form-col">
          <div className="contact-form-card">
            <h3>ارسال پیام آنلاین</h3>
            <p>فرم زیر را تکمیل کنید تا کارشناسان ما در سریع‌ترین زمان با شما تماس بگیرند.</p>

            {submitted ? (
              <div className="contact-success-banner">
                <CheckCircle2 size={36} className="text-emerald-500" />
                <h4>پیام شما با موفقیت ثبت شد!</h4>
                <p>پاسخ پیام شما به زودی به ایمیلتان ارسال خواهد شد.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-group">
                  <label>نام و نام خانوادگی *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="مانند: سارا رضایی"
                  />
                </div>

                <div className="form-group">
                  <label>آدرس ایمیل *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="example@fitland.ir"
                  />
                </div>

                <div className="form-group">
                  <label>موضوع پیام</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="مانند: درخواست همکاری مربیگری یا پشتیبانی پرداخت"
                  />
                </div>

                <div className="form-group">
                  <label>متن پیام شما *</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="پیام، سوال یا پیشنهاد خود را بنویسید..."
                  />
                </div>

                <button type="submit" className="chic-btn chic-btn-primary w-full">
                  <Send size={16} />
                  <span>ارسال پیام</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
