export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute left-1/2 top-20 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-600/20 blur-3xl" />

      <div className="relative mx-auto flex max-w-6xl flex-col items-center px-6 py-28 text-center">
        <div className="rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm text-blue-300">
          AI Receptionists for Service Businesses
        </div>

        <h1 className="mt-8 max-w-5xl text-6xl font-extrabold leading-tight md:text-7xl">
          Never Miss
          <span className="text-blue-500"> Another Lead.</span>
        </h1>

        <p className="mt-8 max-w-2xl text-xl text-slate-400">
          CrewPilot answers calls, replies to texts, qualifies leads,
          books appointments, and follows up automatically 24/7.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <button className="rounded-xl bg-blue-600 px-8 py-4 font-semibold hover:bg-blue-700">
            Book a Demo
          </button>

          <button className="rounded-xl border border-slate-700 px-8 py-4 font-semibold hover:bg-slate-900">
            Watch Demo
          </button>
        </div>
      </div>
    </section>
  );
}