"use client";

import { createQuote } from "@/app/dashboard/quotes/new/actions";
import { useMemo, useState } from "react";

type Call = {
  call_id?: string;
  ai_customer_name?: string;
  caller_name?: string;
  ai_phone?: string;
  phone?: string;
  service?: string;
  city?: string;
  customer_type?: string;
  summary?: string;
  ai_summary?: string;
};

type Props = {
  call: Call | null;
};

export default function QuoteBuilder({ call }: Props) {
  const [customerName, setCustomerName] = useState(
    call?.ai_customer_name ?? call?.caller_name ?? ""
  );

  const [phone, setPhone] = useState(
    call?.ai_phone ?? call?.phone ?? ""
  );

  const [service, setService] = useState(
    call?.service ?? ""
  );

  const [city, setCity] = useState(
    call?.city ?? ""
  );

  const [customerType, setCustomerType] = useState(
    call?.customer_type ?? ""
  );

  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [pricePerSqFt, setPricePerSqFt] = useState("0.25");

  const [materialCost, setMaterialCost] = useState("");
  const [laborCost, setLaborCost] = useState("");
  const [miscCost, setMiscCost] = useState("");

  const [notes, setNotes] = useState(
    call?.summary ?? call?.ai_summary ?? ""
  );

  const lengthNumber = Number(length) || 0;
  const widthNumber = Number(width) || 0;

  const pricePerSqFtNumber =
    Number(pricePerSqFt) || 0;

  const materialCostNumber =
    Number(materialCost) || 0;

  const laborCostNumber =
    Number(laborCost) || 0;

  const miscCostNumber =
    Number(miscCost) || 0;

  const squareFeet = useMemo(
    () => lengthNumber * widthNumber,
    [lengthNumber, widthNumber]
  );

  const estimate = useMemo(
    () => squareFeet * pricePerSqFtNumber,
    [squareFeet, pricePerSqFtNumber]
  );

  const total = useMemo(
    () =>
      estimate +
      materialCostNumber +
      laborCostNumber +
      miscCostNumber,
    [
      estimate,
      materialCostNumber,
      laborCostNumber,
      miscCostNumber,
    ]
  );

  const displayService = service.trim()
    ? service.trim().charAt(0).toUpperCase() +
      service.trim().slice(1)
    : "Service";

  return (
    <form
      action={createQuote}
      className="space-y-8"
    >
      {/* Customer */}
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">
          Customer
        </h2>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Customer Name
            </label>

            <input
              name="customer_name"
              type="text"
              value={customerName}
              onChange={(e) =>
                setCustomerName(e.target.value)
              }
              placeholder="Customer name"
              className="w-full rounded-xl border border-slate-300 p-3"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Phone
            </label>

            <input
              name="phone"
              type="tel"
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value)
              }
              placeholder="Phone number"
              className="w-full rounded-xl border border-slate-300 p-3"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Service
            </label>

            <input
              name="service"
              type="text"
              value={service}
              onChange={(e) =>
                setService(e.target.value)
              }
              placeholder="Enter service"
              className="w-full rounded-xl border border-slate-300 p-3"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              City
            </label>

            <input
              name="city"
              type="text"
              value={city}
              onChange={(e) =>
                setCity(e.target.value)
              }
              placeholder="e.g. Somerset"
              className="w-full rounded-xl border border-slate-300 p-3"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Customer Type
            </label>

            <select
              name="customer_type"
              value={customerType}
              onChange={(e) =>
                setCustomerType(e.target.value)
              }
              className="w-full rounded-xl border border-slate-300 bg-white p-3"
            >
              <option value="">
                Select customer type
              </option>

              <option value="Residential">
                Residential
              </option>

              <option value="Commercial">
                Commercial
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* Estimate */}
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">
          Estimate
        </h2>

        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Length (ft)
            </label>

            <input
              name="length"
              type="number"
              min="0"
              step="0.01"
              value={length}
              onChange={(e) =>
                setLength(e.target.value)
              }
              placeholder="100"
              className="w-full rounded-xl border border-slate-300 p-3"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Width (ft)
            </label>

            <input
              name="width"
              type="number"
              min="0"
              step="0.01"
              value={width}
              onChange={(e) =>
                setWidth(e.target.value)
              }
              placeholder="20"
              className="w-full rounded-xl border border-slate-300 p-3"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Price / Sq Ft
            </label>

            <input
              name="price_per_sqft"
              type="number"
              min="0"
              step="0.01"
              value={pricePerSqFt}
              onChange={(e) =>
                setPricePerSqFt(e.target.value)
              }
              placeholder="0.25"
              className="w-full rounded-xl border border-slate-300 p-3"
            />
          </div>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Material Cost
            </label>

            <input
              name="material_cost"
              type="number"
              min="0"
              step="0.01"
              value={materialCost}
              onChange={(e) =>
                setMaterialCost(e.target.value)
              }
              placeholder="150"
              className="w-full rounded-xl border border-slate-300 p-3"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Labor Cost
            </label>

            <input
              name="labor_cost"
              type="number"
              min="0"
              step="0.01"
              value={laborCost}
              onChange={(e) =>
                setLaborCost(e.target.value)
              }
              placeholder="300"
              className="w-full rounded-xl border border-slate-300 p-3"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Misc Cost
            </label>

            <input
              name="misc_cost"
              type="number"
              min="0"
              step="0.01"
              value={miscCost}
              onChange={(e) =>
                setMiscCost(e.target.value)
              }
              placeholder="0"
              className="w-full rounded-xl border border-slate-300 p-3"
            />
          </div>
        </div>

        <div className="mt-8 space-y-2 rounded-xl bg-slate-100 p-6">
          <div className="flex justify-between">
            <span className="text-slate-600">
              Square Feet
            </span>

            <span className="font-medium">
              {squareFeet.toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-600">
              {displayService}
            </span>

            <span className="font-medium">
              ${estimate.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-600">
              Material
            </span>

            <span className="font-medium">
              ${materialCostNumber.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-600">
              Labor
            </span>

            <span className="font-medium">
              ${laborCostNumber.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-600">
              Misc
            </span>

            <span className="font-medium">
              ${miscCostNumber.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between border-t border-slate-300 pt-4 text-xl font-bold">
            <span>Total</span>

            <span className="text-blue-600">
              ${total.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <label className="mb-3 block text-lg font-bold text-slate-900">
          Notes
        </label>

        <textarea
          name="notes"
          rows={8}
          value={notes}
          onChange={(e) =>
            setNotes(e.target.value)
          }
          placeholder="Describe the work, materials, terms, or anything else the customer should know..."
          className="w-full rounded-xl border border-slate-300 p-3"
        />
      </div>

      <input
        type="hidden"
        name="call_id"
        value={call?.call_id ?? ""}
      />

      <input
        type="hidden"
        name="price"
        value={total}
      />

      <div className="flex justify-end">
        <button
          type="submit"
          className="rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          Save Quote
        </button>
      </div>
    </form>
  );
}