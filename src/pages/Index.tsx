import { useState } from "react";
import { Search, Database, Shield } from "lucide-react";
import { SearchTabs, SearchType } from "@/components/SearchTabs";
import { SearchForm } from "@/components/SearchForm";
import { LoadingState } from "@/components/LoadingState";
import { VehicleResult } from "@/components/VehicleResult";
import { UserResult } from "@/components/UserResult";
import { NoResults } from "@/components/NoResults";
import { ErrorDisplay } from "@/components/ErrorDisplay";
import { Features } from "@/components/Features";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";

type SearchState = 'idle' | 'loading' | 'success' | 'error' | 'no-results';

interface SearchResult {
  type: 'user' | 'vehicle';
  data: Record<string, unknown>;
}

export default function Index() {
  const [activeTab, setActiveTab] = useState<SearchType>('mobile');
  const [searchState, setSearchState] = useState<SearchState>('idle');
  const [result, setResult] = useState<SearchResult | null>(null);
  const [error, setError] = useState<string>('');

  const handleSearch = async (value: string, type: SearchType) => {
    setSearchState('loading');
    setResult(null);
    setError('');

    try {
      if (type === 'vehicle') {
        // Vehicle search via edge function
        const { data, error: fnError } = await supabase.functions.invoke('vehicle-lookup', {
          body: { registration: value }
        });

        if (fnError) throw fnError;

        if (data && data.vehicle_details) {
          setResult({ type: 'vehicle', data });
          setSearchState('success');
        } else if (data?.error) {
          setSearchState('no-results');
        } else {
          setSearchState('no-results');
        }
      } else {
        // User search (mobile or aadhaar) via edge function
        const { data, error: fnError } = await supabase.functions.invoke('user-lookup', {
          body: { searchType: type, searchValue: value }
        });

        if (fnError) throw fnError;

        if (data && !data.error && Object.keys(data).length > 0) {
          setResult({ type: 'user', data });
          setSearchState('success');
        } else {
          setSearchState('no-results');
        }
      }
    } catch (err) {
      console.error('Search error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while searching');
      setSearchState('error');
    }
  };

  const handleReset = () => {
    setSearchState('idle');
    setResult(null);
    setError('');
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--gradient-hero)' }}>
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="relative container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-6">
            <Database className="w-4 h-4" />
            Nationwide Database Access
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
            <span className="gradient-text">Information</span> Lookup Portal
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Search users by mobile number or Aadhaar, lookup vehicle details by registration number. 
            Fast, secure, and reliable.
          </p>

          <div className="flex items-center justify-center gap-4 mt-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Shield className="w-4 h-4 text-success" />
              Encrypted Search
            </span>
            <span className="flex items-center gap-1">
              <Search className="w-4 h-4 text-primary" />
              Real-time Results
            </span>
          </div>
        </header>

        {/* Search Card */}
        <div className="glass-card gradient-border p-6 md:p-8 mb-8">
          <SearchTabs activeTab={activeTab} onTabChange={setActiveTab} />
          <div className="mt-6">
            <SearchForm
              searchType={activeTab}
              onSearch={handleSearch}
              isLoading={searchState === 'loading'}
            />
          </div>
        </div>

        {/* Results Area */}
        {searchState === 'loading' && <LoadingState />}
        
        {searchState === 'success' && result?.type === 'vehicle' && (
          <VehicleResult data={result.data as Parameters<typeof VehicleResult>[0]['data']} />
        )}
        
        {searchState === 'success' && result?.type === 'user' && (
          <UserResult data={result.data as Parameters<typeof UserResult>[0]['data']} />
        )}
        
        {searchState === 'no-results' && <NoResults onRetry={handleReset} />}
        
        {searchState === 'error' && <ErrorDisplay message={error} onRetry={handleReset} />}

        {/* Features Section */}
        {searchState === 'idle' && <Features />}

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
