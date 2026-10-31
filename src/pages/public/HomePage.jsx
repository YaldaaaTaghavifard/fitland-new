import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Activity,
  CalendarDays,
  ChartNoAxesCombined,
  ClipboardList,
  Dumbbell,
  HeartPulse,
  ShieldCheck,
  ShoppingBag,
  Users,
} from "lucide-react";

const features = [
  {
    icon: CalendarDays,
    title: "رزرو آنلاین جلسات",
    description:
      "زمان‌های آزاد مربیان را مشاهده کنید و جلسات تمرینی خود را مدیریت کنید.",
  },
  {
    icon: ClipboardList,
    title: "برنامه تمرینی اختصاصی",
    description:
      "برنامه‌های تمرینی و تغذیه متناسب با اهداف خود را دنبال کنید.",
  },
  {
    icon: ChartNoAxesCombined,
    title: "بررسی روند پیشرفت",
    description:
      "تغییرات اندازه‌گیری‌ها و عملکرد ورزشی خود را در طول زمان بررسی کنید.",
  },
  {
    icon: Users,
    title: "ارتباط با مربیان",
    description:
      "با مربی خود در ارتباط باشید و روند تمریناتتان را پیگیری کنید.",
  },
  {
    icon: ShoppingBag,
    title: "فروشگاه ورزشی",
    description:
      "محصولات و تجهیزات موردنیاز تمرین خود را در یک محیط یکپارچه ببینید.",
  },
  {
    icon: ShieldCheck,
    title: "مدیریت یکپارچه",
    description:
      "اطلاعات عضویت، جلسات، سفارش‌ها و گزارش‌های خود را یکجا مدیریت کنید.",
  },
];

const steps = [
  {
    number: "01",
    title: "ثبت‌نام در فیت‌لند",
    description: "حساب کاربری خود را ایجاد کنید و اطلاعات اولیه را تکمیل کنید.",
  },
  {
    number: "02",
    title: "انتخاب برنامه",
    description: "بر اساس هدف خود، برنامه یا مربی مناسب را انتخاب کنید.",
  },
  {
    number: "03",
    title: "شروع فعالیت",
    description: "تمرینات خود را انجام دهید و پیشرفتتان را ثبت کنید.",
  },
];

function HomePage() {
  return (
    <>
      <section className="hero-section">
        <div className="container hero-grid">
          <div className="hero-content">
            <div className="hero-badge">
              <Activity size={16} />
              <span>همراه هوشمند مسیر سلامتی شما</span>
            </div>

            <h1>
              مسیر تناسب اندام
              <br />
              <span>از اینجا شروع می‌شود!</span>
            </h1>

            <p className="hero-description">
              با فیت‌لند تمرینات، برنامه‌ها، مربیان و روند پیشرفت
              خود را در یک محیط یکپارچه مدیریت کنید.
              برای رسیدن به هدف‌هایتان، یک قدم هوشمندانه بردارید.
            </p>

            <div className="hero-actions">
              <Link to="/register" className="btn btn-primary btn-large">
                همین حالا شروع کن
                <ArrowLeft size={19} />
              </Link>

              <Link to="/about" className="btn btn-outline btn-large">
                بیشتر آشنا شو
              </Link>
            </div>

            <div className="hero-trust">
              <div className="trust-icon">
                <HeartPulse size={20} />
              </div>
              <div>
                <strong>همه‌چیز در یک مکان</strong>
                <span>از عضویت تا بررسی پیشرفت</span>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-image-placeholder">
              <div className="hero-image-icon">
                <Dumbbell size={76} strokeWidth={1.3} />
              </div>

              <div className="floating-card floating-card-top">
                <span className="floating-icon">
                  <ChartNoAxesCombined size={21} />
                </span>
                <div>
                  <strong>پیشرفت مستمر</strong>
                  <small>عملکردت را دنبال کن</small>
                </div>
              </div>

              <div className="floating-card floating-card-bottom">
                <span className="floating-icon">
                  <CalendarDays size={21} />
                </span>
                <div>
                  <strong>رزرو آسان</strong>
                  <small>برنامه‌ریزی جلسات</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="intro-strip">
        <div className="container intro-strip-inner">
          <div>
            <strong>مدیریت هوشمند باشگاه</strong>
            <span>یک تجربه یکپارچه برای اعضا، مربیان و مدیران</span>
          </div>
          <Link to="/about" className="text-link">
            آشنایی با فیت‌لند
            <ArrowLeft size={17} />
          </Link>
        </div>
      </section>

      <section className="section features-section">
        <div className="container">
          <div className="section-heading">
            <span className="section-eyebrow">امکانات فیت‌لند</span>
            <h2>همه امکانات موردنیاز شما</h2>
            <p>
              ابزارهایی برای ساده‌تر کردن مدیریت فعالیت‌های ورزشی
              و ارتباط بهتر میان اعضا و مربیان.
            </p>
          </div>

          <div className="features-grid">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <article className="feature-card" key={feature.title}>
                  <div className="feature-icon">
                    <Icon size={25} />
                  </div>

                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>

                  <span className="feature-arrow">
                    <ArrowLeft size={18} />
                  </span>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section how-section">
        <div className="container">
          <div className="section-heading">
            <span className="section-eyebrow">شروع مسیر</span>
            <h2>چطور از فیت‌لند استفاده کنیم؟</h2>
            <p>در سه قدم ساده، مسیر ورزشی خود را مدیریت کنید.</p>
          </div>

          <div className="steps-grid">
            {steps.map((step) => (
              <article className="step-card" key={step.number}>
                <span className="step-number">{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container cta-content">
          <div>
            <span>آماده شروع هستید؟</span>
            <h2>امروز اولین قدم را بردارید.</h2>
            <p>
              به فیت‌لند بپیوندید و فعالیت‌های ورزشی خود را
              هدفمندتر مدیریت کنید.
            </p>
          </div>

          <Link to="/register" className="btn btn-light btn-large">
            ایجاد حساب کاربری
            <ArrowLeft size={19} />
          </Link>
        </div>
      </section>
    </>
  );
}

export default HomePage;