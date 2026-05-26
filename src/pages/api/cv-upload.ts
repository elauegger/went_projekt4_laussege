import fs from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

import multer from "multer";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

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

async function getUserFromCookies(req: UploadRequest): Promise<string | null> {
  try {
    const cookies = req.headers.cookie;
    if (!cookies) return null;

    // Parse cookies to find better-auth session token
    const cookieObj = Object.fromEntries(
      cookies.split("; ").map((c) => {
        const [key, ...val] = c.split("=");
        return [key, val.join("=")];
      })
    );

    const sessionToken = cookieObj["better-auth.session_token"];
    if (!sessionToken) return null;

    // Get session from database
    const session = await prisma.session.findUnique({
      where: { token: sessionToken },
      include: { user: true },
    });

    return session?.userId || null;
  } catch (error) {
    console.error("Error getting user from cookies:", error);
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

  const uploadsDir = path.join(process.cwd(), "uploads");
  await fs.mkdir(uploadsDir, { recursive: true });

  const safeBaseName = sanitizeFilename(originalName);
  const fileName = `${Date.now()}-${safeBaseName}-${randomUUID().slice(0, 8)}.pdf`;
  const filePath = path.join(uploadsDir, fileName);

  await fs.writeFile(filePath, uploadedFile.buffer);

  // Try to get user from session for optional authentication
  let cvRecord = null;
  try {
    const userId = await getUserFromCookies(req);
    if (userId) {
      // Get or create myusers record for this user
      let myUser = await prisma.myusers.findUnique({
        where: { id: userId },
      });

      if (!myUser) {
        myUser = await prisma.myusers.create({
          data: { id: userId, updatedAt: new Date() },
        });
      }

      // Create CV upload record
      cvRecord = await prisma.cv_uploads.create({
        data: {
          myUserId: userId,
          originalFilename: originalName,
          fileType: "application/pdf",
          fileUrl: `/uploads/${fileName}`,
          storageKey: fileName,
          fileSizeBytes: BigInt(uploadedFile.buffer.length),
        },
      });
    }
  } catch (dbError) {
    console.error("Database error while saving CV record:", dbError);
    // Continue with file-only save if DB fails
  }

  return res.status(201).json({
    success: true,
    message: cvRecord
      ? "PDF erfolgreich hochgeladen und in der Datenbank gespeichert."
      : "PDF erfolgreich hochgeladen.",
    fileName,
    filePath: `/uploads/${fileName}`,
    ...(cvRecord && { cvId: cvRecord.id }),
  });
}