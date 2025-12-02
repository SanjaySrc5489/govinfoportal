import { useState } from "react";
import { 
  Phone, 
  Copy, 
  Check, 
  Car, 
  Shield, 
  Printer, 
  ChevronDown,
  Fuel,
  Calendar,
  Building,
  Palette
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface VehicleResultProps {
  data: {
    vehicle_details?: {
      owner_name?: string;
      maker_model?: string;
      registration_no?: string;
      chassis_no?: string;
      engine_no?: string;
      vehicle_color?: string;
      fuel_type?: string;
      registration_date?: string;
      vehicle_class?: string;
      rc_status?: string;
      insurance_company?: string;
      insurance_upto?: string;
      registration_authority?: string;
    };
    mobile_info?: {
      status?: string;
      mobile_number?: string;
    };
  };
}

export function VehicleResult({ data }: VehicleResultProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showJson, setShowJson] = useState(false);

  const vehicle = data.vehicle_details || {};
  const mobile = data.mobile_info;
  const hasMobile = mobile?.status === "success" && mobile?.mobile_number;

  const copyToClipboard = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast({ title: "Copied!", description: `${field} copied to clipboard` });
    setTimeout(() => setCopiedField(null), 2000);
  };

  const InfoRow = ({ label, value, icon: Icon, highlight = false, copyable = false }: {
    label: string;
    value?: string;
    icon?: React.ElementType;
    highlight?: boolean;
    copyable?: boolean;
  }) => (
    <div className={`p-4 rounded-lg ${highlight ? 'bg-success/10 border border-success/30' : 'bg-secondary/50'}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            {Icon && <Icon className="w-3 h-3" />}
            {label}
          </p>
          <p className={`font-semibold ${highlight ? 'text-success' : 'text-foreground'}`}>
            {value || 'N/A'}
          </p>
        </div>
        {copyable && value && (
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

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
              <Car className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">Vehicle Found</h3>
              <p className="text-sm text-muted-foreground">{vehicle.registration_no}</p>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            vehicle.rc_status === 'ACTIVE' 
              ? 'bg-success/20 text-success' 
              : 'bg-destructive/20 text-destructive'
          }`}>
            {vehicle.rc_status || 'Unknown'}
          </span>
        </div>

        {/* Mobile Number Display */}
        {hasMobile && (
          <div className="p-6 rounded-xl pulse-glow mb-6" style={{ background: 'var(--gradient-success)' }}>
            <div className="text-center">
              <p className="text-sm text-success-foreground/80 flex items-center justify-center gap-2 mb-2">
                <Phone className="w-4 h-4" />
                OWNER'S MOBILE NUMBER
                <span className="px-2 py-0.5 bg-success-foreground/20 rounded-full text-xs">
                  Verified
                </span>
              </p>
              <p className="text-3xl font-bold text-success-foreground mb-4">
                {mobile?.mobile_number}
              </p>
              <div className="flex gap-3 justify-center">
                <Button
                  variant="secondary"
                  size="lg"
                  className="bg-success-foreground/20 hover:bg-success-foreground/30 text-success-foreground"
                  onClick={() => window.location.href = `tel:${mobile?.mobile_number}`}
                >
                  <Phone className="w-4 h-4" />
                  Call Now
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  className="bg-success-foreground/20 hover:bg-success-foreground/30 text-success-foreground"
                  onClick={() => copyToClipboard(mobile?.mobile_number || '', 'Mobile')}
                >
                  {copiedField === 'Mobile' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  Copy Number
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Owner & Vehicle */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <InfoRow label="Owner Name" value={vehicle.owner_name} icon={Shield} />
          <InfoRow label="Make & Model" value={vehicle.maker_model} icon={Car} />
        </div>

        {/* Vehicle Details */}
        <h4 className="text-sm font-semibold text-muted-foreground mb-3">Vehicle Details</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <InfoRow label="Registration" value={vehicle.registration_no} copyable />
          <InfoRow label="Chassis Number" value={vehicle.chassis_no} copyable />
          <InfoRow label="Engine Number" value={vehicle.engine_no} copyable />
          <InfoRow label="Color" value={vehicle.vehicle_color} icon={Palette} />
          <InfoRow label="Fuel Type" value={vehicle.fuel_type} icon={Fuel} />
          <InfoRow label="Vehicle Class" value={vehicle.vehicle_class} icon={Car} />
          <InfoRow label="Registration Date" value={vehicle.registration_date} icon={Calendar} />
          {vehicle.insurance_company && (
            <InfoRow label="Insurance Company" value={vehicle.insurance_company} icon={Shield} />
          )}
          {vehicle.insurance_upto && (
            <InfoRow label="Insurance Valid Until" value={vehicle.insurance_upto} icon={Calendar} />
          )}
          {vehicle.registration_authority && (
            <InfoRow label="RTO Authority" value={vehicle.registration_authority} icon={Building} />
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6 pt-6 border-t border-border">
          {hasMobile && (
            <Button variant="success" size="lg" className="flex-1" onClick={() => window.location.href = `tel:${mobile?.mobile_number}`}>
              <Phone className="w-4 h-4" />
              Call Owner
            </Button>
          )}
          <Button variant="outline" size="lg" className="flex-1" onClick={() => window.print()}>
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
