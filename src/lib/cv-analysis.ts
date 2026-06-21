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
  score: z.number().min(0).max(100),
  strengths: StringArraySchema,
  weaknesses: StringArraySchema,
  improvements: StringArraySchema,
});

export type CVAnalysis = z.infer<typeof CVAnalysisSchema>;

export const CV_ANALYSIS_PROMPT_VERSION = "cv-analysis-v2";

export const getCVAnalysisModelLabel = () =>
  `${process.env.GROQ_MODEL ?? "llama-3.1-8b-instant"}:${CV_ANALYSIS_PROMPT_VERSION}`;

const placeholderPatterns = [
  /kurzer text/i,
  /\bstring\b/i,
  /beispiel/i,
  /platzhalter/i,
];

const cleanItems = (items: string[]) =>
  items
    .map((item) => item.trim())
    .filter((item) => item.length > 0)
    .filter((item) => !placeholderPatterns.some((pattern) => pattern.test(item)));

const normalizeAnalysis = (analysis: CVAnalysis): CVAnalysis => ({
  score: Math.round(Math.min(100, Math.max(0, analysis.score))),
  strengths: cleanItems(analysis.strengths),
  weaknesses: cleanItems(analysis.weaknesses),
  improvements: cleanItems(analysis.improvements),
});

export async function analyzeCV(extractedText: string): Promise<CVAnalysis> {
  const response = await groq.chat.completions.create({
    model: process.env.GROQ_MODEL ?? "llama-3.1-8b-instant",
    temperature: 0.2,
    top_p: 1,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `
Du bist ein freundlicher Karriere-Coach und bewertest Lebensläufe auf Deutsch.
Antworte ausschließlich mit gültigem JSON.
Schreibe verständlich und alltagsnah. Vermeide Fachwörter, wenn einfache Wörter reichen.
Verwende niemals Wörter wie "String", "JSON", "Array", "Objekt", "Prompt", "Platzhalter" oder "Beispiel" in den Antworten für Nutzer.
Bewerte konkret den vorliegenden Lebenslauf. Erfinde keine Details.
Achte auf Alter, Berufserfahrung und Karrierestufe: Bei Berufseinsteigern nicht so streng bewerten wie bei Senior-Profilen.
Wenn der Text kein echter Lebenslauf ist oder kaum verwertbare Informationen enthält, gib eine deutlich niedrigere Punktzahl und erkläre knapp, was fehlt.
`.trim(),
      },
      {
        role: "user",
        content: `
Analysiere diesen Lebenslauf.

Gib nur ein JSON-Objekt mit diesen Feldern zurück:
- score: Zahl von 0 bis 100
- strengths: Liste mit 2 bis 5 konkreten Stärken
- weaknesses: Liste mit 1 bis 4 konkreten Schwachstellen
- improvements: Liste mit 2 bis 5 konkreten Verbesserungsvorschlägen

Wichtig:
- Kein Markdown
- Keine Erklärungen außerhalb des JSON
- Keine Objekte in den Arrays
- Nur kurze Sätze in strengths, weaknesses und improvements
- Jeder Punkt muss sich auf den Lebenslauf beziehen
- Verwende nicht immer gleich viele Punkte: Die Anzahl soll davon abhängen, wie viel im Lebenslauf tatsächlich auffällt
- Schreibe natürlich und verständlich, so wie man es einer Bewerberin oder einem Bewerber direkt sagen würde
- Stärke-Punkte beginnen nicht immer gleich. Vermeide monotone Formulierungen
- Verbesserungsvorschläge sollen konkret sagen, was geändert oder ergänzt werden soll
- Nenne keine technischen Formatbegriffe wie "String" oder "Array"

Bewertungsrahmen:
- 90-100: sehr klar, vollständig, überzeugend und passend formuliert
- 75-89: gut, aber mit einigen Verbesserungsmöglichkeiten
- 55-74: brauchbar, aber wichtige Informationen fehlen oder sind unklar
- 30-54: schwach, viele zentrale Angaben fehlen
- 0-29: kaum als Lebenslauf bewertbar oder nicht relevant

Lebenslauf:
${extractedText.slice(0, 12000)}
`,
      },
    ],
  });

  const text = response.choices[0]?.message?.content;

  if (!text) {
    throw new Error("Groq returned no content");
  }

  const parsed = JSON.parse(text);

  return normalizeAnalysis(CVAnalysisSchema.parse(parsed));
}
