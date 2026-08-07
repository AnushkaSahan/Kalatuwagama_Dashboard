export default function Table({ columns, data, onRowClick }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50/70 dark:border-gray-800 dark:bg-dark-900/60">
            {columns.map((col, idx) => (
              <th
                key={idx}
                className="text-left py-3.5 px-4 font-semibold text-gray-600 dark:text-gray-300"
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
              className="border-b border-gray-100 transition-colors last:border-0 hover:bg-primary-50/40 dark:border-gray-800 dark:hover:bg-dark-800/40"
              onClick={() => onRowClick && onRowClick(row)}
            >
              {columns.map((col, cidx) => (
                <td
                  key={cidx}
                  className="py-3.5 px-4 text-gray-700 dark:text-gray-200"
                >
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
