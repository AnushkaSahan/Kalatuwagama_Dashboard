import { useState } from "react";
import { Save, Globe, Mail, Bell } from "lucide-react";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import toast from "react-hot-toast";

export default function Settings() {
  const [formData, setFormData] = useState({
    siteName: "Kalatuwagama Temple Management",
    siteEmail: "info@kalatuwagama.lk",
    sitePhone: "+94 55 222 3344",
    address: "Kalatuwagama, Uva Province, Sri Lanka",
    timezone: "Asia/Colombo",
    language: "en",
    notifications: true,
    maintenanceMode: false,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call – replace with actual settings update endpoint
    try {
      // await updateSettings(formData);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Settings saved successfully");
    } catch (error) {
      toast.error("Failed to save settings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-semibold text-gray-800">Settings</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* General Settings */}
          <Card className="lg:col-span-2">
            <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary-900" />
              General Settings
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Site Name
                </label>
                <Input
                  value={formData.siteName}
                  onChange={(e) =>
                    setFormData({ ...formData, siteName: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Site Email
                </label>
                <Input
                  type="email"
                  value={formData.siteEmail}
                  onChange={(e) =>
                    setFormData({ ...formData, siteEmail: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <Input
                  value={formData.sitePhone}
                  onChange={(e) =>
                    setFormData({ ...formData, sitePhone: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-900 focus:border-transparent outline-none transition"
                  rows="2"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Timezone
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-900 focus:border-transparent outline-none transition"
                    value={formData.timezone}
                    onChange={(e) =>
                      setFormData({ ...formData, timezone: e.target.value })
                    }
                  >
                    <option value="Asia/Colombo">Asia/Colombo</option>
                    <option value="Asia/Kolkata">Asia/Kolkata</option>
                    <option value="UTC">UTC</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Language
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-900 focus:border-transparent outline-none transition"
                    value={formData.language}
                    onChange={(e) =>
                      setFormData({ ...formData, language: e.target.value })
                    }
                  >
                    <option value="en">English</option>
                    <option value="si">සිංහල</option>
                  </select>
                </div>
              </div>
            </div>
          </Card>

          {/* Sidebar: Notifications & Maintenance */}
          <div className="space-y-6">
            <Card>
              <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary-900" />
                Notifications
              </h3>
              <div className="space-y-3">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm text-gray-700">
                    Enable Email Notifications
                  </span>
                  <input
                    type="checkbox"
                    checked={formData.notifications}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        notifications: e.target.checked,
                      })
                    }
                    className="rounded border-gray-300 text-primary-900 focus:ring-primary-900"
                  />
                </label>
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                Maintenance
              </h3>
              <div className="space-y-3">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm text-gray-700">
                    Maintenance Mode
                  </span>
                  <input
                    type="checkbox"
                    checked={formData.maintenanceMode}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        maintenanceMode: e.target.checked,
                      })
                    }
                    className="rounded border-gray-300 text-danger focus:ring-danger"
                  />
                </label>
                <p className="text-xs text-gray-500">
                  When enabled, the public website will display a maintenance
                  message.
                </p>
              </div>
            </Card>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button type="submit" icon={Save} disabled={loading}>
            {loading ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </form>
    </div>
  );
}
