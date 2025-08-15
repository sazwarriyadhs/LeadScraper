import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import type { Lead } from '@/lib/types';

export function RecentLeads({ leads }: { leads: Lead[] }) {
  const getBadgeVariant = (score: number) => {
    if (score > 85) return 'default';
    if (score > 70) return 'secondary';
    return 'destructive';
  };

  return (
    <div className="space-y-8">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Company</TableHead>
            <TableHead className="text-right">Score</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.map((lead) => (
            <TableRow key={lead.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="hidden h-9 w-9 sm:flex">
                    <AvatarImage src={lead.logoUrl} alt={lead.companyName} data-ai-hint="logo" />
                    <AvatarFallback>{lead.companyName.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="grid gap-0.5">
                    <div className="font-medium">{lead.companyName}</div>
                    <div className="hidden text-sm text-muted-foreground md:inline">
                      {lead.industry}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <Badge variant={getBadgeVariant(lead.score ?? 0)} className="text-lg">
                  {lead.score}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
