import { useState } from 'react';
import { DataTable } from '@/components/common/admin/DataTable';
import { StatusBadge } from '@/components/common/admin/StatusBadge';
import { mockResidents } from '@/data/admin/mockData';
import { Resident } from '@/types/admin';
import { Search, Plus, Edit, Trash2, X, Users } from 'lucide-react';
import { toast } from 'sonner';

export default function Residents() {
  const [residents, setResidents] = useState<Resident[]>(mockResidents);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingResident, setEditingResident] = useState<Resident | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    flatNo: '',
    block: '',
  });

  const filteredResidents = residents.filter(
    (resident) =>
      resident.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resident.flatNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resident.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openAddModal = () => {
    setEditingResident(null);
    setFormData({ name: '', email: '', phone: '', flatNo: '', block: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (resident: Resident) => {
    setEditingResident(resident);
    setFormData({
      name: resident.name,
      email: resident.email,
      phone: resident.phone,
      flatNo: resident.flatNo,
      block: resident.block,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.email || !formData.flatNo) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (editingResident) {
      setResidents((prev) =>
        prev.map((r) =>
          r.id === editingResident.id ? { ...r, ...formData } : r
        )
      );
      toast.success('Resident updated successfully');
    } else {
      const newResident: Resident = {
        id: `R${String(residents.length + 1).padStart(3, '0')}`,
        ...formData,
        status: 'active',
        joinedAt: new Date().toISOString().split('T')[0],
      };
      setResidents((prev) => [...prev, newResident]);
      toast.success('Resident added successfully');
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setResidents((prev) => prev.filter((r) => r.id !== id));
    toast.success('Resident removed successfully');
  };

  const columns = [
    {
      key: 'name',
      header: 'Resident',
      render: (resident: Resident) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
            <span className="text-primary font-medium">
              {resident.name.charAt(0)}
            </span>
          </div>
          <div>
            <p className="font-medium text-foreground">{resident.name}</p>
            <p className="text-xs text-muted-foreground">{resident.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'flatNo',
      header: 'Flat',
      render: (resident: Resident) => (
        <div>
          <p className="font-medium text-foreground">{resident.flatNo}</p>
          <p className="text-xs text-muted-foreground">Block {resident.block}</p>
        </div>
      ),
    },
    {
      key: 'phone',
      header: 'Phone',
      render: (resident: Resident) => (
        <span className="text-muted-foreground">{resident.phone}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (resident: Resident) => <StatusBadge status={resident.status} />,
    },
    {
      key: 'joinedAt',
      header: 'Joined',
      render: (resident: Resident) => (
        <span className="text-muted-foreground text-sm">
          {new Date(resident.joinedAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (resident: Resident) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              openEditModal(resident);
            }}
            className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(resident.id);
            }}
            className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground cyber-text-glow mb-2">
            Residents
          </h1>
          <p className="text-muted-foreground">
            Manage society residents
          </p>
        </div>
        <button onClick={openAddModal} className="cyber-btn-solid flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Resident
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="cyber-card p-4 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-primary/20">
            <Users className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{residents.length}</p>
            <p className="text-sm text-muted-foreground">Total Residents</p>
          </div>
        </div>
        <div className="cyber-card p-4 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-success/20">
            <Users className="w-6 h-6 text-success" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">
              {residents.filter((r) => r.status === 'active').length}
            </p>
            <p className="text-sm text-muted-foreground">Active</p>
          </div>
        </div>
        <div className="cyber-card p-4 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-muted">
            <Users className="w-6 h-6 text-muted-foreground" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">
              {residents.filter((r) => r.status === 'inactive').length}
            </p>
            <p className="text-sm text-muted-foreground">Inactive</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by name, flat, or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="cyber-input w-full max-w-md pl-10"
        />
      </div>

      {/* Table */}
      <DataTable data={filteredResidents} columns={columns} />

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="cyber-card w-full max-w-md p-6 m-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">
                {editingResident ? 'Edit Resident' : 'Add Resident'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">
                  Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="cyber-input w-full"
                  placeholder="Full name"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className="cyber-input w-full"
                  placeholder="email@example.com"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">
                  Phone
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  className="cyber-input w-full"
                  placeholder="+91 98765 43210"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">
                    Flat No *
                  </label>
                  <input
                    type="text"
                    value={formData.flatNo}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, flatNo: e.target.value }))
                    }
                    className="cyber-input w-full"
                    placeholder="A-101"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">
                    Block
                  </label>
                  <input
                    type="text"
                    value={formData.block}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, block: e.target.value }))
                    }
                    className="cyber-input w-full"
                    placeholder="A"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setIsModalOpen(false)} className="cyber-btn">
                Cancel
              </button>
              <button onClick={handleSubmit} className="cyber-btn-solid">
                {editingResident ? 'Update' : 'Add'} Resident
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
