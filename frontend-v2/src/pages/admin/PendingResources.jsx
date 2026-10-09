import React, { useState, useEffect, useMemo } from "react";
import "../../css/admin/admin.css";
import "../../css/dashboard/resources.css";
import {
  getPendingResources,
  approveResource,
  rejectResource,
} from "../../services/adminService";
import { handleSuccess, handleError } from "../../utils";
import AdminResourceHeader from "../../components/admin/AdminResourceHeader";
import AdminResourceFilters from "../../components/admin/AdminResourceFilters";
import AdminBulkBar from "../../components/admin/AdminBulkBar";
import AdminResourceCard from "../../components/admin/AdminResourceCard";
import AdminResourceTable from "../../components/admin/AdminResourceTable";
import AdminDetailModal from "../../components/admin/AdminDetailModal";
import AdminConfirmModal from "../../components/admin/AdminConfirmModal";

export default function PendingResources() {
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

  // Confirm modal state: { isOpen, type: 'single_approve'|'single_reject'|'bulk_approve'|'bulk_reject', target: resource|null, title, message, requireReason, confirmText, confirmVariant }
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    type: "",
    target: null,
    title: "",
    message: "",
    requireReason: false,
    confirmText: "Confirm",
    confirmVariant: "primary",
  });

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getPendingResources();
      if (res?.success) {
        setResources(res.resources || []);
      } else {
        setError(res?.message || "Failed to load pending resources.");
      }
    } catch (err) {
      console.error("Error fetching pending resources:", err);
      setError("Unable to load pending resources.");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchPending();
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

    // Sort
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
      // default: newest
      return new Date(b.postedAt || 0) - new Date(a.postedAt || 0);
    });
  }, [resources, searchTerm, departmentFilter, resourceTypeFilter, sortBy]);

  const filteredIds = useMemo(
    () => filteredResources.map((r) => r.id || r._id),
    [filteredResources]
  );

  // Selection handlers
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

  // --- Single Action Handlers ---
  const promptApproveSingle = (resource) => {
    setConfirmModal({
      isOpen: true,
      type: "single_approve",
      target: resource,
      title: "Approve Resource",
      message: `Are you sure you want to approve "${resource.title}"? It will become publicly available to students.`,
      requireReason: false,
      confirmText: "✅ Approve Resource",
      confirmVariant: "approve",
    });
  };

  const promptRejectSingle = (resource) => {
    setConfirmModal({
      isOpen: true,
      type: "single_reject",
      target: resource,
      title: "Reject Resource",
      message: `Please provide a reason for rejecting "${resource.title}".`,
      requireReason: true,
      confirmText: "❌ Reject Resource",
      confirmVariant: "reject",
    });
  };

  // --- Bulk Action Handlers ---
  const promptBulkApprove = () => {
    setConfirmModal({
      isOpen: true,
      type: "bulk_approve",
      target: null,
      title: `Bulk Approve (${selectedIds.length} items)`,
      message: `Are you sure you want to approve all ${selectedIds.length} selected resources? They will be published immediately.`,
      requireReason: false,
      confirmText: `✅ Approve ${selectedIds.length} Resources`,
      confirmVariant: "approve",
    });
  };

  const promptBulkReject = () => {
    setConfirmModal({
      isOpen: true,
      type: "bulk_reject",
      target: null,
      title: `Bulk Reject (${selectedIds.length} items)`,
      message: `Please enter a rejection reason that will apply to all ${selectedIds.length} selected resources.`,
      requireReason: true,
      confirmText: `❌ Reject ${selectedIds.length} Resources`,
      confirmVariant: "reject",
    });
  };

  // Execute confirmed modal action
  const handleModalConfirm = async (reasonInput) => {
    const { type, target } = confirmModal;

    if (type === "single_approve") {
      const id = target.id || target._id;
      setActionLoadingId(id);
      try {
        const res = await approveResource(id);
        if (res?.success) {
          handleSuccess(res.message || "Resource approved successfully!");
          setResources((prev) => prev.filter((r) => (r.id || r._id) !== id));
          setSelectedIds((prev) => prev.filter((i) => i !== id));
        } else {
          handleError(res?.message || "Failed to approve resource.");
        }
      } catch (err) {
        handleError(err?.message || "An error occurred while approving.");
      } finally {
        setActionLoadingId(null);
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      }
    } else if (type === "single_reject") {
      const id = target.id || target._id;
      setActionLoadingId(id);
      try {
        const res = await rejectResource(id, reasonInput);
        if (res?.success) {
          handleSuccess(res.message || "Resource rejected successfully!");
          setResources((prev) => prev.filter((r) => (r.id || r._id) !== id));
          setSelectedIds((prev) => prev.filter((i) => i !== id));
        } else {
          handleError(res?.message || "Failed to reject resource.");
        }
      } catch (err) {
        handleError(err?.message || "An error occurred while rejecting.");
      } finally {
        setActionLoadingId(null);
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      }
    } else if (type === "bulk_approve") {
      setIsProcessingBulk(true);
      let successCount = 0;
      let failCount = 0;

      for (const id of selectedIds) {
        try {
          const res = await approveResource(id);
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
        handleSuccess(`Approved ${successCount} resource(s) successfully!`);
      }
      if (failCount > 0) {
        handleError(`Failed to approve ${failCount} resource(s).`);
      }

      setResources((prev) => prev.filter((r) => !selectedIds.includes(r.id || r._id)));
      setSelectedIds([]);
      setIsProcessingBulk(false);
      setConfirmModal((prev) => ({ ...prev, isOpen: false }));
    } else if (type === "bulk_reject") {
      setIsProcessingBulk(true);
      let successCount = 0;
      let failCount = 0;

      for (const id of selectedIds) {
        try {
          const res = await rejectResource(id, reasonInput);
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
        handleSuccess(`Rejected ${successCount} resource(s).`);
      }
      if (failCount > 0) {
        handleError(`Failed to reject ${failCount} resource(s).`);
      }

      setResources((prev) => prev.filter((r) => !selectedIds.includes(r.id || r._id)));
      setSelectedIds([]);
      setIsProcessingBulk(false);
      setConfirmModal((prev) => ({ ...prev, isOpen: false }));
    }
  };

  return (
    <section className="dashboard-section">
      {/* Header */}
      <AdminResourceHeader
        title="Pending Resources"
        subtitle="Review and moderate newly uploaded study materials."
        totalCount={resources.length}
        filteredCount={filteredResources.length}
        selectedCount={selectedIds.length}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />

      {/* Filter & Controls Bar */}
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

      {/* Bulk Action Bar */}
      <AdminBulkBar
        selectedIds={selectedIds}
        allFilteredIds={filteredIds}
        onToggleSelectAll={handleToggleSelectAll}
        onClearSelection={() => setSelectedIds([])}
        isProcessing={isProcessingBulk}
        bulkActions={[
          { label: "✅ Bulk Approve", variant: "approve", onClick: promptBulkApprove },
          { label: "❌ Bulk Reject", variant: "reject", onClick: promptBulkReject },
        ]}
      />

      {/* Loading State */}
      {loading ? (
        <div className="admin-state-msg">
          <div className="admin-state-msg__icon">⏳</div>
          <p className="admin-state-msg__title">Loading pending resources...</p>
          <p className="admin-state-msg__text">Fetching items awaiting admin approval.</p>
        </div>
      ) : error ? (
        <div className="admin-state-msg">
          <div className="admin-state-msg__icon">⚠️</div>
          <p className="admin-state-msg__title">{error}</p>
          <button
            className="admin-resource-card__action-btn"
            onClick={fetchPending}
            style={{ marginTop: "12px" }}
          >
            🔄 Retry
          </button>
        </div>
      ) : filteredResources.length === 0 ? (
        <div className="admin-state-msg">
          <div className="admin-state-msg__icon">
            {resources.length === 0 ? "🎉" : "🔍"}
          </div>
          <p className="admin-state-msg__title">
            {resources.length === 0
              ? "No pending resources!"
              : "No matching pending resources found"}
          </p>
          <p className="admin-state-msg__text">
            {resources.length === 0
              ? "All submitted uploads have been reviewed."
              : "Try adjusting your search terms or filters."}
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
                    label: "✅ Approve",
                    variant: "approve",
                    isLoading,
                    onClick: (res) => promptApproveSingle(res),
                  },
                  {
                    label: "❌ Reject",
                    variant: "reject",
                    isLoading,
                    onClick: (res) => promptRejectSingle(res),
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
              label: "✅ Approve",
              variant: "approve",
              onClick: (res) => promptApproveSingle(res),
            },
            {
              label: "❌ Reject",
              variant: "reject",
              onClick: (res) => promptRejectSingle(res),
            },
          ]}
        />
      )}

      {/* Details Modal */}
      {detailResource && (
        <AdminDetailModal
          resource={detailResource}
          onClose={() => setDetailResource(null)}
          onOpenResource={handleOpenResource}
        />
      )}

      {/* Confirmation Modal */}
      <AdminConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={confirmModal.confirmText}
        confirmVariant={confirmModal.confirmVariant}
        requireReason={confirmModal.requireReason}
        reasonPlaceholder="Specify reason for moderation action..."
        isLoading={actionLoadingId !== null || isProcessingBulk}
        onConfirm={handleModalConfirm}
        onClose={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
      />
    </section>
  );
}
