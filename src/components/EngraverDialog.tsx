import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "@/components/Icons";

interface EngraverDialogProps {
  onSave: (engravingData: {
    text: string;
    font: string;
    symbols: string[];
  }) => void;
  onClose: () => void;
  initialData?: {
    text: string;
    font: string;
    symbols: string[];
  };
}

const FONTS = [
  { id: "paladin", name: "Paladin", displayStyle: "font-serif" },
  { id: "roman", name: "Roman", displayStyle: "font-serif italic" },
  { id: "script", name: "Script", displayStyle: "italic" },
  { id: "regular", name: "Regular", displayStyle: "font-sans" },
];

const SYMBOLS = [
  { id: "heart", symbol: "♥", name: "Heart" },
  { id: "diamond", symbol: "◆", name: "Diamond" },
  { id: "star", symbol: "★", name: "Star" },
  { id: "flower", symbol: "✿", name: "Flower" },
  { id: "cross", symbol: "✞", name: "Cross" },
  { id: "infinity", symbol: "∞", name: "Infinity" },
  { id: "anchor", symbol: "⚓", name: "Anchor" },
  { id: "leaf", symbol: "✤", name: "Leaf" },
  { id: "crescent", symbol: "☽", name: "Crescent" },
  { id: "sun", symbol: "☀", name: "Sun" },
  { id: "circle", symbol: "●", name: "Circle" },
  { id: "plus", symbol: "✚", name: "Plus" },
];

export const EngraverDialog = ({
  onSave,
  onClose,
  initialData,
}: EngraverDialogProps) => {
  const [engraverText, setEngraverText] = useState(initialData?.text || "");
  const [selectedFont, setSelectedFont] = useState(initialData?.font || "paladin");
  const [selectedSymbols, setSelectedSymbols] = useState<string[]>(
    initialData?.symbols || []
  );

  const handleSymbolToggle = (symbolId: string) => {
    setSelectedSymbols((prev) =>
      prev.includes(symbolId)
        ? prev.filter((s) => s !== symbolId)
        : [...prev, symbolId]
    );
  };

  const handleSave = () => {
    const displaySymbols = selectedSymbols
      .map((id) => SYMBOLS.find((s) => s.id === id)?.symbol || "")
      .filter(Boolean);

    onSave({
      text: engraverText,
      font: selectedFont,
      symbols: displaySymbols,
    });
    onClose();
  };

  const charCount = engraverText.length;
  const maxChars = 15;
  const isValid = engraverText.trim().length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="text-2xl font-heading font-light">Engrave Your Ring</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              A meaningful touch to your jewellery design. You can engrave your ring with any message. 
              Depending on band width, your engraving may be quite small and require a magnifying glass to be read.
            </p>
          </div>

          {/* Text Input */}
          <div>
            <label className="block text-sm font-medium mb-2">Write your message</label>
            <textarea
              value={engraverText}
              onChange={(e) => {
                if (e.target.value.length <= maxChars) {
                  setEngraverText(e.target.value);
                }
              }}
              placeholder="Type here..."
              maxLength={maxChars}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-accent resize-none"
              rows={3}
            />
            <div className="text-xs text-gray-800 mt-1">
              Characters remaining {charCount}/{maxChars}
            </div>
          </div>

          {/* Font Selection */}
          <div>
            <label className="block text-sm font-medium mb-3">Select a font</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {FONTS.map((font) => (
                <button
                  key={font.id}
                  onClick={() => setSelectedFont(font.id)}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    selectedFont === font.id
                      ? "border-accent bg-amber-50"
                      : "border-gray-200 hover:border-accent"
                  }`}
                >
                  <div className={`text-lg font-semibold ${font.displayStyle}`}>
                    {font.name}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Symbols */}
          <div>
            <label className="block text-sm font-medium mb-3">Add symbols (optional)</label>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {SYMBOLS.map((symbol) => (
                <button
                  key={symbol.id}
                  onClick={() => handleSymbolToggle(symbol.id)}
                  title={symbol.name}
                  className={`p-3 border-2 rounded-lg transition-all text-2xl ${
                    selectedSymbols.includes(symbol.id)
                      ? "border-accent bg-amber-50"
                      : "border-gray-200 hover:border-accent"
                  }`}
                >
                  {symbol.symbol}
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          {engraverText && (
            <div className="bg-gray-100 rounded-lg p-6 text-center">
              <p className="text-xs text-gray-800 mb-2">Preview</p>
              <div className={`text-2xl tracking-widest ${FONTS.find(f => f.id === selectedFont)?.displayStyle || ""}`}>
                {engraverText}
                {selectedSymbols.length > 0 && (
                  <span className="ml-2 text-2xl">
                    {selectedSymbols.join(" ")}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Warning */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-sm text-amber-900">
              <strong>Note:</strong> Engraved rings are non-returnable. Your engraving will be lasered inside the band.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50 sticky bottom-0">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!isValid}
            className="flex-1 bg-accent hover:bg-accent/90 text-white"
          >
            Save Engraving
          </Button>
        </div>
      </div>
    </div>
  );
};
