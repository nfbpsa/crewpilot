import Link from "next/link";
import { notFound } from "next/navigation";

import { supabaseServer } from "@/lib/supabase-server";
import PrintButton from "@/components/quotes/print-button";
import SendQuoteButton from "@/components/quotes/send-quote-button";
import { capitalizeFirst } from "@/lib/format-text";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

type Quote = {
  id: string;
  call_id?: string | null;
  customer_name?: string | null;
  phone?: string | null;
  service?: string | null;
  city?: string | null;
  state?: string | null;
  customer_type?: string | null;
  notes?: string | null;
  description?: string | null;
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

function formatPhone(phone?: string | null) {
  if (!phone) return "—";

  const digits = phone.replace(/\D/g, "");

  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }

  return phone;
}

export default async function QuotePage({ params }: Props) {
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

  const customerName =
    capitalizeFirst(quote.customer_name) || "Customer";

  const serviceName =
    capitalizeFirst(quote.service) || "Service";

  const customerType =
    capitalizeFirst(quote.customer_type) || "—";

  const createdDate = quote.created_at
    ? new Date(quote.created_at).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "—";

  const squareFeet = Number(quote.square_feet ?? 0);
  const pricePerSqFt = Number(quote.price_per_sqft ?? 0);

  const serviceTotal = squareFeet * pricePerSqFt;

  return (
    <>
      <style>{`
        @page {
          size: Letter;
          margin: 0.35in;
        }

        @media print {
          html,
          body {
            background: white !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      `}</style>

      <div className="min-h-screen bg-slate-100 print:min-h-0 print:bg-white">
        <div className="mx-auto max-w-7xl p-8 print:max-w-none print:p-0">

          {/* Screen Header */}
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center print:hidden">

            <div>
              {/* Back to Quotes */}
              <Link
                href="/dashboard/quotes"
                className="inline-flex items-center text-sm font-medium text-slate-500 transition hover:text-slate-900"
              >
                ← Back to Quotes
              </Link>

              <h1 className="mt-3 text-3xl font-bold text-slate-900">
                Quote
              </h1>

              <p className="mt-1 text-slate-500">
                Created {createdDate}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3">

              <Link
                href={`/dashboard/quotes/${quote.id}/edit`}
                className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Edit Quote
              </Link>

              <SendQuoteButton
                customerName={customerName}
                phone={quote.phone}
                total={Number(quote.total_price ?? 0)}
                quoteUrl={`https://crewpilot-taupe.vercel.app/q/${quote.id}`}
              />

              <PrintButton />

            </div>
          </div>

          {/* Printable Quote */}
          <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm print:mt-0 print:rounded-none print:border-0 print:shadow-none">

            {/* Print Header */}
            <div className="hidden border-b border-slate-200 px-7 py-4 print:block">
              <div className="flex items-start justify-between">

                <div>
                  <h1 className="text-2xl font-bold text-slate-900">
                    Loadstar Trucking
                  </h1>

                  <p className="mt-0.5 text-xs text-slate-500">
                    Estimate / Quote
                  </p>
                </div>

                <div className="text-right text-xs">
                  <p className="text-slate-500">
                    Estimate #{quote.id.slice(0, 8)}
                  </p>

                  <p className="font-semibold text-slate-900">
                    {createdDate}
                  </p>
                </div>

              </div>
            </div>

            {/* Estimate Header */}
            <div className="border-b border-slate-200 px-7 py-5 print:px-7 print:py-4">

              <div className="flex items-start justify-between gap-6">

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Estimate
                  </p>

                  <h2 className="mt-1 text-2xl font-bold text-slate-900 print:text-xl">
                    {customerName}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    {serviceName}
                  </p>
                </div>

                <div className="text-right">

                  <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700 print:bg-transparent print:p-0 print:text-slate-700">
                    {capitalizeFirst(quote.status) || "Draft"}
                  </span>

                  <div className="mt-2 text-2xl font-bold text-blue-600 print:text-xl">
                    {money(quote.total_price)}
                  </div>

                </div>

              </div>

            </div>

            {/* Customer */}
            <div className="grid grid-cols-2 gap-8 border-b border-slate-200 px-7 py-5 print:px-7 print:py-4">

              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Customer
                </h3>

                <div className="mt-2 space-y-1">

                  <p className="text-base font-semibold text-slate-900">
                    {customerName}
                  </p>

                  <p className="text-sm text-slate-600">
                    {formatPhone(quote.phone)}
                  </p>

                  <p className="text-sm text-slate-600">
                    {capitalizeFirst(quote.city) || "No city provided"}
                    {quote.state
                      ? `, ${quote.state.toUpperCase()}`
                      : ""}
                  </p>

                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Customer Type
                </h3>

                <p className="mt-2 text-base font-semibold text-slate-900">
                  {customerType}
                </p>
              </div>

            </div>

            {/* Service Details */}
            <div className="border-b border-slate-200 px-7 py-5 print:px-7 print:py-4">

              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Service Details
              </h3>

              <div className="mt-3 grid grid-cols-4 gap-5">

                <div>
                  <p className="text-xs text-slate-500">
                    Service
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {serviceName}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">
                    Length
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {quote.length ?? 0} ft
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">
                    Width
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {quote.width ?? 0} ft
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">
                    Square Feet
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {squareFeet.toLocaleString()} sq ft
                  </p>
                </div>

              </div>

              {quote.description && (
                <div className="mt-5">
                  <p className="text-xs text-slate-500">
                    Description
                  </p>

                  <p className="mt-1 whitespace-pre-wrap text-sm font-medium text-slate-900">
                    {quote.description}
                  </p>
                </div>
              )}

            </div>

            {/* Pricing */}
            <div className="border-b border-slate-200 px-7 py-5 print:px-7 print:py-4">

              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Pricing
              </h3>

              <div className="mt-3 max-w-xl space-y-2">

                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">
                    Price / Sq Ft
                  </span>

                  <span className="font-medium text-slate-900">
                    {money(quote.price_per_sqft)}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">
                    {serviceName}
                  </span>

                  <span className="font-medium text-slate-900">
                    {money(serviceTotal)}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">
                    Material
                  </span>

                  <span className="font-medium text-slate-900">
                    {money(quote.material_cost)}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">
                    Labor
                  </span>

                  <span className="font-medium text-slate-900">
                    {money(quote.labor_cost)}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">
                    Miscellaneous
                  </span>

                  <span className="font-medium text-slate-900">
                    {money(quote.misc_cost)}
                  </span>
                </div>

                <div className="flex justify-between border-t border-slate-200 pt-2 text-lg font-bold">

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
            <div className="px-7 py-5 print:px-7 print:py-4">

              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Notes
              </h3>

              <div className="mt-2 rounded-lg bg-slate-50 p-3 print:bg-white print:p-0">

                <p className="whitespace-pre-wrap text-xs leading-relaxed text-slate-700">
                  {quote.notes || "No notes added."}
                </p>

              </div>
            </div>

            {/* Footer */}
            <div className="hidden border-t border-slate-200 px-7 py-3 print:block">

              <div className="flex justify-between text-[10px] text-slate-400">

                <span>
                  Loadstar Trucking
                </span>

                <span>
                  Estimate #{quote.id.slice(0, 8)}
                </span>

              </div>

            </div>

          </div>
        </div>
      </div>
    </>
  );
}