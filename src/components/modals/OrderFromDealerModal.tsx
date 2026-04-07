import { useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDistributionRequests } from "@/hooks/useDistributionRequests";
import { useDealers } from "@/hooks/useDealers";
import { useProducts } from "@/hooks/useProducts";
import { Truck } from "lucide-react";

interface OrderFromDealerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shopId?: string;
}

export const OrderFromDealerModal = ({ open, onOpenChange, shopId }: OrderFromDealerModalProps) => {
  const { createRequest } = useDistributionRequests();
  const { dealers } = useDealers();
  const { products } = useProducts();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    dealer_id: "",
    product_id: "",
    quantity: "",
    priority: "medium",
    notes: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shopId) {
      toast.error("No shop linked to your account. Please register a shop first.");
      return;
    }
    
    setIsLoading(true);
    const result = await createRequest({
      shop_id: shopId,
      dealer_id: formData.dealer_id,
      product_id: formData.product_id,
      quantity: parseInt(formData.quantity),
      priority: formData.priority,
      notes: formData.notes || undefined
    });
    
    setIsLoading(false);
    if (result) {
      onOpenChange(false);
      setFormData({ dealer_id: "", product_id: "", quantity: "", priority: "medium", notes: "" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Truck className="w-5 h-5" />
            Order from Dealer
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Select Dealer *</Label>
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
          <div className="space-y-2">
            <Label>Product *</Label>
            <Select value={formData.product_id} onValueChange={(v) => setFormData({ ...formData, product_id: v })}>
              <SelectTrigger>
                <SelectValue placeholder="Select product" />
              </SelectTrigger>
              <SelectContent className="z-[200] bg-popover">
                {products.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name} - ₹{product.base_price}/bag
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity (bags) *</Label>
            <Input
              id="quantity"
              type="number"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              placeholder="100"
              min="1"
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Priority</Label>
            <Select value={formData.priority} onValueChange={(v) => setFormData({ ...formData, priority: v })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="z-[200] bg-popover">
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High (Urgent)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Input
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Any special instructions"
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading || !formData.dealer_id || !formData.product_id}>
            {isLoading ? "Sending..." : "Send Order Request"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
