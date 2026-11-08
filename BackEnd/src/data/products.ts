import { Product } from '../types/index.js';

export const products: Product[] = [
  {
    id: 'tsvh-01',
    name: 'Tàn Dạ Trầm Y',
    subtitle: 'Nước hoa nghệ thuật Extrait de Parfum',
    category: 'nuoc-hoa',
    price: 1850000,
    originalPrice: 2200000,
    volume: '50ml',
    description: 'Bản hòa tấu huyền ảo giữa trầm hương cổ thụ Tây Nguyên, nhựa cánh kiến trắng và khói trà ô long sấy lạnh trong đêm tĩnh mịch.',
    story: 'Khắc họa khoảnh khắc tàn tro của nén hương tỏa lên làn khói mỏng manh trong căn phòng gỗ sau cơn mưa đầu hạ.',
    notes: {
      top: ['Hạt tiêu hồng', 'Cam Bergamot hun khói', 'Búp trà Ô Long'],
      middle: ['Trầm hương cổ thụ', 'Nhựa thơm Myrrh', 'Hoa Diên Vĩ đen'],
      base: ['Gỗ Đàn Hương Mysore', 'Hổ phách xám', 'Xạ hương sạch']
    },
    image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80',
    badge: 'Signature Blend',
    inStock: true,
    rating: 4.9,
    reviewsCount: 128
  },
  {
    id: 'tsvh-02',
    name: 'Vấn Hương Mộc Lan',
    subtitle: 'Hương thơm nội tâm Á Đông thuần khiết',
    category: 'nuoc-hoa',
    price: 1650000,
    volume: '50ml',
    description: 'Sự tao nhã của hoa mộc lan sương sớm quấn quýt cùng gỗ tuyết tùng và làn gió mát thanh tao từ đỉnh núi cao.',
    story: 'Như một buổi sớm mở cửa sổ ngắm sương đọng trên cánh hoa trắng ngần giữa viện trà thiền định.',
    notes: {
      top: ['Lá tre non', 'Bạch đậu khấu', 'Sương sớm mai'],
      middle: ['Hoa Mộc Lan trắng', 'Bạch trà tuyết san', 'Hoa Nhài đêm'],
      base: ['Gỗ Tuyết Tùng Virginia', 'Cỏ Hương Bài Haiti', 'Rêu sồi']
    },
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80',
    badge: 'Bán chạy nhất',
    inStock: true,
    rating: 5.0,
    reviewsCount: 94
  },
  {
    id: 'tsvh-03',
    name: 'Nhang Thiền Kỳ Nam Tự Nhiên',
    subtitle: 'Trầm hương thanh tẩy không gian',
    category: 'tram-huong',
    price: 890000,
    originalPrice: 1100000,
    volume: 'Hộp 50 nén (cháy 45 phút)',
    description: '100% bột trầm hương tự nhiên không tẩm ướp hóa chất, tạo vượng khí, xua tan căng thẳng mỏi mệt.',
    story: 'Được chế tác thủ công từ các nghệ nhân làng nghề trầm hương truyền thống Khánh Hòa.',
    notes: {
      top: ['Vị ngọt thanh nhẹ'],
      middle: ['Mùi khói trầm nguyên bản'],
      base: ['Hương gỗ ấm vương vấn kéo dài']
    },
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80',
    badge: 'Thuần thủ công',
    inStock: true,
    rating: 4.8,
    reviewsCount: 215
  },
  {
    id: 'tsvh-04',
    name: 'Nến Thơm Dạ Nguyệt Tĩnh Lặng',
    subtitle: 'Nến sáp đậu nành khoáng & bấc gỗ kêu lách tách',
    category: 'nen-thom',
    price: 520000,
    volume: '220g (thời gian đốt 50 giờ)',
    description: 'Hũ nến gốm men hỏa biến sang trọng, ngọn lửa ấm áp phát ra âm thanh bấc gỗ thư giãn như lò sưởi mùa đông.',
    story: 'Khơi nguồn cảm hứng sáng tạo và đem lại giấc ngủ sâu êm đềm sau ngày dài bề bộn.',
    notes: {
      top: ['Quả Lê dại hun khói', 'Hương Thảo mộc'],
      middle: ['Cây Xô Thơm (Clary Sage)', 'Gỗ thông bách'],
      base: ['Đậu Tonka ngọt dịu', 'Gỗ Bạch Đàn', 'Vani Madagascar']
    },
    image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    rating: 4.9,
    reviewsCount: 87
  }
];

