import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  Menu,
  X,
  Dumbbell,
  UserRound,
  Briefcase,
  Calendar,
} from "lucide-react";
import ThemeToggle from "../common/ThemeToggle";
import LanguageToggle from "../common/LanguageToggle";
import { useLanguage } from "../../context/LanguageContext";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { t, isRtl } = useLanguage();
  const { user } = useAuth();

  const navigation = [
    { title: t("navHome"), path: "/" },
    { title: t("navAbout"), path: "/about" },
    { title: t("navPlans"), path: "/plans" },
    { title: t("navTrainers"), path: "/trainers" },
    { title: t("navClasses"), path: "/classes" },
    { title: t("navStore"), path: "/store" },
    {
      title: t("navBusinessCase"),
      path: "/business-case",
      badge: isRtl ? "پروژه دانشگاهی" : "Case Study",
    },
  ];

  const dashboardPath = user?.role === "admin"
    ? "/admin"
    : user?.role === "trainer"
    ? "/trainer"
    : "/member";

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="brand">
          <span className="brand-icon">
            <Dumbbell size={24} />
          </span>
          <span className="brand-name">
            Fit<span>Land</span>
          </span>
        </Link>

        <nav className={`nav-links ${menuOpen ? "active" : ""}`}>
          {navigation.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                isActive ? "nav-link selected" : "nav-link"
              }
            >
              <span>{item.title}</span>
              {item.badge && <span className="nav-academic-chip">{item.badge}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="navbar-actions">
          <LanguageToggle />
          <ThemeToggle />

          {user ? (
            <Link to={dashboardPath} className="btn btn-primary navbar-dashboard-btn">
              <UserRound size={16} />
              <span>{t("navDashboard")}</span>
            </Link>
          ) : (
            <>
              <Link to="/login" className="login-link">
                <UserRound size={17} />
                <span>{t("navLogin")}</span>
              </Link>

              <Link to="/register" className="btn btn-primary navbar-register">
                <span>{t("navRegister")}</span>
              </Link>
            </>
          )}
        </div>

        <button
          className="mobile-menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="باز و بسته کردن منو"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </header>
  );
}