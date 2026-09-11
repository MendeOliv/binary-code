import Link from 'next/link';

const NAV = [
  { label: 'Início', href: '/' },
  { label: 'Soluções', href: '/solutions' },
  { label: 'Projetos', href: '/projects' },
  { label: 'Developers', href: '/developers' },
  { label: 'Diagnóstico', href: '/diagnostic' },
];

const SPECIALTIES = [
  'Engenharia de IA & RAG',
  'Sistemas Distribuídos',
  'Automação de Processos',
  'Auditoria & Arquitetura',
];

const LEGAL = [
  { label: 'Privacidade', href: '/privacidade' },
  { label: 'Termos de Serviço', href: '/termos' },
  { label: 'Diagnóstico', href: '/diagnostic' },
];

export default function Footer() {
  return (
    <footer className="w-full bg-surface-container-low mt-space-xl">
      <div className="w-full max-w-7xl mx-auto px-gutter-mobile md:px-margin py-space-xl flex flex-col gap-space-xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-space-xl">
          {/* Brand */}
          <div className="flex flex-col gap-space-sm">
            <div className="flex items-center gap-space-xs">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo/codigo-binario-transparent.png"
                alt="Logotipo Código Binário"
                width={32}
                height={32}
                className="h-8 w-8 object-contain"
              />
              <span className="font-headline-sm text-headline-sm text-text-primary font-semibold">
                Código Binário
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-text-secondary leading-relaxed">
              AI, Systems &amp; Digital Solutions. Engenharia de sistemas soberanos, automação e
              infraestrutura digital de alta precisão.
            </p>
            <div className="flex items-center gap-space-xs font-label-telemetry text-label-telemetry text-on-surface-variant">
              <span className="w-2 h-2 rounded-full bg-primary-container" aria-hidden="true" />
              <span>ALL SYSTEMS OPERATIONAL</span>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex flex-col gap-space-sm">
            <span className="font-label-telemetry text-label-telemetry uppercase text-text-secondary">
              // NAVEGAÇÃO
            </span>
            <nav className="flex flex-col gap-space-xs" aria-label="Navegação do rodapé">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Specialties */}
          <div className="flex flex-col gap-space-sm">
            <span className="font-label-telemetry text-label-telemetry uppercase text-text-secondary">
              // ESPECIALIDADES
            </span>
            <ul className="flex flex-col gap-space-xs font-body-sm text-body-sm text-on-surface-variant">
              {SPECIALTIES.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-space-sm">
            <span className="font-label-telemetry text-label-telemetry uppercase text-text-secondary">
              // CONEXÃO DIRETA
            </span>
            <a
              href="mailto:eng@codigobinario.io"
              className="font-body-sm text-body-sm text-on-surface hover:text-primary transition-colors"
            >
              eng@codigobinario.io
            </a>
            <Link
              href="/diagnostic"
              className="font-label-telemetry text-label-telemetry text-primary hover:text-tertiary transition-colors uppercase"
            >
              [/diagnostic_request →]
            </Link>
          </div>
        </div>

        <div className="pt-space-md border-t border-border-subtle flex flex-col md:flex-row items-center justify-between gap-space-md font-label-telemetry text-label-telemetry text-text-secondary">
          <span>© {new Date().getFullYear()} CÓDIGO BINÁRIO // ALL SYSTEMS OPERATIONAL</span>
          <div className="flex items-center gap-space-lg">
            {LEGAL.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-on-surface-variant hover:text-on-surface transition-colors uppercase"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
