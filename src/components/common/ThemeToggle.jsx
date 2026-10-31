import { useTheme } from "../../context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={isDark ? "فعال کردن تم روشن" : "فعال کردن تم تاریک"}
      title={isDark ? "حالت روشن" : "حالت تاریک"}
    >
      <span className="theme-toggle-icon">
        {isDark ? "☀" : "☾"}
      </span>

      <span className="theme-toggle-label">
        {isDark ? "حالت روشن" : "حالت تاریک"}
      </span>
    </button>
  );
}