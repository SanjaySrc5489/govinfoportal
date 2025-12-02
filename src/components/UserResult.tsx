import { useState } from "react";
import { 
  Phone, 
  Mail, 
  Copy, 
  Check, 
  User, 
  MapPin, 
  Printer, 
  ChevronDown,
  Shield,
  IdCard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface UserResultProps {
  data: {
    name?: string;
    fullName?: string;
    mobile?: string;
    phone?: string;
    email?: string;
    id?: string;
    _id?: string;
    fname?: string;
    address?: string;
    circle?: string;
    alt?: string;
  };
}

export function UserResult({ data }: UserResultProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showJson, setShowJson] = useState(false);

  const name = data.name || data.fullName || 'Unknown';
  const mobile = data.mobile || data.phone;
  const initial = name.charAt(0).toUpperCase();

  const copyToClipboard = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast({ title: "Copied!", description: `${field} copied to clipboard` });
    setTimeout(() => setCopiedField(null), 2000);
  };

  const InfoRow = ({ label, value, icon: Icon, copyable = false }: {
    label: string;
    value?: string;
    icon?: React.ElementType;
    copyable?: boolean;
  }) => {
    if (!value) return null;
    
    return (
      <div className="p-4 rounded-lg bg-secondary/50">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              {Icon && <Icon className="w-3 h-3" />}
              {label}
            </p>
            <p className="font-semibold text-foreground">{value}</p>
          </div>
          {copyable && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => copyToClipboard(value, label)}
            >
              {copiedField === label ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
            </Button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="glass-card p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-bold text-primary-foreground" style={{ background: 'var(--gradient-primary)' }}>
              {initial}
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">{name}</h3>
              {data.circle && (
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {data.circle}
                </p>
              )}
            </div>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-success/20 text-success flex items-center gap-1">
            <Shield className="w-3 h-3" />
            Verified
          </span>
        </div>

        {/* User Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <InfoRow label="Mobile Number" value={mobile} icon={Phone} copyable />
          <InfoRow label="Aadhaar / ID" value={data.id || data._id} icon={IdCard} copyable />
          {data.fname && <InfoRow label="Father's Name" value={data.fname} icon={User} />}
          {data.email && <InfoRow label="Email" value={data.email} icon={Mail} copyable />}
          {data.alt && <InfoRow label="Alternate Contact" value={data.alt} icon={Phone} copyable />}
        </div>

        {data.address && (
          <div className="p-4 rounded-lg bg-secondary/50 mb-6">
            <p className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
              <MapPin className="w-3 h-3" />
              Address
            </p>
            <p className="font-medium text-foreground">
              {data.address.replace(/!/g, ', ')}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-3 pt-6 border-t border-border">
          {mobile && (
            <Button variant="gradient" size="lg" onClick={() => window.location.href = `tel:${mobile}`}>
              <Phone className="w-4 h-4" />
              Call Mobile
            </Button>
          )}
          {data.email && (
            <Button variant="success" size="lg" onClick={() => window.location.href = `mailto:${data.email}`}>
              <Mail className="w-4 h-4" />
              Send Email
            </Button>
          )}
          <Button variant="outline" size="lg" onClick={() => window.print()}>
            <Printer className="w-4 h-4" />
            Print Details
          </Button>
        </div>
      </div>

      {/* JSON View */}
      <div className="glass-card overflow-hidden">
        <button
          onClick={() => setShowJson(!showJson)}
          className="w-full p-4 flex items-center justify-between text-muted-foreground hover:text-foreground transition-colors"
        >
          <span className="text-sm font-medium">View Raw JSON Data</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${showJson ? 'rotate-180' : ''}`} />
        </button>
        {showJson && (
          <div className="p-4 pt-0">
            <pre className="bg-secondary/50 p-4 rounded-lg text-xs overflow-auto max-h-64 text-muted-foreground">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
