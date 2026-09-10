import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

interface Developer {
  id: string;
  name: string;
  role: string;
  skills: string[];
  accent: 'blue' | 'purple' | 'cyan';
  codeName: string;
  badge: string;
  image: string;
  status: string;
  uptime: string;
  lastCommit: string;
  icon: string;
}

type AccentMeta = {
  hex: string;
  rgb: string;
  token: string;
};

const ACCENTS: Record<Developer['accent'], AccentMeta> = {
  blue: { hex: '3b82f6', rgb: '59,130,246', token: 'sapphire-vector' },
  purple: { hex: 'a855f7', rgb: '168,85,247', token: 'amethyst-neural' },
  cyan: { hex: '06b6d4', rgb: '6,182,212', token: 'cyan-relay' },
};

const developers: Developer[] = [
  {
    id: 'mbumba',
    name: 'Mbumba Guilherme',
    role: 'Senior Systems Architect',
    skills: ['AI', 'Systems Architecture'],
    accent: 'blue',
    codeName: 'Mbumba_G',
    badge: 'SYS.ARCHITECT',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCp9uC5iHZypFcHqXh32H1i-Cqb7fDU-oZnBfO9aMBEIOoxethaJbYOdRnqf2fXN7X90QEQiyVaRxCesiBB2tTvtcfWSIcl3Egr_WUEZKkV99o2XOuHmjvN1sqNdGYbqHB0wcv3bFpGcGsgsPfLLvyxzE2lsBXjhOVto0_bTgudtDhrvQXbhRzSz8M_vEpMw-WiFuixWTlv9EcyzqE-EDb-aMxlLncUJ2A1cu1-v8WOK2uf1GtbqeKjaSpHK26scM4daA',
    status: 'SYS.ARCHITECT',
    uptime: '99.9%',
    lastCommit: '-1H',
    icon: 'account_tree'
  },
  {
    id: 'mendes',
    name: 'Mendes Bessa',
    role: 'Lead Backend Engineer',
    skills: ['Cloud', 'Automation', 'Data'],
    accent: 'purple',
    codeName: 'Mendes_B',
    badge: 'BACKEND.LEAD',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAod2bM7IxNyKFmPOvybBMhCLNqAojIvG2wlia_FQi5IrvtPvS8X_ZfcJPIwBc6Ps_d__kndwKkWITW42Kxu2_vFYTSQqioilckWtLhTXjqdoEAURMGS6CiZomEeeSF_fE1A0LqgiiEHiQr4o__MCf1U3NLmxAIdG6lSX_pgWDwe-BnDJjbMCUYzDFlxfnzbtVW1LEXDE6c_lQFvATXm0W0DHo_uyGUPCZlagTRP8G-4PEEaLOpUFE-wBku8l9fkc8ydg',
    status: 'BACKEND.LEAD',
    uptime: '99.7%',
    lastCommit: '-4H',
    icon: 'dns'
  },
  {
    id: 'elisio',
    name: 'Elisio Nascimento',
    role: 'Product Engineering Lead',
    skills: ['Frontend', 'Product Eng'],
    accent: 'cyan',
    codeName: 'Elisio_N',
    badge: 'PROD.ENG',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDwDe8alX86E9XvGYUDcOML8ijr3U1MhvlrO8KUcA50OCkKCwYU-vYAmITFl6jeIpVC8Wb12lq_xi9jjpmJRcVqz391s7XxWDjwzQy2e6uO1iFMeiGuloikKeRQszUh2-LJgKXpaFJJ8fVcDCI-h5UVowOC4sYMvp8I-bzxiw9tBjQvqvgzczH09aOMt1r8cXn-2VJfxU7fPPsSXrnVDPWDD8-WwfL27-ihniBLoziKHtk_IkW6u1P1sq-p0ubxxj8GhQ',
    status: 'PROD.ENG',
    uptime: '99.8%',
    lastCommit: '-2H',
    icon: 'developer_board'
  },
];

