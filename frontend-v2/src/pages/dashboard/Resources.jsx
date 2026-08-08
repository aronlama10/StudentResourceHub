import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../../css/dashboard/resources.css";
import { getResources } from "../../services/resourceService";
import {
  toggleSaveResource,
  getSavedStatus,
} from "../../services/savedService";
import { handleSuccess, handleError } from "../../utils";

const departments = [
  "Computer Engineering",
  "Civil Engineering",
  "CS & IT",
  "Architecture Engineering",
  "Electrical & Electronics Engineering"
];

const suggestions = ["DCOM suggestion", "C programming"];

function Resources() {
  const navigate = useNavigate();
  const location = useLocation();
  const [allResources, setAllResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [savedIds, setSavedIds] = useState(new Set());
  const [savingIds, setSavingIds] = useState(new Set());
  const dropdownRef = useRef(null);

  // Get the current user's ID from the JWT token
  const getCurrentUserId = () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return null;
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload._id;
    } catch {
      return null;
    }
  };

  const currentUserId = getCurrentUserId();

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleSelectFilter = (filter) => {
    setSelectedFilter(filter);
    setIsDropdownOpen(false);
  };

  const clearFilter = () => {
    setSelectedFilter(null);
  };

  // Fetch resources from backend
  const fetchResources = async () => {
    try {
      setLoading(true);
      const response = await getResources();
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
        setAllResources(mapped);
      }
    } catch (err) {
      console.error("Error fetching resources:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch saved status
  const fetchSavedStatus = async () => {
    try {
      const response = await getSavedStatus();
      if (response.success) {
        setSavedIds(new Set(response.savedResourceIds));
      }
    } catch (err) {
      console.error("Error fetching saved status:", err);
    }
  };

  // Handle bookmark toggle
  const handleToggleSave = async (resourceId) => {
    if (savingIds.has(resourceId)) return; // Prevent double-click

    setSavingIds((prev) => new Set(prev).add(resourceId));

    try {
      const response = await toggleSaveResource(resourceId);
      if (response.success) {
        setSavedIds((prev) => {
          const next = new Set(prev);
          if (response.saved) {
            next.add(resourceId);
          } else {
            next.delete(resourceId);
          }
          return next;
        });
        if (response.saved) {
          handleSuccess("Resource saved!");
        } else {
          handleSuccess("Resource unsaved.");
        }
      } else {
        handleError(response.message || "Failed to toggle save");
      }
    } catch (err) {
      console.error("Error toggling save:", err);
      handleError("An error occurred while saving the resource.");
    } finally {
      setSavingIds((prev) => {
        const next = new Set(prev);
        next.delete(resourceId);
        return next;
      });
    }
  };

  // Display success toast when redirected after uploading/saving
  useEffect(() => {
    if (location.state?.successMessage) {
      handleSuccess(location.state.successMessage);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate]);

  // Close dropdown on click outside
  useEffect(() => {
    fetchResources();
    fetchSavedStatus();

    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredResources = selectedFilter
    ? allResources.filter((resource) => resource.tag === selectedFilter)
    : allResources;

  const handleViewResource = (resource) => {
    if (!resource.fileUrl) {
      handleError("Resource file not found.");
      return;
    }

    window.open(resource.fileUrl, "_blank", "noopener,noreferrer");
  };

  const handleDownload = (resource) => {
    if (!resource.fileUrl) {
      handleError("File URL is not available.");
      return;
    }

    const downloadUrl = resource.fileUrl.replace(
      "/upload/",
      "/upload/fl_attachment/",
    );

    window.location.href = downloadUrl;
  };

  return (
    <section className="dashboard-section dashboard-section--resources">
      <header className="resources-header">
        <div className="filter-row">
          <div className="filter-dropdown-container" ref={dropdownRef}>
            <button
              className={`filter-btn ${isDropdownOpen ? "active" : ""}`}
              onClick={toggleDropdown}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="20px"
                viewBox="0 -960 960 960"
                width="20px"
                fill="currentColor"
              >
                <path d="M440-120v-240h80v80h320v80H520v80h-80Zm-320-80v-80h240v80H120Zm160-160v-80H120v-80h160v-80h80v240h-80Zm160-80v-80h400v80H440Zm160-160v-240h80v80h160v80H680v80h-80Zm-480-80v-80h400v80H120Z" />
              </svg>
              <span>
                {departments.includes(selectedFilter)
                  ? selectedFilter
                  : "Filter"}
              </span>
              <span className="arrow-icon">▼</span>
            </button>
            {isDropdownOpen && (
              <ul className="filter-dropdown-menu">
                {departments.map((dept) => (
                  <li key={dept}>
                    <button
                      className={`dropdown-item ${selectedFilter === dept ? "selected" : ""}`}
                      onClick={() => handleSelectFilter(dept)}
                    >
                      {dept}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="suggestion-tags">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                className={`suggestion-tag-btn ${selectedFilter === suggestion ? "active" : ""}`}
                onClick={() => handleSelectFilter(suggestion)}
              >
                {suggestion}
              </button>
            ))}
            {selectedFilter && (
              <button className="clear-filter-btn" onClick={clearFilter}>
                ✕ Clear
              </button>
            )}
          </div>

          <span className="resource-count">
            Showing {filteredResources.length} resource
            {filteredResources.length !== 1 ? "s" : ""}
          </span>
        </div>
      </header>

      <div className="resource-grid">
        {filteredResources.map((resource) => {
          const resourceId = resource.id || resource._id;
          const isOwn =
            currentUserId &&
            resource.authorId &&
            resource.authorId.toString() === currentUserId.toString();
          const isSaved = savedIds.has(resourceId);
          const isSaving = savingIds.has(resourceId);

          return (
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
                  <p className="resource-card__author-name">
                    {resource.author}
                  </p>
                  <p className="resource-card__author-meta">
                    {resource.tag} · {resource.time}
                  </p>
                </div>

                {/* Bookmark icon — only shown for resources not owned by current user */}
                {!isOwn && (
                  <button
                    className={`resource-card__bookmark ${isSaved ? "resource-card__bookmark--active" : ""} ${isSaving ? "resource-card__bookmark--saving" : ""}`}
                    onClick={() => handleToggleSave(resourceId)}
                    disabled={isSaving}
                    aria-label={isSaved ? "Unsave resource" : "Save resource"}
                    title={isSaved ? "Unsave resource" : "Save resource"}
                  >
                    <span className="material-symbols-outlined">
                      {isSaved ? "bookmark" : "bookmark_border"}
                    </span>
                  </button>
                )}
              </div>

              <div className="resource-card__divider" />

              <div className="resource-card__content">
                <h3 className="resource-card__title">
                  <span
                    className="resource-card__title-icon"
                    aria-hidden="true"
                  >
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
                  onClick={() => handleViewResource(resource)}
                >
                  👁️ View Resource
                </button>
                <button
                  className="resource-card__action-btn resource-card__action-btn--primary"
                  onClick={() => handleDownload(resource)}
                >
                  📥 Download
                </button>
              </div>
            </article>
          );
        })}
        {filteredResources.length === 0 && (
          <div className="no-resources-msg">
            <div className="no-resources-msg__icon">🔍</div>
            <p className="no-resources-msg__title">No resources found</p>
            <p className="no-resources-msg__text">
              Try adjusting your filter or browse all resources.
            </p>
            <button className="clear-filter-btn" onClick={clearFilter}>
              Clear Filter
            </button>
          </div>
        )}
      </div>

      <button
        className="resources-fab"
        onClick={() => navigate("/dashboard/upload")}
        aria-label="Upload resource"
        type="button"
      >
        <span className="resources-fab__icon">+</span>
        <span className="resources-fab__text">Upload</span>
      </button>
    </section>
  );
}

export default Resources;
