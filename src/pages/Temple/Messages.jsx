import { useState, useEffect } from "react";
import { Trash2, Search, Eye } from "lucide-react";
import {
  getContactMessages,
  deleteContactMessage,
} from "../../api/contactMessages";
import Card from "../../components/common/Card";
import Table from "../../components/common/Table";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import toast from "react-hot-toast";

export default function Messages() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await getContactMessages();
      setData(res.data);
    } catch (error) {
      toast.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await deleteContactMessage(id);
      toast.success("Deleted");
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  const handleView = (message) => {
    setSelectedMessage(message);
    setShowModal(true);
  };

  const columns = [
    { header: "From", accessor: "fullName" },
    { header: "Email", accessor: "email" },
    { header: "Subject", accessor: "subject" },
    { header: "Date", accessor: "createdAt" },
    {
      header: "Actions",
      accessor: "id",
      cell: (id, row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleView(row)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <Eye className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={() => handleDelete(id)}
            className="p-1 hover:bg-gray-100 rounded text-danger"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  const filtered = data.filter(
    (item) =>
      item.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.subject?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-semibold text-gray-800">
          Contact Messages
        </h1>
        <span className="text-sm text-gray-500">Total: {data.length}</span>
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
          <div className="text-center py-8 text-gray-500">Loading...</div>
        ) : (
          <Table columns={columns} data={filtered} />
        )}
      </Card>

      {/* Message Detail Modal */}
      {showModal && selectedMessage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 shadow-soft">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Message Details
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-500">From</span>
                <p className="text-gray-800">{selectedMessage.fullName}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Email</span>
                <p className="text-gray-800">{selectedMessage.email}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">
                  Subject
                </span>
                <p className="text-gray-800">{selectedMessage.subject}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">
                  Message
                </span>
                <p className="text-gray-800 bg-gray-50 p-3 rounded-lg whitespace-pre-wrap">
                  {selectedMessage.message}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">
                  Received
                </span>
                <p className="text-gray-800">
                  {new Date(selectedMessage.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <Button variant="outline" onClick={() => setShowModal(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
