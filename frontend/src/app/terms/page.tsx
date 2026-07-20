import { Scale, ShieldCheck, CreditCard, RefreshCcw } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-20 max-w-4xl animate-fade-in-up">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-5xl font-extrabold text-[#333333] mb-4">ข้อกำหนดและเงื่อนไข</h1>
        <p className="text-[#333333]/60">อัปเดตล่าสุด: 20 กรกฎาคม 2026</p>
      </div>
      
      <div className="card bg-white shadow-xl border border-gray-100 text-[#333333]">
        <div className="card-body p-6 md:p-10 space-y-8">
          
          <section className="flex gap-4 md:gap-6 flex-col md:flex-row">
            <div className="mt-1 flex-shrink-0">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                <Scale size={24} />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-3 text-[#333333]">1. การยอมรับข้อตกลง</h3>
              <p className="text-[#333333]/80 leading-relaxed text-sm md:text-base">
                การเข้าถึงและใช้งานเว็บไซต์ MK340 Meal Kits ถือว่าท่านตกลงยอมรับข้อกำหนดและเงื่อนไขเหล่านี้ 
                หากท่านไม่เห็นด้วยกับข้อกำหนดใดๆ กรุณางดใช้บริการของเรา การเปลี่ยนแปลงข้อกำหนดอาจเกิดขึ้นได้ทุกเมื่อและจะมีผลทันทีที่ประกาศผ่านทางเว็บไซต์
              </p>
            </div>
          </section>

          <div className="divider my-0 opacity-30"></div>

          <section className="flex gap-4 md:gap-6 flex-col md:flex-row">
            <div className="mt-1 flex-shrink-0">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                <CreditCard size={24} />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-3 text-[#333333]">2. การสั่งซื้อและการชำระเงิน</h3>
              <p className="text-[#333333]/80 leading-relaxed text-sm md:text-base">
                การสั่งซื้อทั้งหมดต้องชำระเงินล่วงหน้าผ่านช่องทางที่กำหนด ระบบจะยืนยันคำสั่งซื้อเมื่อการชำระเงินเสร็จสมบูรณ์
                หากพบปัญหาการชำระเงิน สามารถติดต่อฝ่ายสนับสนุนได้ทันที ราคาของชุดอาหารอาจมีการปรับเปลี่ยนตามต้นทุนวัตถุดิบและโปรโมชั่นตามช่วงเวลา
              </p>
            </div>
          </section>

          <div className="divider my-0 opacity-30"></div>

          <section className="flex gap-4 md:gap-6 flex-col md:flex-row">
            <div className="mt-1 flex-shrink-0">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                <RefreshCcw size={24} />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-3 text-[#333333]">3. นโยบายการคืนเงินและยกเลิก</h3>
              <p className="text-[#333333]/80 leading-relaxed text-sm md:text-base">
                เนื่องจากสินค้าเป็นอาหารสด เราขอสงวนสิทธิ์ในการยกเลิกหรือคืนเงินหากสินค้าได้ถูกจัดเตรียมหรืออยู่ในระหว่างการจัดส่งแล้ว 
                ในกรณีที่สินค้ามีความเสียหายจากกระบวนการขนส่ง หรือวัตถุดิบไม่ตรงตามคุณภาพ สามารถขอเคลมได้ภายใน 24 ชั่วโมง โดยต้องมีภาพถ่ายยืนยัน
              </p>
            </div>
          </section>

          <div className="divider my-0 opacity-30"></div>

          <section className="flex gap-4 md:gap-6 flex-col md:flex-row">
            <div className="mt-1 flex-shrink-0">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                <ShieldCheck size={24} />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-3 text-[#333333]">4. ข้อมูลส่วนบุคคลและนโยบายความเป็นส่วนตัว</h3>
              <p className="text-[#333333]/80 leading-relaxed text-sm md:text-base">
                ข้อมูลส่วนตัวของท่านจะถูกเก็บรักษาอย่างปลอดภัยและใช้เพื่อการจัดส่งสินค้าและพัฒนาบริการเท่านั้น 
                เราจะไม่เปิดเผยข้อมูลของท่านแก่บุคคลที่สามเว้นแต่จะได้รับความยินยอม หรือเป็นไปตามที่กฎหมายกำหนดเพื่อความปลอดภัยในการทำธุรกรรม
              </p>
            </div>
          </section>
          
        </div>
      </div>
    </div>
  );
}
