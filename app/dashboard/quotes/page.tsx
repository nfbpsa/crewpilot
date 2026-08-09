import Link from "next/link";
import { supabaseServer } from "@/lib/supabase-server";

export default async function QuotesPage() {
  const { data: quotes } = await supabaseServer
    .from("quotes")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-8">
      {/* Back to Dashboard */}
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="text-sm font-medium text-blue-600 transition hover:text-blue-700"
        >
          ← Back to Dashboard
        </Link>
      </div>

      {/* Page Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-slate-900">
            Quotes
          </h1>

          <p className="mt-2 text-slate-500">
            Manage estimates for your customers.
          </p>
        </div>

        <Link
          href="/dashboard/quotes/new"
          className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          New Quote
        </Link>
      </div>

      {/* Quotes Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full">
          <thead className="bg-slate-900 text-white">
            <tr>
              <th className="px-6 py-4 text-left">
                Customer
              </th>

              <th className="px-6 py-4 text-left">
                Service
              </th>

              <th className="px-6 py-4 text-left">
                Total
              </th>

              <th className="px-6 py-4 text-left">
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {quotes?.map((quote) => (
              <tr
                key={quote.id}
                className="border-b border-slate-200 last:border-b-0 hover:bg-slate-50"
              >
                <td className="px-6 py-5">
                  <Link
                    href={`/dashboard/quotes/${quote.id}`}
                    className="font-semibold text-blue-600 hover:underline"
                  >
                    {quote.customer_name}
                  </Link>
                </td>

                <td className="px-6 py-5">
                  {quote.service}
                </td>

                <td className="px-6 py-5">
                  ${Number(quote.total_price ?? 0).toFixed(2)}
                </td>

                <td className="px-6 py-5">
                  {quote.status || "Draft"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}