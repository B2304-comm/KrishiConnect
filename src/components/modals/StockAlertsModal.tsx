import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useStockAlerts } from "@/hooks/useStockAlerts";
import { Bell, Package, AlertTriangle, CheckCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface StockAlertsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const StockAlertsModal = ({ open, onOpenChange }: StockAlertsModalProps) => {
  const { alerts, markAsRead } = useStockAlerts();

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "low_stock": return <AlertTriangle className="w-4 h-4 text-secondary" />;
      case "out_of_stock": return <AlertTriangle className="w-4 h-4 text-destructive" />;
      case "restocked": return <CheckCircle className="w-4 h-4 text-primary" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const getAlertBadge = (type: string) => {
    switch (type) {
      case "low_stock": return <Badge variant="outline" className="border-secondary text-secondary">Low Stock</Badge>;
      case "out_of_stock": return <Badge variant="destructive">Out of Stock</Badge>;
      case "restocked": return <Badge variant="default" className="bg-primary">Restocked</Badge>;
      default: return <Badge variant="outline">{type}</Badge>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Stock Alerts
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          {alerts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No stock alerts yet</p>
            </div>
          ) : (
            alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-xl border ${alert.is_read ? "bg-muted/30 border-border" : "bg-primary/5 border-primary/20"}`}
                onClick={() => !alert.is_read && markAsRead(alert.id)}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1">{getAlertIcon(alert.alert_type)}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold text-sm">{alert.shops?.name}</p>
                      {getAlertBadge(alert.alert_type)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {alert.products?.name} - {alert.message || `Stock ${alert.alert_type.replace("_", " ")}`}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(alert.created_at), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
