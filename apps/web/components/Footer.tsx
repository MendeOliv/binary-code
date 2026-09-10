import Link from 'next/link';

const DIRECTORY_INDEX = [
  { label: '/diagnostic', href: '/diagnostic' },
  { label: '/developers', href: '/developers' },
];

export default function Footer() {
  return (
    <footer className="w-full bg-surface-container-lowest border-t border-outline-variant">
      <div className="max-w-7xl mx-auto px-5 md:px-8 pt-14 pb-10">
        <div className="flex flex-col md:flex-row justify-between gap-10 border-b border-outline-variant pb-10">
          {/* Brand */}
          <div className="max-w-md">
            <div className="mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo/codigo-binario-transparent.png"
                alt="Código Binário"
                width={679}
                height={698}
                className="h-10 w-auto object-contain"
              />
            </div>
            <p className="font-mono text-body-sm text-on-surface-variant leading-relaxed">
              Um problema entra. Uma arquitetura emerge. Um sistema sai.
              Engenharia de software e inteligência artificial para converter
              complexidade em controle.
            </p>
            <div className="mt-4 flex flex-col gap-1 font-mono text-code-telemetry text-outline">
              <span>TELEMETRY: AUTONOMOUS PRODUCTION ENGINE v4.8</span>
              <span>KERNEL: SECURE LAB DISTRO // CLUSTER_ONLINE</span>
            </div>
          </div>

          {/* Directory index */}
          <div>
            <h4 className="tech-label mb-4 pb-2 border-b border-outline-variant">{'// DIRECTORY_INDEX'}</h4>
            <ul className="grid grid-cols-2 gap-x-10 gap-y-2.5">
              {DIRECTORY_INDEX.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="font-mono text-label-sm text-on-surface-variant hover:text-primary transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-mono text-label-sm text-outline">
            © {new Date().getFullYear()} CÓDIGO BINÁRIO // ALL SYSTEMS OPERATIONAL
          </p>
          <div className="flex items-center gap-2">
            <span className="state-dot animate-pulse" aria-hidden="true" />
            <span className="font-mono text-label-sm text-on-surface-variant uppercase tracking-widest">
              [NULL_SECURED]
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}