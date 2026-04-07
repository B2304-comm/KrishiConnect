import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, MapPin, TrendingUp, AlertTriangle, Truck, FileText, Store } from "lucide-react";
import StatCard from "./StatCard";
import DealerOrdersTable from "./DealerOrdersTable";
import { AddShopModal } from "@/components/modals/AddShopModal";
import { InventoryReportModal } from "@/components/modals/InventoryReportModal";
import { ShopDetailsModal } from "@/components/modals/ShopDetailsModal";
import { SendStockModal } from "@/components/modals/SendStockModal";
import { ModifyRequestModal } from "@/components/modals/ModifyRequestModal";
import { useShops } from "@/hooks/useShops";
import { useDistributionRequests } from "@/hooks/useDistributionRequests";
import { useDealers } from "@/hooks/useDealers";
import { supabase } from "@/integrations/supabase/client";

const DealerDashboard = () => {
  const [showAddShop, setShowAddShop] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [selectedShop, setSelectedShop] = useState<any>(null);
  const [showShopDetails, setShowShopDetails] = useState(false);
  const [showSendStock, setShowSendStock] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [showModifyRequest, setShowModifyRequest] = useState(false);
  const [currentDealerId, setCurrentDealerId] = useState<string | undefined>(undefined);
  
  const { shops, approveShop } = useShops();
  const { requests, approveAndShip, updateStatus } = useDistributionRequests();
  const { dealers } = useDealers();

  // Get the dealer ID for the current user
  useEffect(() => {
    const getCurrentDealer = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const userDealer = dealers.find(d => d.user_id === user.id);
        if (userDealer) {
          setCurrentDealerId(userDealer.id);
        }
      }
    };
    getCurrentDealer();
  }, [dealers]);

  const connectedShops = shops.filter(s => s.status === "approved");
  const pendingShops = shops.filter(s => s.status === "pending");

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Inventory" value="12,500 bags" change="+500" trend="up" icon={Package} iconColor="text-primary" />
        <StatCard title="Connected Shops" value={connectedShops.length.toString()} change="+3" trend="up" icon={MapPin} iconColor="text-accent" />
        <StatCard title="This Month Sales" value="8,750 bags" change="+1,200" trend="up" icon={TrendingUp} iconColor="text-secondary" />
        <StatCard title="Pending Requests" value={pendingShops.length.toString()} change="-2" trend="down" icon={AlertTriangle} iconColor="text-destructive" />
      </div>

      <div className="bg-card rounded-xl p-6 border border-border shadow-soft">
        <h2 className="text-lg font-bold text-foreground mb-4">Dealer Operations</h2>
        <div className="flex flex-wrap gap-3">
          <Button className="gap-2"><Truck className="w-4 h-4" />Schedule Delivery</Button>
          <Button variant="outline" className="gap-2" onClick={() => setShowReport(true)}>
            <FileText className="w-4 h-4" />Inventory Report
          </Button>
          <Button variant="outline" className="gap-2" onClick={() => setShowAddShop(true)}>
            <Store className="w-4 h-4" />Add New Shop
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl p-6 border border-border shadow-soft">
          <h2 className="text-lg font-bold text-foreground mb-4">Connected Shops</h2>
          <div className="space-y-4">
            {connectedShops.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No connected shops yet</p>
            ) : (
              connectedShops.slice(0, 5).map((shop) => (
                <div key={shop.id} className="p-4 bg-muted/50 rounded-xl border border-border">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-foreground">{shop.name}</h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3" />{shop.address}
                      </p>
                    </div>
                    <Badge variant="default">Active</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">Stock: {shop.total_stock || 0} bags</p>
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1" onClick={() => { setSelectedShop(shop); setShowSendStock(true); }}>Send Stock</Button>
                    <Button size="sm" variant="outline" onClick={() => { setSelectedShop(shop); setShowShopDetails(true); }}>View Details</Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-card rounded-xl p-6 border border-border shadow-soft">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-secondary" />
            <h2 className="text-lg font-bold text-foreground">Distribution Requests</h2>
          </div>
          <div className="space-y-4">
            {pendingShops.length > 0 && (
              <div className="p-3 bg-secondary/10 rounded-lg border border-secondary/20 mb-4">
                <p className="text-sm font-medium text-secondary">{pendingShops.length} shops awaiting approval</p>
                {pendingShops.slice(0, 2).map(shop => (
                  <div key={shop.id} className="flex items-center justify-between mt-2">
                    <span className="text-sm">{shop.name}</span>
                    <Button size="sm" onClick={() => approveShop(shop.id)}>Approve</Button>
                  </div>
                ))}
              </div>
            )}
            {requests.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No distribution requests</p>
            ) : (
              requests.filter(r => r.status === "pending").slice(0, 3).map((request) => (
                <div key={request.id} className="p-4 bg-muted/50 rounded-xl border border-border">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold text-foreground">#{request.request_number}</p>
                      <p className="text-sm text-muted-foreground">{request.shops?.name}</p>
                    </div>
                    <Badge variant={request.priority === "high" ? "destructive" : "outline"}>{request.priority}</Badge>
                  </div>
                  <p className="text-sm mb-3">{request.products?.name} - {request.quantity} bags</p>
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1" onClick={() => approveAndShip(request.id)}>Approve & Ship</Button>
                    <Button size="sm" variant="outline" onClick={() => { setSelectedRequest(request); setShowModifyRequest(true); }}>Modify</Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <DealerOrdersTable
        requests={requests}
        onApproveAndShip={approveAndShip}
        onUpdateStatus={updateStatus}
        onModify={(request) => { setSelectedRequest(request); setShowModifyRequest(true); }}
      />

      <AddShopModal open={showAddShop} onOpenChange={setShowAddShop} dealerId={currentDealerId} />
      <InventoryReportModal open={showReport} onOpenChange={setShowReport} />
      <ShopDetailsModal open={showShopDetails} onOpenChange={setShowShopDetails} shop={selectedShop} />
      <SendStockModal open={showSendStock} onOpenChange={setShowSendStock} shop={selectedShop} dealerId={currentDealerId} />
      <ModifyRequestModal open={showModifyRequest} onOpenChange={setShowModifyRequest} request={selectedRequest} />
    </div>
  );
};

export default DealerDashboard;