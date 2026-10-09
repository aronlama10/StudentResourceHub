import { Navigate } from "react-router-dom";

/**
 * Route guard that allows only admin and moderator roles.
 * Reads the JWT from localStorage, decodes its payload,
 * and checks the `role` claim.
 */
export default function AdminRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const allowedRoles = ["admin", "moderator"];

    if (!allowedRoles.includes(payload.role)) {
      // Students see the regular dashboard, not admin
      return <Navigate to="/dashboard" replace />;
    }
  } catch {
    return <Navigate to="/login" replace />;
  }

  return children;
}
