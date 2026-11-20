# 🌸 Tàn Sắc Vẹn Hương (Tan Sac Ven Huong)

> Website thương mại điện tử duy mỹ cao cấp — Trầm hương, Nước hoa nghệ thuật & Phong cách sống Á Đông hiện đại.

---

## 📖 Tài liệu dự án

- **[Tài Liệu Bàn Giao & Vận Hành Bảo Trì (HANDOVER_MAINTENANCE.md)](./HANDOVER_MAINTENANCE.md)**: Tổng hợp thông số máy chủ, cơ sở dữ liệu, lệnh bảo trì 1-click và hướng dẫn xử lý sự cố.
- **[Hướng Dẫn Triển Khai Public & Tên Miền (DEPLOYMENT_GUIDE.md)](./DEPLOYMENT_GUIDE.md)**: Chi tiết cách deploy Vercel + Render + cấu hình DNS tên miền riêng và Webhook PayOS.
- **[Bản Kế Hoạch Tổng Thể (PROJECT_PLAN.md)](./PROJECT_PLAN.md)**: Chi tiết kiến trúc, lộ trình 5 giai đoạn, giải pháp thanh toán miễn phí và kế hoạch deploy.
- **[Bối Cảnh & Tiêu Chuẩn Dự Án (CONTEXT.md)](./CONTEXT.md)**: Lưu trữ context, bảng màu nhận diện, nguyên tắc responsive, hiệu ứng animation và cấu hình PayOS.

---

## 🏗 Cấu trúc thư mục

```
TanSacVenHuong/
├── FrontEnd/            # Giao diện người dùng (Responsive, Framer Motion, Tailwind CSS)
├── BackEnd/             # Máy chủ xử lý đơn hàng & tích hợp Webhook cổng thanh toán
├── PROJECT_PLAN.md      # Kế hoạch phát triển chi tiết
├── CONTEXT.md           # Bối cảnh & quy chuẩn kỹ thuật
└── README.md            # Tài liệu tổng quan dự án
```

---

## 🚀 Tính năng nổi bật

1. **Thiết kế Thẩm mỹ cao (Luxury & Modern Oriental)**: Phong cách tối giản sang trọng, chuyển động mượt mà (60fps) với Framer Motion.
2. **Responsive toàn diện**: Tối ưu từ điện thoại di động (Mobile-first) đến máy tính bàn và màn hình siêu rộng.
3. **Cổng thanh toán QR Siêu tốc & Hoàn toàn Miễn phí (0% phí)**: Tích hợp PayOS (VietQR Napas 24/7) tự động kích hoạt trạng thái "Thanh toán thành công" trong 1–3 giây.
4. **Sẵn sàng Deploy Public miễn phí**: Hỗ trợ triển khai nhanh lên Vercel và Render.

## 🛠 Chạy Backend với MongoDB

1. Tạo database MongoDB Atlas và cập nhật `BackEnd/.env` theo mẫu `BackEnd/.env.example` (`MONGODB_URI`, `CLIENT_URL`, cùng các khóa PayOS nếu đã có).
2. Trong thư mục `BackEnd`, chạy `npm install` rồi `npm run dev`.
3. Backend kết nối MongoDB trước khi mở API. Lần chạy đầu tiên, sản phẩm seed được thêm nếu collection sản phẩm đang trống.
4. Chạy `npm run seed:products` để đồng bộ catalog từ seed; thao tác này xóa sản phẩm ngoài danh sách seed hiện hành trong collection `products`.

Sau khi backend khởi động, xem tài liệu tương tác kiểu FastAPI tại `http://localhost:5000/api-docs` (Swagger UI); đặc tả OpenAPI dạng JSON ở `http://localhost:5000/api/openapi.json`.

Trang guest checkout thử nghiệm độc lập nằm tại `http://localhost:5173/test-checkout`. Luồng này cần đủ ba khóa PayOS để tạo payment link thật; chế độ test tạo link PayOS 2.000đ. Trên production, cần chủ động đặt `PAYMENT_TEST_MODE_ENABLED=true` mới bật được mức test này.

API tra cứu đơn: `GET /api/payment/lookup-orders?phone=09xxxxxxxx`. API này chỉ trả thông tin đơn hàng cần để theo dõi, không trả địa chỉ hoặc ghi chú giao nhận.

