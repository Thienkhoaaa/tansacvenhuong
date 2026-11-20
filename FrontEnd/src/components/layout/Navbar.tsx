import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';



export const Navbar = () => {

  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  return (
    <header className={`village-header ${isScrolled || menuOpen ? 'village-header--solid' : ''}`}>
      <a href="#home" className="village-logo" aria-label="LOICHOI — Trang chủ">
        <span className="loichoi-mark" role="img" aria-label="LOICHOI — EST 2026" />
      </a>
      <nav id="main-navigation" aria-label="Điều hướng chính" className={`village-nav ${menuOpen ? 'village-nav--open' : ''}`}>
        <a href="#home" onClick={() => setMenuOpen(false)}>TRANG CHỦ</a>
        <button type="button" disabled title="Câu chuyện đang được cập nhật">CÂU CHUYỆN</button>
        <button type="button" disabled title="Video đang được cập nhật">VIDEO</button>
        <button type="button" disabled title="Cửa hàng đang được cập nhật">CỬA HÀNG</button>
      </nav>
      <div className="village-header__tools">
        <button className="village-icon-button village-menu-toggle" aria-label={menuOpen ? 'Đóng menu' : 'Mở menu'} aria-expanded={menuOpen} aria-controls="main-navigation" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X /> : <Menu />}
        </button>
      </div>
    </header>
  );
};
