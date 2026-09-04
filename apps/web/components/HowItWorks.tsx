import Link from 'next/link';

export default function HowItWorks() {
  return (
    <section className="w-full bg-surfaceContainerLow px-gutter-desktop py-space-3xl border-b border-surfaceContainerHigh/40">
      <div className="max-w-7xl mx-auto flex flex-col gap-space-2xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
          <div className="flex flex-col gap-space-xs max-w-2xl">
            <div className="fontLabelSm textLabelSm uppercase trackingWidest textSecondary">{'// CAPACIDADES DE ENGENHARIA'}</div>
            <h2 className="fontHeadlineLg textHeadlineLg uppercase textOnSurface trackingTight">SISTEMAS QUE CONVERTEM COMPLEXIDADE EM CONTROLE</h2>
            <p className="fontBodyMd textBodyMd textOnSurfaceVariant">Motores digitais e autônomos desenhados para escala corporativa.</p>
          </div>
          <Link href="/solutions">
            <a className="textPrimary fontLabelMd textLabelMd uppercase trackingWider flex items-center gap-space-xs hover:underline">
              <span>VER SOLUÇÕES</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </a>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-xl pt-space-sm">
          {/* Capacity 1 */}
          <div className="flex flex-col gap-space-xs">
            <div className="fontHeadlineMd textHeadlineMd textOnSurface uppercase">AI Systems & Copilots</div>
            <p className="fontBodyMd textBodyMd textOnSurfaceVariant">
              Agentes autônomos com raciocínio contextual e memória de longo prazo para operações críticas.
            </p>
          </div>

          {/* Capacity 2 */}
          <div className="flex flex-col gap-space-xs">
            <div className="fontHeadlineMd textHeadlineMd textOnSurface uppercase">Business Automation</div>
            <p className="fontBodyMd textBodyMd textOnSurfaceVariant">
              Extração, normalização e encaminhamento inteligente de fluxos e documentos não estruturados.
            </p>
          </div>

          {/* Capacity 3 */}
          <div className="flex flex-col gap-space-xs">
            <div className="fontHeadlineMd textHeadlineMd textOnSurface uppercase">Custom Software Platforms</div>
            <p className="fontBodyMd textBodyMd textOnSurfaceVariant">
              Aplicações web e consoles de dados de ultra-baixa latência construídos com rigor técnico.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}