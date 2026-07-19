export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-20 max-w-4xl">
      <h1 className="text-4xl font-extrabold text-center mb-8">เรื่องราวของเรา (Our Story)</h1>
      
      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-base-200">
        <h2 className="text-2xl font-bold text-[#E0A800] mb-4">จุดเริ่มต้นของ MK340 Meal Kits</h2>
        <p className="text-lg text-base-content/80 leading-relaxed mb-6">
          เราเริ่มต้นจากความเชื่อที่ว่า "ทุกคนสามารถทำอาหารอร่อยๆ ทานเองที่บ้านได้" 
          แต่ในยุคที่เร่งรีบ หลายคนไม่มีเวลาไปเดินตลาด ไม่รู้จะซื้อวัตถุดิบปริมาณเท่าไหร่ หรือเบื่อที่จะต้องคิดเมนูในแต่ละวัน
        </p>
        
        <p className="text-lg text-base-content/80 leading-relaxed mb-6">
          MK340 จึงถือกำเนิดขึ้นเพื่อเป็นผู้ช่วยส่วนตัวในครัวของคุณ เรามีทีมเชฟที่คอยคิดค้นสูตรอาหารยอดฮิต คัดสรรวัตถุดิบที่สดใหม่ในปริมาณที่พอดีเป๊ะ 
          แพ็คอย่างใส่ใจ และส่งตรงถึงบ้าน เพื่อให้การเข้าครัวของคุณเป็นเรื่องสนุก ไม่วุ่นวาย และไร้ของเหลือทิ้ง (Zero Food Waste)
        </p>

        <h2 className="text-2xl font-bold text-[#E0A800] mb-4 mt-10">คำมั่นสัญญาของเรา</h2>
        <ul className="list-disc list-inside text-lg text-base-content/80 space-y-3">
          <li>วัตถุดิบคุณภาพดีที่สุด สด สะอาด ปลอดภัย</li>
          <li>สัดส่วนพอดีเป๊ะ หมดปัญหาซื้อของมาแล้วใช้ไม่หมด</li>
          <li>รสชาติอร่อยระดับร้านอาหาร ทำตามได้ง่ายๆ ใน 15-30 นาที</li>
        </ul>
      </div>
    </div>
  );
}
