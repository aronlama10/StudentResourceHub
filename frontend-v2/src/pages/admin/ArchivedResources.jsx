import React, { useState, useEffect, useMemo } from "react";
import "../../css/admin/admin.css";
import "../../css/dashboard/resources.css";
import {
  getArchivedResources,
  restoreResource,
} from "../../services/adminService";
import { handleSuccess, handleError } from "../../utils";
import AdminResourceHeader from "../../components/admin/AdminResourceHeader";
import AdminResourceFilters from "../../components/admin/AdminResourceFilters";
import AdminBulkBar from "../../components/admin/AdminBulkBar";
import AdminResourceCard from "../../components/admin/AdminResourceCard";
import AdminResourceTable from "../../components/admin/AdminResourceTable";
import AdminDetailModal from "../../components/admin/AdminDetailModal";
import AdminConfirmModal from "../../components/admin/AdminConfirmModal";

export default function ArchivedResources() {
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

  // Selection & Bulk state
  const [selectedIds, setSelectedIds] = useState([]);
  const [isProcessingBulk, setIsProcessingBulk] = useState(false);

  // Action loading states
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // Modal states
  const [detailResource, setDetailResource] = useState(null);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    type: "",
    target: null,
    title: "",
    message: "",
    confirmText: "Confirm",
    confirmVariant: "primary",
  });

  useEffect(() => {
    fetchArchived();
  }, []);

  const fetchArchived = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getArchivedResources();
      if (res?.success) {
        setResources(res.resources || []);
      } else {
        setError(res?.message || "Failed to load archived resources.");
      }
    } catch (err) {
      console.error("Error fetching archived resources:", err);
      setError("Unable to load archived resources.");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchArchived();
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
        item.department?.toLowerCase().includes(search);

      const matchesDept =
        departmentFilter === "all" || item.department === departmentFilter;

      const matchesType =
        resourceTypeFilter === "all" ||
        item.resourceType?.toLowerCase() === resourceTypeFilter.toLowerCase();

      return matchesSearch && matchesDept && matchesType;
    });

    return filtered.sort((a, b) => {
      if (sortBy === "oldest") {
        return new Date(a.postedAt || 0) - new Date(b.postedAt || 0);
      }
      if (sortBy === "title_asc") {
        return (a.title || "").localeCompare(b.title || "");
      }
      if (sortBy === "title_desc") {
        return (b.title || "").localeCompare(a.title || "");
      }
      return new Date(b.postedAt || 0) - new Date(a.postedAt || 0);
    });
  }, [resources, searchTerm, departmentFilter, resourceTypeFilter, sortBy]);

  const filteredIds = useMemo(
    () => filteredResources.map((r) => r.id || r._id),
    [filteredResources]
  );

  const handleToggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAll = () => {
    if (filteredIds.every((id) => selectedIds.includes(id))) {
      setSelectedIds((prev) => prev.filter((id) => !filteredIds.includes(id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...filteredIds])));
    }
  };

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

  // Restore Actions
  const promptRestoreSingle = (resource) => {
    setConfirmModal({
      isOpen: true,
      type: "single_restore",
      target: resource,
      title: "Restore Resource",
      message: `Are you sure you want to restore "${resource.title}"? It will be published back to the public approved list.`,
      requireReason: false,
      confirmText: "🔄 Restore Resource",
      confirmVariant: "approve",
    });
  };

  const promptBulkRestore = () => {
    setConfirmModal({
      isOpen: true,
      type: "bulk_restore",
      target: null,
      title: `Bulk Restore (${selectedIds.length} items)`,
      message: `Are you sure you want to restore all ${selectedIds.length} selected resources back to the public list?`,
      requireReason: false,
      confirmText: `🔄 Restore ${selectedIds.length} Resources`,
      confirmVariant: "approve",
    });
  };

  const handleModalConfirm = async () => {
    const { type, target } = confirmModal;

    if (type === "single_restore") {
      const id = target.id || target._id;
      setActionLoadingId(id);
      try {
        const res = await restoreResource(id);
        if (res?.success) {
          handleSuccess(res.message || "Resource restored successfully!");
          setResources((prev) => prev.filter((r) => (r.id || r._id) !== id));
          setSelectedIds((prev) => prev.filter((i) => i !== id));
        } else {
          handleError(res?.message || "Failed to restore resource.");
        }
      } catch (err) {
        handleError(err?.message || "An error occurred while restoring.");
      } finally {
        setActionLoadingId(null);
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      }
    } else if (type === "bulk_restore") {
      setIsProcessingBulk(true);
      let successCount = 0;
      let failCount = 0;

      for (const id of selectedIds) {
        try {
          const res = await restoreResource(id);
          if (res?.success) {
            successCount++;
          } else {
            failCount++;
          }
        } catch (err) {
          failCount++;
        }
      }

      if (successCount > 0) {
        handleSuccess(`Restored ${successCount} resource(s) successfully!`);
      }
      if (failCount > 0) {
        handleError(`Failed to restore ${failCount} resource(s).`);
      }

      setResources((prev) => prev.filter((r) => !selectedIds.includes(r.id || r._id)));
      setSelectedIds([]);
      setIsProcessingBulk(false);
      setConfirmModal((prev) => ({ ...prev, isOpen: false }));
    }
  };

  return (
    <section className="dashboard-section">
      <AdminResourceHeader
        title="Archived Resources"
        subtitle="Manage and restore resources that have been archived from public listings."
        totalCount={resources.length}
        filteredCount={filteredResources.length}
        selectedCount={selectedIds.length}
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

      <AdminBulkBar
        selectedIds={selectedIds}
        allFilteredIds={filteredIds}
        onToggleSelectAll={handleToggleSelectAll}
        onClearSelection={() => setSelectedIds([])}
        isProcessing={isProcessingBulk}
        bulkActions={[
          { label: "🔄 Bulk Restore", variant: "approve", onClick: promptBulkRestore },
        ]}
      />

      {loading ? (
        <div className="admin-state-msg">
          <div className="admin-state-msg__icon">⏳</div>
          <p className="admin-state-msg__title">Loading archived resources...</p>
          <p className="admin-state-msg__text">Fetching archived items.</p>
        </div>
      ) : error ? (
        <div className="admin-state-msg">
          <div className="admin-state-msg__icon">⚠️</div>
          <p className="admin-state-msg__title">{error}</p>
          <button
            className="admin-resource-card__action-btn"
            onClick={fetchArchived}
            style={{ marginTop: "12px" }}
          >
            🔄 Retry
          </button>
        </div>
      ) : filteredResources.length === 0 ? (
        <div className="admin-state-msg">
          <div className="admin-state-msg__icon">🗃️</div>
          <p className="admin-state-msg__title">
            {resources.length === 0
              ? "No archived resources!"
              : "No matching archived resources found"}
          </p>
          <p className="admin-state-msg__text">
            {resources.length === 0
              ? "Archived items will appear here if removed from active view."
              : "Try adjusting your search criteria or clear filters."}
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
            const isLoading = actionLoadingId === id;

            return (
              <AdminResourceCard
                key={id}
                item={resource}
                isSelected={selectedIds.includes(id)}
                onToggleSelect={handleToggleSelect}
                onViewDetails={(res) => setDetailResource(res)}
                onOpenResource={handleOpenResource}
                actions={[
                  {
                    label: "🔄 Restore",
                    variant: "approve",
                    isLoading,
                    onClick: (res) => promptRestoreSingle(res),
                  },
                ]}
              />
            );
          })}
        </div>
      ) : (
        <AdminResourceTable
          items={filteredResources}
          selectedIds={selectedIds}
          onToggleSelect={handleToggleSelect}
          onToggleSelectAll={handleToggleSelectAll}
          onViewDetails={(res) => setDetailResource(res)}
          onOpenResource={handleOpenResource}
          actions={[
            {
              label: "🔄 Restore",
              variant: "approve",
              onClick: (res) => promptRestoreSingle(res),
            },
          ]}
        />
      )}

      {detailResource && (
        <AdminDetailModal
          resource={detailResource}
          onClose={() => setDetailResource(null)}
          onOpenResource={handleOpenResource}
        />
      )}

      <AdminConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={confirmModal.confirmText}
        confirmVariant={confirmModal.confirmVariant}
        isLoading={actionLoadingId !== null || isProcessingBulk}
        onConfirm={handleModalConfirm}
        onClose={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
      />
    </section>
  );
}