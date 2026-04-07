import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface DistributionRequest {
  id: string;
  request_number: string;
  shop_id: string;
  dealer_id: string;
  product_id: string;
  quantity: number;
  priority: string;
  expected_delivery: string | null;
  status: "pending" | "approved" | "shipped" | "delivered" | "rejected";
  notes: string | null;
  created_at: string;
  shops?: { name: string; address: string };
  products?: { name: string };
}

const generateRequestNumber = () => 'DR' + Math.floor(Math.random() * 999999).toString().padStart(6, '0');

export const useDistributionRequests = () => {
  const [requests, setRequests] = useState<DistributionRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from("distribution_requests")
        .select(`
          *,
          shops (name, address),
          products (name)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setRequests(data as DistributionRequest[]);
    } catch (error: any) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const createRequest = async (requestData: {
    shop_id: string;
    dealer_id: string;
    product_id: string;
    quantity: number;
    priority?: string;
    expected_delivery?: string;
    notes?: string;
  }) => {
    try {
      const { data, error } = await supabase
        .from("distribution_requests")
        .insert({
          shop_id: requestData.shop_id,
          dealer_id: requestData.dealer_id,
          product_id: requestData.product_id,
          quantity: requestData.quantity,
          priority: requestData.priority || "medium",
          expected_delivery: requestData.expected_delivery,
          notes: requestData.notes,
          request_number: generateRequestNumber(),
          status: "pending" as const
        })
        .select()
        .single();

      if (error) throw error;
      toast.success("Order request sent to dealer!");
      return data;
    } catch (error: any) {
      toast.error("Error creating request: " + error.message);
      return null;
    }
  };

  const approveAndShip = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from("distribution_requests")
        .update({ status: "shipped" as const })
        .eq("id", requestId);

      if (error) throw error;
      toast.success("Request approved and shipped!");
      fetchRequests();
    } catch (error: any) {
      toast.error("Error updating request: " + error.message);
    }
  };

  const updateStatus = async (requestId: string, status: "pending" | "approved" | "shipped" | "delivered" | "rejected") => {
    try {
      const { error } = await supabase
        .from("distribution_requests")
        .update({ status })
        .eq("id", requestId);

      if (error) throw error;
      toast.success("Request status updated!");
      fetchRequests();
    } catch (error: any) {
      toast.error("Error updating request: " + error.message);
    }
  };

  const modifyRequest = async (requestId: string, updates: { quantity?: number; priority?: string; notes?: string }) => {
    try {
      const { error } = await supabase
        .from("distribution_requests")
        .update(updates)
        .eq("id", requestId);

      if (error) throw error;
      toast.success("Request modified successfully!");
      fetchRequests();
    } catch (error: any) {
      toast.error("Error modifying request: " + error.message);
    }
  };

  useEffect(() => {
    fetchRequests();

    const channel = supabase
      .channel("distribution_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "distribution_requests" }, () => {
        fetchRequests();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { requests, loading, fetchRequests, createRequest, approveAndShip, updateStatus, modifyRequest };
};
