import { useEffect, useState } from 'react';
import { LoaderCircle, Search } from 'lucide-react';
import { CommerceShell } from '../components/commerce/CommerceShell.js';
import { lookupOrdersByPhone } from '../services/api.js';
import type { OrderLookupRecord } from '../types/index.js';

const money = (value: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

export function OrderLookupPage() {
  const [phone, setPhone] = useState(() => new URLSearchParams(window.location.search).get('phone') || '');
  const [orders, setOrders] = useState<OrderLookupRecord[] | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [recentCodes, setRecentCodes] = useState<number[]>([]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('tsvh_order_codes') || '[]');
      if (Array.isArray(stored) && stored.length > 0) {
        setRecentCodes(stored);
      }
    } catch { /* ignore */ }
  }, []);

  const doLookup = async (query: string) => {
    if (!query.trim()) return;
    setBusy(true); setError('');
    try {
      const result = await lookupOrdersByPhone(query.trim());
      setOrders(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tra cứu đơn hàng.');
      setOrders(null);
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    const initialPhone = new URLSearchParams(window.location.search).get('phone');
    if (!initialPhone) return;
    doLookup(initialPhone);
  }, []);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    doLookup(phone);
  };

  return <CommerceShell eyebrow="HỖ TRỢ KHÁCH HÀNG" title="Tra cứu đơn hàng">
    <section className="commerce-card commerce-lookup">
      <p>Nhập số điện thoại hoặc mã đơn hàng đã dùng khi đặt hàng để xem trạng thái đơn.</p>
      <form onSubmit={submit}>
        <label htmlFor="lookup-phone">Số điện thoại hoặc Mã đơn hàng</label>
        <div>
          <input
            id="lookup-phone"
            type="text"
            required
            placeholder="Ví dụ: 0901234567 hoặc #11306804"
            value={phone}
            onChange={event => setPhone(event.target.value)}
          />
          <button disabled={busy}>
            {busy ? <LoaderCircle className="animate-spin" /> : <Search />} Tra cứu
          </button>
        </div>
      </form>
      {recentCodes.length > 0 && !orders && (
        <div style={{ marginTop: '0.75rem', fontSize: '0.85rem' }}>
          <span style={{ opacity: 0.7 }}>Đơn hàng gần đây trên thiết bị: </span>
          {recentCodes.slice(-3).map(code => (
            <button
              key={code}
              type="button"
              style={{
                marginLeft: '0.5rem',
                padding: '2px 8px',
                borderRadius: '4px',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.2)',
                cursor: 'pointer',
                color: 'inherit'
              }}
              onClick={() => { setPhone(String(code)); doLookup(String(code)); }}
            >
              #{code}
            </button>
          ))}
        </div>
      )}
      {error && <p className="commerce-error" role="alert">{error}</p>}
      {orders && (orders.length === 0 ? (
        <p className="commerce-empty">Chưa tìm thấy đơn hàng theo thông tin tra cứu này.</p>
      ) : (
        <div className="commerce-order-list">
          {orders.map(order => (
            <article key={order.orderCode} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem', width: '100%' }}>
                <div><span>MÃ ĐƠN</span><strong>#{order.orderCode}</strong></div>
                <div><span>NGÀY ĐẶT</span><strong>{new Date(order.createdAt).toLocaleDateString('vi-VN')}</strong></div>
                <div><span>TỔNG TIỀN</span><strong>{money(order.totalAmount)}</strong></div>
                <div><span>TRẠNG THÁI</span><strong className={`status-${order.status.toLowerCase()}`}>{order.status === 'PAID' ? 'Đã thanh toán' : order.status === 'CANCELLED' ? 'Đã hủy' : 'Đang xử lý'}</strong></div>
              </div>
              {order.items && order.items.length > 0 && (
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '0.5rem', fontSize: '0.85rem' }}>
                  <span style={{ opacity: 0.7 }}>Sản phẩm: </span>
                  <strong>{order.items.map(it => `${it.name} (x${it.quantity})`).join(', ')}</strong>
                </div>
              )}
            </article>
          ))}
        </div>
      ))}
      <small>Trang tra cứu bảo mật: không hiển thị địa chỉ nhà riêng hoặc ghi chú giao nhận.</small>
    </section>
  </CommerceShell>;
}
