import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "CrewPilot Retell webhook is live.",
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log("========== RETELL WEBHOOK ==========");
    console.log(JSON.stringify(body, null, 2));

    // Only save completed analyzed calls
    if (body.event !== "call_analyzed") {
      return NextResponse.json({ success: true });
    }

    const call = body.call ?? {};

    const callId = call.call_id ?? call.id ?? crypto.randomUUID();

    const analysis = call.analysis ?? {};
    const variables = call.variables ?? {};

    const lead = {
      call_id: callId,
      caller_name:
        variables.name ??
        variables.caller_name ??
        analysis.name ??
        null,

      phone:
        variables.phone ??
        variables.phone_number ??
        analysis.phone ??
        null,

      customer_type:
        variables.customer_type ??
        analysis.customer_type ??
        null,

      service:
        variables.service ??
        analysis.service ??
        null,

      city:
        variables.city ??
        analysis.city ??
        null,

      timeline:
        variables.timeline ??
        analysis.timeline ??
        null,

      summary:
        call.call_summary ??
        analysis.summary ??
        null,

      transcript:
        call.transcript ??
        call.transcript_object ??
        null,
    };

    const { error } = await supabase
      .from("calls")
      .upsert(lead, {
        onConflict: "call_id",
      });

    if (error) {
      console.error(error);
    } else {
      console.log("✅ Call saved");
    }

    return NextResponse.json({
      success: true,
    });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      {
        success: false,
      },
      {
        status: 500,
      }
    );
  }
}