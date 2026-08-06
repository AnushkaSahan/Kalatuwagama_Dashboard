import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Save,
  Globe,
  Bell,
  MapPin,
  ExternalLink,
  Languages,
  Check,
} from "lucide-react";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { changeLanguage } from "../../i18n";
import toast from "react-hot-toast";

const TEMPLE_LOCATION = {
  placeName: "Kalatuwagama Rajamaha Viharaya",
  latitude: 7.684082,
  longitude: 80.3433217,
  mapsUrl:
    "https://www.google.com/maps/place/Kalatuwagama+Rajamaha+Viharaya/@7.6818222,80.3455656,16.39z/data=!4m6!3m5!1s0x3afccd9e032d990b:0x6bf2ed7b00e69166!8m2!3d7.684082!4d80.3433217",
};

const LANGUAGES = [
  { code: "en", label: "English", nativeLabel: "English" },
  { code: "si", label: "Sinhala", nativeLabel: "සිංහල" },
];

export default function Settings() {
  const { t, i18n } = useTranslation();
  const [formData, setFormData] = useState({
    siteName: "Kalatuwagama Temple Management",
    siteEmail: "info@kalatuwagama.lk",
    sitePhone: "+94 55 222 3344",
    address: "Kalatuwagama, North Western Province, Sri Lanka",
    timezone: "Asia/Colombo",
    placeName: TEMPLE_LOCATION.placeName,
    notifications: true,
    maintenanceMode: false,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // await updateSettings(formData);
      await new Promise((resolve) => setTimeout(resolve, 800));
      toast.success(t("settings.settingsSaved"));
    } catch (error) {
      toast.error(t("common.error"));
    } finally {
      setLoading(false);
    }
  };

  const mapEmbedSrc = `https://www.google.com/maps?q=${TEMPLE_LOCATION.latitude},${TEMPLE_LOCATION.longitude}&hl=en&z=16&output=embed`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-gray-800">
          {t("settings.title")}
        </h1>
        <p className="mt-1 text-sm text-gray-500">{t("settings.subtitle")}</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            {/* General Settings */}
            <Card>
              <h3 className="mb-4 flex items-center gap-2 text-lg font-medium text-gray-800">
                <Globe className="h-5 w-5 text-primary-900" />
                {t("settings.generalSettings")}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    {t("settings.siteName")}
                  </label>
                  <Input
                    value={formData.siteName}
                    onChange={(e) =>
                      setFormData({ ...formData, siteName: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    {t("settings.siteEmail")}
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
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    {t("settings.phoneNumber")}
                  </label>
                  <Input
                    value={formData.sitePhone}
                    onChange={(e) =>
                      setFormData({ ...formData, sitePhone: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    {t("settings.address")}
                  </label>
                  <textarea
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none transition focus:border-transparent focus:ring-2 focus:ring-primary-900"
                    rows="2"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    {t("settings.timezone")}
                  </label>
                  <select
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none transition focus:border-transparent focus:ring-2 focus:ring-primary-900"
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
              </div>
            </Card>

            {/* Location */}
            <Card className="overflow-hidden !p-0">
              <div className="p-6 pb-4">
                <h3 className="flex items-center gap-2 text-lg font-medium text-gray-800">
                  <MapPin className="h-5 w-5 text-primary-900" />
                  {t("settings.location")}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {t("settings.locationDesc")}
                </p>
              </div>

              <div className="h-56 w-full border-y border-gray-100 bg-gray-100">
                <iframe
                  title="Temple location"
                  src={mapEmbedSrc}
                  className="h-full w-full"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              <div className="space-y-4 p-6">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    {t("settings.placeName")}
                  </label>
                  <Input
                    value={formData.placeName}
                    onChange={(e) =>
                      setFormData({ ...formData, placeName: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    {t("settings.coordinates")}
                  </label>
                  <p className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 font-mono text-sm text-gray-600">
                    {TEMPLE_LOCATION.latitude}, {TEMPLE_LOCATION.longitude}
                  </p>
                </div>
                <a
                  href={TEMPLE_LOCATION.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-900 hover:underline"
                >
                  {t("settings.openInMaps")}
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </Card>
          </div>

          {/* Sidebar column */}
          <div className="space-y-6">
            {/* Language */}
            <Card>
              <h3 className="mb-1 flex items-center gap-2 text-lg font-medium text-gray-800">
                <Languages className="h-5 w-5 text-primary-900" />
                {t("settings.language")}
              </h3>
              <p className="mb-4 text-sm text-gray-500">
                {t("settings.languageDesc")}
              </p>
              <div className="space-y-2">
                {LANGUAGES.map((lang) => {
                  const active = i18n.language === lang.code;
                  return (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => changeLanguage(lang.code)}
                      className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition-all duration-150 ${
                        active
                          ? "border-primary-900 bg-primary-50 text-primary-950"
                          : "border-gray-200 text-gray-600 hover:border-primary-200 hover:bg-gray-50"
                      }`}
                    >
                      <span>
                        <span className="block text-sm font-medium">
                          {lang.nativeLabel}
                        </span>
                        <span className="block text-xs text-gray-400">
                          {lang.label}
                        </span>
                      </span>
                      {active && (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-900 text-white">
                          <Check className="h-3 w-3" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </Card>

            <Card>
              <h3 className="mb-4 flex items-center gap-2 text-lg font-medium text-gray-800">
                <Bell className="h-5 w-5 text-primary-900" />
                {t("settings.notifications")}
              </h3>
              <div className="space-y-3">
                <label className="flex cursor-pointer items-center justify-between">
                  <span className="text-sm text-gray-700">
                    {t("settings.enableEmailNotifications")}
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
              <h3 className="mb-4 text-lg font-medium text-gray-800">
                {t("settings.maintenance")}
              </h3>
              <div className="space-y-3">
                <label className="flex cursor-pointer items-center justify-between">
                  <span className="text-sm text-gray-700">
                    {t("settings.maintenanceMode")}
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
                  {t("settings.maintenanceDesc")}
                </p>
              </div>
            </Card>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button type="submit" icon={Save} disabled={loading}>
            {loading ? t("common.saving") : t("settings.saveSettings")}
          </Button>
        </div>
      </form>
    </div>
  );
}
