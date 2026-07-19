"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <div className="bg-base-200 p-6 rounded-full mb-6">
          <ShoppingBag size={64} className="text-base-content/30" />
        </div>
        <h1 className="text-3xl font-bold mb-3">ตะกร้าของคุณยังว่างเปล่า</h1>
        <p className="text-base-content/60 mb-8 max-w-md mx-auto">
          ยังไม่มีเมนูในตะกร้า เลือกเมนูอร่อยๆ แล้วหยิบใส่ตะกร้าได้เลย!
        </p>
        <Link href="/" className="btn btn-primary btn-lg rounded-full">
          <ArrowLeft size={18} /> กลับไปเลือกเมนู
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8 md:py-12">
      <div className="breadcrumbs text-sm mb-6">
        <ul>
          <li><Link href="/">หน้าแรก</Link></li>
          <li>ตะกร้าสินค้า</li>
        </ul>
      </div>

      <h1 className="text-3xl font-extrabold mb-8">ตะกร้าสินค้าของคุณ</h1>

      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div key={item.id} className="card bg-base-100 shadow-sm border border-base-200 p-4 sm:p-6 flex flex-col sm:flex-row gap-6">
              <div className="relative h-24 w-full sm:w-32 rounded-lg overflow-hidden shrink-0">
                <Image
                  src={item.image}
                  alt={item.menuName}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-lg">{item.menuName}</h3>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="btn btn-ghost btn-sm btn-square text-error"
                      title="ลบรายการ"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <p className="text-sm text-base-content/70 mt-1">
                    สำหรับ {item.servings} คน
                  </p>
                </div>
                <div className="flex justify-between items-end mt-4">
                  <div className="flex items-center gap-3 border border-base-300 rounded-lg p-1">
                    <button 
                      onClick={() => updateQuantity(item.id, -1)}
                      className="btn btn-ghost btn-xs btn-square"
                      disabled={item.quantity <= 1}
                    >
                      <Minus size={14} />
                    </button>
                    <span className="font-semibold w-6 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, 1)}
                      className="btn btn-ghost btn-xs btn-square"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <span className="font-bold text-lg text-primary">
                    ฿{(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="card bg-base-100 shadow-md border border-base-200 sticky top-24">
            <div className="card-body p-6">
              <h2 className="card-title text-xl font-bold mb-4">สรุปคำสั่งซื้อ</h2>
              
              <div className="space-y-3 mb-6 text-sm">
                <div className="flex justify-between">
                  <span className="text-base-content/70">ยอดรวมสินค้า ({cartItems.length} รายการ)</span>
                  <span className="font-semibold">฿{cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-base-content/70">ค่าจัดส่ง</span>
                  <span className="text-success font-semibold">ส่งฟรี</span>
                </div>
              </div>
              
              <div className="divider my-2"></div>
              
              <div className="flex justify-between items-center mb-6">
                <span className="font-bold">ยอดรวมทั้งสิ้น</span>
                <span className="text-2xl font-extrabold text-primary">
                  ฿{cartTotal.toLocaleString()}
                </span>
              </div>

              <Link href="/checkout" className="btn btn-primary btn-block btn-lg text-lg">
                ดำเนินการสั่งซื้อ
              </Link>
              
              <Link href="/" className="btn btn-ghost btn-block mt-2">
                เลือกสินค้าเพิ่ม
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
