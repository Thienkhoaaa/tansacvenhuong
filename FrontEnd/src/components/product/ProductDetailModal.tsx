import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, ShoppingBag, Zap, Droplets, Flame, Wind } from 'lucide-react';
import { useCart } from '../../context/CartContext.js';

export const ProductDetailModal: React.FC = () => {
  const { activeProductForModal, setActiveProductForModal, addToCart, setIsCheckoutOpen } = useCart();
  const [quantity, setQuantity] = useState(1);

  if (!activeProductForModal) return null;

  const product = activeProductForModal;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const handleClose = () => {
    setActiveProductForModal(null);
    setQuantity(1);
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    handleClose();
  };

  const handleQuickCheckout = () => {
    addToCart(product, quantity);
    handleClose();
    setIsCheckoutOpen(true);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 260 }}
          className="relative w-full max-w-3xl bg-[#121216] border border-[#27272a] rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden z-10 my-8"
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 text-[#A1A1AA] hover:text-white hover:bg-black/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Image Section */}
            <div className="relative aspect-square md:aspect-auto min-h-[300px] md:min-h-full bg-[#18181d]">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#121216] via-transparent to-transparent md:hidden" />
              {product.badge && (
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider bg-[#18181b]/90 border border-[#D4AF37]/50 text-[#D4AF37]">
                  {product.badge}
                </div>
              )}
            </div>

            {/* Info Section */}
            <div className="p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-2 text-xs text-[#D4AF37] mb-2">
                  <Star className="w-4 h-4 fill-[#D4AF37]" />
                  <span className="font-semibold">{product.rating}</span>
                  <span className="text-[#71717A]">({product.reviewsCount} đánh giá từ khách hàng)</span>
                </div>

                <h2 className="font-serif text-2xl sm:text-3xl text-[#EDEDED] font-medium leading-tight">
                  {product.name}
                </h2>
                <p className="text-sm text-[#A1A1AA] mt-1 font-light">
                  {product.subtitle} &bull; <span className="text-[#D4AF37]">{product.volume}</span>
                </p>

                <div className="my-4">
                  <span className="text-2xl font-serif font-bold text-[#D4AF37]">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="ml-3 text-sm text-[#71717A] line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-[#D1D1D6] leading-relaxed border-t border-b border-[#27272a] py-3 my-4">
                  {product.description}
                </p>

                {/* Scent Pyramid Breakdown */}
                <div className="space-y-2.5 my-4">
                  <h4 className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold">
                    Cấu Trúc Tầng Hương:
                  </h4>
                  <div className="space-y-1.5 text-xs text-[#A1A1AA]">
                    <div className="flex items-start space-x-2">
                      <Wind className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[#EDEDED] font-medium">Hương đầu:</span>{' '}
                        {product.notes.top.join(', ')}
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Droplets className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[#EDEDED] font-medium">Hương giữa:</span>{' '}
                        {product.notes.middle.join(', ')}
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Flame className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[#EDEDED] font-medium">Hương cuối:</span>{' '}
                        {product.notes.base.join(', ')}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quantity & CTAs */}
              <div className="pt-4 border-t border-[#27272a] space-y-3">
                <div className="flex items-center space-x-4">
                  <span className="text-xs text-[#A1A1AA] uppercase tracking-wider">Số lượng:</span>
                  <div className="flex items-center border border-[#27272a] rounded-lg bg-[#18181b]">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-1 text-sm text-[#A1A1AA] hover:text-white"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 text-sm font-medium text-white">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-1 text-sm text-[#A1A1AA] hover:text-white"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={handleAddToCart}
                    className="py-3 px-4 rounded-xl bg-[#1c1c22] hover:bg-[#27272a] border border-[#27272a] hover:border-[#D4AF37]/50 text-xs sm:text-sm font-medium text-[#EDEDED] flex items-center justify-center space-x-2 transition-all duration-200"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Thêm Giỏ Hàng</span>
                  </button>

                  <button
                    onClick={handleQuickCheckout}
                    className="py-3 px-4 rounded-xl bg-[#D4AF37] hover:bg-[#c5a059] text-xs sm:text-sm font-semibold text-[#0c0c0e] flex items-center justify-center space-x-1.5 transition-all duration-200 shadow-lg shadow-[#D4AF37]/20"
                  >
                    <Zap className="w-4 h-4" />
                    <span>Mua Ngay</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

