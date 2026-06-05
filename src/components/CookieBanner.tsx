import { useState, useEffect } from "react";
import { X, Cookie, Shield, Settings } from "@/components/Icons";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

interface ConsentCategories {
  essential: boolean;   // Always true, cannot be disabled
  analytics: boolean;
  marketing: boolean;
}

const CookieBanner = () => {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [consent, setConsent] = useState<ConsentCategories>({
    essential: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const saved = localStorage.getItem("dj_cookie_consent");
    if (!saved) {
      const timer = setTimeout(() => setVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const saveConsent = (categories: ConsentCategories) => {
    const record = {
      ...categories,
      essential: true, // Always true
      date: new Date().toISOString(),
      version: "2.0.0",
    };
    localStorage.setItem("dj_cookie_consent", JSON.stringify(record));
    setVisible(false);
  };

  const acceptAll = () => {
    saveConsent({ essential: true, analytics: true, marketing: true });
  };

  const acceptSelected = () => {
    saveConsent(consent);
  };

  const declineOptional = () => {
    saveConsent({ essential: true, analytics: false, marketing: false });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          style={{ willChange: "transform" }}
          className="fixed bottom-0 left-0 right-0 z-[1000] bg-background/95 backdrop-blur-xl border-t border-border shadow-[0_-10px_40px_rgba(0,0,0,0.15)] overflow-hidden"
        >
          <div className="max-w-5xl mx-auto px-4 sm:px-8 py-6">
            {/* Main Banner */}
            <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-12">
              <div className="hidden sm:flex w-12 h-12 rounded-full bg-accent/10 items-center justify-center shrink-0">
                <Shield className="w-6 h-6 text-accent" />
              </div>

              <div className="flex-1 text-center lg:text-left">
                <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-accent mb-1.5">
                  Privacy & Cookie Consent
                </h4>
                <p className="text-[11px] sm:text-xs text-muted-foreground leading-relaxed">
                  We use cookies to provide essential services, protect your sessions, and improve your experience. 
                  You can choose which optional cookies to allow. For details, see our{" "}
                  <Link to="/privacy-policy" className="text-accent hover:underline font-bold">Privacy Policy</Link> and{" "}
                  <Link to="/terms-of-service" className="text-accent hover:underline font-bold">Terms</Link>.
                </p>
              </div>

              <div className="flex items-center gap-3 w-full lg:w-auto">
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="flex items-center gap-1.5 flex-1 lg:flex-none px-5 py-2.5 text-[10px] font-bold tracking-widest uppercase rounded-full border border-border hover:bg-secondary transition-all"
                >
                  <Settings className="w-3.5 h-3.5" />
                  Customize
                </button>
                <button
                  onClick={declineOptional}
                  className="flex-1 lg:flex-none px-6 py-2.5 text-[10px] font-bold tracking-widest uppercase rounded-full border border-border hover:bg-secondary transition-all"
                >
                  Essential Only
                </button>
                <button
                  onClick={acceptAll}
                  className="flex-1 lg:flex-none px-8 py-2.5 text-[10px] font-bold tracking-widest uppercase rounded-full bg-accent text-accent-foreground shadow-lg shadow-accent/20 hover:scale-105 active:scale-95 transition-all"
                >
                  Accept All
                </button>
              </div>
            </div>

            {/* Granular Consent Panel (GDPR Art. 7 — Specific Consent) */}
            <AnimatePresence>
              {showDetails && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="mt-6 pt-6 border-t border-border/40 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Essential — Always On */}
                    <div className="p-4 rounded-2xl border border-accent/20 bg-accent/5">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-accent">Essential</span>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-accent/60 bg-accent/10 px-2 py-0.5 rounded-full">Always On</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground leading-relaxed">
                        Required for authentication, shopping cart, session management, and security. Cannot be disabled.
                      </p>
                    </div>

                    {/* Analytics */}
                    <label className="p-4 rounded-2xl border border-border/40 bg-card/5 hover:border-accent/30 transition-colors cursor-pointer">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider">Analytics</span>
                        <div
                          onClick={(e) => { e.preventDefault(); setConsent(c => ({ ...c, analytics: !c.analytics })); }}
                          className={`w-10 h-5 rounded-full transition-all duration-300 relative ${consent.analytics ? 'bg-accent' : 'bg-border'}`}
                        >
                          <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all duration-300 shadow-sm ${consent.analytics ? 'left-5' : 'left-0.5'}`} />
                        </div>
                      </div>
                      <p className="text-[10px] text-muted-foreground leading-relaxed">
                        Help us understand how you use our site to improve the shopping experience. No personal data shared.
                      </p>
                    </label>

                    {/* Marketing */}
                    <label className="p-4 rounded-2xl border border-border/40 bg-card/5 hover:border-accent/30 transition-colors cursor-pointer">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider">Marketing</span>
                        <div
                          onClick={(e) => { e.preventDefault(); setConsent(c => ({ ...c, marketing: !c.marketing })); }}
                          className={`w-10 h-5 rounded-full transition-all duration-300 relative ${consent.marketing ? 'bg-accent' : 'bg-border'}`}
                        >
                          <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all duration-300 shadow-sm ${consent.marketing ? 'left-5' : 'left-0.5'}`} />
                        </div>
                      </div>
                      <p className="text-[10px] text-muted-foreground leading-relaxed">
                        Personalized recommendations and promotional offers based on your browsing preferences.
                      </p>
                    </label>
                  </div>

                  <div className="flex justify-end mt-4">
                    <button
                      onClick={acceptSelected}
                      className="px-8 py-2.5 text-[10px] font-bold tracking-widest uppercase rounded-full bg-accent text-accent-foreground shadow-lg shadow-accent/20 hover:scale-105 active:scale-95 transition-all"
                    >
                      Save Preferences
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={declineOptional}
            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground p-1 transition-colors"
            aria-label="Dismiss cookie banner"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieBanner;
