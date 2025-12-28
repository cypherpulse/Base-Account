import { useState } from "react";
import { Minus, Plus } from "lucide-react";

// Props interface for the amount selector component
interface AmountSelectorProps {
  value: string;
  onChange: (value: string) => void;
  min?: number;
  max?: number;
}

const PRESET_AMOUNTS = ["1", "5", "10", "25", "50", "100"];

const AmountSelector = ({ value, onChange, min = 1, max = 1000 }: AmountSelectorProps) => {
  const [isCustom, setIsCustom] = useState(false);

  const numValue = parseFloat(value) || min;

  const handleIncrement = () => {
    const newValue = Math.min(numValue + 1, max);
    onChange(newValue.toString());
  };

  const handleDecrement = () => {
    const newValue = Math.max(numValue - 1, min);
    onChange(newValue.toString());
  };

  const handlePresetClick = (amount: string) => {
    setIsCustom(false);
    onChange(amount);
  };

  const handleCustomInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (inputValue === "" || /^\d*\.?\d*$/.test(inputValue)) {
      onChange(inputValue);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 justify-center">
        {PRESET_AMOUNTS.map((amount) => (
          <button
            key={amount}
            onClick={() => handlePresetClick(amount)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
              value === amount && !isCustom
                ? "bg-primary text-primary-foreground shadow-lg"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            ${amount}
          </button>
        ))}
        <button
          onClick={() => setIsCustom(true)}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
            isCustom
              ? "bg-primary text-primary-foreground shadow-lg"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          }`}
        >
          Custom
        </button>
      </div>

      {isCustom && (
        <div className="flex items-center justify-center gap-3 animate-fade-in">
          <button
            onClick={handleDecrement}
            disabled={numValue <= min}
            className="p-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Minus className="w-5 h-5" />
          </button>
          
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
              $
            </span>
            <input
              type="text"
              value={value}
              onChange={handleCustomInput}
              className="w-32 py-3 pl-8 pr-4 text-center text-xl font-bold bg-secondary rounded-lg border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              placeholder="0.00"
            />
          </div>
          
          <button
            onClick={handleIncrement}
            disabled={numValue >= max}
            className="p-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      )}

      <p className="text-center text-sm text-muted-foreground">
        Amount in USDC
      </p>
    </div>
  );
};

export default AmountSelector;
