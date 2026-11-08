import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[600px] h-[350px] sm:h-[600px] bg-[#D4AF37]/10 rounded-full blur-[140px] pointer-events-none animate-ambient-glow" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-[#C5A059]/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Decorative subtle grid background */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}
      />

      <div className="relative max-w-5xl mx-auto text-center z-10">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#1c1c22]/90 border border-[#D4AF37]/30 text-[#D4AF37] text-xs sm:text-sm tracking-widest uppercase mb-8 shadow-inner"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Nghệ Thuật Hương Khói & Nước Hoa Tĩnh Lặng</span>
        </motion.div>

        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-[#EDEDED] font-normal leading-[1.1] mb-6"
        >
          Tàn Sắc <span className="italic font-light text-[#D4AF37]">Vẹn Hương</span>
        </motion.h1>

        {/* Subtitle / Poetic philosophy */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-[#A1A1AA] font-light leading-relaxed mb-10"
        >
          Khi nén hương tàn rơi nhẹ trên mặt gốm mộc, hương thơm nguyên bản của đất trời 
          đọng lại trong tâm trí — sâu lắng, thuần khiết và vĩnh cửu.
        </motion.p>

        {/* Call to action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
        >
          <a
            href="#collection"
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#D4AF37] hover:bg-[#c5a059] text-[#0c0c0e] font-medium text-sm tracking-wider uppercase flex items-center justify-center space-x-2 shadow-lg shadow-[#D4AF37]/20 transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]"
          >
            <span>Khám Phá Bộ Sưu Tập</span>
            <ArrowRight className="w-4 h-4" />
          </a>

          <a
            href="#philosophy"
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#18181b]/90 hover:bg-[#27272a] border border-[#27272a] hover:border-[#D4AF37]/50 text-[#EDEDED] text-sm tracking-wider uppercase transition-all duration-300"
          >
            <span>Triết Lý Hương Sắc</span>
          </a>
        </motion.div>

        {/* Value Propositions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 sm:mt-20 pt-8 border-t border-[#27272a]/60 grid grid-cols-2 sm:grid-cols-3 gap-6 text-left"
        >
          <div className="flex items-start space-x-3">
            <div className="p-2 rounded-lg bg-[#18181b] border border-[#27272a] text-[#D4AF37] shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-[#EDEDED]">Thanh Toán QR Siêu Tốc</h4>
              <p className="text-xs text-[#A1A1AA] mt-0.5">Quét VietQR từ mọi ngân hàng, xác nhận 1–3s</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="p-2 rounded-lg bg-[#18181b] border border-[#27272a] text-[#D4AF37] shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-[#EDEDED]">Nguyên Liệu Tự Nhiên</h4>
              <p className="text-xs text-[#A1A1AA] mt-0.5">Trầm hương cổ thụ & tinh dầu ép lạnh</p>
            </div>
          </div>

          <div className="hidden sm:flex items-start space-x-3 col-span-2 sm:col-span-1">
            <div className="p-2 rounded-lg bg-[#18181b] border border-[#27272a] text-[#D4AF37] shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-[#EDEDED]">Giao Hàng Toàn Quốc</h4>
              <p className="text-xs text-[#A1A1AA] mt-0.5">Đóng gói thủ công sang trọng, bảo hiểm vỡ</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

