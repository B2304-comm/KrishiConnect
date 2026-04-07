import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Package, Calendar, Factory, Truck } from "lucide-react";
import { toast } from "sonner";
import { useProducts } from "@/hooks/useProducts";
import { useDealers } from "@/hooks/useDealers";
import { supabase } from "@/integrations/supabase/client";

interface AddProductionBatchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBatchCreated?: () => Promise<void> | void;
}

export const AddProductionBatchModal = ({ open, onOpenChange, onBatchCreated }: AddProductionBatchModalProps) => {
  const { products } = useProducts();
  const { dealers } = useDealers();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    productId: "",
    quantity: "",
    batchNumber: `BTH${Date.now().toString().slice(-6)}`,
    manufacturingDate: new Date().toISOString().split('T')[0],
    expiryDate: "",
    assignedDealerId: "",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("Not authenticated");
      }

      const { data: company, error: companyError } = await supabase
        .from("companies")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (companyError) throw companyError;

      const { error } = await supabase.from("production_batches").insert({
        company_id: company.id,
        product_id: formData.productId,
        assigned_dealer_id: formData.assignedDealerId || null,
        batch_number: formData.batchNumber,
        quantity: Number(formData.quantity),
        manufacturing_date: formData.manufacturingDate,
        expiry_date: formData.expiryDate,
        notes: formData.notes || null,
      });

      if (error) throw error;

      toast.success(`Production batch ${formData.batchNumber} created successfully!`);
      await onBatchCreated?.();
      onOpenChange(false);

      setFormData({
        productId: "",
        quantity: "",
        batchNumber: `BTH${Date.now().toString().slice(-6)}`,
        manufacturingDate: new Date().toISOString().split("T")[0],
        expiryDate: "",
        assignedDealerId: "",
        notes: "",
      });
    } catch (error: any) {
      toast.error("Failed to create batch: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Factory className="w-5 h-5 text-primary" />
            Add Production Batch
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="batchNumber">Batch Number</Label>
            <Input
              id="batchNumber"
              value={formData.batchNumber}
              onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })}
              placeholder="BTH000001"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="product">Product</Label>
            <Select
              value={formData.productId}
              onValueChange={(value) => setFormData({ ...formData, productId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select product" />
              </SelectTrigger>
              <SelectContent>
                {products.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name} - Rs{product.base_price}/{product.unit}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity (bags)</Label>
            <Input
              id="quantity"
              type="number"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              placeholder="Enter quantity"
              min="1"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="manufacturingDate">Manufacturing Date</Label>
              <Input
                id="manufacturingDate"
                type="date"
                value={formData.manufacturingDate}
                onChange={(e) => setFormData({ ...formData, manufacturingDate: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiryDate">Expiry Date</Label>
              <Input
                id="expiryDate"
                type="date"
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="assignedDealer">Assign to Dealer (Optional)</Label>
            <Select
              value={formData.assignedDealerId}
              onValueChange={(value) => setFormData({ ...formData, assignedDealerId: value === "none" ? "" : value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select dealer for distribution" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No assignment yet</SelectItem>
                {dealers.map((dealer) => (
                  <SelectItem key={dealer.id} value={dealer.id}>
                    {dealer.name} - {dealer.region}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Any additional notes about this batch"
              rows={3}
            />
          </div>

          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <h4 className="font-medium text-sm flex items-center gap-2">
              <Package className="w-4 h-4" />
              Batch Summary
            </h4>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>Batch: {formData.batchNumber}</p>
              <p>Quantity: {formData.quantity || 0} bags</p>
              {formData.assignedDealerId && (
                <p className="flex items-center gap-1">
                  <Truck className="w-3 h-3" />
                  Assigned for distribution
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Batch"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
