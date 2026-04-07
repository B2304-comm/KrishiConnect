import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDistributionRequests } from "@/hooks/useDistributionRequests";
import { useProducts } from "@/hooks/useProducts";
import { Package } from "lucide-react";

interface SendStockModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shop: any;
  dealerId?: string;
}

export const SendStockModal = ({ open, onOpenChange, shop, dealerId }: SendStockModalProps) => {
  const { createRequest } = useDistributionRequests();
  const { products } = useProducts();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    product_id: "",
    quantity: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shop || !dealerId) return;
    
    setIsLoading(true);
    const result = await createRequest({
      shop_id: shop.id,
      dealer_id: dealerId,
      product_id: formData.product_id,
      quantity: parseInt(formData.quantity),
      priority: "high"
    });
    
    setIsLoading(false);
    if (result) {
      onOpenChange(false);
      setFormData({ product_id: "", quantity: "" });
    }
  };

  if (!shop) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Send Stock to {shop.name}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Product *</Label>
            <Select value={formData.product_id} onValueChange={(v) => setFormData({ ...formData, product_id: v })}>
              <SelectTrigger>
                <SelectValue placeholder="Select product" />
              </SelectTrigger>
              <SelectContent>
                {products.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name}
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
          <Button type="submit" className="w-full" disabled={isLoading || !formData.product_id}>
            {isLoading ? "Sending..." : "Send Stock"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
