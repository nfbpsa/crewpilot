"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { supabaseServer } from "@/lib/supabase-server";

export async function updateQuote(formData: FormData) {
  const id = formData.get("id")?.toString() ?? "";

  if (!id) {
    throw new Error("Missing quote ID.");
  }

  const customer_name =
    formData.get("customer_name")?.toString() ?? "";

  const phone =
    formData.get("phone")?.toString() ?? "";

  const service =
    formData.get("service")?.toString() ?? "";

  const city =
    formData.get("city")?.toString() ?? "";

  const customer_type =
    formData.get("customer_type")?.toString() ?? "";

  const notes =
    formData.get("notes")?.toString() ?? "";

  const length =
    Number(formData.get("length")) || 0;

  const width =
    Number(formData.get("width")) || 0;

  const price_per_sqft =
    Number(formData.get("price_per_sqft")) || 0;

  const material_cost =
    Number(formData.get("material_cost")) || 0;

  const labor_cost =
    Number(formData.get("labor_cost")) || 0;

  const misc_cost =
    Number(formData.get("misc_cost")) || 0;

  const square_feet = length * width;

  const sealcoating_total =
    square_feet * price_per_sqft;

  const total_price =
    sealcoating_total +
    material_cost +
    labor_cost +
    misc_cost;

  const { error } = await supabaseServer
    .from("quotes")
    .update({
      customer_name,
      phone,
      service,
      city,
      customer_type,
      notes,
      length,
      width,
      square_feet,
      price_per_sqft,
      material_cost,
      labor_cost,
      misc_cost,
      total_price,
    })
    .eq("id", id);

  if (error) {
    console.error("UPDATE QUOTE ERROR:", error);
    throw new Error(error.message);
  }

  revalidatePath("/dashboard/quotes");
  revalidatePath(`/dashboard/quotes/${id}`);
  revalidatePath(`/dashboard/quotes/${id}/edit`);

  redirect(`/dashboard/quotes/${id}`);
}