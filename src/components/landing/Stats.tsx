import { TrendingUp, Users, MapPin, Package, Clock, ShieldCheck } from "lucide-react";

const stats = [
  {
    icon: Users,
    value: "1M+",
    label: "Farmers Served",
    description: "Access to fertilizers"
  },
  {
    icon: MapPin,
    value: "15,000+",
    label: "Retail Shops",
    description: "Across the country"
  },
  {
    icon: Package,
    value: "50M",
    label: "Bags Tracked",
    description: "Real-time monitoring"
  },
  {
    icon: Clock,
    value: "2 Hrs",
    label: "Average Delivery",
    description: "After booking"
  },
  {
    icon: ShieldCheck,
    value: "99.9%",
    label: "Fair Price",
    description: "Compliance rate"
  },
  {
    icon: TrendingUp,
    value: "40%",
    label: "Shortage Reduced",
    description: "Compared to last year"
  }
];

const Stats = () => {
  return (
    <section className="py-24 gradient-hero relative overflow-hidden">
      {/* Pattern Overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
            Making Real Impact
          </h2>
          <p className="text-lg text-primary-foreground/80">
            Our platform is transforming how fertilizers reach farmers across the nation.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-primary-foreground/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-primary-foreground/20 hover:bg-primary-foreground/20 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-primary-foreground/20 mx-auto mb-4 flex items-center justify-center">
                <stat.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="text-2xl md:text-3xl font-bold text-primary-foreground mb-1">
                {stat.value}
              </div>
              <div className="text-sm font-semibold text-primary-foreground mb-1">
                {stat.label}
              </div>
              <div className="text-xs text-primary-foreground/70">
                {stat.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
