import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Globe, MapPin, Building, Store, TrendingUp, Phone, Mail, Package, Users, Plus, Trash2 } from "lucide-react";
import { useDealers } from "@/hooks/useDealers";
import { useDistricts } from "@/hooks/useDistricts";

interface StateData {
  state: string;
  coverage: number;
  dealers: number;
  shops: number;
}

interface StateExpansionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stateData: StateData | null;
}

export const StateExpansionModal = ({ open, onOpenChange, stateData }: StateExpansionModalProps) => {
  const { dealers } = useDealers();
  const { districts, loading: districtsLoading, addDistrict, deleteDistrict } = useDistricts(stateData?.state);
  const [showAddDistrict, setShowAddDistrict] = useState(false);
  const [newDistrict, setNewDistrict] = useState({ name: "", coverage: "", dealers: "", shops: "" });
  const [isAdding, setIsAdding] = useState(false);

  if (!stateData) return null;

  const stateDealers = dealers.filter(d => d.region.toLowerCase().includes(stateData.state.toLowerCase()));
  const estimatedRevenueLakhs = stateData.shops * 80;
  const growthRate = Math.min(100, Math.max(0, Math.round((stateData.coverage + stateData.dealers * 2) / 5)));
  const targetAchievement = Math.min(100, Math.round(stateData.coverage * 0.95));

  const handleAddDistrict = async () => {
    if (!newDistrict.name.trim()) return;
    setIsAdding(true);
    const success = await addDistrict({
      state_name: stateData.state,
      district_name: newDistrict.name.trim(),
      coverage: Number(newDistrict.coverage) || 0,
      dealers_count: Number(newDistrict.dealers) || 0,
      shops_count: Number(newDistrict.shops) || 0,
    });
    if (success) {
      setNewDistrict({ name: "", coverage: "", dealers: "", shops: "" });
      setShowAddDistrict(false);
    }
    setIsAdding(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-primary" />
            {stateData.state} - Market Analysis
          </DialogTitle>
        </DialogHeader>

        {/* State Summary */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-muted/50 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-primary">{stateData.coverage}%</p>
            <p className="text-xs text-muted-foreground">Coverage</p>
          </div>
          <div className="bg-muted/50 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-accent">{stateData.dealers}</p>
            <p className="text-xs text-muted-foreground">Dealers</p>
          </div>
          <div className="bg-muted/50 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-secondary">{stateData.shops}</p>
            <p className="text-xs text-muted-foreground">Shops</p>
          </div>
          <div className="bg-muted/50 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-primary">{districts.length}</p>
            <p className="text-xs text-muted-foreground">Districts</p>
          </div>
        </div>

        <Tabs defaultValue="districts" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="districts">Districts</TabsTrigger>
            <TabsTrigger value="dealers">Dealers</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="districts" className="space-y-3 mt-4">
            {/* Add District Button */}
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                {districts.length} district{districts.length !== 1 ? "s" : ""} registered
              </p>
              <Button size="sm" className="gap-1" onClick={() => setShowAddDistrict(!showAddDistrict)}>
                <Plus className="w-4 h-4" />Add District
              </Button>
            </div>

            {/* Add District Form */}
            {showAddDistrict && (
              <div className="p-4 bg-muted/50 rounded-xl border-2 border-primary/30 space-y-3">
                <h4 className="font-semibold text-sm">Add New District to {stateData.state}</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="dist-name" className="text-xs">District Name *</Label>
                    <Input
                      id="dist-name"
                      placeholder="e.g. Pune"
                      value={newDistrict.name}
                      onChange={e => setNewDistrict(p => ({ ...p, name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="dist-cov" className="text-xs">Coverage %</Label>
                    <Input
                      id="dist-cov"
                      type="number"
                      placeholder="0"
                      min="0"
                      max="100"
                      value={newDistrict.coverage}
                      onChange={e => setNewDistrict(p => ({ ...p, coverage: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="dist-dealers" className="text-xs">Dealers</Label>
                    <Input
                      id="dist-dealers"
                      type="number"
                      placeholder="0"
                      min="0"
                      value={newDistrict.dealers}
                      onChange={e => setNewDistrict(p => ({ ...p, dealers: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="dist-shops" className="text-xs">Shops</Label>
                    <Input
                      id="dist-shops"
                      type="number"
                      placeholder="0"
                      min="0"
                      value={newDistrict.shops}
                      onChange={e => setNewDistrict(p => ({ ...p, shops: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button size="sm" variant="outline" onClick={() => setShowAddDistrict(false)}>Cancel</Button>
                  <Button size="sm" onClick={handleAddDistrict} disabled={isAdding || !newDistrict.name.trim()}>
                    {isAdding ? "Adding..." : "Add District"}
                  </Button>
                </div>
              </div>
            )}

            {/* District List */}
            {districtsLoading ? (
              <p className="text-sm text-muted-foreground text-center py-8">Loading districts...</p>
            ) : districts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No districts added yet. Click "Add District" to get started.</p>
              </div>
            ) : (
              districts.map((district) => (
                <div
                  key={district.id}
                  className="p-4 bg-muted/50 rounded-xl border border-border hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      <h3 className="font-semibold">{district.district_name}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={district.coverage >= 90 ? "default" : district.coverage >= 75 ? "secondary" : "outline"}>
                        {district.coverage}% Coverage
                      </Badge>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-destructive hover:text-destructive"
                        onClick={() => deleteDistrict(district.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  <Progress value={district.coverage} className="h-2 mb-3" />
                  <div className="flex gap-6 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Building className="w-3 h-3" />
                      {district.dealers_count} Dealers
                    </span>
                    <span className="flex items-center gap-1">
                      <Store className="w-3 h-3" />
                      {district.shops_count} Shops
                    </span>
                  </div>
                </div>
              ))
            )}
          </TabsContent>

          <TabsContent value="dealers" className="space-y-3 mt-4">
            {stateDealers.length > 0 ? stateDealers.map((dealer) => (
              <div key={dealer.id} className="p-4 bg-muted/50 rounded-xl border border-border">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold">{dealer.name}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {dealer.region}
                    </p>
                  </div>
                  <Badge className="bg-primary">Active</Badge>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm mt-3">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-muted-foreground" />
                    <span>{dealer.total_inventory || 0} bags</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span>{dealer.phone || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span>{dealer.email || "N/A"}</span>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
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
            )) : (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No dealers assigned to {stateData.state} yet.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="performance" className="mt-4">
            <div className="space-y-4">
              <div className="bg-muted/50 rounded-xl p-4">
                <h4 className="font-semibold flex items-center gap-2 mb-4">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  Monthly Performance
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-background rounded-lg">
                    <p className="text-2xl font-bold text-primary">Rs{estimatedRevenueLakhs.toLocaleString("en-IN")}L</p>
                    <p className="text-xs text-muted-foreground">Monthly Revenue</p>
                  </div>
                  <div className="text-center p-4 bg-background rounded-lg">
                    <p className="text-2xl font-bold text-accent">{(stateData.shops * 25).toLocaleString("en-IN")}</p>
                    <p className="text-xs text-muted-foreground">Bags Distributed</p>
                  </div>
                  <div className="text-center p-4 bg-background rounded-lg">
                    <p className="text-2xl font-bold text-secondary">+{growthRate}%</p>
                    <p className="text-xs text-muted-foreground">Growth Rate</p>
                  </div>
                  <div className="text-center p-4 bg-background rounded-lg">
                    <p className="text-2xl font-bold text-primary">{targetAchievement}%</p>
                    <p className="text-xs text-muted-foreground">Target Achievement</p>
                  </div>
                </div>
              </div>

              <div className="bg-muted/50 rounded-xl p-4">
                <h4 className="font-semibold flex items-center gap-2 mb-4">
                  <Users className="w-4 h-4 text-accent" />
                  Expansion Opportunities
                </h4>
                <div className="space-y-2 text-sm">
                  {districts.filter(d => d.coverage < 85).length > 0 ? (
                    districts.filter(d => d.coverage < 85).slice(0, 3).map(district => (
                      <div key={district.id} className="flex items-center justify-between p-2 bg-background rounded-lg">
                        <span>{district.district_name}</span>
                        <Badge variant="outline">{100 - district.coverage}% untapped</Badge>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-center py-2">Add districts to see expansion opportunities</p>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end mt-4">
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
