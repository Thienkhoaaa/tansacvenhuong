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
    - **Nền chính:** Dark Charcoal (`#121212` / `#0c0c0e`).
    - **Điểm nhấn sang trọng:** Vàng ánh kim Warm Gold (`#D4AF37` / `#C5A059`).
    - **Nền phụ / Giấy mộc:** Muted Cream / Parchment (`#F7F5F0`).
    - **Chữ & Nội dung:** Off-white (`#EDEDED`) & Muted Gray (`#A1A1AA`).

---

## 2. QUY CHUẨN MUA HÀNG: GUEST CHECKOUT (KHÔNG CẦN ĐĂNG NHẬP)

> [!IMPORTANT]
> **Khách hàng tuyệt đối không phải đăng nhập hoặc đăng ký tài khoản khi mua hàng.**

1. **Lý do kinh doanh:** Sản phẩm quà tặng và hương thơm cao cấp đòi hỏi luồng mua hàng tức thì (Impulse buying). Việc bắt khách đăng ký tài khoản làm tăng tỷ lệ thoát trang.
2. **Thông tin cần thu thập:** Chỉ yêu cầu 3 trường thông tin thiết yếu nhất:
   - **Họ và tên quý khách** (Để ghi thông tin người nhận).
   - **Số điện thoại** (Định danh duy nhất dùng để nhân viên liên hệ + Khách tra cứu lịch sử đơn hàng).
   - **Địa chỉ giao nhận** (Địa chỉ chi tiết để gửi bưu phẩm).
   - *(Ghi chú tùy chọn: Khách có thể dặn dò giờ nhận hàng hoặc yêu cầu gói quà).*
3. **Cơ chế tra cứu đơn hàng không cần tài khoản:**
   - Khách có thể nhập **Số điện thoại** hoặc **Mã đơn hàng (#orderCode)** tại thanh tra cứu để xem lại toàn bộ thông tin đơn và trạng thái vận chuyển.
   - Trình duyệt lưu mã các đơn hàng đã đặt vào `localStorage` của khách.

---

## 3. KIẾN TRÚC HỆ THỐNG & CLOUD DATABASE

Dự án phân tách thành 2 phân hệ độc lập:

```
d:\TanSacVenHuong\
├── FrontEnd/       # Giao diện người dùng (Vite + React 19 + Tailwind v4 + Framer Motion)
├── BackEnd/        # RESTful API Service, PayOS VietQR & MongoDB Atlas Service
├── PROJECT_PLAN.md # Kế hoạch chi tiết từng giai đoạn & Kế hoạch Database Cloud
├── CONTEXT.md      # Tài liệu bối cảnh và quy chuẩn dự án (File này)
└── README.md       # Giới thiệu và hướng dẫn chạy dự án
```

### 3.1. Phân hệ FrontEnd
- **Công nghệ chính:** React 19, Vite, Tailwind CSS v4, Framer Motion, Lucide Icons, Canvas Confetti.
- **Quy chuẩn Responsive:**
  - `sm`: Mobile (360px - 640px) – Tối ưu điều hướng một tay (Bottom Navigation, Bottom Sheet Checkout).
  - `md`: Tablet (641px - 1024px) – Grid 2 cột cân đối.
  - `lg` & `xl`: Desktop / Wide screen (> 1024px) – Không gian thoáng đãng, micro-interaction mượt mà.
- **Quy chuẩn Animation (Framer Motion):**
  - Mượt mà (spring easing, transition 0.3s - 0.6s), không gây chóng mặt hay giật lag.
  - Hiệu ứng khói/nổi nhẹ (floating parallax), text reveal êm ái, hover glow vàng kim.

### 3.2. Phân hệ BackEnd & Cloud Database
- **Runtime:** Node.js (TypeScript) + Express.
- **Giải pháp Cloud Database:** **MongoDB Atlas (M0 Sandbox Free Tier vĩnh viễn)** hoặc **Firebase Firestore**.
  - **Lựa chọn chính:** **MongoDB Atlas** đặt tại cụm server Singapore (`ap-southeast-1`) cho độ trễ cực thấp (< 35ms từ Việt Nam).
  - **Mongoose ODM:** Quản lý Schema chặt chẽ cho `Product` (hỗ trợ phân tầng nốt hương `top`, `middle`, `base`) và `Order` (hỗ trợ Guest Checkout định danh bằng `phone` và `orderCode`).
- **Nhiệm vụ BackEnd:**
  - Cung cấp API danh mục sản phẩm và chi tiết sản phẩm từ MongoDB Atlas.
  - Tiếp nhận đơn hàng Guest Checkout và gọi API PayOS tạo mã VietQR.
  - Tiếp nhận Webhook xác nhận giao dịch từ PayOS và cập nhật trạng thái `PAID` vào MongoDB Atlas.
  - Cung cấp API tra cứu đơn hàng theo Số điện thoại: `/api/payment/lookup-orders?phone=...`.

### 3.3. Cổng thanh toán (Payment Gateway)
- **Giải pháp:** **PayOS** (https://payos.vn).
- **Lợi ích:**
  - **100% Miễn phí:** 0% phí giao dịch, không phí duy trì tài khoản.
  - **Tài khoản cá nhân:** Dùng được ngay bằng số tài khoản ngân hàng cá nhân, không cần ĐKKD công ty.
  - **Xác thực tự động tức thì:** Khách chuyển khoản từ bất kỳ App ngân hàng nào (VCB, MB, Techcombank, MoMo...), PayOS bắn Webhook cập nhật đơn trong 1–3 giây.

### 3.4. Triển khai Public (Free Tier Hosting)
- **FrontEnd:** Deploy lên **Vercel** (Miễn phí, CDN toàn cầu tốc độ cao, cấp sẵn chứng chỉ SSL HTTPS).
- **BackEnd:** Deploy lên **Render.com** (Web Service Free).
- **Database:** **MongoDB Atlas** (Cloud Free M0 512MB).

---

## 4. TRẠNG THÁI HIỆN TẠI (CURRENT STATUS)

- [x] Tạo cấu trúc thư mục gốc (`FrontEnd`, `BackEnd`).
- [x] Soạn thảo và lưu trữ Kế hoạch triển khai (`PROJECT_PLAN.md`).
- [x] Lưu trữ Bối cảnh dự án (`CONTEXT.md`).
- [x] **Giai đoạn 1: Khởi tạo Kiến trúc & Môi trường (HOÀN THÀNH)**
  - [x] FrontEnd: Vite + React 19 + TypeScript + Tailwind CSS v4 + Framer Motion + Lucide React + Canvas Confetti. Build thành công `dist/`.
  - [x] BackEnd: Express + TypeScript + PayOS SDK (`@payos/node`) + CORS + Dotenv. Build TypeScript thành công `dist/`.
  - [x] Thiết lập cấu trúc thư mục chuẩn cho cả 2 bên.
  - [x] Tạo sẵn hệ thống UI mẫu: Navbar, HeroSection, ProductGrid, ProductDetailModal, CartDrawer, và CheckoutModal hỗ trợ **Guest Checkout (không cần đăng nhập)** & VietQR Napas 24/7.
- [ ] **Giai đoạn 2: Tích hợp Cloud Database (MongoDB Atlas) & API Tra cứu đơn hàng theo SĐT.**
- [ ] **Giai đoạn 3: Kết nối cấu hình PayOS Webhook chính thức.**
- [ ] **Giai đoạn 4: Hoàn thiện hiệu ứng chuyển động & Kiểm thử Responsive trên thiết bị di động.**
- [ ] **Giai đoạn 5: Deploy Public lên Vercel, Render và MongoDB Atlas.**