export default function DevelopersPage() {
  return (
    <>
      <Head>
        <title>CÓDIGO BINÁRIO - The Minds Behind the Code</title>
        <meta name="description" content="Os engenheiros que arquitetam o futuro. Uma convergência de lógica abstrata, design de sistemas estruturados e execução de precisão."        />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
        <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet"/>
      </Head>

      {/* TopAppBar - matches current navbar but with reference links */}
      <header className="bg-surface/80 backdrop-blur-xl border-b border-border-glass shadow-none fixed top-0 w-full z-50">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="font-editorial-h1 text-editorial-h1 tracking-tighter text-text-high-contrast flex items-center gap-2">
            <span className="text-primary">{'>'}</span> CÓDIGO BINÁRIO
          </div>
          <nav className="hidden md:flex items-center gap-8" aria-label="Navegação principal">
            <Link href="/solutions" className="text-on-surface-variant hover:text-primary transition-colors duration-300 font-body-md text-body-md cursor-pointer active:opacity-70">
              Showcase
            </Link>
            <Link href="/" className="text-on-surface-variant hover:text-primary transition-colors duration-300 font-body-md text-body-md cursor-pointer active:opacity-70">
              Stack
            </Link>
            <Link href="/projects" className="text-primary font-bold border-b border-primary hover:text-primary transition-colors duration-300 font-body-md text-body-md cursor-pointer active:opacity-70 pb-1">
              Labs
            </Link>
            <Link href="/diagnostic" className="text-on-surface-variant hover:text-primary transition-colors duration-300 font-body-md text-body-md cursor-pointer active:opacity-70">
              Terminal
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <button aria-label="Terminal" className="text-on-surface-variant hover:text-primary transition-colors duration-300 cursor-pointer active:opacity-70 flex items-center justify-center">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>terminal</span>
            </button>
            <button aria-label="Código" className="text-on-surface-variant hover:text-primary transition-colors duration-300 cursor-pointer active:opacity-70 flex items-center justify-center">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>code</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow pt-[88px] relative overflow-hidden">
        <section className="relative z-10 px-4 md:px-6 py-16 max-w-[1600px] mx-auto">
          {/* Section Header */}
          <div className="mb-20">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-[1px] bg-primary"></span>
              <span className="font-micro-metadata text-micro-metadata text-primary uppercase tracking-widest">{'// SYSTEM.ARCHITECTURE.HUMANS'}</span>
            </div>
            <h1 className="font-headline-xl text-headline-xl text-text-high-contrast mb-6">
              <span className="text-on-surface-variant">{'{'}</span> THE MINDS BEHIND <br/> THE CODE <span className="text-on-surface-variant">{'}'}</span>
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl border-l-2 border-border-glass pl-4 py-1">
              Os engenheiros que arquitetam o futuro. Uma convergência de lógica abstrata, design de sistemas estruturados e execução de precisão.
            </p>
          </div>

          {/* Symmetric 3-Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {developers.map((dev, index) => {
              const meta = ACCENTS[dev.accent];

              return (
                <div key={dev.id} className="group flex flex-col h-full">
                  {/* Card container with hover effects - accent via inline CSS variable */}
                  <div
                    className="bg-surface-charcoal/80 backdrop-blur-[12px] border border-border-glass rounded-inner overflow-hidden inner-highlight hover:-translate-y-1 group transition-shadow border-solid"
                    style={{ ['--accent' as string]: `${meta.hex}`, ['--accent-rgb' as string]: `${meta.rgb}` }}
                  >
                    {/* Image container */}
                    <div className="relative h-[350px] overflow-hidden border-b border-border-glass group">
                      <Image
                        alt={`Retrato de ${dev.name}, ${dev.role}`}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                        className="object-cover object-top img-zoom grayscale group-hover:grayscale-0 transition-all duration-700 opacity-80 group-hover:opacity-100"
                        priority
                        src={dev.image}
                      />
                      {/* Status badge */}
                      <div className="absolute top-4 right-4 flex items-center gap-2 bg-surface/80 backdrop-blur px-3 py-1.5 rounded-sm border border-border-glass transition-colors duration-300">
                        <span
                          className="w-2 h-2 rounded-full animate-pulse"
                          style={{ backgroundColor: `#${meta.hex}`, boxShadow: `0 0 8px rgba(${meta.rgb},0.8)` }}
                          aria-hidden="true"
                        ></span>
                        <span className="font-micro-metadata text-micro-metadata uppercase tracking-widest" style={{ color: `#${meta.hex}` }}>
                          {dev.badge}
                        </span>
                      </div>
                      {/* Developer ID */}
                      <div className="absolute bottom-4 left-4 font-micro-metadata text-micro-metadata text-text-high-contrast/50">
                        [ID_0{index + 1}] // {dev.codeName}
                      </div>
                    </div>

                    {/* Card content */}
                    <div className="p-6 flex-grow flex flex-col justify-between">
                      <div>
                        <h2 className="font-editorial-h1 text-editorial-h1 text-text-high-contrast mb-2 transition-colors duration-300">
                          {dev.name}
                        </h2>
                        <div className="font-body-md text-body-md mb-4 flex items-center gap-2 transition-colors duration-300" style={{ color: `#${meta.hex}` }}>
                          <span className="material-symbols-outlined text-[18px]">{dev.icon}</span>
                          {dev.role}
                        </div>
                        <div className="flex flex-wrap gap-2 mb-8">
                          {dev.skills.map((skill) => (
                            <span
                              key={skill}
                              className="border border-border-glass px-2 py-1 font-label-sm text-label-sm text-on-surface-variant rounded-sm transition-colors"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* View Profile button (prepared for a future profile route) */}
                      <button
                        type="button"
                        className="w-full bg-transparent border border-border-glass text-text-high-contrast transition-all duration-300 font-label-sm text-label-sm py-3 px-4 rounded-sm flex items-center justify-center gap-2 hover:saturate-150"
                        style={{
                          ['--btn-accent' as string]: `#${meta.hex}`
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = `#${meta.hex}`;
                          e.currentTarget.style.color = `#${meta.hex}`;
                          e.currentTarget.style.backgroundColor = `rgba(${meta.rgb},0.1)`;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = '';
                          e.currentTarget.style.color = '';
                          e.currentTarget.style.backgroundColor = '';
                        }}
                      >
                        VIEW PROFILE
                        <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                      </button>
                    </div>

                    {/* Divider */}
                    <div className="h-[1px] bg-border-glass w-full transition-colors duration-300"></div>

                    {/* Metadata footer */}
                    <div className="p-3 bg-surface-container-low flex justify-between font-micro-metadata text-micro-metadata text-on-surface-variant">
                      <span>UPTIME: {dev.uptime}</span>
                      <span>LAST_COMMIT: {dev.lastCommit}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Terminal Decorator */}
          <div className="mt-20 border-t border-border-glass pt-4 flex justify-between items-center opacity-60">
            <span className="font-micro-metadata text-micro-metadata text-primary">EOF_REACHED</span>
            <span className="font-micro-metadata text-micro-metadata text-on-surface-variant tracking-[0.2em]">01000011 01000010</span>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-surface-charcoal w-full py-12 border-t border-border-glass shadow-none flex flex-col items-center justify-center gap-2">
        <div className="font-body-lg text-body-lg text-text-high-contrast mb-4">
          <span className="text-primary">{'>'}</span> CÓDIGO BINÁRIO
        </div>
        <div className="flex gap-6 mb-6">
          <a href="#" className="text-on-surface-variant opacity-80 hover:opacity-100 transition-opacity hover:text-text-high-contrast font-micro-metadata text-micro-metadata uppercase">GitHub</a>
          <a href="#" className="text-on-surface-variant opacity-80 hover:opacity-100 transition-opacity hover:text-text-high-contrast font-micro-metadata text-micro-metadata uppercase">LinkedIn</a>
          <a href="#" className="text-on-surface-variant opacity-80 hover:opacity-100 transition-opacity hover:text-text-high-contrast font-micro-metadata text-micro-metadata uppercase">Documentation</a>
          <a href="#" className="text-on-surface-variant opacity-80 hover:opacity-100 transition-opacity hover:text-text-high-contrast font-micro-metadata text-micro-metadata uppercase">Privacy</a>
        </div>
        <div className="text-emerald-accent font-micro-metadata text-micro-metadata">
          © 2024 CÓDIGO BINÁRIO // [NULL_SECURED]
        </div>
      </footer>
    </>
  );
}