"use client" 
import Link from "next/link"
import { useEffect } from "react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string; code?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div>
      <h2>Unexpected Error</h2>
      <p>{error.message}</p>

      {/* Safely output error.code if present */}
      {error.code && <p>Error code: {error.code}</p>}

      <button onClick={() => reset()}>Try again</button>
      <Link
        href="/"
        className="bg-gray-600 text-white rounded-md px-4 py-2"
      >
        Go Home
      </Link>
    </div>
  )
}
