import type { ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';

export function CommerceShell({ title, eyebrow, children }: { title: string; eyebrow: string; children: ReactNode }) {
  return <div className="commerce-shell">
    <header className="commerce-header">
      <a href="/" className="commerce-brand" aria-label="LOICHOI — Trang chủ"><span className="loichoi-mark" /></a>
    </header>
    <main className="commerce-main">
      <a className="commerce-back" href="/"><ArrowLeft size={16} /> Tiếp tục xem sản phẩm</a>
      <div className="commerce-heading"><span>{eyebrow}</span><h1>{title}</h1><i /></div>
      {children}
    </main>
    <footer className="commerce-footer">
      <span className="commerce-footer__logo"><span className="loichoi-mark" role="img" aria-label="LOICHOI" /></span>
      <p>Giữ lửa Túy Loan – Giữ hồn xứ Quảng</p>
    </footer>
  </div>;
}
