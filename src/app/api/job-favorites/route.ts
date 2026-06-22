import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { auth } from '../../../lib/auth';
import {
  deleteSavedJob,
  getSavedJobIds,
  isSavedJobsStorageError,
  saveJob,
} from '../../../lib/saved-jobs';

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

  return NextResponse.json({
    favorites: await getSavedJobIds(userId),
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

  try {
    await saveJob(userId, jobId);
  } catch (error) {
    if (isSavedJobsStorageError(error)) {
      return NextResponse.json(
        { message: 'Job-Favoriten sind in der Datenbank noch nicht eingerichtet.' },
        { status: 503 },
      );
    }

    throw error;
  }

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

  try {
    await deleteSavedJob(userId, jobId);
  } catch (error) {
    if (isSavedJobsStorageError(error)) {
      return NextResponse.json(
        { message: 'Job-Favoriten sind in der Datenbank noch nicht eingerichtet.' },
        { status: 503 },
      );
    }

    throw error;
  }

  return NextResponse.json({ success: true });
}
