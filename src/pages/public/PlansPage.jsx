
import { Check, Crown } from "lucide-react";
import { Link } from "react-router-dom";

const plans = [
  {
    id: 1,
    name: "ماهانه",
    price: "۱,۲۰۰,۰۰۰",
    duration: "یک ماه",
    description: "مناسب شروع فعالیت ورزشی",
    features: [
      "دسترسی به امکانات پایه",
      "مشاهده کلاس‌های ورزشی",
      "رزرو کلاس",
      "مشاهده سوابق عضویت"
    ]
  },
  {
    id: 2,
    name: "سه ماهه",
    price: "۳,۲۰۰,۰۰۰",
    duration: "سه ماه",
    popular: true,
    description: "انتخاب مناسب برای استمرار",
    features: [
      "تمام امکانات اشتراک ماهانه",
      "برنامه تمرینی اختصاصی",
      "پیگیری روند پیشرفت",
      "گزارش عملکرد"
    ]
  },
  {
    id: 3,
    name: "سالانه",
    price: "۱۰,۸۰۰,۰۰۰",
    duration: "دوازده ماه",
    description: "برای اهداف بلندمدت",
    features: [
      "تمام امکانات اشتراک سه‌ماهه",
      "پیگیری مستمر مربی",
      "گزارش‌های دوره‌ای",
      "اولویت رزرو کلاس"
    ]
  }
];

function PlansPage() {
  return (
    <div className="page-container">
      <section className="page-hero">
        <span className="eyebrow">اشتراک‌های فیت‌لند</span>
        <h1>پلن مناسب خودت را انتخاب کن</h1>
        <p>با توجه به هدف و مدت فعالیتت، اشتراک مناسب را انتخاب کن.</p>
      </section>

      <section className="plans-grid">
        {plans.map((plan) => (
          <article
            className={`plan-card ${plan.popular ? "popular-plan" : ""}`}
            key={plan.id}
          >
            {plan.popular && (
              <div className="popular-label">
                <Crown size={15} /> پیشنهاد ویژه
              </div>
            )}

            <h2>{plan.name}</h2>
            <p>{plan.description}</p>

            <div className="plan-price">
              {plan.price}
              <small> تومان</small>
            </div>

            <span className="plan-duration">{plan.duration}</span>

            <ul>
              {plan.features.map((feature, index) => (
                <li key={index}>
                  <Check size={17} />
                  {feature}
                </li>
              ))}
            </ul>

            <Link to="/register" className="primary-button">
              انتخاب اشتراک
            </Link>
          </article>
        ))}
      </section>

      <p className="demo-notice">
        تعرفه‌های نمایش‌داده‌شده نمونه و آزمایشی هستند و برای نسخه نمایشی پروژه
        در نظر گرفته شده‌اند.
      </p>
    </div>
  );
}

export default PlansPage;
