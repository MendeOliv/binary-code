import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

const NAV_LINKS = [
  { label: 'Início', href: '/' },
  { label: 'Soluções', href: '/solutions' },
  { label: 'Projetos', href: '/projects' },
  { label: 'Developers', href: '/developers' },
  { label: 'Diagnóstico', href: '/diagnostic' },
];

export default function Navbar() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  const isActive = (href: string) =>
    href === '/' ? router.pathname === '/' : router.pathname.startsWith(href);

  return (
    <header className="fixed top-0 w-full z-50 bg-surface/85 backdrop-blur-xl shadow-navbar">
      <div className="h-20 w-full px-gutter-mobile md:px-margin flex items-center justify-between gap-space-md">
        {/* Brand */}
        <Link
          href="/"
          onClick={close}
          className="flex items-center gap-space-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          aria-label="Código Binário — página inicial"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo/codigo-binario-transparent.png"
            alt="Logotipo Código Binário"
            width={40}
            height={40}
            className="h-10 w-10 object-contain"
          />
          <span className="flex flex-col">
            <span className="font-headline-sm text-headline-sm tracking-tight text-text-primary font-semibold">
              Código Binário
            </span>
            <span className="font-label-telemetry text-label-telemetry text-text-secondary uppercase">
              // AI &amp; SYSTEM ARCHITECTURE
            </span>
          </span>
        </Link>

        {/* Kernel status — desktop wide only */}
        <div className="hidden xl:flex items-center gap-space-sm px-space-sm py-space-xs rounded bg-surface-container-low">
          <span className="w-1.5 h-1.5 rounded-full bg-primary-container animate-pulse" aria-hidden="true" />
          <span className="font-label-telemetry text-label-telemetry text-on-surface-variant tracking-wider uppercase">
            KERNEL: OPERATIONAL // SYSTEM: READY
          </span>
        </div>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-space-lg" aria-label="Navegação principal">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? 'page' : undefined}
              className={`font-body-sm text-body-sm transition-colors ${
                isActive(link.href)
                  ? 'text-primary font-bold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA + mobile toggle */}
        <div className="flex items-center gap-space-md">
          <Link href="/diagnostic" className="btn-primary hidden md:inline-flex">
            [INICIAR DIAGNÓSTICO →]
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden inline-flex items-center justify-center h-10 w-10 text-on-surface-variant hover:text-on-surface transition-colors"
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={open}
          >
            <span className="material-symbols-outlined" aria-hidden="true">
              {open ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden border-t border-border-subtle bg-surface">
          <nav className="px-gutter-mobile py-4 flex flex-col gap-1" aria-label="Navegação móvel">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={close}
                aria-current={isActive(link.href) ? 'page' : undefined}
                className={`py-2.5 font-body-md text-body-md transition-colors ${
                  isActive(link.href)
                    ? 'text-primary font-bold'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/diagnostic" onClick={close} className="btn-primary mt-3">
              [INICIAR DIAGNÓSTICO →]
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
