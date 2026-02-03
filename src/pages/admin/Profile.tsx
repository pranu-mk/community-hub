import { useState } from 'react';
import { User, Mail, Phone, Shield, Lock, Save, Camera } from 'lucide-react';
import { toast } from 'sonner';

export default function Profile() {
  const [profile, setProfile] = useState({
    name: 'Admin User',
    email: 'admin@society.com',
    phone: '+91 98765 00000',
    role: 'Super Admin',
    department: 'Administration',
  });

  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  const handleProfileUpdate = () => {
    toast.success('Profile updated successfully');
  };

  const handlePasswordChange = () => {
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      toast.error('Please fill in all password fields');
      return;
    }
    if (passwords.new !== passwords.confirm) {
      toast.error('New passwords do not match');
      return;
    }
    if (passwords.new.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    toast.success('Password changed successfully');
    setPasswords({ current: '', new: '', confirm: '' });
  };

  return (
    <>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground cyber-text-glow mb-2">
          Profile
        </h1>
        <p className="text-muted-foreground">
          Manage your account settings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="cyber-card p-6 text-center">
          <div className="relative w-32 h-32 mx-auto mb-6">
            <div className="w-full h-full rounded-full bg-primary/20 flex items-center justify-center border-2 border-primary/50">
              <User className="w-16 h-16 text-primary" />
            </div>
            <button className="absolute bottom-0 right-0 p-2 bg-primary rounded-full text-primary-foreground hover:bg-primary/80 transition-colors">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <h2 className="text-xl font-bold text-foreground mb-1">{profile.name}</h2>
          <p className="text-primary mb-4">{profile.role}</p>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p className="flex items-center justify-center gap-2">
              <Mail className="w-4 h-4" />
              {profile.email}
            </p>
            <p className="flex items-center justify-center gap-2">
              <Phone className="w-4 h-4" />
              {profile.phone}
            </p>
            <p className="flex items-center justify-center gap-2">
              <Shield className="w-4 h-4" />
              {profile.department}
            </p>
          </div>
        </div>

        {/* Edit Profile */}
        <div className="cyber-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            Edit Profile
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">
                Full Name
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) =>
                  setProfile((prev) => ({ ...prev, name: e.target.value }))
                }
                className="cyber-input w-full"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">
                Email
              </label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) =>
                  setProfile((prev) => ({ ...prev, email: e.target.value }))
                }
                className="cyber-input w-full"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">
                Phone
              </label>
              <input
                type="text"
                value={profile.phone}
                onChange={(e) =>
                  setProfile((prev) => ({ ...prev, phone: e.target.value }))
                }
                className="cyber-input w-full"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">
                Department
              </label>
              <input
                type="text"
                value={profile.department}
                onChange={(e) =>
                  setProfile((prev) => ({ ...prev, department: e.target.value }))
                }
                className="cyber-input w-full"
              />
            </div>
            <button
              onClick={handleProfileUpdate}
              className="cyber-btn-solid w-full flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </div>

        {/* Change Password */}
        <div className="cyber-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
            <Lock className="w-5 h-5 text-primary" />
            Change Password
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">
                Current Password
              </label>
              <input
                type="password"
                value={passwords.current}
                onChange={(e) =>
                  setPasswords((prev) => ({ ...prev, current: e.target.value }))
                }
                className="cyber-input w-full"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">
                New Password
              </label>
              <input
                type="password"
                value={passwords.new}
                onChange={(e) =>
                  setPasswords((prev) => ({ ...prev, new: e.target.value }))
                }
                className="cyber-input w-full"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">
                Confirm New Password
              </label>
              <input
                type="password"
                value={passwords.confirm}
                onChange={(e) =>
                  setPasswords((prev) => ({ ...prev, confirm: e.target.value }))
                }
                className="cyber-input w-full"
                placeholder="••••••••"
              />
            </div>
            <button
              onClick={handlePasswordChange}
              className="cyber-btn w-full flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              Update Password
            </button>
          </div>
        </div>
      </div>

      {/* Activity Log */}
      <div className="cyber-card p-6 mt-6">
        <h3 className="text-lg font-semibold text-foreground mb-6">
          Recent Activity
        </h3>
        <div className="space-y-4">
          {[
            { action: 'Updated complaint status', time: '2 hours ago', type: 'update' },
            { action: 'Assigned staff to complaint C004', time: '4 hours ago', type: 'assign' },
            { action: 'Published new notice', time: '1 day ago', type: 'create' },
            { action: 'Added new resident', time: '2 days ago', type: 'create' },
            { action: 'Generated monthly report', time: '3 days ago', type: 'report' },
          ].map((activity, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-3 border-b border-primary/10 last:border-0"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-2 h-2 rounded-full ${
                    activity.type === 'update'
                      ? 'bg-primary'
                      : activity.type === 'assign'
                      ? 'bg-warning'
                      : activity.type === 'create'
                      ? 'bg-success'
                      : 'bg-secondary'
                  }`}
                />
                <span className="text-foreground">{activity.action}</span>
              </div>
              <span className="text-sm text-muted-foreground">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
