"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface ChartPoint {
  date: string;
  articles: number;
  clicks: number;
  views: number;
}

interface Props {
  data: ChartPoint[];
  metric: "articles" | "clicks" | "views";
  yDomain?: [number, number];
}

export default function DashboardChart({ data, metric, yDomain }: Props) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 0, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-line, #e5e7eb)" vertical={false} />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 11, fill: "var(--color-ink-soft, #6b7280)" }}
          tickLine={false}
          axisLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          allowDecimals={false}
          domain={yDomain}
          tick={{ fontSize: 11, fill: "var(--color-ink-soft, #6b7280)" }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          contentStyle={{
            fontSize: 12,
            borderRadius: 8,
            border: "1px solid var(--color-line, #e5e7eb)",
            background: "var(--color-canvas, #fff)",
          }}
          cursor={{ fill: "var(--color-surface, #f9fafb)" }}
        />
        <Bar dataKey={metric} fill="var(--color-accent, #2563eb)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
