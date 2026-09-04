import Link from 'next/link'

interface Developer {
  id: string
  name: string
  role: string
  skills: string[]
  image: string
  stats: { uptime: string; lastCommit: string }
  accent: 'blue' | 'purple' | 'cyan'
  codeName: string
  badge: string
  icon: string
}

const developers: Developer[] = [
  {
    id: 'mbumba',
    name: 'Mbumba Guilherme',
    role: 'Senior Systems Architect',
    skills: ['AI', 'Systems Architecture'],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCp9uC5iHZypFcHqXh32H1i-Cqb7fDU-oZnBfO9aMBEIOoxethaJbYOdRnqf2fXN7X90QEQiyVaRxCesiBB2tTvtcfWSIcl3Egr_WUEZKkV99o2XOuHmjvN1sqNdGYbqHB0wcv3bFpGcGsgsPfLLvyxzE2lsBXjhOVto0_bTgudtDhrvQXbhRzSz8M_vEpMw-WiFuixWTlv9EcyzqE-EDb-aMxlLncUJ2A1cu1-v8WOK2uf1GtbqeKjaSpHK26scM4daA',
    stats: { uptime: '99.9%', lastCommit: '-1H' },
    accent: 'blue', codeName: 'Mbumba_G', badge: 'SYS.ARCHITECT', icon: 'account_tree',
  },
  {
    id: 'mendes',
    name: 'Mendes Bessa',
    role: 'Lead Backend Engineer',
    skills: ['Cloud', 'Automation', 'Data'],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAod2bM7IxNyKFmPOvybBMhCLNqAojIvG2wlia_FQi5IrvtPvS8X_ZfcJPIwBc6Ps_d__kndwKkWITW42Kxu2_vFYTSQqioilckWtLhTXjqdoEAURMGS6CiZomEeeSF_fE1A0LqgiiEHiQr4o__MCf1U3NLmxAIdG6lSX_pgWDwe-BnDJjbMCUYzDFlxfnzbtVW1LEXDE6c_lQFvATXm0W0DHo_uyGUPCZlagTRP8G-4PEEaLOpUFE-wBku8l9fkc8ydg',
    stats: { uptime: '99.7%', lastCommit: '-4H' },
    accent: 'purple', codeName: 'Mendes_B', badge: 'BACKEND.LEAD', icon: 'dns',
  },
  {
    id: 'elisio',
    name: 'Elisio Nascimento',
    role: 'Product Engineering Lead',
    skills: ['Frontend', 'Product Eng'],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDwDe8alX86E9XvGYUDcOML8ijr3U1MhvlrO8KUcA50OCkKCwYU-vYAmITFl6jeIpVC8Wb12lq_xi9jjpmJRcVqz391s7XxWDjwzQy2e6uO1iFMeiGuloikKeRQszUh2-LJgKXpaFJJ8fVcDCI-h5UVowOC4sYMvp8I-bzxiw9tBjQvqvgzczH09aOMt1r8cXn-2VJfxU7fPPsSXrnVDPWDD8-WwfL27-ihniBLoziKHtk_IkW6u1P1sq-p0ubxxj8GhQ',
    stats: { uptime: '99.8%', lastCommit: '-2H' },
    accent: 'cyan', codeName: 'Elisio_N', badge: 'PROD.ENG', icon: 'developer_board',
  },
]

const accent = {
  blue: { color: '#3b82f6', hover: 'hover-sapphire', border: 'group-hover:border-[#3b82f6]/50', badge: 'group-hover:border-[#3b82f6]/30', shadow: 'rgba(59,130,246,0.8)' },
  purple: { color: '#a855f7', hover: 'hover-amethyst', border: 'group-hover:border-[#a855f7]/50', badge: 'group-hover:border-[#a855f7]/30', shadow: 'rgba(168,85,247,0.8)' },
  cyan: { color: '#06b6d4', hover: 'hover-slate-cyan', border: 'group-hover:border-[#06b6d4]/50', badge: 'group-hover:border-[#06b6d4]/30', shadow: 'rgba(6,182,212,0.8)' },
}

