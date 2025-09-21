'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating a carbon footprint quiz.
 *
 * The flow generates a list of quiz questions, each with a question and a set of options.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const QuizOptionSchema = z.object({
  text: z.string().describe('The text for the choice.'),
  isCorrect: z.boolean().describe('Whether this option is the correct answer.'),
  feedback: z.string().describe('Feedback to show the user after they select this option.'),
});

const CarbonQuizQuestionSchema = z.object({
  question: z.string().describe('The quiz question about carbon reduction practices.'),
  options: z.array(QuizOptionSchema).length(4).describe('An array of four possible choices for the user.'),
});
export type CarbonQuizQuestion = z.infer<typeof CarbonQuizQuestionSchema>;

const CarbonQuizInputSchema = z.object({
  count: z
    .number()
    .int()
    .positive()
    .describe('The number of questions to generate.'),
    language: z.string().describe('The language for the quiz (e.g., "English", "Hindi", "Bengali", "Odia").'),
});
export type CarbonQuizInput = z.infer<typeof CarbonQuizInputSchema>;

const CarbonQuizOutputSchema = z.object({
  questions: z.array(CarbonQuizQuestionSchema),
});
export type CarbonQuizOutput = z.infer<typeof CarbonQuizOutputSchema>;

export async function generateCarbonQuiz(
  input: CarbonQuizInput
): Promise<CarbonQuizOutput> {
  return generateCarbonQuizFlow(input);
}

const generateCarbonQuizPrompt = ai.definePrompt({
  name: 'generateCarbonQuizPrompt',
  input: {schema: CarbonQuizInputSchema},
  output: {schema: CarbonQuizOutputSchema},
  prompt: `You are an expert in environmental science, creating a quiz about reducing carbon emissions.

Generate a list of {{{count}}} quiz questions in {{{language}}}. Each question should be about a practical way to reduce one's carbon footprint.

For each question, provide:
- A clear, concise question.
- Exactly four options. One must be correct, the others should be plausible but incorrect.
- For each option, provide brief feedback explaining why it's correct or incorrect. The feedback for a correct answer should include a reward, for example 'Correct! You earned 10 eco-points!'.
`,
});

const generateCarbonQuizFlow = ai.defineFlow(
  {
    name: 'generateCarbonQuizFlow',
    inputSchema: CarbonQuizInputSchema,
    outputSchema: CarbonQuizOutputSchema,
  },
  async input => {
    const {output} = await generateCarbonQuizPrompt(input);
    return output!;
  }
);
