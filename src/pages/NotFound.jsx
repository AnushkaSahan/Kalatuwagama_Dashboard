import { Link } from "react-router-dom";
import { Home } from "lucide-react";
import Button from "../components/common/Button";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-8xl font-bold text-primary-900 mb-4">404</div>
        <h1 className="text-3xl font-semibold text-gray-800 mb-2">
          Page Not Found
        </h1>
        <p className="text-gray-500 mb-6">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/dashboard">
          <Button icon={Home}>Back to Dashboard</Button>
        </Link>
        <div className="mt-8 text-sm text-gray-400">
          If you think this is a mistake, please contact support.
        </div>
      </div>
    </div>
  );
}
