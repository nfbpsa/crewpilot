import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

    if (!call) {
      return NextResponse.json({ success: true });
    }

    const transcript = call.transcript ?? "";

    let ai = {
      summary: null,
      service: null,
      city: null,
      customer_type: null,
      status: "New Lead",
    };

    if (!process.env.OPENAI_API_KEY) {
      console.error("❌ OPENAI_API_KEY is missing.");
    }

    if (transcript.length > 20) {
      try {
        console.log("Calling OpenAI...");

        const response = await openai.responses.create({
          model: "gpt-5.5",
          input: `
Read this contractor phone call.

Return ONLY JSON.

{
  "summary":"",
  "service":"",
  "city":"",
  "customer_type":"",
  "status":"New Lead"
}

Transcript:

${transcript}
`,
          text: {
            format: {
              type: "json_object",
            },
          },
        });

        console.log("========== OPENAI RAW ==========");
        console.log(JSON.stringify(response, null, 2));

        const text = response.output_text;

        console.log("========== OPENAI TEXT ==========");
        console.log(text);

        ai = JSON.parse(text);

        console.log("========== PARSED AI ==========");
        console.log(ai);
      } catch (err) {
        console.error("========== OPENAI ERROR ==========");
        console.error(err);

        if (err instanceof Error) {
          console.error(err.message);
          console.error(err.stack);
        }
      }
    }

    console.log("========== SAVING ==========");
    console.log(ai);

    const { error } = await supabase
      .from("calls")
      .upsert(
        {
          call_id: call.call_id,
          caller_name: call.caller_name ?? null,
          phone: call.from_number ?? null,
          transcript,

          summary: ai.summary,
          service: ai.service,
          city: ai.city,
          customer_type: ai.customer_type,
          status: ai.status,
        },
        {
          onConflict: "call_id",
        }
      );

    if (error) {
      console.error("========== SUPABASE ERROR ==========");
      console.error(error);
    } else {
      console.log("✅ Call saved");
    }

    return NextResponse.json({
      success: true,
    });
  } catch (err) {
    console.error("========== SERVER ERROR ==========");
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