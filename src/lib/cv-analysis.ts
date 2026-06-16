import { z } from "zod";
import { openai } from "./openai";

const CVAnalysisSchema = z.object({
  score: z.number(),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  improvements: z.array(z.string()),
});

export type CVAnalysis = z.infer<typeof CVAnalysisSchema>;

export async function analyzeCV(
  extractedText: string,
): Promise<CVAnalysis> {
  const prompt = `
Du bist ein professioneller HR-Recruiter.

Analysiere den folgenden Lebenslauf.

Gib ausschließlich JSON zurück.

Schema:

{
  "score": number,
  "strengths": string[],
  "weaknesses": string[],
  "improvements": string[]
}

Lebenslauf:

${extractedText}
`;

  const response = await openai.responses.create({
    model: process.env.OPENAI_MODEL ?? "gpt-5-mini",
    input: prompt,
  });

  const text = response.output_text;

  const parsed = JSON.parse(text);

  return CVAnalysisSchema.parse(parsed);
}

