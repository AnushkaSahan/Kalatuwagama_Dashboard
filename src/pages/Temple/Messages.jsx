import { useState, useEffect } from "react";
import { Trash2, Search, Mail, Clock3, MessageSquare } from "lucide-react";
import {
  getContactMessages,
  deleteContactMessage,
} from "../../api/contactMessages";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Modal from "../../components/common/Modal";
import toast from "react-hot-toast";

const timeAgo = (value) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.round(diffMs / 60000);
  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;

  const diffHr = Math.round(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;

  const diffDay = Math.round(diffHr / 24);
  if (diffDay < 7) return `${diffDay}d ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatDateTime = (value) => {
  if (!value) return "No date";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "No date";
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const initials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("") || "?";

export default function Messages() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getContactMessages();
      const sorted = [...res.data].sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime(),
      );
      setData(sorted);
    } catch (error) {
      toast.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this message?")) return;
    try {
      await deleteContactMessage(id);
      toast.success("Deleted successfully");
      setData((prev) => prev.filter((item) => item.id !== id));
      setSelectedMessage((prev) => (prev?.id === id ? null : prev));
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  const filtered = data.filter(
    (item) =>
      item.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.subject?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-gray-800">
            Messages
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Inquiries submitted through the public contact form.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-3 py-1.5 text-sm font-medium text-primary-900">
          <MessageSquare className="h-4 w-4" />
          {data.length} total
        </span>
      </div>

      <Card>
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search by name, email or subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </Card>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-20 animate-pulse rounded-2xl border border-gray-100 bg-white shadow-card"
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card className="flex flex-col items-center gap-3 py-14 text-center">
          <div className="rounded-2xl bg-primary-50 p-4 text-primary-900">
            <Mail className="h-7 w-7" />
          </div>
          <p className="font-medium text-gray-700">
            {searchTerm ? "No matching messages found" : "No messages yet"}
          </p>
          <p className="max-w-sm text-sm text-gray-500">
            {searchTerm
              ? "Try a different search term."
              : "Inquiries from the public contact form will appear here."}
          </p>
        </Card>
      ) : (
        <Card className="!p-0 overflow-hidden">
          <div className="divide-y divide-gray-100">
            {filtered.map((message) => (
              <button
                key={message.id}
                type="button"
                onClick={() => setSelectedMessage(message)}
                className="flex w-full items-start gap-4 px-5 py-4 text-left transition-colors hover:bg-gray-50"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-900 to-primary-700 text-sm font-semibold text-white">
                  {initials(message.fullName)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <p className="truncate text-sm font-semibold text-gray-800">
                      {message.fullName || "Anonymous"}
                    </p>
                    <span className="flex shrink-0 items-center gap-1 text-xs text-gray-400">
                      <Clock3 className="h-3 w-3" />
                      {timeAgo(message.createdAt || message.created_at) ||
                        "No date"}
                    </span>
                  </div>
                  <p className="mt-0.5 truncate text-sm font-medium text-primary-900">
                    {message.subject || "No subject"}
                  </p>
                  <p className="mt-0.5 truncate text-sm text-gray-500">
                    {message.message}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(message.id);
                  }}
                  className="shrink-0 self-center rounded-lg p-1.5 text-gray-300 transition-colors hover:bg-red-50 hover:text-red-600"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </button>
            ))}
          </div>
        </Card>
      )}

      <Modal
        open={Boolean(selectedMessage)}
        onClose={() => setSelectedMessage(null)}
        title={selectedMessage?.subject || "Message"}
        subtitle={
          selectedMessage
            ? formatDateTime(
                selectedMessage.createdAt || selectedMessage.created_at,
              )
            : ""
        }
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => {
                handleDelete(selectedMessage.id);
                setSelectedMessage(null);
              }}
              icon={Trash2}
            >
              Delete
            </Button>
            {selectedMessage?.email && (
              <a href={`mailto:${selectedMessage.email}`}>
                <Button icon={Mail}>Reply by Email</Button>
              </a>
            )}
          </>
        }
      >
        {selectedMessage && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-900 to-primary-700 text-sm font-semibold text-white">
                {initials(selectedMessage.fullName)}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-gray-800">
                  {selectedMessage.fullName || "Anonymous"}
                </p>
                <p className="truncate text-sm text-gray-500">
                  {selectedMessage.email}
                </p>
              </div>
            </div>
            <div className="rounded-xl bg-gray-50 p-4 text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">
              {selectedMessage.message}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
