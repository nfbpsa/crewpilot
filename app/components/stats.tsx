export default function Stats() {
  const stats = [
    {
      number: "<10 sec",
      label: "Average Response Time",
    },
    {
      number: "24/7",
      label: "AI Availability",
    },
    {
      number: "100%",
      label: "Every Lead Answered",
    },
    {
      number: "+35%",
      label: "More Booked Jobs",
    },
  ];

  return (
    <section className="border-y border-slate-800 bg-slate-900/40 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-slate-800 bg-slate-900/50 p-8"
            >
              <h3 className="text-4xl font-bold text-blue-500">
                {stat.number}
              </h3>

              <p className="mt-3 text-slate-400">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}