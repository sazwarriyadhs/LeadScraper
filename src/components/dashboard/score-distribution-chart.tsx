'use client';

import { Pie, PieChart, ResponsiveContainer, Tooltip, Cell } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';

interface ScoreDistributionChartProps {
  data: { range: string; count: number }[];
}

const chartConfig = {
  count: {
    label: 'Leads',
  },
  '0-70': {
    label: '0-70',
    color: 'hsl(var(--destructive))',
  },
  '71-85': {
    label: '71-85',
    color: 'hsl(var(--chart-4))',
  },
  '86-100': {
    label: '86-100',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;

const COLORS = [chartConfig['0-70'].color, chartConfig['71-85'].color, chartConfig['86-100'].color];

export function ScoreDistributionChart({ data }: ScoreDistributionChartProps) {
  return (
    <ChartContainer config={chartConfig} className="h-[350px] w-full">
      <ResponsiveContainer width="100%" height={350}>
        <PieChart>
          <Tooltip content={<ChartTooltipContent nameKey="range" />} />
          <Pie
            data={data}
            dataKey="count"
            nameKey="range"
            cx="50%"
            cy="50%"
            outerRadius={120}
            label={({ range, count }) => `${range}: ${count}`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
