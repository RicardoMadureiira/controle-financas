export function Footer() {
  return (
    <footer className="bg-stone-900 text-gray-400 max-h-screen p-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:justify-around lg:items-end items-start">
        {/* Esquerda */}
        <div className="text-left space-y-2 mb-4 md:mb-0">
          <p className="text-orange-500 mb-5 text-xl font-semibold">
            Prazer em ver você aqui!
          </p>
          <p className="text-sm">
            Sistema básico para controle financeiro pessoal.
          </p>
          <p className="text-sm">ricardomadureira.dev@gmail.com</p>
          <p className="text-sm">
            Feito com <span className="text-red-500">❤️</span> por
            <span className="text-red-500 font-semibold">
              {" "}
              <a
                href="https://my-portfolio-sooty-two-74.vercel.app/"
                target="_blank"
              >
                Ricardo Madureira
              </a>
            </span>
          </p>
        </div>

        {/* Direita */}
        <div className="flex space-x-4 text-sm">
          <a href="#" className="hover:text-white">
            Email
          </a>
          <a href="#" className="hover:text-white">
            Portfolio
          </a>
          <a href="#" className="hover:text-white">
            Github
          </a>
          <a href="#" className="hover:text-white">
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}
