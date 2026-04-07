import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Mail, Package, TrendingUp } from "lucide-react";

interface DealerDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dealer: any;
}

export const DealerDetailsModal = ({ open, onOpenChange, dealer }: DealerDetailsModalProps) => {
  if (!dealer) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{dealer.name}</span>
            <Badge variant="default" className="bg-accent">{dealer.efficiency || 95}% efficiency</Badge>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid gap-3">
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <MapPin className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-muted-foreground">Region</p>
                <p className="font-medium">{dealer.region}</p>
              </div>
            </div>
            {dealer.phone && (
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Phone className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-muted-foreground">Phone</p>
                  <p className="font-medium">{dealer.phone}</p>
                </div>
              </div>
            )}
            {dealer.email && (
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Mail className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-muted-foreground">Email</p>
                  <p className="font-medium">{dealer.email}</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <Package className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-muted-foreground">Monthly Volume</p>
                <p className="font-medium">{dealer.volume || `${(dealer.total_inventory || 0).toLocaleString()} bags`}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-muted-foreground">Revenue</p>
                <p className="font-medium text-accent">{dealer.revenue || "N/A"}</p>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            {dealer.phone && (
              <Button className="flex-1" asChild>
                <a href={`tel:${dealer.phone}`}>
                  <Phone className="w-4 h-4 mr-2" />
                  Call
                </a>
              </Button>
            )}
            {dealer.email && (
              <Button variant="outline" className="flex-1" asChild>
                <a href={`mailto:${dealer.email}`}>
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
