import { calculateLeadScore } from "@/lib/ai/lead-score";
import OpenAI from "openai";
import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ============================================================
// CREWOS ACCOUNT
// ============================================================

const CREWOS_USER_ID = "51366006-9380-4040-8acd-f930c90dafe0";
const CREWOS_USER_EMAIL = "rprofits@hotmail.com";

// ============================================================
// GET
// ============================================================

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "CrewPilot Retell webhook is live.",
  });
}

// ============================================================
// POST - RETELL WEBHOOK
// ============================================================

export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log("========== RETELL WEBHOOK ==========");
    console.log("EVENT:", body.event);
    console.log(JSON.stringify(body, null, 2));

    const call = body.call;
    const event = body.event;

    if (!call) {
      console.log("No call object found.");

      return NextResponse.json({
        success: true,
      });
    }

    // ============================================================
    // BASIC CALL DATA
    // ============================================================

    const transcript =
      typeof call.transcript === "string"
        ? call.transcript
        : "";

    console.log("========== CALL DATA ==========");
    console.log("Event:", event);
    console.log("Call ID:", call.call_id);
    console.log("Caller:", call.caller_name);
    console.log("From:", call.from_number);
    console.log("Transcript length:", transcript.length);

    // ============================================================
    // IMPORTANT
    //
    // call_started does NOT have the completed transcript.
    //
    // We save the call if needed, but DO NOT create a CRM lead
    // until we have the completed conversation.
    // ============================================================

    const hasCompletedConversation =
      transcript.trim().length > 20;

    const isFinalEvent =
      event === "call_ended" ||
      event === "call_analyzed" ||
      event === "transcript_updated";

    // ============================================================
    // AI EXTRACTION DEFAULTS
    // ============================================================

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

    // ============================================================
    // AI EXTRACTION
    // ============================================================

    if (
      hasCompletedConversation &&
      process.env.OPENAI_API_KEY
    ) {
      try {
        console.log("========== CALLING OPENAI ==========");
        console.log("Using completed transcript.");

        const response = await openai.responses.create({
          model: "gpt-5.5",

          input: `
You are extracting structured CRM lead information from a contractor phone call.

Read the entire transcript carefully.

Your job is to extract ONLY information that the customer actually provided.

DO NOT invent information.

If information is not present, return null.

IMPORTANT EXTRACTION RULES:

CUSTOMER NAME
- Extract the customer's real name when they state it.
- Do not use "Unknown Customer" as the extracted name.
- If they never give their name, return null.

PHONE
- Extract the customer's phone number if they provide one.
- If they do not verbally provide a phone number, return null.
- The system may separately know the caller's phone number.

EMAIL
- Extract the email if provided.

ADDRESS
- Extract street address.
- Extract city.
- Extract state.
- Extract ZIP code.
- Keep the address accurate.
- Do not invent missing address information.

SERVICE
- Identify the contractor service requested.
- Examples:
  - sealcoating
  - roofing
  - junk removal
  - landscaping
  - pressure washing
  - concrete
  - driveway repair
- Use the service actually discussed.

PROJECT TYPE
- Describe the actual project.

CUSTOMER TYPE
- residential
- commercial
- other
- null if unclear

BUDGET
- Extract any budget or price range the customer mentions.

CALLBACK TIME
- Extract requested callback timing if mentioned.

DECISION MAKER
- Determine whether the caller is the decision maker if this can reasonably be determined.

MATERIALS
- Extract materials discussed.

ESTIMATED JOB VALUE
- Extract a project value if discussed.
- If the contractor gave a price or estimate, capture it.
- Do not invent a price.

PRIORITY
- Describe urgency.
- Examples:
  - emergency
  - urgent
  - high
  - normal
  - low

NEXT ACTION
- Describe the logical next step from the call.

SUMMARY
- Give a concise summary of the customer's request.

TIMELINE
- Extract when the customer wants the work completed.

TRANSCRIPT:

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

        if (err instanceof Error) {
          console.error("MESSAGE:", err.message);
          console.error("NAME:", err.name);
          console.error("STACK:", err.stack);
        } else {
          console.error("RAW ERROR:", JSON.stringify(err, null, 2));
        }

        return NextResponse.json(
          {
            success: false,
            error: "OpenAI extraction failed",
            details:
              err instanceof Error
                ? err.message
                : "Unknown OpenAI error",
          },
          { status: 500 }
        );
      }
    } else {
      console.log(
        "Skipping AI extraction because transcript is not ready."
      );
    }

    // ============================================================
    // CALL STARTED
    //
    // DO NOT CREATE LEAD HERE.
    //
    // There is no completed transcript yet.
    // ============================================================

    if (!hasCompletedConversation) {
      console.log(
        "========== NO COMPLETED TRANSCRIPT =========="
      );

      console.log(
        "Event:",
        event,
        "| Transcript length:",
        transcript.length
      );

      return NextResponse.json({
        success: true,
        call_saved: false,
        lead_created: false,
        waiting_for_transcript: true,
        call_id: call.call_id,
      });
    }

    // ============================================================
    // LEAD SCORE
    // ============================================================

    const leadScore = calculateLeadScore({
      timeline: ai.timeline,
      callback_time: ai.callback_time,
      decision_maker: ai.decision_maker,
      budget: ai.budget,
      service: ai.service,
    });

    console.log("========== LEAD SCORE ==========");
    console.log(leadScore);

    // ============================================================
    // SAVE / UPDATE CALL
    // ============================================================

    console.log("========== SAVING CALL ==========");

    const { data: savedCall, error: callError } =
      await supabaseServer
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

            estimated_job_value:
              ai.estimated_job_value,

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
        .select()
        .single();

    console.log("========== SAVED CALL ==========");
    console.dir(savedCall, { depth: null });

    if (callError) {
      console.error(
        "========== SUPABASE CALL ERROR =========="
      );

      console.error(callError);

      return NextResponse.json(
        {
          success: false,
          error: callError.message,
        },
        {
          status: 500,
        }
      );
    }

    console.log("✅ Call saved successfully");

    // ============================================================
    // CREWOS USER
    // ============================================================

    const leadUserId = CREWOS_USER_ID;
    const leadUserEmail = CREWOS_USER_EMAIL;

    console.log("========== LEAD OWNER ==========");
    console.log("user_id:", leadUserId);
    console.log("user_email:", leadUserEmail);

    // ============================================================
    // BUILD ADDRESS
    // ============================================================

    const addressParts = [
      ai.street_address,
      ai.city,
      ai.state,
      ai.zip_code,
    ].filter(Boolean);

    const address =
      addressParts.length > 0
        ? addressParts.join(", ")
        : null;

    // ============================================================
    // ESTIMATE
    // ============================================================

    const estimateNumber = ai.estimated_job_value
      ? Number(
          ai.estimated_job_value.replace(
            /[^0-9.]/g,
            ""
          )
        )
      : 0;

    // ============================================================
    // FIND EXISTING LEAD
    // ============================================================

    let existingLead = null;

    if (call.call_id) {
      const {
        data: possibleLead,
        error: existingLeadError,
      } = await supabaseServer
        .from("leads")
        .select("id")
        .eq("user_id", leadUserId)
        .eq("call_id", call.call_id)
        .limit(1)
        .maybeSingle();

      if (existingLeadError) {
        console.error(
          "Existing lead lookup error:",
          existingLeadError
        );
      }

      existingLead = possibleLead;
    }

    // ============================================================
    // LEAD DATA
    // ============================================================

    const leadData = {
      user_id: leadUserId,

      user_email: leadUserEmail,

      call_id: call.call_id,

      name:
        ai.customer_name ??
        call.caller_name ??
        null,

      service: ai.service,

      status: ai.status ?? "New Lead",

      phone:
        ai.phone ??
        call.from_number ??
        null,

      email: ai.email,

      address,

      estimate:
        Number.isFinite(estimateNumber)
          ? estimateNumber
          : 0,
    };

    console.log("========== FINAL LEAD DATA ==========");
    console.dir(leadData, { depth: null });

    // ============================================================
    // UPDATE EXISTING LEAD
    //
    // This is the important fix.
    //
    // If call_started created anything previously,
    // call_ended/call_analyzed now UPDATES it.
    // ============================================================

    if (existingLead) {
      console.log(
        "========== UPDATING EXISTING LEAD =========="
      );

      console.log(
        "Existing lead:",
        existingLead.id
      );

      const {
        data: updatedLead,
        error: updateLeadError,
      } = await supabaseServer
        .from("leads")
        .update(leadData)
        .eq("id", existingLead.id)
        .select()
        .single();

      if (updateLeadError) {
        console.error(
          "========== LEAD UPDATE ERROR =========="
        );

        console.error(updateLeadError);

        return NextResponse.json(
          {
            success: false,
            call_saved: true,
            lead_created: false,
            error: updateLeadError.message,
          },
          {
            status: 500,
          }
        );
      }

      console.log("========== UPDATED LEAD ==========");
      console.dir(updatedLead, { depth: null });

      console.log("✅ Existing lead updated successfully");

      return NextResponse.json({
        success: true,
        call_saved: true,
        lead_created: true,
        lead_updated: true,

        lead_score: leadScore.score,
        lead_priority: leadScore.priority,

        call_id: call.call_id,

        lead_id: updatedLead.id,
      });
    }

    // ============================================================
    // CREATE NEW LEAD
    // ============================================================

    console.log(
      "========== CREATING NEW LEAD =========="
    );

    const {
      data: newLead,
      error: leadError,
    } = await supabaseServer
      .from("leads")
      .insert(leadData)
      .select()
      .single();

    if (leadError) {
      console.error(
        "========== LEAD INSERT ERROR =========="
      );

      console.error(leadError);

      return NextResponse.json(
        {
          success: false,
          call_saved: true,
          lead_created: false,
          error: leadError.message,
        },
        {
          status: 500,
        }
      );
    }

    console.log("========== NEW LEAD ==========");
    console.dir(newLead, { depth: null });

    console.log("✅ New lead created successfully");

    // ============================================================
    // SUCCESS
    // ============================================================

    return NextResponse.json({
      success: true,

      call_saved: true,

      lead_created: true,

      lead_updated: false,

      lead_score: leadScore.score,

      lead_priority: leadScore.priority,

      call_id: call.call_id,

      lead_id: newLead.id,
    });
  } catch (err) {
    console.error("========== SERVER ERROR ==========");
    console.error(err);

    return NextResponse.json(
      {
        success: false,
        error:
          err instanceof Error
            ? err.message
            : "Unknown server error",
      },
      {
        status: 500,
      }
    );
  }
}

