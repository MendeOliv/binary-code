import type { DiagnosticResponse } from '@shared/models';

interface DiagnosticBriefProps {
  diagnostic: DiagnosticResponse;
}

export default function DiagnosticBrief({ diagnostic }: DiagnosticBriefProps) {
  const complexityConfig: Record<string, { label: string; color: string; bg: string }> = {
    low: { label: '🟢 BAIXA', color: 'text-primary', bg: 'bg-primary/10' },
    medium: { label: '🟡 MÉDIA', color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
    high: { label: '🔴 ALTA', color: 'text-red-400', bg: 'bg-red-400/10' },
  };

  const nextStepConfig: Record<string, { label: string; description: string }> = {
    budget: {
      label: 'Orçamento / Proposta',
      description: 'Solução de complexidade baixa. Podemos avançar directamente com uma proposta.',
    },
    consultation: {
      label: 'Consultoria Técnica',
      description: 'Solução complexa. Recomendamos uma sessão de consultoria para definir requisitos.',
    },
    analysis: {
      label: 'Análise Humana Necessária',
      description: 'Cenário incerto. Um especialista humano irá analisar o caso.',
    },
  };

  const complexity = complexityConfig[diagnostic.complexity] || complexityConfig.medium;
  const nextStep = nextStepConfig[diagnostic.nextStep] || nextStepConfig.analysis;

  return (
    <div className="bg-surface border border-outline-variant rounded-lg overflow-hidden animate-slide-up">
      {/* Header */}
      <div className="bg-surface-container p-6 border-b border-outline-variant">
        <div className="flex items-center gap-2 mb-2">
          <span className="material-symbols-outlined text-primary">assignment</span>
          <span className="font-mono text-label-md text-primary">
            DIAGNÓSTICO CÓDIGO BINÁRIO
          </span>
        </div>
        <p className="font-mono text-label-sm text-on-surface-variant">
          Relatório técnico de avaliação
        </p>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Problem */}
        <div>
          <h4 className="font-mono text-label-md text-on-surface-variant mb-1">
            Problema Identificado
          </h4>
          <p className="font-mono text-body-sm text-on-surface">
            {diagnostic.problemIdentified}
          </p>
        </div>

        {/* Process */}
        {diagnostic.processAffected && (
          <div>
            <h4 className="font-mono text-label-md text-on-surface-variant mb-1">
              Processo Afectado
            </h4>
            <p className="font-mono text-body-sm text-on-surface">
              {diagnostic.processAffected}
            </p>
          </div>
        )}

        {/* Impact */}
        {diagnostic.impactEstimated && (
          <div>
            <h4 className="font-mono text-label-md text-on-surface-variant mb-1">
              Impacto Estimado
            </h4>
            <p className="font-mono text-body-sm text-on-surface">
              {diagnostic.impactEstimated}
            </p>
          </div>
        )}

        {/* Solution */}
        {diagnostic.solutionRecommended && (
          <div>
            <h4 className="font-mono text-label-md text-on-surface-variant mb-1">
              Solução Recomendada
            </h4>
            <p className="font-mono text-body-sm text-on-surface">
              {diagnostic.solutionRecommended}
            </p>
          </div>
        )}

        {/* Technologies */}
        {diagnostic.technologiesNeeded && diagnostic.technologiesNeeded.length > 0 && (
          <div>
            <h4 className="font-mono text-label-md text-on-surface-variant mb-2">
              Tecnologias Necessárias
            </h4>
            <div className="flex flex-wrap gap-2">
              {diagnostic.technologiesNeeded.map((tech) => (
                <span
                  key={tech}
                  className="bg-primary-container/20 text-primary border border-primary-container font-mono text-label-sm px-3 py-1 rounded"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Complexity + Next Step */}
        <div className="grid grid-cols-2 gap-4">
          <div className={`${complexity.bg} rounded-lg p-4`}>
            <h4 className="font-mono text-label-md text-on-surface-variant mb-1">
              Complexidade
            </h4>
            <span className={`font-mono text-body-md font-bold ${complexity.color}`}>
              {complexity.label}
            </span>
          </div>
          <div className="bg-surface-container rounded-lg p-4">
            <h4 className="font-mono text-label-md text-on-surface-variant mb-1">
              Próximo Passo
            </h4>
            <span className="font-mono text-body-md font-bold text-on-surface block">
              {nextStep.label}
            </span>
            <p className="font-mono text-label-sm text-on-surface-variant mt-1">
              {nextStep.description}
            </p>
          </div>
        </div>

        {/* Confidence */}
        <div className="flex items-center gap-3 pt-4 border-t border-outline-variant">
          <span className="font-mono text-label-sm text-outline">Confiança:</span>
          <div className="flex-1 h-2 bg-surface-container-lowest rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${(diagnostic.confidence || 0) * 100}%` }}
            />
          </div>
          <span className="font-mono text-label-sm text-on-surface-variant">
            {Math.round((diagnostic.confidence || 0) * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
}
