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
  Calendar,
  Sparkles,
  CheckCircle2,
  QrCode,
  Wallet,
} from "lucide-react";

const statusConfig: Record<
  string,
  { label: string; badge: string; icon: any }
> = {
  "จัดส่งแล้ว": {
    label: "จัดส่งแล้ว",
    badge: "bg-emerald-50 text-emerald-700 border border-emerald-200/80",
    icon: Truck,
  },
};

export default function OrderHistoryPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

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
      fetchOrders(user.id);
    }, 5000);

    return () => clearInterval(interval);
  }, [router]);

  // Order history: ONLY orders that are delivered AND reviewed by customer
  const historyOrders = useMemo(() => {
    return orders.filter(
      (o) => o.status === "จัดส่งแล้ว" && o.isReviewed
    );
  }, [orders]);

  // Active orders count for link button
  const activeCount = useMemo(() => {
    return orders.filter(
      (o) =>
        o.status === "รอดำเนินการ" ||
        o.status === "กำลังจัดเตรียม" ||
        (o.status === "จัดส่งแล้ว" && !o.isReviewed)
    ).length;
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
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-800 text-xs font-semibold tracking-wide uppercase mb-2">
                <Sparkles size={13} className="text-emerald-600" />
                <span>MY COMPLETED ORDERS</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2d2d2d] tracking-tight flex items-center gap-3">
                <span>ประวัติการสั่งซื้อ</span>
                <span className="text-sm font-mono font-bold bg-emerald-600 text-white px-2.5 py-1 rounded-xl">
                  {historyOrders.length}
                </span>
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                รายการออเดอร์ Meal Kits ที่จัดส่งถึงมือคุณ และทำการรีวิวเสร็จสิ้นเรียบร้อยแล้ว
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/orders"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#2d2d2d] text-white shadow-md hover:bg-[#3d3d3d] text-sm font-bold transition-all duration-200"
              >
                <Clock size={16} className="text-mustard-400" />
                <span>ออเดอร์ปัจจุบัน ({activeCount})</span>
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
              <span className="loading loading-spinner loading-lg text-emerald-500 mb-4"></span>
              <p className="text-sm text-gray-400">กำลังโหลดประวัติการสั่งซื้อ...</p>
            </div>
          ) : historyOrders.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center text-center px-4">
              <div className="w-16 h-16 rounded-3xl bg-gray-100 flex items-center justify-center text-gray-400 mb-4">
                <Inbox size={32} />
              </div>
              <p className="text-base font-bold text-[#2d2d2d]">
                ยังไม่มีประวัติการสั่งซื้อที่เสร็จสิ้น
              </p>
              <p className="text-xs text-gray-400 mt-1 mb-6 max-w-sm">
                เมื่อคุณได้รับอาหารจากออเดอร์ปัจจุบันและทำการเขียนรีวิวเมนูเรียบร้อยแล้ว ประวัติคำสั่งซื้อจะถูกย้ายมาแสดงที่นี่ครับ
              </p>
              <div className="flex items-center gap-3">
                <Link
                  href="/orders"
                  className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-bold text-[#2d2d2d] transition-colors"
                >
                  ← ดูออเดอร์ปัจจุบัน ({activeCount})
                </Link>
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
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/80 text-gray-500 uppercase text-[11px] font-semibold tracking-wider border-b border-gray-100">
                      <th className="px-6 py-4">รหัสออเดอร์</th>
                      <th className="px-6 py-4">รายการเมนู</th>
                      <th className="px-6 py-4">ยอดชำระ</th>
                      <th className="px-6 py-4">สถานะ</th>
                      <th className="px-6 py-4 text-right">การกระทำ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm">
                    {historyOrders.map((order) => {
                      const status =
                        statusConfig[order.status] || {
                          label: order.status,
                          badge:
                            "bg-gray-100 text-gray-700 border border-gray-200",
                          icon: Clock,
                        };
                      const StatusIcon = status.icon;

                      return (
                        <tr
                          key={order.id}
                          className="hover:bg-gray-50/60 transition-colors group"
                        >
                          {/* Order ID & Date */}
                          <td className="px-6 py-4 align-top">
                            <div className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-[#2d2d2d] bg-gray-100/90 px-2.5 py-1 rounded-lg">
                              #{order.id.slice(0, 8)}
                            </div>
                            <div className="text-xs text-gray-400 flex items-center gap-1 mt-1.5">
                              <Calendar size={12} />
                              <span>{formatDate(order.createdAt)}</span>
                            </div>
                          </td>

                          {/* Menu items */}
                          <td className="px-6 py-4 align-top">
                            <div className="space-y-1">
                              {order.items?.map((item, i) => (
                                <div
                                  key={i}
                                  className="flex items-center gap-2 text-xs"
                                >
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                                  <span className="font-semibold text-[#2d2d2d]">
                                    {item.menuName}
                                  </span>
                                  <span className="text-gray-400 font-mono">
                                    ×{item.quantity}
                                  </span>
                                  <span className="text-[11px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                                    {item.servings} คน
                                  </span>
                                </div>
                              ))}
                            </div>
                          </td>

                          {/* Price */}
                          <td className="px-6 py-4 align-top">
                            <span className="font-bold text-[#2d2d2d] text-base block">
                              ฿{order.totalPrice.toLocaleString()}
                            </span>
                            {order.paymentMethod && (
                              <span className="inline-flex items-center gap-1 mt-1 text-[11px] font-semibold text-charcoal-700 bg-gray-100 px-2 py-0.5 rounded-md">
                                {order.paymentMethod.includes("PromptPay") || order.paymentMethod.includes("พร้อมเพย์") ? (
                                  <>
                                    <QrCode className="w-3 h-3 text-mustard-600" />
                                    <span>พร้อมเพย์ (QR)</span>
                                  </>
                                ) : (
                                  <>
                                    <Wallet className="w-3 h-3 text-mustard-600" />
                                    <span>ปลายทาง COD</span>
                                  </>
                                )}
                              </span>
                            )}
                            {order.paymentSlipUrl && (
                              <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                <span>แนบสลิปแล้ว</span>
                              </span>
                            )}
                          </td>

                          {/* Status Badge */}
                          <td className="px-6 py-4 align-top">
                            <div
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold ${status.badge}`}
                            >
                              <StatusIcon size={14} />
                              <span>{status.label}</span>
                            </div>
                          </td>

                          {/* Reviewed status badge */}
                          <td className="px-6 py-4 align-top text-right">
                            <span className="inline-flex items-center gap-1.5 text-xs text-emerald-600 font-bold bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200/60 shadow-xs">
                              <CheckCircle2 size={14} className="text-emerald-500" />
                              <span>รีวิวเรียบร้อยแล้ว</span>
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile List View */}
              <div className="md:hidden divide-y divide-gray-100">
                {historyOrders.map((order) => {
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
                      className="p-5 hover:bg-gray-50/50 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="inline-flex items-center gap-1 font-mono font-bold text-xs bg-gray-100 text-[#2d2d2d] px-2.5 py-1 rounded-lg">
                            #{order.id.slice(0, 8)}
                          </div>
                          <div className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                            <Calendar size={11} />
                            <span>{formatDate(order.createdAt)}</span>
                          </div>
                        </div>

                        <div
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold ${status.badge}`}
                        >
                          <StatusIcon size={13} />
                          <span>{status.label}</span>
                        </div>
                      </div>

                      <div className="bg-gray-50/70 rounded-2xl p-3 my-3 space-y-1.5">
                        {order.items?.map((item, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between text-xs"
                          >
                            <span className="font-semibold text-[#2d2d2d]">
                              {item.menuName}
                            </span>
                            <span className="text-gray-500">
                              ×{item.quantity} ({item.servings} คน)
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-between items-center pt-1">
                        <span className="text-xs text-gray-500 font-medium">
                          ยอดรวมทั้งสิ้น
                        </span>
                        <span className="font-bold text-[#2d2d2d] text-base">
                          ฿{order.totalPrice.toLocaleString()}
                        </span>
                      </div>

                      <div className="mt-3 pt-2 border-t border-gray-100 flex justify-end">
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-bold">
                          <CheckCircle2 size={14} />
                          <span>รีวิวเรียบร้อยแล้ว</span>
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
