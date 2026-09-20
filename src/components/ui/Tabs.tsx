import React from "react";
import { cn } from "@/lib/utils";

export interface TabItem {
  id: string;
  label: string;
  badge?: string | number;
  icon?: React.ReactNode;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  variant?: "yellow" | "pink" | "cyan" | "purple" | "green";
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  variant = "yellow",
  className,
}) => {
  const activeBg = {
    yellow: "bg-neo-yellow text-black border-black",
    pink: "bg-neo-pink text-white border-black",
    cyan: "bg-neo-cyan text-black border-black",
    purple: "bg-neo-purple text-white border-black",
    green: "bg-neo-green text-black border-black",
  };

  return (
    <div className={cn("flex flex-wrap gap-2 border-b-3 border-black pb-2", className)}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              "px-4 py-2 text-xs font-black uppercase tracking-wider border-3 transition-all duration-150 flex items-center gap-2 select-none",
              isActive
                ? `${activeBg[variant]} brutal-shadow font-extrabold translate-y-[-2px]`
                : "bg-white text-black border-black hover:bg-slate-100 brutal-shadow-sm"
            )}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                className={cn(
                  "px-1.5 py-0.5 text-[10px] border border-black font-extrabold",
                  isActive ? "bg-black text-white" : "bg-neo-yellow text-black"
                )}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
