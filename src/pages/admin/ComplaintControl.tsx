import { useState } from 'react';
import { StatusBadge } from '@/components/common/admin/StatusBadge';
import { PriorityBadge } from '@/components/common/admin/PriorityBadge';
import { mockComplaints, mockStaff } from '@/data/admin/mockData';
import { Complaint } from '@/types/admin';
import { Settings, ArrowRight, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

export default function ComplaintControl() {
  const [complaints, setComplaints] = useState<Complaint[]>(mockComplaints);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [newStatus, setNewStatus] = useState<string>('');
  const [remark, setRemark] = useState('');

  const handleStatusUpdate = () => {
    if (!selectedComplaint || !newStatus) return;

    setComplaints((prev) =>
      prev.map((c) =>
        c.id === selectedComplaint.id
          ? { ...c, status: newStatus as Complaint['status'], updatedAt: new Date().toISOString() }
          : c
      )
    );

    toast.success(`Updated complaint ${selectedComplaint.id} to ${newStatus}`);
    setSelectedComplaint(null);
    setNewStatus('');
    setRemark('');
  };

  const getAssignedStaffName = (staffId?: string) => {
    if (!staffId) return 'Not Assigned';
    return mockStaff.find((s) => s.id === staffId)?.name || 'Unknown';
  };

  const statusOptions = [
    { value: 'pending', label: 'Pending', color: 'text-warning' },
    { value: 'in-progress', label: 'In Progress', color: 'text-primary' },
    { value: 'resolved', label: 'Resolved', color: 'text-success' },
    { value: 'rejected', label: 'Rejected', color: 'text-destructive' },
  ];

  return (
    <>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground cyber-text-glow mb-2">
          Complaint Control
        </h1>
        <p className="text-muted-foreground">
          Update complaint status and manage workflow
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Complaints List */}
        <div className="lg:col-span-2 cyber-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" />
            Active Complaints
          </h3>
          <div className="space-y-3 max-h-[700px] overflow-y-auto">
            {complaints.map((complaint) => (
              <div
                key={complaint.id}
                onClick={() => {
                  setSelectedComplaint(complaint);
                  setNewStatus(complaint.status);
                }}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedComplaint?.id === complaint.id
                    ? 'border-primary bg-primary/10'
                    : 'border-primary/20 hover:border-primary/40'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-primary font-mono text-sm">
                        {complaint.id}
                      </span>
                      <PriorityBadge priority={complaint.priority} />
                    </div>
                    <h4 className="font-medium text-foreground">{complaint.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {complaint.description}
                    </p>
                  </div>
                  <StatusBadge status={complaint.status} />
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground border-t border-primary/10 pt-3">
                  <span>
                    {complaint.flatNo} • {complaint.residentName}
                  </span>
                  <span>Assigned: {getAssignedStaffName(complaint.assignedTo)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Status Update Panel */}
        <div className="cyber-card p-6 h-fit sticky top-24">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Update Status
          </h3>

          {selectedComplaint ? (
            <div className="space-y-6">
              {/* Current Status */}
              <div>
                <p className="text-sm text-muted-foreground mb-2">Current Status</p>
                <div className="flex items-center gap-2">
                  <StatusBadge status={selectedComplaint.status} />
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  {newStatus && newStatus !== selectedComplaint.status ? (
                    <StatusBadge status={newStatus as Complaint['status']} />
                  ) : (
                    <span className="text-muted-foreground text-sm">Select new</span>
                  )}
                </div>
              </div>

              {/* Status Options */}
              <div>
                <p className="text-sm text-muted-foreground mb-2">New Status</p>
                <div className="grid grid-cols-2 gap-2">
                  {statusOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setNewStatus(option.value)}
                      className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                        newStatus === option.value
                          ? 'border-primary bg-primary/20 text-primary'
                          : 'border-primary/20 text-muted-foreground hover:border-primary/40'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Remarks */}
              <div>
                <p className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Remarks (Optional)
                </p>
                <textarea
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                  placeholder="Add any notes or remarks..."
                  className="cyber-input w-full h-24 resize-none"
                />
              </div>

              {/* Update Button */}
              <button
                onClick={handleStatusUpdate}
                disabled={!newStatus || newStatus === selectedComplaint.status}
                className="cyber-btn-solid w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Update Status
              </button>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Settings className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Select a complaint to update its status</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
