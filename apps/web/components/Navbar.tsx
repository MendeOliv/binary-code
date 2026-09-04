import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-surface/80 backdrop-blur-md border-b border-structuralBorder">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo / System Indicator */}
        <button
          onClick={() => window.location.href = '/'}
          className="flex items-center gap-3"
        >
          <div className="w-8 h-8 flex items-center justify-center bg-primaryContainer text-on-primary">
            <span className="font-mono font-bold">CB</span>
          </div>
          <span className="font-mono text-primary font-bold hidden sm:block">CÓDIGO BINÁRIO</span>
        </button>

        {/* Nav links - architectural grid style */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="#servicos">
            <a
              className="font-mono text-on-surface-variant uppercase tracking-wider text-label-sm hover:text-primary transition-colors cursor-pointer"
            >
              SOLUTIONS
            </a>
          </Link>
          <Link href="#terminal">
            <a
              className="font-mono text-on-surface-variant uppercase tracking-wider text-label-sm hover:text-primary transition-colors cursor-pointer"
            >
              DIAGNOSTIC
            </a>
          </Link>
          <Link href="/projects">
            <a
              className="font-mono text-on-surface-variant uppercase tracking-wider text-label-sm hover:text-primary transition-colors cursor-pointer"
            >
              PROJECTS
            </a>
          </Link>
          <Link href="/developers">
            <a
              className="font-mono text-on-surface-variant uppercase tracking-wider text-label-sm hover:text-primary transition-colors cursor-pointer"
            >
              DEVELOPERS
            </a>
          </Link>
        </div>

        {/* Command-style CTA button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => window.location.href = '/diagnostic'}
            className="font-mono text-on-primary bg-primaryContainer text-primary font-bold uppercase tracking-wider px-4 py-2 border border-primaryContainer hover:bg-primary hover:text-primaryContainer transition-all"
          >
            INITIALIZE DIAGNOSTIC
          </button>
        </div>
      </div>
    </nav>
  );
}