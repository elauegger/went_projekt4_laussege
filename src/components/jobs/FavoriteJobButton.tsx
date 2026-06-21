'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';

type FavoriteJobButtonProps = {
  jobId: string;
  initialFavorite?: boolean;
};

export function FavoriteJobButton({
  jobId,
  initialFavorite = false,
}: FavoriteJobButtonProps) {
  const [isFavorite, setIsFavorite] = useState(initialFavorite);
  const [isLoading, setIsLoading] = useState(false);

  async function toggleFavorite() {
    if (isLoading) return;

    setIsLoading(true);

    const nextValue = !isFavorite;
    setIsFavorite(nextValue);

    const response = await fetch('/api/job-favorites', {
      method: nextValue ? 'POST' : 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ jobId }),
    });

    if (response.status === 401) {
      setIsFavorite(!nextValue);
      window.location.href = '/login';
      return;
    }

    if (!response.ok) {
      setIsFavorite(!nextValue);
    }

    setIsLoading(false);
  }

  return (
    <button
      type="button"
      onClick={toggleFavorite}
      disabled={isLoading}
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
        isFavorite
          ? 'border-[#d46a6a] bg-[#ffe8e8] text-[#b83f3f]'
          : 'border-[#d6caa9] bg-[#f9f4e7] text-[#6e7456] hover:bg-[#f3ecd9]'
      }`}
    >
      <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
      {isFavorite ? 'Gespeichert' : 'Speichern'}
    </button>
  );
}