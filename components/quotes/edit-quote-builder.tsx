"use client";

import { updateQuote } from "@/app/dashboard/quotes/[id]/edit/actions";
import { useMemo, useState } from "react";

type Quote = {
  id: string;
  customer_name?: string | null;
  phone?: string | null;
  service?: string | null;
  city?: string | null;
  customer_type?: string | null;
  notes?: string | null;
  length?: number | null;
  width?: number | null;
  price_per_sqft?: number | null;
  material_cost?: number | null;
  labor_cost?: number | null;
  misc_cost?: number | null;
};

type Props = {
  quote: Quote;
};

export default function EditQuoteBuilder({ quote }: Props) {
  const [customerName, setCustomerName] = useState(
    quote.customer_name ?? ""
  );

  const [phone, setPhone] = useState(
    quote.phone ?? ""
  );

  const [service, setService] = useState(
    quote.service ?? ""
  );

  const [city, setCity] = useState(
    quote.city ?? ""
  );

  const [customerType, setCustomerType] = useState(
    quote.customer_type ?? ""
  );

  const [length, setLength] = useState(
    String(quote.length ?? "")
  );

  const [width, setWidth] = useState(
    String(quote.width ?? "")
  );

  const [pricePerSqFt, setPricePerSqFt] = useState(
    String(quote.price_per_sqft ?? "0")
  );

  const [materialCost, setMaterialCost] = useState(
    String(quote.material_cost ?? "")
  );

  const [laborCost, setLaborCost] = useState(
    String(quote.labor_cost ?? "")
  );

  const [miscCost, setMiscCost] = useState(
    String(quote.misc_cost ?? "")
  );

  const [notes, setNotes] = useState(
    quote.notes ?? ""
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

  const sealcoatingTotal = useMemo(
    () => squareFeet * pricePerSqFtNumber,
    [squareFeet, pricePerSqFtNumber]
  );

  const total = useMemo(
    () =>
      sealcoatingTotal +
      materialCostNumber +
      laborCostNumber +
      miscCostNumber,
    [
      sealcoatingTotal,
      materialCostNumber,
      laborCostNumber,
      miscCostNumber,
    ]
  );

  return (
    <form
      action={updateQuote}
      className="space-y-8"
    >
      <input
        type="hidden"
        name="id"
        value={quote.id}
      />

      {/* CUSTOMER */}
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

      {/* ESTIMATE */}
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
              className="w-full rounded-xl border border-slate-300 p-3"
            />
          </div>
        </div>

        {/* TOTAL */}
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
              Sealcoating
            </span>

            <span className="font-medium">
              ${sealcoatingTotal.toFixed(2)}
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

      {/* NOTES */}
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
          className="w-full rounded-xl border border-slate-300 p-3"
        />
      </div>

      {/* BUTTONS */}
      <div className="flex items-center justify-end gap-3">
        <a
          href={`/dashboard/quotes/${quote.id}`}
          className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 hover:bg-slate-50"
        >
          Cancel
        </a>

        <button
          type="submit"
          className="rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
}