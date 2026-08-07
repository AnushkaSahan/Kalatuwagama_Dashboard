import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import Card from "../../components/common/Card";
import Table from "../../components/common/Table";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import toast from "react-hot-toast";
import { getUsers } from "../../api/users";

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
      color:
        "bg-primary-100 text-primary-900 dark:bg-primary-500/20 dark:text-primary-300",
    },
    {
      name: "EDITOR",
      description: "Can create and update content, but cannot delete.",
      color: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300",
    },
    {
      name: "VIEWER",
      description: "Read-only access to all public data.",
      color: "bg-gray-100 text-gray-700 dark:bg-dark-700 dark:text-gray-300",
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
        <span className="font-medium">{roleCounts[name] || 0}</span>
      ),
    },
    {
      header: "Status",
      accessor: "name",
      cell: (name) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${roleDefinitions.find((r) => r.name === name)?.color || "bg-gray-100 dark:bg-dark-700 dark:text-gray-300"}`}
        >
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
          Roles & Permissions
        </h1>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Total users: {users.length}
        </div>
      </div>

      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search roles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button variant="outline" size="sm">
            Export
          </Button>
        </div>
        {loading ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            Loading...
          </div>
        ) : (
          <Table columns={columns} data={filtered} />
        )}
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {roleDefinitions.map((role) => (
          <div
            key={role.name}
            className="bg-white p-6 rounded-xl shadow-card border border-gray-100 dark:border-white/5 dark:bg-dark-850"
          >
            <div className="flex items-center justify-between">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${role.color}`}
              >
                {role.name}
              </span>
              <span className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
                {roleCounts[role.name] || 0}
              </span>
            </div>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {role.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
