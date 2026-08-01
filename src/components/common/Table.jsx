export default function Table({ columns, data }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            {columns.map((col, idx) => (
              <th
                key={idx}
                className="text-left py-3 px-4 font-medium text-gray-600"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr
              key={idx}
              className="border-b border-gray-100 hover:bg-gray-50 transition"
            >
              {columns.map((col, cidx) => (
                <td key={cidx} className="py-3 px-4 text-gray-700">
                  {col.cell
                    ? col.cell(row[col.accessor], row)
                    : row[col.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
