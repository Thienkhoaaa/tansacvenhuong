import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';
import { useCart } from '../../context/CartContext.js';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    totalAmount,
    totalItems,
    setIsCheckoutOpen
  } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const handleProceedCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="w-screen max-w-md bg-[#121216] border-l border-[#27272a] shadow-2xl flex flex-col justify-between"
            >
              {/* Header */}
              <div className="p-6 border-b border-[#27272a] flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ShoppingBag className="w-5 h-5 text-[#D4AF37]" />
                  <h3 className="font-serif text-lg tracking-wider text-[#EDEDED] font-medium">
                    Túi Hương Của Bạn ({totalItems})
                  </h3>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-1.5 rounded-full hover:bg-[#27272a] text-[#A1A1AA] hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-16">
                    <div className="w-16 h-16 rounded-full bg-[#18181d] border border-[#27272a] flex items-center justify-center text-[#71717A] mb-4">
                      <ShoppingBag className="w-8 h-8" />
                    </div>
                    <p className="text-base font-serif text-[#EDEDED]">Túi hương hiện đang trống</p>
                    <p className="text-xs text-[#A1A1AA] mt-1 max-w-xs">
                      Hãy thêm những nốt hương tĩnh lặng cho tâm hồn của bạn hôm nay.
                    </p>
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="mt-6 px-6 py-2.5 rounded-full bg-[#1c1c22] hover:bg-[#27272a] border border-[#27272a] text-xs text-[#D4AF37] uppercase tracking-wider"
                    >
                      Tiếp tục thưởng hương
                    </button>
                  </div>
                ) : (
                  cart.map(({ product, quantity }) => (
                    <motion.div
                      layout
                      key={product.id}
                      className="flex space-x-4 p-3 rounded-xl bg-[#18181d] border border-[#27272a]/60"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-20 h-24 object-cover rounded-lg bg-[#27272a] shrink-0"
                      />
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                            <h4 className="font-serif text-sm font-medium text-[#EDEDED] line-clamp-1">
                              {product.name}
                            </h4>
                            <button
                              onClick={() => removeFromCart(product.id)}
                              className="text-[#71717A] hover:text-red-400 p-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <p className="text-[11px] text-[#A1A1AA]">{product.volume}</p>
                          <p className="text-xs font-semibold text-[#D4AF37] mt-1">
                            {formatPrice(product.price)}
                          </p>
                        </div>

                        {/* Quantity Counter */}
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(product.id, quantity - 1)}
                            className="w-6 h-6 rounded bg-[#27272a] text-[#EDEDED] text-xs flex items-center justify-center hover:bg-[#3f3f46]"
                          >
                            -
                          </button>
                          <span className="text-xs font-medium px-2">{quantity}</span>
                          <button
                            onClick={() => updateQuantity(product.id, quantity + 1)}
                            className="w-6 h-6 rounded bg-[#27272a] text-[#EDEDED] text-xs flex items-center justify-center hover:bg-[#3f3f46]"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Footer Checkout Summary */}
              {cart.length > 0 && (
                <div className="p-6 border-t border-[#27272a] bg-[#141418] space-y-4">
                  <div className="space-y-1.5 text-xs text-[#A1A1AA]">
                    <div className="flex justify-between">
                      <span>Tạm tính</span>
                      <span className="text-[#EDEDED]">{formatPrice(totalAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Phí vận chuyển</span>
                      <span className="text-[#D4AF37]">Miễn phí toàn quốc</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#27272a] flex justify-between items-baseline">
                    <span className="text-sm font-medium text-[#EDEDED]">Tổng thanh toán</span>
                    <span className="font-serif text-xl font-bold text-[#D4AF37]">
                      {formatPrice(totalAmount)}
                    </span>
                  </div>

                  <button
                    onClick={handleProceedCheckout}
                    className="w-full py-3.5 px-4 rounded-xl bg-[#D4AF37] hover:bg-[#c5a059] text-[#0c0c0e] font-semibold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg shadow-[#D4AF37]/20 transition-all duration-200"
                  >
                    <span>Tiến Hành Thanh Toán QR</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="flex items-center justify-center space-x-1.5 text-[11px] text-[#71717A]">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Cổng VietQR Napas 24/7 an toàn & 0% phụ phí</span>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
