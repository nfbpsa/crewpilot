import Link from "next/link";
import { supabaseServer } from "@/lib/supabase-server";
import { formatPhone, capitalizeFirst } from "@/lib/format-text";

function formatText(value: string | null | undefined) {
  if (!value) return "";

  return value
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .map((word) => {
      if (!word) return "";

      return (
        word.charAt(0).toUpperCase() +
        word.slice(1)
      );
    })
    .join(" ");
}

function formatStatus(status: string | null | undefined) {
  if (!status) return "New";

  const normalized = status.trim().toLowerCase();

  switch (normalized) {
    case "new":
      return "New";

    case "new lead":
      return "New Lead";

    case "contacted":
      return "Contacted";

    case "estimate scheduled":
      return "Estimate Scheduled";

    case "quote sent":
      return "Quote Sent";

    case "won":
      return "Won";

    case "lost":
      return "Lost";

    default:
      return formatText(status);
  }
}

function statusColor(status: string | null | undefined) {
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
      return "bg-green-100 text-green-700";

    case "lost":
      return "bg-red-100 text-red-700";

    default:
      return "bg-slate-100 text-slate-700";
  }
}

function formatEstimate(
  estimate: number | string | null | undefined
) {
  if (
    estimate === null ||
    estimate === undefined ||
    estimate === ""
  ) {
    return "—";
  }

  const amount = Number(estimate);

  if (Number.isNaN(amount)) {
    return "—";
  }

  return amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatDate(date: string | null | undefined) {
  if (!date) return "—";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "—";
  }

  return parsedDate.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
}

export default async function LeadsPage() {
  const { data: leads, error } = await supabaseServer
    .from("leads")
    .select("*")
    .eq(
      "user_id",
      "51366006-9380-4040-8acd-f930c90dafe0"
    )
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error("Leads page error:", error);
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-10">

        {/* Back to Dashboard */}
        <Link
          href="/dashboard"
          className="mb-6 inline-flex items-center text-sm font-medium text-slate-500 transition hover:text-slate-900"
        >
          ← Back to Dashboard
        </Link>

        {/* Header */}
        <div className="mb-8 flex items-start justify-between">

          <div>
            <div className="text-sm font-semibold text-blue-600">
              CrewPilot
            </div>

            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
              Leads
            </h1>

            <p className="mt-2 text-slate-500">
              Manage your contractor leads.
            </p>
          </div>

          {/* Total Leads */}
          <div className="rounded-xl border border-slate-200 bg-white px-5 py-3 shadow-sm">

            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Total Leads
            </p>

            <p className="mt-1 text-2xl font-bold text-slate-900">
              {leads?.length ?? 0}
            </p>

          </div>
        </div>

        {/* Leads Table */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          {leads && leads.length > 0 ? (

            <div className="overflow-x-auto">
              <table className="w-full">

                {/* Table Header */}
                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Name
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Service
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Phone
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Email
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Status
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Estimate
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Created
                    </th>

                  </tr>
                </thead>

                {/* Table Body */}
                <tbody className="divide-y divide-slate-100">

                  {leads.map((lead) => {

                    const customerName =
                      formatText(lead.name) || "Unknown Customer";

                    const service =
                      formatText(lead.service) || "—";

                    const email =
                      lead.email
                        ? lead.email.trim().toLowerCase()
                        : "—";

                    const status =
                      formatStatus(lead.status);

                    return (
                      <tr
                        key={lead.id}
                        className="cursor-pointer transition hover:bg-slate-50"
                      >

                        {/* Name */}
                        <td className="p-0">
                          <Link
                            href={`/dashboard/leads/${lead.id}`}
                            className="block px-6 py-5"
                          >
                            <p className="font-semibold text-slate-900">
                              {customerName}
                            </p>
                          </Link>
                        </td>

                        {/* Service */}
                        <td className="p-0">
                          <Link
                            href={`/dashboard/leads/${lead.id}`}
                            className="block px-6 py-5 text-sm text-slate-700"
                          >
                            {service}
                          </Link>
                        </td>

                        {/* Phone */}
                        <td className="p-0">
                          <Link
                            href={`/dashboard/leads/${lead.id}`}
                            className="block whitespace-nowrap px-6 py-5 text-sm text-slate-700"
                          >
                            {lead.phone
                              ? formatPhone(lead.phone)
                              : "—"}
                          </Link>
                        </td>

                        {/* Email */}
                        <td className="p-0">
                          <Link
                            href={`/dashboard/leads/${lead.id}`}
                            className="block px-6 py-5 text-sm text-slate-700"
                          >
                            {email}
                          </Link>
                        </td>

                        {/* Status */}
                        <td className="p-0">
                          <Link
                            href={`/dashboard/leads/${lead.id}`}
                            className="block px-6 py-5"
                          >
                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusColor(
                                lead.status
                              )}`}
                            >
                              {status}
                            </span>
                          </Link>
                        </td>

                        {/* Estimate */}
                        <td className="p-0">
                          <Link
                            href={`/dashboard/leads/${lead.id}`}
                            className="block whitespace-nowrap px-6 py-5 text-sm font-semibold text-slate-900"
                          >
                            {formatEstimate(lead.estimate)}
                          </Link>
                        </td>

                        {/* Created */}
                        <td className="p-0">
                          <Link
                            href={`/dashboard/leads/${lead.id}`}
                            className="block whitespace-nowrap px-6 py-5 text-sm text-slate-500"
                          >
                            {formatDate(lead.created_at)}
                          </Link>
                        </td>

                      </tr>
                    );
                  })}

                </tbody>
              </table>
            </div>

          ) : (

            /* Empty State */
            <div className="px-6 py-16 text-center">

              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                <span className="text-xl">👤</span>
              </div>

              <h2 className="mt-4 text-lg font-semibold text-slate-900">
                No Leads Yet
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                Leads created from incoming calls will appear here.
              </p>

            </div>
          )}

        </div>
      </div>
    </main>
  );
}