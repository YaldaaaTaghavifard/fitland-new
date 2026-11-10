import { useState } from "react";
import { Link } from "react-router-dom";
import { Award, Star, Trophy, Calendar, CheckCircle2 } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { dataService } from "../../services/dataService";

export default function TrainersPage() {
  const { t, formatNumber, isRtl } = useLanguage();
  const [trainers, setTrainers] = useState(() => dataService.getTrainers());
  const [ratedMsg, setRatedMsg] = useState("");

  const handleRate = (trainerId, score) => {
    dataService.rateTrainer(trainerId, score);
    setTrainers(dataService.getTrainers());
    setRatedMsg(`امتیاز ${score} ستاره با موفقیت ثبت شد.`);
    setTimeout(() => setRatedMsg(""), 3500);
  };

  return (
    <div className="page-container trainers-page">
      <section className="page-hero">
        <span className="eyebrow">{t("navTrainers")}</span>
        <h1>با مربیان ارشد و بین‌المللی فیت‌لند آشنا شوید</h1>
        <p>همراهی تخصصی مربیان دارای مدرک رسمی فدراسیون و آکادمی‌های معتبر ورزشی.</p>
      </section>

      {ratedMsg && (
        <div className="notification-toast success">
          <CheckCircle2 size={18} />
          <span>{ratedMsg}</span>
        </div>
      )}

      <section className="trainer-grid">
        {trainers.map((trainer) => (
          <article className="trainer-card" key={trainer.id}>
            {trainer.isTopTrainer && (
              <div className="top-trainer-badge">
                <Trophy size={14} />
                <span>مربی برتر ماه</span>
              </div>
            )}

            <div
              className="trainer-avatar"
              style={{ background: trainer.avatarBg }}
            >
              {trainer.name.charAt(0)}
            </div>

            <h3>{isRtl ? trainer.name : trainer.nameEn}</h3>
            <p className="trainer-specialty">
              {isRtl ? trainer.specialty : trainer.specialtyEn}
            </p>

            <div className="trainer-info">
              <span>
                <Award size={16} />
                {isRtl ? trainer.experience : trainer.experienceEn}
              </span>
              <span>
                <Star size={16} className="text-amber-500 fill-amber-500" />
                {formatNumber(trainer.rating)} ({formatNumber(trainer.reviewsCount)} نظر)
              </span>
            </div>

            {/* Interactive Rating Component */}
            <div className="rate-trainer-strip">
              <small>ثبت امتیاز شما:</small>
              <div className="stars-picker">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="star-btn"
                    onClick={() => handleRate(trainer.id, star)}
                    title={`ثبت ${star} ستاره`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div className="trainer-card-actions">
              <Link to="/classes" className="chic-btn chic-btn-ghost btn-sm w-full">
                <Calendar size={15} />
                <span>مشاهده کلاس‌های مربی</span>
              </Link>
            </div>
          </article>
        ))}
      </section>

      <p className="demo-notice">
        {t("demoNotice")} امتیازها و نظرات در پایگاه داده آزمایشی فیت‌لند به صورت زنده محاسبه می‌شوند.
      </p>
    </div>
  );
}
