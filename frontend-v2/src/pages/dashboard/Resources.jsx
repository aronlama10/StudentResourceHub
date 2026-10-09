import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../../css/dashboard/resources.css";
import { getResources } from "../../services/resourceService";
import {
  toggleSaveResource,
  getSavedStatus,
} from "../../services/savedService";
import { handleSuccess, handleError } from "../../utils";
import { createReport } from "../../services/reportService";

const departments = [
  "Computer Engineering",
  "Civil Engineering",
  "Architecture Engineering",
  "Electrical & Electronics Engineering",
];

// const suggestions = ["DCOM suggestion", "C programming"];

function Resources() {
  const navigate = useNavigate();
  const location = useLocation();
  const [allResources, setAllResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [savedIds, setSavedIds] = useState(new Set());
  const [savingIds, setSavingIds] = useState(new Set());
  const [reportingResource, setReportingResource] = useState(null);
  const [reportCategory, setReportCategory] = useState("Broken Link");
  const [reportReason, setReportReason] = useState("");
  const [reportSubmitting, setReportSubmitting] = useState(false);
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

  const handleSelectDepartment = (department) => {
    setSelectedDepartment(department);
    setIsDropdownOpen(false);
  };

  const clearFilter = () => {
    setSelectedDepartment("");
    setSelectedSemester("");
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

  const filteredResources = allResources.filter((resource) => {
    const matchesDepartment =
      !selectedDepartment || resource.department === selectedDepartment;

    const matchesSemester =
      !selectedSemester ||
      Number(resource.semester) === Number(selectedSemester);

    return matchesDepartment && matchesSemester;
  });

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

  const openReportForm = (resource) => {
    setReportingResource(resource);
    setReportCategory("Broken Link");
    setReportReason("");
  };

  const closeReportForm = () => {
    if (reportSubmitting) return;

    setReportingResource(null);
    setReportCategory("Broken Link");
    setReportReason("");
  };

  const handleSubmitReport = async (event) => {
    event.preventDefault();

    if (!reportingResource || reportSubmitting) return;

    const reason = reportReason.trim();

    if (!reason) {
      handleError("Please explain why you are reporting this resource.");
      return;
    }

    if (reason.length > 1000) {
      handleError("Your explanation must be 1000 characters or fewer.");
      return;
    }

    const resourceId = reportingResource.id || reportingResource._id;

    try {
      setReportSubmitting(true);

      const response = await createReport(resourceId, {
        category: reportCategory,
        reason,
      });

      if (response?.success) {
        handleSuccess("Report submitted successfully.");

        setReportingResource(null);
        setReportReason("");
        setReportCategory("Broken Link");
      } else {
        handleError(response?.message || "Failed to submit your report.");
      }
    } catch (err) {
      console.error("Submit resource report error:", err);
      handleError("An error occurred while submitting your report.");
    } finally {
      setReportSubmitting(false);
    }
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
              <span>{selectedDepartment || "All Departments"}</span>
              <span className="arrow-icon">▼</span>
            </button>
            {isDropdownOpen && (
              <ul className="filter-dropdown-menu">
                {departments.map((dept) => (
                  <li key={dept}>
                    <button
                      className={`dropdown-item ${selectedDepartment === dept ? "selected" : ""}`}
                      onClick={() => handleSelectDepartment(dept)}
                    >
                      {dept}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <label className="semester-filter">
            <span>Semester:</span>
            <select
              value={selectedSemester}
              onChange={(event) => setSelectedSemester(event.target.value)}
              aria-label="Filter by semester"
              className=""
            >
              <option value="">All Semesters</option>
              <option value="1">1st Semester</option>
              <option value="2">2nd Semester</option>
              <option value="3">3rd Semester</option>
              <option value="4">4th Semester</option>
              <option value="5">5th Semester</option>
              <option value="6">6th Semester</option>
            </select>
          </label>

          {(selectedDepartment || selectedSemester) && (
            <button className="clear-filter-btn" onClick={clearFilter}>
              ✕ Clear
            </button>
          )}

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
                    {resource.department || resource.tag} ·{" "}
                    {resource.semester
                      ? `Semester ${resource.semester}`
                      : "Semester not set"}{" "}
                    · {resource.time}
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
                  type="button"
                  className="resource-card__action-btn"
                  onClick={() => handleViewResource(resource)}
                >
                  👁️ View Resource
                </button>

                <button
                  type="button"
                  className="resource-card__action-btn resource-card__action-btn--primary"
                  onClick={() => handleDownload(resource)}
                >
                  📥 Download
                </button>

                {!isOwn && (
                  <button
                    type="button"
                    className="resource-card__action-btn"
                    onClick={() => openReportForm(resource)}
                  >
                    🚩 Report
                  </button>
                )}
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

        {reportingResource && (
        <div
          className="report-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeReportForm();
            }
          }}
        >
          <div
            className="report-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="report-modal-title"
          >
            <div className="report-modal__header">
              <div>
                <h2 id="report-modal-title">Report Resource</h2>
                <p>{reportingResource.title}</p>
              </div>

              <button
                type="button"
                className="report-modal__close"
                onClick={closeReportForm}
                disabled={reportSubmitting}
                aria-label="Close report form"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmitReport}>
              <label htmlFor="report-category">Reason category</label>

              <select
                id="report-category"
                value={reportCategory}
                onChange={(event) => setReportCategory(event.target.value)}
                disabled={reportSubmitting}
                required
              >
                <option value="Broken Link">Broken Link</option>
                <option value="Duplicate Resource">Duplicate Resource</option>
                <option value="Incorrect Content">Incorrect Content</option>
                <option value="Inappropriate Content">
                  Inappropriate Content
                </option>
                <option value="Copyright Concern">Copyright Concern</option>
                <option value="Other">Other</option>
              </select>

              <label htmlFor="report-reason">Explain the issue</label>

              <textarea
                id="report-reason"
                value={reportReason}
                onChange={(event) => setReportReason(event.target.value)}
                placeholder="Describe the problem with this resource..."
                rows={4}
                maxLength={1000}
                required
                disabled={reportSubmitting}
              />

              <p className="report-modal__hint">
                {reportReason.length}/1000 characters
              </p>

              <div className="report-modal__actions">
                <button
                  type="button"
                  onClick={closeReportForm}
                  disabled={reportSubmitting}
                >
                  Cancel
                </button>

                <button type="submit" disabled={reportSubmitting}>
                  {reportSubmitting ? "Submitting..." : "Submit Report"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

export default Resources;
