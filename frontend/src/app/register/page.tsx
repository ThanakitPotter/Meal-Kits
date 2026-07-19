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
      <div className="card w-full max-w-md bg-base-100 shadow-xl border border-base-200">
        <div className="card-body">
          <div className="text-center mb-6">
            <div className="bg-primary text-primary-content w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserPlus size={32} />
            </div>
            <h2 className="text-2xl font-bold">สมัครสมาชิก</h2>
            <p className="text-base-content/60">สร้างบัญชีเพื่อสั่ง Meal Kits สุดพรีเมียม</p>
          </div>

          {mainError && <div className="alert alert-error text-sm py-2 mb-4">{mainError}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className={`input input-bordered flex items-center gap-3 ${errors.name ? 'input-error' : ''}`}>
                <User size={18} className={errors.name ? 'text-error' : 'text-base-content/50'} />
                <input
                  type="text"
                  name="name"
                  placeholder="Username"
                  className="grow"
                  value={form.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </label>
              {errors.name && <p className="text-error text-xs mt-1 ml-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className={`input input-bordered flex items-center gap-3 ${errors.email ? 'input-error' : ''}`}>
                <Mail size={18} className={errors.email ? 'text-error' : 'text-base-content/50'} />
                <input
                  type="email"
                  name="email"
                  placeholder="อีเมล"
                  className="grow"
                  value={form.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </label>
              {errors.email && <p className="text-error text-xs mt-1 ml-1">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className={`input input-bordered flex items-center gap-3 ${errors.phone ? 'input-error' : ''}`}>
                <Phone size={18} className={errors.phone ? 'text-error' : 'text-base-content/50'} />
                <input
                  type="tel"
                  name="phone"
                  placeholder="เบอร์โทรศัพท์"
                  className="grow"
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
              <label className={`input input-bordered flex items-center gap-3 ${errors.password ? 'input-error' : ''}`}>
                <Lock size={18} className={errors.password ? 'text-error' : 'text-base-content/50'} />
                <input
                  type="password"
                  name="password"
                  placeholder="รหัสผ่าน"
                  className="grow"
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
                    <span className="text-base-content/70">ความปลอดภัยรหัสผ่าน:</span>
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
              <label className={`input input-bordered flex items-center gap-3 ${errors.confirmPassword ? 'input-error' : ''}`}>
                <Lock size={18} className={errors.confirmPassword ? 'text-error' : 'text-base-content/50'} />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="ยืนยันรหัสผ่าน"
                  className="grow"
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
