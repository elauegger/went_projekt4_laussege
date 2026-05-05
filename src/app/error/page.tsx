// app/error/page.tsx
'use client'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'

function ErrorContent() {
  const params = useSearchParams()
  const message = params.get('message') ?? 'Something went wrong.'

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h2 className="text-xl font-bold text-red-600">Sign-in Error</h2>
      <p>{message}</p>
      <Link href="/" className="bg-blue-600 text-white px-4 py-2 rounded-md">
        Back to Home
      </Link>
    </div>
  )
}

export default function ErrorPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
      <ErrorContent />
    </Suspense>
  )
}
