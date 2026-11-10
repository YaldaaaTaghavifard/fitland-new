import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  HelpCircle,
  Search,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

const faqData = [
  {
    category: "پرداخت و اقساط",
    items: [
      {
        q: "پرداخت اقساطی فیت‌لند چگونه کار می‌کند و آیا نیاز به چک یا ضامن دارد؟",
        a: "سیستم اقساطی فیت‌لند بدون نیاز به چک صیادی یا ضامن طراحی شده است. شما در زمان ثبت‌نام تنها ۳۰ درصد پیش‌پرداخت را واریز کرده و مابقی را در ۲ تا ۶ قسط ماهانه بدون بهره پرداخت می‌کنید.",
      },
      {
        q: "آیا پرداخت‌های این سایت آزمایشی (Demo) هستند؟",
        a: "بله، در این نسخه آموزشی و دانشگاهی، تمام درگاه‌های پرداخت کاملاً آزمایشی (Mock/Demo) هستند و هیچ پولی از کارت واقعی کسر نمی‌گردد.",
      },
      {
        q: "در صورت لغو اشتراک، وضعیت اقساط باقیمانده چه خواهد شد؟",
        a: "در صورت انصراف در ۷ روز اول دوره، کل مبلغ پیش‌پرداخت بازگردانده شده و اقساط آتی باطل می‌شوند.",
      },
    ],
  },
  {
    category: "تمرین و مربیگری",
    items: [
      {
        q: "برنامه تمرینی اختصاصی من چه زمانی آماده می‌شود؟",
        a: "پس از ثبت‌نام و تکمیل پرسشنامه تندرستی، مربی منتخب شما حداکثر ظرف مدت ۲۴ تا ۴۸ ساعت برنامه اختصاصی تمرین و جدول تغذیه شما را در پنل بارگذاری می‌کند.",
      },
      {
        q: "اگر در یک ساعت دو جلسه رزرو کنم، سیستم چه برخوردی دارد؟",
        a: "فیت‌لند مجهز به موتور هوشمند Collision Prevention است که مانع از تداخل زمانی می‌شود و به شما اجازه رزرو دو سانس همزمان را نمی‌دهد.",
      },
      {
        q: "آیا می‌توانم مربی خود را در طول دوره تغییر دهم؟",
        a: "بله، در پایان هر ماه یا از طریق ارسال تیکت به مدیریت می‌توانید مربی اختصاصی خود را بر اساس تخصص موردنظر تعویض نمایید.",
      },
    ],
  },
  {
    category: "فروشگاه و ارسال",
    items: [
      {
        q: "آیا محصولات فروشگاه دارای گارانتی اصالت هستند؟",
        a: "کلیه تجهیزات و مکمل‌های ورزشی دارای نشان استاندارد، تاییدیه اصالت کالا و ۷ روز ضمانت بازگشت بی‌قیدوشرط می‌باشند.",
      },
      {
        q: "هزینه و زمان ارسال کالا چگونه است؟",
        a: "برای سفارش‌های بالای ۵۰۰ هزار تومان ارسال کاملاً رایگان است. سفارش‌ها در شهر یزد ظرف ۲ ساعت و در سایر شهرها ظرف ۲ الی ۳ روز کاری تحویل می‌گردند.",
      },
    ],
  },
];

export default function FaqPage() {
  const { t, isRtl } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [openItems, setOpenItems] = useState({ "0-0": true });

  const toggleItem = (key) => {
    setOpenItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const filteredFaq = useMemo(() => {
    if (!searchTerm.trim()) return faqData;
    const term = searchTerm.toLowerCase();

    return faqData
      .map((cat) => ({
        ...cat,
        items: cat.items.filter(
          (it) =>
            it.q.toLowerCase().includes(term) ||
            it.a.toLowerCase().includes(term)
        ),
      }))
      .filter((cat) => cat.items.length > 0);
  }, [searchTerm]);

  return (
    <div className="page-container faq-page">
      <section className="page-hero">
        <span className="eyebrow">{t("navFaq")}</span>
        <h1>سؤالات متداول ورزشکاران و مربیان</h1>
        <p>پاسخ به متداول‌ترین پرسش‌ها درباره عضویت، پرداخت اقساطی، رزرو و امکانات فیت‌لند.</p>

        <div className="faq-search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="جست‌وجوی سؤال یا موضوع..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </section>

      <div className="faq-content-wrapper">
        {filteredFaq.length === 0 ? (
          <div className="text-center py-12">
            <HelpCircle size={40} className="mx-auto text-muted mb-2" />
            <p>سؤالی مطابق با جست‌وجوی شما پیدا نشد.</p>
          </div>
        ) : (
          filteredFaq.map((cat, catIdx) => (
            <div className="faq-category-block" key={catIdx}>
              <h3 className="faq-cat-title">{cat.category}</h3>

              <div className="faq-items-list">
                {cat.items.map((item, itemIdx) => {
                  const itemKey = `${catIdx}-${itemIdx}`;
                  const isOpen = !!openItems[itemKey];

                  return (
                    <div className={`faq-item-card ${isOpen ? "open" : ""}`} key={itemIdx}>
                      <button
                        type="button"
                        className="faq-question-btn"
                        onClick={() => toggleItem(itemKey)}
                      >
                        <span className="faq-q-text">{item.q}</span>
                        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </button>

                      {isOpen && (
                        <div className="faq-answer-body">
                          <p>{item.a}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}

        {/* Contact CTA */}
        <div className="faq-bottom-cta">
          <MessageCircle size={32} className="text-primary" />
          <div>
            <h4>سؤال دیگری دارید که در اینجا نبود؟</h4>
            <p>تیم پشتیبانی ما ۲۴ ساعته آماده پاسخگویی به شماست.</p>
          </div>
          <Link to="/contact" className="chic-btn chic-btn-primary">
            <span>ارتباط با پشتیبانی</span>
            {isRtl ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
          </Link>
        </div>
      </div>
    </div>
  );
}
