import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface StockAlert {
  id: string;
  shop_id: string;
  product_id: string;
  alert_type: string;
  message: string | null;
  is_read: boolean;
  created_at: string;
  shops?: { name: string; address: string };
  products?: { name: string };
}

export const useStockAlerts = () => {
  const [alerts, setAlerts] = useState<StockAlert[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAlerts = async () => {
    try {
      const { data, error } = await supabase
        .from("stock_alerts")
        .select(`
          *,
          shops (name, address),
          products (name)
        `)
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) throw error;
      setAlerts(data as StockAlert[]);
    } catch (error: any) {
      console.error("Error fetching alerts:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (alertId: string) => {
    try {
      await supabase
        .from("stock_alerts")
        .update({ is_read: true })
        .eq("id", alertId);
      fetchAlerts();
    } catch (error) {
      console.error("Error marking alert as read:", error);
    }
  };

  useEffect(() => {
    fetchAlerts();

    const channel = supabase
      .channel("alerts_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "stock_alerts" }, () => {
        fetchAlerts();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { alerts, loading, fetchAlerts, markAsRead };
};
