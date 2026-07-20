"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogIn, Mail, Lock, ShieldAlert } from "lucide-react";

export default function AdminLoginPage() {
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

      if (data.user.role !== "admin") {
        throw new Error("บัญชีนี้ไม่มีสิทธิ์เข้าถึงระบบแอดมิน");
      }

      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));
      
      // Redirect to admin dashboard
      window.location.href = "/admin";
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="card w-full max-w-md bg-white text-[#333333] shadow-xl border border-error/20">
        <div className="card-body">
          <div className="text-center mb-6">
            <div className="bg-error/10 text-error w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldAlert size={32} />
            </div>
            <h2 className="text-2xl font-bold text-[#333333]">เข้าสู่ระบบ (แอดมิน)</h2>
            <p className="text-[#333333]/60">เข้าสู่บัญชีสำหรับผู้ดูแลระบบเท่านั้น</p>
          </div>

          {error && <div className="alert alert-error text-sm py-2 mb-4">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="input input-bordered flex items-center gap-3 bg-white text-[#333333]">
              <Mail size={18} className="text-[#333333]/50" />
              <input
                type="email"
                required
                placeholder="อีเมลแอดมิน"
                className="grow"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </label>

            <label className="input input-bordered flex items-center gap-3 bg-white text-[#333333]">
              <Lock size={18} className="text-[#333333]/50" />
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
              className="btn btn-error w-full mt-4 text-white"
            >
              {loading ? <span className="loading loading-spinner"></span> : "เข้าสู่ระบบ (Admin)"}
            </button>
          </form>

          <div className="divider">กลับสู่หน้าระบบหลัก</div>

          <Link href="/login" className="btn btn-outline btn-block">
            <LogIn size={18} /> เข้าสู่ระบบผู้ใช้งานทั่วไป
          </Link>
        </div>
      </div>
    </div>
  );
}
