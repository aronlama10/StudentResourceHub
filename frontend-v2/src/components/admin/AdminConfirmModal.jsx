import React, { useState } from "react";

export default function AdminConfirmModal({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  confirmVariant = "primary", // "primary", "approve", "reject", "archive", "restore", "danger"
  requireReason = false,
  reasonPlaceholder = "Enter reason or note...",
  isLoading = false,
  onConfirm,
  onClose,
}) {
  const [reason, setReason] = useState("");
  const [reasonError, setReasonError] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (requireReason && !reason.trim()) {
      setReasonError(true);
      return;
    }
    setReasonError(false);
    onConfirm(reason.trim());
  };

  const getBtnClass = () => {
    switch (confirmVariant) {
      case "approve":
        return "admin-modal__btn--approve";
      case "reject":
      case "danger":
        return "admin-modal__btn--reject";
      case "archive":
        return "admin-modal__btn--archive";
      case "restore":
        return "admin-modal__btn--restore";
      default:
        return "admin-modal__btn--primary";
    }
  };

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal__header">
          <h2 className="admin-modal__title">{title}</h2>
          <button className="admin-modal__close" onClick={onClose} disabled={isLoading}>
            ✕
          </button>
        </div>

        <div className="admin-modal__body">
          <p className="admin-modal__desc">{message}</p>

          {requireReason && (
            <div className="form-group" style={{ marginTop: "10px" }}>
              <label className="form-label" style={{ display: "block", marginBottom: "6px" }}>
                Reason / Resolution Note <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <textarea
                className={`form-input form-input--textarea ${reasonError ? "form-input--error" : ""}`}
                placeholder={reasonPlaceholder}
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value);
                  if (e.target.value.trim()) setReasonError(false);
                }}
                rows={3}
                disabled={isLoading}
              />
              {reasonError && (
                <p className="form-error-msg" style={{ color: "#ef4444", fontSize: "0.82rem", marginTop: "4px" }}>
                  Please enter a valid reason before proceeding.
                </p>
              )}
            </div>
          )}
        </div>

        <div className="admin-modal__footer">
          <button className="admin-modal__btn" onClick={onClose} disabled={isLoading}>
            Cancel
          </button>
          <button
            className={`admin-modal__btn ${getBtnClass()}`}
            onClick={handleConfirm}
            disabled={isLoading || (requireReason && !reason.trim())}
          >
            {isLoading ? (
              <>
                <span className="btn-spinner"></span> Processing...
              </>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
