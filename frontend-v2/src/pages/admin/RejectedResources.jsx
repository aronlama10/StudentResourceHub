import React, { useState, useEffect, useMemo } from "react";
import "../../css/admin/admin.css";
import "../../css/dashboard/resources.css";
import { getRejectedResources } from "../../services/adminService";
import { handleError } from "../../utils";
import AdminResourceHeader from "../../components/admin/AdminResourceHeader";
import AdminResourceFilters from "../../components/admin/AdminResourceFilters";
import AdminResourceCard from "../../components/admin/AdminResourceCard";
import AdminResourceTable from "../../components/admin/AdminResourceTable";
import AdminDetailModal from "../../components/admin/AdminDetailModal";

export default function RejectedResources() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filters state
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [resourceTypeFilter, setResourceTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("table");

  // Detail Modal state
  const [detailResource, setDetailResource] = useState(null);

  useEffect(() => {
    fetchRejected();
  }, []);

  const fetchRejected = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getRejectedResources();
      if (res?.success) {
        setResources(res.resources || []);
      } else {
        setError(res?.message || "Failed to load rejected resources.");
      }
    } catch (err) {
      console.error("Error fetching rejected resources:", err);
      setError("Unable to load rejected resources.");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchRejected();
  };

  // Filter & Sort resources
  const filteredResources = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();

    const filtered = resources.filter((item) => {
      const matchesSearch =
        !search ||
        item.title?.toLowerCase().includes(search) ||
        item.detail?.toLowerCase().includes(search) ||
        item.courseCode?.toLowerCase().includes(search) ||
        item.author?.toLowerCase().includes(search) ||
        item.department?.toLowerCase().includes(search) ||
        item.rejectionReason?.toLowerCase().includes(search);

      const matchesDept =
        departmentFilter === "all" || item.department === departmentFilter;

      const matchesType =
        resourceTypeFilter === "all" ||
        item.resourceType?.toLowerCase() === resourceTypeFilter.toLowerCase();

      return matchesSearch && matchesDept && matchesType;
    });

    return filtered.sort((a, b) => {
      if (sortBy === "oldest") {
        return new Date(a.reviewedAt || a.postedAt || 0) - new Date(b.reviewedAt || b.postedAt || 0);
      }
      if (sortBy === "title_asc") {
        return (a.title || "").localeCompare(b.title || "");
      }
      if (sortBy === "title_desc") {
        return (b.title || "").localeCompare(a.title || "");
      }
      return new Date(b.reviewedAt || b.postedAt || 0) - new Date(a.reviewedAt || a.postedAt || 0);
    });
  }, [resources, searchTerm, departmentFilter, resourceTypeFilter, sortBy]);

  const handleResetFilters = () => {
    setSearchTerm("");
    setDepartmentFilter("all");
    setResourceTypeFilter("all");
    setSortBy("newest");
  };

  const handleOpenResource = (url) => {
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      handleError("Resource link not available.");
    }
  };

  return (
    <section className="dashboard-section">
      <AdminResourceHeader
        title="Rejected Resources"
        subtitle="Audit resources rejected during moderation along with reviewer comments."
        totalCount={resources.length}
        filteredCount={filteredResources.length}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />

      <AdminResourceFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        departmentFilter={departmentFilter}
        setDepartmentFilter={setDepartmentFilter}
        resourceTypeFilter={resourceTypeFilter}
        setResourceTypeFilter={setResourceTypeFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onResetFilters={handleResetFilters}
      />

      {loading ? (
        <div className="admin-state-msg">
          <div className="admin-state-msg__icon">⏳</div>
          <p className="admin-state-msg__title">Loading rejected resources...</p>
          <p className="admin-state-msg__text">Fetching history of declined uploads.</p>
        </div>
      ) : error ? (
        <div className="admin-state-msg">
          <div className="admin-state-msg__icon">⚠️</div>
          <p className="admin-state-msg__title">{error}</p>
          <button
            className="admin-resource-card__action-btn"
            onClick={fetchRejected}
            style={{ marginTop: "12px" }}
          >
            🔄 Retry
          </button>
        </div>
      ) : filteredResources.length === 0 ? (
        <div className="admin-state-msg">
          <div className="admin-state-msg__icon">
            {resources.length === 0 ? "✨" : "🔍"}
          </div>
          <p className="admin-state-msg__title">
            {resources.length === 0
              ? "No rejected resources!"
              : "No matching rejected resources found"}
          </p>
          <p className="admin-state-msg__text">
            {resources.length === 0
              ? "No resource uploads have been rejected."
              : "Try adjusting your search query or filters."}
          </p>
          {resources.length > 0 && (
            <button
              className="admin-resource-card__action-btn"
              onClick={handleResetFilters}
              style={{ marginTop: "12px" }}
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : viewMode === "grid" ? (
        <div className="admin-resource-list">
          {filteredResources.map((resource) => {
            const id = resource.id || resource._id;
            return (
              <AdminResourceCard
                key={id}
                item={resource}
                onViewDetails={(res) => setDetailResource(res)}
                onOpenResource={handleOpenResource}
              />
            );
          })}
        </div>
      ) : (
        <AdminResourceTable
          items={filteredResources}
          onViewDetails={(res) => setDetailResource(res)}
          onOpenResource={handleOpenResource}
        />
      )}

      {detailResource && (
        <AdminDetailModal
          resource={detailResource}
          onClose={() => setDetailResource(null)}
          onOpenResource={handleOpenResource}
        />
      )}
    </section>
  );
}