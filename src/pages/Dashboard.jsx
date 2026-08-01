import {
  Users,
  Calendar,
  DollarSign,
  MessageSquare,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import Card from "../components/common/Card";
import StatCard from "../components/common/StatCard";
import Table from "../components/common/Table";

const stats = [
  {
    title: "Total Students",
    value: "1,247",
    icon: Users,
    change: "+12%",
    trend: "up",
  },
  {
    title: "Upcoming Events",
    value: "8",
    icon: Calendar,
    change: "+2",
    trend: "up",
  },
  {
    title: "Donations (This Month)",
    value: "$8,420",
    icon: DollarSign,
    change: "-3%",
    trend: "down",
  },
  {
    title: "New Messages",
    value: "24",
    icon: MessageSquare,
    change: "+5",
    trend: "up",
  },
];

const recentActivity = [
  {
    id: 1,
    user: "Samitha Silva",
    action: "Registered for Daham Pasala",
    date: "2 hours ago",
  },
  {
    id: 2,
    user: "Ven. Dhammarama",
    action: "Updated event: Vesak Day",
    date: "4 hours ago",
  },
  {
    id: 3,
    user: "Nimal Perera",
    action: "Donated $500 to Stupa Fund",
    date: "yesterday",
  },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span className="hidden sm:inline">Last updated: </span>
          <span>Today at 10:30 AM</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {recentActivity.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
              >
                <div>
                  <p className="font-medium text-gray-800">{item.user}</p>
                  <p className="text-sm text-gray-500">{item.action}</p>
                </div>
                <span className="text-xs text-gray-400">{item.date}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-medium mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <button className="w-full text-left px-4 py-2 bg-primary-900 text-white rounded-lg hover:bg-primary-800 transition">
              Add Event
            </button>
            <button className="w-full text-left px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">
              Manage Students
            </button>
            <button className="w-full text-left px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">
              View Donations
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
