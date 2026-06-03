import { useNavigate } from "react-router-dom";
import "../../css/dashboard/resources.css";

function MyResources() {
  const navigate = useNavigate();
  const myResources = [
    {
      title: "Database Systems Notes",
      department: "CS & IT",
      tag: "Upload",
      meta: "COS204 · 24 pages",
      author: "Suman Sharma",
      time: "2 days ago",
      excerpt:
        "Concise notes on normalization, indexing, and transaction management with examples...",
      labels: ["Notes", "Exam Prep"],
    },
    {
      title: "Operating Systems Revision",
      department: "CS & IT",
      tag: "Saved",
      meta: "COS302 · PDF",
      author: "Suman Sharma",
      time: "5 days ago",
      excerpt:
        "Revision guide covering scheduling, memory management, and file systems...",
      labels: ["Revision", "Cheatsheet"],
    },
    {
      title: "Networking Lab Manual",
      department: "CS & IT",
      tag: "Saved",
      meta: "CSE210 · 12 labs",
      author: "Suman Sharma",
      time: "1 week ago",
      excerpt:
        "Lab manual with packet analysis tasks and step-by-step configurations...",
      labels: ["Lab", "Guide"],
    },
  ];

  const handleEdit = (resource) => {
    navigate("/dashboard/upload", {
      state: {
        resource,
      },
    });
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
        <div className="dashboard-filters">
          <button className="dashboard-filter dashboard-filter--active">
            All
          </button>
          <button className="dashboard-filter">Uploads</button>
          <button className="dashboard-filter">Saved</button>
        </div>
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
              <button className="resource-card__action-btn">✏️ Edit</button>
              <button className="resource-card__action-btn resource-card__action-btn--primary">
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
