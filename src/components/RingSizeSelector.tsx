import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { Check, Search, Ruler, X } from "@/components/Icons";

interface RingSizeSelectorProps {
  onSelect: (size: string) => void;
  onClose: () => void;
  selectedSize?: string;
}

export const RING_SIZES = [
  { size: "F 1/2", diameter: "14.4 mm", circumference: "45.3 mm" },
  { size: "G", diameter: "14.6 mm", circumference: "45.9 mm" },
  { size: "G 1/2", diameter: "14.8 mm", circumference: "46.5 mm" },
  { size: "H", diameter: "15.0 mm", circumference: "47.1 mm" },
  { size: "H 1/2", diameter: "15.2 mm", circumference: "47.8 mm" },
  { size: "I", diameter: "15.4 mm", circumference: "48.4 mm" },
  { size: "I 1/2", diameter: "15.6 mm", circumference: "49.0 mm" },
  { size: "J", diameter: "15.8 mm", circumference: "49.6 mm" },
  { size: "J 1/2", diameter: "16.0 mm", circumference: "50.3 mm" },
  { size: "K", diameter: "16.2 mm", circumference: "50.9 mm" },
  { size: "K 1/2", diameter: "16.4 mm", circumference: "51.5 mm" },
  { size: "L", diameter: "16.6 mm", circumference: "52.1 mm" },
  { size: "L 1/2", diameter: "16.8 mm", circumference: "52.8 mm" },
  { size: "M", diameter: "17.0 mm", circumference: "53.4 mm" },
  { size: "M 1/2", diameter: "17.2 mm", circumference: "54.0 mm" },
  { size: "N", diameter: "17.4 mm", circumference: "54.6 mm" },
  { size: "N 1/2", diameter: "17.6 mm", circumference: "55.3 mm" },
  { size: "O", diameter: "17.8 mm", circumference: "55.9 mm" },
  { size: "O 1/2", diameter: "18.0 mm", circumference: "56.5 mm" },
  { size: "P", diameter: "18.2 mm", circumference: "57.2 mm" },
  { size: "P 1/2", diameter: "18.4 mm", circumference: "57.8 mm" },
  { size: "Q", diameter: "18.6 mm", circumference: "58.4 mm" },
  { size: "Q 1/2", diameter: "18.8 mm", circumference: "59.0 mm" },
  { size: "R", diameter: "19.0 mm", circumference: "59.7 mm" },
  { size: "R 1/2", diameter: "19.2 mm", circumference: "60.3 mm" },
  { size: "S", diameter: "19.4 mm", circumference: "60.9 mm" },
  { size: "S 1/2", diameter: "19.6 mm", circumference: "61.5 mm" },
  { size: "T", diameter: "19.8 mm", circumference: "62.2 mm" },
  { size: "T 1/2", diameter: "20.0 mm", circumference: "62.8 mm" },
  { size: "U", diameter: "20.2 mm", circumference: "63.4 mm" },
  { size: "U 1/2", diameter: "20.4 mm", circumference: "64.1 mm" },
  { size: "V", diameter: "20.6 mm", circumference: "64.7 mm" },
  { size: "V 1/2", diameter: "20.8 mm", circumference: "65.3 mm" },
  { size: "W", diameter: "21.0 mm", circumference: "65.9 mm" },
  { size: "W 1/2", diameter: "21.2 mm", circumference: "66.6 mm" },
  { size: "X", diameter: "21.4 mm", circumference: "67.2 mm" },
  { size: "X 1/2", diameter: "21.6 mm", circumference: "67.8 mm" },
  { size: "Y", diameter: "21.8 mm", circumference: "68.5 mm" },
  { size: "Y 1/2", diameter: "22.0 mm", circumference: "69.1 mm" },
  { size: "Z", diameter: "22.2 mm", circumference: "69.7 mm" },
  { size: "Z 1/2", diameter: "22.4 mm", circumference: "70.3 mm" },
];

