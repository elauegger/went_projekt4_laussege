import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { prisma } from "../../lib/prisma";
import { auth } from "../../lib/auth";
import { updateProfileAction } from "../actions/auth";
import { changePasswordAction } from "../actions/auth";

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
          <h1 className="mt-3 font-serif text-4xl text-[#4d5240]">
            Hallo {displayName}
          </h1>
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
                  className="rounded-2xl border border-[#e4dabc] bg-white/70 p-4"
                >
                  <p className="text-sm font-medium text-[#4f5341]">
                    {cv.originalFilename}
                  </p>

                  <div className="mt-2 space-y-1 text-xs text-[#7c765d]">
                    <p>Typ: {cv.fileType}</p>
                    <p>Größe: {Math.round(Number(cv.fileSizeBytes) / 1024)} KB</p>
                  </div>

                  <a
                    href={cv.fileUrl}
                    target="_blank"
                    className="mt-3 inline-block text-sm text-[#74824a] underline"
                  >
                    Öffnen
                  </a>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

      </div>
    </main>
  );
}