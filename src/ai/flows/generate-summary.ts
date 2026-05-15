'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateSummaryInputSchema = z.object({
  fullName: z.string(),
  jobTitle: z.string(),
  experience: z.array(z.object({
    jobTitle: z.string(),
    company: z.string(),
    description: z.string(),
  })),
});

const GenerateSummaryOutputSchema = z.object({
  summary: z.string().describe('A professional summary for a CV.'),
});

export async function generateSummary(input: z.infer<typeof GenerateSummaryInputSchema>) {
  return generateSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSummaryPrompt',
  input: { schema: GenerateSummaryInputSchema },
  output: { schema: GenerateSummaryOutputSchema },
  prompt: `Eres un experto reclutador. Crea un resumen profesional impactante (máximo 4 líneas) en ESPAÑOL para el siguiente perfil:
  
  Nombre: {{{fullName}}}
  Título: {{{jobTitle}}}
  Experiencia clave:
  {{#each experience}}
  - {{{jobTitle}}} en {{{company}}}: {{{description}}}
  {{/each}}
  
  El resumen debe ser directo, profesional y resaltar el valor del candidato. No uses frases clichés como "busco desafíos". Enfócate en logros y capacidades.`,
});

const generateSummaryFlow = ai.defineFlow(
  {
    name: 'generateSummaryFlow',
    inputSchema: GenerateSummaryInputSchema,
    outputSchema: GenerateSummaryOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
