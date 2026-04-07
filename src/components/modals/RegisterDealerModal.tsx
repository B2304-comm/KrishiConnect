import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { Truck, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface RegisterDealerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const RegisterDealerModal = ({ open, onOpenChange }: RegisterDealerModalProps) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    region: "",
    phone: "",
    email: "",
    address: ""
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
      setUserId(user?.id || null);
    };
    if (open) {
      checkAuth();
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    
    setIsLoading(true);
    
    try {
      // Insert dealer record
      const { error: dealerError } = await supabase
        .from("dealers")
        .insert({
          name: formData.name,
          region: formData.region,
          phone: formData.phone || null,
          email: formData.email || null,
          address: formData.address || null,
          user_id: userId
        });

      if (dealerError) throw dealerError;

      // Add dealer role to user
      const { error: roleError } = await supabase
        .from("user_roles")
        .insert({
          user_id: userId,
          role: "dealer" as const
        });

      if (roleError && !roleError.message.includes("duplicate")) {
        throw roleError;
      }

      toast.success("Dealer registered successfully!");
      onOpenChange(false);
      setFormData({ name: "", region: "", phone: "", email: "", address: "" });
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Error registering dealer:", error);
      toast.error("Failed to register dealer: " + error.message);
    } finally {
      setIsLoading(false);
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
              <Truck className="w-5 h-5" />
              Register as Dealer
            </DialogTitle>
            <DialogDescription>
              You need to login or create an account to register as a dealer.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center py-6 space-y-4">
            <p className="text-muted-foreground text-center">
              Creating an account allows you to manage shipments, distribute to retailers, and track inventory across locations.
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
            <Truck className="w-5 h-5" />
            Register as Dealer
          </DialogTitle>
          <DialogDescription>
            Register as a dealer to start distributing fertilizers in your region.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="dealer-name">Dealer/Business Name *</Label>
            <Input
              id="dealer-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Your business name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dealer-region">Region/State *</Label>
            <Input
              id="dealer-region"
              value={formData.region}
              onChange={(e) => setFormData({ ...formData, region: e.target.value })}
              placeholder="e.g., Maharashtra, Punjab"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dealer-phone">Phone</Label>
            <Input
              id="dealer-phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+91 98765 43210"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dealer-email">Email</Label>
            <Input
              id="dealer-email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="dealer@email.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dealer-address">Address</Label>
            <Input
              id="dealer-address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Business address"
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Registering..." : "Register as Dealer"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
