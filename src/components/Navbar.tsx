import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import {
  Menu,
  X,
  UserCog,
  Bell,
  PlusCircle,
  LayoutDashboard,
  Users,
  ClipboardList,
  UserCircle,
  BarChart3,
  LogOut,
  Settings,
  UtensilsCrossed
} from "lucide-react";
import { cn } from "@/lib/utils";

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const navItems = [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: <LayoutDashboard size={16} />,
    },
    { label: "Users", path: "/users", icon: <Users size={16} /> },
    {
      label: "Diet Plans",
      path: "/diet-plans",
      icon: <UtensilsCrossed size={16} />,
    },
    {
      label: "Meal Plans",
      path: "/meal-plans",
      icon: <ClipboardList size={16} />,
    },
    { label: "Clients", path: "/clients", icon: <UserCircle size={16} /> },
    { label: "Analytics", path: "/analytics", icon: <BarChart3 size={16} /> },
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const getInitials = (name: string) => {
    if (!name) return "NA";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "bg-white/90 backdrop-blur-md shadow-sm border-b border-border/40"
          : "bg-white border-b border-border/40"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <Link to="/dashboard" className="flex items-center">
            <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-md bg-primary">
              <span className="text-lg font-bold text-primary-foreground">
                N
              </span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              NutriAdmin
            </span>
          </Link>

          <nav className="ml-10 hidden space-x-1 md:flex">
            {navItems.map((item) => {
              const isActive =
                location.pathname === item.path ||
                location.pathname.startsWith(`${item.path}/`);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "relative flex items-center px-3 py-2 text-sm font-medium transition-all rounded-md",
                    isActive
                      ? "text-primary active-underline"
                      : "text-foreground/70 hover:text-primary hover-underline"
                  )}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            className="relative rounded-full hidden sm:flex text-muted-foreground hover:text-foreground"
          >
            <Bell size={20} />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-destructive"></span>
          </Button>

          <Button
            variant="default"
            className="hidden sm:flex btn btn-primary hover-lift"
            size="sm"
          >
            <PlusCircle size={16} className="mr-1.5" />
            New Meal Plan
          </Button>

          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-9 w-9 rounded-full p-0 hover-lift"
                  aria-label="User menu"
                >
                  <Avatar className="h-8 w-8 ring-2 ring-primary/20">
                    <AvatarImage
                      src={`https://api.dicebear.com/7.x/initials/svg?seed=${
                        user.name || "NA"
                      }&backgroundColor=38CB89`}
                      alt={user.name || "User"}
                    />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getInitials(user.name || "NA")}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 mt-1" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.name || "Anonymous"}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link
                    to="/profile"
                    className="flex items-center cursor-pointer"
                  >
                    <UserCog className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    to="/settings"
                    className="flex items-center cursor-pointer"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => logout()}
                  className="text-destructive focus:text-destructive cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <button
            className="inline-flex items-center justify-center p-2 text-muted-foreground hover:text-foreground md:hidden"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span className="sr-only">Open main menu</span>
            {isMenuOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu - animated slide down */}
      <div
        className={cn(
          "md:hidden overflow-hidden transition-all duration-300 ease-in-out",
          isMenuOpen ? "max-h-80" : "max-h-0"
        )}
      >
        <div className="border-t border-border/40 bg-card px-2 py-3 shadow-inner">
          {navItems.map((item) => {
            const isActive =
              location.pathname === item.path ||
              location.pathname.startsWith(`${item.path}/`);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center rounded-md px-3 py-2.5 text-sm font-medium transition-colors my-1",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-foreground/70 hover:bg-primary/5 hover:text-primary"
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
          <div className="mt-3 px-3">
            <Button className="w-full btn btn-primary">
              <PlusCircle size={16} className="mr-1.5" />
              New Meal Plan
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
