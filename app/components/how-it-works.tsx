export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Lead Calls or Texts",
      description:
        "Every new lead instantly reaches your AI receptionist—24/7.",
    },
    {
      number: "02",
      title: "AI Qualifies Them",
      description:
        "CrewPilot answers questions, collects information, and qualifies the customer.",
    },
    {
      number: "03",
      title: "Appointment Booked",
      description:
        "Qualified leads are automatically scheduled on your calendar.",
    },
  ];

  return (
    <section className="py-28 bg-slate-950">
      <div className="max-w-6xl mx-auto px-6">

        <div className="text-center mb-20">
          <p className="text-blue-500 font-semibold uppercase tracking-widest">
            HOW IT WORKS
          </p>

          <h2 className="text-5xl font-bold mt-4">
            Three Steps.
            <br />
            More Booked Jobs.
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">

          {steps.map((step) => (
            <div
              key={step.number}
              className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 hover:border-blue-500 transition"
            >
              <div className="text-5xl font-bold text-blue-500 mb-6">
                {step.number}
              </div>

              <h3 className="text-2xl font-semibold mb-4">
                {step.title}
              </h3>

              <p className="text-slate-400 leading-7">
                {step.description}
              </p>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}