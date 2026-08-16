import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const inr = (n: number) =>
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(Math.round(n));

const compact = (n: number) => {
  if (n >= 1e7) return `₹${(n / 1e7).toFixed(1)}Cr`;
  if (n >= 1e5) return `₹${(n / 1e5).toFixed(1)}L`;
  if (n >= 1e3) return `₹${Math.round(n / 1e3)}K`;
  return `₹${Math.round(n)}`;
};

export type SipSeriesPoint = { year: number; invested: number; corpus: number };

export default function SipChart({
  series,
  years,
  xTicks,
}: {
  series: SipSeriesPoint[];
  years: number;
  xTicks: number[];
}) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={series} margin={{ top: 8, right: 8, left: 0, bottom: 28 }}>
        <defs>
          <linearGradient id="corpusFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-gold)" stopOpacity={0.55} />
            <stop offset="100%" stopColor="var(--color-gold)" stopOpacity={0.03} />
          </linearGradient>
          <linearGradient id="investedFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-cream)" stopOpacity={0.25} />
            <stop offset="100%" stopColor="var(--color-cream)" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-cream/10" vertical={false} />
        <XAxis
          dataKey="year"
          type="number"
          domain={[0, years]}
          ticks={xTicks}
          interval={0}
          allowDecimals={false}
          tickFormatter={(v) => `${v}`}
          tick={{ fontSize: 11, fill: "currentColor" }}
          className="text-cream/50"
          axisLine={false}
          tickLine={false}
          label={{ value: "Years", position: "insideBottom", offset: -6, fill: "currentColor", fontSize: 12 }}
        />
        <YAxis
          tickFormatter={compact}
          tick={{ fontSize: 11, fill: "currentColor" }}
          className="text-cream/50"
          axisLine={false}
          tickLine={false}
          width={56}
        />
        <Tooltip
          contentStyle={{
            background: "var(--color-navy-deep)",
            border: "1px solid color-mix(in oklab, var(--color-gold) 40%, transparent)",
            borderRadius: 6,
            fontSize: 12,
          }}
          labelStyle={{
            color: "var(--color-cream)",
            fontSize: 12,
            marginBottom: 2,
          }}
          labelFormatter={(v) => `Year ${v}`}
          formatter={(value: number, name) => [`₹${inr(value)}`, name === "corpus" ? "Corpus" : "Invested"]}
        />
        <Area
          type="monotone"
          dataKey="invested"
          stroke="var(--color-cream)"
          strokeOpacity={0.5}
          fill="url(#investedFill)"
          strokeWidth={1.5}
        />
        <Area type="monotone" dataKey="corpus" stroke="var(--color-gold)" fill="url(#corpusFill)" strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
