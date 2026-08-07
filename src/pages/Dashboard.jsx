import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Calendar,
  DollarSign,
  MapPin,
  MessageSquare,
  PlusCircle,
  ShieldCheck,
  UserPlus,
  Users,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
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

const CHART_COLORS = { primary: "#6F1D1B", accent: "#D4AF37" };

export default function Dashboard() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const [stats, setStats] = useState({
    students: 0,
    events: 0,
    donations: 0,
    messages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [studentsData, setStudentsData] = useState([]);
  const [eventsData, setEventsData] = useState([]);
  const [messagesData, setMessagesData] = useState([]);
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
        setStudentsData(students);
        setEventsData(events);
        setMessagesData(messages);

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

  // --- Chart data, derived from the same real records already fetched above ---

  const studentsByGrade = useMemo(() => {
    const counts = {};
    studentsData.forEach((student) => {
      const grade = student.grade?.trim() || t("dashboard.unspecified");
      counts[grade] = (counts[grade] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([grade, count]) => ({ grade, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }, [studentsData, t]);

  const eventsOverview = useMemo(() => {
    const now = Date.now();
    let upcomingCount = 0;
    let pastCount = 0;
    eventsData.forEach((event) => {
      const time = new Date(event.eventDate || event.date).getTime();
      if (!Number.isNaN(time) && time >= now) upcomingCount += 1;
      else pastCount += 1;
    });
    return [
      {
        name: t("dashboard.upcoming"),
        value: upcomingCount,
        fill: CHART_COLORS.primary,
      },
      {
        name: t("dashboard.past"),
        value: pastCount,
        fill: CHART_COLORS.accent,
      },
    ];
  }, [eventsData, t]);

  const messageActivity = useMemo(() => {
    const locale = i18n.language === "si" ? "si-LK" : "en-US";
    const days = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() - (6 - i));
      return d;
    });
    const buckets = days.map((d) => ({
      label: d.toLocaleDateString(locale, { weekday: "short" }),
      key: d.toDateString(),
      count: 0,
    }));
    messagesData.forEach((message) => {
      const date = new Date(message.createdAt || message.created_at);
      if (Number.isNaN(date.getTime())) return;
      const key = date.toDateString();
      const bucket = buckets.find((b) => b.key === key);
      if (bucket) bucket.count += 1;
    });
    return buckets;
  }, [messagesData, i18n.language]);

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
              {(user?.role || "Admin").toString().charAt(0).toUpperCase() +
                (user?.role || "Admin").toString().slice(1).toLowerCase()}{" "}
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

      {error && (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

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

      {/* Charts — derived from the same live records above */}
      <div className="grid gap-6 xl:grid-cols-3">
        <Card>
          <h3 className="text-sm font-semibold text-gray-800">
            {t("dashboard.studentsByGrade")}
          </h3>
          <p className="mt-0.5 text-xs text-gray-500">
            {t("dashboard.studentsByGradeDesc")}
          </p>
          <div className="mt-4 h-52">
            {loading ? (
              <div className="h-full w-full animate-pulse rounded-xl bg-gray-100" />
            ) : studentsByGrade.length === 0 ? (
              <div className="flex h-full items-center justify-center text-sm text-gray-400">
                {t("common.noData")}
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={studentsByGrade}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#F1F1EF"
                  />
                  <XAxis
                    dataKey="grade"
                    tick={{ fontSize: 11, fill: "#6b7280" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 11, fill: "#6b7280" }}
                    axisLine={false}
                    tickLine={false}
                    width={24}
                  />
                  <Tooltip
                    cursor={{ fill: "#FBF6E8" }}
                    contentStyle={{
                      borderRadius: 12,
                      border: "1px solid #f1f1ef",
                      fontSize: 12,
                    }}
                  />
                  <Bar
                    dataKey="count"
                    fill={CHART_COLORS.primary}
                    radius={[6, 6, 0, 0]}
                    maxBarSize={32}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        <Card>
          <h3 className="text-sm font-semibold text-gray-800">
            {t("dashboard.eventsOverview")}
          </h3>
          <p className="mt-0.5 text-xs text-gray-500">
            {t("dashboard.eventsOverviewDesc")}
          </p>
          <div className="mt-2 h-52">
            {loading ? (
              <div className="h-full w-full animate-pulse rounded-xl bg-gray-100" />
            ) : stats.events === 0 ? (
              <div className="flex h-full items-center justify-center text-sm text-gray-400">
                {t("common.noData")}
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={eventsOverview}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                  >
                    {eventsOverview.map((entry) => (
                      <Cell key={entry.name} fill={entry.fill} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: "1px solid #f1f1ef",
                      fontSize: 12,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
          <div className="mt-1 flex items-center justify-center gap-5 text-xs text-gray-500">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-primary-900" />
              {t("dashboard.upcoming")}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-accent-500" />
              {t("dashboard.past")}
            </span>
          </div>
        </Card>

        <Card>
          <h3 className="text-sm font-semibold text-gray-800">
            {t("dashboard.messagesActivity")}
          </h3>
          <p className="mt-0.5 text-xs text-gray-500">
            {t("dashboard.messagesActivityDesc")}
          </p>
          <div className="mt-4 h-52">
            {loading ? (
              <div className="h-full w-full animate-pulse rounded-xl bg-gray-100" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={messageActivity}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#F1F1EF"
                  />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 11, fill: "#6b7280" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 11, fill: "#6b7280" }}
                    axisLine={false}
                    tickLine={false}
                    width={24}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: "1px solid #f1f1ef",
                      fontSize: 12,
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke={CHART_COLORS.accent}
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: CHART_COLORS.accent }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>
      </div>

      {/* Upcoming events + quick actions */}
      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <Card className="!p-0 overflow-hidden">
          <div className="border-b border-gray-100 px-6 py-4">
            <h3 className="text-lg font-semibold text-gray-800">
              {t("dashboard.upcomingEvents")}
            </h3>
            <p className="text-sm text-gray-500">
              {t("dashboard.upcomingEventsDesc")}
            </p>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {[1, 2].map((item) => (
                  <div
                    key={item}
                    className="h-40 animate-pulse rounded-2xl bg-gray-100"
                  />
                ))}
              </div>
            ) : upcomingEvents.length === 0 ? (
              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6 text-center text-sm text-gray-500">
                {t("common.noData")}
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    className="group relative flex h-40 flex-col justify-end overflow-hidden rounded-2xl border border-gray-100 shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-soft"
                  >
                    {event.imageUrl ? (
                      <img
                        src={event.imageUrl}
                        alt={event.title}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-primary-900 to-primary-700" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    <div className="absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-primary-900 backdrop-blur">
                      {formatDate(
                        event.eventDate || event.date,
                        t("dashboard.noDate"),
                      )}
                    </div>

                    <div className="relative z-10 p-4">
                      <p className="font-display text-base font-semibold leading-tight text-white">
                        {event.title || "Untitled event"}
                      </p>
                      <p className="mt-1 flex items-center gap-1 text-xs text-white/80">
                        <MapPin className="h-3 w-3" />
                        {event.location || "Location not provided"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
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
  );
}
