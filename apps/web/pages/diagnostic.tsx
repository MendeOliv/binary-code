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
      </Head>

      <div className="min-h-[calc(100vh-4rem)] bg-background">
        {phase === 'chat' && (
          <div className="h-[calc(100vh-4rem)]">
            <DiagnosticChat
              initialProblem={initialProblem}
              onComplete={handleDiagnosisComplete}
            />
          </div>
        )}

        {phase === 'brief' && diagnostic && (
          <div className="max-w-3xl mx-auto px-5 md:px-8 py-10">
            <DiagnosticBrief diagnostic={diagnostic} />
            <div className="mt-10">
              <LeadCaptureForm
                diagnostic={diagnostic}
                sessionId={sessionId}
                onComplete={handleLeadSubmitted}
              />
            </div>
          </div>
        )}

        {phase === 'done' && (
          <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-5">
            <div className="text-center max-w-md">
              <span className="material-symbols-outlined text-6xl text-primary mb-6 block">
                check_circle
              </span>
              <h2 className="font-mono text-headline-md text-on-surface mb-4 uppercase">
                Diagnóstico concluído
              </h2>
              <p className="font-mono text-body-sm text-on-surface-variant mb-8 leading-relaxed">
                A nossa equipa irá analisar o seu diagnóstico e entrar em contacto em breve.
              </p>
              <button
                onClick={() => router.push('/')}
                className="btn-ghost"
              >
                Voltar ao início
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}