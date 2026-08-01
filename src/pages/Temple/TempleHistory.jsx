import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import Card from "../../components/common/Card";
import Table from "../../components/common/Table";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";

const mockData = [
  {
    id: "1",
    title: "Foundation of Temple",
    description: "Established during Anuradhapura era",
    updatedAt: "2026-07-28",
  },
  {
    id: "2",
    title: "Restoration 1974",
    description: "Major renovation by villagers",
    updatedAt: "2026-07-25",
  },
];

export default function TempleHistory() {
  const [searchTerm, setSearchTerm] = useState("");

  const columns = [
    { header: "Title", accessor: "title" },
    { header: "Description", accessor: "description" },
    { header: "Last Updated", accessor: "updatedAt" },
    {
      header: "Actions",
      accessor: "id",
      cell: (id) => (
        <div className="flex items-center gap-2">
          <Link
            to={`/temple-history/edit/${id}`}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <Pencil className="w-4 h-4 text-gray-600" />
          </Link>
          <button className="p-1 hover:bg-gray-100 rounded text-danger">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  const filteredData = mockData.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-semibold text-gray-800">Temple History</h1>
        <Link to="/temple-history/create">
          <Button icon={Plus}>Add Record</Button>
        </Link>
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
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              Export
            </Button>
          </div>
        </div>
        <Table columns={columns} data={filteredData} />
      </Card>
    </div>
  );
}
