'use client';
import {
  Building2,
  DollarSign,
  FileText,
  Globe,
  Hash,
  MapPin,
  Users,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import type { Lead } from '@/lib/types';
import { Button } from '../ui/button';

interface LeadInfoDialogProps {
  lead: Lead;
  children: React.ReactNode;
}

export function LeadInfoDialog({ lead, children }: LeadInfoDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-4">
            <DialogTitle>{lead.companyName}</DialogTitle>
            <Button variant="ghost" size="icon" asChild>
              <a href={lead.website} target="_blank" rel="noopener noreferrer">
                <Globe className="h-4 w-4" />
              </a>
            </Button>
          </div>
          <DialogDescription>
            Detailed information about the lead.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-3 rounded-lg border p-4">
            <p className="text-sm text-muted-foreground flex items-start gap-2">
              <FileText className="h-4 w-4 mt-0.5 shrink-0" />
              <span>{lead.companyDescription}</span>
            </p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <span className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                {lead.industry}
              </span>
              <span className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                {lead.employeeCount} employees
              </span>
              <span className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />$
                {(lead.arr / 1_000_000).toFixed(1)}M ARR
              </span>
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                {lead.hq}
              </span>
            </div>
            <div className="flex items-start gap-2 pt-2">
              <Hash className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
              <div className="flex flex-wrap gap-1">
                {lead.keywords.map((keyword) => (
                  <Badge key={keyword} variant="secondary">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
