import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Dealer {
  id: string;
  user_id: string;
  name: string;
  region: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  total_inventory: number;
  created_at: string;
}

const generateRequestNumber = () => 'DR' + Math.floor(Math.random() * 999999).toString().padStart(6, '0');

export const useDealers = () => {
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDealers = async () => {
    try {
      const { data, error } = await supabase
        .from("dealers")
        .select("*")
        .order("name");

      if (error) throw error;
      setDealers(data as Dealer[]);
    } catch (error: any) {
      console.error("Error fetching dealers:", error);
    } finally {
      setLoading(false);
    }
  };

  const sendStock = async (dealerId: string, shopId: string, productId: string, quantity: number) => {
    try {
      // Create a distribution request marked as shipped
      const { error } = await supabase
        .from("distribution_requests")
        .insert({
          shop_id: shopId,
          dealer_id: dealerId,
          product_id: productId,
          quantity,
          request_number: generateRequestNumber(),
          status: "shipped" as const,
          priority: "high"
        });

      if (error) throw error;
      toast.success("Stock sent to shop!");
    } catch (error: any) {
      toast.error("Error sending stock: " + error.message);
    }
  };

  useEffect(() => {
    fetchDealers();
  }, []);

  return { dealers, loading, fetchDealers, sendStock };
};
