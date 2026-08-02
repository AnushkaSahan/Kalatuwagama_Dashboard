export default function StatCard({
  title,
  value,
  icon: Icon,
  description,
  loading = false,
}) {
  return (
    <div className="group relative overflow-hidden rounded-[24px] border border-gray-200 bg-white p-6 shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-soft">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary-900 to-accent" />
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          {loading ? (
            <div className="mt-4 h-8 w-20 animate-pulse rounded-lg bg-gray-200" />
          ) : (
            <p className="mt-3 text-3xl font-semibold text-gray-900">{value}</p>
          )}
        </div>
        <div className="rounded-2xl bg-primary-50 p-3 text-primary-900">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      {description && (
        <p className="mt-4 text-sm text-gray-500">{description}</p>
      )}
    </div>
  );
}
