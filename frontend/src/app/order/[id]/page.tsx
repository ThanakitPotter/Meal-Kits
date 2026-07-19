"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Menu, Order } from "@/types";

const categoryConfig: Record<string, { badge: string }> = {
  ผัด: { badge: "bg-mustard-100 text-mustard-700" },
  "ต้ม-แกง": { badge: "bg-red-100 text-red-700" },
  "ทอด-ย่าง": { badge: "bg-orange-100 text-orange-700" },
};

export default function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const [menu, setMenu] = useState<Menu | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<Order | null>(null);
  
  const [form, setForm] = useState({
    customerName: "",
    customerPhone: "",
    shippingAddress: "",
    servings: 1 as 1 | 2,
  });

  useEffect(() => {
    fetch(`/api/menus/${unwrappedParams.id}`)
      .then((res) => res.json())
      .then((data) => {
        setMenu(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [unwrappedParams.id]);

  const updateField = (field: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const isFormValid =
    form.customerName.trim() &&
    form.customerPhone.trim() &&
    form.shippingAddress.trim();

  const totalPrice = menu 
    ? (form.servings === 2 ? Math.round(menu.price * 1.8) : menu.price) 
    : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ menuId: unwrappedParams.id, ...form }),
      });
      const order = await res.json();
      setSuccess(order);
    } catch {
      alert("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-10">
          <div className="bg-white rounded-2xl h-[600px] animate-pulse shadow-md" />
          <div className="bg-white rounded-2xl h-[600px] animate-pulse shadow-md" />
        </div>
      </div>
    );
  }

  if (!menu) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-20 text-center">
        <p className="text-6xl mb-4">😕</p>
        <h1 className="text-2xl font-bold mb-2 text-charcoal-900">ไม่พบเมนู</h1>
        <p className="text-gray-500 mb-6">เมนูที่คุณกำลังค้นหาไม่มีอยู่ในระบบ</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-charcoal-900 text-white font-semibold px-6 py-3 rounded-xl hover:bg-mustard-400 hover:text-charcoal-900 transition-colors"
        >
          ← กลับหน้าแรก
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-20">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-fade-in-up">
          <div className="bg-gradient-to-r from-mustard-400 to-mustard-500 p-8 text-center text-white">
            <p className="text-6xl mb-3">🎉</p>
            <h1 className="text-3xl font-extrabold text-charcoal-900">สั่งซื้อสำเร็จ!</h1>
          </div>
          <div className="p-8">
            <div className="bg-mustard-50 border border-mustard-200 rounded-xl p-5 mb-6">
              <p className="text-mustard-800 font-semibold mb-1">
                หมายเลขคำสั่งซื้อ: #{success.id}
              </p>
              <p className="text-mustard-600 text-sm">
                ระบบได้รับคำสั่งซื้อของคุณแล้ว เราจะเริ่มเตรียมวัตถุดิบและจัดส่งให้คุณโดยเร็วที่สุด
              </p>
            </div>

            <div className="space-y-3 text-sm mb-8">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">เมนูอาหาร</span>
                <span className="font-semibold text-charcoal-900">{success.menuName}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">จำนวนที่ทาน</span>
                <span className="font-semibold text-charcoal-900">{success.servings} คน</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">ชื่อลูกค้า</span>
                <span className="font-semibold text-charcoal-900">{success.customerName}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">สถานะ</span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-yellow-100 text-yellow-700 text-xs font-semibold">
                  <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full" />
                  {success.status}
                </span>
              </div>
              <div className="flex justify-between py-3">
                <span className="text-gray-500 font-medium">ราคารวม</span>
                <span className="text-2xl font-extrabold text-mustard-600">
                  ฿{success.totalPrice.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <Link
                href="/"
                className="flex-1 text-center border-2 border-gray-200 text-charcoal-700 font-semibold py-3 rounded-xl hover:bg-gray-50 transition-colors"
              >
                กลับหน้าแรก
              </Link>
              <Link
                href="/admin"
                className="flex-1 text-center bg-charcoal-900 text-white font-semibold py-3 rounded-xl hover:bg-mustard-400 hover:text-charcoal-900 transition-all"
              >
                ดูสถานะออเดอร์
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      {/* ─── Stepper UI ─── */}
      <div className="mb-10">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 -z-10"></div>
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[100%] h-1 bg-mustard-400 -z-10"></div>
          
          <div className="flex flex-col items-center gap-2 bg-white px-2">
            <div className="w-10 h-10 rounded-full bg-mustard-400 text-charcoal-900 font-bold flex items-center justify-center shadow-md">1</div>
            <span className="text-sm font-semibold text-charcoal-900">เลือกแพ็กเกจ</span>
          </div>
          <div className="flex flex-col items-center gap-2 bg-white px-2">
            <div className="w-10 h-10 rounded-full bg-mustard-400 text-charcoal-900 font-bold flex items-center justify-center shadow-md">2</div>
            <span className="text-sm font-semibold text-charcoal-900">ยืนยันเมนู</span>
          </div>
          <div className="flex flex-col items-center gap-2 bg-white px-2">
            <div className="w-10 h-10 rounded-full bg-mustard-400 text-charcoal-900 font-bold flex items-center justify-center shadow-md">3</div>
            <span className="text-sm font-semibold text-charcoal-900">จัดส่งและชำระเงิน</span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-10">
        {/* Left: Menu Info */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden sticky top-24">
            <div className="relative h-64 w-full">
              <Image
                src={menu.image}
                alt={menu.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-extrabold text-charcoal-900 mb-2">{menu.name}</h2>
              <div className="flex items-center gap-4 mb-4 text-sm font-medium text-gray-500">
                <span className="flex items-center gap-1.5">⏱️ {menu.prepTime}</span>
              </div>
              <p className="text-gray-500 text-sm mb-6 leading-relaxed pb-6 border-b border-gray-100">
                {menu.description}
              </p>
              
              <h3 className="text-sm font-bold text-charcoal-900 mb-3 uppercase tracking-wide flex items-center gap-2">
                🥬 สิ่งที่จะได้รับในชุด
              </h3>
              <ul className="space-y-2.5">
                {menu.ingredients.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 text-sm text-gray-600"
                  >
                    <span className="w-5 h-5 bg-mustard-100 text-mustard-600 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                      ✓
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right: Order Form */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8">
            <h2 className="text-2xl font-extrabold mb-1 text-charcoal-900">รายละเอียดการสั่งซื้อ</h2>
            <p className="text-gray-400 text-sm mb-8">
              เลือกจำนวนที่ต้องการทาน และกรอกข้อมูลจัดส่งให้ครบถ้วน
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Servings */}
              <div>
                <label className="block text-sm font-semibold text-charcoal-700 mb-2">
                  สำหรับกี่ท่าน? <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => updateField("servings", 1)}
                    className={`p-4 rounded-xl border-2 text-center transition-all ${
                      form.servings === 1 
                        ? 'border-mustard-400 bg-mustard-50' 
                        : 'border-gray-100 bg-white hover:border-mustard-200 text-gray-500'
                    }`}
                  >
                    <span className="block text-xl font-bold mb-1">1 ท่าน</span>
                    <span className="text-sm">฿{menu.price}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => updateField("servings", 2)}
                    className={`p-4 rounded-xl border-2 text-center transition-all ${
                      form.servings === 2 
                        ? 'border-mustard-400 bg-mustard-50' 
                        : 'border-gray-100 bg-white hover:border-mustard-200 text-gray-500'
                    }`}
                  >
                    <div className="flex justify-center items-center gap-2 mb-1">
                      <span className="block text-xl font-bold">2 ท่าน</span>
                      <span className="bg-mustard-400 text-charcoal-900 text-[10px] font-bold px-2 py-0.5 rounded-full">คุ้มกว่า</span>
                    </div>
                    <span className="text-sm">฿{Math.round(menu.price * 1.8)}</span>
                  </button>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-6 space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-charcoal-700 mb-1.5">
                    ชื่อผู้รับ <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.customerName}
                    onChange={(e) => updateField("customerName", e.target.value)}
                    placeholder="ชื่อ-นามสกุล"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-mustard-400 focus:ring-2 focus:ring-mustard-100 outline-none transition-all text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-charcoal-700 mb-1.5">
                    เบอร์โทรศัพท์ <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={form.customerPhone}
                    onChange={(e) => updateField("customerPhone", e.target.value)}
                    placeholder="0xx-xxx-xxxx"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-mustard-400 focus:ring-2 focus:ring-mustard-100 outline-none transition-all text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-charcoal-700 mb-1.5">
                    ที่อยู่จัดส่ง <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={form.shippingAddress}
                    onChange={(e) => updateField("shippingAddress", e.target.value)}
                    placeholder="บ้านเลขที่ ซอย ถนน แขวง/ตำบล เขต/อำเภอ จังหวัด รหัสไปรษณีย์"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-mustard-400 focus:ring-2 focus:ring-mustard-100 outline-none transition-all text-sm resize-none"
                  />
                </div>
              </div>

              <div className="border-t border-gray-100 pt-6 mt-6">
                <h3 className="text-lg font-bold text-charcoal-900 mb-4">ช่องทางการชำระเงิน</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl cursor-pointer hover:border-mustard-400 transition-all">
                    <input type="radio" name="payment" defaultChecked className="w-5 h-5 text-mustard-500" />
                    <span className="font-medium text-charcoal-900">โอนเงินผ่านธนาคาร (PromptPay)</span>
                  </label>
                  <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl cursor-pointer hover:border-mustard-400 transition-all">
                    <input type="radio" name="payment" className="w-5 h-5 text-mustard-500" />
                    <span className="font-medium text-charcoal-900">บัตรเครดิต / เดบิต</span>
                  </label>
                </div>
              </div>

              {/* Order Summary Data Table */}
              <div className="mt-8">
                <h3 className="text-lg font-bold text-charcoal-900 mb-4">สรุปคำสั่งซื้อ</h3>
                <div className="overflow-hidden rounded-lg">
                  <table className="w-full text-left text-sm border-2 border-[#c594a1]">
                    <thead className="bg-gray-50 border-b-2 border-[#c594a1]">
                      <tr>
                        <th className="px-4 py-3 font-semibold text-charcoal-900 border-r-2 border-[#c594a1]">รายการ</th>
                        <th className="px-4 py-3 font-semibold text-charcoal-900 border-r-2 border-[#c594a1] w-24 text-center">จำนวน</th>
                        <th className="px-4 py-3 font-semibold text-charcoal-900 w-32 text-right">ราคา</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y-2 divide-[#c594a1]">
                      <tr>
                        <td className="px-4 py-4 border-r-2 border-[#c594a1]">
                          <span className="font-medium text-charcoal-900">{menu.name}</span>
                          <span className="block text-xs text-gray-500 mt-1">สำหรับ {form.servings} ท่าน</span>
                        </td>
                        <td className="px-4 py-4 border-r-2 border-[#c594a1] text-center">1</td>
                        <td className="px-4 py-4 text-right">฿{totalPrice.toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td colSpan={2} className="px-4 py-3 font-bold text-charcoal-900 border-r-2 border-[#c594a1] text-right">
                          ยอดรวมทั้งสิ้น
                        </td>
                        <td className="px-4 py-3 font-extrabold text-mustard-600 text-lg text-right">
                          ฿{totalPrice.toLocaleString()}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting || !isFormValid}
                className="w-full bg-charcoal-900 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl hover:bg-charcoal-800 hover:text-mustard-400 active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-lg flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <span className="inline-flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    กำลังยืนยัน...
                  </span>
                ) : (
                  <>ยืนยันการสั่งซื้อ 🛒</>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
