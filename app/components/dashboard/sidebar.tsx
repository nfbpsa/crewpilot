"use client";

import {
  LayoutDashboard,
  Phone,
  Users,
  Settings,
} from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-slate-950 text-white flex flex-col p-6">
      <h1 className="text-2xl font-bold mb-10">
        CrewPilot
      </h1>

      <nav className="space-y-2">
        <button className="flex w-full items-center gap-3 rounded-lg px-4 py-3 bg-slate-800">
          <LayoutDashboard size={18} />
          Dashboard
        </button>

        <button className="flex w-full items-center gap-3 rounded-lg px-4 py-3 hover:bg-slate-900">
          <Phone size={18} />
          Calls
        </button>

        <button className="flex w-full items-center gap-3 rounded-lg px-4 py-3 hover:bg-slate-900">
          <Users size={18} />
          Leads
        </button>

        <button className="flex w-full items-center gap-3 rounded-lg px-4 py-3 hover:bg-slate-900">
          <Settings size={18} />
          Settings
        </button>
      </nav>

      <div className="mt-auto text-sm text-slate-400">
        CrewPilot v1.0
      </div>
    </aside>
  );
}