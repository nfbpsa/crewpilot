import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

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

    const call = body.call;

    const { error } = await supabase.from("calls").insert({
      call_id: call.call_id,
      transcript: call.transcript,
      duration: call.duration_ms,
      caller_name: call.caller_name ?? null,
      phone: call.from_number ?? null,
    });

    if (error) {
      console.error(error);
    } else {
      console.log("✅ Call saved");
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { success: false },
      { status: 500 }
    );
  }
}