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
  useEffect(() => {
    const initialPhone = new URLSearchParams(window.location.search).get('phone');
    if (!initialPhone) return;
    lookupOrdersByPhone(initialPhone).then(setOrders).catch(err => setError(err.message));
  }, []);
  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setBusy(true); setError('');
    try { setOrders(await lookupOrdersByPhone(phone)); }
    catch (err) { setError(err instanceof Error ? err.message : 'Không thể tra cứu đơn hàng.'); setOrders(null); }
    finally { setBusy(false); }
  };
  return <CommerceShell eyebrow="HỖ TRỢ KHÁCH HÀNG" title="Tra cứu đơn hàng">
    <section className="commerce-card commerce-lookup">
      <p>Nhập số điện thoại đã dùng khi đặt hàng để xem trạng thái đơn.</p>
      <form onSubmit={submit}><label htmlFor="lookup-phone">Số điện thoại</label><div><input id="lookup-phone" type="tel" required placeholder="0901234567" value={phone} onChange={event => setPhone(event.target.value)} /><button disabled={busy}>{busy ? <LoaderCircle className="animate-spin" /> : <Search />} Tra cứu</button></div></form>
      {error && <p className="commerce-error" role="alert">{error}</p>}
      {orders && (orders.length === 0 ? <p className="commerce-empty">Chưa tìm thấy đơn hàng theo số điện thoại này.</p> : <div className="commerce-order-list">{orders.map(order => <article key={order.orderCode}><div><span>MÃ ĐƠN</span><strong>#{order.orderCode}</strong></div><div><span>NGÀY ĐẶT</span><strong>{new Date(order.createdAt).toLocaleDateString('vi-VN')}</strong></div><div><span>TỔNG TIỀN</span><strong>{money(order.totalAmount)}</strong></div><div><span>TRẠNG THÁI</span><strong className={`status-${order.status.toLowerCase()}`}>{order.status === 'PAID' ? 'Đã thanh toán' : order.status === 'CANCELLED' ? 'Đã hủy' : 'Đang xử lý'}</strong></div></article>)}</div>)}
      <small>Trang tra cứu không hiển thị địa chỉ hoặc ghi chú giao nhận.</small>
    </section>
  </CommerceShell>;
}
