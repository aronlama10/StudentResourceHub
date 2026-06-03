import { useLocation, useNavigate } from "react-router-dom";
import "../../css/dashboard/header.css";

const pageTitles = {
  "/dashboard": "Overview",
  "/dashboard/resources": "All Resources",
  "/dashboard/upload": "Upload Resource",
  "/dashboard/my-resources": "My Resources",
  "/dashboard/profile": "Profile",
};

function DashboardHeader({ onToggleSidebar }) {
  const location = useLocation();
  const navigate = useNavigate();
  const title = pageTitles[location.pathname] ?? "Dashboard";

  return (
    <header className="dashboard-header">
      {/* Left Section */}
      <div className="dashboard-header__left">
        <button
          className="dashboard-header__hamburger"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <div>
          <p className="dashboard-header__eyebrow">Student Resource Hub</p>
          <h1 className="dashboard-header__title">{title}</h1>
        </div>
      </div>

      {/* Middle Section (Search Bar) */}
      <div className="dashboard-header__search-container">
        <div className="dashboard-header__search-wrapper">
          <svg
            className="dashboard-header__search-icon"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            className="dashboard-header__search-input"
            type="text"
            placeholder="Search notes, course codes, study materials..."
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="dashboard-header__right">
        <button
          className="dashboard-header__btn dashboard-header__btn--upload"
          onClick={() => navigate("/dashboard/upload")}
        >
          <span className="plus-icon">+</span> <span className="upload-text">Upload</span>
        </button>
        
        <div
          className="dashboard-header__profile"
          onClick={() => navigate("/dashboard/profile")}
          role="button"
          tabIndex={0}
        >
          <div className="dashboard-header__avatar">A</div>
          <span className="dashboard-header__username">Alex Johnson</span>
        </div>
      </div>
    </header>
  );
}

export default DashboardHeader;
