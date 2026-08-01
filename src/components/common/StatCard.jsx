export default function StatCard({
  title,
  value,
  icon: Icon,
  change,
  trend,
  loading = false,
}) {
  const isUp = trend === "up";
  return (
    <div className="bg-white p-6 rounded-xl shadow-card border border-gray-100 hover:shadow-soft transition-shadow">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-500">{title}</span>
        <div className="p-2 bg-primary-50 rounded-lg text-primary-900">
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="mt-4">
        {loading ? (
          <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
        ) : (
          <>
            <span className="text-2xl font-semibold text-gray-800">
              {value}
            </span>
            {change && (
              <span
                className={`ml-2 text-xs font-medium ${isUp ? "text-success" : "text-danger"}`}
              >
                {change}
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );
}
