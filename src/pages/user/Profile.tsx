import { useState } from "react";
import { BackButton } from "@/components/layout/user/BackButton";
import {
  User,
  Mail,
  Home,
  Edit3,
  Save,
  X,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "Rajesh Sharma",
    email: "rajesh.sharma@email.com",
  });

  const handleSave = () => {
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully.",
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <BackButton />
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-foreground mb-2">
          My Profile
        </h1>
        <p className="text-muted-foreground">
          View and manage your personal information.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-card p-6 text-center">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl font-display font-bold text-white">
                RS
              </span>
            </div>
            <h2 className="font-display font-semibold text-xl text-foreground mb-1">
              {formData.name}
            </h2>

            <div className="space-y-3 text-left mt-4">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 dark:bg-gray-700/50">
                <Home className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Flat Number</p>
                  <p className="text-sm font-medium text-foreground">A-402</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="lg:col-span-2">
          {/* Editable Info */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display font-semibold text-lg text-foreground">
                Contact Information
              </h3>
              {isEditing ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="btn-secondary px-4 py-2 text-sm"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="btn-primary px-4 py-2 text-sm"
                  >
                    <Save className="w-4 h-4" />
                    Save
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn-secondary px-4 py-2 text-sm"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit Profile
                </button>
              )}
            </div>

            <div className="space-y-5">
              <div>
                <label className="form-label flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  disabled={!isEditing}
                  className="form-input disabled:bg-muted dark:disabled:bg-gray-700 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label className="form-label flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  disabled={!isEditing}
                  className="form-input disabled:bg-muted dark:disabled:bg-gray-700 disabled:cursor-not-allowed"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
