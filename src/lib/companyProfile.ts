import { supabase } from "@/integrations/supabase/client";

type CompanyProfile = {
  id: string;
  user_id: string;
  name: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  created_at?: string;
};

const normalizeCompanyError = (error: unknown): never => {
  if (error && typeof error === "object") {
    const candidate = error as { message?: string; code?: string };
    const message = candidate.message?.toLowerCase() ?? "";

    if (candidate.code === "42501" || message.includes("row-level security")) {
      throw new Error(
        "Company profile setup is blocked by database security rules. Apply the latest Supabase migration and try again.",
      );
    }
  }

  throw error;
};

export const findCompanyProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from("companies")
    .select("id, user_id, name, phone, email, address, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data as CompanyProfile | null;
};

export const ensureCompanyProfile = async (userId: string) => {
  const existingCompany = await findCompanyProfile(userId);

  if (existingCompany) {
    return existingCompany;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, phone, email, address")
    .eq("user_id", userId)
    .limit(1)
    .maybeSingle();

  const companyName = profile?.full_name?.trim() || "My Company";

  const { error: createError } = await supabase
    .from("companies")
    .insert({
      user_id: userId,
      name: companyName,
      phone: profile?.phone ?? null,
      email: profile?.email ?? null,
      address: profile?.address ?? null,
    });

  if (createError) {
    normalizeCompanyError(createError);
  }

  const createdCompany = await findCompanyProfile(userId);

  if (!createdCompany) {
    throw new Error("Company profile could not be created");
  }

  return createdCompany;
};
