'use server';

/**
 * @fileOverview This file defines a flow for generating a carbon footprint quiz.
 *
 * The flow generates a list of quiz questions, each with a question and a set of options.
 */

import { generateStructuredCompletion } from '@/lib/azure-openai';

export interface QuizOption {
  text: string;
  isCorrect: boolean;
  feedback: string;
}

export interface CarbonQuizQuestion {
  question: string;
  options: QuizOption[];
}

export interface CarbonQuizInput {
  count: number;
  language: string;
}

export interface CarbonQuizOutput {
  questions: CarbonQuizQuestion[];
}

export async function generateCarbonQuiz(
  input: CarbonQuizInput
): Promise<CarbonQuizOutput> {
  const { count, language } = input;

  const prompt = `You are an expert in environmental science, creating a quiz about reducing carbon emissions.

Generate a list of ${count} quiz questions in ${language}. Each question should be about a practical way to reduce one's carbon footprint.

For each question, provide:
- A clear, concise question.
- Exactly four options. One must be correct, the others should be plausible but incorrect.
- For each option, provide brief feedback explaining why it's correct or incorrect. The feedback for a correct answer should include a reward, for example 'Correct! You earned 10 eco-points!'.`;

  const schema = `{
  "questions": [
    {
      "question": "string - The quiz question about carbon reduction practices",
      "options": [
        {
          "text": "string - The text for the choice",
          "isCorrect": "boolean - Whether this option is the correct answer",
          "feedback": "string - Feedback to show the user after they select this option"
        }
      ]
    }
  ]
}`;

  const systemMessage = 'You are an environmental education expert. Create engaging, educational quiz questions about carbon footprint reduction. Make sure each question has exactly 4 options with one correct answer.';

  return await generateStructuredCompletion<CarbonQuizOutput>(
    prompt,
    schema,
    { systemMessage, temperature: 1 }
  );
}
