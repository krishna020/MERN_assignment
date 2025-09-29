import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingFallback from "./LoadingFallback";

export default function ProtectedRoute({ children, roles = [] }) {
  const { user, loading } = useAuth();

  // While AuthContext is checking login/token → show loader
  if (loading) {
    return <LoadingFallback />;
  }

  // Not logged in → go to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but role not allowed → go to unauthorized
  if (roles.length > 0 && (!user.role || !roles.includes(user.role))) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Allowed → render the protected page
  return children;
}
