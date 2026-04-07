import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDealers } from "@/hooks/useDealers";
import { useShops } from "@/hooks/useShops";
import { Building, MapPin, Phone, Package, Store, Search, Mail, TrendingUp, UserPlus, Filter } from "lucide-react";
import { DealerDetailsModal } from "./DealerDetailsModal";

interface DealerManagementModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const DealerManagementModal = ({ open, onOpenChange }: DealerManagementModalProps) => {
  const { dealers } = useDealers();
  const { shops } = useShops();
  const [selectedDealer, setSelectedDealer] = useState<any>(null);
  const [showDealerDetails, setShowDealerDetails] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRegion, setFilterRegion] = useState<string>("");

  const getDealerShops = (dealerId: string) => {
    return shops.filter(shop => shop.dealer_id === dealerId);
  };

  const uniqueRegions = [...new Set(dealers.map(d => d.region))];

  const filteredDealers = dealers.filter(dealer => {
    const matchesSearch = dealer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         dealer.region.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRegion = !filterRegion || dealer.region === filterRegion;
    return matchesSearch && matchesRegion;
  });

  const totalInventory = dealers.reduce((sum, d) => sum + (d.total_inventory || 0), 0);
  const totalShops = shops.filter(s => s.dealer_id).length;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building className="w-5 h-5 text-primary" />
              Dealer Management
            </DialogTitle>
          </DialogHeader>

          {/* Summary Stats */}
          <div className="grid grid-cols-4 gap-4 mb-4">
            <div className="bg-muted/50 rounded-xl p-3 text-center">
              <p className="text-xl font-bold text-primary">{dealers.length}</p>
              <p className="text-xs text-muted-foreground">Total Dealers</p>
            </div>
            <div className="bg-muted/50 rounded-xl p-3 text-center">
              <p className="text-xl font-bold text-accent">{uniqueRegions.length}</p>
              <p className="text-xs text-muted-foreground">Regions</p>
            </div>
            <div className="bg-muted/50 rounded-xl p-3 text-center">
              <p className="text-xl font-bold text-secondary">{totalShops}</p>
              <p className="text-xs text-muted-foreground">Linked Shops</p>
            </div>
            <div className="bg-muted/50 rounded-xl p-3 text-center">
              <p className="text-xl font-bold text-primary">{totalInventory.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Total Inventory</p>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search dealers by name or region..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={filterRegion}
              onChange={(e) => setFilterRegion(e.target.value)}
              className="px-3 py-2 rounded-md border border-input bg-background text-sm"
            >
              <option value="">All Regions</option>
              {uniqueRegions.map(region => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
          </div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All Dealers ({filteredDealers.length})</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-3 mt-4">
              {filteredDealers.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Building className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No dealers found</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredDealers.map((dealer) => {
                    const dealerShops = getDealerShops(dealer.id);
                    return (
                      <div key={dealer.id} className="p-4 bg-muted/50 rounded-xl border border-border hover:border-primary/50 transition-colors">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold">{dealer.name}</h3>
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {dealer.region}
                            </p>
                          </div>
                          <Badge variant="default" className="bg-primary">Active</Badge>
                        </div>
                        <div className="grid grid-cols-4 gap-4 text-sm mb-3">
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-muted-foreground" />
                            <span className="truncate">{dealer.phone || "N/A"}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-muted-foreground" />
                            <span className="truncate">{dealer.email || "N/A"}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Package className="w-4 h-4 text-muted-foreground" />
                            <span>{dealer.total_inventory || 0} bags</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Store className="w-4 h-4 text-muted-foreground" />
                            <span>{dealerShops.length} shops</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            onClick={() => {
                              setSelectedDealer(dealer);
                              setShowDealerDetails(true);
                            }}
                          >
                            View Details
                          </Button>
                          {dealer.phone ? (
                            <Button size="sm" variant="outline" asChild>
                              <a href={`tel:${dealer.phone}`}>Call</a>
                            </Button>
                          ) : (
                            <Button size="sm" variant="outline" disabled>
                              Call
                            </Button>
                          )}
                          {dealer.email ? (
                            <Button size="sm" variant="outline" asChild>
                              <a href={`mailto:${dealer.email}`}>Email</a>
                            </Button>
                          ) : (
                            <Button size="sm" variant="outline" disabled>
                              Email
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </TabsContent>

            <TabsContent value="active" className="mt-4">
              <div className="space-y-3">
                {filteredDealers.filter(d => d.total_inventory && d.total_inventory > 0).map((dealer) => {
                  const dealerShops = getDealerShops(dealer.id);
                  return (
                    <div key={dealer.id} className="p-4 bg-muted/50 rounded-xl border border-border">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Building className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{dealer.name}</h3>
                            <p className="text-sm text-muted-foreground">{dealer.region}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="font-bold text-primary">{dealer.total_inventory} bags</p>
                            <p className="text-xs text-muted-foreground">{dealerShops.length} shops</p>
                          </div>
                          <Button size="sm" variant="outline" onClick={() => {
                            setSelectedDealer(dealer);
                            setShowDealerDetails(true);
                          }}>
                            Manage
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="performance" className="mt-4">
              <div className="space-y-4">
                <div className="bg-muted/50 rounded-xl p-4">
                  <h4 className="font-semibold flex items-center gap-2 mb-4">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    Top Performers by Region
                  </h4>
                  <div className="space-y-3">
                    {uniqueRegions.slice(0, 5).map((region, index) => {
                      const regionDealers = dealers.filter(d => d.region === region);
                      const regionInventory = regionDealers.reduce((sum, d) => sum + (d.total_inventory || 0), 0);
                      return (
                        <div key={region} className="flex items-center justify-between p-3 bg-background rounded-lg">
                          <div className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">
                              {index + 1}
                            </span>
                            <div>
                              <p className="font-medium">{region}</p>
                              <p className="text-xs text-muted-foreground">{regionDealers.length} dealers</p>
                            </div>
                          </div>
                          <Badge variant="secondary">{regionInventory.toLocaleString()} bags</Badge>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      <DealerDetailsModal 
        open={showDealerDetails} 
        onOpenChange={setShowDealerDetails} 
        dealer={selectedDealer} 
      />
    </>
  );
};
