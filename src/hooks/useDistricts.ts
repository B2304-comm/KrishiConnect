import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface District {
  id: string;
  state_name: string;
  district_name: string;
  coverage: number;
  dealers_count: number;
  shops_count: number;
  user_id: string;
  created_at: string;
}

export const useDistricts = (stateName?: string) => {
  const [districts, setDistricts] = useState<District[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDistricts = useCallback(async () => {
    try {
      let query = supabase.from("state_districts").select("*").order("district_name");
      if (stateName) {
        query = query.eq("state_name", stateName);
      }
      const { data, error } = await query;
      if (error) throw error;
      setDistricts((data as District[]) || []);
    } catch (error: any) {
      console.error("Error fetching districts:", error);
    } finally {
      setLoading(false);
    }
  }, [stateName]);

  const addDistrict = async (district: {
    state_name: string;
    district_name: string;
    coverage?: number;
    dealers_count?: number;
    shops_count?: number;
  }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from("state_districts").insert({
        ...district,
        user_id: user.id,
      });
      if (error) throw error;
      toast.success(`District "${district.district_name}" added to ${district.state_name}`);
      await fetchDistricts();
      return true;
    } catch (error: any) {
      if (error.message?.includes("duplicate")) {
        toast.error("This district already exists in this state");
      } else {
        toast.error("Failed to add district: " + error.message);
      }
      return false;
    }
  };

  const updateDistrict = async (id: string, updates: Partial<District>) => {
    try {
      const { error } = await supabase
        .from("state_districts")
        .update(updates)
        .eq("id", id);
      if (error) throw error;
      toast.success("District updated");
      await fetchDistricts();
    } catch (error: any) {
      toast.error("Failed to update district: " + error.message);
    }
  };

  const deleteDistrict = async (id: string) => {
    try {
      const { error } = await supabase
        .from("state_districts")
        .delete()
        .eq("id", id);
      if (error) throw error;
      toast.success("District removed");
      await fetchDistricts();
    } catch (error: any) {
      toast.error("Failed to delete district: " + error.message);
    }
  };

  useEffect(() => {
    fetchDistricts();
  }, [fetchDistricts]);

  return { districts, loading, fetchDistricts, addDistrict, updateDistrict, deleteDistrict };
};
