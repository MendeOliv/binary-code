export default function Footer() {
  return (
    <footer className="border-t border-outline-variant py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          {/* Brand */}
          <div className="max-w-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded bg-primary-container/20 border border-primary-container flex items-center justify-center">
                <span className="text-primary font-mono text-label-md">CB</span>
              </div>
              <span className="font-mono text-body-md text-on-surface font-bold">
                Código Binário
              </span>
            </div>
            <p className="font-mono text-body-sm text-on-surface-variant">
              Diagnóstico inteligente de problemas operacionais.
              Tecnologia sob medida para resolver o que importa.
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-12">
            <div>
              <h4 className="font-mono text-label-md text-primary mb-4">SERVIÇOS</h4>
              <ul className="space-y-2">
                {['IA & Agentes', 'Automação', 'Software', 'Presença Digital', 'Consultoria'].map((item) => (
                  <li key={item}>
                    <span className="font-mono text-body-sm text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-mono text-label-md text-primary mb-4">EMPRESA</h4>
              <ul className="space-y-2">
                {['Sobre Nós', 'Diagnóstico', 'Contacto', 'Blog'].map((item) => (
                  <li key={item}>
                    <span className="font-mono text-body-sm text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-outline-variant mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-mono text-label-sm text-outline">
            © 2024 Código Binário. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="font-mono text-label-sm text-on-surface-variant">
              Sistema operacional
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
