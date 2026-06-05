import { Trash2, Edit2 } from "@/components/Icons";
import { Button } from "@/components/ui/button";

interface CartItemCustomizationDisplayProps {
  customization?: any;
  onEdit?: () => void;
  itemPrice: number;
}

export const CartItemCustomizationDisplay = ({
  customization,
  onEdit,
  itemPrice,
}: CartItemCustomizationDisplayProps) => {
  if (!customization) return null;

  return (
    <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg space-y-2">
      <div className="text-xs font-semibold text-amber-900">Customization Details:</div>
      
      {customization.ringSize && (
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-900">
            <strong>Ring Size:</strong> {customization.ringSize}
          </span>
        </div>
      )}

      {customization.engravingText && (
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-900">
            <strong>Engraving:</strong> "{customization.engravingText}"
            {customization.engravingSymbols?.length > 0 && (
              <span className="ml-1">{customization.engravingSymbols.join(" ")}</span>
            )}
          </span>
        </div>
      )}

      {customization.engravingFont && (
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-900">
            <strong>Font:</strong> {customization.engravingFont}
          </span>
        </div>
      )}

      {customization.selectedDiamond && (
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-900">
            <strong>Diamond:</strong> {customization.selectedDiamond.carat}ct ({customization.selectedDiamond.color}/{customization.selectedDiamond.clarity}) - ₹{customization.selectedDiamond.price.toLocaleString()}
          </span>
        </div>
      )}

      {onEdit && (
        <div className="flex gap-2 mt-3 pt-2 border-t border-amber-200">
          <Button
            variant="outline"
            size="sm"
            onClick={onEdit}
            className="flex-1 h-7 text-xs"
          >
            <Edit2 className="w-3 h-3 mr-1" />
            Edit Customization
          </Button>
        </div>
      )}
    </div>
  );
};
