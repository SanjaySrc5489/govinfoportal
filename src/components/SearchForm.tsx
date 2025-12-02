import { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchType } from "./SearchTabs";

interface SearchFormProps {
  searchType: SearchType;
  onSearch: (value: string, type: SearchType) => void;
  isLoading: boolean;
}

const placeholders: Record<SearchType, string> = {
  mobile: "Enter 10-digit mobile number",
  aadhaar: "Enter Aadhaar / ID number",
  vehicle: "Enter registration (e.g., DL11PG8009)",
};

const labels: Record<SearchType, string> = {
  mobile: "Mobile Number",
  aadhaar: "Aadhaar / ID Number",
  vehicle: "Vehicle Registration Number",
};

export function SearchForm({ searchType, onSearch, isLoading }: SearchFormProps) {
  const [value, setValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSearch(value.trim(), searchType);
    }
  };

  const formatInput = (input: string) => {
    if (searchType === "vehicle") {
      return input.toUpperCase().replace(/\s/g, "");
    }
    if (searchType === "mobile" || searchType === "aadhaar") {
      return input.replace(/\D/g, "");
    }
    return input;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">
          {labels[searchType]}
        </label>
        <Input
          type="text"
          placeholder={placeholders[searchType]}
          value={value}
          onChange={(e) => setValue(formatInput(e.target.value))}
          className="text-lg"
          disabled={isLoading}
        />
        {searchType === "vehicle" && (
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            Automatically extracts chassis and fetches owner details
          </p>
        )}
      </div>
      
      <Button
        type="submit"
        variant="gradient"
        size="xl"
        className="w-full"
        disabled={isLoading || !value.trim()}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Searching...
          </>
        ) : (
          <>
            <Search className="w-5 h-5" />
            Search Now
          </>
        )}
      </Button>
    </form>
  );
}
