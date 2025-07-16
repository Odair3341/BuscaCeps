import { useState } from 'react';
import { Endereco } from '@/types/cep';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { MdContentCopy } from "react-icons/md";
import { FaMapMarkerAlt, FaCity, FaFlag } from "react-icons/fa";

interface ResultCardProps {
  endereco: Endereco;
}

const ResultCard: React.FC<ResultCardProps> = ({ endereco }) => {
  const [isCopying, setIsCopying] = useState(false);
  
  const handleCopyCep = () => {
    navigator.clipboard.writeText(endereco.cep);
    setIsCopying(true);
    toast.success('CEP copiado para a área de transferência!');
    setTimeout(() => setIsCopying(false), 2000);
  };
  
  const handleCopyEndereco = () => {
    const texto = `${endereco.logradouro}${endereco.complemento ? `, ${endereco.complemento}` : ''}, ${endereco.bairro}, ${endereco.cidade} - ${endereco.uf}, ${endereco.cep}`;
    navigator.clipboard.writeText(texto);
    setIsCopying(true);
    toast.success('Endereço completo copiado!');
    setTimeout(() => setIsCopying(false), 2000);
  };
  
  return (
    <Card className="w-full bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader className="bg-blue-50 pb-2">
        <CardTitle className="flex items-center justify-between">
          <span className="font-bold text-blue-700">{endereco.cep}</span>
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={handleCopyCep} 
            disabled={isCopying}
            className="h-8"
          >
            <MdContentCopy className="mr-1" /> {isCopying ? 'Copiado!' : 'Copiar CEP'}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-2">
          <div className="flex items-start space-x-2">
            <FaMapMarkerAlt className="text-blue-600 mt-1" />
            <div>
              <p className="font-medium">{endereco.logradouro}</p>
              {endereco.complemento && (
                <p className="text-sm text-gray-600">{endereco.complemento}</p>
              )}
              <p className="text-gray-600">{endereco.bairro}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <FaCity className="text-blue-600" />
            <p>{endereco.cidade}</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <FaFlag className="text-blue-600" />
            <p>{endereco.estado} - {endereco.uf}</p>
          </div>
        </div>
        
        <Button
          variant="outline"
          className="w-full mt-4"
          onClick={handleCopyEndereco}
        >
          <MdContentCopy className="mr-2" />
          Copiar endereço completo
        </Button>
      </CardContent>
    </Card>
  );
};

export default ResultCard;