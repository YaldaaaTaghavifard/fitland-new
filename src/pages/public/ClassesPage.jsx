import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  Clock,
  Users,
  CheckCircle2,
  AlertCircle,
  Dumbbell,
  ArrowLeft,
  ArrowRight,
  Filter,
} from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { useAuth } from "../../context/AuthContext";
import { dataService } from "../../services/dataService";

export default function ClassesPage() {
  const { t, formatCurrency, formatNumber, isRtl } = useLanguage();
  const { user } = useAuth();

  const [classes, setClasses] = useState(() => dataService.getClasses());
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [notification, setNotification] = useState(null); // { type: 'success' | 'error', message: string }

  const categories = [
    { id: "all", nameFa: "همه کلاس‌ها", nameEn: "All Classes" },
    { id: "قدرتی و هوازی", nameFa: "قدرتی و هوازی", nameEn: "Strength & Cardio" },
    { id: "هوازی", nameFa: "هوازی (HIIT)", nameEn: "Cardio & HIIT" },
    { id: "انعطاف و آرامش", nameFa: "یوگا و انعطاف", nameEn: "Yoga & Flexibility" },
    { id: "اصلاحی", nameFa: "حرکات اصلاحی", nameEn: "Rehabilitation" },
  ];

  const filteredClasses = useMemo(() => {
    if (selectedCategory === "all") return classes;
    return classes.filter((c) => c.category === selectedCategory);
  }, [classes, selectedCategory]);

  const handleBook = (cls) => {
    if (!user) {
      setNotification({
        type: "error",
        message: isRtl
          ? "برای رزرو کلاس، لطفاً ابتدا وارد حساب کاربری خود شوید."
          : "Please log in to your account to book a class session.",
      });
      return;
    }

    const res = dataService.bookClass(
      user.id,
      user.name || "ورزشکار فیت‌لند",
      cls.id
    );

    if (res.success) {
      setClasses(dataService.getClasses());
      setNotification({
        type: "success",
        message: isRtl
          ? `کلاس «${cls.title}» با موفقیت برای شما در تاریخ ${cls.date} ساعت ${cls.time} رزرو شد.`
          : `Session "${cls.titleEn || cls.title}" booked successfully for ${cls.date} at ${cls.time}.`,
      });
    } else {
      setNotification({
        type: "error",
        message: res.message,
      });
    }

    // Auto dismiss
    setTimeout(() => setNotification(null), 6000);
  };

  return (
    <div className="page-container classes-page">
      <section className="page-hero">
        <span className="eyebrow">{t("classesTitle")}</span>
        <h1>{t("classesTitle")}</h1>
        <p>{t("classesSubtitle")}</p>
      </section>

      {/* Notification Toast */}
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

      {/* Category filter bar */}
      <div className="classes-filter-bar">
        <div className="filter-label">
          <Filter size={16} />
          <span>{t("filterCategory")}:</span>
        </div>
        <div className="filter-chips">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`filter-chip ${selectedCategory === cat.id ? "active" : ""}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              {isRtl ? cat.nameFa : cat.nameEn}
            </button>
          ))}
        </div>
      </div>

      {/* Classes Grid */}
      <div className="classes-grid">
        {filteredClasses.map((cls) => {
          const isFull = cls.reserved >= cls.capacity;
          const spotsLeft = cls.capacity - cls.reserved;

          return (
            <div className="class-card" key={cls.id}>
              <div className="class-card-header">
                <span className="class-category-badge">{cls.category}</span>
                <span className={`class-capacity-chip ${isFull ? "full" : ""}`}>
                  {isFull ? (
                    "تکمیل ظرفیت"
                  ) : (
                    `${formatNumber(spotsLeft)} صندلی خالی`
                  )}
                </span>
              </div>

              <h3 className="class-title">
                {isRtl ? cls.title : cls.titleEn || cls.title}
              </h3>
              <p className="class-desc">
                {isRtl ? cls.description : cls.descriptionEn || cls.description}
              </p>

              <div className="class-meta-grid">
                <div className="meta-item">
                  <Dumbbell size={16} />
                  <span>{t("trainer")}: {cls.trainerName}</span>
                </div>
                <div className="meta-item">
                  <CalendarDays size={16} />
                  <span>{t("date")}: {cls.date}</span>
                </div>
                <div className="meta-item">
                  <Clock size={16} />
                  <span>{t("time")}: ساعت {cls.time} ({cls.durationMinutes} دقیقه)</span>
                </div>
                <div className="meta-item">
                  <Users size={16} />
                  <span>ظرفیت: {formatNumber(cls.reserved)} از {formatNumber(cls.capacity)} نفر</span>
                </div>
              </div>

              <div className="class-card-footer">
                <div className="class-price">
                  <strong>{formatCurrency(cls.price)}</strong>
                  <small>هر جلسه</small>
                </div>

                <div className="class-actions">
                  <Link
                    to={`/classes/${cls.id}`}
                    className="chic-btn chic-btn-ghost btn-sm"
                  >
                    <span>{t("details")}</span>
                    {isRtl ? <ArrowLeft size={14} /> : <ArrowRight size={14} />}
                  </Link>

                  <button
                    type="button"
                    className="chic-btn chic-btn-primary btn-sm"
                    disabled={isFull}
                    onClick={() => handleBook(cls)}
                  >
                    <span>{isFull ? "تکمیل" : t("bookClass")}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
