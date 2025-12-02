import { Smartphone, CreditCard, Car } from "lucide-react";
import { cn } from "@/lib/utils";

export type SearchType = "mobile" | "aadhaar" | "vehicle";

interface SearchTabsProps {
  activeTab: SearchType;
  onTabChange: (tab: SearchType) => void;
}

const tabs = [
  { id: "mobile" as SearchType, label: "Mobile", icon: Smartphone },
  { id: "aadhaar" as SearchType, label: "Aadhaar", icon: CreditCard },
  { id: "vehicle" as SearchType, label: "Vehicle", icon: Car },
];

export function SearchTabs({ activeTab, onTabChange }: SearchTabsProps) {
  return (
    <div className="flex gap-2 p-1 bg-secondary/50 rounded-xl">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-300",
              isActive
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            )}
          >
            <Icon className="w-4 h-4" />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
