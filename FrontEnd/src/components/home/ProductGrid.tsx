import React, { useState, useEffect } from 'react';
import type { Product } from '../../types/index.js';
import { fetchProducts } from '../../services/api.js';
import { ProductCard } from '../product/ProductCard.js';
import { Sparkles } from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: 'Tất Cả Hương Sắc' },
  { id: 'nuoc-hoa', label: 'Nước Hoa Niche' },
  { id: 'tram-huong', label: 'Trầm Hương Cổ Thụ' },
  { id: 'nen-thom', label: 'Nến Thơm Bấc Gỗ' }
];

export const ProductGrid: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await fetchProducts();
      setProducts(data);
      setLoading(false);
    }
    load();
  }, []);

  const filteredProducts = activeCategory === 'all'
    ? products
    : products.filter(p => p.category === activeCategory);

  return (
    <section id="collection" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold flex items-center justify-center space-x-1 mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Tuyển Tập Độc Bản</span>
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#EDEDED] font-normal">
          Bộ Sưu Tập Hương Nghệ Thuật
        </h2>
        <p className="text-sm text-[#A1A1AA] font-light mt-3">
          Mỗi tác phẩm là một câu chuyện riêng biệt, được chiết xuất từ những nguyên liệu 
          quý hiếm và đắt giá nhất của đất trời phương Đông.
        </p>
      </div>

      {/* Category filter tabs */}
      <div className="flex items-center justify-center flex-wrap gap-2 sm:gap-3 mb-12">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-5 py-2.5 rounded-full text-xs uppercase tracking-wider font-medium transition-all duration-200 cursor-pointer ${
              activeCategory === cat.id
                ? 'bg-[#D4AF37] text-[#0c0c0e] shadow-lg shadow-[#D4AF37]/20 font-semibold'
                : 'bg-[#18181d] text-[#A1A1AA] hover:text-white border border-[#27272a] hover:border-[#D4AF37]/40'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Responsive Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="h-96 rounded-2xl bg-[#141418] animate-pulse border border-[#27272a]" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {filteredProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      )}
    </section>
  );
};
