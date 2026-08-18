import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      lead_id,
      customer_name,
      phone,
      customer_type,
      service,
      city,
      state,
      description,
      total_price,
      notes,
      status,
    } = body;

    if (!customer_name || !service) {
      return NextResponse.json(
        {
          error: "Customer name and service are required.",
        },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseServer
      .from("quotes")
      .insert({
        lead_id: lead_id || null,
        customer_name,
        phone: phone || null,
        customer_type: customer_type || null,
        service,
        city: city || null,
        state: state || null,
        description: description || null,
        total_price: Number(total_price || 0),
        notes: notes || null,
        status: status || "Draft",
      })
      .select()
      .single();

    if (error) {
      console.error("Create quote error:", error);

      return NextResponse.json(
        {
          error: error.message,
          details: error.details,
          hint: error.hint,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Quote API error:", error);

    return NextResponse.json(
      {
        error: "Invalid request.",
      },
      { status: 400 }
    );
  }
}