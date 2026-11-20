import { useEffect, useMemo, useState } from 'react';
import confetti from 'canvas-confetti';
import QRCode from 'qrcode';
import { CheckCircle2, ExternalLink, FlaskConical, LoaderCircle, RefreshCw, ShoppingCart } from 'lucide-react';
import { CommerceShell } from '../components/commerce/CommerceShell.js';
import { createPaymentLink, fetchCheckoutProducts, fetchPaymentOrderStatus } from '../services/api.js';
import type { PaymentLinkResponse, Product } from '../types/index.js';

const money = (value: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

export function TestCheckoutPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [customerInfo, setCustomerInfo] = useState({
    fullName: 'Khách hàng Test',
    phone: '0901234567',
    address: '74 Hải Triều, Bến Nghé, Quận 1, TP. Hồ Chí Minh',
    note: 'Đơn hàng thử nghiệm chức năng thanh toán VietQR'
  });
  const [isTestMode, setIsTestMode] = useState(true);
  const [busy, setBusy] = useState(false);
  const [payment, setPayment] = useState<PaymentLinkResponse | null>(null);
  const [qr, setQr] = useState('');
  const [status, setStatus] = useState<'PENDING' | 'PAID' | 'CANCELLED'>('PENDING');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCheckoutProducts()
      .then(items => {
        setProducts(items);
        if (items.length > 0) {
          // Mặc định chọn 1 sản phẩm đầu tiên để tiện test nhanh
          setQuantities({ [items[0].id]: 1 });
        }
      })
      .catch(err => setError(err instanceof Error ? err.message : 'Không thể tải danh mục sản phẩm'))
      .finally(() => setLoading(false));
  }, []);

  const selectedItems = useMemo(() => {
    return Object.entries(quantities)
      .filter(([, qty]) => qty > 0)
      .map(([productId, quantity]) => ({ productId, quantity }));
  }, [quantities]);

  const subtotal = useMemo(() => {
    return selectedItems.reduce((sum, item) => {
      const prod = products.find(p => p.id === item.productId);
      return sum + (prod ? prod.price * item.quantity : 0);
    }, 0);
  }, [selectedItems, products]);

  const payableAmount = isTestMode ? 2000 : subtotal;

  const updateQuantity = (id: string, delta: number) => {
    setQuantities(prev => {
      const current = prev[id] || 0;
      const next = Math.max(0, Math.min(99, current + delta));
      return { ...prev, [id]: next };
    });
  };

  useEffect(() => {
    if (!payment?.qrCode) return;
    if (payment.qrCode.startsWith('http')) {
      setQr(payment.qrCode);
      return;
    }
    QRCode.toDataURL(payment.qrCode, { width: 320, margin: 1 })
      .then(setQr)
      .catch(() => setQr(''));
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
            if (!codes.includes(payment.orderCode)) {
              localStorage.setItem('tsvh_order_codes', JSON.stringify([...codes, payment.orderCode]));
            }
          } catch { /* Private mode fallback */ }
          confetti({ particleCount: 100, spread: 70, origin: { y: 0.65 }, colors: ['#8b1516', '#ffedbe', '#ffffff', '#22c55e'] });
          return;
        }
        if (result.status === 'CANCELLED') {
          setStatus('CANCELLED');
          return;
        }
      } catch { /* Retry */ }
      if (active) timer = setTimeout(poll, 3000);
    };

    timer = setTimeout(poll, 3000);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [payment, status]);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (selectedItems.length === 0) {
      setError('Vui lòng chọn ít nhất 1 sản phẩm.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      const result = await createPaymentLink({
        customerInfo,
        items: selectedItems,
        isTestMode
      });
      setPayment(result);
      setStatus('PENDING');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tạo liên kết thanh toán.');
    } finally {
      setBusy(false);
    }
  };

  const resetForm = () => {
    setPayment(null);
    setQr('');
    setStatus('PENDING');
    setError('');
  };

  return (
    <CommerceShell eyebrow="MÔI TRƯỜNG KIỂM THỬ" title="Trang Test Thanh Toán VietQR">
      {/* Thông báo chế độ test */}
      <div style={{
        margin: '0 auto 24px',
        padding: '14px 20px',
        borderRadius: '12px',
        background: 'rgba(255, 237, 190, 0.15)',
        border: '1px solid rgba(255, 237, 190, 0.35)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        fontSize: '0.9rem',
        color: '#ffedbe'
      }}>
        <FlaskConical size={24} style={{ flexShrink: 0, color: '#facc15' }} />
        <div>
          <strong>Chế độ thử nghiệm thanh toán (Sandbox):</strong> Trang này cho phép bạn chọn sản phẩm, tính tiền đầy đủ và quét mã VietQR thật qua cổng PayOS với tùy chọn mức phí kiểm thử chỉ <strong>2.000đ</strong>.
        </div>
      </div>

      {payment ? (
        <section className="commerce-card commerce-payment">
          <div>
            <span className="commerce-kicker">
              {status === 'PAID' ? 'ĐÃ THANH TOÁN THÀNH CÔNG' : 'CỔNG THANH TOÁN VIETQR · PAYOS'}
            </span>
            <h2>{status === 'PAID' ? 'Cảm ơn bạn đã thanh toán test!' : 'Quét mã VietQR để hoàn tất'}</h2>
            
            <p>
              Số tiền thanh toán: <strong>{money(payment.amount)}</strong>
              {isTestMode && <span style={{ marginLeft: '8px', fontSize: '0.85rem', color: '#16a34a', fontWeight: 600 }}>(Chế độ Test 2.000đ)</span>}
            </p>
            <p className="commerce-muted">
              Mã đơn hàng <strong>#{payment.orderCode}</strong> · Hệ thống tự động kiểm tra trạng thái mỗi 3 giây.
            </p>

            {status === 'PENDING' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#854d0e', background: '#fef9c3', padding: '10px 14px', borderRadius: '8px', margin: '14px 0', fontSize: '0.875rem' }}>
                <LoaderCircle className="animate-spin" size={18} /> Đang chờ chuyển khoản từ ứng dụng ngân hàng...
              </div>
            )}

            {status === 'PAID' && (
              <>
                <div className="commerce-success">
                  <CheckCircle2 size={22} /> Đã nhận xác nhận thanh toán thành công từ PayOS & Ngân hàng!
                </div>
                <p className="commerce-paid-note">
                  Đơn hàng đã được lưu vào cơ sở dữ liệu MongoDB Atlas. Bạn có thể tra cứu đơn này bất cứ lúc nào.
                </p>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '16px' }}>
                  <a className="commerce-lookup-cta" href={`/tra-cuu-don-hang?phone=${encodeURIComponent(customerInfo.phone)}`}>
                    TRA CỨU ĐƠN HÀNG NÀY
                  </a>
                  <button
                    type="button"
                    onClick={resetForm}
                    style={{
                      marginTop: '10px',
                      padding: '12px 18px',
                      borderRadius: '9px',
                      background: 'rgba(0,0,0,0.06)',
                      border: '1px solid rgba(0,0,0,0.15)',
                      cursor: 'pointer',
                      fontWeight: 700,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <RefreshCw size={15} /> Tạo đơn kiểm thử khác
                  </button>
                </div>
              </>
            )}

            {status !== 'PAID' && (
              <div style={{ marginTop: '16px' }}>
                <button
                  type="button"
                  onClick={resetForm}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '6px',
                    background: 'transparent',
                    border: '1px solid #d8c8a8',
                    cursor: 'pointer',
                    fontSize: '0.85rem'
                  }}
                >
                  ← Chọn lại sản phẩm
                </button>
              </div>
            )}
          </div>

          <div className="commerce-qr">
            {qr ? (
              <img src={qr} alt={`Mã QR PayOS #${payment.orderCode}`} />
            ) : (
              <div style={{ padding: '40px 20px', textAlign: 'center', background: '#fff', borderRadius: '12px' }}>
                <LoaderCircle className="animate-spin" size={28} />
                <p style={{ marginTop: '8px', fontSize: '0.85rem' }}>Đang tạo mã VietQR...</p>
              </div>
            )}
            <p style={{ fontSize: '0.85rem', color: '#555', textAlign: 'center' }}>
              Quét bằng ứng dụng của bất kỳ ngân hàng nào (Vietcombank, MB, Techcombank, VPBank, MoMo, v.v.)
            </p>
            {payment.checkoutUrl && (
              <a href={payment.checkoutUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                Mở trang thanh toán PayOS <ExternalLink size={14} />
              </a>
            )}
          </div>
        </section>
      ) : (
        <form className="commerce-card commerce-checkout" onSubmit={submit}>
          {/* Cột trái: Chọn sản phẩm & Tính tiền */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>1. Chọn sản phẩm test</h2>
              <span style={{ fontSize: '0.8rem', color: '#66594b' }}>Dữ liệu từ MongoDB</span>
            </div>

            {loading ? (
              <div style={{ padding: '30px', textAlign: 'center', color: '#66594b' }}>
                <LoaderCircle className="animate-spin" style={{ margin: 'auto' }} />
                <p style={{ marginTop: '8px' }}>Đang tải danh sách sản phẩm...</p>
              </div>
            ) : products.length === 0 ? (
              <p style={{ color: '#8b1516' }}>Không tìm thấy sản phẩm nào.</p>
            ) : (
              <div style={{ display: 'grid', gap: '12px' }}>
                {products.map(product => {
                  const qty = quantities[product.id] || 0;
                  return (
                    <article
                      key={product.id}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '70px 1fr auto',
                        gap: '12px',
                        alignItems: 'center',
                        padding: '12px',
                        borderRadius: '12px',
                        background: qty > 0 ? '#fffdf7' : 'rgba(0,0,0,0.02)',
                        border: qty > 0 ? '1.5px solid #8b1516' : '1px solid #e5d8be',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '8px' }}
                      />
                      <div>
                        <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#29251e' }}>{product.name}</h3>
                        <p style={{ margin: '2px 0 4px', fontSize: '0.8rem', color: '#66594b' }}>{product.subtitle || product.volume}</p>
                        <strong style={{ fontSize: '0.95rem', color: '#8b1516' }}>{money(product.price)}</strong>
                      </div>
                      <div className="quantity-control" style={{ border: '1px solid #d8c8a8', borderRadius: '6px', overflow: 'hidden' }}>
                        <button type="button" onClick={() => updateQuantity(product.id, -1)} aria-label="Giảm">−</button>
                        <output style={{ minWidth: '28px', textAlign: 'center' }}>{qty}</output>
                        <button type="button" onClick={() => updateQuantity(product.id, 1)} aria-label="Tăng">+</button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}

            {/* Bảng tính tiền chi tiết */}
            <div style={{ marginTop: '20px', padding: '16px', borderRadius: '12px', background: '#f5ead2', border: '1px solid #e2d2b4' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                <span style={{ color: '#66594b' }}>Tạm tính ({selectedItems.reduce((acc, i) => acc + i.quantity, 0)} món):</span>
                <strong>{money(subtotal)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.9rem' }}>
                <span style={{ color: '#66594b' }}>Phí vận chuyển:</span>
                <span style={{ color: '#16a34a', fontWeight: 600 }}>Miễn phí (Test)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px dashed #d0be9c', fontSize: '1.05rem' }}>
                <strong>Tổng tiền đơn hàng:</strong>
                <strong style={{ color: '#8b1516', fontSize: '1.2rem' }}>{money(subtotal)}</strong>
              </div>
            </div>

            {/* Tùy chọn chế độ test 2.000đ */}
            <div style={{
              marginTop: '16px',
              padding: '14px',
              borderRadius: '12px',
              background: isTestMode ? '#f0fdf4' : '#f9fafb',
              border: isTestMode ? '1.5px solid #22c55e' : '1px solid #e5e7eb'
            }}>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer', margin: 0 }}>
                <input
                  type="checkbox"
                  checked={isTestMode}
                  onChange={e => setIsTestMode(e.target.checked)}
                  style={{ width: '18px', height: '18px', marginTop: '3px', accentColor: '#16a34a' }}
                />
                <div>
                  <strong style={{ color: isTestMode ? '#15803d' : '#374151', fontSize: '0.95rem' }}>
                    Chế độ Test: Chỉ thanh toán 2.000đ qua VietQR
                  </strong>
                  <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: '#4b5563', lineHeight: 1.5 }}>
                    Mã QR PayOS sẽ được tạo với số tiền <strong>2.000đ</strong> (mức tối thiểu của ngân hàng) để bạn có thể chuyển khoản thật từ app ngân hàng mà không tốn nhiều chi phí.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Cột phải: Thông tin nhận hàng & Xác nhận */}
          <div className="commerce-fields">
            <h2 style={{ margin: '0 0 10px', fontSize: '1.25rem', fontWeight: 800 }}>2. Thông tin nhận hàng (Test)</h2>
            <label>
              Họ và tên *
              <input
                required
                maxLength={120}
                autoComplete="name"
                value={customerInfo.fullName}
                onChange={e => setCustomerInfo({ ...customerInfo, fullName: e.target.value })}
              />
            </label>
            <label>
              Số điện thoại *
              <input
                required
                type="tel"
                autoComplete="tel"
                placeholder="0901234567"
                value={customerInfo.phone}
                onChange={e => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
              />
            </label>
            <label>
              Địa chỉ nhận hàng *
              <textarea
                required
                rows={2}
                maxLength={500}
                autoComplete="street-address"
                value={customerInfo.address}
                onChange={e => setCustomerInfo({ ...customerInfo, address: e.target.value })}
              />
            </label>
            <label>
              Ghi chú đơn hàng
              <textarea
                rows={2}
                maxLength={500}
                value={customerInfo.note}
                onChange={e => setCustomerInfo({ ...customerInfo, note: e.target.value })}
              />
            </label>

            {error && <p className="commerce-error" role="alert">{error}</p>}

            <button
              className="commerce-submit"
              disabled={busy || selectedItems.length === 0}
              style={{ marginTop: '8px' }}
            >
              {busy ? <LoaderCircle className="animate-spin" size={18} /> : <ShoppingCart size={18} />}
              TẠO MÃ VIETQR THANH TOÁN ({money(payableAmount)})
            </button>

            <p className="commerce-muted" style={{ textAlign: 'center' }}>
              Cổng thanh toán tự động VietQR Napas 24/7 (PayOS). Đơn hàng sẽ tự động xác nhận ngay sau khi ngân hàng báo có.
            </p>
          </div>
        </form>
      )}
    </CommerceShell>
  );
}
