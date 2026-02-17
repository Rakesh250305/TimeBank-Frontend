import { Outlet, Navigate } from "react-router-dom";

export default function AdminProtectedRoute() {
  const token = sessionStorage.getItem("adminToken");

  return token ? <Outlet /> : <Navigate to="/adminLogin" replace />;
}
