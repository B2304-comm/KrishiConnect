import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Package, Calendar, IndianRupee, Navigation, Bell, Phone, Star, QrCode, Brain } from "lucide-react";
import { useNavigate } from "react-router-dom";
import StatCard from "./StatCard";
import { FindShopsModal } from "@/components/modals/FindShopsModal";
import { StockAlertsModal } from "@/components/modals/StockAlertsModal";
import { BookingQRCode } from "@/components/booking/BookingQRCode";
import { useShops } from "@/hooks/useShops";
import { Booking, useBookings } from "@/hooks/useBookings";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
const FarmerDashboard = () => {
  const navigate = useNavigate();
  const [showFindShops, setShowFindShops] = useState(false);
  const [showAlerts, setShowAlerts] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const { shops } = useShops();
  const { bookings } = useBookings();

  const approvedShops = shops.filter(s => s.status === "approved").slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Nearby Shops" value={approvedShops.length.toString()} change="+2" trend="up" icon={MapPin} iconColor="text-primary" />
        <StatCard title="Available Stock" value="2,450 bags" change="+150" trend="up" icon={Package} iconColor="text-accent" />
        <StatCard title="My Bookings" value={bookings.length.toString()} change="0" trend="neutral" icon={Calendar} iconColor="text-secondary" />
        <StatCard title="Price Range" value="Rs850-950" change="Rs50" trend="up" icon={IndianRupee} iconColor="text-primary" />
      </div>

      <div className="bg-card rounded-xl p-6 border border-border shadow-soft">
        <div className="flex items-center gap-2 mb-4">
          <Navigation className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-bold text-foreground">Find Fertilizer Near You</h2>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button className="gap-2" onClick={() => setShowFindShops(true)}>
            <MapPin className="w-4 h-4" />
            Search by Location
          </Button>
          <Button variant="outline" className="gap-2" onClick={() => setShowAlerts(true)}>
            <Bell className="w-4 h-4" />
            Check Stock Alerts
          </Button>
        </div>
      </div>

      <div className="section-shell p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-2 flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-bold text-foreground">AI Crop Prediction</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              Open the dedicated AI page to upload a crop image, detect the likely crop, and get fertilizer type and quantity guidance for Indian farming conditions.
            </p>
          </div>
          <Button className="gap-2 self-start lg:self-auto" onClick={() => navigate("/crop-prediction")}>
            <Brain className="h-4 w-4" />
            Open AI Prediction
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 bg-card rounded-xl p-6 border border-border shadow-soft">
          <h2 className="text-lg font-bold text-foreground mb-4">Nearby Shops with Stock</h2>
          <div className="space-y-4">
            {approvedShops.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No shops found. Click "Search by Location" to find shops.</p>
            ) : (
              approvedShops.map((shop) => (
                <div key={shop.id} className="p-4 bg-muted/50 rounded-xl border border-border">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground">{shop.name}</h3>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-secondary text-secondary" />
                          <span className="text-sm text-muted-foreground">{shop.rating || 4.5}</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3" />
                        {shop.address}
                      </p>
                      <Badge variant="secondary" className="bg-primary/10 text-primary border-0 mt-2">
                        {shop.total_stock || 0} bags available
                      </Badge>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button size="sm" onClick={() => setShowFindShops(true)}>Book Now</Button>
                      <Button size="sm" variant="outline" asChild>
                        <a href={`tel:${shop.phone}`}><Phone className="w-4 h-4" /></a>
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="lg:col-span-2 bg-card rounded-xl p-6 border border-border shadow-soft">
          <h2 className="text-lg font-bold text-foreground mb-4">My Bookings</h2>
          <div className="space-y-4">
            {bookings.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No bookings yet</p>
            ) : (
              bookings.slice(0, 3).map((booking) => (
                <div key={booking.id} className="p-4 bg-muted/50 rounded-xl border border-border">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-foreground">Booking #{booking.booking_number}</p>
                      <p className="text-sm text-muted-foreground">{booking.shops?.name}</p>
                    </div>
                    <Badge variant={booking.status === "completed" ? "default" : "outline"}>{booking.status}</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Quantity:</p>
                      <p className="font-medium text-foreground">{booking.quantity} bags</p>
                    </div>
                    <div className="text-right">
                      <p className="text-muted-foreground">Total:</p>
                      <p className="font-medium text-accent">Rs{booking.total_amount.toLocaleString()}</p>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="w-full mt-3 gap-2"
                    onClick={() => setSelectedBooking(booking)}
                  >
                    <QrCode className="w-4 h-4" />
                    View QR Code
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <FindShopsModal open={showFindShops} onOpenChange={setShowFindShops} />
      <StockAlertsModal open={showAlerts} onOpenChange={setShowAlerts} />
      
      <Dialog open={!!selectedBooking} onOpenChange={(open) => !open && setSelectedBooking(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Booking QR Code</DialogTitle>
          </DialogHeader>
          {selectedBooking && (
            <BookingQRCode
              bookingNumber={selectedBooking.booking_number}
              productName={selectedBooking.products?.name || "Fertilizer"}
              quantity={selectedBooking.quantity}
              shopName={selectedBooking.shops?.name || "Shop"}
              pickupDate={selectedBooking.pickup_date}
              totalAmount={selectedBooking.total_amount}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FarmerDashboard;

