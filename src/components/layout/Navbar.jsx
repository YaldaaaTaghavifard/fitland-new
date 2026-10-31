import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  Menu,
  X,
  Dumbbell,
  UserRound,
  ChevronDown,
} from "lucide-react";

const navigation = [
  { title: "صفحه اصلی", path: "/" },
  { title: "درباره ما", path: "/about" },
  { title: "برنامه‌ها", path: "/plans" },
  { title: "مربیان", path: "/trainers" },
  { title: "فروشگاه", path: "/store" },
];

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

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
              {item.title}
            </NavLink>
          ))}
        </nav>

        <div className="navbar-actions">
          <Link to="/login" className="login-link">
            <UserRound size={18} />
            ورود
          </Link>

          <Link to="/register" className="btn btn-primary navbar-register">
            عضویت در فیت‌لند
          </Link>
        </div>

        <button
          className="mobile-menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="باز و بسته کردن منو"
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
      </div>
    </header>
  );
}

export default Navbar;