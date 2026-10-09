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
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminDetailModal({ resource, report, onClose, onOpenResource }) {
  if (!resource && !report) return null;

  const targetResource = resource || (report && report.resource && typeof report.resource === "object" ? report.resource : null);
  const reporter = report && report.reporter && typeof report.reporter === "object" ? report.reporter : null;

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "approved":
        return "admin-resource-card__status-badge--approved";
      case "rejected":
        return "admin-resource-card__status-badge--rejected";
      case "archived":
        return "admin-resource-card__status-badge--archived";
      case "resolved":
        return "admin-resource-card__status-badge--approved";
      case "dismissed":
        return "admin-resource-card__status-badge--archived";
      default:
        return "admin-resource-card__status-badge--pending";
    }
  };

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal admin-modal--lg" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal__header">
          <div>
            <span className="admin-eyebrow">
              {report ? "Report Details" : "Resource Details"}
            </span>
            <h2 className="admin-modal__title">
              {targetResource?.title || "Resource Overview"}
            </h2>
          </div>
          <button className="admin-modal__close" onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </div>

        <div className="admin-modal__body">
          {/* Report Notice Box if applicable */}
          {report && (
            <div className="admin-reason-callout admin-reason-callout--reported">
              <div className="admin-reason-callout__header">
                <strong>🚩 Report Details ({report.category || "General"})</strong>
                <span className={`admin-resource-card__status-badge ${getStatusBadgeClass(report.status)}`}>
                  {report.status}
                </span>
              </div>
              <p className="admin-reason-callout__text">
                <strong>Reported by:</strong> {reporter?.name || "Student"} ({reporter?.email || "N/A"})
              </p>
              <p className="admin-reason-callout__text">
                <strong>Student Reason:</strong> "{report.reason}"
              </p>
              {report.resolutionNote && (
                <p className="admin-reason-callout__text" style={{ marginTop: "8px", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "6px" }}>
                  <strong>Admin Note:</strong> "{report.resolutionNote}"
                </p>
              )}
            </div>
          )}

          {/* General Metadata Grid */}
          <div className="admin-detail-grid">
            <div className="admin-detail-row">
              <span className="admin-detail-label">Title</span>
              <span className="admin-detail-value">{targetResource?.title || "—"}</span>
            </div>

            <div className="admin-detail-row">
              <span className="admin-detail-label">Author</span>
              <span className="admin-detail-value">{targetResource?.author || "Unknown"}</span>
            </div>

            <div className="admin-detail-row">
              <span className="admin-detail-label">Department</span>
              <span className="admin-detail-value">{targetResource?.department || "—"}</span>
            </div>

            {targetResource?.courseCode && (
              <div className="admin-detail-row">
                <span className="admin-detail-label">Course Code</span>
                <span className="admin-detail-value">{targetResource.courseCode}</span>
              </div>
            )}

            {targetResource?.status && (
              <div className="admin-detail-row">
                <span className="admin-detail-label">Status</span>
                <div>
                  <span className={`admin-resource-card__status-badge ${getStatusBadgeClass(targetResource.status)}`}>
                    {targetResource.status}
                  </span>
                </div>
              </div>
            )}

            {targetResource?.postedAt && (
              <div className="admin-detail-row">
                <span className="admin-detail-label">Uploaded Date</span>
                <span className="admin-detail-value">{formatDate(targetResource.postedAt)}</span>
              </div>
            )}

            {targetResource?.reviewedAt && (
              <div className="admin-detail-row">
                <span className="admin-detail-label">Reviewed Date</span>
                <span className="admin-detail-value">{formatDate(targetResource.reviewedAt)}</span>
              </div>
            )}

            {targetResource?.reviewer && (
              <div className="admin-detail-row">
                <span className="admin-detail-label">Reviewed By</span>
                <span className="admin-detail-value">{targetResource.reviewer}</span>
              </div>
            )}
          </div>

          {/* Description / Detail */}
          {(targetResource?.detail || targetResource?.excerpt) && (
            <div className="admin-detail-row">
              <span className="admin-detail-label">Description / Details</span>
              <p className="admin-detail-value admin-detail-text-box">
                {targetResource.detail || targetResource.excerpt}
              </p>
            </div>
          )}

          {/* Rejection Reason if available */}
          {targetResource?.rejectionReason && (
            <div className="admin-reason-callout admin-reason-callout--rejected">
              <strong>❌ Rejection Reason</strong>
              <p className="admin-reason-callout__text">{targetResource.rejectionReason}</p>
            </div>
          )}

          {/* Labels */}
          {targetResource?.labels && targetResource.labels.length > 0 && (
            <div className="admin-detail-row">
              <span className="admin-detail-label">Tags / Labels</span>
              <div className="admin-detail-labels">
                {targetResource.labels.map((label) => (
                  <span className="admin-resource-card__label" key={label}>
                    {label}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* File Attachment Info */}
          <div className="admin-detail-file-card">
            <div className="admin-detail-file-icon">📎</div>
            <div className="admin-detail-file-meta">
              <p className="admin-detail-file-name">{targetResource?.fileName || "Attachment file"}</p>
              <p className="admin-detail-file-sub">
                Size: {formatFileSize(targetResource?.fileSize)} · Type: {targetResource?.resourceType?.toUpperCase() || "File"}
              </p>
            </div>
            {targetResource?.fileUrl && (
              <button
                type="button"
                className="admin-resource-card__action-btn"
                onClick={() => onOpenResource(targetResource.fileUrl)}
              >
                📂 Open File
              </button>
            )}
          </div>

          {/* Resource ID */}
          <div className="admin-detail-row" style={{ marginTop: "4px" }}>
            <span className="admin-detail-label">Resource ID</span>
            <code className="admin-detail-code">{targetResource?.id || targetResource?._id || "—"}</code>
          </div>
        </div>

        <div className="admin-modal__footer">
          <button className="admin-modal__btn" onClick={onClose}>
            Close
          </button>
          {targetResource?.fileUrl && (
            <button
              className="admin-modal__btn admin-modal__btn--primary"
              onClick={() => onOpenResource(targetResource.fileUrl)}
            >
              📂 Open Resource Link
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
