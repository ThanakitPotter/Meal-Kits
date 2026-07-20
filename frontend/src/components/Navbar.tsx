"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { User, LogOut, LayoutDashboard, ShoppingBag, Menu as MenuIcon, ShoppingCart, ClipboardList, Info } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const { cartCount } = useCart();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/";
  };

  const handleScrollToMenus = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === "/") {
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
    }
  };

  const handleScrollToTop = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === "/") {
      e.preventDefault();
      
      const startPosition = window.scrollY;
      if (startPosition === 0) return;

      const distance = -startPosition;
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
    }
  };

  return (
    <div className="navbar bg-white text-[#333333] shadow-sm border-b border-base-200 sticky top-0 z-50 px-4 md:px-8">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden text-[#333333]">
            <MenuIcon size={24} />
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-white text-[#333333] rounded-box z-[100] mt-3 w-52 p-2 shadow-lg border border-base-200"
          >
            <li>
              <Link href="/#menus" onClick={handleScrollToMenus} className={pathname === "/" ? "text-[#E0A800] font-bold" : "text-[#333333]"}>
                <ShoppingBag size={18} /> สั่งอาหาร
              </Link>
            </li>
            <li><Link href="/how-to-order" className={pathname === "/how-to-order" ? "text-[#E0A800] font-bold" : "text-[#333333]"}><ClipboardList size={18} /> วิธีการสั่งซื้อ</Link></li>
            <li><Link href="/about" className={pathname === "/about" ? "text-[#E0A800] font-bold" : "text-[#333333]"}><Info size={18} /> เกี่ยวกับเรา</Link></li>
            {user?.role === 'admin' && (
              <li>
                <Link href="/admin" className={pathname === "/admin" ? "text-[#E0A800] font-bold" : "text-[#333333]"}>
                  <LayoutDashboard size={18} /> แอดมิน
                </Link>
              </li>
            )}
          </ul>
        </div>
        <Link href="/" onClick={handleScrollToTop} className="btn btn-ghost h-auto hover:bg-transparent py-1 gap-2 text-[#333333]">
          <div className="flex items-center gap-2">
            <span className="text-2xl md:text-3xl">🍳</span>
            <span className="text-xl md:text-2xl font-extrabold tracking-tight text-[#333333]">
              Meal <span className="text-[#E0A800]">Kits</span>
            </span>
          </div>
        </Link>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-2 font-medium">
          <li>
            <Link href="/#menus" onClick={handleScrollToMenus} className={pathname === "/" ? "text-[#E0A800] border-b-2 border-[#E0A800] font-bold flex items-center gap-2 rounded-none !bg-transparent" : "text-[#333333] hover:text-[#E0A800] transition-colors flex items-center gap-2 border-b-2 border-transparent rounded-none"}>
              <ShoppingBag size={18} /> สั่งอาหาร
            </Link>
          </li>
          <li>
            <Link href="/how-to-order" className={pathname === "/how-to-order" ? "text-[#E0A800] border-b-2 border-[#E0A800] font-bold flex items-center gap-2 rounded-none !bg-transparent" : "text-[#333333] hover:text-[#E0A800] transition-colors flex items-center gap-2 border-b-2 border-transparent rounded-none"}>
              <ClipboardList size={18} /> วิธีการสั่งซื้อ
            </Link>
          </li>
          <li>
            <Link href="/about" className={pathname === "/about" ? "text-[#E0A800] border-b-2 border-[#E0A800] font-bold flex items-center gap-2 rounded-none !bg-transparent" : "text-[#333333] hover:text-[#E0A800] transition-colors flex items-center gap-2 border-b-2 border-transparent rounded-none"}>
              <Info size={18} /> เกี่ยวกับเรา
            </Link>
          </li>
          {user?.role === 'admin' && (
            <li>
              <Link href="/admin" className={pathname === "/admin" ? "text-[#E0A800] border-b-2 border-[#E0A800] font-bold flex items-center gap-2 rounded-none !bg-transparent" : "text-[#333333] hover:text-[#E0A800] transition-colors flex items-center gap-2 border-b-2 border-transparent rounded-none"}>
                <LayoutDashboard size={18} /> แอดมิน
              </Link>
            </li>
          )}
        </ul>
      </div>

      <div className="navbar-end gap-2">
        <Link href="/cart" className="btn btn-ghost btn-circle relative mr-2 text-[#333333]">
          <ShoppingCart size={22} />
          {cartCount > 0 && (
            <span className="badge badge-sm badge-primary absolute top-1 right-0 font-bold border-none">
              {cartCount}
            </span>
          )}
        </Link>
        {user ? (
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar placeholder hover:bg-base-200 focus:outline-none focus:ring-0 outline-none text-[#333333]">
              <div className="bg-primary text-primary-content flex items-center justify-center rounded-full w-10 ring ring-primary ring-offset-base-100 ring-offset-2">
                <User size={20} />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-md dropdown-content bg-white text-[#333333] rounded-box z-[100] mt-4 w-60 p-2 shadow-xl border border-base-200"
            >
              <li className="menu-title px-4 py-3 opacity-100 mb-1">
                <span className="text-[#333333] font-extrabold block text-base">{user.name}</span>
                <span className="text-xs text-[#333333]/60 block truncate font-medium">{user.email}</span>
              </li>
              <div className="divider my-0"></div>
              {user?.role === 'admin' && (
                <li>
                  <Link href="/admin" className="text-[#E0A800] mt-1 font-semibold py-3 hover:bg-[#E0A800]/10">
                    <LayoutDashboard size={18} /> จัดการระบบ (Admin)
                  </Link>
                </li>
              )}
              <li>
                <Link href="/orders" className="text-[#333333] mt-1 font-medium py-3 hover:bg-gray-100">
                  <ShoppingBag size={18} /> ประวัติการสั่งซื้อ
                </Link>
              </li>
              <li>
                <button onClick={handleLogout} className="text-error font-medium py-3 hover:bg-error/10">
                  <LogOut size={18} /> ออกจากระบบ
                </button>
              </li>
            </ul>
          </div>
        ) : (
          <>
            <Link href="/login" className="btn btn-ghost hidden sm:flex text-[#333333]">
              เข้าสู่ระบบ
            </Link>
            <Link href="/register" className="btn btn-primary">
              <User size={18} /> สมัครสมาชิก
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
