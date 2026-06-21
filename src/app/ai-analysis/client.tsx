"use client";

import Link from "next/link";
import { useState } from "react";
import { AlertCircle, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import type { CVAnalysis } from "../../lib/cv-analysis";
import { SiteFooter } from "../../components/SiteFooter";

interface CVUpload {
  id: string;
  originalFilename: string;
  fileType: string;
  fileSizeBytes: bigint;
  fileUrl: string;
  createdAt: Date;
  hasAnalysis: boolean;
  analysis: CVAnalysis | null;
}

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[28px] border border-[#e5dcc1] bg-white/75 p-6 shadow-[0_14px_40px_rgba(116,101,65,0.07)] backdrop-blur">
      <div className="mb-5 flex items-center gap-4">
        <h2 className="text-xs font-semibold uppercase tracking-[0.35em] text-[#8a8467]">
          {title}
        </h2>
        <span className="h-px flex-1 bg-[#e8dec4]" />
      </div>
      {children}
    </section>
  );
}

interface AnalysisResult {
  success: boolean;
  analysis?: CVAnalysis;
  cvId?: string;
  originalFilename?: string;
  error?: string;
}

export default function AIAnalysisClient({
  cvUploads,
}: {
  cvUploads: CVUpload[];
}) {
  const [analyzing, setAnalyzing] = useState<string | null>(null);
  const [expandedCVs, setExpandedCVs] = useState<Set<string>>(new Set());
  const [results, setResults] = useState<Map<string, AnalysisResult>>(
    new Map()
  );
  const [error, setError] = useState<string | null>(null);

  const toggleExpanded = (cvId: string) => {
    setExpandedCVs((currentExpanded) => {
      const newExpanded = new Set(currentExpanded);
      if (newExpanded.has(cvId)) {
        newExpanded.delete(cvId);
      } else {
        newExpanded.add(cvId);
      }
      return newExpanded;
    });
  };

  async function handleAnalyze(cvId: string) {
    const cvUpload = cvUploads.find(cv => cv.id === cvId);
    const existingResult = results.get(cvId);
    const hasAnalysis = Boolean(cvUpload?.hasAnalysis || existingResult?.analysis);

    if (hasAnalysis) {
      toggleExpanded(cvId);
      return;
    }

    setAnalyzing(cvId);
    setError(null);

    try {
      const response = await fetch("/api/analyze-cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cvId }),
      });

      const data = (await response.json()) as AnalysisResult;

      if (!response.ok) {
        setError(data.error || "Analysis failed");
        setResults(new Map(results).set(cvId, data));
      } else {
        setResults(new Map(results).set(cvId, data));
        setExpandedCVs((currentExpanded) => {
          const newExpanded = new Set(currentExpanded);
          newExpanded.add(cvId);
          return newExpanded;
        });
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "An error occurred";
      setError(message);
      setResults(
        new Map(results).set(cvId, { success: false, error: message })
      );
    } finally {
      setAnalyzing(null);
    }
  }

  return (
    <div>
    <main className="min-h-screen px-4 py-6 text-[#2f3628] sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* HEADER */}
        <div className="rounded-[36px] border border-[#d9ceb1] bg-[#f6f0e6] p-8 shadow-[0_24px_90px_rgba(98,87,55,0.14)]">
          <p className="text-[10px] uppercase tracking-[0.42em] text-[#8d8667]">
            AI-Analyse
          </p>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <h1 className="font-serif text-4xl text-[#4d5240]">
              Lebenslauf-Analyse
            </h1>
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="/cv-upload"
                className="rounded-full bg-[#74824a] px-4 py-2 text-xs font-semibold text-[#f8f3e3] shadow-sm transition hover:bg-[#65743f]"
              >
                CV hochladen
              </Link>
              <Link
                href="/"
                className="rounded-full border border-[#d6caa9] bg-[#f9f4e7] px-4 py-2 text-xs font-semibold text-[#6e7456] transition hover:bg-[#f3ecd9]"
              >
                Zurück
              </Link>
            </div>
          </div>
          <p className="mt-3 text-sm text-[#6f6a58]">
            Hier kannst du deine Lebensläufe von unserer KI analysieren lassen
            und detailliertes Feedback erhalten.
          </p>
        </div>

        {error && (
          <div className="rounded-[28px] border border-[#fecaca] bg-[#fef2f2] p-6 shadow-[0_14px_40px_rgba(229,92,92,0.1)]">
            <div className="flex gap-3">
              <AlertCircle className="h-5 w-5 text-[#d32f2f]" />
              <div>
                <h3 className="font-semibold text-[#d32f2f]">Error</h3>
                <p className="text-sm text-[#c62828]">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* CV LIST */}
        <SectionCard title="Ihre Lebensläufe">
          {cvUploads.length === 0 ? (
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="text-sm text-[#6f6a58]">
                Keine CVs hochgeladen. Bitte laden Sie zuerst einen Lebenslauf
                hoch.
              </p>
              <Link
                href="/cv-upload"
                className="rounded-full bg-[#74824a] px-4 py-2 text-xs font-semibold text-[#f8f3e3] shadow-sm transition hover:bg-[#65743f]"
              >
                Zum CV Upload
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {cvUploads.map((cv) => {
                const result = results.get(cv.id);
                const analysis = result?.analysis || cv.analysis;
                const isExpanded = expandedCVs.has(cv.id);
                const showError = result && !result.success;

                return (
                  <div
                    key={cv.id}
                    className="rounded-2xl border border-[#e4dabc] bg-white/70 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <p className="font-medium text-[#4f5341]">
                          {cv.originalFilename}
                        </p>
                        <p className="mt-1 text-xs text-[#7c765d]">
                          {Math.round(Number(cv.fileSizeBytes) / 1024)} KB ·{" "}
                          {cv.createdAt.toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleAnalyze(cv.id)}
                        disabled={analyzing === cv.id}
                        className="rounded-full bg-[#74824a] px-4 py-2 text-xs font-semibold text-[#f8f3e3] shadow-sm transition disabled:opacity-50 hover:bg-[#65743f] disabled:cursor-not-allowed"
                      >
                        {analyzing === cv.id ? (
                          <span className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Wird analysiert...
                          </span>
                        ) : cv.hasAnalysis || analysis ? (
                          <span className="flex items-center gap-2">
                            {isExpanded ? (
                              <>
                                <ChevronUp className="h-4 w-4" />
                                Verbergen
                              </>
                            ) : (
                              <>
                                <ChevronDown className="h-4 w-4" />
                                Anzeigen
                              </>
                            )}
                          </span>
                        ) : (
                          "Analysieren"
                        )}
                      </button>
                    </div>

                    {/* ANALYSIS RESULT */}
                    {(cv.hasAnalysis || analysis) && isExpanded && (
                      <div className="mt-4 space-y-4 border-t border-[#e4dabc] pt-4">
                        {analysis ? (
                          <>
                            {/* SCORE */}
                            <div className="rounded-xl bg-gradient-to-r from-[#74824a]/10 to-[#9aa56a]/10 p-4">
                              <p className="text-xs uppercase tracking-[0.25em] text-[#8a8467]">
                                Gesamtbewertung
                              </p>
                              <div className="mt-2 flex items-baseline gap-2">
                                <span className="text-4xl font-bold text-[#74824a]">
                                  {analysis.score}
                                </span>
                                <span className="text-sm text-[#6f6a58]">
                                  / 100
                                </span>
                              </div>
                            </div>

                            {/* STRENGTHS */}
                            {analysis.strengths.length > 0 && (
                              <div>
                                <h4 className="text-xs font-semibold uppercase tracking-[0.25em] text-[#8a8467]">
                                  Stärken
                                </h4>
                                <ul className="mt-2 space-y-2">
                                  {analysis.strengths.map(
                                    (strength, idx) => (
                                      <li
                                        key={idx}
                                        className="flex gap-2 text-sm text-[#4f5341]"
                                      >
                                        <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#74824a]" />
                                        {strength}
                                      </li>
                                    )
                                  )}
                                </ul>
                              </div>
                            )}

                            {/* WEAKNESSES */}
                            {analysis.weaknesses.length > 0 && (
                              <div>
                                <h4 className="text-xs font-semibold uppercase tracking-[0.25em] text-[#8a8467]">
                                  Schwachstellen
                                </h4>
                                <ul className="mt-2 space-y-2">
                                  {analysis.weaknesses.map(
                                    (weakness, idx) => (
                                      <li
                                        key={idx}
                                        className="flex gap-2 text-sm text-[#4f5341]"
                                      >
                                        <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#d97706]" />
                                        {weakness}
                                      </li>
                                    )
                                  )}
                                </ul>
                              </div>
                            )}

                            {/* IMPROVEMENTS */}
                            {analysis.improvements.length > 0 && (
                              <div>
                                <h4 className="text-xs font-semibold uppercase tracking-[0.25em] text-[#8a8467]">
                                  Empfehlungen
                                </h4>
                                <ul className="mt-2 space-y-2">
                                  {analysis.improvements.map(
                                    (improvement, idx) => (
                                      <li
                                        key={idx}
                                        className="flex gap-2 text-sm text-[#4f5341]"
                                      >
                                        <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#3b82f6]" />
                                        {improvement}
                                      </li>
                                    )
                                  )}
                                </ul>
                              </div>
                            )}
                          </>
                        ) : showError ? (
                          <div className="flex gap-3 rounded-lg bg-[#fee2e2] p-4">
                            <AlertCircle className="h-5 w-5 flex-shrink-0 text-[#dc2626]" />
                            <p className="text-sm text-[#991b1b]">
                              {result?.error ||
                                "Analyse fehlgeschlagen. Bitte versuchen Sie es später erneut."}
                            </p>
                          </div>
                        ) : null}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </SectionCard>
      </div>
    </main>
    <SiteFooter/>
    </div>
  );
}
