"use client";

import { useState } from "react";

export default function DemoForm() {
  const [formData, setFormData] = useState({
    businessName: "",
    name: "",
    email: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/demo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (result.success) {
        setSuccess(true);

        setTimeout(() => {
          window.location.href = "https://cal.com/rey-ybbssm/demo";
        }, 1500);
      } else {
        alert(result.error || "Something went wrong.");
      }
    } catch (err) {
      console.error(err);
      alert("Server error.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="demo" className="py-24 px-6">
      <div className="mx-auto max-w-xl rounded-2xl bg-white p-8 shadow-2xl">
        <h2 className="text-center text-3xl font-bold text-gray-900">
          Book Your Free Demo
        </h2>

        <p className="mt-3 text-center text-gray-600">
          See how CrewPilot can answer calls, qualify leads, and book jobs
          automatically.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label className="mb-2 block font-medium text-gray-800">
              Business Name
            </label>

            <input
              type="text"
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              placeholder="ABC Contracting"
              required
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-black placeholder:text-gray-400 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium text-gray-800">
              Your Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Smith"
              required
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-black placeholder:text-gray-400 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium text-gray-800">
              Email Address
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@company.com"
              required
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-black placeholder:text-gray-400 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium text-gray-800">
              Phone Number
            </label>

            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="(555) 123-4567"
              required
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-black placeholder:text-gray-400 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-black py-3 font-semibold text-white transition hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Schedule Free Demo"}
          </button>
        </form>

        {success && (
          <div className="mt-6 rounded-lg bg-green-100 p-4 text-center text-green-700">
            ✅ Success! Redirecting you to your booking page...
          </div>
        )}
      </div>
    </section>
  );
}