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
    .describe('The theme for the word puzzle (e.g., sustainability, recycling).'),
});
export type WordPuzzleInput = z.infer<typeof WordPuzzleInputSchema>;

const WordPuzzleOutputSchema = z.object({
  word: z
    .string()
    .describe('A single, relevant word for the puzzle, in uppercase.'),
  hint: z.string().describe('A short hint or clue for the word.'),
});
export type WordPuzzleOutput = z.infer<typeof WordPuzzleOutputSchema>;

export async function generateWordPuzzle(
  input: WordPuzzleInput
): Promise<WordPuzzleOutput> {
  return generateWordPuzzleFlow(input);
}

const generateWordPuzzlePrompt = ai.definePrompt({
  name: 'generateWordPuzzlePrompt',
  input: {schema: WordPuzzleInputSchema},
  output: {schema: WordPuzzleOutputSchema},
  prompt: `You are a creative game master. Generate a single word and a corresponding hint for a word scramble puzzle based on the theme of {{{theme}}}. The word should be between 6 and 10 letters long and must be in uppercase.`,
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
