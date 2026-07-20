"use client";

import { useState } from "react";
import Link from "next/link";
import { UserPlus, Mail, Lock, User, Phone } from "lucide-react";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "", phone: "" });
  const [errors, setErrors] = useState({ name: "", email: "", password: "", confirmPassword: "", phone: "" });
  const [touched, setTouched] = useState({ name: false, email: false, password: false, confirmPassword: false, phone: false });
  const [mainError, setMainError] = useState("");
  const [loading, setLoading] = useState(false);

  // Calculate password strength (0-100)
  const getPasswordStrength = (pass: string) => {
    let score = 0;
    if (!pass) return score;
    if (pass.length >= 8) score += 25;
    if (pass.match(/[A-Z]/)) score += 25;
    if (pass.match(/[a-z]/)) score += 25;
    if (pass.match(/[0-9]/)) score += 25;
    if (pass.match(/[^a-zA-Z0-9]/)) score += 25; // Bonus
    return Math.min(100, score);
  };

  const strength = getPasswordStrength(form.password);
  let strengthColor = "bg-base-300";
  let strengthText = "";
  if (form.password) {
    if (strength <= 25) { strengthColor = "bg-error"; strengthText = "อ่อน (Weak)"; }
    else if (strength <= 50) { strengthColor = "bg-warning"; strengthText = "ปานกลาง (Fair)"; }
    else if (strength <= 75) { strengthColor = "bg-info"; strengthText = "ดี (Good)"; }
    else { strengthColor = "bg-success"; strengthText = "แข็งแกร่ง (Strong)"; }
  }

  const validateField = (name: string, value: string) => {
    let error = "";
    if (name === "phone") {
      if (!value) error = "กรุณากรอกเบอร์โทรศัพท์ (จำเป็นต้องระบุ)";
      else if (!/^0\d{9}$/.test(value)) error = "เบอร์โทรศัพท์ต้องมี 10 หลักและขึ้นต้นด้วย 0";
    }
    if (name === "password") {
      if (!value) error = "กรุณากรอกรหัสผ่าน (จำเป็นต้องระบุ)";
      else if (value.length < 8) error = "รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร";
    }
    if (name === "confirmPassword") {
      if (!value) error = "กรุณายืนยันรหัสผ่าน (จำเป็นต้องระบุ)";
      else if (value !== form.password) error = "รหัสผ่านไม่ตรงกัน";
    }
    if (name === "name" && !value) error = "กรุณากรอก Username";
    if (name === "email" && !value) error = "กรุณากรอกอีเมล";

    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));

    if (touched[name as keyof typeof touched]) {
      validateField(name, value);
    }

    // Re-validate confirm password if password changes
    if (name === "password" && touched.confirmPassword) {
      if (form.confirmPassword && form.confirmPassword !== value) {
        setErrors(prev => ({ ...prev, confirmPassword: "รหัสผ่านไม่ตรงกัน" }));
      } else if (form.confirmPassword === value) {
        setErrors(prev => ({ ...prev, confirmPassword: "" }));
      }
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMainError("");

    // Validate all on submit
    let isValid = true;
    const newErrors = { ...errors };

    if (!form.name) { newErrors.name = "กรุณากรอก Username"; isValid = false; }
    if (!form.email) { newErrors.email = "กรุณากรอกอีเมล"; isValid = false; }
    if (!form.phone) { newErrors.phone = "กรุณากรอกเบอร์โทรศัพท์ (จำเป็นต้องระบุ)"; isValid = false; }
    else if (!/^0\d{9}$/.test(form.phone)) { newErrors.phone = "เบอร์โทรศัพท์ต้องมี 10 หลักและขึ้นต้นด้วย 0"; isValid = false; }

    if (!form.password) { newErrors.password = "กรุณากรอกรหัสผ่าน (จำเป็นต้องระบุ)"; isValid = false; }
    else if (form.password.length < 8) { newErrors.password = "รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร"; isValid = false; }

    if (!form.confirmPassword) { newErrors.confirmPassword = "กรุณายืนยันรหัสผ่าน (จำเป็นต้องระบุ)"; isValid = false; }
    else if (form.password !== form.confirmPassword) { newErrors.confirmPassword = "รหัสผ่านไม่ตรงกัน"; isValid = false; }

    setErrors(newErrors);
    setTouched({ name: true, email: true, phone: true, password: true, confirmPassword: true });

    if (!isValid) return;

    setLoading(true);

    try {
      const res = await fetch("/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          password: form.password
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "เกิดข้อผิดพลาด");

      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));

      window.location.href = "/";
    } catch (err: any) {
      setMainError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-10">
      <div className="card w-full max-w-md bg-white text-[#333333] shadow-xl border border-gray-100">
        <div className="card-body">
          <div className="text-center mb-6">
            <div className="bg-primary text-primary-content w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserPlus size={32} />
            </div>
            <h2 className="text-2xl font-bold text-[#333333]">สมัครสมาชิก</h2>
            <p className="text-[#333333]/60">สร้างบัญชีเพื่อสั่ง Meal Kits สุดพรีเมียม</p>
          </div>

          {mainError && <div className="alert alert-error text-sm py-2 mb-4">{mainError}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className={`input input-bordered w-full flex items-center gap-3 bg-white text-[#333333] ${errors.name ? 'input-error' : ''}`}>
                <User size={18} className={errors.name ? 'text-error' : 'text-[#333333]/50'} />
                <input
                  type="text"
                  name="name"
                  placeholder="Username"
                  className="grow text-[#333333] placeholder-gray-400 bg-transparent"
                  value={form.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </label>
              {errors.name && <p className="text-error text-xs mt-1 ml-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className={`input input-bordered w-full flex items-center gap-3 bg-white text-[#333333] ${errors.email ? 'input-error' : ''}`}>
                <Mail size={18} className={errors.email ? 'text-error' : 'text-[#333333]/50'} />
                <input
                  type="email"
                  name="email"
                  placeholder="อีเมล"
                  className="grow text-[#333333] placeholder-gray-400 bg-transparent"
                  value={form.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </label>
              {errors.email && <p className="text-error text-xs mt-1 ml-1">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className={`input input-bordered w-full flex items-center gap-3 bg-white text-[#333333] ${errors.phone ? 'input-error' : ''}`}>
                <Phone size={18} className={errors.phone ? 'text-error' : 'text-[#333333]/50'} />
                <input
                  type="tel"
                  name="phone"
                  placeholder="เบอร์โทรศัพท์"
                  className="grow text-[#333333] placeholder-gray-400 bg-transparent"
                  value={form.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  maxLength={10}
                />
              </label>
              {errors.phone && <p className="text-error text-xs mt-1 ml-1 font-semibold">{errors.phone}</p>}
            </div>

            {/* Password */}
            <div>
              <label className={`input input-bordered w-full flex items-center gap-3 bg-white text-[#333333] ${errors.password ? 'input-error' : ''}`}>
                <Lock size={18} className={errors.password ? 'text-error' : 'text-[#333333]/50'} />
                <input
                  type="password"
                  name="password"
                  placeholder="รหัสผ่าน"
                  className="grow text-[#333333] placeholder-gray-400 bg-transparent"
                  value={form.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </label>
              {errors.password && <p className="text-error text-xs mt-1 ml-1 font-semibold">{errors.password}</p>}

              {/* Password Strength Indicator */}
              {form.password && (
                <div className="mt-2">
                  <div className="flex justify-between items-center mb-1 text-xs">
                    <span className="text-[#333333]/70">ความปลอดภัยรหัสผ่าน:</span>
                    <span className={`font-semibold ${strengthColor.replace('bg-', 'text-')}`}>{strengthText}</span>
                  </div>
                  <div className="w-full bg-base-300 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full transition-all duration-300 ${strengthColor}`}
                      style={{ width: `${strength}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className={`input input-bordered w-full flex items-center gap-3 bg-white text-[#333333] ${errors.confirmPassword ? 'input-error' : ''}`}>
                <Lock size={18} className={errors.confirmPassword ? 'text-error' : 'text-[#333333]/50'} />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="ยืนยันรหัสผ่าน"
                  className="grow text-[#333333] placeholder-gray-400 bg-transparent"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </label>
              {errors.confirmPassword && <p className="text-error text-xs mt-1 ml-1 font-semibold">{errors.confirmPassword}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full mt-6"
            >
              {loading ? <span className="loading loading-spinner"></span> : "สมัครสมาชิก"}
            </button>
          </form>

          <div className="divider">หรือ</div>

          <a href="/api/users/google" className="btn bg-white border border-gray-300 text-[#333333] hover:bg-gray-50 w-full mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5 mr-2">
              <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
              <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
              <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
              <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
            </svg>
            ลงทะเบียนด้วย Google
          </a>

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
