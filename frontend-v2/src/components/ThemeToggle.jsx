import { useTheme } from "../context/ThemeContext";
import "../css/theme-toggle.css";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === "light";

  return (
    <button
      className={`theme-toggle ${isLight ? "theme-toggle--light" : "theme-toggle--dark"}`}
      onClick={toggleTheme}
      aria-label={`Switch to ${isLight ? "dark" : "light"} mode`}
      title={`Switch to ${isLight ? "dark" : "light"} mode`}
      type="button"
    >
      <div className="theme-toggle__track">
        <span className="theme-toggle__icon theme-toggle__icon--sun" aria-hidden="true">
          ☀️
        </span>
        <span className="theme-toggle__icon theme-toggle__icon--moon" aria-hidden="true">
          🌙
        </span>
        <div className="theme-toggle__thumb" />
      </div>
    </button>
  );
}
