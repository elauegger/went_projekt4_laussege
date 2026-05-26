import Link from "next/link";

import { CvUploadForm } from "@/components/cv-upload-form";

export const metadata = {
  title: "CV Upload",
  description: "PDF-Lebenslauf lokal hochladen und speichern.",
};

const palette = ["#F5E9CF", "#D8C9A5", "#A7AE7A", "#6E7B47", "#E9D972"];

const highlights = [
  "PDF only",
  "Datei lokal speichern",
  "Metadaten in DB",
  "Unique Filename",
];

export default function CvUploadPage() {
  return (
    <main
      className="min-h-screen px-4 py-6 text-stone-900 sm:px-6 lg:px-8"
      style={{
        backgroundImage:
          "radial-gradient(circle at 18% 12%, rgba(122, 139, 79, 0.22), transparent 28%), radial-gradient(circle at 82% 20%, rgba(233, 217, 114, 0.35), transparent 16%), linear-gradient(180deg, #f6f0e1 0%, #ede2c7 46%, #f7f2e7 100%)",
      }}
    >
      <div className="mx-auto grid min-h-screen w-full max-w-7xl items-center gap-6 py-4 lg:grid-cols-[320px_minmax(0,1fr)] lg:py-10">
        <aside className="overflow-hidden rounded-4xl border border-[#d2c59e] bg-[#6d7a49] text-[#f7f1de] shadow-[0_18px_60px_rgba(92,83,50,0.18)]">
          <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
            <div>
              <p className="text-[10px] uppercase tracking-[0.42em] text-[#efe3bf]/80">
                Jobsy
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                CV Upload
              </h2>
            </div>
            <Link
              href="/"
              className="rounded-full border border-white/20 px-3 py-1.5 text-xs font-medium text-[#fbf7ea] transition hover:bg-white/10"
            >
              Home
            </Link>
          </div>

          <div className="border-b border-white/10 px-6 py-6">
            <p className="text-sm leading-6 text-[#f5edd4]">
              Lade deinen Lebenslauf in einer ruhigen Editorial-Oberfläche hoch.
              Die Datei landet lokal im Upload-Verzeichnis und wird bei Session
              auch mit dem Nutzer verknüpft.
            </p>

            <div className="mt-5 grid grid-cols-2 gap-3">
              {highlights.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/15 bg-white/8 px-3 py-3 text-xs font-medium text-[#fbf7ea]"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="px-6 py-6">
            <div className="rounded-3xl border border-white/10 bg-[#7b8750] p-4 shadow-inner shadow-black/10">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-[0.35em] text-[#f5edd4]/70">
                  Palette
                </span>
                <span className="text-xs text-[#f5edd4]/80">TV-1</span>
              </div>

              <div className="flex gap-2">
                {palette.map((color) => (
                  <span
                    key={color}
                    className="h-10 flex-1 rounded-2xl border border-white/10"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>

              <div className="mt-5 rounded-2xl bg-[#f5edd6] p-4 text-[#6a6a52]">
                <p className="text-[10px] uppercase tracking-[0.35em] text-[#8a8469]">
                  Upload flow
                </p>
                <p className="mt-2 text-sm leading-6">
                  Klarer Fokus auf PDF, natürliche Farben und eine ruhige
                  Informationshierarchie.
                </p>
              </div>
            </div>
          </div>
        </aside>

        <section className="rounded-4xl border border-[#dbcfae] bg-[#fbf7ee]/90 p-5 shadow-[0_18px_70px_rgba(115,102,64,0.14)] backdrop-blur-sm sm:p-8 lg:p-10">
          <div className="mb-8 flex flex-col gap-4 border-b border-[#e3d8bd] pb-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="max-w-2xl">
              <p className="text-[10px] font-semibold uppercase tracking-[0.45em] text-[#83905b]">
                Lumiere / Upload Atelier
              </p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#4f503f] sm:text-4xl">
                Lebenslauf als PDF hochladen
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-6 text-[#6e6a59] sm:text-base">
                Die Seite ist bewusst editorial und ruhig gehalten: warme
                Flächen, viel Weißraum und ein Uploadbereich, der sich wie eine
                Karte aus einem Design-Board anfühlt.
              </p>
            </div>

            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full border border-[#cfc39f] bg-[#efe6cc] px-4 py-2 text-sm font-medium text-[#5b5a47] transition hover:bg-[#e8dcba]"
            >
              Zur Startseite
            </Link>
          </div>

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_260px]">
            <div className="rounded-4xl border border-[#e2d7bb] bg-white/70 p-5 sm:p-6">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#8a8469]">
                    Upload Panel
                  </p>
                  <h2 className="mt-2 text-xl font-semibold text-[#534f3f]">
                    Datei auswählen und senden
                  </h2>
                </div>
                <div className="rounded-full border border-[#ded2ad] bg-[#f6efda] px-3 py-1 text-xs font-medium text-[#746f5a]">
                  max. 10 MB
                </div>
              </div>

              <CvUploadForm />
            </div>

            <div className="grid gap-4">
              <div className="rounded-3xl border border-[#e2d7bb] bg-[#f5edd6] p-5 text-[#5f5a48]">
                <p className="text-[10px] uppercase tracking-[0.35em] text-[#8c8467]">
                  Checkpoints
                </p>
                <ul className="mt-4 space-y-3 text-sm leading-6">
                  <li>• Nur PDF-Dateien werden akzeptiert.</li>
                  <li>• Dateien bekommen eindeutige Namen.</li>
                  <li>• Optionaler DB-Eintrag bei Session vorhanden.</li>
                </ul>
              </div>

              <div className="rounded-3xl border border-[#e2d7bb] bg-[#6d7a49] p-5 text-[#f8f3e3]">
                <p className="text-[10px] uppercase tracking-[0.35em] text-[#f1e2ba]/75">
                  Flow
                </p>
                <div className="mt-4 space-y-3 text-sm leading-6 text-[#f4ecd0]">
                  <p>1. Datei wählen</p>
                  <p>2. Upload senden</p>
                  <p>3. Statusmeldung lesen</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}