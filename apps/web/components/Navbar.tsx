import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

const NAV_LINKS = [
  { label: 'SHOWCASE', href: '/solutions' },
  { label: 'STACK', href: '/' },
  { label: 'LABS', href: '/diagnostic' },
];

export default function Navbar() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface/90 backdrop-blur-md border-b border-border-glass">
      <nav
        className="max-w-7xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between"
        aria-label="Navegação principal"
      >
        {/* Brand */}
        <Link
          href="/"
          onClick={close}
          className="flex items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          aria-label="Código Binário — página inicial"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo/codigo-binario-padded.png"
            alt="Código Binário"
            width={759}
            height={778}
            className="h-8 w-auto object-contain"
          />
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`font-mono text-label-sm uppercase tracking-widest transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                router.pathname === link.href
                  ? 'text-primary'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/diagnostic"
            className="font-mono text-on-surface-variant uppercase tracking-widest text-label-sm hover:text-primary transition-colors duration-200"
          >
            TERMINAL
          </Link>
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/diagnostic"
            className="btn-primary"
            aria-label="Initialize diagnostic"
          >
            START DIAGNOSTIC
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="md:hidden inline-flex items-center justify-center h-10 w-10 text-on-surface-variant hover:text-on-surface transition-colors"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          <span className="material-symbols-outlined">{open ? 'close' : 'menu'}</span>
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-border-glass bg-surface">
          <div className="px-5 py-4 flex flex-col gap-1">
            <Link
              href="/"
              onClick={close}
              className="py-2.5 font-mono text-label-sm uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors"
            >
              HOME
            </Link>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={close}
                className="py-2.5 font-mono text-label-sm uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/diagnostic"
              onClick={close}
              className="py-2.5 font-mono text-label-sm uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors"
            >
              TERMINAL
            </Link>
            <Link
              href="/diagnostic"
              onClick={close}
              className="btn-primary mt-3"
              aria-label="Initialize diagnostic"
            >
              START DIAGNOSTIC
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}