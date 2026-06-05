import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { X, Filter, Check, Diamond, Search } from "@/components/Icons";

interface DiamondSelectorProps {
  onSelect: (diamond: any) => void;
  onClose: () => void;
  selectedDiamond?: any;
}

const SAMPLE_DIAMONDS = [
  { id: "d1", shape: "Round", carat: 0.31, color: "K", clarity: "SI1", cut: "Very Good", price: 18892, image: "/diamond-round.svg", code: "RTH3RV5ZAZJP" },
  { id: "d2", shape: "Round", carat: 0.34, color: "K", clarity: "SI1", cut: "Very Good", price: 20174, image: "/diamond-round.svg", code: "RN2K1V5ZAZJZ" },
  { id: "d3", shape: "Round", carat: 0.31, color: "K", clarity: "VS1", cut: "Very Good", price: 20242, image: "/diamond-round.svg", code: "RTHCRV5ZAZJP" },
  { id: "d4", shape: "Round", carat: 0.30, color: "K", clarity: "SI1", cut: "Excellent", price: 20278, image: "/diamond-round.svg", code: "RN2K1V5ZAZJA" },
  { id: "d5", shape: "Round", carat: 0.33, color: "L", clarity: "VS1", cut: "Very Good", price: 19500, image: "/diamond-round.svg", code: "RN2K1V5ZAZJB" },
  { id: "d6", shape: "Round", carat: 0.35, color: "M", clarity: "SI1", cut: "Good", price: 21000, image: "/diamond-round.svg", code: "RN2K1V5ZAZJC" },
  { id: "d7", shape: "Cushion", carat: 0.32, color: "K", clarity: "SI1", cut: "Very Good", price: 19200, image: "/diamond-cushion.svg", code: "RN2K1V5ZAZJD" },
  { id: "d8", shape: "Oval", carat: 0.29, color: "K", clarity: "SI1", cut: "Very Good", price: 17800, image: "/diamond-oval.svg", code: "RN2K1V5ZAZJE" },
];

const SHAPES = ["Round", "Cushion", "Oval", "Emerald", "Pear", "Marquise"];
const COLORS = ["D", "E", "F", "G", "H", "I", "J", "K", "L", "M"];
const CLARITIES = ["FL", "IF", "VVS1", "VVS2", "VS1", "VS2", "SI1", "SI2"];
const CUTS = ["Excellent", "Very Good", "Good", "Fair"];

