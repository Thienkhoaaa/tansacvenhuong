# 🌐 HƯỚNG DẪN TRIỂN KHAI PRODUCTION: TÀN SẮC VẸN HƯƠNG
### Tên miền: `tansacvenhuong.site` | Máy chủ: CloudFly VPS + Vercel Global CDN

---

## 🏗️ 1. MÔ HÌNH KIẾN TRÚC PRODUCTION TỐI ƯU (RECOMMENDED ARCHITECTURE)

```mermaid
flowchart TD
    Client["Khách hàng truy cập: tansacvenhuong.site"]
    DNS["DNS Quản lý tên miền (tansacvenhuong.site)"]

    subgraph Vercel ["Vercel Global CDN (Giao diện FrontEnd)"]
        FE["React 19 + Vite SPA (Tốc độ ánh sáng, SSL tự động)"]
    end

    subgraph CloudFly ["Cloud Server CloudFly (220k/tháng - Hà Nội / TP.HCM)"]
        Nginx["Nginx Reverse Proxy (SSL Let's Encrypt)"]
        PM2["PM2 Process Manager (Cluster Mode, 24/7)"]
        API["Node.js Express TypeScript (Port 5000)"]
        Nginx --> API
        PM2 --> API
    end

    subgraph CloudServices ["Dịch vụ Đám Mây"]
        DB[(MongoDB Atlas Singapore)]
        PayOS["PayOS VietQR Napas 24/7"]
    end

    Client --> DNS
    DNS -->|A / CNAME: tansacvenhuong.site| FE
    DNS -->|A record: api.tansacvenhuong.site| Nginx
    FE -->|Gọi API| Nginx
    API --> DB
    API --> PayOS
    PayOS -->|Webhook thanh toán tức thì| Nginx
```

---

## 📋 2. BẢNG CẤU HÌNH DNS TÊN MIỀN (`tansacvenhuong.site`)

Tại trang quản lý DNS nơi bạn mua tên miền, thêm **3 bản ghi** sau:

| Loại (Type) | Tên / Host | Giá trị trỏ đến (Points to) | Mục đích |
| :--- | :--- | :--- | :--- |
| **A** | `@` | **`76.76.21.21`** | Trỏ web chính `tansacvenhuong.site` về Vercel |
| **CNAME** | `www` | **`cname.vercel-dns.com`** | Cho phép truy cập qua `www.tansacvenhuong.site` |
| **A** | `api` | **`IP_MÁY_CHỦ_CLOUDFLY`** | Trỏ subdomain `api.tansacvenhuong.site` về VPS |

---

## 🚀 3. HƯỚNG DẪN TRIỂN KHAI TỪNG BƯỚC

### BƯỚC 1: ĐƯA DỰ ÁN LÊN GITHUB
Repository của bạn: `https://github.com/Thienkhoaaa/tansacvenhuong.git`

Chạy các lệnh sau trong terminal để đẩy toàn bộ mã nguồn lên:
```bash
git branch -M main
git remote add origin https://github.com/Thienkhoaaa/tansacvenhuong.git
git push -u origin main --force
```

---

### BƯỚC 2: DEPLOY FRONTEND LÊN VERCEL (MIỄN PHÍ)
1. Đăng nhập [Vercel.com](https://vercel.com/) $\rightarrow$ Chọn **Add New...** $\rightarrow$ **Project**.
2. Chọn repo `Thienkhoaaa/tansacvenhuong`.
3. Điền cấu hình:
   - **Framework Preset:** `Vite`
   - **Root Directory:** Bấm Edit $\rightarrow$ Chọn thư mục `FrontEnd`.
4. Mục **Environment Variables** (Biến môi trường):
   - `VITE_API_URL` = `https://api.tansacvenhuong.site` *(hoặc `http://IP_CLOUDFLY:5000` nếu chưa trỏ subdomain)*.
5. Nhấn **Deploy**.
6. Sau khi deploy xong: Vào tab **Settings** $\rightarrow$ **Domains** $\rightarrow$ Nhập `tansacvenhuong.site` và nhấn **Add**.

---

### BƯỚC 3: CÀI ĐẶT BACKEND TRÊN CLOUDFLY VPS (220k/tháng)

Khi bạn nhận máy chủ CloudFly (chạy hệ điều hành Ubuntu 22.04 hoặc 24.04 LTS), mở terminal SSH vào VPS:
```bash
ssh root@IP_MÁY_CHỦ_CLOUDFLY
```

Thực hiện các lệnh sau:

#### 1. Cài đặt Node.js 22 & PM2 & Nginx:
```bash
# Cập nhật hệ thống
sudo apt update && sudo apt upgrade -y

# Cài đặt Node.js 22 LTS
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs git nginx

# Cài đặt PM2 (quản lý chạy ngầm 24/7)
sudo npm install -g pm2
```

#### 2. Kéo mã nguồn về VPS:
```bash
cd /var/www
git clone https://github.com/Thienkhoaaa/tansacvenhuong.git
cd tansacvenhuong/BackEnd
```

#### 3. Tạo file cấu hình môi trường `.env`:
```bash
nano .env
```
Dán nội dung cấu hình thực tế vào:
```env
PORT=5000
NODE_ENV=production
CLIENT_URL=https://tansacvenhuong.site,https://www.tansacvenhuong.site

# MongoDB Atlas
MONGODB_URI=mongodb+srv://nguyenthienkhoa15_db_user:XwD7gLMhO5DSp1Sk@cluster0.l8eu0hw.mongodb.net/tan-sac-ven-huong?retryWrites=true&w=majority

# PayOS VietQR
PAYOS_CLIENT_ID=b4cc8bfa-a88d-4ec4-a911-8417bd1f6b3d
PAYOS_API_KEY=3ae36ada-179c-49b3-998d-bf02e7b96f83
PAYOS_CHECKSUM_KEY=92c0830282bf323f1d7f0db84e3510a177b5f9574124bdc748c0593a88c9c4bf
```
*(Bấm `Ctrl + O` để lưu, `Enter`, rồi `Ctrl + X` để thoát).*

#### 4. Cài đặt, build và khởi chạy với PM2:
```bash
npm install
npm run build
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

#### 5. Cấu hình Nginx làm Reverse Proxy & cấp SSL miễn phí:
```bash
# Copy cấu hình Nginx mẫu
sudo cp nginx.conf.example /etc/nginx/sites-available/tansacvenhuong-api
sudo ln -s /etc/nginx/sites-available/tansacvenhuong-api /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# Cài đặt chứng chỉ SSL HTTPS miễn phí (Certbot)
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d api.tansacvenhuong.site
```

---

### BƯỚC 4: CẬP NHẬT WEBHOOK TRÊN CỔNG PAYOS

1. Đăng nhập [https://my.payos.vn/](https://my.payos.vn/).
2. Chọn kênh thanh toán của bạn $\rightarrow$ Mục **Cài đặt Webhook**.
3. Điền URL:
   👉 `https://api.tansacvenhuong.site/api/payment/webhook`
4. Nhấn **Lưu** và nhấn **Kiểm tra kết nối**.

---

## 🔄 4. CÁCH CẬP NHẬT MÃ NGUỒN SAU NÀY
Khi bạn có code mới đẩy lên GitHub, bạn chỉ cần SSH vào VPS và chạy file có sẵn:
```bash
cd /var/www/tansacvenhuong/BackEnd
bash deploy.sh
```
Mã nguồn sẽ tự động được kéo về, build lại và khởi động lại trong 5 giây mà không làm gián đoạn khách hàng!