export const RingSizeSelector = ({ onSelect, onClose, selectedSize }: RingSizeSelectorProps) => {
  const [selected, setSelected] = useState(selectedSize || "");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setSelected(selectedSize || "");
  }, [selectedSize]);

  const filteredSizes = useMemo(
    () => RING_SIZES.filter((s) => s.size.toLowerCase().includes(searchTerm.toLowerCase())),
    [searchTerm]
  );

  const selectedInfo = RING_SIZES.find((s) => s.size === selected);

  const handleConfirm = () => {
    if (!selected) return;
    onSelect(selected);
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm">
      <div className="fixed right-0 top-0 h-full w-full max-w-md flex flex-col overflow-hidden bg-background shadow-2xl">
        <header className="border-b border-border/40 bg-background/95 px-4 py-3 sm:px-5">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="mb-1 flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-accent">
                  <Ruler className="h-3.5 w-3.5" />
                  Ring Size
                </div>
                <h2 className="font-heading text-lg font-light tracking-tight">
                  Select Size
                </h2>
              </div>
              <button
                onClick={onClose}
                className="shrink-0 rounded-full border border-border/50 p-2 transition-colors hover:border-accent/40 hover:bg-accent/5"
                aria-label="Close ring size selector"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </header>

          <div className="border-b border-border/40 px-4 py-3 sm:px-5">
            <div className="flex flex-col gap-2">
              <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search size..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-2xl border border-border/50 bg-card py-3 pl-11 pr-4 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/10"
                />
              </div>
              <div className="text-xs text-foreground/60">
                Showing <span className="font-semibold text-foreground">{filteredSizes.length}</span>
              </div>
            </div>
          </div>

          <main className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-5">
            <div className="space-y-4">
              {selectedInfo && (
                <div className="rounded-[1.5rem] border border-accent/20 bg-accent/5 px-4 py-3">
                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-accent">Selected</p>
                  <div className="mt-2 flex flex-col gap-2">
                    <span className="font-heading text-xl font-semibold">{selectedInfo.size}</span>
                    <div className="space-y-1 text-xs text-foreground/65">
                      <div>Diameter: <span className="font-semibold text-foreground">{selectedInfo.diameter}</span></div>
                      <div>Circumference: <span className="font-semibold text-foreground">{selectedInfo.circumference}</span></div>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                {filteredSizes.map((sizeItem) => {
                  const active = selected === sizeItem.size;

                  return (
                    <button
                      key={sizeItem.size}
                      onClick={() => setSelected(sizeItem.size)}
                      className={`relative flex flex-col rounded-lg border p-3 text-left transition-all duration-200 ${
                        active
                          ? "border-accent bg-accent/5 shadow-md shadow-accent/10"
                          : "border-border/40 bg-card/80 hover:border-accent/40"
                      }`}
                    >
                      {active && (
                        <div className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-accent-foreground">
                          <Check className="h-2.5 w-2.5" />
                        </div>
                      )}

                      <p className="text-[8px] font-bold uppercase tracking-[0.15em] text-accent">Size</p>
                      <div className="mt-2 font-heading text-2xl font-semibold tracking-tight text-foreground">{sizeItem.size}</div>

                      <div className="mt-3 flex-1 space-y-2 rounded-lg bg-secondary/25 p-2.5">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[8px] text-muted-foreground/80">Diameter</span>
                          <span className="text-[9px] font-semibold text-foreground">{sizeItem.diameter}</span>
                        </div>
                        <div className="border-t border-border/30" />
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[8px] text-muted-foreground/80">Circumference</span>
                          <span className="text-[9px] font-semibold text-foreground">{sizeItem.circumference}</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </main>

          <footer className="border-t border-border/40 bg-background/95 px-4 py-3 sm:px-5">
            <div className="flex flex-col gap-2">
              <div className="text-xs text-foreground/70">
                {selected ? (
                  <>
                    Size: <strong className="text-foreground">{selected}</strong>
                  </>
                ) : (
                  "Select a size"
                )}
              </div>
              <div className="flex gap-2 w-full">
                <Button variant="outline" onClick={onClose} className="flex-1 rounded-xl px-4 py-5 text-xs">
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirm}
                  disabled={!selected}
                  className="flex-1 rounded-xl bg-accent px-4 py-5 text-xs text-accent-foreground"
                >
                  Confirm
                </Button>
              </div>
            </div>
          </footer>
        </div>
      </div>,
      document.body
    );
};
