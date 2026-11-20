#!/bin/bash
# Script tự động kéo code mới nhất từ GitHub và cập nhật cả FrontEnd + BackEnd trên CloudFly

echo "🚀 Bắt đầu cập nhật website Tàn Sắc Vẹn Hương..."
cd /var/www/tansacvenhuong
git pull origin main

echo "📦 Build lại FrontEnd..."
cd /var/www/tansacvenhuong/FrontEnd
npm install
npm run build

echo "⚙️ Build và restart BackEnd..."
cd /var/www/tansacvenhuong/BackEnd
npm install
npm run build
pm2 reload tansacvenhuong-backend

echo "🔄 Reload Nginx..."
sudo systemctl reload nginx

echo "✅ Website đã được cập nhật bản mới nhất thành công!"
