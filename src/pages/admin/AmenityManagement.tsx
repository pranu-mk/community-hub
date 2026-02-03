import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockAmenities, mockAmenityBookings } from '@/data/admin/mockData';
import { Amenity, AmenityBooking } from '@/types/admin';
import {
  Building,
  Plus,
  Edit2,
  Trash2,
  X,
  Save,
  ArrowLeft,
  Calendar,
  Clock,
  Users,
  FileText,
  Check,
  XCircle,
  ToggleLeft,
  ToggleRight,
  Eye,
} from 'lucide-react';
import { toast } from 'sonner';

type TabType = 'amenities' | 'bookings';

export default function AmenityManagement() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('amenities');
  const [amenities, setAmenities] = useState<Amenity[]>(mockAmenities);
  const [bookings, setBookings] = useState<AmenityBooking[]>(mockAmenityBookings);
  const [showAmenityModal, setShowAmenityModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [editingAmenity, setEditingAmenity] = useState<Amenity | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<AmenityBooking | null>(null);
  const [amenityForm, setAmenityForm] = useState({
    name: '',
    description: '',
    timeSlots: '',
    maxBookingsPerDay: 10,
    rules: '',
  });

  const handleOpenAddAmenity = () => {
    setEditingAmenity(null);
    setAmenityForm({
      name: '',
      description: '',
      timeSlots: '',
      maxBookingsPerDay: 10,
      rules: '',
    });
    setShowAmenityModal(true);
  };

  const handleOpenEditAmenity = (amenity: Amenity) => {
    setEditingAmenity(amenity);
    setAmenityForm({
      name: amenity.name,
      description: amenity.description,
      timeSlots: amenity.timeSlots.join(', '),
      maxBookingsPerDay: amenity.maxBookingsPerDay,
      rules: amenity.rules,
    });
    setShowAmenityModal(true);
  };

  const handleSaveAmenity = () => {
    if (!amenityForm.name.trim() || !amenityForm.description.trim()) {
      toast.error('Please fill all required fields');
      return;
    }

    const timeSlots = amenityForm.timeSlots
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s);

    if (editingAmenity) {
      setAmenities((prev) =>
        prev.map((a) =>
          a.id === editingAmenity.id
            ? {
                ...a,
                name: amenityForm.name,
                description: amenityForm.description,
                timeSlots,
                maxBookingsPerDay: amenityForm.maxBookingsPerDay,
                rules: amenityForm.rules,
              }
            : a
        )
      );
      toast.success('Amenity updated successfully');
    } else {
      const newAmenity: Amenity = {
        id: `AM${String(amenities.length + 1).padStart(3, '0')}`,
        name: amenityForm.name,
        description: amenityForm.description,
        isEnabled: true,
        timeSlots,
        maxBookingsPerDay: amenityForm.maxBookingsPerDay,
        rules: amenityForm.rules,
        createdAt: new Date().toISOString(),
      };
      setAmenities((prev) => [...prev, newAmenity]);
      toast.success('Amenity added successfully');
    }
    setShowAmenityModal(false);
  };

  const handleDeleteAmenity = (id: string) => {
    setAmenities((prev) => prev.filter((a) => a.id !== id));
    toast.success('Amenity deleted successfully');
  };

  const handleToggleAmenity = (id: string) => {
    setAmenities((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isEnabled: !a.isEnabled } : a))
    );
    toast.success('Amenity status updated');
  };

  const handleBookingAction = (
    bookingId: string,
    action: 'approved' | 'rejected' | 'cancelled'
  ) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: action } : b))
    );
    toast.success(`Booking ${action} successfully`);
    setShowBookingModal(false);
  };

  const getStatusColor = (status: AmenityBooking['status']) => {
    switch (status) {
      case 'pending':
        return 'text-warning';
      case 'approved':
        return 'text-success';
      case 'rejected':
        return 'text-destructive';
      case 'cancelled':
        return 'text-muted-foreground';
      default:
        return 'text-foreground';
    }
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
              Amenity Management
            </h1>
            <p className="text-muted-foreground">
              Manage society amenities and bookings
            </p>
          </div>
        </div>
        {activeTab === 'amenities' && (
          <button
            onClick={handleOpenAddAmenity}
            className="cyber-btn-solid flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Amenity
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('amenities')}
          className={`px-6 py-3 rounded-lg font-medium transition-all ${
            activeTab === 'amenities'
              ? 'bg-primary/20 text-primary border border-primary'
              : 'text-muted-foreground hover:text-foreground border border-primary/20'
          }`}
        >
          <Building className="w-4 h-4 inline-block mr-2" />
          Amenities
        </button>
        <button
          onClick={() => setActiveTab('bookings')}
          className={`px-6 py-3 rounded-lg font-medium transition-all ${
            activeTab === 'bookings'
              ? 'bg-primary/20 text-primary border border-primary'
              : 'text-muted-foreground hover:text-foreground border border-primary/20'
          }`}
        >
          <Calendar className="w-4 h-4 inline-block mr-2" />
          Bookings
          {bookings.filter((b) => b.status === 'pending').length > 0 && (
            <span className="ml-2 px-2 py-0.5 text-xs bg-warning text-warning-foreground rounded-full">
              {bookings.filter((b) => b.status === 'pending').length}
            </span>
          )}
        </button>
      </div>

      {/* Amenities Tab */}
      {activeTab === 'amenities' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {amenities.map((amenity) => (
            <div
              key={amenity.id}
              className={`cyber-card p-6 ${!amenity.isEnabled ? 'opacity-50' : ''}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Building className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{amenity.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {amenity.isEnabled ? 'Active' : 'Disabled'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggleAmenity(amenity.id)}
                  className="text-primary"
                >
                  {amenity.isEnabled ? (
                    <ToggleRight className="w-8 h-8" />
                  ) : (
                    <ToggleLeft className="w-8 h-8 text-muted-foreground" />
                  )}
                </button>
              </div>

              <p className="text-sm text-muted-foreground mb-4">
                {amenity.description}
              </p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="text-muted-foreground">
                    {amenity.timeSlots.length} time slots
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-primary" />
                  <span className="text-muted-foreground">
                    Max {amenity.maxBookingsPerDay} bookings/day
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-4 border-t border-primary/10">
                <button
                  onClick={() => handleOpenEditAmenity(amenity)}
                  className="cyber-btn flex-1 flex items-center justify-center gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteAmenity(amenity.id)}
                  className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {amenities.length === 0 && (
            <div className="col-span-full cyber-card p-12 text-center">
              <Building className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">No amenities found</p>
              <button onClick={handleOpenAddAmenity} className="cyber-btn mt-4">
                Add First Amenity
              </button>
            </div>
          )}
        </div>
      )}

      {/* Bookings Tab */}
      {activeTab === 'bookings' && (
        <div className="cyber-card p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-primary/20">
                  <th className="text-left text-sm font-medium text-muted-foreground px-4 py-3">
                    Booking ID
                  </th>
                  <th className="text-left text-sm font-medium text-muted-foreground px-4 py-3">
                    Amenity
                  </th>
                  <th className="text-left text-sm font-medium text-muted-foreground px-4 py-3">
                    Resident
                  </th>
                  <th className="text-left text-sm font-medium text-muted-foreground px-4 py-3">
                    Date & Time
                  </th>
                  <th className="text-left text-sm font-medium text-muted-foreground px-4 py-3">
                    Status
                  </th>
                  <th className="text-left text-sm font-medium text-muted-foreground px-4 py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id} className="cyber-table-row">
                    <td className="px-4 py-3 text-sm text-primary font-mono">
                      {booking.id}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {booking.amenityName}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div>
                        <span className="text-foreground block">
                          {booking.residentName}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {booking.flatNo}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      <div>
                        <span className="block">{booking.date}</span>
                        <span className="text-xs">{booking.timeSlot}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-sm font-medium capitalize ${getStatusColor(
                          booking.status
                        )}`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedBooking(booking);
                            setShowBookingModal(true);
                          }}
                          className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {booking.status === 'pending' && (
                          <>
                            <button
                              onClick={() =>
                                handleBookingAction(booking.id, 'approved')
                              }
                              className="p-2 rounded-lg hover:bg-success/10 text-success transition-colors"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() =>
                                handleBookingAction(booking.id, 'rejected')
                              }
                              className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {bookings.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">No bookings found</p>
            </div>
          )}
        </div>
      )}

      {/* Amenity Add/Edit Modal */}
      {showAmenityModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="cyber-card w-full max-w-lg p-6 m-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">
                {editingAmenity ? 'Edit Amenity' : 'Add Amenity'}
              </h2>
              <button
                onClick={() => setShowAmenityModal(false)}
                className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">
                  Amenity Name *
                </label>
                <input
                  type="text"
                  value={amenityForm.name}
                  onChange={(e) =>
                    setAmenityForm({ ...amenityForm, name: e.target.value })
                  }
                  placeholder="e.g., Swimming Pool"
                  className="cyber-input w-full"
                />
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-2 block">
                  Description *
                </label>
                <textarea
                  value={amenityForm.description}
                  onChange={(e) =>
                    setAmenityForm({ ...amenityForm, description: e.target.value })
                  }
                  placeholder="Describe the amenity..."
                  className="cyber-input w-full h-20 resize-none"
                />
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-2 block">
                  Time Slots (comma-separated)
                </label>
                <input
                  type="text"
                  value={amenityForm.timeSlots}
                  onChange={(e) =>
                    setAmenityForm({ ...amenityForm, timeSlots: e.target.value })
                  }
                  placeholder="e.g., 06:00-08:00, 08:00-10:00, 16:00-18:00"
                  className="cyber-input w-full"
                />
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-2 block">
                  Max Bookings Per Day
                </label>
                <input
                  type="number"
                  value={amenityForm.maxBookingsPerDay}
                  onChange={(e) =>
                    setAmenityForm({
                      ...amenityForm,
                      maxBookingsPerDay: parseInt(e.target.value) || 1,
                    })
                  }
                  min="1"
                  className="cyber-input w-full"
                />
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-2 block flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Rules & Guidelines
                </label>
                <textarea
                  value={amenityForm.rules}
                  onChange={(e) =>
                    setAmenityForm({ ...amenityForm, rules: e.target.value })
                  }
                  placeholder="Enter rules and guidelines for using this amenity..."
                  className="cyber-input w-full h-24 resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowAmenityModal(false)} className="cyber-btn">
                Cancel
              </button>
              <button
                onClick={handleSaveAmenity}
                className="cyber-btn-solid flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {editingAmenity ? 'Update' : 'Add'} Amenity
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Booking Detail Modal */}
      {showBookingModal && selectedBooking && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="cyber-card w-full max-w-lg p-6 m-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">Booking Details</h2>
              <button
                onClick={() => setShowBookingModal(false)}
                className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Booking ID</p>
                <p className="text-primary font-mono">{selectedBooking.id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Status</p>
                <p
                  className={`font-medium capitalize ${getStatusColor(
                    selectedBooking.status
                  )}`}
                >
                  {selectedBooking.status}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Amenity</p>
                <p className="text-foreground">{selectedBooking.amenityName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Date</p>
                <p className="text-foreground">{selectedBooking.date}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Time Slot</p>
                <p className="text-foreground">{selectedBooking.timeSlot}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Booked On</p>
                <p className="text-foreground">
                  {new Date(selectedBooking.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-muted-foreground mb-1">Resident</p>
                <p className="text-foreground">
                  {selectedBooking.residentName} ({selectedBooking.flatNo})
                </p>
              </div>
            </div>

            {selectedBooking.status === 'pending' && (
              <div className="flex justify-end gap-3 pt-4 border-t border-primary/10">
                <button
                  onClick={() =>
                    handleBookingAction(selectedBooking.id, 'rejected')
                  }
                  className="cyber-btn text-destructive hover:bg-destructive/10"
                >
                  Reject
                </button>
                <button
                  onClick={() =>
                    handleBookingAction(selectedBooking.id, 'approved')
                  }
                  className="cyber-btn-solid flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Approve
                </button>
              </div>
            )}

            {selectedBooking.status !== 'pending' &&
              selectedBooking.status !== 'cancelled' && (
                <div className="flex justify-end pt-4 border-t border-primary/10">
                  <button
                    onClick={() =>
                      handleBookingAction(selectedBooking.id, 'cancelled')
                    }
                    className="cyber-btn text-destructive hover:bg-destructive/10"
                  >
                    Cancel Booking
                  </button>
                </div>
              )}
          </div>
        </div>
      )}
    </>
  );
}
