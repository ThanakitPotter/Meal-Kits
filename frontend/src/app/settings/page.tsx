"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, Settings as SettingsIcon, Image as ImageIcon, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [form, setForm] = useState({ name: "", avatarUrl: "" });
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/login");
      return;
    }
    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);
    setForm({
      name: parsedUser.name || "",
      avatarUrl: parsedUser.avatarUrl || "",
    });
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");

    try {
      const res = await fetch(`http://localhost:3001/api/users/${user.id}/profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("อัปเดตโปรไฟล์ไม่สำเร็จ");

      const data = await res.json();
      
      // Update local storage
      localStorage.setItem("user", JSON.stringify(data.user));
      if (data.access_token) {
        localStorage.setItem("token", data.access_token);
      }
      
      setUser(data.user);
      setSuccessMsg("อัปเดตโปรไฟล์เรียบร้อยแล้ว!");
      
      // Trigger a reload to update navbar
      setTimeout(() => {
        window.location.reload();
      }, 1500);

    } catch (error) {
      console.error(error);
      alert("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div className="min-h-screen flex items-center justify-center"><span className="loading loading-spinner text-[#E0A800]"></span></div>;

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-3xl min-h-[70vh]">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/orders" className="btn btn-ghost btn-sm text-[#333333]">
          <ArrowLeft size={18} /> กลับ
        </Link>
        <h1 className="text-3xl font-extrabold flex items-center gap-3 text-[#333333]">
          <SettingsIcon className="text-[#E0A800]" size={32} /> ตั้งค่าโปรไฟล์
        </h1>
      </div>

      <div className="card bg-white shadow-xl border border-gray-100 p-6 md:p-8 animate-fade-in-up">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="flex flex-col md:flex-row gap-8 items-start">
            
            {/* Avatar Preview */}
            <div className="flex flex-col items-center gap-3 w-full md:w-1/3">
              <div className="avatar">
                <div className="w-32 h-32 rounded-full ring-4 ring-[#E0A800]/20 ring-offset-base-100 ring-offset-2 overflow-hidden bg-gray-100 flex items-center justify-center">
                  {form.avatarUrl ? (
                    <img src={form.avatarUrl} alt="Preview" className="object-cover w-full h-full" onError={(e) => { e.currentTarget.src = ""; e.currentTarget.className = "hidden"; }} />
                  ) : (
                    <User size={48} className="text-gray-400" />
                  )}
                </div>
              </div>
              <p className="text-sm font-semibold text-[#333333]/50">รูปโปรไฟล์ของคุณ</p>
            </div>

            {/* Form Fields */}
            <div className="w-full md:w-2/3 space-y-4">
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-bold text-[#333333]">ชื่อ - นามสกุล</span>
                </label>
                <label className="input input-bordered flex items-center gap-3 bg-white text-[#333333] focus-within:border-[#E0A800]">
                  <User size={18} className="text-gray-400" />
                  <input 
                    type="text" 
                    className="grow bg-transparent focus:outline-none" 
                    placeholder="ชื่อของคุณ"
                    value={form.name}
                    onChange={(e) => setForm({...form, name: e.target.value})}
                    required
                  />
                </label>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-bold text-[#333333]">อัปโหลดรูปโปรไฟล์</span>
                </label>
                <input 
                  type="file" 
                  accept="image/*"
                  className="file-input file-input-bordered w-full bg-white text-[#333333] focus-within:border-[#E0A800]"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      // Check file size (limit to 2MB)
                      if (file.size > 2 * 1024 * 1024) {
                        alert("ขนาดไฟล์ใหญ่เกินไป กรุณาเลือกไฟล์ที่มีขนาดไม่เกิน 2MB");
                        e.target.value = '';
                        return;
                      }
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setForm({...form, avatarUrl: reader.result as string});
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                <label className="label">
                  <span className="label-text-alt text-gray-500">เลือกรูปภาพจากในเครื่องของคุณ (ขนาดไม่เกิน 2MB)</span>
                </label>
              </div>

            </div>
          </div>

          <div className="divider"></div>

          {successMsg && (
            <div className="alert alert-success bg-green-50 text-green-700 border border-green-200">
              <span>{successMsg}</span>
            </div>
          )}

          <div className="flex justify-end">
            <button 
              type="submit" 
              disabled={loading}
              className="btn bg-[#E0A800] hover:bg-[#c98e10] text-white border-none px-8 shadow-md"
            >
              {loading ? <span className="loading loading-spinner"></span> : <><Save size={18} /> บันทึกการเปลี่ยนแปลง</>}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
