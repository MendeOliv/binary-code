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
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap"
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
        <header className="bgSurface borderBottom borderOutlineVariant px-6 h-14 flex items-center justify-between">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-3 group"
          >
            <div className="w-7 h-7 rounded bgPrimaryContainer/20 border borderPrimaryContainer flex items-center justify-center">
              <span className="textPrimary fontMono textLabelSm fontBold">CB</span>
            </div>
            <span className="fontMono textBodySm textOnSurface fontBold hidden sm:block">
              Código Binário
            </span>
          </button>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bgPrimary animate-pulse" />
            <span className="fontMono textLabelSm textOnSurfaceVariant">
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
                <span className="material-symbols-outlined text-6xl textPrimary mb-6 block">
                  celebration
                </span>
                <h2 className="fontMono textHeadlineMd textOnSurface mb-4">
                  Obrigado!
                </h2>
                <p className="fontMono textBodySm textOnSurfaceVariant mb-8">
                  A nossa equipa irá analisar o seu diagnóstico e entrar em contacto
                  em breve. Enquanto isso, pode continuar a explorar os nossos serviços.
                </p>
                <button
                  onClick={() => router.push('/')}
                  className="btnMono fontMono"
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