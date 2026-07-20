import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-20 max-w-5xl animate-fade-in-up">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-5xl font-extrabold text-[#333333] mb-4">ติดต่อเรา</h1>
        <p className="text-[#333333]/70 max-w-lg mx-auto">
          มีข้อสงสัย หรือต้องการความช่วยเหลือ? ทีมงาน Meal Kits ยินดีให้บริการอย่างเต็มที่ครับ
        </p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8 items-start">
        {/* Contact Info */}
        <div className="space-y-6 md:col-span-1">
          <div className="card bg-white text-[#333333] shadow-md border border-gray-100 p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-primary/15 rounded-full flex items-center justify-center text-primary shrink-0">
                <Phone size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg">เบอร์โทรศัพท์</h3>
                <p className="text-sm text-[#333333]/70">02-340-XXXX</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-primary/15 rounded-full flex items-center justify-center text-primary shrink-0">
                <Mail size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg">อีเมล</h3>
                <p className="text-sm text-[#333333]/70 break-all">support@mk340.com</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/15 rounded-full flex items-center justify-center text-primary shrink-0">
                <MapPin size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg">ที่อยู่</h3>
                <p className="text-sm text-[#333333]/70">123 ถ.สุขุมวิท เขตวัฒนา<br/>กรุงเทพฯ 10110</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="card bg-white text-[#333333] shadow-xl border border-gray-100 md:col-span-2">
          <div className="card-body p-6 md:p-8">
            <h2 className="text-2xl font-bold mb-4">ส่งข้อความหาเรา</h2>
            <form className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-bold text-[#333333]">ชื่อ - นามสกุล</span>
                  </label>
                  <input type="text" placeholder="ระบุชื่อของคุณ" className="input input-bordered w-full bg-white text-[#333333] placeholder:text-gray-400 focus:border-primary focus:outline-none transition-all" />
                </div>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-bold text-[#333333]">อีเมล</span>
                  </label>
                  <input type="email" placeholder="example@email.com" className="input input-bordered w-full bg-white text-[#333333] placeholder:text-gray-400 focus:border-primary focus:outline-none transition-all" />
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-bold text-[#333333]">ข้อความ</span>
                </label>
                <textarea className="textarea textarea-bordered h-32 w-full bg-white text-[#333333] placeholder:text-gray-400 focus:border-primary focus:outline-none transition-all" placeholder="พิมพ์ข้อความที่คุณต้องการติดต่อ..."></textarea>
              </div>

              <button className="btn btn-primary w-full text-white mt-4 gap-2 text-lg shadow-md hover:shadow-lg transition-all">
                <Send size={18} /> ส่งข้อความ
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
