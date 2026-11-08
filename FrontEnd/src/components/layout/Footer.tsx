import React from 'react';
import { ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer id="contact" className="border-t border-[#27272a] bg-[#0c0c0e] pt-16 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#27272a]/70">
        {/* Brand */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex flex-col items-start">
            <span className="font-serif text-2xl tracking-[0.25em] text-[#EDEDED] uppercase">
              Tàn Sắc Vẹn Hương
            </span>
            <span className="text-[11px] tracking-[0.35em] text-[#D4AF37] uppercase mt-1">
              Hương Nghệ Thuật Á Đông
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#A1A1AA] max-w-md font-light leading-relaxed">
            Chúng tôi tạo nên những mùi hương tĩnh lặng kết tinh từ trầm hương nguyên bản, thảo mộc phương Đông 
            và triết lý thưởng hương chánh niệm.
          </p>
          <div className="flex items-center space-x-2 text-xs text-[#D4AF37]">
            <ShieldCheck className="w-4 h-4" />
            <span>Thanh toán VietQR Napas 24/7 hoàn toàn 0% phụ phí</span>
          </div>
        </div>

        {/* Quick links */}
        <div>
          <h4 className="font-serif text-sm uppercase tracking-widest text-[#EDEDED] font-semibold mb-4">
            Khám Phá
          </h4>
          <ul className="space-y-2.5 text-xs text-[#A1A1AA]">
            <li><a href="#collection" className="hover:text-[#D4AF37] transition-colors">Bộ Sưu Tập Nước Hoa</a></li>
            <li><a href="#collection" className="hover:text-[#D4AF37] transition-colors">Trầm Hương Cổ Thụ</a></li>
            <li><a href="#collection" className="hover:text-[#D4AF37] transition-colors">Nến Thơm Sáp Khoáng</a></li>
            <li><a href="#philosophy" className="hover:text-[#D4AF37] transition-colors">Nghệ Thuật Khói Hương</a></li>
          </ul>
        </div>

        {/* Contact info */}
        <div>
          <h4 className="font-serif text-sm uppercase tracking-widest text-[#EDEDED] font-semibold mb-4">
            Liên Hệ & Ghé Thăm
          </h4>
          <ul className="space-y-2.5 text-xs text-[#A1A1AA]">
            <li>Trụ sở: Phố Cổ Hà Nội & Quận 1 TP. Hồ Chí Minh</li>
            <li>Hotline: <span className="text-[#EDEDED]">0987.654.321</span></li>
            <li>Email: <span className="text-[#EDEDED]">huong@tansacvenhuong.vn</span></li>
            <li>Giờ mở cửa: 09:00 - 21:00 hàng ngày</li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#71717A] space-y-4 sm:space-y-0">
        <p>&copy; {new Date().getFullYear()} Tàn Sắc Vẹn Hương. All rights reserved.</p>
        <div className="flex items-center space-x-1">
          <span>Chế tác với</span>
          <Heart className="w-3.5 h-3.5 text-[#D4AF37] fill-[#D4AF37]" />
          <span>dành cho người yêu nghệ thuật hương sắc</span>
        </div>
      </div>
    </footer>
  );
};
