import { 
  MapPin, 
  Package, 
  QrCode, 
  Globe, 
  BarChart3, 
  Smartphone,
  TrendingUp,
  Shield
} from "lucide-react";

const features = [
  {
    icon: Package,
    title: "Inventory Tracking",
    description: "Track fertilizer stock from manufacturer to your doorstep. Full transparency at every step.",
    color: "primary"
  },
  {
    icon: MapPin,
    title: "Geo-Location Search",
    description: "Find the nearest shops with available stock using GPS. Never waste time searching again.",
    color: "accent"
  },
  {
    icon: QrCode,
    title: "QR Code Booking",
    description: "Book fertilizer in advance and get a QR receipt. Just show it at the shop to collect.",
    color: "secondary"
  },
  {
    icon: Globe,
    title: "Multi-Language",
    description: "Available in Hindi, English, Bengali, Tamil, and more. Everyone can use it.",
    color: "primary"
  },
  {
    icon: Shield,
    title: "Government Integration",
    description: "Linked with subsidy schemes. Automatic eligibility check and fair pricing guarantee.",
    color: "accent"
  },
  {
    icon: BarChart3,
    title: "Data Dashboard",
    description: "Authorities can monitor shortage areas and take action before crisis hits.",
    color: "secondary"
  },
  {
    icon: Smartphone,
    title: "SMS/IVR Support",
    description: "No smartphone? No problem. Book via SMS or call our IVR system.",
    color: "primary"
  },
  {
    icon: TrendingUp,
    title: "AI Predictions",
    description: "Smart algorithms predict shortage areas before they happen. Proactive distribution.",
    color: "accent"
  }
];

const colorClasses = {
  primary: "bg-primary/10 text-primary",
  accent: "bg-accent/10 text-accent",
  secondary: "bg-secondary/10 text-secondary"
};

const Features = () => {
  return (
    <section id="features" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Package className="w-4 h-4" />
            <span>Powerful Features</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Everything You Need for{" "}
            <span className="text-gradient">Seamless Distribution</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            From real-time tracking to government integration, our platform covers every aspect of fertilizer distribution.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group bg-card rounded-2xl p-6 shadow-soft hover:shadow-card transition-all duration-300 border border-border hover:border-primary/20 hover:-translate-y-1"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`w-14 h-14 rounded-xl ${colorClasses[feature.color as keyof typeof colorClasses]} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-3">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
