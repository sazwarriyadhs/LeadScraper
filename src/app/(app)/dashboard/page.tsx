
'use client';

import { mockLeads } from '@/lib/mock-data';
import { StatsCards } from '@/components/dashboard/stats-cards';
import { IndustryChart } from '@/components/dashboard/industry-chart';
import { RecentLeads } from '@/components/dashboard/recent-leads';
import type { Lead } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScoreDistributionChart } from '@/components/dashboard/score-distribution-chart';
import { ArrByIndustryChart } from '@/components/dashboard/arr-by-industry-chart';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

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

  const downloadCSV = () => {
    const headers = [
      'Company Name',
      'Industry',
      'Employees',
      'ARR',
      'Score',
      'Reason',
    ];
    const csvRows = [headers.join(',')];

    mockLeads.forEach((lead) => {
      const row = [
        `"${lead.companyName.replace(/"/g, '""')}"`,
        `"${lead.industry}"`,
        lead.employeeCount,
        lead.arr,
        lead.score ?? 'N/A',
        `"${(lead.reason || '').replace(/"/g, '""')}"`,
      ];
      csvRows.push(row.join(','));
    });

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'leads.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text('Leads Report', 14, 16);
    (doc as any).autoTable({
      startY: 20,
      head: [['Company Name', 'Industry', 'Employees', 'ARR', 'Score']],
      body: mockLeads.map((lead) => [
        lead.companyName,
        lead.industry,
        lead.employeeCount,
        `$${(lead.arr / 1000000).toFixed(1)}M`,
        lead.score ?? 'N/A',
      ]),
    });
    doc.save('leads-report.pdf');
  };

  const downloadMarkdown = () => {
    const headers = ['Company Name', 'Industry', 'Employees', 'ARR', 'Score', 'Reason'];
    const tableHeader = `| ${headers.join(' | ')} |`;
    const tableDivider = `|${headers.map(() => '---').join('|')}|`;

    const tableRows = mockLeads.map(lead => {
      const row = [
        lead.companyName,
        lead.industry,
        lead.employeeCount,
        `$${(lead.arr / 1000000).toFixed(1)}M`,
        lead.score ?? 'N/A',
        lead.reason || '',
      ];
      return `| ${row.join(' | ')} |`;
    }).join('\n');

    const markdownString = `# Leads Report\n\n${tableHeader}\n${tableDivider}\n${tableRows}`;
    const blob = new Blob([markdownString], { type: 'text/markdown' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'leads-report.md');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };


  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Here's a summary of your leads.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={downloadPDF} variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
          <Button onClick={downloadCSV} variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
           <Button onClick={downloadMarkdown} variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export Markdown
          </Button>
        </div>
      </div>
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

