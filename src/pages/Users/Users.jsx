import { useState, useEffect } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Save,
  Users as UsersIcon,
  ShieldCheck,
  UserCog,
  Eye,
  UserSearch,
} from "lucide-react";
import { getUsers, createUser, updateUser, deleteUser } from "../../api/users";
import Card from "../../components/common/Card";
import Table from "../../components/common/Table";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Modal from "../../components/common/Modal";
import StatCard from "../../components/common/StatCard";
import toast from "react-hot-toast";

const emptyForm = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  role: "VIEWER",
};

const roleBadge = (role) => {
  const styles = {
    ADMIN:
      "bg-primary-100 text-primary-900 dark:bg-primary-500/20 dark:text-primary-300",
    EDITOR: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300",
    VIEWER: "bg-gray-100 text-gray-700 dark:bg-dark-700 dark:text-gray-300",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${styles[role] || styles.VIEWER}`}
    >
      {role}
    </span>
  );
};

export default function Users() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getUsers();
      setData(res.data);
    } catch (error) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (record) => {
    setEditingId(record.id);
    setFormData({
      firstName: record.firstName || "",
      lastName: record.lastName || "",
      email: record.email || "",
      password: "********",
      role: record.role || "VIEWER",
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    if (submitting) return;
    setModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.firstName.trim() ||
      !formData.lastName.trim() ||
      !formData.email.trim() ||
      !formData.password.trim()
    ) {
      toast.error("All fields are required");
      return;
    }

    setSubmitting(true);
    try {
      if (editingId) {
        await updateUser(editingId, formData);
        toast.success("User updated successfully");
      } else {
        await createUser(formData);
        toast.success("User created successfully");
      }
      setModalOpen(false);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Save failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteUser(id);
      toast.success("Deleted successfully");
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  const roleCounts = data.reduce(
    (acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      acc.total += 1;
      return acc;
    },
    { ADMIN: 0, EDITOR: 0, VIEWER: 0, total: 0 },
  );

  const columns = [
    {
      header: "User",
      accessor: "firstName",
      cell: (_, row) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-primary text-xs font-semibold text-white">
            {(
              (row.firstName?.[0] || "") + (row.lastName?.[0] || "")
            ).toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-gray-800 dark:text-gray-100">
              {row.firstName} {row.lastName}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              {row.email}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: "Role",
      accessor: "role",
      cell: (role) => roleBadge(role),
    },
    {
      header: "Actions",
      accessor: "id",
      cell: (id) => (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => openEdit(data.find((item) => item.id === id))}
            className="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-primary-50 hover:text-primary-900 dark:hover:bg-primary-500/15 dark:hover:text-primary-300"
            title="Edit"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => handleDelete(id)}
            className="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-400"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  const filtered = data.filter(
    (item) =>
      item.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const statItems = [
    {
      title: "Total Users",
      value: roleCounts.total,
      icon: UsersIcon,
      tone: "primary",
    },
    {
      title: "Administrators",
      value: roleCounts.ADMIN,
      icon: ShieldCheck,
      tone: "accent",
    },
    {
      title: "Editors",
      value: roleCounts.EDITOR,
      icon: UserCog,
      tone: "primary",
    },
    {
      title: "Viewers",
      value: roleCounts.VIEWER,
      icon: Eye,
      tone: "accent",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          {/* <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-primary text-white shadow-lg shadow-primary-900/25">
            <UsersIcon className="h-5 w-5" />
          </div> */}
          <div>
            <h1 className="font-display text-2xl font-semibold text-gray-800 dark:text-gray-100">
              Users
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Manage admin accounts and permissions.
            </p>
          </div>
        </div>
        <Button icon={Plus} onClick={openCreate}>
          Add User
        </Button>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statItems.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            loading={loading}
            tone={stat.tone}
          />
        ))}
      </div>

      <Card className="!p-0 overflow-hidden">
        <div className="flex flex-col gap-4 border-b border-gray-100 p-5 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {filtered.length} of {data.length} users
          </span>
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
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-14 text-center">
            <div className="rounded-2xl bg-primary-50 p-4 text-primary-900 dark:bg-primary-500/15 dark:text-primary-300">
              <UserSearch className="h-7 w-7" />
            </div>
            <p className="font-medium text-gray-700 dark:text-gray-200">
              {searchTerm ? "No matching users found" : "No users yet"}
            </p>
            <p className="max-w-sm text-sm text-gray-500 dark:text-gray-400">
              {searchTerm
                ? "Try a different search term."
                : "Create the first admin account."}
            </p>
            {!searchTerm && (
              <Button icon={Plus} onClick={openCreate} className="mt-2">
                Add User
              </Button>
            )}
          </div>
        ) : (
          <Table columns={columns} data={filtered} />
        )}
      </Card>

      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={editingId ? "Edit User" : "Add User"}
        subtitle={
          editingId
            ? "Update the user details and save your changes."
            : "Create a new user account."
        }
        footer={
          <>
            <Button type="button" variant="ghost" onClick={closeModal}>
              Cancel
            </Button>
            <Button
              type="submit"
              form="user-form"
              icon={Save}
              disabled={submitting}
            >
              {submitting ? "Saving..." : editingId ? "Update" : "Save"}
            </Button>
          </>
        }
      >
        <form id="user-form" onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                First Name *
              </label>
              <Input
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                required
                autoFocus
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Last Name *
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
              Email *
            </label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Password *
            </label>
            <Input
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              placeholder={
                editingId
                  ? "Password stays unchanged unless you replace the placeholder"
                  : "Enter password"
              }
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Role
            </label>
            <select
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none transition focus:border-transparent focus:ring-2 focus:ring-primary-900 dark:border-gray-700 dark:bg-dark-850 dark:text-gray-100"
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
            >
              <option value="ADMIN">ADMIN</option>
              <option value="EDITOR">EDITOR</option>
              <option value="VIEWER">VIEWER</option>
            </select>
          </div>
        </form>
      </Modal>
    </div>
  );
}
