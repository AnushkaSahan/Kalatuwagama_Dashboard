import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import TempleMark from "../../components/common/TempleMark";
import toast from "react-hot-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    const success = await login(email, password);
    setLoading(false);

    if (success) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-5 bg-white">
      {/* Left panel — temple visual */}
      <div className="relative hidden lg:col-span-2 lg:flex flex-col justify-between overflow-hidden bg-gradient-to-b from-primary-950 via-primary-900 to-primary-950 px-12 py-14">
        {/* ambient glow */}
        <div className="pointer-events-none absolute -top-24 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-accent-500/20 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:radial-gradient(circle_at_1px_1px,#fff_1px,transparent_0)] [background-size:22px_22px]" />

        {/* wordmark */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-accent-500/40 bg-white/5 text-accent-400">
            <TempleMark className="w-6 h-6" />
          </div>
          <span className="font-display text-lg tracking-wide text-primary-50">
            Kalatuwagama
          </span>
        </div>

        {/* dagoba illustration */}
        <div className="relative z-10 flex flex-1 items-center justify-center py-8">
          <svg
            viewBox="0 0 360 420"
            className="h-auto w-full max-w-[300px]"
            fill="none"
          >
            <defs>
              <radialGradient id="haloGlow" cx="50%" cy="38%" r="55%">
                <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="goldLine" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F5EDC9" />
                <stop offset="100%" stopColor="#D4AF37" />
              </linearGradient>
            </defs>

            <circle cx="180" cy="150" r="130" fill="url(#haloGlow)" />

            {/* spire */}
            <circle cx="180" cy="26" r="5" fill="url(#goldLine)" />
            <line
              x1="180"
              y1="31"
              x2="180"
              y2="58"
              stroke="url(#goldLine)"
              strokeWidth="2"
            />
            <path d="M172 58 L188 58 L184 78 L176 78 Z" fill="url(#goldLine)" />
            <path
              d="M166 78 L194 78 L188 100 L172 100 Z"
              fill="url(#goldLine)"
            />
            <path
              d="M160 100 L200 100 L192 124 L168 124 Z"
              fill="url(#goldLine)"
            />

            {/* harmica */}
            <rect
              x="158"
              y="124"
              width="44"
              height="26"
              rx="3"
              stroke="url(#goldLine)"
              strokeWidth="2"
              fill="#4a1311"
            />
            <rect
              x="166"
              y="130"
              width="28"
              height="14"
              rx="1.5"
              stroke="#D4AF37"
              strokeWidth="1.2"
            />

            {/* bell dome */}
            <path
              d="M96 244C96 179 132 150 180 150C228 150 264 179 264 244Z"
              stroke="url(#goldLine)"
              strokeWidth="2.5"
              fill="#5a1815"
            />
            <path
              d="M116 238C118 189 144 166 180 166C216 166 242 189 244 238"
              stroke="#D4AF37"
              strokeWidth="1"
              strokeOpacity="0.5"
            />

            {/* base tiers */}
            <rect
              x="78"
              y="244"
              width="204"
              height="20"
              rx="2"
              fill="#4a1311"
              stroke="url(#goldLine)"
              strokeWidth="2"
            />
            <rect
              x="60"
              y="264"
              width="240"
              height="20"
              rx="2"
              fill="#4a1311"
              stroke="url(#goldLine)"
              strokeWidth="2"
            />
            <rect
              x="40"
              y="284"
              width="280"
              height="22"
              rx="2"
              fill="#3a0f0d"
              stroke="url(#goldLine)"
              strokeWidth="2"
            />

            {/* moonstone / sandakada pahana arc */}
            <g transform="translate(180,306)">
              <path
                d="M-150 0 A150 90 0 0 1 150 0"
                stroke="#D4AF37"
                strokeWidth="2"
                strokeOpacity="0.9"
                fill="none"
              />
              <path
                d="M-124 0 A124 76 0 0 1 124 0"
                stroke="#D4AF37"
                strokeWidth="1.4"
                strokeOpacity="0.65"
                fill="none"
              />
              <path
                d="M-96 0 A96 60 0 0 1 96 0"
                stroke="#D4AF37"
                strokeWidth="1.4"
                strokeOpacity="0.5"
                fill="none"
              />
              <path
                d="M-64 0 A64 42 0 0 1 64 0"
                stroke="#D4AF37"
                strokeWidth="1.4"
                strokeOpacity="0.4"
                fill="none"
              />
              {Array.from({ length: 11 }).map((_, i) => {
                const t = -1 + (i * 2) / 10;
                const x = t * 150;
                const y = -Math.sqrt(Math.max(0, 1 - t * t)) * 4;
                return (
                  <circle
                    key={i}
                    cx={x}
                    cy={y - 2}
                    r="2"
                    fill="#D4AF37"
                    fillOpacity="0.8"
                  />
                );
              })}
            </g>
          </svg>
        </div>

        {/* caption */}
        <div className="relative z-10 border-t border-white/10 pt-6">
          <p className="font-display text-2xl leading-snug text-primary-50">
            Kalatuwagama
            <br />
            Temple Administration
          </p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-primary-200/80">
            One portal for temple affairs, Daham Pasala records, community
            outreach and the foundation's ongoing work.
          </p>
        </div>
      </div>

      {/* Right panel — credentials */}
      <div className="flex items-center justify-center px-6 py-12 lg:col-span-3">
        <div className="w-full max-w-sm">
          <div className="mb-9 lg:hidden flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-900 text-white">
              <TempleMark className="w-6 h-6" />
            </div>
            <span className="font-display text-lg tracking-wide text-primary-900">
              Kalatuwagama
            </span>
          </div>

          <div className="mb-8">
            <h1 className="font-display text-3xl font-semibold text-gray-900">
              Welcome back
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Sign in with your admin credentials to continue.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
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

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-9 pr-9"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex="-1"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-primary-900 focus:ring-primary-900"
                />
                <span className="text-gray-600">Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-primary-900 hover:underline font-medium"
              >
                Forgot password?
              </Link>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <p className="mt-10 text-center text-xs text-gray-400">
            Restricted access · Temple staff and administrators only
          </p>
        </div>
      </div>
    </div>
  );
}
