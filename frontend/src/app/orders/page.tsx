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
  ChevronRight,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import ReviewModal from "@/components/ReviewModal";

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
  const [statusFilter, setStatusFilter] = useState<string>("all");

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

    // Auto-refresh orders every 5 seconds for a real-time feel
    const interval = setInterval(() => {
      fetchOrders(user.id);
    }, 5000);

    return () => clearInterval(interval);
  }, [router]);

  // Filter orders by status tab
  const filteredOrders = useMemo(() => {
    if (statusFilter === "all") return orders;
    return orders.filter((o) => o.status === statusFilter);
  }, [orders, statusFilter]);

  const statusCounts = useMemo(
    () =>
      orders.reduce(
        (acc, o) => {
          acc[o.status] = (acc[o.status] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      ),
    [orders]
  );

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
                <span>MY ORDERS</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2d2d2d] tracking-tight flex items-center gap-3">
                <span>ประวัติการสั่งซื้อ</span>
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                ติดตามสถานะออเดอร์ Meal Kits ทั้งหมดของคุณได้ในที่เดียว
              </p>
            </div>

            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-gray-200/80 shadow-sm hover:bg-gray-50 text-gray-700 hover:text-[#2d2d2d] text-sm font-medium transition-all duration-200"
            >
              <ArrowLeft size={16} />
              <span>กลับสู่หน้าแรก</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-8">
        {/* Status Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6">
          {[
            { key: "all", label: "ทั้งหมด", count: orders.length },
            {
              key: "รอดำเนินการ",
              label: "รอดำเนินการ",
              count: statusCounts["รอดำเนินการ"] || 0,
            },
            {
              key: "กำลังจัดเตรียม",
              label: "กำลังจัดเตรียม",
              count: statusCounts["กำลังจัดเตรียม"] || 0,
            },
            {
              key: "จัดส่งแล้ว",
              label: "จัดส่งแล้ว",
              count: statusCounts["จัดส่งแล้ว"] || 0,
            },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setStatusFilter(item.key)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 ${
                statusFilter === item.key
                  ? "bg-[#2d2d2d] text-white shadow-sm"
                  : "bg-white border border-gray-200/80 text-gray-600 hover:bg-gray-50"
              }`}
            >
              <span>{item.label}</span>
              <span
                className={`px-1.5 py-0.5 rounded-md text-[10px] ${
                  statusFilter === item.key
                    ? "bg-white/20 text-white"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {item.count}
              </span>
            </button>
          ))}
        </div>

        {/* Main Orders Container */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_4px_25px_rgba(0,0,0,0.03)] overflow-hidden animate-fade-in-up">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center">
              <span className="loading loading-spinner loading-lg text-mustard-500 mb-4"></span>
              <p className="text-sm text-gray-400">กำลังโหลดประวัติการสั่งซื้อ...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center text-center px-4">
              <div className="w-16 h-16 rounded-3xl bg-gray-100 flex items-center justify-center text-gray-400 mb-4">
                <Inbox size={32} />
              </div>
              <p className="text-base font-bold text-[#2d2d2d]">
                {statusFilter !== "all"
                  ? "ไม่พบออเดอร์ในสถานะนี้"
                  : "ยังไม่มีประวัติการสั่งซื้อ"}
              </p>
              <p className="text-xs text-gray-400 mt-1 mb-6 max-w-sm">
                {statusFilter !== "all"
                  ? "ลองเปลี่ยนตัวกรองเพื่อดูรายการทั้งหมดในสถานะอื่น"
                  : "คุณยังไม่เคยสั่ง Meal Kits กับเรา ลองสั่งชุดอาหารอร่อย ๆ ไปลองทำดูสิครับ!"}
              </p>
              {statusFilter !== "all" ? (
                <button
                  onClick={() => setStatusFilter("all")}
                  className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-semibold text-gray-700 transition-colors"
                >
                  ดูออเดอร์ทั้งหมด
                </button>
              ) : (
                <Link
                  href="/"
                  className="px-6 py-3 rounded-2xl bg-mustard-500 hover:bg-mustard-600 text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all"
                >
                  เริ่มสั่งอาหารเลย
                </Link>
              )}
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
                    {filteredOrders.map((order) => {
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
                            <div className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-charcoal-800 bg-gray-100/90 px-2.5 py-1 rounded-lg">
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
                                  <span className="w-1.5 h-1.5 rounded-full bg-mustard-500 shrink-0" />
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
                            <span className="font-bold text-[#2d2d2d] text-base">
                              ฿{order.totalPrice.toLocaleString()}
                            </span>
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

                          {/* Review Action */}
                          <td className="px-6 py-4 align-top text-right">
                            {order.status === "จัดส่งแล้ว" &&
                              !order.isReviewed && (
                                <button
                                  onClick={() =>
                                    setSelectedReviewOrder(order.id)
                                  }
                                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-mustard-500 hover:bg-mustard-600 text-white text-xs font-semibold shadow-sm hover:shadow transition-all duration-200 active:scale-[0.98]"
                                >
                                  <Star
                                    size={14}
                                    className="fill-white text-white"
                                  />
                                  <span>เขียนรีวิว</span>
                                </button>
                              )}
                            {order.status === "จัดส่งแล้ว" &&
                              order.isReviewed && (
                                <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-medium">
                                  <span>รีวิวเรียบร้อย</span>
                                </span>
                              )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile List View */}
              <div className="md:hidden divide-y divide-gray-100">
                {filteredOrders.map((order) => {
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

                      {order.status === "จัดส่งแล้ว" && !order.isReviewed && (
                        <div className="mt-4 pt-3 border-t border-gray-100">
                          <button
                            onClick={() => setSelectedReviewOrder(order.id)}
                            className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-mustard-500 hover:bg-mustard-600 text-white text-xs font-semibold shadow-sm transition-all"
                          >
                            <Star size={15} className="fill-white" />
                            <span>รีวิวเมนูนี้เลย</span>
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

