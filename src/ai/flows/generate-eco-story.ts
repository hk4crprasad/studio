'use server';

/**
 * @fileOverview Defines Genkit flows for an interactive eco-story game.
 *
 * - generateEcoStory: Creates a fill-in-the-blanks story about a given theme.
 * - evaluateEcoStory: Evaluates the user's completed story and provides feedback.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Schema for generating the story
const EcoStoryInputSchema = z.object({
  theme: z.string().describe('The environmental theme for the story (e.g., forestation, water conservation).'),
});
export type EcoStoryInput = z.infer<typeof EcoStoryInputSchema>;

const EcoStoryOutputSchema = z.object({
  title: z.string().describe('A catchy title for the story.'),
  storyTemplate: z.string().describe('The story text with numbered placeholders for blanks, like "[1]", "[2]", etc.'),
  correctWords: z.array(z.string()).describe('An array of the correct words that fit into the story blanks, in order.'),
  incorrectWords: z.array(z.string()).describe('An array of incorrect but plausible words to act as distractors.'),
});
export type EcoStoryOutput = z.infer<typeof EcoStoryOutputSchema>;

// Schema for evaluating the completed story
const EvaluateStoryInputSchema = z.object({
  story: z.string().describe("The user's completed story."),
});
export type EvaluateStoryInput = z.infer<typeof EvaluateStoryInputSchema>;

const EvaluateStoryOutputSchema = z.object({
  evaluation: z.string().describe("Feedback on the user's choices and a conclusion to the story, explaining the environmental impact."),
});
export type EvaluateStoryOutput = z.infer<typeof EvaluateStoryOutputSchema>;


// Exported functions to be called from the client
export async function generateEcoStory(input: EcoStoryInput): Promise<EcoStoryOutput> {
  return generateEcoStoryFlow(input);
}

export async function evaluateEcoStory(input: EvaluateStoryInput): Promise<EvaluateStoryOutput> {
  return evaluateEcoStoryFlow(input);
}


// Flow for generating the story
const generateEcoStoryPrompt = ai.definePrompt({
  name: 'generateEcoStoryPrompt',
  input: { schema: EcoStoryInputSchema },
  output: { schema: EcoStoryOutputSchema },
  prompt: `You are a creative storyteller and environmental educator. Create a short, engaging, fill-in-the-blanks story for a game based on the theme of {{{theme}}}.

The story should be a few paragraphs long and have between 4 and 6 blanks. Represent the blanks with numbered placeholders (e.g., "[1]", "[2]").

- Provide a catchy title for the story.
- Provide the story template.
- Provide the array of correct words that perfectly fit the blanks in order. The words should be relevant to the theme.
- Provide an array of incorrect words. These should be plausible distractors that are contextually related but wrong. The number of incorrect words should be equal to the number of correct words.
`,
});

const generateEcoStoryFlow = ai.defineFlow(
  {
    name: 'generateEcoStoryFlow',
    inputSchema: EcoStoryInputSchema,
    outputSchema: EcoStoryOutputSchema,
  },
  async (input) => {
    const { output } = await generateEcoStoryPrompt(input);
    return output!;
  }
);


// Flow for evaluating the story
const evaluateEcoStoryPrompt = ai.definePrompt({
  name: 'evaluateEcoStoryPrompt',
  input: { schema: EvaluateStoryInputSchema },
  output: { schema: EvaluateStoryOutputSchema },
  prompt: `You are an environmental expert. The user has completed a fill-in-the-blanks story.

User's completed story:
"{{{story}}}"

Based on the choices the user filled in, provide a concluding paragraph.
- Evaluate the choices made (even if they are incorrect distractors).
- Explain the environmental impact of the correct actions.
- If the user made wrong choices, gently correct them and explain the better alternative.
- Make the tone encouraging and educational.
`,
});

const evaluateEcoStoryFlow = ai.defineFlow(
  {
    name: 'evaluateEcoStoryFlow',
    inputSchema: EvaluateStoryInputSchema,
    outputSchema: EvaluateStoryOutputSchema,
  },
  async (input) => {
    const { output } = await evaluateEcoStoryPrompt(input);
    return output!;
  }
);
