import type { Product } from '../types/index.js';

export const products: Product[] = [
  {
    id: 'tuy-loan-banh-trang-hop-5-cai',
    name: 'Hộp Bánh Tráng Túy Loan (5 cái)',
    subtitle: 'Đặc sản Hòa Vang – Đà Nẵng',
    category: 'dac-san',
    price: 120000,
    volume: 'Hộp 5 cái',
    description: 'Bánh tráng Túy Loan nguyên chất, đặc sản làng nghề truyền thống Hòa Vang, Đà Nẵng.',
    story: 'Giữ lửa Túy Loan – Giữ hồn xứ Quảng. Hương vị mộc mạc của làng nghề được gìn giữ qua nhiều thế hệ.',
    notes: { top: [], middle: [], base: [] },
    image: '/products/tuy-loan-rice-paper.png',
    badge: 'Đặc sản Túy Loan',
    inStock: true,
    rating: 5,
    reviewsCount: 0
  },
  {
    id: 'tuy-loan-banh-trang-hop-10-cai',
    name: 'Hộp Bánh Tráng Túy Loan Thượng Hạng (10 cái)',
    subtitle: 'Đặc sản biếu tặng truyền thống',
    category: 'dac-san',
    price: 230000,
    volume: 'Hộp 10 cái',
    description: 'Bánh tráng dày mè đường kính lớn, tráng tay thủ công phơi sấy truyền thống.',
    story: 'Món quà trang trọng gửi trọn hương vị tình quê Đà Nẵng.',
    notes: { top: [], middle: [], base: [] },
    image: '/products/tuy-loan-rice-paper.png',
    badge: 'Bán chạy',
    inStock: true,
    rating: 5,
    reviewsCount: 0
  },
  {
    id: 'tuy-loan-combo-dac-san-que',
    name: 'Combo Quà Tặng Làng Nghề Túy Loan',
    subtitle: 'Bánh tráng nướng & quà quê đậm đà',
    category: 'dac-san',
    price: 350000,
    volume: 'Combo gia đình',
    description: 'Bộ sản phẩm tuyển chọn từ các nghệ nhân lâu năm làng cổ Túy Loan.',
    story: 'Lan tỏa tinh hoa văn hóa ẩm thực xứ Quảng.',
    notes: { top: [], middle: [], base: [] },
    image: '/products/tuy-loan-rice-paper.png',
    badge: 'Cao cấp',
    inStock: true,
    rating: 5,
    reviewsCount: 0
  }
];
