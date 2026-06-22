'use client';

import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Job } from '../../types/job';
import { JobCard } from './JobCard';

type JobFavoritesSliderProps = {
  jobs: Job[];
};

export function JobFavoritesSlider({ jobs }: JobFavoritesSliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    sliderRef.current?.scrollBy({
      left: direction === 'left' ? -420 : 420,
      behavior: 'smooth',
    });
  };

  if (jobs.length === 0) {
    return <p className="text-sm text-[#6f6a58]">Du hast noch keine Jobs gespeichert.</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={() => scroll('left')}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d6caa9] bg-[#f9f4e7] text-[#6e7456] transition hover:bg-[#f3ecd9]"
        >
          <ChevronLeft size={18} />
        </button>

        <button
          type="button"
          onClick={() => scroll('right')}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d6caa9] bg-[#f9f4e7] text-[#6e7456] transition hover:bg-[#f3ecd9]"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <div
        ref={sliderRef}
        className="flex gap-4 overflow-hidden scroll-smooth"
      >
        {jobs.map((job) => (
          <div key={job.id} className="w-[340px] shrink-0">
            <JobCard job={job} isFavorite />
          </div>
        ))}
      </div>
    </div>
  );
}