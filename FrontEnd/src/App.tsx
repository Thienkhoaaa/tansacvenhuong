import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell, CircleUserRound, ChevronLeft, ChevronRight, Flame, Heart, MapPin, Menu, X } from 'lucide-react';
import homePhoto from './assets/tuy-loan-home.png';
import productBox from './assets/pdf/product-box.png';

// 10 Story slides in numerical order (1 -> 10)
import story1 from './assets/story/story-1.png';
import story2 from './assets/story/story-2.png';
import story3 from './assets/story/story-3.png';
import story4 from './assets/story/story-4.png';
import story5 from './assets/story/story-5.png';
import story6 from './assets/story/story-6.png';
import story7 from './assets/story/story-7.png';
import story8 from './assets/story/story-8.png';
import story9 from './assets/story/story-9.png';
import story10 from './assets/story/story-10.png';

// 12 Member posters for Giới thiệu
import member1 from './assets/members/member-1.jpg';
import member2 from './assets/members/member-2.jpg';
import member3 from './assets/members/member-3.jpg';
import member4 from './assets/members/member-4.jpg';
import member5 from './assets/members/member-5.jpg';
import member6 from './assets/members/member-6.jpg';
import member7 from './assets/members/member-7.jpg';
import member8 from './assets/members/member-8.jpg';
import member9 from './assets/members/member-9.jpg';
import member10 from './assets/members/member-10.jpg';
import member11 from './assets/members/member-11.jpg';
import member12 from './assets/members/member-12.jpg';

import { CheckoutPage } from './pages/CheckoutPage.js';
import { OrderLookupPage } from './pages/OrderLookupPage.js';

const storyImages = [story1, story2, story3, story4, story5, story6, story7, story8, story9, story10];
const memberImages = [member1, member2, member3, member4, member5, member6, member7, member8, member9, member10, member11, member12];

const copy = {
  vi: {
    nav: ['TRANG CHỦ', 'CÂU CHUYỆN', 'GIỚI THIỆU', 'VIDEO', 'CỬA HÀNG'],
    heading: 'TÚY LOAN', slogan: 'Giữ lửa Túy Loan – Giữ hồn xứ Quảng',
    intro: 'Hơn 500 năm về trước, cùng với dấu chân mở cõi của ông cha ta và sự hình thành của ngôi làng cổ Túy Loan bên dòng sông thơ mộng, nghề làm bánh tráng đã bén rễ và trở thành nét sinh hoạt gắn liền với nếp nhà xứ Quảng. Từ những phiên chợ quê xưa cho đến mâm cỗ ngày Tết của bao thế hệ người Đà Nẵng, thức quà mộc mạc ấy chưa từng vắng bóng, lặng lẽ đi qua bao thăng trầm của thời cuộc để trở thành một phần máu thịt của vùng đất Hòa Vang.',
    story: 'CÂU CHUYỆN', storyLabel: 'Người giữ lửa',
    membersTag: 'DỰ ÁN TÚY LOAN · LỐI CHỜI',
    membersTitle: 'ĐỘI NGŨ THỰC HIỆN',
    membersSubtitle: 'Những gương mặt trẻ mang trọn tâm huyết và tình yêu dành cho làng nghề bánh tráng truyền thống xứ Quảng.',
    videoUnavailable: 'Video giới thiệu đang được cập nhật', product: 'HỘP BÁNH TRÁNG TÚY LOAN (5 CÁI)', quantity: 'Số lượng', buy: 'MUA HÀNG', orderPending: 'Thông tin đặt hàng đang được cập nhật.', footer: 'Nghề bánh tráng Túy Loan được gìn giữ qua đôi bàn tay người làm nghề và ngọn lửa bếp quê.', backTop: 'VỀ ĐẦU TRANG', explore: 'KHÁM PHÁ', productInfo: 'SẢN PHẨM', visit: 'GỐC LÀNG NGHỀ', location: 'Làng cổ Túy Loan, Hòa Vang, Đà Nẵng', heritage: 'Hơn 500 năm gìn giữ nghề bánh tráng', madeFor: 'Dành cho người yêu hương vị xứ Quảng',
  },
  en: {
    nav: ['HOME', 'OUR STORY', 'MEMBERS', 'VIDEO', 'SHOP'],
    heading: 'TÚY LOAN', slogan: 'Keeping the Túy Loan fire alive – Preserving the spirit of Quảng',
    intro: 'More than 500 years ago, as our ancestors settled the land and the ancient village of Túy Loan took shape beside its river, rice-paper making became part of everyday life in Quảng. From village markets to Lunar New Year feasts in Đà Nẵng, this humble food has endured through generations and become part of the heritage of Hòa Vang.',
    story: 'OUR STORY', storyLabel: 'Keeper of the fire',
    membersTag: 'TUY LOAN HERITAGE PROJECT',
    membersTitle: 'PROJECT TEAM MEMBERS',
    membersSubtitle: 'The dedicated young faces carrying passion and love for the traditional Quang craft village.',
    videoUnavailable: 'Introduction video coming soon', product: 'TÚY LOAN RICE PAPER BOX (5 PIECES)', quantity: 'Quantity', buy: 'BUY NOW', orderPending: 'Ordering details are being updated.', footer: 'The craft of Túy Loan rice paper lives on through skilled hands and the warmth of the village hearth.', backTop: 'BACK TO TOP', explore: 'EXPLORE', productInfo: 'PRODUCT', visit: 'OUR ROOTS', location: 'Túy Loan ancient village, Hòa Vang, Đà Nẵng', heritage: 'Over 500 years of rice-paper making', madeFor: 'For those who cherish the flavours of Quảng',
  },
} as const;

