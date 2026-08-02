"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Order } from "@/types";
import {
  ShoppingBag,
  Clock,
  Package,
  Truck,
  Inbox,
  ArrowLeft,
  Star,
  Calendar,
  Sparkles,
  ArrowRight,
  QrCode,
  Wallet,
  CheckCircle2,
  MapPin,
  ChefHat,
} from "lucide-react";
import ReviewModal from "@/components/ReviewModal";

// ─── Order Tracking Timeline Component ───────────────────────────────────────
const STEPS = [
  {
    key: "รอดำเนินการ",
    label: "รับออเดอร์แล้ว",
    sublabel: "ระบบได้รับคำสั่งซื้อของคุณ",
    icon: CheckCircle2,
    color: "text-red-500",
    bg: "bg-red-50",
    ring: "ring-red-400",
    bar: "bg-red-400",
    eta: "ทันที",
  },
  {
    key: "กำลังจัดเตรียม",
    label: "กำลังเตรียมวัตถุดิบ",
    sublabel: "เชฟกำลังจัดชุดวัตถุดิบให้คุณ",
    icon: ChefHat,
    color: "text-amber-500",
    bg: "bg-amber-50",
    ring: "ring-amber-400",
    bar: "bg-amber-400",
    eta: "1–2 ชั่วโมง",
  },
  {
    key: "จัดส่งแล้ว",
    label: "จัดส่งแล้ว",
    sublabel: "พัสดุกำลังมุ่งหน้าหาคุณ",
    icon: MapPin,
    color: "text-emerald-500",
    bg: "bg-emerald-50",
    ring: "ring-emerald-400",
    bar: "bg-emerald-400",
    eta: "ภายใน 24 ชม.",
  },
];

function getStepIndex(status: string) {
  return STEPS.findIndex((s) => s.key === status);
}

