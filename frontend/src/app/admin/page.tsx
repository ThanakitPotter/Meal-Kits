"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import type { Order } from "@/types";
import {
  RefreshCw,
  BarChart,
  ShoppingBag,
  Clock,
  Package,
  Truck,
  Inbox,
  Star,
  MessageSquare,
  Phone,
  Calendar,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  X,
  User,
} from "lucide-react";

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

const getNextDeliveryDate = (createdAt: string, frequency?: string) => {
  if (!frequency) return null;
  const date = new Date(createdAt);
  if (frequency === "weekly") date.setDate(date.getDate() + 7);
  else if (frequency === "biweekly") date.setDate(date.getDate() + 14);
  else if (frequency === "monthly") date.setMonth(date.getMonth() + 1);
  return date;
};

const statusOptions: Array<Order["status"]> = [
  "รอดำเนินการ",
  "กำลังจัดเตรียม",
  "จัดส่งแล้ว",
];

export default function AdminPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"orders" | "reviews">("orders");
  const [currentPage, setCurrentPage] = useState(1);
  const [currentReviewPage, setCurrentReviewPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const ITEMS_PER_PAGE = 15;

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/admin/login");
      return;
    }
    const user = JSON.parse(storedUser);
    if (user.role !== "admin") {
      router.push("/");
    }
  }, [router]);

  const fetchOrders = (showLoading = true) => {
    if (showLoading) setLoading(true);
    Promise.all([
      fetch("/api/orders").then((res) => res.json()),
      fetch("/api/reviews/all").then((res) => res.json()),
    ])
      .then(([ordersData, reviewsData]) => {
        setOrders(ordersData);
        if (Array.isArray(reviewsData)) setReviews(reviewsData);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders(true);

    // Auto-refresh every 5 seconds for real-time updates (silently without loader)
    const interval = setInterval(() => {
      fetchOrders(false);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleStatusChange = async (
    orderId: string,
    newStatus: Order["status"]
  ) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        const updated = await res.json();
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? updated : o))
        );
      }
    } catch {
      alert("อัปเดตสถานะไม่สำเร็จ");
    } finally {
      setUpdatingId(null);
    }
  };

  const totalRevenue = useMemo(
    () => orders.reduce((sum, o) => sum + o.totalPrice, 0),
    [orders]
  );

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

  // Filtered orders based on Search & Status Pill
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchStatus =
        statusFilter === "all" || order.status === statusFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        order.id.toLowerCase().includes(q) ||
        order.customerName?.toLowerCase().includes(q) ||
        order.customerPhone?.includes(q) ||
        order.items?.some((item) =>
          item.menuName.toLowerCase().includes(q)
        );
      return matchStatus && matchQuery;
    });
  }, [orders, statusFilter, searchQuery]);

  // Reset page when filter/search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("th-TH", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE) || 1;
  const currentOrders = filteredOrders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totalReviewPages =
    Math.ceil(reviews.length / ITEMS_PER_PAGE) || 1;
  const currentReviews = reviews.slice(
    (currentReviewPage - 1) * ITEMS_PER_PAGE,
    currentReviewPage * ITEMS_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-[#fafbfc] pb-16">
      {/* ─── Top Header Section ─── */}
      <div className="bg-white border-b border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-charcoal-50 border border-charcoal-200/60 text-charcoal-700 text-xs font-semibold tracking-wide uppercase mb-2">
                <ShieldCheck size={13} className="text-mustard-600" />
                <span>MEAL KITS ADMIN</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2d2d2d] tracking-tight flex items-center gap-3">
                <span>จัดการออเดอร์</span>
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                ติดตามรายการสั่งซื้อ ดำเนินการ และจัดการสถานะออเดอร์ทั้งหมด
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => fetchOrders(true)}
                disabled={loading}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-gray-200/80 shadow-sm hover:bg-gray-50 text-gray-700 hover:text-[#2d2d2d] text-sm font-medium transition-all duration-200 active:scale-[0.98]"
              >
                <RefreshCw
                  size={16}
                  className={loading ? "animate-spin text-mustard-500" : "text-gray-400"}
                />
                <span>รีเฟรชข้อมูล</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-8">
        {/* ─── Minimalist Stat Cards ─── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8">
          {/* Card 1: Total Orders */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_35px_rgba(0,0,0,0.06)] transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs sm:text-sm font-medium text-gray-500">
                คำสั่งซื้อทั้งหมด
              </span>
              <div className="w-10 h-10 rounded-2xl bg-gray-100/80 flex items-center justify-center text-[#2d2d2d]">
                <ShoppingBag size={18} />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-[#2d2d2d] tracking-tight">
              {orders.length}
            </p>
            <p className="text-xs text-gray-400 mt-1">ออเดอร์ในระบบทั้งหมด</p>
          </div>

          {/* Card 2: Total Revenue */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_35px_rgba(0,0,0,0.06)] transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs sm:text-sm font-medium text-gray-500">
                รายได้รวม
              </span>
              <div className="w-10 h-10 rounded-2xl bg-mustard-50 flex items-center justify-center text-mustard-600">
                <BarChart size={18} />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-mustard-600 tracking-tight">
              ฿{totalRevenue.toLocaleString()}
            </p>
            <p className="text-xs text-gray-400 mt-1">ยอดรวมคำสั่งซื้อ</p>
          </div>

          {/* Card 3: Pending Orders */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_35px_rgba(0,0,0,0.06)] transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs sm:text-sm font-medium text-gray-500">
                รอดำเนินการ
              </span>
              <div className="w-10 h-10 rounded-2xl bg-red-50 flex items-center justify-center text-red-600">
                <Clock size={18} />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-red-600 tracking-tight">
              {statusCounts["รอดำเนินการ"] || 0}
            </p>
            <p className="text-xs text-gray-400 mt-1">ต้องรีบดำเนินการจัดส่ง</p>
          </div>

          {/* Card 4: Preparing Orders */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_35px_rgba(0,0,0,0.06)] transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs sm:text-sm font-medium text-gray-500">
                กำลังจัดเตรียม
              </span>
              <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
                <Package size={18} />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-amber-600 tracking-tight">
              {statusCounts["กำลังจัดเตรียม"] || 0}
            </p>
            <p className="text-xs text-gray-400 mt-1">อยู่ในครัว / เตรียมจัดส่ง</p>
          </div>
        </div>

        {/* ─── Tabs & Actions Bar ─── */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          {/* Navigation Pill Tabs */}
          <div className="inline-flex p-1.5 bg-gray-200/60 rounded-2xl w-max">
            <button
              onClick={() => setActiveTab("orders")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeTab === "orders"
                  ? "bg-white text-[#2d2d2d] shadow-sm"
                  : "text-gray-600 hover:text-[#2d2d2d]"
              }`}
            >
              <ShoppingBag size={16} />
              <span>จัดการออเดอร์ ({orders.length})</span>
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeTab === "reviews"
                  ? "bg-white text-[#2d2d2d] shadow-sm"
                  : "text-gray-600 hover:text-[#2d2d2d]"
              }`}
            >
              <MessageSquare size={16} />
              <span>รีวิวจากลูกค้า ({reviews.length})</span>
            </button>
          </div>

          {/* Search & Filter Bar (Only shown on Orders tab) */}
          {activeTab === "orders" && (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Status Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
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
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                      statusFilter === item.key
                        ? "bg-[#2d2d2d] text-white shadow-sm"
                        : "bg-white border border-gray-200/80 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {item.label}{" "}
                    <span
                      className={`ml-1 px-1.5 py-0.5 rounded-md text-[10px] ${
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

              {/* Minimalist Search Box */}
              <div className="relative w-full sm:w-64">
                <Search
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
                <input
                  type="text"
                  placeholder="ค้นหารหัส, ชื่อลูกค้า, เบอร์..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-9 py-2 bg-white text-sm text-[#2d2d2d] rounded-xl border border-gray-200/80 focus:border-mustard-500 focus:ring-4 focus:ring-mustard-500/10 outline-none transition-all placeholder:text-gray-400"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ─── Orders Tab Content ─── */}
        {activeTab === "orders" && (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_4px_25px_rgba(0,0,0,0.03)] overflow-hidden animate-fade-in-up">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-[#2d2d2d]">
                  รายการสั่งซื้อทั้งหมด
                </h2>
                {(statusFilter !== "all" || searchQuery) && (
                  <span className="text-xs text-gray-400 font-normal">
                    (กรองแล้วเหลือ {filteredOrders.length} รายการ)
                  </span>
                )}
              </div>
            </div>

            {loading ? (
              <div className="py-20 flex flex-col items-center justify-center">
                <span className="loading loading-spinner loading-lg text-mustard-500 mb-4"></span>
                <p className="text-sm text-gray-400">กำลังโหลดรายการสั่งซื้อ...</p>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="py-20 flex flex-col items-center justify-center text-center px-4">
                <div className="w-16 h-16 rounded-3xl bg-gray-100 flex items-center justify-center text-gray-400 mb-4">
                  <Inbox size={32} />
                </div>
                <p className="text-base font-bold text-[#2d2d2d]">
                  ไม่พบรายการสั่งซื้อ
                </p>
                <p className="text-xs text-gray-400 mt-1 max-w-sm">
                  {searchQuery || statusFilter !== "all"
                    ? "ลองเปลี่ยนเงื่อนไขการค้นหา หรือรีเซ็ตตัวกรอง"
                    : "ยังไม่มีคำสั่งซื้อในขณะนี้"}
                </p>
                {(searchQuery || statusFilter !== "all") && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setStatusFilter("all");
                    }}
                    className="mt-4 px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-semibold text-gray-700 transition-colors"
                  >
                    รีเซ็ตตัวกรอง
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50/80 text-gray-500 uppercase text-[11px] font-semibold tracking-wider border-b border-gray-100">
                        <th className="px-6 py-4">รหัสคำสั่งซื้อ</th>
                        <th className="px-6 py-4">ข้อมูลลูกค้า</th>
                        <th className="px-6 py-4">รายการอาหาร</th>
                        <th className="px-6 py-4">ยอดสุทธิ</th>
                        <th className="px-6 py-4">สถานะออเดอร์</th>
                        <th className="px-6 py-4">วันที่สั่ง</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                      {currentOrders.map((order) => {
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
                            {/* ID Column */}
                            <td className="px-6 py-4 align-top">
                              <div className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-charcoal-800 bg-gray-100/90 px-2.5 py-1 rounded-lg">
                                #{order.id}
                              </div>
                              {order.orderType === "subscription" && (
                                <div className="mt-2">
                                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-mustard-700 bg-mustard-50 px-2 py-0.5 rounded-md border border-mustard-200/60">
                                    <RefreshCw size={10} />
                                    {order.deliveryFrequency === "weekly"
                                      ? "รายสัปดาห์"
                                      : order.deliveryFrequency === "biweekly"
                                      ? "ทุก 2 สัปดาห์"
                                      : order.deliveryFrequency === "monthly"
                                      ? "รายเดือน"
                                      : "สั่งประจำ"}
                                  </span>
                                </div>
                              )}
                            </td>

                            {/* Customer Info */}
                            <td className="px-6 py-4 align-top">
                              <div className="font-semibold text-[#2d2d2d]">
                                {order.customerName || "ไม่ระบุชื่อ"}
                              </div>
                              <div className="text-xs text-gray-500 flex items-center gap-1.5 mt-1">
                                <Phone size={12} className="text-gray-400" />
                                <span>{order.customerPhone || "-"}</span>
                              </div>
                            </td>

                            {/* Menu Items */}
                            <td className="px-6 py-4 align-top">
                              <div className="space-y-1.5">
                                {order.items?.map((item, i) => (
                                  <div
                                    key={i}
                                    className="flex items-center gap-2 text-xs"
                                  >
                                    <span className="w-1.5 h-1.5 rounded-full bg-mustard-500 shrink-0" />
                                    <span className="font-medium text-[#2d2d2d]">
                                      {item.menuName}
                                    </span>
                                    <span className="text-gray-400 font-mono">
                                      ×{item.quantity}
                                    </span>
                                    <span className="text-[11px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
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

                            {/* Status Changer */}
                            <td className="px-6 py-4 align-top">
                              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                                <div
                                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 ${status.badge}`}
                                >
                                  <StatusIcon size={14} />
                                  <span>{status.label}</span>
                                </div>
                                <select
                                  value={order.status}
                                  onChange={(e) =>
                                    handleStatusChange(
                                      order.id,
                                      e.target.value as Order["status"]
                                    )
                                  }
                                  disabled={updatingId === order.id}
                                  className="px-3 py-1.5 rounded-xl text-xs font-medium bg-white border border-gray-200 hover:border-gray-300 focus:border-mustard-500 focus:ring-2 focus:ring-mustard-500/10 text-[#2d2d2d] outline-none transition-all cursor-pointer disabled:opacity-50"
                                >
                                  {statusOptions.map((s) => (
                                    <option key={s} value={s}>
                                      เปลี่ยนเป็น: {s}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </td>

                            {/* Date & Next Delivery */}
                            <td className="px-6 py-4 align-top text-xs text-gray-500 whitespace-nowrap">
                              <div className="flex items-center gap-1.5">
                                <Calendar size={13} className="text-gray-400" />
                                <span>{formatDate(order.createdAt)}</span>
                              </div>
                              {order.orderType === "subscription" &&
                                order.deliveryFrequency && (
                                  <div className="mt-2 text-xs text-mustard-700 font-semibold flex items-center gap-1.5 bg-mustard-50/80 px-2.5 py-1 rounded-lg border border-mustard-200/60 w-fit">
                                    <Truck size={12} />
                                    <span>
                                      รอบถัดไป:{" "}
                                      {formatDate(
                                        getNextDeliveryDate(
                                          order.createdAt,
                                          order.deliveryFrequency
                                        )?.toISOString() || ""
                                      )}
                                    </span>
                                  </div>
                                )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* ─── Minimalist Pagination Footer ─── */}
                <div className="flex flex-col sm:flex-row justify-between items-center px-6 py-4 border-t border-gray-100 bg-gray-50/40 gap-4">
                  <span className="text-xs text-gray-500 font-medium">
                    แสดง{" "}
                    <span className="text-[#2d2d2d] font-bold">
                      {(currentPage - 1) * ITEMS_PER_PAGE + 1}
                    </span>{" "}
                    ถึง{" "}
                    <span className="text-[#2d2d2d] font-bold">
                      {Math.min(
                        currentPage * ITEMS_PER_PAGE,
                        filteredOrders.length
                      )}
                    </span>{" "}
                    จาก{" "}
                    <span className="text-[#2d2d2d] font-bold">
                      {filteredOrders.length}
                    </span>{" "}
                    รายการ
                  </span>

                  <div className="inline-flex items-center gap-1">
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(1, prev - 1))
                      }
                      disabled={currentPage === 1}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-700 disabled:opacity-40 disabled:pointer-events-none transition-all"
                    >
                      <ChevronLeft size={14} />
                      <span>ก่อนหน้า</span>
                    </button>

                    <span className="px-3 py-1.5 text-xs font-bold text-[#2d2d2d]">
                      หน้า {currentPage} / {totalPages}
                    </span>

                    <button
                      onClick={() =>
                        setCurrentPage((prev) =>
                          Math.min(totalPages, prev + 1)
                        )
                      }
                      disabled={
                        currentPage === totalPages || totalPages === 0
                      }
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-700 disabled:opacity-40 disabled:pointer-events-none transition-all"
                    >
                      <span>ถัดไป</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* ─── Reviews Tab Content ─── */}
        {activeTab === "reviews" && (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_4px_25px_rgba(0,0,0,0.03)] overflow-hidden animate-fade-in-up">
            <div className="px-6 py-5 border-b border-gray-100">
              <h2 className="text-base font-bold text-[#2d2d2d]">
                บันทึกรีวิวทั้งหมด ({reviews.length})
              </h2>
            </div>

            {loading ? (
              <div className="py-20 flex flex-col items-center justify-center">
                <span className="loading loading-spinner loading-lg text-mustard-500 mb-4"></span>
                <p className="text-sm text-gray-400">กำลังโหลดรีวิวจากลูกค้า...</p>
              </div>
            ) : reviews.length === 0 ? (
              <div className="py-20 flex flex-col items-center justify-center text-center px-4">
                <div className="w-16 h-16 rounded-3xl bg-gray-100 flex items-center justify-center text-gray-400 mb-4">
                  <MessageSquare size={32} />
                </div>
                <p className="text-base font-bold text-[#2d2d2d]">
                  ยังไม่มีรีวิวจากลูกค้า
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  คำติชมจากลูกค้าจะปรากฏที่นี่หลังจากลูกค้าทำการรีวิว
                </p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50/80 text-gray-500 uppercase text-[11px] font-semibold tracking-wider border-b border-gray-100">
                        <th className="px-6 py-4">ลูกค้า</th>
                        <th className="px-6 py-4">คะแนนดาว</th>
                        <th className="px-6 py-4">ข้อความรีวิว</th>
                        <th className="px-6 py-4">วันที่รีวิว</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                      {currentReviews.map((r) => (
                        <tr
                          key={r.id}
                          className="hover:bg-gray-50/60 transition-colors"
                        >
                          {/* Customer */}
                          <td className="px-6 py-4 align-top">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-2xl bg-gray-100 border border-gray-200/60 overflow-hidden shrink-0 flex items-center justify-center">
                                {r.image ? (
                                  <img
                                    src={r.image}
                                    alt={r.userName}
                                    onError={(e) => {
                                      e.currentTarget.style.display = "none";
                                    }}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <User size={18} className="text-gray-400" />
                                )}
                              </div>
                              <div>
                                <div className="font-semibold text-[#2d2d2d]">
                                  {r.userName}
                                </div>
                                <div className="text-xs text-gray-400 mt-0.5">
                                  {r.role || "ลูกค้า"}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Stars */}
                          <td className="px-6 py-4 align-top">
                            <div className="flex items-center gap-1 text-mustard-500">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={15}
                                  className={
                                    i < r.rating
                                      ? "fill-mustard-500 text-mustard-500"
                                      : "text-gray-200"
                                  }
                                />
                              ))}
                              <span className="text-xs font-bold text-[#2d2d2d] ml-1.5">
                                {r.rating}.0
                              </span>
                            </div>
                          </td>

                          {/* Comment */}
                          <td className="px-6 py-4 align-top">
                            <div className="max-w-md bg-gray-50/80 border border-gray-100 rounded-2xl p-3 text-xs text-gray-700 italic">
                              "{r.review}"
                            </div>
                          </td>

                          {/* Date */}
                          <td className="px-6 py-4 align-top text-xs text-gray-500 whitespace-nowrap">
                            {formatDate(r.createdAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Reviews Pagination Footer */}
                <div className="flex flex-col sm:flex-row justify-between items-center px-6 py-4 border-t border-gray-100 bg-gray-50/40 gap-4">
                  <span className="text-xs text-gray-500 font-medium">
                    แสดง{" "}
                    <span className="text-[#2d2d2d] font-bold">
                      {(currentReviewPage - 1) * ITEMS_PER_PAGE + 1}
                    </span>{" "}
                    ถึง{" "}
                    <span className="text-[#2d2d2d] font-bold">
                      {Math.min(
                        currentReviewPage * ITEMS_PER_PAGE,
                        reviews.length
                      )}
                    </span>{" "}
                    จาก{" "}
                    <span className="text-[#2d2d2d] font-bold">
                      {reviews.length}
                    </span>{" "}
                    รายการ
                  </span>

                  <div className="inline-flex items-center gap-1">
                    <button
                      onClick={() =>
                        setCurrentReviewPage((prev) => Math.max(1, prev - 1))
                      }
                      disabled={currentReviewPage === 1}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-700 disabled:opacity-40 disabled:pointer-events-none transition-all"
                    >
                      <ChevronLeft size={14} />
                      <span>ก่อนหน้า</span>
                    </button>

                    <span className="px-3 py-1.5 text-xs font-bold text-[#2d2d2d]">
                      หน้า {currentReviewPage} / {totalReviewPages}
                    </span>

                    <button
                      onClick={() =>
                        setCurrentReviewPage((prev) =>
                          Math.min(totalReviewPages, prev + 1)
                        )
                      }
                      disabled={
                        currentReviewPage === totalReviewPages ||
                        totalReviewPages === 0
                      }
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-700 disabled:opacity-40 disabled:pointer-events-none transition-all"
                    >
                      <span>ถัดไป</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

