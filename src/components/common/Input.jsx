export default function Input({ className = "", ...props }) {
  return (
    <input
      className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-900 focus:border-transparent outline-none transition ${className}`}
      {...props}
    />
  );
}
