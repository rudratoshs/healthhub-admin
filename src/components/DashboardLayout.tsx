
import React, { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { Loader } from "@/components/ui/loader";

const DashboardLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

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
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-background to-primary-50/20 font-poppins">
      <Navbar toggleSidebar={toggleSidebar} />
      <main className="flex-1 p-4 md:p-6 transition-all duration-300 ease-in-out">
        <div className="mx-auto max-w-7xl">
          {children || <Outlet />}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
