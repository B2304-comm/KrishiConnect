import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BarChart3, TrendingUp, Package, Users } from "lucide-react";

interface InventoryReportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data?: {
    totalStock: number;
    connectedShops: number;
    monthSales: number;
    lowStockAlerts: number;
  };
}

export const InventoryReportModal = ({ open, onOpenChange, data }: InventoryReportModalProps) => {
  const reportData = data || {
    totalStock: 12500,
    connectedShops: 45,
    monthSales: 8750,
    lowStockAlerts: 7
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Inventory Report
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-primary/10 rounded-xl text-center">
              <Package className="w-8 h-8 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold">{reportData.totalStock.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Total Stock (bags)</p>
            </div>
            <div className="p-4 bg-accent/10 rounded-xl text-center">
              <Users className="w-8 h-8 text-accent mx-auto mb-2" />
              <p className="text-2xl font-bold">{reportData.connectedShops}</p>
              <p className="text-sm text-muted-foreground">Connected Shops</p>
            </div>
            <div className="p-4 bg-secondary/10 rounded-xl text-center">
              <TrendingUp className="w-8 h-8 text-secondary mx-auto mb-2" />
              <p className="text-2xl font-bold">{reportData.monthSales.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">This Month Sales</p>
            </div>
            <div className="p-4 bg-destructive/10 rounded-xl text-center">
              <Package className="w-8 h-8 text-destructive mx-auto mb-2" />
              <p className="text-2xl font-bold">{reportData.lowStockAlerts}</p>
              <p className="text-sm text-muted-foreground">Low Stock Alerts</p>
            </div>
          </div>

          <div className="p-4 bg-muted/50 rounded-xl">
            <h3 className="font-semibold mb-3">Stock Distribution by Product</h3>
            <div className="space-y-2">
              {[
                { name: "NPK 20:20:20", stock: 4500, color: "bg-primary" },
                { name: "Urea 46%", stock: 3800, color: "bg-accent" },
                { name: "DAP", stock: 2500, color: "bg-secondary" },
                { name: "MOP", stock: 1700, color: "bg-muted-foreground" }
              ].map((item) => (
                <div key={item.name} className="flex items-center gap-3">
                  <div className="w-24 text-sm">{item.name}</div>
                  <div className="flex-1 h-4 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full`}
                      style={{ width: `${(item.stock / 4500) * 100}%` }}
                    />
                  </div>
                  <div className="w-16 text-sm text-right">{item.stock.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
