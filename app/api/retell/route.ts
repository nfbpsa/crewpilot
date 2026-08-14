import { calculateLeadScore } from "@/lib/ai/lead-score";
import OpenAI from "openai";
import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

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
      console.log("No call object found.");
      return NextResponse.json({ success: true });
    }

    const transcript = call.transcript ?? "";

    let ai = {
      customer_name: null as string | null,
      phone: null as string | null,
      email: null as string | null,

      street_address: null as string | null,
      city: null as string | null,
      state: null as string | null,
      zip_code: null as string | null,

      service: null as string | null,
      project_type: null as string | null,

      customer_type: null as string | null,

      budget: null as string | null,
      callback_time: null as string | null,
      decision_maker: null as string | null,

      materials: null as string | null,

      estimated_job_value: null as string | null,
      priority: null as string | null,
      next_action: null as string | null,

      summary: null as string | null,
      timeline: null as string | null,

      lead_source: "Retell AI",
      status: "New Lead",
    };

    /*
     * ============================================================
     * AI EXTRACTION
     * ============================================================
     */

    if (!process.env.OPENAI_API_KEY) {
      console.error("❌ OPENAI_API_KEY missing");
    }

    if (transcript.length > 20 && process.env.OPENAI_API_KEY) {
      try {
        console.log("Calling OpenAI...");
        console.log("🚀 USING FULL LEAD JSON SCHEMA");

        const response = await openai.responses.create({
          model: "gpt-5.5",

          input: `
You extract structured lead information from contractor phone calls.

Read the transcript carefully and extract as much information as the caller actually provides.

IMPORTANT:
- Do not invent information.
- If a field is not mentioned, return null.
- Keep phone numbers exactly as provided when possible.
- Keep addresses accurate.
- estimated_job_value should be the customer's estimated job value or expected project value if discussed.
- budget should contain the customer's stated budget or budget range if discussed.
- callback_time should contain the requested callback time if discussed.
- decision_maker should indicate whether the caller is the decision maker if this can be determined.
- priority should describe the urgency expressed by the customer.
- next_action should describe the logical next step from the conversation.
- summary should be a concise summary of the call.
- timeline should describe when the customer wants the work done.
- service should identify the service requested.
- project_type should describe the type of project.
- customer_type should be residential, commercial, or another type when clear.
- materials should contain materials discussed or requested.

Return only the structured information requested by the schema.

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
                    type: ["string", "null"],
                  },

                  phone: {
                    type: ["string", "null"],
                  },

                  email: {
                    type: ["string", "null"],
                  },

                  street_address: {
                    type: ["string", "null"],
                  },

                  city: {
                    type: ["string", "null"],
                  },

                  state: {
                    type: ["string", "null"],
                  },

                  zip_code: {
                    type: ["string", "null"],
                  },

                  service: {
                    type: ["string", "null"],
                  },

                  project_type: {
                    type: ["string", "null"],
                  },

                  customer_type: {
                    type: ["string", "null"],
                  },

                  budget: {
                    type: ["string", "null"],
                  },

                  callback_time: {
                    type: ["string", "null"],
                  },

                  decision_maker: {
                    type: ["string", "null"],
                  },

                  materials: {
                    type: ["string", "null"],
                  },

                  estimated_job_value: {
                    type: ["string", "null"],
                  },

                  priority: {
                    type: ["string", "null"],
                  },

                  next_action: {
                    type: ["string", "null"],
                  },

                  summary: {
                    type: ["string", "null"],
                  },

                  timeline: {
                    type: ["string", "null"],
                  },

                  lead_source: {
                    type: "string",
                  },

                  status: {
                    type: "string",
                  },
                },

                required: [
                  "customer_name",
                  "phone",
                  "email",
                  "street_address",
                  "city",
                  "state",
                  "zip_code",
                  "service",
                  "project_type",
                  "customer_type",
                  "budget",
                  "callback_time",
                  "decision_maker",
                  "materials",
                  "estimated_job_value",
                  "priority",
                  "next_action",
                  "summary",
                  "timeline",
                  "lead_source",
                  "status",
                ],
              },
            },
          },
        });

        console.log("========== OPENAI RESPONSE ==========");
        console.dir(response, { depth: null });

        console.log("========== OUTPUT TEXT ==========");
        console.log(response.output_text);

        if (response.output_text) {
          ai = {
            ...ai,
            ...JSON.parse(response.output_text),
          };
        }

        console.log("========== PARSED AI ==========");
        console.dir(ai, { depth: null });
      } catch (err) {
        console.error("========== OPENAI ERROR ==========");
        console.error(err);
      }
    }

    /*
     * ============================================================
     * LEAD SCORE
     * ============================================================
     */

    const leadScore = calculateLeadScore({
      timeline: ai.timeline,
      callback_time: ai.callback_time,
      decision_maker: ai.decision_maker,
      budget: ai.budget,
      service: ai.service,
    });

    console.log("========== LEAD SCORE ==========");
    console.log(leadScore);

    /*
     * ============================================================
     * SAVE TO SUPABASE
     * ============================================================
     */

    console.log("========== SAVING ==========");

    const { data, error } = await supabaseServer
      .from("calls")
      .upsert(
        {
          call_id: call.call_id,

          caller_name:
            ai.customer_name ??
            call.caller_name ??
            null,

          phone:
            ai.phone ??
            call.from_number ??
            null,

          email: ai.email,

          ai_customer_name: ai.customer_name,
          ai_phone: ai.phone,

          street_address: ai.street_address,
          city: ai.city,
          state: ai.state,
          zip_code: ai.zip_code,

          service: ai.service,
          project_type: ai.project_type,

          customer_type: ai.customer_type,

          budget: ai.budget,
          callback_time: ai.callback_time,
          decision_maker: ai.decision_maker,

          materials: ai.materials,

          estimated_job_value: ai.estimated_job_value,

          priority: ai.priority,
          next_action: ai.next_action,

          summary: ai.summary,
          timeline: ai.timeline,

          lead_source: ai.lead_source,

          status: ai.status,

          transcript,

          lead_score: leadScore.score,
          lead_priority: leadScore.priority,
          lead_score_reasons: leadScore.reasons,
        },
        {
          onConflict: "call_id",
        }
      )
      .select();

    console.log("========== SAVED ROW ==========");
    console.dir(data, { depth: null });

    if (error) {
      console.error("========== SUPABASE ERROR ==========");
      console.error(error);

      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        {
          status: 500,
        }
      );
    }

    console.log("✅ Call saved successfully");

    return NextResponse.json({
      success: true,
      lead_score: leadScore.score,
      lead_priority: leadScore.priority,
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