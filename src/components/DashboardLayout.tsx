
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { Loader } from "@/components/ui/loader";

const DashboardLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-primary-50/30">
        <div className="flex flex-col items-center space-y-4">
          <Loader size="lg" variant="primary" />
          <p className="text-primary-600 font-medium animate-pulse">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="dashboard-layout">
      <Navbar />
      <main className="dashboard-main page-transition">
        {children || <Outlet />}
      </main>
    </div>
  );
};

export default DashboardLayout;
