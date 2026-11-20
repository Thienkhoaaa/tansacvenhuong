import { useEffect, useMemo, useState } from 'react';
import confetti from 'canvas-confetti';
import QRCode from 'qrcode';
import { ArrowLeft, CheckCircle2, ExternalLink, LoaderCircle, RefreshCw, ShoppingBag } from 'lucide-react';
import { createPaymentLink, fetchCheckoutProducts, fetchPaymentOrderStatus, lookupOrdersByPhone } from '../services/api.js';
import type { OrderLookupRecord, PaymentLinkResponse, Product } from '../types/index.js';

const formatVnd = (amount: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
const normalizePhone = (phone: string) => phone.replace(/[\s().-]/g, '');
const isValidVietnamesePhone = (phone: string) => /^(?:0|\+84|84)(?:3|5|7|8|9)\d{8}$/.test(normalizePhone(phone));
const ORDER_CODES_KEY = 'tsvh_order_codes';

export function TestCheckoutPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [pageError, setPageError] = useState('');
  const [customerInfo, setCustomerInfo] = useState({ fullName: '', phone: '', address: '', note: '' });
  const [isTestMode, setIsTestMode] = useState(false);
  const [creating, setCreating] = useState(false);
  const [payment, setPayment] = useState<PaymentLinkResponse | null>(null);
  const [qrImage, setQrImage] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<'PENDING' | 'PAID' | 'CANCELLED'>('PENDING');
  const [pollingError, setPollingError] = useState('');
  const [lookupOrders, setLookupOrders] = useState<OrderLookupRecord[] | null>(null);
  const [lookingUp, setLookingUp] = useState(false);

  useEffect(() => {
    let active = true;
    fetchCheckoutProducts()
      .then(data => { if (active) setProducts(data); })
      .catch(error => { if (active) setPageError(error instanceof Error ? error.message : 'Không thể tải sản phẩm'); })
      .finally(() => { if (active) setLoadingProducts(false); });
    return () => { active = false; };
  }, []);

  const selectedItems = useMemo(
    () => Object.entries(quantities).filter(([, quantity]) => quantity > 0).map(([productId, quantity]) => ({ productId, quantity })),
    [quantities]
  );
  const productTotal = useMemo(() => selectedItems.reduce((sum, item) => {
    const product = products.find(entry => entry.id === item.productId);
    return sum + (product?.price ?? 0) * item.quantity;
  }, 0), [products, selectedItems]);

  useEffect(() => {
    if (!payment?.qrCode) { setQrImage(''); return; }
    if (/^https?:\/\//i.test(payment.qrCode)) { setQrImage(payment.qrCode); return; }
    let active = true;
    QRCode.toDataURL(payment.qrCode, { width: 320, margin: 1, errorCorrectionLevel: 'M', color: { dark: '#171717', light: '#ffffff' } })
      .then(url => { if (active) setQrImage(url); })
      .catch(() => { if (active) setQrImage(''); });
    return () => { active = false; };
  }, [payment?.qrCode]);

  useEffect(() => {
    if (!payment || paymentStatus !== 'PENDING') return;
    let active = true;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const poll = async () => {
      try {
        const order = await fetchPaymentOrderStatus(payment.orderCode);
        if (!active) return;
        setPollingError('');
        if (order.status === 'PAID') {
          setPaymentStatus('PAID');
          try {
            const codes: number[] = JSON.parse(localStorage.getItem(ORDER_CODES_KEY) || '[]');
            if (!codes.includes(payment.orderCode)) localStorage.setItem(ORDER_CODES_KEY, JSON.stringify([...codes, payment.orderCode]));
          } catch { /* Storage can be unavailable in private browsing modes. */ }
          confetti({ particleCount: 100, spread: 72, origin: { y: 0.65 }, colors: ['#D4AF37', '#ffffff', '#75d69c'] });
          return;
        }
        if (order.status === 'CANCELLED') { setPaymentStatus('CANCELLED'); return; }
      } catch {
        if (active) setPollingError('Chưa kiểm tra được trạng thái. Hệ thống sẽ thử lại tự động.');
      }
      if (active) timer = setTimeout(poll, 3000);
    };
    timer = setTimeout(poll, 3000);
    return () => { active = false; if (timer) clearTimeout(timer); };
  }, [payment, paymentStatus]);

  const updateQuantity = (productId: string, next: number) => {
    setQuantities(current => ({ ...current, [productId]: Math.max(0, Math.min(99, next)) }));
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPageError('');
    setLookupOrders(null);
    if (!isValidVietnamesePhone(customerInfo.phone)) {
      setPageError('Vui lòng nhập số điện thoại Việt Nam hợp lệ, ví dụ 0901234567.');
      return;
    }
    if (!selectedItems.length) {
      setPageError('Vui lòng chọn ít nhất một sản phẩm.');
      return;
    }
    setCreating(true);
    try {
      const response = await createPaymentLink({ customerInfo, items: selectedItems, isTestMode });
      setPayment(response);
      setPaymentStatus('PENDING');
      setPollingError('');
    } catch (error) {
      setPageError(error instanceof Error ? error.message : 'Không thể tạo mã QR thanh toán.');
    } finally {
      setCreating(false);
    }
  };

  const handleLookup = async () => {
    setLookingUp(true);
    setPageError('');
    try {
      setLookupOrders(await lookupOrdersByPhone(customerInfo.phone));
    } catch (error) {
      setPageError(error instanceof Error ? error.message : 'Không thể tra cứu đơn hàng.');
    } finally {
      setLookingUp(false);
    }
  };

  const startOver = () => {
    setPayment(null);
    setQrImage('');
    setPaymentStatus('PENDING');
    setLookupOrders(null);
  };

  return (
    <main className="min-h-screen bg-[#10100f] px-4 py-8 text-stone-100 sm:px-8 sm:py-12">
      <div className="mx-auto max-w-6xl">
        <a href="/" className="mb-8 inline-flex items-center gap-2 text-sm text-stone-400 transition hover:text-amber-300">
          <ArrowLeft size={16} /> Về trang chủ
        </a>
        <header className="mb-8 border-b border-white/10 pb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-400">Checkout Sandbox</p>
          <h1 className="mt-2 font-serif text-4xl sm:text-5xl">Guest Checkout & VietQR</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-400">Trang kiểm thử độc lập. Không cần đăng nhập. Giá và tổng tiền cuối cùng luôn được xác thực từ MongoDB ở backend.</p>
        </header>

        {payment ? (
          <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-6 sm:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div><p className="text-xs uppercase tracking-[0.2em] text-amber-300">Đơn hàng #{payment.orderCode}</p><h2 className="mt-2 text-2xl font-semibold">{paymentStatus === 'PAID' ? 'Thanh toán thành công' : paymentStatus === 'CANCELLED' ? 'Đơn đã hủy' : 'Quét mã để thanh toán'}</h2></div>
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${paymentStatus === 'PAID' ? 'bg-emerald-400/15 text-emerald-300' : 'bg-amber-300/10 text-amber-200'}`}>{paymentStatus}</span>
              </div>
              <p className="mt-3 text-stone-400">Số tiền: <strong className="text-xl text-amber-300">{formatVnd(payment.amount)}</strong>{isTestMode && <span className="ml-2 text-xs text-stone-500">(Chế độ Test 2.000đ)</span>}</p>
              {paymentStatus === 'PENDING' && <p className="mt-2 text-sm text-stone-400">Đang tự động kiểm tra trạng thái mỗi 3 giây…</p>}
              {pollingError && <p className="mt-2 text-sm text-amber-200" role="status">{pollingError}</p>}
              {paymentStatus === 'PAID' && <div className="mt-6 flex items-center gap-3 rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-emerald-200"><CheckCircle2 /> Đã nhận xác nhận thanh toán từ PayOS.</div>}
              <div className="mt-6 flex flex-wrap gap-3">
                <button onClick={handleLookup} disabled={lookingUp} className="inline-flex items-center gap-2 rounded-lg border border-amber-300/30 px-4 py-2.5 text-sm text-amber-200 hover:bg-amber-300/10 disabled:opacity-50">
                  {lookingUp ? <LoaderCircle className="animate-spin" size={16} /> : <RefreshCw size={16} />} Tra cứu nhanh theo SĐT
                </button>
                <button onClick={startOver} className="rounded-lg bg-amber-300 px-4 py-2.5 text-sm font-semibold text-stone-950 hover:bg-amber-200">Tạo đơn kiểm thử mới</button>
              </div>
              {pageError && <p role="alert" className="mt-4 text-sm text-red-200">{pageError}</p>}
              {lookupOrders && <div className="mt-5 rounded-xl border border-white/10 p-4"><h3 className="font-medium">Lịch sử đơn theo số điện thoại ({lookupOrders.length})</h3>{lookupOrders.length === 0 ? <p className="mt-2 text-sm text-stone-400">Chưa có đơn hàng.</p> : <ul className="mt-3 space-y-2">{lookupOrders.map(order => <li key={order.orderCode} className="flex justify-between gap-4 text-sm"><span>#{order.orderCode}</span><span>{formatVnd(order.totalAmount)} · {order.status}</span></li>)}</ul>}</div>}
            </div>
            <aside className="rounded-2xl border border-amber-300/20 bg-white p-5 text-center text-stone-900">
              {qrImage ? <img src={qrImage} alt={`Mã QR thanh toán đơn ${payment.orderCode}`} className="mx-auto aspect-square w-full max-w-[320px] object-contain" /> : <div className="mx-auto grid aspect-square w-full max-w-[320px] place-items-center text-sm text-stone-500">Không dựng được QR. Mở liên kết PayOS bên dưới.</div>}
              <p className="mt-3 text-xs text-stone-500">Nội dung chuyển khoản theo mã QR PayOS</p>
              <a href={payment.checkoutUrl} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 rounded-lg bg-stone-900 px-4 py-3 text-sm font-medium text-white hover:bg-stone-700">Mở trang thanh toán PayOS <ExternalLink size={15} /></a>
            </aside>
          </section>
        ) : (
          <form onSubmit={submit} className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
            <section className="rounded-2xl border border-white/10 bg-white/[0.035] p-5 sm:p-7">
              <div className="mb-5 flex items-center justify-between"><h2 className="text-xl font-semibold">Chọn sản phẩm</h2><span className="text-xs text-stone-500">Dữ liệu trực tiếp từ MongoDB</span></div>
              {loadingProducts ? <div className="flex items-center gap-2 py-8 text-stone-400"><LoaderCircle className="animate-spin" size={18} /> Đang tải sản phẩm…</div> : products.length === 0 ? <p className="py-8 text-sm text-stone-400">MongoDB chưa có sản phẩm để kiểm thử.</p> : <div className="space-y-3">{products.map(product => <article key={product.id} className="flex gap-4 rounded-xl border border-white/10 bg-black/10 p-3">
                <img src={product.image} alt="" className="h-20 w-20 rounded-lg bg-stone-800 object-cover" />
                <div className="min-w-0 flex-1"><h3 className="font-medium">{product.name}</h3><p className="mt-1 line-clamp-2 text-xs text-stone-400">{product.subtitle}</p><p className="mt-2 text-sm font-semibold text-amber-300">{formatVnd(product.price)}</p></div>
                <div className="flex items-center gap-2 self-center"><button type="button" aria-label={`Giảm ${product.name}`} onClick={() => updateQuantity(product.id, (quantities[product.id] ?? 0) - 1)} className="grid h-8 w-8 place-items-center rounded border border-white/15 hover:border-amber-300">−</button><output className="w-5 text-center text-sm">{quantities[product.id] ?? 0}</output><button type="button" aria-label={`Tăng ${product.name}`} onClick={() => updateQuantity(product.id, (quantities[product.id] ?? 0) + 1)} className="grid h-8 w-8 place-items-center rounded border border-white/15 hover:border-amber-300">+</button></div>
              </article>)}</div>}
              <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4 text-sm"><span className="text-stone-400">Tổng tham khảo</span><strong className="text-lg text-amber-300">{formatVnd(productTotal)}</strong></div>
              <label className="mt-5 flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-amber-300/20 bg-amber-300/[0.06] p-4">
                <span><strong className="block text-sm">Chế độ Test 2.000đ</strong><small className="mt-1 block text-xs text-stone-400">Tạo payment link PayOS thật với số tiền 2.000đ.</small></span>
                <input type="checkbox" checked={isTestMode} onChange={event => setIsTestMode(event.target.checked)} className="h-5 w-5 accent-amber-400" />
              </label>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/[0.035] p-5 sm:p-7">
              <h2 className="mb-5 text-xl font-semibold">Thông tin nhận hàng</h2>
              <div className="space-y-4">
                <label className="block text-sm"><span className="mb-1.5 block text-stone-300">Họ và tên *</span><input required maxLength={120} autoComplete="name" value={customerInfo.fullName} onChange={event => setCustomerInfo({ ...customerInfo, fullName: event.target.value })} className="w-full rounded-lg border border-white/10 bg-black/20 px-3.5 py-3 outline-none focus:border-amber-300/60" /></label>
                <label className="block text-sm"><span className="mb-1.5 block text-stone-300">Số điện thoại *</span><input required type="tel" autoComplete="tel" inputMode="tel" value={customerInfo.phone} onChange={event => setCustomerInfo({ ...customerInfo, phone: event.target.value })} aria-describedby="phone-help" className="w-full rounded-lg border border-white/10 bg-black/20 px-3.5 py-3 outline-none focus:border-amber-300/60" /><small id="phone-help" className="mt-1.5 block text-xs text-stone-500">Ví dụ: 0901234567 hoặc +84901234567</small></label>
                <label className="block text-sm"><span className="mb-1.5 block text-stone-300">Địa chỉ nhận hàng *</span><textarea required maxLength={500} rows={3} autoComplete="street-address" value={customerInfo.address} onChange={event => setCustomerInfo({ ...customerInfo, address: event.target.value })} className="w-full resize-y rounded-lg border border-white/10 bg-black/20 px-3.5 py-3 outline-none focus:border-amber-300/60" /></label>
                <label className="block text-sm"><span className="mb-1.5 block text-stone-300">Ghi chú</span><textarea maxLength={500} rows={2} value={customerInfo.note} onChange={event => setCustomerInfo({ ...customerInfo, note: event.target.value })} className="w-full resize-y rounded-lg border border-white/10 bg-black/20 px-3.5 py-3 outline-none focus:border-amber-300/60" /></label>
              </div>
              {pageError && <p role="alert" className="mt-4 rounded-lg border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-200">{pageError}</p>}
              <button type="submit" disabled={creating || loadingProducts || selectedItems.length === 0} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-amber-300 px-4 py-3.5 font-semibold text-stone-950 transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-50">
                {creating ? <LoaderCircle className="animate-spin" size={18} /> : <ShoppingBag size={18} />} {creating ? 'Đang tạo payment link…' : 'Tạo mã QR Thanh Toán'}
              </button>
              <p className="mt-3 text-center text-[11px] leading-5 text-stone-500">Không cần tài khoản. Backend lấy giá từ database và lưu đơn trước khi tạo payment link.</p>
            </section>
          </form>
        )}
      </div>
    </main>
  );
}
