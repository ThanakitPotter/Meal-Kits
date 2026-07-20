"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { Menu } from "@/types";
import { Clock, Users, Leaf, Package, Truck, UtensilsCrossed, ChefHat, ShoppingBag, ArrowDownCircle, Star, Quote } from "lucide-react";
import AuthModal from "@/components/AuthModal";

export default function Home() {
  const router = useRouter();
  const [menus, setMenus] = useState<Menu[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("ทั้งหมด");
  const categories = ["ทั้งหมด", "ผัด", "ต้ม-แกง", "ทอด-ย่าง"];

  useEffect(() => {
    Promise.all([
      fetch("/api/menus").then((res) => res.json()),
      fetch("/api/reviews").then((res) => res.json())
    ])
      .then(([menusData, reviewsData]) => {
        setMenus(menusData);
        if (Array.isArray(reviewsData)) {
          // Format date for UI
          const formattedReviews = reviewsData.map((r: any) => {
            const date = new Date(r.createdAt);
            const now = new Date();
            const diffTime = Math.abs(now.getTime() - date.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            let dateStr = "เมื่อวาน";
            if (diffDays <= 1) dateStr = "วันนี้";
            else if (diffDays < 7) dateStr = `${diffDays} วันที่แล้ว`;
            else if (diffDays < 30) dateStr = `${Math.floor(diffDays / 7)} สัปดาห์ที่แล้ว`;
            else dateStr = `${Math.floor(diffDays / 30)} เดือนที่แล้ว`;

            return { ...r, dateStr };
          });
          setReviews(formattedReviews);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleAddToCart = (menuId: string) => {
    const token = localStorage.getItem("token");
    if (!token) {
      const modal = document.getElementById('auth_modal') as HTMLDialogElement;
      if (modal) modal.showModal();
      return;
    }
    router.push(`/menu/${menuId}`);
  };

  return (
    <div className="bg-[#fafafa] text-[#333333]">
      {/* ─── Hero Section ─── */}
      <section className="hero min-h-screen relative overflow-hidden bg-base-200">
        <Image
          src="/images/hero-bg.jpg"
          alt="Fresh ingredients on a wooden table"
          fill
          priority
          className="object-cover z-0"
        />
        <div className="absolute inset-0 bg-black/60 z-10"></div>
        <div className="hero-content text-center text-white py-20 relative z-20">
          <div className="max-w-4xl animate-fade-in-up w-full">
            <div className="flex justify-center mb-8">
              <Image
                src="/logo/logo_MealKits.png"
                alt="MK340 Meal Kits Logo"
                width={800}
                height={320}
                className="object-contain drop-shadow-2xl brightness-0 invert opacity-95"
                priority
              />
            </div>
            <p className="mb-8 text-lg md:text-xl text-white/90 leading-relaxed max-w-xl mx-auto">
              ชุดอาหารพร้อมทำ ส่งถึงบ้านคุณทุกสัปดาห์<br className="hidden sm:block" />
              ปรุงง่าย อร่อยเป๊ะ เหมือนเชฟมาเอง
            </p>
            <a
              href="#menus"
              onClick={(e) => {
                e.preventDefault();
                const target = document.getElementById("menus");
                if (!target) return;

                const targetPosition = target.getBoundingClientRect().top + window.scrollY;
                const startPosition = window.scrollY;
                const distance = targetPosition - startPosition;
                const duration = 1200; // 1.2 seconds
                let start: number | null = null;

                const step = (timestamp: number) => {
                  if (!start) start = timestamp;
                  const progress = timestamp - start;
                  const easeInOutCubic = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

                  const percent = Math.min(progress / duration, 1);
                  window.scrollTo(0, startPosition + distance * easeInOutCubic(percent));

                  if (progress < duration) {
                    window.requestAnimationFrame(step);
                  }
                };

                window.requestAnimationFrame(step);
              }}
              className="btn bg-[#E0A800] hover:bg-[#c98e10] text-white border-none btn-lg rounded-full shadow-xl"
            >
              เลือกดูเมนู <ArrowDownCircle className="ml-2 animate-bounce" />
            </a>
          </div>
        </div>
      </section>

      {/* ─── Menus Grid ─── */}
      <section id="menus" className="container mx-auto px-4 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-3 text-[#333333]">
            เมนูยอดฮิต
          </h2>
          <p className="text-[#333333]/60 max-w-lg mx-auto">
            เลือกเมนูที่ใช่ พร้อมวัตถุดิบสดใหม่ แพ็คอย่างดี ส่งตรงถึงครัวคุณ
          </p>
        </div>

        {/* ─── Category Filter ─── */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`btn rounded-full px-6 transition-all ${selectedCategory === cat
                ? "bg-[#E0A800] text-white shadow-md scale-105 border-[#E0A800] hover:bg-[#c98e10]"
                : "bg-white text-[#333333] shadow-sm border border-gray-100 hover:bg-gray-50 hover:border-gray-200"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton h-[520px] w-full rounded-box" />
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {(selectedCategory === "ทั้งหมด" ? menus : menus.filter((m) => m.category === selectedCategory)).length > 0 ? (
              (selectedCategory === "ทั้งหมด" ? menus : menus.filter((m) => m.category === selectedCategory)).map((menu, idx) => (
                <div
                  key={menu.id}
                  className="card bg-white text-[#333333] shadow-xl border border-base-200 hover:-translate-y-2 transition-transform duration-300 animate-fade-in-up"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <figure className="relative h-60 w-full">
                    <Image
                      src={menu.image}
                      alt={menu.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="badge badge-lg badge-neutral font-bold opacity-90 shadow-sm gap-2">
                        <UtensilsCrossed size={14} /> {menu.category}
                      </span>
                    </div>
                  </figure>

                  <div className="card-body">
                    <h2 className="card-title text-2xl font-bold text-[#333333]">{menu.name}</h2>

                    <div className="flex flex-wrap items-center gap-2 my-2">
                      <div className="badge badge-ghost font-semibold gap-1">
                        <Clock size={12} /> ใช้เวลา {menu.prepTime}
                      </div>
                      <div className="badge badge-primary badge-outline font-semibold gap-1">
                        <Users size={12} /> สำหรับ 2 ท่าน
                      </div>
                    </div>

                    <p className="text-2xl font-bold text-primary my-2">฿{menu.price}</p>
                    <p className="text-[#333333]/70 text-sm line-clamp-2 leading-relaxed">
                      {menu.description}
                    </p>

                    <div className="mt-4 mb-2">
                      <p className="text-xs font-bold text-[#333333]/50 uppercase tracking-wider mb-2">
                        วัตถุดิบที่ให้มา
                      </p>
                      <ul className="space-y-1">
                        {menu.ingredients.slice(0, 3).map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-[#333333]/80">
                            <Leaf size={14} className="text-primary mt-0.5 flex-shrink-0" />
                            <span className="line-clamp-1">{item}</span>
                          </li>
                        ))}
                        {menu.ingredients.length > 3 && (
                          <li className="text-xs text-[#333333]/50 pl-6 mt-1 font-medium">
                            +{menu.ingredients.length - 3} อย่างเพิ่มเติม
                          </li>
                        )}
                      </ul>
                    </div>

                    <div className="card-actions justify-end mt-4">
                      <button
                        onClick={() => handleAddToCart(menu.id)}
                        className="btn btn-primary w-full"
                      >
                        <ShoppingBag size={18} /> สั่งซื้อชุดนี้
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-20 text-base-content/50">
                ไม่มีเมนูในขณะนี้
              </div>
            )}
          </div>
        )}
      </section>

      {/* ─── Features Section ─── */}
      <section className="bg-[#f5f5f5]">
        <div className="container mx-auto px-4 py-16">
          <div className="grid sm:grid-cols-3 gap-8 text-center">
            {[
              {
                icon: <Leaf size={48} className="mx-auto mb-4 text-success" />,
                title: "วัตถุดิบสดใหม่",
                desc: "คัดสรรวัตถุดิบคุณภาพเยี่ยม ส่งตรงจากฟาร์มทุกวัน",
              },
              {
                icon: <Package size={48} className="mx-auto mb-4 text-info" />,
                title: "แพ็คสุญญากาศ",
                desc: "รักษาความสดและสะอาดด้วยระบบสุญญากาศ",
              },
              {
                icon: <Truck size={48} className="mx-auto mb-4 text-warning" />,
                title: "ส่งเร็วถึงบ้าน",
                desc: "จัดส่งแบบควบคุมอุณหภูมิ ถึงหน้าบ้านคุณ",
              },
            ].map((feat, i) => (
              <div key={i} className="card bg-white text-[#333333] shadow-sm border border-base-200">
                <div className="card-body items-center text-center">
                  {feat.icon}
                  <h3 className="card-title text-lg text-[#333333]">{feat.title}</h3>
                  <p className="text-[#333333]/60 text-sm">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Customer Reviews Section ─── */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-3 text-[#333333]">
              รีวิวจากลูกค้าที่สั่งไปแล้ว
            </h2>
            <p className="text-[#333333]/60 max-w-lg mx-auto">
              เสียงตอบรับจากลูกค้าจริง ที่การันตีความอร่อยและความสะดวกสบาย
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 pt-8">
            {reviews.map((review, i) => (
              <div
                key={i}
                className={`card bg-white text-[#333333] shadow-lg border border-base-200 hover:-translate-y-3 transition-all duration-300 hover:shadow-2xl relative overflow-hidden group ${i === 1 ? 'md:translate-y-8' : ''
                  }`}
              >
                <div className="absolute -top-6 -right-6 text-primary/5 rotate-12 group-hover:scale-110 group-hover:text-primary/10 transition-transform duration-500">
                  <Quote size={120} />
                </div>
                <div className="card-body relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex text-warning">
                      {[...Array(review.rating)].map((_, j) => (
                        <Star key={j} size={18} fill="currentColor" />
                      ))}
                    </div>
                    <span className="text-[10px] text-gray-500 bg-gray-100 px-3 py-1 rounded-full font-medium">
                      {review.dateStr}
                    </span>
                  </div>
                  <p className="text-[#333333]/80 mb-8 leading-relaxed font-medium">
                    "{review.review}"
                  </p>
                  <div className="flex items-center gap-4 mt-auto">
                    <div className="avatar">
                      <div className="w-12 h-12 rounded-full ring-2 ring-[#E0A800]/20 ring-offset-white ring-offset-2 group-hover:ring-[#E0A800] transition-all duration-300">
                        <img src={review.image} alt={review.name} />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-[#333333]">{review.userName}</h4>
                      <p className="text-xs text-[#333333]/50">{review.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Auth Modal */}
      <AuthModal />
    </div>
  );
}
