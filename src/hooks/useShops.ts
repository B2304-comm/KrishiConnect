import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Shop {
  id: string;
  name: string;
  owner_name: string;
  phone: string;
  email: string | null;
  address: string;
  location_lat: number | null;
  location_lng: number | null;
  status: "pending" | "approved" | "rejected";
  rating: number;
  total_stock: number;
  dealer_id: string | null;
  created_at: string;
}

export interface ShopWithInventory extends Shop {
  inventory?: {
    product_name: string;
    quantity: number;
    price: number;
  }[];
}

export const useShops = () => {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchShops = async () => {
    try {
      const { data, error } = await supabase
        .from("shops")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setShops(data as Shop[]);
    } catch (error: any) {
      console.error("Error fetching shops:", error);
    } finally {
      setLoading(false);
    }
  };

  const searchNearbyShops = async (lat?: number, lng?: number) => {
    try {
      // For now, just return approved shops. In production, use PostGIS for geolocation
      const { data, error } = await supabase
        .from("shops")
        .select(`
          *,
          shop_inventory (
            quantity,
            price,
            products (name)
          )
        `)
        .eq("status", "approved")
        .limit(10);

      if (error) throw error;
      return data;
    } catch (error: any) {
      toast.error("Error searching shops: " + error.message);
      return [];
    }
  };

  const registerShop = async (shopData: {
    name: string;
    owner_name: string;
    phone: string;
    email?: string;
    address: string;
    dealer_id?: string;
  }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("You must be logged in to register a shop");
        return null;
      }
      
      const { data, error } = await supabase
        .from("shops")
        .insert({
          ...shopData,
          user_id: user.id,
          status: "pending"
        })
        .select()
        .single();

      if (error) throw error;
      toast.success("Shop registered! Awaiting dealer approval.");
      return data;
    } catch (error: any) {
      toast.error("Error registering shop: " + error.message);
      return null;
    }
  };

  // For dealers adding shops (user_id will be null until shop owner claims it)
  const addShopAsDealer = async (shopData: {
    name: string;
    owner_name: string;
    phone: string;
    email?: string;
    address: string;
    dealer_id?: string;
  }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("You must be logged in to add a shop");
        return null;
      }
      
      const { data, error } = await supabase
        .from("shops")
        .insert({
          ...shopData,
          user_id: user.id, // Set dealer as owner temporarily
          status: "approved" // Dealer-added shops are pre-approved
        })
        .select()
        .single();

      if (error) throw error;
      toast.success("Shop added successfully!");
      fetchShops();
      return data;
    } catch (error: any) {
      toast.error("Error adding shop: " + error.message);
      return null;
    }
  };

  const approveShop = async (shopId: string) => {
    try {
      const { error } = await supabase
        .from("shops")
        .update({ status: "approved" })
        .eq("id", shopId);

      if (error) throw error;
      toast.success("Shop approved successfully!");
      fetchShops();
    } catch (error: any) {
      toast.error("Error approving shop: " + error.message);
    }
  };

  const rejectShop = async (shopId: string) => {
    try {
      const { error } = await supabase
        .from("shops")
        .update({ status: "rejected" })
        .eq("id", shopId);

      if (error) throw error;
      toast.success("Shop rejected.");
      fetchShops();
    } catch (error: any) {
      toast.error("Error rejecting shop: " + error.message);
    }
  };

  useEffect(() => {
    fetchShops();

    // Subscribe to realtime changes
    const channel = supabase
      .channel("shops_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "shops" }, () => {
        fetchShops();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { shops, loading, fetchShops, searchNearbyShops, registerShop, addShopAsDealer, approveShop, rejectShop };
};
