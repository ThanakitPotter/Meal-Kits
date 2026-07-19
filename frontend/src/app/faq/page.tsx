export default function FaqPage() {
  const faqs = [
    {
      q: "Meal Kits คืออะไร?",
      a: "Meal Kits คือชุดวัตถุดิบอาหารพร้อมทำที่ถูกคัดสรร ตวง และหั่นมาให้เรียบร้อย พร้อมสูตรอาหารที่ทำตามได้ง่ายๆ ช่วยให้คุณประหยัดเวลาเตรียมอาหาร และได้ทานอาหารอร่อยเหมือนเชฟทำให้"
    },
    {
      q: "วัตถุดิบสามารถเก็บได้นานแค่ไหน?",
      a: "เราแนะนำให้ทำอาหารภายใน 3-5 วันหลังจากได้รับสินค้า เพื่อความสดใหม่และรสชาติที่ดีที่สุด กรุณาเก็บเนื้อสัตว์ไว้ในช่องแช่แข็ง และเก็บผักสดไว้ในตู้เย็นช่องธรรมดา"
    },
    {
      q: "ฉันทำอาหารไม่เป็น จะทำได้ไหม?",
      a: "แน่นอน! ทุกกล่องจะมี Recipe Card (การ์ดสูตรอาหาร) พร้อมรูปภาพและคำอธิบายทีละขั้นตอนอย่างละเอียด แม้คนที่ไม่เคยเข้าครัวมาก่อนก็สามารถทำออกมาอร่อยเป๊ะได้ครับ"
    },
    {
      q: "สามารถสั่งล่วงหน้าได้กี่วัน?",
      a: "คุณสามารถสั่งจองออเดอร์ล่วงหน้าได้สูงสุด 14 วัน และสามารถเลือกวันรับสินค้าที่สะดวกได้ในขั้นตอนการชำระเงิน"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-20 max-w-3xl">
      <h1 className="text-4xl font-extrabold text-center mb-12">คำถามที่พบบ่อย (FAQ)</h1>
      
      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div key={idx} className="collapse collapse-arrow bg-base-200">
            <input type="radio" name="faq-accordion" defaultChecked={idx === 0} /> 
            <div className="collapse-title text-xl font-medium">
              {faq.q}
            </div>
            <div className="collapse-content"> 
              <p className="text-base-content/80">{faq.a}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
