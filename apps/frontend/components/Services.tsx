const services = [
  {
    icon: 'smart_toy',
    title: 'IA & Agentes',
    items: [
      'Agentes de IA personalizados',
      'Atendimento inteligente',
      'Assistentes internos',
      'IA com conhecimento privado',
      'IA para vendas e suporte',
    ],
  },
  {
    icon: 'bolt',
    title: 'Automação',
    items: [
      'Automação de processos',
      'WhatsApp, Email, CRM',
      'Documentos e relatórios',
      'Workflows inteligentes',
      'Integração entre sistemas',
    ],
  },
  {
    icon: 'code',
    title: 'Software',
    items: [
      'Sistemas empresariais',
      'Plataformas web e dashboards',
      'Portais e marketplaces',
      'SaaS personalizados',
      'Sistemas complexos de raiz',
    ],
  },
  {
    icon: 'language',
    title: 'Presença Digital',
    items: [
      'Websites e landing pages',
      'E-commerce',
      'SEO técnico',
      'Manutenção contínua',
      'Infraestrutura e hosting',
    ],
  },
  {
    icon: 'hub',
    title: 'Consultoria',
    items: [
      'Auditoria de processos',
      'Identificação de oportunidades de IA',
      'Arquitectura de soluções',
      'Estratégia de automação',
      'Optimização contínua',
    ],
  },
];

export default function Services() {
  return (
    <section id="servicos" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="font-mono text-label-md text-primary tracking-widest">
            {`// CAPACIDADES`}
          </span>
          <h2 className="text-headline-lg font-mono text-on-surface mt-4">
            Resolvemos problemas com <span className="text-primary">tecnologia sob medida</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, idx) => (
            <div
              key={service.title}
              className="bg-surface border border-outline-variant rounded-lg p-6 glow-hover group"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="material-symbols-outlined text-primary text-2xl">
                  {service.icon}
                </span>
                <h3 className="font-mono text-headline-md text-on-surface">
                  {service.title}
                </h3>
              </div>
              <ul className="space-y-2">
                {service.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 font-mono text-body-sm text-on-surface-variant"
                  >
                    <span className="text-primary mt-0.5 text-label-sm">{'>'}</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
