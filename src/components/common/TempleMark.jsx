export default function TempleMark({ className = "w-5 h-5" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <line x1="12" y1="2.4" x2="12" y2="5.4" />
      <path d="M9.4 5.4h5.2l-1 2.4h-3.2z" fill="currentColor" stroke="none" />
      <rect x="10" y="8.1" width="4" height="2.1" rx="0.4" />
      <path d="M6 16.6c0-4.2 2.7-6.5 6-6.5s6 2.3 6 6.5" />
      <line x1="4.4" y1="18.6" x2="19.6" y2="18.6" />
      <line x1="3" y1="21" x2="21" y2="21" />
    </svg>
  );
}
