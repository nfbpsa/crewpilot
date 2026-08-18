import Link from "next/link";

type Lead = {
  id: string;
  name: string | null;
  phone: string | null;
  service: string | null;
  status: string | null;
  lead_score?: number | null;
  created_at: string;
};

type Props = {
  leads: Lead[];
};

function capitalizeFirst(value?: string | null) {
  if (!value) return "";

  const trimmed = value.trim();

  if (!trimmed) return "";

  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

function formatName(name?: string | null) {
  if (!name) return "Unknown Customer";

  return name
    .trim()
    .split(/\s+/)
    .map((word) => capitalizeFirst(word))
    .join(" ");
}

function formatPhone(phone?: string | null) {
  if (!phone) return "-";

  const numberWords: Record<string, string> = {
    zero: "0",
    one: "1",
    two: "2",
    three: "3",
    four: "4",
    five: "5",
    six: "6",
    seven: "7",
    eight: "8",
    nine: "9",
  };

  const words = phone.toLowerCase().trim().split(/\s+/);

  const converted = words
    .map((word) => numberWords[word] ?? word)
    .join("");

  const digits = converted.replace(/\D/g, "");

  const normalized =
    digits.length === 11 && digits.startsWith("1")
      ? digits.slice(1)
      : digits;

  if (normalized.length === 10) {
    return `(${normalized.slice(0, 3)}) ${normalized.slice(
      3,
      6
    )}-${normalized.slice(6)}`;
  }

  return phone;
}

function initials(name: string | null) {
  if (!name) return "??";

  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
}

function formatService(service?: string | null) {
  if (!service) return "-";

  return service
    .trim()
    .split(/\s+/)
    .map((word) => capitalizeFirst(word))
    .join(" ");
}

function formatStatus(status?: string | null) {
  if (!status) return "New Lead";

  return status
    .trim()
    .split(/\s+/)
    .map((word) => capitalizeFirst(word))
    .join(" ");
}

function statusColor(status: string | null) {
  switch ((status ?? "").trim().toLowerCase()) {
    case "new":
    case "new lead":
      return "bg-emerald-100 text-emerald-700";

    case "contacted":
      return "bg-blue-100 text-blue-700";

    case "estimate scheduled":
      return "bg-violet-100 text-violet-700";

    case "quote sent":
      return "bg-orange-100 text-orange-700";

    case "won":
    case "closed won":
    case "completed":
      return "bg-green-100 text-green-700";

    case "lost":
      return "bg-red-100 text-red-700";

    default:
      return "bg-slate-100 text-slate-700";
  }
}

function scoreColor(score: number) {
  if (score >= 90) {
    return "bg-orange-100 text-orange-700";
  }

  if (score >= 70) {
    return "bg-amber-100 text-amber-700";
  }

  if (score >= 40) {
    return "bg-blue-100 text-blue-700";
  }

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
              const customer = formatName(lead.name);
              const service = formatService(lead.service);
              const status = formatStatus(lead.status);
              const score = lead.lead_score ?? 0;

              return (
                <tr
                  key={lead.id}
                  className="border-b border-slate-100 transition hover:bg-slate-50"
                >
                  {/* Customer */}
                  <td className="px-6 py-5">
                    <Link
                      href={`/dashboard/leads/${lead.id}`}
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
                          {service || "Unknown Service"}
                        </p>
                      </div>
                    </Link>
                  </td>

                  {/* Phone */}
                  <td className="px-6 py-5 text-sm text-slate-700">
                    {formatPhone(lead.phone)}
                  </td>

                  {/* Service */}
                  <td className="px-6 py-5">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
                      {service}
                    </span>
                  </td>

                  {/* AI Score */}
                  <td className="px-6 py-5">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${scoreColor(
                        score
                      )}`}
                    >
                      {score}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-5">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColor(
                        lead.status
                      )}`}
                    >
                      {status}
                    </span>
                  </td>

                  {/* Received */}
                  <td className="px-6 py-5 text-sm text-slate-500">
                    <div>
                      {new Date(
                        lead.created_at
                      ).toLocaleDateString()}
                    </div>

                    <div>
                      {new Date(
                        lead.created_at
                      ).toLocaleTimeString([], {
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