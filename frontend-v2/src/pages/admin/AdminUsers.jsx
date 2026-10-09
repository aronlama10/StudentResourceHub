import React, { useState, useEffect, useMemo, useCallback } from "react";
import "../../css/admin/admin.css";
import "../../css/dashboard/resources.css";
import {
  getAdminUsers,
  updateAdminUserRole,
  deleteAdminUser,
} from "../../services/adminService";
import { handleSuccess, handleError } from "../../utils";
import AdminResourceHeader from "../../components/admin/AdminResourceHeader";
import AdminResourceFilters from "../../components/admin/AdminResourceFilters";
import AdminBulkBar from "../../components/admin/AdminBulkBar";
import AdminConfirmModal from "../../components/admin/AdminConfirmModal";
import AdminUserDetailModal from "../../components/admin/AdminUserDetailModal";

const ROLES = ["student", "moderator", "admin"];

function getInitials(name, email) {
  const str = name || email || "?";
  return str
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filters state
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name_asc");
  const [viewMode, setViewMode] = useState("table");

  // Selection & Bulk state
  const [selectedIds, setSelectedIds] = useState([]);
  const [isProcessingBulk, setIsProcessingBulk] = useState(false);

  // Action loading states
  const [busyUserId, setBusyUserId] = useState(null);

  // Modal states
  const [detailUser, setDetailUser] = useState(null);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    type: "", // 'delete_single'|'delete_bulk'|'role_single'|'role_bulk'
    target: null,
    newRole: null,
    title: "",
    message: "",
    confirmText: "Confirm",
    confirmVariant: "primary",
  });

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getAdminUsers();
      const payload = res?.data ?? res;

      if (payload?.success === false) {
        throw new Error(payload.message || "Failed to load users.");
      }

      const userList = payload?.users ?? payload?.data?.users;
      if (Array.isArray(userList)) {
        setUsers(userList);
      } else {
        throw new Error("Invalid response structure for users list.");
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err?.message || "Unable to load users list.");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchUsers();
  };

  // Filter & Sort users
  const filteredUsers = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    const filtered = users.filter((user) => {
      const matchesSearch =
        !query ||
        [user.name, user.email, user.department, user.year, user.role]
          .filter(Boolean)
          .some((val) => String(val).toLowerCase().includes(query));

      const matchesRole = roleFilter === "all" || user.role === roleFilter;

      const matchesDept =
        departmentFilter === "all" || user.department === departmentFilter;

      return matchesSearch && matchesRole && matchesDept;
    });

    return filtered.sort((a, b) => {
      if (sortBy === "name_desc") {
        return (b.name || b.email || "").localeCompare(a.name || a.email || "");
      }
      if (sortBy === "role") {
        return (a.role || "").localeCompare(b.role || "");
      }
      // default: name_asc
      return (a.name || a.email || "").localeCompare(b.name || b.email || "");
    });
  }, [users, searchTerm, roleFilter, departmentFilter, sortBy]);

  const filteredIds = useMemo(
    () => filteredUsers.map((u) => u._id || u.id),
    [filteredUsers]
  );

  // Counts summary
  const counts = useMemo(
    () => ({
      all: users.length,
      student: users.filter((u) => u.role === "student").length,
      moderator: users.filter((u) => u.role === "moderator").length,
      admin: users.filter((u) => u.role === "admin").length,
    }),
    [users]
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
    setRoleFilter("all");
    setDepartmentFilter("all");
    setSortBy("name_asc");
  };

  // Prompts for action modals
  const promptDeleteSingle = (user) => {
    setConfirmModal({
      isOpen: true,
      type: "delete_single",
      target: user,
      title: "Delete User Account",
      message: `Are you sure you want to permanently delete the account for "${user.name || user.email}"? This action cannot be undone.`,
      confirmText: "❌ Delete Account",
      confirmVariant: "reject",
    });
  };

  const promptBulkDelete = () => {
    setConfirmModal({
      isOpen: true,
      type: "delete_bulk",
      target: null,
      title: `Bulk Delete (${selectedIds.length} users)`,
      message: `Are you sure you want to permanently delete all ${selectedIds.length} selected user accounts?`,
      confirmText: `❌ Delete ${selectedIds.length} Accounts`,
      confirmVariant: "reject",
    });
  };

  const handleRoleChangeSelect = (user, newRole) => {
    const userId = user._id || user.id;
    if (!userId || newRole === user.role) return;

    setConfirmModal({
      isOpen: true,
      type: "role_single",
      target: user,
      newRole,
      title: "Change User Role",
      message: `Are you sure you want to change the role of "${user.name || user.email}" from ${user.role?.toUpperCase()} to ${newRole.toUpperCase()}?`,
      confirmText: `Change to ${newRole.toUpperCase()}`,
      confirmVariant: "approve",
    });
  };

  // Execute modal confirmation
  const handleModalConfirm = async () => {
    const { type, target, newRole } = confirmModal;

    if (type === "delete_single") {
      const id = target._id || target.id;
      setBusyUserId(id);
      try {
        const res = await deleteAdminUser(id);
        const payload = res?.data ?? res;
        if (payload?.success === false) {
          throw new Error(payload.message || "Could not delete user.");
        }
        handleSuccess("User account deleted successfully.");
        setUsers((prev) => prev.filter((u) => (u._id || u.id) !== id));
        setSelectedIds((prev) => prev.filter((i) => i !== id));
      } catch (err) {
        handleError(err?.message || "Failed to delete user.");
      } finally {
        setBusyUserId(null);
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      }
    } else if (type === "role_single") {
      const id = target._id || target.id;
      setBusyUserId(id);
      try {
        const res = await updateAdminUserRole(id, newRole);
        const payload = res?.data ?? res;
        if (payload?.success === false) {
          throw new Error(payload.message || "Could not update user role.");
        }
        handleSuccess(`Role updated to ${newRole.toUpperCase()}.`);
        setUsers((prev) =>
          prev.map((u) => ((u._id || u.id) === id ? { ...u, role: newRole } : u))
        );
      } catch (err) {
        handleError(err?.message || "Failed to update user role.");
      } finally {
        setBusyUserId(null);
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      }
    } else if (type === "delete_bulk") {
      setIsProcessingBulk(true);
      let successCount = 0;
      let failCount = 0;

      for (const id of selectedIds) {
        try {
          const res = await deleteAdminUser(id);
          const payload = res?.data ?? res;
          if (payload?.success !== false) {
            successCount++;
          } else {
            failCount++;
          }
        } catch (err) {
          failCount++;
        }
      }

      if (successCount > 0) {
        handleSuccess(`Deleted ${successCount} user account(s).`);
      }
      if (failCount > 0) {
        handleError(`Failed to delete ${failCount} account(s).`);
      }

      setUsers((prev) => prev.filter((u) => !selectedIds.includes(u._id || u.id)));
      setSelectedIds([]);
      setIsProcessingBulk(false);
      setConfirmModal((prev) => ({ ...prev, isOpen: false }));
    }
  };

  const getRoleBadgeClass = (role) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return "admin-role-badge--admin";
      case "moderator":
        return "admin-role-badge--moderator";
      default:
        return "admin-role-badge--student";
    }
  };

  return (
    <section className="dashboard-section">
      <AdminResourceHeader
        title="User Management"
        subtitle="Manage registered student accounts, assign platform roles, and handle access."
        totalCount={users.length}
        filteredCount={filteredUsers.length}
        selectedCount={selectedIds.length}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />

      {/* Role Stats Breakdown Grid */}
      <div className="admin-stats-grid">
        <article className="admin-stat-card">
          <div className="admin-stat-card__icon-wrap admin-stat-card__icon-wrap--blue">
            👥
          </div>
          <p className="admin-stat-card__label">Total Registered Users</p>
          <h3 className="admin-stat-card__value">
            {loading ? "—" : counts.all}
          </h3>
          <p className="admin-stat-card__hint">Across all departments</p>
        </article>

        <article className="admin-stat-card">
          <div className="admin-stat-card__icon-wrap admin-stat-card__icon-wrap--green">
            🎓
          </div>
          <p className="admin-stat-card__label">Students</p>
          <h3 className="admin-stat-card__value">
            {loading ? "—" : counts.student}
          </h3>
          <p className="admin-stat-card__hint">Standard student members</p>
        </article>

        <article className="admin-stat-card">
          <div className="admin-stat-card__icon-wrap admin-stat-card__icon-wrap--amber">
            🛡️
          </div>
          <p className="admin-stat-card__label">Moderators</p>
          <h3 className="admin-stat-card__value">
            {loading ? "—" : counts.moderator}
          </h3>
          <p className="admin-stat-card__hint">Content moderators</p>
        </article>

        <article className="admin-stat-card">
          <div className="admin-stat-card__icon-wrap admin-stat-card__icon-wrap--red">
            👑
          </div>
          <p className="admin-stat-card__label">Administrators</p>
          <h3 className="admin-stat-card__value">
            {loading ? "—" : counts.admin}
          </h3>
          <p className="admin-stat-card__hint">Full system control</p>
        </article>
      </div>

      {/* Control Bar & Filters */}
      <div className="admin-filter-bar">
        <div className="admin-search-wrap">
          <span className="admin-search-icon">🔍</span>
          <input
            type="text"
            className="admin-search-input"
            placeholder="Search users by name, email, department..."
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

        <div className="admin-filter-selects">
          <select
            className="admin-select-input"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            title="Filter by Role"
          >
            <option value="all">All Roles</option>
            <option value="student">Students</option>
            <option value="moderator">Moderators</option>
            <option value="admin">Administrators</option>
          </select>

          <select
            className="admin-select-input"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            title="Sort Users"
          >
            <option value="name_asc">Name (A-Z)</option>
            <option value="name_desc">Name (Z-A)</option>
            <option value="role">Role Rank</option>
          </select>
        </div>

        <div className="admin-filter-right">
          {(searchTerm || roleFilter !== "all" || departmentFilter !== "all") && (
            <button
              type="button"
              className="admin-reset-btn"
              onClick={handleResetFilters}
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

      {/* Bulk Toolbar */}
      <AdminBulkBar
        selectedIds={selectedIds}
        allFilteredIds={filteredIds}
        onToggleSelectAll={handleToggleSelectAll}
        onClearSelection={() => setSelectedIds([])}
        isProcessing={isProcessingBulk}
        bulkActions={[
          { label: "❌ Bulk Delete Users", variant: "reject", onClick: promptBulkDelete },
        ]}
      />

      {/* Content Rendering */}
      {loading ? (
        <div className="admin-state-msg">
          <div className="admin-state-msg__icon">⏳</div>
          <p className="admin-state-msg__title">Loading registered users...</p>
          <p className="admin-state-msg__text">Fetching account directories.</p>
        </div>
      ) : error ? (
        <div className="admin-state-msg">
          <div className="admin-state-msg__icon">⚠️</div>
          <p className="admin-state-msg__title">{error}</p>
          <button
            className="admin-resource-card__action-btn"
            onClick={fetchUsers}
            style={{ marginTop: "12px" }}
          >
            🔄 Retry
          </button>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="admin-state-msg">
          <div className="admin-state-msg__icon">👥</div>
          <p className="admin-state-msg__title">
            {users.length === 0 ? "No registered users!" : "No matching users found"}
          </p>
          <p className="admin-state-msg__text">
            {users.length === 0
              ? "New student registrations will appear here."
              : "Try adjusting your search or role filters."}
          </p>
          {users.length > 0 && (
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
        <div className="admin-resource-list" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "16px" }}>
          {filteredUsers.map((user) => {
            const userId = user._id || user.id;
            const isSelected = selectedIds.includes(userId);
            const isBusy = busyUserId === userId;

            return (
              <div
                key={userId}
                className={`admin-user-card ${isSelected ? "admin-resource-card--selected" : ""}`}
              >
                <div className="admin-user-card__top">
                  <div className="admin-user-card__identity">
                    <input
                      type="checkbox"
                      className="admin-card-checkbox"
                      checked={isSelected}
                      onChange={() => handleToggleSelect(userId)}
                    />
                    <div className="admin-resource-card__avatar" style={{ width: "42px", height: "42px" }}>
                      {user.avatar ? (
                        <img src={user.avatar} alt="" style={{ width: "100%", height: "100%", borderRadius: "50%" }} />
                      ) : (
                        getInitials(user.name, user.email)
                      )}
                    </div>
                    <div className="admin-user-card__details">
                      <p className="admin-user-card__name">{user.name || "Unnamed User"}</p>
                      <p className="admin-user-card__email">{user.email || "No email"}</p>
                    </div>
                  </div>

                  <span className={`admin-role-badge ${getRoleBadgeClass(user.role)}`}>
                    {user.role || "student"}
                  </span>
                </div>

                <div className="admin-resource-card__divider" />

                <div className="admin-user-card__meta">
                  <span>🏢 Dept: <strong>{user.department || "—"}</strong></span>
                  <span>🎓 Year: <strong>{user.year || "—"}</strong></span>
                </div>

                <div className="admin-resource-card__divider" />

                <div className="admin-user-card__actions">
                  <button
                    type="button"
                    className="admin-resource-card__action-btn"
                    onClick={() => setDetailUser(user)}
                  >
                    🔍 Details
                  </button>

                  <select
                    className="admin-role-select"
                    value={user.role}
                    disabled={isBusy || !ROLES.includes(user.role)}
                    onChange={(e) => handleRoleChangeSelect(user, e.target.value)}
                    title="Change Role"
                  >
                    {ROLES.map((r) => (
                      <option key={r} value={r}>
                        Role: {r.toUpperCase()}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    className="admin-resource-card__action-btn admin-resource-card__action-btn--reject"
                    disabled={isBusy}
                    onClick={() => promptDeleteSingle(user)}
                    style={{ marginLeft: "auto" }}
                  >
                    {isBusy ? "..." : "🗑️ Delete"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: "40px", textAlign: "center" }}>
                  <input
                    type="checkbox"
                    checked={
                      filteredIds.length > 0 &&
                      filteredIds.every((id) => selectedIds.includes(id))
                    }
                    onChange={handleToggleSelectAll}
                  />
                </th>
                <th>User Details</th>
                <th>Department & Year</th>
                <th>Role</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => {
                const userId = user._id || user.id;
                const isSelected = selectedIds.includes(userId);
                const isBusy = busyUserId === userId;

                return (
                  <tr key={userId} className={isSelected ? "admin-table-row--selected" : ""}>
                    <td style={{ textAlign: "center" }}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSelect(userId)}
                      />
                    </td>
                    <td>
                      <div className="admin-user-card__identity">
                        <div className="admin-resource-card__avatar" style={{ width: "36px", height: "36px", fontSize: "0.8rem" }}>
                          {user.avatar ? (
                            <img src={user.avatar} alt="" style={{ width: "100%", height: "100%", borderRadius: "50%" }} />
                          ) : (
                            getInitials(user.name, user.email)
                          )}
                        </div>
                        <div className="admin-table-title-wrap">
                          <span className="admin-table-title">{user.name || "Unnamed User"}</span>
                          <span className="admin-table-sub">{user.email || "No email"}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="admin-table-author-wrap">
                        <span className="admin-table-author">{user.department || "—"}</span>
                        <span className="admin-table-dept">Year: {user.year || "—"}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`admin-role-badge ${getRoleBadgeClass(user.role)}`}>
                        {user.role || "student"}
                      </span>
                    </td>
                    <td>
                      <div className="admin-table-actions">
                        <button
                          type="button"
                          className="admin-resource-card__action-btn"
                          onClick={() => setDetailUser(user)}
                        >
                          🔍 Details
                        </button>

                        <select
                          className="admin-role-select"
                          value={user.role}
                          disabled={isBusy || !ROLES.includes(user.role)}
                          onChange={(e) => handleRoleChangeSelect(user, e.target.value)}
                        >
                          {ROLES.map((r) => (
                            <option key={r} value={r}>
                              {r.toUpperCase()}
                            </option>
                          ))}
                        </select>

                        <button
                          type="button"
                          className="admin-resource-card__action-btn admin-resource-card__action-btn--reject"
                          disabled={isBusy}
                          onClick={() => promptDeleteSingle(user)}
                        >
                          {isBusy ? "..." : "🗑️ Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {detailUser && (
        <AdminUserDetailModal
          user={detailUser}
          onClose={() => setDetailUser(null)}
        />
      )}

      <AdminConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={confirmModal.confirmText}
        confirmVariant={confirmModal.confirmVariant}
        isLoading={busyUserId !== null || isProcessingBulk}
        onConfirm={handleModalConfirm}
        onClose={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
      />
    </section>
  );
}
