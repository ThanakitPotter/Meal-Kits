import type { Metadata } from "next";
import { Noto_Sans_Thai, Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import { CartProvider } from "@/context/CartContext";
import "./globals.css";

const notoSansThai = Noto_Sans_Thai({
  variable: "--font-noto-sans-thai",
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MK340 Meal Kits — ชุดอาหารพร้อมทำ ส่งถึงบ้าน",
  description:
    "แพลตฟอร์มสั่ง Meal Kits ชุดอาหารพร้อมทำ ส่งตรงถึงบ้านทุกเดือน อร่อยเหมือนมีเชฟมาทำให้ที่บ้าน",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="th"
      className={`${notoSansThai.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#fafafa] font-sans">
        <CartProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <footer className="bg-gray-900 text-gray-400">
            <div className="mx-auto max-w-6xl px-6 py-10">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🍳</span>
                  <span className="text-lg font-bold text-white">
                    MK340 Meal Kits
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  © 2026 MK340 Meal Kits — ชุดอาหารพร้อมทำ ส่งถึงบ้านทุกเดือน
                </p>
              </div>
            </div>
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}
