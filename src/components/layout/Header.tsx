import { MdLocalPostOffice } from "react-icons/md";
import { IoSearchOutline } from "react-icons/io5";

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-4">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MdLocalPostOffice className="text-3xl" />
            <div>
              <h1 className="text-2xl font-bold">BuscaCEP</h1>
              <p className="text-sm text-blue-200">Sistema de Busca de CEP</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-3">
            <IoSearchOutline className="text-xl" />
            <span className="font-medium">Busca rápida e fácil de CEPs brasileiros</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;