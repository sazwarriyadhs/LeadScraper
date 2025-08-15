// A lead scoring AI agent.
//
// - scoreLead - A function that handles the lead scoring process.
// - ScoreLeadInput - The input type for the scoreLead function.
// - ScoreLeadOutput - The return type for the scoreLead function.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ScoreLeadInputSchema = z.object({
  companyName: z.string().describe('The name of the company.'),
  companyDescription: z.string().describe('A description of the company.'),
  website: z.string().describe('The website of the company.'),
  industry: z.string().describe('The industry of the company.'),
  location: z.string().describe('The location of the company.'),
  employeeCount: z.number().describe('The number of employees at the company.'),
});

export type ScoreLeadInput = z.infer<typeof ScoreLeadInputSchema>;

const ScoreLeadOutputSchema = z.object({
  leadScore: z.number().describe('A score from 0 to 100 indicating the quality of the lead.'),
  reason: z.string().describe('The reason for the lead score.'),
});

export type ScoreLeadOutput = z.infer<typeof ScoreLeadOutputSchema>;

export async function scoreLead(input: ScoreLeadInput): Promise<ScoreLeadOutput> {
  return scoreLeadFlow(input);
}

const scoreLeadPrompt = ai.definePrompt({
  name: 'scoreLeadPrompt',
  input: {schema: ScoreLeadInputSchema},
  output: {schema: ScoreLeadOutputSchema},
  prompt: `You are an AI assistant that helps score leads for Caprae Capital.

  Based on the following company information, generate a lead score from 0 to 100 and a reason for the score.

  Company Name: {{{companyName}}}
  Company Website: {{{website}}}
  Company Description: {{{companyDescription}}}
  Industry: {{{industry}}}
  Location: {{{location}}}
  Employee Count: {{{employeeCount}}}

  Consider the company's website, size, industry, and description when generating the lead score.`,
});

const scoreLeadFlow = ai.defineFlow(
  {
    name: 'scoreLeadFlow',
    inputSchema: ScoreLeadInputSchema,
    outputSchema: ScoreLeadOutputSchema,
  },
  async input => {
    const {output} = await scoreLeadPrompt(input);
    return output!;
  }
);
