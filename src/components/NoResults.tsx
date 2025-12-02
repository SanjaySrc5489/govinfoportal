import { SearchX, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NoResultsProps {
  onRetry: () => void;
}

export function NoResults({ onRetry }: NoResultsProps) {
  return (
    <div className="glass-card p-12 animate-fade-in-up">
      <div className="flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
          <SearchX className="w-10 h-10 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-bold text-foreground">No Results Found</h3>
        <p className="text-muted-foreground max-w-sm">
          We couldn't find any matching records. Please check your input and try again.
        </p>
        <Button variant="gradient" onClick={onRetry} className="mt-4">
          <RefreshCw className="w-4 h-4" />
          Try Again
        </Button>
      </div>
    </div>
  );
}
