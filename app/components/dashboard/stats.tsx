import { Card, CardContent } from "@/components/ui/card";
import {
  PhoneCall,
  Users,
  BadgeCheck,
  Flame,
} from "lucide-react";

type Props = {
  todaysCalls: number;
  newLeads: number;
  wonJobs: number;
  hotLeads: number;
};

export default function Stats({
  todaysCalls,
  newLeads,
  wonJobs,
  hotLeads,
}: Props) {
  const stats = [
    {
      title: "Today's Calls",
      value: todaysCalls,
      subtitle: "Live Activity",
      icon: PhoneCall,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "New Leads",
      value: newLeads,
      subtitle: "Active Leads",
      icon: Users,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      title: "Won Jobs",
      value: wonJobs,
      subtitle: "Closed Deals",
      icon: BadgeCheck,
      color: "bg-violet-50 text-violet-600",
    },
    {
      title: "Hot Leads",
      value: hotLeads,
      subtitle: "90+ AI Score",
      icon: Flame,
      color: "bg-orange-50 text-orange-600",
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <Card
            key={stat.title}
            className="rounded-2xl border border-slate-200 shadow-sm transition hover:shadow-lg"
          >
            <CardContent className="flex items-center justify-between p-7">
              <div>
                <p className="text-sm text-slate-500">
                  {stat.title}
                </p>

                <h2 className="mt-3 text-5xl font-bold text-slate-900">
                  {stat.value}
                </h2>

                <p className="mt-3 text-sm text-slate-500">
                  {stat.subtitle}
                </p>
              </div>

              <div
                className={`flex h-16 w-16 items-center justify-center rounded-2xl ${stat.color}`}
              >
                <Icon className="h-8 w-8" />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}