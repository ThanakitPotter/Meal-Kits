"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Menu } from "@/types";

const categoryConfig: Record<
  string,
  { emoji: string; badge: string; label: string }
> = {
  ผัด: {
    emoji: "🍳",
    badge: "bg-mustard-100 text-mustard-700",
    label: "ผัด",
  },
  "ต้ม-แกง": {
    emoji: "🍲",
    badge: "bg-red-100 text-red-700",
    label: "ต้ม/แกง",
  },
  "ทอด-ย่าง": {
    emoji: "🍗",
    badge: "bg-orange-100 text-orange-700",
    label: "ทอด/ย่าง",
  },
};

export default function Home() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/menus")
      .then((res) => res.json())
      .then((data) => {
        setMenus(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* ─── Hero Section ─── */}
      <section className="relative overflow-hidden bg-charcoal-900">
        {/* Decorative blobs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 -right-32 h-80 w-80 rounded-full bg-mustard-400/20 blur-3xl" />
          <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-charcoal-600/30 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-mustard-500/10 blur-2xl" />
        </div>

        <div className="relative mx-auto max-w-6xl px-6 py-28 md:py-36 text-center text-white">
          <p className="text-7xl md:text-8xl mb-6 drop-shadow-lg animate-fade-in-up">
            👨‍🍳
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-5 animate-fade-in-up-delay-1">
            MK340 <span className="text-mustard-400">Meal Kits</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up-delay-2">
            ชุดอาหารพร้อมทำ ส่งถึงบ้านคุณทุกสัปดาห์
            <br className="hidden sm:block" />
            อร่อยเหมือนมีเชฟส่วนตัวมาทำให้ที่บ้าน
          </p>
          <a
            href="#menus"
            className="inline-flex items-center gap-2 bg-mustard-400 text-charcoal-900 font-bold px-8 py-4 rounded-full shadow-xl hover:shadow-2xl hover:bg-mustard-300 hover:scale-105 active:scale-95 transition-all duration-300 animate-fade-in-up-delay-3"
          >
            สั่งซื้อชุดอาหารเลย ↓
          </a>
        </div>
      </section>

      {/* ─── Menus Grid ─── */}
      <section id="menus" className="mx-auto max-w-6xl px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-3 text-charcoal-900">
            เมนูยอดฮิต
          </h2>
          <p className="text-gray-500 max-w-lg mx-auto">
            เลือกเมนูที่ใช่ พร้อมวัตถุดิบสดใหม่ แพ็คอย่างดี ส่งตรงถึงครัวคุณ
          </p>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl h-[520px] animate-pulse shadow-md border border-gray-100"
              />
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {menus.length > 0 ? (
              menus.map((menu, idx) => {
                const config = categoryConfig[menu.category] || {
                  emoji: "🍽️",
                  badge: "bg-gray-100 text-gray-700",
                  label: "อาหาร",
                };
                return (
                  <div
                    key={menu.id}
                    className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:-translate-y-2 animate-fade-in-up flex flex-col"
                    style={{ animationDelay: `${idx * 0.1}s` }}
                  >
                    {/* Image Header */}
                    <div className="relative h-56 w-full overflow-hidden bg-gray-100">
                      <Image
                        src={menu.image}
                        alt={menu.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute top-4 left-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold shadow-sm backdrop-blur-md bg-white/90 ${config.badge.split(' ')[1]}`}
                        >
                          {config.emoji} {config.label}
                        </span>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold text-charcoal-900">
                          {menu.name}
                        </h3>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-2 mb-4 text-xs font-semibold">
                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md">
                          ใช้เวลา {menu.prepTime}
                        </span>
                        <span className="bg-mustard-50 text-mustard-700 px-2 py-1 rounded-md">
                          สำหรับ 2 ท่าน
                        </span>
                      </div>
                      
                      <div className="mb-4 text-lg font-bold text-charcoal-900">
                        ฿{menu.price}
                      </div>

                      <p className="text-gray-500 text-sm mb-5 leading-relaxed line-clamp-2">
                        {menu.description}
                      </p>

                      {/* Ingredients list */}
                      <div className="mb-6 flex-1">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                          วัตถุดิบที่ให้มา
                        </p>
                        <ul className="space-y-1.5">
                          {menu.ingredients.slice(0, 3).map((item, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-2 text-sm text-gray-600"
                            >
                              <span className="text-mustard-500 mt-0.5 flex-shrink-0 text-xs">
                                ✦
                              </span>
                              <span className="line-clamp-1">{item}</span>
                            </li>
                          ))}
                          {menu.ingredients.length > 3 && (
                            <li className="text-xs text-gray-400 pl-4 mt-1 font-medium">
                              +{menu.ingredients.length - 3} อย่างเพิ่มเติม
                            </li>
                          )}
                        </ul>
                      </div>

                      <Link
                        href={`/order/${menu.id}`}
                        className="block w-full text-center bg-mustard-400 text-charcoal-900 font-bold py-3.5 rounded-xl hover:bg-mustard-300 transition-colors duration-300 shadow-md active:scale-[0.98]"
                      >
                        Add to Cart
                      </Link>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full text-center py-20 text-gray-400">
                ไม่มีเมนูในขณะนี้
              </div>
            )}
          </div>
        )}
      </section>

      {/* ─── Features Section ─── */}
      <section className="bg-charcoal-50 border-t border-gray-100">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid sm:grid-cols-3 gap-8 text-center">
            {[
              {
                emoji: "🥬",
                title: "วัตถุดิบสดใหม่",
                desc: "คัดสรรวัตถุดิบคุณภาพเยี่ยม ส่งตรงจากฟาร์มทุกวัน",
              },
              {
                emoji: "🧊",
                title: "แพ็คสุญญากาศ",
                desc: "รักษาความสดและสะอาดด้วยระบบสุญญากาศ",
              },
              {
                emoji: "🛵",
                title: "ส่งเร็วถึงบ้าน",
                desc: "จัดส่งแบบควบคุมอุณหภูมิ ถึงหน้าบ้านคุณ",
              },
            ].map((feat, i) => (
              <div key={i} className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <span className="text-4xl block mb-4">{feat.emoji}</span>
                <h3 className="text-lg font-bold mb-2 text-charcoal-900">{feat.title}</h3>
                <p className="text-gray-500 text-sm">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
