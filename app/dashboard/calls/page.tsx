import Link from "next/link";
import { supabaseServer } from "@/lib/supabase-server";

function formatDate(value: string | null) {
  if (!value) return "—";

  return new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function priorityStyles(priority: string | null) {
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

export default async function CallsPage() {
  const { data: calls, error } = await supabaseServer
    .from("calls")
    .select(`
      id,
      call_id,
      caller_name,
      phone,
      customer_type,
      service,
      city,
      state,
      status,
      summary,
      lead_source,
      lead_score,
      lead_priority,
      created_at
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Calls page error:", error);
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-10">

        {/* Back to Dashboard */}
        <Link
          href="/dashboard"
          className="mb-6 inline-flex items-center text-sm font-medium text-slate-500 transition hover:text-slate-900"
        >
          ← Back to Dashboard
        </Link>

        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <div className="text-sm font-semibold text-blue-600">
              CrewPilot
            </div>

            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
              Calls
            </h1>

            <p className="mt-2 text-slate-500">
              View incoming calls and the leads created from them.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Total Calls
            </p>

            <p className="mt-1 text-2xl font-bold text-slate-900">
              {calls?.length ?? 0}
            </p>
          </div>
        </div>

        {/* Calls */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-5">
            <h2 className="text-lg font-semibold text-slate-900">
              Recent Calls
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Your newest calls appear first.
            </p>
          </div>

          {calls && calls.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px]">
                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Caller
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Service
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Location
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Type
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Score
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Priority
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Status
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Date
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {calls.map((call) => (
                    <tr
                      key={call.id}
                      className="transition hover:bg-slate-50"
                    >
                      {/* Caller */}
                      <td className="px-6 py-5">
                        <Link
                          href={`/dashboard/calls/${call.id}`}
                          className="block"
                        >
                          <p className="font-semibold text-slate-900 hover:text-blue-600">
                            {call.caller_name || "Unknown Caller"}
                          </p>

                          <p className="mt-1 text-sm text-slate-500">
                            {call.phone || "No phone number"}
                          </p>
                        </Link>
                      </td>

                      {/* Service */}
                      <td className="px-6 py-5">
                        <Link
                          href={`/dashboard/calls/${call.id}`}
                          className="block"
                        >
                          <p className="font-medium text-slate-900">
                            {call.service
                              ? call.service.charAt(0).toUpperCase() +
                                call.service.slice(1)
                              : "—"}
                          </p>

                          {call.summary && (
                            <p className="mt-1 max-w-xs truncate text-sm text-slate-500">
                              {call.summary}
                            </p>
                          )}
                        </Link>
                      </td>

                      {/* Location */}
                      <td className="px-6 py-5">
                        <Link
                          href={`/dashboard/calls/${call.id}`}
                          className="block"
                        >
                          <p className="text-sm text-slate-700">
                            {call.city || call.state
                              ? [call.city, call.state]
                                  .filter(Boolean)
                                  .join(", ")
                              : "—"}
                          </p>
                        </Link>
                      </td>

                      {/* Customer Type */}
                      <td className="px-6 py-5">
                        <Link
                          href={`/dashboard/calls/${call.id}`}
                          className="block"
                        >
                          <span className="text-sm text-slate-700">
                            {call.customer_type || "—"}
                          </span>
                        </Link>
                      </td>

                      {/* Lead Score */}
                      <td className="px-6 py-5">
                        <Link
                          href={`/dashboard/calls/${call.id}`}
                          className="block"
                        >
                          <span className="font-semibold text-slate-900">
                            {call.lead_score ?? "—"}
                          </span>
                        </Link>
                      </td>

                      {/* Priority */}
                      <td className="px-6 py-5">
                        <Link
                          href={`/dashboard/calls/${call.id}`}
                          className="block"
                        >
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${priorityStyles(
                              call.lead_priority
                            )}`}
                          >
                            {call.lead_priority || "Unscored"}
                          </span>
                        </Link>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-5">
                        <Link
                          href={`/dashboard/calls/${call.id}`}
                          className="block"
                        >
                          <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                            {call.status || "New Lead"}
                          </span>
                        </Link>
                      </td>

                      {/* Date */}
                      <td className="whitespace-nowrap px-6 py-5 text-sm text-slate-500">
                        <Link
                          href={`/dashboard/calls/${call.id}`}
                          className="block"
                        >
                          {formatDate(call.created_at)}
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                <span className="text-xl">📞</span>
              </div>

              <h3 className="mt-4 text-lg font-semibold text-slate-900">
                No calls yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                Once your Retell agent receives a call, the call and lead
                information will appear here.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}