import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Search, Navigation, Loader2 } from "lucide-react";
import { useShops } from "@/hooks/useShops";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface FindShopsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectShop?: (shop: any) => void;
}

export const FindShopsModal = ({ open, onOpenChange, onSelectShop }: FindShopsModalProps) => {
  const { searchNearbyShops } = useShops();
  const [isLoading, setIsLoading] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        setSearchQuery(`Near your location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`);
        setIsLocating(false);
        toast.success("Location detected! Click Search to find nearby shops.");
      },
      (error) => {
        setIsLocating(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            toast.error("Location permission denied. Please enable location access.");
            break;
          case error.POSITION_UNAVAILABLE:
            toast.error("Location information unavailable.");
            break;
          case error.TIMEOUT:
            toast.error("Location request timed out.");
            break;
          default:
            toast.error("Unable to get your location.");
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleSearch = async () => {
    setIsLoading(true);
    const shops = await searchNearbyShops(userLocation?.lat, userLocation?.lng);
    
    // Sort by distance if user location is available
    if (userLocation && shops) {
      shops.sort((a: any, b: any) => {
        const distA = calculateDistance(userLocation.lat, userLocation.lng, a.location_lat || 0, a.location_lng || 0);
        const distB = calculateDistance(userLocation.lat, userLocation.lng, b.location_lat || 0, b.location_lng || 0);
        return distA - distB;
      });
    }
    
    setResults(shops || []);
    setIsLoading(false);
  };

  // Haversine formula to calculate distance between two points
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radius of Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const getDistanceText = (shop: any) => {
    if (!userLocation || !shop.location_lat || !shop.location_lng) return null;
    const distance = calculateDistance(
      userLocation.lat, 
      userLocation.lng, 
      shop.location_lat, 
      shop.location_lng
    );
    return distance < 1 ? `${(distance * 1000).toFixed(0)}m away` : `${distance.toFixed(1)}km away`;
  };

  const handleSelectShop = (shop: any) => {
    if (onSelectShop) {
      onSelectShop(shop);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            Find Fertilizer Shops Near You
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex flex-col gap-3">
            <div className="flex gap-2">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter location or pincode"
                className="flex-1"
              />
              <Button onClick={handleSearch} disabled={isLoading}>
                <Search className="w-4 h-4 mr-2" />
                {isLoading ? "Searching..." : "Search"}
              </Button>
            </div>
            <Button 
              variant="outline" 
              onClick={getCurrentLocation} 
              disabled={isLocating}
              className="w-full gap-2"
            >
              {isLocating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Detecting location...
                </>
              ) : (
                <>
                  <Navigation className="w-4 h-4" />
                  Use My Current Location
                </>
              )}
            </Button>
          </div>

          {results.length > 0 && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                {results.length} shops found
                {userLocation && " • Sorted by distance"}
              </p>
              {results.map((shop) => {
                const distanceText = getDistanceText(shop);
                return (
                  <div key={shop.id} className="p-4 bg-muted/50 rounded-xl border border-border">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-foreground">{shop.name}</h3>
                          {distanceText && (
                            <Badge variant="secondary" className="text-xs">
                              {distanceText}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3" />
                          {shop.address}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">📞 {shop.phone}</p>
                        {shop.shop_inventory?.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {shop.shop_inventory.map((inv: any, idx: number) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {inv.products?.name}: {inv.quantity} bags
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button size="sm" onClick={() => handleSelectShop(shop)}>
                          Book Now
                        </Button>
                        <Button size="sm" variant="outline" asChild>
                          <a href={`tel:${shop.phone}`}>Call</a>
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {results.length === 0 && !isLoading && (
            <div className="text-center py-8 text-muted-foreground">
              <MapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Enter your location and search to find nearby shops</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
