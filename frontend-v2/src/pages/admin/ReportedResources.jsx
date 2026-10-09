import React, { useState, useEffect, useMemo } from "react";
import "../../css/admin/admin.css";
import "../../css/dashboard/resources.css";
import { getReports, reviewReport } from "../../services/reportService";
import { handleSuccess, handleError } from "../../utils";
import AdminResourceHeader from "../../components/admin/AdminResourceHeader";
import AdminResourceFilters from "../../components/admin/AdminResourceFilters";
import AdminBulkBar from "../../components/admin/AdminBulkBar";
import AdminResourceCard from "../../components/admin/AdminResourceCard";
import AdminResourceTable from "../../components/admin/AdminResourceTable";
import AdminDetailModal from "../../components/admin/AdminDetailModal";
import AdminConfirmModal from "../../components/admin/AdminConfirmModal";

export default function ReportedResources() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Status Filter
  const [statusFilter, setStatusFilter] = useState("pending"); // "pending", "resolved", "dismissed"

  // Controls state
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [resourceTypeFilter, setResourceTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("table");

  // Selection & Bulk state
  const [selectedIds, setSelectedIds] = useState([]);
  const [isProcessingBulk, setIsProcessingBulk] = useState(false);

  // Single Action loading state
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // Modal states
  const [detailReport, setDetailReport] = useState(null);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    type: "", // 'resolve'|'dismiss'|'bulk_resolve'|'bulk_dismiss'
    target: null,
    title: "",
    message: "",
    confirmText: "Confirm",
    confirmVariant: "primary",
    requireReason: false,
  });

  useEffect(() => {
    fetchReportsList();
  }, [statusFilter]);

  const fetchReportsList = async () => {
    try {
      setLoading(true);
      setError(null);
      setSelectedIds([]);
      const res = await getReports(statusFilter);
      if (res?.success) {
        setReports(res.reports || []);
      } else {
        setError(res?.message || "Failed to load reported resources.");
      }
    } catch (err) {
      console.error("Error fetching reports:", err);
      setError("Unable to load reports.");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchReportsList();
  };

  // Filter & Sort reports
  const filteredReports = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();

    const filtered = reports.filter((item) => {
      const resource =
        item.resource && typeof item.resource === "object" ? item.resource : {};
      const reporter =
        item.reporter && typeof item.reporter === "object" ? item.reporter : {};

      const matchesSearch =
        !search ||
        resource.title?.toLowerCase().includes(search) ||
        resource.courseCode?.toLowerCase().includes(search) ||
        resource.department?.toLowerCase().includes(search) ||
        reporter.name?.toLowerCase().includes(search) ||
        item.reason?.toLowerCase().includes(search) ||
        item.category?.toLowerCase().includes(search);

      const matchesDept =
        departmentFilter === "all" || resource.department === departmentFilter;

      const matchesType =
        resourceTypeFilter === "all" ||
        resource.resourceType?.toLowerCase() === resourceTypeFilter.toLowerCase();

      return matchesSearch && matchesDept && matchesType;
    });

    return filtered.sort((a, b) => {
      if (sortBy === "oldest") {
        return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      }
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });
  }, [reports, searchTerm, departmentFilter, resourceTypeFilter, sortBy]);

  const filteredIds = useMemo(() => filteredReports.map((r) => r._id), [filteredReports]);

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
      handleError("Resource file link not available.");
    }
  };

  // Prompts for Actions
  const promptResolve = (reportItem) => {
    setConfirmModal({
      isOpen: true,
      type: "resolve",
      target: reportItem,
      title: "Resolve Report",
      message: "Mark this report as resolved. You can add an optional review note.",
      requireReason: false,
      confirmText: "✅ Resolve Report",
      confirmVariant: "approve",
    });
  };

  const promptDismiss = (reportItem) => {
    setConfirmModal({
      isOpen: true,
      type: "dismiss",
      target: reportItem,
      title: "Dismiss Report",
      message: "Dismiss this report if it is invalid or requires no action. Optional review note:",
      requireReason: false,
      confirmText: "✕ Dismiss Report",
      confirmVariant: "archive",
    });
  };

  const promptBulkResolve = () => {
    setConfirmModal({
      isOpen: true,
      type: "bulk_resolve",
      target: null,
      title: `Bulk Resolve (${selectedIds.length} reports)`,
      message: `Mark all ${selectedIds.length} selected reports as resolved.`,
      requireReason: false,
      confirmText: `✅ Resolve ${selectedIds.length} Reports`,
      confirmVariant: "approve",
    });
  };

  const promptBulkDismiss = () => {
    setConfirmModal({
      isOpen: true,
      type: "bulk_dismiss",
      target: null,
      title: `Bulk Dismiss (${selectedIds.length} reports)`,
      message: `Dismiss all ${selectedIds.length} selected reports.`,
      requireReason: false,
      confirmText: `✕ Dismiss ${selectedIds.length} Reports`,
      confirmVariant: "archive",
    });
  };

  // Modal execution handler
  const handleModalConfirm = async (noteInput) => {
    const { type, target } = confirmModal;

    if (type === "resolve" || type === "dismiss") {
      const status = type === "resolve" ? "resolved" : "dismissed";
      const reportId = target._id;
      setActionLoadingId(reportId);
      try {
        const res = await reviewReport(reportId, status, noteInput);
        if (res?.success) {
          handleSuccess(`Report ${status} successfully.`);
          setReports((prev) => prev.filter((item) => item._id !== reportId));
          setSelectedIds((prev) => prev.filter((id) => id !== reportId));
        } else {
          handleError(res?.message || "Failed to update report.");
        }
      } catch (err) {
        handleError(err?.message || "An error occurred while reviewing the report.");
      } finally {
        setActionLoadingId(null);
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      }
    } else if (type === "bulk_resolve" || type === "bulk_dismiss") {
      const status = type === "bulk_resolve" ? "resolved" : "dismissed";
      setIsProcessingBulk(true);
      let successCount = 0;
      let failCount = 0;

      for (const reportId of selectedIds) {
        try {
          const res = await reviewReport(reportId, status, noteInput);
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
        handleSuccess(`${successCount} report(s) marked as ${status}.`);
      }
      if (failCount > 0) {
        handleError(`Failed to update ${failCount} report(s).`);
      }

      setReports((prev) => prev.filter((r) => !selectedIds.includes(r._id)));
      setSelectedIds([]);
      setIsProcessingBulk(false);
      setConfirmModal((prev) => ({ ...prev, isOpen: false }));
    }
  };

  return (
    <section className="dashboard-section">
      <AdminResourceHeader
        title="Reported Resources"
        subtitle="Review and action reports submitted by students regarding content quality or copyright."
        totalCount={reports.length}
        filteredCount={filteredReports.length}
        selectedCount={selectedIds.length}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />

      {/* Report Status Filter Tabs */}
      <div className="admin-pending-header" style={{ marginBottom: "16px" }}>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <button
            type="button"
            className={`admin-view-btn ${statusFilter === "pending" ? "admin-view-btn--active" : ""}`}
            onClick={() => setStatusFilter("pending")}
            style={{ padding: "8px 16px", borderRadius: "20px" }}
          >
            🚩 Pending Reports
          </button>
          <button
            type="button"
            className={`admin-view-btn ${statusFilter === "resolved" ? "admin-view-btn--active" : ""}`}
            onClick={() => setStatusFilter("resolved")}
            style={{ padding: "8px 16px", borderRadius: "20px" }}
          >
            ✅ Resolved Reports
          </button>
          <button
            type="button"
            className={`admin-view-btn ${statusFilter === "dismissed" ? "admin-view-btn--active" : ""}`}
            onClick={() => setStatusFilter("dismissed")}
            style={{ padding: "8px 16px", borderRadius: "20px" }}
          >
            ✕ Dismissed Reports
          </button>
        </div>
      </div>

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

      {statusFilter === "pending" && (
        <AdminBulkBar
          selectedIds={selectedIds}
          allFilteredIds={filteredIds}
          onToggleSelectAll={handleToggleSelectAll}
          onClearSelection={() => setSelectedIds([])}
          isProcessing={isProcessingBulk}
          bulkActions={[
            { label: "✅ Bulk Resolve", variant: "approve", onClick: promptBulkResolve },
            { label: "✕ Bulk Dismiss", variant: "archive", onClick: promptBulkDismiss },
          ]}
        />
      )}

      {loading ? (
        <div className="admin-state-msg">
          <div className="admin-state-msg__icon">⏳</div>
          <p className="admin-state-msg__title">Loading reports...</p>
          <p className="admin-state-msg__text">Fetching student reported content.</p>
        </div>
      ) : error ? (
        <div className="admin-state-msg">
          <div className="admin-state-msg__icon">⚠️</div>
          <p className="admin-state-msg__title">{error}</p>
          <button
            className="admin-resource-card__action-btn"
            onClick={fetchReportsList}
            style={{ marginTop: "12px" }}
          >
            🔄 Retry
          </button>
        </div>
      ) : filteredReports.length === 0 ? (
        <div className="admin-state-msg">
          <div className="admin-state-msg__icon">
            {reports.length === 0 ? "🎉" : "🔍"}
          </div>
          <p className="admin-state-msg__title">
            {reports.length === 0
              ? `No ${statusFilter} reports found!`
              : "No matching reports found"}
          </p>
          <p className="admin-state-msg__text">
            {reports.length === 0
              ? "All student reports in this section have been cleared."
              : "Try adjusting your search criteria or clear filters."}
          </p>
          {reports.length > 0 && (
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
          {filteredReports.map((reportItem) => {
            const id = reportItem._id;
            const isLoading = actionLoadingId === id;

            const cardActions =
              statusFilter === "pending"
                ? [
                    {
                      label: "✅ Resolve",
                      variant: "approve",
                      isLoading,
                      onClick: () => promptResolve(reportItem),
                    },
                    {
                      label: "✕ Dismiss",
                      variant: "archive",
                      isLoading,
                      onClick: () => promptDismiss(reportItem),
                    },
                  ]
                : [];

            return (
              <AdminResourceCard
                key={id}
                item={reportItem}
                isReport={true}
                isSelected={selectedIds.includes(id)}
                onToggleSelect={statusFilter === "pending" ? handleToggleSelect : null}
                onViewDetails={() => setDetailReport(reportItem)}
                onOpenResource={handleOpenResource}
                actions={cardActions}
              />
            );
          })}
        </div>
      ) : (
        <AdminResourceTable
          items={filteredReports}
          isReport={true}
          selectedIds={selectedIds}
          onToggleSelect={statusFilter === "pending" ? handleToggleSelect : () => {}}
          onToggleSelectAll={statusFilter === "pending" ? handleToggleSelectAll : () => {}}
          onViewDetails={(reportItem) => setDetailReport(reportItem)}
          onOpenResource={handleOpenResource}
          actions={
            statusFilter === "pending"
              ? [
                  {
                    label: "✅ Resolve",
                    variant: "approve",
                    onClick: (item) => promptResolve(item),
                  },
                  {
                    label: "✕ Dismiss",
                    variant: "archive",
                    onClick: (item) => promptDismiss(item),
                  },
                ]
              : []
          }
        />
      )}

      {detailReport && (
        <AdminDetailModal
          report={detailReport}
          onClose={() => setDetailReport(null)}
          onOpenResource={handleOpenResource}
        />
      )}

      <AdminConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={confirmModal.confirmText}
        confirmVariant={confirmModal.confirmVariant}
        requireReason={false}
        reasonPlaceholder="Optional review note..."
        isLoading={actionLoadingId !== null || isProcessingBulk}
        onConfirm={handleModalConfirm}
        onClose={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
      />
    </section>
  );
}
