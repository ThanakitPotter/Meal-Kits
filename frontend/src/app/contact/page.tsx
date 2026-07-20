export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-20 max-w-2xl">
      <h1 className="text-4xl font-extrabold text-center mb-12 text-[#333333]">ติดต่อเรา (Contact Us)</h1>
      
      <div className="bg-white text-[#333333] shadow-xl rounded-2xl p-8 border border-gray-100">
        <form className="space-y-6">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-bold">ชื่อ - นามสกุล</span>
            </label>
            <input type="text" placeholder="ระบุชื่อของคุณ" className="input input-bordered w-full bg-white text-[#333333] placeholder:text-gray-400" />
          </div>
          
          <div className="form-control">
            <label className="label">
              <span className="label-text font-bold">อีเมล</span>
            </label>
            <input type="email" placeholder="example@email.com" className="input input-bordered w-full bg-white text-[#333333] placeholder:text-gray-400" />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-bold">ข้อความ</span>
            </label>
            <textarea className="textarea textarea-bordered h-32 w-full bg-white text-[#333333] placeholder:text-gray-400" placeholder="พิมพ์ข้อความที่คุณต้องการติดต่อ..."></textarea>
          </div>

          <button className="btn bg-[#E0A800] hover:bg-[#c98e10] text-white w-full border-none">ส่งข้อความ</button>
        </form>

        <div className="divider my-8">หรือติดต่อผ่านช่องทางอื่น</div>

        <div className="text-center space-y-2 text-[#333333]/70">
          <p><strong>Email:</strong> support@mk340mealkits.com</p>
          <p><strong>LINE Official:</strong> @mk340_mealkits</p>
          <p><strong>โทรศัพท์:</strong> 02-XXX-XXXX (จันทร์-ศุกร์ 09.00 - 18.00 น.)</p>
        </div>
      </div>
    </div>
  );
}
