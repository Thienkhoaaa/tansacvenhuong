#!/bin/bash
# ==============================================================
# SCRIPT TỰ ĐỘNG THIẾT LẬP TOÀN BỘ WEBSITE TRÊN CLOUDFLY VPS
# Website: https://tansacvenhuong.site
# Chạy cả FrontEnd (React SPA) và BackEnd (Node.js API) trên 1 Server
# ==============================================================

set -e

echo "🌸 [1/6] Đang cập nhật hệ thống máy chủ Ubuntu..."
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git nginx certbot python3-certbot-nginx

echo "🌸 [2/6] Đang cài đặt Node.js 22 LTS và PM2..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
    sudo apt install -y nodejs
fi
sudo npm install -g pm2

echo "🌸 [3/6] Đang chuẩn bị mã nguồn dự án tại /var/www/tansacvenhuong..."
sudo mkdir -p /var/www
cd /var/www

if [ -d "tansacvenhuong" ]; then
    echo "Thư mục đã tồn tại, đang kéo mã nguồn mới nhất..."
    cd tansacvenhuong
    git pull origin main
else
    echo "Đang clone dự án từ GitHub..."
    git clone https://github.com/Thienkhoaaa/tansacvenhuong.git
    cd tansacvenhuong
fi

echo "🌸 [4/6] Đang cấu hình và build FrontEnd..."
cd /var/www/tansacvenhuong/FrontEnd
npm install
npm run build

echo "🌸 [5/6] Đang cấu hình và khởi chạy BackEnd..."
cd /var/www/tansacvenhuong/BackEnd

# Tạo file .env nếu chưa có
if [ ! -f ".env" ]; then
    cat <<EOT > .env
PORT=5000
NODE_ENV=production
CLIENT_URL=https://tansacvenhuong.site,https://www.tansacvenhuong.site,http://tansacvenhuong.site

# MongoDB Atlas Database
MONGODB_URI=mongodb+srv://nguyenthienkhoa15_db_user:XwD7gLMhO5DSp1Sk@cluster0.l8eu0hw.mongodb.net/tan-sac-ven-huong?retryWrites=true&w=majority

# PayOS VietQR Napas 24/7 Gateway
PAYOS_CLIENT_ID=b4cc8bfa-a88d-4ec4-a911-8417bd1f6b3d
PAYOS_API_KEY=3ae36ada-179c-49b3-998d-bf02e7b96f83
PAYOS_CHECKSUM_KEY=92c0830282bf323f1d7f0db84e3510a177b5f9574124bdc748c0593a88c9c4bf
EOT
    echo "Đã tạo file BackEnd/.env thành công."
fi

npm install
npm run build

# Khởi chạy BackEnd với PM2
pm2 delete tansacvenhuong-backend 2>/dev/null || true
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup systemd -u root --hp /root || true

echo "🌸 [6/6] Đang cấu hình Nginx..."
sudo cp /var/www/tansacvenhuong/nginx-cloudfly.conf /etc/nginx/sites-available/tansacvenhuong
sudo rm -f /etc/nginx/sites-enabled/default
sudo ln -sf /etc/nginx/sites-available/tansacvenhuong /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

echo ""
echo "=========================================================================="
echo "🎉 HOÀN TẤT THIẾT LẬP MÁY CHỦ CLOUDFLY CHO TÀN SẮC VẸN HƯƠNG!"
echo "👉 Website hiện đã chạy tại: http://tansacvenhuong.site"
echo ""
echo "🔐 Bước cuối cùng: Bật bảo mật SSL HTTPS (ổ khóa xanh) miễn phí:"
echo "   sudo certbot --nginx -d tansacvenhuong.site -d www.tansacvenhuong.site"
echo "=========================================================================="
