
import {
  Users,
  UserRound,
  Wallet,
  CalendarDays,
  Package,
  TrendingUp
} from "lucide-react";

const stats = [
  { title: "تعداد اعضا", value: "۲۴۰ نفر", icon: Users },
  { title: "تعداد مربیان", value: "۱۲ نفر", icon: UserRound },
  { title: "درآمد نمایشی", value: "۸۵ میلیون", icon: Wallet },
  { title: "رزروهای ماه", value: "۱۸۶ مورد", icon: CalendarDays },
  { title: "محصولات فروشگاه", value: "۴۸ محصول", icon: Package },
  { title: "رشد اعضا", value: "۱۲٪", icon: TrendingUp }
];

function AdminDashboard() {
  return (
    <div>
      <div className="dashboard-welcome">
        <h2>مدیریت فیت‌لند</h2>
        <p>نمای کلی عملکرد سامانه را مشاهده کن.</p>
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
        <h3>وظایف مدیریتی</h3>
        <ul className="activity-list">
          <li>مدیریت اعضا و مربیان</li>
          <li>مدیریت اشتراک‌ها و پرداخت‌ها</li>
          <li>بررسی گزارش کاربران بدون فعالیت ثبت‌شده</li>
          <li>مدیریت کلاس‌ها و رزروها</li>
          <li>بررسی فروش محصولات</li>
          <li>تهیه گزارش عملکرد ماهانه</li>
        </ul>
      </div>

      <p className="demo-notice">
        اعداد این داشبورد داده‌های نمونه هستند و آمار واقعی باشگاه نیستند.
      </p>
    </div>
  );
}

export default AdminDashboard;
