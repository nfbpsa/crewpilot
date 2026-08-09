"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Phone,
  Users,
  FileText,
  Settings,
} from "lucide-react";

const navItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Calls",
    href: "/dashboard/calls",
    icon: Phone,
  },
    {
    name: "Leads",
    href: "/dashboard/leads",
    icon: Users,
  },
  {
    name: "Quotes",
    href: "/dashboard/quotes",
    icon: FileText,
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-64 flex-col border-r border-slate-800 bg-slate-950 text-white">
      <div className="border-b border-slate-800 px-8 py-8">
        <h1 className="text-3xl font-bold tracking-tight">
          CrewPilot
        </h1>

        <p className="mt-2 text-sm text-slate-400">
          AI Contractor CRM
        </p>
      </div>

      <nav className="flex-1 space-y-2 p-5">
        {navItems.map((item) => {
          const Icon = item.icon;

          const active =
            pathname === item.href ||
            pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 font-medium transition-all duration-200 ${
                active
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-slate-300 hover:bg-slate-900 hover:text-white"
              }`}
            >
              <Icon size={19} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-800 p-5">
        <div className="rounded-xl bg-slate-900 p-4">
          <p className="text-sm font-semibold">
            CrewPilot v1.0
          </p>

          <p className="mt-1 text-xs text-slate-400">
            AI Receptionist Connected
          </p>
        </div>
      </div>
    </aside>
  );
}