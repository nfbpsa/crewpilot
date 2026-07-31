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
      customer_name: null as string | null,
      phone: null as string | null,
      summary: null as string | null,
      service: null as string | null,
      city: null as string | null,
      customer_type: null as string | null,
      timeline: null as string | null,
      status: "New Lead",
    };

    if (!process.env.OPENAI_API_KEY) {
      console.error("❌ OPENAI_API_KEY missing");
    }

    if (transcript.length > 20) {
      try {
        console.log("Calling OpenAI...");

        console.log("🚀 USING JSON_SCHEMA VERSION");
        const response = await openai.responses.create({
  model: "gpt-5.5",

  input: `
You extract structured lead information from contractor phone calls.

Return:

- customer_name = caller's full name
- phone = best callback phone number
- summary = concise summary of the call
- service = requested service
- city = city and state
- customer_type = Residential or Commercial
- timeline = chronological bullet list of everything discussed
- status = "New Lead"

Transcript:

${transcript}
`,

  text: {
    format: {
      type: "json_schema",
      name: "contractor_lead",
      strict: true,
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          customer_name: {
            type: "string",
          },
          phone: {
            type: "string",
          },
          summary: {
            type: "string",
          },
          service: {
            type: "string",
          },
          city: {
            type: "string",
          },
          customer_type: {
            type: "string",
          },
          timeline: {
            type: "string",
          },
          status: {
            type: "string",
          },
        },
        required: [
          "customer_name",
          "phone",
          "summary",
          "service",
          "city",
          "customer_type",
          "timeline",
          "status",
        ],
      },
    },
  },
});

        console.log("========== PARSED AI ==========");
        console.log(ai);
      } catch (err) {
        console.error("========== OPENAI ERROR ==========");
        console.error(err);
      }
    }

    console.log("========== SAVING ==========");
    console.log(ai);

    const { error } = await supabase
      .from("calls")
      .upsert(
        {
          call_id: call.call_id,

          caller_name: ai.customer_name ?? call.caller_name ?? null,

          phone: ai.phone ?? call.from_number ?? null,

          transcript,

          summary: ai.summary,
          service: ai.service,
          city: ai.city,
          customer_type: ai.customer_type,
          timeline: ai.timeline,
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