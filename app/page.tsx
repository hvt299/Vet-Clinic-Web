import Link from "next/link";
import { ArrowRight, ShieldCheck, Heart, Stethoscope, Calendar, Phone } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans">
      {/* HEADER / NAVBAR */}
      <header className="border-b border-gray-100 fixed top-0 w-full bg-white/80 backdrop-blur-md z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary text-white p-1.5 rounded-lg">
              <Stethoscope size={24} />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
              VetClinic
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <Link href="#" className="hover:text-primary transition">Trang chủ</Link>
            <Link href="#services" className="hover:text-primary transition">Dịch vụ</Link>
            <Link href="#doctors" className="hover:text-primary transition">Đội ngũ</Link>
            <Link href="#contact" className="hover:text-primary transition">Liên hệ</Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="hidden md:flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition"
            >
              Quản trị viên <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold mb-6">
            <ShieldCheck size={14} /> Hệ thống thú y đạt chuẩn quốc tế
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
            Chăm sóc toàn diện cho <br />
            <span className="text-primary">thú cưng yêu quý</span> của bạn
          </h1>
          <p className="text-lg text-gray-500 mb-8 leading-relaxed">
            Chúng tôi cung cấp dịch vụ khám chữa bệnh, tiêm phòng và chăm sóc sức khỏe tốt nhất.
            Đội ngũ bác sĩ tận tâm, trang thiết bị hiện đại.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="px-8 py-3 bg-primary text-white rounded-full font-semibold shadow-lg shadow-primary/30 hover:bg-pink-600 transition w-full sm:w-auto">
              Đặt lịch ngay
            </button>
            <Link href="/login" className="px-8 py-3 bg-white text-gray-700 border border-gray-200 rounded-full font-semibold hover:bg-gray-50 transition w-full sm:w-auto flex items-center justify-center gap-2">
              Truy cập hệ thống
            </Link>
          </div>
        </div>
      </section>

      {/* SERVICES PREVIEW */}
      <section id="services" className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Dịch vụ nổi bật</h2>
            <p className="text-gray-500">Giải pháp y tế toàn diện cho thú cưng</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Activity, title: "Khám & Điều trị", desc: "Chẩn đoán chính xác, phác đồ điều trị hiệu quả cho mọi loại bệnh." },
              { icon: Heart, title: "Tiêm phòng", desc: "Đầy đủ các loại vắc-xin phòng bệnh nguy hiểm cho chó mèo." },
              { icon: Calendar, title: "Spa & Làm đẹp", desc: "Dịch vụ cắt tỉa lông, tắm gội giúp thú cưng luôn sạch sẽ." },
            ].map((item, index) => (
              <div key={index} className="p-8 rounded-2xl bg-gray-50 hover:bg-white border border-transparent hover:border-gray-100 hover:shadow-xl transition duration-300">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary mb-6">
                  <item.icon size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-6">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="bg-primary text-white p-1.5 rounded-lg">
              <Stethoscope size={20} />
            </div>
            <span className="text-lg font-bold text-white">VetClinic</span>
          </div>
          <p className="text-sm">
            © {new Date().getFullYear()} VetClinic System. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-white transition"><Phone size={20} /></Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

import { Activity } from "lucide-react";