import { Card, CardContent } from "@/components/ui/card";

export default function Stats() {
  const stats = [
    {
      title: "Today's Calls",
      value: "12",
    },
    {
      title: "New Leads",
      value: "4",
    },
    {
      title: "Answered",
      value: "100%",
    },
    {
      title: "Revenue Pipeline",
      value: "$18,500",
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardContent className="p-6">
            <p className="text-sm text-slate-500">
              {stat.title}
            </p>

            <h2 className="mt-3 text-3xl font-bold">
              {stat.value}
            </h2>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}