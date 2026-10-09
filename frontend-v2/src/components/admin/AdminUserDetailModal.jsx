import React from "react";

function getInitials(name, email) {
  const str = name || email || "?";
  return str
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function AdminUserDetailModal({ user, onClose }) {
  if (!user) return null;

  const getRoleBadgeClass = (role) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return "admin-role-badge--admin";
      case "moderator":
        return "admin-role-badge--moderator";
      default:
        return "admin-role-badge--student";
    }
  };

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal__header">
          <div>
            <span className="admin-eyebrow">USER PROFILE</span>
            <h2 className="admin-modal__title">{user.name || "User Details"}</h2>
          </div>
          <button className="admin-modal__close" onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </div>

        <div className="admin-modal__body">
          <div className="admin-user-detail-header">
            <div className="admin-resource-card__avatar" style={{ width: "56px", height: "56px", fontSize: "1.2rem" }}>
              {user.avatar ? (
                <img src={user.avatar} alt="" style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
              ) : (
                getInitials(user.name, user.email)
              )}
            </div>

            <div>
              <h3 style={{ margin: "0 0 4px", fontSize: "1.1rem", color: "var(--color-text-primary)" }}>
                {user.name || "Unnamed User"}
              </h3>
              <p style={{ margin: 0, color: "var(--color-text-muted)", fontSize: "0.88rem" }}>
                {user.email || "No email address"}
              </p>
            </div>

            <span className={`admin-role-badge ${getRoleBadgeClass(user.role)}`} style={{ marginLeft: "auto" }}>
              {user.role?.toUpperCase() || "STUDENT"}
            </span>
          </div>

          <div className="admin-detail-grid" style={{ marginTop: "16px" }}>
            <div className="admin-detail-row">
              <span className="admin-detail-label">Department</span>
              <span className="admin-detail-value">{user.department || "Not specified"}</span>
            </div>

            <div className="admin-detail-row">
              <span className="admin-detail-label">Year / Level</span>
              <span className="admin-detail-value">{user.year || "Not specified"}</span>
            </div>

            <div className="admin-detail-row">
              <span className="admin-detail-label">User Role</span>
              <span className="admin-detail-value" style={{ textTransform: "capitalize" }}>{user.role || "student"}</span>
            </div>

            <div className="admin-detail-row">
              <span className="admin-detail-label">Account Status</span>
              <span className="admin-detail-value" style={{ color: "#4ade80" }}>Active</span>
            </div>
          </div>

          <div className="admin-detail-row" style={{ marginTop: "12px" }}>
            <span className="admin-detail-label">User Database ID</span>
            <code className="admin-detail-code">{user._id || user.id || "—"}</code>
          </div>
        </div>

        <div className="admin-modal__footer">
          <button className="admin-modal__btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
