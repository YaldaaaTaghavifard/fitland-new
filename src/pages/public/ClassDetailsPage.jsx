import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  CalendarDays,
  Clock,
  Users,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { useAuth } from "../../context/AuthContext";
import { dataService } from "../../services/dataService";

export default function ClassDetailsPage() {
  const { id } = useParams();
  const { t, formatCurrency, formatNumber, isRtl } = useLanguage();
  const { user } = useAuth();

  const [cls, setCls] = useState(() => dataService.getClassById(id));
  const [notification, setNotification] = useState(null);

  if (!cls) {
    return (
      <div className="page-container text-center py-16">
        <h2>کلاس موردنظر یافت نشد.</h2>
        <Link to="/classes" className="chic-btn chic-btn-primary mt-4">
          بازگشت به لیست کلاس‌ها
        </Link>
      </div>
    );
  }

  const trainer = dataService.getTrainerById(cls.trainerId);
  const isFull = cls.reserved >= cls.capacity;
  const spotsLeft = cls.capacity - cls.reserved;

  const handleBook = () => {
    if (!user) {
      setNotification({
        type: "error",
        message: isRtl
          ? "برای رزرو کلاس، لطفاً ابتدا وارد حساب کاربری خود شوید."
          : "Please log in to book a session.",
      });
      return;
    }

    const res = dataService.bookClass(
      user.id,
      user.name || "ورزشکار فیت‌لند",
      cls.id
    );

    if (res.success) {
      setCls(dataService.getClassById(cls.id));
      setNotification({
        type: "success",
        message: isRtl
          ? `کلاس «${cls.title}» با موفقیت برای شما ثبت شد.`
          : `Session booked successfully.`,
      });
    } else {
      setNotification({
        type: "error",
        message: res.message,
      });
    }

    setTimeout(() => setNotification(null), 6000);
  };

  return (
    <div className="page-container class-details-page">
      <div className="back-link-wrapper">
        <Link to="/classes" className="back-link">
          {isRtl ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
          <span>بازگشت به همه کلاس‌ها</span>
        </Link>
      </div>

      {notification && (
        <div className={`notification-toast ${notification.type}`}>
          {notification.type === "success" ? (
            <CheckCircle2 size={20} className="shrink-0" />
          ) : (
            <AlertCircle size={20} className="shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      <div className="class-details-layout">
        <div className="class-main-col">
          <span className="class-category-badge">{cls.category}</span>
          <h1 className="class-main-title">
            {isRtl ? cls.title : cls.titleEn || cls.title}
          </h1>
          <p className="class-main-desc">
            {isRtl ? cls.description : cls.descriptionEn || cls.description}
          </p>

          <div className="class-syllabus-box">
            <h3>اهداف و سرفصل‌های تمرینی این کلاس:</h3>
            <ul className="bullet-list">
              <li>گرم‌کردن پویا و فعال‌سازی مفاصل آسیب‌پذیر (۱۰ دقیقه)</li>
              <li>آموزش بیومکانیک و اجرای تکنیک صحیح حرکات پایه (۱۵ دقیقه)</li>
              <li>بخش اصلی با سیستم تمرینی فواصل پرشدت و وزنه (۲۵ دقیقه)</li>
              <li>سرد کردن، کشش ایستایی و تنفس دیافراگمی جهت ریکاوری سریع (۱۰ دقیقه)</li>
            </ul>
          </div>

          <div className="class-equipment-box">
            <h3>تجهیزات موردنیاز ورزشکار:</h3>
            <p>
              کفش ورزشی سالنی تمیز، قمقمه آب، حوله شخصی و لباس ورزشی راحت. کلیه وزنه‌ها، کش‌ها و مت‌ها توسط باشگاه فیت‌لند تامین می‌شود.
            </p>
          </div>
        </div>

        <div className="class-sidebar-col">
          <div className="booking-summary-card">
            <div className="price-tag-big">
              <strong>{formatCurrency(cls.price)}</strong>
              <small>هزینه هر جلسه</small>
            </div>

            <div className="class-specs-list">
              <div className="spec-item">
                <CalendarDays size={18} />
                <div>
                  <small>تاریخ برگزاری</small>
                  <strong>{cls.date}</strong>
                </div>
              </div>

              <div className="spec-item">
                <Clock size={18} />
                <div>
                  <small>ساعت و مدت</small>
                  <strong>ساعت {cls.time} ({cls.durationMinutes} دقیقه)</strong>
                </div>
              </div>

              <div className="spec-item">
                <Users size={18} />
                <div>
                  <small>ظرفیت کلاس ({formatNumber(spotsLeft)} صندلی خالی)</small>
                  <strong>{formatNumber(cls.reserved)} از {formatNumber(cls.capacity)} نفر</strong>
                </div>
              </div>
            </div>

            <button
              type="button"
              className="chic-btn chic-btn-primary w-full mt-4"
              disabled={isFull}
              onClick={handleBook}
            >
              <span>{isFull ? "تکمیل ظرفیت" : t("bookClass")}</span>
            </button>

            <p className="booking-guarantee">
              ✓ قابلیت لغو تا ۳ ساعت قبل از شروع جلسه بدون کسر هزینه
            </p>
          </div>

          {trainer && (
            <div className="trainer-mini-profile">
              <div
                className="trainer-mini-avatar"
                style={{ background: trainer.avatarBg }}
              >
                {trainer.name.charAt(0)}
              </div>
              <div className="trainer-mini-info">
                <strong>{trainer.name}</strong>
                <span>{trainer.specialty}</span>
                <small>⭐ {trainer.rating} ({formatNumber(trainer.reviewsCount)} نظر)</small>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
