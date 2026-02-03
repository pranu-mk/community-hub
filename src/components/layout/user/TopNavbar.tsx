import { Bell, ChevronDown, Sun, Moon } from "lucide-react";
import { useTheme } from "@/context/user/ThemeContext";
import { useNavigate } from "react-router-dom";

export function TopNavbar() {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <header className="flex items-center justify-end mb-8">
      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="relative w-10 h-10 rounded-xl bg-white dark:bg-gray-800 shadow-card flex items-center justify-center hover:shadow-floating transition-all"
        >
          {theme === "light" ? (
            <Moon className="w-5 h-5 text-muted-foreground" />
          ) : (
            <Sun className="w-5 h-5 text-accent" />
          )}
        </button>

        {/* Notifications */}
        <button 
          onClick={() => navigate("/notices")}
          className="relative w-10 h-10 rounded-xl bg-white dark:bg-gray-800 shadow-card flex items-center justify-center hover:shadow-floating transition-all"
        >
          <Bell className="w-5 h-5 text-muted-foreground" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full" />
        </button>

        {/* Profile */}
        <button className="flex items-center gap-3 pl-4 pr-3 py-2 rounded-xl bg-white dark:bg-gray-800 shadow-card hover:shadow-floating transition-all">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-foreground">Rajesh Sharma</p>
            <p className="text-xs text-muted-foreground">A-402, Tower 1</p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
            <span className="text-sm font-medium text-white">RS</span>
          </div>
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>
    </header>
  );
}
