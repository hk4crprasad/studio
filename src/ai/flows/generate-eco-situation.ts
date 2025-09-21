'use server';

/**
 * @fileOverview This file defines a flow for generating multiple eco-situation scenarios for a game.
 *
 * The flow generates a list of scenarios, each with a title, description, and a set of options for a given theme.
 */

import { generateStructuredCompletion } from '@/lib/azure-openai';

export interface SituationOption {
  text: string;
  isCorrect: boolean;
  feedback: string;
}

export interface EcoSituation {
  title: string;
  description: string;
  options: SituationOption[];
}

export interface EcoSituationsInput {
  theme: string;
  count: number;
  language: string;
}

export interface EcoSituationsOutput {
  scenarios: EcoSituation[];
}

export async function generateEcoSituations(
  input: EcoSituationsInput
): Promise<EcoSituationsOutput> {
  const { theme, count, language } = input;

  const prompt = `You are a game designer creating scenarios for an educational game about sustainability and environmental civic sense.

Generate a list of ${count} scenarios in ${language} based on the theme of ${theme}.

Each scenario should present a common, everyday situation where a person can make a choice that impacts the environment.

For each scenario, provide a concise title, a description of the situation, and exactly three options.
- One option should be the most sustainable/correct choice.
- The other two options should be common but less sustainable alternatives.
- For each option, provide brief, educational feedback explaining the consequence or benefit of that choice. The feedback for a correct answer should include a reward, for example 'You earned 10 eco-points!'.`;

  const schema = `{
  "scenarios": [
    {
      "title": "string - The title of the scenario",
      "description": "string - A description of the situation",
      "options": [
        {
          "text": "string - The text for the choice",
          "isCorrect": "boolean - Whether this option is the most sustainable choice",
          "feedback": "string - Feedback to show the user after they select this option"
        }
      ]
    }
  ]
}`;

  const systemMessage = 'You are an environmental education expert who creates engaging scenarios about sustainability and environmental responsibility.';

  return await generateStructuredCompletion<EcoSituationsOutput>(
    prompt,
    schema,
    { systemMessage, temperature: 1 }
  );
}
