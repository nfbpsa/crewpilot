import Sidebar from "@/app/components/dashboard/sidebar";
import Header from "@/app/components/dashboard/header";
import Stats from "@/app/components/dashboard/stats";
import LeadsTable from "@/app/components/dashboard/leads-table";
import RealtimeDashboard from "@/app/components/dashboard/realtime-dashboard";

import { supabaseServer } from "@/lib/supabase-server";

type Lead = {
  call_id: string;
  caller_name: string | null;
  ai_customer_name: string | null;
  phone: string | null;
  ai_phone: string | null;
  service: string | null;
  city: string | null;
  status: string | null;
  estimated_job_value?: string | null;
  lead_score?: number | null;
  lead_priority?: string | null;
  created_at: string;
};

export default async function DashboardPage() {
  const { data, error } = await supabaseServer
    .from("calls")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
  }

  const leads = (data ?? []) as Lead[];

  const today = new Date().toDateString();

  const todaysCalls = leads.filter(
    (lead) =>
      new Date(lead.created_at).toDateString() === today
  ).length;

  const newLeads = leads.filter(
    (lead) => lead.status === "New Lead"
  ).length;

  const wonJobs = leads.filter(
    (lead) => lead.status === "Won"
  ).length;

  const hotLeads = leads.filter(
    (lead) => (lead.lead_score ?? 0) >= 90
  ).length;

  return (
    <div className="flex h-screen bg-slate-100">
      <Sidebar />

      <main className="flex-1 overflow-y-auto">
        <RealtimeDashboard />

        <Header />

        <div className="mx-auto max-w-7xl space-y-6 px-8 py-6">
          <Stats
            todaysCalls={todaysCalls}
            newLeads={newLeads}
            wonJobs={wonJobs}
            hotLeads={hotLeads}
          />

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 px-8 py-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Recent Leads
                </h2>

                <p className="mt-1 text-slate-500">
                  New calls captured by your AI receptionist
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
                  {newLeads} New
                </div>

                <div className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
                  {leads.length} Total
                </div>
              </div>
            </div>

            <LeadsTable leads={leads} />
          </section>
        </div>
      </main>
    </div>
  );
}