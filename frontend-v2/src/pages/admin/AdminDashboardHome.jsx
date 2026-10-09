import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/admin/admin.css";
import "../../css/dashboard/home.css";
import {
  getPendingResources,
  getApprovedResources,
  getRejectedResources,
  getArchivedResources,
} from "../../services/adminService";
import { getReports } from "../../services/reportService";

function AdminDashboardHome() {
  const navigate = useNavigate();
  const [LoggedInUser, setLoggedInUser] = useState("");
  const [stats, setStats] = useState({
    pending: null,
    approved: null,
    rejected: null,
    archived: null,
    reported: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoggedInUser(localStorage.getItem("loggedInUser") || "Admin");
    fetchCounts();
  }, []);

  const fetchCounts = async () => {
    try {
      setLoading(true);
      const [pendingRes, approvedRes, rejectedRes, archivedRes, reportedRes] =
        await Promise.allSettled([
          getPendingResources(),
          getApprovedResources(),
          getRejectedResources(),
          getArchivedResources(),
          getReports("pending"),
        ]);

      setStats({
        pending:
          pendingRes.status === "fulfilled" && pendingRes.value?.success
            ? pendingRes.value.resources.length
            : 0,
        approved:
          approvedRes.status === "fulfilled" && approvedRes.value?.success
            ? approvedRes.value.resources.length
            : 0,
        rejected:
          rejectedRes.status === "fulfilled" && rejectedRes.value?.success
            ? rejectedRes.value.resources.length
            : 0,
        archived:
          archivedRes.status === "fulfilled" && archivedRes.value?.success
            ? archivedRes.value.resources.length
            : 0,
        reported:
          reportedRes.status === "fulfilled" && reportedRes.value?.success
            ? reportedRes.value.reports.length
            : 0,
      });
    } catch (err) {
      console.error("Error fetching admin stats:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="dashboard-home">
      <div className="dashboard-home__welcome">
        <h2 className="dashboard-home__greeting">Admin Dashboard 🛡️</h2>
        <p className="dashboard-home__greeting-sub">
          Welcome back, {LoggedInUser}. Overview and quick management of all student resources.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="admin-stats-grid">
        <article
          className="admin-stat-card"
          onClick={() => navigate("/admin/resources/pending")}
          style={{ cursor: "pointer" }}
        >
          <div className="admin-stat-card__icon-wrap admin-stat-card__icon-wrap--amber">
            ⏳
          </div>
          <p className="admin-stat-card__label">Pending Review</p>
          <h3 className="admin-stat-card__value">
            {loading ? "—" : stats.pending ?? 0}
          </h3>
          <p className="admin-stat-card__hint">
            {stats.pending > 0
              ? "Needs moderation"
              : stats.pending === 0
              ? "All caught up!"
              : "Loading..."}
          </p>
        </article>

        <article
          className="admin-stat-card"
          onClick={() => navigate("/admin/resources/approved")}
          style={{ cursor: "pointer" }}
        >
          <div className="admin-stat-card__icon-wrap admin-stat-card__icon-wrap--green">
            ✅
          </div>
          <p className="admin-stat-card__label">Approved</p>
          <h3 className="admin-stat-card__value">
            {loading ? "—" : stats.approved ?? 0}
          </h3>
          <p className="admin-stat-card__hint">Active public resources</p>
        </article>

        <article
          className="admin-stat-card"
          onClick={() => navigate("/admin/resources/rejected")}
          style={{ cursor: "pointer" }}
        >
          <div className="admin-stat-card__icon-wrap admin-stat-card__icon-wrap--red">
            ❌
          </div>
          <p className="admin-stat-card__label">Rejected</p>
          <h3 className="admin-stat-card__value">
            {loading ? "—" : stats.rejected ?? 0}
          </h3>
          <p className="admin-stat-card__hint">Declined submissions</p>
        </article>

        <article
          className="admin-stat-card"
          onClick={() => navigate("/admin/resources/reported")}
          style={{ cursor: "pointer" }}
        >
          <div className="admin-stat-card__icon-wrap admin-stat-card__icon-wrap--blue">
            🚩
          </div>
          <p className="admin-stat-card__label">Pending Reports</p>
          <h3 className="admin-stat-card__value">
            {loading ? "—" : stats.reported ?? 0}
          </h3>
          <p className="admin-stat-card__hint">
            {stats.reported > 0 ? "Requires action" : "No pending reports"}
          </p>
        </article>
      </div>

      {/* Quick Actions */}
      <h2 className="dashboard-panel__title" style={{ marginBottom: "16px" }}>
        Quick Management Actions
      </h2>
      <div className="admin-quick-actions">
        <button
          className="admin-quick-action"
          onClick={() => navigate("/admin/resources/pending")}
        >
          <span className="admin-quick-action__icon">⏳</span>
          Review Pending Resources
          {stats.pending > 0 && (
            <span
              className="dashboard-card__hint-badge dashboard-card__hint-badge--pending"
              style={{ marginLeft: "auto" }}
            >
              {stats.pending}
            </span>
          )}
        </button>

        <button
          className="admin-quick-action"
          onClick={() => navigate("/admin/resources/reported")}
        >
          <span className="admin-quick-action__icon">🚩</span>
          Handle Reported Content
          {stats.reported > 0 && (
            <span
              className="dashboard-card__hint-badge dashboard-card__hint-badge--pending"
              style={{ marginLeft: "auto", background: "rgba(244, 63, 94, 0.2)", color: "#f43f5e" }}
            >
              {stats.reported}
            </span>
          )}
        </button>

        <button
          className="admin-quick-action"
          onClick={() => navigate("/admin/resources/approved")}
        >
          <span className="admin-quick-action__icon">✅</span>
          View Approved Library
        </button>

        <button
          className="admin-quick-action"
          onClick={() => navigate("/admin/resources/archived")}
        >
          <span className="admin-quick-action__icon">🗃️</span>
          Manage Archived Resources
        </button>
      </div>
    </section>
  );
}

export default AdminDashboardHome;
