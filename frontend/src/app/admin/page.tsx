"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Order } from "@/types";
import { RefreshCw, BarChart, ShoppingBag, Clock, Package, Truck, Inbox, Star, MessageSquare, Phone } from "lucide-react";

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
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"orders" | "reviews">("orders");
  const [currentPage, setCurrentPage] = useState(1);
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
      fetch("/api/reviews/all").then((res) => res.json())
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
          onClick={() => fetchOrders(true)}
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

      {/* ─── Tabs ─── */}
      <div className="tabs tabs-boxed mb-6 bg-white border border-gray-100 p-1 w-max shadow-sm">
        <button 
          className={`tab px-6 transition-all ${activeTab === 'orders' ? 'tab-active bg-[#E0A800] !text-white font-bold' : 'text-[#333333] hover:bg-gray-50'}`} 
          onClick={() => setActiveTab('orders')}
        >
          <ShoppingBag size={16} className="mr-2" /> จัดการออเดอร์
        </button> 
        <button 
          className={`tab px-6 transition-all ${activeTab === 'reviews' ? 'tab-active bg-[#E0A800] !text-white font-bold' : 'text-[#333333] hover:bg-gray-50'}`} 
          onClick={() => setActiveTab('reviews')}
        >
          <MessageSquare size={16} className="mr-2" /> รีวิวจากลูกค้า
        </button> 
      </div>

      {/* ─── Orders Table ─── */}
      {activeTab === 'orders' && (
      <div className="card bg-white text-[#333333] shadow-sm border border-gray-100 overflow-hidden animate-fade-in-up">
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
            <table className="table w-full">
              <thead className="bg-gray-50 text-gray-500 uppercase text-xs tracking-wider border-b border-gray-100">
                <tr>
                  <th className="font-semibold px-4 py-3">ID</th>
                  <th className="font-semibold px-4 py-3">ลูกค้า</th>
                  <th className="font-semibold px-4 py-3">เมนู</th>
                  <th className="font-semibold px-4 py-3">ราคา</th>
                  <th className="font-semibold px-4 py-3">สถานะ</th>
                  <th className="font-semibold px-4 py-3">วันที่สั่ง</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE).map((order) => {
                  const status = statusConfig[order.status] || { label: order.status, badge: 'badge-neutral', icon: Clock };
                  const StatusIcon = status.icon;
                  
                  return (
                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-4">
                        <span className="font-mono text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          #{order.id}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="font-bold text-gray-800">{order.customerName}</div>
                        <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                          <Phone size={10} /> {order.customerPhone}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="space-y-2">
                          {order.items?.map((item, i) => (
                            <div key={i} className="text-sm flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#E0A800] mt-1.5 flex-shrink-0"></div>
                              <div>
                                <span className="font-medium text-gray-800">{item.menuName}</span> 
                                <span className="text-xs text-gray-500 ml-1">
                                  (x{item.quantity} สำหรับ {item.servings} คน)
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-4 font-bold text-gray-800">
                        ฿{order.totalPrice.toLocaleString()}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-col 2xl:flex-row items-start 2xl:items-center gap-2">
                          <div className={`badge ${status.badge} gap-1 font-bold border-none py-3 px-3 w-fit shrink-0`}>
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
                            className="select select-bordered select-sm w-full max-w-[140px] bg-white text-[#333333] border-gray-200 hover:border-gray-300 focus:border-[#E0A800] focus:outline-none transition-colors text-xs font-medium"
                          >
                            {statusOptions.map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-xs text-gray-500 whitespace-nowrap">
                        {formatDate(order.createdAt)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        
        {orders.length > 0 && !loading && (
          <div className="flex flex-col sm:flex-row justify-between items-center p-4 border-t border-gray-100 bg-gray-50/50 gap-4">
            <span className="text-sm text-gray-500 font-medium">
              แสดง {(currentPage - 1) * ITEMS_PER_PAGE + 1} ถึง {Math.min(currentPage * ITEMS_PER_PAGE, orders.length)} จาก {orders.length} รายการ
            </span>
            <div className="join shadow-sm">
              <button 
                className="join-item btn btn-sm bg-white border-gray-200 hover:bg-gray-100" 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              >
                « ก่อนหน้า
              </button>
              <button className="join-item btn btn-sm bg-white border-gray-200 cursor-default hover:bg-white text-primary font-bold px-4">
                หน้า {currentPage} / {Math.ceil(orders.length / ITEMS_PER_PAGE) || 1}
              </button>
              <button 
                className="join-item btn btn-sm bg-white border-gray-200 hover:bg-gray-100" 
                disabled={currentPage === Math.ceil(orders.length / ITEMS_PER_PAGE) || Math.ceil(orders.length / ITEMS_PER_PAGE) === 0}
                onClick={() => setCurrentPage(prev => Math.min(Math.ceil(orders.length / ITEMS_PER_PAGE), prev + 1))}
              >
                ถัดไป »
              </button>
            </div>
          </div>
        )}
      </div>
      )}

      {/* ─── Reviews Table ─── */}
      {activeTab === 'reviews' && (
      <div className="card bg-white text-[#333333] shadow-sm border border-gray-100 overflow-hidden animate-fade-in-up">
        <div className="p-6 border-b border-gray-100">
          <h2 className="card-title text-lg font-bold">บันทึกรีวิวทั้งหมด</h2>
        </div>

        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center">
            <span className="loading loading-spinner loading-lg text-primary mb-4"></span>
            <p className="text-base-content/50">กำลังโหลดข้อมูล...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="p-12 flex flex-col items-center justify-center text-base-content/40">
            <MessageSquare size={48} className="mb-4 text-gray-300" />
            <p>ยังไม่มีรีวิวจากลูกค้า</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead className="bg-gray-50 text-gray-500 uppercase text-xs tracking-wider border-b border-gray-100">
                <tr>
                  <th className="font-semibold px-4 py-3">ลูกค้า</th>
                  <th className="font-semibold px-4 py-3">คะแนน</th>
                  <th className="font-semibold px-4 py-3">ข้อความรีวิว</th>
                  <th className="font-semibold px-4 py-3">วันที่รีวิว</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {reviews.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="avatar">
                          <div className="w-10 h-10 rounded-full bg-gray-100 ring ring-gray-100 ring-offset-1 overflow-hidden">
                            <img src={r.image} alt={r.userName} onError={(e) => { e.currentTarget.style.display = 'none'; }} className="object-cover w-full h-full" />
                          </div>
                        </div>
                        <div>
                          <div className="font-bold text-gray-800">{r.userName}</div>
                          <div className="text-xs text-gray-500 mt-0.5">{r.role}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex gap-1 text-[#E0A800]">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} className={i < r.rating ? "fill-[#E0A800]" : "text-gray-200"} />
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-normal min-w-[300px] text-gray-700 italic">
                      "{r.review}"
                    </td>
                    <td className="px-4 py-4 text-xs text-gray-500 whitespace-nowrap">
                      {formatDate(r.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      )}
    </div>
  );
}
