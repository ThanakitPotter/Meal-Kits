export default function CareersPage() {
  return (
    <div className="container mx-auto px-4 py-20 max-w-4xl">
      <h1 className="text-4xl font-extrabold text-center mb-6">ร่วมงานกับเรา (Careers)</h1>
      <p className="text-center text-lg text-[#333333]/70 mb-12">
        มาร่วมเป็นส่วนหนึ่งในการส่งมอบความอร่อยถึงบ้านกับ MK340
      </p>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="card bg-white text-[#333333] shadow-sm border border-base-200">
          <div className="card-body">
            <h2 className="card-title text-[#E0A800]">Chef & Recipe Developer</h2>
            <p className="text-[#333333]/70">
              ผู้ที่มีใจรักในการทำอาหารและคิดค้นสูตรใหม่ๆ คุณจะได้ร่วมออกแบบ Meal Kits ที่ใครๆ ก็ทำตามได้
            </p>
            <div className="card-actions justify-end mt-4">
              <button className="btn btn-outline btn-sm">ดูรายละเอียด</button>
            </div>
          </div>
        </div>

        <div className="card bg-white text-[#333333] shadow-sm border border-base-200">
          <div className="card-body">
            <h2 className="card-title text-[#E0A800]">Food Delivery Driver</h2>
            <p className="text-[#333333]/70">
              พนักงานจัดส่งที่รักบริการ พร้อมรถจักรยานยนต์หรือรถยนต์ส่วนตัว (มีกล่องเก็บความเย็นจะพิจารณาเป็นพิเศษ)
            </p>
            <div className="card-actions justify-end mt-4">
              <button className="btn btn-outline btn-sm">ดูรายละเอียด</button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="text-center mt-12">
        <p className="text-[#333333]/70">ส่งเรซูเม่ของคุณมาที่ <a href="mailto:hr@mk340mealkits.com" className="text-[#E0A800] font-bold">hr@mk340mealkits.com</a></p>
      </div>
    </div>
  );
}
