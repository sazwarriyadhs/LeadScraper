export type Lead = {
  id: string;
  companyName: string;
  logoUrl: string;
  companyDescription: string;
  arr: number;
  employeeCount: number;
  hq: string;
  industry: string;
  keywords: string[];
  score?: number;
  reason?: string;
  lastScored?: string;
};
