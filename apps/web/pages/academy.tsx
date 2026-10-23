import { useMemo, useState } from 'react';
import Link from 'next/link';
import SeoHead from '../components/SeoHead';
import { ACADEMY_CATEGORIES, ACADEMY_COURSES, type AcademyCourse } from '../lib/academy';

const DESCRIPTION = 'Formações práticas em tecnologia, inteligência artificial, automação, desenvolvimento assistido por IA e trading.';

export default function AcademyPage() {
  const [category, setCategory] = useState<(typeof ACADEMY_CATEGORIES)[number]>('Todas');
  const [selected, setSelected] = useState<AcademyCourse | null>(null);
  const [courseId, setCourseId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [privacy, setPrivacy] = useState(false);
  const [custom, setCustom] = useState(false);
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');
  const courses = useMemo(() => category === 'Todas' ? ACADEMY_COURSES : ACADEMY_COURSES.filter((course) => course.category === category), [category]);
  const requestCourse = (id = '') => { setCourseId(id); setCustom(!id); setStatus('idle'); setError(''); document.getElementById('academy-request')?.scrollIntoView({ behavior: 'smooth' }); };
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim() || !privacy || (!courseId && !custom)) return;
    setStatus('sending'); setError('');
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE || '/api'}/academy-requests`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ requestId: crypto.randomUUID(), name, email, phone, courseId: custom ? undefined : courseId, message, privacyAccepted: privacy }) });
      if (response.status === 429) {
        setStatus('error');
        setError('Demasiadas tentativas. Aguarde um momento e tente novamente.');
      } else if (!response.ok) {
        // Try to get a meaningful error message from the API
        try {
          const errorData = await response.json();
          setStatus('error');
          setError(errorData.error || 'Não foi possível registar o pedido. Verifique a ligação e tente novamente.');
        } catch {
          // Response not JSON or parse error - treat as connection/serverside error
          setStatus('error');
          setError('Não foi possível registar o pedido. Verifique a ligação e tente novamente.');
        }
      } else {
        setStatus('success'); setName(''); setEmail(''); setPhone(''); setMessage(''); setPrivacy(false);
      }
    } catch (submissionError) { setStatus('error'); setError('Erro de rede. Tente novamente.'); }
  };
  return <>
    <SeoHead title="Código Binário Academy — Formação prática" description={DESCRIPTION} path="/academy" />
    <section className="relative overflow-hidden border-b border-border-subtle bg-bg-canvas px-gutter-mobile py-20 md:px-margin md:py-28">
      <div className="absolute inset-0 grid-background pointer-events-none" aria-hidden="true" />
      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="max-w-3xl"><span className="tech-label">// CÓDIGO BINÁRIO ACADEMY</span><h1 className="mt-5 font-display text-display-mobile font-bold tracking-tight text-text-primary md:text-display">Conhecimento técnico para construir com clareza.</h1><p className="mt-6 max-w-2xl font-body-lg leading-relaxed text-text-secondary">Formações individuais e híbridas para aprender tecnologia, IA, automação e trading com aplicação prática, limites claros e materiais próprios.</p><div className="mt-8 flex flex-wrap gap-3"><a href="#courses" className="btn-primary">Explorar formações →</a><a href="/academy-pdfs/CB_Academy_Catalogo_Formacoes_v2.pdf" download className="btn-secondary">Descarregar catálogo</a></div></div>
        <div className="mt-16 grid gap-4 border-t border-border-subtle pt-6 md:grid-cols-3"><div><span className="font-label-telemetry text-label-telemetry text-primary">01</span><p className="mt-2 text-text-secondary">Conteúdo focado em competências aplicáveis.</p></div><div><span className="font-label-telemetry text-label-telemetry text-primary">02</span><p className="mt-2 text-text-secondary">Percursos progressivos de 1, 3 ou 5 dias.</p></div><div><span className="font-label-telemetry text-label-telemetry text-primary">03</span><p className="mt-2 text-text-secondary">Pedido analisado pela equipa da Academy.</p></div></div>
      </div>
    </section>
    <section className="border-b border-border-subtle bg-bg-surface-base px-gutter-mobile py-16 md:px-margin md:py-20"><div className="mx-auto max-w-6xl"><div className="max-w-2xl"><span className="tech-label">// APRENDER COM APLICAÇÃO</span><h2 className="mt-4 font-headline-lg text-headline-lg-mobile font-semibold text-text-primary md:text-headline-lg">Uma unidade educacional da Código Binário.</h2><p className="mt-4 leading-relaxed text-text-secondary">A Academy transmite conhecimentos práticos para quem quer compreender melhor as ferramentas, tomar decisões técnicas e desenvolver resultados demonstráveis. A disponibilidade e o âmbito final de cada pedido são confirmados pela equipa.</p></div></div></section>
    <section id="courses" className="bg-bg-canvas px-gutter-mobile py-16 md:px-margin md:py-20"><div className="mx-auto max-w-6xl"><div className="flex flex-col justify-between gap-6 border-b border-border-subtle pb-8 md:flex-row md:items-end"><div><span className="tech-label">// CATÁLOGO DE FORMAÇÕES</span><h2 className="mt-4 font-headline-lg text-headline-lg-mobile font-semibold text-text-primary md:text-headline-lg">Escolha o próximo tema.</h2></div><div className="flex flex-wrap gap-2" role="tablist" aria-label="Filtrar formações">{ACADEMY_CATEGORIES.map((item) => <button type="button" role="tab" aria-selected={category === item} key={item} onClick={() => setCategory(item)} className={category === item ? 'btn-primary' : 'btn-ghost'}>{item}</button>)}</div></div><div className="mt-8 grid gap-4 md:grid-cols-2">{courses.map((course) => <article key={course.id} className="card-surface flex flex-col justify-between p-6"><div><span className="font-label-telemetry text-label-telemetry text-primary">{course.category}</span><h3 className="mt-3 font-headline-sm text-headline-sm font-semibold text-text-primary">{course.title}</h3><p className="mt-3 leading-relaxed text-text-secondary">{course.description}</p><div className="mt-5 flex flex-wrap gap-2 text-sm text-text-secondary"><span className="border border-border-subtle px-2 py-1">{course.duration}</span><span className="border border-border-subtle px-2 py-1">{course.price}</span></div></div><div className="mt-6 flex flex-wrap gap-2"><button type="button" className="btn-secondary" onClick={() => setSelected(course)}>Ver programa</button><a className="btn-ghost" href={course.pdf} download>PDF</a><button type="button" className="btn-primary" onClick={() => requestCourse(course.id)}>Solicitar</button></div></article>)}</div></div></section>
    {selected && <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4" role="dialog" aria-modal="true" aria-labelledby="course-detail-title"><div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto bg-surface p-6 shadow-2xl md:p-8"><div className="flex items-start justify-between gap-4"><div><span className="tech-label">{selected.eyebrow}</span><h2 id="course-detail-title" className="mt-3 font-headline-lg text-headline-lg-mobile font-semibold text-text-primary">{selected.title}</h2></div><button type="button" className="btn-ghost" onClick={() => setSelected(null)} aria-label="Fechar detalhes">Fechar</button></div><p className="mt-5 leading-relaxed text-text-secondary">{selected.description}</p><h3 className="mt-8 font-headline-sm font-semibold text-text-primary">Âmbito documentado</h3><ul className="mt-3 list-disc space-y-2 pl-5 text-text-secondary">{selected.modules.map((module) => <li key={module}>{module}</li>)}</ul><div className="mt-8 grid gap-3 border-t border-border-subtle pt-5 text-sm text-text-secondary md:grid-cols-3"><div><strong className="block text-text-primary">Modalidade</strong>{selected.modality}</div><div><strong className="block text-text-primary">Duração</strong>{selected.duration}</div><div><strong className="block text-text-primary">Preço</strong>{selected.price}</div></div><a className="btn-primary mt-8" href={selected.pdf} download>Descarregar programa PDF</a></div></div>}
    <section id="academy-request" className="border-t border-border-subtle bg-bg-surface-base px-gutter-mobile py-16 md:px-margin md:py-20"><div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[0.8fr_1.2fr]"><div><span className="tech-label">// SOLICITAR FORMAÇÃO</span><h2 className="mt-4 font-headline-lg text-headline-lg-mobile font-semibold text-text-primary md:text-headline-lg">Diga-nos o que pretende aprender.</h2><p className="mt-4 leading-relaxed text-text-secondary">Pode solicitar uma formação do catálogo ou propor um tema personalizado. Todos os pedidos estão sujeitos a avaliação e confirmação de disponibilidade.</p><p className="mt-6 text-sm text-text-tertiary">Os cursos de trading são educativos e não garantem lucros. Serviços, licenças e ferramentas externas podem ter custos adicionais.</p></div><form onSubmit={submit} className="card-surface space-y-4 p-6">{status === 'success' ? <div role="status" className="border border-primary p-5"><h3 className="font-headline-sm font-semibold text-primary">Pedido recebido.</h3><p className="mt-2 text-text-secondary">A equipa da Academy irá analisar o pedido e contactar através dos dados partilhados.</p></div> : <><div className="grid gap-4 md:grid-cols-2"><label className="text-sm text-text-secondary">Nome *<input required value={name} onChange={(e) => setName(e.target.value)} className="input-field mt-2 w-full" /></label><label className="text-sm text-text-secondary">Email *<input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field mt-2 w-full" /></label></div><label className="block text-sm text-text-secondary">Telefone (opcional)<input value={phone} onChange={(e) => setPhone(e.target.value)} className="input-field mt-2 w-full" /></label><label className="block text-sm text-text-secondary">Formação pretendida<select value={custom ? '' : courseId} onChange={(e) => { setCourseId(e.target.value); setCustom(!e.target.value); }} className="input-field mt-2 w-full"><option value="">Formação personalizada</option>{ACADEMY_COURSES.map((course) => <option key={course.id} value={course.id}>{course.title}</option>)}</select></label><label className="block text-sm text-text-secondary">Mensagem ou objectivo do pedido *<textarea required minLength={10} maxLength={2000} value={message} onChange={(e) => setMessage(e.target.value)} className="input-field mt-2 min-h-32 w-full" /></label><label className="flex items-start gap-3 text-sm text-text-secondary"><input required type="checkbox" checked={privacy} onChange={(e) => setPrivacy(e.target.checked)} className="mt-1" />Li a <Link href="/privacidade" className="text-primary underline">política de privacidade</Link> e aceito o tratamento destes dados para responder ao pedido.</label>{status === 'error' && <p role="alert" className="text-sm text-error">{error}</p>}<button type="submit" disabled={status === 'sending'} className="btn-primary w-full disabled:opacity-50">{status === 'sending' ? 'A enviar…' : 'Enviar pedido'}</button></>}</form></div></section>
  </>;
}
