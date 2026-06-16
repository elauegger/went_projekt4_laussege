import Link from "next/link";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

import { prisma } from "../../lib/prisma";
import { auth } from "../../lib/auth";

export const metadata = {
  title: "Meine Lebensläufe",
};

function formatBytes(bytes: bigint) {
  const mb = Number(bytes) / 1024 / 1024;
  return `${mb.toFixed(2)} MB`;
}

export default async function MyCvsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    redirect("/signin");
  }

  const uploads = await prisma.cv_uploads.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="min-h-screen bg-[#f6f0e1] px-6 py-10 text-[#4f503f]">
      <section className="mx-auto max-w-4xl rounded-4xl border border-[#dbcfae] bg-[#fbf7ee] p-8 shadow-lg">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#83905b]">
              Jobsy
            </p>
            <h1 className="mt-3 text-3xl font-semibold">Meine Lebensläufe</h1>
          </div>

          <Link
            href="/cv-upload"
            className="rounded-full bg-[#6d7a49] px-5 py-3 text-sm font-semibold text-white"
          >
            Neuer Upload
          </Link>
        </div>

        {uploads.length === 0 ? (
          <div className="rounded-3xl border border-[#e2d7bb] bg-white/70 p-6">
            Noch keine Lebensläufe hochgeladen.
          </div>
        ) : (
          <div className="space-y-4">
            {uploads.map((upload) => (
              <div
                key={upload.id}
                className="rounded-3xl border border-[#e2d7bb] bg-white/75 p-5"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="font-semibold">
                      {upload.originalFilename}
                    </h2>
                    <p className="mt-1 text-sm text-[#7a745f]">
                      Hochgeladen am{" "}
                      {upload.createdAt.toLocaleDateString("de-AT")} ·{" "}
                      {formatBytes(upload.fileSizeBytes)}
                    </p>
                  </div>

                  <a
                    href={`/api/cv-upload/${upload.storageKey}/file`}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-[#cfc39f] bg-[#efe6cc] px-4 py-2 text-sm font-medium"
                  >
                    PDF öffnen
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}