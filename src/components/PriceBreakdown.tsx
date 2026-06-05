import { useCurrency } from "@/contexts/CurrencyContext";
import { ChevronDown, ChevronUp } from "@/components/Icons";
import { useState } from "react";

interface PriceBreakdownProps {
  basePrice?: number;
  diamondPrice?: number;
  diamondCarat?: number;
  diamondColor?: string;
  diamondClarity?: string;
  diamondCut?: string;
  goldPrice?: number;
  goldWeight?: number;
  metalType?: string;
  makingCharges?: number;
  certificationCharges?: number;
  customizationCharges?: number;
  total: number;
  gst?: number;
  grandTotal?: number;
  compact?: boolean;
  showBreakdown?: boolean;
}

export const PriceBreakdown = ({
  basePrice,
  diamondPrice,
  diamondCarat,
  diamondColor,
  diamondClarity,
  diamondCut,
  goldPrice,
  goldWeight,
  metalType,
  makingCharges,
  certificationCharges,
  customizationCharges,
  total,
  gst,
  grandTotal,
  compact = false,
  showBreakdown = false,
}: PriceBreakdownProps) => {
  const { formatPrice } = useCurrency();
  const [expanded, setExpanded] = useState(false);

  if (compact) {
    return (
      <div className="space-y-2 text-sm">
        {diamondPrice && (
          <div className="flex justify-between items-center">
            <span className="text-foreground/70">Diamond ({diamondCarat}ct {diamondColor} {diamondClarity})</span>
            <span className="font-semibold text-accent">{formatPrice(diamondPrice)}</span>
          </div>
        )}
        {goldPrice && (
          <div className="flex justify-between items-center">
            <span className="text-foreground/70">
              {metalType || "Gold"} {goldWeight && `(${goldWeight}g)`}
            </span>
            <span className="font-semibold text-accent">{formatPrice(goldPrice)}</span>
          </div>
        )}
        {makingCharges && makingCharges > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-foreground/70">Making Charges</span>
            <span className="font-semibold text-accent">{formatPrice(makingCharges)}</span>
          </div>
        )}
        {customizationCharges && customizationCharges > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-foreground/70">Customization</span>
            <span className="font-semibold text-accent">{formatPrice(customizationCharges)}</span>
          </div>
        )}
        {certificationCharges && certificationCharges > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-foreground/70">Certification</span>
            <span className="font-semibold text-emerald-600">Free</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      {/* Header/Summary */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 sm:px-6 py-4 flex items-center justify-between hover:bg-secondary/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="font-heading text-sm sm:text-base font-semibold">Price Breakdown</span>
          {!expanded && (
            <span className="text-sm sm:text-base font-semibold text-accent">{formatPrice(total)}</span>
          )}
        </div>
        {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </button>

      {/* Expanded Details */}
      {expanded && (
        <div className="border-t border-border px-4 sm:px-6 py-4 bg-secondary/20 space-y-3 text-sm">
          {/* Diamond Charges */}
          {diamondPrice && diamondPrice > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold text-foreground/90 text-xs uppercase tracking-wider">
                Diamond Charges
              </h4>
              <div className="ml-3 space-y-1.5 pb-3 border-b border-border/30">
                <div className="flex justify-between">
                  <span className="text-foreground/70">
                    Diamond ({diamondCarat}ct) - {diamondColor} {diamondClarity} {diamondCut}
                  </span>
                  <span className="font-semibold">{formatPrice(diamondPrice)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Gold/Metal Charges */}
          {(goldPrice || goldWeight) && (
            <div className="space-y-2">
              <h4 className="font-semibold text-foreground/90 text-xs uppercase tracking-wider">
                Gold & Metal Charges
              </h4>
              <div className="ml-3 space-y-1.5 pb-3 border-b border-border/30">
                {goldWeight && (
                  <div className="flex justify-between">
                    <span className="text-foreground/70">{metalType || "Gold"} Weight</span>
                    <span className="font-semibold">{goldWeight}g</span>
                  </div>
                )}
                {goldPrice && goldPrice > 0 && (
                  <div className="flex justify-between">
                    <span className="text-foreground/70">Metal Cost</span>
                    <span className="font-semibold text-accent">{formatPrice(goldPrice)}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Making & Additional Charges */}
          {(makingCharges || customizationCharges || certificationCharges) && (
            <div className="space-y-2">
              <h4 className="font-semibold text-foreground/90 text-xs uppercase tracking-wider">
                Additional Charges
              </h4>
              <div className="ml-3 space-y-1.5 pb-3 border-b border-border/30">
                {makingCharges && makingCharges > 0 && (
                  <div className="flex justify-between">
                    <span className="text-foreground/70">Making Charges</span>
                    <span className="font-semibold text-accent">{formatPrice(makingCharges)}</span>
                  </div>
                )}
                {customizationCharges && customizationCharges > 0 && (
                  <div className="flex justify-between">
                    <span className="text-foreground/70">Customization</span>
                    <span className="font-semibold text-accent">{formatPrice(customizationCharges)}</span>
                  </div>
                )}
                {certificationCharges !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-foreground/70">Certification & Insurance</span>
                    <span className="font-semibold text-emerald-600">Free</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Total & GST */}
          <div className="space-y-2 pt-2">
            <div className="flex justify-between font-semibold">
              <span>Subtotal</span>
              <span className="text-accent">{formatPrice(total)}</span>
            </div>
            {gst !== undefined && (
              <>
                <div className="flex justify-between text-foreground/70">
                  <span>GST (3%)</span>
                  <span>{formatPrice(gst)}</span>
                </div>
                {grandTotal !== undefined && (
                  <div className="flex justify-between font-heading font-semibold text-base border-t border-border/30 pt-2 text-foreground">
                    <span>Total Amount</span>
                    <span className="text-accent">{formatPrice(grandTotal)}</span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
