"use client";

import { useRef, useState, type FormEvent } from "react";

type UploadState =
  | { kind: "idle"; message: string }
  | { kind: "success"; message: string }
  | { kind: "error"; message: string };

export function CvUploadForm() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<UploadState>({
    kind: "idle",
    message: "",
  });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formElement = event.currentTarget;
    const formData = new FormData(formElement);
    const selectedFile = fileInputRef.current?.files?.[0];

    if (!selectedFile) {
      setStatus({
        kind: "error",
        message: "Bitte eine PDF-Datei auswählen.",
      });

      return;
    }

    formData.set("cv", selectedFile);
    setIsSubmitting(true);
    setStatus({ kind: "idle", message: "" });

    try {
      const response = await fetch("/api/cv-upload", {
        method: "POST",
        body: formData,
      });

      const payload = (await response.json().catch(() => null)) as
        | { success?: boolean; message?: string; error?: string }
        | null;

      if (!response.ok) {
        throw new Error(payload?.error || "Der Upload ist fehlgeschlagen.");
      }

      formElement.reset();

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setStatus({
        kind: "success",
        message: payload?.message || "PDF erfolgreich hochgeladen.",
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Der Upload ist fehlgeschlagen.";

      setStatus({
        kind: "error",
        message,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-3">
        <label htmlFor="cv" className="text-sm font-medium text-[#4f503f]">
          Lebenslauf als PDF
        </label>
        <input
          ref={fileInputRef}
          id="cv"
          name="cv"
          type="file"
          accept="application/pdf"
          required
          className="block w-full cursor-pointer rounded-3xl border border-[#d7cbac] bg-[#fcf8ef] px-4 py-4 text-sm text-[#5b5a48] file:mr-4 file:rounded-full file:border-0 file:bg-[#6d7a49] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[#f8f3e3] hover:border-[#cdbf99] focus:outline-none focus:ring-2 focus:ring-[#7b8750]/40"
        />
        <p className="text-xs leading-5 text-[#7a745f]">
          Nur PDF-Dateien, bis 10 MB. Die Datei wird lokal im uploads-Verzeichnis gespeichert und optional mit der Session verknüpft.
        </p>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex w-full items-center justify-center rounded-full bg-[#6d7a49] px-5 py-3 text-sm font-semibold text-[#f8f3e3] transition hover:bg-[#5f6b40] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Upload läuft..." : "PDF hochladen"}
      </button>

      {status.kind !== "idle" ? (
        <div
          className={`rounded-3xl border px-4 py-3 text-sm ${status.kind === "success"
            ? "border-[#9bb07b] bg-[#edf3e2] text-[#4f6031]"
            : "border-[#d8a4a4] bg-[#faecec] text-[#8b4343]"
            }`}
        >
          {status.message}
        </div>
      ) : null}
    </form>
  );
}