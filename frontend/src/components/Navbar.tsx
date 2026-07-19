"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, LogOut, LayoutDashboard, ShoppingBag, Menu as MenuIcon } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);

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

  return (
    <div className="navbar bg-base-100 shadow-sm border-b border-base-200 sticky top-0 z-50 px-4 md:px-8">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <MenuIcon size={24} />
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            <li>
              <Link href="/" className={pathname === "/" ? "active text-primary" : ""}>
                <ShoppingBag size={18} /> สั่งอาหาร
              </Link>
            </li>
            {user?.role === 'admin' && (
              <li>
                <Link href="/admin" className={pathname === "/admin" ? "active text-primary" : ""}>
                  <LayoutDashboard size={18} /> แอดมิน
                </Link>
              </li>
            )}
          </ul>
        </div>
        <Link href="/" className="btn btn-ghost text-xl font-extrabold gap-2">
          <span className="text-primary"><ShoppingBag fill="currentColor" /></span>
          MK340
        </Link>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-2 font-medium">
          <li>
            <Link href="/" className={pathname === "/" ? "active !bg-primary !text-primary-content" : ""}>
              สั่งอาหาร
            </Link>
          </li>
          {user?.role === 'admin' && (
            <li>
              <Link href="/admin" className={pathname === "/admin" ? "active !bg-primary !text-primary-content" : ""}>
                แอดมิน
              </Link>
            </li>
          )}
        </ul>
      </div>

      <div className="navbar-end gap-2">
        {user ? (
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar placeholder hover:bg-base-200 focus:outline-none focus:ring-0 outline-none">
              <div className="bg-primary text-primary-content flex items-center justify-center rounded-full w-10 ring ring-primary ring-offset-base-100 ring-offset-2">
                <User size={20} />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-md dropdown-content bg-base-100 rounded-box z-[100] mt-4 w-60 p-2 shadow-xl border border-base-200"
            >
              <li className="menu-title px-4 py-3 opacity-100 mb-1">
                <span className="text-base-content font-extrabold block text-base">{user.name}</span>
                <span className="text-xs text-base-content/60 block truncate font-medium">{user.email}</span>
              </li>
              <div className="divider my-0"></div>
              {user?.role === 'admin' && (
                <li>
                  <Link href="/admin" className="text-primary mt-1 font-semibold py-3 hover:bg-primary/10">
                    <LayoutDashboard size={18} /> จัดการระบบ (Admin)
                  </Link>
                </li>
              )}
              <li>
                <Link href="/orders" className="text-base-content mt-1 font-medium py-3 hover:bg-base-200">
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
            <Link href="/login" className="btn btn-ghost hidden sm:flex">
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
