import { notFound } from "next/navigation";
import Link from "next/link";
import { supabaseServer } from "@/lib/supabase-server";
import { capitalizeFirst } from "@/lib/format-text";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

function formatPhone(phone?: string | null) {
  if (!phone) return "—";

  const digits = phone.replace(/\D/g, "");

  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }

  return phone;
}

function formatText(value?: string | null) {
  if (!value) return "—";

  return capitalizeFirst(value);
}

export default async function LeadDetails({ params }: Props) {
  const { id } = await params;

  const { data: lead, error } = await supabaseServer
    .from("leads")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Lead detail error:", error);
    notFound();
  }

  if (!lead) {
    console.error("No lead found for ID:", id);
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-10">

        {/* Back to Leads */}
        <div className="mb-8">
          <Link
            href="/dashboard/leads"
            className="text-sm font-medium text-slate-500 transition hover:text-slate-900"
          >
            ← Back to Leads
          </Link>
        </div>

        {/* Page Header */}
        <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm font-semibold text-blue-600">
              CrewPilot
            </p>

            <h1 className="mt-1 text-4xl font-bold tracking-tight text-slate-900">
              {formatText(lead.name)}
            </h1>

            <p className="mt-2 text-slate-500">
              Lead details and customer information
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-3">

            {/* Call */}
            {lead.phone ? (
              <a
                href={`tel:${lead.phone}`}
                className="inline-flex items-center rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700"
              >
                ☎ Call
              </a>
            ) : (
              <span className="inline-flex cursor-not-allowed items-center rounded-lg bg-slate-300 px-4 py-2 text-sm font-semibold text-white">
                ☎ Call
              </span>
            )}

            {/* Text */}
            {lead.phone ? (
              <a
                href={`sms:${lead.phone}`}
                className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                💬 Text
              </a>
            ) : (
              <span className="inline-flex cursor-not-allowed items-center rounded-lg bg-slate-300 px-4 py-2 text-sm font-semibold text-white">
                💬 Text
              </span>
            )}

            {/* Create Quote */}
            <Link
              href={`/dashboard/quotes/new?lead_id=${lead.id}`}
              className="inline-flex items-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              📄 Create Quote
            </Link>
          </div>
        </div>

        {/* Customer Information */}
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">

          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                {formatText(lead.name)}
              </h2>

              <p className="mt-2 text-slate-500">
                {formatPhone(lead.phone)}
              </p>
            </div>

            <span className="inline-flex w-fit rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
              {formatText(lead.status || "New")}
            </span>
          </div>

          <div className="my-8 border-t border-slate-200" />

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">

            {/* Name */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Customer Name
              </p>

              <p className="mt-2 font-semibold text-slate-900">
                {formatText(lead.name)}
              </p>
            </div>

            {/* Phone */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Phone
              </p>

              <p className="mt-2 font-semibold text-slate-900">
                {formatPhone(lead.phone)}
              </p>
            </div>

            {/* Email */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Email
              </p>

              <p className="mt-2 font-semibold text-slate-900">
                {lead.email || "—"}
              </p>
            </div>

            {/* Customer Type */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Customer Type
              </p>

              <p className="mt-2 font-semibold text-slate-900">
                {formatText(lead.customer_type)}
              </p>
            </div>

            {/* Service */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Service
              </p>

              <p className="mt-2 font-semibold text-slate-900">
                {formatText(lead.service)}
              </p>
            </div>

            {/* City */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                City
              </p>

              <p className="mt-2 font-semibold text-slate-900">
                {formatText(lead.city)}
              </p>
            </div>

            {/* State */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                State
              </p>

              <p className="mt-2 font-semibold text-slate-900">
                {formatText(lead.state)}
              </p>
            </div>

            {/* Estimate */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Estimate
              </p>

              <p className="mt-2 font-semibold text-slate-900">
                {lead.estimate
                  ? `$${Number(lead.estimate).toLocaleString()}`
                  : "—"}
              </p>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">
            Notes
          </h2>

          <div className="mt-4 whitespace-pre-wrap rounded-xl border border-slate-200 bg-slate-50 p-5 leading-7 text-slate-700">
            {lead.notes || "No notes available."}
          </div>
        </div>

        {/* Lead Information */}
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">
            Lead Information
          </h2>

          <div className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Created
            </p>

            <p className="mt-2 font-semibold text-slate-900">
              {lead.created_at
                ? new Date(lead.created_at).toLocaleString()
                : "—"}
            </p>
          </div>
        </div>

      </div>
    </main>
  );
}