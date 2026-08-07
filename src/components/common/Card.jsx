export default function Card({ children, className = "" }) {
  return (
    <div
      className={`relative rounded-2xl border border-gray-100/80 bg-white p-6 shadow-card ring-1 ring-black/[0.02] transition-all duration-300 hover:shadow-soft dark:border-white/5 dark:bg-dark-850 dark:ring-white/[0.02] ${className}`}
    >
      {children}
    </div>
  );
}
