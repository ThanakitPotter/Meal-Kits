"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Menu, Order } from "@/types";
import { ArrowLeft, Clock, Check, CheckCircle2, ChevronRight, ShoppingCart } from "lucide-react";

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
    servings: 1 as 1 | 2 | 4,
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
    ? form.servings === 4
      ? Math.round(menu.price * 3.2)
      : form.servings === 2
        ? Math.round(menu.price * 1.8)
        : menu.price
    : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    setSubmitting(true);
    try {
      // Optional: attach user id to order if logged in
      const storedUser = localStorage.getItem("user");
      const userId = storedUser ? JSON.parse(storedUser).id : null;

      const items = [{
        menuId: unwrappedParams.id,
        menuName: menu?.name || "",
        servings: form.servings,
        price: totalPrice,
        quantity: 1
      }];

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
          totalPrice
        }),
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
      <div className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-10">
          <div className="skeleton h-[600px] w-full rounded-box" />
          <div className="skeleton h-[600px] w-full rounded-box" />
        </div>
      </div>
    );
  }

  if (!menu) {
    return (
      <div className="container mx-auto px-4 py-20 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-2">ไม่พบเมนู</h1>
        <p className="text-base-content/60 mb-6">เมนูที่คุณกำลังค้นหาไม่มีอยู่ในระบบ</p>
        <Link href="/" className="btn btn-primary">
          <ArrowLeft size={18} /> กลับหน้าแรก
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-20">
        <div className="card bg-base-100 shadow-xl border border-base-200 animate-fade-in-up">
          <div className="bg-gradient-to-r from-success to-emerald-500 p-8 text-center text-primary-content">
            <CheckCircle2 size={64} className="mx-auto mb-4" />
            <h1 className="text-3xl font-extrabold">สั่งซื้อสำเร็จ!</h1>
          </div>
          <div className="card-body p-6 md:p-8">
            <div className="alert alert-success bg-success/10 border-success/20 text-success-content mb-6">
              <div>
                <h3 className="font-bold">หมายเลขคำสั่งซื้อ: #{success.id}</h3>
                <div className="text-sm">ระบบได้รับคำสั่งซื้อของคุณแล้ว เราจะเริ่มเตรียมวัตถุดิบและจัดส่งให้คุณโดยเร็วที่สุด</div>
              </div>
            </div>

            <div className="space-y-3 text-sm mb-8">
              <div className="flex justify-between py-2 border-b border-base-200">
                <span className="text-base-content/60">เมนูอาหาร</span>
                <span className="font-semibold">{success.items[0]?.menuName}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-base-200">
                <span className="text-base-content/60">จำนวนที่ทาน</span>
                <span className="font-semibold">{success.items[0]?.servings} คน</span>
              </div>
              <div className="flex justify-between py-2 border-b border-base-200">
                <span className="text-base-content/60">ชื่อลูกค้า</span>
                <span className="font-semibold">{success.customerName}</span>
              </div>
              <div className="flex justify-between py-3">
                <span className="text-base-content/60 font-medium">ราคารวม</span>
                <span className="text-2xl font-extrabold text-primary">
                  ฿{success.totalPrice.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/" className="btn btn-outline flex-1">
                กลับหน้าแรก
              </Link>
              <Link href="/orders" className="btn btn-primary flex-1">
                ดูสถานะออเดอร์
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8 md:py-12">
      <div className="breadcrumbs text-sm mb-8">
        <ul>
          <li><Link href="/">หน้าแรก</Link></li>
          <li>สั่ง {menu.name}</li>
        </ul>
      </div>

      {/* ─── DaisyUI Stepper ─── */}
      <div className="mb-10 w-full overflow-x-auto pb-4">
        <ul className="steps w-full min-w-[400px]">
          <li className="step step-primary">เลือกแพ็กเกจ</li>
          <li className="step step-primary">ยืนยันเมนู</li>
          <li className="step step-primary">จัดส่งและชำระเงิน</li>
        </ul>
      </div>

      <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
        {/* Left: Menu Info */}
        <div className="lg:col-span-2">
          <div className="card bg-base-100 shadow-md border border-base-200 sticky top-24">
            <figure className="relative h-64 w-full">
              <Image
                src={menu.image}
                alt={menu.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            </figure>
            <div className="card-body p-6">
              <h2 className="card-title text-2xl font-extrabold">{menu.name}</h2>
              <div className="flex items-center gap-2 mb-2 text-sm font-medium text-base-content/70">
                <Clock size={16} /> ใช้เวลา {menu.prepTime}
              </div>
              <p className="text-base-content/70 text-sm mb-4 pb-4 border-b border-base-200">
                {menu.description}
              </p>

              <h3 className="text-sm font-bold uppercase tracking-wide mb-3 text-base-content/80">
                สิ่งที่จะได้รับในชุด
              </h3>
              <ul className="space-y-2">
                {menu.ingredients.map((item: string, i: number) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-base-content/70">
                    <Check size={16} className="text-primary mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right: Order Form */}
        <div className="lg:col-span-3">
          <div className="card bg-base-100 shadow-md border border-base-200">
            <div className="card-body p-6 md:p-8">
              <h2 className="card-title text-2xl font-extrabold mb-1">รายละเอียดการสั่งซื้อ</h2>
              <p className="text-base-content/50 text-sm mb-8">
                เลือกจำนวนที่ต้องการทาน และกรอกข้อมูลจัดส่งให้ครบถ้วน
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
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
                {/* Servings */}
                <div>
                  <label className="label">
                    <span className="label-text font-bold">สำหรับกี่ท่าน? <span className="text-error">*</span></span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <button
                      type="button"
                      onClick={() => updateField("servings", 1)}
                      className={`btn h-auto py-4 flex-col gap-1 transition-all ${form.servings === 1
                        ? 'btn-primary'
                        : 'btn-outline border-base-300 text-base-content'
                        }`}
                    >
                      <span className="text-xl font-bold">1 คน</span>
                      <span className="text-sm font-normal opacity-80">฿{menu.price}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => updateField("servings", 2)}
                      className={`btn h-auto py-4 flex-col gap-1 transition-all relative ${form.servings === 2
                        ? 'btn-primary'
                        : 'btn-outline border-base-300 text-base-content'
                        }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold">2 คน</span>
                      </div>
                      <span className="text-sm font-normal opacity-80">฿{Math.round(menu.price * 1.8)}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => updateField("servings", 4)}
                      className={`btn h-auto py-4 flex-col gap-1 transition-all relative ${form.servings === 4
                        ? 'btn-primary'
                        : 'btn-outline border-base-300 text-base-content'
                        }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold">ครอบครัว</span>
                      </div>
                      {form.servings !== 4 && <span className="badge badge-primary badge-sm absolute -top-2 -right-2 whitespace-nowrap shadow-md z-10 border-base-100">คุ้มสุด</span>}
                      <span className="text-sm font-normal opacity-80">฿{Math.round(menu.price * 3.2)}</span>
                    </button>
                  </div>
                </div>

                <div className="divider">ข้อมูลจัดส่ง</div>

                <div className="space-y-4">
                  <div className="form-control">
                    <label className="label"><span className="label-text font-bold">ชื่อผู้รับ <span className="text-error">*</span></span></label>
                    <input
                      type="text"
                      required
                      value={form.customerName}
                      onChange={(e) => updateField("customerName", e.target.value)}
                      placeholder="ชื่อ-นามสกุล"
                      className="input input-bordered w-full"
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
                      className="input input-bordered w-full"
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
                      className="textarea textarea-bordered w-full resize-none"
                    />
                  </div>
                </div>

                <div className="divider">ช่องทางการชำระเงิน</div>

                <div className="space-y-3">
                  <label className="label cursor-pointer justify-start gap-4 p-4 border border-base-300 rounded-box hover:border-primary transition-colors">
                    <input type="radio" name="payment" className="radio radio-primary" defaultChecked />
                    <span className="label-text font-medium">โอนเงินผ่านธนาคาร (PromptPay)</span>
                  </label>
                  <label className="label cursor-pointer justify-start gap-4 p-4 border border-base-300 rounded-box hover:border-primary transition-colors">
                    <input type="radio" name="payment" className="radio radio-primary" />
                    <span className="label-text font-medium">บัตรเครดิต / เดบิต</span>
                  </label>
                </div>

                {/* Order Summary Data Table with Strict Rule #c594a1 */}
                <div className="mt-8">
                  <h3 className="text-lg font-bold mb-4">สรุปคำสั่งซื้อ</h3>
                  <div className="overflow-x-auto rounded-lg">
                    <table className="table w-full border border-[#c594a1]/50 rounded-box overflow-hidden">
                      <thead className="bg-[#c594a1]/10 text-base-content">
                        <tr>
                          <th className="font-semibold text-base-content">รายการ</th>
                          <th className="font-semibold w-24 text-center text-base-content">จำนวน</th>
                          <th className="font-semibold w-32 text-right text-base-content">ราคา</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#c594a1]/30">
                        <tr>
                          <td>
                            <span className="font-bold text-base-content">{menu.name}</span>
                            <span className="block text-xs opacity-70 mt-1">สำหรับ {form.servings} ท่าน</span>
                          </td>
                          <td className="text-center font-medium">1</td>
                          <td className="text-right font-medium">฿{totalPrice.toLocaleString()}</td>
                        </tr>
                        <tr className="bg-base-200/30">
                          <td colSpan={2} className="font-bold text-right text-base-content/80">
                            ยอดรวมทั้งสิ้น
                          </td>
                          <td className="font-extrabold text-primary text-lg text-right">
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
                  className="btn btn-primary btn-block btn-lg mt-6 text-lg"
                >
                  {submitting ? (
                    <span className="loading loading-spinner"></span>
                  ) : (
                    <><ShoppingCart size={20} /> ยืนยันการสั่งซื้อ</>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
