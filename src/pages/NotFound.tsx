import { Link } from "react-router-dom";
import { ArrowLeft, Diamond } from "@/components/Icons";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHead title="404 - Page Not Found | DiamondJewels" description="The page you are looking for cannot be found." />
      <Header />
      
      <main className="flex-1 flex items-center justify-center py-20 px-4 sm:px-6">
        <div className="text-center max-w-md mx-auto">
          <div className="flex justify-center mb-6 text-accent">
            <Diamond className="w-16 h-16 opacity-30" />
          </div>
          <h1 className="font-heading text-6xl font-light mb-4">404</h1>
          <h2 className="font-heading text-xl sm:text-2xl font-light mb-6">Page Not Found</h2>
          <div className="w-16 h-px bg-accent mx-auto mb-6" />
          <p className="text-muted-foreground text-sm mb-10 leading-relaxed">
            We're sorry, but the page you are looking for does not exist. It might have been moved or deleted.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/" className="btn-gold justify-center">
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>
            <Link to="/engagement-rings" className="btn-ghost justify-center">
              View Collection
            </Link>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NotFound;
