'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating a word puzzle.
 *
 * The flow takes a theme and generates a word and a hint for a word scramble game.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const WordPuzzleInputSchema = z.object({
  theme: z
    .string()
    .describe('The theme for the word puzzle (e.g., sustainability, recycling, civic sense, waste management, carbon emission).'),
  count: z.number().int().positive().describe('The number of puzzles to generate.'),
});
export type WordPuzzleInput = z.infer<typeof WordPuzzleInputSchema>;

const WordPuzzleSchema = z.object({
  word: z
    .string()
    .describe('A single, relevant word for the puzzle, in uppercase.'),
  hint: z.string().describe('A short hint or clue for the word.'),
  explanation: z.string().describe('A short, one-sentence explanation of what the word means in the context of the theme.'),
});

const WordPuzzleOutputSchema = z.object({
  puzzles: z.array(WordPuzzleSchema),
});
export type WordPuzzleOutput = z.infer<typeof WordPuzzleOutputSchema>;

export async function generateWordPuzzles(
  input: WordPuzzleInput
): Promise<WordPuzzleOutput> {
  return generateWordPuzzleFlow(input);
}

const generateWordPuzzlePrompt = ai.definePrompt({
  name: 'generateWordPuzzlePrompt',
  input: {schema: WordPuzzleInputSchema},
  output: {schema: WordPuzzleOutputSchema},
  config: {
    temperature: 0.8,
  },
  prompt: `You are a creative game master. Generate {{{count}}} word puzzles based on the theme of {{{theme}}}. The themes can include sustainability, civic sense, waste management, and carbon emission reduction.

  For each puzzle, provide:
  1. A single, relevant word between 6 and 10 letters long, in uppercase.
  2. A short hint or clue for the word.
  3. A short, one-sentence "Did you know?" style explanation of what the word means in the context of the theme. For example: "Carpooling is when multiple people travel together in one car to reduce traffic and emissions."
  `,
});

const generateWordPuzzleFlow = ai.defineFlow(
  {
    name: 'generateWordPuzzleFlow',
    inputSchema: WordPuzzleInputSchema,
    outputSchema: WordPuzzleOutputSchema,
  },
  async input => {
    const {output} = await generateWordPuzzlePrompt(input);
    return output!;
  }
);
