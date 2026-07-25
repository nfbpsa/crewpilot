const features = [
  {
    title: "AI Receptionist",
    description: "Answer every lead instantly, even after business hours.",
    icon: "🤖",
  },
  {
    title: "SMS Follow-Up",
    description: "Automatically text new leads within seconds.",
    icon: "💬",
  },
  {
    title: "Appointment Booking",
    description: "Book appointments directly into your calendar.",
    icon: "📅",
  },
];

export default function Features() {
  return (
    <section
      id="features"
      className="mx-auto max-w-6xl px-6 py-20"
    >
      <h2 className="mb-12 text-center text-4xl font-bold">
        Everything You Need
      </h2>

      <div className="grid gap-6 md:grid-cols-3">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="rounded-2xl border border-slate-800 bg-slate-900 p-8 transition hover:-translate-y-1 hover:border-blue-500"
          >
            <div className="mb-4 text-4xl">{feature.icon}</div>

            <h3 className="mb-3 text-2xl font-bold">
              {feature.title}
            </h3>

            <p className="text-slate-400">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}