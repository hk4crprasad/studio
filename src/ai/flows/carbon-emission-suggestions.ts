'use server';

/**
 * @fileOverview This file defines a Genkit flow for providing personalized carbon emission reduction suggestions.
 *
 * The flow takes user's lifestyle and habits as input and suggests ways to minimize their carbon footprint.
 * @param {CarbonEmissionSuggestionsInput} input - User's lifestyle and habits.
 * @returns {Promise<CarbonEmissionSuggestionsOutput>} - Personalized carbon emission reduction suggestions.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CarbonEmissionSuggestionsInputSchema = z.object({
  lifestyle: z
    .string()
    .describe(
      'Description of the user’s lifestyle, including transportation habits, dietary preferences, energy consumption at home, and waste management practices.'
    ),
  habits: z
    .string()
    .describe('Specific daily or weekly habits of the user that may impact carbon emissions.'),
});
export type CarbonEmissionSuggestionsInput = z.infer<
  typeof CarbonEmissionSuggestionsInputSchema
>;

const CarbonEmissionSuggestionsOutputSchema = z.object({
  suggestions: z
    .string()
    .describe(
      'A list of actionable suggestions for the user to reduce their carbon emissions, tailored to their lifestyle and habits.'
    ),
});
export type CarbonEmissionSuggestionsOutput = z.infer<
  typeof CarbonEmissionSuggestionsOutputSchema
>;

export async function getCarbonEmissionSuggestions(
  input: CarbonEmissionSuggestionsInput
): Promise<CarbonEmissionSuggestionsOutput> {
  return carbonEmissionSuggestionsFlow(input);
}

const carbonEmissionSuggestionsPrompt = ai.definePrompt({
  name: 'carbonEmissionSuggestionsPrompt',
  input: {schema: CarbonEmissionSuggestionsInputSchema},
  output: {schema: CarbonEmissionSuggestionsOutputSchema},
  prompt: `You are an AI assistant designed to provide personalized suggestions for reducing carbon emissions.

  Based on the user's lifestyle and habits, suggest actionable ways for them to minimize their environmental impact. Consider various aspects such as transportation, diet, energy consumption, and waste management.

  Lifestyle: {{{lifestyle}}}
  Habits: {{{habits}}}

  Provide the suggestions in a clear and concise manner, focusing on practical steps the user can take.
  `,
});

const carbonEmissionSuggestionsFlow = ai.defineFlow(
  {
    name: 'carbonEmissionSuggestionsFlow',
    inputSchema: CarbonEmissionSuggestionsInputSchema,
    outputSchema: CarbonEmissionSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await carbonEmissionSuggestionsPrompt(input);
    return output!;
  }
);
