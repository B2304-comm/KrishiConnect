import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Mail, Package, Calendar } from "lucide-react";

interface ShopDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shop: any;
}

export const ShopDetailsModal = ({ open, onOpenChange, shop }: ShopDetailsModalProps) => {
  if (!shop) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{shop.name}</span>
            <Badge variant={shop.status === "approved" ? "default" : shop.status === "pending" ? "outline" : "destructive"}>
              {shop.status}
            </Badge>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid gap-3">
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <MapPin className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-muted-foreground">Address</p>
                <p className="font-medium">{shop.address}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <Phone className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-muted-foreground">Phone</p>
                <p className="font-medium">{shop.phone}</p>
              </div>
            </div>
            {shop.email && (
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Mail className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-muted-foreground">Email</p>
                  <p className="font-medium">{shop.email}</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <Package className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-muted-foreground">Total Stock</p>
                <p className="font-medium">{shop.total_stock || 0} bags</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <Calendar className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-muted-foreground">Registered</p>
                <p className="font-medium">{new Date(shop.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button className="flex-1" asChild>
              <a href={`tel:${shop.phone}`}>
                <Phone className="w-4 h-4 mr-2" />
                Call
              </a>
            </Button>
            {shop.email && (
              <Button variant="outline" className="flex-1" asChild>
                <a href={`mailto:${shop.email}`}>
                  <Mail className="w-4 h-4 mr-2" />
                  Email
                </a>
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
