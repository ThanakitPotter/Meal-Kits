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
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-5xl">
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

      <div className="card bg-base-100 shadow-sm border border-base-200 overflow-hidden">
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
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead className="bg-base-200/50 text-base-content">
                <tr>
                  <th>ออเดอร์</th>
                  <th>เมนู</th>
                  <th>ราคา</th>
                  <th>สถานะ</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const status = statusConfig[order.status] || { label: order.status, badge: 'badge-neutral', icon: Clock };
                  const StatusIcon = status.icon;
                  
                  return (
                    <tr key={order.id} className="hover">
                      <td>
                        <div className="font-mono font-bold opacity-70">
                          #{order.id.slice(0, 8)}...
                        </div>
                        <div className="text-xs opacity-60 mt-0.5">{formatDate(order.createdAt)}</div>
                      </td>
                      <td>
                        <div className="font-bold">{order.menuName}</div>
                        <div className="text-xs opacity-60 mt-0.5">{order.servings} ท่าน</div>
                      </td>
                      <td className="font-bold text-primary">
                        ฿{order.totalPrice.toLocaleString()}
                      </td>
                      <td>
                        <div className={`badge ${status.badge} gap-1 font-bold p-3`}>
                          <StatusIcon size={14} /> {status.label}
                        </div>
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
