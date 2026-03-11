export function Footer() {
  return (
    <footer className="bg-black border-t border-zinc-900 text-zinc-500 py-8 px-6 mt-20">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          {/* Esquerda: Nome do WebApp */}
          <div className="flex flex-col items-center md:items-start space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-emerald-500 font-black tracking-widest uppercase text-sm">
                Organize suas Finanças
              </span>
            </div>
            <p className="text-xs max-w-xs text-center md:text-left leading-relaxed">
              Sistema para controle financeiro pessoal.
            </p>
          </div>

          {/* Centro: Créditos */}
          <div className="text-center flex flex-col">
            <span className="text-[10px] text-zinc-500 uppercase tracking-[0.4em] mb-3">
              Developer
            </span>
            <a
              href="https://www.linkedin.com/in/ricardo-madureira-490022245/"
              target="_blank"
              className="text-white hover:text-emerald-400 hover:border-b transition-colors duration-300 font-medium"
            >
              Ricardo Madureira
            </a>
          </div>

          {/* Direita: Social Links */}
          <div className="flex items-center gap-6">
            <a
              href="mailto:ricardomadureira.dev@gmail.com"
              className="text-xs hover:text-white transition-colors duration-300 flex items-center gap-2"
            >
              Email
            </a>
            <a
              href="https://github.com/RicardoMadureiira"
              target="_blank"
              className="text-xs hover:text-white transition-colors duration-300"
            >
              Github
            </a>
            <a
              href="https://www.linkedin.com/in/ricardo-madureira-490022245/"
              target="_blank"
              className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-full text-xs text-white hover:bg-zinc-800 transition-all"
            >
              LinkedIn
            </a>
          </div>
        </div>

        {/* Linha Final de Copyright */}
        <div className="mt-12 pt-2 border-t border-zinc-900/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] uppercase tracking-widest">
            © 2026 Todos os direitos reservados
          </p>
          <div className="flex gap-4 text-[10px] uppercase tracking-widest">
            <span>React + Node.js</span>
            <span className="text-zinc-800">|</span>
            <span>Tailwind CSS</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
