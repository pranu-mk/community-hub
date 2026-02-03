import { Sidebar } from "./Sidebar";
import { TopNavbar } from "./TopNavbar";
import { Outlet } from "react-router-dom";

export function DashboardLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="ml-64 p-6 transition-all duration-300">
        <TopNavbar />
        <div className="animate-fade-in">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
