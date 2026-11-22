import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import QRCode from 'qrcode';
import { CheckCircle2, LoaderCircle } from 'lucide-react';
import { CommerceShell } from '../components/commerce/CommerceShell.js';
import { createPaymentLink, fetchCheckoutProducts, fetchPaymentOrderStatus } from '../services/api.js';
import type { PaymentLinkResponse, Product } from '../types/index.js';

const productId = 'tuy-loan-banh-trang-hop-5-cai';
const money = (value: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

export function CheckoutPage() {
  const requestedQuantity = Number(new URLSearchParams(window.location.search).get('quantity') || 1);
  const quantity = Number.isInteger(requestedQuantity) ? Math.max(1, Math.min(99, requestedQuantity)) : 1;
  const [product, setProduct] = useState<Product | null>(null);
  const [customerInfo, setCustomerInfo] = useState({ fullName: '', phone: '', address: '', note: '' });
  const [payment, setPayment] = useState<PaymentLinkResponse | null>(null);
  const [qr, setQr] = useState('');
  const [status, setStatus] = useState('PENDING');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => { fetchCheckoutProducts().then(items => setProduct(items.find(item => item.id === productId) ?? null)).catch(err => setError(err.message)); }, []);
  useEffect(() => {
    if (!payment?.qrCode) return;
    if (payment.qrCode.startsWith('http')) { setQr(payment.qrCode); return; }
    QRCode.toDataURL(payment.qrCode, { width: 320, margin: 1 }).then(setQr).catch(() => setQr(''));
  }, [payment]);
  useEffect(() => {
    if (!payment || status !== 'PENDING') return;
    let active = true;
    let timer: ReturnType<typeof setTimeout>;
    const poll = async () => {
      try {
        const result = await fetchPaymentOrderStatus(payment.orderCode);
        if (!active) return;
        if (result.status === 'PAID') {
          setStatus('PAID');
          try {
            const codes: number[] = JSON.parse(localStorage.getItem('tsvh_order_codes') || '[]');
            if (!codes.includes(payment.orderCode)) localStorage.setItem('tsvh_order_codes', JSON.stringify([...codes, payment.orderCode]));
          } catch { /* localStorage may be unavailable in private mode. */ }
          confetti({ particleCount: 90, spread: 65, origin: { y: 0.65 }, colors: ['#8b1516', '#fff1a5', '#ffffff'] });
          return;
        }
      } catch { /* Retry on the next poll interval. */ }
      if (active) timer = setTimeout(poll, 3000);
    };
    timer = setTimeout(poll, 3000);
    return () => { active = false; clearTimeout(timer); };
  }, [payment, status]);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setBusy(true); setError('');
    try {
      const result = await createPaymentLink({ customerInfo, items: [{ productId, quantity }], isTestMode: false });
      setPayment(result);
    } catch (err) { setError(err instanceof Error ? err.message : 'Không thể tạo thanh toán.'); }
    finally { setBusy(false); }
  };

  return <CommerceShell eyebrow="ĐẶT HÀNG TRỰC TUYẾN" title={payment ? `Đơn hàng #${payment.orderCode}` : 'Thanh toán'}>
    {payment ? <section className="commerce-card commerce-payment">
      <div><span className={`commerce-kicker ${status === 'PAID' ? 'commerce-kicker--paid' : ''}`}>{status === 'PAID' ? 'ĐÃ THANH TOÁN' : 'VIETQR · PAYOS'}</span><h2>{status === 'PAID' ? 'Cảm ơn bạn đã đặt hàng' : 'Quét mã QR để hoàn tất'}</h2><p>Số tiền thanh toán <strong>{money(payment.amount)}</strong></p><p className="commerce-muted">Mã đơn hàng #{payment.orderCode} · hệ thống tự kiểm tra trạng thái mỗi 3 giây.</p>{status === 'PAID' && <><div className="commerce-success"><CheckCircle2 /> Thanh toán thành công, đơn hàng đã được tiếp nhận.</div><p className="commerce-paid-note">Bạn có thể xem thông tin và trạng thái đơn tại mục Tra cứu đơn hàng.</p><a className="commerce-lookup-cta" href={`/tra-cuu-don-hang?phone=${encodeURIComponent(customerInfo.phone)}`}>TRA CỨU ĐƠN HÀNG</a></>}</div>
      {status !== 'PAID' && <div className="commerce-qr">{qr && <img src={qr} alt="Mã QR PayOS" />}<p>Quét mã bằng ứng dụng ngân hàng để thanh toán.</p></div>}
    </section> : <form className="commerce-card commerce-checkout" onSubmit={submit}>
      <div className="commerce-product">{product && <><img src={product.image} alt={product.name} /><div><span className="commerce-kicker">ĐẶC SẢN TÚY LOAN</span><h2>{product.name}</h2><p>{quantity} hộp × {money(product.price)}</p><strong>{money(product.price * quantity)}</strong></div></>}</div>
      <div className="commerce-fields"><h2>Thông tin nhận hàng</h2>
        <label>Họ và tên *<input required maxLength={120} autoComplete="name" value={customerInfo.fullName} onChange={e => setCustomerInfo({ ...customerInfo, fullName: e.target.value })} /></label>
        <label>Số điện thoại *<input required type="tel" autoComplete="tel" placeholder="0901234567" value={customerInfo.phone} onChange={e => setCustomerInfo({ ...customerInfo, phone: e.target.value })} /></label>
        <label>Địa chỉ nhận hàng *<textarea required maxLength={500} autoComplete="street-address" value={customerInfo.address} onChange={e => setCustomerInfo({ ...customerInfo, address: e.target.value })} /></label>
        <label>Ghi chú<textarea maxLength={500} value={customerInfo.note} onChange={e => setCustomerInfo({ ...customerInfo, note: e.target.value })} /></label>
        {error && <p className="commerce-error" role="alert">{error}</p>}
        <button className="commerce-submit" disabled={busy || !product}>{busy ? <LoaderCircle className="animate-spin" /> : null} TẠO MÃ QR THANH TOÁN</button>
        <p className="commerce-muted">Thanh toán an toàn qua PayOS. Giá được xác thực từ hệ thống trước khi tạo đơn.</p>
      </div>
    </form>}
  </CommerceShell>;
}
