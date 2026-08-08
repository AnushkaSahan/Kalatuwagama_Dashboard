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
  Settings as SettingsIcon,
  Wrench,
} from "lucide-react";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import TempleMark from "../../components/common/TempleMark";
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
      {/* Hero banner */}
      {/* <div className="relative overflow-hidden rounded-[28px] border border-primary-100/50 bg-gradient-hero p-6 text-white shadow-soft ring-1 ring-white/5 sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-accent-500/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-10 h-56 w-56 rounded-full bg-primary-500/15 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.04] [background-image:radial-gradient(circle_at_1px_1px,#fff_1px,transparent_0)] [background-size:24px_24px]" />

        <div className="relative flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-accent-400 ring-1 ring-white/20 backdrop-blur">
            <SettingsIcon className="h-6 w-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm text-primary-50">
              <TempleMark className="h-4 w-4 text-accent-400" />
              {t("settings.title")}
            </div>
            <h1 className="mt-2 font-display text-2xl font-semibold sm:text-3xl">
              {t("settings.subtitle")}
            </h1>
          </div>
        </div>
      </div> */}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            {/* General Settings */}
            <Card>
              <div className="mb-5 flex items-center gap-3 border-b border-gray-100 pb-4 dark:border-gray-800">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-900 dark:bg-primary-500/15 dark:text-primary-300">
                  <Globe className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 dark:text-gray-100">
                    {t("settings.generalSettings")}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {t("settings.subtitle")}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
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
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
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
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
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
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t("settings.address")}
                  </label>
                  <textarea
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none transition focus:border-transparent focus:ring-2 focus:ring-primary-900 dark:border-gray-600 dark:bg-dark-850 dark:text-gray-100 dark:placeholder-gray-500"
                    rows="2"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t("settings.timezone")}
                  </label>
                  <select
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none transition focus:border-transparent focus:ring-2 focus:ring-primary-900 dark:border-gray-600 dark:bg-dark-850 dark:text-gray-100"
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
                <h3 className="flex items-center gap-2 text-lg font-medium text-gray-800 dark:text-gray-100">
                  <MapPin className="h-5 w-5 text-primary-900 dark:text-primary-400" />
                  {t("settings.location")}
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {t("settings.locationDesc")}
                </p>
              </div>

              <div className="h-56 w-full border-y border-gray-100 bg-gray-100 dark:border-gray-800 dark:bg-dark-900">
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
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
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
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t("settings.coordinates")}
                  </label>
                  <p className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 font-mono text-sm text-gray-600 dark:border-gray-700 dark:bg-dark-900 dark:text-gray-300">
                    {TEMPLE_LOCATION.latitude}, {TEMPLE_LOCATION.longitude}
                  </p>
                </div>
                <a
                  href={TEMPLE_LOCATION.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-900 hover:underline dark:text-primary-400"
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
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-50 text-accent-700 dark:bg-accent-500/15 dark:text-accent-300">
                  <Languages className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 dark:text-gray-100">
                    {t("settings.language")}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {t("settings.languageDesc")}
                  </p>
                </div>
              </div>
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
                          ? "border-primary-900 bg-primary-50 text-primary-950 dark:border-primary-500 dark:bg-primary-500/15 dark:text-primary-200"
                          : "border-gray-200 text-gray-600 hover:border-primary-200 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:border-primary-500/40 dark:hover:bg-dark-800"
                      }`}
                    >
                      <span>
                        <span className="block text-sm font-medium">
                          {lang.nativeLabel}
                        </span>
                        <span className="block text-xs text-gray-400 dark:text-gray-500">
                          {lang.label}
                        </span>
                      </span>
                      {active && (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-900 text-white dark:bg-primary-500">
                          <Check className="h-3 w-3" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </Card>

            <Card>
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-900 dark:bg-primary-500/15 dark:text-primary-300">
                  <Bell className="h-5 w-5" />
                </div>
                <h3 className="font-medium text-gray-800 dark:text-gray-100">
                  {t("settings.notifications")}
                </h3>
              </div>
              <div className="space-y-3">
                <label className="flex cursor-pointer items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300">
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
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-danger dark:bg-red-500/15 dark:text-red-400">
                  <Wrench className="h-5 w-5" />
                </div>
                <h3 className="font-medium text-gray-800 dark:text-gray-100">
                  {t("settings.maintenance")}
                </h3>
              </div>
              <div className="space-y-3">
                <label className="flex cursor-pointer items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300">
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
                <p className="text-xs text-gray-500 dark:text-gray-400">
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
