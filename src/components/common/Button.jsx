export default function Button({
  children,
  variant = "primary",
  size = "md",
  icon: Icon,
  className = "",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-dark-950 active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none";
  const variants = {
    primary:
      "bg-gradient-primary text-white shadow-lg shadow-primary-900/20 hover:shadow-xl hover:shadow-primary-900/30 hover:-translate-y-px focus-visible:ring-primary-900",
    outline:
      "border border-gray-300 bg-white/60 text-gray-700 hover:bg-gray-50 hover:border-primary-200 focus-visible:ring-gray-300 dark:border-gray-700 dark:bg-dark-850 dark:text-gray-200 dark:hover:bg-dark-800 dark:hover:border-primary-500/40 dark:hover:text-white",
    danger:
      "bg-gradient-to-br from-red-600 to-danger text-white shadow-lg shadow-red-600/20 hover:shadow-red-600/30 hover:-translate-y-px focus-visible:ring-danger",
    ghost:
      "text-gray-600 hover:bg-gray-100 focus-visible:ring-gray-300 dark:text-gray-300 dark:hover:bg-dark-800 dark:hover:text-white",
  };
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
  };
  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </button>
  );
}
