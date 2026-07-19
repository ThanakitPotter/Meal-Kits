import { Package, ChefHat, Truck } from "lucide-react";

export default function HowToOrderPage() {
  return (
    <div className="container mx-auto px-4 py-20 max-w-4xl">
      <h1 className="text-4xl font-extrabold text-center mb-12">วิธีการสั่งซื้อ (How to Order)</h1>
      <div className="space-y-12">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="bg-[#E0A800]/20 p-6 rounded-full flex-shrink-0">
            <ChefHat size={48} className="text-[#E0A800]" />
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-3">1. เลือกเมนูที่คุณชื่นชอบ</h3>
            <p className="text-lg text-base-content/70 leading-relaxed">
              เข้าไปที่หน้าแรกและเลือกเมนูจาก "เมนูยอดฮิต" ของเรา แต่ละเมนูจะถูกเตรียมวัตถุดิบและซอสปรุงรสในสัดส่วนที่พอดีสำหรับ 1-2 ท่าน
            </p>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row-reverse items-center gap-8">
          <div className="bg-[#E0A800]/20 p-6 rounded-full flex-shrink-0">
            <Package size={48} className="text-[#E0A800]" />
          </div>
          <div className="md:text-right">
            <h3 className="text-2xl font-bold mb-3">2. เราจัดเตรียมวัตถุดิบสดใหม่</h3>
            <p className="text-lg text-base-content/70 leading-relaxed">
              เชฟของเราจะทำการคัดสรรวัตถุดิบ หั่น และตวงสัดส่วนให้คุณล่วงหน้า พร้อมบรรจุลงในกล่องเก็บความเย็น เพื่อรักษาความสดใหม่
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="bg-[#E0A800]/20 p-6 rounded-full flex-shrink-0">
            <Truck size={48} className="text-[#E0A800]" />
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-3">3. จัดส่งถึงหน้าบ้านคุณ</h3>
            <p className="text-lg text-base-content/70 leading-relaxed">
              รอรับ Meal Kits ที่หน้าบ้านของคุณได้เลย! เมื่อได้รับแล้ว สามารถทำตามสูตรอาหารที่แนบมาในกล่องได้ง่ายๆ อร่อยเหมือนมีเชฟมาทำให้
            </p>
          </div>
        </div>
      </div>
      
      <div className="text-center mt-16">
        <a href="/" className="btn bg-[#E0A800] hover:bg-[#c98e10] text-white border-none rounded-full px-8">
          กลับไปเลือกเมนู
        </a>
      </div>
    </div>
  );
}
