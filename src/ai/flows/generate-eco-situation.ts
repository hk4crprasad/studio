'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating an eco-situation scenario for a game.
 *
 * The flow generates a title, description, and a set of options for a given theme.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SituationOptionSchema = z.object({
  text: z.string().describe('The text for the choice.'),
  isCorrect: z.boolean().describe('Whether this option is the most sustainable choice.'),
  feedback: z.string().describe('Feedback to show the user after they select this option.'),
});

const EcoSituationInputSchema = z.object({
  theme: z
    .string()
    .describe('The theme for the eco-situation (e.g., waste reduction, water conservation).'),
});
export type EcoSituationInput = z.infer<typeof EcoSituationInputSchema>;

const EcoSituationOutputSchema = z.object({
  title: z.string().describe('The title of the scenario.'),
  description: z.string().describe('A description of the situation.'),
  options: z.array(SituationOptionSchema).length(3).describe('An array of three possible choices for the user.'),
});
export type EcoSituationOutput = z.infer<typeof EcoSituationOutputSchema>;

export async function generateEcoSituation(
  input: EcoSituationInput
): Promise<EcoSituationOutput> {
  return generateEcoSituationFlow(input);
}

const generateEcoSituationPrompt = ai.definePrompt({
  name: 'generateEcoSituationPrompt',
  input: {schema: EcoSituationInputSchema},
  output: {schema: EcoSituationOutputSchema},
  prompt: `You are a game designer creating scenarios for an educational game about sustainability and environmental civic sense.

Generate a scenario based on the theme of {{{theme}}}.

The scenario should present a common, everyday situation where a person can make a choice that impacts the environment.

Provide a concise title, a description of the situation, and exactly three options.
- One option should be the most sustainable/correct choice.
- The other two options should be common but less sustainable alternatives.
- For each option, provide brief, educational feedback explaining the consequence or benefit of that choice. The feedback for a correct answer should include a reward, for example 'You earned 10 eco-points!'.
`,
});

const generateEcoSituationFlow = ai.defineFlow(
  {
    name: 'generateEcoSituationFlow',
    inputSchema: EcoSituationInputSchema,
    outputSchema: EcoSituationOutputSchema,
  },
  async input => {
    const {output} = await generateEcoSituationPrompt(input);
    return output!;
  }
);
