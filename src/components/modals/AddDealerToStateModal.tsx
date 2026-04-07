import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { UserPlus, MapPin, Truck } from "lucide-react";
import { toast } from "sonner";
import { useDealers } from "@/hooks/useDealers";
import { ensureCompanyProfile } from "@/lib/companyProfile.ts";

const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

interface AddDealerToStateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddDealerToStateModal = ({ open, onOpenChange }: AddDealerToStateModalProps) => {
  const getErrorMessage = (error: unknown) => (error instanceof Error ? error.message : "Unknown error");
  const { dealers, fetchDealers } = useDealers();
  const [mode, setMode] = useState<"new" | "existing">("new");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedState, setSelectedState] = useState("");
  const [selectedDealerId, setSelectedDealerId] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    requirements: "",
  });

  const stateDealers = dealers.filter(d =>
    d.region.toLowerCase().includes(selectedState.toLowerCase())
  );
  const availableExistingDealers = useMemo(
    () => dealers.filter((dealer) => !selectedState || !dealer.region.toLowerCase().includes(selectedState.toLowerCase())),
    [dealers, selectedState],
  );

  useEffect(() => {
    if (open) {
      void fetchDealers();
    }
  }, [open, fetchDealers]);

  const handleSubmitNew = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedState) {
      toast.error("Please select a state");
      return;
    }
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Create new dealer for the state
      const { data: dealer, error: dealerError } = await supabase
        .from("dealers")
        .insert({
          name: formData.name,
          region: selectedState,
          phone: formData.phone || null,
          email: formData.email || null,
          address: formData.address || null,
          user_id: user.id,
        })
        .select()
        .single();

      if (dealerError) throw dealerError;

      // Link to company
      const company = await ensureCompanyProfile(user.id);

      if (company && dealer) {
        await supabase.from("company_dealers").insert({
          company_id: company.id,
          dealer_id: dealer.id,
        });
      }

      toast.success(`Dealer "${formData.name}" added to ${selectedState}`);
      resetForm();
      onOpenChange(false);
      fetchDealers();
    } catch (error: unknown) {
      toast.error("Failed to add dealer: " + getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssignExisting = async () => {
    if (!selectedState || !selectedDealerId) {
      toast.error("Please select a state and dealer");
      return;
    }
    setIsLoading(true);
    try {
      // Update dealer's region
      const { error } = await supabase
        .from("dealers")
        .update({ region: selectedState })
        .eq("id", selectedDealerId);

      if (error) throw error;

      const dealer = dealers.find(d => d.id === selectedDealerId);
      toast.success(`${dealer?.name} assigned to ${selectedState}`);
      resetForm();
      onOpenChange(false);
      fetchDealers();
    } catch (error: unknown) {
      toast.error("Failed to assign dealer: " + getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: "", phone: "", email: "", address: "", requirements: "" });
    setSelectedState("");
    setSelectedDealerId("");
    setMode("new");
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) resetForm(); }}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-primary" />
            Add Dealer to State
          </DialogTitle>
          <DialogDescription>
            Register a new dealer or assign an existing one to a state based on requirements.
          </DialogDescription>
        </DialogHeader>

        {/* State Selection */}
        <div className="space-y-2">
          <Label>Select State *</Label>
          <Select value={selectedState} onValueChange={setSelectedState}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a state" />
            </SelectTrigger>
            <SelectContent>
              {indianStates.map(state => (
                <SelectItem key={state} value={state}>
                  <span className="flex items-center gap-2">
                    <MapPin className="w-3 h-3" /> {state}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Show existing dealers in selected state */}
        {selectedState && stateDealers.length > 0 && (
          <div className="p-3 bg-muted/50 rounded-xl border border-border">
            <p className="text-sm font-medium mb-2">
              Current dealers in {selectedState}:
            </p>
            <div className="flex flex-wrap gap-2">
              {stateDealers.map(d => (
                <Badge key={d.id} variant="secondary">{d.name}</Badge>
              ))}
            </div>
          </div>
        )}

        {/* Mode Toggle */}
        <div className="flex gap-2">
          <Button
            variant={mode === "new" ? "default" : "outline"}
            size="sm"
            className="flex-1"
            onClick={() => setMode("new")}
          >
            <UserPlus className="w-4 h-4 mr-1" /> New Dealer
          </Button>
          <Button
            variant={mode === "existing" ? "default" : "outline"}
            size="sm"
            className="flex-1"
            onClick={() => setMode("existing")}
          >
            <Truck className="w-4 h-4 mr-1" /> Existing Dealer
          </Button>
        </div>

        {mode === "new" ? (
          <form onSubmit={handleSubmitNew} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="dl-name">Dealer/Business Name *</Label>
              <Input
                id="dl-name"
                value={formData.name}
                onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                placeholder="e.g. Rajasthan Agri Distributors"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="dl-phone">Phone</Label>
                <Input
                  id="dl-phone"
                  value={formData.phone}
                  onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
                  placeholder="+91 98765 43210"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dl-email">Email</Label>
                <Input
                  id="dl-email"
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                  placeholder="dealer@email.com"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dl-address">Address</Label>
              <Input
                id="dl-address"
                value={formData.address}
                onChange={e => setFormData(p => ({ ...p, address: e.target.value }))}
                placeholder="Business address in the state"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dl-req">Requirements / Notes</Label>
              <Textarea
                id="dl-req"
                value={formData.requirements}
                onChange={e => setFormData(p => ({ ...p, requirements: e.target.value }))}
                placeholder="e.g. Need 5000 bags/month of DAP, warehouse capacity 10,000 bags"
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit" disabled={isLoading || !selectedState}>
                {isLoading ? "Adding..." : "Add Dealer"}
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Select Dealer to Assign</Label>
              <Select value={selectedDealerId} onValueChange={setSelectedDealerId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a dealer" />
                </SelectTrigger>
                <SelectContent>
                  {availableExistingDealers.length > 0 ? (
                    availableExistingDealers.map((dealer) => (
                      <SelectItem key={dealer.id} value={dealer.id}>
                        {dealer.name} - {dealer.region}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="__no_dealer__" disabled>
                      No available dealers to assign
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            {availableExistingDealers.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Create a new dealer first, or choose a different state to reassign an existing dealer.
              </p>
            )}
            {selectedDealerId && (
              <div className="p-3 bg-muted/50 rounded-xl border border-border text-sm">
                {(() => {
                  const d = dealers.find(dl => dl.id === selectedDealerId);
                  return d ? (
                    <div className="space-y-1">
                      <p className="font-semibold">{d.name}</p>
                      <p className="text-muted-foreground">Current Region: {d.region}</p>
                      <p className="text-muted-foreground">Inventory: {d.total_inventory || 0} bags</p>
                      {d.phone && <p className="text-muted-foreground">Phone: {d.phone}</p>}
                    </div>
                  ) : null;
                })()}
              </div>
            )}
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button onClick={handleAssignExisting} disabled={isLoading || !selectedState || !selectedDealerId}>
                {isLoading ? "Assigning..." : "Assign to State"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
