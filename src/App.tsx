import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import { ThemeProvider } from "./context/user/ThemeContext";

// Public Pages
import Index from "./pages/Index";
import About from "./pages/About";
import Facilities from "./pages/Facilities";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

// User Dashboard Layout
import { DashboardLayout } from "./components/layout/user/DashboardLayout";

// User Dashboard Pages (NESTED)
import UserDashboardHome from "./pages/user/Index";
import RaiseComplaint from "./pages/user/RaiseComplaint";
import MyComplaints from "./pages/user/MyComplaints";
import Notices from "./pages/user/Notices";
import Profile from "./pages/user/Profile";
import EmergencyContact from "./pages/user/EmergencyContact";
import BookAmenity from "./pages/user/BookAmenity";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* ---------------- Public Routes ---------------- */}
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/facilities" element={<Facilities />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* ---------------- User Dashboard Routes ---------------- */}
          <Route
            path="/user"
            element={
              <ProtectedRoute allowedRole="USER">
                <ThemeProvider>
                  <DashboardLayout />
                </ThemeProvider>
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<UserDashboardHome />} />
            <Route path="dashboard/raise-complaint" element={<RaiseComplaint />} />
            <Route path="dashboard/my-complaints" element={<MyComplaints />} />
            <Route path="dashboard/notices" element={<Notices />} />
            <Route path="dashboard/profile" element={<Profile />} />
            <Route path="dashboard/emergency-contact" element={<EmergencyContact />} />
            <Route path="dashboard/book-amenity" element={<BookAmenity />} />
            <Route index element={<Navigate to="dashboard" replace />} />
          </Route>

          {/* ---------------- Admin Dashboard (placeholder) ---------------- */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRole="ADMIN">
                <div className="p-10">
                  <h1>Society Admin Dashboard Content</h1>
                </div>
              </ProtectedRoute>
            }
          />

          {/* ---------------- Fallback ---------------- */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
