import React from "react";

export default function AdminBulkBar({
  selectedIds = [],
  allFilteredIds = [],
  onToggleSelectAll,
  onClearSelection,
  bulkActions = [],
  isProcessing = false,
}) {
  const isAllSelected =
    allFilteredIds.length > 0 &&
    allFilteredIds.every((id) => selectedIds.includes(id));

  const count = selectedIds.length;

  return (
    <div className={`admin-bulk-bar ${count > 0 ? "admin-bulk-bar--visible" : ""}`}>
      <div className="admin-bulk-bar__left">
        <label className="admin-bulk-checkbox-wrap" title="Select / Deselect All Filtered Items">
          <input
            type="checkbox"
            checked={isAllSelected}
            onChange={onToggleSelectAll}
            disabled={isProcessing || allFilteredIds.length === 0}
          />
          <span className="admin-bulk-checkbox-label">
            {isAllSelected ? "Deselect All" : "Select All"} ({allFilteredIds.length})
          </span>
        </label>

        {count > 0 && (
          <span className="admin-bulk-count-badge">
            ⚡ {count} item{count !== 1 ? "s" : ""} selected
          </span>
        )}
      </div>

      {count > 0 && (
        <div className="admin-bulk-bar__right">
          {bulkActions.map((action, idx) => (
            <button
              key={idx}
              type="button"
              className={`admin-resource-card__action-btn ${action.variant ? `admin-resource-card__action-btn--${action.variant}` : ""}`}
              onClick={action.onClick}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <span className="btn-spinner"></span> Processing...
                </>
              ) : (
                action.label
              )}
            </button>
          ))}

          <button
            type="button"
            className="admin-bulk-clear-btn"
            onClick={onClearSelection}
            disabled={isProcessing}
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
}
