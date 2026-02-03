import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: 'pending' | 'in-progress' | 'resolved' | 'rejected' | 'active' | 'inactive';
  className?: string;
}

const statusConfig = {
  pending: {
    label: 'Pending',
    className: 'status-pending',
  },
  'in-progress': {
    label: 'In Progress',
    className: 'status-progress',
  },
  resolved: {
    label: 'Resolved',
    className: 'status-resolved',
  },
  rejected: {
    label: 'Rejected',
    className: 'status-rejected',
  },
  active: {
    label: 'Active',
    className: 'status-resolved',
  },
  inactive: {
    label: 'Inactive',
    className: 'status-rejected',
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span className={cn('status-badge', config.className, className)}>
      {config.label}
    </span>
  );
}
