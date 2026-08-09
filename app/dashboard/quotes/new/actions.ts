"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { supabaseServer } from "@/lib/supabase-server";

export async function createQuote(formData: FormData) {
  const call_id = formData.get("call_id")?.toString() ?? "";

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

  const price = Number(
    formData.get("price") ?? 0
  );

  const length = Number(
    formData.get("length") ?? 0
  );

  const width = Number(
    formData.get("width") ?? 0
  );

  const price_per_sqft = Number(
    formData.get("price_per_sqft") ?? 0
  );

  const material_cost = Number(
    formData.get("material_cost") ?? 0
  );

  const labor_cost = Number(
    formData.get("labor_cost") ?? 0
  );

  const misc_cost = Number(
    formData.get("misc_cost") ?? 0
  );

  const square_feet = length * width;

  const calculated_price =
    price > 0
      ? price
      : square_feet * price_per_sqft +
        material_cost +
        labor_cost +
        misc_cost;

  const { error } = await supabaseServer
    .from("quotes")
    .insert({
      call_id,
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
      total_price: calculated_price,
      status: "Draft",
    });

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  revalidatePath("/dashboard/quotes");
  redirect("/dashboard/quotes");
}