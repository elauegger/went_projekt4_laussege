import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { readFile } from "fs/promises";
import path from "path";

import { prisma } from "../../../../../lib/prisma";
import { auth } from "../../../../../lib/auth";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Du musst angemeldet sein." },
      { status: 401 }
    );
  }

  const { id } = await context.params;

  const upload = await prisma.cv_uploads.findFirst({
    where: {
      storageKey: id,
      userId: session.user.id,
    },
  });

  if (!upload) {
    return NextResponse.json(
      { error: "PDF wurde nicht gefunden." },
      { status: 404 }
    );
  }

  const filePath = path.join(process.cwd(), "uploads", upload.storageKey);
  const file = await readFile(filePath);

  return new NextResponse(file, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${upload.originalFilename}"`,
    },
  });
}