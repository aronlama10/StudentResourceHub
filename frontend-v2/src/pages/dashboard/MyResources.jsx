import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/dashboard/resources.css";
import { getResources, deleteResource } from "../../services/resourceService";
import { handleSuccess, handleError } from "../../utils";

function MyResources() {
  const navigate = useNavigate();
  const [myResources, setMyResources] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyResources = async () => {
    try {
      setLoading(true);
      const response = await getResources({ myUploads: "true" });
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
          handleSuccess(response.message || "Resource deleted successfully!");
          fetchMyResources();
        } else {
          handleError(response.message || "Failed to delete resource");
        }
      } catch (err) {
        console.error("Delete error:", err);
        handleError("An error occurred while deleting the resource.");
      }
    }
  };

  return (
    <section className="dashboard-section">
      <header className="dashboard-section__header">
        <div>
          <h2 className="dashboard-section__title">My Resources</h2>
          <p className="dashboard-section__subtitle">
            Your saved and uploaded resources in one place.
          </p>
        </div>
        {/* <div className="dashboard-filters">
          <button className="dashboard-filter dashboard-filter--active">
            All
          </button>
          <button className="dashboard-filter">Uploads</button>
          <button className="dashboard-filter">Saved</button>
        </div> */}
      </header>

      <div className="resource-grid">
        {myResources.map((resource) => (
          <article className="resource-card" key={resource.title}>
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
                    Tag: {label}
                  </span>
                ))}
              </div>
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
                onClick={() => handleDelete(resource.id || resource._id)}
              >
                🗑️ Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default MyResources;
