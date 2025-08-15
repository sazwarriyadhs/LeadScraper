'use client';

import { useState, useMemo, useCallback } from 'react';
import Image from 'next/image';
import { mockLeads } from '@/lib/mock-data';
import type { Lead } from '@/lib/types';
import { ScoreLeadDialog } from '@/components/leads/score-lead-dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { LeadInfoDialog } from '@/components/leads/lead-info-dialog';

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [searchTerm, setSearchTerm] = useState('');
  const [industryFilter, setIndustryFilter] = useState('all');
  const [employeeFilter, setEmployeeFilter] = useState([0, 1000]);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Lead;
    direction: 'asc' | 'desc';
  } | null>(null);

  const industries = useMemo(
    () => ['all', ...Array.from(new Set(mockLeads.map((l) => l.industry)))],
    []
  );
  
  const filteredLeads = useMemo(() => {
    let filtered = leads
      .filter((lead) =>
        lead.companyName.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter(
        (lead) => industryFilter === 'all' || lead.industry === industryFilter
      )
      .filter(
        (lead) =>
          lead.employeeCount >= employeeFilter[0] &&
          lead.employeeCount <= (employeeFilter[1] === 1000 ? Infinity : employeeFilter[1])
      );

    if (sortConfig !== null) {
      filtered.sort((a, b) => {
        if (a[sortConfig.key]! < b[sortConfig.key]!) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key]! > b[sortConfig.key]!) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [leads, searchTerm, industryFilter, employeeFilter, sortConfig]);

  const handleScoreUpdate = useCallback((leadId: string, score: number, reason: string) => {
    setLeads((prevLeads) =>
      prevLeads.map((lead) =>
        lead.id === leadId
          ? { ...lead, score, reason, lastScored: new Date().toISOString() }
          : lead
      )
    );
  }, []);

  const requestSort = (key: keyof Lead) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };
  
  const getBadgeVariant = (score: number) => {
    if (score > 85) return 'default';
    if (score > 70) return 'secondary';
    return 'destructive';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Filter Leads</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-3">
          <Input
            placeholder="Search by company name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select value={industryFilter} onValueChange={setIndustryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by industry" />
            </SelectTrigger>
            <SelectContent>
              {industries.map((industry) => (
                <SelectItem key={industry} value={industry}>
                  {industry.charAt(0).toUpperCase() + industry.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Employee Count: {employeeFilter[0]} - {employeeFilter[1] === 1000 ? '1000+' : employeeFilter[1]}
            </label>
            <Slider
              min={0}
              max={1000}
              step={50}
              value={employeeFilter}
              onValueChange={setEmployeeFilter}
            />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead className="cursor-pointer" onClick={() => requestSort('industry')}>Industry</TableHead>
                <TableHead className="cursor-pointer" onClick={() => requestSort('employeeCount')}>Employees</TableHead>
                <TableHead className="cursor-pointer" onClick={() => requestSort('arr')}>ARR</TableHead>
                <TableHead className="cursor-pointer text-right" onClick={() => requestSort('score')}>Score</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <Image
                        src={lead.logoUrl}
                        alt={`${lead.companyName} logo`}
                        width={40}
                        height={40}
                        className="rounded-md"
                        data-ai-hint="logo"
                      />
                      <div>
                        <LeadInfoDialog lead={lead}>
                          <p className="font-semibold hover:underline cursor-pointer">{lead.companyName}</p>
                        </LeadInfoDialog>
                        <p className="text-xs text-muted-foreground">{lead.hq}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell><Badge variant="outline">{lead.industry}</Badge></TableCell>
                  <TableCell>{lead.employeeCount}</TableCell>
                  <TableCell>${(lead.arr / 1_000_000).toFixed(1)}M</TableCell>
                  <TableCell className="text-right">
                    {lead.score ? (
                      <div className="flex flex-col items-end">
                        <Badge variant={getBadgeVariant(lead.score)} className="text-base">
                          {lead.score}
                        </Badge>
                         <p className="text-xs text-muted-foreground">
                          {lead.lastScored && format(new Date(lead.lastScored), "PP")}
                        </p>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Not Scored</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <ScoreLeadDialog lead={lead} onScoreUpdate={handleScoreUpdate} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
