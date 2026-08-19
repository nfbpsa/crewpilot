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

    // Convert the price safely.
    const parsedPrice = Number(total_price);

    if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
      return NextResponse.json(
        {
          error: "Total price must be a valid number.",
        },
        { status: 400 }
      );
    }

    console.log("CREATING QUOTE:", {
      customer_name,
      service,
      total_price_received: total_price,
      total_price_saved: parsedPrice,
    });

    const { data, error } = await supabaseServer
      .from("quotes")
      .insert({
        lead_id: lead_id || null,
        customer_name: customer_name.trim(),
        phone: phone || null,
        customer_type: customer_type || null,
        service: service.trim(),
        city: city || null,
        state: state || null,
        description: description || null,

        // THIS is the important part
        total_price: parsedPrice,

        notes: notes || null,
        status: status || "Draft",
      })
      .select()
      .single();

    if (error) {
      console.error("CREATE QUOTE SUPABASE ERROR:", error);

      return NextResponse.json(
        {
          error: error.message,
          details: error.details,
          hint: error.hint,
        },
        { status: 500 }
      );
    }

    console.log("QUOTE CREATED:", data);

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("QUOTE API ERROR:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Invalid request.",
      },
      { status: 400 }
    );
  }
}