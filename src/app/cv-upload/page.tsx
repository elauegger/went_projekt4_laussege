import Link from "next/link";
import { headers } from "next/headers";

import { CvUploadForm } from "../../components/cv-upload-form";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { SiteFooter } from "../../components/SiteFooter";


export const metadata = {
  title: "CV Upload",
  description: "PDF-Lebenslauf lokal hochladen und speichern.",
};

function formatBytes(bytes: bigint) {
  const mb = Number(bytes) / 1024 / 1024;
  return `${mb.toFixed(2)} MB`;
}

export default async function CvUploadPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const cvs = session?.user
    ? await prisma.cv_uploads.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        originalFilename: true,
        storageKey: true,
        fileSizeBytes: true,
        createdAt: true,
      },
    })
    : [];

  return (
    <div>
    <main
      className="min-h-screen px-4 py-6 text-stone-900 sm:px-6 sm:py-8 lg:px-8 flex items-center justify-center"
      style={{
        backgroundImage:
          "radial-gradient(circle at 18% 12%, rgba(122, 139, 79, 0.22), transparent 28%), radial-gradient(circle at 82% 20%, rgba(233, 217, 114, 0.35), transparent 16%), linear-gradient(180deg, #f6f0e1 0%, #ede2c7 46%, #f7f2e7 100%)",
      }}
    >
      <section className="w-full max-w-6xl rounded-4xl border border-[#dbcfae] bg-[#fbf7ee]/90 p-6 shadow-[0_18px_70px_rgba(115,102,64,0.14)] backdrop-blur-sm sm:p-8 lg:p-9">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4 border-b border-[#e3d8bd] pb-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="max-w-2xl">
              <p className="text-[10px] font-semibold uppercase tracking-[0.45em] text-[#83905b]">
                Jobsy
              </p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#4f503f] sm:text-4xl">
                Lebenslauf als PDF hochladen
              </h1>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link
                href="/ai-analysis"
                className="inline-flex items-center justify-center rounded-full bg-[#74824a] px-4 py-2 text-sm font-medium text-[#f8f3e3] transition hover:bg-[#65743f]"
              >
                Zur Analyse
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-full border border-[#cfc39f] bg-[#efe6cc] px-4 py-2 text-sm font-medium text-[#5b5a47] transition hover:bg-[#e8dcba]"
              >
                Zur Startseite
              </Link>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2 lg:items-stretch">
            <div className="flex h-full flex-col rounded-4xl border border-[#e2d7bb] bg-white/70 p-6 sm:p-7">
              <div className="mb-6 flex items-center justify-between gap-4">
                <h2 className="text-xl font-semibold text-[#534f3f]">
                  Datei auswählen und senden
                </h2>
                <div className="rounded-full border border-[#ded2ad] bg-[#f6efda] px-3 py-1 text-xs font-medium text-[#746f5a]">
                  max. 10 MB
                </div>
              </div>

              <CvUploadForm />
            </div>

            <div className="flex h-full flex-col rounded-4xl border border-[#e2d7bb] bg-white/70 p-6 sm:p-7">
              <div className="mb-6 flex items-center justify-between gap-4">
                <h2 className="text-xl font-semibold text-[#534f3f]">
                  Vergangene CV
                </h2>
                <div className="rounded-full border border-[#ded2ad] bg-[#f6efda] px-3 py-1 text-xs font-medium text-[#746f5a]">
                  {cvs.length} Einträge
                </div>
              </div>

              {!session?.user ? (
                <div className="flex h-full items-center justify-center rounded-3xl border border-dashed border-[#d9ccb1] bg-[#faf5e9] p-6 text-center">
                  <p className="text-sm text-[#6f6a58]">
                    Bitte anmelden, um vergangene Uploads als Links zu sehen.
                  </p>
                </div>
              ) : cvs.length === 0 ? (
                <div className="flex h-full items-center justify-center rounded-3xl border border-dashed border-[#d9ccb1] bg-[#faf5e9] p-6 text-center">
                  <p className="text-sm text-[#6f6a58]">
                    Noch keine vergangenen Uploads vorhanden.
                  </p>
                </div>
              ) : (
                <div className="h-70 max-h-900 space-y-4 overflow-y-auto pr-1">
                  {cvs.map((cv) => (
                    <div
                      key={cv.id}
                      className="rounded-3xl border border-[#e2d7bb] bg-white/75 p-5"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h3 className="truncate text-sm font-semibold text-[#4f5341]" title={cv.originalFilename}>
                            {cv.originalFilename}
                          </h3>
                          <p className="mt-1 text-sm text-[#7a745f]">
                            Hochgeladen am {cv.createdAt.toLocaleDateString("de-AT")} · {formatBytes(cv.fileSizeBytes)}
                          </p>
                        </div>

                        <a
                          href={`/api/cv-upload/${cv.storageKey}/file`}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-full border border-[#cfc39f] bg-[#efe6cc] px-4 py-2 text-sm font-medium text-[#5b5a47] transition hover:bg-[#e8dcba]"
                        >
                          PDF öffnen
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      
    </main>
    <SiteFooter/>
    </div>
  );
}
