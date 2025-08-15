'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';

interface ArrByIndustryChartProps {
  data: { industry: string; arr: number }[];
}

const chartConfig = {
  arr: {
    label: 'ARR (M)',
    color: 'hsl(var(--accent))',
  },
} satisfies ChartConfig;

export function ArrByIndustryChart({ data }: ArrByIndustryChartProps) {
  return (
    <ChartContainer config={chartConfig} className="h-[350px] w-full">
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data} margin={{ left: -20, top: 10, right: 10, bottom: 0 }}>
          <XAxis
            dataKey="industry"
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${value}M`}
          />
          <Tooltip content={<ChartTooltipContent formatter={(value, name) => `$${(value as number).toFixed(1)}M`} />} cursor={{ fill: 'hsl(var(--primary) / 0.2)' }}/>
          <Bar dataKey="arr" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
