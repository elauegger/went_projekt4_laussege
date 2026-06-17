import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Trash2 } from "lucide-react";

import { prisma } from "../../lib/prisma";
import { auth } from "../../lib/auth";
import {
  changePasswordAction,
  deleteCvUploadAction,
  updateProfileAction,
} from "../actions/auth";

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[28px] border border-[#e5dcc1] bg-white/75 p-6 shadow-[0_14px_40px_rgba(116,101,65,0.07)] backdrop-blur">
      <div className="mb-5 flex items-center gap-4">
        <h2 className="text-xs font-semibold uppercase tracking-[0.35em] text-[#8a8467]">
          {title}
        </h2>
        <span className="h-px flex-1 bg-[#e8dec4]" />
      </div>
      {children}
    </section>
  );
}

export default async function ProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/signin");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    include: {
      cvUploads: true,
    },
  });

  if (!user) {
    redirect("/signin");
  }

  const displayName = user.name?.split(" ")[0] ?? "User";

  return (
    <main className="min-h-screen px-4 py-6 text-[#2f3628] sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl space-y-6">

        {/* HEADER */}
        <div className="rounded-[36px] border border-[#d9ceb1] bg-[#f6f0e6] p-8 shadow-[0_24px_90px_rgba(98,87,55,0.14)]">
          <p className="text-[10px] uppercase tracking-[0.42em] text-[#8d8667]">
            Profilbereich
          </p>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <h1 className="font-serif text-4xl text-[#4d5240]">
              Hallo {displayName}
            </h1>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/ai-analysis"
                className="rounded-full border border-[#d6caa9] bg-[#e8f0d4] px-4 py-2 text-xs font-semibold text-[#6e7456] transition hover:bg-[#dce8c4]"
              >
                KI-Analyse
              </Link>
              <Link
                href="/"
                className="rounded-full border border-[#d6caa9] bg-[#f9f4e7] px-4 py-2 text-xs font-semibold text-[#6e7456] transition hover:bg-[#f3ecd9]"
              >
                Zurück zu Home
              </Link>
            </div>
          </div>
          <p className="mt-3 text-sm text-[#6f6a58]">
            Hier kannst du deine Daten verwalten, dein Profil bearbeiten und deine Lebensläufe einsehen.
          </p>
        </div>

        {/* GRID */}
        <div className="grid gap-6 lg:grid-cols-2">

          {/* USER INFO */}
          <SectionCard title="Benutzerinformationen">
            <div className="space-y-3 text-sm text-[#4f5341]">
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p>
                <strong>Email verifiziert:</strong>{" "}
                {user.emailVerified ? "Ja" : "Nein"}
              </p>
              <p>
                <strong>Erstellt am:</strong>{" "}
                {user.createdAt.toLocaleDateString()}
              </p>
            </div>
          </SectionCard>

          {/* EDIT PROFILE */}
          <SectionCard title="Profil bearbeiten">
            <form action={updateProfileAction} className="space-y-4">
              <div>
                <label className="text-xs uppercase tracking-[0.25em] text-[#8a8467]">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  defaultValue={user.name}
                  className="mt-2 w-full rounded-2xl border border-[#e3d7bc] bg-white/70 px-4 py-3 text-sm text-[#4f5341] outline-none focus:border-[#9aa56a]"
                />
              </div>

              <button
                type="submit"
                className="rounded-full bg-[#74824a] px-5 py-2.5 text-sm font-semibold text-[#f8f3e3] shadow-sm transition hover:bg-[#65743f]"
              >
                Änderungen speichern
              </button>
            </form>
          </SectionCard>
          {/* PASSWORD CHANGE */}
          <SectionCard title="Passwort ändern">
            <form action={changePasswordAction} className="space-y-4">

              <div>
                <label className="text-xs uppercase tracking-[0.25em] text-[#8a8467]">
                  Aktuelles Passwort
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  className="mt-2 w-full rounded-2xl border border-[#e3d7bc] bg-white/70 px-4 py-3 text-sm"
                  required
                />
              </div>

              <div>
                <label className="text-xs uppercase tracking-[0.25em] text-[#8a8467]">
                  Neues Passwort
                </label>
                <input
                  type="password"
                  name="newPassword"
                  className="mt-2 w-full rounded-2xl border border-[#e3d7bc] bg-white/70 px-4 py-3 text-sm"
                  required
                />
              </div>

              <button
                type="submit"
                className="rounded-full bg-[#74824a] px-5 py-2.5 text-sm font-semibold text-[#f8f3e3] hover:bg-[#65743f]"
              >
                Passwort aktualisieren
              </button>
            </form>
          </SectionCard>
        </div>

        {/* CV SECTION */}
        <SectionCard title="Meine Lebensläufe">
          {user.cvUploads.length === 0 ? (
            <p className="text-sm text-[#6f6a58]">
              Keine CVs hochgeladen.
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {user.cvUploads.map((cv) => (
                <div
                  key={cv.id}
                  className="relative rounded-2xl border border-[#e4dabc] bg-white/70 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-[#4f5341]">
                        {cv.originalFilename}
                      </p>
                    </div>
                    <form action={deleteCvUploadAction} className="shrink-0">
                      <input type="hidden" name="cvId" value={cv.id} />
                      <button
                        type="submit"
                        className="rounded-full border border-[#e8a5a5] bg-[#fef2f2] p-1.5 text-[#d32f2f] transition hover:bg-[#ffe8e8]"
                        title="Lebenslauf löschen"
                      >
                        <Trash2 size={16} />
                      </button>
                    </form>
                  </div>

                  <div className="mt-3 space-y-1 text-xs text-[#7c765d]">
                    <p>Typ: {cv.fileType}</p>
                    <p>Größe: {Math.round(Number(cv.fileSizeBytes) / 1024)} KB</p>
                  </div>

                  <div className="mt-3">
                    <a
                      href={cv.fileUrl}
                      target="_blank"
                      className="text-sm text-[#74824a] underline"
                    >
                      Öffnen
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

      </div>
    </main>
  );
}