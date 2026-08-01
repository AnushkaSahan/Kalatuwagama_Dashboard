import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Calendar,
  DollarSign,
  MessageSquare,
  PlusCircle,
  UserPlus,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { getStudents } from "../api/students";
import { getEvents } from "../api/events";
import { getDonationInfos } from "../api/donationInfo";
import { getContactMessages } from "../api/contactMessages";
import StatCard from "../components/common/StatCard";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import toast from "react-hot-toast";

export default function Dashboard() {
  const [stats, setStats] = useState({
    students: 0,
    events: 0,
    donations: 0,
    messages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentMessages, setRecentMessages] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [studentsRes, eventsRes, donationsRes, messagesRes] =
          await Promise.all([
            getStudents(),
            getEvents(),
            getDonationInfos(),
            getContactMessages(),
          ]);
        setStats({
          students: studentsRes.data.length,
          events: eventsRes.data.length,
          donations: donationsRes.data.length,
          messages: messagesRes.data.length,
        });
        // Show last 3 messages as recent activity
        setRecentMessages(messagesRes.data.slice(0, 3));
      } catch (error) {
        toast.error("Failed to load dashboard stats");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statItems = [
    {
      title: "Total Students",
      value: stats.students,
      icon: Users,
      change: "+12%",
      trend: "up",
    },
    {
      title: "Upcoming Events",
      value: stats.events,
      icon: Calendar,
      change: "+2",
      trend: "up",
    },
    {
      title: "Donation Records",
      value: stats.donations,
      icon: DollarSign,
      change: "-3%",
      trend: "down",
    },
    {
      title: "New Messages",
      value: stats.messages,
      icon: MessageSquare,
      change: "+5",
      trend: "up",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span className="hidden sm:inline">Last updated: </span>
          <span>{new Date().toLocaleString()}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statItems.map((stat, index) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            change={stat.change}
            trend={stat.trend}
            loading={loading}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <h3 className="text-lg font-medium text-gray-800 mb-4">
            Recent Activity
          </h3>
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading...</div>
          ) : recentMessages.length === 0 ? (
            <p className="text-gray-500 text-sm">No recent messages.</p>
          ) : (
            <div className="space-y-3">
              {recentMessages.map((msg) => (
                <div
                  key={msg.id}
                  className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                >
                  <div>
                    <p className="font-medium text-gray-800">{msg.fullName}</p>
                    <p className="text-sm text-gray-500 truncate max-w-xs">
                      {msg.subject}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(msg.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
          <div className="mt-4">
            <Link
              to="/messages"
              className="text-sm text-primary-900 hover:underline"
            >
              View all messages →
            </Link>
          </div>
        </Card>

        {/* Quick Actions */}
        <Card>
          <h3 className="text-lg font-medium text-gray-800 mb-4">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <Link to="/events/create">
              <Button icon={PlusCircle} className="w-full justify-start">
                Add New Event
              </Button>
            </Link>
            <Link to="/students/create">
              <Button
                icon={UserPlus}
                className="w-full justify-start"
                variant="outline"
              >
                Register New Student
              </Button>
            </Link>
            <Link to="/foundation-projects/create">
              <Button
                icon={PlusCircle}
                className="w-full justify-start"
                variant="outline"
              >
                Create Foundation Project
              </Button>
            </Link>
            <Link to="/temple-history/create">
              <Button
                icon={PlusCircle}
                className="w-full justify-start"
                variant="outline"
              >
                Add Temple History
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
