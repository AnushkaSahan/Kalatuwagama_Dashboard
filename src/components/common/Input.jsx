export default function Input({ className = "", ...props }) {
  return (
    <input
      className={`w-full px-3.5 py-2.5 border border-gray-200 rounded-xl bg-white/60 focus:bg-white focus:ring-2 focus:ring-primary-900 focus:border-transparent outline-none transition-all duration-200 dark:border-gray-700 dark:bg-dark-850 dark:focus:bg-dark-800 ${className}`}
      {...props}
    />
  );
}
