import { useState } from 'react';
import type { DiagnosticResponse } from '@shared/models';

interface LeadCaptureFormProps {
  diagnostic: DiagnosticResponse;
  sessionId: string;
  onComplete: () => void;
}

export default function LeadCaptureForm({ diagnostic, sessionId, onComplete }: LeadCaptureFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const apiBase = process.env.NEXT_PUBLIC_API_BASE || '/api';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`${apiBase}/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          diagnosticId: diagnostic.id,
          sessionId,
          name: name.trim(),
          email: email.trim() || undefined,
          phone: phone.trim() || undefined,
          company: company.trim() || undefined,
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
      }
    } catch (error) {
      console.error('Error submitting lead:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-surface border border-primary-container rounded-lg p-8 text-center">
        <span className="material-symbols-outlined text-5xl text-primary mb-4 block">
          check_circle
        </span>
        <h3 className="font-mono text-headline-md text-on-surface mb-2">
          Diagnóstico registado!
        </h3>
        <p className="font-mono text-body-sm text-on-surface-variant mb-6">
          A nossa equipa entrará em contacto brevemente para discutir os detalhes.
        </p>
        <button onClick={onComplete} className="btn-ghost font-mono">
          Voltar ao início
        </button>
      </div>
    );
  }

  const complexityColors: Record<string, string> = {
    low: 'text-primary',
    medium: 'text-yellow-400',
    high: 'text-red-400',
  };

  const nextStepLabels: Record<string, string> = {
    budget: 'Orçamento / Proposta',
    consultation: 'Consultoria Técnica',
    analysis: 'Análise Humana',
  };

  return (
    <div className="bg-surface border border-outline-variant rounded-lg overflow-hidden">
      {/* Diagnostic summary */}
      <div className="p-6 border-b border-outline-variant bg-surface-container">
        <h3 className="font-mono text-label-md text-primary mb-4">
          RESUMO DO DIAGNÓSTICO
        </h3>
        <div className="grid grid-cols-2 gap-4 text-left">
          <div>
            <span className="font-mono text-label-sm text-on-surface-variant block">Problema</span>
            <span className="font-mono text-body-sm text-on-surface">{diagnostic.problemIdentified}</span>
          </div>
          <div>
            <span className="font-mono text-label-sm text-on-surface-variant block">Complexidade</span>
            <span className={`font-mono text-body-sm font-bold ${complexityColors[diagnostic.complexity] || 'text-on-surface'}`}>
              {diagnostic.complexity.toUpperCase()}
            </span>
          </div>
          <div>
            <span className="font-mono text-label-sm text-on-surface-variant block">Próximo passo</span>
            <span className="font-mono text-body-sm text-on-surface">
              {nextStepLabels[diagnostic.nextStep] || diagnostic.nextStep}
            </span>
          </div>
          {diagnostic.technologiesNeeded && diagnostic.technologiesNeeded.length > 0 && (
            <div>
              <span className="font-mono text-label-sm text-on-surface-variant block">Tecnologias</span>
              <span className="font-mono text-body-sm text-on-surface">
                {diagnostic.technologiesNeeded.join(', ')}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Lead form */}
      <div className="p-6">
        <h3 className="font-mono text-label-md text-on-surface mb-1">
          Deixe os seus dados
        </h3>
        <p className="font-mono text-body-sm text-on-surface-variant mb-6">
          A nossa equipa entrará em contacto para avançar.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="font-mono text-label-sm text-on-surface-variant block mb-1">
              Nome *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="input-field w-full"
              placeholder="O seu nome"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-mono text-label-sm text-on-surface-variant block mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field w-full"
                placeholder="email@exemplo.com"
              />
            </div>
            <div>
              <label className="font-mono text-label-sm text-on-surface-variant block mb-1">
                Telefone
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="input-field w-full"
                placeholder="+244 9XX XXX XXX"
              />
            </div>
          </div>

          <div>
            <label className="font-mono text-label-sm text-on-surface-variant block mb-1">
              Empresa
            </label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="input-field w-full"
              placeholder="Nome da empresa"
            />
          </div>

          <button
            type="submit"
            disabled={!name.trim() || isSubmitting}
            className="btn-primary w-full font-mono disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'A enviar...' : 'Enviar e avançar'}
          </button>
        </form>
      </div>
    </div>
  );
}
