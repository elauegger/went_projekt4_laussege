import Link from "next/link";
import type { ReactNode } from "react";
import {
  FileText,
  HelpCircle,
  Info,
  Mail,
  ShieldCheck,
  X,
} from "lucide-react";



function FooterHeading({ children }: { children: ReactNode }) {
  return (
    <div>
      <h2 className="text-[10px] font-semibold uppercase tracking-[0.34em] text-[#f7efd8]">
        {children}
      </h2>
      <span className="mt-3 block h-px w-full bg-[#f7efd8]/18" />
    </div>
  );
}

function FooterLink({
  href,
  children,
  icon,
}: {
  href: string;
  children: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group flex min-w-0 items-center gap-2.5 text-xs text-[#fbf3df]/86 transition hover:text-[#fff7de]"
    >
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#f7efd8]/10 text-[#f6efd8] transition group-hover:bg-[#f7efd8]/18">
        {icon ?? <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      </span>
      <span className="truncate">{children}</span>
    </Link>
  );
}

export function SiteFooter() {
  return (
    <footer className="relative left-1/2 w-[100dvw] -translate-x-1/2 border-x border-b border-[#d9ceb1] bg-[#75824e] text-[#fbf4df]">
      <div className="mx-auto flex max-w-screen-2xl flex-col gap-8 px-5 py-11 sm:px-7 sm:py-12 lg:flex-row lg:items-center lg:justify-between lg:px-10 lg:pt-20">
        <section className="flex min-w-0 items-start gap-4 lg:max-w-xl">
          
          <div className="min-w-0">
            <p className="font-serif text-4xl leading-none text-[#fff7df]">
              Jobsy
            </p>
            <p className="mt-1.5 text-[9px] font-medium uppercase tracking-[0.3em] text-[#f7efd8]/80">
              CV-Analyse & Job Matching
            </p>
            <p className="mt-3 max-w-sm text-sm leading-6 text-[#fbf4df]/88">
              Wir analysieren deinen Lebenslauf und finden die Jobs, die
              wirklich zu dir passen.
            </p>
          </div>
        </section>

        <section className="min-w-0 lg:flex-1">
          <FooterHeading>Informationen</FooterHeading>
          <nav
            className="mt-4 flex flex-wrap gap-x-5 gap-y-3"
            aria-label="Footer Informationen"
          >
            <FooterLink
              href="/ai-analysis"
              icon={<HelpCircle className="h-3.5 w-3.5" />}
            >
              So funktioniert&apos;s
            </FooterLink>
            <FooterLink
              href="/profile"
              icon={<ShieldCheck className="h-3.5 w-3.5" />}
            >
              Datenschutz
            </FooterLink>
            <FooterLink
              href="/jobs"
              icon={<FileText className="h-3.5 w-3.5" />}
            >
              FAQ
            </FooterLink>
            <FooterLink href="/" icon={<Info className="h-3.5 w-3.5" />}>
              Über uns
            </FooterLink>
            <FooterLink
              href="mailto:hello@jobsy.local"
              icon={<Mail className="h-3.5 w-3.5" />}
            >
              Kontakt
            </FooterLink>
          </nav>
        </section>

        <section className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center lg:justify-end">
          <p className="text-xs text-[#fbf4df]/84">© 2025 Jobsy</p>
          <div className="flex items-center gap-3">
            {[
              { label: "LinkedIn", icon: null },
              { label: "X", icon: X },
              { label: "E-Mail", icon: Mail },
            ].map(({ label, icon: Icon }) => (
              <Link
                key={label}
                href={label === "E-Mail" ? "mailto:hello@jobsy.local" : "#"}
                aria-label={label}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f7efd8]/10 text-[#f7efd8] transition hover:bg-[#f7efd8]/18"
              >
                {Icon ? (
                  <Icon className="h-4 w-4" strokeWidth={1.8} />
                ) : (
                  <span className="text-sm font-semibold leading-none">in</span>
                )}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </footer>
  );
}
