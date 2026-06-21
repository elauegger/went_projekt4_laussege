import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { auth } from '../../../lib/auth';
import { prisma } from '../../../lib/prisma';

async function getUserId() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session?.user?.id;
}

export async function GET() {
  const userId = await getUserId();

  if (!userId) {
    return NextResponse.json({ favorites: [] });
  }

  const favorites = await prisma.saved_jobs.findMany({
    where: { userId },
    select: { jobId: true },
  });

  return NextResponse.json({
    favorites: favorites.map((favorite) => favorite.jobId),
  });
}

export async function POST(request: Request) {
  const userId = await getUserId();

  if (!userId) {
    return NextResponse.json({ message: 'Nicht angemeldet' }, { status: 401 });
  }

  const { jobId } = await request.json();

  if (!jobId || typeof jobId !== 'string') {
    return NextResponse.json({ message: 'jobId fehlt' }, { status: 400 });
  }

  await prisma.saved_jobs.upsert({
    where: {
      userId_jobId: {
        userId,
        jobId,
      },
    },
    update: {},
    create: {
      userId,
      jobId,
    },
  });

  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  const userId = await getUserId();

  if (!userId) {
    return NextResponse.json({ message: 'Nicht angemeldet' }, { status: 401 });
  }

  const { jobId } = await request.json();

  if (!jobId || typeof jobId !== 'string') {
    return NextResponse.json({ message: 'jobId fehlt' }, { status: 400 });
  }

  await prisma.saved_jobs.deleteMany({
    where: {
      userId,
      jobId,
    },
  });

  return NextResponse.json({ success: true });
}