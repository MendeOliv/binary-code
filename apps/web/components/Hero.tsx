import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Hero() {
  const router = useRouter();
  const [problem, setProblem] = useState('');

  const handleStart = () => {
    if (problem.trim()) {
      router.push({ pathname: '/diagnostic', query: { initial: problem.trim() } });
    } else {
      router.push('/diagnostic');
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(78, 222, 163, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(78, 222, 163, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-tertiary/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* Terminal-style tag */}
        <div className="inline-flex items-center gap-2 bg-surface-container border border-outline-variant rounded-full px-4 py-2 mb-8 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="font-mono text-label-sm text-on-surface-variant">
            DIAGNÓSTICO INTELIGENTE · v1.0
          </span>
        </div>

        {/* Main headline */}
        <h1 className="text-headline-xl font-mono text-on-surface mb-6 animate-slide-up">
          <span className="text-primary">Tem</span> um problema{' '}
          <br className="hidden md:block" />
          operacional?
        </h1>

        <p className="text-headline-md font-mono text-on-surface-variant mb-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          A tecnologia pode resolvê-lo.
          <br />
          <span className="text-primary">Vamos descobrir como.</span>
        </p>

        <p className="text-body-lg font-mono text-outline mb-12 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.2s' }}>
          Descreva o seu desafio. A nossa IA diagnostica o problema,
          identifica a oportunidade tecnológica e propõe a melhor solução.
        </p>

        {/* Problem input */}
        <div className="max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-2 focus-within:border-primary-container focus-within:shadow-glow transition-all duration-200">
            <div className="flex items-center gap-3">
              <span className="text-primary font-mono text-label-md pl-3">&gt;</span>
              <textarea
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                placeholder="Descreva o seu problema..."
                rows={1}
                className="flex-1 bg-transparent border-none focus:ring-0 resize-none font-mono text-body-md text-on-surface placeholder-outline min-h-[48px] max-h-32 py-3 focus:outline-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleStart();
                  }
                }}
              />
              <button
                onClick={handleStart}
                className="bg-primary-container text-on-primary-container p-3 rounded hover:bg-surface-container-high border border-primary transition-colors"
                aria-label="Iniciar diagnóstico"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
          <p className="text-label-sm text-outline mt-3 font-mono">
            Enter para enviar · Shift+Enter para nova linha
          </p>
        </div>
      </div>
    </section>
  );
}
