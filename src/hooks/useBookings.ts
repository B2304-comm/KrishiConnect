import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Booking {
  id: string;
  booking_number: string;
  farmer_id: string;
  shop_id: string;
  product_id: string;
  quantity: number;
  total_amount: number;
  pickup_date: string | null;
  status: "pending" | "ready" | "completed" | "cancelled";
  qr_code: string | null;
  created_at: string;
  shops?: { name: string; phone: string; address: string };
  products?: { name: string };
  profiles?: { full_name: string; phone: string };
}

const generateBookingNumber = () => 'BK' + Math.floor(Math.random() * 999999).toString().padStart(6, '0');

export const useBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from("farmer_bookings")
        .select(`
          *,
          shops (name, phone, address),
          products (name)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setBookings(data as Booking[]);
    } catch (error: any) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const createBooking = async (bookingData: {
    shop_id: string;
    product_id: string;
    quantity: number;
    total_amount: number;
    pickup_date?: string;
  }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Please login to book");

      const qrCode = `BK-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const bookingNumber = generateBookingNumber();

      const { data, error } = await supabase
        .from("farmer_bookings")
        .insert({
          shop_id: bookingData.shop_id,
          product_id: bookingData.product_id,
          quantity: bookingData.quantity,
          total_amount: bookingData.total_amount,
          pickup_date: bookingData.pickup_date,
          farmer_id: user.id,
          booking_number: bookingNumber,
          qr_code: qrCode,
          status: "pending" as const
        })
        .select()
        .single();

      if (error) throw error;
      toast.success("Booking created successfully!");
      return data;
    } catch (error: any) {
      toast.error("Error creating booking: " + error.message);
      return null;
    }
  };

  const markReady = async (bookingId: string) => {
    try {
      const { error } = await supabase
        .from("farmer_bookings")
        .update({ status: "ready" as const })
        .eq("id", bookingId);

      if (error) throw error;
      toast.success("Booking marked as ready for pickup!");
      fetchBookings();
    } catch (error: any) {
      toast.error("Error updating booking: " + error.message);
    }
  };

  const completeBooking = async (bookingId: string) => {
    try {
      const { error } = await supabase
        .from("farmer_bookings")
        .update({ status: "completed" as const })
        .eq("id", bookingId);

      if (error) throw error;
      toast.success("Sale completed!");
      fetchBookings();
    } catch (error: any) {
      toast.error("Error completing sale: " + error.message);
    }
  };

  const findByQRCode = async (qrInput: string) => {
    try {
      // Try to parse as JSON (from actual QR scan)
      let bookingNumber: string | null = null;
      
      try {
        const parsed = JSON.parse(qrInput);
        if (parsed.booking_number) {
          bookingNumber = parsed.booking_number;
        }
      } catch {
        // Not JSON, use as direct booking number or qr_code
        bookingNumber = qrInput;
      }

      // Search by booking_number or qr_code
      const { data, error } = await supabase
        .from("farmer_bookings")
        .select(`
          *,
          shops (name, phone, address),
          products (name)
        `)
        .or(`qr_code.eq.${qrInput},booking_number.eq.${bookingNumber}`)
        .maybeSingle();

      if (error) throw error;
      if (!data) {
        toast.error("Booking not found");
        return null;
      }
      return data as Booking;
    } catch (error: any) {
      toast.error("Booking not found");
      return null;
    }
  };

  useEffect(() => {
    fetchBookings();

    const channel = supabase
      .channel("bookings_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "farmer_bookings" }, () => {
        fetchBookings();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { bookings, loading, fetchBookings, createBooking, markReady, completeBooking, findByQRCode };
};
