import React from "react";

const DEPARTMENTS = [
  "Computer Engineering",
  "Civil Engineering",
  "CS & IT",
  "Architecture Engineering",
  "Electrical & Electronics Engineering",
];

const RESOURCE_TYPES = ["pdf", "doc", "docx", "zip", "image"];

export default function AdminResourceFilters({
  searchTerm,
  setSearchTerm,
  departmentFilter,
  setDepartmentFilter,
  resourceTypeFilter,
  setResourceTypeFilter,
  sortBy,
  setSortBy,
  viewMode,
  setViewMode,
  onResetFilters,
}) {
  const isFiltered =
    searchTerm.trim() !== "" ||
    departmentFilter !== "all" ||
    resourceTypeFilter !== "all" ||
    sortBy !== "newest";

  return (
    <div className="admin-filter-bar">
      {/* Search Input */}
      <div className="admin-search-wrap">
        <span className="admin-search-icon">🔍</span>
        <input
          type="text"
          className="admin-search-input"
          placeholder="Search by title, author, course, dept..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button
            type="button"
            className="admin-search-clear"
            onClick={() => setSearchTerm("")}
            title="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      {/* Select Dropdowns */}
      <div className="admin-filter-selects">
        <select
          className="admin-select-input"
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
          title="Filter by Department"
        >
          <option value="all">All Departments</option>
          {DEPARTMENTS.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>

        <select
          className="admin-select-input"
          value={resourceTypeFilter}
          onChange={(e) => setResourceTypeFilter(e.target.value)}
          title="Filter by File Type"
        >
          <option value="all">All File Types</option>
          {RESOURCE_TYPES.map((type) => (
            <option key={type} value={type}>
              {type.toUpperCase()}
            </option>
          ))}
        </select>

        <select
          className="admin-select-input"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          title="Sort Resources"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="title_asc">Title (A-Z)</option>
          <option value="title_desc">Title (Z-A)</option>
        </select>
      </div>

      {/* Right controls: View Toggle & Reset */}
      <div className="admin-filter-right">
        {isFiltered && (
          <button
            type="button"
            className="admin-reset-btn"
            onClick={onResetFilters}
            title="Reset filters to default"
          >
            Reset Filters
          </button>
        )}

        <div className="admin-view-toggle">
          <button
            type="button"
            className={`admin-view-btn ${viewMode === "table" ? "admin-view-btn--active" : ""}`}
            onClick={() => setViewMode("table")}
            title="List view"
          >
            ☰ List
          </button>
          <button
            type="button"
            className={`admin-view-btn ${viewMode === "grid" ? "admin-view-btn--active" : ""}`}
            onClick={() => setViewMode("grid")}
            title="Grid view"
          >
            🔲 Grid
          </button>
        </div>
      </div>
    </div>
  );
}
