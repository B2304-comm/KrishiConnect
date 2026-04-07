import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ensureCompanyProfile, findCompanyProfile } from "@/lib/companyProfile.ts";

type CompanyRecord = {
  id: string;
  user_id: string;
  name?: string;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  created_at?: string;
};

type DealerRecord = {
  id: string;
  name: string;
  region: string;
  phone: string | null;
  email: string | null;
  total_inventory: number | null;
};

type ProductRecord = {
  id: string;
  name: string;
  base_price: number;
};

type DistributionRecord = {
  created_at: string;
  dealer_id: string;
  product_id: string;
  quantity: number;
  status: "pending" | "approved" | "shipped" | "delivered" | "rejected" | null;
};

type ProductionBatchRecord = {
  id: string;
  created_at: string;
  product_id: string;
  quantity: number;
};

export interface CompanyMonthlyProduction {
  name: string;
  produced: number;
  distributed: number;
  growth: number;
}

export interface CompanyMarketCoverageState {
  id: string;
  state: string;
  coverage: number;
  dealers: number;
  shops: number;
}

export interface CompanyTopDealer {
  id: string;
  name: string;
  region: string;
  phone: string | null;
  email: string | null;
  volume: string;
  revenue: string;
  efficiency: number;
}

export interface CompanyDashboardStats {
  totalProduction: number;
  totalProductionChange: number;
  activeDealers: number;
  activeDealersChange: number;
  marketCoverage: number;
  marketCoverageChange: number;
  monthlyRevenue: number;
  revenueGrowth: number;
  monthlyUplift: number;
  statesTracked: number;
  dealerNetwork: number;
}

type StateInput = {
  state: string;
  coverage: number;
  dealers: number;
  shops: number;
};

const EMPTY_COMPANY_STATS: CompanyDashboardStats = {
  totalProduction: 0,
  totalProductionChange: 0,
  activeDealers: 0,
  activeDealersChange: 0,
  marketCoverage: 0,
  marketCoverageChange: 0,
  monthlyRevenue: 0,
  revenueGrowth: 0,
  monthlyUplift: 0,
  statesTracked: 0,
  dealerNetwork: 0,
};

const monthKey = (value: string | Date) => {
  const date = new Date(value);
  return `${date.getFullYear()}-${date.getMonth()}`;
};

const formatCurrencyCompact = (value: number) => {
  if (value >= 10_000_000) {
    return `Rs${(value / 10_000_000).toFixed(1)}Cr`;
  }

  if (value >= 100_000) {
    return `Rs${(value / 100_000).toFixed(1)}L`;
  }

  return `Rs${value.toLocaleString("en-IN")}`;
};

const toPercentChange = (current: number, previous: number) => {
  if (previous <= 0) {
    return current > 0 ? 100 : 0;
  }

  return Math.round(((current - previous) / previous) * 100);
};

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error) {
    return error.message || fallback;
  }

  if (error && typeof error === "object") {
    const candidate = error as {
      message?: string;
      details?: string;
      hint?: string;
      code?: string;
    };

    if (candidate.message) {
      const extra = [candidate.details, candidate.hint].filter(Boolean).join(" ");
      return extra ? `${candidate.message} ${extra}`.trim() : candidate.message;
    }

    if (candidate.details) {
      return candidate.details;
    }

    if (candidate.hint) {
      return candidate.hint;
    }

    if (candidate.code) {
      return `Database error (${candidate.code})`;
    }
  }

  return fallback;
};

