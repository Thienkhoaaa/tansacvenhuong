import React from 'react';
import { motion } from 'framer-motion';
import { Feather, Flame, Wind } from 'lucide-react';

export const PhilosophySection: React.FC = () => {
  return (
    <section id="philosophy" className="py-24 px-4 sm:px-6 lg:px-8 border-t border-[#27272a]/60 relative overflow-hidden bg-[#0e0e12]">
      {/* Decorative blurred backdrop */}
      <div className="absolute -left-20 top-1/2 -translate-y-1/2 w-80 h-80 bg-[#D4AF37]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Visual column with stacked images / frames */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-[#27272a] shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&w=1000&q=80"
                alt="Triết lý thưởng hương"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e12] via-transparent to-transparent opacity-70" />
            </div>

            {/* Floating quote badge */}
            <div className="absolute -bottom-6 -right-4 sm:right-6 max-w-xs p-5 rounded-2xl bg-[#18181d]/95 backdrop-blur-md border border-[#D4AF37]/30 shadow-xl">
              <p className="font-serif italic text-sm text-[#D4AF37] leading-snug">
                "Hương không chỉ để ngửi, hương là cây cầu đưa tâm trí trở về với sự nguyên sơ tĩnh tại."
              </p>
              <span className="text-[10px] tracking-widest uppercase text-[#A1A1AA] block mt-2">
                — Nghệ nhân Tàn Sắc Vẹn Hương
              </span>
            </div>
          </motion.div>

          {/* Text column */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="space-y-6"
          >
            <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold">
              Triết Lý Nghệ Thuật
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#EDEDED] font-normal leading-tight">
              Tàn Tro Tan Biến, <br />
              <span className="italic text-[#D4AF37]">Hương Thơm Lưu Vẹn</span>
            </h2>

            <p className="text-sm sm:text-base text-[#A1A1AA] font-light leading-relaxed">
              Tên gọi <strong className="text-white font-medium">Tàn Sắc Vẹn Hương</strong> bắt nguồn từ quy luật 
              đẹp đẽ nhất của vạn vật: sắc tướng dù rực rỡ đến đâu cũng sẽ có lúc tàn phai, nhưng mùi hương thanh khiết 
              của tâm hồn và ký ức sẽ mãi vẹn nguyên qua năm tháng.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#27272a]">
              <div className="p-4 rounded-xl bg-[#141418] border border-[#27272a]/70">
                <Feather className="w-5 h-5 text-[#D4AF37] mb-2" />
                <h4 className="font-serif text-sm text-white font-medium">Nguyên Bản</h4>
                <p className="text-xs text-[#A1A1AA] mt-1">Trầm hương và thảo mộc tự nhiên được tuyển chọn kỹ càng.</p>
              </div>

              <div className="p-4 rounded-xl bg-[#141418] border border-[#27272a]/70">
                <Flame className="w-5 h-5 text-[#D4AF37] mb-2" />
                <h4 className="font-serif text-sm text-white font-medium">Thủ Công</h4>
                <p className="text-xs text-[#A1A1AA] mt-1">Chế tác từng mẻ nhỏ để giữ trọn vẹn tinh dầu tự nhiên.</p>
              </div>

              <div className="p-4 rounded-xl bg-[#141418] border border-[#27272a]/70">
                <Wind className="w-5 h-5 text-[#D4AF37] mb-2" />
                <h4 className="font-serif text-sm text-white font-medium">Tĩnh Tâm</h4>
                <p className="text-xs text-[#A1A1AA] mt-1">Thanh lọc không gian sống, dẫn lối giấc ngủ an lành.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
