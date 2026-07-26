"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  KeyRound,
} from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="relative min-h-[85vh] flex items-center justify-center px-4 py-12 overflow-hidden bg-gradient-to-b from-gray-50/50 via-white to-gray-50/80">
      {/* Minimalist Ambient Background Decoration */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-mustard-300/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-charcoal-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10 animate-fade-in-up">
        {/* Main Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-[28px] border border-gray-100 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.07)] p-8 sm:p-10 relative overflow-hidden transition-all duration-300">
          {/* Top Subtle Gradient Line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#2d2d2d] via-mustard-500 to-[#2d2d2d]" />

          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-charcoal-50 border border-charcoal-200/50 text-charcoal-800 text-xs font-semibold tracking-wider uppercase mb-5">
              <ShieldCheck size={13} className="text-mustard-600" />
              <span>Admin Portal</span>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#2d2d2d] to-[#1a1a1a] text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-charcoal-900/10 border border-charcoal-700/50">
              <KeyRound size={24} className="text-mustard-400" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#2d2d2d]">
              เข้าสู่ระบบผู้ดูแล
            </h1>
            <p className="text-sm text-gray-500 mt-1.5 font-normal">
              พื้นที่เฉพาะสำหรับผู้บริหารและผู้ดูแลระบบ Meal Kits
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-start gap-3 p-4 mb-6 bg-red-50/90 border border-red-200/70 rounded-2xl text-red-600 text-sm animate-fade-in-up">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-500" />
              <div>
                <p className="font-semibold text-red-700">เข้าสู่ระบบไม่สำเร็จ</p>
                <p className="text-xs text-red-600 mt-0.5">{error}</p>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">
                อีเมลผู้ดูแลระบบ
              </label>
              <div className="group focus-within:border-charcoal-800 focus-within:ring-4 focus-within:ring-charcoal-900/5 focus-within:bg-white border border-gray-200/80 bg-gray-50/60 hover:bg-white transition-all duration-200 rounded-2xl flex items-center px-4 py-3.5">
                <Mail
                  size={18}
                  className="text-gray-400 group-focus-within:text-[#2d2d2d] transition-colors shrink-0 mr-3.5"
                />
                <input
                  type="email"
                  required
                  placeholder="admin@mealkits.com"
                  className="bg-transparent w-full text-[#2d2d2d] placeholder:text-gray-400 text-sm focus:outline-none"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">
                รหัสผ่าน
              </label>
              <div className="group focus-within:border-charcoal-800 focus-within:ring-4 focus-within:ring-charcoal-900/5 focus-within:bg-white border border-gray-200/80 bg-gray-50/60 hover:bg-white transition-all duration-200 rounded-2xl flex items-center px-4 py-3.5">
                <Lock
                  size={18}
                  className="text-gray-400 group-focus-within:text-[#2d2d2d] transition-colors shrink-0 mr-3.5"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••••••"
                  className="bg-transparent w-full text-[#2d2d2d] placeholder:text-gray-400 text-sm focus:outline-none"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-gray-600 focus:outline-none ml-2 p-1 transition-colors"
                  title={showPassword ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-2xl bg-[#2d2d2d] hover:bg-[#1a1a1a] active:scale-[0.99] text-white font-medium text-sm flex items-center justify-center gap-2 shadow-lg shadow-charcoal-900/15 hover:shadow-xl hover:shadow-charcoal-900/20 transition-all duration-200 disabled:opacity-70 group"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <span className="loading loading-spinner loading-sm"></span>
                    <span>กำลังตรวจสอบสิทธิ์...</span>
                  </div>
                ) : (
                  <>
                    <span>เข้าสู่ระบบผู้ดูแล (Admin)</span>
                    <ArrowRight
                      size={18}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="relative my-7">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-gray-400 font-medium tracking-wider">
                หรือ
              </span>
            </div>
          </div>

          {/* Back to regular login */}
          <Link
            href="/login"
            className="w-full py-3 px-4 rounded-2xl border border-gray-200/80 bg-white hover:bg-gray-50/80 text-gray-600 hover:text-[#2d2d2d] text-sm font-medium flex items-center justify-center gap-2.5 transition-all duration-200 group"
          >
            <ArrowLeft
              size={16}
              className="text-gray-400 group-hover:-translate-x-1 transition-transform"
            />
            <span>กลับสู่หน้าเข้าสู่ระบบผู้ใช้ทั่วไป</span>
          </Link>

          {/* Security Footer Notice */}
          <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-center gap-2 text-xs text-gray-400">
            <ShieldCheck size={14} className="text-mustard-600 shrink-0" />
            <span>การเข้าถึงถูกจำกัดและตรวจสอบความปลอดภัยในทุกเซสชัน</span>
          </div>
        </div>
      </div>
    </div>
  );
}
