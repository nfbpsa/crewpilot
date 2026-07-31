import Sidebar from "@/app/components/dashboard/sidebar";
import Header from "@/app/components/dashboard/header";
import Stats from "@/app/components/dashboard/stats";
import LeadsTable from "@/app/components/dashboard/leads-table";

import { supabase } from "@/lib/supabase";

type Lead = {
  call_id: string;
  caller_name: string | null;
  ai_customer_name: string | null;
  phone: string | null;
  ai_phone: string | null;
  service: string | null;
  city: string | null;
  status: string | null;
  created_at: string;
};

export default async function DashboardPage() {
  const { data } = await supabase
    .from("calls")
    .select("*")
    .order("created_at", { ascending: false });

  const leads = (data ?? []) as Lead[];

  return (
    <div className="flex h-screen bg-slate-100">
      <Sidebar />

      <main className="flex-1 overflow-auto">
        <Header />

        <div className="space-y-8 p-8">
          <Stats />

          <LeadsTable leads={leads} />
        </div>
      </main>
    </div>
  );
}