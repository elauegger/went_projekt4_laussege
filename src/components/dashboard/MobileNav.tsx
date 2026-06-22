'use client';

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

type NavItem = {
  label: string;
  href: string;
  active?: boolean;
};

function NavGlyph({ active = false }: { active?: boolean }) {
  return (
    <span
      className={`inline-flex h-7 w-7 items-center justify-center rounded-full border text-[10px] font-semibold ${active
        ? "border-[#e6dfc8] bg-[#f4ebd2] text-[#5a6340]"
        : "border-white/10 bg-white/5 text-[#f5edd4]"
        }`}
    >
      •
    </span>
  );
}

export function MobileNav({ items }: { items: NavItem[] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen((current) => !current)}
        className="fixed bottom-6 right-6 z-50 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#74824a] text-[#f8f3e3] shadow-[0_10px_30px_rgba(116,130,74,0.3)] transition hover:bg-[#65743f] lg:hidden"
        aria-label="Navigation öffnen"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-30 bg-black/20 lg:hidden"
            onClick={() => setIsOpen(false)}
          />
          <nav className="fixed bottom-0 left-0 right-0 z-40 space-y-2 rounded-t-[28px] border border-[#dccfb0] bg-[#75824e]/95 px-4 py-6 text-[#f8f1de] backdrop-blur-sm lg:hidden">
            <div className="mb-4">
              <p className="text-[10px] uppercase tracking-[0.35em] text-[#f0e5bf]/70">
                Navigation
              </p>
            </div>
            {items.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition ${item.active
                  ? "bg-[#f3ebcf] text-[#55603a] shadow-sm"
                  : "text-[#efe7c8] hover:bg-white/8"
                  }`}
                onClick={() => setIsOpen(false)}
              >
                <NavGlyph active={item.active} />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </>
      )}
    </>
  );
}
