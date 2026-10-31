import { Outlet, NavLink, useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  LogOut,
  Dumbbell,
  Home,
  UserRound,
  CalendarDays,
  CreditCard,
  Activity,
  ShoppingBag,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const role = user?.role;

  const roleTitles = {
    member: "پنل اعضا",
    trainer: "پنل مربی",
    admin: "پنل مدیریت",
  };

  const menuItems = {
    member: [
      {
        title: "داشبورد",
        path: "/member",
        icon: LayoutDashboard,
        end: true,
      },
      {
        title: "پروفایل من",
        path: "/member/profile",
        icon: UserRound,
      },
      {
        title: "برنامه تمرینی",
        path: "/member/training",
        icon: Dumbbell,
      },
      {
        title: "برنامه غذایی",
        path: "/member/nutrition",
        icon: Activity,
      },
      {
        title: "رزرو جلسات",
        path: "/member/bookings",
        icon: CalendarDays,
      },
      {
        title: "پرداخت‌ها",
        path: "/member/payments",
        icon: CreditCard,
      },
      {
        title: "فروشگاه",
        path: "/store",
        icon: ShoppingBag,
      },
    ],

    trainer: [
      {
        title: "داشبورد",
        path: "/trainer",
        icon: LayoutDashboard,
        end: true,
      },
      {
        title: "اعضای من",
        path: "/trainer/members",
        icon: UserRound,
      },
      {
        label: "تقویم و زمان‌بندی",
        path: "/trainer/calendar",
        icon: CalendarDays,
      },
      {
        label: "گزارش عملکرد",
        path: "/trainer/reports",
        icon: Activity,
      },
    ],

    admin: [
      {
        title: "داشبورد",
        path: "/admin",
        icon: LayoutDashboard,
        end: true,
      },
      {
        title: "مدیریت کاربران",
        path: "/admin/users",
        icon: UserRound,
      },
      {
        title: "مدیریت اشتراک‌ها",
        path: "/admin/memberships",
        icon: CreditCard,
      },
      {
        title: "مدیریت محصولات",
        path: "/admin/products",
        icon: ShoppingBag,
      },
    ],
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const links = menuItems[role] || [];

  return (
    <div className="dashboard-layout" dir="rtl">
      <aside className="dashboard-sidebar">
        <div className="dashboard-brand">
          <div className="dashboard-brand-icon">
            <Dumbbell size={25} />
          </div>

          <div>
            <strong>FITLAND</strong>
            <span>{roleTitles[role] || "پنل کاربری"}</span>
          </div>
        </div>

        <div className="dashboard-user">
          <div className="dashboard-user-avatar">
            <UserRound size={24} />
          </div>

          <div>
            <strong>{user?.name || "کاربر فیت‌لند"}</strong>
            <span>{user?.email}</span>
          </div>
        </div>

        <nav className="dashboard-menu">
          <span className="dashboard-menu-label">منوی اصلی</span>

          {links.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `dashboard-menu-link ${isActive ? "active" : ""}`
                }
              >
                <Icon size={19} />
                <span>{item.title}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="dashboard-sidebar-bottom">
          <NavLink to="/" className="dashboard-menu-link">
            <Home size={19} />
            <span>صفحه اصلی سایت</span>
          </NavLink>

          <button
            type="button"
            className="dashboard-menu-link dashboard-logout"
            onClick={handleLogout}
          >
            <LogOut size={19} />
            <span>خروج از حساب</span>
          </button>
        </div>
      </aside>

      <main className="dashboard-main">
        <div className="dashboard-topbar">
          <div>
            <span>به فیت‌لند خوش آمدید</span>
          </div>
        </div>

        <div className="dashboard-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
