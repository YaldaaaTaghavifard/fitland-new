import { useState } from "react";
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
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Award,
  Layers,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import ThemeToggle from "../common/ThemeToggle";
import LanguageToggle from "../common/LanguageToggle";

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t, isRtl, dir } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const role = user?.role || "member";

  const roleTitles = {
    member: t("roleMember"),
    trainer: t("roleTrainer"),
    admin: t("roleAdmin"),
  };

  const ChevronIcon = isRtl ? ChevronLeft : ChevronRight;

  const menuItems = {
    member: [
      {
        title: t("myProfile"),
        path: "/member",
        icon: LayoutDashboard,
        end: true,
      },
      {
        title: t("myTraining"),
        path: "/member/training",
        icon: Dumbbell,
      },
      {
        title: t("myNutrition"),
        path: "/member/nutrition",
        icon: Activity,
      },
      {
        title: t("myMeasurements"),
        path: "/member/measurements",
        icon: Activity,
      },
      {
        title: t("myBookings"),
        path: "/member/bookings",
        icon: CalendarDays,
      },
      {
        title: t("myPayments"),
        path: "/member/payments",
        icon: CreditCard,
      },
      {
        title: t("navClasses"),
        path: "/classes",
        icon: CalendarDays,
      },
      {
        title: t("navStore"),
        path: "/store",
        icon: ShoppingBag,
      },
    ],

    trainer: [
      {
        title: t("trainerDashboard"),
        path: "/trainer",
        icon: LayoutDashboard,
        end: true,
      },
      {
        title: t("assignedMembers"),
        path: "/trainer/members",
        icon: UserRound,
      },
      {
        title: t("scheduleCalendar"),
        path: "/trainer/calendar",
        icon: CalendarDays,
      },
      {
        title: t("trainerReports"),
        path: "/trainer/reports",
        icon: Activity,
      },
      {
        title: t("navClasses"),
        path: "/classes",
        icon: CalendarDays,
      },
    ],

    admin: [
      {
        title: t("adminDashboard"),
        path: "/admin",
        icon: LayoutDashboard,
        end: true,
      },
      {
        title: t("userManagement"),
        path: "/admin/users",
        icon: UserRound,
      },
      {
        title: t("membershipManagement"),
        path: "/admin/memberships",
        icon: CreditCard,
      },
      {
        title: t("productManagement"),
        path: "/admin/products",
        icon: ShoppingBag,
      },
      {
        title: t("navBusinessCase"),
        path: "/business-case",
        icon: Layers,
      },
    ],
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const links = menuItems[role] || [];

  return (
    <div className="dashboard-layout" dir={dir}>
      {/* Mobile backdrop */}
      {mobileMenuOpen && (
        <div
          className="dashboard-mobile-backdrop"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside className={`dashboard-sidebar ${mobileMenuOpen ? "open" : ""}`}>
        <div className="dashboard-brand">
          <div className="dashboard-brand-icon">
            <Dumbbell size={24} />
          </div>

          <div className="dashboard-brand-text">
            <strong>FITLAND</strong>
            <span>{roleTitles[role] || "پنل کاربری"}</span>
          </div>

          <button
            type="button"
            className="dashboard-mobile-close"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="بستن منو"
          >
            <X size={20} />
          </button>
        </div>

        <div className="dashboard-user">
          <div className="dashboard-user-avatar">
            <UserRound size={22} />
          </div>

          <div className="dashboard-user-info">
            <strong>{user?.name || "کاربر فیت‌لند"}</strong>
            <span>{user?.email || "user@fitland.ir"}</span>
          </div>
        </div>

        <nav className="dashboard-menu">
          <span className="dashboard-menu-label">
            {isRtl ? "منوی اصلی دسترسی" : "Main Navigation"}
          </span>

          {links.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `dashboard-menu-link ${isActive ? "active" : ""}`
                }
              >
                <div className="menu-link-lead">
                  <Icon size={18} />
                  <span>{item.title}</span>
                </div>
                <ChevronIcon size={15} className="menu-chevron" />
              </NavLink>
            );
          })}
        </nav>

        <div className="dashboard-sidebar-bottom">
          <NavLink
            to="/"
            className="dashboard-menu-link site-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="menu-link-lead">
              <Home size={18} />
              <span>{t("navHome")}</span>
            </div>
            <ChevronIcon size={15} className="menu-chevron" />
          </NavLink>

          <button
            type="button"
            className="dashboard-menu-link dashboard-logout"
            onClick={handleLogout}
          >
            <div className="menu-link-lead">
              <LogOut size={18} />
              <span>{t("navLogout")}</span>
            </div>
          </button>
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-topbar">
          <div className="topbar-right">
            <button
              type="button"
              className="dashboard-mobile-toggle"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="باز کردن منو"
            >
              <Menu size={22} />
            </button>
            <div className="topbar-greeting">
              <span className="greeting-sub">{t("systemHealthy")}</span>
              <h1 className="greeting-title">
                {isRtl ? `سلام، ${user?.name || "ورزشکار عزیز"} 👋` : `Hello, ${user?.name || "Athlete"} 👋`}
              </h1>
            </div>
          </div>

          <div className="topbar-actions">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </header>

        <div className="dashboard-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
