export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-slate-800/50 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <h1 className="text-2xl font-bold tracking-tight">
          Crew<span className="text-blue-500">Pilot</span>
        </h1>

        <div className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
          <a href="#features" className="hover:text-white transition">
            Features
          </a>
          <a href="#how" className="hover:text-white transition">
            How It Works
          </a>
          <a href="#pricing" className="hover:text-white transition">
            Pricing
          </a>
          <a href="#contact" className="hover:text-white transition">
            Contact
          </a>
        </div>

        <button className="rounded-xl bg-blue-600 px-5 py-2 font-semibold hover:bg-blue-700 transition">
          Book Demo
        </button>
      </div>
    </nav>
  );
}