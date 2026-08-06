import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Search, Save } from "lucide-react";
import { getUsers, createUser, updateUser, deleteUser } from "../../api/users";
import Card from "../../components/common/Card";
import Table from "../../components/common/Table";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Modal from "../../components/common/Modal";
import toast from "react-hot-toast";

const emptyForm = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  role: "VIEWER",
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

  const columns = [
    { header: "First Name", accessor: "firstName" },
    { header: "Last Name", accessor: "lastName" },
    { header: "Email", accessor: "email" },
    {
      header: "Role",
      accessor: "role",
      cell: (role) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            role === "ADMIN"
              ? "bg-primary-100 text-primary-900"
              : role === "EDITOR"
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-100 text-gray-700"
          }`}
        >
          {role}
        </span>
      ),
    },
    {
      header: "Actions",
      accessor: "id",
      cell: (id) => (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => openEdit(data.find((item) => item.id === id))}
            className="rounded p-1 hover:bg-gray-100"
          >
            <Pencil className="w-4 h-4 text-gray-600" />
          </button>
          <button
            type="button"
            onClick={() => handleDelete(id)}
            className="rounded p-1 text-danger hover:bg-gray-100"
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-semibold text-gray-800">Users</h1>
        <Button icon={Plus} onClick={openCreate}>
          Add User
        </Button>
      </div>

      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search..."
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
          <div className="text-center py-8 text-gray-500">Loading...</div>
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
            : "Create a user account from the Users page."
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
              <label className="mb-1 block text-sm font-medium text-gray-700">
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
              <label className="mb-1 block text-sm font-medium text-gray-700">
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
            <label className="mb-1 block text-sm font-medium text-gray-700">
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
            <label className="mb-1 block text-sm font-medium text-gray-700">
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
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Role
            </label>
            <select
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none transition focus:border-transparent focus:ring-2 focus:ring-primary-900"
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
