import { prisma } from "./prisma";

type SavedJobsDelegate = {
  findMany: (args: {
    where: { userId: string };
    orderBy?: { createdAt: "desc" };
    select: { jobId: true };
  }) => Promise<Array<{ jobId: string }>>;
  findUnique: (args: {
    where: { userId_jobId: { userId: string; jobId: string } };
    select: { id: true };
  }) => Promise<{ id: string } | null>;
  upsert: (args: {
    where: { userId_jobId: { userId: string; jobId: string } };
    update: Record<string, never>;
    create: { userId: string; jobId: string };
  }) => Promise<unknown>;
  deleteMany: (args: {
    where: { userId: string; jobId: string };
  }) => Promise<unknown>;
};

export class SavedJobsStorageError extends Error {
  constructor() {
    super("Saved jobs storage is not available.");
  }
}

const getDelegate = () =>
  (prisma as unknown as { saved_jobs?: SavedJobsDelegate }).saved_jobs;

const isMissingStorageError = (error: unknown) => {
  if (error instanceof SavedJobsStorageError) return true;

  const maybeError = error as { code?: string; message?: string } | undefined;
  return (
    maybeError?.code === "P2021" ||
    maybeError?.message?.includes("saved_jobs") ||
    maybeError?.message?.includes("Cannot read properties of undefined")
  );
};

const requireDelegate = () => {
  const delegate = getDelegate();

  if (!delegate) {
    throw new SavedJobsStorageError();
  }

  return delegate;
};

export async function getSavedJobIds(userId: string, ordered = false) {
  try {
    const favorites = await requireDelegate().findMany({
      where: { userId },
      ...(ordered ? { orderBy: { createdAt: "desc" as const } } : {}),
      select: { jobId: true },
    });

    return favorites.map((favorite) => favorite.jobId);
  } catch (error) {
    if (isMissingStorageError(error)) return [];
    throw error;
  }
}

export async function isSavedJob(userId: string, jobId: string) {
  try {
    const favorite = await requireDelegate().findUnique({
      where: {
        userId_jobId: {
          userId,
          jobId,
        },
      },
      select: { id: true },
    });

    return Boolean(favorite);
  } catch (error) {
    if (isMissingStorageError(error)) return false;
    throw error;
  }
}

export async function saveJob(userId: string, jobId: string) {
  try {
    await requireDelegate().upsert({
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
  } catch (error) {
    if (isMissingStorageError(error)) throw new SavedJobsStorageError();
    throw error;
  }
}

export async function deleteSavedJob(userId: string, jobId: string) {
  try {
    await requireDelegate().deleteMany({
      where: {
        userId,
        jobId,
      },
    });
  } catch (error) {
    if (isMissingStorageError(error)) throw new SavedJobsStorageError();
    throw error;
  }
}

export function isSavedJobsStorageError(error: unknown) {
  return isMissingStorageError(error);
}
