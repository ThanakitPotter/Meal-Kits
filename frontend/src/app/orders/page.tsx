"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Order } from "@/types";
import { ShoppingBag, Clock, Package, Truck, Inbox, ArrowLeft } from "lucide-react";

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

export default function UserOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/login");
      return;
    }
    const user = JSON.parse(storedUser);

    fetch(`/api/orders/user/${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [router]);

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
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-5xl min-h-[60vh] mb-10 md:mb-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold flex items-center gap-3">
            <ShoppingBag className="text-primary" size={32} /> ประวัติการสั่งซื้อ
          </h1>
          <p className="text-base-content/60 mt-1">ติดตามสถานะออเดอร์ Meal Kits ของคุณ</p>
        </div>
        <Link href="/" className="btn btn-outline btn-sm">
          <ArrowLeft size={16} /> กลับหน้าแรก
        </Link>
      </div>

      <div className="card bg-white text-[#333333] shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center">
            <span className="loading loading-spinner loading-lg text-primary mb-4"></span>
            <p className="text-base-content/50">กำลังโหลดข้อมูล...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="p-12 flex flex-col items-center justify-center text-base-content/40">
            <Inbox size={48} className="mb-4" />
            <p className="text-lg font-bold mb-2">ยังไม่มีประวัติการสั่งซื้อ</p>
            <p className="mb-6">คุณยังไม่เคยสั่ง Meal Kits กับเราเลย ลองสั่งดูสิครับ!</p>
            <Link href="/" className="btn btn-primary">เริ่มสั่งอาหารเลย</Link>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="table w-full border border-[#c594a1]">
                <thead className="bg-base-200/50 text-base-content">
                  <tr>
                    <th className="whitespace-nowrap">ออเดอร์</th>
                    <th className="whitespace-nowrap">เมนู</th>
                    <th className="whitespace-nowrap">ราคา</th>
                    <th className="whitespace-nowrap">สถานะ</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => {
                    const status = statusConfig[order.status] || { label: order.status, badge: 'badge-neutral', icon: Clock };
                    const StatusIcon = status.icon;
                    
                    return (
                      <tr key={order.id} className="hover">
                        <td className="whitespace-nowrap">
                          <div className="font-mono font-bold opacity-70">
                            #{order.id.slice(0, 8)}...
                          </div>
                          <div className="text-xs opacity-60 mt-0.5">{formatDate(order.createdAt)}</div>
                        </td>
                        <td className="whitespace-nowrap min-w-[120px]">
                          <div className="font-bold whitespace-normal">{order.items && order.items.length > 0 ? order.items[0].menuName : 'N/A'}</div>
                          <div className="text-xs opacity-60 mt-0.5">{order.items && order.items.length > 0 ? order.items[0].servings : 0} ท่าน {order.items && order.items.length > 1 ? `(+${order.items.length - 1} รายการ)` : ''}</div>
                        </td>
                        <td className="font-bold text-primary whitespace-nowrap">
                          ฿{order.totalPrice.toLocaleString()}
                        </td>
                        <td className="whitespace-nowrap">
                          <div className={`badge ${status.badge} gap-1 font-bold p-3 whitespace-nowrap`}>
                            <StatusIcon size={14} /> {status.label}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden flex flex-col gap-3 p-4 bg-base-200/20">
              {orders.map((order) => {
                const status = statusConfig[order.status] || { label: order.status, badge: 'badge-neutral', icon: Clock };
                const StatusIcon = status.icon;
                
                return (
                  <div key={order.id} className="card bg-white text-[#333333] shadow-sm border border-gray-100">
                    <div className="card-body p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-mono font-bold opacity-70 text-sm">#{order.id.slice(0, 8)}...</div>
                          <div className="text-xs opacity-60 mt-0.5">{formatDate(order.createdAt)}</div>
                        </div>
                        <div className={`badge ${status.badge} gap-1 font-bold p-3 text-xs`}>
                          <StatusIcon size={12} /> {status.label}
                        </div>
                      </div>
                      
                      <div className="divider my-1"></div>
                      
                      <div className="flex justify-between items-center mt-2">
                        <div>
                          <div className="font-bold text-sm line-clamp-1">{order.items && order.items.length > 0 ? order.items[0].menuName : 'N/A'}</div>
                          <div className="text-xs opacity-60 mt-0.5">{order.items && order.items.length > 0 ? order.items[0].servings : 0} ท่าน {order.items && order.items.length > 1 ? `(+${order.items.length - 1} รายการ)` : ''}</div>
                        </div>
                        <div className="font-bold text-primary text-lg whitespace-nowrap ml-2">
                          ฿{order.totalPrice.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
