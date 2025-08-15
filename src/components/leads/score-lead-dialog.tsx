'use client';
import type { FormEvent } from 'react';
import { useState } from 'react';

import { scoreLead, type ScoreLeadInput } from '@/ai/flows/score-lead';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import type { Lead } from '@/lib/types';
import { Bot, Building2, Calendar, FileText, Users } from 'lucide-react';

interface ScoreLeadDialogProps {
  lead: Lead;
  onScoreUpdate: (leadId: string, score: number, reason: string) => void;
}

export function ScoreLeadDialog({ lead, onScoreUpdate }: ScoreLeadDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    leadScore: number;
    reason: string;
  } | null>(null);
  const { toast } = useToast();

  const handleScoreLead = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResult(null);

    const input: ScoreLeadInput = {
      companyName: lead.companyName,
      companyDescription: lead.companyDescription,
      industry: lead.industry,
      location: lead.hq,
      employeeCount: lead.employeeCount,
    };

    try {
      const scoreResult = await scoreLead(input);
      setResult(scoreResult);
      onScoreUpdate(lead.id, scoreResult.leadScore, scoreResult.reason);
      toast({
        title: 'Scoring Successful',
        description: `${lead.companyName} has been scored.`,
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Scoring Failed',
        description:
          'An error occurred while scoring the lead. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setResult(null);
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Bot className="mr-2 h-4 w-4" />
          {lead.score ? 'Rescore' : 'Score Lead'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>AI Lead Qualification</DialogTitle>
          <DialogDescription>
            Generate a qualification score for {lead.companyName}.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2 rounded-lg border p-4">
            <h4 className="font-semibold text-primary">{lead.companyName}</h4>
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <FileText className="h-4 w-4" />
              {lead.companyDescription}
            </p>
            <div className="flex justify-between text-sm">
              <span className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                {lead.industry}
              </span>
              <span className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                {lead.employeeCount} employees
              </span>
            </div>
          </div>

          {isLoading && (
            <div className="space-y-2">
              <p className="text-sm text-center text-muted-foreground">
                AI is analyzing the lead...
              </p>
              <Progress value={50} className="w-full animate-pulse" />
            </div>
          )}

          {result && (
            <div className="space-y-3 rounded-lg border bg-accent/20 p-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">Qualification Score</h4>
                <span className="text-2xl font-bold text-primary">
                  {result.leadScore}
                </span>
              </div>
              <div>
                <h5 className="font-medium text-sm">Reasoning:</h5>
                <p className="text-sm text-muted-foreground">
                  {result.reason}
                </p>
              </div>
            </div>
          )}

          {lead.score && !result && (
            <div className="space-y-3 rounded-lg border bg-accent/20 p-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">Current Score</h4>
                <span className="text-2xl font-bold text-primary">
                  {lead.score}
                </span>
              </div>
              <div>
                <h5 className="font-medium text-sm">Reasoning:</h5>
                <p className="text-sm text-muted-foreground">{lead.reason}</p>
              </div>
              {lead.lastScored && (
                <p className="text-xs text-muted-foreground flex items-center gap-2">
                  <Calendar className="h-3 w-3" />
                  Last scored on {new Date(lead.lastScored).toLocaleDateString()}
                </p>
              )}
            </div>
          )}
        </div>
        <DialogFooter>
          <form onSubmit={handleScoreLead} className="w-full">
            <Button type="submit" disabled={isLoading} className="w-full">
              <Bot className="mr-2 h-4 w-4" />
              {isLoading ? 'Scoring...' : 'Generate Score'}
            </Button>
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
