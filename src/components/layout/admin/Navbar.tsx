import { useState, useRef, useEffect } from 'react';
import { Bell, Search, User, X } from 'lucide-react';

const staticNotifications = [
  { id: 1, message: 'New complaint registered - Water Leakage in A-101', time: '2 min ago' },
  { id: 2, message: 'Complaint #C003 marked In Progress', time: '15 min ago' },
  { id: 3, message: 'New notice published - Maintenance Schedule', time: '1 hour ago' },
  { id: 4, message: 'Staff member assigned to complaint #C005', time: '2 hours ago' },
  { id: 5, message: 'Complaint #C002 resolved successfully', time: '3 hours ago' },
];

export function Navbar() {
  const [showNotifications, setShowNotifications] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        panelRef.current &&
        buttonRef.current &&
        !panelRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    };

    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

  return (
    <header className="glass-navbar h-16 flex items-center justify-between px-6 sticky top-0 z-40">
      {/* Search Bar */}
      <div className="relative w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search complaints, residents, staff..."
          className="cyber-input w-full pl-10 pr-4 py-2 text-sm"
        />
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <div className="relative">
          <button
            ref={buttonRef}
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg hover:bg-primary/10 transition-colors cursor-pointer"
          >
            <Bell className="w-5 h-5 text-muted-foreground" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full animate-pulse-glow" />
          </button>

          {/* Notification Panel */}
          {showNotifications && (
            <div
              ref={panelRef}
              className="absolute right-0 top-12 w-80 cyber-card border border-primary/30 shadow-lg z-50"
            >
              <div className="flex items-center justify-between p-4 border-b border-primary/20">
                <h3 className="text-sm font-semibold text-foreground">Notifications</h3>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="p-1 rounded hover:bg-primary/10 transition-colors"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {staticNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="p-4 border-b border-primary/10 hover:bg-primary/5 transition-colors cursor-pointer"
                  >
                    <p className="text-sm text-foreground">{notification.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                  </div>
                ))}
              </div>
              <div className="p-3 text-center border-t border-primary/20">
                <span className="text-xs text-primary cursor-pointer hover:underline">
                  View all notifications
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Admin Profile */}
        <div className="flex items-center gap-3 pl-4 border-l border-primary/20">
          <div className="text-right">
            <p className="text-sm font-medium text-foreground">Admin User</p>
            <p className="text-xs text-muted-foreground">Super Admin</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/30">
            <User className="w-5 h-5 text-primary" />
          </div>
        </div>
      </div>

      {/* Bottom glow line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
    </header>
  );
}
