
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface AuthLayoutProps {
  children: React.ReactNode;
  illustration: React.ReactNode;
  title: string;
  subtitle: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ 
  children, 
  illustration, 
  title, 
  subtitle 
}) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-pulse text-primary">Loading...</div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="split-screen-content">
      <div className="split-screen-content-left">
        <div className="form-container animate-scale-in">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">{title}</h1>
            <p className="mt-2 text-lg text-gray-600">{subtitle}</p>
          </div>
          {children}
        </div>
      </div>
      <div className="split-screen-content-right">
        {illustration}
      </div>
    </div>
  );
};

export default AuthLayout;
