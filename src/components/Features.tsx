import { Zap, Shield, Clock, Globe } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Get results in milliseconds with our optimized search engine"
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Your searches are encrypted and never stored"
  },
  {
    icon: Clock,
    title: "24/7 Available",
    description: "Access our database anytime, anywhere"
  },
  {
    icon: Globe,
    title: "Nationwide Coverage",
    description: "Complete coverage across all states and regions"
  }
];

export function Features() {
  return (
    <section className="py-16">
      <div className="text-center mb-12">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
          Why Choose <span className="gradient-text">InfoLookup</span>?
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Trusted by thousands of users for fast and reliable information lookup
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div
              key={feature.title}
              className="glass-card p-6 text-center hover:scale-105 transition-transform duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}>
                <Icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
