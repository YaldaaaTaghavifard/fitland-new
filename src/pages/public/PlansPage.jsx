import { useState } from "react";
import { Check, Crown, CreditCard, AlertCircle } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { dataService } from "../../services/dataService";
import MockPaymentModal from "../../components/common/MockPaymentModal";

export default function PlansPage() {
  const { t, formatCurrency, formatNumber, isRtl } = useLanguage();
  const plans = dataService.getPlans();

  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleOpenPayment = (plan) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  return (
    <div className="page-container plans-page">
      <section className="page-hero">
        <span className="eyebrow">{t("navPlans")}</span>
        <h1>پلن‌های عضویت و تعرفه‌های فیت‌لند</h1>
        <p>
          با توجه به هدف و مدت فعالیتت، اشتراک مناسب خود را انتخاب کن؛ با قابلیت پرداخت اقساطی بدون بهره.
        </p>
      </section>

      {successMsg && (
        <div className="notification-toast success">
          <span>{successMsg}</span>
        </div>
      )}

      <section className="plans-grid">
        {plans.map((plan) => (
          <article
            className={`plan-card ${plan.popular ? "popular-plan" : ""}`}
            key={plan.id}
          >
            {plan.popular && (
              <div className="popular-label">
                <Crown size={15} /> {isRtl ? "پیشنهاد ویژه اعضا" : "Most Popular"}
              </div>
            )}

            <h2>{isRtl ? plan.name : plan.nameEn}</h2>
            <p>{isRtl ? plan.description : plan.descriptionEn}</p>

            <div className="plan-price">
              {formatCurrency(plan.price)}
            </div>

            <span className="plan-duration">
              مدت اعتبار: {formatNumber(plan.durationDays)} روز
            </span>

            <ul>
              {plan.features.map((feature, index) => (
                <li key={index}>
                  <Check size={17} />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <div className="plan-cta-actions">
              <button
                type="button"
                className="chic-btn chic-btn-primary w-full"
                onClick={() => handleOpenPayment(plan)}
              >
                <CreditCard size={16} />
                <span>خرید نقدی یا اقساطی</span>
              </button>

              <span className="installment-tag-sub">
                ⚡ پیش‌پرداخت ۳۰٪ + اقساط ۲ تا ۶ ماهه
              </span>
            </div>
          </article>
        ))}
      </section>

      <div className="academic-plans-notice">
        <AlertCircle size={18} className="text-primary shrink-0" />
        <p>
          {t("demoNotice")} شما می‌توانید با کلیک روی هر پلن، فرآیند کامل صدور فاکتور، پرداخت پیش‌پرداخت و تولید جدول سررسید اقساط را تست نمایید.
        </p>
      </div>

      {selectedPlan && (
        <MockPaymentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          item={{
            title: selectedPlan.name,
            titleEn: selectedPlan.nameEn,
            price: selectedPlan.price,
            type: "membership",
          }}
          onSuccess={(inv) => {
            setSuccessMsg(`فاکتور ${inv.id} با موفقیت صادر و پیش‌پرداخت ثبت گردید.`);
            setTimeout(() => setSuccessMsg(""), 6000);
          }}
        />
      )}
    </div>
  );
}
