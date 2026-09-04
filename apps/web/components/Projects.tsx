import Link from 'next/link';

export default function Projects() {
  return (
    <section className="w-full px-gutter-desktop py-space-lg bgSurfaceDim grid grid-cols-1 lg:grid-cols-12 gapSpaceBase">
      {/* LEFT PANEL: PROJECT 001 */}
      <article className="lg:col-span-6 bgSurfaceContainerLow flex flex-col justify-between shadowXL transitionAll">
        <div className="pSpaceLg flex flex-col gapSpaceMd">
          {/* Top bar of the card */}
          <div className="flex items-center justify-between pbSpaceSm bgSurfaceContainerLowest pSpaceSm">
            <div className="flex items-center gapSpaceSm fontLabelSm textLabelSm">
              <span className="w-2.5 h-2.5 bgPrimary" />
              <span className="textPrimary fontBold trackingWider">PROJECT_001 // SYNAPSE_VLM</span>
            </div>
            <span className="pxSpaceSm pySpace2xs bgPrimary/10 textPrimary fontCodeTelemetry textCodeTelemetry">
              [PRODUCTION // STABLE]
            </span>
          </div>

          {/* System Identification */}
          <div className="flex flex-col gapSpace2xs">
            <span className="fontCodeTelemetry textCodeTelemetry textSecondary uppercase trackingWidest">
              SYSTEM TYPE
            </span>
            <span className="fontHeadlineMd textHeadlineMd textOnSurface">
              Autonomous Document & ERP Ingestion Engine
            </span>
          </div>

          {/* Description */}
          <p className="fontBodyMd textBodyMd textOnSurfaceVariant">
            Sistema autônomo de extração de faturas e reconciliação fiscal para integração determinística com ERP corporativo. Elimina redundância operacional via processamento vetorial assíncrono com inferência multimodal.
          </p>

          {/* Technical Telemetry Matrix */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gapSpaceXs ptSpaceXs">
            <div className="bgSurfaceContainerLowest pSpaceSm flex flex-col">
              <span className="fontLabelSm textLabelSm textOutline uppercase">LATENCY THRESHOLD</span>
              <span className="fontHeadlineMd textHeadlineMd textPrimary">{'< 2.8s'}</span>
              <span className="fontCodeTelemetry textCodeTelemetry textOnSurfaceVariant">End-to-end parsed</span>
            </div>
            <div className="bgSurfaceContainerLowest pSpaceSm flex flex-col">
              <span className="fontLabelSm textLabelSm textOutline uppercase">BOTTLENECK</span>
              <span className="fontHeadlineMd textHeadlineMd textSecondary">0.00%</span>
              <span className="fontCodeTelemetry textCodeTelemetry textOnSurfaceVariant">Zero Human Dependency</span>
            </div>
            <div className="bgSurfaceContainerLowest pSpaceSm flex flex-col">
              <span className="fontLabelSm textLabelSm textOutline uppercase">VERIFICATION</span>
              <span className="fontHeadlineMd textHeadlineMd textOnSurface">STRICT</span>
              <span className="fontCodeTelemetry textCodeTelemetry textOnSurfaceVariant">Pydantic Type Safe</span>
            </div>
          </div>

          {/* Stack Blueprint Chips */}
          <div className="flex flex-col gapSpace2xs">
            <span className="fontCodeTelemetry textCodeTelemetry textOutline uppercase">CORE STACK ARCHITECTURE:</span>
            <div className="flex flex-wrap gapSpaceXs fontCodeTelemetry textCodeTelemetry">
              <span className="pxSpaceSm pySpace2xs bgSurface textOnSurface">Fastify v4</span>
              <span className="pxSpaceSm pySpace2xs bgSurface textOnSurface">TypeScript Strict</span>
              <span className="pxSpaceSm pySpace2xs bgPrimary">pgvector (HNSW)</span>
              <span className="pxSpaceSm pySpace2xs bgSurface textOnSurface">Python 3.12 Engine</span>
              <span className="pxSpaceSm pySpace2xs bgSurface textOnSurface">Docker Sandbox</span>
            </div>
          </div>
        </div>

        {/* Action Panel */}
        <div className="pSpaceMd bgSurfaceContainerLowest flex items-center justify-between gapSpaceSm">
          <span className="fontCodeTelemetry textCodeTelemetry textOutline">ENDPOINT: GET /api/projects/PROJECT_001</span>
          <button
            className="pxSpaceMd pySpaceXs bgPrimary textOnPrimary fontLabelSm textLabelSm fontBold uppercase trackingWider hover:bgPrimaryContainer transitionAll"
            type="button"
          >
            INSPECT CONTROL PANEL ↓
          </button>
        </div>
      </article>

      {/* RIGHT PANEL: PROJECT 002 */}
      <article className="lg:col-span-6 bgSurfaceContainerLow flex flex-col justify-between shadowXL transitionAll">
        <div className="pSpaceLg flex flex-col gapSpaceMd">
          {/* Top bar of the card */}
          <div className="flex items-center justify-between pbSpaceSm bgSurfaceContainerLowest pSpaceSm">
            <div className="flex items-center gapSpaceSm fontLabelSm textLabelSm">
              <span className="w-2.5 h-2.5 bgSecondary animatePulse" />
              <span className="textSecondary fontBold trackingWider">PROJECT_002 // KERNEL_OBSERVER</span>
            </div>
            <span className="pxSpaceSm pySpace2xs bgSecondary/10 textSecondary fontCodeTelemetry textCodeTelemetry">
              [STAGING // BENCHMARKING]
            </span>
          </div>

          {/* System Identification */}
          <div className="flex flex-col gapSpace2xs">
            <span className="fontCodeTelemetry textCodeTelemetry textSecondary uppercase trackingWidest">
              SYSTEM TYPE
            </span>
            <span className="fontHeadlineMd textHeadlineMd textOnSurface">
              Telemetry & Multi-Agent Network Orchestrator
            </span>
          </div>

          {/* Description */}
          <p className="fontBodyMd textBodyMd textOnSurfaceVariant">
            Orquestrador de nós de inferência distribuída para auditoria contínua de contratos e conformidade de dados. Topologia de grafos cíclicos supervisionados com verificação de segurança em tempo real.
          </p>

          {/* Technical Telemetry Matrix */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gapSpaceXs ptSpaceXs">
            <div className="bgSurfaceContainerLowest pSpaceSm flex flex-col">
              <span className="fontLabelSm textLabelSm textOutline uppercase">CONCURRENCY</span>
              <span className="fontHeadlineMd textHeadlineMd textSecondary">64k NODES</span>
              <span className="fontCodeTelemetry textCodeTelemetry textOnSurfaceVariant">Async Tokio Runtime</span>
            </div>
            <div className="bgSurfaceContainerLowest pSpaceSm flex flex-col">
              <span className="fontLabelSm textLabelSm textOutline uppercase">SYNC OVERHEAD</span>
              <span className="fontHeadlineMd textHeadlineMd textPrimary">{'< 14ms'}</span>
              <span className="fontCodeTelemetry textCodeTelemetry textOnSurfaceVariant">Redis Pub/Sub Bus</span>
            </div>
            <div className="bgSurfaceContainerLowest pSpaceSm flex flex-col">
              <span className="fontLabelSm textLabelSm textOutline uppercase">AUDIT CONVERGENCE</span>
              <span className="fontHeadlineMd textHeadlineMd textOnSurface">99.998%</span>
              <span className="fontCodeTelemetry textCodeTelemetry textOnSurfaceVariant">LangGraph States</span>
            </div>
          </div>

          {/* Stack Blueprint Chips */}
          <div className="flex flex-col gapSpace2xs">
            <span className="fontCodeTelemetry textCodeTelemetry textOutline uppercase">CORE STACK ARCHITECTURE:</span>
            <div className="flex flex-wrap gapSpaceXs fontCodeTelemetry textCodeTelemetry">
              <span className="pxSpaceSm pySpace2xs bgSurface textSecondary">Rust (Core Agent)</span>
              <span className="pxSpaceSm pySpace2xs bgSurface textOnSurface">LangGraph Nodes</span>
              <span className="pxSpaceSm pySpace2xs bgSurface textOnSurface">Supabase Auth/WAL</span>
              <span className="pxSpaceSm pySpace2xs bgPrimary">Redis Streams</span>
              <span className="pxSpaceSm pySpace2xs bgSurface textOnSurface">gRPC Protobuf</span>
            </div>
          </div>
        </div>

        {/* Action Panel */}
        <div className="pSpaceMd bgSurfaceContainerLowest flex items-center justify-between gapSpaceSm">
          <span className="fontCodeTelemetry textCodeTelemetry textOutline">ENDPOINT: GET /api/projects/PROJECT_002</span>
          <button
            className="pxSpaceMd pySpaceXs bgSurfaceHigh textSecondary hover:textOnSurface fontLabelSm textLabelSm uppercase trackingWider transitionColours"
            type="button"
          >
            [BENCHMARK_STREAM]
          </button>
        </div>
      </article>
    </section>
  );
}