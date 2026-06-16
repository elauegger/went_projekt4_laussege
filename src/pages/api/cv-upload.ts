import fs from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import type { IncomingHttpHeaders } from "node:http";

import multer from "multer";
import { PDFParse } from "pdf-parse";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/prisma";
import { auth } from "../../lib/auth";
import { analyzeCV } from "../../lib/cv-analysis";

type UploadRequest = NextApiRequest & {
  file?: {
    originalname: string;
    mimetype: string;
    buffer: Buffer;
  };
};

export const config = {
  api: {
    bodyParser: false,
  },
};

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    files: 1,
    fileSize: 10 * 1024 * 1024,
  },
});

const uploadSingle = upload.single("cv");

function runMiddleware(req: UploadRequest, res: NextApiResponse) {
  return new Promise<void>((resolve, reject) => {
    uploadSingle(req as any, res as any, (error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });
}

function sanitizeFilename(originalName: string) {
  const baseName = path
    .parse(originalName)
    .name.normalize("NFKD")
    .replace(/[^a-zA-Z0-9-_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

  return baseName || "cv";
}

function isPdfBuffer(buffer: Buffer) {
  return buffer.length >= 4 && buffer.subarray(0, 4).toString("utf8") === "%PDF";
}

function normalizeExtractedText(text: string) {
  return text
    .replace(/\u0000/g, "")
    .replace(/\r\n?/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

async function extractPdfText(buffer: Buffer) {
  const parser = new PDFParse({ data: buffer });
  try {
    const parsed = await parser.getText();
    return normalizeExtractedText(parsed.text ?? "");
  } finally {
    await parser.destroy().catch(() => undefined);
  }
}

function toHeaders(headers: IncomingHttpHeaders): Headers {
  const normalized = new Headers();

  for (const [key, value] of Object.entries(headers)) {
    if (typeof value === "string") {
      normalized.set(key, value);
      continue;
    }

    if (Array.isArray(value)) {
      normalized.set(key, value.join(", "));
    }
  }

  return normalized;
}

async function getUserFromCookies(req: UploadRequest): Promise<string | null> {
  try {
    const session = await auth.api.getSession({
      headers: toHeaders(req.headers),
    });

    return session?.user?.id ?? null;
  } catch (error) {
    console.error("Error getting user from session:", error);
    return null;
  }
}

export default async function handler(
  req: UploadRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({
      success: false,
      error: "Method not allowed. Use POST for PDF uploads.",
    });
  }

  try {
    await runMiddleware(req, res);
  } catch (error) {
    if (error instanceof multer.MulterError) {
      if (error.code === "LIMIT_FILE_SIZE") {
        return res.status(413).json({
          success: false,
          error: "Die PDF ist zu groß. Maximal erlaubt sind 10 MB.",
        });
      }

      return res.status(400).json({
        success: false,
        error: "Ungültiger Upload. Bitte eine einzelne PDF-Datei senden.",
      });
    }

    console.error("CV upload parsing failed:", error);
    return res.status(500).json({
      success: false,
      error: "Der Upload konnte nicht verarbeitet werden.",
    });
  }

  const uploadedFile = req.file;

  if (!uploadedFile) {
    return res.status(400).json({
      success: false,
      error: "Keine Datei empfangen. Bitte eine PDF-Datei auswählen.",
    });
  }

  const originalName = uploadedFile.originalname || "cv.pdf";
  const hasPdfExtension = path.extname(originalName).toLowerCase() === ".pdf";
  const isPdfMimeType = uploadedFile.mimetype === "application/pdf";

  if (!hasPdfExtension || !isPdfMimeType) {
    return res.status(415).json({
      success: false,
      error: "Nur PDF-Dateien sind erlaubt.",
    });
  }

  if (!isPdfBuffer(uploadedFile.buffer)) {
    return res.status(415).json({
      success: false,
      error: "Die Datei scheint keine gültige PDF-Datei zu sein.",
    });
  }

  let extractedText = "";

  try {
    extractedText = await extractPdfText(uploadedFile.buffer);
  } catch (error) {
    console.error("PDF extraction failed:", error);
    return res.status(422).json({
      success: false,
      error: "PDF konnte nicht gelesen werden. Bitte eine intakte PDF-Datei hochladen.",
    });
  }

  if (!extractedText) {
    return res.status(422).json({
      success: false,
      error: "Es konnte kein auswertbarer Text aus der PDF extrahiert werden.",
    });
  }

  let analysis = null;

  try {
    analysis = await analyzeCV(extractedText);
  } catch (error) {
    console.error("AI analysis failed:", error);
  }

  const uploadsDir = path.join(process.cwd(), "uploads");
  await fs.mkdir(uploadsDir, { recursive: true });

  const safeBaseName = sanitizeFilename(originalName);
  const fileName = `${Date.now()}-${safeBaseName}-${randomUUID().slice(0, 8)}.pdf`;
  const filePath = path.join(uploadsDir, fileName);

  await fs.writeFile(filePath, uploadedFile.buffer);

  const userId = await getUserFromCookies(req);
  const fileUrl = `/uploads/${fileName}`;

  try {
    await prisma.cv_uploads.create({
      data: {
        userId,
        originalFilename: originalName,
        fileType: uploadedFile.mimetype,
        fileUrl,
        storageKey: fileName,
        fileSizeBytes: BigInt(uploadedFile.buffer.length),
        extractedText,
      },
    });
  } catch (error) {
    console.error("Failed to write cv_uploads metadata:", error);

    return res.status(201).json({
      success: true,
      message:
        "PDF hochgeladen. Hinweis: Der Datenbank-Eintrag konnte nicht gespeichert werden.",
      metadataSaved: false,
      extractedText,
      analysis,
      fileName,
      filePath: fileUrl,
    });
  }

  return res.status(201).json({
    success: true,
    message: "PDF erfolgreich hochgeladen.",
    metadataSaved: true,
    extractedText,
    analysis,
    fileName,
    filePath: fileUrl,
  });
}