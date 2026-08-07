import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../css/dashboard/upload.css";
import { createResource, updateResource } from "../../services/resourceService";
import { handleSuccess, handleError } from "../../utils";

const getCurrentDateTimeLocal = () => {
  const now = new Date();
  const tzOffset = now.getTimezoneOffset() * 60000;
  return new Date(now.getTime() - tzOffset).toISOString().slice(0, 16);
};

const formatDateTimeLocal = (dateInput) => {
  if (!dateInput) return "";
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "";
  const tzOffset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);
};

function Upload() {
  const location = useLocation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    author: localStorage.getItem("loggedInUser") || "",
    department: "Computer Engineering",
    postedAt: getCurrentDateTimeLocal(),
    title: "",
    courseCode: "",
    detail: "",
    excerpt: "",
    labels: "",
  });

  const isEditing = Boolean(location.state?.resource);

  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUploadClick = () => {
    document.getElementById("file-input").click();
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  useEffect(() => {
    if (!location.state?.resource) return;
    const resource = location.state.resource;
    const [courseCode, detail] = resource.meta
      ? resource.meta.split("·").map((part) => part.trim())
      : ["", ""];

    setFormData({
      author: resource.author || "",
      department: resource.department || "Computer Engineering",
      postedAt: formatDateTimeLocal(resource.postedAt || resource.time),
      title: resource.title || "",
      courseCode: resource.courseCode || courseCode || "",
      detail: resource.detail || detail || "",
      excerpt: resource.excerpt || "",
      labels: Array.isArray(resource.labels) ? resource.labels.join(", ") : "",
    });
  }, [location.state]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.detail) {
      handleError("Title and Resource Meta are required.");
      return;
    }

    if (!isEditing && !selectedFile) {
      handleError("Please select a file to upload.");
      return;
    }

    try {
      setLoading(true);
      const data = new FormData();
      data.append("title", formData.title);
      data.append("department", formData.department);
      data.append("courseCode", formData.courseCode.trim());
      data.append("detail", formData.detail);
      data.append("excerpt", formData.excerpt);
      data.append("labels", formData.labels);
      if (formData.postedAt) {
        data.append("postedAt", formData.postedAt);
      }

      if (selectedFile) {
        data.append("file", selectedFile);
      }

      let response;
      if (isEditing) {
        const resourceId =
          location.state.resource.id || location.state.resource._id;
        response = await updateResource(resourceId, data);
      } else {
        response = await createResource(data);
      }

      if (response.success) {
        navigate("/dashboard/resources", {
          state: {
            successMessage: "Resources has been uploaded",
          },
        });
      } else {
        handleError(response.message || "Something went wrong.");
      }
    } catch (err) {
      console.error(err);
      handleError("An error occurred while saving the resource.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="dashboard-section">
      <header className="dashboard-section__header">
        <div>
          <h2 className="dashboard-section__title">
            {isEditing ? "Edit Resource" : "Upload Resource"}
          </h2>
          <p className="dashboard-section__subtitle">
            {isEditing
              ? "Update the details below to revise your resource."
              : "Share notes, PDFs, and helpful resources with your peers."}
          </p>
        </div>
      </header>

      <form className="upload-card" onSubmit={handleSubmit}>
        <div className="upload-section">
          <h3 className="upload-section__title">Account Details</h3>
          <p className="upload-section__subtitle">
            This information comes from your profile and helps categorize the
            post.
          </p>
          <div className="form-row">
            <label className="form-label">
              Your Account
              <input
                className="form-input"
                type="text"
                placeholder="Auto-filled from your profile"
                value={formData.author}
                disabled
              />
            </label>
            <label className="form-label">
              Department Tag
              <select
                className="form-input form-select"
                name="department"
                value={formData.department}
                onChange={handleChange}
              >
                <option>Computer Engineering</option>
                <option>Civil Engineering</option>
                <option>Architecture Engineering</option>
                <option>Electrical Engineering</option>
              </select>
            </label>
          </div>
          <label className="form-label">
            Posted Time (Optional)
            <input
              className="form-input"
              type="datetime-local"
              name="postedAt"
              value={formData.postedAt}
              onChange={handleChange}
            />
            <span className="form-hint">Leave empty to publish now.</span>
          </label>
        </div>

        <div className="upload-divider" />

        <div className="upload-section">
          <h3 className="upload-section__title">Resource Content</h3>
          <p className="upload-section__subtitle">
            The title, optional course code, and preview text that show on the
            resource card.
          </p>
          <div className="form-row">
            <label className="form-label">
              Title
              <input
                className="form-input"
                type="text"
                name="title"
                placeholder="Resource title"
                value={formData.title}
                onChange={handleChange}
              />
            </label>
            <label className="form-label">
              Course Code <span className="form-hint">(optional)</span>
              <input
                className="form-input"
                type="text"
                name="courseCode"
                placeholder="e.g. COMP302"
                value={formData.courseCode}
                onChange={handleChange}
              />
            </label>
          </div>
          <label className="form-label">
            Resource Meta
            <input
              className="form-input"
              type="text"
              name="detail"
              placeholder="e.g. 45 pages, PDF, 6 chapters"
              value={formData.detail}
              onChange={handleChange}
            />
          </label>
          <label className="form-label">
            Excerpt
            <textarea
              className="form-input form-input--textarea"
              name="excerpt"
              placeholder="Short preview shown on the resource card."
              value={formData.excerpt}
              onChange={handleChange}
            ></textarea>
          </label>
        </div>

        <div className="upload-divider" />

        <div className="upload-section">
          <h3 className="upload-section__title">Tags & Files</h3>
          <p className="upload-section__subtitle">
            Add search-friendly labels and upload the file.
          </p>
          <label className="form-label">
            Labels
            <input
              className="form-input"
              type="text"
              name="labels"
              placeholder="e.g. Notes, Exam Prep, Lab"
              value={formData.labels}
              onChange={handleChange}
            />
            <span className="form-hint">Separate labels with commas.</span>
          </label>
          <div className="form-row">
            <div className="form-file-group">
              <label className="form-label" htmlFor="file-input">
                File
              </label>
              <div
                className={`upload-drop ${dragActive ? "drag-active" : ""}`}
                onClick={handleUploadClick}
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
              >
                <i className="ti ti-cloud-upload" />
                <span>Drag & drop or click to browse</span>
                <input
                  id="file-input"
                  type="file"
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              <span className="form-hint">PDF, DOCX, or ZIP up to 25MB.</span>
              {selectedFile && (
                <div className="selected-file">
                  <div className="selected-file__info">
                    <i className="ti ti-file-description selected-file__icon" />
                    <div className="selected-file__meta">
                      <span
                        className="selected-file__name"
                        title={selectedFile.name}
                      >
                        {selectedFile.name}
                      </span>
                      <span className="selected-file__size">
                        {formatFileSize(selectedFile.size)}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="selected-file__remove"
                    onClick={() => setSelectedFile(null)}
                    title="Remove file"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="24px"
                      viewBox="0 -960 960 960"
                      width="24px"
                      fill="#e3e3e3"
                    >
                      <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="upload-actions">
          <button className="secondary-btn" type="button" disabled={loading}>
            Preview Card
          </button>
          <button className="primary-btn" type="submit" disabled={loading}>
            {loading ? (
              <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                <span className="btn-spinner" />
                <span>{isEditing ? "Saving..." : "Publishing..."}</span>
              </span>
            ) : isEditing ? (
              "Save Changes"
            ) : (
              "Publish Resource"
            )}
          </button>
        </div>
      </form>
    </section>
  );
}

export default Upload;
