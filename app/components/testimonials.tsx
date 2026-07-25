export default function Testimonials() {
  const testimonials = [
    {
      name: "Mike R.",
      company: "Elite Plumbing",
      quote:
        "CrewPilot started answering our calls after hours and we immediately booked more jobs.",
    },
    {
      name: "Sarah L.",
      company: "Precision Roofing",
      quote:
        "We stopped missing leads. The AI books appointments while my team stays focused on the work.",
    },
    {
      name: "David C.",
      company: "Pro Electric",
      quote:
        "This pays for itself every month. We never worry about missed calls anymore.",
    },
  ];

  return (
    <section className="bg-slate-950 py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-16 text-center">
          <p className="font-semibold uppercase tracking-[0.3em] text-blue-500">
            TESTIMONIALS
          </p>

          <h2 className="mt-4 text-5xl font-bold">
            Trusted By
            <br />
            Service Businesses.
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((item) => (
            <div
              key={item.name}
              className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8"
            >
              <p className="mb-8 leading-7 text-slate-300">
                "{item.quote}"
              </p>

              <div>
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-slate-400">{item.company}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}