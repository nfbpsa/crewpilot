import { notFound } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Lead = {
  call_id: string;
  caller_name: string | null;
  phone: string | null;
  customer_type: string | null;
  service: string | null;
  city: string | null;
  timeline: string | null;
  summary: string | null;
  transcript: string | null;
  status: string | null;
  created_at: string;
};

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function LeadDetails({ params }: Props) {
  const { id } = await params;

  const { data: call, error } = await supabase
    .from("calls")
    .select("*")
    .eq("call_id", id)
    .single();

  if (error || !call) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-6xl p-8">
        <Link
          href="/dashboard"
          className="mb-6 inline-block text-blue-600 hover:underline"
        >
          ← Back to Dashboard
        </Link>

        <div className="rounded-xl bg-white p-8 shadow">
          <h1 className="text-3xl font-bold">
            {call.caller_name ?? "Unknown Customer"}
          </h1>

          <p className="mt-2 text-slate-500">
            {call.phone ?? "-"}
          </p>

          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <h3 className="font-semibold">Service</h3>
              <p>{call.service ?? "-"}</p>
            </div>

            <div>
              <h3 className="font-semibold">City</h3>
              <p>{call.city ?? "-"}</p>
            </div>

            <div>
              <h3 className="font-semibold">Customer Type</h3>
              <p>{call.customer_type ?? "-"}</p>
            </div>

            <div>
              <h3 className="font-semibold">Status</h3>
              <p>{call.status ?? "-"}</p>
            </div>

            <div>
              <h3 className="font-semibold">Received</h3>
              <p>{new Date(call.created_at).toLocaleString()}</p>
            </div>
          </div>

          <div className="mt-10">
            <h2 className="mb-3 text-xl font-bold">AI Summary</h2>

            <div className="rounded-lg border bg-slate-50 p-4">
              {call.summary ?? "No summary available."}
            </div>
          </div>

          <div className="mt-8">
            <h2 className="mb-3 text-xl font-bold">Timeline</h2>

            <div className="rounded-lg border bg-slate-50 p-4 whitespace-pre-wrap">
              {call.timeline ?? "No timeline available."}
            </div>
          </div>

          <div className="mt-8">
            <h2 className="mb-3 text-xl font-bold">Transcript</h2>

            <div className="rounded-lg border bg-slate-50 p-4 whitespace-pre-wrap">
              {call.transcript ?? "No transcript available."}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}