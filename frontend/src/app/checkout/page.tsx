"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { ArrowLeft, CheckCircle2, Info } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, cartTotal, clearCart } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [successId, setSuccessId] = useState<string | null>(null);

  // Scroll to top when order is successful
  useEffect(() => {
    if (successId) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [successId]);
  const [form, setForm] = useState({
    customerName: "",
    customerPhone: "",
    shippingAddress: "",
    orderType: "one-time",
    deliveryFrequency: "weekly",
  });

  // Pre-fill user data if logged in
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setForm((prev) => ({
        ...prev,
        customerName: user.name || "",
        customerPhone: user.phone || "",
      }));
    }
  }, []);

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const isFormValid =
    form.customerName.trim() &&
    form.customerPhone.trim() &&
    form.shippingAddress.trim() &&
    cartItems.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    setSubmitting(true);
    try {
      const storedUser = localStorage.getItem("user");
      const userId = storedUser ? JSON.parse(storedUser).id : null;

      // Clean up items for the API
      const items = cartItems.map(item => ({
        menuId: item.menuId,
        menuName: item.menuName,
        servings: item.servings,
        price: item.price,
        quantity: item.quantity
      }));

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          userId, 
          customerName: form.customerName,
          customerPhone: form.customerPhone,
          shippingAddress: form.shippingAddress,
          orderType: form.orderType,
          deliveryFrequency: form.orderType === 'subscription' ? form.deliveryFrequency : undefined,
          items,
          totalPrice: cartTotal
        }),
      });
      const order = await res.json();
      setSuccessId(order.id);
      clearCart();
    } catch {
      alert("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    } finally {
      setSubmitting(false);
    }
  };

  if (successId) {
    return (
      <div className="container mx-auto max-w-md md:max-w-xl px-4 py-12 md:py-20 min-h-[60vh] flex items-center justify-center">
        <div className="card w-full bg-white shadow-2xl border border-gray-100 animate-fade-in-up overflow-hidden mb-10 md:mb-0 rounded-3xl">
          
          <div className="bg-gradient-to-br from-green-400 to-emerald-600 p-8 md:p-12 text-center text-white relative">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-5 animate-bounce shadow-lg ring-4 ring-white/30">
                <CheckCircle2 size={48} className="text-white drop-shadow-md" />
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold drop-shadow-sm mb-2">สั่งซื้อสำเร็จ!</h1>
              <p className="text-emerald-50 font-medium text-lg">ขอบคุณที่ไว้วางใจ Meal Kits</p>
            </div>
          </div>

          <div className="card-body p-6 md:p-10 flex flex-col items-center text-center">
            
            <div className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-6 mb-8 shadow-inner relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-green-500"></div>
              <p className="text-gray-500 font-medium mb-1 text-sm uppercase tracking-wider">หมายเลขคำสั่งซื้อ</p>
              <h3 className="font-mono text-2xl font-bold text-gray-800 mb-4">#{successId.slice(0,8).toUpperCase()}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                ระบบได้รับคำสั่งซื้อของคุณแล้ว เราจะเริ่มเตรียมวัตถุดิบที่สดใหม่และจัดส่งให้คุณโดยเร็วที่สุด
              </p>
            </div>

            <div className="flex flex-col sm:flex-row w-full gap-4 mt-2">
              <Link href="/" className="btn btn-lg bg-gray-100 hover:bg-gray-200 text-gray-700 border-none flex-1 rounded-2xl font-bold text-base shadow-sm">
                กลับหน้าแรก
              </Link>
              <Link href="/orders" className="btn btn-lg bg-[#E0A800] hover:bg-[#c98e10] text-white border-none flex-1 rounded-2xl shadow-md hover:shadow-lg font-bold text-base">
                ดูสถานะออเดอร์
              </Link>
            </div>
            
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0 && !successId) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">ตะกร้าของคุณว่างเปล่า</h1>
        <Link href="/" className="btn btn-primary">
          กลับไปเลือกสินค้า
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8 md:py-12">
      <div className="breadcrumbs text-sm mb-6">
        <ul>
          <li><Link href="/">หน้าแรก</Link></li>
          <li><Link href="/cart">ตะกร้าสินค้า</Link></li>
          <li>ชำระเงิน</li>
        </ul>
      </div>

      <h1 className="text-3xl font-extrabold mb-8 text-base-content">ข้อมูลการจัดส่งและชำระเงิน</h1>

      <div className="grid lg:grid-cols-2 gap-10">
        <div>
          <div className="card bg-base-100 shadow-xl border border-base-200 rounded-3xl overflow-hidden">
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6 border-b border-base-200">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <span className="bg-primary text-primary-content w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
                ที่อยู่จัดส่ง
              </h2>
            </div>
            <div className="card-body p-6 md:p-8">
              <form id="checkout-form" onSubmit={handleSubmit} className="space-y-5">
                <div className="form-control">
                  <label className="label"><span className="label-text font-bold text-base-content/80">ประเภทการสั่งซื้อ <span className="text-error">*</span></span></label>
                  <div className="grid grid-cols-2 gap-4 mt-1">
                    <label className={`cursor-pointer flex items-center gap-3 p-4 border rounded-xl transition-all ${form.orderType === 'one-time' ? 'border-primary bg-primary/5' : 'border-base-300 hover:border-primary/50'}`}>
                      <input 
                        type="radio" 
                        name="orderType" 
                        className="radio radio-primary radio-sm" 
                        checked={form.orderType === 'one-time'}
                        onChange={() => updateField("orderType", "one-time")}
                      />
                      <span className="label-text font-medium text-base-content">สั่งครั้งเดียว</span>
                    </label>
                    <label className={`cursor-pointer flex items-center gap-3 p-4 border rounded-xl transition-all ${form.orderType === 'subscription' ? 'border-primary bg-primary/5' : 'border-base-300 hover:border-primary/50'}`}>
                      <input 
                        type="radio" 
                        name="orderType" 
                        className="radio radio-primary radio-sm" 
                        checked={form.orderType === 'subscription'}
                        onChange={() => updateField("orderType", "subscription")}
                      />
                      <span className="label-text font-medium text-base-content">สั่งประจำ</span>
                    </label>
                  </div>
                  
                  {form.orderType === 'subscription' && (
                    <div className="mt-4 p-4 bg-primary/5 rounded-xl border border-primary/20 animate-fade-in-up">
                      <label className="label pt-0"><span className="label-text font-bold text-base-content/80">เลือกรอบการจัดส่ง <span className="text-error">*</span></span></label>
                      <select 
                        className="select select-bordered w-full bg-white text-base-content focus:border-primary focus:outline-none rounded-xl"
                        value={form.deliveryFrequency}
                        onChange={(e) => updateField("deliveryFrequency", e.target.value)}
                      >
                        <option value="weekly">ทุกสัปดาห์ (Weekly)</option>
                        <option value="biweekly">ทุก 2 สัปดาห์ (Bi-weekly)</option>
                        <option value="monthly">ทุกเดือน (Monthly)</option>
                      </select>
                      <p className="text-xs text-base-content/60 mt-3 flex items-start gap-1.5 leading-relaxed">
                        <Info size={14} className="shrink-0 mt-0.5 text-primary" /> ระบบจะทำการจัดส่งวัตถุดิบและเรียกเก็บเงินตามรอบระยะเวลาที่คุณได้เลือกไว้
                      </p>
                    </div>
                  )}
                </div>

                <div className="form-control">
                  <label className="label"><span className="label-text font-bold text-base-content/80">ชื่อผู้รับ <span className="text-error">*</span></span></label>
                  <input
                    type="text"
                    required
                    maxLength={50}
                    value={form.customerName}
                    onChange={(e) => updateField("customerName", e.target.value.slice(0, 50))}
                    placeholder="ชื่อ-นามสกุล"
                    className="input input-bordered w-full bg-base-100 text-base-content focus:border-primary focus:ring-1 focus:ring-primary transition-all rounded-xl"
                  />
                </div>

                <div className="form-control">
                  <label className="label"><span className="label-text font-bold text-base-content/80">เบอร์โทรศัพท์ <span className="text-error">*</span></span></label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={form.customerPhone}
                    onChange={(e) => {
                      const onlyNums = e.target.value.replace(/[^0-9]/g, '');
                      updateField("customerPhone", onlyNums.slice(0, 10));
                    }}
                    placeholder="0xx-xxx-xxxx"
                    className="input input-bordered w-full bg-base-100 text-base-content focus:border-primary focus:ring-1 focus:ring-primary transition-all rounded-xl"
                  />
                </div>

                <div className="form-control">
                  <label className="label"><span className="label-text font-bold text-base-content/80">ที่อยู่จัดส่ง <span className="text-error">*</span></span></label>
                  <textarea
                    required
                    rows={3}
                    maxLength={100}
                    value={form.shippingAddress}
                    onChange={(e) => updateField("shippingAddress", e.target.value.slice(0, 100))}
                    placeholder="บ้านเลขที่ ซอย ถนน แขวง/ตำบล เขต/อำเภอ จังหวัด รหัสไปรษณีย์"
                    className="textarea textarea-bordered w-full resize-none bg-base-100 text-base-content focus:border-primary focus:ring-1 focus:ring-primary transition-all rounded-xl"
                  />
                </div>
                
                <div className="mt-8 pt-6 border-t border-base-200">
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <span className="bg-primary text-primary-content w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
                    ช่องทางการชำระเงิน
                  </h2>
                  <div className="space-y-3">
                    <label className="label cursor-pointer justify-start gap-4 p-4 border border-base-300 rounded-xl hover:border-primary/50 transition-all bg-base-100">
                      <input type="radio" name="payment" className="radio radio-primary radio-sm" defaultChecked />
                      <span className="label-text font-medium text-base-content">โอนเงินผ่านธนาคาร (PromptPay)</span>
                    </label>
                    <label className="label cursor-pointer justify-start gap-4 p-4 border border-base-300 rounded-xl hover:border-primary/50 transition-all bg-base-100">
                      <input type="radio" name="payment" className="radio radio-primary radio-sm" />
                      <span className="label-text font-medium text-base-content">บัตรเครดิต / เดบิต</span>
                    </label>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div>
          <div className="card bg-base-100 shadow-xl border border-base-200 rounded-3xl sticky top-24 overflow-hidden">
            <div className="bg-gradient-to-r from-base-200 to-base-100 p-6 border-b border-base-200">
              <h2 className="text-xl font-bold flex items-center gap-2 text-base-content">
                <span className="bg-base-300 text-base-content w-8 h-8 rounded-full flex items-center justify-center text-sm">3</span>
                สรุปคำสั่งซื้อ
              </h2>
            </div>
            <div className="card-body p-6 md:p-8">
              
              <div className="overflow-x-auto mb-6">
                <table className="table w-full">
                  <thead className="text-base-content/60">
                    <tr>
                      <th className="font-semibold px-0">รายการ</th>
                      <th className="font-semibold w-16 text-center px-0">จำนวน</th>
                      <th className="font-semibold w-24 text-right px-0">ราคา</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-base-200">
                    {cartItems.map(item => (
                      <tr key={item.id} className="border-none">
                        <td className="px-0 py-4">
                          <span className="font-bold text-base-content block line-clamp-1">{item.menuName}</span>
                          <span className="block text-xs text-base-content/60 mt-1">{item.servings} คน</span>
                        </td>
                        <td className="text-center font-medium text-base-content px-0 py-4">{item.quantity}</td>
                        <td className="text-right font-medium text-base-content px-0 py-4">฿{(item.price * item.quantity).toLocaleString()}</td>
                      </tr>
                    ))}
                    <tr className="border-t border-base-300">
                      <td colSpan={2} className="font-bold text-right text-base-content/80 pt-6 px-0">
                        ยอดรวมทั้งสิ้น
                      </td>
                      <td className="font-extrabold text-primary text-xl text-right pt-6 px-0">
                        ฿{cartTotal.toLocaleString()}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <button
                type="submit"
                form="checkout-form"
                disabled={submitting || !isFormValid}
                className="btn btn-primary btn-block btn-lg rounded-2xl text-lg mt-4 disabled:opacity-50"
              >
                {submitting ? (
                  <span className="loading loading-spinner loading-md"></span>
                ) : (
                  "ยืนยันการสั่งซื้อ"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
