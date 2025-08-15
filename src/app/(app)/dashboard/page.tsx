import { mockLeads } from '@/lib/mock-data';
import { StatsCards } from '@/components/dashboard/stats-cards';
import { IndustryChart } from '@/components/dashboard/industry-chart';
import { RecentLeads } from '@/components/dashboard/recent-leads';
import type { Lead } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScoreDistributionChart } from '@/components/dashboard/score-distribution-chart';
import { ArrByIndustryChart } from '@/components/dashboard/arr-by-industry-chart';

export default function DashboardPage() {
  const scoredLeads = mockLeads.filter((lead) => lead.score !== undefined);
  const totalLeads = mockLeads.length;
  const averageScore =
    scoredLeads.length > 0
      ? Math.round(
          scoredLeads.reduce((acc, lead) => acc + (lead.score ?? 0), 0) /
            scoredLeads.length
        )
      : 0;
  
  const leadsByIndustry = mockLeads.reduce((acc, lead) => {
    acc[lead.industry] = (acc[lead.industry] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const industryChartData = Object.entries(leadsByIndustry).map(([industry, count]) => ({
    industry,
    count,
  }));
  
  const scoreDistributionData = scoredLeads.reduce((acc, lead) => {
    const score = lead.score ?? 0;
    let range: string;
    if (score <= 70) range = '0-70';
    else if (score <= 85) range = '71-85';
    else range = '86-100';
    acc[range] = (acc[range] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const scoreChartData = Object.entries(scoreDistributionData).map(([range, count]) => ({
    range,
    count,
  }));

  const arrByIndustry = mockLeads.reduce((acc, lead) => {
    acc[lead.industry] = (acc[lead.industry] || 0) + lead.arr;
    return acc;
  }, {} as Record<string, number>);

  const arrByIndustryData = Object.entries(arrByIndustry).map(([industry, arr]) => ({
    industry,
    arr: arr / 1000000, // Convert to millions
  }));


  return (
    <div className="flex-1 space-y-4">
      <StatsCards
        totalLeads={totalLeads}
        scoredLeadsCount={scoredLeads.length}
        averageScore={averageScore}
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Leads by Industry</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <IndustryChart data={industryChartData} />
          </CardContent>
        </Card>
        <Card className="col-span-4 lg:col-span-3">
          <CardHeader>
            <CardTitle>Recently Scored Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentLeads leads={scoredLeads.slice(0, 5)} />
          </CardContent>
        </Card>
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Score Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ScoreDistributionChart data={scoreChartData} />
          </CardContent>
        </Card>
        <Card className="col-span-4 lg:col-span-3">
          <CardHeader>
            <CardTitle>ARR by Industry (in Millions)</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <ArrByIndustryChart data={arrByIndustryData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
