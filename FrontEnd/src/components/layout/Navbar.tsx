import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Menu, X, Sparkles, Compass } from 'lucide-react';
import { useCart } from '../../context/CartContext.js';

export const Navbar: React.FC = () => {
  const { totalItems, setIsCartOpen } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#0c0c0e]/85 backdrop-blur-md border-b border-[#27272a]/60 py-3.5 shadow-2xl shadow-black/50'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden p-2 text-[#A1A1AA] hover:text-[#D4AF37] transition-colors focus:outline-none"
            aria-label="Open navigation menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Brand Logo */}
          <a href="#" className="flex flex-col items-center group">
            <span className="font-serif text-xl sm:text-2xl md:text-3xl tracking-[0.25em] text-[#EDEDED] group-hover:text-[#D4AF37] transition-colors duration-300 font-light uppercase">
              Tàn Sắc Vẹn Hương
            </span>
            <span className="text-[10px] tracking-[0.4em] text-[#D4AF37]/80 uppercase font-sans mt-0.5">
              Hương Nghệ Thuật Á Đông
            </span>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8 text-sm tracking-wider uppercase text-[#A1A1AA]">
            <a href="#collection" className="hover:text-[#D4AF37] transition-colors duration-200">
              Bộ Sưu Tập
            </a>
            <a href="#philosophy" className="hover:text-[#D4AF37] transition-colors duration-200">
              Triết Lý Hương
            </a>
            <a href="#notes" className="hover:text-[#D4AF37] transition-colors duration-200">
              Nốt Hương Niche
            </a>
            <a href="#contact" className="hover:text-[#D4AF37] transition-colors duration-200">
              Liên Hệ
            </a>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-full bg-[#18181b]/80 hover:bg-[#27272a] border border-[#27272a] hover:border-[#D4AF37]/40 text-[#EDEDED] transition-all duration-200"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-[#D4AF37] text-[#0c0c0e] text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-lg shadow-[#D4AF37]/30"
                >
                  {totalItems}
                </motion.span>
              )}
            </motion.button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-4/5 max-w-sm h-full bg-[#121216] border-r border-[#27272a] p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-[#27272a]">
                  <span className="font-serif text-lg tracking-[0.2em] text-[#D4AF37]">
                    TÀN SẮC VẸN HƯƠNG
                  </span>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1 text-[#A1A1AA] hover:text-white"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <nav className="mt-8 flex flex-col space-y-6 text-base tracking-widest uppercase">
                  <a
                    href="#collection"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-3 text-[#EDEDED] hover:text-[#D4AF37]"
                  >
                    <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                    <span>Bộ Sưu Tập</span>
                  </a>
                  <a
                    href="#philosophy"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-3 text-[#EDEDED] hover:text-[#D4AF37]"
                  >
                    <Compass className="w-4 h-4 text-[#D4AF37]" />
                    <span>Triết Lý Hương</span>
                  </a>
                  <a
                    href="#notes"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-[#EDEDED] hover:text-[#D4AF37] pl-7"
                  >
                    Nốt Hương Niche
                  </a>
                  <a
                    href="#contact"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-[#EDEDED] hover:text-[#D4AF37] pl-7"
                  >
                    Liên Hệ
                  </a>
                </nav>
              </div>

              <div className="pt-6 border-t border-[#27272a] text-xs text-[#A1A1AA] space-y-2">
                <p>Hotline tư vấn: 0987.654.321</p>
                <p>Thanh toán VietQR Napas 24/7 tức thì</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
