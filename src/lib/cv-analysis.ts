import { z } from "zod";
import { groq } from "./groq";

const StringArraySchema = z.array(
  z.union([
    z.string(),
    z.object({
      title: z.string().optional(),
      description: z.string().optional(),
      text: z.string().optional(),
    }),
  ])
).transform((items) =>
  items.map((item) => {
    if (typeof item === "string") return item;

    return [item.title, item.description, item.text]
      .filter(Boolean)
      .join(": ");
  })
);

const CVAnalysisSchema = z.object({
  score: z.number(),
  strengths: StringArraySchema,
  weaknesses: StringArraySchema,
  improvements: StringArraySchema,
});

export type CVAnalysis = z.infer<typeof CVAnalysisSchema>;

export async function analyzeCV(extractedText: string): Promise<CVAnalysis> {
  const response = await groq.chat.completions.create({
    model: process.env.GROQ_MODEL ?? "llama-3.1-8b-instant",
    temperature: 0,
    top_p: 1,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content:
        "Du bist ein HR-Recruiter. Bewerte deterministisch und konsistent. Verwende bei gleichem Lebenslauf immer dieselbe Bewertung. Antworte ausschließlich mit gültigem JSON. Arrays enthalten nur Strings. Achte auf das Alter der Bewerber, und bewerte dementsprechend. Sei also nicht zu streng, wenn junge Leute noch wenig Erfahrung haben.",      },
      {
        role: "user",
        content: `
Analysiere diesen Lebenslauf.

Gib exakt dieses JSON zurück:

{
  "score": 0,
  "strengths": [
    "Kurzer Text als String"
  ],
  "weaknesses": [
    "Kurzer Text als String"
  ],
  "improvements": [
    "Kurzer Text als String"
  ]
}

Wichtig:
- Kein Markdown
- Keine Erklärungen außerhalb des JSON
- Keine Objekte in den Arrays
- Nur Strings in strengths, weaknesses und improvements
- score muss eine Zahl von 0 bis 100 sein

Lebenslauf:
${extractedText}
`,
      },
    ],
  });

  const text = response.choices[0]?.message?.content;

  if (!text) {
    throw new Error("Groq returned no content");
  }

  const parsed = JSON.parse(text);

  return CVAnalysisSchema.parse(parsed);
}