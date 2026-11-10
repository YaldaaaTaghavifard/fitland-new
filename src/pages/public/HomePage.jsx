import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ChartNoAxesCombined,
  ClipboardList,
  HeartPulse,
  ShoppingBag,
  Flame,
  CheckCircle2,
  Trophy,
  Scale,
  Sparkles,
} from "lucide-react";

// Generated high-fidelity asset paths
const HERO_IMAGE = "/src/assets/images/hero_fitness_athletes_1794241066452.jpg";
const COACH_IMAGE = "/src/assets/images/coach_workout_session_1794241067173.jpg";
const COMMUNITY_IMAGE = "/src/assets/images/gym_community_lifestyle_1794241067159.jpg";

const keyStats = [
  { value: "۴,۸۰۰+", label: "ورزشکار فعال در پلتفرم" },
  { value: "۱۲۰+", label: "برنامه تمرینی و تغذیه‌ای" },
  { value: "۳۵+", label: "مربی ارشد با مدرک رسمی" },
  { value: "۹۸.۶٪", label: "رضایت اعضا از نتایج بدنی" },
];

const successStories = [
  {
    name: "نیما رادمنش",
    role: "عضو فیت‌لند از بهمن ۱۴۰۲",
    result: "کاهش ۱۲ کیلوگرم چربی و تقویت عضلات مرکزی",
    period: "دوره ۴ ماهه تمرین و تغذیه",
    comment:
      "پیگیری منظم مربی در پنل و ثبت دقیق سنجه‌ها باعث شد بعد از سال‌ها بالاخره به وزن ایده‌آلم برسم و انرژی روزانه‌ام دوبرابر بشه.",
    avatarBg: "linear-gradient(135deg, #ff6b35, #ff8c5a)",
    badge: "چربی‌سوزی و فرم‌دهی",
  },
  {
    name: "مهسا اکبری",
    role: "عضو فیت‌لند از آبان ۱۴۰۲",
    result: "افزایش حجم عضله خالص و اصلاح وضعیت شانه",
    period: "دوره ۶ ماهه بدنسازی تخصصی",
    comment:
      "برنامه‌های ویدئویی و امکان رزرو جلسات خصوصی به من اعتمادبه‌نفس داد تا حرکات وزنه‌برداری رو با تکنیک صحیح و بدون آسیب انجام بدم.",
    avatarBg: "linear-gradient(135deg, #10b981, #059669)",
    badge: "هایپرتروفی و اصلاحی",
  },
  {
    name: "آرش سهرابی",
    role: "عضو فیت‌لند از تیر ۱۴۰۳",
    result: "بهبود چشمگیر استقامت قلبی و رکورد دویدن",
    period: "دوره ۳ ماهه آمادگی جسمانی",
    comment:
      "داشبورد آنالیز عملکرد و یکپارچگی برنامه‌های غذایی باعث شد ریکاوری سریعی داشته باشم و رکوردهای تمرینی‌ام رشد کنه.",
    avatarBg: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
    badge: "استقامت و فانکشنال",
  },
];

