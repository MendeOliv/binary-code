import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { developers } from '../lib/developers';

export default function DevelopersPage() {
  return (
    <>
      <Head>
        <title>Developers — Código Binário</title>
        <meta
          name="description"
          content="Conheça os engenheiros da Código Binário: Elisio Nascimento, Mendes Bessa e Mbumba Guilherme. Engenharia, método e pessoas."
        />
      </Head>

      {/* Telemetry sub-ribbon */}
      <section className="w-full bg-surface-container-lowest px-gutter-mobile md:px-margin py-space-sm border-b border-border-subtle">
        <div className="max-w-[1240px] mx-auto flex flex-wrap items-center justify-between gap-space-sm text-body-sm text-text-secondary">
          <div className="flex items-center gap-space-sm">
            <span className="w-2 h-2 rounded-full bg-primary" aria-hidden="true" />
            <span className="font-medium text-on-surface">Corpo de Engenharia &amp; Arquitetura</span>
            <span className="text-outline-variant" aria-hidden="true">·</span>
            <span className="text-text-secondary">Especialistas Dedicados</span>
          </div>
          <div className="flex items-center gap-space-md font-label-code text-label-code text-text-secondary">
            <span>Engenharia Informática</span>
            <span className="hidden sm:inline text-outline-variant" aria-hidden="true">•</span>
            <span className="hidden sm:inline text-primary">Inteligência, Sistemas e Soluções Digitais</span>
          </div>
        </div>
      </section>

      {/* Section header */}
      <section className="relative w-full px-gutter-mobile md:px-margin pt-space-xl pb-space-lg overflow-hidden">
        <div className="max-w-[1240px] mx-auto flex flex-col gap-space-md relative">
          <div className="flex items-center gap-space-xs text-primary font-label-telemetry text-label-telemetry uppercase tracking-wider">
            <span>Equipe Técnica</span>
            <span aria-hidden="true">·</span>
            <span>Liderança de Engenharia</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-md items-end">
            <div className="lg:col-span-8 flex flex-col gap-space-xs">
              <h1 className="font-display text-display-mobile md:text-display tracking-tight text-text-primary font-bold">
                Engenharia, Método &amp; Pessoas
              </h1>
              <p className="font-body-lg text-body-md md:text-body-lg text-text-secondary max-w-2xl">
                Conheça os engenheiros que desenham, arquitetam e operam sistemas computacionais de
                missão crítica e alta disponibilidade.
              </p>
            </div>
            <div className="lg:col-span-4 flex lg:justify-end pb-space-xs">
              <div className="px-space-md py-space-sm bg-surface-container rounded flex items-center gap-space-sm border border-border-subtle shadow-sm">
                <span className="material-symbols-outlined text-primary text-xl" aria-hidden="true">groups</span>
                <span className="font-body-sm text-body-sm text-on-surface font-medium">
                  3 Especialistas
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team directory */}
      <section className="w-full px-gutter-mobile md:px-margin pb-space-xl">
        <div className="max-w-[1240px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-space-lg">
          {developers.map((dev) => (
            <article
              key={dev.slug}
              className="flex flex-col bg-surface-container rounded-xl overflow-hidden border border-border-subtle hover:border-border-highlight transition-all duration-300 shadow-card group"
            >
              <div className="relative w-full aspect-[4/5] overflow-hidden bg-surface-container-high">
                <Image
                  src={dev.photo}
                  alt={dev.photoAlt}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  className="object-cover object-top grayscale contrast-125 group-hover:grayscale-0 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg-surface-base via-transparent to-transparent opacity-70 pointer-events-none" aria-hidden="true" />
                <div className="absolute top-space-md right-space-md flex items-center gap-1.5 px-space-sm py-0.5 rounded bg-bg-surface-base/90 border border-border-subtle">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-container animate-pulse" aria-hidden="true" />
                  <span className="font-label-telemetry text-label-telemetry text-primary uppercase">
                    {dev.node}
                  </span>
                </div>
                <div className="absolute bottom-space-md left-space-md font-label-telemetry text-label-telemetry text-text-secondary uppercase">
                  {dev.focusTags.join(' • ')}
                </div>
              </div>

              <div className="p-space-lg flex flex-col flex-grow gap-space-md">
                <div className="flex flex-col gap-1">
                  <h2 className="font-headline-md text-headline-md text-text-primary">{dev.name}</h2>
                  <p className="text-primary font-body-sm font-medium">{dev.shortRole}</p>
                  <p className="font-body-sm text-body-sm text-text-secondary leading-relaxed mt-space-xs">
                    {dev.shortBio}
                  </p>
                </div>

                <div className="mt-auto flex flex-col gap-space-sm">
                  <div className="flex flex-wrap gap-1">
                    {dev.focusTags.map((tag) => (
                      <span
                        key={tag}
                        className="px-space-sm py-0.5 rounded bg-bg-surface-base border border-border-subtle font-label-telemetry text-label-telemetry text-on-surface-variant"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <Link
                    href={`/developers/${dev.slug}`}
                    className="inline-flex items-center justify-center gap-2 w-full border border-border-subtle bg-surface-container-high text-text-primary font-label-code text-label-code uppercase tracking-wider px-4 py-2.5 hover:border-primary hover:text-primary transition-colors"
                  >
                    VER PERFIL
                    <span className="material-symbols-outlined text-[16px]" aria-hidden="true">arrow_forward</span>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* EOF decorator */}
      <div className="w-full px-gutter-mobile md:px-margin pb-space-xl">
        <div className="max-w-[1240px] mx-auto border-t border-border-subtle pt-4 flex justify-between items-center opacity-60">
          <span className="font-label-telemetry text-label-telemetry text-primary">EOF_REACHED</span>
          <span className="font-label-telemetry text-label-telemetry text-on-surface-variant tracking-[0.2em]">
            01000011 01000010
          </span>
        </div>
      </div>
    </>
  );
}
