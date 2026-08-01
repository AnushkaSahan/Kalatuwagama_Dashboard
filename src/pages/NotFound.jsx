export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-soft text-center">
        <h1 className="text-3xl font-semibold text-gray-800">404</h1>
        <p className="mt-2 text-gray-500">
          The page you are looking for does not exist.
        </p>
      </div>
    </div>
  );
}
