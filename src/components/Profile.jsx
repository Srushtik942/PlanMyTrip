import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen p-8 text-white">
      <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-xl">
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-4xl font-bold text-orange-400 mb-2">Your Profile</h1>
            <p className="text-slate-300">Manage your account and view your saved travel preferences.</p>
          </div>

          <div className="rounded-3xl bg-black/40 border border-white/10 p-6">
            <p className="text-sm uppercase tracking-[0.2em] text-orange-300 mb-4">Account details</p>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl bg-white/5 p-4">
                <p className="text-slate-400 text-xs">Name</p>
                <p className="mt-2 text-lg font-semibold">{user?.name || "—"}</p>
              </div>
              <div className="rounded-2xl bg-white/5 p-4">
                <p className="text-slate-400 text-xs">Email</p>
                <p className="mt-2 text-lg font-semibold">{user?.email || "—"}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <button
              onClick={() => {
                logout();
                navigate("/login", { replace: true });
              }}
              className="rounded-2xl bg-red-500 px-5 py-3 font-semibold text-white transition hover:bg-red-400"
            >
              Log out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
