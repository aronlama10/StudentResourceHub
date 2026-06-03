import { NavLink, useNavigate } from "react-router-dom";
import "../../css/dashboard/sidebar.css";

const navItems = [
  { label: "Dashboard", path: "/dashboard", icon: "🏠" },
  { label: "Resources", path: "/dashboard/resources", icon: "📗" },
  { label: "Upload", path: "/dashboard/upload", icon: "⬆️" },
  { label: "My Resources", path: "/dashboard/my-resources", icon: "📚" },
  { label: "Profile", path: "/dashboard/profile", icon: "👤" },
];

function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // clear token/session here
    navigate("/auth");
  };

  return (
    <aside className={`sidebar ${isOpen ? "sidebar--open" : ""}`}>
      <div className="sidebar__top">
        <div className="sidebar__brand">
          <span className="sidebar__logo">Student Hub</span>
          <span className="sidebar__tag">Dashboard</span>
        </div>
        <button
          className="sidebar__close-btn"
          onClick={onClose}
          aria-label="Close sidebar"
        >
          ✕
        </button>
      </div>
      <nav className="sidebar__nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/dashboard"}
            className={({ isActive }) =>
              isActive ? "sidebar__item sidebar__item--active" : "sidebar__item"
            }
            onClick={onClose}
          >
            <span className="sidebar__icon" aria-hidden="true">
              {item.icon}
            </span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="sidebar__footer">
        <button className="sidebar__logout" onClick={handleLogout}>
          <span aria-hidden="true">🚪</span> Log Out
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
