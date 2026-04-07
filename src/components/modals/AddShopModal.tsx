import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useShops } from "@/hooks/useShops";
import { Store } from "lucide-react";

interface AddShopModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dealerId?: string;
}

export const AddShopModal = ({ open, onOpenChange, dealerId }: AddShopModalProps) => {
  const { addShopAsDealer } = useShops();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    owner_name: "",
    phone: "",
    email: "",
    address: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const shopPayload: {
      name: string;
      owner_name: string;
      phone: string;
      email?: string;
      address: string;
      dealer_id?: string;
    } = {
      ...formData,
    };
    
    // Only include dealer_id if it's a valid UUID
    if (dealerId && dealerId.length === 36) {
      shopPayload.dealer_id = dealerId;
    }
    
    const result = await addShopAsDealer(shopPayload);
    
    setIsLoading(false);
    if (result) {
      onOpenChange(false);
      setFormData({ name: "", owner_name: "", phone: "", email: "", address: "" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Store className="w-5 h-5" />
            Add New Shop
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="shop-name">Shop Name *</Label>
            <Input
              id="shop-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Shop name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="owner-name">Owner Name *</Label>
            <Input
              id="owner-name"
              value={formData.owner_name}
              onChange={(e) => setFormData({ ...formData, owner_name: e.target.value })}
              placeholder="Owner's full name"
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
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Adding..." : "Add Shop"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
