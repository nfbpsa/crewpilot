"use client";

import { Bell, Search } from "lucide-react";

export default function Header() {
  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-8 py-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Dashboard
        </h1>

        <p className="mt-1 text-slate-500">
          Welcome back. Here's what's happening today.
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex w-96 items-center rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 transition focus-within:border-blue-500 focus-within:bg-white">
          <Search className="mr-3 h-5 w-5 text-slate-400" />

          <input
            type="text"
            placeholder="Search customers, phone, or service..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
          />
        </div>

        <button className="relative rounded-xl border border-slate-200 bg-white p-3 transition hover:bg-slate-50">
          <Bell className="h-5 w-5 text-slate-700" />

          <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-red-500" />
        </button>
      </div>
    </header>
  );
}