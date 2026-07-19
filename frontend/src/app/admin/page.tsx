"use client";

import { useEffect, useState } from "react";
import type { Order } from "@/types";

const statusConfig: Record<
  string,
  { label: string; bg: string; text: string; dot: string }
> = {
  "รอดำเนินการ": {
    label: "รอดำเนินการ",
    bg: "bg-red-50",
    text: "text-red-600",
    dot: "bg-red-500",
  },
  "กำลังจัดเตรียม": {
    label: "กำลังจัดเตรียม",
    bg: "bg-mustard-50",
    text: "text-mustard-700",
    dot: "bg-mustard-500",
  },
  "จัดส่งแล้ว": {
    label: "จัดส่งแล้ว",
    bg: "bg-green-50",
    text: "text-green-700",
    dot: "bg-green-500",
  },
};

const statusOptions: Array<Order["status"]> = [
  "รอดำเนินการ",
  "กำลังจัดเตรียม",
  "จัดส่งแล้ว",
];

export default function AdminPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = () => {
    setLoading(true);
    fetch("/api/orders")
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
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

  const totalRevenue = orders.reduce((sum, o) => sum + o.totalPrice, 0);
  const statusCounts = orders.reduce(
    (acc, o) => {
      acc[o.status] = (acc[o.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
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
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-charcoal-900">📊 จัดการออเดอร์</h1>
          <p className="text-gray-500 mt-1">รายการสั่งซื้อ Meal Kits ทั้งหมด</p>
        </div>
        <button
          onClick={fetchOrders}
          disabled={loading}
          className="inline-flex items-center gap-2 bg-white border border-gray-200 text-charcoal-700 font-medium px-5 py-2.5 rounded-xl hover:bg-mustard-50 hover:text-mustard-700 hover:border-mustard-200 active:scale-95 transition-all shadow-sm disabled:opacity-50"
        >
          <svg
            className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          รีเฟรช
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <p className="text-sm text-gray-500 mb-1">คำสั่งซื้อทั้งหมด</p>
          <p className="text-3xl font-extrabold text-charcoal-900">{orders.length}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <p className="text-sm text-gray-500 mb-1">รายได้รวม</p>
          <p className="text-3xl font-extrabold text-mustard-600">
            ฿{totalRevenue.toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <p className="text-sm text-gray-500 mb-1">รอดำเนินการ</p>
          <p className="text-3xl font-extrabold text-red-500">
            {statusCounts["รอดำเนินการ"] || 0}
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <p className="text-sm text-gray-500 mb-1">กำลังจัดเตรียม</p>
          <p className="text-3xl font-extrabold text-mustard-500">
            {statusCounts["กำลังจัดเตรียม"] || 0}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-charcoal-900">รายการล่าสุด</h2>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block h-8 w-8 border-4 border-mustard-100 border-t-mustard-500 rounded-full animate-spin" />
            <p className="text-gray-400 mt-3 text-sm">กำลังโหลด...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-4xl mb-3">📭</p>
            <p className="text-gray-400">ยังไม่มีคำสั่งซื้อ</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-charcoal-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">ลูกค้า</th>
                  <th className="px-6 py-4">เมนู</th>
                  <th className="px-6 py-4">ราคา</th>
                  <th className="px-6 py-4">สถานะ</th>
                  <th className="px-6 py-4">วันที่สั่ง</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((order) => {
                  const status = statusConfig[order.status] || { label: order.status, bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400' };
                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-mustard-50/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <span className="font-mono font-semibold text-charcoal-700">
                          #{order.id}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-charcoal-900">
                            {order.customerName}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            📞 {order.customerPhone}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-charcoal-900">{order.menuName}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{order.servings} ท่าน</p>
                      </td>
                      <td className="px-6 py-4 font-semibold text-charcoal-900">
                        ฿{order.totalPrice.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${status.bg} ${status.text}`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                            {status.label}
                          </span>
                          <select
                            value={order.status}
                            onChange={(e) =>
                              handleStatusChange(
                                order.id,
                                e.target.value as Order["status"]
                              )
                            }
                            disabled={updatingId === order.id}
                            className="text-xs border border-gray-200 rounded-lg px-2 py-1 bg-white text-gray-600 hover:border-mustard-300 focus:border-mustard-400 focus:ring-1 focus:ring-mustard-100 outline-none transition-all cursor-pointer disabled:opacity-50"
                          >
                            {statusOptions.map((s) => (
                              <option key={s} value={s}>
                                → {s}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-xs whitespace-nowrap">
                        {formatDate(order.createdAt)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
