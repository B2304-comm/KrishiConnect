import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, Package, Users, Shield } from "lucide-react";
import { FindShopsModal } from "@/components/modals/FindShopsModal";
import { RegisterShopModal } from "@/components/modals/RegisterShopModal";

const Hero = () => {
  const [showFindShops, setShowFindShops] = useState(false);
  const [showRegisterShop, setShowRegisterShop] = useState(false);

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden pt-28 md:pt-32">
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute bottom-20 right-10 h-96 w-96 rounded-full bg-secondary/20 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <div className="section-shell grid gap-12 overflow-hidden p-6 md:p-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="grid-pattern absolute inset-0 opacity-30" />
          <div className="relative space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/60 px-4 py-2 text-sm font-medium text-primary animate-fade-in">
              <Shield className="w-4 h-4" />
              <span>Government Verified Platform</span>
            </div>

            <h1 className="display-font text-4xl font-bold leading-[1.05] animate-fade-in md:text-5xl lg:text-6xl" style={{ animationDelay: "0.1s" }}>
              Connecting <span className="text-gradient">farmers</span> to fertilizer supply with clarity, speed, and trust.
            </h1>

            <p className="max-w-xl text-lg text-muted-foreground animate-fade-in md:text-xl" style={{ animationDelay: "0.2s" }}>
              End-to-end tracking from manufacturer to farmer. Find nearby shops, check real-time stock, book in advance, and say goodbye to shortages.
            </p>

            <div className="flex flex-col gap-4 animate-fade-in sm:flex-row" style={{ animationDelay: "0.3s" }}>
              <Button variant="hero" size="xl" onClick={() => setShowFindShops(true)}>
                Find Fertilizer Near You
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button variant="outline" size="xl" onClick={() => setShowRegisterShop(true)}>
                Register Your Shop
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-4 border-t border-white/40 pt-8 animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <div>
                <div className="text-2xl font-bold text-foreground md:text-3xl">50K+</div>
                <div className="text-sm text-muted-foreground">Registered Farmers</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground md:text-3xl">2,500+</div>
                <div className="text-sm text-muted-foreground">Partner Shops</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground md:text-3xl">15</div>
                <div className="text-sm text-muted-foreground">States Covered</div>
              </div>
            </div>
          </div>

          <div className="relative hidden lg:block lg:h-[600px]">
            <div className="absolute top-0 right-0 w-80 animate-float rounded-[30px] border border-white/60 bg-white/70 p-6 shadow-elevated backdrop-blur-2xl">
              <div className="mb-4 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="font-semibold text-foreground">Find Nearby</div>
                  <div className="text-sm text-muted-foreground">3 shops within 5km</div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-2xl bg-background/80 p-3">
                  <span className="text-sm font-medium">Sharma Agro Store</span>
                  <span className="text-xs font-semibold text-accent">In Stock</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-background/80 p-3">
                  <span className="text-sm font-medium">Krishi Kendra</span>
                  <span className="text-xs font-semibold text-accent">In Stock</span>
                </div>
              </div>
            </div>

            <div className="absolute bottom-20 left-0 w-72 animate-float rounded-[28px] border border-white/60 bg-white/68 p-5 shadow-card backdrop-blur-2xl" style={{ animationDelay: "1s" }}>
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/20">
                  <Package className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">Stock Update</div>
                  <div className="text-xs text-muted-foreground">Real-time tracking</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 flex-1 overflow-hidden rounded-full bg-muted">
                  <div className="gradient-hero h-full w-3/4 rounded-full" />
                </div>
                <span className="text-sm font-semibold text-foreground">75%</span>
              </div>
            </div>

            <div className="absolute top-1/2 left-10 w-64 animate-float rounded-[28px] border border-white/60 bg-white/68 p-4 shadow-card backdrop-blur-2xl" style={{ animationDelay: "2s" }}>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/20">
                  <Users className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">Today's Bookings</div>
                  <div className="text-2xl font-bold text-primary">247</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <FindShopsModal open={showFindShops} onOpenChange={setShowFindShops} />
      <RegisterShopModal open={showRegisterShop} onOpenChange={setShowRegisterShop} />
    </section>
  );
};

export default Hero;
