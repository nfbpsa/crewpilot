import Navbar from "./components/navbar";
import Hero from "./components/hero";
import Stats from "./components/stats";
import HowItWorks from "./components/how-it-works";
import Features from "./components/features";
import Testimonials from "./components/testimonials";
import Pricing from "./components/pricing";
import DemoForm from "./components/demo-form";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <Hero />
      <Stats />
      <HowItWorks />
      <Features />
      <Testimonials />
      <Pricing />
      <DemoForm />
    </main>
  );
}