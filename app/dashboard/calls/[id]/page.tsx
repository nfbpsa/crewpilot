import { notFound } from "next/navigation";
import { supabaseServer } from "@/lib/supabase-server";

interface CallPageProps {
  params: Promise<{
    id: string;
  }>;
}

function formatDate(value: string | null | undefined) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatValue(value: unknown) {
  if (value === null || value === undefined || value === "") {
    return "—";
  }

  if (typeof value === "object") {
    return JSON.stringify(value, null, 2);
  }

  return String(value);
}

function priorityStyles(priority: string | null | undefined) {
  switch ((priority ?? "").toLowerCase()) {
    case "high":
      return "bg-red-100 text-red-700";

    case "medium":
      return "bg-amber-100 text-amber-700";

    case "low":
      return "bg-slate-100 text-slate-600";

    default:
      return "bg-slate-100 text-slate-600";
  }
}

export default async function CallDetailsPage({
  params,
}: CallPageProps) {
  const { id } = await params;

  const { data: call, error } = await supabaseServer
    .from("calls")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !call) {
    console.error("Call details error:", error);
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-6 py-8 lg:px-8">
        {/* Back */}
        <div className="mb-6">
          <a
            href="/dashboard/calls"
            className="text-sm font-medium text-slate-500 transition hover:text-slate-900"
          >
            ← Back to Calls
          </a>
        </div>

        {/* Header */}
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-blue-600">
              Call Details
            </p>

            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
              {call.caller_name || "Unknown Caller"}
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              {formatDate(call.created_at)}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`rounded-full px-4 py-2 text-sm font-semibold ${priorityStyles(
                call.lead_priority
              )}`}
            >
              {call.lead_priority || "Unscored"} Priority
            </span>

            <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
              {call.status || "New"}
            </span>
          </div>
        </div>

        {/* Lead score */}
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Lead Score
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {call.lead_score ?? "—"}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Out of 100
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Service
            </p>

            <p className="mt-2 text-xl font-bold text-slate-900">
              {call.service || "—"}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Lead Source
            </p>

            <p className="mt-2 text-xl font-bold text-slate-900">
              {call.lead_source || "—"}
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Customer information */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
            <h2 className="text-lg font-semibold text-slate-900">
              Customer Information
            </h2>

            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Full Name
                </p>

                <p className="mt-1 text-sm font-medium text-slate-900">
                  {formatValue(call.caller_name)}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Phone
                </p>

                <p className="mt-1 text-sm font-medium text-slate-900">
                  {formatValue(call.phone)}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Email
                </p>

                <p className="mt-1 text-sm font-medium text-slate-900">
                  {formatValue(call.email)}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Customer Type
                </p>

                <p className="mt-1 text-sm font-medium text-slate-900">
                  {formatValue(call.customer_type)}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  City
                </p>

                <p className="mt-1 text-sm font-medium text-slate-900">
                  {formatValue(call.city)}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  State
                </p>

                <p className="mt-1 text-sm font-medium text-slate-900">
                  {formatValue(call.state)}
                </p>
              </div>

              <div className="sm:col-span-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Property Address
                </p>

                <p className="mt-1 text-sm font-medium text-slate-900">
                  {formatValue(
                    call.property_address ??
                      call.address ??
                      call.customer_address
                  )}
                </p>
              </div>
            </div>
          </section>

          {/* Call information */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
              Call Information
            </h2>

            <div className="mt-6 space-y-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Call ID
                </p>

                <p className="mt-1 break-all text-sm text-slate-700">
                  {formatValue(call.call_id)}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Status
                </p>

                <p className="mt-1 text-sm font-medium text-slate-900">
                  {formatValue(call.status)}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Created
                </p>

                <p className="mt-1 text-sm text-slate-700">
                  {formatDate(call.created_at)}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Service
                </p>

                <p className="mt-1 text-sm font-medium text-slate-900">
                  {formatValue(call.service)}
                </p>
              </div>
            </div>
          </section>

          {/* Project information */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-3">
            <h2 className="text-lg font-semibold text-slate-900">
              Project Information
            </h2>

            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Project Description
                </p>

                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                  {formatValue(
                    call.project_description ??
                      call.description ??
                      call.summary
                  )}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Preferred Callback Time
                </p>

                <p className="mt-1 text-sm text-slate-700">
                  {formatValue(
                    call.preferred_callback_time ??
                      call.callback_time
                  )}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Project Timeline
                </p>

                <p className="mt-1 text-sm text-slate-700">
                  {formatValue(
                    call.project_timeline ??
                      call.timeline ??
                      call.desired_timeline
                  )}
                </p>
              </div>

              <div className="sm:col-span-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Additional Notes
                </p>

                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                  {formatValue(
                    call.additional_notes ??
                      call.notes
                  )}
                </p>
              </div>
            </div>
          </section>

          {/* AI summary */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
            <h2 className="text-lg font-semibold text-slate-900">
              Lead Summary
            </h2>

            <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-slate-700">
              {formatValue(call.summary)}
            </p>
          </section>

          {/* Lead scoring */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
              Lead Scoring
            </h2>

            <div className="mt-5">
              <p className="text-3xl font-bold text-slate-900">
                {call.lead_score ?? "—"}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Lead score
              </p>
            </div>

            {call.lead_score_reasons && (
              <div className="mt-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Score Reasons
                </p>

                <pre className="mt-2 whitespace-pre-wrap break-words rounded-xl bg-slate-50 p-4 text-xs leading-5 text-slate-700">
                  {formatValue(call.lead_score_reasons)}
                </pre>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}