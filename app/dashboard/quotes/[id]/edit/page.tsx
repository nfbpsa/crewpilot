import Link from "next/link";
import { notFound } from "next/navigation";

import EditQuoteBuilder from "@/components/quotes/edit-quote-builder";
import { supabaseServer } from "@/lib/supabase-server";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditQuotePage({
  params,
}: Props) {
  const { id } = await params;

  const { data: quote, error } = await supabaseServer
    .from("quotes")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !quote) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-6xl p-8">
      <div className="mb-8">
        <Link
          href={`/dashboard/quotes/${id}`}
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          ← Back to Quote
        </Link>

        <h1 className="mt-3 text-3xl font-bold text-slate-900">
          Edit Quote
        </h1>

        <p className="mt-2 text-slate-500">
          Update the customer, service, pricing, or notes.
        </p>
      </div>

      <EditQuoteBuilder quote={quote} />
    </div>
  );
}