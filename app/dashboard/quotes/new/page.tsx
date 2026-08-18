import Link from "next/link";
import { supabaseServer } from "@/lib/supabase-server";
import QuoteForm from "./quote-form";

type Props = {
  searchParams: Promise<{
    lead_id?: string;
  }>;
};

export default async function NewQuotePage({ searchParams }: Props) {
  const { lead_id } = await searchParams;

  let lead = null;

  if (lead_id) {
    // First try the leads table because the Leads page uses this table.
    const { data: leadData, error: leadError } = await supabaseServer
      .from("leads")
      .select("*")
      .eq("id", lead_id)
      .maybeSingle();

    if (leadError) {
      console.error("LEADS TABLE ERROR:", leadError);
    }

    console.log("QUOTE LEAD ID:", lead_id);
    console.log("LEADS TABLE DATA:", leadData);

    if (leadData) {
      lead = {
        call_id: leadData.id,
        customer_name: leadData.name ?? "",
        phone: leadData.phone ?? "",
        customer_type: leadData.customer_type ?? "",
        service: leadData.service ?? "",
        city: leadData.city ?? "",
        state: leadData.state ?? "",
      };
    }

    // If it wasn't found in leads, try the calls table.
    if (!lead) {
      const { data: callData, error: callError } = await supabaseServer
        .from("calls")
        .select("*")
        .eq("call_id", lead_id)
        .maybeSingle();

      if (callError) {
        console.error("CALLS TABLE ERROR:", callError);
      }

      console.log("CALLS TABLE DATA:", callData);

      if (callData) {
        lead = {
          call_id: callData.call_id,
          customer_name: callData.caller_name ?? "",
          phone: callData.phone ?? "",
          customer_type: callData.customer_type ?? "",
          service: callData.service ?? "",
          city: callData.city ?? "",
          state: callData.state ?? "",
        };
      }
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-10">

        {/* Back */}
        <div className="mb-8">
          <Link
            href={
              lead_id
                ? `/dashboard/leads/${lead_id}`
                : "/dashboard/quotes"
            }
            className="text-sm font-medium text-slate-500 transition hover:text-slate-900"
          >
            ← Back
          </Link>
        </div>

        {/* Header */}
        <div className="mb-8">
          <p className="text-sm font-semibold text-blue-600">
            CrewPilot
          </p>

          <h1 className="mt-1 text-4xl font-bold tracking-tight text-slate-900">
            Create Quote
          </h1>

          <p className="mt-2 text-slate-500">
            Create an estimate for your customer.
          </p>
        </div>

        {/* Quote Form */}
        <QuoteForm lead={lead} />
      </div>
    </main>
  );
}