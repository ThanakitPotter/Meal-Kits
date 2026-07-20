import type { Metadata } from "next";
import { Noto_Sans_Thai, Inter } from "next/font/google";
import Image from "next/image";
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
      <head>
        <meta name="color-scheme" content="light only" />
      </head>
      <body className="min-h-full flex flex-col bg-[#fafafa] text-[#333333] font-sans">
        <CartProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <footer className="bg-[#1c1c1c] text-white pt-16 pb-8 border-t-[4px] border-[#E0A800]">
            <div className="mx-auto max-w-7xl px-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
                <div className="col-span-1 md:col-span-2">
                  <div className="bg-white/10 p-4 rounded-xl inline-block mb-6">
                    <Image 
                      src="/logo/logo_MealKits.png" 
                      alt="MK340 Meal Kits Logo" 
                      width={180} 
                      height={70} 
                      className="object-contain drop-shadow-md brightness-0 invert" 
                    />
                  </div>
                  <p className="max-w-md text-sm leading-relaxed text-white/80">
                    MK340 Meal Kits มอบประสบการณ์ทำอาหารระดับเชฟให้คุณถึงบ้าน
                    ด้วยวัตถุดิบสดใหม่ คัดสรรอย่างดี และสูตรอาหารที่ทำตามได้ง่าย
                    อร่อยเป๊ะทุกมื้อเหมือนมีเชฟส่วนตัว
                  </p>
                </div>
                <div>
                  <h6 className="text-[#E0A800] font-bold text-lg mb-4 tracking-wide">บริการของเรา</h6>
                  <ul className="space-y-3 text-sm text-white/80">
                    <li><a href="/#menus" className="hover:text-[#E0A800] transition-colors">เมนูยอดฮิต</a></li>
                    <li><a href="/how-to-order" className="hover:text-[#E0A800] transition-colors">วิธีการสั่งซื้อ</a></li>
                    <li><a href="/service-areas" className="hover:text-[#E0A800] transition-colors">พื้นที่ให้บริการ</a></li>
                    <li><a href="/faq" className="hover:text-[#E0A800] transition-colors">คำถามที่พบบ่อย (FAQ)</a></li>
                  </ul>
                </div>
                <div>
                  <h6 className="text-[#E0A800] font-bold text-lg mb-4 tracking-wide">เกี่ยวกับเรา</h6>
                  <ul className="space-y-3 text-sm">
                    <li><a href="/about" className="hover:text-[#E0A800] transition-colors">เรื่องราวของเรา</a></li>
                    <li><a href="/contact" className="hover:text-[#E0A800] transition-colors">ติดต่อเรา</a></li>
                    <li><a href="/careers" className="hover:text-[#E0A800] transition-colors">ร่วมงานกับเรา</a></li>
                    <li><a href="/terms" className="hover:text-[#E0A800] transition-colors">ข้อกำหนดและเงื่อนไข</a></li>
                  </ul>
                </div>
              </div>
              <div className="pt-8 border-t border-white/10 text-center md:flex md:justify-between md:text-left">
                <p className="text-sm text-white/60 mb-4 md:mb-0">
                  © {new Date().getFullYear()} MK340 Meal Kits — สงวนลิขสิทธิ์
                </p>
                <div className="flex justify-center md:justify-end gap-4 text-white/60">
                  <a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a>
                  <span>|</span>
                  <a href="/terms" className="hover:text-white transition-colors">Terms of Service</a>
                </div>
              </div>
            </div>
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}
