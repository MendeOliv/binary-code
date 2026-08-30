import { useRouter } from 'next/router';

export default function Navbar() {
  const router = useRouter();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-outline-variant">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-3 group"
        >
          <div className="w-8 h-8 rounded bg-primary-container/20 border border-primary-container flex items-center justify-center group-hover:shadow-glow transition-all">
            <span className="text-primary font-mono text-label-md font-bold">CB</span>
          </div>
          <span className="font-mono text-body-md text-on-surface font-bold hidden sm:block">
            Código Binário
          </span>
        </button>

        {/* Nav links */}
        <div className="flex items-center gap-6">
          <span className="font-mono text-label-md text-on-surface-variant hover:text-primary transition-colors cursor-pointer hidden md:block">
            Serviços
          </span>
          <span className="font-mono text-label-md text-on-surface-variant hover:text-primary transition-colors cursor-pointer hidden md:block">
            Sobre
          </span>
          <button
            onClick={() => router.push('/diagnostic')}
            className="btn-primary text-label-sm"
          >
            Diagnóstico
          </button>
        </div>
      </div>
    </nav>
  );
}
