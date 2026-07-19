"use client";
import Link from "next/link";
import { User, LogIn } from "lucide-react";

export default function AuthModal({ id = "auth_modal" }: { id?: string }) {
  return (
    <dialog id={id} className="modal">
      <div className="modal-box text-center p-8">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>
        <div className="bg-warning/20 text-warning w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <User size={32} />
        </div>
        <h3 className="font-bold text-2xl mb-2">เข้าสู่ระบบก่อนสั่งซื้อ</h3>
        <p className="text-base-content/70 mb-6">กรุณาเข้าสู่ระบบหรือสมัครสมาชิกเพื่อดำเนินการสั่งซื้อ Meal Kits ของเรา</p>
        <div className="flex flex-col gap-3">
          <Link href="/login" className="btn btn-primary w-full text-lg">
            <LogIn size={18} /> เข้าสู่ระบบ
          </Link>
          <Link href="/register" className="btn btn-outline border-base-300 w-full text-lg">
            สมัครสมาชิกใหม่
          </Link>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}
