import { NavLink, useNavigate } from "react-router-dom";
import "../../css/dashboard/sidebar.css";
import { useState } from "react";
import { handleSuccess } from "../../utils.js";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Loader2 } from "lucide-react";

const navItems = [
  { label: "Dashboard", path: "/dashboard", icon: "🏠" },
  { label: "Resources", path: "/dashboard/resources", icon: "📗" },
  { label: "Upload", path: "/dashboard/upload", icon: "⬆️" },
  { label: "My Resources", path: "/dashboard/my-resources", icon: "📚" },
  { label: "Profile", path: "/dashboard/profile", icon: "👤" },
];

function Sidebar({ isOpen, onClose }) {
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
      <ToastContainer
        position="top-right"
        closeOnClick
        autoClose={3000}
        theme="dark"
      />
    </aside>
  );
}

export default Sidebar;
