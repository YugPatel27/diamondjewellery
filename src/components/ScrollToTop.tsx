import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";
import { ArrowUp } from "@/components/Icons";

const routeNames: Record<string, string> = {
  "/engagement-rings": "Engagement Rings",
  "/necklaces": "Necklaces",
  "/earrings": "Earrings",
  "/diamonds": "Diamonds",
  "/natural-diamonds": "Natural Diamonds",
  "/lab-grown-diamonds": "Lab Grown Diamonds",
  "/loose-diamonds": "Loose Diamonds",
  "/bespoke": "Bespoke",
  "/education": "Education",
  "/wishlist": "Wishlist",
  "/cart": "Cart",
  "/checkout": "Checkout",
  "/book-appointment": "Book Appointment",
  "/customer-service": "Customer Service",
  "/privacy-policy": "Privacy Policy",
  "/terms-of-service": "Terms of Service",
  "/sitemap": "Sitemap",
  "/admin": "Admin Panel",
};

const ScrollToTop = () => {
  const { pathname } = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);

  // Show button when scrolled down
  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Smooth scroll to top with acceleration
  const scrollToTopWithAcceleration = () => {
    if (isScrolling) return;
    
    setIsScrolling(true);
    const startY = window.scrollY;
    const startTime = Date.now();
    const duration = 1500; // Duration of scroll in ms
    
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
    
    const scroll = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = easeOutCubic(progress);
      
      window.scrollTo(0, startY * (1 - easeProgress));
      
      if (progress < 1) {
        requestAnimationFrame(scroll);
      } else {
        window.scrollTo(0, 0);
        setIsScrolling(false);
        setIsVisible(false);
      }
    };
    
    requestAnimationFrame(scroll);
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
    const name = routeNames[pathname];
    if (name && pathname !== "/") {
      toast.info(`${name}`, { duration: 1500 });
    }
  }, [pathname]);

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTopWithAcceleration}
          className="fixed bottom-6 right-6 z-40 p-3 bg-accent text-accent-foreground rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 flex items-center justify-center"
          aria-label="Scroll to top"
          title="Back to top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </>
  );
};

export default ScrollToTop;
