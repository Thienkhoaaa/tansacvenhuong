import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Eye, Star, Zap } from 'lucide-react';
import type { Product } from '../../types/index.js';
import { useCart } from '../../context/CartContext.js';

interface ProductCardProps {
  product: Product;
  index: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, index }) => {
  const { addToCart, setActiveProductForModal, setIsCheckoutOpen } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const handleQuickBuy = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    setIsCheckoutOpen(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative flex flex-col bg-[#141418] rounded-2xl overflow-hidden border border-[#27272a]/70 hover:border-[#D4AF37]/50 transition-all duration-300 hover:shadow-2xl hover:shadow-black/70"
    >
      {/* Product Image & Badges */}
      <div 
        onClick={() => setActiveProductForModal(product)}
        className="relative aspect-[4/5] overflow-hidden bg-[#18181d] cursor-pointer"
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#141418] via-transparent to-transparent opacity-80" />

        {/* Badge */}
        {product.badge && (
          <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-[11px] font-medium tracking-wider uppercase bg-[#18181b]/90 backdrop-blur-md border border-[#D4AF37]/40 text-[#D4AF37]">
            {product.badge}
          </div>
        )}

        {/* Quick view button overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveProductForModal(product);
            }}
            className="pointer-events-auto px-4 py-2 rounded-full bg-black/75 backdrop-blur-md text-white text-xs tracking-wider uppercase flex items-center space-x-2 border border-white/20 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Xem Chi Tiết</span>
          </button>
        </div>

        {/* Volume badge */}
        <div className="absolute bottom-3 right-3 text-[11px] text-[#A1A1AA] bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm">
          {product.volume}
        </div>
      </div>

      {/* Info Section */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Rating */}
          <div className="flex items-center space-x-1.5 mb-2">
            <div className="flex items-center text-[#D4AF37]">
              <Star className="w-3.5 h-3.5 fill-[#D4AF37]" />
            </div>
            <span className="text-xs text-[#EDEDED] font-medium">{product.rating}</span>
            <span className="text-[11px] text-[#71717A]">({product.reviewsCount})</span>
          </div>

          <h3 
            onClick={() => setActiveProductForModal(product)}
            className="font-serif text-xl text-[#EDEDED] group-hover:text-[#D4AF37] transition-colors duration-200 cursor-pointer font-medium"
          >
            {product.name}
          </h3>
          <p className="text-xs text-[#A1A1AA] line-clamp-1 mt-1 font-light">
            {product.subtitle}
          </p>

          {/* Scent notes tag preview */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {product.notes.top.slice(0, 2).map((note, i) => (
              <span
                key={i}
                className="text-[10px] px-2 py-0.5 rounded bg-[#1f1f26] text-[#A1A1AA] border border-[#2d2d37]"
              >
                {note}
              </span>
            ))}
            {product.notes.middle.slice(0, 1).map((note, i) => (
              <span
                key={i}
                className="text-[10px] px-2 py-0.5 rounded bg-[#1f1f26] text-[#A1A1AA] border border-[#2d2d37]"
              >
                {note}
              </span>
            ))}
          </div>
        </div>

        {/* Price & Action Buttons */}
        <div className="mt-5 pt-4 border-t border-[#27272a]/60">
          <div className="flex items-baseline justify-between mb-3">
            <div>
              <span className="text-lg font-serif font-semibold text-[#D4AF37]">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="ml-2 text-xs text-[#71717A] line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => addToCart(product, 1)}
              className="py-2.5 px-3 rounded-lg bg-[#1c1c22] hover:bg-[#27272a] border border-[#2d2d37] hover:border-[#D4AF37]/50 text-xs font-medium text-[#EDEDED] flex items-center justify-center space-x-1.5 transition-all duration-200 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Thêm Giỏ</span>
            </button>

            <button
              onClick={handleQuickBuy}
              className="py-2.5 px-3 rounded-lg bg-[#D4AF37] hover:bg-[#c5a059] text-xs font-semibold text-[#0c0c0e] flex items-center justify-center space-x-1 transition-all duration-200 shadow-md shadow-[#D4AF37]/20 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Mua Ngay</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
