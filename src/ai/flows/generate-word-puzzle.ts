'use server';

/**
 * @fileOverview This file defines a flow for generating a word puzzle.
 *
 * The flow takes a theme and generates a word and a hint for a word scramble game.
 */

import { generateStructuredCompletion } from '@/lib/azure-openai';

export interface WordPuzzleInput {
  theme: string;
  count: number;
  language: string;
}

export interface WordPuzzle {
  word: string;
  hint: string;
  explanation: string;
}

export interface WordPuzzleOutput {
  puzzles: WordPuzzle[];
}

export async function generateWordPuzzles(
  input: WordPuzzleInput
): Promise<WordPuzzleOutput> {
  const { theme, count, language } = input;

  const prompt = `You are a creative game master. Generate ${count} unique word puzzles in ${language} based on the theme of ${theme}. The themes can include sustainability, civic sense, waste management, and carbon emission reduction.

For each puzzle, provide:
1. A single, relevant word between 6 and 10 letters long, in uppercase.
2. A short hint or clue for the word.
3. A short, one-sentence "Did you know?" style explanation of what the word means in the context of the theme. For example: "Carpooling is when multiple people travel together in one car to reduce traffic and emissions."`;

  const schema = `{
  "puzzles": [
    {
      "word": "string - A single, relevant word for the puzzle, in uppercase",
      "hint": "string - A short hint or clue for the word",
      "explanation": "string - A short, one-sentence explanation of what the word means in the context of the theme"
    }
  ]
}`;

  const systemMessage = 'You are a creative educational game designer who specializes in environmental and sustainability topics.';

  return await generateStructuredCompletion<WordPuzzleOutput>(
    prompt,
    schema,
    { systemMessage, temperature: 1 }
  );
}
