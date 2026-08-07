export default function StatCard({
  title,
  value,
  icon: Icon,
  description,
  loading = false,
  tone = "primary",
}) {
  const isAccent = tone === "accent";
  const toneIcon = isAccent
    ? "bg-gradient-accent text-white shadow-lg shadow-accent-500/30"
    : "bg-gradient-primary text-white shadow-lg shadow-primary-900/30";
  const toneGlow = isAccent
    ? "from-accent-500/20 via-transparent"
    : "from-primary-600/20 via-transparent";
  const toneBar = isAccent ? "bg-gradient-accent" : "bg-gradient-primary";

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-gray-100/80 bg-white p-6 shadow-card ring-1 ring-black/[0.02] transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover dark:border-white/5 dark:bg-dark-850 dark:ring-white/[0.02]">
      {/* gradient glow */}
      <div
        className={`pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${toneGlow} to-transparent opacity-60 blur-2xl transition-opacity duration-300 group-hover:opacity-100`}
      />
      {/* top accent bar */}
      <div
        className={`absolute inset-x-0 top-0 h-[3px] ${toneBar} rounded-t-2xl`}
      />

      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {title}
          </p>
          {loading ? (
            <div className="mt-4 h-8 w-20 animate-pulse rounded-lg bg-gray-200 dark:bg-dark-700" />
          ) : (
            <p className="mt-3 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              {value}
            </p>
          )}
        </div>
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${toneIcon}`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
      {description && (
        <p className="relative mt-4 text-sm text-gray-500 dark:text-gray-400">
          {description}
        </p>
      )}
    </div>
  );
}
