"use client";

import { useState } from "react";

const STATUSES = [
  "New Lead",
  "Contacted",
  "Estimate Scheduled",
  "Quote Sent",
  "Won",
  "Lost",
];

type Props = {
  callId: string;
  currentStatus: string;
};

const colors: Record<string, string> = {
  "New Lead":
    "bg-green-100 text-green-700 border-green-300",

  "Contacted":
    "bg-blue-100 text-blue-700 border-blue-300",

  "Estimate Scheduled":
    "bg-purple-100 text-purple-700 border-purple-300",

  "Quote Sent":
    "bg-orange-100 text-orange-700 border-orange-300",

  "Won":
    "bg-emerald-100 text-emerald-700 border-emerald-300",

  "Lost":
    "bg-red-100 text-red-700 border-red-300",
};

export default function StatusDropdown({
  callId,
  currentStatus,
}: Props) {
  const [status, setStatus] = useState(currentStatus);

  async function updateStatus(newStatus: string) {
    setStatus(newStatus);

    try {
      const res = await fetch("/api/leads/status", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          call_id: callId,
          status: newStatus,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update status.");
      setStatus(currentStatus);
    }
  }

  return (
    <select
      value={status}
      onChange={(e) => updateStatus(e.target.value)}
      className={`cursor-pointer rounded-full border px-4 py-2 text-sm font-semibold shadow-sm transition-all duration-200 hover:shadow-md focus:outline-none ${colors[status]}`}
    >
      {STATUSES.map((item) => (
        <option key={item} value={item}>
          {item}
        </option>
      ))}
    </select>
  );
}