import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/dashboard/resources.css";

const departments = [
  "Computer Eng",
  "Civil Eng",
  "CS & IT",
  "Architecture Eng",
];

const suggestions = ["DCOM suggestion", "C programming"];

const allResources = [
  // Computer Eng
  {
    title: "Microprocessor & Interfacing Notes",
    tag: "Computer Eng",
    meta: "COMP302 · 45 pages",
    author: "Suman Sharma",
    time: "2 hours ago",
    excerpt:
      "These notes cover all chapters from Unit 1 to Unit 5 with diagrams and practice questions included...",
    labels: ["Notes", "Exam Prep"],
  },
  {
    title: "Digital Logic Design Sheets",
    tag: "Computer Eng",
    meta: "COMP201 · PDF",
    author: "Suman Sharma",
    time: "5 hours ago",
    excerpt:
      "Quick-reference sheets with truth tables, K-maps, and circuit simplifications for fast revision...",
    labels: ["Notes", "Quick Revision"],
  },
  {
    title: "Computer Erchitecture Manual",
    tag: "Computer Eng",
    meta: "COMP304 · 14 labs",
    author: "Suman Sharma",
    time: "1 day ago",
    excerpt:
      "Lab manual with step-by-step experiments, register-level diagrams, and assessment checklists...",
    labels: ["Lab", "Manual"],
  },
  // Civil Eng
  {
    title: "Structural Analysis Handbook",
    tag: "Civil Eng",
    meta: "CIVL301 · 80 pages",
    author: "Suman Sharma",
    time: "3 hours ago",
    excerpt:
      "Complete handbook covering slope-deflection, moment distribution, and influence lines...",
    labels: ["Notes", "Handbook"],
  },
  {
    title: "Fluid Mechanics Lab Guide",
    tag: "Civil Eng",
    meta: "CIVL202 · 10 labs",
    author: "Suman Sharma",
    time: "6 hours ago",
    excerpt:
      "Lab guide with experiment setup, safety notes, and result templates for each lab...",
    labels: ["Lab", "Guide"],
  },
  {
    title: "Surveying & Geomatics Revision",
    tag: "Civil Eng",
    meta: "CIVL105 · PDF",
    author: "Suman Sharma",
    time: "2 days ago",
    excerpt:
      "Revision pack covering leveling, traversing, and total station fundamentals...",
    labels: ["Exam Prep", "Revision"],
  },
  // Computer Science
  {
    title: "Introduction to Algorithms Notes",
    tag: "Computer Science",
    meta: "CSCI204 · 32 pages",
    author: "Suman Sharma",
    time: "4 hours ago",
    excerpt:
      "Notes on asymptotic analysis, recursion, and classic sorting algorithms with examples...",
    labels: ["Notes", "Exam Prep"],
  },
  {
    title: "Theory of Computation Cheatsheet",
    tag: "Computer Science",
    meta: "CSCI310 · PDF",
    author: "Suman Sharma",
    time: "1 day ago",
    excerpt:
      "Cheatsheet for DFA/NFA conversions, pumping lemma, and CFG derivations...",
    labels: ["Cheatsheet", "Quick Revision"],
  },
  {
    title: "Compiler Design Reference",
    tag: "Computer Science",
    meta: "CSCI402 · 6 chapters",
    author: "Suman Sharma",
    time: "2 days ago",
    excerpt:
      "Reference guide on lexical analysis, parsing techniques, and intermediate code generation...",
    labels: ["Reference", "Notes"],
  },
  // IT
  {
    title: "Web Technologies & Frameworks",
    tag: "IT",
    meta: "ITEC205 · 18 pages",
    author: "Suman Sharma",
    time: "5 hours ago",
    excerpt:
      "Overview of HTTP, REST, and popular frontend frameworks with small project examples...",
    labels: ["Notes", "Overview"],
  },
  {
    title: "Cloud Computing & DevOps Guide",
    tag: "IT",
    meta: "ITEC412 · PDF",
    author: "Suman Sharma",
    time: "8 hours ago",
    excerpt:
      "Guide on cloud models, CI/CD pipelines, and infrastructure automation essentials...",
    labels: ["Guide", "DevOps"],
  },
  {
    title: "Database Management Systems Guide",
    tag: "IT",
    meta: "ITEC302 · 12 chapters",
    author: "Suman Sharma",
    time: "2 days ago",
    excerpt:
      "Coverage of normalization, SQL optimization, and transaction management basics...",
    labels: ["Guide", "Notes"],
  },
  // DCOM suggestion
  {
    title: "DCOM Architecture & Integration",
    tag: "DCOM suggestion",
    meta: "DCOM501 · Technical Guide",
    author: "Suman Sharma",
    time: "3 days ago",
    excerpt:
      "Architecture walkthrough for DCOM services with integration patterns and examples...",
    labels: ["Guide", "Reference"],
  },
  {
    title: "COM/DCOM Reference Guide",
    tag: "DCOM suggestion",
    meta: "DCOM502 · PDF Booklet",
    author: "Suman Sharma",
    time: "4 days ago",
    excerpt:
      "Reference booklet for COM interfaces, marshaling, and security settings...",
    labels: ["Reference", "Notes"],
  },
  // C programming
  {
    title: "C Programming: Pointers & Memory",
    tag: "C programming",
    meta: "CPROG101 · 50 pages",
    author: "Suman Sharma",
    time: "6 hours ago",
    excerpt:
      "Pointers, memory layout, and dynamic allocation explained with diagrams and examples...",
    labels: ["Notes", "Exam Prep"],
  },
  {
    title: "Data Structures using C",
    tag: "C programming",
    meta: "CPROG102 · 25 chapters",
    author: "Suman Sharma",
    time: "1 day ago",
    excerpt:
      "Stack, queue, list, and tree implementations with complexity analysis...",
    labels: ["Reference", "Notes"],
  },
];

function Resources() {
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

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

  // Close dropdown on click outside
  useEffect(() => {
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
        {filteredResources.map((resource) => (
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
                    {label}
                  </span>
                ))}
              </div>
            </div>

            <div className="resource-card__divider" />

            <div className="resource-card__actions">
              <button className="resource-card__action-btn">
                👁️ View Resource
              </button>
              <button className="resource-card__action-btn resource-card__action-btn--primary">
                📥 Download
              </button>
            </div>
          </article>
        ))}
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
