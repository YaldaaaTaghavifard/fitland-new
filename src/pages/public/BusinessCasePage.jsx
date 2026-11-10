import { useState, useMemo } from "react";
import {
  Briefcase,
  Layers,
  TrendingUp,
  Users,
  Target,
  ShieldCheck,
  MapPin,
  Sparkles,
  Calculator,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Plus,
  Trash2,
  GraduationCap,
} from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { dataService } from "../../services/dataService";
import ScenarioRunnerModal from "../../components/common/ScenarioRunnerModal";

export default function BusinessCasePage() {
  const { t, formatCurrency, formatNumber } = useLanguage();
  const [activeTab, setActiveTab] = useState("discovery"); // discovery, value, bmc, competitors, personas, marketing, economics, security, roadmap
  const [isScenarioModalOpen, setIsScenarioModalOpen] = useState(false);

  // Editable BMC state
  const [bmc, setBmc] = useState(() => dataService.getBMC());
  const [editingBlock, setEditingBlock] = useState(null);
  const [newItemText, setNewItemText] = useState("");

  // Interactive Economics Calculator State
  const [calcActiveUsers, setCalcActiveUsers] = useState(1200);
  const [calcMonthlySubPrice, setCalcMonthlySubPrice] = useState(1200000);
  const [calcChurnRate, setCalcChurnRate] = useState(4.0); // %
  const [calcCac, setCalcCac] = useState(450000); // تومان، فرض آزمایشی
  const [calcGrossMargin, setCalcGrossMargin] = useState(40); // درصد، فرض آزمایشی

  // تمام ورودی‌های این ماشین‌حساب فرض آزمایشی هستند و داده بازار محسوب نمی‌شوند.
  const economics = useMemo(() => {
    const assumedCommissionPerUser = 75000;
    const arpu = calcMonthlySubPrice + assumedCommissionPerUser;
    const churnDecimal = Math.max(0.005, calcChurnRate / 100);
    const averageLifespanMonths = 1 / churnDecimal;
    const revenueLtv = arpu * averageLifespanMonths;
    const grossProfitLtv = revenueLtv * (calcGrossMargin / 100);
    const ltvCacRatio = grossProfitLtv / Math.max(1, calcCac);
    const monthlyGrossRevenue = calcActiveUsers * arpu;
    const monthlyGrossProfit = monthlyGrossRevenue * (calcGrossMargin / 100);
    const monthlyOperatingContribution = monthlyGrossProfit - (calcActiveUsers * calcCac / averageLifespanMonths);
    const paybackPeriodMonths = calcCac / Math.max(1, arpu * calcGrossMargin / 100);
    return {
      arpu: Math.round(arpu),
      averageLifespanMonths: averageLifespanMonths.toFixed(1),
      revenueLtv: Math.round(revenueLtv),
      grossProfitLtv: Math.round(grossProfitLtv),
      ltvCacRatio: ltvCacRatio.toFixed(2),
      monthlyGrossRevenue: Math.round(monthlyGrossRevenue),
      annualRunRate: Math.round(monthlyGrossRevenue * 12),
      monthlyGrossProfit: Math.round(monthlyGrossProfit),
      monthlyOperatingContribution: Math.round(monthlyOperatingContribution),
      paybackPeriodMonths: paybackPeriodMonths.toFixed(1),
      healthyRatio: ltvCacRatio >= 3,
    };
  }, [calcActiveUsers, calcMonthlySubPrice, calcChurnRate, calcCac, calcGrossMargin]);

  const handleAddBmcItem = (blockKey) => {
    if (!newItemText.trim()) return;
    const updated = {
      ...bmc,
      [blockKey]: [...(bmc[blockKey] || []), newItemText.trim()],
    };
    setBmc(updated);
    dataService.updateBMC(updated);
    setNewItemText("");
  };

  const handleRemoveBmcItem = (blockKey, index) => {
    const updated = {
      ...bmc,
      [blockKey]: bmc[blockKey].filter((_, i) => i !== index),
    };
    setBmc(updated);
    dataService.updateBMC(updated);
  };

  const handleResetBMC = () => {
    const defaultData = dataService.resetBMC();
    setBmc(defaultData);
  };

  return (
    <div className="business-case-page">
      {/* Top Academic Banner */}
      <section className="academic-hero-header">
        <div className="container">
          <div className="academic-badge-strip">
            <span className="academic-tag">
              <Briefcase size={14} />
              <span>{t("academicHeader")}</span>
            </span>
            <span className="academic-divider">•</span>
            <span className="academic-student">
              <GraduationCap size={15} />
              <span>{t("academicAuthor")}</span>
            </span>
          </div>

          <h1 className="academic-title">{t("businessCaseTitle")}</h1>
          <p className="academic-subtitle">{t("businessCaseSubtitle")}</p>

          <div className="academic-cta-row">
            <button
              type="button"
              className="chic-btn chic-btn-primary"
              onClick={() => setIsScenarioModalOpen(true)}
            >
              <Play size={16} />
              <span>اجرای زنده ۱۰+ سناریوی ارزیابی (Live Scenarios)</span>
            </button>
            <a href="#bmc-section" className="chic-btn chic-btn-ghost">
              <Layers size={16} />
              <span>مشاهده و ویرایش بوم مدل کسب‌وکار (BMC)</span>
            </a>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <nav className="case-tabs-nav-bar" aria-label="بخش‌های پرونده کسب‌وکار">
        <div className="container">
          <div className="tabs-scroll-wrapper">
            {[
              { id: "discovery", num: "۱", label: "کشف مسئله و بلوغ", icon: Target },
              { id: "value", num: "۲", label: "ارزش‌آفرینی چندجانبه", icon: Sparkles },
              { id: "bmc", num: "۳", label: "بوم مدل کسب‌وکار (BMC)", icon: Layers },
              { id: "competitors", num: "۴", label: "تحلیل رقبا و تمایز", icon: TrendingUp },
              { id: "personas", num: "۵", label: "پرسونا و سفر مشتری", icon: Users },
              { id: "marketing", num: "۶", label: "بازاریابی و قیف AIDA", icon: Briefcase },
              { id: "economics", num: "۷", label: "مدل درآمد و ماشین‌حساب", icon: Calculator },
              { id: "security", num: "۸", label: "امنیت و حریم خصوصی", icon: ShieldCheck },
              { id: "roadmap", num: "۹", label: "نقشه راه توسعه (Roadmap)", icon: MapPin },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  className={`case-tab-btn ${activeTab === tab.id ? "active" : ""}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <span className="tab-num">{tab.num}</span>
                  <Icon size={15} className="tab-icon" />
                  <span className="tab-text">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      <div className="container case-content-container">
        {/* =======================================================
            TAB 1: PROBLEM DISCOVERY & IDEA MATURITY
        ======================================================= */}
        {activeTab === "discovery" && (
          <div className="case-tab-content">
            <div className="case-section-intro">
              <span className="case-eyebrow">بخش اول</span>
              <h2>کشف مسئله، اصطکاک‌های بازار و اعتبارسنجی بلوغ ایده</h2>
              <p>
                تحلیل سیستماتیک چالش‌های واقعی ورزشکاران، مربیان و سالن‌های ورزشی بر مبنای متدولوژی اعتبارسنجی ایده و هشت پرسش بنیادین کارآفرینی.
              </p>
            </div>

            <div className="case-cards-grid">
              <div className="case-card">
                <h3>صورت‌بندی دقیق مسئله (Problem Formulation)</h3>
                <p>
                  مسئله‌ای که فیت‌لند برای بررسی انتخاب کرده، پراکندگی احتمالی اطلاعات و فرایندهای تعامل میان عضو، مربی و مدیریت باشگاه است. شدت و فراوانی این مسئله در هر باشگاه باید با مشاهده و مصاحبه اعتبارسنجی شود:
                </p>
                <ul className="bullet-list">
                  <li>
                    <strong>عدم پیوستگی برنامه‌ها:</strong> برنامه‌های تمرینی و غذایی اغلب روی کاغذ یا پیام‌رسان‌های پراکنده (تلگرام/واتساپ) ارسال می‌شوند و پس از مدتی گم شده یا فراموش می‌گردند.
                  </li>
                  <li>
                    <strong>فقدان پایش کمّی:</strong> ورزشکاران قادر به مشاهده روند تغییرات وزن، ابعاد عضلانی و درصد چربی خود به صورت نمودارهای پیوسته نیستند.
                  </li>
                  <li>
                    <strong>ابهام در پرداخت و تمدید:</strong> شرایط پرداخت و وضعیت تمدید ممکن است در کانال‌های جداگانه ثبت شود؛ میزان این مسئله باید در باشگاه هدف بررسی شود.
                  </li>
                  <li>
                    <strong>تداخل‌های زمانی در رزرو:</strong> هماهنگی جلسات خصوصی مربی با تلفن و چت دستی انجام شده و منجر به هم‌پوشانی و نارضایتی می‌گردد.
                  </li>
                </ul>
              </div>

              <div className="case-card">
                <h3>تفکیک فرضیه‌ها از شواهد واقعی (Hypothesis vs Evidence)</h3>
                <div className="table-responsive">
                  <table className="case-table">
                    <thead>
                      <tr>
                        <th>موضوع</th>
                        <th>فرضیه اولیه (Hypothesis)</th>
                        <th>شواهد میدانی و ارزیابی (Evidence)</th>
                        <th>وضعیت</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>پرداخت اقساطی</td>
                        <td>کاربران از پلن اقساطی برای خرید اشتراک باشگاه استقبال می‌کنند.</td>
                        <td>در این پروژه هنوز داده میدانی درباره اثر پرداخت اقساطی جمع‌آوری نشده است؛ این گزاره نیازمند آزمون است.</td>
                        <td><span className="status-badge warning">فرضیه؛ نیازمند اعتبارسنجی</span></td>
                      </tr>
                      <tr>
                        <td>نیاز مربیان</td>
                        <td>مربیان وقت کافی برای ثبت آنلاین برنامه‌ها دارند.</td>
                        <td>فرضیه طراحی: مربیان به ثبت سریع برنامه نیاز دارند؛ زمان قابل‌قبول باید با مشاهده و آزمون کاربر تعیین شود.</td>
                        <td><span className="status-badge warning">مشروط به سادگی UI</span></td>
                      </tr>
                      <tr>
                        <td>رزرو همزمان</td>
                        <td>سیستم رزرو آنلاین مانع تداخل جلسات می‌شود.</td>
                        <td>در نسخه فعلی کنترل تداخل در منطق برنامه پیاده‌سازی شده است؛ صفر بودن خطا در همه شرایط بدون آزمون همزمانی و بک‌اند قابل ادعا نیست.</td>
                        <td><span className="status-badge success">پیاده‌سازی‌شده در نسخه فعلی؛ نیازمند آزمون مرزی</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* 8 Golden Course Questions Evaluation */}
            <div className="case-card full-width mt-6">
              <h3>ارزیابی ایده با هشت پرسش مصوب درس</h3>
              <div className="golden-questions-grid">
                {[
                  { q: "۱. آیا تقاضای بالفعل و نیازی واقعی در بازار کنونی وجود دارد؟", a: "اعضا برای برنامه تمرینی، رزرو کلاس و پیگیری پیشرفت به هماهنگی مستمر با مربی و باشگاه نیاز دارند. فیت‌لند این فرایندها را یکپارچه می‌کند؛ اما اندازه تقاضا هنوز باید با مصاحبه و اجرای آزمایشی سنجیده شود." },
                  { q: "۲. آیا ایده پاسخگوی نیازی واقعی است یا صرفاً فرض ذهنی طراح است؟", a: "پراکندگی اطلاعات، هماهنگی دستی رزرو و نبود پرونده متمرکز، مسئله‌های هدف هستند. قابلیت‌های رزرو، ثبت برنامه و سوابق برای پاسخ به آن‌ها طراحی شده‌اند؛ میزان اثرگذاری هنوز فرضیه قابل‌آزمون است و اثبات میدانی نشده است." },
                  { q: "۳. ایده در کدام طبقه‌بندی قرار می‌گیرد؟", a: "فیت‌لند ایده‌ای ترکیبی است؛ زیرا قابلیت‌های شناخته‌شده مدیریت عضویت، رزرو، برنامه تمرینی، فروشگاه و گزارش‌گیری را در یک پلتفرم برای سه نقش عضو، مربی و مدیر ترکیب می‌کند." },
                  { q: "۴. سقف رشد طبیعی و ظرفیت مقیاس‌پذیری کسب‌وکار کجاست؟", a: "شروع منطقی با یک یا چند باشگاه همکار است. در صورت پذیرش مدل، توسعه به چند باشگاه و شهر و ارائه اشتراک نرم‌افزاری B2B ممکن است. جذب باشگاه، پشتیبانی، امنیت و زیرساخت محدودیت‌های رشد هستند؛ مقیاس‌پذیری هنوز تجاری اثبات نشده است." },
                  { q: "۵. مشتریان حاضرند دقیقاً در ازای کدام ارزش یا خدمت پول پرداخت کنند؟", a: "باشگاه می‌تواند بابت پنل مدیریت اعضا، رزرو و گزارش‌گیری اشتراک نرم‌افزاری بپردازد. عضو نیز ممکن است بابت عضویت، کلاس یا خدمات ویژه هزینه کند. تمایل به پرداخت هر گروه باید جداگانه اعتبارسنجی شود." },
                  { q: "۶. آیا امکان ارزیابی میدانی و دریافت بازخورد وجود دارد؟", a: "بله؛ با مصاحبه نیمه‌ساختاریافته با اعضا، مربیان و مدیران و سپس آزمون نمونه اولیه. زمان انجام رزرو، خطاها، رضایت و تمایل به استفاده مجدد قابل سنجش‌اند. تا پیش از اجرای واقعی، این بخش برنامه اعتبارسنجی است، نه نتیجه تحقیق." },
                  { q: "۷. در صورت بروز مانع در مدل عملیاتی، چه راهکارهایی وجود دارد؟", a: "در صورت استقبال کم باشگاه‌ها، شروع با مربیان مستقل یا یک باشگاه پایلوت؛ در صورت دشواری استفاده مربیان، ساده‌سازی ثبت برنامه؛ در صورت لغو زیاد، فهرست انتظار و یادآوری؛ و در اختلال پرداخت، حفظ وضعیت دمو و پیگیری دستی در محیط آزمایشی." },
                  { q: "۸. گزینه‌ها و روش‌های جاری مخاطبان برای حل این نیاز چیست؟", a: "مراجعه حضوری، تماس با منشی، رزرو تلفنی، پیام‌رسان‌ها، دفتر یا فایل صفحه‌گسترده، اپلیکیشن‌های تمرینی جداگانه و مدیریت دستی پرداخت. این روش‌ها ممکن است بخشی از نیاز را پوشش دهند، اما اطلاعات و فرایندها را پراکنده نگه می‌دارند." },
                                ].map((item, i) => (
                  <div className="question-box" key={i}>
                    <strong>{item.q}</strong>
                    <p>{item.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =======================================================
            TAB 2: VALUE CREATION
        ======================================================= */}
        {activeTab === "value" && (
          <div className="case-tab-content">
            <div className="case-section-intro">
              <span className="case-eyebrow">بخش دوم</span>
              <h2>ارزش‌آفرینی چندجانبه برای ذی‌نفعان اکوسیستم</h2>
              <p>
                تفکیک دقیق ارزش‌های کاربردی، اقتصادی، مبادله‌ای و استراتژیک برای هر یک از بازیگران پلتفرم فیت‌لند.
              </p>
            </div>

            <div className="value-stakeholders-grid">
              <div className="stakeholder-card">
                <div className="card-top-icon bg-orange">
                  <Users size={22} />
                </div>
                <h3>ارزش برای ورزشکار (Member)</h3>
                <ul className="value-list">
                  <li><strong>ارزش کاربردی:</strong> مشاهده شفاف برنامه حرکات، فیلم تمرین، جدول وعده‌های غذایی و نمودار لاغری/حجم.</li>
                  <li><strong>ارزش اقتصادی:</strong> مشاهده وضعیت عضویت، برنامه‌ها، رزروها و سوابق در یک پنل؛ پرداخت اقساطی در نسخه فعلی صرفاً شبیه‌سازی می‌شود.</li>
                  <li><strong>ارزش روانی و انگیزشی:</strong> عضویت در جامعه سالم، دریافت نشان‌های پیشرفت و احساس تعهد به برنامه.</li>
                </ul>
              </div>

              <div className="stakeholder-card">
                <div className="card-top-icon bg-green">
                  <Briefcase size={22} />
                </div>
                <h3>ارزش برای مربی (Trainer)</h3>
                <ul className="value-list">
                  <li><strong>ارزش کاربردی:</strong> مدیریت شاگردان، ثبت برنامه تمرینی و غذایی، مشاهده تقویم و پیگیری رزروها در یک پنل.</li>
                  <li><strong>ارزش اقتصادی:</strong> کاهش پراکندگی اطلاعات و زمان صرف‌شده برای هماهنگی؛ میزان صرفه‌جویی باید در آزمون میدانی سنجیده شود.</li>
                  <li><strong>ارزش استراتژیک:</strong> برندسازی شخصی، سیستم امتیازدهی شفاف، انتخاب مربی برتر ماه و جذب شاگردان جدید.</li>
                </ul>
              </div>

              <div className="stakeholder-card">
                <div className="card-top-icon bg-blue">
                  <ShieldCheck size={22} />
                </div>
                <h3>ارزش برای باشگاه و مدیر (Gym Admin)</h3>
                <ul className="value-list">
                  <li><strong>ارزش مبادله‌ای:</strong> مشاهده فهرست اعضا، وضعیت رزروها، ظرفیت کلاس‌ها و اطلاعات مدیریتی ثبت‌شده در سامانه.</li>
                  <li><strong>ارزش اقتصادی:</strong> کمک به شناسایی اعضای فاقد فعالیت ثبت‌شده و پیگیری آن‌ها؛ کاهش واقعی ریزش هنوز نیازمند اندازه‌گیری است.</li>
                  <li><strong>ارزش حاکمیتی:</strong> مدیریت نقش‌ها، جلوگیری از تداخل سانس‌ها و انبارداری دقیق محصولات فیزیکی.</li>
                </ul>
              </div>
            </div>

            <div className="case-card full-width mt-6">
              <h3>کارکردهای چهارگانه واسطه‌گری ارزش‌آفرین در فیت‌لند</h3>
              <p>فیت‌لند صرفاً محل معرفی عضو به باشگاه نیست؛ ارزش واسطه‌ای آن از هماهنگ‌سازی اطلاعات و فرایندهای چندطرفه ایجاد می‌شود.</p>
              <div className="case-cards-grid">
                <div><strong>۱. کاهش تعداد تعاملات</strong><p>عضو به‌جای هماهنگی جداگانه با منشی، مربی و مسئول رزرو، درخواست‌ها و سوابق را در یک محیط ثبت و پیگیری می‌کند.</p></div>
                <div><strong>۲. مقیاس‌پذیری</strong><p>ساختار مشترک کاربران، کلاس‌ها و رزروها امکان مدیریت چند باشگاه را در صورت توسعه زیرساخت فراهم می‌کند.</p></div>
                <div><strong>۳. تخصص</strong><p>قواعد تخصصی ظرفیت، تداخل زمانی، نقش‌ها و پرونده پیشرفت در قالب ابزارهای مشخص ارائه می‌شوند.</p></div>
                <div><strong>۴. کاهش ریسک</strong><p>ثبت وضعیت رزرو، تاریخچه تغییرات و شفافیت سفارش‌ها احتمال خطاهای ناشی از هماهنگی شفاهی را کاهش می‌دهد؛ امنیت و پایداری نهایی نیازمند آزمون و زیرساخت مناسب است.</p></div>
              </div>
              <h4>جلوگیری از دور زدن پلتفرم</h4>
              <p>ارزش مستمر باید داخل سامانه باقی بماند: تاریخچه برنامه و اندازه‌گیری، تقویم و ظرفیت رزرو، سوابق تمدید، گزارش مدیریتی و مسیر پشتیبانی. این موارد هزینه تعویض مبتنی بر ارزش ایجاد می‌کنند؛ نه محدودسازی غیرمنصفانه کاربر.</p>
              <h4>بیانیه ارزش پیشنهادی</h4>
              <p>فیت‌لند پلتفرمی یکپارچه برای مدیریت خدمات ورزشی است که به اعضا امکان مدیریت عضویت، رزرو، برنامه و روند پیشرفت را می‌دهد و به مربیان و مدیران کمک می‌کند عملیات آموزشی و مدیریتی را منظم‌تر و شفاف‌تر انجام دهند.</p>
            </div>
          </div>
        )}

        {/* =======================================================
            TAB 3: INTERACTIVE BUSINESS MODEL CANVAS (BMC)
        ======================================================= */}
        {activeTab === "bmc" && (
          <div className="case-tab-content" id="bmc-section">
            <div className="case-section-intro">
              <div className="flex-between">
                <div>
                  <span className="case-eyebrow">بخش سوم</span>
                  <h2>بوم تعاملی مدل کسب‌وکار (Interactive Business Model Canvas)</h2>
                  <p>
                    بوم ۹ بخشی تعاملی؛ مدیر پروژه و داور محترم می‌توانند آیتم‌ها را ویرایش، حذف یا موارد جدید اضافه نمایند. تغییرات در دیتابیس لوکال پایدار می‌ماند.
                  </p>
                </div>
                <button
                  type="button"
                  className="chic-btn chic-btn-ghost btn-sm"
                  onClick={handleResetBMC}
                >
                  <RotateCcw size={14} />
                  <span>بازنشانی بوم اولیه</span>
                </button>
              </div>
            </div>

            <div className="bmc-grid">
              {/* 1. Key Partners */}
              <div className="bmc-block bmc-partners">
                <div className="bmc-block-head">
                  <h4>شرکای کلیدی (Key Partnerships)</h4>
                  <button
                    type="button"
                    className="bmc-add-btn"
                    onClick={() => setEditingBlock(editingBlock === "keyPartnerships" ? null : "keyPartnerships")}
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <ul className="bmc-items">
                  {bmc.keyPartnerships?.map((item, idx) => (
                    <li key={idx}>
                      <span>{item}</span>
                      <button type="button" onClick={() => handleRemoveBmcItem("keyPartnerships", idx)}>
                        <Trash2 size={12} />
                      </button>
                    </li>
                  ))}
                </ul>
                {editingBlock === "keyPartnerships" && (
                  <div className="bmc-add-input">
                    <input
                      type="text"
                      placeholder="عنوان شریک جدید..."
                      value={newItemText}
                      onChange={(e) => setNewItemText(e.target.value)}
                    />
                    <button type="button" onClick={() => handleAddBmcItem("keyPartnerships")}>
                      افزودن
                    </button>
                  </div>
                )}
              </div>

              {/* Middle Top: Key Activities & Resources */}
              <div className="bmc-block-column">
                <div className="bmc-block">
                  <div className="bmc-block-head">
                    <h4>فعالیت‌های کلیدی (Key Activities)</h4>
                    <button
                      type="button"
                      className="bmc-add-btn"
                      onClick={() => setEditingBlock(editingBlock === "keyActivities" ? null : "keyActivities")}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <ul className="bmc-items">
                    {bmc.keyActivities?.map((item, idx) => (
                      <li key={idx}>
                        <span>{item}</span>
                        <button type="button" onClick={() => handleRemoveBmcItem("keyActivities", idx)}>
                          <Trash2 size={12} />
                        </button>
                      </li>
                    ))}
                  </ul>
                  {editingBlock === "keyActivities" && (
                    <div className="bmc-add-input">
                      <input
                        type="text"
                        placeholder="فعالیت جدید..."
                        value={newItemText}
                        onChange={(e) => setNewItemText(e.target.value)}
                      />
                      <button type="button" onClick={() => handleAddBmcItem("keyActivities")}>
                        افزودن
                      </button>
                    </div>
                  )}
                </div>

                <div className="bmc-block">
                  <div className="bmc-block-head">
                    <h4>منابع کلیدی (Key Resources)</h4>
                    <button
                      type="button"
                      className="bmc-add-btn"
                      onClick={() => setEditingBlock(editingBlock === "keyResources" ? null : "keyResources")}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <ul className="bmc-items">
                    {bmc.keyResources?.map((item, idx) => (
                      <li key={idx}>
                        <span>{item}</span>
                        <button type="button" onClick={() => handleRemoveBmcItem("keyResources", idx)}>
                          <Trash2 size={12} />
                        </button>
                      </li>
                    ))}
                  </ul>
                  {editingBlock === "keyResources" && (
                    <div className="bmc-add-input">
                      <input
                        type="text"
                        placeholder="منبع جدید..."
                        value={newItemText}
                        onChange={(e) => setNewItemText(e.target.value)}
                      />
                      <button type="button" onClick={() => handleAddBmcItem("keyResources")}>
                        افزودن
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Value Proposition */}
              <div className="bmc-block bmc-value-prop">
                <div className="bmc-block-head">
                  <h4>ارزش‌های پیشنهادی (Value Propositions)</h4>
                  <button
                    type="button"
                    className="bmc-add-btn"
                    onClick={() => setEditingBlock(editingBlock === "valuePropositions" ? null : "valuePropositions")}
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <ul className="bmc-items">
                  {bmc.valuePropositions?.map((item, idx) => (
                    <li key={idx}>
                      <span>{item}</span>
                      <button type="button" onClick={() => handleRemoveBmcItem("valuePropositions", idx)}>
                        <Trash2 size={12} />
                      </button>
                    </li>
                  ))}
                </ul>
                {editingBlock === "valuePropositions" && (
                  <div className="bmc-add-input">
                    <input
                      type="text"
                      placeholder="ارزش پیشنهادی جدید..."
                      value={newItemText}
                      onChange={(e) => setNewItemText(e.target.value)}
                    />
                    <button type="button" onClick={() => handleAddBmcItem("valuePropositions")}>
                      افزودن
                    </button>
                  </div>
                )}
              </div>

              {/* Middle Right: Relationships & Channels */}
              <div className="bmc-block-column">
                <div className="bmc-block">
                  <div className="bmc-block-head">
                    <h4>ارتباط با مشتریان (Customer Relationships)</h4>
                    <button
                      type="button"
                      className="bmc-add-btn"
                      onClick={() => setEditingBlock(editingBlock === "customerRelationships" ? null : "customerRelationships")}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <ul className="bmc-items">
                    {bmc.customerRelationships?.map((item, idx) => (
                      <li key={idx}>
                        <span>{item}</span>
                        <button type="button" onClick={() => handleRemoveBmcItem("customerRelationships", idx)}>
                          <Trash2 size={12} />
                        </button>
                      </li>
                    ))}
                  </ul>
                  {editingBlock === "customerRelationships" && (
                    <div className="bmc-add-input">
                      <input
                        type="text"
                        placeholder="نحوه ارتباط جدید..."
                        value={newItemText}
                        onChange={(e) => setNewItemText(e.target.value)}
                      />
                      <button type="button" onClick={() => handleAddBmcItem("customerRelationships")}>
                        افزودن
                      </button>
                    </div>
                  )}
                </div>

                <div className="bmc-block">
                  <div className="bmc-block-head">
                    <h4>کانال‌های توزیع (Channels)</h4>
                    <button
                      type="button"
                      className="bmc-add-btn"
                      onClick={() => setEditingBlock(editingBlock === "channels" ? null : "channels")}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <ul className="bmc-items">
                    {bmc.channels?.map((item, idx) => (
                      <li key={idx}>
                        <span>{item}</span>
                        <button type="button" onClick={() => handleRemoveBmcItem("channels", idx)}>
                          <Trash2 size={12} />
                        </button>
                      </li>
                    ))}
                  </ul>
                  {editingBlock === "channels" && (
                    <div className="bmc-add-input">
                      <input
                        type="text"
                        placeholder="کانال جدید..."
                        value={newItemText}
                        onChange={(e) => setNewItemText(e.target.value)}
                      />
                      <button type="button" onClick={() => handleAddBmcItem("channels")}>
                        افزودن
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Customer Segments */}
              <div className="bmc-block bmc-segments">
                <div className="bmc-block-head">
                  <h4>بخش‌های مشتریان (Customer Segments)</h4>
                  <button
                    type="button"
                    className="bmc-add-btn"
                    onClick={() => setEditingBlock(editingBlock === "customerSegments" ? null : "customerSegments")}
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <ul className="bmc-items">
                  {bmc.customerSegments?.map((item, idx) => (
                    <li key={idx}>
                      <span>{item}</span>
                      <button type="button" onClick={() => handleRemoveBmcItem("customerSegments", idx)}>
                        <Trash2 size={12} />
                      </button>
                    </li>
                  ))}
                </ul>
                {editingBlock === "customerSegments" && (
                  <div className="bmc-add-input">
                    <input
                      type="text"
                      placeholder="بخش مشتری جدید..."
                      value={newItemText}
                      onChange={(e) => setNewItemText(e.target.value)}
                    />
                    <button type="button" onClick={() => handleAddBmcItem("customerSegments")}>
                      افزودن
                    </button>
                  </div>
                )}
              </div>

              {/* Bottom: Cost Structure & Revenue Streams */}
              <div className="bmc-bottom-row">
                <div className="bmc-block">
                  <div className="bmc-block-head">
                    <h4>ساختار هزینه‌ها (Cost Structure)</h4>
                    <button
                      type="button"
                      className="bmc-add-btn"
                      onClick={() => setEditingBlock(editingBlock === "costStructure" ? null : "costStructure")}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <ul className="bmc-items">
                    {bmc.costStructure?.map((item, idx) => (
                      <li key={idx}>
                        <span>{item}</span>
                        <button type="button" onClick={() => handleRemoveBmcItem("costStructure", idx)}>
                          <Trash2 size={12} />
                        </button>
                      </li>
                    ))}
                  </ul>
                  {editingBlock === "costStructure" && (
                    <div className="bmc-add-input">
                      <input
                        type="text"
                        placeholder="هزینه جدید..."
                        value={newItemText}
                        onChange={(e) => setNewItemText(e.target.value)}
                      />
                      <button type="button" onClick={() => handleAddBmcItem("costStructure")}>
                        افزودن
                      </button>
                    </div>
                  )}
                </div>

                <div className="bmc-block">
                  <div className="bmc-block-head">
                    <h4>جریان‌های درآمدی (Revenue Streams)</h4>
                    <button
                      type="button"
                      className="bmc-add-btn"
                      onClick={() => setEditingBlock(editingBlock === "revenueStreams" ? null : "revenueStreams")}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <ul className="bmc-items">
                    {bmc.revenueStreams?.map((item, idx) => (
                      <li key={idx}>
                        <span>{item}</span>
                        <button type="button" onClick={() => handleRemoveBmcItem("revenueStreams", idx)}>
                          <Trash2 size={12} />
                        </button>
                      </li>
                    ))}
                  </ul>
                  {editingBlock === "revenueStreams" && (
                    <div className="bmc-add-input">
                      <input
                        type="text"
                        placeholder="جریان درآمد جدید..."
                        value={newItemText}
                        onChange={(e) => setNewItemText(e.target.value)}
                      />
                      <button type="button" onClick={() => handleAddBmcItem("revenueStreams")}>
                        افزودن
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =======================================================
            TAB 4: COMPETITOR ANALYSIS & DIFFERENTIATION
        ======================================================= */}
        {activeTab === "competitors" && (
          <div className="case-tab-content">
            <div className="case-section-intro">
              <span className="case-eyebrow">بخش چهارم</span>
              <h2>تحلیل رقبا و ماتریس تمایز استراتژیک FitLand</h2>
              <p>
                مقایسه فیت‌لند با سه پلتفرم مرتبط بر اساس قابلیت‌های معرفی‌شده در صفحات رسمی؛ اطلاعات مشاهده‌نشده به‌عنوان نامشخص گزارش می‌شود.
              </p>
            </div>

            <div className="case-card full-width">
              <p><strong>روش‌شناسی:</strong> مقایسه بر اساس قابلیت‌هایی است که در صفحات رسمی قابل مشاهده بوده‌اند؛ نبودن یک قابلیت در متن سایت به معنی نبود قطعی آن در محصول نیست. بررسی وب در ۱۰ نوامبر ۲۰۲۶ انجام شده است.</p>
              <div className="table-responsive">
                <table className="case-table full-width">
                  <thead><tr><th>معیار</th><th>FitLand (نسخه پروژه)</th><th>جیموا (Gymova)</th><th>دمبل (Dambel)</th><th>Trainior</th><th>روش سنتی</th></tr></thead>
                  <tbody>
                    {[
                      ["تمرکز محصول", "پلتفرم وب چندنقشی در حال توسعه", "اکوسیستم مدیریت باشگاه، مربی و ورزشکار", "پلتفرم اتصال باشگاه، مربی و ورزشکار", "مدیریت باشگاه/استودیو و اپ عضو", "ارائه خدمت حضوری و هماهنگی دستی"],
                      ["مدیریت باشگاه و اعضا", "پنل مدیریت در نسخه پروژه", "مدیریت باشگاه، مربیان و ورزشکاران معرفی شده", "پروفایل باشگاه و مدیریت آنلاین اعضا معرفی شده", "اعضا، اشتراک و check-in معرفی شده", "ثبت دستی یا فایل جداگانه؛ وابسته به باشگاه"],
                      ["مربی و برنامه تمرینی", "پنل مربی و ثبت برنامه", "مدیریت مربی و برنامه‌ساز تمرینی معرفی شده", "طراحی برنامه تمرینی و غذایی و مدیریت شاگرد معرفی شده", "ساخت برنامه تمرین و تغذیه معرفی شده", "هماهنگی مستقیم و ابزارهای جداگانه"],
                      ["رزرو و ظرفیت", "قواعد رزرو و ظرفیت در نسخه پروژه", "در صفحه اصلی بررسی‌شده جزئیات کافی مشاهده نشد", "در صفحه اصلی بررسی‌شده جزئیات کافی مشاهده نشد", "تقویم، رزرو و فهرست انتظار معرفی شده", "هماهنگی دستی؛ احتمال خطای انسانی"],
                      ["اندازه‌گیری و پیشرفت", "ثبت سنجه و نمایش روند", "پیگیری وزن، اندازه‌ها و تحلیل پیشرفت معرفی شده", "ثبت خواب، غذا، تمرین و نمودار پیشرفت معرفی شده", "اندازه‌گیری، وزن‌کشی و پیشرفت معرفی شده", "دفتر یا فایل، در صورت ثبت"],
                      ["پرداخت و درآمد", "سفارش/اقساط در حالت دمو؛ بدون پرداخت واقعی", "اشتراک باشگاه بر اساس تعداد مربی در سایت معرفی شده", "صفحه قیمت شامل Premium و کمیسیون باشگاه/مربی است", "اشتراک ماهانه از €29 در صفحه اصلی؛ امکانات پرداخت/اقساط معرفی شده", "روش‌های مستقل و وابسته به باشگاه"],
                      ["وضعیت داده در این مقایسه", "نمونه اولیه دانشگاهی؛ مشتری و درآمد واقعی گزارش نمی‌شود", "قابلیت‌های ذکرشده ادعای سایت رسمی است", "قابلیت‌های ذکرشده ادعای سایت رسمی است", "قابلیت‌های ذکرشده ادعای سایت رسمی است", "قابل تعمیم به همه باشگاه‌ها نیست"]
                    ].map((row) => <tr key={row[0]}>{row.map((cell, index) => <td key={index}>{index === 0 ? <strong>{cell}</strong> : cell}</td>)}</tr>)}
                  </tbody>
                </table>
              </div>
              <div className="case-card">
                <h4>منابع رسمی بررسی‌شده</h4>
                <ul className="bullet-list">
                  <li><a href="https://gymova.ir/" target="_blank" rel="noreferrer">وب‌سایت رسمی جیموا</a></li>
                  <li><a href="https://dambel.io/fa" target="_blank" rel="noreferrer">وب‌سایت رسمی دمبل</a> و <a href="https://dambel.io/fa/prices" target="_blank" rel="noreferrer">صفحه تعرفه‌ها</a></li>
                  <li><a href="https://trainior.com/en" target="_blank" rel="noreferrer">وب‌سایت رسمی Trainior</a></li>
                </ul>
                <p className="note-text">قیمت و ادعاهای تبلیغاتی رقبا در این جدول برای نتیجه‌گیری درباره سهم بازار یا برتری قطعی استفاده نشده‌اند. پیش از ارائه، صفحات را دوباره بازبینی و تاریخ بررسی را به‌روز کن.</p>
              </div>
            </div>
          </div>
        )}

        {/* =======================================================
            TAB 5: PERSONAS & CUSTOMER JOURNEY
        ======================================================= */}
        {activeTab === "personas" && (
          <div className="case-tab-content">
            <div className="case-section-intro">
              <span className="case-eyebrow">بخش پنجم</span>
              <h2>پرسوناها و نقشه جامع سفر مشتری (Customer Journey Map)</h2>
              <p>
                سه پرسونا بر اساس فرضیات اولیه محصول؛ اطلاعات جمعیت‌شناختی و رفتاری باید پس از مصاحبه واقعی اصلاح شوند.
              </p>
            </div>

            <div className="personas-grid">
              <div className="persona-card">
                <div className="persona-header"><div className="persona-avatar bg-orange">ع</div><div><h3>پرسونای عضو باشگاه</h3><span>پرسونای فرضی؛ نماینده کاربر نهایی</span></div></div>
                <div className="persona-body">
                  <div className="persona-section"><strong>نیازها و اهداف:</strong><p>رزرو آسان، دسترسی به برنامه، مشاهده سوابق و پیگیری وضعیت عضویت.</p></div>
                  <div className="persona-section"><strong>مشکلات:</strong><p>پراکندگی برنامه‌ها، فراموشی زمان کلاس، دشواری پیگیری سوابق و ابهام در وضعیت تمدید.</p></div>
                  <div className="persona-section"><strong>رفتار خرید و انگیزه:</strong><p>مقایسه قیمت و خدمات پیش از خرید؛ پرداخت برای دسترسی ساده‌تر و خدمات منظم‌تر.</p></div>
                  <div className="persona-section"><strong>رفتار دیجیتال و کانال‌ها:</strong><p>استفاده از وب‌سایت و شبکه‌های اجتماعی؛ کانال‌های پیشنهادی جذب، جست‌وجو، معرفی مربی و باشگاه هستند.</p></div>
                  <div className="persona-section"><strong>موانع:</strong><p>حساسیت به قیمت، نگرانی درباره حریم خصوصی و پیچیدگی استفاده.</p></div>
                </div>
              </div>
              <div className="persona-card">
                <div className="persona-header"><div className="persona-avatar bg-blue">م</div><div><h3>پرسونای مدیر باشگاه</h3><span>پرسونای فرضی؛ مشتری اصلی مدل B2B2C</span></div></div>
                <div className="persona-body">
                  <div className="persona-section"><strong>نیازها و اهداف:</strong><p>مدیریت اعضا، مربیان، ظرفیت کلاس‌ها، اشتراک‌ها و گزارش‌های عملیاتی.</p></div>
                  <div className="persona-section"><strong>مشکلات:</strong><p>ثبت دستی، تداخل رزرو، دشواری گزارش‌گیری و پیگیری تمدیدها.</p></div>
                  <div className="persona-section"><strong>رفتار خرید و انگیزه:</strong><p>ارزیابی هزینه نرم‌افزار در برابر زمان و خطاهای عملیاتی؛ تصمیم‌گیری با توجه به سهولت آموزش و بازگشت هزینه.</p></div>
                  <div className="persona-section"><strong>رفتار دیجیتال و کانال‌ها:</strong><p>دموی محصول، معرفی همکاران و ارتباط مستقیم فروش؛ نیازمند مشاهده فرایند واقعی پیش از خرید.</p></div>
                  <div className="persona-section"><strong>موانع:</strong><p>هزینه اشتراک، مقاومت کارکنان در برابر تغییر و نگرانی از مهاجرت داده‌ها.</p></div>
                </div>
              </div>
              <div className="persona-card">
                <div className="persona-header"><div className="persona-avatar bg-green">م</div><div><h3>پرسونای مربی</h3><span>پرسونای فرضی؛ کاربر حرفه‌ای پلتفرم</span></div></div>
                <div className="persona-body">
                  <div className="persona-section"><strong>نیازها و اهداف:</strong><p>مدیریت شاگردان، ثبت برنامه، تقویم و مشاهده سوابق.</p></div>
                  <div className="persona-section"><strong>مشکلات:</strong><p>پیام‌های پراکنده، هماهنگی دستی و دسترسی دشوار به سابقه شاگرد.</p></div>
                  <div className="persona-section"><strong>رفتار خرید و انگیزه:</strong><p>استفاده از ابزار در صورتی که زمان ثبت اطلاعات را کاهش دهد و ارتباط با شاگرد را منظم کند.</p></div>
                  <div className="persona-section"><strong>رفتار دیجیتال و کانال‌ها:</strong><p>موبایل و پنل وب؛ معرفی توسط مدیر باشگاه یا مربیان همکار.</p></div>
                  <div className="persona-section"><strong>موانع:</strong><p>زمان آموزش، ثبت تکراری اطلاعات و نگرانی از پیچیدگی پنل.</p></div>
                </div>
              </div>
            </div>
            {/* 5-Step Customer Journey Map */}
            <div className="case-card full-width mt-6">
              <h3>نقشه سفر مشتری ۵ مرحله‌ای (Customer Journey Map)</h3>
              <div className="journey-steps-grid">
                {[
                  {
                    step: "۱. آگاهی (Awareness)",
                    action: "مشاهده پست اینستاگرام یا محاسبه رایگان BMI در سایت",
                    feeling: "کنجکاوی و احساس نیاز به تغییر",
                    touchpoint: "لندینگ پیج، ماشین‌حساب آنلاین، شبکه‌های اجتماعی",
                  },
                  {
                    step: "۲. بررسی (Consideration)",
                    action: "مقایسه پلن‌های عضویت، خواندن رزومه مربیان و دیدن داستان‌های موفقیت",
                    feeling: "سنجش ارزش در برابر هزینه و اطمینان از تخصص مربیان",
                    touchpoint: "صفحه /plans، صفحه /trainers، نظرات اعضا",
                  },
                  {
                    step: "۳. خرید (Purchase)",
                    action: "انتخاب پلن طلایی، انتخاب مدل اقساطی و پرداخت پیش‌پرداخت",
                    feeling: "رضایت از عدم پرداخت یکجای مبلغ بالا و سهولت فرایند",
                    touchpoint: "درگاه پرداخت آزمایشی اقساطی، پیامک/نوتیفیکیشن تایید",
                  },
                  {
                    step: "۴. استفاده (Usage)",
                    action: "دریافت برنامه از مربی، ثبت جلسات در تقویم و ثبت هفتگی وزن",
                    feeling: "انگیزه بالا و احساس همراهی مربی در طول هفته",
                    touchpoint: "داشبورد عضو، جدول تمرین، نمودار تغییرات وزن",
                  },
                  {
                    step: "۵. تمدید و وفاداری (Retention)",
                    action: "مشاهده کاهش وزن روی نمودار، پرداخت قسط بعدی و تمدید اشتراک",
                    feeling: "دستیابی به نتیجه ملموس و معرفی پلتفرم به دوستان",
                    touchpoint: "گزارش تحلیلی ماهانه، دریافت نشان عضو متعهد",
                  },
                ].map((item, idx) => (
                  <div className="journey-box" key={idx}>
                    <span className="step-num">{item.step}</span>
                    <div className="journey-detail">
                      <small>اقدام کاربر:</small>
                      <strong>{item.action}</strong>
                    </div>
                    <div className="journey-detail">
                      <small>احساس و نگرش:</small>
                      <p>{item.feeling}</p>
                    </div>
                    <div className="journey-detail">
                      <small>نقاط تماس (Touchpoints):</small>
                      <span>{item.touchpoint}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =======================================================
            TAB 6: DIGITAL MARKETING & AIDA
        ======================================================= */}
        {activeTab === "marketing" && (
          <div className="case-tab-content">
            <div className="case-section-intro">
              <span className="case-eyebrow">بخش ششم</span>
              <h2>استراتژی بازاریابی دیجیتال و قیف فروش AIDA</h2>
              <p>
                برنامه‌ریزی جذب، تبدیل، فعال‌سازی و نگه‌داشت کاربران از طریق آمیخته بازاریابی درون‌گرا (Inbound) و همکاری با باشگاه‌های فیزیکی.
              </p>
            </div>

            <div className="aida-funnel-grid">
              <div className="aida-step aida-attention">
                <div className="aida-head">
                  <span className="aida-letter">A</span>
                  <div>
                    <h4>جلب توجه (Attention)</h4>
                    <small>ایجاد آگاهی اولیه در مخاطب هدف</small>
                  </div>
                </div>
                <ul className="bullet-list">
                  <li>سئو ارگانیک برای عبارات پرتکرار: «محاسبه BMI»، «برنامه بدنسازی آنلاین»، «رژیم عضله‌سازی».</li>
                  <li>تولید و انتشار ویدیوهای آموزشی کوتاه با همکاری مربیان؛ همکاری رسمی باید پیش از ادعا مستند شود.</li>
                  <li>بنرهای همکاری مشترک در ورودی باشگاه‌های فیزیکی منتخب.</li>
                </ul>
              </div>

              <div className="aida-step aida-interest">
                <div className="aida-head">
                  <span className="aida-letter">I</span>
                  <div>
                    <h4>ایجاد علاقه (Interest)</h4>
                    <small>نمایش تفاوت رویکرد فیت‌لند با روش‌های سنتی</small>
                  </div>
                </div>
                <ul className="bullet-list">
                  <li>ماشین‌حساب تعاملی آنلاین که کالری روزانه و شاخص توده بدنی را در ۳ ثانیه نشان می‌دهد.</li>
                  <li>نمایش دموی داشبورد، نمونه برنامه و نمودار داده آزمایشی با برچسب «نمونه نمایشی»؛ از داستان موفقیت ساختگی استفاده نشود.</li>
                  <li>امکان مشاهده رزومه، ویدیو و مدارک مربیان قبل از ثبت‌نام.</li>
                </ul>
              </div>

              <div className="aida-step aida-desire">
                <div className="aida-head">
                  <span className="aida-letter">D</span>
                  <div>
                    <h4>ایجاد تمایل و قصد خرید (Desire)</h4>
                    <small>حذف موانع تصمیم‌گیری و ترس از ضرر</small>
                  </div>
                </div>
                <ul className="bullet-list">
                  <li>نمایش شفاف قیمت و شرایط؛ پرداخت اقساطی در نسخه فعلی صرفاً شبیه‌سازی است و خدمت مالی واقعی محسوب نمی‌شود.</li>
                  <li>نمایش قواعد کنترل ظرفیت و تداخل رزرو؛ زمان پاسخ‌گویی فقط پس از تعریف و اجرای تعهد پشتیبانی اعلام شود.</li>
                  <li>ارائه دموی قابل مشاهده و توضیح شفاف محدوده امکانات؛ آزمایش رایگان یا ضمانت بازگشت وجه تا زمان تصویب سیاست واقعی وعده داده نشود.</li>
                </ul>
              </div>

              <div className="aida-step aida-action">
                <div className="aida-head">
                  <span className="aida-letter">A</span>
                  <div>
                    <h4>اقدام به خرید و عضویت (Action)</h4>
                    <small>فرایند ثبت‌نام فوق‌سریع و روان</small>
                  </div>
                </div>
                <ul className="bullet-list">
                  <li>فرم ثبت‌نام تک‌مرحله‌ای با فقط ۳ فیلد (نام، ایمیل، رمز).</li>
                  <li>ثبت سفارش آزمایشی و نمایش پیش‌فاکتور/وضعیت دمو؛ هیچ درگاه واقعی یا داده بانکی دریافت نمی‌شود.</li>
                  <li>آنبردینگ فوری و هدایت مستقیم به ثبت اولین سنجه و انتخاب مربی.</li>
                </ul>
              </div>
            </div>
            <div className="case-card full-width mt-6">
              <h3>نقشه حضور دیجیتال و سنجش قیف</h3>
              <div className="table-responsive"><table className="case-table"><thead><tr><th>مرحله</th><th>کانال</th><th>اقدام مورد انتظار</th><th>شاخص سنجش</th></tr></thead><tbody>
                <tr><td>توجه</td><td>محتوای آموزشی، جست‌وجو، معرفی باشگاه</td><td>ورود به صفحه فرود</td><td>بازدید و منبع ورودی</td></tr>
                <tr><td>علاقه</td><td>صفحه امکانات و دموی پنل</td><td>مشاهده امکانات و پلن‌ها</td><td>نرخ مشاهده صفحه امکانات</td></tr>
                <tr><td>تمایل</td><td>مقایسه خدمات و قیمت شفاف</td><td>انتخاب پلن یا درخواست دمو</td><td>نرخ کلیک CTA و درخواست دمو</td></tr>
                <tr><td>اقدام</td><td>ثبت‌نام و رزرو</td><td>تکمیل ثبت‌نام یا رزرو آزمایشی</td><td>نرخ تبدیل و تکمیل فرایند</td></tr>
              </tbody></table></div>
              <p className="note-text">این شاخص‌ها در حال حاضر چارچوب اندازه‌گیری پیشنهادی‌اند؛ تا زمان جمع‌آوری داده واقعی، مقدار عملکردی برای آن‌ها گزارش نمی‌شود.</p>
            </div>
          </div>
        )}

        {/* =======================================================
            TAB 7: REVENUE MODEL & UNIT ECONOMICS CALCULATOR
        ======================================================= */}
        {activeTab === "economics" && (
          <div className="case-tab-content">
            <div className="case-section-intro">
              <span className="case-eyebrow">بخش هفتم</span>
              <h2>مدل درآمدی و ماشین‌حساب پویای سنجه‌های اقتصادی (Unit Economics)</h2>
              <p>
                محاسبه زنده شاخص‌های CAC, LTV, Churn, ARPU و نسبت سلامت رشد کسب‌وکار بر مبنای فرضیات قابل تنظیم.
              </p>
            </div>

            <div className="economics-wrapper-grid">
              {/* Controls Column */}
              <div className="economics-controls-card">
                <h3>متغیرهای ورودی مدل مالی (Assumptions)</h3>
                <p className="note-text">
                  همه مقادیر اولیه نمونه و قابل تغییرند، نه داده واقعی بازار. تعداد کاربران در این محاسبه به‌عنوان کاربران پرداخت‌کننده فرض شده است؛ درآمد به ازای هر کاربر شامل شهریه فرضی و ۷۵ هزار تومان درآمد کارمزدی فرضی است.
                </p>

                <div className="econ-slider-group">
                  <div className="slider-label-row">
                    <span>تعداد کاربران فعال پلتفرم:</span>
                    <strong>{formatNumber(calcActiveUsers)} نفر</strong>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="10000"
                    step="100"
                    value={calcActiveUsers}
                    onChange={(e) => setCalcActiveUsers(Number(e.target.value))}
                    className="calc-range-input"
                  />
                </div>

                <div className="econ-slider-group">
                  <div className="slider-label-row">
                    <span>میانگین شهریه ماهانه اشتراک:</span>
                    <strong>{formatCurrency(calcMonthlySubPrice)}</strong>
                  </div>
                  <input
                    type="range"
                    min="500000"
                    max="3000000"
                    step="50000"
                    value={calcMonthlySubPrice}
                    onChange={(e) => setCalcMonthlySubPrice(Number(e.target.value))}
                    className="calc-range-input"
                  />
                </div>

                <div className="econ-slider-group">
                  <div className="slider-label-row">
                    <span>نرخ ریزش ماهانه (Monthly Churn Rate):</span>
                    <strong>{calcChurnRate}٪</strong>
                  </div>
                  <input
                    type="range"
                    min="1.0"
                    max="15.0"
                    step="0.5"
                    value={calcChurnRate}
                    onChange={(e) => setCalcChurnRate(Number(e.target.value))}
                    className="calc-range-input"
                  />
                  <small className="help-sub">درصد اعضایی که در هر ماه تمدید نمی‌کنند.</small>
                </div>

                <div className="econ-slider-group">
                  <div className="slider-label-row">
                    <span>هزینه جذب هر مشتری (CAC):</span>
                    <strong>{formatCurrency(calcCac)}</strong>
                  </div>
                  <input
                    type="range"
                    min="100000"
                    max="1500000"
                    step="50000"
                    value={calcCac}
                    onChange={(e) => setCalcCac(Number(e.target.value))}
                    className="calc-range-input"
                  />
                </div>
                <div className="econ-slider-group">
                  <div className="slider-label-row"><span>حاشیه سود ناخالص فرضی:</span><strong>{calcGrossMargin}٪</strong></div>
                  <input type="range" min="10" max="80" step="5" value={calcGrossMargin} onChange={(e) => setCalcGrossMargin(Number(e.target.value))} className="calc-range-input" />
                  <small className="help-sub">برای تبدیل LTV درآمدی به LTV سود ناخالص؛ مقدار واقعی باید از هزینه‌ها استخراج شود.</small>
                </div>
              </div>

              {/* Output & Formulas Column */}
              <div className="economics-results-card">
                <h3>خروجی تحلیلی و شاخص‌های کلیدی سلامت پلتفرم</h3>

                <div className="econ-metrics-grid">
                  <div className="econ-tile">
                    <span>متوسط درآمد ماهانه هر کاربر (ARPU)</span>
                    <strong className="text-primary">{formatCurrency(economics.arpu)}</strong>
                    <small>فرمول: درآمد اشتراک + سهم کارمزد کلاس‌ها</small>
                  </div>

                  <div className="econ-tile">
                    <span>طول عمر وفاداری کاربر (Customer Lifespan)</span>
                    <strong>{economics.averageLifespanMonths} ماه</strong>
                    <small>فرمول: 1 / Churn Rate</small>
                  </div>

                  <div className="econ-tile">
                    <span>ارزش طول عمر مشتری (LTV)</span>
                    <strong className="text-emerald-500">{formatCurrency(economics.revenueLtv)}</strong>
                    <small>درآمد طول عمر: ARPU × Lifespan</small>
                  </div>

                  <div className="econ-tile">
                    <span>LTV بر مبنای سود ناخالص</span>
                    <strong className="text-emerald-500">{formatCurrency(economics.grossProfitLtv)}</strong>
                    <small>فرمول: ARPU × حاشیه سود × Lifespan</small>
                  </div>

                  <div className="econ-tile highlight">
                    <span>نسبت LTV سود ناخالص به CAC</span>
                    <strong className={economics.healthyRatio ? "text-emerald-500" : "text-amber-500"}>
                      {economics.ltvCacRatio}x
                    </strong>
                    <small>۳ برابر صرفاً آستانه راهنمای تحلیلی است، نه تضمین موفقیت.</small>
                  </div>
                </div>

                <div className="financial-totals-banner">
                  <div className="total-col">
                    <span>درآمد ناخالص ماهانه (MRR پیش‌بینی):</span>
                    <strong>{formatCurrency(economics.monthlyGrossRevenue)}</strong>
                  </div>
                  <div className="total-col">
                    <span>درآمد سالانه معادل (ARR Run-Rate):</span>
                    <strong>{formatCurrency(economics.annualRunRate)}</strong>
                  </div>
                  <div className="total-col">
                    <span>سود ناخالص ماهانه تخمینی:</span>
                    <strong>{formatCurrency(economics.monthlyGrossProfit)}</strong>
                  </div>
                  <div className="total-col">
                    <span>دوره بازگشت هزینه جذب (Payback):</span>
                    <strong>{economics.paybackPeriodMonths} ماه</strong>
                  </div>
                </div>

                <div className="methodology-note">
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                  <p>
                    <strong>تفسیر سناریو:</strong> نسبت محاسبه‌شده {economics.ltvCacRatio} برابر است. این خروجی فقط نتیجه ورودی‌های فرضی همین ماشین‌حساب است و اثبات سودآوری یا مقیاس‌پذیری فیت‌لند نیست. هزینه‌های ثابت، مالیات، هزینه پشتیبانی و ترکیب درآمدی واقعی در این مدل ساده‌شده لحاظ نشده‌اند.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =======================================================
            TAB 8: SECURITY & TRUST
        ======================================================= */}
        {activeTab === "security" && (
          <div className="case-tab-content">
            <div className="case-section-intro">
              <span className="case-eyebrow">بخش هشتم</span>
              <h2>امنیت، حریم خصوصی و معماری تفکیک دسترسی (RBAC)</h2>
              <p>
                شفافیت ساختاری، حفاظت از حریم شخصی تصاویر و سنجه‌های بدنی، و مستندسازی صریح محدودیت‌های محیط لوکال/دمو.
              </p>
            </div>

            <div className="case-cards-grid">
              <div className="case-card">
                <h3>مدیریت دسترسی مبتنی بر نقش (Role-Based Access Control)</h3>
                <ul className="bullet-list">
                  <li><strong>عضو (Member):</strong> دسترسی منحصراً به برنامه‌ها، پرداخت‌ها، کلاس‌های رزروشده و رکوردهای اندازه‌گیری شخصی خود؛ عدم دسترسی به داده‌های سایر اعضا.</li>
                  <li><strong>مربی (Trainer):</strong> دسترسی به شاگردان اختصاص‌یافته، ویرایش برنامه تمرینی/تغذیه آنان و تقویم سانس‌ها؛ عدم دسترسی به گزارش‌های مالی کل یا اعضای سایر مربیان.</li>
                  <li><strong>مدیر کل (Admin):</strong> دسترسی به فهرست کلیه کاربران، تغییر نقش‌ها، مدیریت موجودی فروشگاه و گزارش درآمد تجمیعی.</li>
                </ul>
              </div>

              <div className="case-card">
                <h3>شفافیت محیط آزمایشی (Demo Disclosure)</h3>
                <div className="disclosure-box">
                  <AlertTriangle size={20} className="text-amber-500 shrink-0" />
                  <div>
                    <strong>بیانیه صریح ارزیابی دانشگاهی:</strong>
                    <p>
                      احراز هویت و نگهداری سشن‌های فعلی جهت سهولت ارائه بر بستر LocalStorage پیاده‌سازی شده است. در نسخه عملیاتی تجاری (Production)، این لایه با احراز هویت مبتنی بر توکن‌های امن JWT و کوکی‌های HttpOnly در بستر سرور بک‌اند ایمن جایگزین خواهد شد. کلیه پرداخت‌ها آزمایشی بوده و هیچ تراکنش بانکی واقعی انجام نمی‌شود.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =======================================================
            TAB 9: STRATEGIC ROADMAP
        ======================================================= */}
        {activeTab === "roadmap" && (
          <div className="case-tab-content">
            <div className="case-section-intro">
              <span className="case-eyebrow">بخش نهم</span>
              <h2>نقشه راه استراتژیک محصول (Product Strategic Roadmap)</h2>
              <p>
                برنامه فازبندی‌شده از فاز آزمایشی دانشگاهی (MVP) تا تجاری‌سازی سراسری و یکپارچه‌سازی سخت‌افزارهای سلامت.
              </p>
            </div>

            <div className="roadmap-timeline">
              {[
                {
                  phase: "فاز ۱: نسخه اولیه (MVP) — وضعیت کنونی",
                  status: "تکمیل شده ✓",
                  statusClass: "completed",
                  items: [
                    "پیاده‌سازی هسته سه‌نقشه (عضو، مربی، مدیر)",
                    "سیستم رزرو آنلاین با موتور پیشگیری از تداخل زمانی",
                    "ماشین‌حساب هوشمند BMI و محاسبه‌گر اقتصاد پلتفرم",
                    "پشتیبانی کامل دوزبانه (فارسی RTL / انگلیسی LTR) و دو تم تاریک و روشن",
                    "سیستم پرداخت اقساطی آزمایشی با جدول سررسید",
                  ],
                },
                {
                  phase: "فاز ۲: اعتبارسنجی میدانی و پایلوت باشگاهی (Q1 2027)",
                  status: "در حال اقدام",
                  statusClass: "in-progress",
                  items: [
                    "استقرار نسخه پایلوت در ۳ باشگاه منتخب شهر یزد",
                    "اتصال به درگاه بانکی شاپرک و درگاه اقساطی اسنپ‌پی / دیجی‌پی",
                    "پیاده‌سازی چت مستقیم درون‌برنامه‌ای بین مربی و شاگرد با WebSocket",
                    "تست کاربری میدانی با ۱۰۰ ورزشکار و ثبت بازخوردهای UX",
                  ],
                },
                {
                  phase: "فاز ۳: هوش مصنوعی و تحلیل خودکار تصویر (Q3 2027)",
                  status: "برنامه‌ریزی‌شده",
                  statusClass: "planned",
                  items: [
                    "تحلیل تصویر فرم حرکات با استفاده از مدل‌های بینایی ماشین برای اصلاح اسکات و ددلیفت",
                    "پیشنهاد هوشمند جایگزینی مواد غذایی متناسب با کالری باقی‌مانده روز",
                    "اتصال به ساعت‌های هوشمند (Apple Health / Google Fit) جهت استخراج خودکار ضربان و کالری",
                  ],
                },
                {
                  phase: "فاز ۴: مقیاس‌پذیری کشوری و B2B باشگاه‌ها (2028)",
                  status: "چشم‌انداز بلندمدت",
                  statusClass: "future",
                  items: [
                    "سامانه مدیریت جامع منابع باشگاه (Gym ERP) شامل گیت ورود و کنترل تردد با QR",
                    "مارکت‌پلیس سراسری مربیان آنلاین با رتبه‌بندی کشوری",
                    "فرانچایزینگ نرم‌افزاری برای برندهای زنجیره‌ای تناسب اندام",
                  ],
                },
              ].map((phase, i) => (
                <div className={`roadmap-card ${phase.statusClass}`} key={i}>
                  <div className="roadmap-head">
                    <span className="phase-title">{phase.phase}</span>
                    <span className={`phase-badge ${phase.statusClass}`}>{phase.status}</span>
                  </div>
                  <ul className="phase-items">
                    {phase.items.map((item, idx) => (
                      <li key={idx}>
                        <CheckCircle2 size={15} className="shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Interactive Scenario Runner Modal */}
      <ScenarioRunnerModal
        isOpen={isScenarioModalOpen}
        onClose={() => setIsScenarioModalOpen(false)}
      />
    </div>
  );
}
