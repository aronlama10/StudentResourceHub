import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/dashboard/resources.css";
import { getResources, deleteResource } from "../../services/resourceService";
import { handleSuccess, handleError } from "../../utils";

function MyResources() {
  const navigate = useNavigate();

  const [myResources, setMyResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState(null);

  const fetchMyResources = async () => {
    try {
      setLoading(true);

      const response = await getResources({
        myUploads: "true",
      });

      if (response.success) {
        const mapped = response.resources.map((res) => ({
          ...res,

          tag: res.department,

          meta: res.courseCode
            ? `${res.courseCode} · ${res.detail}`
            : res.detail,

          time: new Date(res.postedAt).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
        }));

        setMyResources(mapped);
      }
    } catch (err) {
      console.error("Error fetching my resources:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyResources();
  }, []);

  const handleEdit = (resource) => {
    navigate("/dashboard/upload", {
      state: {
        resource,
      },
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this resource?")) {
      try {
        const response = await deleteResource(id);

        if (response.success) {
          handleSuccess(
            response.message || "Resource deleted successfully!"
          );

          fetchMyResources();
        } else {
          handleError(
            response.message || "Failed to delete resource"
          );
        }
      } catch (err) {
        console.error("Delete error:", err);

        handleError(
          "An error occurred while deleting the resource."
        );
      }
    }
  };

  /*
   * Returns the correct moderation status.
   *
   * IMPORTANT:
   * This value comes from the backend/database.
   */
  const getStatusInfo = (resource) => {
    switch (resource.status) {
      case "approved":
        return {
          label: "Approved",
          icon: "✓",
          className: "resource-status resource-status--approved",
        };

      case "rejected":
        return {
          label: "Rejected",
          icon: "✕",
          className: "resource-status resource-status--rejected",
        };

      case "pending":
      default:
        return {
          label: "Pending Review",
          icon: "⏳",
          className: "resource-status resource-status--pending",
        };
    }
  };

  return (
    <section className="dashboard-section">
      <header className="dashboard-section__header">
        <div>
          <h2 className="dashboard-section__title">
            My Resources
          </h2>

          <p className="dashboard-section__subtitle">
            Your saved and uploaded resources in one place.
          </p>
        </div>
      </header>

      {/* Loading state */}
      {loading && (
        <div className="my-resources-state">
          <p>Loading your resources...</p>
        </div>
      )}

      {/* Empty state */}
      {!loading && myResources.length === 0 && (
        <div className="my-resources-state">
          <div className="my-resources-state__icon">
            📚
          </div>

          <h3>No resources yet</h3>

          <p>
            Resources you upload will appear here.
          </p>
        </div>
      )}

      {/* Resource cards */}
      {!loading && myResources.length > 0 && (
        <div className="resource-grid">
          {myResources.map((resource) => {
            const status = getStatusInfo(resource);

            return (
              <article
                className="resource-card"
                key={resource.id || resource._id}
              >
                <div className="resource-card__header">
                  <div
                    className="resource-card__avatar"
                    aria-hidden="true"
                  >
                    {(resource.author || "User")
                      .split(" ")
                      .map((word) => word[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>

                  <div className="resource-card__author">
                    <p className="resource-card__author-name">
                      {resource.author || "Unknown User"}
                    </p>

                    <p className="resource-card__author-meta">
                      {resource.tag} · {resource.time}
                    </p>
                  </div>
                </div>

                <div className="resource-card__divider" />

                <div className="resource-card__content">

                  {/* MODERATION STATUS */}
                  <div className="resource-status-row">
                    <span className={status.className}>
                      <span aria-hidden="true">
                        {status.icon}
                      </span>

                      {status.label}
                    </span>
                  </div>

                  <h3 className="resource-card__title">
                    <span
                      className="resource-card__title-icon"
                      aria-hidden="true"
                    >
                      📄
                    </span>

                    {resource.title}
                  </h3>

                  <p className="resource-card__meta">
                    {resource.meta}
                  </p>

                  <p className="resource-card__excerpt">
                    "{resource.excerpt}"
                  </p>

                  <div className="resource-card__labels">
                    {(resource.labels || []).map((label) => (
                      <span
                        className="resource-card__label"
                        key={label}
                      >
                        Tag: {label}
                      </span>
                    ))}
                  </div>

                  {/* PENDING MESSAGE */}
                  {resource.status === "pending" && (
                    <div className="resource-status-message resource-status-message--pending">
                      <span aria-hidden="true">⏳</span>

                      <span>
                        Your resource is waiting for admin review.
                      </span>
                    </div>
                  )}

                  {/* APPROVED MESSAGE */}
                  {resource.status === "approved" && (
                    <div className="resource-status-message resource-status-message--approved">
                      <span aria-hidden="true">✓</span>

                      <span>
                        Your resource has been approved and is
                        available in the public resource library.
                      </span>
                    </div>
                  )}

                  {/* REJECTED MESSAGE */}
                  {resource.status === "rejected" && (
                    <div className="resource-review-notice">
                      <div className="resource-review-notice__text">
                        <strong>
                          Resource rejected
                        </strong>

                        <span>
                          Admin has reviewed this resource.
                        </span>
                      </div>

                      <button
                        type="button"
                        className="resource-review-notice__button"
                        onClick={() =>
                          setSelectedReview(resource)
                        }
                      >
                        View Review
                      </button>
                    </div>
                  )}
                </div>

                <div className="resource-card__divider" />

                <div className="resource-card__actions">
                  <button
                    className="resource-card__action-btn"
                    onClick={() => handleEdit(resource)}
                  >
                    ✏️ Edit
                  </button>

                  <button
                    className="resource-card__action-btn resource-card__action-btn--primary"
                    onClick={() =>
                      handleDelete(
                        resource.id || resource._id
                      )
                    }
                  >
                    🗑️ Delete
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* =========================================
          REJECTION REVIEW MODAL
      ========================================= */}

      {selectedReview && (
        <div
          className="resource-review-modal-overlay"
          onClick={() => setSelectedReview(null)}
        >
          <div
            className="resource-review-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            {/* Modal Header */}
            <div className="resource-review-modal__header">
              <div>
                <p className="resource-review-modal__eyebrow">
                  Resource Review
                </p>

                <h2 className="resource-review-modal__title">
                  {selectedReview.title}
                </h2>
              </div>

              <button
                type="button"
                className="resource-review-modal__close"
                onClick={() => setSelectedReview(null)}
                aria-label="Close review"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="resource-review-modal__body">

              {/* Status */}
              <div className="resource-review-modal__status">
                <span className="resource-status resource-status--rejected">
                  ✕ Rejected
                </span>
              </div>

              {/* Rejection reason */}
              <div className="resource-review-modal__section">
                <p className="resource-review-modal__label">
                  Reason for rejection
                </p>

                <div className="resource-review-modal__reason">
                  {selectedReview.rejectionReason ||
                    "No rejection reason was provided."}
                </div>
              </div>

              {/* Review date */}
              {selectedReview.reviewedAt && (
                <div className="resource-review-modal__section">
                  <p className="resource-review-modal__label">
                    Reviewed on
                  </p>

                  <p className="resource-review-modal__date">
                    {new Date(
                      selectedReview.reviewedAt
                    ).toLocaleString()}
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="resource-review-modal__footer">
              <button
                type="button"
                className="resource-review-modal__close-button"
                onClick={() => setSelectedReview(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default MyResources;