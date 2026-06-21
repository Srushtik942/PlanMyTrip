import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/profile";
  const { login, loading } = useAuth();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      await login(form);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Unable to login. Please check your credentials.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-xl">
        <h1 className="text-3xl font-bold text-orange-400 mb-4">Login</h1>
        <p className="text-sm text-slate-200 mb-6">Sign in to access your travel plans and profile.</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block">
            <span className="text-sm text-slate-300">Username</span>
            <input
              name="username"
              type="text"
              required
              value={form.username}
              onChange={handleChange}
              className="mt-2 w-full rounded-2xl border border-white/20 bg-black/40 p-3 text-white outline-none"
            />
          </label>

          <label className="block">
            <span className="text-sm text-slate-300">Password</span>
            <input
              name="password"
              type="password"
              required
              value={form.password}
              onChange={handleChange}
              className="mt-2 w-full rounded-2xl border border-white/20 bg-black/40 p-3 text-white outline-none"
            />
          </label>

          {error && (
            <div className="rounded-2xl bg-red-500/20 border border-red-400/40 p-3 text-sm text-red-100">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-orange-500 px-4 py-3 text-base font-semibold text-white transition hover:bg-orange-400 disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-sm text-slate-300">
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="text-orange-400 hover:text-orange-300">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