export default function DevelopersPage() {
  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col font-body-md selection:bg-primary-container selection:text-surface">
      <header className="bg-surface/80 backdrop-blur-xl border-b border-border-glass shadow-none fixed top-0 w-full z-50">
        <div className="flex items-center justify-between px-margin-desktop py-4">
          <Link href="/" className="font-editorial-h1 text-editorial-h1 tracking-tighter text-text-high-contrast flex items-center gap-2">
            <span className="text-primary">&gt;</span> CÓDIGO BINÁRIO
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-on-surface-variant hover:text-primary transition-colors duration-300 font-body-md text-body-md cursor-pointer active:opacity-70">Showcase</Link>
            <a href="#stack" className="text-on-surface-variant hover:text-primary transition-colors duration-300 font-body-md text-body-md cursor-pointer active:opacity-70">Stack</a>
            <Link href="/developers" className="text-primary font-bold border-b border-primary hover:text-primary transition-colors duration-300 font-body-md text-body-md cursor-pointer active:opacity-70 pb-1">Labs</Link>
            <a href="#terminal" className="text-on-surface-variant hover:text-primary transition-colors duration-300 font-body-md text-body-md cursor-pointer active:opacity-70">Terminal</a>
          </nav>
          <div className="flex items-center gap-4">
            <button type="button" aria-label="Terminal" className="text-on-surface-variant hover:text-primary transition-colors duration-300 cursor-pointer active:opacity-70 flex items-center justify-center"><span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>terminal</span></button>
            <button type="button" aria-label="Code" className="text-on-surface-variant hover:text-primary transition-colors duration-300 cursor-pointer active:opacity-70 flex items-center justify-center"><span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>code</span></button>
          </div>
        </div>
      </header>

      <main className="flex-grow pt-[88px] relative overflow-hidden">
        <section className="relative z-10 px-margin-mobile md:px-margin-desktop py-24 max-w-[1600px] mx-auto w-full">
          <div className="mb-20">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-[1px] bg-primary" />
              <span className="font-micro-metadata text-micro-metadata text-primary uppercase tracking-widest">{'// SYSTEM.ARCHITECTURE.HUMANS'}</span>
            </div>
            <h1 className="font-headline-xl text-headline-xl text-text-high-contrast mb-6"><span className="text-surface-variant">{'{'}</span> THE MINDS BEHIND <br /> THE CODE <span className="text-surface-variant">{'}'}</span></h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl border-l-2 border-border-glass pl-4 py-1">Os engenheiros que arquitetam o futuro. Uma convergência de lógica abstrata, design de sistemas estruturados e execução de precisão.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {developers.map((developer, index) => {
              const style = accent[developer.accent]
              return (
                <div key={developer.id} className={`bg-surface-charcoal/80 backdrop-blur-[12px] border border-border-glass rounded-DEFAULT overflow-hidden inner-highlight tech-card-hover ${style.hover} group flex flex-col h-full`}>
                  <div className={`relative h-[350px] overflow-hidden border-b border-border-glass ${style.border} transition-colors duration-400`}>
                    <img alt={developer.name} className="w-full h-full object-cover object-top img-zoom grayscale group-hover:grayscale-0 transition-all duration-700 mix-blend-luminosity opacity-80 group-hover:opacity-100 group-hover:mix-blend-normal" src={developer.image} />
                    <div className={`absolute top-4 right-4 flex items-center gap-2 bg-surface/80 backdrop-blur px-3 py-1.5 rounded-sm border border-border-glass ${style.badge} transition-colors`}>
                      <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: style.color, boxShadow: `0 0 8px ${style.shadow}` }} />
                      <span className="font-micro-metadata text-micro-metadata" style={{ color: style.color }}>{developer.badge}</span>
                    </div>
                    <div className="absolute bottom-4 left-4 font-micro-metadata text-micro-metadata text-text-high-contrast/50">[ID_0{index + 1}] // {developer.codeName}</div>
                  </div>
                  <div className="p-6 flex-grow flex flex-col justify-between">
                    <div>
                      <h2 className="font-editorial-h1 text-editorial-h1 text-text-high-contrast mb-2">&gt; {developer.name}</h2>
                      <div className="font-body-md text-body-md mb-4 flex items-center gap-2" style={{ color: style.color }}><span className="material-symbols-outlined text-[18px]">{developer.icon}</span>{developer.role}</div>
                      <div className="flex flex-wrap gap-2 mb-8">{developer.skills.map((skill) => <span key={skill} className="border border-border-glass px-2 py-1 font-label-sm text-label-sm text-on-surface-variant rounded-sm transition-colors">{skill}</span>)}</div>
                    </div>
                    <button type="button" className="w-full bg-transparent border border-border-glass text-text-high-contrast hover:bg-white/5 transition-all duration-300 font-label-sm text-label-sm py-3 px-4 rounded-sm flex items-center justify-center gap-2">VIEW PROFILE <span className="material-symbols-outlined text-[16px]">arrow_forward</span></button>
                  </div>
                  <div className="h-[1px] bg-border-glass w-full transition-colors" />
                  <div className="p-3 bg-surface-container-low flex justify-between font-micro-metadata text-micro-metadata text-on-surface-variant"><span>UPTIME: {developer.stats.uptime}</span><span>LAST_COMMIT: {developer.stats.lastCommit}</span></div>
                </div>
              )
            })}
          </div>

          <div className="mt-20 border-t border-border-glass pt-4 flex justify-between items-center opacity-60">
            <span className="font-micro-metadata text-micro-metadata text-primary">EOF_REACHED</span>
            <span className="font-micro-metadata text-micro-metadata text-on-surface-variant tracking-[0.2em]">01000011 01000010</span>
          </div>
        </section>
      </main>

      <footer className="bg-surface-charcoal w-full py-12 border-t border-border-glass shadow-none flex flex-col items-center justify-center gap-metadata-gap relative z-20">
        <div className="font-body-lg text-body-lg text-text-high-contrast mb-4"><span className="text-primary">&gt;</span> CÓDIGO BINÁRIO</div>
        <div className="flex gap-6 mb-6">
          <a className="text-on-surface-variant opacity-80 hover:opacity-100 transition-opacity hover:text-text-high-contrast font-micro-metadata text-micro-metadata uppercase" href="https://github.com/MendeOliv/binary-code">GitHub</a>
          <a className="text-on-surface-variant opacity-80 hover:opacity-100 transition-opacity hover:text-text-high-contrast font-micro-metadata text-micro-metadata uppercase" href="#">LinkedIn</a>
          <a className="text-on-surface-variant opacity-80 hover:opacity-100 transition-opacity hover:text-text-high-contrast font-micro-metadata text-micro-metadata uppercase" href="#">Documentation</a>
          <a className="text-on-surface-variant opacity-80 hover:opacity-100 transition-opacity hover:text-text-high-contrast font-micro-metadata text-micro-metadata uppercase" href="#">Privacy</a>
        </div>
        <div className="text-emerald-accent font-micro-metadata text-micro-metadata">© 2024 CÓDIGO BINÁRIO // [NULL_SECURED]</div>
      </footer>
    </div>
  )
}
