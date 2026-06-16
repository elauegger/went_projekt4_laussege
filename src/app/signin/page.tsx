import Image from "next/image";
import Link from "next/link";

import { signInAction } from "../actions/auth";
import { LoginMicrosoft } from "../../components/loginMicrosoft";
import TurnstileWidget from "../../components/turnstile-widget";

export default function SignInPage() {
  return (
    <main className="min-h-screen px-4 py-4 text-[var(--color-ink)] sm:px-6 sm:py-6 lg:px-10 bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage: "url('/handshake1.png')",
      }}>
      <div className="mx-auto w-3/4 lg:w-1/2">


        {/*<section className="relative overflow-hidden rounded-[32px] border border-[var(--color-line)] bg-[var(--color-surface)] shadow-[0_24px_70px_rgba(92,83,50,0.16)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(125,138,98,0.24),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(210,194,160,0.35),transparent_45%)]" />
          <div className="relative z-10 flex h-full flex-col justify-between gap-8 p-8">
            <div>
              <p className="text-[11px] uppercase tracking-[0.4em] text-[var(--color-muted)]">
                Jobsy
              </p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#3f4033] sm:text-4xl">
                Willkommen zurueck
              </h1>
              <p className="mt-4 max-w-md text-sm leading-6 text-[var(--color-muted)]">
                Melde dich an, um Bewerbungen zu verwalten und deinen Lebenslauf
                sicher zu speichern. Das Layout bleibt ruhig, warm und klar.
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
                  Sicherer Login
                </div>
                <div className="rounded-2xl border border-[var(--color-line)] bg-white/70 px-3 py-3">
                  Session Sync
                </div>
              </div>
            </div>
          </div>
        </section> */}

        <section className="rounded-[32px] border border-[var(--color-line)] bg-white/60 p-8 shadow-[0_20px_60px_rgba(92,83,50,0.14)] backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.4em] text-[var(--color-muted)]">
                Sign in
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-[#4c4a3c]">
                Zugang zum Dashboard
              </h2>
            </div>
            {/* <Link
              href="/signup"
              className="rounded-full border border-[var(--color-line)] bg-[var(--color-surface-strong)] px-4 py-2 text-xs font-semibold text-[var(--color-olive-strong)]"
            >
              Konto erstellen
            </Link> */}
          </div>

          <form action={signInAction} className="mt-8 space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#4f503f]" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="name@beispiel.de"
                required
                autoComplete="email"
                className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 text-sm text-[#5b5a48] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#7b8750]/40"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#4f503f]" htmlFor="password">
                Passwort
              </label>
              <input
                id="password"
                type="password"
                name="password"
                placeholder="Dein Passwort"
                required
                autoComplete="current-password"
                className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 text-sm text-[#5b5a48] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#7b8750]/40"
              />
            </div>

            <TurnstileWidget />

            <button
              type="submit"
              className="w-full rounded-full bg-[var(--color-olive)] px-5 py-3 text-sm font-semibold text-[#f8f3e3] transition hover:bg-[var(--color-olive-strong)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              Sign In
            </button>
          </form>

          <div className="mt-6 flex flex-col gap-3">
            <LoginMicrosoft />
            <p className="text-xs text-[var(--color-muted)]">
              Noch kein Konto?{" "}
              <Link href="/signup" className="font-semibold text-[#5b5a47]">
                Jetzt registrieren
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}