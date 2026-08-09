import { notFound } from "next/navigation";

import { supabaseServer } from "@/lib/supabase-server";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

type Quote = {
  id: string;
  customer_name?: string | null;
  phone?: string | null;
  service?: string | null;
  city?: string | null;
  customer_type?: string | null;
  notes?: string | null;
  length?: number | null;
  width?: number | null;
  square_feet?: number | null;
  price_per_sqft?: number | null;
  material_cost?: number | null;
  labor_cost?: number | null;
  misc_cost?: number | null;
  total_price?: number | null;
  status?: string | null;
  created_at?: string | null;
};

function money(value: number | null | undefined) {
  return `$${Number(value ?? 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export default async function PublicQuotePage({
  params,
}: Props) {
  const { id } = await params;

  const { data, error } = await supabaseServer
    .from("quotes")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    notFound();
  }

  const quote = data as Quote;

  const squareFeet = Number(quote.square_feet ?? 0);
  const pricePerSqFt = Number(quote.price_per_sqft ?? 0);

  const createdDate = quote.created_at
    ? new Date(quote.created_at).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "—";

  const status = quote.status || "Draft";

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between gap-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Loadstar Trucking
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Estimate / Quote
            </p>
          </div>

          <div className="text-right">
            <p className="text-sm text-slate-500">
              Estimate
            </p>

            <p className="font-semibold text-slate-900">
              #{quote.id.slice(0, 8)}
            </p>
          </div>
        </div>

        {/* Main Card */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* Quote Header */}
          <div className="border-b border-slate-200 p-6 sm:p-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                  Estimate
                </p>

                <h2 className="mt-2 text-3xl font-bold text-slate-900">
                  {quote.customer_name || "Customer"}
                </h2>

                <p className="mt-2 text-slate-500">
                  {quote.service || "Service"}
                </p>

                <p className="mt-1 text-sm text-slate-400">
                  Created {createdDate}
                </p>
              </div>

              <div className="sm:text-right">
                <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-700">
                  {status}
                </span>

                <p className="mt-3 text-3xl font-bold text-blue-600">
                  {money(quote.total_price)}
                </p>
              </div>
            </div>
          </div>

          {/* Customer */}
          <div className="grid gap-8 border-b border-slate-200 p-6 sm:p-8 md:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Customer
              </h3>

              <div className="mt-4 space-y-2">
                <p className="font-semibold text-slate-900">
                  {quote.customer_name || "—"}
                </p>

                <p className="text-slate-600">
                  {quote.phone || "No phone number"}
                </p>

                <p className="text-slate-600">
                  {quote.city || "No city provided"}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Customer Type
              </h3>

              <p className="mt-4 font-semibold text-slate-900">
                {quote.customer_type || "—"}
              </p>
            </div>
          </div>

          {/* Service */}
          <div className="border-b border-slate-200 p-6 sm:p-8">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Service Details
            </h3>

            <div className="mt-6 grid gap-6 sm:grid-cols-2 md:grid-cols-4">
              <div>
                <p className="text-sm text-slate-500">
                  Service
                </p>

                <p className="mt-1 font-semibold text-slate-900">
                  {quote.service || "—"}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Length
                </p>

                <p className="mt-1 font-semibold text-slate-900">
                  {quote.length ?? 0} ft
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Width
                </p>

                <p className="mt-1 font-semibold text-slate-900">
                  {quote.width ?? 0} ft
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Square Feet
                </p>

                <p className="mt-1 font-semibold text-slate-900">
                  {squareFeet.toLocaleString()} sq ft
                </p>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="border-b border-slate-200 p-6 sm:p-8">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Pricing
            </h3>

            <div className="mt-6 max-w-2xl space-y-4">
              <div className="flex justify-between gap-4">
                <span className="text-slate-600">
                  Price / Sq Ft
                </span>

                <span className="font-medium text-slate-900">
                  {money(pricePerSqFt)}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-slate-600">
                  Service
                </span>

                <span className="font-medium text-slate-900">
                  {money(squareFeet * pricePerSqFt)}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-slate-600">
                  Material
                </span>

                <span className="font-medium text-slate-900">
                  {money(quote.material_cost)}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-slate-600">
                  Labor
                </span>

                <span className="font-medium text-slate-900">
                  {money(quote.labor_cost)}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-slate-600">
                  Miscellaneous
                </span>

                <span className="font-medium text-slate-900">
                  {money(quote.misc_cost)}
                </span>
              </div>

              <div className="flex justify-between border-t border-slate-200 pt-4 text-xl font-bold">
                <span className="text-slate-900">
                  Total
                </span>

                <span className="text-blue-600">
                  {money(quote.total_price)}
                </span>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="p-6 sm:p-8">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Notes
            </h3>

            <div className="mt-4 rounded-xl bg-slate-50 p-5">
              <p className="whitespace-pre-wrap text-slate-700">
                {quote.notes || "No notes added."}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="py-8 text-center text-sm text-slate-400">
          <p className="font-semibold text-slate-600">
            Loadstar Trucking
          </p>

          <p className="mt-1">
            Thank you for your business.
          </p>
        </div>
      </div>
    </main>
  );
}