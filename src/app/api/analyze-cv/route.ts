import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { readFile } from "fs/promises";
import path from "path";
import { auth } from "../../../lib/auth";
import { prisma } from "../../../lib/prisma";
import {
  analyzeCV,
  getCVAnalysisModelLabel,
} from "../../../lib/cv-analysis";
import { extractTextFromPDF } from "../../../lib/pdf-extract";
import type { CVAnalysis } from "../../../lib/cv-analysis";

function stringArrayFromJson(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  return value.filter((item): item is string => typeof item === "string");
}

function containsPlaceholderFeedback(items: string[]) {
  return items.some((item) =>
    /kurzer text|\bstring\b|platzhalter|beispiel/i.test(item),
  );
}

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return Response.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { cvId } = await request.json();

    if (!cvId || typeof cvId !== "string") {
      return Response.json({ error: "cvId is required" }, { status: 400 });
    }

    const cvUpload = await prisma.cv_uploads.findFirst({
      where: {
        id: cvId,
        userId: session.user.id,
      },
    });

    if (!cvUpload) {
      return Response.json({ error: "CV not found" }, { status: 404 });
    }

    let extractedText = cvUpload.extractedText?.trim() ?? "";

    if (!extractedText) {
      try {
        const absolutePath = path.join(
          process.cwd(),
          "uploads",
          cvUpload.storageKey,
        );
        const buffer = await readFile(absolutePath);
        extractedText = (await extractTextFromPDF(buffer)).trim();

        if (extractedText) {
          await prisma.cv_uploads.update({
            where: { id: cvUpload.id },
            data: { extractedText },
          });
        }
      } catch (error) {
        console.error("CV re-extraction error:", error);
      }
    }

    if (!extractedText) {
      return Response.json(
        {
          error:
            "No extracted text available for this CV. The PDF may contain only scanned images.",
        },
        { status: 400 },
      );
    }

    if (
      cvUpload.analysisScore !== null &&
      cvUpload.analysisStrengths &&
      cvUpload.analysisWeaknesses &&
      cvUpload.analysisImprovements
    ) {
      const cachedAnalysis: CVAnalysis = {
        score: cvUpload.analysisScore,
        strengths: stringArrayFromJson(cvUpload.analysisStrengths),
        weaknesses: stringArrayFromJson(cvUpload.analysisWeaknesses),
        improvements: stringArrayFromJson(cvUpload.analysisImprovements),
      };

      const hasPlaceholderFeedback =
        containsPlaceholderFeedback(cachedAnalysis.strengths) ||
        containsPlaceholderFeedback(cachedAnalysis.weaknesses) ||
        containsPlaceholderFeedback(cachedAnalysis.improvements);
      const isCurrentPromptVersion =
        cvUpload.analysisModelUsed === getCVAnalysisModelLabel();

      if (!hasPlaceholderFeedback && isCurrentPromptVersion) {
        return Response.json({
          success: true,
          cached: true,
          analysis: cachedAnalysis,
          cvId,
          originalFilename: cvUpload.originalFilename,
        });
      }
    }

    const analysis = await analyzeCV(extractedText);

    await prisma.cv_uploads.update({
      where: {
        id: cvUpload.id,
      },
      data: {
        analysisScore: Math.round(analysis.score),
        analysisStrengths: analysis.strengths,
        analysisWeaknesses: analysis.weaknesses,
        analysisImprovements: analysis.improvements,
        analysisModelUsed: getCVAnalysisModelLabel(),
        analyzedAt: new Date(),
      },
    });

    revalidatePath("/");
    revalidatePath("/ai-analysis");

    return Response.json({
      success: true,
      cached: false,
      analysis,
      cvId,
      originalFilename: cvUpload.originalFilename,
    });
  } catch (error) {
    console.error("CV analysis error:", error);

    const message =
      error instanceof Error ? error.message : "An error occurred";

    return Response.json({ error: message }, { status: 500 });
  }
}
