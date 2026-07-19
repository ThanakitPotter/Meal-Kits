"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserPlus, Mail, Lock, User, Phone } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    const phoneRegex = /^0\d{9}$/;
    if (!phoneRegex.test(form.phone)) {
      setError("กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง (10 หลัก เริ่มต้นด้วย 0)");
      return;
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(form.password)) {
      setError("รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร และประกอบด้วยตัวอักษรและตัวเลข");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:3001/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "เกิดข้อผิดพลาด");

      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));
      
      window.location.href = "/";
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-10">
      <div className="card w-full max-w-md bg-base-100 shadow-xl border border-base-200">
        <div className="card-body">
          <div className="text-center mb-6">
            <div className="bg-primary text-primary-content w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserPlus size={32} />
            </div>
            <h2 className="text-2xl font-bold">สมัครสมาชิก</h2>
            <p className="text-base-content/60">สร้างบัญชีเพื่อสั่ง Meal Kits สุดพรีเมียม</p>
          </div>

          {error && <div className="alert alert-error text-sm py-2 mb-4">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="input input-bordered flex items-center gap-3">
              <User size={18} className="text-base-content/50" />
              <input
                type="text"
                required
                placeholder="ชื่อ-นามสกุล"
                className="grow"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </label>

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
              <Phone size={18} className="text-base-content/50" />
              <input
                type="tel"
                required
                placeholder="เบอร์โทรศัพท์"
                className="grow"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
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
              {loading ? <span className="loading loading-spinner"></span> : "สมัครสมาชิก"}
            </button>
          </form>

          <div className="divider">หรือ</div>

          <p className="text-center text-sm">
            มีบัญชีอยู่แล้ว?{" "}
            <Link href="/login" className="link link-primary font-bold">
              เข้าสู่ระบบ
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
