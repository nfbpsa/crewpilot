import Link from "next/link";

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

type Props = {
  leads: Lead[];
};

export default function LeadsTable({ leads }: Props) {
  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow">
      <table className="w-full">
        <thead className="bg-slate-900 text-white">
          <tr>
            <th className="px-6 py-4 text-left">Customer</th>
            <th className="px-6 py-4 text-left">Phone</th>
            <th className="px-6 py-4 text-left">Service</th>
            <th className="px-6 py-4 text-left">City</th>
            <th className="px-6 py-4 text-left">Status</th>
            <th className="px-6 py-4 text-left">Received</th>
          </tr>
        </thead>

        <tbody>
          {leads.map((lead) => (
            <tr
              key={lead.call_id}
              className="border-t hover:bg-slate-50"
            >
              <td className="px-6 py-4">
                <Link
                  href={`/dashboard/leads/${lead.call_id}`}
                  className="font-medium text-slate-900 hover:text-blue-600"
                >
                  {lead.ai_customer_name ??
                    lead.caller_name ??
                    "Unknown Customer"}
                </Link>
              </td>

              <td className="px-6 py-4">
                {lead.ai_phone ??
                  lead.phone ??
                  "-"}
              </td>

              <td className="px-6 py-4">
                {lead.service ?? "-"}
              </td>

              <td className="px-6 py-4">
                {lead.city ?? "-"}
              </td>

              <td className="px-6 py-4">
                <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">
                  {lead.status ?? "New Lead"}
                </span>
              </td>

              <td className="px-6 py-4">
                {new Date(lead.created_at).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}