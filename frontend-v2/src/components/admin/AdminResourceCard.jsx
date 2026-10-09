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
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getInitials(name) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function getFileIcon(type, fileName) {
  const ext = type || (fileName ? fileName.split(".").pop() : "");
  switch (ext?.toLowerCase()) {
    case "pdf":
      return "📄";
    case "doc":
    case "docx":
      return "📝";
    case "zip":
    case "rar":
      return "📦";
    case "png":
    case "jpg":
    case "jpeg":
    case "image":
      return "🖼️";
    default:
      return "📁";
  }
}

export default function AdminResourceCard({
  item, // resource object or report object
  isReport = false,
  isSelected = false,
  onToggleSelect,
  onViewDetails,
  onOpenResource,
  actions = [], // array of { label, variant, onClick, isLoading }
}) {
  // Disambiguate resource vs report
  const resource = isReport && item.resource && typeof item.resource === "object" ? item.resource : item;
  const report = isReport ? item : null;
  const reporter = isReport && report.reporter && typeof report.reporter === "object" ? report.reporter : null;
  const itemId = item.id || item._id;

  const status = report ? report.status : resource.status || "pending";

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
    <article className={`admin-resource-card ${isSelected ? "admin-resource-card--selected" : ""}`}>
      {/* Top Header: Select Checkbox, Author Info & Status Badge */}
      <div className="admin-resource-card__top">
        <div className="admin-resource-card__info">
          {onToggleSelect && (
            <input
              type="checkbox"
              className="admin-card-checkbox"
              checked={isSelected}
              onChange={() => onToggleSelect(itemId)}
              title="Select item"
            />
          )}

          <div className="admin-resource-card__avatar" aria-hidden="true">
            {getInitials(isReport ? reporter?.name : resource.author)}
          </div>

          <div className="admin-resource-card__user-details">
            <p className="admin-resource-card__author-name">
              {isReport
                ? `Reported by: ${reporter?.name || "Student"}`
                : resource.author || "Unknown User"}
            </p>
            <p className="admin-resource-card__author-meta">
              {resource.department || "General"} · {formatDate(resource.postedAt || report?.createdAt)}
            </p>
          </div>
        </div>

        <span className={`admin-resource-card__status-badge ${getBadgeClass(status)}`}>
          {status}
        </span>
      </div>

      <div className="admin-resource-card__divider" />

      {/* Main Content Area */}
      <div className="admin-resource-card__content">
        <h3 className="admin-resource-card__title">
          <span className="admin-resource-card__title-icon">
            {getFileIcon(resource.resourceType, resource.fileName)}
          </span>
          {resource.title || "Untitled Resource"}
        </h3>

        <div className="admin-resource-card__tags">
          {resource.courseCode && (
            <span className="admin-tag admin-tag--course">{resource.courseCode}</span>
          )}
          {resource.department && (
            <span className="admin-tag admin-tag--dept">{resource.department}</span>
          )}
          {resource.resourceType && (
            <span className="admin-tag admin-tag--type">{resource.resourceType.toUpperCase()}</span>
          )}
        </div>

        {(resource.detail || resource.excerpt) && (
          <p className="admin-resource-card__excerpt">
            "{resource.excerpt || resource.detail}"
          </p>
        )}

        {/* Callout Boxes for Special Context (Reasons/Notes) */}
        {resource.rejectionReason && (
          <div className="admin-reason-callout admin-reason-callout--rejected">
            <strong>❌ Rejection Reason:</strong> {resource.rejectionReason}
          </div>
        )}

        {isReport && report && (
          <div className="admin-reason-callout admin-reason-callout--reported">
            <strong>🚩 Report Category ({report.category}):</strong>
            <p style={{ margin: "2px 0 0" }}>"{report.reason}"</p>
            {report.resolutionNote && (
              <p style={{ margin: "4px 0 0", color: "var(--color-text-secondary)", fontSize: "0.82rem" }}>
                <strong>Admin Note:</strong> {report.resolutionNote}
              </p>
            )}
          </div>
        )}

        {resource.labels && resource.labels.length > 0 && (
          <div className="admin-resource-card__labels">
            {resource.labels.map((label) => (
              <span className="admin-resource-card__label" key={label}>
                {label}
              </span>
            ))}
          </div>
        )}

        {/* File Meta Info */}
        <div className="admin-resource-card__file-info">
          {resource.fileName && <span>📎 {resource.fileName}</span>}
          {resource.fileSize && <span>💾 {formatFileSize(resource.fileSize)}</span>}
        </div>
      </div>

      <div className="admin-resource-card__divider" />

      {/* Card Actions Footer */}
      <div className="admin-resource-card__actions">
        {onViewDetails && (
          <button
            type="button"
            className="admin-resource-card__action-btn"
            onClick={() => onViewDetails(item)}
          >
            🔍 Details
          </button>
        )}

        {resource.fileUrl && onOpenResource && (
          <button
            type="button"
            className="admin-resource-card__action-btn"
            onClick={() => onOpenResource(resource.fileUrl)}
          >
            📂 Open Link
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
            {act.isLoading ? (
              <>
                <span className="btn-spinner"></span> Processing...
              </>
            ) : (
              act.label
            )}
          </button>
        ))}
      </div>
    </article>
  );
}
