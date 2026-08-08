import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { getUsers, updateUser, changePassword } from "../../api/users";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import toast from "react-hot-toast";
import {
  User,
  Mail,
  Lock,
  ShieldCheck,
  KeyRound,
  IdCard,
  BadgeCheck,
  UserCircle,
} from "lucide-react";

export default function Profile() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [userId, setUserId] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    if (user?.email) {
      fetchUser();
    }
  }, [user]);

  const fetchUser = async () => {
    try {
      const res = await getUsers();
      const currentUser = res.data.find((item) => item.email === user.email);

      if (!currentUser) {
        throw new Error("Current user not found");
      }

      setUserId(currentUser.id);
      setFormData({
        firstName: currentUser.firstName || "",
        lastName: currentUser.lastName || "",
        email: currentUser.email || user.email || "",
        role: currentUser.role || user.role || "",
      });
    } catch (error) {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (!userId) {
        toast.error("User ID not available");
        return;
      }

      await updateUser(userId, {
        ...formData,
        password: "********",
      });
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setPasswordLoading(true);
    try {
      await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      toast.success("Password changed successfully");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Password change failed");
    } finally {
      setPasswordLoading(false);
    }
  };

  if (loading)
    return (
      <div className="space-y-6">
        <div className="h-9 w-48 animate-pulse rounded-lg bg-gray-200 dark:bg-dark-800" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {[1, 2].map((item) => (
            <div
              key={item}
              className={`h-64 animate-pulse rounded-2xl border border-gray-100 bg-white shadow-card dark:border-white/5 dark:bg-dark-850 ${
                item === 1 ? "lg:col-span-2" : ""
              }`}
            />
          ))}
        </div>
      </div>
    );

  const initials =
    `${formData.firstName?.[0] || ""}${formData.lastName?.[0] || ""}`.toUpperCase();

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          {/* <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-primary text-white shadow-lg shadow-primary-900/25">
            <UserCircle className="h-5 w-5" />
          </div> */}
          <div>
            <h1 className="font-display text-2xl font-semibold text-gray-800 dark:text-gray-100">
              My Profile
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Manage your personal information and account security.
            </p>
          </div>
        </div>
      </div>

      {/* User summary banner */}
      {/* <div className="relative overflow-hidden rounded-2xl border border-primary-100/50 bg-gradient-hero p-6 text-white shadow-soft ring-1 ring-white/5">
        <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-accent-500/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-10 h-48 w-48 rounded-full bg-primary-500/15 blur-3xl" />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 text-2xl font-semibold text-accent-400 ring-1 ring-white/20 backdrop-blur">
            {initials || <User className="h-7 w-7" />}
          </div>
          <div className="min-w-0">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-primary-50">
              <BadgeCheck className="h-3.5 w-3.5 text-accent-400" />
              {(formData.role || "VIEWER").charAt(0).toUpperCase() +
                (formData.role || "VIEWER").slice(1).toLowerCase()}{" "}
              Account
            </div>
            <h2 className="mt-2 truncate font-display text-2xl font-semibold">
              {formData.firstName} {formData.lastName}
            </h2>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-primary-50/90">
              <Mail className="h-4 w-4" />
              {formData.email}
            </p>
          </div>
        </div>
      </div> */}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Profile Information */}
        <Card className="lg:col-span-2">
          <div className="mb-5 flex items-center gap-3 border-b border-gray-100 pb-4 dark:border-gray-800">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-900 dark:bg-primary-500/15 dark:text-primary-300">
              <IdCard className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-medium text-gray-800 dark:text-gray-100">
                Personal Information
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Update your name and contact details.
              </p>
            </div>
          </div>
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  First Name
                </label>
                <Input
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Last Name
                </label>
                <Input
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  required
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="pl-9"
                  required
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Role
              </label>
              <div className="relative">
                <ShieldCheck className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                <Input
                  value={formData.role}
                  disabled
                  className="bg-gray-50 pl-9 dark:bg-dark-800"
                />
              </div>
              <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                Role cannot be changed here.
              </p>
            </div>
            <div className="flex justify-end">
              <Button type="submit" icon={User} disabled={submitting}>
                {submitting ? "Updating..." : "Update Profile"}
              </Button>
            </div>
          </form>
        </Card>

        {/* Change Password */}
        <div className="space-y-6">
          <Card>
            <div className="mb-5 flex items-center gap-3 border-b border-gray-100 pb-4 dark:border-gray-800">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-50 text-accent-700 dark:bg-accent-500/15 dark:text-accent-300">
                <KeyRound className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-medium text-gray-800 dark:text-gray-100">
                  Change Password
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Keep your account secure.
                </p>
              </div>
            </div>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Current Password
                </label>
                <Input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      currentPassword: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  New Password
                </label>
                <Input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Confirm New Password
                </label>
                <Input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      confirmPassword: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={passwordLoading}
                className="w-full"
                icon={Lock}
              >
                {passwordLoading ? "Changing..." : "Change Password"}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
