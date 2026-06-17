import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

import { prisma } from "../../../lib/prisma";
import { auth } from "../../../lib/auth";
import { extractTextFromPDF } from "../../../lib/pdf-extract";

export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return NextResponse.json(
      { success: false, error: "Du musst angemeldet sein." },
      { status: 401 }
    );
  }

  const uploads = await prisma.cv_uploads.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json({ success: true, uploads });
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    console.log("CV_UPLOAD_SESSION:", session?.user?.id);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Du musst angemeldet sein." },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("cv");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { success: false, error: "Keine PDF-Datei hochgeladen." },
        { status: 400 }
      );
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { success: false, error: "Nur PDF-Dateien sind erlaubt." },
        { status: 400 }
      );
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: "Die Datei darf maximal 10 MB groß sein." },
        { status: 400 }
      );
    }

    const uploadDir = path.join(process.cwd(), "uploads");
    await mkdir(uploadDir, { recursive: true });

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const storageKey = `${randomUUID()}-${safeName}`;
    const absolutePath = path.join(uploadDir, storageKey);

    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(absolutePath, buffer);

    // Extract text from PDF
    let extractedText = "";
    try {
      extractedText = await extractTextFromPDF(buffer);
    } catch (error) {
      console.error("PDF text extraction error:", error);
      // Continue without extracted text - this is not fatal
    }

    const fileUrl = `/api/cv-upload/${storageKey}/file`;

    const savedUpload = await prisma.cv_uploads.create({
      data: {
        userId: session.user.id,
        originalFilename: file.name,
        fileType: file.type,
        fileUrl,
        storageKey,
        fileSizeBytes: BigInt(file.size),
        extractedText: extractedText || null,
      },
    });

    return NextResponse.json({
      success: true,
      message: "PDF wurde gespeichert.",
      cvId: savedUpload.id,
      userId: savedUpload.userId,
      fileUrl: savedUpload.fileUrl,
    });
  } catch (error) {
    console.error("CV_UPLOAD_ERROR:", error);

    return NextResponse.json(
      { success: false, error: "Upload konnte nicht gespeichert werden." },
      { status: 500 }
    );
  }
}