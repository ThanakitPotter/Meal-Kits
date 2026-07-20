"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Order } from "@/types";
import { RefreshCw, BarChart, ShoppingBag, Clock, Package, Truck, Inbox } from "lucide-react";

const statusConfig: Record<
  string,
  { label: string; badge: string; icon: any }
> = {
  "รอดำเนินการ": {
    label: "รอดำเนินการ",
    badge: "badge-error",
    icon: Clock,
  },
  "กำลังจัดเตรียม": {
    label: "กำลังจัดเตรียม",
    badge: "badge-warning",
    icon: Package,
  },
  "จัดส่งแล้ว": {
    label: "จัดส่งแล้ว",
    badge: "badge-success",
    icon: Truck,
  },
};

const statusOptions: Array<Order["status"]> = [
  "รอดำเนินการ",
  "กำลังจัดเตรียม",
  "จัดส่งแล้ว",
];

export default function AdminPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

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
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold flex items-center gap-3">
            <BarChart className="text-primary" size={32} /> จัดการออเดอร์
          </h1>
          <p className="text-base-content/60 mt-1">รายการสั่งซื้อ Meal Kits ทั้งหมด</p>
        </div>
        <button
          onClick={fetchOrders}
          disabled={loading}
          className="btn btn-outline"
        >
          <RefreshCw className={loading ? "animate-spin" : ""} size={18} />
          รีเฟรช
        </button>
      </div>

      {/* ─── Stats ─── */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="card bg-white text-[#333333] shadow-sm border border-gray-100">
          <div className="card-body p-6">
            <div className="flex items-center gap-2 mb-2">
              <ShoppingBag size={18} className="text-base-content/60" />
              <p className="text-sm text-base-content/60 font-medium">คำสั่งซื้อทั้งหมด</p>
            </div>
            <p className="text-3xl font-extrabold">{orders.length}</p>
          </div>
        </div>
        <div className="card bg-white text-[#333333] shadow-sm border border-gray-100">
          <div className="card-body p-6">
            <div className="flex items-center gap-2 mb-2">
              <BarChart size={18} className="text-primary" />
              <p className="text-sm text-base-content/60 font-medium">รายได้รวม</p>
            </div>
            <p className="text-3xl font-extrabold text-primary">
              ฿{totalRevenue.toLocaleString()}
            </p>
          </div>
        </div>
        <div className="card bg-white text-[#333333] shadow-sm border border-gray-100">
          <div className="card-body p-6">
            <div className="flex items-center gap-2 mb-2">
              <Clock size={18} className="text-error" />
              <p className="text-sm text-base-content/60 font-medium">รอดำเนินการ</p>
            </div>
            <p className="text-3xl font-extrabold text-error">
              {statusCounts["รอดำเนินการ"] || 0}
            </p>
          </div>
        </div>
        <div className="card bg-white text-[#333333] shadow-sm border border-gray-100">
          <div className="card-body p-6">
            <div className="flex items-center gap-2 mb-2">
              <Package size={18} className="text-warning" />
              <p className="text-sm text-base-content/60 font-medium">กำลังจัดเตรียม</p>
            </div>
            <p className="text-3xl font-extrabold text-warning">
              {statusCounts["กำลังจัดเตรียม"] || 0}
            </p>
          </div>
        </div>
      </div>

      {/* ─── Orders Table ─── */}
      <div className="card bg-white text-[#333333] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="card-title text-lg font-bold">รายการล่าสุด</h2>
        </div>

        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center">
            <span className="loading loading-spinner loading-lg text-primary mb-4"></span>
            <p className="text-base-content/50">กำลังโหลดข้อมูล...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="p-12 flex flex-col items-center justify-center text-base-content/40">
            <Inbox size={48} className="mb-4" />
            <p>ยังไม่มีคำสั่งซื้อ</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table w-full border border-[#c594a1]">
              <thead className="bg-base-200/50 text-base-content">
                <tr>
                  <th>ID</th>
                  <th>ลูกค้า</th>
                  <th>เมนู</th>
                  <th>ราคา</th>
                  <th>สถานะ</th>
                  <th>วันที่สั่ง</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const status = statusConfig[order.status] || { label: order.status, badge: 'badge-neutral', icon: Clock };
                  const StatusIcon = status.icon;
                  
                  return (
                    <tr key={order.id} className="hover">
                      <td>
                        <span className="font-mono font-bold opacity-70">
                          #{order.id}
                        </span>
                      </td>
                      <td>
                        <div className="font-bold">{order.customerName}</div>
                        <div className="text-xs opacity-60 mt-0.5">{order.customerPhone}</div>
                      </td>
                      <td>
                        <div className="space-y-1">
                          {order.items?.map((item, i) => (
                            <div key={i} className="text-sm">
                              <span className="font-bold">{item.menuName}</span> 
                              <span className="text-xs opacity-60 ml-1">
                                (x{item.quantity} สำหรับ {item.servings} คน)
                              </span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="font-bold text-primary">
                        ฿{order.totalPrice.toLocaleString()}
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className={`badge ${status.badge} gap-1 font-bold`}>
                            <StatusIcon size={12} /> {status.label}
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
                            className="select select-bordered select-sm w-full max-w-[150px] bg-white text-[#333333]"
                          >
                            {statusOptions.map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </div>
                      </td>
                      <td className="text-xs opacity-60 whitespace-nowrap">
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
