# 📜 BỐI CẢNH DỰ ÁN (PROJECT CONTEXT) - TÀN SẮC VẸN HƯƠNG

Tài liệu này lưu trữ toàn bộ thông tin bối cảnh, quyết định kiến trúc, tiêu chuẩn thiết kế và trạng thái phát triển của dự án để đảm bảo sự thống nhất cho các lập trình viên và AI Agent tham gia dự án.

---

## 1. THÔNG TIN CỐT LÕI (PROJECT IDENTITY)

- **Tên dự án:** Tàn Sắc Vẹn Hương
- **Lĩnh vực / Sản phẩm:** Thương hiệu sản phẩm duy mỹ cao cấp (Trầm hương, Nước hoa nghệ thuật, Tinh dầu, Phong cách sống & Thư giãn Á Đông hiện đại).
- **Tinh thần thương hiệu (Brand Essence):** *"Vẹn Sắc - Toàn Hương"* – Sang trọng, tĩnh lặng, nghệ thuật, tinh tế.
- **Tone & Mood:** 
  - Dark Luxury / Modern Oriental Minimalist.
  - Bảng màu chủ đạo:
    - **Nền chính:** Dark Charcoal (`#121212` / `#18181B`).
    - **Điểm nhấn sang trọng:** Vàng ánh kim Warm Gold (`#D4AF37` / `#C5A059`).
    - **Nền phụ / Giấy mộc:** Muted Cream / Parchment (`#F7F5F0`).
    - **Chữ & Nội dung:** Off-white (`#EDEDED`) & Muted Gray (`#A1A1AA`).

---

## 2. KIẾN TRÚC HỆ THỐNG (SYSTEM ARCHITECTURE)

Dự án phân tách thành 2 phân hệ độc lập:

```
d:\TanSacVenHuong\
├── FrontEnd/       # Giao diện người dùng (Client SPA/SSR)
├── BackEnd/        # RESTful API Service & Xử lý Thanh toán (Server)
├── PROJECT_PLAN.md # Kế hoạch chi tiết từng giai đoạn
├── CONTEXT.md      # Tài liệu bối cảnh và quy chuẩn dự án (File này)
└── README.md       # Giới thiệu và hướng dẫn chạy dự án
```

### 2.1. Phân hệ FrontEnd
- **Công nghệ chính:** React 19 / Next.js 15, Tailwind CSS, Framer Motion, Lucide Icons, Lenis (Smooth Scroll).
- **Quy chuẩn Responsive:**
  - `sm`: Mobile (360px - 640px) – Tối ưu điều hướng một tay (Bottom Navigation, Bottom Sheet Checkout).
  - `md`: Tablet (641px - 1024px) – Grid 2 cột cân đối.
  - `lg` & `xl`: Desktop / Wide screen (> 1024px) – Trải nghiệm không gian rộng, micro-interaction với chuột và con trỏ tùy biến.
- **Quy chuẩn Animation (Framer Motion):**
  - Mượt mà (spring easing, transition 0.3s - 0.6s), không gây chóng mặt hay giật lag.
  - Hiệu ứng khói/nổi nhẹ (floating parallax), text reveal êm ái, hover glow vàng kim.

### 2.2. Phân hệ BackEnd & Cơ sở dữ liệu
- **Công nghệ chính:** Node.js (TypeScript) + Express / Fastify.
- **ORM & Database:** Prisma ORM kết nối PostgreSQL (Supabase Free Tier) hoặc MongoDB.
- **Nhiệm vụ:**
  - Cung cấp API danh mục sản phẩm, chi tiết sản phẩm.
  - Tiếp nhận đơn hàng mới và gọi API tạo thanh toán.
  - Tiếp nhận Webhook xác nhận giao dịch từ cổng thanh toán.

### 2.3. Cổng thanh toán (Payment Gateway)
- **Giải pháp lựa chọn:** **PayOS** (https://payos.vn).
- **Lý do chọn:**
  - **100% Miễn phí:** 0% phí giao dịch (so với 1.5% - 2.5% của VNPAY/MoMo/ZaloPay), không phí duy trì.
  - **Tài khoản cá nhân:** Không bắt buộc phải có giấy phép doanh nghiệp (DKKD).
  - **Trải nghiệm tức thì:** Sinh mã VietQR chuẩn Napas 24/7 kèm số tiền & mã đơn chính xác; Webhook đẩy về hệ thống trong 1–3 giây khi khách chuyển khoản từ bất kỳ ngân hàng nào.

### 2.4. Triển khai Public (Free Tier Hosting)
- **FrontEnd:** Deploy lên **Vercel** (Miễn phí, CDN toàn cầu, tự động build từ Git, SSL HTTPS có sẵn).
- **BackEnd:** Deploy lên **Render.com** (Web Service Free).
- **Database:** **Supabase** (PostgreSQL Cloud Free 500MB).

---

## 3. NGUYÊN TẮC PHÁT TRIỂN & TIÊU CHUẨN CODE (DEVELOPMENT RULES)

1. **Mobile First:** Mọi màn hình phải được kiểm tra hiển thị hoàn hảo trên kích thước mobile trước khi hoàn thiện desktop.
2. **Animation Performance:** Chỉ animate các thuộc tính tận dụng GPU (`transform`, `opacity`), tránh animate kích thước `width/height` gây reflow giật khung hình.
3. **Bảo mật thanh toán:**
   - Webhook PayOS phải luôn được xác thực chữ ký (Checksum signature) trước khi cập nhật trạng thái đơn hàng.
   - Các API Key bí mật (`PAYOS_CLIENT_ID`, `PAYOS_API_KEY`, `PAYOS_CHECKSUM_KEY`) bắt buộc lưu trong file `.env` và không commit lên repository công khai.
4. **Trải nghiệm khách hàng:** Luôn có trạng thái Loading Skeleton, thông báo Toast mượt mà khi thêm giỏ hàng, và âm thanh/hiệu ứng chúc mừng khi thanh toán QR thành công.

---

## 4. TRẠNG THÁI HIỆN TẠI (CURRENT STATUS)

- [x] Tạo cấu trúc thư mục gốc (`FrontEnd`, `BackEnd`).
- [x] Soạn thảo và lưu trữ Kế hoạch triển khai (`PROJECT_PLAN.md`).
- [x] Lưu trữ Bối cảnh dự án (`CONTEXT.md`).
- [x] **Giai đoạn 1: Khởi tạo Kiến trúc & Môi trường (HOÀN THÀNH)**
  - [x] Cài đặt FrontEnd: Vite + React 19 + TypeScript + Tailwind CSS v4 + Framer Motion + Lucide React + Canvas Confetti. Build thành công `dist/`.
  - [x] Cài đặt BackEnd: Express + TypeScript + PayOS SDK (`@payos/node`) + CORS + Dotenv. Build TypeScript thành công `dist/`.
  - [x] Thiết lập cấu trúc thư mục chuẩn: `src/controllers`, `src/routes`, `src/services`, `src/components`, `src/context`, `src/types`.
  - [x] Tạo sẵn hệ thống giao diện mẫu: Navbar, HeroSection, ProductGrid, ProductDetailModal, CartDrawer, và CheckoutModal (kèm VietQR Napas 24/7).
- [ ] **Giai đoạn 2 & 3: Tối ưu UI/UX, Kết nối API thực tế & Cấu hình PayOS Webhook.**
- [ ] **Giai đoạn 4: Hoàn thiện hiệu ứng chuyển động & Kiểm thử Responsive.**
- [ ] **Giai đoạn 5: Deploy Public lên Vercel & Render.**

