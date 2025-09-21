import {genkit} from 'genkit';
import openAICompatible from '@genkit-ai/compat-oai';

export const ai = genkit({
  plugins: [
    openAICompatible({
      name: 'azure-openai',
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: process.env.AZURE_ENDPOINT,
      defaultQuery: { 
        'api-version': process.env.OPENAI_VERSION 
      },
    }),
  ],
  model: `azure-openai/${process.env.DEPLOYMENT_NAME}`,
});
