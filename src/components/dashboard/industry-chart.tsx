'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';

interface IndustryChartProps {
  data: { industry: string; count: number }[];
}

const chartConfig = {
  count: {
    label: 'Leads',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;

export function IndustryChart({ data }: IndustryChartProps) {
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
            tickFormatter={(value) => `${value}`}
          />
          <Tooltip content={<ChartTooltipContent />} cursor={{ fill: 'hsl(var(--accent) / 0.2)' }}/>
          <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
