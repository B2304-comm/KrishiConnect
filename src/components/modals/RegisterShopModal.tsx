import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useShops } from "@/hooks/useShops";
import { useDealers } from "@/hooks/useDealers";
import { supabase } from "@/integrations/supabase/client";
import { Store, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface RegisterShopModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const RegisterShopModal = ({ open, onOpenChange }: RegisterShopModalProps) => {
  const { registerShop } = useShops();
  const { dealers } = useDealers();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    owner_name: "",
    phone: "",
    email: "",
    address: "",
    dealer_id: ""
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
    };
    if (open) {
      checkAuth();
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const result = await registerShop({
      ...formData,
      dealer_id: formData.dealer_id || undefined
    });
    
    setIsLoading(false);
    if (result) {
      onOpenChange(false);
      setFormData({ name: "", owner_name: "", phone: "", email: "", address: "", dealer_id: "" });
    }
  };

  const handleLoginRedirect = () => {
    onOpenChange(false);
    navigate("/auth");
  };

  if (isAuthenticated === null) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!isAuthenticated) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Store className="w-5 h-5" />
              Register Your Shop
            </DialogTitle>
            <DialogDescription>
              You need to login or create an account to register your shop.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center py-6 space-y-4">
            <p className="text-muted-foreground text-center">
              Creating an account allows you to manage your shop, receive orders, and track inventory.
            </p>
            <Button onClick={handleLoginRedirect} className="w-full">
              <LogIn className="w-4 h-4 mr-2" />
              Login / Sign Up
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Store className="w-5 h-5" />
            Register Your Shop
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="shop-name">Shop Name *</Label>
            <Input
              id="shop-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Your shop name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="owner-name">Owner Name *</Label>
            <Input
              id="owner-name"
              value={formData.owner_name}
              onChange={(e) => setFormData({ ...formData, owner_name: e.target.value })}
              placeholder="Shop owner's full name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="shop-phone">Phone *</Label>
            <Input
              id="shop-phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+91 98765 43210"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="shop-email">Email</Label>
            <Input
              id="shop-email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="shop@email.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="shop-address">Address *</Label>
            <Input
              id="shop-address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Full shop address"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dealer">Select Dealer (Optional)</Label>
            <Select value={formData.dealer_id} onValueChange={(v) => setFormData({ ...formData, dealer_id: v })}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a dealer" />
              </SelectTrigger>
              <SelectContent className="z-[200] bg-popover">
                {dealers.length === 0 ? (
                  <SelectItem value="none" disabled>No dealers available</SelectItem>
                ) : (
                  dealers.map((dealer) => (
                    <SelectItem key={dealer.id} value={dealer.id}>
                      {dealer.name ?? "Unnamed Dealer"} — {dealer.region ?? ""}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Registering..." : "Register Shop"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
