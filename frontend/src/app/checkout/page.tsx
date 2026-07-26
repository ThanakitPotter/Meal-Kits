"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { ArrowLeft, CheckCircle2, Info, QrCode, Wallet, Truck } from "lucide-react";

// เบอร์พร้อมเพย์รับเงินของร้าน (สามารถเปลี่ยนเป็นเบอร์จริง e.g. "0812345678" หรือ เลขภาษี 13 หลักของร้านได้เลย)
const STORE_PROMPTPAY_ID = "0641028753";

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, cartTotal, clearCart } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [successId, setSuccessId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"promptpay" | "cod">("promptpay");
  const [qrImgError, setQrImgError] = useState(false);


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
          totalPrice: cartTotal,
          paymentMethod:
            paymentMethod === "promptpay"
              ? "สแกน QR พร้อมเพย์ (ฟรี 0%)"
              : "เก็บเงินปลายทาง (COD)",
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
              <h3 className="font-mono text-2xl font-bold text-gray-800 mb-4">#{successId.slice(0, 8).toUpperCase()}</h3>
              <div className="bg-white rounded-xl p-3 border border-gray-200 mb-4 text-xs sm:text-sm font-semibold text-gray-700 flex flex-wrap items-center justify-center gap-2">
                <span>ช่องทางชำระเงิน:</span>
                <span className="text-mustard-700 font-bold inline-flex items-center gap-1.5">
                  {paymentMethod === "promptpay" ? (
                    <>
                      <QrCode className="w-4 h-4 inline" />
                      <span>สแกน QR พร้อมเพย์ (ฟรี 0%)</span>
                    </>
                  ) : (
                    <>
                      <Wallet className="w-4 h-4 inline" />
                      <span>เก็บเงินปลายทาง (COD)</span>
                    </>
                  )}
                </span>
              </div>
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
    <div className="container mx-auto max-w-6xl px-3 sm:px-4 py-6 sm:py-8 md:py-12">
      <div className="breadcrumbs text-xs sm:text-sm mb-4 sm:mb-6">
        <ul>
          <li><Link href="/">หน้าแรก</Link></li>
          <li><Link href="/cart">ตะกร้าสินค้า</Link></li>
          <li>ชำระเงิน</li>
        </ul>
      </div>

      <h1 className="text-2xl sm:text-3xl font-extrabold mb-6 sm:mb-8 text-[#193B68] tracking-tight">ข้อมูลการจัดส่งและชำระเงิน</h1>

      <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
        <div>
          <div className="card bg-white shadow-xl border border-gray-100 rounded-2xl sm:rounded-3xl overflow-hidden">
            <div className="bg-gradient-to-r from-[#193B68] to-[#122b4d] p-4 sm:p-6 text-white border-b border-blue-900/50">
              <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2.5">
                <span className="bg-mustard-500 text-white w-7 sm:w-8 h-7 sm:h-8 rounded-xl flex items-center justify-center text-xs sm:text-sm font-black shadow-md">1</span>
                <span>ที่อยู่จัดส่ง</span>
              </h2>
            </div>
            <div className="card-body p-4 sm:p-6 md:p-8">
              <form id="checkout-form" onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                <div className="form-control">
                  <label className="label"><span className="label-text font-bold text-base-content/80">ประเภทการสั่งซื้อ <span className="text-error">*</span></span></label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4 mt-1">
                    <label className={`cursor-pointer flex items-center gap-2.5 sm:gap-3 p-3.5 sm:p-4 border rounded-xl transition-all ${form.orderType === 'one-time' ? 'border-primary bg-primary/5' : 'border-base-300 hover:border-primary/50'}`}>
                      <input
                        type="radio"
                        name="orderType"
                        className="radio radio-primary radio-sm"
                        checked={form.orderType === 'one-time'}
                        onChange={() => updateField("orderType", "one-time")}
                      />
                      <span className="label-text font-medium text-sm sm:text-base text-base-content">สั่งครั้งเดียว</span>
                    </label>
                    <label className={`cursor-pointer flex items-center gap-2.5 sm:gap-3 p-3.5 sm:p-4 border rounded-xl transition-all ${form.orderType === 'subscription' ? 'border-primary bg-primary/5' : 'border-base-300 hover:border-primary/50'}`}>
                      <input
                        type="radio"
                        name="orderType"
                        className="radio radio-primary radio-sm"
                        checked={form.orderType === 'subscription'}
                        onChange={() => updateField("orderType", "subscription")}
                      />
                      <span className="label-text font-medium text-sm sm:text-base text-base-content">สั่งประจำ</span>
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

                <div className="mt-8 pt-6 border-t border-gray-100">
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2.5 text-[#193B68]">
                    <span className="bg-[#193B68] text-white w-8 h-8 rounded-xl flex items-center justify-center text-sm font-black shadow-sm">2</span>
                    <span>ช่องทางการชำระเงิน</span>
                  </h2>

                  <div className="space-y-4">
                    {/* Option 1: สแกน QR พร้อมเพย์ (PromptPay - ฟรี 0%) */}
                    <div
                      onClick={() => setPaymentMethod("promptpay")}
                      className={`cursor-pointer border-2 rounded-2xl p-4 sm:p-5 transition-all duration-300 ${paymentMethod === "promptpay"
                          ? "border-mustard-500 bg-mustard-500/5 shadow-md"
                          : "border-gray-200 hover:border-mustard-300 bg-white"
                        }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
                        <div className="flex items-start sm:items-center gap-2.5 sm:gap-3">
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0 ${paymentMethod === "promptpay"
                                ? "border-mustard-600 bg-mustard-500"
                                : "border-gray-300"
                              }`}
                          >
                            {paymentMethod === "promptpay" && (
                              <div className="w-2 h-2 rounded-full bg-white"></div>
                            )}
                          </div>
                          <div>
                            <span className="font-bold text-sm sm:text-base text-[#2d2d2d] flex flex-wrap items-center gap-1.5 sm:gap-2">
                              <QrCode className="w-4 h-4 sm:w-5 sm:h-5 text-mustard-600 shrink-0" />
                              <span>สแกน QR พร้อมเพย์ (PromptPay)</span>
                              <span className="text-xs bg-emerald-500 text-white font-bold px-2.5 py-0.5 rounded-full shadow-sm">
                                ฟรี 0%
                              </span>
                            </span>
                            <p className="text-xs text-gray-500 mt-0.5">
                              สแกนจ่ายทันทีผ่าน Mobile Banking ได้ทุกธนาคาร
                            </p>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-mustard-700 bg-mustard-100/80 px-2.5 py-1 rounded-lg self-start sm:self-auto">
                          แนะนำ
                        </span>
                      </div>

                      {/* Expandable PromptPay QR Code Modal Box */}
                      {paymentMethod === "promptpay" && (
                        <div className="mt-5 pt-5 border-t border-mustard-200/60 animate-fade-in-up">
                          {/* Thai QR Payment Standard Style Header */}
                          <div className="bg-[#193B68] text-white rounded-2xl p-4 sm:p-5 shadow-lg max-w-full sm:max-w-sm mx-auto border border-blue-800">
                            <div className="flex items-center justify-between border-b border-blue-400/30 pb-3 mb-4">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center font-black text-[#193B68] text-xs">
                                  QR
                                </div>
                                <div>
                                  <h4 className="text-sm font-extrabold tracking-wide">
                                    THAI QR PAYMENT
                                  </h4>
                                  <p className="text-[10px] text-blue-200">
                                    พร้อมเพย์ (PromptPay)
                                  </p>
                                </div>
                              </div>
                              <span className="text-xs bg-white/10 px-2.5 py-1 rounded-full font-medium">
                                ฟรีค่าธรรมเนียม
                              </span>
                            </div>

                            {/* QR Code SVG / Crisp Graphic */}
                            <div className="bg-white p-4 rounded-xl flex flex-col items-center justify-center mb-4 text-[#2d2d2d] shadow-inner">
                              <div className="w-48 h-48 bg-white border-2 border-[#193B68]/20 rounded-xl flex items-center justify-center p-2 relative overflow-hidden shadow-sm">
                                {!qrImgError ? (
                                  <img
                                    src={`https://promptpay.io/${STORE_PROMPTPAY_ID}/${cartTotal}.png`}
                                    alt="PromptPay QR Code"
                                    className="w-full h-full object-contain"
                                    onError={() => setQrImgError(true)}
                                  />
                                ) : (
                                  <>
                                    {/* SVG QR Code pattern fallback */}
                                    <svg
                                      viewBox="0 0 100 100"
                                      className="w-full h-full text-[#193B68]"
                                    >
                                      <path
                                        d="M5,5 h25 v25 h-25 Z M10,10 v15 h15 v-15 Z M15,15 h5 v5 h-5 Z"
                                        fill="currentColor"
                                      />
                                      <path
                                        d="M70,5 h25 v25 h-25 Z M75,10 v15 h15 v-15 Z M80,15 h5 v5 h-5 Z"
                                        fill="currentColor"
                                      />
                                      <path
                                        d="M5,70 h25 v25 h-25 Z M10,75 v15 h15 v-15 Z M15,80 h5 v5 h-5 Z"
                                        fill="currentColor"
                                      />
                                      <rect
                                        x="40"
                                        y="8"
                                        width="5"
                                        height="5"
                                        fill="currentColor"
                                      />
                                      <rect
                                        x="50"
                                        y="8"
                                        width="5"
                                        height="15"
                                        fill="currentColor"
                                      />
                                      <rect
                                        x="40"
                                        y="20"
                                        width="15"
                                        height="5"
                                        fill="currentColor"
                                      />
                                      <rect
                                        x="35"
                                        y="35"
                                        width="30"
                                        height="5"
                                        fill="currentColor"
                                      />
                                      <rect
                                        x="35"
                                        y="45"
                                        width="5"
                                        height="20"
                                        fill="currentColor"
                                      />
                                      <rect
                                        x="45"
                                        y="45"
                                        width="10"
                                        height="10"
                                        fill="currentColor"
                                      />
                                      <rect
                                        x="60"
                                        y="45"
                                        width="5"
                                        height="15"
                                        fill="currentColor"
                                      />
                                      <rect
                                        x="75"
                                        y="40"
                                        width="15"
                                        height="5"
                                        fill="currentColor"
                                      />
                                      <rect
                                        x="75"
                                        y="55"
                                        width="10"
                                        height="15"
                                        fill="currentColor"
                                      />
                                      <rect
                                        x="45"
                                        y="70"
                                        width="20"
                                        height="5"
                                        fill="currentColor"
                                      />
                                      <rect
                                        x="70"
                                        y="75"
                                        width="15"
                                        height="10"
                                        fill="currentColor"
                                      />
                                      <rect
                                        x="40"
                                        y="85"
                                        width="15"
                                        height="10"
                                        fill="currentColor"
                                      />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                      <div className="w-10 h-10 bg-white rounded-full shadow-md border-2 border-[#193B68] flex items-center justify-center font-bold text-xs text-[#193B68]">
                                        MK
                                      </div>
                                    </div>
                                  </>
                                )}
                              </div>
                              <div className="text-center mt-3">
                                <p className="text-xs text-gray-500">
                                  บัญชีรับเงิน: ธนกฤต นำชัยมาหา
                                </p>
                                <p className="text-sm font-mono font-bold text-[#193B68] mt-0.5">
                                  {STORE_PROMPTPAY_ID}
                                </p>
                              </div>
                            </div>

                            <div className="text-center bg-blue-900/40 rounded-xl p-2.5">
                              <p className="text-xs text-blue-200">
                                ยอดชำระเงินที่ต้องโอน
                              </p>
                              <p className="text-xl font-extrabold text-amber-300 tracking-tight mt-0.5">
                                ฿{cartTotal.toLocaleString()} บาท
                              </p>
                            </div>
                          </div>

                          {/* Easy Scan-and-Go Notice */}
                          <div className="mt-4 max-w-full sm:max-w-sm mx-auto bg-emerald-50/90 border border-emerald-200 rounded-xl p-3.5 text-center">
                            <p className="text-xs font-bold text-emerald-800">
                              สแกนจ่ายเสร็จแล้ว กด &quot;ยืนยันคำสั่งซื้อ&quot; ด้านล่างได้ทันที
                            </p>
                            <p className="text-[11px] text-emerald-600 mt-0.5">
                              รับคำสั่งซื้อทันทีโดยไม่ต้องแนบสลิป
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Option 2: เก็บเงินปลายทาง (COD) */}
                    <div
                      onClick={() => setPaymentMethod("cod")}
                      className={`cursor-pointer border-2 rounded-2xl p-4 sm:p-5 transition-all duration-300 ${paymentMethod === "cod"
                          ? "border-mustard-500 bg-mustard-500/5 shadow-md"
                          : "border-gray-200 hover:border-mustard-300 bg-white"
                        }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
                        <div className="flex items-start sm:items-center gap-2.5 sm:gap-3">
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0 ${paymentMethod === "cod"
                                ? "border-mustard-600 bg-mustard-500"
                                : "border-gray-300"
                              }`}
                          >
                            {paymentMethod === "cod" && (
                              <div className="w-2 h-2 rounded-full bg-white"></div>
                            )}
                          </div>
                          <div>
                            <span className="font-bold text-sm sm:text-base text-[#2d2d2d] flex flex-wrap items-center gap-1.5 sm:gap-2">
                              <Wallet className="w-4 h-4 sm:w-5 sm:h-5 text-mustard-600 shrink-0" />
                              <span>เก็บเงินปลายทาง (Cash on Delivery)</span>
                              <span className="text-xs bg-gray-100 text-gray-700 font-bold px-2 py-0.5 rounded-full">
                                จ่ายกับคนส่ง
                              </span>
                            </span>
                            <p className="text-xs text-gray-500 mt-0.5">
                              เตรียมเงินสดชำระที่หน้าบ้านเมื่อรับวัตถุดิบ
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Expandable COD description */}
                      {paymentMethod === "cod" && (
                        <div className="mt-4 pt-4 border-t border-mustard-200/60 flex items-start gap-3 bg-amber-50/60 p-3.5 rounded-xl animate-fade-in-up">
                          <Truck className="w-5 h-5 text-mustard-600 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs font-bold text-[#2d2d2d]">
                              ไม่มีค่าธรรมเนียมเพิ่มเติม
                            </p>
                            <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
                              พนักงานจัดส่งจะติดต่อคุณทางเบอร์{" "}
                              <b>{form.customerPhone || "โทรศัพท์ของคุณ"}</b>{" "}
                              ก่อนเข้าไปส่งอาหาร กรุณาเตรียมเงินสดจำนวน{" "}
                              <b>฿{cartTotal.toLocaleString()} บาท</b> พอดี
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div>
          <div className="card bg-white shadow-2xl border border-gray-100 rounded-2xl sm:rounded-3xl lg:sticky lg:top-24 overflow-hidden">
            {/* Premium Header */}
            <div className="bg-gradient-to-r from-[#193B68] to-[#142d50] p-5 sm:p-6 md:p-7 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-mustard-500/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
              <div className="relative z-10 flex items-center justify-between">
                <h2 className="text-lg sm:text-xl font-black tracking-wide flex items-center gap-2 sm:gap-2.5">
                  <span className="bg-mustard-500 text-white w-7 sm:w-8 h-7 sm:h-8 rounded-xl flex items-center justify-center text-xs sm:text-sm font-black shadow-md">
                    3
                  </span>
                  <span>สรุปคำสั่งซื้อ</span>
                </h2>
                <span className="text-[11px] sm:text-xs bg-white/10 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full font-bold text-blue-100 border border-white/10">
                  {cartItems.length} รายการ
                </span>
              </div>
            </div>

            <div className="card-body p-4 sm:p-6 md:p-7">
              {/* Modern Item Cards List */}
              <div className="space-y-2.5 sm:space-y-3 mb-5 sm:mb-6 max-h-[340px] overflow-y-auto pr-1">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-gray-50/80 border border-gray-100 hover:border-mustard-200 hover:bg-white hover:shadow-xs transition-all gap-2"
                  >
                    <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                      <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-lg sm:rounded-xl bg-mustard-100/70 text-mustard-700 flex items-center justify-center font-bold text-xs sm:text-sm shrink-0 shadow-inner">
                        {item.quantity}×
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-bold text-[#2d2d2d] text-xs sm:text-sm md:text-base truncate">
                            {item.menuName}
                          </h4>
                          {item.price === 1 && (
                            <span className="text-[9px] sm:text-[10px] font-black bg-emerald-500 text-white px-1.5 sm:px-2 py-0.5 rounded-md shadow-2xs shrink-0">
                              TEST 1฿
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] sm:text-xs text-gray-400 mt-0.5">
                          สำหรับ {item.servings} ท่าน
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0 pl-2 sm:pl-3">
                      <span className="font-extrabold text-[#2d2d2d] text-sm sm:text-base font-mono">
                        ฿{(item.price * item.quantity).toLocaleString()}
                      </span>
                      {item.quantity > 1 && (
                        <span className="block text-[10px] sm:text-[11px] text-gray-400">
                          (฿{item.price.toLocaleString()}/ชิ้น)
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown Card */}
              <div className="bg-gray-50/70 rounded-2xl p-3.5 sm:p-4 border border-gray-100 space-y-2.5 sm:space-y-3 mb-5 sm:mb-6">
                <div className="flex justify-between items-center text-xs sm:text-sm">
                  <span className="text-gray-500 font-medium">ค่าอาหารรวม ({cartItems.length} เมนู)</span>
                  <span className="font-bold text-[#2d2d2d] font-mono">
                    ฿{cartTotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs sm:text-sm">
                  <span className="text-gray-500 font-medium flex items-center gap-1.5">
                    <Truck className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-emerald-600 shrink-0" /> ค่าจัดส่งแบบคุมอุณหภูมิ
                  </span>
                  <span className="text-[11px] sm:text-xs font-bold text-emerald-700 bg-emerald-100 px-2 sm:px-2.5 py-0.5 rounded-full">
                    ฟรี (0 บาท)
                  </span>
                </div>
                <div className="border-t border-gray-200/60 pt-3 flex justify-between items-baseline">
                  <div>
                    <span className="font-extrabold text-[#2d2d2d] text-sm sm:text-base block">
                      ยอดรวมทั้งสิ้น
                    </span>
                    <span className="text-[10px] sm:text-[11px] text-gray-400">
                      ราคารวมภาษีมูลค่าเพิ่มแล้ว
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-black text-xl sm:text-2xl md:text-3xl text-amber-500 tracking-tight">
                      ฿{cartTotal.toLocaleString()}
                    </span>
                    <span className="text-xs font-bold text-[#2d2d2d] ml-1">บาท</span>
                  </div>
                </div>
              </div>

              {/* Interactive Submit Button - touch friendly 48px+ height for iOS/Android */}
              <button
                type="submit"
                form="checkout-form"
                disabled={submitting || !isFormValid}
                className={`w-full py-3.5 sm:py-4 px-4 sm:px-6 rounded-2xl font-bold text-sm sm:text-base md:text-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                  isFormValid && !submitting
                    ? "bg-gradient-to-r from-emerald-500 via-green-600 to-emerald-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.01] active:scale-[0.99]"
                    : "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed"
                }`}
              >
                {submitting ? (
                  <>
                    <span className="loading loading-spinner loading-md"></span>
                    <span>กำลังดำเนินการสั่งซื้อ...</span>
                  </>
                ) : (
                  <>
                    <span>ยืนยันการสั่งซื้อและชำระเงิน</span>
                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                  </>
                )}
              </button>

              {/* Helpful Hint when Form is Incomplete */}
              {!isFormValid && (
                <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-amber-600 font-medium bg-amber-50/80 py-2 px-3 rounded-xl border border-amber-200/60 text-center">
                  <Info className="w-3.5 h-3.5 shrink-0" />
                  <span>กรุณากรอกชื่อ เบอร์โทร และที่อยู่จัดส่งให้ครบถ้วน</span>
                </div>
              )}

              {/* Security & Quality Trust Badges - flex-wrap for small phone screens */}
              <div className="mt-5 pt-4 border-t border-gray-100 flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-[10px] sm:text-[11px] text-gray-400 font-medium">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> วัตถุดิบสดใหม่
                </span>
                <span className="hidden sm:inline">•</span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> ปลอดภัย 100%
                </span>
                <span className="hidden sm:inline">•</span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> ส่งตรงเวลา
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
