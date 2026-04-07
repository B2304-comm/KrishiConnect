import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Phone, Mail, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ScheduleDemoModal } from "@/components/modals/ScheduleDemoModal";

const CTA = () => {
  const navigate = useNavigate();
  const [showDemoModal, setShowDemoModal] = useState(false);

  const handleGetStarted = () => {
    navigate("/auth");
  };

  return (
    <section id="contact" className="py-24">
      <div className="container mx-auto px-4">
        <div className="bg-card rounded-3xl p-8 md:p-16 shadow-elevated border border-border relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
                Ready to Transform{" "}
                <span className="text-gradient">Fertilizer Distribution?</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Join thousands of farmers, shops, and dealers already using KrishiConnect. 
                Start your journey towards transparent and efficient fertilizer access today.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="hero" size="xl" onClick={handleGetStarted}>
                  Get Started Free
                  <ArrowRight className="w-5 h-5" />
                </Button>
                <Button variant="outline" size="xl" onClick={() => setShowDemoModal(true)}>
                  Schedule Demo
                </Button>
              </div>
            </div>

            {/* Right Content - Contact Info */}
            <div className="space-y-6">
              <div className="bg-muted/50 rounded-2xl p-6 flex items-center gap-5 hover:bg-muted transition-colors">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Phone className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Helpline (24/7)</div>
                  <div className="text-lg font-bold text-foreground">1800-XXX-XXXX</div>
                </div>
              </div>

              <div className="bg-muted/50 rounded-2xl p-6 flex items-center gap-5 hover:bg-muted transition-colors">
                <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                  <Mail className="w-7 h-7 text-accent" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Email Support</div>
                  <div className="text-lg font-bold text-foreground">support@krishiconnect.in</div>
                </div>
              </div>

              <div className="bg-muted/50 rounded-2xl p-6 flex items-center gap-5 hover:bg-muted transition-colors">
                <div className="w-14 h-14 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
                  <MessageCircle className="w-7 h-7 text-secondary" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">SMS Booking</div>
                  <div className="text-lg font-bold text-foreground">BOOK to 56677</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ScheduleDemoModal open={showDemoModal} onOpenChange={setShowDemoModal} />
    </section>
  );
};

export default CTA;
