import { useState } from "react";
import { BackButton } from "@/components/layout/user/BackButton";
import {
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Droplets,
  Lightbulb,
  Volume2,
  Car,
  MessageCircle,
} from "lucide-react";

const complaintsData = [
  {
    id: "CMP-001",
    title: "Water Leakage in Bathroom",
    category: "Plumbing",
    description: "There is continuous water leakage from the bathroom ceiling. It has been damaging the wall paint and causing dampness.",
    status: "in-progress",
    priority: "high",
    date: "25 Jan 2026",
    lastUpdate: "27 Jan 2026",
    icon: Droplets,
    updates: [
      { date: "27 Jan", message: "Plumber assigned - Mr. Ravi Kumar" },
      { date: "26 Jan", message: "Complaint reviewed by maintenance team" },
      { date: "25 Jan", message: "Complaint registered" },
    ],
  },
  {
    id: "CMP-002",
    title: "Street Light Not Working",
    category: "Electrical",
    description: "The street light near parking area B is not functioning for the past 3 days. Creating safety concerns at night.",
    status: "pending",
    priority: "medium",
    date: "23 Jan 2026",
    lastUpdate: "23 Jan 2026",
    icon: Lightbulb,
    updates: [
      { date: "23 Jan", message: "Complaint registered" },
    ],
  },
  {
    id: "CMP-003",
    title: "Noise from Construction",
    category: "General",
    description: "Excessive noise from construction work in the adjacent plot during non-permitted hours.",
    status: "resolved",
    priority: "low",
    date: "20 Jan 2026",
    lastUpdate: "24 Jan 2026",
    icon: Volume2,
    updates: [
      { date: "24 Jan", message: "Issue resolved - Construction timings regulated" },
      { date: "22 Jan", message: "Notice sent to construction site" },
      { date: "20 Jan", message: "Complaint registered" },
    ],
  },
  {
    id: "CMP-004",
    title: "Unauthorized Parking",
    category: "Parking",
    description: "Unknown vehicle parked in my allocated parking spot (P-42) for the past 2 days.",
    status: "rejected",
    priority: "medium",
    date: "18 Jan 2026",
    lastUpdate: "19 Jan 2026",
    icon: Car,
    updates: [
      { date: "19 Jan", message: "Rejected - Vehicle belongs to guest staying with B-302" },
      { date: "18 Jan", message: "Complaint registered" },
    ],
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

const priorityStyles: Record<string, string> = {
  low: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  medium: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  high: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const MyComplaints = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredComplaints = complaintsData.filter(
    (c) => filterStatus === "all" || c.status === filterStatus
  );

  return (
    <div className="max-w-5xl mx-auto">
      <BackButton />
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-foreground mb-2">
          My Complaints
        </h1>
        <p className="text-muted-foreground">
          Track and manage all your submitted complaints.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-card p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search complaints..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-muted dark:bg-gray-700 border-0 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-muted dark:bg-gray-700 border-0 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Complaints List */}
      <div className="space-y-4">
        {filteredComplaints.map((complaint) => (
          <div
            key={complaint.id}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-card overflow-hidden"
          >
            {/* Main Row */}
            <div
              className="p-5 cursor-pointer hover:bg-muted/30 dark:hover:bg-gray-700/30 transition-colors"
              onClick={() =>
                setExpandedId(expandedId === complaint.id ? null : complaint.id)
              }
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <complaint.icon className="w-6 h-6 text-primary" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-xs text-muted-foreground font-mono">
                      {complaint.id}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusStyles[complaint.status]}`}
                    >
                      {statusLabels[complaint.status]}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${priorityStyles[complaint.priority]}`}
                    >
                      {complaint.priority.charAt(0).toUpperCase() + complaint.priority.slice(1)} Priority
                    </span>
                  </div>
                  <h3 className="font-medium text-foreground mb-1">
                    {complaint.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {complaint.category} • Submitted: {complaint.date}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground hidden sm:block">
                    Last update: {complaint.lastUpdate}
                  </span>
                  {expandedId === complaint.id ? (
                    <ChevronUp className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
              </div>
            </div>

            {/* Expanded Details */}
            {expandedId === complaint.id && (
              <div className="border-t border-border dark:border-gray-700 p-5 bg-muted/20 dark:bg-gray-700/20 animate-fade-in">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Description */}
                  <div>
                    <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                      <MessageCircle className="w-4 h-4 text-primary" />
                      Description
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {complaint.description}
                    </p>
                  </div>

                  {/* Timeline */}
                  <div>
                    <h4 className="font-medium text-foreground mb-3">
                      Updates Timeline
                    </h4>
                    <div className="space-y-3">
                      {complaint.updates.map((update, idx) => (
                        <div key={idx} className="flex gap-3">
                          <div className="flex flex-col items-center">
                            <div
                              className={`w-2.5 h-2.5 rounded-full ${
                                idx === 0 ? "bg-primary" : "bg-muted-foreground/30"
                              }`}
                            />
                            {idx < complaint.updates.length - 1 && (
                              <div className="w-0.5 h-full bg-muted-foreground/20" />
                            )}
                          </div>
                          <div className="pb-3">
                            <p className="text-xs text-primary font-medium">
                              {update.date}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {update.message}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredComplaints.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No complaints found.</p>
        </div>
      )}
    </div>
  );
};

export default MyComplaints;
