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
  lead_score?: number | null;
  lead_priority?: string | null;
  created_at: string;
};

type Props = {
  leads: Lead[];
};

function formatPhone(phone: string | null) {
  if (!phone) return "-";

  const digits = phone.replace(/\D/g, "");

  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }

  return phone;
}

function initials(name: string | null) {
  if (!name) return "??";

  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
}

function statusColor(status: string | null) {
  switch ((status ?? "").toLowerCase()) {
    case "new lead":
      return "bg-emerald-100 text-emerald-700";

    case "contacted":
      return "bg-blue-100 text-blue-700";

    case "estimate scheduled":
      return "bg-violet-100 text-violet-700";

    case "quote sent":
      return "bg-orange-100 text-orange-700";

    case "won":
      return "bg-green-100 text-green-700";

    case "lost":
      return "bg-red-100 text-red-700";

    default:
      return "bg-slate-100 text-slate-700";
  }
}

function scoreColor(score: number) {
  if (score >= 90) return "bg-emerald-100 text-emerald-700";
  if (score >= 75) return "bg-amber-100 text-amber-700";
  return "bg-red-100 text-red-700";
}

export default function LeadsTable({ leads }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-slate-900 text-white">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase">
              Customer
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase">
              Phone
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase">
              Service
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase">
              AI Score
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase">
              Status
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase">
              Received
            </th>
          </tr>
        </thead>

        <tbody>
          {leads.length === 0 ? (
            <tr>
              <td
                colSpan={6}
                className="py-20 text-center text-slate-500"
              >
                No leads yet.
              </td>
            </tr>
          ) : (
            leads.map((lead) => {
              const customer =
                lead.ai_customer_name ??
                lead.caller_name ??
                "Unknown Customer";

              const score = lead.lead_score ?? 0;

              return (
                <tr
                  key={lead.call_id}
                  className="border-b border-slate-100 hover:bg-slate-50 transition"
                >
                  
                   <td className="px-6 py-5">
  <Link
    href={`/dashboard/leads/${lead.call_id}`}
    className="flex items-center gap-4"
  >
    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 font-semibold text-white">
      {initials(customer)}
    </div>

    <div>
      <p className="font-semibold text-slate-900">
        {customer}
      </p>

      <p className="text-sm text-slate-500">
        {lead.service ?? "Unknown Service"}
      </p>
    </div>
  </Link>
</td>

<td className="px-6 py-5">
  {formatPhone(lead.ai_phone ?? lead.phone)}
</td>

<td className="px-6 py-5">
  <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
    {lead.service ?? "-"}
  </span>
</td>

<td className="px-6 py-5">
  <span
    className={`rounded-full px-3 py-1 text-xs font-bold ${scoreColor(
      score
    )}`}
  >
    {score}
  </span>
</td> 
<td className="px-6 py-5">
  <span
    className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColor(
      lead.status
    )}`}
  >
    {lead.status ?? "New Lead"}
  </span>
</td>

<td className="px-6 py-5 text-sm text-slate-500">
  <div>
    {new Date(lead.created_at).toLocaleDateString()}
  </div>

  <div>
    {new Date(lead.created_at).toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    })}
  </div>
</td>

</tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}