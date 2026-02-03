import { useState, useRef } from "react";
import { BackButton } from "@/components/layout/user/BackButton";
import {
  Droplets,
  Lightbulb,
  Car,
  Shield,
  Trees,
  HelpCircle,
  Upload,
  Send,
  X,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const categories = [
  { id: "plumbing", label: "Plumbing", icon: Droplets },
  { id: "electrical", label: "Electrical", icon: Lightbulb },
  { id: "parking", label: "Parking", icon: Car },
  { id: "security", label: "Security", icon: Shield },
  { id: "garden", label: "Garden/Landscape", icon: Trees },
  { id: "other", label: "Other", icon: HelpCircle },
];

const priorities = [
  { id: "low", label: "Low", color: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800" },
  { id: "medium", label: "Medium", color: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800" },
  { id: "high", label: "High", color: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800" },
];

const RaiseComplaint = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("medium");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Complaint Submitted",
      description: "Your complaint has been registered successfully. You will receive updates via SMS and email.",
    });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const validFiles = Array.from(files).filter((file) => {
        const isValidType =
          file.type.startsWith("image/") || file.type === "application/pdf";
        const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB
        return isValidType && isValidSize;
      });
      setSelectedFiles((prev) => [...prev, ...validFiles]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <BackButton />
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-foreground mb-2">
          Raise a Complaint
        </h1>
        <p className="text-muted-foreground">
          Report an issue and our team will address it promptly.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Category Selection */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-card p-6">
              <label className="form-label">Select Category</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      selectedCategory === cat.id
                        ? "border-primary bg-primary/5 dark:bg-primary/10"
                        : "border-border dark:border-gray-700 hover:border-primary/30"
                    }`}
                  >
                    <cat.icon
                      className={`w-6 h-6 mb-2 mx-auto ${
                        selectedCategory === cat.id
                          ? "text-primary"
                          : "text-muted-foreground"
                      }`}
                    />
                    <span
                      className={`text-sm font-medium block ${
                        selectedCategory === cat.id
                          ? "text-primary"
                          : "text-foreground"
                      }`}
                    >
                      {cat.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Complaint Details */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-card p-6 space-y-5">
              <div>
                <label className="form-label">Complaint Title</label>
                <input
                  type="text"
                  placeholder="Brief title of your complaint"
                  className="form-input"
                  required
                />
              </div>

              <div>
                <label className="form-label">Description</label>
                <textarea
                  rows={4}
                  placeholder="Describe your issue in detail. Include location, time of occurrence, and any relevant information..."
                  className="form-input resize-none"
                  required
                />
              </div>

              <div>
                <label className="form-label">Location</label>
                <input
                  type="text"
                  placeholder="e.g., Near Lift Lobby, 4th Floor"
                  className="form-input"
                />
              </div>
            </div>

            {/* Attachments */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-card p-6">
              <label className="form-label">Attachments (Optional)</label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf"
                multiple
                onChange={handleFileSelect}
                className="hidden"
              />
              <div
                onClick={handleUploadClick}
                className="border-2 border-dashed border-border dark:border-gray-700 rounded-xl p-8 text-center hover:border-primary/30 transition-colors cursor-pointer"
              >
                <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground mb-1">
                  Drag and drop files here, or click to browse
                </p>
                <p className="text-xs text-muted-foreground">
                  Supports JPG, PNG, PDF up to 10MB
                </p>
              </div>

              {/* Selected Files List */}
              {selectedFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  {selectedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-muted/50 dark:bg-gray-700/50 rounded-lg"
                    >
                      <span className="text-sm text-foreground truncate flex-1">
                        {file.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(index)}
                        className="ml-2 p-1 hover:bg-muted dark:hover:bg-gray-600 rounded"
                      >
                        <X className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Priority & Submit */}
          <div className="space-y-6">
            {/* Priority */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-card p-6">
              <label className="form-label">Priority Level</label>
              <div className="space-y-3">
                {priorities.map((priority) => (
                  <button
                    key={priority.id}
                    type="button"
                    onClick={() => setSelectedPriority(priority.id)}
                    className={`w-full p-3 rounded-xl border-2 text-left transition-all ${
                      selectedPriority === priority.id
                        ? `${priority.color} border-current`
                        : "border-border dark:border-gray-700 hover:border-primary/30"
                    }`}
                  >
                    <span className="font-medium text-sm">{priority.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn-primary w-full text-base py-4"
            >
              <Send className="w-5 h-5" />
              Submit Complaint
            </button>

            <p className="text-xs text-muted-foreground text-center">
              You will receive a confirmation SMS and email after submission.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default RaiseComplaint;
