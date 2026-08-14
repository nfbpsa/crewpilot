import Link from "next/link";
import { supabaseServer } from "@/lib/supabase-server";

export default async function LeadsPage() {
  const { data: leads, error } = await supabaseServer
    .from("leads")
    .select("*")
    .eq("user_id", "51366006-9380-4040-8acd-f930c90dafe0")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Leads page error:", error);
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
              Leads
            </h1>

            <p className="mt-2 text-slate-500">
              Manage your contractor leads.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white px-5 py-3 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Total Leads
            </p>

            <p className="mt-1 text-2xl font-bold text-slate-900">
              {leads?.length ?? 0}
            </p>
          </div>
        </div>

        {/* Leads Table */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {leads && leads.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Name
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Service
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Phone
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Email
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Status
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Estimate
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {leads.map((lead) => (
                    <tr
                      key={lead.id}
                      className="transition hover:bg-slate-50"
                    >
                      <td className="px-6 py-5">
                        <p className="font-semibold text-slate-900">
                          {lead.name}
                        </p>
                      </td>

                      <td className="px-6 py-5 text-sm text-slate-700">
                        {lead.service || "—"}
                      </td>

                      <td className="px-6 py-5 text-sm text-slate-700">
                        {lead.phone || "—"}
                      </td>

                      <td className="px-6 py-5 text-sm text-slate-700">
                        {lead.email || "—"}
                      </td>

                      <td className="px-6 py-5">
                        <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                          {lead.status || "New"}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-sm font-semibold text-slate-900">
                        {lead.estimate
                          ? `$${Number(lead.estimate).toLocaleString()}`
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                <span className="text-xl">👤</span>
              </div>

              <h2 className="mt-4 text-lg font-semibold text-slate-900">
                No leads yet
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                Leads created from incoming calls will appear here.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}