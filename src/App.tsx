import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { ActivityLogProvider } from "@/contexts/ActivityLogContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import AuthModal from "@/components/AuthModal";
import CookieBanner from "@/components/CookieBanner";
import SessionManager from "@/components/SessionManager";
import ScrollRevealScope from "@/components/ScrollRevealScope";
import Index from "./pages/Index.tsx";
import ScrollToTop from "./components/ScrollToTop.tsx";
import ProductSkeleton from "@/components/ProductSkeleton.tsx";

// Lazy load routes for code splitting and better performance
const ProductDetail = lazy(() => import("./pages/ProductDetail.tsx"));
const CartPage = lazy(() => import("./pages/CartPage.tsx"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage.tsx"));
const PaymentPage = lazy(() => import("./pages/PaymentPage.tsx"));
const OrderConfirmation = lazy(() => import("./pages/OrderConfirmation.tsx"));
const MyOrders = lazy(() => import("./pages/MyOrders.tsx"));
const EngagementRings = lazy(() => import("./pages/EngagementRings.tsx"));
const NecklacesPage = lazy(() => import("./pages/NecklacesPage.tsx"));
const EarringsPage = lazy(() => import("./pages/EarringsPage.tsx"));
const DiamondsPage = lazy(() => import("./pages/DiamondsPage.tsx"));
const NaturalDiamondsPage = lazy(() => import("./pages/NaturalDiamondsPage.tsx"));
const LabGrownDiamondsPage = lazy(() => import("./pages/LabGrownDiamondsPage.tsx"));
const LooseDiamondsPage = lazy(() => import("./pages/LooseDiamondsPage.tsx"));
const BespokePage = lazy(() => import("./pages/BespokePage.tsx"));
const GemstonesPage = lazy(() => import("./pages/GemstonesPage.tsx"));
const JewelleryPage = lazy(() => import("./pages/JewelleryPage.tsx"));
const WeddingRingsPage = lazy(() => import("./pages/WeddingRingsPage.tsx"));
const EducationPage = lazy(() => import("./pages/EducationPage.tsx"));
const WishlistPage = lazy(() => import("./pages/WishlistPage.tsx"));
const PrivacyPolicyPage = lazy(() => import("./pages/PrivacyPolicyPage.tsx"));
const TermsOfServicePage = lazy(() => import("./pages/TermsOfServicePage.tsx"));
const SitemapPage = lazy(() => import("./pages/SitemapPage.tsx"));
const CustomerServicePage = lazy(() => import("./pages/CustomerServicePage.tsx"));
const BookAppointmentPage = lazy(() => import("./pages/BookAppointmentPage.tsx"));
const AdminPanel = lazy(() => import("./pages/AdminPanel.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));

// New category and subcategory pages
const BraceletsPage = lazy(() => import("./pages/BraceletsPage.tsx"));
const MensBandsPage = lazy(() => import("./pages/MensBandsPage.tsx"));
const WomensBandsPage = lazy(() => import("./pages/WomensBandsPage.tsx"));
const MatchingSetsPage = lazy(() => import("./pages/MatchingSetsPage.tsx"));
const SolitaireRingsPage = lazy(() => import("./pages/SolitaireRingsPage.tsx"));
const HaloRingsPage = lazy(() => import("./pages/HaloRingsPage.tsx"));
const VintageRingsPage = lazy(() => import("./pages/VintageRingsPage.tsx"));
const TrilogyRingsPage = lazy(() => import("./pages/TrilogyRingsPage.tsx"));
const DiamondBandPage = lazy(() => import("./pages/DiamondBandPage.tsx"));
const AllEngagementRingsPage = lazy(() => import("./pages/AllEngagementRingsPage.tsx"));
const ProfilePage = lazy(() => import("./pages/ProfilePage.tsx"));
const EternityRingsPage = lazy(() => import("./pages/EternityRingsPage.tsx"));
const ProductsPage = lazy(() => import("./pages/ProductsPage.tsx"));
const FAQPage = lazy(() => import("./pages/FAQPage.tsx"));

const LoadingFallback = () => <ProductSkeleton />;

const App = () => (
  <TooltipProvider>
    <LanguageProvider>
      <CurrencyProvider>
        <AuthProvider>
          <ActivityLogProvider>
            <CartProvider>
              <Toaster />
              <Sonner />
              <SessionManager />
              <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                <ScrollToTop />
                <AuthModal />
                <CookieBanner />
                <ScrollRevealScope className="min-h-screen">
                  <Suspense fallback={<LoadingFallback />}>
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/engagement-rings" element={<EngagementRings />} />
                      <Route path="/all-engagement-rings" element={<AllEngagementRingsPage />} />
                      <Route path="/solitaire-rings" element={<SolitaireRingsPage />} />
                      <Route path="/halo-rings" element={<HaloRingsPage />} />
                      <Route path="/vintage-rings" element={<VintageRingsPage />} />
                      <Route path="/trilogy-rings" element={<TrilogyRingsPage />} />
                      <Route path="/diamond-band" element={<DiamondBandPage />} />
                      <Route path="/necklaces" element={<NecklacesPage />} />
                      <Route path="/earrings" element={<EarringsPage />} />
                      <Route path="/bracelets" element={<BraceletsPage />} />
                      <Route path="/diamonds" element={<DiamondsPage />} />
                      <Route path="/natural-diamonds" element={<NaturalDiamondsPage />} />
                      <Route path="/lab-grown-diamonds" element={<LabGrownDiamondsPage />} />
                      <Route path="/loose-diamonds" element={<LooseDiamondsPage />} />
                      <Route path="/gemstones" element={<GemstonesPage />} />
                      <Route path="/jewellery" element={<JewelleryPage />} />
                      <Route path="/wedding-rings" element={<WeddingRingsPage />} />
                      <Route path="/mens-bands" element={<MensBandsPage />} />
                      <Route path="/womens-bands" element={<WomensBandsPage />} />
                      <Route path="/matching-sets" element={<MatchingSetsPage />} />
                      <Route path="/eternity-rings" element={<EternityRingsPage />} />
                      <Route path="/products" element={<ProductsPage />} />
                      <Route path="/bespoke" element={<BespokePage />} />
                      <Route path="/education" element={<EducationPage />} />
                      <Route path="/wishlist" element={<WishlistPage />} />
                      <Route path="/profile" element={<ProfilePage />} />
                      <Route path="/product/:id" element={<ProductDetail />} />
                      <Route path="/cart" element={<CartPage />} />
                      <Route path="/checkout" element={<CheckoutPage />} />
                      <Route path="/payment" element={<PaymentPage />} />
                      <Route path="/order-confirmation" element={<OrderConfirmation />} />
                      <Route path="/my-orders" element={<MyOrders />} />
                      <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                      <Route path="/terms-of-service" element={<TermsOfServicePage />} />
                      <Route path="/sitemap" element={<SitemapPage />} />
                      <Route path="/customer-service" element={<CustomerServicePage />} />
                      <Route path="/faq" element={<FAQPage />} />
                      <Route path="/book-appointment" element={<BookAppointmentPage />} />
                      <Route path="/admin" element={<AdminPanel />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Suspense>
                </ScrollRevealScope>
              </BrowserRouter>
            </CartProvider>
          </ActivityLogProvider>
        </AuthProvider>
      </CurrencyProvider>
    </LanguageProvider>
  </TooltipProvider>
);

export default App;
