import { Button } from "@/components/ui/button";
import { Sprout, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 pt-4">
      <div className="container mx-auto">
        <div className="glass-panel-strong rounded-[28px] px-4 md:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            <div className="flex items-center gap-2">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl gradient-hero shadow-card">
                <Sprout className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-extrabold leading-tight tracking-tight text-foreground">KrishiConnect</span>
                <span className="hidden text-[11px] uppercase tracking-[0.18em] text-muted-foreground sm:block">Fertilizer Distribution</span>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
                Features
              </a>
              <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
                How It Works
              </a>
              <a href="#stakeholders" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
                For You
              </a>
              <a href="#contact" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
                Contact
              </a>
            </nav>

            <div className="hidden md:flex items-center gap-3">
              <Button variant="ghost" asChild>
                <Link to="/dashboard">Login</Link>
              </Button>
              <Button variant="default" asChild>
                <Link to="/dashboard">Get Started</Link>
              </Button>
            </div>

            <button
              className="md:hidden p-2 text-foreground"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-white/40 animate-fade-in">
              <nav className="flex flex-col gap-4">
                <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors font-medium py-2">
                  Features
                </a>
                <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors font-medium py-2">
                  How It Works
                </a>
                <a href="#stakeholders" className="text-muted-foreground hover:text-foreground transition-colors font-medium py-2">
                  For You
                </a>
                <a href="#contact" className="text-muted-foreground hover:text-foreground transition-colors font-medium py-2">
                  Contact
                </a>
                <div className="flex flex-col gap-2 pt-4">
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/dashboard">Login</Link>
                  </Button>
                  <Button variant="default" className="w-full" asChild>
                    <Link to="/dashboard">Get Started</Link>
                  </Button>
                </div>
              </nav>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
