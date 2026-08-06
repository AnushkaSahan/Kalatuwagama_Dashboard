import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ArrowRight,
  Calendar,
  Clock3,
  DollarSign,
  MessageSquare,
  PlusCircle,
  ShieldCheck,
  UserPlus,
  Users,
} from "lucide-react";
import { getContactMessages } from "../api/contactMessages";
import { getDonationInfos } from "../api/donationInfo";
import { getEvents } from "../api/events";
import { getStudents } from "../api/students";
import { useAuth } from "../context/AuthContext";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import StatCard from "../components/common/StatCard";
import TempleMark from "../components/common/TempleMark";
import toast from "react-hot-toast";

const normalizeCollection = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.data)) return payload.data;
  if (payload && Array.isArray(payload.content)) return payload.content;
  return [];
};

const greetingKeyForHour = (hour) => {
  if (hour < 12) return "dashboard.goodMorning";
  if (hour < 17) return "dashboard.goodAfternoon";
  return "dashboard.goodEvening";
};

const formatDate = (value, noDateLabel) => {
  if (!value) return noDateLabel;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return noDateLabel;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export default function Dashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [stats, setStats] = useState({
    students: 0,
    events: 0,
    donations: 0,
    messages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentMessages, setRecentMessages] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchStats = async () => {
      try {
        const [studentsRes, eventsRes, donationsRes, messagesRes] =
          await Promise.all([
            getStudents(),
            getEvents(),
            getDonationInfos(),
            getContactMessages(),
          ]);

        if (!isMounted) return;

        const students = normalizeCollection(studentsRes?.data);
        const events = normalizeCollection(eventsRes?.data);
        const donations = normalizeCollection(donationsRes?.data);
        const messages = normalizeCollection(messagesRes?.data);

        setStats({
          students: students.length,
          events: events.length,
          donations: donations.length,
          messages: messages.length,
        });
        setRecentMessages(
          [...messages]
            .sort(
              (a, b) =>
                new Date(b.createdAt || 0).getTime() -
                new Date(a.createdAt || 0).getTime(),
            )
            .slice(0, 4),
        );

        const now = Date.now();
        const upcoming = events
          .filter((event) => {
            const time = new Date(event.eventDate || event.date).getTime();
            return !Number.isNaN(time) && time >= now;
          })
          .sort((a, b) => {
            const first = new Date(a.eventDate || a.date).getTime();
            const second = new Date(b.eventDate || b.date).getTime();
            return first - second;
          });
        setUpcomingEvents(upcoming.slice(0, 4));
      } catch (err) {
        if (!isMounted) return;
        setError("Unable to load live dashboard data right now.");
        toast.error("Failed to load dashboard stats");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchStats();

    return () => {
      isMounted = false;
    };
  }, []);

  const statItems = [
    {
      title: t("dashboard.registeredStudents"),
      value: stats.students,
      icon: Users,
      description: t("dashboard.registeredStudentsDesc"),
      tone: "primary",
    },
    {
      title: t("dashboard.templeEvents"),
      value: stats.events,
      icon: Calendar,
      description: t("dashboard.templeEventsDesc"),
      tone: "accent",
    },
    {
      title: t("dashboard.donationRecords"),
      value: stats.donations,
      icon: DollarSign,
      description: t("dashboard.donationRecordsDesc"),
      tone: "primary",
    },
    {
      title: t("dashboard.newMessages"),
      value: stats.messages,
      icon: MessageSquare,
      description: t("dashboard.newMessagesDesc"),
      tone: "accent",
    },
  ];

  const firstName =
    user?.firstName && user.firstName !== "User" ? user.firstName : "";
  const greeting = `${t(greetingKeyForHour(new Date().getHours()))}${
    firstName ? `, ${firstName}` : ""
  }`;

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-[28px] border border-primary-100 bg-gradient-to-br from-primary-950 via-primary-900 to-stone-800 p-6 text-white shadow-soft sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-accent-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-10 h-56 w-56 rounded-full bg-primary-500/10 blur-3xl" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-sm text-primary-50">
              <TempleMark className="h-4 w-4 text-accent-400" />
              {t("dashboard.adminControlCenter")}
            </div>
            <h1 className="mt-4 font-display text-3xl font-semibold sm:text-4xl">
              {greeting}
            </h1>
            <p className="mt-3 text-sm leading-6 text-primary-50/90 sm:text-base">
              {t("dashboard.heroDescription")}
            </p>
          </div>
          <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur">
            <div className="flex items-center gap-2 text-sm text-primary-50">
              <ShieldCheck className="h-4 w-4 text-accent-400" />
              {(user?.role || "Admin").toString().toLowerCase()}{" "}
              {t("dashboard.access")}
            </div>
            <p className="mt-1 text-sm font-semibold">
              {new Date().toLocaleString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statItems.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            description={stat.description}
            loading={loading}
            tone={stat.tone}
          />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <Card className="overflow-hidden p-0">
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                {t("dashboard.recentMessages")}
              </h3>
              <p className="text-sm text-gray-500">
                {t("dashboard.recentMessagesDesc")}
              </p>
            </div>
            <Link
              to="/messages"
              className="inline-flex items-center gap-1 text-sm font-medium text-primary-900"
            >
              {t("common.viewAll")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="h-14 animate-pulse rounded-xl bg-gray-100"
                  />
                ))}
              </div>
            ) : error ? (
              <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
                {error}
              </div>
            ) : recentMessages.length === 0 ? (
              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6 text-center text-sm text-gray-500">
                {t("common.noData")}
              </div>
            ) : (
              <div className="space-y-3">
                {recentMessages.map((message) => (
                  <div
                    key={message.id}
                    className="flex flex-col gap-2 rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-semibold text-gray-800">
                        {message.fullName || "Anonymous"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {message.subject || "No subject provided"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock3 className="h-4 w-4" />
                      {formatDate(
                        message.createdAt || message.created_at,
                        t("dashboard.noDate"),
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="overflow-hidden p-0">
            <div className="border-b border-gray-100 px-6 py-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {t("dashboard.upcomingEvents")}
              </h3>
              <p className="text-sm text-gray-500">
                {t("dashboard.upcomingEventsDesc")}
              </p>
            </div>
            <div className="space-y-3 p-6">
              {loading ? (
                <div className="space-y-2">
                  {[1, 2].map((item) => (
                    <div
                      key={item}
                      className="h-12 animate-pulse rounded-xl bg-gray-100"
                    />
                  ))}
                </div>
              ) : upcomingEvents.length === 0 ? (
                <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 text-sm text-gray-500">
                  {t("common.noData")}
                </div>
              ) : (
                upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-gray-800">
                          {event.title || "Untitled event"}
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          {event.location || "Location not provided"}
                        </p>
                      </div>
                      <div className="rounded-full bg-primary-50 px-2.5 py-1 text-xs font-medium text-primary-900">
                        {formatDate(
                          event.eventDate || event.date,
                          t("dashboard.noDate"),
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-2 text-sm font-semibold text-primary-900">
              <ShieldCheck className="h-4 w-4" />
              {t("dashboard.quickActions")}
            </div>
            <div className="mt-4 space-y-3">
              <Link to="/events" className="block">
                <Button icon={PlusCircle} className="w-full justify-start">
                  {t("dashboard.addNewEvent")}
                </Button>
              </Link>
              <Link to="/students" className="block">
                <Button
                  icon={UserPlus}
                  className="w-full justify-start"
                  variant="outline"
                >
                  {t("dashboard.registerStudent")}
                </Button>
              </Link>
              <Link to="/foundation-projects" className="block">
                <Button
                  icon={PlusCircle}
                  className="w-full justify-start"
                  variant="outline"
                >
                  Create foundation project
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
