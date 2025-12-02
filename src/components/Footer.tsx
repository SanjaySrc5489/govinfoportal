import { Search, Shield, Mail } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="border-t border-border mt-16 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}>
              <Search className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-foreground">InfoLookup</span>
          </div>
          
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors flex items-center gap-1">
              <Shield className="w-4 h-4" />
              Privacy Policy
            </a>
            <a href="#" className="hover:text-primary transition-colors flex items-center gap-1">
              <Mail className="w-4 h-4" />
              Contact
            </a>
          </div>
          
          <p className="text-sm text-muted-foreground">
            © {currentYear} InfoLookup. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
