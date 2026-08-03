import React, { useState, useEffect } from "react";
import "../../css/dashboard/resources.css";
import { getSavedResources, toggleSaveResource } from "../../services/savedService";
import { handleSuccess, handleError } from "../../utils";

function SavedResources() {
  const [savedResources, setSavedResources] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSavedResources = async () => {
    try {
      setLoading(true);
      const response = await getSavedResources();
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
        setSavedResources(mapped);
      }
    } catch (err) {
      console.error("Error fetching saved resources:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedResources();
  }, []);

  const handleUnsave = async (resourceId) => {
    try {
      const response = await toggleSaveResource(resourceId);
      if (response.success) {
        handleSuccess("Resource unsaved.");
        // Remove from local state instantly
        setSavedResources((prev) =>
          prev.filter((r) => (r.id || r._id) !== resourceId)
        );
      } else {
        handleError(response.message || "Failed to unsave resource");
      }
    } catch (err) {
      console.error("Unsave error:", err);
      handleError("An error occurred while unsaving the resource.");
    }
  };

  return (
    <section className="dashboard-section">
      <header className="dashboard-section__header">
        <div>
          <h2 className="dashboard-section__title">Saved Resources</h2>
          <p className="dashboard-section__subtitle">
            Your bookmarked resources in one place.
          </p>
        </div>
        <span className="resource-count" style={{ alignSelf: "flex-end" }}>
          {savedResources.length} saved resource
          {savedResources.length !== 1 ? "s" : ""}
        </span>
      </header>

      <div className="resource-grid">
        {savedResources.map((resource) => {
          const resourceId = resource.id || resource._id;

          return (
            <article className="resource-card" key={resourceId}>
              <div className="resource-card__header">
                <div className="resource-card__avatar" aria-hidden="true">
                  {resource.author
                    .split(" ")
                    .map((word) => word[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </div>
                <div className="resource-card__author">
                  <p className="resource-card__author-name">{resource.author}</p>
                  <p className="resource-card__author-meta">
                    {resource.tag} · {resource.time}
                  </p>
                </div>

                {/* Active bookmark indicator */}
                <span
                  className="resource-card__bookmark resource-card__bookmark--active"
                  style={{ cursor: "default" }}
                  aria-label="Saved"
                >
                  <span className="material-symbols-outlined">bookmark</span>
                </span>
              </div>

              <div className="resource-card__divider" />

              <div className="resource-card__content">
                <h3 className="resource-card__title">
                  <span className="resource-card__title-icon" aria-hidden="true">
                    📄
                  </span>
                  {resource.title}
                </h3>
                <p className="resource-card__meta">{resource.meta}</p>
                <p className="resource-card__excerpt">"{resource.excerpt}"</p>
                <div className="resource-card__labels">
                  {resource.labels.map((label) => (
                    <span className="resource-card__label" key={label}>
                      {label}
                    </span>
                  ))}
                </div>
              </div>

              <div className="resource-card__divider" />

              <div className="resource-card__actions">
                <button
                  className="resource-card__action-btn"
                  onClick={() => {
                    if (resource.filePath) {
                      const baseUrl =
                        import.meta.env.VITE_API_URL || "http://localhost:8000";
                      window.open(`${baseUrl}/${resource.filePath}`, "_blank");
                    }
                  }}
                >
                  👁️ View Resource
                </button>
                <button
                  className="resource-card__action-btn resource-card__action-btn--danger"
                  onClick={() => handleUnsave(resourceId)}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: "18px", verticalAlign: "middle", marginRight: "4px" }}>
                    bookmark_remove
                  </span>
                  Unsave
                </button>
              </div>
            </article>
          );
        })}

        {!loading && savedResources.length === 0 && (
          <div className="no-resources-msg">
            <div className="no-resources-msg__icon">
              <span className="material-symbols-outlined" style={{ fontSize: "3rem", color: "var(--color-text-muted)" }}>
                bookmarks
              </span>
            </div>
            <p className="no-resources-msg__title">No saved resources yet</p>
            <p className="no-resources-msg__text">
              Browse resources and click the bookmark icon to save them here.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export default SavedResources;