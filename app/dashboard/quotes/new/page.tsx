import { supabaseServer } from "@/lib/supabase-server";
import QuoteBuilder from "@/components/quotes/quote-builder";

type Props = {
  searchParams: Promise<{
    lead?: string;
  }>;
};

export default async function NewQuotePage({
  searchParams,
}: Props) {
  const { lead } = await searchParams;

  let call: any = null;

  if (lead) {
    const { data } = await supabaseServer
      .from("calls")
      .select("*")
      .eq("call_id", lead)
      .single();

    call = data;
  }

return (
  <div className="mx-auto max-w-6xl p-8">
    <h1 className="text-3xl font-bold text-slate-900">
      Create Quote
    </h1>

    <p className="mt-2 text-slate-500">
      Build an estimate for your customer.
    </p>

    <div className="mt-8">
      <QuoteBuilder call={call} />
    </div>
  </div>
);  
}