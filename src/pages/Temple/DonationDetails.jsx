import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Search, Save, X } from "lucide-react";
import {
  getDonationInfos,
  createDonationInfo,
  updateDonationInfo,
  deleteDonationInfo,
} from "../../api/donationInfo";
import Card from "../../components/common/Card";
import Table from "../../components/common/Table";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Modal from "../../components/common/Modal";
import ImageUploadField from "../../components/common/ImageUploadField";
import toast from "react-hot-toast";

const emptyForm = {
  bankName: "",
  accountName: "",
  accountNumber: "",
  branch: "",
  qrImage: "",
};

export default function DonationDetails() {
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
      const res = await getDonationInfos();
      setData(res.data);
    } catch (error) {
      toast.error("Failed to load donation info");
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
      bankName: record.bankName || "",
      accountName: record.accountName || "",
      accountNumber: record.accountNumber || "",
      branch: record.branch || "",
      qrImage: record.qrImage || "",
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
      !formData.bankName.trim() ||
      !formData.accountName.trim() ||
      !formData.accountNumber.trim()
    ) {
      toast.error("Bank, account name and number are required");
      return;
    }

    setSubmitting(true);
    try {
      if (editingId) {
        await updateDonationInfo(editingId, formData);
        toast.success("Updated");
      } else {
        await createDonationInfo(formData);
        toast.success("Created");
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
    if (!window.confirm("Are you sure?")) return;
    try {
      await deleteDonationInfo(id);
      toast.success("Deleted");
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  const columns = [
    { header: "Bank", accessor: "bankName" },
    { header: "Account Name", accessor: "accountName" },
    { header: "Account Number", accessor: "accountNumber" },
    { header: "Branch", accessor: "branch" },
    {
      header: "Actions",
      accessor: "id",
      cell: (id) => (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => openEdit(data.find((item) => item.id === id))}
            className="rounded p-1 hover:bg-gray-100 dark:hover:bg-dark-800"
          >
            <Pencil className="w-4 h-4 text-gray-600 dark:text-gray-300" />
          </button>
          <button
            type="button"
            onClick={() => handleDelete(id)}
            className="rounded p-1 text-danger hover:bg-gray-100 dark:hover:bg-dark-800"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  const filtered = data.filter(
    (item) =>
      item.bankName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.accountName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.accountNumber?.includes(searchTerm),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
          Donation Details
        </h1>
        <Button icon={Plus} onClick={openCreate}>
          Add Donation Info
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
        </div>
        {loading ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            Loading...
          </div>
        ) : (
          <Table columns={columns} data={filtered} />
        )}
      </Card>

      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={editingId ? "Edit Donation Info" : "Add Donation Info"}
        subtitle={
          editingId
            ? "Update the donation details below and save your changes."
            : "Enter the donation details for the single donations page."
        }
        footer={
          <>
            <Button type="button" variant="ghost" onClick={closeModal}>
              Cancel
            </Button>
            <Button
              type="submit"
              form="donation-form"
              icon={Save}
              disabled={submitting}
            >
              {submitting ? "Saving..." : editingId ? "Update" : "Save"}
            </Button>
          </>
        }
      >
        <form id="donation-form" onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Bank Name *
            </label>
            <Input
              value={formData.bankName}
              onChange={(e) =>
                setFormData({ ...formData, bankName: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Account Name *
            </label>
            <Input
              value={formData.accountName}
              onChange={(e) =>
                setFormData({ ...formData, accountName: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Account Number *
            </label>
            <Input
              value={formData.accountNumber}
              onChange={(e) =>
                setFormData({ ...formData, accountNumber: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Branch
            </label>
            <Input
              value={formData.branch}
              onChange={(e) =>
                setFormData({ ...formData, branch: e.target.value })
              }
            />
          </div>
          <ImageUploadField
            label="QR Image"
            value={formData.qrImage}
            onChange={(url) => setFormData({ ...formData, qrImage: url })}
            aspect="video"
          />
        </form>
      </Modal>
    </div>
  );
}
