import Image from "next/image";
import Link from "next/link";

import { signUpAction } from "../actions/auth";
import { PasswordInput } from "../../components/PasswordInput";
import TurnstileWidget from "../../components/turnstile-widget";

type SearchParams = Record<string, string | string[] | undefined>;

const getParam = (params: SearchParams | undefined, key: string) => {
  const value = params?.[key];
  return Array.isArray(value) ? value[0] : value;
};

const signUpErrorMessages: Record<string, string> = {
  missing_fields: "Bitte fülle E-Mail-Adresse, Benutzername und Passwort aus.",
  password_too_short: "Das Passwort muss mindestens 8 Zeichen lang sein.",
  username_whitespace: "Der Benutzername darf keine Leerzeichen enthalten.",
};

export default async function SignUpPage({
  searchParams,
}: {
  searchParams?: SearchParams | Promise<SearchParams>;
}) {
  const params = await searchParams;
  const errorKey = getParam(params, "error");
  const errorMessage = errorKey ? signUpErrorMessages[errorKey] : undefined;

  return (
    <main className="min-h-screen px-4 py-4 text-[var(--color-ink)] sm:px-6 sm:py-6 lg:px-10 bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage: "url('/handshake1.png')",
      }}>
      <div className="mx-auto w-3/4 lg:w-1/2">
        <section className="rounded-[32px] border border-[var(--color-line)] bg-white/60 p-8 shadow-[0_20px_60px_rgba(92,83,50,0.14)] backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.4em] text-[var(--color-muted)]">
                Sign up
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-[#4c4a3c]">
                Neues Konto anlegen
              </h2>
            </div>
            {/* <Link
              href="/signin"
              className="rounded-full border border-[var(--color-line)] bg-[var(--color-surface-strong)] px-4 py-2 text-xs font-semibold text-[var(--color-olive-strong)]"
            >
              Zum Login
            </Link> */}
          </div>

          <form action={signUpAction} className="mt-8 space-y-5">
            {errorMessage ? (
              <div
                className="rounded-2xl border border-[#e8a5a5] bg-[#fff4f1] px-4 py-3 text-sm text-[#9f2f24]"
                role="alert"
              >
                {errorMessage}
              </div>
            ) : null}

            <div className="space-y-2">
              <label className="text-sm font-medium text-[#4f503f]" htmlFor="name">
                Benutzername <span className="text-[#d32f2f]">*</span>
              </label>
              <input
                id="name"
                type="text"
                name="name"
                placeholder="deinbenutzername"
                required
                autoComplete="username"
                pattern={"\\S+"}
                aria-required="true"
                aria-label="Benutzername"
                aria-describedby="username-help"
                className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 text-sm text-[#5b5a48] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#7b8750]/40"
              />
              <p id="username-help" className="text-xs text-[#7a745f]">
                Ohne Leerzeichen.
              </p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#4f503f]" htmlFor="email">
                Email <span className="text-[#d32f2f]">*</span>
              </label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="name@beispiel.de"
                required
                autoComplete="email"
                aria-required="true"
                aria-label="Email-Adresse"
                className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 text-sm text-[#5b5a48] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#7b8750]/40"
              />
              <p className="text-xs text-[#7a745f]">Nutzen Sie eine gültige E-Mail-Adresse.</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#4f503f]" htmlFor="password">
                Passwort <span className="text-[#d32f2f]">*</span>
              </label>
              <PasswordInput
                id="password"
                name="password"
                placeholder="Mindestens 8 Zeichen"
                required
                minLength={8}
                autoComplete="new-password"
                aria-required="true"
                aria-label="Passwort"
                aria-describedby="password-help"
                className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 text-sm text-[#5b5a48] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#7b8750]/40"
              />
              <p id="password-help" className="text-xs text-[#7a745f]">Mindestens 8 Zeichen, mit Groß- und Kleinbuchstaben und Sonderzeichen empfohlen.</p>
            </div>

            <div role="region" aria-label="Verifizierung">
              <TurnstileWidget />
            </div>

            <button
              type="submit"
              className="w-full rounded-full bg-[var(--color-olive)] px-5 py-3 text-sm font-semibold text-[#f8f3e3] transition hover:bg-[var(--color-olive-strong)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              Sign Up
            </button>
          </form>

          <p className="mt-6 text-xs text-[var(--color-muted)]">
            Bereits registriert?{" "}
            <Link href="/signin" className="font-semibold text-[#5b5a47]">
              Jetzt anmelden
            </Link>
          </p>
        </section>

        {/* <section className="relative overflow-hidden rounded-[32px] border border-[var(--color-line)] bg-[var(--color-surface)] shadow-[0_24px_70px_rgba(92,83,50,0.16)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(125,138,98,0.22),transparent_40%),radial-gradient(circle_at_10%_0%,rgba(210,194,160,0.35),transparent_45%)]" />
          <div className="relative z-10 flex h-full flex-col justify-between gap-8 p-8">
            <div>
              <p className="text-[11px] uppercase tracking-[0.4em] text-[var(--color-muted)]">
                Profil
              </p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#3f4033] sm:text-4xl">
                Starte deine Bewerbung
              </h1>
              <p className="mt-4 max-w-md text-sm leading-6 text-[var(--color-muted)]">
                Wir sammeln nur das Notoetigste. Nach der Anmeldung kannst du
                deinen Lebenslauf hochladen und Bewerbungen verwalten.
              </p>
            </div>

            <div className="grid gap-4">
              <div className="overflow-hidden rounded-3xl border border-[var(--color-line)] bg-[var(--color-surface-raise)]">
                <div className="relative aspect-[4/3]">
                  <Image
                    src="/handshake.png"
                    alt="Handshake"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 90vw, 520px"
                    priority
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs text-[var(--color-chip-ink)]">
                <div className="rounded-2xl border border-[var(--color-line)] bg-white/70 px-3 py-3">
                  Clean Onboarding
                </div>
                <div className="rounded-2xl border border-[var(--color-line)] bg-white/70 px-3 py-3">
                  Datenschutz klar
                </div>
              </div>
            </div>
          </div>
        </section> */}
      </div>
    </main>
  );
}
