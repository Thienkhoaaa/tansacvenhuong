# 📋 TÀI LIỆU BÀN GIAO & VẬN HÀNH BẢO TRÌ (MAINTENANCE MANUAL)
### Dự án: TÀN SẮC VẸN HƯƠNG | Website: `https://tansacvenhuong.site`

---

## 🏛️ 1. TỔNG HỢP HỆ THỐNG VÀ THÔNG SỐ VẬN HÀNH

| Thành phần | Thông tin chi tiết | Ghi chú vận hành |
| :--- | :--- | :--- |
| **Mã nguồn (Git)** | `https://github.com/Thienkhoaaa/tansacvenhuong.git` (Nhánh `main`) | Tự động đồng bộ với máy chủ qua script |
| **Tên miền (Domain)** | `tansacvenhuong.site` & `www.tansacvenhuong.site` | Quản lý tại CloudFly DNS |
| **Máy chủ (VPS)** | IP: `103.82.23.124` (OS: Ubuntu 22.04 LTS trên CloudFly) | SSH: `ssh root@103.82.23.124` |
| **Thư mục web trên VPS** | `/var/www/tansacvenhuong` | Chứa cả `FrontEnd` và `BackEnd` |
| **Quản lý tiến trình** | PM2: `tansacvenhuong-backend` (Port 5000) | Tự động khởi động cùng hệ thống 24/7 |
| **Web Server & Reverse Proxy** | Nginx: `/etc/nginx/sites-available/tansacvenhuong` | Phục vụ FrontEnd tĩnh và chuyển `/api` về port 5000 |
| **Cơ sở dữ liệu (Database)** | MongoDB Atlas (Cluster 0, Singapore AWS) | Quản lý sản phẩm và đơn hàng |
| **Cổng thanh toán** | PayOS (VietQR Napas 24/7, 0% phí) | Webhook: `https://tansacvenhuong.site/api/payment/webhook` |

---

## 🛠️ 2. CÁC LỆNH BẢO TRÌ THƯỜNG DÙNG (OPERATIONS CHEAT SHEET)

Khi đăng nhập vào máy chủ qua SSH (`ssh root@103.82.23.124`), bạn có thể sử dụng các lệnh sau:

### 1. Cập nhật mã nguồn mới nhất (1 Dòng lệnh):
```bash
bash /var/www/tansacvenhuong/update-cloudfly.sh
```
*(Lệnh này tự động kéo code mới từ GitHub, build lại FrontEnd, restart BackEnd và reload Nginx trong 5 giây).*

### 2. Kiểm tra trạng thái máy chủ BackEnd:
```bash
pm2 status
```

### 3. Xem nhật ký hoạt động thời gian thực (Live Logs & Debug):
```bash
pm2 logs tansacvenhuong-backend
```

### 4. Khởi động lại hoặc Dừng BackEnd:
```bash
pm2 restart tansacvenhuong-backend   # Khởi động lại
pm2 stop tansacvenhuong-backend      # Tạm dừng
```

### 5. Kiểm tra trạng thái Nginx:
```bash
sudo nginx -t                        # Kiểm tra file cấu hình có lỗi không
sudo systemctl reload nginx          # Tải lại cấu hình Nginx
sudo systemctl restart nginx         # Khởi động lại Nginx
```

### 6. Gia hạn chứng chỉ bảo mật SSL (HTTPS):
Chứng chỉ Certbot Let's Encrypt sẽ tự động gia hạn trước khi hết hạn 30 ngày. Nếu muốn kiểm tra hoặc ép gia hạn thủ công:
```bash
sudo certbot renew --dry-run
```

---

## 📦 3. THÔNG TIN BẠN CẦN LƯU VÀ CUNG CẤP TRONG CÁC ĐỢT BẢO TRÌ TIẾP THEO

Khi bắt đầu một đợt bảo trì hoặc nâng cấp tính năng mới (ví dụ: thêm trang Quản trị Admin, thêm cổng thanh toán MoMo, chỉnh sửa hiệu ứng giao diện...), bạn chỉ cần:

1. **Mở lại cuộc trò chuyện này (hoặc trong thư mục `d:\TanSacVenHuong`):**
   * Mọi bối cảnh, cấu trúc code, quyết định thiết kế đã được lưu đầy đủ trong các file:
     - `CONTEXT.md`
     - `PROJECT_PLAN.md`
     - `DEPLOYMENT_GUIDE.md`
     - `HANDOVER_MAINTENANCE.md` (file này).
2. **Khi cần thao tác trực tiếp trên máy chủ VPS:**
   * Bạn chỉ cần cung cấp: **Mật khẩu tài khoản `root` của máy chủ `103.82.23.124`** (hoặc cấu hình SSH Key).
3. **Khi cần thêm/sửa sản phẩm hoặc nội dung:**
   * Bạn chỉ cần gửi danh sách sản phẩm (Tên, giá, hình ảnh, nốt hương). Tôi sẽ hỗ trợ viết script cập nhật trực tiếp vào MongoDB Atlas hoặc giao diện mà bạn không cần phải đụng tay vào cơ sở dữ liệu.
4. **Khi cần đổi tài khoản nhận tiền PayOS:**
   * Bạn chỉ cần gửi 3 thông số API từ tài khoản PayOS mới (`PAYOS_CLIENT_ID`, `PAYOS_API_KEY`, `PAYOS_CHECKSUM_KEY`).

---

## 🚨 4. HƯỚNG DẪN XỬ LÝ SỰ CỐ NHANH (TROUBLESHOOTING)

* **Sự cố 1: Web bị báo lỗi "502 Bad Gateway"**
  * Nguyên nhân: BackEnd trên port 5000 bị dừng đột ngột.
  * Cách xử lý: Đăng nhập SSH và gõ `pm2 restart tansacvenhuong-backend`.
* **Sự cố 2: Khách quét QR thanh toán xong nhưng web không nhảy "Đặt hàng thành công"**
  * Nguyên nhân: Webhook trên PayOS chưa được cấu hình đúng URL hoặc sai Checksum Key.
  * Cách xử lý: Vào [my.payos.vn](https://my.payos.vn/) $\rightarrow$ Kiểm tra Webhook URL phải là `https://tansacvenhuong.site/api/payment/webhook`.
* **Sự cố 3: Đổi giao diện FrontEnd nhưng web không hiển thị giao diện mới**
  * Nguyên nhân: Trình duyệt của khách đang lưu cache file cũ.
  * Cách xử lý: Khách chỉ cần ấn tổ hợp phím `Ctrl + F5` (hoặc `Cmd + Shift + R` trên Mac) để xóa cache tải lại bản mới nhất.
