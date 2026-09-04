

export default function Services() {
  return (
    <section className="w-full bg-surface px-gutter-desktop py-space-3xl border-b border-surfaceContainerHigh/40">
      <div className="max-w-7xl mx-auto flex flex-col gap-space-2xl">
        <div className="flex flex-col gap-space-xs max-w-2xl">
          <div className="fontLabelSm textLabelSm uppercase trackingWidest textSecondary">{'// PIPELINE DE ENGENHARIA'}</div>
          <h2 className="fontHeadlineLg textHeadlineLg uppercase textOnSurface trackingTight">DA AMBIGUIDADE AO SISTEMA OPERACIONAL</h2>
          <p className="fontBodyMd textBodyMd textOnSurfaceVariant">Arquitetura de primeiro princípio através de um ciclo irrevogável de engenharia.</p>
        </div>

        {/* 5-phase engineering grid - matches reference */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gapSpaceLg pt-space-md">
          {/* Phase 01: Discover */}
          <div className="flex flex-col gap-space-sm">
            <div className="fontHeadlineLg textHeadlineLg fontBold textPrimary">01</div>
            <div className="fontLabelMd textLabelMd uppercase trackingWider textOnSurface fontSemibold">DISCOVER</div>
            <p className="fontBodySm textBodySm textOnSurfaceVariant leadingRelaxed">
              Mapeamento milimétrico de gargalos humanos e viabilidade técnica.
            </p>
          </div>

          {/* Phase 02: Architect */}
          <div className="flex flex-col gap-space-sm">
            <div className="fontHeadlineLg textHeadlineLg fontBold textSecondary">02</div>
            <div className="fontLabelMd textLabelMd uppercase trackingWider textOnSurface fontSemibold">ARCHITECT</div>
            <p className="fontBodySm textBodySm textOnSurfaceVariant leadingRelaxed">
              Modelagem de grafos de decisão, vetores e segurança por design.
            </p>
          </div>

          {/* Phase 03: Engineer */}
          <div className="flex flex-col gap-space-sm">
            <div className="fontHeadlineLg textHeadlineLg fontBold textPrimary">03</div>
            <div className="fontLabelMd textLabelMd uppercase trackingWider textOnSurface fontSemibold">ENGINEER</div>
            <p className="fontBodySm textBodySm textOnSurfaceVariant leadingRelaxed">
              Código determinístico de alta performance em TypeScript, Rust e Python.
            </p>
          </div>

          {/* Phase 04: Optimize */}
          <div className="flex flex-col gap-space-sm">
            <div className="fontHeadlineLg textHeadlineLg fontBold textSecondary">04</div>
            <div className="fontLabelMd textLabelMd uppercase trackingWider textOnSurface fontSemibold">OPTIMIZE</div>
            <p className="fontBodySm textBodySm textOnSurfaceVariant leadingRelaxed">
              Performance tuning, resource allocation e escalabilidade automática.
            </p>
          </div>

          {/* Phase 05: Deploy */}
          <div className="flex flex-col gap-space-sm">
            <div className="fontHeadlineLg textHeadlineLg fontBold textPrimary">05</div>
            <div className="fontLabelMd textLabelMd uppercase trackingWider textOnSurface fontSemibold">DEPLOY</div>
            <p className="fontBodySm textBodySm textOnSurfaceVariant leadingRelaxed">
              Deploy contínuo com monitoramento de integridade e validação de SLOs.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}