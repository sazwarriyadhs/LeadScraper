import { mockLeads } from '@/lib/mock-data';
import { StatsCards } from '@/components/dashboard/stats-cards';
import { IndustryChart } from '@/components/dashboard/industry-chart';
import { RecentLeads } from '@/components/dashboard/recent-leads';
import type { Lead } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
      </div>
    </div>
  );
}
