import { generateStructuredCompletion } from '@/lib/azure-openai';
import { CarbonTrackerInput, CarbonAnalysis } from '@/lib/carbon-tracker-data';

interface CarbonTrackerOutput {
  totalEmissions: number;
  totalReductions: number;
  netImpact: number;
  activities: Array<{
    activity: string;
    category: 'transport' | 'energy' | 'food' | 'waste' | 'consumption';
    carbonImpact: number;
    type: 'emission' | 'reduction';
    explanation: string;
  }>;
  recommendations: string[];
  score: 'excellent' | 'good' | 'average' | 'poor';
  summary: string;
}

export async function analyzeCarbonFootprint(input: CarbonTrackerInput): Promise<CarbonAnalysis> {
  const { activities, language = 'English' } = input;

  const prompt = `Analyze the following daily activities and calculate their carbon impact:

Activities: "${activities}"

Please analyze each activity and:
1. Categorize it (transport, energy, food, waste, consumption)
2. Estimate carbon impact in kg CO2 (positive for emissions, negative for reductions)
3. Provide explanation for the impact
4. Give overall recommendations for improvement

Consider these factors:
- Transportation modes and distances
- Energy usage patterns
- Food choices (local vs imported, vegetarian vs meat)
- Waste management practices
- Consumption habits
- Any eco-friendly activities

Respond in ${language} language.

Provide a score based on net impact:
- Excellent: Net reduction > 10kg CO2
- Good: Net reduction 2-10kg CO2  
- Average: Net impact -2 to +5kg CO2
- Poor: Net emissions > 5kg CO2

Format the response as valid JSON matching this structure:
{
  "totalEmissions": number,
  "totalReductions": number,
  "netImpact": number,
  "activities": [
    {
      "activity": "string",
      "category": "transport|energy|food|waste|consumption",
      "carbonImpact": number,
      "type": "emission|reduction",
      "explanation": "string"
    }
  ],
  "recommendations": ["string"],
  "score": "excellent|good|average|poor",
  "summary": "string"
}`;

  const schema = `{
    "type": "object",
    "properties": {
      "totalEmissions": { "type": "number" },
      "totalReductions": { "type": "number" },
      "netImpact": { "type": "number" },
      "activities": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "activity": { "type": "string" },
            "category": { 
              "type": "string",
              "enum": ["transport", "energy", "food", "waste", "consumption"]
            },
            "carbonImpact": { "type": "number" },
            "type": { 
              "type": "string",
              "enum": ["emission", "reduction"]
            },
            "explanation": { "type": "string" }
          },
          "required": ["activity", "category", "carbonImpact", "type", "explanation"]
        }
      },
      "recommendations": {
        "type": "array",
        "items": { "type": "string" }
      },
      "score": { 
        "type": "string",
        "enum": ["excellent", "good", "average", "poor"]
      },
      "summary": { "type": "string" }
    },
    "required": ["totalEmissions", "totalReductions", "netImpact", "activities", "recommendations", "score", "summary"]
  }`;

  const systemMessage = `You are an expert environmental scientist specializing in carbon footprint analysis. You accurately calculate carbon emissions and reductions from daily activities, providing practical advice for sustainable living. Always provide responses in the requested language while maintaining scientific accuracy.`;

  return await generateStructuredCompletion<CarbonTrackerOutput>(
    prompt,
    schema,
    { systemMessage, temperature: 1 }
  );
}