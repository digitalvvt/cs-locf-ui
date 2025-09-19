import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,
  FileText,
  UserCog,
  UserCheck,
  Layers,
  BookOpen,
  ListOrdered,
  Map,
} from "lucide-react";

// Small formatter util
// Small formatter util (Indian-style: K for thousands, L for lakhs)
const fmt = (raw?: number) => {
  const n = Number(raw ?? 0);
  if (!Number.isFinite(n)) return "0";

  const sign = n < 0 ? "-" : "";
  const abs = Math.abs(n);

  // 1,00,000 and up -> L (Lakh)
  if (abs >= 100_000) {
    const v = Math.floor((abs / 100_000) * 10) / 10; // floor to 1 decimal
    const txt = Number.isInteger(v) ? v.toFixed(0) : v.toFixed(1);
    return `${sign}${txt} L`;
  }

  // 10,000–99,999 -> K (Thousand)
  if (abs >= 10_000) {
    const v = Math.floor((abs / 1_000) * 10) / 10; // floor to 1 decimal
    const txt = Number.isInteger(v) ? v.toFixed(0) : v.toFixed(1);
    return `${sign}${txt} K`;
  }

  // Below 10,000 -> regular grouping
  return `${sign}${abs.toLocaleString()}`;
};


// Reusable metric card
type MetricCardProps = {
  title: string;
  value?: number;
  loading?: boolean;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  accentFrom: string; // tailwind from-*
  accentTo: string; // tailwind to-*
};

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  loading,
  Icon,
  accentFrom,
  accentTo,
}) => {
  return (
    <Card className="relative overflow-hidden rounded-2xl">
      {/* Soft accent blur */}
      <div
        className={`pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-gradient-to-br ${accentFrom} ${accentTo} opacity-20 blur-2xl`}
      />
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium text-muted-foreground">{title}</CardTitle>
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${accentFrom} ${accentTo} text-white`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-8 w-28" />
        ) : (
          <div className="text-3xl font-semibold tracking-tight">{fmt(value ?? 0)}</div>
        )}
      </CardContent>
    </Card>
  );
};

// Optional flexible items shape
type MetricItem = {
  title: string;
  value?: number;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  accentFrom: string;
  accentTo: string;
};

// Props (backward compatible):
// - Either provide the original 4 numbers,
// - Or pass `items` to render any number of cards.
type StatsOverviewProps = {
  // legacy props (still work)
  students?: number;
  exams?: number;
  faculties?: number;
  totalQuestions?: number;

  // new flexible API
  items?: MetricItem[];

  loading?: boolean;
  className?: string;
};

const StatsOverview: React.FC<StatsOverviewProps> = ({
  students,
  exams,
  faculties,
  totalQuestions,
  items,
  loading,
  className,
}) => {
  const cards: MetricItem[] = items ?? [
    {
      title: "Students",
      value: students,
      Icon: Users,
      accentFrom: "from-emerald-500",
      accentTo: "to-teal-500",
    },
    {
      title: "Exams",
      value: exams,
      Icon: FileText,
      accentFrom: "from-indigo-500",
      accentTo: "to-violet-500",
    },
    {
      title: "Faculty",
      value: faculties,
      Icon: UserCog,
      accentFrom: "from-amber-500",
      accentTo: "to-rose-500",
    },
    {
      title: "No. of Questions",
      value: totalQuestions,
      Icon: UserCheck,
      accentFrom: "from-cyan-500",
      accentTo: "to-sky-500",
    },
  ];

  return (
    <div className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-4 ${className ?? ""}`}>
      {cards.map((c, idx) => (
        <MetricCard
          key={`${c.title}-${idx}`}
          title={c.title}
          value={c.value}
          loading={loading}
          Icon={c.Icon}
          accentFrom={c.accentFrom}
          accentTo={c.accentTo}
        />
      ))}
    </div>
  );
};

export default StatsOverview;
