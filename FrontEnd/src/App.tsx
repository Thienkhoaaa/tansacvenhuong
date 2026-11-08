import { CartProvider } from './context/CartContext.js';
import { Navbar } from './components/layout/Navbar.js';
import { HeroSection } from './components/home/HeroSection.js';
import { ProductGrid } from './components/home/ProductGrid.js';
import { PhilosophySection } from './components/home/PhilosophySection.js';
import { Footer } from './components/layout/Footer.js';
import { CartDrawer } from './components/cart/CartDrawer.js';
import { ProductDetailModal } from './components/product/ProductDetailModal.js';
import { CheckoutModal } from './components/checkout/CheckoutModal.js';

export function App() {
  return (
    <CartProvider>
      <div className="min-h-screen bg-[#0c0c0e] text-[#EDEDED] flex flex-col selection:bg-[#D4AF37]/30 selection:text-white">
        {/* Navigation Bar */}
        <Navbar />

        {/* Main Content Area */}
        <main className="flex-1">
          <HeroSection />
          <ProductGrid />
          <PhilosophySection />
        </main>

        {/* Global Footer */}
        <Footer />

        {/* Slide-over & Modals */}
        <CartDrawer />
        <ProductDetailModal />
        <CheckoutModal />
      </div>
    </CartProvider>
  );
}

export default App;
