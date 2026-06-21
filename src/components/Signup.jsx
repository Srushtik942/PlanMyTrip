import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function Signup() {
  const navigate = useNavigate();
  const { signup, loading } = useAuth();
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
      await signup(form);
      navigate("/login", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Unable to create account. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-xl">
        <h1 className="text-3xl font-bold text-orange-400 mb-4">Create Account</h1>
        <p className="text-sm text-slate-200 mb-6">Sign up to save your trips and personalize your itinerary experience.</p>

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
            {loading ? "Creating account..." : "Sign up"}
          </button>
        </form>

        <p className="mt-6 text-sm text-slate-300">
          Already have an account?{' '}
          <Link to="/login" className="text-orange-400 hover:text-orange-300">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
