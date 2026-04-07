import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  BarChart3,
  Building,
  ClipboardList,
  Info,
  Globe,
  IndianRupee,
  MapPin,
  Package,
  Phone,
  Plus,
  Star,
  Trash2,
  UserPlus,
  Users,
} from "lucide-react";
import { AnalyticsReportModal } from "@/components/modals/AnalyticsReportModal";
import { AddDealerToStateModal } from "@/components/modals/AddDealerToStateModal";
import { AddProductionBatchModal } from "@/components/modals/AddProductionBatchModal";
import { DealerDetailsModal } from "@/components/modals/DealerDetailsModal";
import { DealerManagementModal } from "@/components/modals/DealerManagementModal";
import { StateExpansionModal } from "@/components/modals/StateExpansionModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CompanyMarketCoverageState,
  CompanyTopDealer,
  useCompanyDashboard,
} from "@/hooks/useCompanyDashboard";
import StatCard from "./StatCard";

type StateData = CompanyMarketCoverageState;

const sampleMonthlyProduction = [
  { name: "NPK 20:20:20", produced: 45000, distributed: 42500, growth: 8 },
  { name: "Urea 46%", produced: 38000, distributed: 35200, growth: 12 },
  { name: "DAP", produced: 52000, distributed: 48900, growth: 5 },
];

const sampleTopDealers: CompanyTopDealer[] = [
  { id: "sample-1", name: "AP Fertilizer Hub", region: "Andhra Pradesh", volume: "12,500 bags", revenue: "Rs1.2Cr", efficiency: 95, phone: null, email: null },
  { id: "sample-2", name: "Brijesh", region: "Arunachal Pradesh", volume: "9,800 bags", revenue: "Rs94.5L", efficiency: 95, phone: null, email: null },
  { id: "sample-3", name: "Punjab Crop Solutions", region: "Punjab", volume: "15,200 bags", revenue: "Rs1.4Cr", efficiency: 95, phone: null, email: null },
];

const sampleMarketCoverage: CompanyMarketCoverageState[] = [
  { id: "state-1", state: "Maharashtra", coverage: 95, dealers: 42, shops: 1250 },
  { id: "state-2", state: "Punjab", coverage: 88, dealers: 28, shops: 890 },
  { id: "state-3", state: "Uttar Pradesh", coverage: 78, dealers: 35, shops: 1560 },
];

