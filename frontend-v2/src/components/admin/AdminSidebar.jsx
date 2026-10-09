import { NavLink, useNavigate } from "react-router-dom";
import "../../css/dashboard/sidebar.css";
import { useState } from "react";
import { handleSuccess } from "../../utils.js";

const adminNavItems = [
  { label: "Dashboard", path: "/admin", icon: "📊" },
  { label: "Pending Resources", path: "/admin/resources/pending", icon: "⏳" },
  {
    label: "Approved Resources",
    path: "/admin/resources/approved",
    icon: "✅",
  },
  {
    label: "Rejected Resources",
    path: "/admin/resources/rejected",
    icon: "❌",
  },
  {
    label: "Reported Resources",
    path: "/admin/resources/reported",
    icon: "🚩",
  },
  {
    label: "Archived Resources",
    path: "/admin/resources/archived",
    icon: "🗃️",
  },
  { label: "Users Management", path: "/admin/users", icon: "👥" },
  { label: "Settings", path: "/admin/settings", icon: "⚙️" },
];

function AdminSidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    setLoading(true);
    localStorage.removeItem("token");
    localStorage.removeItem("loggedInUser");
    handleSuccess("Logged out successfully.");
    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };

  const handleBackToDashboard = () => {
    navigate("/dashboard");
    onClose();
  };

  return (
    <aside className={`sidebar ${isOpen ? "sidebar--open" : ""}`}>
      <div className="sidebar__top">
        <div className="sidebar__brand">
          <span className="sidebar__logo">Student Hub</span>
          <span className="sidebar__tag">Admin Panel</span>
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
        {adminNavItems.map((item) =>
          item.comingSoon ? (
            <span
              key={item.path}
              className="sidebar__item sidebar__item--disabled"
              title="Coming soon"
            >
              <span className="sidebar__icon" aria-hidden="true">
                {item.icon}
              </span>
              <span>{item.label}</span>
              <span className="sidebar__coming-soon">Soon</span>
            </span>
          ) : (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/admin"}
              className={({ isActive }) =>
                isActive
                  ? "sidebar__item sidebar__item--active"
                  : "sidebar__item"
              }
              onClick={onClose}
            >
              <span className="sidebar__icon" aria-hidden="true">
                {item.icon}
              </span>
              <span>{item.label}</span>
            </NavLink>
          ),
        )}
      </nav>

      <div className="sidebar__footer">
        <button
          className="sidebar__logout sidebar__back-btn"
          onClick={handleBackToDashboard}
          style={{ marginBottom: "8px" }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#94a3b8"
          >
            <path d="M360-240 120-480l240-240 56 56-144 144h568v80H272l144 144-56 56Z" />
          </svg>
          <span>Back to Dashboard</span>
        </button>
        <button
          className="sidebar__logout"
          onClick={handleLogout}
          disabled={loading}
        >
          {loading ? (
            <>
              <div className="loader"></div>
              <span>Logging out</span>
            </>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#94a3b8"
                className="logout-icon"
              >
                <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z" />
              </svg>
              <span>Logout</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}

export default AdminSidebar;
