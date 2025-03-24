
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, Settings } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { UserNav } from "@/components/UserNav";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar = ({ toggleSidebar }: NavbarProps) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { user } = useAuth();

  // Determine if user has gym_admin role to show AI settings
  const isGymAdmin = user?.role === "gym_admin" || user?.role === "admin" || 
                     (user?.roles && (user.roles.includes("gym_admin") || user.roles.includes("admin")));

  return (
    <div className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-4">
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="mr-2 lg:hidden">
          <Menu className="h-6 w-6" />
        </Button>
        <div className="flex items-center space-x-8">
          <Link to="/" className="hidden lg:block">
            <span className="text-2xl font-bold text-primary">Fitlife</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-4 text-sm">
            <Link
              to="/dashboard"
              className={cn(
                "text-muted-foreground transition-colors hover:text-foreground",
                currentPath === "/dashboard" &&
                  "text-foreground font-medium"
              )}
            >
              Dashboard
            </Link>
            <Link
              to="/users"
              className={cn(
                "text-muted-foreground transition-colors hover:text-foreground",
                currentPath.startsWith("/users") &&
                  "text-foreground font-medium"
              )}
            >
              Users
            </Link>
            <Link
              to="/gyms"
              className={cn(
                "text-muted-foreground transition-colors hover:text-foreground",
                currentPath.startsWith("/gyms") &&
                  "text-foreground font-medium"
              )}
            >
              Gyms
            </Link>
            <Link
              to="/diet-plans"
              className={cn(
                "text-muted-foreground transition-colors hover:text-foreground",
                currentPath.startsWith("/diet-plans") &&
                  "text-foreground font-medium"
              )}
            >
              Diet Plans
            </Link>
            <Link
              to="/assessments"
              className={cn(
                "text-muted-foreground transition-colors hover:text-foreground",
                currentPath.startsWith("/assessments") &&
                  "text-foreground font-medium"
              )}
            >
              Assessments
            </Link>
          </nav>
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-4">
          {isGymAdmin && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Settings</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/gyms/1/ai-configurations">AI Configurations</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/profile/settings">User Settings</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <ThemeToggle />
          <UserNav />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
