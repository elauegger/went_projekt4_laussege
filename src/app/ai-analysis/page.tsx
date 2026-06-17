import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import AIAnalysisClient from "./client";

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

  // Convert Date objects for client component
  const cvUploads = user.cvUploads.map((cv) => ({
    id: cv.id,
    originalFilename: cv.originalFilename,
    fileType: cv.fileType,
    fileSizeBytes: cv.fileSizeBytes,
    fileUrl: cv.fileUrl,
    createdAt: cv.createdAt,
    hasAnalysis: !!(
      cv.analysisScore !== null &&
      cv.analysisStrengths &&
      cv.analysisWeaknesses &&
      cv.analysisImprovements
    ),
    analysis: cv.analysisScore !== null &&
      cv.analysisStrengths &&
      cv.analysisWeaknesses &&
      cv.analysisImprovements ? {
      score: cv.analysisScore,
      strengths: cv.analysisStrengths as string[],
      weaknesses: cv.analysisWeaknesses as string[],
      improvements: cv.analysisImprovements as string[],
    } : null,
  }));

  return <AIAnalysisClient cvUploads={cvUploads} />;
}
