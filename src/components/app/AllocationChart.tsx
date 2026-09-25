"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const data = [
  { name: "Cash & equivalents", value: 45 },
  { name: "Fixed income", value: 25 },
  { name: "Equities", value: 20 },
  { name: "Other", value: 10 },
];
const COLORS = ["#16213A", "#3D6FA6", "#C9A46B", "#4B4F58"];

/** Illustrative allocation only — educational, not advice. */
export function AllocationChart() {
  return (
    <div className="mt-4 h-64 w-full">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={2}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(v) => `${String(v)}%`} />
        </PieChart>
      </ResponsiveContainer>
      <ul className="mt-2 flex flex-wrap gap-4 text-xs text-charcoal-500 dark:text-platinum-200">
        {data.map((d, i) => (
          <li key={d.name} className="flex items-center gap-2">
            <span
              aria-hidden
              className="inline-block h-2.5 w-2.5 rounded-sm"
              style={{ backgroundColor: COLORS[i] }}
            />
            {d.name} — {d.value}%
          </li>
        ))}
      </ul>
    </div>
  );
}
