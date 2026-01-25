"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Lock,
  Save,
  Eye,
  EyeOff,
  Camera,
  Bell,
  Shield,
  LogOut,
  Mail,
  Smartphone,
  Loader2,
} from "lucide-react";
import Button from "@/components/ui/Button";
import { AdminAuthService } from "@/lib/api";
import { toast } from "sonner";

// --- Types ---
type TabType = "profile" | "security" | "notifications";

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  bio: string;
  avatar?: string;
  role?: string;
}

interface NotificationSettings {
  emailAlerts: boolean;
  securityAlerts: boolean;
  marketingEmails: boolean;
}

export default function SettingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("profile");
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);

  // Profile State
  const [profileData, setProfileData] = useState<ProfileData>({
    name: "",
    email: "",
    phone: "",
    bio: "",
    role: "",
  });

  // Avatar State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  // Password State
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Notifications State
  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailAlerts: true,
    securityAlerts: true,
    marketingEmails: false,
  });

  // 1. Fetch Profile on Load
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await AdminAuthService.getProfile();

        // GET API returns: { data: { data: { ...user } } }
        const rootData = response.data;
        const userProfile = rootData?.data?.data || rootData?.data || {};

        setProfileData({
          name: userProfile.name || "",
          email: userProfile.email || "",
          phone: userProfile.phone || "",
          bio: userProfile.bio || "",
          role: userProfile.role || "ADMIN",
        });

        if (userProfile.avatar) {
          setAvatarPreview(userProfile.avatar);
        }

        if (userProfile.notifications) {
          setNotifications((prev) => ({
            ...prev,
            ...userProfile.notifications,
          }));
        }
      } catch (error: any) {
        console.error("Profile fetch error:", error);
        toast.error("Failed to load profile data");
      } finally {
        setIsPageLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // 2. Handle Image Selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }
      setAvatarFile(file);

      // Local preview logic
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 3. Handle Profile Update (Using FormData)
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // ✅ FIX: Use FormData for both text and file
      const formData = new FormData();

      // Text Fields
      formData.append("name", profileData.name);
      formData.append("phone", profileData.phone || "");
      formData.append("bio", profileData.bio || "");

      // We don't update email here typically, but if backend allows:
      // formData.append("email", profileData.email);

      // File Field
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      // API Call
      const response = await AdminAuthService.updateProfile(formData);

      // ✅ FIX: Backend returns updated data in 'admin' key
      // Structure: { success: true, data: { admin: { ... } } }
      const responseData = response.data;
      const updatedAdmin = responseData?.data?.admin || responseData?.data;

      // Sync State with updated backend data
      if (updatedAdmin) {
        setProfileData((prev) => ({
          ...prev,
          name: updatedAdmin.name,
          phone: updatedAdmin.phone,
          bio: updatedAdmin.bio,
          avatar: updatedAdmin.avatar,
        }));

        if (updatedAdmin.avatar) {
          setAvatarPreview(updatedAdmin.avatar);
        }
      }

      toast.success("Profile updated successfully!");
      setAvatarFile(null); // Clear file input
    } catch (error: any) {
      console.error("Profile update error:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  // 4. Handle Notification Update
  const handleSaveNotifications = async () => {
    setIsLoading(true);
    try {
      // Send as JSON object - Backend handles this via req.body directly
      await AdminAuthService.updateProfile({
        notifications: notifications,
      });
      toast.success("Notification preferences saved!");
    } catch (error: any) {
      console.error("Notification update error:", error);
      toast.error("Failed to save preferences");
    } finally {
      setIsLoading(false);
    }
  };

  // 5. Handle Password Change
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    try {
      await AdminAuthService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      toast.success("Password changed! Please login again.");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      console.error("Password change error:", error);
      toast.error(error.response?.data?.message || "Failed to change password");
    } finally {
      setIsLoading(false);
    }
  };

  // 6. Logout All Devices
  const handleLogoutAllDevices = async () => {
    if (!confirm("Are you sure? You will be logged out of this device too."))
      return;

    try {
      await AdminAuthService.logoutAllDevices();
      toast.success("Logged out of all sessions");
      localStorage.removeItem("token"); // or cookie clear logic
      router.push("/login");
    } catch (error: any) {
      toast.error("Failed to logout other sessions");
    }
  };

  if (isPageLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="mt-1 text-gray-400">
          Manage your profile, security, and notification preferences
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sidebar Navigation */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-3 space-y-2"
        >
          <div className="rounded-xl border border-white/10 bg-white/5 p-2 backdrop-blur-sm sticky top-6">
            {[
              { id: "profile", icon: User, label: "My Profile" },
              { id: "security", icon: Shield, label: "Security" },
              { id: "notifications", icon: Bell, label: "Notifications" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`w-full flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Main Content Area */}
        <div className="lg:col-span-9">
          <AnimatePresence mode="wait">
            {/* --- PROFILE TAB --- */}
            {activeTab === "profile" && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* Profile Header & Avatar Upload */}
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-blue-600/20 to-purple-600/20" />
                  <div className="relative pt-8 flex flex-col sm:flex-row items-center sm:items-end gap-6">
                    <div className="relative group">
                      <div className="h-24 w-24 rounded-full border-4 border-[#0f1115] bg-gray-800 overflow-hidden relative">
                        {avatarPreview ? (
                          <img
                            src={avatarPreview}
                            alt="Profile"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center bg-blue-500/20 text-blue-400 text-3xl font-bold">
                            {profileData.name?.charAt(0)?.toUpperCase() || "A"}
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-0 right-0 p-2 bg-blue-500 rounded-full text-white shadow-lg cursor-pointer hover:bg-blue-600 transition-colors z-10"
                      >
                        <Camera className="h-4 w-4" />
                      </button>
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </div>
                    <div className="text-center sm:text-left flex-1 pb-2">
                      <h2 className="text-2xl font-bold text-white">
                        {profileData.name || "Loading..."}
                      </h2>
                      <div className="flex items-center justify-center sm:justify-start gap-3 mt-1 text-gray-400 text-sm">
                        <span className="flex items-center gap-1">
                          <Shield className="h-3 w-3 text-blue-400" />
                          {(profileData.role || "ADMIN").toUpperCase()}
                        </span>
                        <span>•</span>
                        <span>{profileData.email}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Profile Form */}
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 backdrop-blur-sm">
                  <h3 className="mb-6 text-xl font-semibold text-white">
                    Profile Details
                  </h3>
                  <form onSubmit={handleProfileUpdate} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-300">
                          Full Name
                        </label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                          <input
                            type="text"
                            required
                            value={profileData.name}
                            onChange={(e) =>
                              setProfileData({
                                ...profileData,
                                name: e.target.value,
                              })
                            }
                            className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 py-3 text-white placeholder-gray-500 backdrop-blur-sm focus:border-blue-500/50 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-300">
                          Email Address
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                          <input
                            type="email"
                            required
                            disabled
                            value={profileData.email}
                            className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 py-3 text-gray-400 cursor-not-allowed placeholder-gray-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-300">
                          Phone Number
                        </label>
                        <div className="relative">
                          <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                          <input
                            type="tel"
                            value={profileData.phone}
                            onChange={(e) =>
                              setProfileData({
                                ...profileData,
                                phone: e.target.value,
                              })
                            }
                            className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 py-3 text-white placeholder-gray-500 backdrop-blur-sm focus:border-blue-500/50 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-300">
                        Bio
                      </label>
                      <textarea
                        rows={3}
                        value={profileData.bio}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            bio: e.target.value,
                          })
                        }
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 backdrop-blur-sm focus:border-blue-500/50 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        placeholder="Tell us a little about yourself..."
                      />
                    </div>

                    <div className="flex justify-end pt-4">
                      <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        isLoading={isLoading}
                      >
                        <Save className="h-4 w-4" />
                        Save Changes
                      </Button>
                    </div>
                  </form>
                </div>
              </motion.div>
            )}

            {/* --- SECURITY TAB --- */}
            {activeTab === "security" && (
              <motion.div
                key="security"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 backdrop-blur-sm">
                  <h2 className="mb-6 text-xl font-semibold text-white">
                    Change Password
                  </h2>
                  <form onSubmit={handlePasswordChange} className="space-y-6">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-300">
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? "text" : "password"}
                          required
                          value={passwordData.currentPassword}
                          onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              currentPassword: e.target.value,
                            })
                          }
                          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 pr-12 text-white placeholder-gray-400 focus:border-blue-500/50 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowCurrentPassword(!showCurrentPassword)
                          }
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                        >
                          {showCurrentPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-300">
                          New Password
                        </label>
                        <div className="relative">
                          <input
                            type={showNewPassword ? "text" : "password"}
                            required
                            minLength={6}
                            value={passwordData.newPassword}
                            onChange={(e) =>
                              setPasswordData({
                                ...passwordData,
                                newPassword: e.target.value,
                              })
                            }
                            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 pr-12 text-white placeholder-gray-400 focus:border-blue-500/50 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                          >
                            {showNewPassword ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-300">
                          Confirm Password
                        </label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            required
                            minLength={6}
                            value={passwordData.confirmPassword}
                            onChange={(e) =>
                              setPasswordData({
                                ...passwordData,
                                confirmPassword: e.target.value,
                              })
                            }
                            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 pr-12 text-white placeholder-gray-400 focus:border-blue-500/50 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        isLoading={isLoading}
                      >
                        <Lock className="h-4 w-4" />
                        Change Password
                      </Button>
                    </div>
                  </form>
                </div>

                <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8 backdrop-blur-sm">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Device Sessions
                  </h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-300 font-medium">
                        Log out of all devices
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        This will terminate sessions on all other devices.
                      </p>
                    </div>
                    <Button
                      onClick={handleLogoutAllDevices}
                      variant="outline"
                      className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Log Out All
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* --- NOTIFICATIONS TAB --- */}
            {activeTab === "notifications" && (
              <motion.div
                key="notifications"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 backdrop-blur-sm"
              >
                <h2 className="mb-6 text-xl font-semibold text-white">
                  Notification Preferences
                </h2>
                <div className="space-y-6">
                  {Object.entries(notifications).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between py-4 border-b border-white/5 last:border-0"
                    >
                      <div>
                        <p className="font-medium text-white capitalize">
                          {key.replace(/([A-Z])/g, " $1").trim()}
                        </p>
                        <p className="text-sm text-gray-400 mt-1">
                          Receive notifications for{" "}
                          {key.replace(/([A-Z])/g, " $1").toLowerCase()}.
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          setNotifications((prev) => ({
                            ...prev,
                            [key]: !value,
                          }))
                        }
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          value ? "bg-blue-500" : "bg-gray-700"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            value ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="mt-8 flex justify-end">
                  <Button
                    onClick={handleSaveNotifications}
                    variant="primary"
                    isLoading={isLoading}
                  >
                    <Save className="h-4 w-4" />
                    Save Preferences
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