type Page = 'home' | 'story' | 'introduction' | 'video' | 'shop';

function HomeApp() {
  const [language, setLanguage] = useState<'vi' | 'en'>('vi');
  const [page, setPage] = useState<Page>('home');
  const [storyIndex, setStoryIndex] = useState(0);
  const [selectedMember, setSelectedMember] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showOrderNotice, setShowOrderNotice] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (selectedMember !== null) {
        if (e.key === 'Escape') setSelectedMember(null);
        if (e.key === 'ArrowLeft') setSelectedMember((selectedMember - 1 + memberImages.length) % memberImages.length);
        if (e.key === 'ArrowRight') setSelectedMember((selectedMember + 1) % memberImages.length);
      } else if (page === 'story') {
        if (e.key === 'ArrowLeft') setStoryIndex((storyIndex - 1 + storyImages.length) % storyImages.length);
        if (e.key === 'ArrowRight') setStoryIndex((storyIndex + 1) % storyImages.length);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedMember, page, storyIndex]);

  const t = copy[language];
  const pages: Page[] = ['home', 'story', 'introduction', 'video', 'shop'];
  const navigate = (next: Page) => {
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname);
    }
    setPage(next);
    setMenuOpen(false);
    setShowOrderNotice(false);
    setSelectedMember(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return <div className={`site-shell site-shell--${page}`}>
    <header className={`site-header ${isScrolled || menuOpen ? 'site-header--solid' : ''}`}>
      <button className="site-brand" onClick={() => navigate('home')} aria-label="LOICHOI home"><span className="loichoi-mark" role="img" aria-label="LOICHOI — EST 2026" /></button>
      <nav className={`site-nav ${menuOpen ? 'site-nav--open' : ''}`} aria-label="Main navigation">
        {pages.map((item, index) => <button key={item} className={page === item ? 'is-active' : ''} onClick={() => navigate(item)}>{t.nav[index]}</button>)}
        <button onClick={() => { window.location.href = '/tra-cuu-don-hang'; }}>TRA CỨU ĐƠN HÀNG</button>
      </nav>
      <div className="site-tools">
        <Bell size={25} aria-label={language === 'vi' ? 'Thông báo' : 'Notifications'} />
        <CircleUserRound size={26} aria-label={language === 'vi' ? 'Tài khoản' : 'Account'} />
        <button className="language-toggle" onClick={() => setLanguage(language === 'vi' ? 'en' : 'vi')} aria-label={language === 'vi' ? 'Switch to English' : 'Chuyển sang tiếng Việt'}>{language === 'vi' ? 'ENG' : 'VI'}</button>
        <button className="site-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Close menu' : 'Open menu'}>{menuOpen ? <X /> : <Menu />}</button>
      </div>
    </header>

    <main><AnimatePresence mode="wait" initial={false}>
      <motion.div key={page} className="page-transition" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.36, ease: 'easeOut' }}>
      
      {/* 1. TRANG CHỦ */}
      {page === 'home' && <section className="new-home" aria-labelledby="home-title">
        <img src={homePhoto} alt={language === 'vi' ? 'Nghệ nhân bên bếp bánh tráng Túy Loan' : 'Artisan at a Túy Loan rice-paper stove'} />
        <div className="new-home__shade" />
        <div className="new-home__content"><h1 id="home-title">{t.heading}</h1><p className="new-home__slogan">{t.slogan}</p><p className="new-home__intro">{t.intro}</p><button onClick={() => navigate('story')}>{t.story} <Flame size={24} fill="currentColor" /></button></div>
      </section>}

      {/* 2. CÂU CHUYỆN (10 ẢNH THEO THỨ TỰ) */}
      {page === 'story' && <section className="design-stage story-stage" aria-label={t.story}>
        <div className="story-counter"><span>{storyIndex + 1} / {storyImages.length}</span></div>
        <button className="story-arrow" onClick={() => setStoryIndex((storyIndex - 1 + storyImages.length) % storyImages.length)} aria-label="Previous story slide"><ChevronLeft /></button>
        <div className="story-frame">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={storyIndex} initial={{ opacity: 0, x: 22 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -22 }} transition={{ duration: 0.28 }} className="story-slide">
              <img src={storyImages[storyIndex]} alt={`Câu chuyện Túy Loan - Trang ${storyIndex + 1}`} />
            </motion.div>
          </AnimatePresence>
        </div>
        <button className="story-arrow" onClick={() => setStoryIndex((storyIndex + 1) % storyImages.length)} aria-label="Next story slide"><ChevronRight /></button>
        <div className="story-dots" aria-label="Slide position">
          {storyImages.map((_, i) => <button key={i} className={storyIndex === i ? 'is-active' : ''} onClick={() => setStoryIndex(i)} aria-label={`Trang ${i + 1}`} />)}
        </div>
      </section>}

      {/* 3. GIỚI THIỆU (12 THÀNH VIÊN RESPONSIVE GRID) */}
      {page === 'introduction' && <section className="members-stage" aria-label={t.nav[2]}>
        <div className="members-header">
          <span className="members-tag">{t.membersTag}</span>
          <h1>{t.membersTitle}</h1>
          <p>{t.membersSubtitle}</p>
          <div className="members-divider" />
        </div>
        <div className="members-grid">
          {memberImages.map((src, index) => (
            <div
              key={index}
              className="member-card"
              onClick={() => setSelectedMember(index)}
              role="button"
              tabIndex={0}
              aria-label={`Thành viên ${index + 1}`}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedMember(index); }}
            >
              <img src={src} alt={`Thành viên ${index + 1}`} loading="lazy" />
              <div className="member-card__overlay">
                <span>Phóng to 🔍</span>
              </div>
            </div>
          ))}
        </div>
      </section>}

      {/* 4. VIDEO (DANH MỤC RIÊNG BIỆT) */}
      {page === 'video' && <section className="design-stage video-stage" aria-label={t.nav[3]}>
        <div className="video-placeholder">
          <div className="play-glyph" aria-hidden="true" />
          <p>{t.videoUnavailable}</p>
        </div>
      </section>}

      {/* 5. CỬA HÀNG */}
      {page === 'shop' && <section id="shop" className="design-stage shop-stage" aria-labelledby="product-title"><div className="shop-product">
        <img src={productBox} alt={t.product} />
        <h1 id="product-title">{t.product}</h1>
        <div className="shop-product__details"><strong>120.000đ</strong><div className="quantity-control"><span>{t.quantity}</span><button onClick={() => setQuantity(Math.max(1, quantity - 1))} aria-label="Decrease quantity">−</button><output>{quantity}</output><button onClick={() => setQuantity(quantity + 1)} aria-label="Increase quantity">+</button></div></div>
        <button className="buy-button" onClick={() => { window.location.href = `/checkout?quantity=${quantity}`; }}>{t.buy}</button>
        <AnimatePresence>{showOrderNotice && <motion.p className="order-notice" role="status" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>{t.orderPending}</motion.p>}</AnimatePresence>
      </div></section>}

      </motion.div>
    </AnimatePresence></main>

    {/* LIGHTBOX MODAL CHO THÀNH VIÊN */}
    <AnimatePresence>
      {selectedMember !== null && (
        <motion.div
          className="member-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedMember(null)}
        >
          <motion.div
            className="member-modal-content"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={e => e.stopPropagation()}
          >
            <button className="member-modal-close" onClick={() => setSelectedMember(null)} aria-label="Đóng"><X size={20} /></button>
            <img src={memberImages[selectedMember]} alt={`Thành viên ${selectedMember + 1}`} />
            <div className="member-modal-nav">
              <button onClick={() => setSelectedMember((selectedMember - 1 + memberImages.length) % memberImages.length)}><ChevronLeft size={18} /> Trước</button>
              <span>{selectedMember + 1} / {memberImages.length}</span>
              <button onClick={() => setSelectedMember((selectedMember + 1) % memberImages.length)}>Sau <ChevronRight size={18} /></button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>

    <motion.footer className="new-footer" initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.55 }}>
      <div className="new-footer__main">
        <div className="new-footer__brand">
          <span className="new-footer__logo"><span className="loichoi-mark" role="img" aria-label="LOICHOI — EST 2026" /></span>
          <strong>{t.slogan}</strong>
          <p>{t.footer}</p>
          <span className="new-footer__heritage"><Flame size={16} />{t.heritage}</span>
        </div>
        <div className="new-footer__column"><h2>{t.explore}</h2><nav aria-label={t.explore}>{pages.map((item, index) => <button key={item} onClick={() => navigate(item)}>{t.nav[index]}</button>)}<button onClick={() => { window.location.href = '/tra-cuu-don-hang'; }}>Tra cứu đơn hàng</button></nav></div>
        <div className="new-footer__column"><h2>{t.productInfo}</h2><button className="new-footer__product" onClick={() => navigate('shop')}>{t.product}</button><p>120.000đ · {language === 'vi' ? '5 cái' : '5 pieces'}</p><button className="new-footer__top" onClick={() => navigate('home')}>{t.backTop} ↑</button></div>
        <div className="new-footer__column"><h2>{t.visit}</h2><p className="new-footer__location"><MapPin size={17} />{t.location}</p></div>
      </div>
      <div className="new-footer__bottom"><span>© {new Date().getFullYear()} LOICHOI · TÚY LOAN</span><span><Heart size={14} fill="currentColor" /> {t.madeFor}</span></div>
    </motion.footer>
  </div>;
}

export function App() {
  const path = window.location.pathname;
  if (path === '/test-checkout' || path === '/test-thanh-toan') {
    window.location.replace('/checkout');
    return null;
  }
  if (path === '/checkout') return <CheckoutPage />;
  if (path === '/tra-cuu-don-hang' || path === '/lookup-orders') return <OrderLookupPage />;
  return <HomeApp />;
}

export default App;
