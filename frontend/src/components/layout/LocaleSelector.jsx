import * as React from 'react';
import { ChevronDown, Check, Coins } from 'lucide-react';
import { usePreferenceStore, CURRENCIES } from '@/store/preferenceStore';

export function CurrencySelector() {
  const [isOpen, setIsOpen] = React.useState(false);
  const { currency, setCurrency } = usePreferenceStore();

  const activeCurrency = CURRENCIES[currency] || CURRENCIES.INR;

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-all cursor-pointer border border-transparent hover:border-border/60"
        aria-label="Select Currency"
        aria-expanded={isOpen}
      >
        <span>CURRENCY</span>
        <span className="text-[11px] font-black text-foreground ml-0.5">({activeCurrency.symbol})</span>
        <ChevronDown className="h-3 w-3 opacity-60 ml-0.5" />
      </button>

      {/* Safe hover bridge */}
      {isOpen && (
        <div className="absolute -bottom-2 left-0 right-0 h-3" />
      )}

      {/* Stylish Solid Black Dropdown Popover */}
      {isOpen && (
        <div
          className="absolute right-0 top-full mt-1.5 w-56 rounded-2xl border border-white/10 bg-[#0d1117] text-white p-3 shadow-2xl z-50 animate-in fade-in-50 slide-in-from-top-2 duration-150"
          onMouseEnter={() => setIsOpen(true)}
        >
          <div className="flex items-center gap-1.5 pb-2 mb-2 border-b border-white/10 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
            <Coins className="h-3.5 w-3.5 text-zinc-300" />
            <span>Select Currency</span>
          </div>

          <div className="space-y-1">
            {Object.values(CURRENCIES).map((curr) => {
              const isSelected = currency === curr.code;
              return (
                <button
                  key={curr.code}
                  type="button"
                  onClick={() => {
                    setCurrency(curr.code);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-white text-zinc-950 font-bold shadow'
                      : 'text-zinc-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="w-5 text-center font-bold text-sm">{curr.symbol}</span>
                    <span>{curr.label}</span>
                  </span>
                  {isSelected && <Check className="h-3.5 w-3.5 text-zinc-950 stroke-[2.5]" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// Keep alias for backwards compatibility
export const LocaleSelector = CurrencySelector;
export default CurrencySelector;
