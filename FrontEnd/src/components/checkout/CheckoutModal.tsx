import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, QrCode, CheckCircle2, Clock, Copy, Check, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '../../context/CartContext.js';
import { createOrder, checkOrderStatus, simulateSuccess } from '../../services/api.js';
import type { CustomerInfo, OrderRecord, CreateOrderPayload } from '../../types/index.js';

export const CheckoutModal: React.FC = () => {
  const { cart, totalAmount, isCheckoutOpen, setIsCheckoutOpen, clearCart } = useCart();

  const [step, setStep] = useState<'info' | 'qr_payment' | 'success'>('info');
  const [customer, setCustomer] = useState<CustomerInfo>({
    name: '',
    phone: '',
    address: '',
    notes: ''
  });
  const [paymentMethod, setPaymentMethod] = useState<'vietqr' | 'cod'>('vietqr');
  const [isLoading, setIsLoading] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<OrderRecord | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [countdown, setCountdown] = useState(900); // 15 minutes
  const [isSimulating, setIsSimulating] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  // Countdown timer for QR
  useEffect(() => {
    if (step === 'qr_payment' && countdown > 0) {
      const timer = setInterval(() => setCountdown(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [step, countdown]);

  // Polling order status while in qr_payment step
  useEffect(() => {
    if (step === 'qr_payment' && currentOrder?.orderCode) {
      const poll = setInterval(async () => {
        const updated = await checkOrderStatus(currentOrder.orderCode);
        if (updated && updated.status === 'PAID') {
          setCurrentOrder(updated);
          handlePaymentSuccessAnimation();
        }
      }, 2500);
      return () => clearInterval(poll);
    }
  }, [step, currentOrder?.orderCode]);

  const handlePaymentSuccessAnimation = () => {
    setStep('success');
    clearCart();
    // Fire celebration confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#D4AF37', '#FFF', '#C5A059', '#34D399']
    });
  };

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setTimeout(() => {
      setStep('info');
      setCurrentOrder(null);
    }, 300);
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer.name || !customer.phone || !customer.address) {
      alert('Vui lòng điền đầy đủ Họ tên, Số điện thoại và Địa chỉ giao hàng.');
      return;
    }

    setIsLoading(true);
    try {
      const payload: CreateOrderPayload = {
        customer,
        items: cart.map(item => ({
          productId: item.product.id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          image: item.product.image
        })),
        totalAmount,
        paymentMethod
      };

      const res = await createOrder(payload);

      if (res.success && res.order) {
        setCurrentOrder(res.order);
        if (paymentMethod === 'vietqr') {
          setStep('qr_payment');
        } else {
          handlePaymentSuccessAnimation();
        }
      } else {
        alert(res.message || 'Không thể tạo đơn hàng, vui lòng thử lại.');
      }
    } catch (err) {
      console.error(err);
      alert('Đã có lỗi xảy ra khi tạo đơn hàng.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSimulatePayment = async () => {
    if (!currentOrder?.orderCode) return;
    setIsSimulating(true);
    await simulateSuccess(currentOrder.orderCode);
    setTimeout(() => {
      setIsSimulating(false);
      handlePaymentSuccessAnimation();
    }, 700);
  };

  const copyOrderCode = () => {
    if (currentOrder?.orderCode) {
      navigator.clipboard.writeText(String(currentOrder.orderCode));
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  if (!isCheckoutOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 26, stiffness: 280 }}
          className="relative w-full max-w-xl bg-[#121216] border border-[#27272a] rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden z-10 my-8 p-6 sm:p-8"
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-[#A1A1AA] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Step 1: Info & Payment Method */}
          {step === 'info' && (
            <form onSubmit={handleSubmitOrder} className="space-y-5">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold">
                  Thanh Toán Nhanh
                </span>
                <h3 className="font-serif text-2xl text-[#EDEDED] font-medium mt-0.5">
                  Thông Tin Giao Nhận & Phương Thức
                </h3>
              </div>

              {/* Customer Inputs */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-[#A1A1AA] mb-1">Họ và tên quý khách *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Nguyễn Văn An"
                    value={customer.name}
                    onChange={e => setCustomer({ ...customer, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#18181d] border border-[#27272a] text-[#EDEDED] text-sm focus:border-[#D4AF37] focus:outline-none transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-[#A1A1AA] mb-1">Số điện thoại *</label>
                    <input
                      type="tel"
                      required
                      placeholder="09xx xxx xxx"
                      value={customer.phone}
                      onChange={e => setCustomer({ ...customer, phone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#18181d] border border-[#27272a] text-[#EDEDED] text-sm focus:border-[#D4AF37] focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#A1A1AA] mb-1">Ghi chú (Tùy chọn)</label>
                    <input
                      type="text"
                      placeholder="Giờ nhận hàng, lời nhắn..."
                      value={customer.notes}
                      onChange={e => setCustomer({ ...customer, notes: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#18181d] border border-[#27272a] text-[#EDEDED] text-sm focus:border-[#D4AF37] focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-[#A1A1AA] mb-1">Địa chỉ nhận hàng *</label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố..."
                    value={customer.address}
                    onChange={e => setCustomer({ ...customer, address: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#18181d] border border-[#27272a] text-[#EDEDED] text-sm focus:border-[#D4AF37] focus:outline-none transition-colors resize-none"
                  />
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs text-[#A1A1AA] mb-2 font-medium">
                  Chọn hình thức thanh toán:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    onClick={() => setPaymentMethod('vietqr')}
                    className={`cursor-pointer p-4 rounded-xl border flex flex-col justify-between transition-all ${
                      paymentMethod === 'vietqr'
                        ? 'bg-[#D4AF37]/10 border-[#D4AF37] text-white shadow-md'
                        : 'bg-[#18181d] border-[#27272a] text-[#A1A1AA] hover:border-[#3f3f46]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center space-x-2">
                        <QrCode className="w-5 h-5 text-[#D4AF37]" />
                        <span className="text-sm font-semibold text-[#EDEDED]">Chuyển Khoản QR</span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-[#D4AF37] text-[#0c0c0e] font-bold">
                        FREE 0%
                      </span>
                    </div>
                    <p className="text-[11px] text-[#A1A1AA]">
                      Mở app ngân hàng quét mã VietQR tự động, xác thực trong 1–3s.
                    </p>
                  </div>

                  <div
                    onClick={() => setPaymentMethod('cod')}
                    className={`cursor-pointer p-4 rounded-xl border flex flex-col justify-between transition-all ${
                      paymentMethod === 'cod'
                        ? 'bg-[#D4AF37]/10 border-[#D4AF37] text-white shadow-md'
                        : 'bg-[#18181d] border-[#27272a] text-[#A1A1AA] hover:border-[#3f3f46]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-semibold text-[#EDEDED]">Thanh Toán Khi Nhận (COD)</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-[#27272a] text-[#A1A1AA]">
                        Tiền mặt
                      </span>
                    </div>
                    <p className="text-[11px] text-[#A1A1AA]">
                      Kiểm tra hàng trước khi thanh toán cho nhân viên giao vận.
                    </p>
                  </div>
                </div>
              </div>

              {/* Order total & CTA */}
              <div className="pt-4 border-t border-[#27272a] flex items-center justify-between">
                <div>
                  <span className="text-xs text-[#A1A1AA] block">Tổng số tiền:</span>
                  <span className="font-serif text-2xl font-bold text-[#D4AF37]">
                    {formatPrice(totalAmount)}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || cart.length === 0}
                  className="px-6 py-3.5 rounded-xl bg-[#D4AF37] hover:bg-[#c5a059] text-[#0c0c0e] font-semibold text-xs uppercase tracking-wider flex items-center space-x-2 shadow-lg shadow-[#D4AF37]/20 disabled:opacity-50 transition-all duration-200"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Đang xử lý...</span>
                    </>
                  ) : (
                    <>
                      <span>{paymentMethod === 'vietqr' ? 'Tạo Mã VietQR' : 'Xác Nhận Đặt Hàng'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Step 2: VietQR Live Payment Screen */}
          {step === 'qr_payment' && currentOrder && (
            <div className="text-center space-y-5">
              <div>
                <div className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-[#1c1c22] border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-medium mb-2">
                  <Clock className="w-3.5 h-3.5" />
                  <span>
                    Hiệu lực: {Math.floor(countdown / 60)}:{('0' + (countdown % 60)).slice(-2)}
                  </span>
                </div>
                <h3 className="font-serif text-2xl text-[#EDEDED] font-medium">
                  Quét Mã QR Để Thanh Toán
                </h3>
                <p className="text-xs text-[#A1A1AA] mt-1 max-w-sm mx-auto">
                  Mở ứng dụng ngân hàng bất kỳ (VCB, MB, Techcombank, VPBank, MoMo...) và quét mã
                </p>
              </div>

              {/* Dynamic QR Display */}
              <div className="relative inline-block p-4 rounded-2xl bg-white border-4 border-[#D4AF37] shadow-2xl shadow-[#D4AF37]/20">
                <img
                  src={currentOrder.qrCodeUrl || `https://img.vietqr.io/image/970422-0987654321-compact2.png?amount=${currentOrder.totalAmount}&addInfo=TSVH%20${currentOrder.orderCode}&accountName=TAN%20SAC%20VEN%20HUONG`}
                  alt="VietQR Code"
                  className="w-56 h-56 sm:w-64 sm:h-64 object-contain mx-auto"
                />
                <div className="mt-2 text-[11px] font-bold text-gray-800 tracking-wider">
                  MÃ ĐƠN: #{currentOrder.orderCode}
                </div>
              </div>

              {/* Summary Details */}
              <div className="max-w-md mx-auto p-3.5 rounded-xl bg-[#18181d] border border-[#27272a] text-xs space-y-2 text-left">
                <div className="flex justify-between items-center">
                  <span className="text-[#A1A1AA]">Số tiền thanh toán:</span>
                  <span className="font-serif text-base font-bold text-[#D4AF37]">
                    {formatPrice(currentOrder.totalAmount)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#A1A1AA]">Nội dung chuyển khoản:</span>
                  <div className="flex items-center space-x-1.5 font-mono text-[#EDEDED]">
                    <span>TSVH {currentOrder.orderCode}</span>
                    <button
                      onClick={copyOrderCode}
                      className="text-[#D4AF37] hover:text-[#fff] p-0.5"
                      title="Sao chép nội dung"
                    >
                      {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#A1A1AA]">Trạng thái:</span>
                  <span className="flex items-center space-x-1.5 text-yellow-400">
                    <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                    <span>Đang chờ chuyển khoản...</span>
                  </span>
                </div>
              </div>

              {/* Test 1-Click Simulation Button (Free demo test) */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleSimulatePayment}
                  disabled={isSimulating}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#1e293b] hover:bg-[#334155] border border-[#475569] text-xs font-medium text-emerald-400 flex items-center justify-center space-x-2 transition-all cursor-pointer"
                >
                  {isSimulating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                      <span>Đang kích hoạt giả lập thanh toán...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                      <span>Giả lập Thanh toán Thành công ngay (Demo Test)</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Success Screen */}
          {step === 'success' && (
            <div className="text-center py-6 space-y-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto"
              >
                <CheckCircle2 className="w-10 h-10" />
              </motion.div>

              <h3 className="font-serif text-3xl text-[#EDEDED] font-medium">
                Đặt Hàng Thành Công!
              </h3>
              <p className="text-sm text-[#A1A1AA] max-w-md mx-auto">
                Cảm ơn quý khách đã tin chọn <span className="text-[#D4AF37]">Tàn Sắc Vẹn Hương</span>. 
                Đơn hàng #{currentOrder?.orderCode} của quý khách đang được nghệ nhân chuẩn bị chu đáo.
              </p>

              <div className="p-4 rounded-xl bg-[#18181d] border border-[#27272a] text-xs max-w-sm mx-auto space-y-1.5 text-left text-[#A1A1AA]">
                <div className="flex justify-between">
                  <span>Khách hàng:</span>
                  <span className="text-white font-medium">{customer.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Số điện thoại:</span>
                  <span className="text-white font-medium">{customer.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span>Hình thức:</span>
                  <span className="text-white font-medium">
                    {paymentMethod === 'vietqr' ? 'VietQR (Đã thanh toán)' : 'COD (Thu hộ khi giao)'}
                  </span>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={handleClose}
                  className="px-8 py-3 rounded-full bg-[#D4AF37] hover:bg-[#c5a059] text-[#0c0c0e] font-semibold text-xs uppercase tracking-wider transition-all duration-200"
                >
                  Tiếp Tục Mua Sắm
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