function OrderTimeline({ status }: { status: string }) {
  const currentIdx = getStepIndex(status);

  return (
    <div className="mt-4 px-2 pb-1">
      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-1.5">
        <Truck size={11} />
        ติดตามสถานะการจัดส่ง
      </p>

      <div className="relative flex items-start gap-0">
        {STEPS.map((step, idx) => {
          const isDone = idx <= currentIdx;
          const isActive = idx === currentIdx;
          const Icon = step.icon;

          return (
            <div key={step.key} className="flex-1 flex flex-col items-center relative">
              {/* Connector bar between steps */}
              {idx < STEPS.length - 1 && (
                <div className="absolute top-4 left-1/2 w-full h-0.5 bg-gray-100 z-0">
                  <div
                    className={`h-full transition-all duration-700 ease-out ${
                      idx < currentIdx ? step.bar : "bg-transparent"
                    }`}
                    style={{ width: idx < currentIdx ? "100%" : "0%" }}
                  />
                </div>
              )}

              {/* Step Icon Circle */}
              <div
                className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center ring-2 transition-all duration-500 ${
                  isDone
                    ? `${step.bg} ${step.ring} shadow-sm`
                    : "bg-gray-100 ring-gray-200"
                } ${isActive ? "scale-110 shadow-md" : ""}`}
              >
                {isActive ? (
                  <>
                    <span className={`absolute inset-0 rounded-full animate-ping opacity-30 ${step.bg}`} />
                    <Icon size={14} className={isDone ? step.color : "text-gray-400"} />
                  </>
                ) : (
                  <Icon size={14} className={isDone ? step.color : "text-gray-400"} />
                )}
              </div>

              {/* Step label */}
              <div className="mt-2 text-center px-1">
                <p
                  className={`text-[10px] font-bold leading-tight ${
                    isDone ? "text-[#2d2d2d]" : "text-gray-400"
                  } ${isActive ? "text-[#2d2d2d]" : ""}`}
                >
                  {step.label}
                </p>
                {isActive && (
                  <p className="text-[9px] text-gray-400 mt-0.5 leading-tight hidden sm:block">
                    {step.sublabel}
                  </p>
                )}
                {isActive && (
                  <span className="inline-block mt-1 text-[9px] font-semibold bg-[#E0A800]/10 text-[#b88a00] px-1.5 py-0.5 rounded-full">
                    ~ {step.eta}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const statusConfig: Record<
  string,
  { label: string; badge: string; icon: any }
> = {
  "รอดำเนินการ": {
    label: "รอดำเนินการ",
    badge: "bg-red-50 text-red-600 border border-red-200/80",
    icon: Clock,
  },
  "กำลังจัดเตรียม": {
    label: "กำลังจัดเตรียม",
    badge: "bg-amber-50 text-amber-700 border border-amber-200/80",
    icon: Package,
  },
  "จัดส่งแล้ว": {
    label: "จัดส่งแล้ว",
    badge: "bg-emerald-50 text-emerald-700 border border-emerald-200/80",
    icon: Truck,
  },
};

export default function UserOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReviewOrder, setSelectedReviewOrder] = useState<string | null>(
    null
  );

  const fetchOrders = (userId: string) => {
    fetch(`/api/orders/user/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/login");
      return;
    }
    const user = JSON.parse(storedUser);
    fetchOrders(user.id);

    const interval = setInterval(() => {
      if (document.visibilityState !== "visible") return;
      fetchOrders(user.id);
    }, 60000);

    return () => clearInterval(interval);
  }, [router]);

  // Current active orders: status is pending, preparing, OR delivered but not yet reviewed
  const currentOrders = useMemo(() => {
    return orders.filter(
      (o) =>
        o.status === "รอดำเนินการ" ||
        o.status === "กำลังจัดเตรียม" ||
        (o.status === "จัดส่งแล้ว" && !o.isReviewed)
    );
  }, [orders]);

  // Count of completed history orders to show on the navigation button
  const historyCount = useMemo(() => {
    return orders.filter((o) => o.status === "จัดส่งแล้ว" && o.isReviewed)
      .length;
  }, [orders]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("th-TH", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-[#fafbfc] pb-20">
      {/* Top Banner Header */}
      <div className="bg-white border-b border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-mustard-50 border border-mustard-200/60 text-mustard-800 text-xs font-semibold tracking-wide uppercase mb-2">
                <Sparkles size={13} className="text-mustard-600" />
                <span>MY ACTIVE ORDERS</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2d2d2d] tracking-tight flex items-center gap-3">
                <span>ออเดอร์ที่เพิ่งสั่ง</span>
                <span className="text-sm font-mono font-bold bg-[#2d2d2d] text-white px-2.5 py-1 rounded-xl">
                  {currentOrders.length}
                </span>
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                ติดตามสถานะอาหารที่กำลังจัดส่ง และออเดอร์ที่รอคุณรีวิว
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/orders/history"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white border border-gray-200/80 shadow-sm hover:bg-gray-50 text-[#2d2d2d] text-sm font-bold transition-all duration-200 group"
              >
                <ShoppingBag size={16} className="text-emerald-600" />
                <span>ประวัติการสั่งซื้อ ({historyCount})</span>
                <ArrowRight
                  size={15}
                  className="text-gray-400 group-hover:translate-x-0.5 transition-transform"
                />
              </Link>

              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-gray-100/80 hover:bg-gray-200/80 text-gray-700 hover:text-[#2d2d2d] text-sm font-medium transition-all duration-200"
              >
                <ArrowLeft size={16} />
                <span className="hidden sm:inline">กลับหน้าแรก</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-8">
        {/* Main Orders Container */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_4px_25px_rgba(0,0,0,0.03)] overflow-hidden animate-fade-in-up">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center">
              <span className="loading loading-spinner loading-lg text-mustard-500 mb-4"></span>
              <p className="text-sm text-gray-400">กำลังโหลดคำสั่งซื้อ...</p>
            </div>
          ) : currentOrders.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center text-center px-4">
              <div className="w-16 h-16 rounded-3xl bg-gray-100 flex items-center justify-center text-gray-400 mb-4">
                <Inbox size={32} />
              </div>
              <p className="text-base font-bold text-[#2d2d2d]">
                ไม่มีออเดอร์ที่กำลังดำเนินการในขณะนี้
              </p>
              <p className="text-xs text-gray-400 mt-1 mb-6 max-w-sm">
                ออเดอร์ที่จัดส่งและคุณทำการรีวิวเรียบร้อยแล้ว จะถูกย้ายไปเก็บที่หน้า &ldquo;ประวัติการสั่งซื้อ&rdquo; ครับ
              </p>
              <div className="flex items-center gap-3">
                {historyCount > 0 && (
                  <Link
                    href="/orders/history"
                    className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-bold text-[#2d2d2d] transition-colors"
                  >
                    ดูประวัติการสั่งซื้อ ({historyCount}) →
                  </Link>
                )}
                <Link
                  href="/"
                  className="px-6 py-2.5 rounded-xl bg-mustard-500 hover:bg-mustard-600 text-white text-xs font-bold shadow-sm transition-all"
                >
                  เริ่มสั่งอาหารเลย
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* Unified Card View — All screen sizes */}
              <div className="divide-y divide-gray-100">
                {currentOrders.map((order) => {
                  const status =
                    statusConfig[order.status] || {
                      label: order.status,
                      badge: "bg-gray-100 text-gray-700 border border-gray-200",
                      icon: Clock,
                    };
                  const StatusIcon = status.icon;

                  return (
                    <div
                      key={order.id}
                      className="p-5 sm:p-6 hover:bg-gray-50/50 transition-colors"
                    >
                      {/* ─── Top Row: Order ID + Status Badge + Price ─── */}
                      <div className="flex flex-wrap justify-between items-start gap-3 mb-4">
                        <div>
                          <div className="inline-flex items-center gap-1.5 font-mono font-bold text-xs bg-gray-100 text-[#2d2d2d] px-2.5 py-1 rounded-lg">
                            #{order.id.slice(0, 8)}
                          </div>
                          <div className="text-xs text-gray-400 mt-1.5 flex items-center gap-1">
                            <Calendar size={11} />
                            <span>{formatDate(order.createdAt)}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap justify-end">
                          <span className="font-bold text-[#2d2d2d] text-base">
                            ฿{order.totalPrice.toLocaleString()}
                          </span>
                          <div
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold ${status.badge}`}
                          >
                            <StatusIcon size={13} />
                            <span>{status.label}</span>
                          </div>
                        </div>
                      </div>

                      {/* ─── Menu Items ─── */}
                      <div className="bg-gray-50/70 rounded-2xl p-3 space-y-1.5 mb-1">
                        {order.items?.map((item, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between text-xs"
                          >
                            <div className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#E0A800] shrink-0" />
                              <span className="font-semibold text-[#2d2d2d]">
                                {item.menuName}
                              </span>
                            </div>
                            <span className="text-gray-500 font-mono">
                              ×{item.quantity}
                              <span className="text-gray-400 ml-1 font-sans">({item.servings} คน)</span>
                            </span>
                          </div>
                        ))}
                        <div className="flex items-center gap-2 pt-1.5 mt-1.5 border-t border-gray-200/60">
                          {order.paymentMethod && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-gray-600 bg-white border border-gray-100 px-2 py-0.5 rounded-md shadow-sm">
                              {order.paymentMethod.includes("PromptPay") || order.paymentMethod.includes("พร้อมเพย์") ? (
                                <><QrCode className="w-3 h-3 text-[#E0A800]" /><span>พร้อมเพย์ (QR)</span></>
                              ) : (
                                <><Wallet className="w-3 h-3 text-[#E0A800]" /><span>ปลายทาง COD</span></>
                              )}
                            </span>
                          )}
                          {order.paymentSlipUrl && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>แนบสลิปแล้ว</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* ─── 🚚 Order Tracking Timeline ─── */}
                      <div className="bg-gradient-to-br from-gray-50/80 to-white border border-gray-100 rounded-2xl px-4 pt-4 pb-3 mt-3">
                        <OrderTimeline status={order.status} />
                      </div>

                      {/* ─── Review Button ─── */}
                      {order.status === "จัดส่งแล้ว" && !order.isReviewed && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <button
                            onClick={() => setSelectedReviewOrder(order.id)}
                            className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#E0A800] hover:bg-[#c98e10] text-white text-xs font-semibold shadow-sm transition-all animate-pulse"
                          >
                            <Star size={15} className="fill-white" />
                            <span>รีวิวเมนูนี้เลย ✨</span>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      <ReviewModal
        orderId={selectedReviewOrder || ""}
        isOpen={!!selectedReviewOrder}
        onClose={() => setSelectedReviewOrder(null)}
        onSuccess={() => {
          const storedUser = localStorage.getItem("user");
          if (storedUser) {
            fetchOrders(JSON.parse(storedUser).id);
          }
        }}
      />
    </div>
  );
}

