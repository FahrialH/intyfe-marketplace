import React from 'react';
import { Minus, Plus } from 'lucide-react';

interface QuantityStepperProps {
  quantity: number;
  onQuantityChange: (val: number) => void;
  min?: number;
  max?: number;
}

export const QuantityStepper: React.FC<QuantityStepperProps> = ({
  quantity,
  onQuantityChange,
  min = 1,
  max = 99,
}) => {
  const handleDecrement = () => {
    if (quantity > min) {
      onQuantityChange(quantity - 1);
    }
  };

  const handleIncrement = () => {
    if (quantity < max) {
      onQuantityChange(quantity + 1);
    }
  };

  return (
    <div className="flex items-center border border-white/15 rounded-full bg-[#151515] overflow-hidden w-fit">
      <button
        type="button"
        onClick={handleDecrement}
        disabled={quantity <= min}
        className="px-3 py-2 text-white/70 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
        aria-label="Decrease quantity"
      >
        <Minus className="w-3.5 h-3.5" />
      </button>
      <span className="w-10 text-center text-sm font-semibold text-white select-none">
        {quantity}
      </span>
      <button
        type="button"
        onClick={handleIncrement}
        disabled={quantity >= max}
        className="px-3 py-2 text-white/70 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
        aria-label="Increase quantity"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
