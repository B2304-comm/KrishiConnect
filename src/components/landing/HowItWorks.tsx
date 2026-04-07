import { Factory, Truck, Store, User, ArrowRight, Package } from "lucide-react";

const steps = [
  {
    icon: Factory,
    title: "Production",
    description: "Company produces fertilizer batch and logs it in the system with quantity and type.",
    number: "01"
  },
  {
    icon: Truck,
    title: "Distribution",
    description: "Dealers receive allocated stock and distribute to retail shops in their region.",
    number: "02"
  },
  {
    icon: Store,
    title: "Retail Availability",
    description: "Shops update their real-time inventory, visible to all farmers in the area.",
    number: "03"
  },
  {
    icon: User,
    title: "Farmer Access",
    description: "Farmers search nearby shops, book fertilizer, and collect with QR receipt.",
    number: "04"
  }
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 bg-muted/30 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-secondary/20 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Package className="w-4 h-4" />
            <span>Simple Process</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            How{" "}
            <span className="text-accent">KrishiConnect</span>{" "}
            Works
          </h2>
          <p className="text-lg text-muted-foreground">
            A transparent supply chain from factory to farm. Track every bag, every step of the way.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line - Desktop */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-secondary -translate-y-1/2 rounded-full" />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={step.title} className="relative">
                <div className="bg-card rounded-2xl p-6 shadow-card border border-border text-center relative z-10 hover:shadow-elevated transition-all duration-300 hover:-translate-y-2">
                  {/* Step Number */}
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-accent text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-soft">
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div className="w-16 h-16 rounded-2xl bg-muted mx-auto mt-4 mb-5 flex items-center justify-center">
                    <step.icon className="w-8 h-8 text-primary" />
                  </div>

                  <h3 className="text-lg font-bold text-foreground mb-3">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                </div>

                {/* Arrow - Mobile/Tablet */}
                {index < steps.length - 1 && (
                  <div className="lg:hidden flex justify-center my-4">
                    <ArrowRight className="w-6 h-6 text-muted-foreground rotate-90 md:rotate-0" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Example Flow */}
        <div className="mt-20 bg-card rounded-3xl p-8 md:p-12 shadow-elevated border border-border">
          <h3 className="text-xl md:text-2xl font-bold text-foreground mb-8 text-center">
            📦 Real Example: Your Fertilizer Journey
          </h3>
          <div className="grid md:grid-cols-5 gap-6 items-center text-center">
            <div className="space-y-2">
              <div className="w-14 h-14 rounded-xl bg-primary/10 mx-auto flex items-center justify-center">
                <Factory className="w-7 h-7 text-primary" />
              </div>
              <p className="text-sm font-medium text-foreground">IFFCO Plant</p>
              <p className="text-xs text-muted-foreground">Produces 10,000 bags</p>
            </div>
            <ArrowRight className="hidden md:block w-6 h-6 text-muted-foreground mx-auto" />
            <div className="space-y-2">
              <div className="w-14 h-14 rounded-xl bg-accent/10 mx-auto flex items-center justify-center">
                <Truck className="w-7 h-7 text-accent" />
              </div>
              <p className="text-sm font-medium text-foreground">Rajesh Traders</p>
              <p className="text-xs text-muted-foreground">Receives 2,000 bags</p>
            </div>
            <ArrowRight className="hidden md:block w-6 h-6 text-muted-foreground mx-auto" />
            <div className="space-y-2">
              <div className="w-14 h-14 rounded-xl bg-secondary/10 mx-auto flex items-center justify-center">
                <Store className="w-7 h-7 text-secondary" />
              </div>
              <p className="text-sm font-medium text-foreground">Sharma Agro</p>
              <p className="text-xs text-muted-foreground">Gets 200 bags • Shows online</p>
            </div>
          </div>
          <div className="flex justify-center mt-8">
            <div className="bg-primary/10 rounded-full px-6 py-3 flex items-center gap-3">
              <User className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-foreground">Farmer Ramu books 2 bags → Collects with QR</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
