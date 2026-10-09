import { useState, useCallback } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import "../../css/dashboard/layout.css";
import "../../css/dashboard/shared.css";

function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  const closeSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  return (
    <div className="dashboard">
      <AdminSidebar isOpen={sidebarOpen} onClose={closeSidebar} />
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={closeSidebar} />
      )}
      <div className="dashboard__main">
        <AdminHeader onToggleSidebar={toggleSidebar} />
        <main className="dashboard__content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
