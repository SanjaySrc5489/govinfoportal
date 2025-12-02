import { Loader2 } from "lucide-react";

export function LoadingState() {
  return (
    <div className="glass-card p-8 animate-fade-in-up">
      <div className="flex flex-col items-center justify-center space-y-6">
        {/* Animated loader */}
        <div className="relative">
          <div className="w-20 h-20 rounded-full border-4 border-secondary" />
          <div className="absolute inset-0 w-20 h-20 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <div className="absolute inset-2 w-16 h-16 rounded-full border-4 border-accent/50 border-b-transparent animate-spin-slow" />
        </div>
        
        {/* Loading text */}
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold text-foreground">
            Searching Database
          </h3>
          <p className="text-sm text-muted-foreground">
            Please wait while we fetch the information...
          </p>
        </div>
        
        {/* Shimmer bars */}
        <div className="w-full max-w-sm space-y-3">
          <div className="h-4 shimmer rounded-lg" />
          <div className="h-4 shimmer rounded-lg w-3/4" />
          <div className="h-4 shimmer rounded-lg w-1/2" />
        </div>
      </div>
    </div>
  );
}
