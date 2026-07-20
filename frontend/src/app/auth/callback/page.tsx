"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    const user = searchParams.get("user");

    if (token && user) {
      localStorage.setItem("token", token);
      localStorage.setItem("user", user);

      // Force reload to update Navbar state and redirect to home
      window.location.href = "/";
    } else {
      router.push("/login");
    }
  }, [router, searchParams]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center">
      <span className="loading loading-spinner loading-lg text-primary mb-4"></span>
      <h2 className="text-xl font-bold">กำลังเข้าสู่ระบบ...</h2>
      <p className="text-base-content/60">กรุณารอสักครู่</p>
    </div>
  );
}
