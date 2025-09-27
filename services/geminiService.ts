import { GoogleGenAI, Type } from '@google/genai';
import type { AnalysisResult } from '../types';

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result.split(',')[1]);
      } else {
        resolve('');
      }
    };
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

export const analyzeLeaf = async (imageFile: File, language: string): Promise<AnalysisResult> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
  }
  
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const imagePart = await fileToGenerativePart(imageFile);
  
  const prompt = `Analyze this plant leaf image. Provide the analysis in ${language}. Follow the JSON schema precisely. 
  - If the leaf is healthy: diseaseName should be "N/A", riskLevel low, accuracy high, and treatment/pesticide arrays should be empty.
  - If diseased: identify the disease, provide a risk level from 0-100, give simple, actionable treatment advice, and suggest preventative pesticides.
  - Provide an accuracy score (0-100) for your diagnosis confidence.
  - The treatment advice should be a list of short, clear steps for a farmer.
  - The pesticide suggestions should be a list of common pesticide names or types.`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [{ parts: [imagePart, { text: prompt }] }],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          isHealthy: {
            type: Type.BOOLEAN,
            description: "Is the plant leaf healthy?",
          },
          diseaseName: {
            type: Type.STRING,
            description: "Name of the disease if not healthy, or 'N/A' if healthy.",
          },
          riskLevel: {
            type: Type.NUMBER,
            description: "A numerical risk score from 0 (no risk) to 100 (high risk).",
          },
          treatmentAdvice: {
            type: Type.ARRAY,
            items: {
              type: Type.STRING,
            },
            description: "A list of simple, farmer-friendly treatment steps. Should be an empty array if healthy.",
          },
          accuracy: {
            type: Type.NUMBER,
            description: "A confidence score from 0 to 100 for the diagnosis.",
          },
          pesticideSuggestions: {
            type: Type.ARRAY,
            items: {
                type: Type.STRING
            },
            description: "A list of suggested pesticides for prevention. Should be an empty array if healthy.",
          }
        },
        required: ['isHealthy', 'diseaseName', 'riskLevel', 'treatmentAdvice', 'accuracy', 'pesticideSuggestions'],
      },
    },
  });

  try {
    const jsonText = response.text.trim();
    const result: AnalysisResult = JSON.parse(jsonText);
    return result;
  } catch (e) {
    console.error("Failed to parse Gemini response:", response.text);
    throw new Error("Could not understand the analysis from AI. The response was not valid JSON.");
  }
};
