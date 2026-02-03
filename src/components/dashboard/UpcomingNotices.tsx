import { Link } from "react-router-dom";
import { ArrowRight, AlertTriangle, Calendar, Info } from "lucide-react";

const notices = [
  {
    id: 1,
    title: "Water Supply Disruption",
    description: "Scheduled maintenance on 28th Jan from 10 AM to 2 PM",
    type: "warning",
    date: "26 Jan 2026",
  },
  {
    id: 2,
    title: "Annual General Meeting",
    description: "AGM scheduled for 15th Feb at Community Hall",
    type: "event",
    date: "25 Jan 2026",
  },
  {
    id: 3,
    title: "New Parking Rules",
    description: "Updated parking guidelines effective from 1st Feb",
    type: "info",
    date: "24 Jan 2026",
  },
];

const typeConfig: Record<string, { icon: typeof AlertTriangle; bg: string; iconColor: string }> = {
  warning: {
    icon: AlertTriangle,
    bg: "bg-amber-100 dark:bg-amber-900/30",
    iconColor: "text-amber-600 dark:text-amber-400",
  },
  event: {
    icon: Calendar,
    bg: "bg-primary/10 dark:bg-primary/20",
    iconColor: "text-primary",
  },
  info: {
    icon: Info,
    bg: "bg-blue-100 dark:bg-blue-900/30",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
};

export function UpcomingNotices() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-card p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-display text-lg font-semibold text-foreground">
          Latest Notices
        </h2>
        <Link
          to="/user/dashboard/notices"
          className="text-sm text-primary font-medium flex items-center gap-1 hover:gap-2 transition-all"
        >
          View All <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="space-y-4">
        {notices.map((notice) => {
          const config = typeConfig[notice.type];
          return (
            <div
              key={notice.id}
              className="p-4 rounded-xl border border-border dark:border-gray-700 hover:border-primary/30 transition-colors cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-10 h-10 rounded-xl ${config.bg} flex items-center justify-center flex-shrink-0`}
                >
                  <config.icon className={`w-5 h-5 ${config.iconColor}`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-foreground text-sm mb-1">
                    {notice.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-2">
                    {notice.description}
                  </p>
                  <p className="text-xs text-primary">{notice.date}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
