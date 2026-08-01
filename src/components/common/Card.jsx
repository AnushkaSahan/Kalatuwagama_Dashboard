export default function Card({ children, className = "" }) {
  return (
    <div
      className={`bg-white p-6 rounded-xl shadow-card border border-gray-100 ${className}`}
    >
      {children}
    </div>
  );
}
