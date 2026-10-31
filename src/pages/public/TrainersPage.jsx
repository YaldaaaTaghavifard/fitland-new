
import { Link } from "react-router-dom";
import { Award, Star } from "lucide-react";

const trainers = [
  {
    id: 1,
    name: "آرمان رضایی",
    specialty: "مربی بدنسازی",
    experience: "۸ سال سابقه",
    rating: "۴.۹",
    color: "#FFE1D4"
  },
  {
    id: 2,
    name: "سارا محمدی",
    specialty: "مربی فیتنس و هوازی",
    experience: "۶ سال سابقه",
    rating: "۴.۸",
    color: "#E9E2FF"
  },
  {
    id: 3,
    name: "علی کریمی",
    specialty: "مربی قدرتی",
    experience: "۱۰ سال سابقه",
    rating: "۴.۹",
    color: "#DDF2E8"
  },
  {
    id: 4,
    name: "نگار احمدی",
    specialty: "مربی یوگا",
    experience: "۵ سال سابقه",
    rating: "۴.۷",
    color: "#FFF0D6"
  }
];

function TrainersPage() {
  return (
    <div className="page-container">
      <section className="page-hero">
        <span className="eyebrow">تیم تخصصی ما</span>
        <h1>با مربیان حرفه‌ای آشنا شو</h1>
        <p>برای رسیدن به اهداف ورزشی، همراه مناسبی انتخاب کن.</p>
      </section>

      <section className="trainer-grid">
        {trainers.map((trainer) => (
          <article className="trainer-card" key={trainer.id}>
            <div
              className="trainer-avatar"
              style={{ backgroundColor: trainer.color }}
            >
              {trainer.name.charAt(0)}
            </div>

            <h3>{trainer.name}</h3>
            <p>{trainer.specialty}</p>

            <div className="trainer-info">
              <span><Award size={16} /> {trainer.experience}</span>
              <span><Star size={16} /> {trainer.rating}</span>
            </div>

            <Link to="/register" className="outline-button">
              شروع همکاری
            </Link>
          </article>
        ))}
      </section>

      <p className="demo-notice">
        مربیان و امتیازهای این صفحه داده‌های نمونه هستند.
      </p>
    </div>
  );
}

export default TrainersPage;
