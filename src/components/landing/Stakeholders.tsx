import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Factory, Truck, Store, User, ArrowRight, CheckCircle } from "lucide-react";
import { RegisterCompanyModal } from "@/components/modals/RegisterCompanyModal";
import { RegisterDealerModal } from "@/components/modals/RegisterDealerModal";
import { RegisterShopModal } from "@/components/modals/RegisterShopModal";
import { DownloadAppModal } from "@/components/modals/DownloadAppModal";

const stakeholders = [
  {
    icon: Factory,
    title: "For Companies",
    subtitle: "Manufacturers & Producers",
    description: "Track production batches, assign stock to dealers, and monitor nationwide distribution in real-time.",
    features: [
      "Production batch management",
      "Dealer allocation system",
      "Supply chain visibility",
      "Demand forecasting"
    ],
    color: "primary",
    buttonText: "Register as Company",
    action: "company"
  },
  {
    icon: Truck,
    title: "For Dealers",
    subtitle: "Distributors & Wholesalers",
    description: "Accept company shipments, distribute to retailers, and track inventory across multiple locations.",
    features: [
      "Shipment management",
      "Multi-location tracking",
      "Shop allocation",
      "Stock analytics"
    ],
    color: "accent",
    buttonText: "Register as Dealer",
    action: "dealer"
  },
  {
    icon: Store,
    title: "For Shops",
    subtitle: "Retailers & Agro Stores",
    description: "Display real-time stock, accept farmer bookings, and never miss a sale with our smart inventory system.",
    features: [
      "Real-time stock display",
      "Booking management",
      "Customer notifications",
      "Sales reporting"
    ],
    color: "secondary",
    buttonText: "Register Your Shop",
    action: "shop"
  },
  {
    icon: User,
    title: "For Farmers",
    subtitle: "The Heart of Agriculture",
    description: "Find nearby shops, check availability, book in advance, and access government subsidy information.",
    features: [
      "GPS-based shop finder",
      "Advance booking",
      "Subsidy eligibility check",
      "SMS/offline support"
    ],
    color: "primary",
    buttonText: "Download Farmer App",
    action: "farmer"
  }
];

const colorClasses = {
  primary: {
    bg: "bg-primary",
    light: "bg-primary/10",
    text: "text-primary",
    border: "border-primary/20"
  },
  accent: {
    bg: "bg-accent",
    light: "bg-accent/10",
    text: "text-accent",
    border: "border-accent/20"
  },
  secondary: {
    bg: "bg-secondary",
    light: "bg-secondary/10",
    text: "text-secondary",
    border: "border-secondary/20"
  }
};

const Stakeholders = () => {
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [showDealerModal, setShowDealerModal] = useState(false);
  const [showShopModal, setShowShopModal] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);

  const handleAction = (action: string) => {
    switch (action) {
      case "company":
        setShowCompanyModal(true);
        break;
      case "dealer":
        setShowDealerModal(true);
        break;
      case "shop":
        setShowShopModal(true);
        break;
      case "farmer":
        setShowDownloadModal(true);
        break;
    }
  };

  return (
    <section id="stakeholders" className="py-24">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <User className="w-4 h-4" />
            <span>Built For Everyone</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            One Platform,{" "}
            <span className="text-secondary">Four Solutions</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Whether you're a manufacturer, dealer, retailer, or farmer — we've built specific tools for your needs.
          </p>
        </div>

        {/* Stakeholder Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          {stakeholders.map((stakeholder) => {
            const colors = colorClasses[stakeholder.color as keyof typeof colorClasses];
            return (
              <div
                key={stakeholder.title}
                className={`group bg-card rounded-3xl p-8 shadow-soft hover:shadow-elevated transition-all duration-500 border border-border hover:${colors.border}`}
              >
                <div className="flex items-start gap-5 mb-6">
                  <div className={`w-16 h-16 rounded-2xl ${colors.light} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                    <stakeholder.icon className={`w-8 h-8 ${colors.text}`} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">{stakeholder.title}</h3>
                    <p className={`text-sm font-medium ${colors.text}`}>{stakeholder.subtitle}</p>
                  </div>
                </div>

                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {stakeholder.description}
                </p>

                <ul className="space-y-3 mb-8">
                  {stakeholder.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm text-foreground">
                      <CheckCircle className={`w-5 h-5 ${colors.text} shrink-0`} />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button 
                  variant="outline" 
                  className="w-full group/btn"
                  onClick={() => handleAction(stakeholder.action)}
                >
                  {stakeholder.buttonText}
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modals */}
      <RegisterCompanyModal open={showCompanyModal} onOpenChange={setShowCompanyModal} />
      <RegisterDealerModal open={showDealerModal} onOpenChange={setShowDealerModal} />
      <RegisterShopModal open={showShopModal} onOpenChange={setShowShopModal} />
      <DownloadAppModal open={showDownloadModal} onOpenChange={setShowDownloadModal} />
    </section>
  );
};

export default Stakeholders;
