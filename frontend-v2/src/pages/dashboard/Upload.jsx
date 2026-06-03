import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "../../css/dashboard/upload.css";

function Upload() {
  const location = useLocation();
  const [formData, setFormData] = useState({
    author: "",
    department: "Computer Eng",
    postedAt: "",
    title: "",
    courseCode: "",
    detail: "",
    excerpt: "",
    labels: "",
  });

  const isEditing = Boolean(location.state?.resource);

  useEffect(() => {
    if (!location.state?.resource) return;
    const resource = location.state.resource;
    const [courseCode, detail] = resource.meta
      ? resource.meta.split("·").map((part) => part.trim())
      : ["", ""];

    setFormData({
      author: resource.author || "",
      department: resource.department || "Computer Eng",
      postedAt: resource.postedAt || "",
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

      <form className="upload-card">
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
                <option>Computer Eng</option>
                <option>Civil Eng</option>
                <option>CS & IT</option>
                <option>Architecture Eng</option>
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
            The title, course code, and preview text that show on the resource
            card.
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
              Course Code
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
            <label className="form-label">
              File
              <div className="upload-drop">
                <span>Drag & drop or click to browse</span>
                <button className="upload-drop__btn" type="button">
                  Choose File
                </button>
              </div>
              <span className="form-hint">PDF, DOCX, or ZIP up to 25MB.</span>
            </label>
          </div>
        </div>

        <div className="upload-actions">
          <button className="secondary-btn" type="button">
            Preview Card
          </button>
          <button className="primary-btn" type="submit">
            {isEditing ? "Save Changes" : "Publish Resource"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default Upload;
