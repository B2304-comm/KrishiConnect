import { useState } from "react";
import { Sprout } from "lucide-react";
import { Link } from "react-router-dom";
import { RegisterShopModal } from "@/components/modals/RegisterShopModal";
import { RegisterDealerModal } from "@/components/modals/RegisterDealerModal";

const Footer = () => {
  const [showShopModal, setShowShopModal] = useState(false);
  const [showDealerModal, setShowDealerModal] = useState(false);

  return (
    <>
      <footer className="bg-foreground text-background py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                  <Sprout className="w-6 h-6 text-primary-foreground" />
                </div>
                <span className="font-bold text-xl">KrishiConnect</span>
              </div>
              <p className="text-background/70 text-sm leading-relaxed">
                Bridging the gap between fertilizer manufacturers and farmers. 
                Transparent, efficient, and accessible.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
              <ul className="space-y-3">
                <li><Link to="/dashboard" className="text-background/70 hover:text-background transition-colors text-sm">Find Fertilizer</Link></li>
                <li><button onClick={() => setShowShopModal(true)} className="text-background/70 hover:text-background transition-colors text-sm">Register Shop</button></li>
                <li><button onClick={() => setShowDealerModal(true)} className="text-background/70 hover:text-background transition-colors text-sm">Become a Dealer</button></li>
                <li><Link to="/auth" className="text-background/70 hover:text-background transition-colors text-sm">Company Portal</Link></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="font-semibold text-lg mb-4">Resources</h4>
              <ul className="space-y-3">
                <li><Link to="/subsidy-schemes" className="text-background/70 hover:text-background transition-colors text-sm">Subsidy Schemes</Link></li>
                <li><Link to="/price-list" className="text-background/70 hover:text-background transition-colors text-sm">Price List</Link></li>
                <li><Link to="/user-guide" className="text-background/70 hover:text-background transition-colors text-sm">User Guide</Link></li>
                <li><Link to="/user-guide" className="text-background/70 hover:text-background transition-colors text-sm">FAQs</Link></li>
              </ul>
            </div>

            {/* Government */}
            <div>
              <h4 className="font-semibold text-lg mb-4">Government</h4>
              <ul className="space-y-3">
                <li><a href="https://agricoop.nic.in" target="_blank" rel="noopener noreferrer" className="text-background/70 hover:text-background transition-colors text-sm">Ministry of Agriculture</a></li>
                <li><Link to="/government-dashboard" className="text-background/70 hover:text-background transition-colors text-sm">Fertilizer Dashboard</Link></li>
                <li><Link to="/report-issue" className="text-background/70 hover:text-background transition-colors text-sm">Report Issue</Link></li>
                <li><Link to="/contact-us" className="text-background/70 hover:text-background transition-colors text-sm">Contact Us</Link></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-background/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-background/60 text-sm">
              (c) 2024 KrishiConnect. A Government of India Initiative.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-background/60 hover:text-background transition-colors text-sm">Privacy Policy</a>
              <a href="#" className="text-background/60 hover:text-background transition-colors text-sm">Terms of Service</a>
              <a href="#" className="text-background/60 hover:text-background transition-colors text-sm">Accessibility</a>
            </div>
          </div>
        </div>
      </footer>
      <RegisterShopModal open={showShopModal} onOpenChange={setShowShopModal} />
      <RegisterDealerModal open={showDealerModal} onOpenChange={setShowDealerModal} />
    </>
  );
};

export default Footer;

