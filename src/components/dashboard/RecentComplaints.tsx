import { Link } from "react-router-dom";
import { ArrowRight, Droplets, Lightbulb, Volume2 } from "lucide-react";

const complaints = [
  {
    id: "CMP-001",
    title: "Water Leakage in Bathroom",
    category: "Plumbing",
    status: "in-progress",
    date: "25 Jan 2026",
    icon: Droplets,
  },
  {
    id: "CMP-002",
    title: "Street Light Not Working",
    category: "Electrical",
    status: "pending",
    date: "23 Jan 2026",
    icon: Lightbulb,
  },
  {
    id: "CMP-003",
    title: "Noise from Construction",
    category: "General",
    status: "resolved",
    date: "20 Jan 2026",
    icon: Volume2,
  },
];

const statusStyles: Record<string, string> = {
  pending: "status-pending",
  "in-progress": "status-in-progress",
  resolved: "status-resolved",
  rejected: "status-rejected",
};

const statusLabels: Record<string, string> = {
  pending: "Pending",
  "in-progress": "In Progress",
  resolved: "Resolved",
  rejected: "Rejected",
};

export function RecentComplaints() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-card p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-display text-lg font-semibold text-foreground">
          Recent Complaints
        </h2>
        <Link
          to="/my-complaints"
          className="text-sm text-primary font-medium flex items-center gap-1 hover:gap-2 transition-all"
        >
          View All <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="space-y-4">
        {complaints.map((complaint) => (
          <div
            key={complaint.id}
            className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 dark:bg-gray-700/50 hover:bg-muted dark:hover:bg-gray-700 transition-colors cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center flex-shrink-0">
              <complaint.icon className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-muted-foreground font-mono">
                  {complaint.id}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusStyles[complaint.status]}`}
                >
                  {statusLabels[complaint.status]}
                </span>
              </div>
              <h3 className="font-medium text-foreground text-sm truncate">
                {complaint.title}
              </h3>
              <p className="text-xs text-muted-foreground">
                {complaint.category} • {complaint.date}
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground" />
          </div>
        ))}
      </div>
    </div>
  );
}
