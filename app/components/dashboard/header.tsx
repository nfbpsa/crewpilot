"use client";

import { Bell, Search } from "lucide-react";

export default function Header() {
  return (
    <header className="flex items-center justify-between border-b bg-white px-8 py-5">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-slate-500">
          AI-powered contractor CRM
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center rounded-lg border px-3 py-2">
          <Search className="mr-2 h-4 w-4 text-slate-400" />
          <input
            className="outline-none"
            placeholder="Search..."
          />
        </div>

        <button className="rounded-lg border p-2">
          <Bell className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}