import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import DiagnosticChat from '../components/DiagnosticChat';
import DiagnosticBrief from '../components/DiagnosticBrief';
import LeadCaptureForm from '../components/LeadCaptureForm';
import type { DiagnosticResponse } from '@shared/models';

type Phase = 'chat' | 'brief' | 'done';

const PIPELINE_STEPS = [
  { index: '01', icon: 'chat', title: 'Entrevista', subtitle: 'Descreva o problema' },
  { index: '02', icon: 'insights', title: 'Análise IA', subtitle: 'Extração de fatos' },
  { index: '03', icon: 'description', title: 'Diagnóstico', subtitle: 'Relatório estruturado' },
  { index: '04', icon: 'contact_mail', title: 'Devolutiva', subtitle: 'Contacto da equipa' },
];

export default function DiagnosticPage() {
  const router = useRouter();
  const initialProblem = router.query.initial as string | undefined;

  const [phase, setPhase] = useState<Phase>('chat');
  const [diagnostic, setDiagnostic] = useState<DiagnosticResponse | null>(null);
  const [sessionId, setSessionId] = useState<string>('');
  const [activeStep, setActiveStep] = useState(0);

  const gotoStep = (n: number) => setActiveStep(n);

  const handleDiagnosisComplete = (diag: DiagnosticResponse, sid: string) => {
    setDiagnostic(diag);
    setSessionId(sid);
    setPhase('brief');
    gotoStep(2);
  };

  const handleLeadSubmitted = () => {
    setPhase('done');
    gotoStep(3);
  };

  return (
    <>
      <Head>
        <title>Binary Diagnostic — Código Binário</title>
        <meta
          name="description"
          content="Entrevista de arquitetura e diagnóstico técnico guiado por IA. Descreva o problema da sua operação e receba uma análise estruturada."
        />
      </Head>

      {/* Telemetry strip */}
      <section className="w-full bg-surface-container-low px-gutter-mobile md:px-margin py-space-sm border-b border-border-subtle">
        <div className="max-w-[1240px] mx-auto flex flex-wrap items-center justify-between gap-space-sm font-body-sm text-body-sm">
          <div className="flex items-center gap-space-md flex-wrap">
            <div className="flex items-center gap-space-xs text-primary">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" aria-hidden="true" />
              <span className="font-medium tracking-wide">Diagnóstico Arquitetural</span>
            </div>
            <span className="text-outline-variant hidden sm:inline" aria-hidden="true">•</span>
            <span className="text-on-surface-variant">Sessão Confidencial</span>
            <span className="text-outline-variant hidden sm:inline" aria-hidden="true">•</span>
            <span className="text-text-secondary">
              Protocolo: <span className="font-label-code text-on-surface">#BD-ENG</span>
            </span>
          </div>
          <div className="flex items-center gap-space-md">
            <span className="px-space-sm py-0.5 rounded bg-surface-container-high text-on-surface font-body-sm text-body-sm">
              Criptografia Ponta a Ponta
            </span>
            <span className="text-primary font-medium tracking-wide flex items-center gap-space-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" aria-hidden="true" />
              Sessão Segura
            </span>
          </div>
        </div>
      </section>

      {/* Main workbench */}
      <section className="w-full px-gutter-mobile md:px-margin py-space-xl">
        <div className="max-w-[1240px] mx-auto flex flex-col gap-space-xl">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-lg">
            <div className="flex flex-col gap-space-xs max-w-3xl">
              <div className="flex items-center gap-space-xs text-secondary font-body-sm text-body-sm uppercase tracking-wider font-semibold">
                <span className="material-symbols-outlined text-sm" aria-hidden="true">insights</span>
                <span>Discovery &amp; Engenharia de Sistemas</span>
              </div>
              <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-text-primary tracking-tight font-semibold">
                Entrevista de Arquitetura &amp; Diagnóstico Técnico
              </h1>
              <p className="font-body-md text-body-md text-text-secondary">
                Compartilhe os desafios operacionais e tecnológicos da sua organização. Nossa
                análise de requisitos mapeia gargalos e desenha a arquitetura sob medida para sua
                escala.
              </p>
            </div>
            <div className="flex flex-row lg:flex-col items-start lg:items-end justify-between p-space-md bg-surface-container-high rounded gap-space-xs border border-border-subtle">
              <span className="font-body-sm text-body-sm text-text-secondary">Squad Responsável</span>
              <div className="flex items-center gap-space-xs">
                <span className="w-2 h-2 rounded-full bg-primary" aria-hidden="true" />
                <span className="font-body-sm text-body-sm font-semibold text-on-surface">Core Architecture Group</span>
              </div>
            </div>
          </div>

          {/* Step pipeline indicator */}
          <ol className="grid grid-cols-2 md:grid-cols-4 gap-space-sm list-none p-0 m-0">
            {PIPELINE_STEPS.map((step, i) => {
              const isActive = i === activeStep;
              return (
                <li
                  key={step.index}
                  className={`flex flex-col p-space-md rounded border transition-all ${
                    isActive
                      ? 'bg-surface-container-high border-border-highlight'
                      : 'bg-surface-container-low border-border-subtle'
                  }`}
                  aria-current={isActive ? 'step' : undefined}
                >
                  <div className="flex items-center justify-between">
                    <span className={`font-body-sm text-body-sm font-bold ${isActive ? 'text-primary' : 'text-text-secondary'}`}>
                      Etapa {step.index}
                    </span>
                    <span
                      className={`material-symbols-outlined text-base ${isActive ? 'text-primary' : 'text-text-secondary'}`}
                      aria-hidden="true"
                    >
                      {step.icon}
                    </span>
                  </div>
                  <span className={`font-headline-sm text-headline-sm mt-space-xs font-semibold ${isActive ? 'text-text-primary' : 'text-text-secondary'}`}>
                    {step.title}
                  </span>
                  <span className="font-body-sm text-body-sm text-text-secondary mt-0.5">{step.subtitle}</span>
                </li>
              );
            })}
          </ol>

          {/* Workspace */}
          {phase === 'chat' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
              <div className="lg:col-span-8 flex flex-col bg-surface-container rounded p-space-md md:p-space-lg shadow-card relative overflow-hidden">
                {/* Terminal header bar */}
                <div className="flex items-center justify-between pb-space-md mb-space-lg bg-surface-container-lowest -mx-space-md -mt-space-md px-space-md py-space-sm md:-mx-space-lg md:-mt-space-lg md:px-space-lg border-b border-border-subtle">
                  <div className="flex items-center gap-space-sm">
                    <span className="material-symbols-outlined text-primary" aria-hidden="true">terminal</span>
                    <span className="font-label-code text-label-code text-on-surface-variant uppercase tracking-wider">
                      DISCOVERY://SILENT_INTERVIEW
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5" aria-hidden="true">
                    <span className="w-2.5 h-2.5 rounded-full bg-error" />
                    <span className="w-2.5 h-2.5 rounded-full bg-secondary" />
                    <span className="w-2.5 h-2.5 rounded-full bg-primary-container" />
                  </div>
                </div>
                <div className="h-[60vh] min-h-[420px]">
                  <DiagnosticChat
                    initialProblem={initialProblem}
                    onComplete={handleDiagnosisComplete}
                  />
                </div>
              </div>

              {/* Side panel */}
              <aside className="lg:col-span-4 flex flex-col gap-space-md">
                <div className="bg-surface-container-low border border-border-subtle rounded p-space-md flex flex-col gap-space-sm">
                  <span className="tech-label">// COMO FUNCIONA</span>
                  <ul className="font-body-sm text-body-sm text-on-surface-variant flex flex-col gap-space-sm list-none p-0 m-0">
                    <li className="flex gap-space-sm">
                      <span className="text-primary font-label-code shrink-0">01&gt;</span>
                      Descreva o problema em linguagem natural, sem preparação técnica.
                    </li>
                    <li className="flex gap-space-sm">
                      <span className="text-primary font-label-code shrink-0">02&gt;</span>
                      A IA conduz a entrevista e extrai os fatos operacionais.
                    </li>
                    <li className="flex gap-space-sm">
                      <span className="text-primary font-label-code shrink-0">03&gt;</span>
                      O sistema gera um diagnóstico estruturado com recomendação.
                    </li>
                    <li className="flex gap-space-sm">
                      <span className="text-primary font-label-code shrink-0">04&gt;</span>
                      A equipa analisa o caso e entra em contacto.
                    </li>
                  </ul>
                </div>

                <div className="bg-surface-container-low border border-border-subtle rounded p-space-md flex flex-col gap-space-xs">
                  <span className="tech-label">// PRIVACIDADE</span>
                  <p className="font-body-sm text-body-sm text-text-secondary">
                    Os dados que você compartilha são usados para produzir o seu diagnóstico.
                    Consulte a{' '}
                    <Link href="/privacidade" className="text-primary hover:text-tertiary transition-colors">
                      Política de Privacidade
                    </Link>
                    .
                  </p>
                </div>
              </aside>
            </div>
          )}

          {phase === 'brief' && diagnostic && (
            <div className="max-w-3xl mx-auto w-full flex flex-col gap-space-lg">
              <DiagnosticBrief diagnostic={diagnostic} />
              <LeadCaptureForm
                diagnostic={diagnostic}
                sessionId={sessionId}
                onComplete={handleLeadSubmitted}
              />
            </div>
          )}

          {phase === 'done' && (
            <div className="max-w-md mx-auto w-full text-center py-space-xl">
              <div className="bg-surface-container-low border border-border-highlight rounded-xl p-space-xl flex flex-col items-center gap-space-md">
                <span className="material-symbols-outlined text-6xl text-primary" aria-hidden="true">
                  check_circle
                </span>
                <h2 className="font-headline-md text-headline-md text-text-primary uppercase">
                  Diagnóstico concluído
                </h2>
                <p className="font-body-md text-body-md text-text-secondary leading-relaxed">
                  A nossa equipa irá analisar o seu diagnóstico e entrar em contacto em breve.
                </p>
                <button onClick={() => router.push('/')} className="btn-ghost">
                  Voltar ao início
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
