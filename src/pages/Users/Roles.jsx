import { useState, useEffect } from "react";
import {
  Search,
  ShieldCheck,
  ShieldAlert,
  UserCog,
  TabletSmartphone,
  Lock,
} from "lucide-react";
import Card from "../../components/common/Card";
import Table from "../../components/common/Table";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import toast from "react-hot-toast";
import { getUsers } from "../../api/users";

const roleMeta = {
  ADMIN: {
    icon: ShieldCheck,
    color:
      "bg-primary-100 text-primary-900 dark:bg-primary-500/20 dark:text-primary-300",
    iconColor: "bg-gradient-primary text-white shadow-lg shadow-primary-900/25",
  },
  EDITOR: {
    icon: UserCog,
    color: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300",
    iconColor: "bg-gradient-accent text-white shadow-lg shadow-accent-500/30",
  },
  VIEWER: {
    icon: TabletSmartphone,
    color: "bg-gray-100 text-gray-700 dark:bg-dark-700 dark:text-gray-300",
    iconColor: "bg-gray-800 text-white shadow-lg shadow-gray-900/20",
  },
};

export default function Roles() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Define the fixed roles with descriptions
  const roleDefinitions = [
    {
      name: "ADMIN",
      description:
        "Full system access – can create, update, delete all resources.",
    },
    {
      name: "EDITOR",
      description: "Can create and update content, but cannot delete.",
    },
    {
      name: "VIEWER",
      description: "Read-only access to all public data.",
    },
  ];

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await getUsers();
      setUsers(res.data);
    } catch (error) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  // Count users per role
  const roleCounts = users.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {});

  const columns = [
    { header: "Role", accessor: "name" },
    { header: "Description", accessor: "description" },
    {
      header: "Users",
      accessor: "name",
      cell: (name) => (
        <span className="font-medium text-gray-800 dark:text-gray-100">
          {roleCounts[name] || 0}
        </span>
      ),
    },
    {
      header: "Status",
      accessor: "name",
      cell: (name) => (
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${roleMeta[name]?.color || "bg-gray-100 dark:bg-dark-700 dark:text-gray-300"}`}
        >
          <Lock className="h-3 w-3" />
          {name}
        </span>
      ),
    },
  ];

  const filtered = roleDefinitions.filter(
    (role) =>
      role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-gray-800 dark:text-gray-100">
            Roles & Permissions
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Control access levels across the admin portal.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 shadow-card dark:border-white/5 dark:bg-dark-850 dark:text-gray-300">
          <ShieldAlert className="h-4 w-4 text-accent-500" />
          Total users: {users.length}
        </div>
      </div>

      {/* Role definition cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {roleDefinitions.map((role) => {
          const meta = roleMeta[role.name] || roleMeta.VIEWER;
          const Icon = meta.icon;
          return (
            <div
              key={role.name}
              className="group relative overflow-hidden rounded-2xl border border-gray-100/80 bg-white p-6 shadow-card ring-1 ring-black/[0.02] transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover dark:border-white/5 dark:bg-dark-850 dark:ring-white/[0.02]"
            >
              <div className="flex items-start justify-between gap-3">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl ${meta.iconColor}`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${meta.color}`}
                >
                  {role.name}
                </span>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                {role.description}
              </p>
              <div className="mt-5 flex items-center gap-2 border-t border-gray-100 pt-4 dark:border-gray-800">
                <span className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {roleCounts[role.name] || 0}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Assigned user{roleCounts[role.name] === 1 ? "" : "s"}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <Card className="!p-0 overflow-hidden">
        <div className="flex flex-col gap-4 border-b border-gray-100 p-5 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search roles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          {/* <Button variant="outline" size="sm">
            Export
          </Button> */}
        </div>
        {loading ? (
          <div className="space-y-3 p-5">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-12 animate-pulse rounded-xl bg-gray-100 dark:bg-dark-800"
              />
            ))}
          </div>
        ) : (
          <Table columns={columns} data={filtered} />
        )}
      </Card>
    </div>
  );
}
