import { useRouter } from 'next/router';

const steps = [
  {
    num: '01',
    title: 'Descreva o problema',
    description: 'Explique o desafio que a sua empresa enfrenta. Sem jargão técnico necessário.',
    icon: 'chat',
  },
  {
    num: '02',
    title: 'IA diagnostica',
    description: 'A nossa IA faz perguntas inteligentes para entender o contexto, processo e impacto.',
    icon: 'psychology',
  },
  {
    num: '03',
    title: 'Receba o diagnóstico',
    description: 'Um project brief objectivo: problema, solução recomendada, tecnologias e próximo passo.',
    icon: 'assignment',
  },
  {
    num: '04',
    title: 'Avance com confiança',
    description: 'Solução simples? Orçamento directo. Complexa? Consultoria. Incerta? Análise humana.',
    icon: 'rocket_launch',
  },
];

export default function HowItWorks() {
  const router = useRouter();

  return (
    <section id="como-funciona" className="py-24 px-6 bg-surface-dim">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <span className="font-mono text-label-md text-primary tracking-widest">
            {`// PROCESSO`}
          </span>
          <h2 className="text-headline-lg font-mono text-on-surface mt-4">
            Como funciona o <span className="text-primary">Binary Diagnostic</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, idx) => (
            <div key={step.num} className="relative">
              {/* Connector line */}
              {idx < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-full w-full h-px bg-outline-variant z-0" />
              )}

              <div className="relative z-10 bg-surface-container border border-outline-variant rounded-lg p-6 text-center glow-hover h-full">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-container/20 border border-primary-container mb-4">
                  <span className="material-symbols-outlined text-primary">
                    {step.icon}
                  </span>
                </div>

                <div className="font-mono text-label-sm text-primary mb-2">
                  STEP {step.num}
                </div>

                <h3 className="font-mono text-body-md text-on-surface font-bold mb-2">
                  {step.title}
                </h3>

                <p className="font-mono text-body-sm text-on-surface-variant">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <button
            onClick={() => router.push('/diagnostic')}
            className="btn-primary text-label-md font-mono"
          >
            Começar Diagnóstico Gratuito
          </button>
          <p className="text-label-sm text-outline mt-4 font-mono">
            Sem compromisso · Resultado em minutos
          </p>
        </div>
      </div>
    </section>
  );
}