export const DiamondSelector = ({ onSelect, onClose, selectedDiamond }: DiamondSelectorProps) => {
  const [filters, setFilters] = useState({
    shapes: [] as string[],
    colors: [] as string[],
    clarities: [] as string[],
    cuts: [] as string[],
    minCarat: 0,
    maxCarat: 2,
    minPrice: 0,
    maxPrice: 100000,
  });

  const [selected, setSelected] = useState(selectedDiamond?.id || "");
  const [searchTerm, setSearchTerm] = useState("");
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  const filtered = useMemo(() => {
    return SAMPLE_DIAMONDS.filter((d) => {
      if (searchTerm && !`${d.shape} ${d.code}`.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      if (filters.shapes.length > 0 && !filters.shapes.includes(d.shape)) return false;
      if (filters.colors.length > 0 && !filters.colors.includes(d.color)) return false;
      if (filters.clarities.length > 0 && !filters.clarities.includes(d.clarity)) return false;
      if (filters.cuts.length > 0 && !filters.cuts.includes(d.cut)) return false;
      if (d.carat < filters.minCarat || d.carat > filters.maxCarat) return false;
      if (d.price < filters.minPrice || d.price > filters.maxPrice) return false;
      return true;
    });
  }, [filters, searchTerm]);

  const handleFilterChange = (filterType: string, value: string) => {
    setFilters((prev) => {
      const array = prev[filterType as keyof typeof prev] as string[];
      return {
        ...prev,
        [filterType]: array.includes(value) ? array.filter((v) => v !== value) : [...array, value],
      };
    });
  };

  const resetFilters = () => {
    setFilters({
      shapes: [],
      colors: [],
      clarities: [],
      cuts: [],
      minCarat: 0,
      maxCarat: 2,
      minPrice: 0,
      maxPrice: 100000,
    });
    setSearchTerm("");
  };

  const handleConfirm = () => {
    const diamond = SAMPLE_DIAMONDS.find((d) => d.id === selected);
    if (diamond) {
      onSelect(diamond);
      onClose();
    }
  };

  const activeFilterCount =
    filters.shapes.length + filters.colors.length + filters.clarities.length + filters.cuts.length + (filters.minPrice > 0 || filters.maxPrice < 100000 ? 1 : 0);

  return createPortal(
    <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm">
      <div className="fixed right-0 top-0 h-full w-full max-w-md flex flex-col overflow-hidden bg-background shadow-2xl">
        <header className="border-b border-border/40 bg-background/95 px-4 py-3 sm:px-5">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="mb-1 flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-accent">
                  <Diamond className="h-3.5 w-3.5" />
                  Diamond
                </div>
                <h2 className="font-heading text-lg font-light tracking-tight">
                  Choose Diamond
                </h2>
              </div>
              <button
                onClick={onClose}
                className="shrink-0 rounded-full border border-border/50 p-2 transition-colors hover:border-accent/40 hover:bg-accent/5"
                aria-label="Close diamond selector"
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
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search..."
                  className="w-full rounded-2xl border border-border/50 bg-card py-3 pl-11 pr-4 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/10"
                />
              </div>
              <div className="text-xs text-foreground/60">
                Showing <span className="font-semibold text-foreground">{filtered.length}</span> diamonds
              </div>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-hidden">
            <main className="min-h-0 overflow-y-auto h-full">
              <div className="px-4 py-4">
                  {filtered.length > 0 ? (
                    <div className="grid grid-cols-2 gap-3">
                      {filtered.map((diamond) => (
                        <button
                          key={diamond.id}
                          onClick={() => setSelected(diamond.id)}
                          className={`group relative flex flex-col rounded-lg border p-3 text-left transition-all duration-200 ${
                            selected === diamond.id
                              ? "border-accent bg-accent/5 shadow-md shadow-accent/10"
                              : "border-border/40 bg-card/40 hover:border-accent/30 hover:shadow-sm"
                          }`}
                        >
                          {selected === diamond.id && (
                            <div className="absolute right-2 top-2 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-accent-foreground">
                              <Check className="h-2.5 w-2.5" />
                            </div>
                          )}

                          <div className="relative mb-3 aspect-square overflow-hidden rounded-lg border border-border/20 bg-secondary/40">
                            <img
                              src={diamond.image}
                              alt={`${diamond.carat} ct ${diamond.shape}`}
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          </div>

                          <div className="space-y-2">
                            <div>
                              <p className="font-heading text-lg font-medium tracking-tight">{diamond.carat} Ct</p>
                              <p className="mt-0.5 text-[8px] font-bold uppercase tracking-widest text-accent">
                                {diamond.shape} - {diamond.cut}
                              </p>
                            </div>

                            <div className="grid grid-cols-2 gap-1.5">
                              <div className="rounded-lg bg-secondary/20 p-2">
                                <p className="text-[7px] font-bold uppercase tracking-widest text-muted-foreground">Color</p>
                                <p className="mt-0.5 text-xs font-semibold">{diamond.color}</p>
                              </div>
                              <div className="rounded-lg bg-secondary/20 p-2">
                                <p className="text-[7px] font-bold uppercase tracking-widest text-muted-foreground">Clarity</p>
                                <p className="mt-0.5 text-xs font-semibold">{diamond.clarity}</p>
                              </div>
                            </div>

                            <div className="flex items-center justify-between border-t border-border/10 pt-1.5">
                              <div>
                                <p className="text-[7px] font-bold uppercase tracking-widest text-muted-foreground">Code</p>
                                <p className="text-[9px] font-semibold">{diamond.code}</p>
                              </div>
                              <p className="font-heading text-sm font-semibold">Rs {diamond.price.toLocaleString()}</p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary/20">
                        <X className="h-8 w-8 text-muted-foreground/30" />
                      </div>
                      <h3 className="mb-1 font-heading text-lg font-light">No Matches</h3>
                      <p className="max-w-xs text-xs text-muted-foreground">
                        Try adjusting your search
                      </p>
                    </div>
                  )}
                </div>
            </main>
          </div>

          <footer className="border-t border-border/40 bg-background/95 px-4 py-3 sm:px-5">
            <div className="flex flex-col gap-2">
              <div className="text-xs text-foreground/70">
                {selected ? (
                  <>
                    Selected:{" "}
                    <strong className="text-foreground">
                      {SAMPLE_DIAMONDS.find((d) => d.id === selected)?.carat}ct {SAMPLE_DIAMONDS.find((d) => d.id === selected)?.shape}
                    </strong>
                  </>
                ) : (
                  "Select a diamond"
                )}
              </div>
              <div className="flex gap-2 w-full">
                <button
                  onClick={onClose}
                  className="flex-1 rounded-xl border border-border/60 px-4 py-5 text-xs font-bold uppercase transition-all hover:bg-secondary/50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={!selected}
                  className="flex-1 rounded-xl bg-accent px-4 py-5 text-xs font-bold uppercase text-accent-foreground shadow-md shadow-accent/20 transition-all hover:scale-[1.01] active:scale-95 disabled:scale-100 disabled:opacity-30 disabled:shadow-none"
                >
                  Confirm
                </button>
              </div>
            </div>
          </footer>
        </div>
      </div>,
      document.body
    );
};
