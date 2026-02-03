import { useState } from 'react';
import { DataTable } from '@/components/common/admin/DataTable';
import { StatusBadge } from '@/components/common/admin/StatusBadge';
import { PriorityBadge } from '@/components/common/admin/PriorityBadge';
import { mockComplaints, mockStaff } from '@/data/admin/mockData';
import { Complaint } from '@/types/admin';
import { Search, Filter, Eye, X, Save, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

export default function Complaints() {
  const [complaints, setComplaints] = useState<Complaint[]>(mockComplaints);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  
  // Edit form state
  const [editStatus, setEditStatus] = useState<string>('');
  const [editRemark, setEditRemark] = useState<string>('');
  const [editAssignedTo, setEditAssignedTo] = useState<string>('');

  const filteredComplaints = complaints.filter((complaint) => {
    const matchesSearch =
      complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.flatNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || complaint.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenComplaint = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setEditStatus(complaint.status);
    setEditRemark(complaint.adminRemark || '');
    setEditAssignedTo(complaint.assignedTo || '');
  };

  const handleSaveChanges = () => {
    if (!selectedComplaint) return;

    setComplaints((prev) =>
      prev.map((c) =>
        c.id === selectedComplaint.id
          ? {
              ...c,
              status: editStatus as Complaint['status'],
              adminRemark: editRemark,
              assignedTo: editAssignedTo || undefined,
              updatedAt: new Date().toISOString(),
            }
          : c
      )
    );

    toast.success(`Complaint ${selectedComplaint.id} updated successfully`);
    setSelectedComplaint(null);
  };

  const getStaffName = (staffId?: string) => {
    if (!staffId) return 'Not Assigned';
    return mockStaff.find((s) => s.id === staffId)?.name || 'Unknown';
  };

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'rejected', label: 'Rejected' },
  ];

  const columns = [
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
        <div>
          <span className="font-medium block">{complaint.title}</span>
          <span className="text-xs text-muted-foreground">{complaint.category}</span>
        </div>
      ),
    },
    {
      key: 'residentName',
      header: 'Resident',
      render: (complaint: Complaint) => (
        <div>
          <span className="block">{complaint.residentName}</span>
          <span className="text-xs text-muted-foreground">{complaint.flatNo}</span>
        </div>
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
    {
      key: 'createdAt',
      header: 'Date',
      render: (complaint: Complaint) => (
        <span className="text-muted-foreground text-sm">
          {new Date(complaint.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (complaint: Complaint) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleOpenComplaint(complaint);
          }}
          className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors"
        >
          <Eye className="w-4 h-4" />
        </button>
      ),
    },
  ];

  return (
    <>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground cyber-text-glow mb-2">
          All Complaints
        </h1>
        <p className="text-muted-foreground">
          View and manage all society complaints
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by ID, title, or flat..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="cyber-input w-full pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="cyber-input"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="cyber-card p-4 text-center">
          <p className="text-2xl font-bold text-foreground">{complaints.length}</p>
          <p className="text-sm text-muted-foreground">Total</p>
        </div>
        <div className="cyber-card p-4 text-center border-warning/30">
          <p className="text-2xl font-bold text-warning">
            {complaints.filter((c) => c.status === 'pending').length}
          </p>
          <p className="text-sm text-muted-foreground">Pending</p>
        </div>
        <div className="cyber-card p-4 text-center border-primary/30">
          <p className="text-2xl font-bold text-primary">
            {complaints.filter((c) => c.status === 'in-progress').length}
          </p>
          <p className="text-sm text-muted-foreground">In Progress</p>
        </div>
        <div className="cyber-card p-4 text-center border-success/30">
          <p className="text-2xl font-bold text-success">
            {complaints.filter((c) => c.status === 'resolved').length}
          </p>
          <p className="text-sm text-muted-foreground">Resolved</p>
        </div>
      </div>

      {/* Table */}
      <DataTable data={filteredComplaints} columns={columns} />

      {/* Action Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="cyber-card w-full max-w-3xl p-6 m-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  {selectedComplaint.title}
                </h2>
                <p className="text-sm text-primary font-mono">{selectedComplaint.id}</p>
              </div>
              <button
                onClick={() => setSelectedComplaint(null)}
                className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Complaint Details */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Resident</p>
                <p className="text-foreground">{selectedComplaint.residentName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Flat</p>
                <p className="text-foreground">{selectedComplaint.flatNo}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Category</p>
                <p className="text-foreground">{selectedComplaint.category}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Priority</p>
                <PriorityBadge priority={selectedComplaint.priority} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Current Status</p>
                <StatusBadge status={selectedComplaint.status} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Created</p>
                <p className="text-foreground">
                  {new Date(selectedComplaint.createdAt).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-sm text-muted-foreground mb-2">Description</p>
              <p className="text-foreground bg-muted/30 p-4 rounded-lg">
                {selectedComplaint.description}
              </p>
            </div>

            {/* Action Section */}
            <div className="border-t border-primary/20 pt-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Manage Complaint
              </h3>

              {/* Status Change */}
              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                  Change Status
                  <ArrowRight className="w-4 h-4" />
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {statusOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setEditStatus(option.value)}
                      className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                        editStatus === option.value
                          ? 'border-primary bg-primary/20 text-primary'
                          : 'border-primary/20 text-muted-foreground hover:border-primary/40'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Assign Staff */}
              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-2">
                  Assign / Reassign Staff
                </p>
                <select
                  value={editAssignedTo}
                  onChange={(e) => setEditAssignedTo(e.target.value)}
                  className="cyber-input w-full"
                >
                  <option value="">Not Assigned</option>
                  {mockStaff
                    .filter((s) => s.status === 'active')
                    .map((staff) => (
                      <option key={staff.id} value={staff.id}>
                        {staff.name} - {staff.role} ({staff.department})
                      </option>
                    ))}
                </select>
                {editAssignedTo && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Currently assigned to: {getStaffName(editAssignedTo)}
                  </p>
                )}
              </div>

              {/* Admin Remark */}
              <div className="mb-6">
                <p className="text-sm text-muted-foreground mb-2">
                  Admin Response / Remark
                </p>
                <textarea
                  value={editRemark}
                  onChange={(e) => setEditRemark(e.target.value)}
                  placeholder="Add your response or remark here..."
                  className="cyber-input w-full h-24 resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setSelectedComplaint(null)}
                  className="cyber-btn"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveChanges}
                  className="cyber-btn-solid flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
