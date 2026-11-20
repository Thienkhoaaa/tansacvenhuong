import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell, CircleUserRound, ChevronLeft, ChevronRight, Flame, Heart, MapPin, Menu, X } from 'lucide-react';
import homePhoto from './assets/tuy-loan-home.png';
import storyCover from './assets/pdf/story-cover.png';
import storyFire from './assets/pdf/story-fire.png';
import productBox from './assets/pdf/product-box.png';
import { TestCheckoutPage } from './pages/TestCheckoutPage.js';
import { CheckoutPage } from './pages/CheckoutPage.js';
import { OrderLookupPage } from './pages/OrderLookupPage.js';

const copy = {
  vi: {
    nav: ['TRANG CHỦ', 'CÂU CHUYỆN', 'GIỚI THIỆU', 'CỬA HÀNG'],
    heading: 'TÚY LOAN', slogan: 'Giữ lửa Túy Loan – Giữ hồn xứ Quảng',
    intro: 'Hơn 500 năm về trước, cùng với dấu chân mở cõi của ông cha ta và sự hình thành của ngôi làng cổ Túy Loan bên dòng sông thơ mộng, nghề làm bánh tráng đã bén rễ và trở thành nét sinh hoạt gắn liền với nếp nhà xứ Quảng. Từ những phiên chợ quê xưa cho đến mâm cỗ ngày Tết của bao thế hệ người Đà Nẵng, thức quà mộc mạc ấy chưa từng vắng bóng, lặng lẽ đi qua bao thăng trầm của thời cuộc để trở thành một phần máu thịt của vùng đất Hòa Vang.',
    story: 'CÂU CHUYỆN', storyLabel: 'Người giữ lửa', storyText: 'Qua cánh cửa nhỏ, gian bếp quen thuộc hiện ra đầy ắp ánh nắng sớm hòa quyện cùng làn khói trắng nghi ngút. Giữa không gian đậm chất dân dã ấy, người nghệ nhân bắt đầu một ngày lao động miệt mài bên nồi tráng bánh đang sôi sùng sục. Dáng vẻ bình dị mà kiên định của bà như linh hồn sưởi ấm cả góc bếp nhỏ.',
    videoUnavailable: 'Video giới thiệu đang được cập nhật', product: 'HỘP BÁNH TRÁNG TÚY LOAN (5 CÁI)', quantity: 'Số lượng', buy: 'MUA HÀNG', orderPending: 'Thông tin đặt hàng đang được cập nhật.', footer: 'Nghề bánh tráng Túy Loan được gìn giữ qua đôi bàn tay người làm nghề và ngọn lửa bếp quê.', backTop: 'VỀ ĐẦU TRANG', explore: 'KHÁM PHÁ', productInfo: 'SẢN PHẨM', visit: 'GỐC LÀNG NGHỀ', location: 'Làng cổ Túy Loan, Hòa Vang, Đà Nẵng', heritage: 'Hơn 500 năm gìn giữ nghề bánh tráng', madeFor: 'Dành cho người yêu hương vị xứ Quảng',
  },
  en: {
    nav: ['HOME', 'OUR STORY', 'INTRODUCTION', 'SHOP'],
    heading: 'TÚY LOAN', slogan: 'Keeping the Túy Loan fire alive – Preserving the spirit of Quảng',
    intro: 'More than 500 years ago, as our ancestors settled the land and the ancient village of Túy Loan took shape beside its river, rice-paper making became part of everyday life in Quảng. From village markets to Lunar New Year feasts in Đà Nẵng, this humble food has endured through generations and become part of the heritage of Hòa Vang.',
    story: 'OUR STORY', storyLabel: 'Keeper of the fire', storyText: 'Through a small doorway, morning light meets the rising steam of a familiar kitchen. In this simple setting, an artisan begins another day beside a bubbling rice-paper stove. Her quiet dedication keeps the heart of the village warm.',
    videoUnavailable: 'Introduction video coming soon', product: 'TÚY LOAN RICE PAPER BOX (5 PIECES)', quantity: 'Quantity', buy: 'BUY NOW', orderPending: 'Ordering details are being updated.', footer: 'The craft of Túy Loan rice paper lives on through skilled hands and the warmth of the village hearth.', backTop: 'BACK TO TOP', explore: 'EXPLORE', productInfo: 'PRODUCT', visit: 'OUR ROOTS', location: 'Túy Loan ancient village, Hòa Vang, Đà Nẵng', heritage: 'Over 500 years of rice-paper making', madeFor: 'For those who cherish the flavours of Quảng',
  },
} as const;
type Page = 'home' | 'story' | 'introduction' | 'shop';

