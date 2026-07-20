import { MapPin, Info } from "lucide-react";

export default function ServiceAreasPage() {
  return (
    <div className="container mx-auto px-4 py-20 max-w-3xl">
      <h1 className="text-4xl font-extrabold text-center mb-6 text-[#333333]">พื้นที่ให้บริการ (Service Areas)</h1>
      <p className="text-center text-lg text-[#333333]/70 mb-12">
        เราจัดส่งชุดอาหารพร้อมทำ (Meal Kits) แบบควบคุมอุณหภูมิ เพื่อให้วัตถุดิบสดใหม่เสมอ
      </p>

      <div className="bg-white text-[#333333] shadow-xl rounded-2xl p-8 border border-gray-100">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
          <MapPin className="text-[#E0A800]" /> พื้นที่จัดส่งปัจจุบัน
        </h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="font-bold text-lg text-[#E0A800]">📍 กรุงเทพมหานคร และปริมณฑล</h3>
            <p className="text-[#333333]/70 mt-2">
              ให้บริการจัดส่งครอบคลุมทุกเขตในกรุงเทพฯ, นนทบุรี, ปทุมธานี และสมุทรปราการ<br/>
              <span className="font-semibold text-[#E0A800]">จัดส่งทุกวัน (สั่งล่วงหน้า 1 วัน)</span>
            </p>
          </div>
          
          <div className="divider"></div>
          
          <div>
            <h3 className="font-bold text-lg text-[#E0A800]">📍 ต่างจังหวัด (เมืองใหญ่)</h3>
            <p className="text-[#333333]/70 mt-2">
              ให้บริการใน ชลบุรี, เชียงใหม่, ภูเก็ต, และขอนแก่น ผ่านรถขนส่งควบคุมอุณหภูมิ (Cold Chain Delivery)<br/>
              <span className="font-semibold text-[#E0A800]">จัดส่งทุกวันอังคาร - เสาร์ (สั่งล่วงหน้า 2 วัน)</span>
            </p>
          </div>
        </div>

        <div className="mt-8 bg-blue-50 text-blue-800 p-4 rounded-xl flex items-start gap-3">
          <Info className="flex-shrink-0 mt-1" />
          <p className="text-sm">
            พื้นที่อื่นๆ นอกเหนือจากนี้ ทางเรากำลังเร่งขยายพื้นที่ให้บริการในอนาคตอันใกล้ หากคุณมีข้อสงสัยเกี่ยวกับพื้นที่จัดส่ง สามารถติดต่อแอดมินได้โดยตรงครับ
          </p>
        </div>
      </div>
    </div>
  );
}
