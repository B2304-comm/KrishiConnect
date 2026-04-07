import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BarChart3, TrendingUp, Package, Users, Globe, IndianRupee } from "lucide-react";

interface AnalyticsReportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AnalyticsReportModal = ({ open, onOpenChange }: AnalyticsReportModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Analytics Report
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-primary/10 rounded-xl text-center">
              <Package className="w-8 h-8 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold">125,000</p>
              <p className="text-sm text-muted-foreground">Total Production</p>
              <p className="text-xs text-primary">+4,300 this month</p>
            </div>
            <div className="p-4 bg-accent/10 rounded-xl text-center">
              <Users className="w-8 h-8 text-accent mx-auto mb-2" />
              <p className="text-2xl font-bold">156</p>
              <p className="text-sm text-muted-foreground">Active Dealers</p>
              <p className="text-xs text-accent">+12 this month</p>
            </div>
            <div className="p-4 bg-secondary/10 rounded-xl text-center">
              <Globe className="w-8 h-8 text-secondary mx-auto mb-2" />
              <p className="text-2xl font-bold">89%</p>
              <p className="text-sm text-muted-foreground">Market Coverage</p>
              <p className="text-xs text-secondary">+3% this month</p>
            </div>
            <div className="p-4 bg-primary/10 rounded-xl text-center">
              <IndianRupee className="w-8 h-8 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold">₹2.1Cr</p>
              <p className="text-sm text-muted-foreground">Monthly Revenue</p>
              <p className="text-xs text-primary">+15% growth</p>
            </div>
          </div>

          <div className="p-4 bg-muted/50 rounded-xl">
            <h3 className="font-semibold mb-3">Regional Performance</h3>
            <div className="space-y-3">
              {[
                { region: "North", sales: 45000, growth: 12 },
                { region: "South", sales: 38000, growth: 8 },
                { region: "East", sales: 28000, growth: 15 },
                { region: "West", sales: 32000, growth: 10 }
              ].map((item) => (
                <div key={item.region} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-16 text-sm font-medium">{item.region}</div>
                    <div className="flex-1 h-3 w-32 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${(item.sales / 45000) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">₹{(item.sales / 1000).toFixed(0)}K</p>
                    <p className="text-xs text-primary">+{item.growth}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 bg-muted/50 rounded-xl">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Monthly Trends
            </h3>
            <div className="flex items-end justify-between h-24 gap-2">
              {[65, 78, 82, 75, 88, 92, 95, 89, 94, 98, 105, 112].map((value, idx) => (
                <div
                  key={idx}
                  className="flex-1 bg-primary/60 rounded-t"
                  style={{ height: `${(value / 112) * 100}%` }}
                  title={`Month ${idx + 1}: ${value}%`}
                />
              ))}
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>Jan</span>
              <span>Jun</span>
              <span>Dec</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
