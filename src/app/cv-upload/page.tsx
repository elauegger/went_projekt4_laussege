import Link from "next/link";

import { CvUploadForm } from "../../components/cv-upload-form";

export const metadata = {
  title: "CV Upload",
  description: "PDF-Lebenslauf lokal hochladen und speichern.",
};

export default function CvUploadPage() {
  return (
    <main
      className="min-h-screen px-4 py-6 text-stone-900 sm:px-6 sm:py-8 lg:px-8 flex items-center justify-center"
      style={{
        backgroundImage:
          "radial-gradient(circle at 18% 12%, rgba(122, 139, 79, 0.22), transparent 28%), radial-gradient(circle at 82% 20%, rgba(233, 217, 114, 0.35), transparent 16%), linear-gradient(180deg, #f6f0e1 0%, #ede2c7 46%, #f7f2e7 100%)",
      }}
    >
      <section className="w-full max-w-3xl rounded-4xl border border-[#dbcfae] bg-[#fbf7ee]/90 p-6 shadow-[0_18px_70px_rgba(115,102,64,0.14)] backdrop-blur-sm sm:p-8 lg:p-9">
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

            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full border border-[#cfc39f] bg-[#efe6cc] px-4 py-2 text-sm font-medium text-[#5b5a47] transition hover:bg-[#e8dcba]"
            >
              Zur Startseite
            </Link>
          </div>

          <div className="rounded-4xl border border-[#e2d7bb] bg-white/70 p-6 sm:p-7">
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
        </div>
      </section>
    </main>
  );
}