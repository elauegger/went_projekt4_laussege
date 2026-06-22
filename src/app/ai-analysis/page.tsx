import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { getCVAnalysisModelLabel } from "../../lib/cv-analysis";
import AIAnalysisClient from "./client";

function stringArrayFromJson(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  return value.filter((item): item is string => typeof item === "string");
}

function containsPlaceholderFeedback(items: string[]) {
  return items.some((item) =>
    /kurzer text|\bstring\b|platzhalter|beispiel/i.test(item),
  );
}

export default async function AIAnalysisPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/signin");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    include: {
      cvUploads: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!user) {
    redirect("/signin");
  }

  const currentAnalysisModelLabel = getCVAnalysisModelLabel();

  // Convert Date objects for client component
  const cvUploads = user.cvUploads.map((cv) => {
    const strengths = stringArrayFromJson(cv.analysisStrengths);
    const weaknesses = stringArrayFromJson(cv.analysisWeaknesses);
    const improvements = stringArrayFromJson(cv.analysisImprovements);
    const hasStoredAnalysis = !!(
      cv.analysisScore !== null &&
      strengths.length > 0 &&
      weaknesses.length > 0 &&
      improvements.length > 0
    );
    const hasPlaceholderFeedback =
      containsPlaceholderFeedback(strengths) ||
      containsPlaceholderFeedback(weaknesses) ||
      containsPlaceholderFeedback(improvements);
    const hasCurrentAnalysis =
      hasStoredAnalysis &&
      !hasPlaceholderFeedback &&
      cv.analysisModelUsed === currentAnalysisModelLabel;

    return {
      id: cv.id,
      originalFilename: cv.originalFilename,
      fileType: cv.fileType,
      fileSizeBytes: cv.fileSizeBytes,
      fileUrl: cv.fileUrl,
      createdAt: cv.createdAt,
      hasAnalysis: hasCurrentAnalysis,
      analysis: hasCurrentAnalysis
        ? {
          score: cv.analysisScore!,
          strengths,
          weaknesses,
          improvements,
        }
        : null,
    };
  });

  return <AIAnalysisClient cvUploads={cvUploads} />;
}
