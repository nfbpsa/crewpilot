import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { Resend } from "resend";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log("Incoming request:", body);

    // Save to Supabase
    const { data, error } = await supabase
      .from("demo_requests")
      .insert([
        {
          business_name: body.businessName,
          name: body.name,
          email: body.email,
          phone: body.phone,
        },
      ])
      .select();

    if (error) {
      console.error("Supabase Error:", error);

      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 500 }
      );
    }

    console.log("Inserted:", data);

    // Send email notification
    try {
      await resend.emails.send({
        from: "CrewPilot <onboarding@resend.dev>",

        // While your domain is NOT verified,
        // this MUST be the email you signed up with.
        to: "rprofits@hotmail.com",

        subject: "🚀 New CrewPilot Demo Request",

        html: `
          <h2>New Demo Request</h2>

          <p><strong>Business:</strong> ${body.businessName}</p>

          <p><strong>Name:</strong> ${body.name}</p>

          <p><strong>Email:</strong> ${body.email}</p>

          <p><strong>Phone:</strong> ${body.phone}</p>
        `,
      });

      console.log("Email sent!");
    } catch (err) {
      console.error("Resend API Error:", err);
    }

    return NextResponse.json({
      success: true,
    });
  } catch (err) {
    console.error("Server Error:", err);

    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Unknown server error",
      },
      { status: 500 }
    );
  }
}