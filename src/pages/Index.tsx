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

// API Endpoints
const USER_API = 'http://3.107.169.231';
const VEHICLE_DETAILS_API = 'http://45.79.121.32:5050/vahan';
const VEHICLE_MOBILE_API = 'http://45.79.121.32:5000/vahan';

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
        // Vehicle search
        const detailsRes = await fetch(`${VEHICLE_DETAILS_API}?reg=${encodeURIComponent(value)}`);
        const vehicleData = await detailsRes.json();

        if (vehicleData && vehicleData.data) {
          const resultData: Record<string, unknown> = { vehicle_details: vehicleData.data };

          // Try to get mobile number using chassis
          const chassis = vehicleData.data.chassis_no || '';
          if (chassis.length >= 5) {
            const last5 = chassis.slice(-5);
            try {
              const mobileRes = await fetch(`${VEHICLE_MOBILE_API}?reg=${encodeURIComponent(value)}&chassis=${encodeURIComponent(last5)}`);
              const mobileData = await mobileRes.json();
              if (mobileData) {
                resultData.mobile_info = mobileData;
              }
            } catch {
              // Mobile lookup failed, continue without it
            }
          }

          setResult({ type: 'vehicle', data: resultData });
          setSearchState('success');
        } else {
          setSearchState('no-results');
        }
      } else {
        // User search (mobile or aadhaar)
        const endpoint = type === 'mobile'
          ? `/user/mobile/${encodeURIComponent(value)}`
          : `/user/id/${encodeURIComponent(value)}`;

        const res = await fetch(`${USER_API}${endpoint}`);
        const userData = await res.json();

        if (userData && Object.keys(userData).length > 0) {
          setResult({ type: 'user', data: userData });
          setSearchState('success');
        } else {
          setSearchState('no-results');
        }
      }
    } catch (err) {
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
