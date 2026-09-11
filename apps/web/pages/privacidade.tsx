import Head from 'next/head';
import Link from 'next/link';

const SECTIONS = [
  {
    title: '1. Quem somos',
    body: [
      'A Código Binário é uma empresa de engenharia — AI, Systems & Digital Solutions — que transforma problemas complexos em sistemas, automações e soluções digitais funcionais.',
      'Para contato sobre privacidade: eng@codigobinario.io',
    ],
  },
  {
    title: '2. Dados que recolhemos',
    body: [
      'Diagnostic (Binary Diagnostic): quando você utiliza o nosso diagnóstico interativo, registamos o conteúdo da conversa (as mensagens que você envia) para conduzir a entrevista e produzir a sua análise técnica.',
      'Dados de contacto: se você decidir deixar os seus dados após o diagnóstico, recolhemos o nome que você informar e, opcionalmente, email, telefone e empresa.',
      'Não recolhemos dados adicionais de navegação para fins de perfilamento comercial.',
    ],
  },
  {
    title: '3. Para que utilizamos os dados',
    body: [
      'Produzir o diagnóstico técnico solicitado por você (análise conduzida por modelos de IA — Gemini como provedor principal, Groq como fallback).',
      'Guardar a sua sessão e o diagnóstico para que a nossa equipa de engenharia possa analisar o caso e dar seguimento.',
      'Contactá-lo sobre o diagnóstico que você submeteu, se você deixar os seus dados de contacto.',
    ],
  },
  {
    title: '4. Como os dados são tratados',
    body: [
      'As mensagens do diagnóstico e os dados de contacto são armazenados de forma segura na nossa infraestrutura de base de dados (Supabase/PostgreSQL).',
      'O conteúdo da conversa é processado por provedores de IA para gerar a análise técnica. Não inserimos as suas credenciais de acesso nem dados sensíveis nos prompts.',
      'O acesso administrativo aos diagnósticos e leads é restrito por chave de administração; sem ela, as rotas administrativas permanecem desativadas.',
      'Não vendemos e não partilhamos os seus dados com terceiros para marketing.',
    ],
  },
  {
    title: '5. Os seus dados nos modelos de IA',
    body: [
      'As mensagens que você envia no diagnóstico são processadas por provedores de IA para gerar a resposta e o diagnóstico.',
      'Envie apenas informações necessárias para a análise. Evite incluir segredos, credenciais ou dados pessoais de terceiros.',
    ],
  },
  {
    title: '6. Contacto',
    body: [
      'Para exercer direitos sobre os seus dados, solicitar esclarecimentos ou remoção de informações, contacte: eng@codigobinario.io',
    ],
  },
];

export default function PrivacyPage() {
  return (
    <>
      <Head>
        <title>Política de Privacidade — Código Binário</title>
        <meta
          name="description"
          content="Política de Privacidade da Código Binário: quais dados o Binary Diagnostic recolhe, para que são utilizados e como são tratados."
        />
      </Head>

      <section className="w-full px-gutter-mobile md:px-margin pt-space-xl pb-space-lg">
        <div className="max-w-3xl mx-auto flex flex-col gap-space-md">
          <span className="tech-label">// DOCUMENTO LEGAL</span>
          <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-text-primary tracking-tight">
            Política de Privacidade
          </h1>
          <p className="font-body-md text-body-md text-text-secondary">
            Este documento explica, de forma clara, quais dados a Código Binário recolhe através do
            website e do Binary Diagnostic, para que são utilizados e como são tratados.
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
            <div>&gt; <Link href="/termos" className="text-primary hover:text-tertiary transition-colors">Termos de Uso</Link></div>
            <div>&gt; <Link href="/diagnostic" className="text-primary hover:text-tertiary transition-colors">Binary Diagnostic</Link></div>
          </div>
        </div>
      </section>
    </>
  );
}
