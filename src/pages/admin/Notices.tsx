import { useState } from 'react';
import { PriorityBadge } from '@/components/common/admin/PriorityBadge';
import { mockNotices } from '@/data/admin/mockData';
import { Notice } from '@/types/admin';
import { Plus, Edit, Trash2, X, Bell, Calendar, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

export default function Notices() {
  const [notices, setNotices] = useState<Notice[]>(mockNotices);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    priority: 'normal' as Notice['priority'],
    expiresAt: '',
  });

  const openAddModal = () => {
    setEditingNotice(null);
    setFormData({
      title: '',
      content: '',
      category: '',
      priority: 'normal',
      expiresAt: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (notice: Notice) => {
    setEditingNotice(notice);
    setFormData({
      title: notice.title,
      content: notice.content,
      category: notice.category,
      priority: notice.priority,
      expiresAt: notice.expiresAt || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.content) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (editingNotice) {
      setNotices((prev) =>
        prev.map((n) =>
          n.id === editingNotice.id
            ? {
                ...n,
                ...formData,
                expiresAt: formData.expiresAt || undefined,
              }
            : n
        )
      );
      toast.success('Notice updated successfully');
    } else {
      const newNotice: Notice = {
        id: `N${String(notices.length + 1).padStart(3, '0')}`,
        ...formData,
        expiresAt: formData.expiresAt || undefined,
        publishedAt: new Date().toISOString(),
        isActive: true,
      };
      setNotices((prev) => [newNotice, ...prev]);
      toast.success('Notice published successfully');
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setNotices((prev) => prev.filter((n) => n.id !== id));
    toast.success('Notice deleted successfully');
  };

  const toggleActive = (id: string) => {
    setNotices((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isActive: !n.isActive } : n))
    );
    toast.success('Notice visibility updated');
  };

  const categories = ['Maintenance', 'Meeting', 'Amenities', 'Rules', 'Events', 'Emergency'];

  return (
    <>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground cyber-text-glow mb-2">
            Notices
          </h1>
          <p className="text-muted-foreground">
            Publish and manage society notices
          </p>
        </div>
        <button onClick={openAddModal} className="cyber-btn-solid flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Publish Notice
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="cyber-card p-4 text-center">
          <p className="text-2xl font-bold text-foreground">{notices.length}</p>
          <p className="text-sm text-muted-foreground">Total Notices</p>
        </div>
        <div className="cyber-card p-4 text-center border-success/30">
          <p className="text-2xl font-bold text-success">
            {notices.filter((n) => n.isActive).length}
          </p>
          <p className="text-sm text-muted-foreground">Active</p>
        </div>
        <div className="cyber-card p-4 text-center border-destructive/30">
          <p className="text-2xl font-bold text-destructive">
            {notices.filter((n) => n.priority === 'urgent').length}
          </p>
          <p className="text-sm text-muted-foreground">Urgent</p>
        </div>
        <div className="cyber-card p-4 text-center border-warning/30">
          <p className="text-2xl font-bold text-warning">
            {notices.filter((n) => n.priority === 'important').length}
          </p>
          <p className="text-sm text-muted-foreground">Important</p>
        </div>
      </div>

      {/* Notices Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {notices.map((notice) => (
          <div
            key={notice.id}
            className={`cyber-card p-6 transition-all ${
              !notice.isActive ? 'opacity-60' : ''
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-lg ${
                    notice.priority === 'urgent'
                      ? 'bg-destructive/20'
                      : notice.priority === 'important'
                      ? 'bg-warning/20'
                      : 'bg-primary/20'
                  }`}
                >
                  <Bell
                    className={`w-5 h-5 ${
                      notice.priority === 'urgent'
                        ? 'text-destructive'
                        : notice.priority === 'important'
                        ? 'text-warning'
                        : 'text-primary'
                    }`}
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{notice.title}</h3>
                  <p className="text-xs text-muted-foreground">{notice.category}</p>
                </div>
              </div>
              <PriorityBadge priority={notice.priority} />
            </div>

            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {notice.content}
            </p>

            <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-primary/10 pt-4">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(notice.publishedAt).toLocaleDateString()}
                </span>
                {notice.expiresAt && (
                  <span className="text-warning">
                    Expires: {new Date(notice.expiresAt).toLocaleDateString()}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleActive(notice.id)}
                  className={`p-2 rounded-lg transition-colors ${
                    notice.isActive
                      ? 'hover:bg-success/10 text-success'
                      : 'hover:bg-muted text-muted-foreground'
                  }`}
                >
                  {notice.isActive ? (
                    <Eye className="w-4 h-4" />
                  ) : (
                    <EyeOff className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={() => openEditModal(notice)}
                  className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(notice.id)}
                  className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="cyber-card w-full max-w-lg p-6 m-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">
                {editingNotice ? 'Edit Notice' : 'Publish Notice'}
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
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className="cyber-input w-full"
                  placeholder="Notice title"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">
                  Content *
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, content: e.target.value }))
                  }
                  className="cyber-input w-full h-32 resize-none"
                  placeholder="Notice content..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, category: e.target.value }))
                    }
                    className="cyber-input w-full"
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        priority: e.target.value as Notice['priority'],
                      }))
                    }
                    className="cyber-input w-full"
                  >
                    <option value="normal">Normal</option>
                    <option value="important">Important</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">
                  Expires On (Optional)
                </label>
                <input
                  type="date"
                  value={formData.expiresAt ? formData.expiresAt.split('T')[0] : ''}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, expiresAt: e.target.value }))
                  }
                  className="cyber-input w-full"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setIsModalOpen(false)} className="cyber-btn">
                Cancel
              </button>
              <button onClick={handleSubmit} className="cyber-btn-solid">
                {editingNotice ? 'Update' : 'Publish'} Notice
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
