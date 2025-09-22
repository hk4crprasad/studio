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
  language: string;
}

export interface CarbonSuggestion {
  category: string;
  title: string;
  description: string;
  impact: string;
  difficulty: string;
}

export interface CarbonEmissionSuggestionsOutput {
  suggestions: CarbonSuggestion[];
}

export async function getCarbonEmissionSuggestions(
  input: CarbonEmissionSuggestionsInput
): Promise<CarbonEmissionSuggestionsOutput> {
  const { lifestyle, habits, language } = input;

  const prompt = `You are an AI assistant designed to provide personalized suggestions for reducing carbon emissions.

Based on the user's lifestyle and habits, suggest actionable ways for them to minimize their environmental impact. Consider various aspects such as transportation, diet, energy consumption, and waste management.

Lifestyle: ${lifestyle}
Habits: ${habits}

Provide exactly 6-8 point-wise suggestions in ${language}. Each suggestion should include:
- Category (e.g., Transportation, Energy, Diet, Waste, etc.)
- Title (a brief, actionable title)
- Description (detailed explanation of the action)
- Impact (environmental benefit)
- Difficulty (Easy/Medium/Hard)

The suggestions should be practical, specific, and tailored to the user's lifestyle and habits. Make sure all text is in ${language}.`;

  const schema = `{
  "suggestions": [
    {
      "category": "string - The category of the suggestion (Transportation, Energy, Diet, Waste, etc.)",
      "title": "string - A brief, actionable title for the suggestion",
      "description": "string - Detailed explanation of the action to take",
      "impact": "string - Description of the environmental benefit",
      "difficulty": "string - Easy, Medium, or Hard"
    }
  ]
}`;

  const systemMessage = `You are an environmental expert specializing in carbon footprint reduction. Provide practical, actionable advice based on the user's specific lifestyle and habits. Always respond in the requested language with culturally appropriate suggestions. Format your response as structured JSON with point-wise suggestions.`;

  return await generateStructuredCompletion<CarbonEmissionSuggestionsOutput>(
    prompt,
    schema,
    { systemMessage, temperature: 1 }
  );
}
