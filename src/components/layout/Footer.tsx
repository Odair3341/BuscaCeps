import { FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-100 border-t py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-gray-600">
              &copy; {new Date().getFullYear()} BuscaCEP - Sistema de Busca de CEP
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Dados fornecidos pela API ViaCEP
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-blue-600 transition-colors"
            >
              <FaGithub className="text-xl" />
            </a>
            
            <div className="text-sm text-gray-600">
              <p>Desenvolvido com 💙</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;