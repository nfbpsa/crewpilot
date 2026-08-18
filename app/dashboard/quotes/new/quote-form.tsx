"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { capitalizeFirst } from "@/lib/format-text";

type Lead = {
  call_id: string;
  customer_name: string;
  phone: string;
  customer_type: string;
  service: string;
  city: string;
  state: string;
};

type Props = {
  lead: Lead | null;
};

function normalizePhone(phone?: string | null) {
  if (!phone) return "";

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

  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }

  return phone;
}

function formatPhoneInput(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 10);

  if (digits.length <= 3) {
    return digits;
  }

  if (digits.length <= 6) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  }

  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

export default function QuoteForm({ lead }: Props) {
  const router = useRouter();

  const [customerName, setCustomerName] = useState(
    capitalizeFirst(lead?.customer_name)
  );

  const [phone, setPhone] = useState(
    normalizePhone(lead?.phone)
  );

  const [customerType, setCustomerType] = useState(
    capitalizeFirst(lead?.customer_type)
  );

  const [service, setService] = useState(
    capitalizeFirst(lead?.service)
  );

  const [city, setCity] = useState(
    capitalizeFirst(lead?.city)
  );

  const [state, setState] = useState(
    capitalizeFirst(lead?.state)
  );

  const [description, setDescription] = useState(
    lead?.service
      ? `Estimate for ${capitalizeFirst(lead.service)}`
      : ""
  );

  const [price, setPrice] = useState("");

  const [notes, setNotes] = useState("");

  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setSaving(true);

    try {
      const response = await fetch("/api/quotes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lead_id: lead?.call_id ?? null,
          customer_name: customerName,
          phone,
          customer_type: customerType,
          service,
          city,
          state,
          description,
          total_price: Number(price || 0),
          notes,
          status: "Draft",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);

        console.error("Create quote failed:", errorData);

        throw new Error(
          errorData?.error ||
            errorData?.details ||
            errorData?.message ||
            "Failed to create quote"
        );
      }

      router.push("/dashboard/quotes");
      router.refresh();
    } catch (error) {
      console.error("Create quote error:", error);

      const message =
        error instanceof Error
          ? error.message
          : "Could not create quote. Please try again.";

      alert(message);
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

  return (
    <form onSubmit={handleSubmit} className="space-y-8">

      {/* Customer Information */}
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900">
          Customer Information
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Information from the lead has been filled in automatically.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">

          {/* Customer Name */}
          <div>
            <label className="font-semibold text-slate-700">
              Customer Name
            </label>

            <input
              value={customerName}
              onChange={(e) =>
                setCustomerName(capitalizeFirst(e.target.value))
              }
              className={inputClass}
              placeholder="Customer name"
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label className="font-semibold text-slate-700">
              Phone
            </label>

            <input
              type="tel"
              value={phone}
              onChange={(e) =>
                setPhone(formatPhoneInput(e.target.value))
              }
              className={inputClass}
              placeholder="(908) 555-1234"
            />
          </div>

          {/* Customer Type */}
          <div>
            <label className="font-semibold text-slate-700">
              Customer Type
            </label>

            <input
              value={customerType}
              onChange={(e) =>
                setCustomerType(capitalizeFirst(e.target.value))
              }
              className={inputClass}
              placeholder="Residential or Commercial"
            />
          </div>

          {/* Service */}
          <div>
            <label className="font-semibold text-slate-700">
              Service
            </label>

            <input
              value={service}
              onChange={(e) =>
                setService(capitalizeFirst(e.target.value))
              }
              className={inputClass}
              placeholder="Service"
              required
            />
          </div>

          {/* City */}
          <div>
            <label className="font-semibold text-slate-700">
              City
            </label>

            <input
              value={city}
              onChange={(e) =>
                setCity(capitalizeFirst(e.target.value))
              }
              className={inputClass}
              placeholder="City"
            />
          </div>

          {/* State */}
          <div>
            <label className="font-semibold text-slate-700">
              State
            </label>

            <input
              value={state}
              onChange={(e) =>
                setState(capitalizeFirst(e.target.value))
              }
              className={inputClass}
              placeholder="State"
            />
          </div>

        </div>
      </div>

      {/* Estimate */}
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900">
          Estimate
        </h2>

        <div className="mt-6">
          <label className="font-semibold text-slate-700">
            Description
          </label>

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={`${inputClass} min-h-32`}
            placeholder="Describe the work being quoted..."
          />
        </div>

        <div className="mt-6">
          <label className="font-semibold text-slate-700">
            Total Price
          </label>

          <div className="relative mt-2">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
              $
            </span>

            <input
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className={`${inputClass} pl-9`}
              placeholder="0.00"
              required
            />
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900">
          Notes to Customer
        </h2>

        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className={`${inputClass} mt-6 min-h-32`}
          placeholder="Add any additional notes..."
        />
      </div>

      {/* Actions */}
      <div className="flex flex-col-reverse gap-4 sm:flex-row sm:justify-end">

        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Creating..." : "Create Quote"}
        </button>

      </div>
    </form>
  );
}