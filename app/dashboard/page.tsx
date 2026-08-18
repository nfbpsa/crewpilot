import Sidebar from "@/app/components/dashboard/sidebar";
import Header from "@/app/components/dashboard/header";
import Stats from "@/app/components/dashboard/stats";
import LeadsTable from "@/app/components/dashboard/leads-table";
import RealtimeDashboard from "@/app/components/dashboard/realtime-dashboard";

import { supabaseServer } from "@/lib/supabase-server";

type Lead = {
  id: string;
  name: string | null;
  phone: string | null;
  service: string | null;
  status: string | null;
  lead_score?: number | null;
  created_at: string;
};

export default async function DashboardPage() {
  /*
   * ==========================================
   * CALLS
   * ==========================================
   *
   * Calls = actual phone calls handled
   * by the AI receptionist.
   */

  const { data: calls, error: callsError } =
    await supabaseServer
      .from("calls")
      .select(`
        id,
        call_id,
        caller_name,
        lead_score,
        lead_priority,
        created_at
      `)
      .order("created_at", { ascending: false });

  if (callsError) {
    console.error("Dashboard calls error:", callsError);
  }

  /*
   * ==========================================
   * LEADS
   * ==========================================
   *
   * Leads = actual CRM customers/leads.
   */

  const { data: leadData, error: leadsError } =
    await supabaseServer
      .from("leads")
      .select(`
        id,
        name,
        service,
        status,
        phone,
        email,
        address,
        estimate,
        call_id,
        created_at
      `)
      .order("created_at", { ascending: false });

  if (leadsError) {
    console.error("Dashboard leads error:", leadsError);
  }

  /*
   * ==========================================
   * MATCH CALLS TO LEADS
   * ==========================================
   *
   * leads.call_id matches calls.call_id.
   *
   * This lets us get the AI score from the
   * calls table while still using leads.id
   * as the CRM lead ID.
   */

  const callsByCallId = new Map(
    (calls ?? []).map((call) => [
      call.call_id,
      call,
    ])
  );

  const leads: Lead[] = (leadData ?? []).map(
    (lead) => {
      const matchingCall = lead.call_id
        ? callsByCallId.get(lead.call_id)
        : undefined;

      return {
        id: lead.id,
        name: lead.name,
        phone: lead.phone,
        service: lead.service,
        status: lead.status,
        lead_score:
          matchingCall?.lead_score ?? 0,
        created_at: lead.created_at,
      };
    }
  );

  /*
   * ==========================================
   * TODAY'S CALLS
   * ==========================================
   */

  const today = new Date().toDateString();

  const todaysCalls = (calls ?? []).filter(
    (call) =>
      new Date(call.created_at).toDateString() ===
      today
  ).length;

  /*
   * ==========================================
   * NEW LEADS
   * ==========================================
   */

  const newLeads = leads.filter((lead) => {
    const status = (lead.status ?? "")
      .trim()
      .toLowerCase();

    return (
      status === "new" ||
      status === "new lead"
    );
  }).length;

  /*
   * ==========================================
   * WON JOBS
   * ==========================================
   */

  const wonJobs = leads.filter((lead) => {
    const status = (lead.status ?? "")
      .trim()
      .toLowerCase();

    return (
      status === "won" ||
      status === "closed won" ||
      status === "completed"
    );
  }).length;

  /*
   * ==========================================
   * HOT LEADS
   * ==========================================
   */

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
                  New customers captured by your AI receptionist
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