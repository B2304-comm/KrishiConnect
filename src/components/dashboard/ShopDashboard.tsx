import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, TrendingUp, AlertTriangle, Users, QrCode, Truck, Phone, Store, ClipboardList } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import StatCard from "./StatCard";
import { ScanQRModal } from "@/components/modals/ScanQRModal";
import { OrderFromDealerModal } from "@/components/modals/OrderFromDealerModal";
import { RegisterShopModal } from "@/components/modals/RegisterShopModal";
import { useBookings } from "@/hooks/useBookings";
import { useDistributionRequests } from "@/hooks/useDistributionRequests";
import { supabase } from "@/integrations/supabase/client";

interface ShopInventoryItem {
  id: string;
  quantity: number | null;
  price: number;
  last_restocked: string | null;
  products: { name: string } | null;
}

const ShopDashboard = () => {
  const [showScanQR, setShowScanQR] = useState(false);
  const [showOrderDealer, setShowOrderDealer] = useState(false);
  const [showRegisterShop, setShowRegisterShop] = useState(false);
  const { bookings, markReady, completeBooking } = useBookings();
  const { requests } = useDistributionRequests();
  const [userShopId, setUserShopId] = useState<string | undefined>(undefined);
  const [shopChecked, setShopChecked] = useState(false);
  const [inventory, setInventory] = useState<ShopInventoryItem[]>([]);

  useEffect(() => {
    const fetchShopId = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setShopChecked(true); return; }
      const { data } = await supabase
        .from("shops")
        .select("id")
        .eq("user_id", user.id)
        .limit(1);
      if (data && data.length > 0) {
        setUserShopId(data[0].id);
      }
      setShopChecked(true);
    };
    fetchShopId();
  }, []);

  // Fetch real inventory for this shop
  useEffect(() => {
    if (!userShopId) return;
    const fetchInventory = async () => {
      const { data } = await supabase
        .from("shop_inventory")
        .select("id, quantity, price, last_restocked, products (name)")
        .eq("shop_id", userShopId);
      if (data) setInventory(data as ShopInventoryItem[]);
    };
    fetchInventory();

    const channel = supabase
      .channel("shop_inventory_realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "shop_inventory", filter: `shop_id=eq.${userShopId}` }, () => {
        fetchInventory();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [userShopId]);

  const pendingOrders = bookings.filter(b => b.status === "pending" || b.status === "ready");

  // Shop's own distribution requests (order history)
  const shopOrders = requests.filter(r => userShopId && r.shop_id === userShopId);

  const totalStock = inventory.reduce((sum, i) => sum + (i.quantity || 0), 0);

  return (
    <div className="space-y-6">
      {shopChecked && !userShopId && (
        <div className="bg-secondary/10 border border-secondary rounded-xl p-6 flex flex-col sm:flex-row items-center gap-4">
          <Store className="w-10 h-10 text-secondary shrink-0" />
          <div className="flex-1 text-center sm:text-left">
            <h3 className="font-bold text-foreground text-lg">No Shop Registered</h3>
            <p className="text-muted-foreground text-sm">You don't have a shop linked to your account yet. Register your shop to start managing inventory and placing orders.</p>
          </div>
          <Button onClick={() => setShowRegisterShop(true)} className="gap-2 shrink-0">
            <Store className="w-4 h-4" />Register Shop
          </Button>
        </div>
      )}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Current Stock" value={`${totalStock} bags`} change="" trend="up" icon={Package} iconColor="text-primary" />
        <StatCard title="Today's Sales" value="45 bags" change="+12" trend="up" icon={TrendingUp} iconColor="text-accent" />
        <StatCard title="Pending Orders" value={pendingOrders.length.toString()} change="" trend="up" icon={AlertTriangle} iconColor="text-secondary" />
        <StatCard title="Dealer Orders" value={shopOrders.length.toString()} change="" trend="up" icon={Truck} iconColor="text-primary" />
      </div>

      <div className="bg-card rounded-xl p-6 border border-border shadow-soft">
        <h2 className="text-lg font-bold text-foreground mb-4">Shop Management</h2>
        <div className="flex flex-wrap gap-3">
          <Button className="gap-2"><Package className="w-4 h-4" />Update Stock</Button>
          <Button variant="outline" className="gap-2" onClick={() => setShowScanQR(true)}>
            <QrCode className="w-4 h-4" />Scan QR Code
          </Button>
          <Button variant="outline" className="gap-2" onClick={() => setShowOrderDealer(true)}>
            <Truck className="w-4 h-4" />Order from Dealer
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl p-6 border border-border shadow-soft">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-secondary" />
            <h2 className="text-lg font-bold text-foreground">Pending Orders</h2>
          </div>
          <div className="space-y-4">
            {pendingOrders.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No pending orders</p>
            ) : (
              pendingOrders.slice(0, 5).map((order) => (
                <div key={order.id} className="p-4 bg-muted/50 rounded-xl border border-border">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-foreground">#{order.booking_number}</h3>
                      <p className="text-sm text-muted-foreground">{order.products?.name} - {order.quantity} bags</p>
                    </div>
                    <Badge variant={order.status === "ready" ? "default" : "outline"}>{order.status}</Badge>
                  </div>
                  <p className="text-sm font-medium text-accent mb-3">₹{order.total_amount.toLocaleString()}</p>
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1" onClick={() => order.status === "pending" ? markReady(order.id) : completeBooking(order.id)}>
                      {order.status === "pending" ? "Mark Ready" : "Complete Sale"}
                    </Button>
                    <Button size="sm" variant="outline"><Phone className="w-4 h-4" /></Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-card rounded-xl p-6 border border-border shadow-soft">
          <h2 className="text-lg font-bold text-foreground mb-4">Current Inventory</h2>
          <div className="space-y-4">
            {inventory.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No inventory yet. Order from a dealer to get started.</p>
            ) : (
              inventory.map((item) => (
                <div key={item.id} className="p-4 bg-muted/50 rounded-xl border border-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground">{item.products?.name || "Unknown"}</h3>
                      <p className="text-sm font-medium text-accent mt-1">₹{item.price}/bag</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-foreground">{item.quantity || 0}</p>
                      <Badge variant={(item.quantity || 0) > 100 ? "default" : "destructive"}>
                        {(item.quantity || 0) > 100 ? "In Stock" : "Low Stock"}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Order History */}
      <div className="bg-card rounded-xl p-6 border border-border shadow-soft">
        <div className="flex items-center gap-2 mb-4">
          <ClipboardList className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-bold text-foreground">Order History (Dealer Orders)</h2>
          <Badge variant="secondary" className="ml-auto">{shopOrders.length}</Badge>
        </div>
        {shopOrders.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No orders placed yet</p>
        ) : (
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Request #</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shopOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono font-semibold">#{order.request_number}</TableCell>
                    <TableCell>{order.products?.name || "—"}</TableCell>
                    <TableCell>{order.quantity} bags</TableCell>
                    <TableCell>
                      <Badge variant={order.priority === "high" ? "destructive" : order.priority === "medium" ? "secondary" : "outline"}>
                        {order.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        order.status === "delivered" ? "default" :
                        order.status === "shipped" ? "secondary" :
                        order.status === "rejected" ? "destructive" : "outline"
                      }>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {new Date(order.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <ScanQRModal open={showScanQR} onOpenChange={setShowScanQR} />
      <OrderFromDealerModal open={showOrderDealer} onOpenChange={setShowOrderDealer} shopId={userShopId} />
      <RegisterShopModal open={showRegisterShop} onOpenChange={(open) => {
        setShowRegisterShop(open);
        if (!open) {
          const recheckShop = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;
            const { data } = await supabase.from("shops").select("id").eq("user_id", user.id).limit(1);
            if (data && data.length > 0) setUserShopId(data[0].id);
          };
          recheckShop();
        }
      }} />
    </div>
  );
};

export default ShopDashboard;