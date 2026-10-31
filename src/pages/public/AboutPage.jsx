
import { Target, Heart, ShieldCheck, Users } from "lucide-react";

const values = [
  {
    icon: Target,
    title: "هدف‌گذاری هوشمند",
    text: "برای هر عضو مسیر مشخصی بر اساس اهداف ورزشی او تعریف می‌کنیم."
  },
  {
    icon: Heart,
    title: "سلامت و تندرستی",
    text: "توجه به پیشرفت مستمر و ایجاد عادت‌های سالم در زندگی."
  },
  {
    icon: ShieldCheck,
    title: "اعتماد و شفافیت",
    text: "اطلاعات عضویت، پرداخت‌ها و برنامه‌ها به‌صورت شفاف قابل مشاهده هستند."
  },
  {
    icon: Users,
    title: "همراهی مربیان",
    text: "ارتباط مؤثر اعضا و مربیان برای پیگیری بهتر روند پیشرفت."
  }
];

function AboutPage() {
  return (
    <div className="page-container">
      <section className="page-hero">
        <span className="eyebrow">درباره فیت‌لند</span>
        <h1>مسیر سلامتی، با <span>فیت‌لند</span></h1>
        <p>
          فیت‌لند یک بستر دیجیتال برای مدیریت تجربه ورزشی،
          ارتباط اعضا و مربیان و پیگیری پیشرفت افراد است.
        </p>
      </section>

      <section className="about-content">
        <div>
          <h2>ما چه کاری انجام می‌دهیم؟</h2>
          <p>
            در فیت‌لند تلاش می‌کنیم خدمات باشگاه ورزشی را
            در یک محیط یکپارچه ارائه دهیم؛ از مشاهده کلاس‌ها
            و رزرو جلسات تا دریافت برنامه تمرینی، بررسی
            پیشرفت و خرید محصولات ورزشی.
          </p>
        </div>

        <div className="about-highlight">
          <strong>FitLand</strong>
          <span>یک تجربه یکپارچه برای ورزش و تندرستی</span>
        </div>
      </section>

      <section className="values-section">
        <h2>ارزش‌های اصلی ما</h2>
        <div className="feature-grid">
          {values.map((item, index) => {
            const Icon = item.icon;
            return (
              <article className="feature-card" key={index}>
                <Icon size={28} />
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export default AboutPage;
