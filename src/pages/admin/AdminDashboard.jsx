import { useState, useMemo } from "react";
import {
  Users,
  UserRound,
  Wallet,
  CalendarDays,
  Package,
  TrendingUp,
  Search,
  CheckCircle2,
} from "lucide-react";
import { storageService } from "../../services/storageService";

const stats = [
  { title: "تعداد اعضا", value: "۲۴۰ نفر", icon: Users },
  { title: "تعداد مربیان", value: "۱۲ نفر", icon: UserRound },
  { title: "درآمد نمایشی", value: "۸۵ میلیون", icon: Wallet },
  { title: "رزروهای ماه", value: "۱۸۶ مورد", icon: CalendarDays },
  { title: "محصولات فروشگاه", value: "۴۸ محصول", icon: Package },
  { title: "رشد اعضا", value: "۱۲٪", icon: TrendingUp }
];

const plansOverview = [
  { name: "طرح ماهانه", price: "۱,۲۰۰,۰۰۰ تومان", activeCount: 110, duration: "۳۰ روز" },
  { name: "طرح سه‌ماهه (ویژه)", price: "۳,۲۰۰,۰۰۰ تومان", activeCount: 95, duration: "۹۰ روز" },
  { name: "طرح سالانه VIP", price: "۱۰,۸۰۰,۰۰۰ تومان", activeCount: 35, duration: "۳۶۵ روز" },
];

const mockProducts = [
  { id: 1, name: "دمبل قابل تنظیم", category: "تجهیزات", price: "۱,۸۵۰,۰۰۰ تومان", stock: 14 },
  { id: 2, name: "مت یوگا", category: "لوازم ورزشی", price: "۶۵۰,۰۰۰ تومان", stock: 28 },
  { id: 3, name: "قمقمه ورزشی", category: "لوازم جانبی", price: "۳۲۰,۰۰۰ تومان", stock: 45 },
  { id: 4, name: "کش تمرینی", category: "تجهیزات", price: "۲۸۰,۰۰۰ تومان", stock: 60 },
  { id: 5, name: "طناب ورزشی", category: "لوازم جانبی", price: "۱۹۰,۰۰۰ تومان", stock: 32 },
  { id: 6, name: "دستکش بدنسازی", category: "لوازم ورزشی", price: "۴۹۰,۰۰۰ تومان", stock: 22 },
];

function AdminDashboard({ section = "overview" }) {
  const [searchTerm, setSearchTerm] = useState("");
  const users = useMemo(() => storageService.getUsers(), []);

  const filteredUsers = useMemo(() => {
    if (!searchTerm.trim()) return users;
    const term = searchTerm.toLowerCase();
    return users.filter(
      (u) =>
        u.name?.toLowerCase().includes(term) ||
        u.email?.toLowerCase().includes(term) ||
        u.phone?.includes(term)
    );
  }, [users, searchTerm]);

  const roleLabels = {
    member: "عضو",
    trainer: "مربی",
    admin: "مدیر",
  };

  if (section === "users") {
    return (
      <div>
        <div className="dashboard-welcome">
          <h2>مدیریت کاربران</h2>
          <p>مشاهده و مدیریت کاربران، مربیان و مدیران سیستم</p>
        </div>

        <div className="store-toolbar" style={{ marginBottom: "1.5rem" }}>
          <div className="search-box">
            <Search size={19} />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="جست‌وجوی نام، ایمیل یا موبایل..."
            />
          </div>
        </div>

        <div className="member-table-wrapper">
          <table className="member-table">
            <thead>
              <tr>
                <th>نام</th>
                <th>نقش</th>
                <th>ایمیل</th>
                <th>شماره موبایل</th>
                <th>تاریخ عضویت</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u.id}>
                  <td><strong>{u.name}</strong></td>
                  <td>
                    <span className={`member-status ${u.role === "admin" ? "status-danger" : u.role === "trainer" ? "status-warning" : "status-success"}`}>
                      {roleLabels[u.role] || u.role}
                    </span>
                  </td>
                  <td>{u.email}</td>
                  <td>{u.phone || "—"}</td>
                  <td>{u.createdAt ? u.createdAt.slice(0, 10) : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (section === "memberships") {
    return (
      <div>
        <div className="dashboard-welcome">
          <h2>مدیریت اشتراک‌ها</h2>
          <p>بررسی وضعیت پلن‌های عضویت و کاربران فعال</p>
        </div>

        <div className="dashboard-stats">
          <article className="stat-card">
            <div className="stat-icon"><Users size={23} /></div>
            <span>کل اشتراک‌های فعال</span>
            <strong>۲۴۰ نفر</strong>
          </article>
          <article className="stat-card">
            <div className="stat-icon"><CheckCircle2 size={23} /></div>
            <span>تمدید در ماه جاری</span>
            <strong>۴۲ مورد</strong>
          </article>
          <article className="stat-card">
            <div className="stat-icon"><Wallet size={23} /></div>
            <span>درآمد اشتراک‌ها</span>
            <strong>۶۴ میلیون تومان</strong>
          </article>
        </div>

        <div className="member-table-wrapper" style={{ marginTop: "1.5rem" }}>
          <table className="member-table">
            <thead>
              <tr>
                <th>نام طرح</th>
                <th>مدت اعتبار</th>
                <th>قیمت</th>
                <th>تعداد اعضای فعال</th>
              </tr>
            </thead>
            <tbody>
              {plansOverview.map((plan, idx) => (
                <tr key={idx}>
                  <td><strong>{plan.name}</strong></td>
                  <td>{plan.duration}</td>
                  <td>{plan.price}</td>
                  <td>{plan.activeCount} نفر</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (section === "products") {
    return (
      <div>
        <div className="dashboard-welcome">
          <h2>مدیریت محصولات فروشگاه</h2>
          <p>موجودی و قیمت کالاهای ورزشی فروشگاه فیت‌لند</p>
        </div>

        <div className="member-table-wrapper">
          <table className="member-table">
            <thead>
              <tr>
                <th>شناسه</th>
                <th>نام محصول</th>
                <th>دسته‌بندی</th>
                <th>قیمت</th>
                <th>موجودی انبار</th>
              </tr>
            </thead>
            <tbody>
              {mockProducts.map((p) => (
                <tr key={p.id}>
                  <td>#{p.id}</td>
                  <td><strong>{p.name}</strong></td>
                  <td>{p.category}</td>
                  <td>{p.price}</td>
                  <td>{p.stock} عدد</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

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

