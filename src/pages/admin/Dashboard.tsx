import { StatCard } from '@/components/common/admin/StatCard';
import { DataTable } from '@/components/common/admin/DataTable';
import { StatusBadge } from '@/components/common/admin/StatusBadge';
import { PriorityBadge } from '@/components/common/admin/PriorityBadge';
import { mockComplaints, mockDashboardStats } from '@/data/admin/mockData';
import {
  FileText,
  Clock,
  CheckCircle,
  Users,
  UserCog,
  Bell,
  AlertTriangle,
  TrendingUp,
} from 'lucide-react';
import { Complaint } from '@/types/admin';

const recentComplaintsColumns = [
  {
    key: 'id',
    header: 'ID',
    render: (complaint: Complaint) => (
      <span className="text-primary font-mono">{complaint.id}</span>
    ),
  },
  {
    key: 'title',
    header: 'Title',
    render: (complaint: Complaint) => (
      <span className="font-medium">{complaint.title}</span>
    ),
  },
  {
    key: 'flatNo',
    header: 'Flat',
    render: (complaint: Complaint) => (
      <span className="text-muted-foreground">{complaint.flatNo}</span>
    ),
  },
  {
    key: 'priority',
    header: 'Priority',
    render: (complaint: Complaint) => <PriorityBadge priority={complaint.priority} />,
  },
  {
    key: 'status',
    header: 'Status',
    render: (complaint: Complaint) => <StatusBadge status={complaint.status} />,
  },
];

export default function Dashboard() {
  const stats = mockDashboardStats;

  return (
    <>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground cyber-text-glow mb-2">
          Command Center
        </h1>
        <p className="text-muted-foreground">
          Society Complaint Management Overview
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        <StatCard
          title="Total Complaints"
          value={stats.totalComplaints}
          icon={FileText}
          variant="primary"
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Pending"
          value={stats.pendingComplaints}
          icon={Clock}
          variant="warning"
        />
        <StatCard
          title="Resolved"
          value={stats.resolvedComplaints}
          icon={CheckCircle}
          variant="success"
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="Residents"
          value={stats.totalResidents}
          icon={Users}
          variant="default"
        />
        <StatCard
          title="Staff"
          value={stats.totalStaff}
          icon={UserCog}
          variant="default"
        />
        <StatCard
          title="Notices"
          value={stats.activeNotices}
          icon={Bell}
          variant="primary"
        />
      </div>

      {/* Charts and Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Category Distribution */}
        <div className="cyber-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Complaint Categories
          </h3>
          <div className="space-y-4">
            {[
              { name: 'Plumbing', count: 45, color: 'bg-primary' },
              { name: 'Electrical', count: 32, color: 'bg-secondary' },
              { name: 'Maintenance', count: 28, color: 'bg-warning' },
              { name: 'Sanitation', count: 22, color: 'bg-success' },
              { name: 'General', count: 18, color: 'bg-muted-foreground' },
            ].map((category) => (
              <div key={category.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">{category.name}</span>
                  <span className="text-foreground font-medium">{category.count}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full ${category.color} rounded-full transition-all duration-500`}
                    style={{ width: `${(category.count / 50) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Priority Overview */}
        <div className="cyber-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-warning" />
            Priority Overview
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-destructive/10 border border-destructive/20">
              <span className="text-destructive font-medium">Critical</span>
              <span className="text-2xl font-bold text-destructive">5</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-warning/10 border border-warning/20">
              <span className="text-warning font-medium">High</span>
              <span className="text-2xl font-bold text-warning">12</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-primary/10 border border-primary/20">
              <span className="text-primary font-medium">Medium</span>
              <span className="text-2xl font-bold text-primary">18</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-muted-foreground/20">
              <span className="text-muted-foreground font-medium">Low</span>
              <span className="text-2xl font-bold text-muted-foreground">8</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Complaints Table */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">
            Recent Complaints
          </h3>
          <button className="cyber-btn text-sm">View All</button>
        </div>
        <DataTable data={mockComplaints} columns={recentComplaintsColumns} />
      </div>
    </>
  );
}
