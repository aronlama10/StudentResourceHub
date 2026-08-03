import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/dashboard/home.css";
import { getResources } from "../../services/resourceService";
import { getSavedStatus } from "../../services/savedService";
import { trackStudyStreak } from "../../services/userService";

function DashboardHome() {
  const navigate = useNavigate();
  const [LoggedInUser, setLoggedInUSer] = useState();
  const [savedCount, setSavedCount] = useState(0);
  const [uploadCount, setUploadCount] = useState(0);
  const [studyStreak, setStudyStreak] = useState(0);
  const [recentUploads, setRecentUploads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoggedInUSer(localStorage.getItem("loggedInUser"));
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch saved count, uploads, and update the daily streak in parallel
      const [savedRes, uploadsRes, streakRes] = await Promise.all([
        getSavedStatus(),
        getResources({ myUploads: "true" }),
        trackStudyStreak(),
      ]);

      if (savedRes.success) {
        setSavedCount(savedRes.savedResourceIds.length);
      }

      if (uploadsRes.success) {
        setUploadCount(uploadsRes.resources.length);

        // Get last 3 uploads for recent activity
        const recent = uploadsRes.resources.slice(0, 3).map((res) => ({
          title: res.title,
          courseCode: res.courseCode || "",
          time: formatRelativeTime(new Date(res.postedAt)),
        }));
        setRecentUploads(recent);
      }

      if (streakRes?.success) {
        setStudyStreak(streakRes.streak || 0);
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Format time as relative (e.g., "2 hours ago")
  const formatRelativeTime = (date) => {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60)
      return `${diffMins} minute${diffMins !== 1 ? "s" : ""} ago`;
    if (diffHours < 24)
      return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <section className="dashboard-home">
      <div className="dashboard-home__welcome">
        <h2 className="dashboard-home__greeting">Welcome {LoggedInUser} 👋</h2>
        <p className="dashboard-home__greeting-sub">
          Here's a quick snapshot of your activity.
        </p>
      </div>

      <div className="dashboard-home__grid">
        <article className="dashboard-card">
          <div className="dashboard-card__icon-wrap dashboard-card__icon-wrap--blue">
            📚
          </div>
          <p className="dashboard-card__label">Resources Saved</p>
          <h3 className="dashboard-card__value">
            {loading ? "—" : savedCount}
          </h3>
          <p className="dashboard-card__hint">
            <span
              className="dashboard-card__hint-badge dashboard-card__hint-badge--up"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/dashboard/saved-resources")}
            >
              View all
            </span>
            saved resources
          </p>
        </article>
        <article className="dashboard-card">
          <div className="dashboard-card__icon-wrap dashboard-card__icon-wrap--purple">
            ⬆️
          </div>
          <p className="dashboard-card__label">Uploads</p>
          <h3 className="dashboard-card__value">
            {loading ? "—" : uploadCount}
          </h3>
          <p className="dashboard-card__hint">
            <span
              className="dashboard-card__hint-badge dashboard-card__hint-badge--up"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/dashboard/my-resources")}
            >
              View all
            </span>
            your uploads
          </p>
        </article>
        <article className="dashboard-card">
          <div className="dashboard-card__icon-wrap dashboard-card__icon-wrap--cyan">
            🔥
          </div>
          <p className="dashboard-card__label">Study Streak</p>
          <h3 className="dashboard-card__value">
            {loading
              ? "—"
              : `${studyStreak} day${studyStreak === 1 ? "" : "s"}`}
          </h3>
          <p className="dashboard-card__hint">Keep it going 🎯</p>
        </article>
      </div>

      <div className="dashboard-panels">
        <section className="dashboard-panel">
          <h2 className="dashboard-panel__title">Quick Actions</h2>
          <div className="dashboard-actions">
            <button
              className="dashboard-action"
              onClick={() => navigate("/dashboard/upload")}
            >
              <span className="dashboard-action__icon">⬆️</span>
              Upload Notes
            </button>
            <button
              className="dashboard-action"
              onClick={() => navigate("/dashboard/resources")}
            >
              <span className="dashboard-action__icon">🔎</span>
              Find Resources
            </button>
            <button
              className="dashboard-action"
              onClick={() => navigate("/dashboard/saved-resources")}
            >
              <span className="dashboard-action__icon">⭐</span>
              Saved Resources
            </button>
          </div>
        </section>

        <section className="dashboard-panel">
          <h2 className="dashboard-panel__title">Recent Activity</h2>
          <div className="activity-list">
            {recentUploads.length > 0 ? (
              recentUploads.map((item, index) => (
                <div className="activity-item" key={index}>
                  <span className="activity-item__dot"></span>
                  <div>
                    <p className="activity-item__title">
                      Uploaded "{item.title}"
                    </p>
                    <p className="activity-item__meta">
                      {item.time}
                      {item.courseCode ? ` · ${item.courseCode}` : ""}
                    </p>
                  </div>
                </div>
              ))
            ) : !loading ? (
              <div className="activity-item">
                <span className="activity-item__dot"></span>
                <div>
                  <p className="activity-item__title">No recent activity</p>
                  <p className="activity-item__meta">
                    Start by uploading your first resource!
                  </p>
                </div>
              </div>
            ) : (
              <div className="activity-item">
                <span className="activity-item__dot"></span>
                <div>
                  <p className="activity-item__title">Loading...</p>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </section>
  );
}

export default DashboardHome;
