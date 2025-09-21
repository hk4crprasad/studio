'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating multiple eco-situation scenarios for a game.
 *
 * The flow generates a list of scenarios, each with a title, description, and a set of options for a given theme.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SituationOptionSchema = z.object({
  text: z.string().describe('The text for the choice.'),
  isCorrect: z.boolean().describe('Whether this option is the most sustainable choice.'),
  feedback: z.string().describe('Feedback to show the user after they select this option.'),
});

const EcoSituationSchema = z.object({
  title: z.string().describe('The title of the scenario.'),
  description: z.string().describe('A description of the situation.'),
  options: z.array(SituationOptionSchema).length(3).describe('An array of three possible choices for the user.'),
});
export type EcoSituation = z.infer<typeof EcoSituationSchema>;

const EcoSituationsInputSchema = z.object({
  theme: z
    .string()
    .describe('The theme for the eco-situations (e.g., waste reduction, water conservation).'),
  count: z
    .number()
    .int()
    .positive()
    .describe('The number of situations to generate.'),
    language: z.string().describe('The language for the scenarios (e.g., "English", "Hindi", "Bengali", "Odia").'),
});
export type EcoSituationsInput = z.infer<typeof EcoSituationsInputSchema>;

const EcoSituationsOutputSchema = z.object({
  scenarios: z.array(EcoSituationSchema),
});
export type EcoSituationsOutput = z.infer<typeof EcoSituationsOutputSchema>;

export async function generateEcoSituations(
  input: EcoSituationsInput
): Promise<EcoSituationsOutput> {
  return generateEcoSituationsFlow(input);
}

const generateEcoSituationsPrompt = ai.definePrompt({
  name: 'generateEcoSituationsPrompt',
  input: {schema: EcoSituationsInputSchema},
  output: {schema: EcoSituationsOutputSchema},
  prompt: `You are a game designer creating scenarios for an educational game about sustainability and environmental civic sense.

Generate a list of {{{count}}} scenarios in {{{language}}} based on the theme of {{{theme}}}.

Each scenario should present a common, everyday situation where a person can make a choice that impacts the environment.

For each scenario, provide a concise title, a description of the situation, and exactly three options.
- One option should be the most sustainable/correct choice.
- The other two options should be common but less sustainable alternatives.
- For each option, provide brief, educational feedback explaining the consequence or benefit of that choice. The feedback for a correct answer should include a reward, for example 'You earned 10 eco-points!'.
`,
});

const generateEcoSituationsFlow = ai.defineFlow(
  {
    name: 'generateEcoSituationsFlow',
    inputSchema: EcoSituationsInputSchema,
    outputSchema: EcoSituationsOutputSchema,
  },
  async input => {
    const {output} = await generateEcoSituationsPrompt(input);
    return output!;
  }
);
