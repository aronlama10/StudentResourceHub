import React from "react";

function formatFileSize(bytes) {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function AdminResourceTable({
  items = [],
  isReport = false,
  selectedIds = [],
  onToggleSelect,
  onToggleSelectAll,
  onViewDetails,
  onOpenResource,
  actions = [], // array of { label, variant, onClick, isLoading }
}) {
  const isAllSelected =
    items.length > 0 && items.every((item) => selectedIds.includes(item.id || item._id));

  const getBadgeClass = (st) => {
    switch (st) {
      case "approved":
      case "resolved":
        return "admin-resource-card__status-badge--approved";
      case "rejected":
        return "admin-resource-card__status-badge--rejected";
      case "archived":
      case "dismissed":
        return "admin-resource-card__status-badge--archived";
      default:
        return "admin-resource-card__status-badge--pending";
    }
  };

  return (
    <div className="admin-table-container">
      <table className="admin-table">
        <thead>
          <tr>
            <th style={{ width: "40px", textAlign: "center" }}>
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={onToggleSelectAll}
                title="Select all"
              />
            </th>
            <th>Title & File</th>
            <th>Author / Department</th>
            <th>Course</th>
            <th>Status & Date</th>
            <th style={{ textAlign: "right" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const resource =
              isReport && item.resource && typeof item.resource === "object"
                ? item.resource
                : item;
            const report = isReport ? item : null;
            const reporter =
              isReport && report.reporter && typeof report.reporter === "object"
                ? report.reporter
                : null;
            const itemId = item.id || item._id;
            const isSelected = selectedIds.includes(itemId);
            const status = report ? report.status : resource.status || "pending";

            return (
              <tr key={itemId} className={isSelected ? "admin-table-row--selected" : ""}>
                <td style={{ textAlign: "center" }}>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleSelect(itemId)}
                  />
                </td>

                {/* Title & File */}
                <td>
                  <div className="admin-table-title-wrap">
                    <span className="admin-table-title">{resource.title || "Untitled"}</span>
                    <span className="admin-table-sub">
                      {resource.fileName || "No attachment"}{" "}
                      {resource.fileSize ? `(${formatFileSize(resource.fileSize)})` : ""}
                    </span>
                  </div>
                </td>

                {/* Author & Dept */}
                <td>
                  <div className="admin-table-author-wrap">
                    <span className="admin-table-author">
                      {isReport
                        ? reporter?.name || "Student"
                        : resource.author || "Unknown"}
                    </span>
                    <span className="admin-table-dept">
                      {resource.department || "General"}
                    </span>
                  </div>
                </td>

                {/* Course Code */}
                <td>
                  {resource.courseCode ? (
                    <span className="admin-tag admin-tag--course">
                      {resource.courseCode}
                    </span>
                  ) : (
                    <span className="admin-text-muted">—</span>
                  )}
                </td>

                {/* Status & Date */}
                <td>
                  <div className="admin-table-status-wrap">
                    <span
                      className={`admin-resource-card__status-badge ${getBadgeClass(status)}`}
                    >
                      {status}
                    </span>
                    <span className="admin-table-date">
                      {formatDate(resource.postedAt || report?.createdAt)}
                    </span>
                  </div>
                </td>

                {/* Actions */}
                <td>
                  <div className="admin-table-actions">
                    {onViewDetails && (
                      <button
                        type="button"
                        className="admin-resource-card__action-btn"
                        onClick={() => onViewDetails(item)}
                        title="View full details"
                      >
                        🔍 Details
                      </button>
                    )}

                    {resource.fileUrl && onOpenResource && (
                      <button
                        type="button"
                        className="admin-resource-card__action-btn"
                        onClick={() => onOpenResource(resource.fileUrl)}
                        title="Open file link"
                      >
                        📂 Open
                      </button>
                    )}

                    {actions.map((act, idx) => (
                      <button
                        key={idx}
                        type="button"
                        className={`admin-resource-card__action-btn ${act.variant ? `admin-resource-card__action-btn--${act.variant}` : ""}`}
                        onClick={() => act.onClick(item)}
                        disabled={act.isLoading}
                      >
                        {act.isLoading ? "..." : act.label}
                      </button>
                    ))}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
