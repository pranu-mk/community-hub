import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockEmergencyContacts } from '@/data/admin/mockData';
import { EmergencyContact } from '@/types/admin';
import {
  Phone,
  Plus,
  Edit2,
  Trash2,
  X,
  Save,
  ArrowLeft,
  Building,
  Shield,
  Flame,
  Ambulance,
  AlertTriangle,
  MessageCircle,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import { toast } from 'sonner';

const contactTypeOptions = [
  { value: 'society-office', label: 'Society Office', icon: Building },
  { value: 'security-desk', label: 'Security Desk', icon: Shield },
  { value: 'fire', label: 'Fire', icon: Flame },
  { value: 'ambulance', label: 'Ambulance', icon: Ambulance },
  { value: 'police', label: 'Police', icon: AlertTriangle },
  { value: 'emergency-whatsapp', label: 'Emergency WhatsApp', icon: MessageCircle },
];

export default function EmergencyContacts() {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState<EmergencyContact[]>(mockEmergencyContacts);
  const [showModal, setShowModal] = useState(false);
  const [editingContact, setEditingContact] = useState<EmergencyContact | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'society-office' as EmergencyContact['type'],
    phone: '',
  });

  const handleOpenAdd = () => {
    setEditingContact(null);
    setFormData({ name: '', type: 'society-office', phone: '' });
    setShowModal(true);
  };

  const handleOpenEdit = (contact: EmergencyContact) => {
    setEditingContact(contact);
    setFormData({
      name: contact.name,
      type: contact.type,
      phone: contact.phone,
    });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!formData.name.trim() || !formData.phone.trim()) {
      toast.error('Please fill all required fields');
      return;
    }

    if (editingContact) {
      setContacts((prev) =>
        prev.map((c) =>
          c.id === editingContact.id
            ? { ...c, ...formData }
            : c
        )
      );
      toast.success('Contact updated successfully');
    } else {
      const newContact: EmergencyContact = {
        id: `EC${String(contacts.length + 1).padStart(3, '0')}`,
        ...formData,
        isEnabled: true,
        createdAt: new Date().toISOString(),
      };
      setContacts((prev) => [...prev, newContact]);
      toast.success('Contact added successfully');
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    setContacts((prev) => prev.filter((c) => c.id !== id));
    toast.success('Contact deleted successfully');
  };

  const handleToggle = (id: string) => {
    setContacts((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, isEnabled: !c.isEnabled } : c
      )
    );
    toast.success('Contact status updated');
  };

  const getContactIcon = (type: EmergencyContact['type']) => {
    const option = contactTypeOptions.find((o) => o.value === type);
    return option?.icon || Phone;
  };

  return (
    <>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-foreground cyber-text-glow mb-2">
              Emergency Contacts
            </h1>
            <p className="text-muted-foreground">
              Manage emergency contact information for residents
            </p>
          </div>
        </div>
        <button onClick={handleOpenAdd} className="cyber-btn-solid flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Contact
        </button>
      </div>

      {/* Contacts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {contacts.map((contact) => {
          const Icon = getContactIcon(contact.type);
          return (
            <div
              key={contact.id}
              className={`cyber-card p-6 ${!contact.isEnabled ? 'opacity-50' : ''}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{contact.name}</h3>
                    <p className="text-sm text-muted-foreground capitalize">
                      {contact.type.replace('-', ' ')}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggle(contact.id)}
                  className="text-primary"
                >
                  {contact.isEnabled ? (
                    <ToggleRight className="w-8 h-8" />
                  ) : (
                    <ToggleLeft className="w-8 h-8 text-muted-foreground" />
                  )}
                </button>
              </div>

              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-1">Phone Number</p>
                <p className="text-lg font-mono text-primary">{contact.phone}</p>
              </div>

              <div className="flex items-center gap-2 pt-4 border-t border-primary/10">
                <button
                  onClick={() => handleOpenEdit(contact)}
                  className="cyber-btn flex-1 flex items-center justify-center gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(contact.id)}
                  className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {contacts.length === 0 && (
        <div className="cyber-card p-12 text-center">
          <Phone className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <p className="text-muted-foreground">No emergency contacts found</p>
          <button onClick={handleOpenAdd} className="cyber-btn mt-4">
            Add First Contact
          </button>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="cyber-card w-full max-w-lg p-6 m-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">
                {editingContact ? 'Edit Contact' : 'Add Contact'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">
                  Contact Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Society Office"
                  className="cyber-input w-full"
                />
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-2 block">
                  Contact Type *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      type: e.target.value as EmergencyContact['type'],
                    })
                  }
                  className="cyber-input w-full"
                >
                  {contactTypeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-2 block">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="e.g., +91 98765 00001"
                  className="cyber-input w-full"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="cyber-btn">
                Cancel
              </button>
              <button onClick={handleSave} className="cyber-btn-solid flex items-center gap-2">
                <Save className="w-4 h-4" />
                {editingContact ? 'Update' : 'Add'} Contact
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
