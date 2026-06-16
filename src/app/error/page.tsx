// app/error/page.tsx
'use client'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'
import { AlertCircle, Home } from 'lucide-react'

function ErrorContent() {
  const params = useSearchParams()
  const message = params?.get('message') ?? 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.'

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-6 text-[#2f3628]">
      <div className="w-full max-w-md rounded-3xl border border-[#d9ceb1] bg-[#f6f0e6] p-8 shadow-[0_24px_90px_rgba(98,87,55,0.14)] text-center">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-[#faecec] p-3">
            <AlertCircle className="h-6 w-6 text-[#d32f2f]" />
          </div>
        </div>

        <h1 className="mb-2 font-serif text-2xl font-bold text-[#4d5240]">
          Authentifizierungsfehler
        </h1>

        <p className="mb-6 text-sm text-[#6f6a58]">
          {message}
        </p>

        <div className="space-y-3">
          <Link
            href="/signin"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#74824a] px-4 py-2.5 font-semibold text-[#f8f3e3] transition hover:bg-[#65743f]"
          >
            Erneut anmelden
          </Link>

          <Link
            href="/"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#d6caa9] bg-[#f9f4e7] px-4 py-2.5 font-semibold text-[#6e7456] transition hover:bg-[#f3ecd9]"
          >
            <Home className="h-4 w-4" />
            Zur Startseite
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function ErrorPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen text-[#8a8467]">
        Wird geladen...
      </div>
    }>
      <ErrorContent />
    </Suspense>
  )
}