export default function HomePage() {
  // Interactive BMI & Calorie Calculator state
  const [calcGender, setCalcGender] = useState("male");
  const [calcHeight, setCalcHeight] = useState(175);
  const [calcWeight, setCalcWeight] = useState(74);
  const [calcAge, setCalcAge] = useState(26);
  const [calcActivity, setCalcActivity] = useState(1.375); // 1.2: low, 1.375: moderate, 1.55: high

  // BMI Calculation
  const bmiResult = useMemo(() => {
    const heightInMeters = calcHeight / 100;
    const bmi = (calcWeight / (heightInMeters * heightInMeters)).toFixed(1);
    const numBmi = parseFloat(bmi);

    let status = "نرمال و متناسب";
    let statusClass = "text-emerald-500";
    let message = "شاخص بدنی شما در محدوده استاندارد و سلامت قرار دارد.";

    if (numBmi < 18.5) {
      status = "کمبود وزن";
      statusClass = "text-amber-500";
      message = "پیشنهاد می‌شود از رژیم‌های افزایش حجم و کالری مازاد استفاده کنید.";
    } else if (numBmi >= 25 && numBmi < 30) {
      status = "اضافه وزن ملایم";
      statusClass = "text-orange-500";
      message = "با تمرینات منظم هوازی و اصلاح تغذیه به راحتی به تعادل می‌رسید.";
    } else if (numBmi >= 30) {
      status = "چاقی نیازمند اصلاح";
      statusClass = "text-red-500";
      message = "برنامه تخصصی کنترل کالری و تمرینات بدون فشار مفصلی توصیه می‌شود.";
    }

    // Basal Metabolic Rate (Harris-Benedict formula)
    let bmr =
      calcGender === "male"
        ? 88.362 + 13.397 * calcWeight + 4.799 * calcHeight - 5.677 * calcAge
        : 447.593 + 9.247 * calcWeight + 3.098 * calcHeight - 4.33 * calcAge;

    const tdee = Math.round(bmr * calcActivity);
    const fatLossCal = Math.round(tdee - 450);
    const muscleGainCal = Math.round(tdee + 350);

    return {
      bmi,
      status,
      statusClass,
      message,
      tdee,
      fatLossCal,
      muscleGainCal,
    };
  }, [calcGender, calcHeight, calcWeight, calcAge, calcActivity]);

  return (
    <div className="home-page-chic">
      {/* =========================
          HERO SECTION
      ========================= */}
      <section className="chic-hero-section">
        <div className="container chic-hero-grid">
          <div className="chic-hero-text">
            <div className="chic-hero-eyebrow">
              <span className="eyebrow-glow-dot" />
              <Flame size={15} className="text-primary" />
              <span>پلتفرم جامع هوشمند تناسب اندام و مربیگری تخصصی</span>
            </div>

            <h1 className="chic-hero-title">
              مسیر تحول اندام شما،
              <span className="chic-hero-gradient"> از همین لحظه شروع می‌شود</span>
            </h1>

            <p className="chic-hero-subtitle">
              در فیت‌لند تمرینات، برنامه‌های غذایی، تقویم جلسات با مربیان ارشد و
              شاخص‌های بدنی‌تان را در محیطی یکپارچه و مدرن مدیریت کنید. بدون حدس
              و گمان، با هدف‌گذاری دقیق ورزشی گام بردارید.
            </p>

            <div className="chic-hero-cta-group">
              <Link to="/register" className="chic-btn chic-btn-primary">
                <span>عضویت و شروع رایگان</span>
                <ArrowLeft size={18} />
              </Link>

              <a href="#bmi-calculator" className="chic-btn chic-btn-ghost">
                <Scale size={18} />
                <span>محاسبه رایگان BMI و کالری</span>
              </a>
            </div>

            <div className="chic-hero-guarantees">
              <div className="guarantee-item">
                <CheckCircle2 size={16} className="text-primary" />
                <span>برنامه‌های اختصاصی بر اساس توان بدنی</span>
              </div>
              <div className="guarantee-item">
                <CheckCircle2 size={16} className="text-primary" />
                <span>پشتیبانی و ارتباط مستقیم با مربی</span>
              </div>
              <div className="guarantee-item">
                <CheckCircle2 size={16} className="text-primary" />
                <span>ثبت و نمودار تحلیل تغییرات وزن</span>
              </div>
            </div>
          </div>

          <div className="chic-hero-media">
            <div className="chic-media-frame">
              <img
                src={HERO_IMAGE}
                alt="ورزشکاران فیت‌لند در حال تمرین تخصصی"
                className="chic-hero-img"
                loading="eager"
              />

              <div className="chic-hero-overlay-scrim" />

              {/* Floating Stat Card 1: Live Workout */}
              <div className="chic-float-card float-top-right">
                <div className="float-icon-box bg-orange">
                  <Flame size={20} />
                </div>
                <div>
                  <span className="float-title">کالری‌سوزی فعال</span>
                  <strong className="float-metric">۵۴۰ کیلوکالری</strong>
                </div>
              </div>

              {/* Floating Stat Card 2: Coach Verified */}
              <div className="chic-float-card float-bottom-left">
                <div className="float-icon-box bg-green">
                  <Trophy size={20} />
                </div>
                <div>
                  <span className="float-title">تضمین کیفیت تمرین</span>
                  <strong className="float-metric">مربیان رسمی فدراسیون</strong>
                </div>
              </div>

              {/* Floating Stat Card 3: Heart / Focus */}
              <div className="chic-float-pill float-center-bottom">
                <HeartPulse size={16} className="text-rose-500 animate-pulse" />
                <span>پایش هوشمند ضربان و پیشرفت مداوم</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          KEY STATS STRIP
      ========================= */}
      <section className="chic-stats-strip">
        <div className="container chic-stats-grid">
          {keyStats.map((stat, idx) => (
            <div className="chic-stat-item" key={idx}>
              <strong className="chic-stat-val">{stat.value}</strong>
              <span className="chic-stat-lbl">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* =========================
          BENTO SHOWCASE SECTION
      ========================= */}
      <section className="chic-section">
        <div className="container">
          <div className="chic-section-header">
            <span className="chic-section-tag">
              <Sparkles size={14} />
              امکانات اختصاصی فیت‌لند
            </span>
            <h2 className="chic-section-title">
              همه ابزارهای ارتقای تناسب اندام، در یک پنل هوشمند
            </h2>
            <p className="chic-section-desc">
              از طراحی برنامه‌های تمرینی دقیق تا مشاوره تغذیه، ثبت دوره‌ای سنجه‌ها
              و خرید تجهیزات استاندارد باشگاهی.
            </p>
          </div>

          <div className="chic-bento-grid">
            {/* Bento 1: Coach 1-on-1 */}
            <div className="bento-card bento-feature-large">
              <div className="bento-img-wrap">
                <img
                  src={COACH_IMAGE}
                  alt="مربیگری اختصاصی بدنسازی"
                  className="bento-bg-img"
                  loading="lazy"
                />
                <div className="bento-scrim" />
              </div>
              <div className="bento-content">
                <span className="bento-kicker">مربیگری ۱ به ۱</span>
                <h3 className="bento-title">
                  جلسات اختصاصی و تقویم رزرو هوشمند
                </h3>
                <p className="bento-desc">
                  زمان‌های خالی مربی خود را ببینید، جلسات تمرین خصوصی رزرو کنید و
                  پس از هر جلسه بازخورد و اصلاحیه دریافت نمایید.
                </p>
                <Link to="/trainers" className="bento-link">
                  <span>مشاهده لیست مربیان</span>
                  <ArrowLeft size={16} />
                </Link>
              </div>
            </div>

            {/* Bento 2: Progress Tracking */}
            <div className="bento-card bento-stat-card">
              <div className="bento-icon-badge">
                <ChartNoAxesCombined size={24} />
              </div>
              <span className="bento-kicker">آنالیز هوشمند</span>
              <h3 className="bento-title">ثبت و رصد دقیق پیشرفت</h3>
              <p className="bento-desc">
                ثبت هفتگی وزن، دور بازو، سینه، کمر و درصد چربی با رسم خودکار
                نمودارهای تحلیلی و مقایسه دوره‌ای.
              </p>
              <div className="bento-mini-stat">
                <div>
                  <small>دقت محاسبات</small>
                  <strong>۹۹.۲٪</strong>
                </div>
                <div>
                  <small>شاخص‌های ثبت‌شده</small>
                  <strong>۸ سنجه کلیدی</strong>
                </div>
              </div>
            </div>

            {/* Bento 3: Nutrition & Macros */}
            <div className="bento-card bento-stat-card">
              <div className="bento-icon-badge">
                <ClipboardList size={24} />
              </div>
              <span className="bento-kicker">تغذیه و کالری‌شماری</span>
              <h3 className="bento-title">رژیم متناسب با اهداف شما</h3>
              <p className="bento-desc">
                برنامه غذایی دقیق با تعیین سهم پروتئین، کربوهیدرات و ریزمغذی‌ها
                متناسب با دوره‌های چربی‌سوزی، حجم یا ثبات وزن.
              </p>
              <div className="bento-mini-stat">
                <div>
                  <small>تنوع وعده‌ها</small>
                  <strong>۱۰۰٪ منعطف</strong>
                </div>
                <div>
                  <small>هدف‌گذاری</small>
                  <strong>علمی و پایدار</strong>
                </div>
              </div>
            </div>

            {/* Bento 4: Community & Motivation */}
            <div className="bento-card bento-feature-large">
              <div className="bento-img-wrap">
                <img
                  src={COMMUNITY_IMAGE}
                  alt="جامعه پرانرژی ورزشکاران فیت‌لند"
                  className="bento-bg-img"
                  loading="lazy"
                />
                <div className="bento-scrim" />
              </div>
              <div className="bento-content">
                <span className="bento-kicker">جامعه ورزشکاران</span>
                <h3 className="bento-title">
                  انگیزه بی‌پایان در کنار ورزشکاران دیگر
                </h3>
                <p className="bento-desc">
                  در چالش‌های ورزشی ماهانه شرکت کنید، دستاوردهایتان را به اشتراک
                  بگذارید و در محیطی مثبت و پرانرژی رشد کنید.
                </p>
                <Link to="/plans" className="bento-link">
                  <span>بررسی اشتراک‌ها و پلن‌ها</span>
                  <ArrowLeft size={16} />
                </Link>
              </div>
            </div>

            {/* Bento 5: Store Direct Link */}
            <div className="bento-card bento-cta-card">
              <div className="bento-cta-inner">
                <div className="bento-icon-badge bg-primary-soft">
                  <ShoppingBag size={24} className="text-primary" />
                </div>
                <div>
                  <span className="bento-kicker">تجهیزات ورزشی</span>
                  <h3 className="bento-title">فروشگاه اختصاصی فیت‌لند</h3>
                  <p className="bento-desc">
                    انواع کش‌های مقاومتی، شیکرهای استاندارد، مت‌های ضدلغزش و دمبل با
                    ارسال سریع و ضمانت سلامت کالا.
                  </p>
                </div>
                <Link to="/store" className="chic-btn chic-btn-primary">
                  <span>ورود به فروشگاه</span>
                  <ArrowLeft size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================
          INTERACTIVE TOOL: BMI & CALORIE CALCULATOR
      ==================================================== */}
      <section className="chic-section chic-calc-section" id="bmi-calculator">
        <div className="container">
          <div className="calc-card-wrapper">
            <div className="calc-info-col">
              <span className="chic-section-tag">
                <Scale size={14} />
                ابزار آنلاین رایگان
              </span>
              <h2 className="calc-main-title">
                محاسبه‌گر هوشمند شاخص توده بدنی (BMI) و کالری روزانه
              </h2>
              <p className="calc-main-desc">
                مشخصات فیزیکی خود را وارد کنید تا وضعیت توده بدنی، سطح کالری
                تثبیت و کالری پیشنهادی برای چربی‌سوزی یا عضله‌سازی در همان لحظه
                محاسبه شود.
              </p>

              <div className="calc-feature-list">
                <div className="calc-feature-point">
                  <div className="point-dot" />
                  <div>
                    <strong>فرمول استاندارد بالینی:</strong> بر مبنای معادلات جهانی
                    WHO و Harris-Benedict
                  </div>
                </div>
                <div className="calc-feature-point">
                  <div className="point-dot" />
                  <div>
                    <strong>پیشنهاد کالری تفکیک‌شده:</strong> کالری نگه‌دارنده،
                    چربی‌سوزی و عضله‌سازی بدون تحلیل بافت
                  </div>
                </div>
                <div className="calc-feature-point">
                  <div className="point-dot" />
                  <div>
                    <strong>پلن تمرینی متناظر:</strong> اتصال نتایج به برنامه
                    ورزشی مربی در صورت ثبت‌نام
                  </div>
                </div>
              </div>

              <div className="calc-cta-box">
                <span>می‌خواهید بر اساس این نتایج برنامه بگیرید؟</span>
                <Link to="/register" className="chic-btn chic-btn-primary">
                  <span>دریافت برنامه اختصاصی</span>
                  <ArrowLeft size={16} />
                </Link>
              </div>
            </div>

            <div className="calc-tool-col">
              <div className="calc-interactive-panel">
                {/* Gender Toggle */}
                <div className="calc-form-group">
                  <label className="calc-label">جنسیت</label>
                  <div className="calc-gender-toggle">
                    <button
                      type="button"
                      className={`gender-btn ${calcGender === "male" ? "active" : ""}`}
                      onClick={() => setCalcGender("male")}
                    >
                      آقا
                    </button>
                    <button
                      type="button"
                      className={`gender-btn ${calcGender === "female" ? "active" : ""}`}
                      onClick={() => setCalcGender("female")}
                    >
                      خانم
                    </button>
                  </div>
                </div>

                {/* Sliders Grid */}
                <div className="calc-sliders-grid">
                  <div className="calc-slider-item">
                    <div className="slider-header">
                      <span>قد (سانتی‌متر)</span>
                      <strong>{calcHeight} cm</strong>
                    </div>
                    <input
                      type="range"
                      min="140"
                      max="210"
                      value={calcHeight}
                      onChange={(e) => setCalcHeight(Number(e.target.value))}
                      className="calc-range-input"
                    />
                  </div>

                  <div className="calc-slider-item">
                    <div className="slider-header">
                      <span>وزن (کیلوگرم)</span>
                      <strong>{calcWeight} kg</strong>
                    </div>
                    <input
                      type="range"
                      min="40"
                      max="140"
                      value={calcWeight}
                      onChange={(e) => setCalcWeight(Number(e.target.value))}
                      className="calc-range-input"
                    />
                  </div>

                  <div className="calc-slider-item">
                    <div className="slider-header">
                      <span>سن (سال)</span>
                      <strong>{calcAge} سال</strong>
                    </div>
                    <input
                      type="range"
                      min="15"
                      max="75"
                      value={calcAge}
                      onChange={(e) => setCalcAge(Number(e.target.value))}
                      className="calc-range-input"
                    />
                  </div>

                  <div className="calc-slider-item">
                    <div className="slider-header">
                      <span>سطح فعالیت بدنی</span>
                    </div>
                    <select
                      value={calcActivity}
                      onChange={(e) => setCalcActivity(Number(e.target.value))}
                      className="calc-select"
                    >
                      <option value={1.2}>کم‌تحرک (فعالیت روزمره کم)</option>
                      <option value={1.375}>متوسط (۱ تا ۳ روز تمرین در هفته)</option>
                      <option value={1.55}>فعال (۳ تا ۵ روز تمرین ورزشی)</option>
                      <option value={1.725}>بسیار پرتحرک (ورزشکار حرفه‌ای)</option>
                    </select>
                  </div>
                </div>

                {/* Results Screen */}
                <div className="calc-result-box">
                  <div className="result-metric-row">
                    <div className="result-tile">
                      <span className="tile-lbl">شاخص توده بدنی (BMI)</span>
                      <strong className="tile-score">{bmiResult.bmi}</strong>
                      <span className={`tile-tag ${bmiResult.statusClass}`}>
                        {bmiResult.status}
                      </span>
                    </div>

                    <div className="result-tile">
                      <span className="tile-lbl">کالری تثبیت روزانه (TDEE)</span>
                      <strong className="tile-score text-primary">
                        {bmiResult.tdee}
                      </strong>
                      <small className="tile-sub">کیلوکالری در روز</small>
                    </div>
                  </div>

                  <p className="result-note">{bmiResult.message}</p>

                  <div className="calorie-goals-row">
                    <div className="goal-col">
                      <span className="goal-title">هدف چربی‌سوزی</span>
                      <strong className="goal-value text-emerald-500">
                        {bmiResult.fatLossCal} kcal
                      </strong>
                      <small>کالری پیشنهادی کسری</small>
                    </div>

                    <div className="goal-col">
                      <span className="goal-title">هدف افزایش حجم عضلانی</span>
                      <strong className="goal-value text-orange-500">
                        {bmiResult.muscleGainCal} kcal
                      </strong>
                      <small>کالری مازاد پاک</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          HOW IT WORKS (3 STEPS)
      ========================= */}
      <section className="chic-section">
        <div className="container">
          <div className="chic-section-header">
            <span className="chic-section-tag">
              <Sparkles size={14} />
              شروع آسان
            </span>
            <h2 className="chic-section-title">چگونه با فیت‌لند شروع کنیم؟</h2>
            <p className="chic-section-desc">
              تنها در سه قدم، برنامه‌ریزی سلامت و تناسب اندامتان را متحول سازید.
            </p>
          </div>

          <div className="chic-steps-grid">
            <div className="chic-step-card">
              <span className="step-badge-num">۰۱</span>
              <h3 className="step-title">ثبت‌نام و تکمیل پروفایل</h3>
              <p className="step-desc">
                در کمتر از دو دقیقه حساب کاربری بسازید و اهداف ورزشی، قد، وزن و
                سابقه تمرینی خود را وارد کنید.
              </p>
            </div>

            <div className="chic-step-card">
              <span className="step-badge-num">۰۲</span>
              <h3 className="step-title">انتخاب مربی و دریافت برنامه</h3>
              <p className="step-desc">
                از میان مربیان باسابقه فیت‌لند، مربی موردنظر خود را برگزینید تا
                پلن تمرین و رژیم اختصاصی‌تان تدوین شود.
              </p>
            </div>

            <div className="chic-step-card">
              <span className="step-badge-num">۰۳</span>
              <h3 className="step-title">ثبت پیشرفت و مشاهده تحول</h3>
              <p className="step-desc">
                تمرینات روزانه را ثبت کنید، سنجه‌ها را ماهانه به‌روزرسانی نمایید و
                شاهد رشد توان و تغییرات فرم بدنی‌تان باشید.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          MEMBER SUCCESS STORIES
      ========================= */}
      <section className="chic-section chic-testimonials-section">
        <div className="container">
          <div className="chic-section-header">
            <span className="chic-section-tag">
              <Trophy size={14} />
              داستان‌های واقعی موفقیت
            </span>
            <h2 className="chic-section-title">تجربه اعضای واقعی فیت‌لند</h2>
            <p className="chic-section-desc">
              کسانی که با تعهد، نظم و راهنمایی مربیان فیت‌لند به اهداف سلامت و
              اندام خود دست یافتند.
            </p>
          </div>

          <div className="chic-testimonials-grid">
            {successStories.map((story, i) => (
              <div className="chic-testimonial-card" key={i}>
                <div className="testimonial-header">
                  <div
                    className="testimonial-avatar"
                    style={{ background: story.avatarBg }}
                  >
                    {story.name.charAt(0)}
                  </div>
                  <div>
                    <strong className="testimonial-name">{story.name}</strong>
                    <span className="testimonial-role">{story.role}</span>
                  </div>
                </div>

                <div className="testimonial-badge-box">
                  <span className="testimonial-period">{story.period}</span>
                  <strong className="testimonial-result">{story.result}</strong>
                </div>

                <p className="testimonial-quote">«{story.comment}»</p>

                <div className="testimonial-stars">
                  {"★".repeat(5)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================
          FINAL CTA BANNER
      ========================= */}
      <section className="chic-final-cta-section">
        <div className="container">
          <div className="chic-cta-box">
            <div className="cta-left-text">
              <span className="cta-tag">فرصت طلایی تندرستی</span>
              <h2 className="cta-title">آماده‌اید بدن ایده‌آل خود را بسازید؟</h2>
              <p className="cta-desc">
                همین حالا به جمع هزاران ورزشکار فیت‌لند بپیوندید و مسیر حرفه‌ای
                سلامتی و تناسب اندامتان را آغاز کنید.
              </p>
            </div>

            <div className="cta-right-btn">
              <Link to="/register" className="chic-btn chic-btn-light">
                <span>عضویت در فیت‌لند</span>
                <ArrowLeft size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}