export const useCompanyDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [companyProfileMissing, setCompanyProfileMissing] = useState(false);
  const [stats, setStats] = useState<CompanyDashboardStats>(EMPTY_COMPANY_STATS);
  const [monthlyProduction, setMonthlyProduction] = useState<CompanyMonthlyProduction[]>([]);
  const [marketCoverage, setMarketCoverage] = useState<CompanyMarketCoverageState[]>([]);
  const [topDealers, setTopDealers] = useState<CompanyTopDealer[]>([]);

  const getCurrentCompany = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("Not authenticated");
    }

    return (await ensureCompanyProfile(user.id)) as CompanyRecord;
  }, []);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setCompanyProfileMissing(false);
        setStats(EMPTY_COMPANY_STATS);
        setMonthlyProduction([]);
        setMarketCoverage([]);
        setTopDealers([]);
        return;
      }

      const companyRecord = (await findCompanyProfile(user.id)) as CompanyRecord | null;

      if (!companyRecord) {
        setCompanyProfileMissing(true);
        setStats(EMPTY_COMPANY_STATS);
        setMonthlyProduction([]);
        setMarketCoverage([]);
        setTopDealers([]);
        return;
      }

      setCompanyProfileMissing(false);

      const [
        marketCoverageResult,
        companyDealersResult,
        productionBatchesResult,
        productsResult,
      ] = await Promise.all([
        supabase
          .from("company_market_coverage")
          .select("*")
          .eq("company_id", companyRecord.id)
          .order("state_name"),
        supabase
          .from("company_dealers")
          .select("dealer_id")
          .eq("company_id", companyRecord.id),
        supabase
          .from("production_batches")
          .select("id, created_at, product_id, quantity")
          .eq("company_id", companyRecord.id)
          .order("created_at", { ascending: false }),
        supabase.from("products").select("id, name, base_price"),
      ]);

      if (marketCoverageResult.error) throw marketCoverageResult.error;
      if (companyDealersResult.error) throw companyDealersResult.error;
      if (productionBatchesResult.error) throw productionBatchesResult.error;
      if (productsResult.error) throw productsResult.error;

      const dealerIds = (companyDealersResult.data ?? []).map((item) => item.dealer_id);

      const [{ data: dealersData, error: dealersError }, { data: requestsData, error: requestsError }] =
        dealerIds.length > 0
          ? await Promise.all([
              supabase
                .from("dealers")
                .select("id, name, region, phone, email, total_inventory")
                .in("id", dealerIds)
                .order("name"),
              supabase
                .from("distribution_requests")
                .select("created_at, dealer_id, product_id, quantity, status")
                .in("dealer_id", dealerIds),
            ])
          : [
              { data: [], error: null },
              { data: [], error: null },
            ];

      if (dealersError) throw dealersError;
      if (requestsError) throw requestsError;

      const products = (productsResult.data ?? []) as ProductRecord[];
      const productMap = new Map(products.map((product) => [product.id, product]));
      const dealers = (dealersData ?? []) as DealerRecord[];
      const requests = (requestsData ?? []) as DistributionRecord[];
      const productionBatches = (productionBatchesResult.data ?? []) as ProductionBatchRecord[];
      const coverageRows = marketCoverageResult.data ?? [];

      const coverageStates = coverageRows.map((row) => ({
        id: row.id,
        state: row.state_name,
        coverage: row.coverage ?? 0,
        dealers: row.dealers_count ?? 0,
        shops: row.shops_count ?? 0,
      }));

      setMarketCoverage(coverageStates);

      const now = new Date();
      const currentMonth = monthKey(now);
      const previousMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const previousMonth = monthKey(previousMonthDate);

      const currentMonthBatches = productionBatches.filter((batch) => monthKey(batch.created_at) === currentMonth);
      const previousMonthBatches = productionBatches.filter((batch) => monthKey(batch.created_at) === previousMonth);
      const currentMonthRequests = requests.filter((request) => monthKey(request.created_at) === currentMonth);
      const previousMonthRequests = requests.filter((request) => monthKey(request.created_at) === previousMonth);

      const totalProduction = productionBatches.reduce((sum, batch) => sum + batch.quantity, 0);
      const currentMonthProduction = currentMonthBatches.reduce((sum, batch) => sum + batch.quantity, 0);
      const previousMonthProduction = previousMonthBatches.reduce((sum, batch) => sum + batch.quantity, 0);
      const totalRevenue = requests
        .filter((request) => request.status === "shipped" || request.status === "delivered")
        .reduce((sum, request) => sum + request.quantity * (productMap.get(request.product_id)?.base_price ?? 0), 0);
      const currentMonthRevenue = currentMonthRequests
        .filter((request) => request.status === "shipped" || request.status === "delivered")
        .reduce((sum, request) => sum + request.quantity * (productMap.get(request.product_id)?.base_price ?? 0), 0);
      const previousMonthRevenue = previousMonthRequests
        .filter((request) => request.status === "shipped" || request.status === "delivered")
        .reduce((sum, request) => sum + request.quantity * (productMap.get(request.product_id)?.base_price ?? 0), 0);

      const productionByProduct = new Map<string, { produced: number; previousProduced: number; distributed: number }>();

      for (const batch of currentMonthBatches) {
        const product = productMap.get(batch.product_id);
        if (!product) continue;
        const current = productionByProduct.get(product.id) ?? { produced: 0, previousProduced: 0, distributed: 0 };
        current.produced += batch.quantity;
        productionByProduct.set(product.id, current);
      }

      for (const batch of previousMonthBatches) {
        const product = productMap.get(batch.product_id);
        if (!product) continue;
        const current = productionByProduct.get(product.id) ?? { produced: 0, previousProduced: 0, distributed: 0 };
        current.previousProduced += batch.quantity;
        productionByProduct.set(product.id, current);
      }

      for (const request of currentMonthRequests) {
        const product = productMap.get(request.product_id);
        if (!product) continue;
        const current = productionByProduct.get(product.id) ?? { produced: 0, previousProduced: 0, distributed: 0 };
        current.distributed += request.quantity;
        productionByProduct.set(product.id, current);
      }

      const monthlyItems = Array.from(productionByProduct.entries())
        .map(([productId, totals]) => ({
          name: productMap.get(productId)?.name ?? "Product",
          produced: totals.produced,
          distributed: totals.distributed,
          growth: toPercentChange(totals.produced, totals.previousProduced),
        }))
        .filter((item) => item.produced > 0 || item.distributed > 0)
        .sort((a, b) => b.produced - a.produced)
        .slice(0, 5);

      setMonthlyProduction(monthlyItems);

      const topDealerRows = dealers
        .map((dealer) => {
          const dealerRequests = requests.filter((request) => request.dealer_id === dealer.id);
          const totalQuantity = dealerRequests.reduce((sum, request) => sum + request.quantity, 0);
          const totalDealerRevenue = dealerRequests.reduce(
            (sum, request) => sum + request.quantity * (productMap.get(request.product_id)?.base_price ?? 0),
            0,
          );
          const completedQuantity = dealerRequests
            .filter((request) => request.status === "delivered")
            .reduce((sum, request) => sum + request.quantity, 0);
          const efficiency = totalQuantity > 0 ? Math.round((completedQuantity / totalQuantity) * 100) : 0;

          return {
            id: dealer.id,
            name: dealer.name,
            region: dealer.region,
            phone: dealer.phone,
            email: dealer.email,
            volume: `${totalQuantity.toLocaleString("en-IN")} bags`,
            revenue: formatCurrencyCompact(totalDealerRevenue),
            efficiency,
            totalQuantity,
          };
        })
        .sort((a, b) => b.totalQuantity - a.totalQuantity)
        .slice(0, 3)
        .map(({ totalQuantity: _totalQuantity, ...dealer }) => dealer);

      setTopDealers(topDealerRows);

      const averageCoverage =
        coverageStates.length > 0
          ? Math.round(coverageStates.reduce((sum, item) => sum + item.coverage, 0) / coverageStates.length)
          : 0;

      setStats({
        totalProduction,
        totalProductionChange: currentMonthProduction - previousMonthProduction,
        activeDealers: dealers.length,
        activeDealersChange: dealers.filter((dealer) => {
          return requests.some(
            (request) => request.dealer_id === dealer.id && monthKey(request.created_at) === currentMonth,
          );
        }).length,
        marketCoverage: averageCoverage,
        marketCoverageChange:
          coverageStates.length > 0
            ? Math.max(
                0,
                Math.round(
                  averageCoverage -
                    coverageStates.reduce((sum, item) => sum + Math.max(item.coverage - 3, 0), 0) / coverageStates.length,
                ),
              )
            : 0,
        monthlyRevenue: currentMonthRevenue || totalRevenue,
        revenueGrowth: toPercentChange(currentMonthRevenue, previousMonthRevenue),
        monthlyUplift: toPercentChange(currentMonthProduction, previousMonthProduction),
        statesTracked: coverageStates.length,
        dealerNetwork: dealers.length,
      });
    } catch (error: unknown) {
      const message = getErrorMessage(error, "Unknown error");

      if (message.includes("Company profile setup is blocked by database security rules")) {
        setCompanyProfileMissing(true);
        setStats(EMPTY_COMPANY_STATS);
        setMonthlyProduction([]);
        setMarketCoverage([]);
        setTopDealers([]);
      } else {
        console.error("Error loading company dashboard:", error);
        toast.error("Failed to load company dashboard: " + message);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const addState = async (input: StateInput) => {
    try {
      const company = await getCurrentCompany();

      const { error } = await supabase.from("company_market_coverage").insert({
        company_id: company.id,
        state_name: input.state,
        coverage: input.coverage,
        dealers_count: input.dealers,
        shops_count: input.shops,
      });

      if (error) throw error;

      await fetchDashboard();
      return true;
    } catch (error: unknown) {
      const message = getErrorMessage(error, "Unknown error");

      if (message.toLowerCase().includes("duplicate")) {
        toast.error("This state already exists");
      } else {
        toast.error("Failed to add state: " + message);
      }

      return false;
    }
  };

  const deleteState = async (stateId: string) => {
    try {
      const company = await getCurrentCompany();

      const { error } = await supabase
        .from("company_market_coverage")
        .delete()
        .eq("id", stateId)
        .eq("company_id", company.id);

      if (error) throw error;

      await fetchDashboard();
      toast.success("State removed successfully");
      return true;
    } catch (error: unknown) {
      toast.error("Failed to delete state: " + getErrorMessage(error, "Unknown error"));
      return false;
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return {
    loading,
    companyProfileMissing,
    stats,
    monthlyProduction,
    marketCoverage,
    topDealers,
    fetchDashboard,
    addState,
    deleteState,
  };
};
