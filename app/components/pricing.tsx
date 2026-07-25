export default function Pricing() {
  const plans = [
    {
      name: "Starter",
      price: "$297",
      description: "Perfect for small service businesses.",
      features: [
        "AI Receptionist",
        "24/7 Call Answering",
        "SMS Follow-Up",
        "Appointment Booking",
      ],
    },
    {
      name: "Growth",
      price: "$497",
      description: "Our most popular plan.",
      featured: true,
      features: [
        "Everything in Starter",
        "Custom AI Training",
        "Missed Call Recovery",
        "Priority Support",
      ],
    },
  ];

  return (
    <section className="bg-slate-950 py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-16 text-center">
          <p className="font-semibold uppercase tracking-[0.3em] text-blue-500">
            PRICING
          </p>

          <h2 className="mt-4 text-5xl font-bold">
            Simple Pricing.
            <br />
            Real Results.
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-3xl border p-10 ${
                plan.featured
                  ? "border-blue-500 bg-slate-900"
                  : "border-slate-800 bg-slate-900/60"
              }`}
            >
              <h3 className="text-3xl font-bold">{plan.name}</h3>

              <div className="mt-6 text-5xl font-bold">
                {plan.price}
                <span className="text-xl text-slate-400">/month</span>
              </div>

              <p className="mt-4 text-slate-400">
                {plan.description}
              </p>

              <ul className="mt-8 space-y-4">
                {plan.features.map((feature) => (
                  <li key={feature}>✓ {feature}</li>
                ))}
              </ul>

              <button className="mt-10 w-full rounded-xl bg-blue-600 py-4 font-semibold hover:bg-blue-500 transition">
                Get Started
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}