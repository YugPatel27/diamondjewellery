interface MetalGoldDetailsProps {
  metalType: string;
  purity?: string;
  weight?: number;
  composition?: string;
  makingChargesPerGram?: number;
  totalMakingCharges?: number;
  diamondType?: string;
  diamondCarat?: number;
}

export const MetalGoldDetails = ({
  metalType,
  purity,
  weight,
  composition,
  makingChargesPerGram,
  totalMakingCharges,
  diamondType,
  diamondCarat,
}: MetalGoldDetailsProps) => {
  return (
    <div className="space-y-6">
      {/* Metal Details Section */}
      <div className="border border-border rounded-lg p-4 sm:p-6 bg-card">
        <h3 className="font-heading text-lg font-semibold mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent" />
          Metal Details
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-foreground/60 text-xs uppercase tracking-wider mb-1">Metal Type</p>
            <p className="font-semibold text-base">{metalType}</p>
          </div>
          {purity && (
            <div>
              <p className="text-foreground/60 text-xs uppercase tracking-wider mb-1">Purity</p>
              <p className="font-semibold text-base">{purity}</p>
            </div>
          )}
          {weight && (
            <div>
              <p className="text-foreground/60 text-xs uppercase tracking-wider mb-1">Weight</p>
              <p className="font-semibold text-base">{weight}g</p>
            </div>
          )}
          {composition && (
            <div>
              <p className="text-foreground/60 text-xs uppercase tracking-wider mb-1">Composition</p>
              <p className="font-semibold text-base">{composition}</p>
            </div>
          )}
        </div>
      </div>

      {/* Diamond Details Section */}
      {diamondType && (
        <div className="border border-border rounded-lg p-4 sm:p-6 bg-card">
          <h3 className="font-heading text-lg font-semibold mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent" />
            Diamond Details
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-foreground/60 text-xs uppercase tracking-wider mb-1">Diamond Type</p>
              <p className="font-semibold text-base capitalize">{diamondType}</p>
            </div>
            {diamondCarat && (
              <div>
                <p className="text-foreground/60 text-xs uppercase tracking-wider mb-1">Carat Weight</p>
                <p className="font-semibold text-base">{diamondCarat}ct</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Making Charges Info */}
      {makingChargesPerGram && (
        <div className="border border-accent/20 bg-accent/5 rounded-lg p-4 sm:p-6">
          <h3 className="font-heading text-sm font-semibold mb-3 text-accent uppercase tracking-wider">
            Making Charges
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-foreground/70">Per Gram Charge</span>
              <span className="font-semibold">₹{makingChargesPerGram}</span>
            </div>
            {totalMakingCharges && (
              <div className="flex justify-between border-t border-accent/20 pt-2">
                <span className="font-semibold">Total Making Charges</span>
                <span className="font-semibold text-accent">₹{totalMakingCharges}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
