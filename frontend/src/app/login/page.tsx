"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogIn, Mail, Lock } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "เกิดข้อผิดพลาด");

      if (data.user.role === "admin") {
        throw new Error("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
      }

      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));
      
      // Force reload to update Navbar state
      window.location.href = "/";
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="card w-full max-w-md bg-base-100 shadow-xl border border-base-200">
        <div className="card-body">
          <div className="text-center mb-6">
            <div className="bg-primary text-primary-content w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <LogIn size={32} />
            </div>
            <h2 className="text-2xl font-bold">เข้าสู่ระบบ</h2>
            <p className="text-base-content/60">เข้าสู่บัญชี Meal Kits ของคุณ</p>
          </div>

          {error && <div className="alert alert-error text-sm py-2 mb-4">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="input input-bordered flex items-center gap-3">
              <Mail size={18} className="text-base-content/50" />
              <input
                type="email"
                required
                placeholder="อีเมล"
                className="grow"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </label>

            <label className="input input-bordered flex items-center gap-3">
              <Lock size={18} className="text-base-content/50" />
              <input
                type="password"
                required
                placeholder="รหัสผ่าน"
                className="grow"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full mt-4"
            >
              {loading ? <span className="loading loading-spinner"></span> : "เข้าสู่ระบบ"}
            </button>
          </form>

          <div className="divider">หรือ</div>

          <p className="text-center text-sm">
            ยังไม่มีบัญชีใช่ไหม?{" "}
            <Link href="/register" className="link link-primary font-bold">
              สมัครสมาชิกเลย
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
