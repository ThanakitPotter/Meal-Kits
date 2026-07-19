import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    // ใช้ API_URL จาก Environment Variable ถ้ามี (สำหรับเว็บจริง)
    // ถ้าไม่มีจะใช้ http://localhost:3001 สำหรับทดสอบในเครื่อง
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
    
    return [
      {
        source: "/api/:path*",
        destination: `${apiUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
