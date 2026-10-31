
import {
  Users,
  CalendarDays,
  ClipboardList,
  Star
} from "lucide-react";

const stats = [
  { title: "اعضای تحت نظر", value: "۱۸ نفر", icon: Users },
  { title: "جلسات امروز", value: "۵ جلسه", icon: CalendarDays },
  { title: "برنامه‌های فعال", value: "۱۲ برنامه", icon: ClipboardList },
  { title: "امتیاز مربی", value: "۴.۹ از ۵", icon: Star }
];

function TrainerDashboard() {
  return (
    <div>
      <div className="dashboard-welcome">
        <h2>پنل مربی</h2>
        <p>وضعیت اعضا و فعالیت‌های مربیگری خود را بررسی کن.</p>
      </div>

      <div className="dashboard-stats">
        {stats.map((item, index) => {
          const Icon = item.icon;

          return (
            <article className="stat-card" key={index}>
              <div className="stat-icon">
                <Icon size={23} />
              </div>
              <span>{item.title}</span>
              <strong>{item.value}</strong>
            </article>
          );
        })}
      </div>

      <div className="dashboard-panel">
        <h3>وظایف مربی</h3>
        <ul className="activity-list">
          <li>بررسی وضعیت اعضای تحت نظر</li>
          <li>به‌روزرسانی برنامه‌های تمرینی</li>
          <li>بررسی رزروهای جلسات</li>
          <li>پیگیری اعضای بدون فعالیت ثبت‌شده در سیستم</li>
          <li>بررسی گزارش ماهانه عملکرد</li>
        </ul>
      </div>
    </div>
  );
}

export default TrainerDashboard;