const CompanyDashboard = () => {
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showDealerMgmt, setShowDealerMgmt] = useState(false);
  const [showAddBatch, setShowAddBatch] = useState(false);
  const [selectedDealer, setSelectedDealer] = useState<CompanyTopDealer | null>(null);
  const [showDealerDetails, setShowDealerDetails] = useState(false);
  const [selectedState, setSelectedState] = useState<StateData | null>(null);
  const [showStateExpansion, setShowStateExpansion] = useState(false);
  const [showAddState, setShowAddState] = useState(false);
  const [showAddDealerToState, setShowAddDealerToState] = useState(false);
  const [newState, setNewState] = useState({ state: "", coverage: "", dealers: "", shops: "" });
  const {
    loading,
    companyProfileMissing,
    stats,
    monthlyProduction,
    marketCoverage,
    topDealers,
    addState,
    deleteState,
    fetchDashboard,
  } = useCompanyDashboard();
  const navigate = useNavigate();
  const productionItems = monthlyProduction.length > 0 ? monthlyProduction : sampleMonthlyProduction;
  const dealerItems = topDealers.length > 0 ? topDealers : sampleTopDealers;
  const coverageItems = marketCoverage.length > 0 ? marketCoverage : sampleMarketCoverage;
  const usingSampleCoverage = marketCoverage.length === 0;

  const handleAddState = async () => {
    if (!newState.state.trim()) {
      toast.error("State name is required");
      return;
    }

    if (marketCoverage.some((s) => s.state.toLowerCase() === newState.state.trim().toLowerCase())) {
      toast.error("This state already exists");
      return;
    }

    const created = await addState({
      state: newState.state.trim(),
      coverage: Number(newState.coverage) || 0,
      dealers: Number(newState.dealers) || 0,
      shops: Number(newState.shops) || 0,
    });

    if (!created) return;

    setNewState({ state: "", coverage: "", dealers: "", shops: "" });
    setShowAddState(false);
    toast.success(`${newState.state.trim()} added to market coverage`);
  };

  const formatCompactCurrency = (value: number) => {
    if (value >= 10_000_000) {
      return `Rs${(value / 10_000_000).toFixed(1)}Cr`;
    }

    if (value >= 100_000) {
      return `Rs${(value / 100_000).toFixed(1)}L`;
    }

    return `Rs${value.toLocaleString("en-IN")}`;
  };

  return (
    <div className="space-y-6">
      <section className="section-shell relative overflow-hidden p-6 md:p-8">
        <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-primary/10 to-transparent" />
        <div className="relative grid gap-6 lg:grid-cols-[1.3fr_0.8fr] lg:items-end">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/60 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground backdrop-blur-xl">
              <Building className="h-3.5 w-3.5 text-primary" />
              Company command center
            </div>
            <div className="space-y-2">
              <h1 className="display-font text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                Production, coverage, and dealer momentum in one view.
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
                A refined operations surface for fertilizer companies to track output, strengthen dealer networks, and expand market reach.
              </p>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            {[
              { label: "States tracked", value: stats.statesTracked.toString() },
              { label: "Dealer network", value: stats.dealerNetwork.toString() },
              { label: "Monthly uplift", value: `${stats.monthlyUplift >= 0 ? "+" : ""}${stats.monthlyUplift}%` },
            ].map((item) => (
              <div key={item.label} className="rounded-[24px] border border-white/60 bg-white/60 p-4 backdrop-blur-xl">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{item.label}</p>
                <p className="mt-2 text-2xl font-extrabold text-foreground">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          title="Total Production"
          value={`${stats.totalProduction.toLocaleString("en-IN")} bags`}
          change={`${stats.totalProductionChange >= 0 ? "+" : ""}${stats.totalProductionChange.toLocaleString("en-IN")}`}
          trend={stats.totalProductionChange >= 0 ? "up" : "down"}
          icon={Package}
          iconColor="text-primary"
        />
        <StatCard
          title="Active Dealers"
          value={stats.activeDealers.toString()}
          change={`${stats.activeDealersChange >= 0 ? "+" : ""}${stats.activeDealersChange}`}
          trend={stats.activeDealersChange >= 0 ? "up" : "down"}
          icon={Users}
          iconColor="text-accent"
        />
        <StatCard
          title="Market Coverage"
          value={`${stats.marketCoverage}%`}
          change={`${stats.marketCoverageChange >= 0 ? "+" : ""}${stats.marketCoverageChange}%`}
          trend={stats.marketCoverageChange >= 0 ? "up" : "down"}
          icon={Globe}
          iconColor="text-secondary"
        />
        <StatCard
          title="Revenue (Month)"
          value={formatCompactCurrency(stats.monthlyRevenue)}
          change={`${stats.revenueGrowth >= 0 ? "+" : ""}${stats.revenueGrowth}%`}
          trend={stats.revenueGrowth >= 0 ? "up" : "down"}
          icon={IndianRupee}
          iconColor="text-primary"
        />
      </div>

      <div className="section-shell p-6">
        <div className="mb-5">
          <h2 className="text-lg font-bold text-foreground">Company Operations</h2>
          <p className="text-sm text-muted-foreground">Quick actions for production, analytics, dealer growth, and demo follow-up.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button className="gap-2" onClick={() => setShowAddBatch(true)}>
            <Plus className="w-4 h-4" />
            Add Production Batch
          </Button>
          <Button variant="outline" className="gap-2" onClick={() => setShowAnalytics(true)}>
            <BarChart3 className="w-4 h-4" />
            Analytics Report
          </Button>
          <Button variant="outline" className="gap-2" onClick={() => setShowDealerMgmt(true)}>
            <Building className="w-4 h-4" />
            Dealer Management
          </Button>
          <Button variant="outline" className="gap-2" onClick={() => setShowAddDealerToState(true)}>
            <UserPlus className="w-4 h-4" />
            Add Dealer to State
          </Button>
          <Button variant="outline" className="gap-2" onClick={() => navigate("/admin/demo-requests")}>
            <ClipboardList className="w-4 h-4" />
            Demo Requests
          </Button>
        </div>
      </div>

      {companyProfileMissing && (
        <div className="section-shell p-6">
          <div className="flex items-start gap-3">
            <Info className="mt-0.5 h-5 w-5 text-primary" />
            <div>
              <h2 className="text-lg font-bold text-foreground">Company Setup Needed</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Your account has company access, but no company profile record is available yet. Dashboard actions like adding states will stay limited until the latest Supabase migration is applied or your company profile is created.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="section-shell p-6">
          <div className="mb-4 flex items-center gap-2">
            <Package className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground">Monthly Production</h2>
          </div>
          <div className="space-y-5">
            {productionItems.map((item) => (
              <div key={item.name} className="rounded-[24px] border border-white/60 bg-white/60 p-4 backdrop-blur-xl">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">{item.name}</h3>
                  <Badge variant="default" className="bg-primary">
                    {item.growth >= 0 ? "+" : ""}
                    {item.growth}%
                  </Badge>
                </div>
                <div className="mb-4 h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="gradient-hero h-full rounded-full"
                    style={{ width: `${item.produced > 0 ? Math.min((item.distributed / item.produced) * 100, 100) : 0}%` }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-center">
                    <p className="font-bold text-primary">{(item.produced / 1000).toFixed(0)}K</p>
                    <p className="text-xs text-muted-foreground">Produced</p>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-accent">{(item.distributed / 1000).toFixed(1)}K</p>
                    <p className="text-xs text-muted-foreground">Distributed</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="section-shell p-6">
          <div className="mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-secondary" />
            <h2 className="text-lg font-bold text-foreground">Top Performing Dealers</h2>
          </div>
          <div className="space-y-4">
            {dealerItems.map((dealer) => (
              <div key={dealer.id} className="rounded-[24px] border border-white/60 bg-white/60 p-4 backdrop-blur-xl">
                <div className="mb-2 flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground">{dealer.name}</h3>
                    <p className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      {dealer.region}
                    </p>
                  </div>
                  <Badge variant="default" className="bg-accent">
                    {dealer.efficiency || 95}%
                  </Badge>
                </div>
                <div className="mb-3 grid grid-cols-2 gap-3 rounded-2xl bg-background/70 p-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Volume</p>
                    <p className="font-semibold text-foreground">{dealer.volume || "Live data"}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Revenue</p>
                    <p className="font-semibold text-foreground">{dealer.revenue || "Rs0"}</p>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <Button size="sm" className="flex-1" onClick={() => { setSelectedDealer(dealer); setShowDealerDetails(true); }}>
                    View Details
                  </Button>
                  {dealer.phone ? (
                    <Button size="sm" variant="outline" asChild>
                      <a href={`tel:${dealer.phone}`}>
                        <Phone className="w-4 h-4" />
                      </a>
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline" disabled>
                      <Phone className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="section-shell p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground">Market Coverage Analysis</h2>
          </div>
          <Button size="sm" className="gap-2" onClick={() => setShowAddState(true)}>
            <Plus className="w-4 h-4" />
            Add State
          </Button>
        </div>
        <div className="space-y-4">
          {coverageItems.map((state) => (
            <div key={state.state} className="rounded-[24px] border border-white/60 bg-white/60 p-4 backdrop-blur-xl">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-foreground">{state.state}</h3>
                  <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Market penetration</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedState(state);
                      setShowStateExpansion(true);
                    }}
                  >
                    Expand
                  </Button>
                  {!usingSampleCoverage && (
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => void deleteState(state.id)}
                      aria-label={`Delete ${state.state}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
              <div className="mb-4 h-2 overflow-hidden rounded-full bg-muted">
                <div className="gradient-hero h-full rounded-full" style={{ width: `${state.coverage}%` }} />
              </div>
              <div className="flex items-center justify-between gap-4 text-sm">
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Coverage</p>
                  <p className="font-bold text-primary">{state.coverage}%</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-accent">{state.dealers}</p>
                  <p className="text-xs text-muted-foreground">Dealers</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-secondary">{state.shops}</p>
                  <p className="text-xs text-muted-foreground">Shops</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AnalyticsReportModal open={showAnalytics} onOpenChange={setShowAnalytics} />
      <DealerManagementModal open={showDealerMgmt} onOpenChange={setShowDealerMgmt} />
      <DealerDetailsModal open={showDealerDetails} onOpenChange={setShowDealerDetails} dealer={selectedDealer} />
      <AddProductionBatchModal open={showAddBatch} onOpenChange={setShowAddBatch} onBatchCreated={fetchDashboard} />
      <StateExpansionModal open={showStateExpansion} onOpenChange={setShowStateExpansion} stateData={selectedState} />
      <AddDealerToStateModal open={showAddDealerToState} onOpenChange={setShowAddDealerToState} />

      <Dialog open={showAddState} onOpenChange={setShowAddState}>
        <DialogContent className="max-w-md border-white/60 bg-white/85 backdrop-blur-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-primary" />
              Add New State
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="stateName">State Name *</Label>
              <Input
                id="stateName"
                placeholder="e.g. Rajasthan"
                value={newState.state}
                onChange={(e) => setNewState((prev) => ({ ...prev, state: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label htmlFor="coverage">Coverage %</Label>
                <Input
                  id="coverage"
                  type="number"
                  placeholder="0"
                  min="0"
                  max="100"
                  value={newState.coverage}
                  onChange={(e) => setNewState((prev) => ({ ...prev, coverage: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="dealers">Dealers</Label>
                <Input
                  id="dealers"
                  type="number"
                  placeholder="0"
                  min="0"
                  value={newState.dealers}
                  onChange={(e) => setNewState((prev) => ({ ...prev, dealers: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="shops">Shops</Label>
                <Input
                  id="shops"
                  type="number"
                  placeholder="0"
                  min="0"
                  value={newState.shops}
                  onChange={(e) => setNewState((prev) => ({ ...prev, shops: e.target.value }))}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setShowAddState(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddState}>Add State</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {loading && <p className="text-sm text-muted-foreground">Loading company dashboard...</p>}
    </div>
  );
};

export default CompanyDashboard;
