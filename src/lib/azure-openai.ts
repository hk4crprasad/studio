import OpenAI from 'openai';

// Azure OpenAI client configuration
const azureOpenAI = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: `${process.env.AZURE_ENDPOINT}openai/deployments/${process.env.DEPLOYMENT_NAME}`,
  defaultQuery: { 'api-version': process.env.OPENAI_VERSION },
  defaultHeaders: {
    'api-key': process.env.OPENAI_API_KEY,
  },
});

export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AIGenerationOptions {
  temperature?: number;
  maxTokens?: number;
  systemMessage?: string;
}

/**
 * Generate text completion using Azure OpenAI
 */
export async function generateCompletion(
  prompt: string,
  options: AIGenerationOptions = {}
): Promise<string> {
  const {
    temperature = 1,
    maxTokens = 32000,
    systemMessage = 'You are a helpful assistant.',
  } = options;

  const messages: AIMessage[] = [
    { role: 'system', content: systemMessage },
    { role: 'user', content: prompt },
  ];

  try {
    const response = await azureOpenAI.chat.completions.create({
      model: process.env.DEPLOYMENT_NAME!,
      messages,
      temperature,
      max_completion_tokens: maxTokens,
    });

    return response.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('Azure OpenAI API Error:', error);
    throw new Error(`Failed to generate completion: ${error}`);
  }
}

/**
 * Generate structured data using Azure OpenAI with JSON mode
 */
export async function generateStructuredCompletion<T>(
  prompt: string,
  schema: any,
  options: {
    temperature?: number;
    maxTokens?: number;
    systemMessage?: string;
  } = {}
): Promise<T> {
  const {
    temperature = 1,
    maxTokens = 72000,
    systemMessage = 'You are a helpful assistant that responds with valid JSON.',
  } = options;

  const enhancedPrompt = `${prompt}

Please respond with a valid JSON object that matches this schema:
${schema}

Important: Only return valid JSON, no additional text or explanation.`;

  const messages: AIMessage[] = [
    { role: 'system', content: systemMessage },
    { role: 'user', content: enhancedPrompt },
  ];

  try {
    console.log('Making Azure OpenAI API call with config:', {
      baseURL: `${process.env.AZURE_ENDPOINT}openai/deployments/${process.env.DEPLOYMENT_NAME}`,
      model: process.env.DEPLOYMENT_NAME,
      apiVersion: process.env.OPENAI_VERSION
    });

    const response = await azureOpenAI.chat.completions.create({
      model: process.env.DEPLOYMENT_NAME!,
      messages,
      temperature,
      max_completion_tokens: maxTokens,
      response_format: { type: 'json_object' },
    });

    console.log('Azure OpenAI response received:', response);

    const content = response.choices[0]?.message?.content || '{}';
    console.log('Parsing JSON content:', content);
    
    const parsed = JSON.parse(content);
    console.log('Successfully parsed JSON:', parsed);
    
    return parsed;
  } catch (error) {
    console.error('Azure OpenAI API Error details:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      baseURL: `${process.env.AZURE_ENDPOINT}openai/deployments/${process.env.DEPLOYMENT_NAME}`,
      hasApiKey: !!process.env.OPENAI_API_KEY,
      deployment: process.env.DEPLOYMENT_NAME,
      apiVersion: process.env.OPENAI_VERSION
    });
    throw new Error(`Failed to generate structured completion: ${error instanceof Error ? error.message : error}`);
  }
}

/**
 * Generate completion with conversation history
 */
export async function generateConversationCompletion(
  messages: AIMessage[],
  options: AIGenerationOptions = {}
): Promise<string> {
  const {
    temperature = 1,
    maxTokens = 32000,
  } = options;

  try {
    const response = await azureOpenAI.chat.completions.create({
      model: process.env.DEPLOYMENT_NAME!,
      messages,
      temperature,
      max_completion_tokens: maxTokens,
    });

    return response.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('Azure OpenAI API Error:', error);
    throw new Error(`Failed to generate conversation completion: ${error}`);
  }
}

export { azureOpenAI };