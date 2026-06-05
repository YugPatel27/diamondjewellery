import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronDown,
  X,
  Info,
  Check,
  SlidersHorizontal,
  RefreshCw,
} from "lucide-react";
import { type Filters, type SortOption, defaultFilters, formatINR } from "@/data/products";

interface FilterOption {
  label: string;
  value: string;
  color?: string;
}

interface FilterCategory {
  id: string;
  label: string;
  options: FilterOption[];
}

interface FilterBarProps {
  currentFilters: Filters;
  onFiltersChange: (newFilters: Partial<Filters>) => void;
  sort: SortOption;
  onSortChange: (sort: SortOption) => void;
  resultCount?: number;
  pageType?: string;
}

const RingIcon = ({ active }: { active?: boolean }) => (
  <svg width="28" height="18" viewBox="0 0 28 18" fill="none" className={`transition-opacity ${active ? "opacity-70" : "opacity-20"}`}>
    <ellipse cx="14" cy="10" rx="7" ry="6.5" stroke="currentColor" strokeWidth="1.2" />
    <circle cx="14" cy="4.5" r="2.8" stroke="currentColor" strokeWidth="1" fill={active ? "currentColor" : "none"} />
  </svg>
);

const FilterBar: React.FC<FilterBarProps> = ({
  currentFilters,
  onFiltersChange,
  sort,
  onSortChange,
  resultCount = 0,
  pageType = "all",
}) => {
  const [openCategory, setOpenCategory] = useState<string | null>(() => {
    if (pageType === "rings") return "style";
    if (pageType === "diamonds") return "shape";
    if (["necklaces", "earrings", "bracelets"].includes(pageType)) return "metal";
    return null;
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as HTMLElement).closest(".filter-bar-root")) {
        setOpenCategory(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filterCategories: FilterCategory[] = (() => {
    const style: FilterCategory = {
      id: "style",
      label: "Style",
      options: [
        { label: "Solitaire", value: "Solitaire" },
        { label: "Vintage", value: "Vintage" },
        { label: "Diamond Band", value: "Diamond Band" },
        { label: "Halo", value: "Halo" },
        { label: "Trilogy", value: "Trilogy" },
        { label: "Eternity", value: "Eternity" },
      ],
    };
    const metal: FilterCategory = {
      id: "metal",
      label: "Metal",
      options: [
        { label: "White Gold", value: "White Gold", color: "#E8E4DC" },
        { label: "Yellow Gold", value: "Yellow Gold", color: "#D4A843" },
        { label: "Rose Gold", value: "Rose Gold", color: "#D08560" },
        { label: "Platinum", value: "Platinum", color: "#B8B8C8" },
      ],
    };
    const color: FilterCategory = {
      id: "color",
      label: "Color",
      options: [
        { label: "D - Colorless", value: "D" },
        { label: "E - Colorless", value: "E" },
        { label: "F - Colorless", value: "F" },
        { label: "G - Near Colorless", value: "G" },
        { label: "H - Near Colorless", value: "H" },
        { label: "I - Near Colorless", value: "I" },
      ],
    };
    const shape: FilterCategory = {
      id: "shape",
      label: "Shape",
      options: [
        { label: "Round", value: "Round" },
        { label: "Princess", value: "Princess" },
        { label: "Emerald", value: "Emerald" },
        { label: "Pear", value: "Pear" },
        { label: "Oval", value: "Oval" },
        { label: "Cushion", value: "Cushion" },
      ],
    };
    const type: FilterCategory = {
      id: "diamondType",
      label: "Type",
      options: [
        { label: "Natural", value: "natural" },
        { label: "Lab Grown", value: "lab" },
      ],
    };
    const price: FilterCategory = {
      id: "priceRange",
      label: "Price",
      options: [],
    };
    const carat: FilterCategory = {
      id: "caratRange",
      label: "Carat",
      options: [],
    };

    switch (pageType) {
      case "rings":
        return [style, metal, shape, color, type, price, carat];
      case "necklaces":
      case "earrings":
        return [metal, shape, color, type, price, carat];
      case "diamonds":
        return [shape, color, type, price, carat];
      default:
        return [style, metal, shape, color, type, price, carat];
    }
  })();

  const sortOptions: { label: string; value: SortOption }[] = [
    { label: "Most Relevant", value: "relevant" },
    { label: "Price: Low to High", value: "price-low" },
    { label: "Price: High to Low", value: "price-high" },
    { label: "Newest First", value: "newest" },
  ];

  const safeFilters: Filters = {
    ...defaultFilters,
    ...currentFilters,
  };

  const activePrice = safeFilters.priceRange[0] > defaultFilters.priceRange[0] || safeFilters.priceRange[1] < defaultFilters.priceRange[1];
  const activeCarat = safeFilters.caratRange[0] > defaultFilters.caratRange[0] || safeFilters.caratRange[1] < defaultFilters.caratRange[1];

  const hasAnyActive = Object.entries(safeFilters).some(([key, value]) => {
    if (key === "category" || key === "search") return false;
    if (key === "priceRange") return activePrice;
    if (key === "caratRange") return activeCarat;
    return value !== null && value !== "";
  });

  const renderRangeDropdown = (categoryId: string) => {
    const isPrice = categoryId === "priceRange";
    const minLabel = isPrice ? "Minimum" : "Minimum";
    const maxLabel = isPrice ? "Maximum" : "Maximum";
    const valueMin = isPrice ? safeFilters.priceRange[0] : safeFilters.caratRange[0];
    const valueMax = isPrice ? safeFilters.priceRange[1] : safeFilters.caratRange[1];
    const rangeMin = isPrice ? defaultFilters.priceRange[0] : defaultFilters.caratRange[0];
    const rangeMax = isPrice ? defaultFilters.priceRange[1] : defaultFilters.caratRange[1];
    const step = isPrice ? 1000 : 0.1;

    return (
      <div className="space-y-4 p-4 max-h-72 overflow-y-auto">
        <div className="text-[11px] uppercase tracking-[0.3em] text-foreground/50">{isPrice ? "Price range" : "Carat range"}</div>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] text-muted-foreground">
              <span>{minLabel}</span>
              <span>{isPrice ? formatINR(valueMin) : `${valueMin.toFixed(1)} ct`}</span>
            </div>
            <input
              type="range"
              min={rangeMin}
              max={rangeMax}
              step={step}
              value={valueMin}
              onChange={(event) => {
                const nextValue = isPrice ? Number(event.target.value) : Number(event.target.value);
                if (isPrice) {
                  onFiltersChange({ priceRange: [Math.min(nextValue, valueMax), Math.max(nextValue, valueMax)] });
                } else {
                  onFiltersChange({ caratRange: [Math.min(nextValue, valueMax), Math.max(nextValue, valueMax)] });
                }
              }}
              className="w-full accent-accent"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] text-muted-foreground">
              <span>{maxLabel}</span>
              <span>{isPrice ? formatINR(valueMax) : `${valueMax.toFixed(1)} ct`}</span>
            </div>
            <input
              type="range"
              min={rangeMin}
              max={rangeMax}
              step={step}
              value={valueMax}
              onChange={(event) => {
                const nextValue = isPrice ? Number(event.target.value) : Number(event.target.value);
                if (isPrice) {
                  onFiltersChange({ priceRange: [Math.min(valueMin, nextValue), Math.max(valueMin, nextValue)] });
                } else {
                  onFiltersChange({ caratRange: [Math.min(valueMin, nextValue), Math.max(valueMin, nextValue)] });
                }
              }}
              className="w-full accent-accent"
            />
          </div>
        </div>
      </div>
    );
  };

  const handleClearAll = () => {
    onFiltersChange({
      style: null,
      metal: null,
      shape: null,
      cut: null,
      clarity: null,
      color: null,
      diamondType: null,
      priceRange: defaultFilters.priceRange,
      caratRange: defaultFilters.caratRange,
      search: "",
    });
  };

  return (
    <div className="sticky top-[72px] z-[40] w-full bg-background filter-bar-root">
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6">
        <div className="flex flex-col">
          <div className="flex items-center justify-center border-b border-border/30">
            {filterCategories.map((category) => {
              const activeValue = (safeFilters as any)[category.id];
              const isRangeCategory = category.id === "priceRange" || category.id === "caratRange";
              const isActive = isRangeCategory
                ? category.id === "priceRange"
                  ? activePrice
                  : activeCarat
                : Boolean(activeValue);
              const isOpen = openCategory === category.id;

              return (
                <div
                  key={category.id}
                  className="relative"
                  onPointerEnter={() => setOpenCategory(category.id)}
                  onPointerLeave={() => setOpenCategory((prev) => (prev === category.id ? null : prev))}
                >
                  <button
                    onClick={() => setOpenCategory(isOpen ? null : category.id)}
                    className={`relative flex items-center gap-1.5 py-3.5 px-6 text-[13px] font-medium tracking-wide transition-all duration-150 ${isOpen
                        ? "text-foreground bg-background border-t border-l border-r border-black dark:border-white -mb-px z-10"
                        : isActive
                          ? "text-accent"
                          : "text-foreground/50 hover:text-foreground"
                      }`}
                  >
                    <span>{category.label}</span>
                    <Info className="w-3 h-3 opacity-25" />
                    <ChevronDown className={`w-3 h-3 transition-transform duration-150 ${isOpen ? "rotate-180" : ""}`} />
                  </button>

                  <div
                    className={`absolute left-0 top-full w-[280px] bg-card border-l border-r border-b border-black shadow-lg z-[60] dark:border-white/40 origin-top transition-[opacity,transform] duration-150 ease-out ${isOpen ? "opacity-100 scale-100 translate-y-0 pointer-events-auto" : "opacity-0 scale-[0.985] translate-y-1 pointer-events-none"}`}
                  >
                    <button
                      onClick={() => onFiltersChange({ [category.id]: category.id === "priceRange" ? defaultFilters.priceRange : category.id === "caratRange" ? defaultFilters.caratRange : null })}
                      className="flex items-center gap-3 w-full px-5 py-3 border-b border-border/15 hover:bg-secondary/40 transition-colors"
                    >
                      <div className={`w-[18px] h-[18px] border-2 flex items-center justify-center transition-all ${!isActive ? "bg-black border-black dark:bg-white dark:border-white" : "border-foreground/30"}`}>
                        {!isActive && <Check className="w-2.5 h-2.5 text-white dark:text-black" strokeWidth={3} />}
                      </div>
                      <span className={`text-[13px] ${!isActive ? "font-bold text-foreground" : "text-foreground/60"}`}>All</span>
                    </button>

                    {(category.id === "priceRange" || category.id === "caratRange") ? renderRangeDropdown(category.id) : category.options.map((option) => {
                      const isSelected = activeValue === option.value;
                      return (
                        <button
                          key={option.value}
                          onClick={() => onFiltersChange({ [category.id]: isSelected ? null : option.value })}
                          className="flex items-center justify-between w-full px-5 py-3 border-b border-border/10 last:border-0 hover:bg-secondary/40 transition-colors group/opt"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-[16px] h-[16px] border-[1.5px] flex items-center justify-center transition-colors ${isSelected ? "bg-accent border-accent" : "border-foreground/30 group-hover/opt:border-foreground/50"}`}>
                              {isSelected && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
                            </div>
                            <span className={`text-[13px] ${isSelected ? "font-semibold text-foreground" : "text-foreground/60 group-hover/opt:text-foreground"}`}>
                              {option.label}
                            </span>
                          </div>
                          <RingIcon active={isSelected} />
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            <div className="h-5 w-px bg-border/40 mx-3 hidden sm:block" />

            <div
              className="relative"
              onPointerEnter={() => setOpenCategory("sort")}
              onPointerLeave={() => setOpenCategory((prev) => (prev === "sort" ? null : prev))}
            >
              <button
                onClick={() => setOpenCategory(openCategory === "sort" ? null : "sort")}
                className={`relative flex items-center gap-1.5 py-3.5 px-6 text-[13px] font-medium tracking-wide transition-all duration-150 ${openCategory === "sort"
                    ? "text-foreground bg-background border-t border-l border-r border-black dark:border-white -mb-px z-10"
                    : "text-foreground/50 hover:text-foreground"
                  }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Sort</span>
                <ChevronDown className={`w-3 h-3 transition-transform duration-150 ${openCategory === "sort" ? "rotate-180" : ""}`} />
              </button>

              <div
                className={`absolute right-0 top-full w-[240px] bg-card border-l border-r border-b border-black shadow-lg z-[60] dark:border-white/40 origin-top transition-[opacity,transform] duration-150 ease-out ${openCategory === "sort" ? "opacity-100 scale-100 translate-y-0 pointer-events-auto" : "opacity-0 scale-[0.985] translate-y-1 pointer-events-none"}`}
              >
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      onSortChange(option.value);
                      setOpenCategory(null);
                    }}
                    className={`flex items-center justify-between w-full px-5 py-3 border-b border-border/10 last:border-0 transition-colors text-[13px] ${sort === option.value
                        ? "bg-accent/5 text-accent font-semibold"
                        : "text-foreground/60 hover:bg-secondary/40 hover:text-foreground"
                      }`}
                  >
                    <span>{option.label}</span>
                    {sort === option.value && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            </div>

            {resultCount > 0 && (
              <span className="text-[11px] text-foreground/35 ml-4 hidden sm:inline">
                {resultCount} piece{resultCount !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          {hasAnyActive && (
            <div className="flex flex-wrap items-center justify-center gap-2 py-3">
              {activePrice && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={() => onFiltersChange({ priceRange: defaultFilters.priceRange })}
                  className="flex items-center gap-2 border border-foreground/15 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-foreground/70 hover:bg-foreground/5 transition-all group"
                >
                  <span className="opacity-50">Price:</span>
                  <span>{formatINR(safeFilters.priceRange[0])} - {formatINR(safeFilters.priceRange[1])}</span>
                  <X className="w-2.5 h-2.5 transition-transform group-hover:rotate-90" />
                </motion.button>
              )}
              {activeCarat && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={() => onFiltersChange({ caratRange: defaultFilters.caratRange })}
                  className="flex items-center gap-2 border border-foreground/15 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-foreground/70 hover:bg-foreground/5 transition-all group"
                >
                  <span className="opacity-50">Carat:</span>
                  <span>{safeFilters.caratRange[0].toFixed(1)} - {safeFilters.caratRange[1].toFixed(1)} ct</span>
                  <X className="w-2.5 h-2.5 transition-transform group-hover:rotate-90" />
                </motion.button>
              )}
              {filterCategories.map((cat) => {
                if (cat.id === "priceRange" || cat.id === "caratRange") return null;
                const val = (safeFilters as any)[cat.id];
                if (!val) return null;
                const opt = cat.options.find((o) => o.value === val);
                return (
                  <motion.button
                    key={`${cat.id}-${val}`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={() => onFiltersChange({ [cat.id]: null })}
                    className="flex items-center gap-2 border border-foreground/15 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-foreground/70 hover:bg-foreground/5 transition-all group"
                  >
                    <span className="opacity-50">{cat.label}:</span>
                    <span>{opt?.label || val}</span>
                    <X className="w-2.5 h-2.5 transition-transform group-hover:rotate-90" />
                  </motion.button>
                );
              })}
              <button
                onClick={handleClearAll}
                className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/35 hover:text-accent transition-colors ml-2"
              >
                <RefreshCw className="w-2.5 h-2.5" />
                <span>Clear All</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
