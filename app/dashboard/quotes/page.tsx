import Link from "next/link";
import { supabaseServer } from "@/lib/supabase-server";
import { capitalizeFirst } from "@/lib/format-text";

function formatPhone(phone?: string | null) {
  if (!phone) return "—";

  const digits = phone.replace(/\D/g, "");

  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }

  return phone;
}

export default async function QuotesPage() {
  const { data: quotes, error } = await supabaseServer
    .from("quotes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Quotes page error:", error);
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
        <div className="mb-8 flex items-start justify-between gap-6">
          <div>
            <p className="text-sm font-semibold text-blue-600">
              CrewPilot
            </p>

            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
              Quotes
            </h1>

            <p className="mt-2 text-slate-500">
              Create and manage customer estimates.
            </p>
          </div>

          <Link
            href="/dashboard/quotes/new"
            className="inline-flex items-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            + Create Quote
          </Link>
        </div>

        {/* Quotes Table */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {quotes && quotes.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Customer
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Service
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Phone
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Total
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Status
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Created
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {quotes.map((quote) => (
                    <tr
                      key={quote.id}
                      className="transition hover:bg-slate-50"
                    >
                      {/* Customer */}
                      <td className="px-6 py-5">
                        <Link
                          href={`/dashboard/quotes/${quote.id}`}
                          className="font-semibold text-slate-900 transition hover:text-blue-600 hover:underline"
                        >
                          {capitalizeFirst(quote.customer_name) ||
                            "Unknown Customer"}
                        </Link>
                      </td>

                      {/* Service */}
                      <td className="px-6 py-5 text-sm text-slate-700">
                        {capitalizeFirst(quote.service) || "—"}
                      </td>

                      {/* Phone */}
                      <td className="px-6 py-5 text-sm text-slate-700">
                        {formatPhone(quote.phone)}
                      </td>

                      {/* Total */}
                      <td className="px-6 py-5 text-sm font-semibold text-slate-900">
                        {quote.total_price !== null &&
                        quote.total_price !== undefined
                          ? `$${Number(quote.total_price).toLocaleString(
                              "en-US",
                              {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }
                            )}`
                          : "—"}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-5">
                        <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                          {capitalizeFirst(quote.status) || "Draft"}
                        </span>
                      </td>

                      {/* Created */}
                      <td className="px-6 py-5 text-sm text-slate-600">
                        {quote.created_at
                          ? new Date(
                              quote.created_at
                            ).toLocaleDateString()
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
                <span className="text-xl">📄</span>
              </div>

              <h2 className="mt-4 text-lg font-semibold text-slate-900">
                No quotes yet
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                Quotes you create for customers will appear here.
              </p>

              <Link
                href="/dashboard/quotes/new"
                className="mt-6 inline-flex items-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Create Your First Quote
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}