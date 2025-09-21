'use server';

/**
 * @fileOverview Defines flows for an interactive eco-story game.
 *
 * - generateEcoStory: Creates a fill-in-the-blanks story about a given theme.
 * - evaluateEcoStory: Evaluates the user's completed story and provides feedback.
 */

import { generateStructuredCompletion, generateCompletion } from '@/lib/azure-openai';

// Schema for generating the story
export interface EcoStoryInput {
  theme: string;
  language: string;
}

export interface EcoStoryOutput {
  title: string;
  storyTemplate: string;
  correctWords: string[];
  incorrectWords: string[];
}

// Schema for evaluating the completed story
export interface EvaluateStoryInput {
  story: string;
  language: string;
}

export interface EvaluateStoryOutput {
  evaluation: string;
}

// Exported functions to be called from the client
export async function generateEcoStory(input: EcoStoryInput): Promise<EcoStoryOutput> {
  const { theme, language } = input;

  const prompt = `You are a creative storyteller and environmental educator. Create a short, engaging, fill-in-the-blanks story for a game in ${language} based on the theme of ${theme}.

The story should be a few paragraphs long and have between 4 and 6 blanks. Represent the blanks with numbered placeholders (e.g., "[1]", "[2]").

- Provide a catchy title for the story.
- Provide the story template.
- Provide the array of correct words that perfectly fit the blanks in order. The words should be relevant to the theme.
- Provide an array of incorrect words. These should be plausible distractors that are contextually related but wrong. The number of incorrect words should be equal to the number of correct words.`;

  const schema = `{
  "title": "string - A catchy title for the story",
  "storyTemplate": "string - The story text with numbered placeholders for blanks, like '[1]', '[2]', etc.",
  "correctWords": ["string"] - An array of the correct words that fit into the story blanks, in order,
  "incorrectWords": ["string"] - An array of incorrect but plausible words to act as distractors
}`;

  const systemMessage = 'You are a creative environmental educator who creates engaging educational content about sustainability topics.';

  return await generateStructuredCompletion<EcoStoryOutput>(
    prompt,
    schema,
    { systemMessage, temperature: 1 }
  );
}

export async function evaluateEcoStory(input: EvaluateStoryInput): Promise<EvaluateStoryOutput> {
  const { story, language } = input;

  const prompt = `You are an environmental expert. The user has completed a fill-in-the-blanks story in ${language}.

User's completed story:
"${story}"

Based on the choices the user filled in, provide a concluding paragraph in ${language}.
- Evaluate the choices made (even if they are incorrect distractors).
- Explain the environmental impact of the correct actions.
- If the user made wrong choices, gently correct them and explain the better alternative.
- Make the tone encouraging and educational.`;

  const systemMessage = 'You are an encouraging environmental educator who provides constructive feedback on sustainability choices.';

  const evaluation = await generateCompletion(
    prompt,
    { systemMessage, temperature: 1 }
  );

  return { evaluation };
}
