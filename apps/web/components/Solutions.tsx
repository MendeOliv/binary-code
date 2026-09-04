

export default function Solutions() {
  return (
    <section className="w-full px-gutter-desktop py-space-2xl bg-background">
      <div className="max-w-7xl mx-auto flex flex-col gap-space-xl">
        {/* Category Filter */}
        <div className="w-full flex flex-wrap items-center justify-between gap-space-sm bgSurfaceContainerLowest p-space-sm">
          <div className="flex flex-wrap items-center gap-space-xs">
            <button
              className="pxSpaceMd pySpaceXs bgPrimary textOnPrimary fontBold flex items-center gap-space-2s"
              type="button"
            >
              <span className="w-1.5 h-1.5 bgPrimary" />
              ALL_ARCHITECTURES [6]
            </button>
            <button
              className="pxSpaceMd pySpaceXs bgSurfaceHigh textOnSurfaceVariant fontLabelSm textLabelSm hover:textOnSurface hover:bgSurface transitionColours"
              type="button"
            >
              AI_AGENTS
            </button>
            <button
              className="pxSpaceMd pySpaceXs bgSurfaceHigh textOnSurfaceVariant fontLabelSm textLabelSm hover:textOnSurface hover:bgSurface transitionColours"
              type="button"
            >
              AUTOMATION_VLM
            </button>
            <button
              className="pxSpaceMd pySpaceXs bgSurfaceHigh textOnSurfaceVariant fontLabelSm textLabelSm hover:textOnSurface hover:bgSurface transitionColours"
              type="button"
            >
              DATA_VECTOR
            </button>
            <button
              className="pxSpaceMd pySpaceXs bgSurfaceHigh textOnSurfaceVariant fontLabelSm textLabelSm hover:textOnSurface hover:bgSurface transitionColours"
              type="button"
            >
              LEGACY_BRIDGES
            </button>
          </div>

          <div className="fontCodeTelemetry textCodeTelemetry textOutline flex items-center gap-space-xs">
            <span className="textSecondary">INDEXING_MODE:</span>
            <span className="">DETERMINISTIC_ISOLATION</span>
          </div>
        </div>

        {/* Solutions Mosaic */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gapSpaceLg">
          {/* Solution Card 01: AI.SYSTEMS */}
          <div
            className="group bgSurfaceContainerLow pSpaceLg flex flex-col justify-between transitionAll duration-200 hover:bgSurface shadowSm hover:shadow-[0_0_24px_rgba(78,222,163,0.12)]"
          >
            <div className="flex flex-col gap-space-lg">
              <div className="flex items-center justify-between pbSpaceXs borderB borderSurfaceContainerHigh/60">
                <span className="fontCodeTelemetry textCodeTelemetry textPrimary fontBold">01 // AI.SYSTEMS</span>
                <span className="fontCodeTelemetry text-[10px] textOutline trackingWider">STATUS: DEPLOYABLE</span>
              </div>
              <div>
                <h2 className="fontHeadlineLg textHeadlineLg textOnSurface groupHover:textPrimary transitionColours">
                  01. Agentes Autônomos & Copilotos Corporativos
                </h2>
                <p className="fontBodyLg textBodyLg textOnSurfaceVariant mtSpaceSm leadingRelaxed">
                  Orquestração de agentes autônomos com tool calling, memória semântica persistente e roteamento multi-modelo com tolerância a falhas.
                </p>
              </div>
              <div className="ptSpaceXl">
                <a
                  className="fontLabelMd textLabelMd fontBold textPrimary hover:textOnSurface flex items-center gapSpaceXs transitionColours"
                  href="#"
                >
                  <span>[ VER ARQUITETURA DETALHADA → ]</span>
                </a>
              </div>
            </div>

            {/* Usage cases */}
            <div className="ptSpaceXl">
              <span className="fontLabelSm textLabelSm textOutline uppercase trackingWider">{'// CASOS DE USO EM PRODUÇÃO:'}</span>
              <ul className="flex flex-col gapSpaceXs">
                <li className="fontBodyMd textBodyMd textOnSurface flex items-center gapSpaceXs">
                  <span className="textPrimary">—</span> Operações financeiras complexas e reconciliação contábil
                </li>
                <li className="fontBodyMd textBodyMd textOnSurface flex items-center gapSpaceXs">
                  <span className="textPrimary">—</span> Suporte técnico L3 autônomo com resolução de tickets
                </li>
                <li className="fontBodyMd textBodyMd textOnSurface flex items-center gapSpaceXs">
                  <span className="textPrimary">—</span> Copilotos jurídicos e operacionais orientados a conformidade
                </li>
              </ul>
            </div>
          </div>

          {/* Solution Card 02: AUTOMATION */}
          <div
            className="group bgSurfaceContainerLow pSpaceLg flex flex-col justify-between transitionAll duration-200 hover:bgSurface shadowSm hover:shadow-[0_0_24px_rgba(76,215,246,0.12)]"
          >
            <div className="flex flex-col gap-space-lg">
              <div className="flex items-center justify-between pbSpaceXs borderB borderSurfaceContainerHigh/60">
                <span className="fontCodeTelemetry textCodeTelemetry textSecondary fontBold">02 // AUTOMATION</span>
                <span className="fontCodeTelemetry text-[10px] textOutline trackingWider">STATUS: READY</span>
              </div>
              <div>
                <h2 className="fontHeadlineLg textHeadlineLg textOnSurface groupHover:textSecondary transitionColours">
                  02. Automação de Processos & Extração VLM
                </h2>
                <p className="fontBodyLg textBodyLg textOnSurfaceVariant mtSpaceSm leadingRelaxed">
                  Eliminação sistemática de gargalos operacionais analógicos com processamento inteligente de documentos, esquemas rígidos e reconciliação em tempo real.
                </p>
              </div>
              <div className="ptSpaceXl">
                <a
                  className="fontLabelMd textLabelMd fontBold textSecondary hover:textOnSurface flex items-center gapSpaceXs transitionColours"
                  href="#"
                >
                  <span>[ EXPLORAR CASOS DE USO → ]</span>
                </a>
              </div>
            </div>

            {/* Usage cases */}
            <div className="ptSpaceXl">
              <span className="fontLabelSm textLabelSm textOutline uppercase trackingWider">{'// CASOS DE USO EM PRODUÇÃO:'}</span>
              <ul className="flex flex-col gapSpaceXs">
                <li className="fontBodyMd textBodyMd textOnSurface flex items-center gapSpaceXs">
                  <span className="textSecondary">—</span> Conciliação fiscal massiva e cruzamento de notas fiscais
                </li>
                <li className="fontBodyMd textBodyMd textOnSurface flex items-center gapSpaceXs">
                  <span className="textSecondary">—</span> Triagem alfandegária e desembaraço logístico autônomo
                </li>
                <li className="fontBodyMd textBodyMd textOnSurface flex items-center gapSpaceXs">
                  <span className="textSecondary">—</span> Regulação de sinistros e onboarding regulatório estruturado
                </li>
              </ul>
            </div>
          </div>

          {/* Solution Card 03: DATA.SYSTEMS */}
          <div
            className="group bgSurfaceContainerLow pSpaceLg flex flex-col justify-between transitionAll duration-200 hover:bgSurface shadowSm hover:shadow-[0_0_24px_rgba(78,222,163,0.12)]"
          >
            <div className="flex flex-col gap-space-lg">
              <div className="flex items-center justify-between pbSpaceXs borderB borderSurfaceContainerHigh/60">
                <span className="fontCodeTelemetry textCodeTelemetry textPrimary fontBold">03 // DATA.SYSTEMS</span>
                <span className="fontCodeTelemetry text-[10px] textOutline trackingWider">STATUS: PRODUCTION</span>
              </div>
              <div>
                <h2 className="fontHeadlineLg textHeadlineLg textOnSurface groupHover:textPrimary transitionColours">
                  03. Pipelines de Dados Inteligentes & Vetorização
                </h2>
                <p className="fontBodyLg textBodyLg textOnSurfaceVariant mtSpaceSm leadingRelaxed">
                  Ingestão de dados em streaming, unificação de silos corporativos, estratégias de chunking contextual e bancos de dados vetoriais desacoplados em Postgres.
                </p>
              </div>
              <div className="ptSpaceXl">
                <a
                  className="fontLabelMd textLabelMd fontBold textPrimary hover:textOnSurface flex items-center gapSpaceXs transitionColours"
                  href="#"
                >
                  <span>[ AUDITAR SEUS DADOS → ]</span>
                </a>
              </div>
            </div>

            {/* Usage cases */}
            <div className="ptSpaceXl">
              <span className="fontLabelSm textLabelSm textOutline uppercase trackingWider">{'// CASOS DE USO EM PRODUÇÃO:'}</span>
              <ul className="flex flex-col gapSpaceXs">
                <li className="fontBodyMd textBodyMd textOnSurface flex items-center gapSpaceXs">
                  <span className="textPrimary">—</span> Busca semântica corporativa profunda em milhões de registros
                </li>
                <li className="fontBodyMd textBodyMd textOnSurface flex items-center gapSpaceXs">
                  <span className="textPrimary">—</span> Detecção de anomalias em telemetria e séries temporais
                </li>
                <li className="fontBodyMd textBodyMd textOnSurface flex items-center gapSpaceXs">
                  <span className="textPrimary">—</span> Modelagem preditiva de demanda e comportamento B2B
                </li>
              </ul>
            </div>
          </div>

          {/* Solution Card 04: SOFTWARE */}
          <div
            className="group bgSurfaceContainerLow pSpaceLg flex flex-col justify-between transitionAll duration-200 hover:bgSurface shadowSm hover:shadow-[0_0_24px_rgba(78,222,163,0.12)]"
          >
            <div className="flex flex-col gap-space-lg">
              <div className="flex items-center justify-between pbSpaceXs borderB borderSurfaceContainerHigh/60">
                <span className="fontCodeTelemetry textCodeTelemetry textTertiary fontBold">04 // SOFTWARE</span>
                <span className="fontCodeTelemetry text-[10px] textOutline trackingWider">STATUS: HARDENED</span>
              </div>
              <div>
                <h2 className="fontHeadlineLg textHeadlineLg textOnSurface groupHover:textTertiary transitionColours">
                  04. Plataformas de Baixa Latência Sob Medida
                </h2>
                <p className="fontBodyLg textBodyLg textOnSurfaceVariant mtSpaceSm leadingRelaxed">
                  Engenharia de software moderna e resiliente com microsserviços em Fastify e TypeScript com latência sub-20ms e consoles de controle em Next.js.
                </p>
              </div>
              <div className="ptSpaceXl">
                <a
                  className="fontLabelMd textLabelMd fontBold textTertiary hover:textOnSurface flex items-center gapSpaceXs transitionColours"
                  href="#"
                >
                  <span>[ VER CAPACIDADES DE SOFTWARE → ]</span>
                </a>
              </div>
            </div>

            {/* Usage cases */}
            <div className="ptSpaceXl">
              <span className="fontLabelSm textLabelSm textOutline uppercase trackingWider">{'// CASOS DE USO EM PRODUÇÃO:'}</span>
              <ul className="flex flex-col gapSpaceXs">
                <li className="fontBodyMd textBodyMd textOnSurface flex items-center gapSpaceXs">
                  <span className="textTertiary">—</span> Plataformas web B2B com tolerância zero a latência
                </li>
                <li className="fontBodyMd textBodyMd textOnSurface flex items-center gapSpaceXs">
                  <span className="textTertiary">—</span> Portais operacionais de alta densidade informativa
                </li>
                <li className="fontBodyMd textBodyMd textOnSurface flex items-center gapSpaceXs">
                  <span className="textTertiary">—</span> Painéis de comando em tempo real para frotas e ativos industriais
                </li>
              </ul>
            </div>
          </div>

          {/* Solution Card 05: COMPUTER.VISION */}
          <div
            className="group bgSurfaceContainerLow pSpaceLg flex flex-col justify-between transitionAll duration-200 hover:bgSurface shadowSm hover:shadow-[0_0_24px_rgba(78,222,163,0.12)]"
          >
            <div className="flex flex-col gap-space-lg">
              <div className="flex items-center justify-between pbSpaceXs borderB borderSurfaceContainerHigh/60">
                <span className="fontCodeTelemetry textCodeTelemetry textPrimary fontBold">05 // COMPUTER.VISION</span>
                <span className="fontCodeTelemetry text-[10px] textOutline trackingWider">STATUS: REALTIME</span>
              </div>
              <div>
                <h2 className="fontHeadlineLg textHeadlineLg textOnSurface groupHover:textPrimary transitionColours">
                  05. Visão Computacional de Borda
                </h2>
                <p className="fontBodyLg textBodyLg textOnSurfaceVariant mtSpaceSm leadingRelaxed">
                  Modelos de visão computacional na borda (edge AI) e na nuvem para controle de qualidade industrial, telemetria segura e detecção de anomalias espaciais.
                </p>
              </div>
              <div className="ptSpaceXl">
                <a
                  className="fontLabelMd textLabelMd fontBold textPrimary hover:textOnSurface flex items-center gapSpaceXs transitionColours"
                  href="#"
                >
                  <span>[ EXPLORAR EDGE VISION → ]</span>
                </a>
              </div>
            </div>

            {/* Usage cases */}
            <div className="ptSpaceXl">
              <span className="fontLabelSm textLabelSm textOutline uppercase trackingWider">{'// CASOS DE USO EM PRODUÇÃO:'}</span>
              <ul className="flex flex-col gapSpaceXs">
                <li className="fontBodyMd textBodyMd textOnSurface flex items-center gapSpaceXs">
                  <span className="textPrimary">—</span> Inspeção fabril automatizada com detecção micrométrica de defeitos
                </li>
                <li className="fontBodyMd textBodyMd textOnSurface flex items-center gapSpaceXs">
                  <span className="textPrimary">—</span> Segurança perimetral com análise comportamental via IA
                </li>
                <li className="fontBodyMd textBodyMd textOnSurface flex items-center gapSpaceXs">
                  <span className="textPrimary">—</span> Rastreamento e classificação em esteiras de alta velocidade
                </li>
              </ul>
            </div>
          </div>

          {/* Solution Card 06: AI.INTEGRATION */}
          <div
            className="group bgSurfaceContainerLow pSpaceLg flex flex-col justify-between transitionAll duration-200 hover:bgSurface shadowSm hover:shadow-[0_0_24px_rgba(76,215,246,0.12)]"
          >
            <div className="flex flex-col gap-space-lg">
              <div className="flex items-center justify-between pbSpaceXs borderB borderSurfaceContainerHigh/60">
                <span className="fontCodeTelemetry textCodeTelemetry textSecondary fontBold">06 // AI.INTEGRATION</span>
                <span className="fontCodeTelemetry text-[10px] textOutline trackingWider">STATUS: FIELD_TESTED</span>
              </div>
              <div>
                <h2 className="fontHeadlineLg textHeadlineLg textOnSurface groupHover:textSecondary transitionColours">
                  06. Integração Cirúrgica em Sistemas Legados
                </h2>
                <p className="fontBodyLg textBodyLg textOnSurfaceVariant mtSpaceSm leadingRelaxed">
                  Acoplamento cirúrgico de novas camadas de inteligência artificial em sistemas legados (SAP, TOTVS, Salesforce, AS400) sem reconstrução traumática.
                </p>
              </div>
              <div className="ptSpaceXl">
                <a
                  className="fontLabelMd textLabelMd fontBold textSecondary hover:textOnSurface flex items-center gapSpaceXs transitionColours"
                  href="#"
                >
                  <span>[ INTEGRAR SISTEMA LEGADO → ]</span>
                </a>
              </div>
            </div>

            {/* Usage cases */}
            <div className="ptSpaceXl">
              <span className="fontLabelSm textLabelSm textOutline uppercase trackingWider">{'// CASOS DE USO EM PRODUÇÃO:'}</span>
              <ul className="flex flex-col gapSpaceXs">
                <li className="fontBodyMd textBodyMd textOnSurface flex items-center gapSpaceXs">
                  <span className="textSecondary">—</span> Conexão assíncrona entre ERPs legados e APIs de IA modernas
                </li>
                <li className="fontBodyMd textBodyMd textOnSurface flex items-center gapSpaceXs">
                  <span className="textSecondary">—</span> Wrappers de conformidade regulatória e auditoria contínua
                </li>
                <li className="fontBodyMd textBodyMd textOnSurface flex items-center gapSpaceXs">
                  <span className="textSecondary">—</span> Auditoria e validação de integridade transacional em AS400
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}