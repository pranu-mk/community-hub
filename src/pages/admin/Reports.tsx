import { mockComplaints, mockDashboardStats, mockStaff } from '@/data/admin/mockData';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Download,
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import { toast } from 'sonner';

export default function Reports() {
  const stats = mockDashboardStats;

  const categoryData = [
    { name: 'Plumbing', count: 45, percentage: 29 },
    { name: 'Electrical', count: 32, percentage: 21 },
    { name: 'Maintenance', count: 28, percentage: 18 },
    { name: 'Sanitation', count: 22, percentage: 14 },
    { name: 'General', count: 18, percentage: 12 },
    { name: 'Security', count: 11, percentage: 7 },
  ];

  const monthlyData = [
    { month: 'Jan', complaints: 45, resolved: 38 },
    { month: 'Feb', complaints: 52, resolved: 48 },
    { month: 'Mar', complaints: 38, resolved: 35 },
    { month: 'Apr', complaints: 62, resolved: 55 },
    { month: 'May', complaints: 48, resolved: 45 },
    { month: 'Jun', complaints: 55, resolved: 50 },
  ];

  const resolutionRate =
    Math.round((stats.resolvedComplaints / stats.totalComplaints) * 100);

  const getStaffName = (staffId?: string) => {
    if (!staffId) return 'Not Assigned';
    return mockStaff.find((s) => s.id === staffId)?.name || 'Unknown';
  };

  const handleExportCSV = () => {
    const headers = ['Complaint ID', 'Category', 'Priority', 'Status', 'Date', 'Assigned Staff', 'Resolution'];
    const rows = mockComplaints.map((c) => [
      c.id,
      c.category,
      c.priority,
      c.status,
      new Date(c.createdAt).toLocaleDateString(),
      getStaffName(c.assignedTo),
      c.adminRemark || 'N/A',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `complaints_report_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);

    toast.success('CSV report downloaded successfully');
  };

  const handleExportPDF = () => {
    // Create a printable HTML content
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Complaints Report</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { color: #333; border-bottom: 2px solid #22d3ee; padding-bottom: 10px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
          th { background-color: #0f172a; color: white; }
          tr:nth-child(even) { background-color: #f9f9f9; }
          .header-info { margin-bottom: 20px; color: #666; }
        </style>
      </head>
      <body>
        <h1>Society Complaints Report</h1>
        <div class="header-info">
          <p>Generated on: ${new Date().toLocaleString()}</p>
          <p>Total Complaints: ${mockComplaints.length}</p>
        </div>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Category</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Date</th>
              <th>Assigned Staff</th>
              <th>Resolution</th>
            </tr>
          </thead>
          <tbody>
            ${mockComplaints
              .map(
                (c) => `
              <tr>
                <td>${c.id}</td>
                <td>${c.category}</td>
                <td>${c.priority}</td>
                <td>${c.status}</td>
                <td>${new Date(c.createdAt).toLocaleDateString()}</td>
                <td>${getStaffName(c.assignedTo)}</td>
                <td>${c.adminRemark || 'N/A'}</td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
      toast.success('PDF report generated - use print dialog to save as PDF');
    }
  };

  return (
    <>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground cyber-text-glow mb-2">
            Reports
          </h1>
          <p className="text-muted-foreground">
            Analytics and performance metrics
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="cyber-btn flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button
            onClick={handleExportPDF}
            className="cyber-btn-solid flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export PDF
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="stat-card">
          <div className="flex items-center justify-between mb-4">
            <FileText className="w-8 h-8 text-primary" />
            <span className="flex items-center gap-1 text-success text-sm">
              <TrendingUp className="w-4 h-4" />
              +12%
            </span>
          </div>
          <p className="text-3xl font-bold text-foreground">{stats.totalComplaints}</p>
          <p className="text-sm text-muted-foreground">Total Complaints</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-4">
            <CheckCircle className="w-8 h-8 text-success" />
            <span className="flex items-center gap-1 text-success text-sm">
              <TrendingUp className="w-4 h-4" />
              +8%
            </span>
          </div>
          <p className="text-3xl font-bold text-foreground">{resolutionRate}%</p>
          <p className="text-sm text-muted-foreground">Resolution Rate</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-4">
            <Clock className="w-8 h-8 text-warning" />
            <span className="flex items-center gap-1 text-destructive text-sm">
              <TrendingDown className="w-4 h-4" />
              -5%
            </span>
          </div>
          <p className="text-3xl font-bold text-foreground">2.4</p>
          <p className="text-sm text-muted-foreground">Avg. Resolution (Days)</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-4">
            <AlertTriangle className="w-8 h-8 text-destructive" />
          </div>
          <p className="text-3xl font-bold text-foreground">{stats.pendingComplaints}</p>
          <p className="text-sm text-muted-foreground">Pending Issues</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Category Distribution */}
        <div className="cyber-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            Complaints by Category
          </h3>
          <div className="space-y-4">
            {categoryData.map((category) => (
              <div key={category.name}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-foreground font-medium">{category.name}</span>
                  <span className="text-muted-foreground">
                    {category.count} ({category.percentage}%)
                  </span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500"
                    style={{ width: `${category.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Trend */}
        <div className="cyber-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Monthly Trend
          </h3>
          <div className="space-y-4">
            {monthlyData.map((data) => (
              <div key={data.month} className="flex items-center gap-4">
                <span className="w-12 text-sm text-muted-foreground">{data.month}</span>
                <div className="flex-1 flex items-center gap-2">
                  <div className="flex-1 h-6 bg-muted rounded-full overflow-hidden flex">
                    <div
                      className="h-full bg-primary/60"
                      style={{ width: `${(data.complaints / 70) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-primary w-8">{data.complaints}</span>
                </div>
                <div className="flex-1 flex items-center gap-2">
                  <div className="flex-1 h-6 bg-muted rounded-full overflow-hidden flex">
                    <div
                      className="h-full bg-success/60"
                      style={{ width: `${(data.resolved / 70) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-success w-8">{data.resolved}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-primary/10">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary/60" />
              <span className="text-sm text-muted-foreground">Complaints</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-success/60" />
              <span className="text-sm text-muted-foreground">Resolved</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="cyber-card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-6">
          Recent Resolutions
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-primary/20">
                <th className="text-left text-sm font-medium text-muted-foreground px-4 py-3">
                  Complaint ID
                </th>
                <th className="text-left text-sm font-medium text-muted-foreground px-4 py-3">
                  Title
                </th>
                <th className="text-left text-sm font-medium text-muted-foreground px-4 py-3">
                  Category
                </th>
                <th className="text-left text-sm font-medium text-muted-foreground px-4 py-3">
                  Resolution Time
                </th>
                <th className="text-left text-sm font-medium text-muted-foreground px-4 py-3">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {mockComplaints
                .filter((c) => c.status === 'resolved')
                .map((complaint) => (
                  <tr key={complaint.id} className="cyber-table-row">
                    <td className="px-4 py-3 text-sm text-primary font-mono">
                      {complaint.id}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {complaint.title}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {complaint.category}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      3 days
                    </td>
                    <td className="px-4 py-3">
                      <span className="status-badge status-resolved">Resolved</span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
