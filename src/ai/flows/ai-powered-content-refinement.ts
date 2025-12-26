'use server';
/**
 * @fileOverview An AI-powered content refinement flow for CVs.
 *
 * - refineCvContent - A function that refines CV content using AI suggestions.
 * - RefineCvContentInput - The input type for the refineCvContent function.
 * - RefineCvContentOutput - The return type for the refineCvContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RefineCvContentInputSchema = z.object({
  cvContent: z
    .string()
    .describe('The CV content to be refined.'),
});
export type RefineCvContentInput = z.infer<typeof RefineCvContentInputSchema>;

const RefineCvContentOutputSchema = z.object({
  refinedContent: z
    .string()
    .describe('The refined CV content with AI suggestions.'),
});
export type RefineCvContentOutput = z.infer<typeof RefineCvContentOutputSchema>;

export async function refineCvContent(input: RefineCvContentInput): Promise<RefineCvContentOutput> {
  return refineCvContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'refineCvContentPrompt',
  input: {schema: RefineCvContentInputSchema},
  output: {schema: RefineCvContentOutputSchema},
  prompt: `You are an expert career coach specializing in CV writing. Please refine the following CV content to optimize its wording, grammar, and overall impact for a professional presentation. Provide suggestions and improvements where necessary, without changing the meaning of the original content.

CV Content: {{{cvContent}}}`,
});

const refineCvContentFlow = ai.defineFlow(
  {
    name: 'refineCvContentFlow',
    inputSchema: RefineCvContentInputSchema,
    outputSchema: RefineCvContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