function HomeApp() {
  const [language, setLanguage] = useState<'vi' | 'en'>('vi');
  const [page, setPage] = useState<Page>('home');
  const [storyIndex, setStoryIndex] = useState(0);
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
    const syncHashRoute = () => {
      if (window.location.hash === '#shop') setPage('shop');
      else if (!window.location.hash) setPage('home');
    };
    syncHashRoute();
    window.addEventListener('hashchange', syncHashRoute);
    return () => window.removeEventListener('hashchange', syncHashRoute);
  }, []);
  const t = copy[language];
  const pages: Page[] = ['home', 'story', 'introduction', 'shop'];
  const navigate = (next: Page) => { setPage(next); setMenuOpen(false); setShowOrderNotice(false); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  return <div className={`site-shell site-shell--${page}`}>
    <header className={`site-header ${isScrolled || menuOpen ? 'site-header--solid' : ''}`}>
      <button className="site-brand" onClick={() => navigate('home')} aria-label="LOICHOI home"><span className="loichoi-mark" role="img" aria-label="LOICHOI — EST 2026" /></button>
    <nav className={`site-nav ${menuOpen ? 'site-nav--open' : ''}`} aria-label="Main navigation">
        {pages.map((item, index) => <button key={item} className={page === item ? 'is-active' : ''} onClick={() => navigate(item)}>{t.nav[index]}</button>)}
        <button onClick={() => { window.location.href = '/tra-cuu-don-hang'; }}>TRA CỨU ĐƠN HÀNG</button>
        <button onClick={() => { window.location.href = '/test-thanh-toan'; }} style={{ background: '#f59e0b', color: '#18181b', fontWeight: 800, padding: '4px 10px', borderRadius: '6px' }}>TEST THANH TOÁN (2K)</button>
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
      {page === 'home' && <section className="new-home" aria-labelledby="home-title">
        <img src={homePhoto} alt={language === 'vi' ? 'Nghệ nhân bên bếp bánh tráng Túy Loan' : 'Artisan at a Túy Loan rice-paper stove'} />
        <div className="new-home__shade" />
        <div className="new-home__content"><h1 id="home-title">{t.heading}</h1><p className="new-home__slogan">{t.slogan}</p><p className="new-home__intro">{t.intro}</p><button onClick={() => navigate('story')}>{t.story} <Flame size={24} fill="currentColor" /></button></div>
      </section>}
      {page === 'story' && <section className="design-stage story-stage" aria-label={t.story}>
        <button className="story-arrow" onClick={() => setStoryIndex(storyIndex === 0 ? 1 : 0)} aria-label="Previous story slide"><ChevronLeft /></button>
        <div className="story-frame">
          <AnimatePresence mode="wait" initial={false}><motion.div key={storyIndex} initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }} transition={{ duration: 0.3 }} className="story-slide">
          {storyIndex === 0 ? <div className="story-cover"><img src={storyCover} alt="Túy Loan photo story cover" />{language === 'en' && <div className="story-cover__translation"><span>PHOTO STORY</span><strong>{t.slogan}</strong></div>}</div> : <div className="story-fire"><img src={storyFire} alt="Artisan working beside the fire" />{language === 'en' && <div className="story-fire__translation"><strong>{t.storyLabel}</strong><p>{t.storyText}</p></div>}</div>}
          </motion.div></AnimatePresence>
        </div>
        <button className="story-arrow" onClick={() => setStoryIndex(storyIndex === 0 ? 1 : 0)} aria-label="Next story slide"><ChevronRight /></button>
        <div className="story-dots" aria-label="Slide position">{[0,1].map(i => <button key={i} className={storyIndex === i ? 'is-active' : ''} onClick={() => setStoryIndex(i)} aria-label={`Slide ${i+1}`} />)}</div>
      </section>}
      {page === 'introduction' && <section className="design-stage video-stage" aria-label={t.nav[2]}><div className="video-placeholder"><div className="play-glyph" aria-hidden="true" /><p>{t.videoUnavailable}</p></div></section>}
      {page === 'shop' && <section id="shop" className="design-stage shop-stage" aria-labelledby="product-title"><div className="shop-product">
        <img src={productBox} alt={t.product} />
        <h1 id="product-title">{t.product}</h1>
        <div className="shop-product__details"><strong>120.000đ</strong><div className="quantity-control"><span>{t.quantity}</span><button onClick={() => setQuantity(Math.max(1, quantity - 1))} aria-label="Decrease quantity">−</button><output>{quantity}</output><button onClick={() => setQuantity(quantity + 1)} aria-label="Increase quantity">+</button></div></div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '10px' }}>
          <button className="buy-button" onClick={() => { window.location.href = `/checkout?quantity=${quantity}`; }}>{t.buy}</button>
          <button className="buy-button" onClick={() => { window.location.href = '/test-thanh-toan'; }} style={{ background: '#f59e0b', color: '#18181b' }}>TEST THANH TOÁN (2.000đ)</button>
        </div>
        <AnimatePresence>{showOrderNotice && <motion.p className="order-notice" role="status" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>{t.orderPending}</motion.p>}</AnimatePresence>
      </div></section>}
      </motion.div>
    </AnimatePresence></main>
    <motion.footer className="new-footer" initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.55 }}>
      <div className="new-footer__main">
        <div className="new-footer__brand">
          <span className="new-footer__logo"><span className="loichoi-mark" role="img" aria-label="LOICHOI — EST 2026" /></span>
          <strong>{t.slogan}</strong>
          <p>{t.footer}</p>
          <span className="new-footer__heritage"><Flame size={16} />{t.heritage}</span>
        </div>
        <div className="new-footer__column"><h2>{t.explore}</h2><nav aria-label={t.explore}>{pages.map((item, index) => <button key={item} onClick={() => navigate(item)}>{t.nav[index]}</button>)}<button onClick={() => { window.location.href = '/tra-cuu-don-hang'; }}>Tra cứu đơn hàng</button><button onClick={() => { window.location.href = '/test-thanh-toan'; }} style={{ color: '#fbbf24' }}>🧪 Test thanh toán (2k)</button></nav></div>
        <div className="new-footer__column"><h2>{t.productInfo}</h2><button className="new-footer__product" onClick={() => navigate('shop')}>{t.product}</button><p>120.000đ · {language === 'vi' ? '5 cái' : '5 pieces'}</p><button className="new-footer__top" onClick={() => navigate('home')}>{t.backTop} ↑</button></div>
        <div className="new-footer__column"><h2>{t.visit}</h2><p className="new-footer__location"><MapPin size={17} />{t.location}</p></div>
      </div>
      <div className="new-footer__bottom"><span>© {new Date().getFullYear()} LOICHOI · TÚY LOAN</span><span><Heart size={14} fill="currentColor" /> {t.madeFor}</span></div>
    </motion.footer>
  </div>;
}

export function App() {
  const path = window.location.pathname;
  if (path === '/test-checkout' || path === '/test-thanh-toan') return <TestCheckoutPage />;
  if (path === '/checkout') return <CheckoutPage />;
  if (path === '/tra-cuu-don-hang' || path === '/lookup-orders') return <OrderLookupPage />;
  return <HomeApp />;
}

export default App;
