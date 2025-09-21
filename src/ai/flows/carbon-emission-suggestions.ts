'use server';

/**
 * @fileOverview This file defines a flow for providing personalized carbon emission reduction suggestions.
 *
 * The flow takes user's lifestyle and habits as input and suggests ways to minimize their carbon footprint.
 * @param {CarbonEmissionSuggestionsInput} input - User's lifestyle and habits.
 * @returns {Promise<CarbonEmissionSuggestionsOutput>} - Personalized carbon emission reduction suggestions.
 */

import { generateStructuredCompletion } from '@/lib/azure-openai';

export interface CarbonEmissionSuggestionsInput {
  lifestyle: string;
  habits: string;
}

export interface CarbonEmissionSuggestionsOutput {
  suggestions: string;
}

export async function getCarbonEmissionSuggestions(
  input: CarbonEmissionSuggestionsInput
): Promise<CarbonEmissionSuggestionsOutput> {
  const { lifestyle, habits } = input;

  const prompt = `You are an AI assistant designed to provide personalized suggestions for reducing carbon emissions.

Based on the user's lifestyle and habits, suggest actionable ways for them to minimize their environmental impact. Consider various aspects such as transportation, diet, energy consumption, and waste management.

Lifestyle: ${lifestyle}
Habits: ${habits}

Provide the suggestions in a clear and concise manner, focusing on practical steps the user can take.`;

  const schema = `{
  "suggestions": "A detailed string containing actionable suggestions for the user to reduce their carbon emissions, tailored to their lifestyle and habits."
}`;

  const systemMessage = 'You are an environmental expert specializing in carbon footprint reduction. Provide practical, actionable advice based on the user\'s specific lifestyle and habits.';

  return await generateStructuredCompletion<CarbonEmissionSuggestionsOutput>(
    prompt,
    schema,
    { systemMessage, temperature: 1 }
  );
}
