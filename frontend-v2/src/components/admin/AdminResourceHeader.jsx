import React from "react";

export default function AdminResourceHeader({
  title,
  subtitle,
  totalCount = 0,
  filteredCount = 0,
  selectedCount = 0,
  onRefresh,
  isRefreshing = false,
}) {
  return (
    <header className="admin-resource-header">
      <div className="admin-resource-header__main">
        <div>
          <span className="admin-eyebrow">Admin Moderation Center</span>
          <h1 className="admin-resource-header__title">{title}</h1>
          <p className="admin-resource-header__subtitle">{subtitle}</p>
        </div>

        <div className="admin-resource-header__actions">
          {onRefresh && (
            <button
              type="button"
              className="admin-resource-card__action-btn"
              onClick={onRefresh}
              disabled={isRefreshing}
              title="Refresh resources list"
            >
              <span className={`admin-refresh-icon ${isRefreshing ? "admin-refresh-icon--spinning" : ""}`}>
                🔄
              </span>
              {isRefreshing ? "Refreshing..." : "Refresh"}
            </button>
          )}
        </div>
      </div>

      <div className="admin-resource-header__stats">
        <span className="admin-stat-pill admin-stat-pill--primary">
          Total: <strong>{totalCount}</strong>
        </span>
        {filteredCount !== totalCount && (
          <span className="admin-stat-pill admin-stat-pill--info">
            Showing: <strong>{filteredCount}</strong>
          </span>
        )}
        {selectedCount > 0 && (
          <span className="admin-stat-pill admin-stat-pill--accent">
            Selected: <strong>{selectedCount}</strong>
          </span>
        )}
      </div>
    </header>
  );
}
