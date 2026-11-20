#!/bin/bash
# Script tự động cập nhật và restart BackEnd trên VPS CloudFly

echo "🚀 Bắt đầu cập nhật Tan Sac Ven Huong BackEnd..."

# Di chuyển vào thư mục BackEnd
cd "$(dirname "$0")"

# Kéo code mới nhất từ GitHub
git pull origin main

# Cài đặt dependencies và build TypeScript
npm install --production=false
npm run build

# Restart ứng dụng bằng PM2
pm2 reload ecosystem.config.cjs || pm2 start ecosystem.config.cjs
pm2 save

echo "✅ BackEnd đã được cập nhật và khởi chạy thành công!"
