import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft } from "lucide-react";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import toast from "react-hot-toast";
import apiClient from "../../api/apiClient";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setLoading(true);
    try {
      // Call your backend password reset endpoint
      // For example: POST /api/auth/forgot-password
      await apiClient.post("/api/auth/forgot-password", { email });
      setSubmitted(true);
      toast.success("Password reset link sent to your email");
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to send reset link";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-950 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-dark-850 rounded-2xl shadow-soft p-8 dark:ring-1 dark:ring-gray-800">
          {/* Back to login */}
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to login
          </Link>

          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary-900 text-white font-bold text-3xl dark:bg-primary-700">
              K
            </div>
            <h2 className="mt-4 text-2xl font-semibold text-gray-800 dark:text-gray-100">
              Reset Password
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Enter your email and we’ll send you a link to reset your password.
            </p>
          </div>

          {submitted ? (
            <div className="text-center space-y-4">
              <div className="p-4 bg-success/10 text-success rounded-lg text-sm">
                We've sent a password reset link to <strong>{email}</strong>.
                Please check your inbox.
              </div>
              <Link
                to="/login"
                className="inline-block text-primary-900 hover:underline font-medium dark:text-primary-400"
              >
                Return to login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@example.com"
                    className="pl-9"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Sending..." : "Send Reset Link"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
