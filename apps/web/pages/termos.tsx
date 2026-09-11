import Head from 'next/head';
import Link from 'next/link';

const SECTIONS = [
  {
    title: '1. Objeto',
    body: [
      'Estes termos regulam o uso do website da Código Binário e do Binary Diagnostic — uma ferramenta interativa de entrevista e diagnóstico técnico conduzida com apoio de inteligência artificial.',
    ],
  },
  {
    title: '2. O que o serviço é (e o que não é)',
    body: [
      'O Binary Diagnostic produz uma análise técnica preliminar com base nas informações que você fornece. É um instrumento de apoio à decisão, não uma proposta comercial vinculativa nem uma garantia de resultado.',
      'A análise gerada por IA é revista pela nossa equipa de engenharia antes de qualquer contrato ou implementação.',
      'Recomendações finais de arquitetura, escopo e investimento são formalizadas em documento próprio, mediante acordo.',
    ],
  },
  {
    title: '3. Uso aceitável',
    body: [
      'Você concorda em utilizar o serviço apenas para descrever problemas reais da sua operação e não para testes de segurança não autorizados, tentativas de sobrecarga, extração automatizada abusiva ou qualquer uso que prejudique a disponibilidade do serviço.',
      'Não envie segredos, credenciais ou dados sensíveis de terceiros através do diagnóstico.',
    ],
  },
  {
    title: '4. Dados fornecidos',
    body: [
      'As informações que você envia são utilizadas para produzir o seu diagnóstico, conforme detalhado na Política de Privacidade.',
      'Você é responsável pela veracidade e pela titularidade das informações que envia.',
    ],
  },
  {
    title: '5. Propriedade intelectual',
    body: [
      'O website, a marca Código Binário, o design system e o software da plataforma são propriedade da Código Binário.',
      'O diagnóstico produzido para você pode ser utilizado livremente internamente na sua organização para avaliar as recomendações apresentadas.',
    ],
  },
  {
    title: '6. Limitação de responsabilidade',
    body: [
      'O serviço é fornecido "no estado em que se encontra". A Código Binário não garante que a análise gerada automaticamente esteja livre de imprecisões; por isso, decisões relevantes devem passar pela validação da nossa equipa técnica.',
      'Na extensão máxima permitida pela lei aplicável, a Código Binário não responde por danos indiretos decorrentes do uso do website e do diagnóstico.',
    ],
  },
  {
    title: '7. Alterações e contacto',
    body: [
      'Estes termos podem ser atualizados para refletir a evolução do serviço. A versão publicada nesta página é a vigente.',
      'Dúvidas: eng@codigobinario.io',
    ],
  },
];

export default function TermsPage() {
  return (
    <>
      <Head>
        <title>Termos de Uso — Código Binário</title>
        <meta
          name="description"
          content="Termos de Uso do website e do Binary Diagnostic da Código Binário: objeto, uso aceitável, dados fornecidos e limitação de responsabilidade."
        />
      </Head>

      <section className="w-full px-gutter-mobile md:px-margin pt-space-xl pb-space-lg">
        <div className="max-w-3xl mx-auto flex flex-col gap-space-md">
          <span className="tech-label">// DOCUMENTO LEGAL</span>
          <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-text-primary tracking-tight">
            Termos de Uso
          </h1>
          <p className="font-body-md text-body-md text-text-secondary">
            Condições que regulam o uso do website da Código Binário e do Binary Diagnostic.
          </p>
        </div>
      </section>

      <section className="w-full px-gutter-mobile md:px-margin pb-space-xl">
        <div className="max-w-3xl mx-auto flex flex-col gap-space-md">
          {SECTIONS.map((s) => (
            <article key={s.title} className="bg-surface-container-low border border-border-subtle rounded-lg p-space-lg">
              <h2 className="font-headline-sm text-headline-sm text-text-primary mb-space-sm">{s.title}</h2>
              <div className="flex flex-col gap-space-sm">
                {s.body.map((p) => (
                  <p key={p.slice(0, 40)} className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    {p}
                  </p>
                ))}
              </div>
            </article>
          ))}

          <div className="bg-bg-surface-elevated border border-border-subtle rounded-lg p-space-md font-label-code text-label-code text-on-surface-variant">
            <span className="text-text-tertiary">// VER TAMBÉM</span>
            <div>&gt; <Link href="/privacidade" className="text-primary hover:text-tertiary transition-colors">Política de Privacidade</Link></div>
          </div>
        </div>
      </section>
    </>
  );
}
