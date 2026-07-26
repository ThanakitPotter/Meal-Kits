"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import {
  ArrowLeft,
  CheckCircle2,
  Wallet,
  Truck,
  ShieldCheck,
  Lock,
  ChevronRight,
  Clock,
  Sparkles,
} from "lucide-react";

// เบอร์พร้อมเพย์รับเงินของร้าน
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
      window.scrollTo({ top: 0, behavior: "smooth" });
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
      const items = cartItems.map((item) => ({
        menuId: item.menuId,
        menuName: item.menuName,
        servings: item.servings,
        price: item.price,
        quantity: item.quantity,
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
          deliveryFrequency:
            form.orderType === "subscription" ? form.deliveryFrequency : undefined,
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

  // ==========================================
  // SUCCESS VIEW (MINIMALIST & CLEAN IN BRAND COLORS)
  // ==========================================
  if (successId) {
    return (
      <div className="min-h-[75vh] bg-[#FAFAFA] py-16 sm:py-24 px-4 flex items-center justify-center">
        <div className="max-w-lg w-full bg-white border border-gray-200/80 rounded-3xl p-8 sm:p-10 text-center shadow-xs">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-emerald-100">
            <CheckCircle2 size={36} />
          </div>

          <h1 className="text-2xl sm:text-3xl font-semibold text-[#2d2d2d] tracking-tight mb-2">
            คำสั่งซื้อสำเร็จ
          </h1>
          <p className="text-sm text-gray-500 mb-8">
            ขอบคุณที่ไว้วางใจ Meal Kits เราได้รับข้อมูลและเริ่มเตรียมวัตถุดิบให้คุณแล้ว
          </p>

          <div className="bg-gray-50/80 border border-gray-200/60 rounded-2xl p-6 mb-8 text-left space-y-4">
            <div className="flex items-center justify-between border-b border-gray-200/60 pb-3">
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                หมายเลขคำสั่งซื้อ
              </span>
              <span className="font-mono text-sm font-semibold text-[#2d2d2d]">
                #{successId.slice(0, 8).toUpperCase()}
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-gray-200/60 pb-3">
              <span className="text-xs font-medium text-gray-500">
                ช่องทางชำระเงิน
              </span>
              <span className="text-xs sm:text-sm font-medium text-[#2d2d2d] flex items-center gap-2">
                {paymentMethod === "promptpay" ? (
                  <>
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/c/c5/PromptPay-logo.png"
                      alt="PromptPay"
                      className="h-4 w-auto object-contain"
                    />
                    <span>สแกน QR พร้อมเพย์ (ฟรี 0%)</span>
                  </>
                ) : (
                  <>
                    <Wallet className="w-4 h-4 text-[#2d2d2d]" />
                    <span>เก็บเงินปลายทาง (COD)</span>
                  </>
                )}
              </span>
            </div>

            <p className="text-xs text-gray-500 leading-relaxed pt-1">
              ระบบกำลังดำเนินการจัดเตรียมวัตถุดิบที่สดใหม่และจะทำการจัดส่งแบบควบคุมอุณหภูมิให้คุณตามรอบที่กำหนด
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/"
              className="flex-1 py-3.5 px-4 rounded-xl border border-gray-200 hover:bg-gray-50 text-[#333333] font-medium text-sm transition-all text-center"
            >
              กลับหน้าแรก
            </Link>
            <Link
              href="/orders"
              className="flex-1 py-3.5 px-4 rounded-xl bg-[#E0A800] hover:bg-[#c98e10] text-white font-bold text-sm transition-all text-center shadow-xs"
            >
              ดูสถานะออเดอร์
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // EMPTY CART VIEW
  // ==========================================
  if (cartItems.length === 0 && !successId) {
    return (
      <div className="min-h-[70vh] bg-[#FAFAFA] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white border border-gray-200/80 rounded-3xl p-10 text-center shadow-xs">
          <p className="text-[#2d2d2d] font-semibold text-lg mb-2">
            ตะกร้าสินค้าของคุณว่างเปล่า
          </p>
          <p className="text-gray-500 text-sm mb-6">
            เลือกเมนูอาหารที่ชอบแล้วกลับมาทำรายการอีกครั้ง
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-[#E0A800] hover:bg-[#c98e10] text-white font-bold text-sm transition-all shadow-xs"
          >
            กลับไปเลือกสินค้า
          </Link>
        </div>
      </div>
    );
  }

  // ==========================================
  // MAIN CHECKOUT VIEW (ULTRA-MINIMALIST & MEAL KITS BRAND THEME)
  // ==========================================
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#333333] pb-20">
      {/* Top Header */}
      <div className="border-b border-gray-200/70 bg-white">
        <div className="container mx-auto max-w-5xl px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link
            href="/cart"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-gray-500 hover:text-[#2d2d2d] transition-colors"
          >
            <ArrowLeft size={16} />
            <span>กลับไปตะกร้าสินค้า</span>
          </Link>
          <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
            <Lock size={13} className="text-gray-500" />
            <span>การชำระเงินปลอดภัย 100%</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-5xl px-4 sm:px-6 pt-8 sm:pt-12">
        {/* Page Title */}
        <div className="mb-8 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#2d2d2d]">
            ชำระเงิน
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            กรุณากรอกข้อมูลการจัดส่งและเลือกวิธีการชำระเงิน
          </p>
        </div>

        {/* Main Grid: Left Column (Details) / Right Column (Summary) */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Form & Payment */}
          <div className="lg:col-span-7 space-y-8">
            <form id="checkout-form" onSubmit={handleSubmit} className="space-y-8">
              {/* SECTION 1: ORDER TYPE */}
              <div className="bg-white border border-gray-200/80 rounded-2xl p-6 sm:p-8 shadow-2xs space-y-6">
                <div>
                  <h2 className="text-base sm:text-lg font-semibold text-[#2d2d2d] tracking-tight">
                    รูปแบบการสั่งซื้อ
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    เลือกว่าต้องการสั่งครั้งเดียวหรือสมัครรับวัตถุดิบเป็นประจำ
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label
                    onClick={() => updateField("orderType", "one-time")}
                    className={`cursor-pointer border rounded-xl p-4 transition-all flex items-center justify-between ${
                      form.orderType === "one-time"
                        ? "border-[#E0A800] bg-[#E0A800]/[0.035]"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                          form.orderType === "one-time"
                            ? "border-[#E0A800] bg-[#E0A800]"
                            : "border-gray-300"
                        }`}
                      >
                        {form.orderType === "one-time" && (
                          <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                        )}
                      </div>
                      <span className="text-sm font-medium text-[#2d2d2d]">
                        สั่งครั้งเดียว
                      </span>
                    </div>
                  </label>

                  <label
                    onClick={() => updateField("orderType", "subscription")}
                    className={`cursor-pointer border rounded-xl p-4 transition-all flex items-center justify-between ${
                      form.orderType === "subscription"
                        ? "border-[#E0A800] bg-[#E0A800]/[0.035]"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                          form.orderType === "subscription"
                            ? "border-[#E0A800] bg-[#E0A800]"
                            : "border-gray-300"
                        }`}
                      >
                        {form.orderType === "subscription" && (
                          <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                        )}
                      </div>
                      <div>
                        <span className="text-sm font-medium text-[#2d2d2d] block">
                          สั่งประจำ
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold bg-[#E0A800]/15 text-[#8a5309] px-2 py-0.5 rounded-md">
                      สะดวก
                    </span>
                  </label>
                </div>

                {form.orderType === "subscription" && (
                  <div className="pt-2 border-t border-gray-100 space-y-3">
                    <label className="block text-xs font-medium text-[#333333]">
                      รอบการจัดส่ง
                    </label>
                    <select
                      value={form.deliveryFrequency}
                      onChange={(e) => updateField("deliveryFrequency", e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#2d2d2d] focus:outline-none focus:border-[#E0A800] transition-colors"
                    >
                      <option value="weekly">ทุกสัปดาห์ (Weekly)</option>
                      <option value="biweekly">ทุก 2 สัปดาห์ (Bi-weekly)</option>
                      <option value="monthly">ทุกเดือน (Monthly)</option>
                    </select>
                    <p className="text-xs text-gray-500 flex items-center gap-1.5">
                      <Clock size={13} className="text-[#E0A800] shrink-0" />
                      ระบบจะทำการจัดส่งวัตถุดิบตามรอบระยะเวลาที่คุณเลือก
                    </p>
                  </div>
                )}
              </div>

              {/* SECTION 2: SHIPPING ADDRESS */}
              <div className="bg-white border border-gray-200/80 rounded-2xl p-6 sm:p-8 shadow-2xs space-y-6">
                <div>
                  <h2 className="text-base sm:text-lg font-semibold text-[#2d2d2d] tracking-tight">
                    ข้อมูลจัดส่ง
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    ที่อยู่สำหรับจัดส่งชุดวัตถุดิบอาหารแบบควบคุมอุณหภูมิ
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">
                      ชื่อ-นามสกุลผู้รับ <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={50}
                      value={form.customerName}
                      onChange={(e) => updateField("customerName", e.target.value.slice(0, 50))}
                      placeholder="เช่น ธนกฤต นำชัยมาหา"
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#2d2d2d] placeholder:text-gray-400 focus:outline-none focus:border-[#E0A800] focus:ring-1 focus:ring-[#E0A800] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">
                      เบอร์โทรศัพท์ติดต่อ <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={form.customerPhone}
                      onChange={(e) => {
                        const onlyNums = e.target.value.replace(/[^0-9]/g, "");
                        updateField("customerPhone", onlyNums.slice(0, 10));
                      }}
                      placeholder="064-xxx-xxxx"
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#2d2d2d] placeholder:text-gray-400 focus:outline-none focus:border-[#E0A800] focus:ring-1 focus:ring-[#E0A800] transition-all font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">
                      ที่อยู่จัดส่งครบถ้วน <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={3}
                      maxLength={150}
                      value={form.shippingAddress}
                      onChange={(e) => updateField("shippingAddress", e.target.value.slice(0, 150))}
                      placeholder="บ้านเลขที่ ซอย ถนน แขวง/ตำบล เขต/อำเภอ จังหวัด รหัสไปรษณีย์"
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#2d2d2d] placeholder:text-gray-400 focus:outline-none focus:border-[#E0A800] focus:ring-1 focus:ring-[#E0A800] transition-all resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 3: PAYMENT METHOD */}
              <div className="bg-white border border-gray-200/80 rounded-2xl p-6 sm:p-8 shadow-2xs space-y-6">
                <div>
                  <h2 className="text-base sm:text-lg font-semibold text-[#2d2d2d] tracking-tight">
                    วิธีการชำระเงิน
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    เลือกช่องทางที่สะดวก ไม่มีค่าธรรมเนียมเพิ่มเติม
                  </p>
                </div>

                <div className="space-y-3">
                  {/* PromptPay Option */}
                  <div
                    onClick={() => setPaymentMethod("promptpay")}
                    className={`cursor-pointer border rounded-2xl p-5 transition-all ${
                      paymentMethod === "promptpay"
                        ? "border-[#E0A800] bg-[#E0A800]/[0.035]"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                            paymentMethod === "promptpay"
                              ? "border-[#E0A800] bg-[#E0A800]"
                              : "border-gray-300"
                          }`}
                        >
                          {paymentMethod === "promptpay" && (
                            <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                          )}
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-medium text-[#2d2d2d]">
                            สแกน QR พร้อมเพย์
                          </span>
                          <div className="bg-white border border-gray-200 rounded px-2 py-0.5 flex items-center shadow-2xs">
                            <img
                              src="https://upload.wikimedia.org/wikipedia/commons/c/c5/PromptPay-logo.png"
                              alt="PromptPay"
                              className="h-4 w-auto object-contain"
                            />
                          </div>
                          <span className="text-[11px] bg-emerald-50 text-emerald-700 font-medium px-2 py-0.5 rounded-md">
                            ฟรีค่าธรรมเนียม
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-[#8a5309]">
                        แนะนำ
                      </span>
                    </div>

                    {/* Expandable Minimalist QR display */}
                    {paymentMethod === "promptpay" && (
                      <div className="mt-5 pt-5 border-t border-gray-100">
                        <div className="max-w-xs mx-auto bg-[#193B68] text-white rounded-2xl p-5 text-center shadow-xs">
                          {/* Official Thai QR Payment Blue Header with PromptPay Logo */}
                          <div className="flex items-center justify-between border-b border-blue-400/30 pb-3 mb-4">
                            <div className="flex items-center gap-2">
                              <div className="bg-white rounded-lg px-2 py-1 flex items-center justify-center shrink-0">
                                <img
                                  src="https://upload.wikimedia.org/wikipedia/commons/c/c5/PromptPay-logo.png"
                                  alt="PromptPay"
                                  className="h-5 w-auto object-contain"
                                />
                              </div>
                              <span className="text-xs font-bold tracking-wide text-white">
                                THAI QR PAYMENT
                              </span>
                            </div>
                            <span className="text-[10px] text-blue-200 font-mono">
                              0% FEE
                            </span>
                          </div>

                          {/* Minimalist QR Image Box */}
                          <div className="bg-white p-4 rounded-xl flex items-center justify-center mb-4">
                            <div className="w-44 h-44 flex items-center justify-center">
                              {!qrImgError ? (
                                <img
                                  src={`https://promptpay.io/${STORE_PROMPTPAY_ID}/${cartTotal}.png`}
                                  alt="PromptPay QR Code"
                                  className="w-full h-full object-contain"
                                  onError={() => setQrImgError(true)}
                                />
                              ) : (
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
                              )}
                            </div>
                          </div>

                          <div className="space-y-1">
                            <p className="text-xs text-blue-200">
                              บัญชีรับเงิน: ธนกฤต นำชัยมาหา
                            </p>
                            <p className="text-sm font-mono font-bold text-white">
                              {STORE_PROMPTPAY_ID}
                            </p>
                          </div>

                          <div className="mt-4 pt-3 border-t border-blue-400/30 flex items-center justify-between text-xs">
                            <span className="text-blue-200">ยอดชำระ</span>
                            <span className="font-mono font-bold text-[#E0A800] text-sm">
                              ฿{cartTotal.toLocaleString()}
                            </span>
                          </div>
                        </div>

                        <p className="text-center text-xs text-gray-500 mt-3">
                          สแกนจ่ายเสร็จแล้ว กดยืนยันคำสั่งซื้อด้านล่างได้ทันที โดยไม่ต้องแนบสลิป
                        </p>
                      </div>
                    )}
                  </div>

                  {/* COD Option */}
                  <div
                    onClick={() => setPaymentMethod("cod")}
                    className={`cursor-pointer border rounded-2xl p-5 transition-all ${
                      paymentMethod === "cod"
                        ? "border-[#E0A800] bg-[#E0A800]/[0.035]"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                            paymentMethod === "cod"
                              ? "border-[#E0A800] bg-[#E0A800]"
                              : "border-gray-300"
                          }`}
                        >
                          {paymentMethod === "cod" && (
                            <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-[#2d2d2d]">
                            เก็บเงินปลายทาง (COD)
                          </span>
                          <span className="text-[11px] bg-gray-100 text-gray-600 font-medium px-2 py-0.5 rounded-md">
                            เงินสด
                          </span>
                        </div>
                      </div>
                    </div>

                    {paymentMethod === "cod" && (
                      <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500 space-y-1">
                        <p className="font-medium text-gray-700">
                          ชำระเงินสดกับพนักงานจัดส่งที่หน้าบ้าน
                        </p>
                        <p>
                          กรุณาเตรียมเงินสดจำนวน{" "}
                          <span className="font-mono font-bold text-[#2d2d2d]">
                            ฿{cartTotal.toLocaleString()}
                          </span>{" "}
                          พอดี เพื่อความสะดวกรวดเร็ว
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Right Column: Order Summary (NOT STICKY) */}
          <div className="lg:col-span-5">
            <div className="bg-white border border-gray-200/80 rounded-2xl p-6 sm:p-7 shadow-2xs">
              {/* Header */}
              <div className="flex items-center justify-between pb-5 border-b border-gray-200/60 mb-5">
                <h2 className="text-base font-semibold text-[#2d2d2d]">
                  สรุปคำสั่งซื้อ
                </h2>
                <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
                  {cartItems.length} รายการ
                </span>
              </div>

              {/* Items List */}
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start justify-between gap-3 text-sm"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <span className="font-mono font-bold text-xs bg-[#E0A800]/15 text-[#8a5309] px-2 py-0.5 rounded-md shrink-0 mt-0.5">
                        {item.quantity}×
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <p className="font-medium text-[#2d2d2d] truncate">
                            {item.menuName}
                          </p>
                          {item.price === 1 && (
                            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                              TEST 1฿
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5">
                          สำหรับ {item.servings} ท่าน
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="font-mono font-semibold text-[#2d2d2d]">
                        ฿{(item.price * item.quantity).toLocaleString()}
                      </p>
                      {item.quantity > 1 && (
                        <p className="text-[11px] text-gray-400 font-mono">
                          (฿{item.price.toLocaleString()}/ชิ้น)
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Cost Breakdown */}
              <div className="border-t border-gray-200/60 pt-4 space-y-2.5 text-sm mb-6">
                <div className="flex justify-between items-center text-gray-600">
                  <span className="text-xs sm:text-sm">ค่าอาหารรวม</span>
                  <span className="font-mono font-medium text-[#2d2d2d]">
                    ฿{cartTotal.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between items-center text-gray-600">
                  <span className="text-xs sm:text-sm flex items-center gap-1.5">
                    <Truck size={14} className="text-gray-400" />
                    ค่าจัดส่งแบบควบคุมอุณหภูมิ
                  </span>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                    ฟรี
                  </span>
                </div>

                <div className="border-t border-gray-200/60 pt-4 flex justify-between items-baseline">
                  <div>
                    <span className="font-bold text-[#2d2d2d] text-sm block">
                      ยอดรวมทั้งสิ้น
                    </span>
                    <span className="text-[11px] text-gray-400">
                      ราคารวมภาษีมูลค่าเพิ่มแล้ว
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-extrabold text-2xl sm:text-3xl text-[#E0A800]">
                      ฿{cartTotal.toLocaleString()}
                    </span>
                    <span className="text-xs font-bold text-gray-600 ml-1">
                      บาท
                    </span>
                  </div>
                </div>
              </div>

              {/* Submit Button (Mustard Gold Signature) */}
              <button
                type="submit"
                form="checkout-form"
                disabled={submitting || !isFormValid}
                className={`w-full py-4 px-6 rounded-xl font-bold text-sm sm:text-base transition-all duration-200 flex items-center justify-center gap-2 ${
                  isFormValid && !submitting
                    ? "bg-[#E0A800] hover:bg-[#c98e10] text-white shadow-md hover:shadow-lg active:scale-[0.99]"
                    : "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed"
                }`}
              >
                {submitting ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    <span>กำลังดำเนินการ...</span>
                  </>
                ) : (
                  <>
                    <span>ยืนยันการสั่งซื้อและชำระเงิน</span>
                    <ChevronRight size={18} />
                  </>
                )}
              </button>

              {!isFormValid && (
                <p className="text-[11px] text-gray-400 text-center mt-3">
                  * กรุณากรอกชื่อ เบอร์โทร และที่อยู่จัดส่งทางซ้ายให้ครบถ้วน
                </p>
              )}

              {/* Trust Badges */}
              <div className="mt-6 pt-5 border-t border-gray-100 flex flex-wrap items-center justify-center gap-4 text-[11px] text-gray-400 font-medium">
                <span className="inline-flex items-center gap-1">
                  <ShieldCheck size={13} className="text-gray-500" /> ปลอดภัย 100%
                </span>
                <span>•</span>
                <span className="inline-flex items-center gap-1">
                  <Sparkles size={13} className="text-[#E0A800]" /> วัตถุดิบสดใหม่
                </span>
                <span>•</span>
                <span className="inline-flex items-center gap-1">
                  <Truck size={13} className="text-gray-500" /> จัดส่งตรงเวลา
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
