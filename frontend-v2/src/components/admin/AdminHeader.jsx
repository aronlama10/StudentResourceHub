import { useLocation, useNavigate } from "react-router-dom";
import "../../css/dashboard/header.css";
import { useEffect, useState } from "react";

const pageTitles = {
  "/admin": "Admin Overview",
  "/admin/resources/pending": "Pending Resources",
  "/admin/resources/approved": "Approved Resources",
  "/admin/resources/rejected": "Rejected Resources",
  "/admin/resources/reported": "Reported Resources",
  "/admin/resources/archived": "Archived Resources",
  "/admin/users": "Users",
  "/admin/settings": "Settings",
};

function AdminHeader({ onToggleSidebar }) {
  const [LoggedInUser, setLoggedInUSer] = useState();
  const location = useLocation();
  const navigate = useNavigate();
  const title = pageTitles[location.pathname] ?? "Admin";

  useEffect(() => {
    const handleUserUpdate = () => {
      setLoggedInUSer(localStorage.getItem("loggedInUser"));
    };

    handleUserUpdate();

    window.addEventListener("storage", handleUserUpdate);
    window.addEventListener("local-storage-user", handleUserUpdate);

    return () => {
      window.removeEventListener("storage", handleUserUpdate);
      window.removeEventListener("local-storage-user", handleUserUpdate);
    };
  }, []);

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

      {/* Right Section */}
      <div className="dashboard-header__right">
        <div
          className="dashboard-header__profile"
          onClick={() => navigate("/dashboard/profile")}
          role="button"
          tabIndex={0}
        >
          <div className="dashboard-header__avatar">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#e3e3e3"
            >
              <path d="M367-527q-47-47-47-113t47-113q47-47 113-47t113 47q47 47 47 113t-47 113q-47 47-113 47t-113-47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm296.5-343.5Q560-607 560-640t-23.5-56.5Q513-720 480-720t-56.5 23.5Q400-673 400-640t23.5 56.5Q447-560 480-560t56.5-23.5ZM480-640Zm0 400Z" />
            </svg>
          </div>
          <span className="dashboard-header__username">{LoggedInUser}</span>
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;
