"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, cartTotal, clearCart } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [successId, setSuccessId] = useState<string | null>(null);

  const [form, setForm] = useState({
    customerName: "",
    customerPhone: "",
    shippingAddress: "",
    orderType: "one-time",
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
      <div className="container mx-auto max-w-md md:max-w-2xl px-4 py-12 md:py-20 min-h-[60vh] flex items-center justify-center">
        <div className="card w-full bg-base-100 shadow-2xl border border-gray-100 animate-fade-in-up overflow-hidden mb-10 md:mb-0">
          <div className="bg-gradient-to-r from-success to-emerald-500 p-8 md:p-10 text-center text-primary-content">
            <CheckCircle2 size={64} className="mx-auto mb-4 drop-shadow-md" />
            <h1 className="text-2xl md:text-3xl font-extrabold drop-shadow-sm">สั่งซื้อสำเร็จ!</h1>
          </div>
          <div className="card-body p-6 md:p-8">
            <div className="alert alert-success bg-success/10 border-success/20 text-success-content mb-8 shadow-sm">
              <div className="flex flex-col gap-1">
                <h3 className="font-bold text-base">หมายเลขคำสั่งซื้อ: #{successId}</h3>
                <p className="text-sm opacity-90">ระบบได้รับคำสั่งซื้อของคุณแล้ว เราจะเริ่มเตรียมวัตถุดิบและจัดส่งให้คุณโดยเร็วที่สุด</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-2">
              <Link href="/" className="btn btn-outline flex-1 rounded-full">
                กลับหน้าแรก
              </Link>
              <Link href="/orders" className="btn btn-primary flex-1 rounded-full shadow-md hover:shadow-lg">
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

      <h1 className="text-3xl font-extrabold mb-8 text-[#333333]">ข้อมูลการจัดส่งและชำระเงิน</h1>

      <div className="grid lg:grid-cols-2 gap-10">
        <div>
          <div className="card bg-white text-[#333333] shadow-md border border-gray-100">
            <div className="card-body p-6 md:p-8">
              <form id="checkout-form" onSubmit={handleSubmit} className="space-y-4">
                <div className="form-control mb-4">
                  <label className="label"><span className="label-text font-bold">ประเภทการสั่งซื้อ <span className="text-error">*</span></span></label>
                  <div className="flex gap-4 mt-2">
                    <label className="cursor-pointer flex items-center gap-2">
                      <input 
                        type="radio" 
                        name="orderType" 
                        className="radio radio-primary" 
                        checked={form.orderType === 'one-time'}
                        onChange={() => updateField("orderType", "one-time")}
                      />
                      <span className="label-text">สั่งครั้งเดียว (One-time)</span>
                    </label>
                    <label className="cursor-pointer flex items-center gap-2">
                      <input 
                        type="radio" 
                        name="orderType" 
                        className="radio radio-primary" 
                        checked={form.orderType === 'subscription'}
                        onChange={() => updateField("orderType", "subscription")}
                      />
                      <span className="label-text">สั่งเป็นประจำ (Subscription)</span>
                    </label>
                  </div>
                </div>

                <div className="form-control">
                  <label className="label"><span className="label-text font-bold">ชื่อผู้รับ <span className="text-error">*</span></span></label>
                  <input
                    type="text"
                    required
                    value={form.customerName}
                    onChange={(e) => updateField("customerName", e.target.value)}
                    placeholder="ชื่อ-นามสกุล"
                    className="input input-bordered w-full bg-white text-[#333333] placeholder:text-gray-400"
                  />
                </div>

                <div className="form-control">
                  <label className="label"><span className="label-text font-bold">เบอร์โทรศัพท์ <span className="text-error">*</span></span></label>
                  <input
                    type="tel"
                    required
                    value={form.customerPhone}
                    onChange={(e) => updateField("customerPhone", e.target.value)}
                    placeholder="0xx-xxx-xxxx"
                    className="input input-bordered w-full bg-white text-[#333333] placeholder:text-gray-400"
                  />
                </div>

                <div className="form-control">
                  <label className="label"><span className="label-text font-bold">ที่อยู่จัดส่ง <span className="text-error">*</span></span></label>
                  <textarea
                    required
                    rows={3}
                    value={form.shippingAddress}
                    onChange={(e) => updateField("shippingAddress", e.target.value)}
                    placeholder="บ้านเลขที่ ซอย ถนน แขวง/ตำบล เขต/อำเภอ จังหวัด รหัสไปรษณีย์"
                    className="textarea textarea-bordered w-full resize-none bg-white text-[#333333] placeholder:text-gray-400"
                  />
                </div>
                
                <div className="divider mt-8">ช่องทางการชำระเงิน</div>

                <div className="space-y-3">
                  <label className="label cursor-pointer justify-start gap-4 p-4 border border-gray-200 rounded-box hover:border-primary transition-colors">
                    <input type="radio" name="payment" className="radio radio-primary" defaultChecked />
                    <span className="label-text font-medium">โอนเงินผ่านธนาคาร (PromptPay)</span>
                  </label>
                  <label className="label cursor-pointer justify-start gap-4 p-4 border border-gray-200 rounded-box hover:border-primary transition-colors">
                    <input type="radio" name="payment" className="radio radio-primary" />
                    <span className="label-text font-medium">บัตรเครดิต / เดบิต</span>
                  </label>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div>
          <div className="card bg-white text-[#333333] shadow-md border border-gray-100 sticky top-24">
            <div className="card-body p-6 md:p-8">
              <h2 className="card-title text-xl font-bold mb-4 text-[#333333]">สรุปคำสั่งซื้อ</h2>
              
              <div className="overflow-x-auto rounded-lg mb-6">
                <table className="table w-full border border-[#c594a1] rounded-box overflow-hidden">
                  <thead className="bg-gray-100 text-gray-700">
                    <tr>
                      <th className="font-semibold text-gray-700">รายการ</th>
                      <th className="font-semibold w-16 text-center text-gray-700">จำนวน</th>
                      <th className="font-semibold w-24 text-right text-gray-700">ราคา</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {cartItems.map(item => (
                      <tr key={item.id}>
                        <td>
                          <span className="font-bold text-gray-800 block line-clamp-1">{item.menuName}</span>
                          <span className="block text-xs text-gray-500 mt-1">{item.servings} คน</span>
                        </td>
                        <td className="text-center font-medium text-gray-800">{item.quantity}</td>
                        <td className="text-right font-medium text-gray-800">฿{(item.price * item.quantity).toLocaleString()}</td>
                      </tr>
                    ))}
                    <tr className="bg-gray-50">
                      <td colSpan={2} className="font-bold text-right text-gray-700">
                        ยอดรวมทั้งสิ้น
                      </td>
                      <td className="font-extrabold text-primary text-lg text-right">
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
                className="btn btn-primary btn-block btn-lg text-lg disabled:bg-gray-200 disabled:text-gray-400"
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
