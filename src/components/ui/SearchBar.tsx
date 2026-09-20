import React from "react";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  onToggleFilter?: () => void;
  placeholder?: string;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  onClear,
  onToggleFilter,
  placeholder = "Search activities, communities, or interests...",
  className,
}) => {
  return (
    <div className={cn("relative flex items-center w-full max-w-2xl", className)}>
      <div className="relative flex-1 flex items-center">
        <Search className="absolute left-3.5 w-5 h-5 text-black pointer-events-none z-10" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-white border-3 border-black text-black font-semibold pl-11 pr-10 py-3 text-sm md:text-base placeholder:text-black/50 brutal-shadow focus:outline-none focus:ring-2 focus:ring-neo-yellow focus:ring-offset-2 transition-all"
        />
        {value && (
          <button
            onClick={() => {
              onChange("");
              if (onClear) onClear();
            }}
            className="absolute right-3 p-1 rounded hover:bg-black/10 text-black font-bold"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {onToggleFilter && (
        <button
          onClick={onToggleFilter}
          className="ml-3 px-3.5 py-3 bg-neo-yellow border-3 border-black font-extrabold uppercase text-xs tracking-wider flex items-center gap-1.5 brutal-shadow hover:bg-yellow-300 active:translate-x-0.5 active:translate-y-0.5 transition-all"
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span className="hidden sm:inline">Filters</span>
        </button>
      )}
    </div>
  );
};
