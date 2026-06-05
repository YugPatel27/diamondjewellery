import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft } from "@/components/Icons";
import { RingSizeSelector, RING_SIZES } from "./RingSizeSelector";
import { EngraverDialog } from "./EngraverDialog";
import { DiamondSelector } from "./DiamondSelector";
import { motion } from "framer-motion";
import { Sparkles, Ruler } from "@/components/Icons";

interface ProductCustomizerProps {
  product: any;
  onCustomizationComplete: (customization: any) => void;
  isRing?: boolean;
  isDiamond?: boolean;
  category?: string;
}

export const ProductCustomizer = ({
  product,
  onCustomizationComplete,
  isRing = true,
  isDiamond = false,
  category,
}: ProductCustomizerProps) => {
  const [step, setStep] = useState(1);
  const [ringSize, setRingSize] = useState("");
  const [engravingData, setEngravingData] = useState({
    text: "",
    font: "",
    symbols: [],
  });
  const [selectedDiamond, setSelectedDiamond] = useState<any>(null);
  const [categoryOption, setCategoryOption] = useState("");
  const [showRingSizeSelector, setShowRingSizeSelector] = useState(false);
  const [showEngraver, setShowEngraver] = useState(false);
  const [showDiamondSelector, setShowDiamondSelector] = useState(false);

  const ringSizeInfo = RING_SIZES.find(s => s.size === ringSize);

  const totalSteps = isDiamond ? 3 : 2;
  const productCategory = category || product?.category || "Rings";

  const categoryOptionConfig = (() => {
    if (productCategory === "Earrings") {
      return {
        label: "Earring Backing",
        helper: "Select backing style for comfort and secure fit.",
        options: ["Push Back", "Screw Back", "Lever Back"],
      };
    }
    if (productCategory === "Necklaces") {
      return {
        label: "Necklace Length",
        helper: "Choose chain length based on your preferred neckline.",
        options: ['16"', '18"', '20"', '22"'],
      };
    }
    return {
      label: "Product Finish",
      helper: "Pick your preferred final style setup.",
      options: ["Classic", "Modern", "Minimal"],
    };
  })();

  const handleRingSizeSelect = (size: string) => setRingSize(size);
  const handleEngravingSave = (data: any) => setEngravingData(data);
  const handleDiamondSelect = (diamond: any) => setSelectedDiamond(diamond);

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
      return;
    }

    onCustomizationComplete({
      ringSize: ringSize || undefined,
      categoryOption: categoryOption || undefined,
      engravingText: engravingData.text || undefined,
      engravingFont: engravingData.font || undefined,
      engravingSymbols: engravingData.symbols || undefined,
      selectedDiamond: selectedDiamond || undefined,
    });
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const isStepComplete = () => {
    switch (step) {
      case 1:
        return isRing ? ringSize !== "" : categoryOption !== "";
      case 2:
        return engravingData.text !== "" || isDiamond;
      case 3:
        return selectedDiamond !== null;
      default:
        return false;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center">
        <div className="flex items-center w-full max-w-xs justify-between relative px-2">
          {/* Connector Line */}
          <div className="absolute top-1/2 left-0 w-full h-px bg-border/40 -translate-y-1/2 z-0" />
          
          {Array.from({ length: totalSteps }).map((_, index) => {
            const currentStep = index + 1;
            const isActive = currentStep <= step;
            const isCurrent = currentStep === step;

            return (
              <div key={index} className="relative z-10 flex flex-col items-center gap-2">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full font-heading text-sm transition-all duration-500 border-2 ${
                    isCurrent 
                      ? "bg-accent border-accent text-accent-foreground shadow-[0_0_20px_rgba(212,155,23,0.4)] scale-110" 
                      : isActive 
                        ? "bg-accent/20 border-accent text-accent" 
                        : "bg-background border-border/40 text-muted-foreground"
                  }`}
                >
                  {currentStep}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="overflow-hidden rounded-[2rem] border border-border/40 bg-card/80 shadow-[0_18px_60px_rgba(0,0,0,0.08)]">
        {step === 1 && (
          <div className="p-6 sm:p-8">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="font-heading text-2xl font-light sm:text-3xl">
                {isRing ? "Select Your Ring Size" : categoryOptionConfig.label}
              </h2>
              <p className="mt-3 text-foreground/65">
                {isRing
                  ? "Choose the perfect size for your ring. Our sizing guide helps you find the right fit."
                  : categoryOptionConfig.helper}
              </p>
            </div>

            {isRing ? (
              <div className="mx-auto mt-8 max-w-xl">
                {ringSizeInfo ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="rounded-[2rem] border border-accent/20 bg-accent/5 p-6 sm:p-8 text-center relative overflow-hidden group"
                  >
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <Ruler className="w-20 h-20 rotate-12" />
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent mb-4">Selected Ring Size</p>
                    <div className="flex flex-col items-center gap-2 mb-6">
                      <span className="font-heading text-5xl font-light text-foreground">{ringSize}</span>
                      <div className="flex gap-4 text-xs text-foreground/60 font-medium">
                        <span>Dia: {ringSizeInfo.diameter}</span>
                        <span className="w-1 h-1 rounded-full bg-accent/30 mt-1.5" />
                        <span>Circ: {ringSizeInfo.circumference}</span>
                      </div>
                    </div>
                    <Button
                      onClick={() => setShowRingSizeSelector(true)}
                      variant="outline"
                      className="rounded-full border-accent/30 text-accent hover:bg-accent/10 px-8"
                    >
                      Change Size
                    </Button>
                  </motion.div>
                ) : (
                  <div className="rounded-[2rem] border border-dashed border-border/60 bg-secondary/10 p-12 text-center">
                    <p className="text-sm text-foreground/60 mb-6 italic">Precision fit for your forever piece.</p>
                    <Button
                      onClick={() => setShowRingSizeSelector(true)}
                      className="rounded-full bg-accent hover:bg-accent/90 text-accent-foreground px-10 py-6 text-sm font-bold tracking-widest uppercase shadow-xl shadow-accent/20"
                    >
                      Select Ring Size
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="mx-auto mt-8 grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3">
                {categoryOptionConfig.options.map((option) => (
                  <button
                    key={option}
                    onClick={() => setCategoryOption(option)}
                    className={`rounded-2xl border px-4 py-4 text-left text-sm transition-all ${
                      categoryOption === option
                        ? "border-accent bg-accent/10 text-accent"
                        : "border-border/40 bg-background hover:border-accent/40"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="p-6 text-center sm:p-8">
            <h2 className="font-heading text-2xl font-light">
              Step {step}: {isDiamond ? "Add Diamond" : "Engrave Your Ring (Optional)"}
            </h2>
            <p className="mt-3 text-foreground/65">
              {isDiamond
                ? "Select a diamond to complement your ring setting."
                : "Add a personal touch with a custom engraving inside your ring."}
            </p>
            <div className="mx-auto mt-6 max-w-2xl">
              {selectedDiamond && isDiamond ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-[2rem] border border-accent/20 bg-card p-5 sm:p-6 mb-6 text-left relative overflow-hidden"
                >
                  <div className="flex gap-5 items-center">
                    <div className="w-20 h-20 rounded-2xl bg-secondary/30 flex items-center justify-center shrink-0 border border-border/40">
                      <img src={selectedDiamond.image} alt="Diamond" className="w-14 h-14 object-contain" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <p className="font-heading text-xl font-medium">{selectedDiamond.carat} Ct {selectedDiamond.shape}</p>
                        <p className="text-sm font-bold text-accent">Rs {selectedDiamond.price.toLocaleString()}</p>
                      </div>
                      <div className="flex gap-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                        <span>Color: {selectedDiamond.color}</span>
                        <span>•</span>
                        <span>Clarity: {selectedDiamond.clarity}</span>
                        <span>•</span>
                        <span>Cut: {selectedDiamond.cut}</span>
                      </div>
                    </div>
                  </div>
                  <Button 
                    onClick={() => setShowDiamondSelector(true)}
                    variant="link" 
                    className="absolute top-4 right-4 h-auto p-0 text-[10px] font-bold uppercase tracking-widest text-accent/60 hover:text-accent"
                  >
                    Change
                  </Button>
                </motion.div>
              ) : null}

              {engravingData.text && !isDiamond && (
                <div className="mb-6 rounded-2xl border border-accent/20 bg-accent/5 p-5 text-left relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-4 opacity-5">
                      <Sparkles className="w-12 h-12" />
                    </div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-accent mb-2">Engraving Preview</p>
                  <div className="flex items-center gap-3">
                    <p className="text-xl font-heading font-medium italic text-foreground px-4 py-2 border-l-2 border-accent/30 bg-background/50 rounded-r-xl">
                      "{engravingData.text}"
                    </p>
                    {engravingData.symbols.length > 0 && (
                      <div className="flex gap-1.5">
                        {engravingData.symbols.map((s: string) => <span key={s} className="text-xl">{s}</span>)}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {!isDiamond ? (
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button onClick={() => setShowEngraver(true)} className="flex-1 rounded-full bg-accent py-7 text-accent-foreground font-bold tracking-widest uppercase text-[11px] shadow-lg shadow-accent/20">
                    {engravingData.text ? "Edit Engraving" : "Add Personal Engraving"}
                  </Button>
                  {!engravingData.text && (
                    <Button variant="outline" onClick={handleNext} className="flex-1 rounded-full py-7 font-bold tracking-widest uppercase text-[11px]">
                      Skip & Continue
                    </Button>
                  )}
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {!selectedDiamond && (
                     <Button
                      onClick={() => setShowDiamondSelector(true)}
                      className="w-full rounded-full bg-accent py-7 text-accent-foreground font-bold tracking-widest uppercase text-[11px] shadow-xl shadow-accent/20"
                    >
                      Select Your Diamond
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {step === 3 && isDiamond && (
          <div className="p-6 sm:p-10">
            <div className="text-center mb-8">
              <h2 className="font-heading text-3xl font-light">Final Review</h2>
              <p className="mt-2 text-foreground/60">Your masterpiece is almost complete. Please review the details.</p>
            </div>
            
            <div className="mx-auto max-w-2xl space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {/* Ring Detail */}
                 <div className="rounded-[1.5rem] bg-secondary/20 p-6 border border-border/40">
                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-accent mb-3">Ring Setting</p>
                  <p className="text-base font-semibold">{product.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">Size: {ringSize || "Standard"}</p>
                </div>
                
                {/* Diamond Detail */}
                <div className="rounded-[1.5rem] bg-accent/5 p-6 border border-accent/20">
                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-accent mb-3">Selected Diamond</p>
                  {selectedDiamond ? (
                    <>
                      <p className="text-base font-semibold">{selectedDiamond.carat}ct {selectedDiamond.shape}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">Code: {selectedDiamond.code}</p>
                    </>
                  ) : (
                    <p className="text-sm italic text-muted-foreground">Not selected</p>
                  )}
                </div>
              </div>

              {engravingData.text && (
                 <div className="rounded-[1.5rem] bg-background border border-border/40 p-6">
                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-accent mb-2">Internal Engraving</p>
                    <p className="text-xl font-heading italic">"{engravingData.text}"</p>
                 </div>
              )}
            </div>

            <div className="mt-10 pt-8 border-t border-border/40 text-center">
               <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground mb-1">Total Estimate</p>
               <p className="text-3xl font-heading text-accent font-medium">
                  Rs {(product.price + (selectedDiamond?.price || 0)).toLocaleString()}
               </p>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-4 sm:gap-6 pt-6">
        <Button 
          onClick={handleBack} 
          variant="ghost" 
          disabled={step === 1} 
          className="flex-1 rounded-full py-8 font-bold tracking-[0.25em] uppercase text-[10px] border border-border/60 hover:bg-secondary/40 disabled:opacity-20 transition-all"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Previous Step
        </Button>
        <Button
          onClick={handleNext}
          disabled={!isStepComplete()}
          className="flex-[1.5] rounded-full bg-accent py-8 text-accent-foreground font-bold tracking-[0.25em] uppercase text-[10px] shadow-2xl shadow-accent/20 group relative overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <span className="relative z-10 flex items-center justify-center gap-3">
            {step === totalSteps ? "Finalise Design" : "Proceed to Next"}
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1.5" />
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
        </Button>
      </div>

      {/* Complete Customization Summary Bar - Refined Premium Display */}
      { (ringSize || selectedDiamond || engravingData.text) && step < totalSteps && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-10 p-6 rounded-[2rem] bg-accent/5 border border-accent/20 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-6 overflow-hidden relative"
        >
          {/* Subtle Decorative Background */}
          <div className="absolute -right-4 -bottom-4 opacity-[0.03] pointer-events-none">
            <Sparkles className="w-32 h-32 text-accent" />
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-8 gap-y-4">
            {ringSize && (
              <div className="flex flex-col">
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-accent/60 mb-1">Size</span>
                <span className="text-sm font-heading font-medium text-foreground">{ringSize}</span>
              </div>
            )}
            {selectedDiamond && (
              <div className="flex flex-col">
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-accent/60 mb-1">Diamond</span>
                <span className="text-sm font-heading font-medium text-foreground">{selectedDiamond.carat}ct {selectedDiamond.shape}</span>
              </div>
            )}
             {engravingData.text && (
              <div className="flex flex-col">
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-accent/60 mb-1">Inscription</span>
                <span className="text-sm font-heading font-medium italic text-foreground truncate max-w-[120px]">"{engravingData.text}"</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 px-6 py-3 bg-white/80 dark:bg-card/40 border border-accent/10 rounded-2xl shadow-sm">
            <div className="text-right">
              <p className="text-[9px] font-bold tracking-[0.25em] uppercase text-muted-foreground mb-0.5">Estimated Total</p>
              <p className="text-lg font-heading font-semibold text-accent leading-none">
                Rs {(product.price + (selectedDiamond?.price || 0)).toLocaleString()}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {showRingSizeSelector && (
        <RingSizeSelector
          onSelect={handleRingSizeSelect}
          onClose={() => setShowRingSizeSelector(false)}
          selectedSize={ringSize}
        />
      )}
      {showEngraver && (
        <EngraverDialog
          onSave={handleEngravingSave}
          onClose={() => setShowEngraver(false)}
          initialData={engravingData}
        />
      )}
      {showDiamondSelector && (
        <DiamondSelector
          onSelect={handleDiamondSelect}
          onClose={() => setShowDiamondSelector(false)}
          selectedDiamond={selectedDiamond}
        />
      )}
    </div>
  );
};
