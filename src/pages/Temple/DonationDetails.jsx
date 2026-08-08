import { useState, useEffect } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Save,
  Landmark,
  Copy,
  Check,
  QrCode,
} from "lucide-react";
import {
  getDonationInfos,
  createDonationInfo,
  updateDonationInfo,
  deleteDonationInfo,
} from "../../api/donationInfo";
import Card from "../../components/common/Card";
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
  imageFit: "cover",
};

export default function DonationDetails() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [qrPreview, setQrPreview] = useState(null);

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
      imageFit: record.imageFit || "cover",
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
        toast.success("Donation info updated");
      } else {
        await createDonationInfo(formData);
        toast.success("Donation info added");
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
    if (!window.confirm("Are you sure you want to delete this account?"))
      return;
    try {
      await deleteDonationInfo(id);
      toast.success("Deleted successfully");
      setData((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  const handleCopy = async (item) => {
    try {
      await navigator.clipboard.writeText(item.accountNumber);
      setCopiedId(item.id);
      toast.success("Account number copied");
      setTimeout(() => setCopiedId(null), 1500);
    } catch (error) {
      toast.error("Couldn't copy — please copy manually");
    }
  };

  const filtered = data.filter(
    (item) =>
      item.bankName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.accountName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.accountNumber?.includes(searchTerm),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-gray-800">
            Donations
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Bank accounts and QR codes shown on the public donations page.
          </p>
        </div>
        <Button icon={Plus} onClick={openCreate}>
          Add Account
        </Button>
      </div>

      <Card>
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search by bank, account name or number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </Card>

      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-52 animate-pulse rounded-2xl border border-gray-100 bg-white shadow-card"
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card className="flex flex-col items-center gap-3 py-14 text-center">
          <div className="rounded-2xl bg-primary-50 p-4 text-primary-900">
            <Landmark className="h-7 w-7" />
          </div>
          <p className="font-medium text-gray-700">
            {searchTerm
              ? "No matching accounts found"
              : "No donation accounts added yet"}
          </p>
          <p className="max-w-sm text-sm text-gray-500">
            {searchTerm
              ? "Try a different search term."
              : "Add a bank account so devotees know where to send contributions."}
          </p>
          {!searchTerm && (
            <Button icon={Plus} onClick={openCreate} className="mt-2">
              Add Account
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-soft"
            >
              <div className="flex items-start gap-4 p-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-50 text-primary-900">
                  <Landmark className="h-6 w-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-display text-lg font-semibold text-gray-800">
                    {item.bankName}
                  </h3>
                  <p className="truncate text-sm text-gray-500">
                    {item.accountName}
                    {item.branch ? ` · ${item.branch}` : ""}
                  </p>
                </div>
                {item.qrImage && (
                  <button
                    type="button"
                    onClick={() => setQrPreview(item)}
                    className="shrink-0 overflow-hidden rounded-xl border border-gray-100 transition-transform hover:scale-105"
                    title="View QR code"
                  >
                    <img
                      src={item.qrImage}
                      alt="QR code"
                      className={`h-14 w-14 ${
                        item.imageFit === "contain"
                          ? "object-contain"
                          : "object-cover"
                      }`}
                      onError={(e) => {
                        e.currentTarget.parentElement.style.display = "none";
                      }}
                    />
                  </button>
                )}
              </div>

              <div className="mx-5 flex items-center justify-between rounded-xl bg-gray-50 px-3.5 py-2.5">
                <span className="font-mono text-sm tracking-wide text-gray-700">
                  {item.accountNumber}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(item)}
                  className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-white hover:text-primary-900"
                  title="Copy account number"
                >
                  {copiedId === item.id ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>

              <div className="mt-auto flex items-center justify-end gap-1 border-t border-gray-100 px-3 py-2">
                <button
                  type="button"
                  onClick={() => openEdit(item)}
                  className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-primary-50 hover:text-primary-900"
                  title="Edit"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* QR lightbox */}
      {qrPreview && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center p-4"
          onClick={() => setQrPreview(null)}
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          <div
            className="relative z-10 flex max-w-xs flex-col items-center rounded-2xl bg-white p-6 text-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={qrPreview.qrImage}
              alt="QR code"
              className={`h-56 w-56 rounded-xl ${
                qrPreview.imageFit === "contain"
                  ? "object-contain"
                  : "object-cover"
              }`}
            />
            <p className="mt-4 font-display text-base font-semibold text-gray-800">
              {qrPreview.bankName}
            </p>
            <p className="text-sm text-gray-500">{qrPreview.accountNumber}</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => setQrPreview(null)}
            >
              Close
            </Button>
          </div>
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={editingId ? "Edit Donation Account" : "Add Donation Account"}
        subtitle={
          editingId
            ? "Update the bank details below and save your changes."
            : "Add a bank account for the public donations page."
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
              {submitting
                ? "Saving..."
                : editingId
                  ? "Update Account"
                  : "Save Account"}
            </Button>
          </>
        }
      >
        <form id="donation-form" onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Bank Name *
            </label>
            <Input
              value={formData.bankName}
              onChange={(e) =>
                setFormData({ ...formData, bankName: e.target.value })
              }
              placeholder="e.g. Bank of Ceylon"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Account Name *
            </label>
            <Input
              value={formData.accountName}
              onChange={(e) =>
                setFormData({ ...formData, accountName: e.target.value })
              }
              placeholder="e.g. Kalatuwagama Rajamaha Viharaya"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Account Number *
            </label>
            <Input
              value={formData.accountNumber}
              onChange={(e) =>
                setFormData({ ...formData, accountNumber: e.target.value })
              }
              placeholder="e.g. 001234567890"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Branch
            </label>
            <Input
              value={formData.branch}
              onChange={(e) =>
                setFormData({ ...formData, branch: e.target.value })
              }
              placeholder="e.g. Kalatuwagama"
            />
          </div>
          <ImageUploadField
            label="QR Code Image"
            value={formData.qrImage}
            onChange={(url) => setFormData({ ...formData, qrImage: url })}
            fit={formData.imageFit}
            onFitChange={(fit) => setFormData({ ...formData, imageFit: fit })}
            aspect="square"
          />
        </form>
      </Modal>
    </div>
  );
}
