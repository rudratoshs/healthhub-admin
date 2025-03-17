
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import NotFound from "@/pages/NotFound";
import DashboardLayout from "@/components/DashboardLayout";
import Users from "@/pages/user/Users";
import CreateUser from "@/pages/user/CreateUser";
import EditUser from "@/pages/user/EditUser";
import UserDetail from "@/pages/user/UserDetail";

// Gym pages
import Gyms from "@/pages/gym/Gyms";
import CreateGym from "@/pages/gym/CreateGym";
import EditGym from "@/pages/gym/EditGym";
import GymDetail from "@/pages/gym/GymDetail";
import GymUsers from "@/pages/gym/GymUsers";

// Client Profile pages
import ClientProfile from "@/pages/clientProfile/ClientProfile";
import CreateClientProfile from "@/pages/clientProfile/CreateClientProfile";
import EditClientProfile from "@/pages/clientProfile/EditClientProfile";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<DashboardLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />
              
              {/* User Management Routes */}
              <Route path="users" element={<Users />} />
              <Route path="users/create" element={<CreateUser />} />
              <Route path="users/:id" element={<UserDetail />} />
              <Route path="users/:id/edit" element={<EditUser />} />
              
              {/* Client Profile Routes */}
              <Route path="users/:id/profile" element={<ClientProfile />} />
              <Route path="users/:id/profile/create" element={<CreateClientProfile />} />
              <Route path="users/:id/profile/edit" element={<EditClientProfile />} />
              
              {/* Gym Management Routes */}
              <Route path="gyms" element={<Gyms />} />
              <Route path="gyms/create" element={<CreateGym />} />
              <Route path="gyms/:id" element={<GymDetail />} />
              <Route path="gyms/:id/edit" element={<EditGym />} />
              <Route path="gyms/:id/users" element={<GymUsers />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
