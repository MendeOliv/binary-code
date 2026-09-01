import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import DiagnosticChat from '../components/DiagnosticChat';
import DiagnosticBrief from '../components/DiagnosticBrief';
import LeadCaptureForm from '../components/LeadCaptureForm';
import type { DiagnosticResponse } from '@shared/models';

type Phase = 'chat' | 'brief' | 'lead' | 'done';

export default function DiagnosticPage() {
  const router = useRouter();
  const initialProblem = router.query.initial as string | undefined;

  const [phase, setPhase] = useState<Phase>('chat');
  const [diagnostic, setDiagnostic] = useState<DiagnosticResponse | null>(null);
  const [sessionId, setSessionId] = useState<string>('');

  const handleDiagnosisComplete = (diag: DiagnosticResponse, sid: string) => {
    setDiagnostic(diag);
    setSessionId(sid);
    setPhase('brief');
  };

  const handleLeadSubmitted = () => {
    setPhase('done');
  };

  return (
    <>
      <Head>
        <title>Binary Diagnostic — Código Binário</title>
        <meta
          name="description"
          content="Descreva o seu problema e receba um diagnóstico técnico personalizado da nossa IA."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div className="min-h-screen bg-background flex flex-col">
        {/* Header */}
        <header className="bg-surface border-b border-outline-variant px-6 h-14 flex items-center justify-between">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-3 group"
          >
            <div className="w-7 h-7 rounded bg-primary-container/20 border border-primary-container flex items-center justify-center">
              <span className="text-primary font-mono text-label-sm font-bold">CB</span>
            </div>
            <span className="font-mono text-body-sm text-on-surface font-bold hidden sm:block">
              Código Binário
            </span>
          </button>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="font-mono text-label-sm text-on-surface-variant">
              Binary Diagnostic
            </span>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {phase === 'chat' && (
            <div className="flex-1 overflow-hidden">
              <DiagnosticChat
                initialProblem={initialProblem}
                onComplete={handleDiagnosisComplete}
              />
            </div>
          )}

          {phase === 'brief' && diagnostic && (
            <div className="flex-1 overflow-y-auto p-6 max-w-3xl mx-auto w-full">
              <DiagnosticBrief diagnostic={diagnostic} />

              <div className="mt-8">
                <LeadCaptureForm
                  diagnostic={diagnostic}
                  sessionId={sessionId}
                  onComplete={handleLeadSubmitted}
                />
              </div>
            </div>
          )}

          {phase === 'done' && (
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="text-center max-w-md">
                <span className="material-symbols-outlined text-6xl text-primary mb-6 block">
                  celebration
                </span>
                <h2 className="font-mono text-headline-md text-on-surface mb-4">
                  Obrigado!
                </h2>
                <p className="font-mono text-body-sm text-on-surface-variant mb-8">
                  A nossa equipa irá analisar o seu diagnóstico e entrar em contacto
                  em breve. Enquanto isso, pode continuar a explorar os nossos serviços.
                </p>
                <button
                  onClick={() => router.push('/')}
                  className="btn-primary font-mono"
                >
                  Voltar ao início
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
