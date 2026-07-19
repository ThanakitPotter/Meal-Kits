"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { Menu } from "@/types";
import { ArrowLeft, Clock, Check, ChevronRight, ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import AuthModal from "@/components/AuthModal";

export default function MenuDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const router = useRouter();
  const { addToCart } = useCart();
  
  const [menu, setMenu] = useState<Menu | null>(null);
  const [loading, setLoading] = useState(true);
  const [servings, setServings] = useState<1 | 2 | 4>(1);

  useEffect(() => {
    fetch(`/api/menus/${unwrappedParams.id}`)
      .then((res) => res.json())
      .then((data) => {
        setMenu(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [unwrappedParams.id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-10">
          <div className="skeleton h-[600px] w-full rounded-box" />
          <div className="skeleton h-[600px] w-full rounded-box" />
        </div>
      </div>
    );
  }

  if (!menu) {
    return (
      <div className="container mx-auto px-4 py-20 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-2">ไม่พบเมนู</h1>
        <p className="text-base-content/60 mb-6">เมนูที่คุณกำลังค้นหาไม่มีอยู่ในระบบ</p>
        <Link href="/" className="btn btn-primary">
          <ArrowLeft size={18} /> กลับหน้าแรก
        </Link>
      </div>
    );
  }

  const totalPrice = 
    servings === 4
      ? Math.round(menu.price * 3.2)
      : servings === 2
      ? Math.round(menu.price * 1.8)
      : menu.price;

  const handleAddToCart = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      const modal = document.getElementById('auth_modal') as HTMLDialogElement;
      if (modal) modal.showModal();
      return;
    }

    addToCart({
      menuId: menu.id,
      menuName: menu.name,
      image: menu.image,
      servings,
      price: totalPrice,
      quantity: 1,
    });
    router.push("/cart");
  };

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8 md:py-12">
      <div className="breadcrumbs text-sm mb-8">
        <ul>
          <li><Link href="/">หน้าแรก</Link></li>
          <li>รายละเอียดเมนู</li>
        </ul>
      </div>

      <div className="grid lg:grid-cols-7 gap-10">
        {/* Left: Image & Menu Details */}
        <div className="lg:col-span-4">
          <div className="card bg-base-100 shadow-md border border-base-200 overflow-hidden">
            <figure className="relative h-80 md:h-96 w-full">
              <Image
                src={menu.image}
                alt={menu.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 60vw"
                priority
              />
              <div className="absolute top-4 left-4">
                <span className="badge badge-lg badge-neutral font-bold opacity-90 shadow-sm">
                  {menu.category}
                </span>
              </div>
            </figure>
            
            <div className="card-body p-6 md:p-8">
              <h1 className="text-3xl md:text-4xl font-extrabold mb-2">{menu.name}</h1>
              <div className="flex items-center gap-2 mb-6 text-sm font-medium text-base-content/70">
                <Clock size={16} /> ใช้เวลาปรุงประมาณ {menu.prepTime}
              </div>
              
              <div className="prose prose-sm md:prose-base max-w-none text-base-content/80 mb-8">
                <p>{menu.description}</p>
              </div>
              
              <div className="divider">สิ่งที่รวมอยู่ในชุด</div>
              
              <ul className="grid sm:grid-cols-2 gap-4">
                {menu.ingredients.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-base-content/70">
                    <Check size={16} className="text-primary mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right: Add to cart */}
        <div className="lg:col-span-3">
          <div className="card bg-base-100 shadow-md border border-base-200 sticky top-24">
            <div className="card-body p-6 md:p-8">
              <h2 className="card-title text-2xl font-extrabold mb-1">สั่งซื้อเมนูนี้</h2>
              <p className="text-base-content/50 text-sm mb-8">
                เลือกจำนวนที่ต้องการทาน
              </p>

              <div className="space-y-6">
                {/* Servings */}
                <div>
                  <label className="label">
                    <span className="label-text font-bold">สำหรับกี่ท่าน?</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <button
                      type="button"
                      onClick={() => setServings(1)}
                      className={`btn h-auto py-4 flex-col gap-1 transition-all ${servings === 1
                          ? 'btn-primary'
                          : 'btn-outline border-base-300 text-base-content'
                        }`}
                    >
                      <span className="text-xl font-bold">1 คน</span>
                      <span className="text-sm font-normal opacity-80">฿{menu.price}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setServings(2)}
                      className={`btn h-auto py-4 flex-col gap-1 transition-all relative ${servings === 2
                          ? 'btn-primary'
                          : 'btn-outline border-base-300 text-base-content'
                        }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold">2 คน</span>
                      </div>
                      <span className="text-sm font-normal opacity-80">฿{Math.round(menu.price * 1.8)}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setServings(4)}
                      className={`btn h-auto py-4 flex-col gap-1 transition-all relative ${servings === 4
                          ? 'btn-primary'
                          : 'btn-outline border-base-300 text-base-content'
                        }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold">ครอบครัว</span>
                      </div>
                      {servings !== 4 && <span className="badge badge-primary badge-sm absolute -top-2 -right-2 whitespace-nowrap shadow-md z-10 border-base-100">คุ้มสุด</span>}
                      <span className="text-sm font-normal opacity-80">฿{Math.round(menu.price * 3.2)}</span>
                    </button>
                  </div>
                </div>

                <div className="divider"></div>

                <div className="flex justify-between items-center mb-6">
                  <span className="text-lg font-bold text-base-content/80">ราคารวม</span>
                  <span className="text-3xl font-extrabold text-primary">฿{totalPrice.toLocaleString()}</span>
                </div>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="btn btn-primary btn-block btn-lg text-lg"
                >
                  <ShoppingCart size={20} /> เพิ่มลงตะกร้า
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Auth Modal */}
      <AuthModal />
    </div>
  );
}
