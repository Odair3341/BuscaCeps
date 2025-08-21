import { useCep } from '@/context/CepContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TipoBusca } from '@/types/cep';
import { MdHistory, MdDeleteOutline } from "react-icons/md";
import { clearSearchHistory } from '@/services/cepService';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronsUpDown } from 'lucide-react';
import ResultCard from './ResultCard';

const SearchHistory = () => {
  const { searchHistory } = useCep();
  
  if (!searchHistory || searchHistory.length === 0) {
    return null;
  }
  
  const handleClearHistory = () => {
    clearSearchHistory();
    window.location.reload();
  };
  
  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString('pt-BR', { 
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const getTipoBuscaLabel = (tipo: TipoBusca) => {
    switch (tipo) {
      case TipoBusca.CEP:
        return 'CEP';
      case TipoBusca.LOGRADOURO:
        return 'Logradouro';
      default:
        return 'Outro';
    }
  };
  
  const getTipoBuscaVariant = (tipo: TipoBusca): 'default' | 'secondary' | 'destructive' | 'outline' => {
    switch (tipo) {
      case TipoBusca.CEP:
        return 'default';
      case TipoBusca.LOGRADOURO:
        return 'secondary';
      default:
        return 'secondary';
    }
  };
  
  return (
    <Card className="w-full mt-8">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-lg flex items-center">
          <MdHistory className="mr-2 text-blue-600" /> 
          Histórico de Buscas
        </CardTitle>
        <Button 
          variant="destructive" 
          size="sm" 
          onClick={handleClearHistory}
          className="h-8"
        >
          <MdDeleteOutline className="mr-1" /> Limpar
        </Button>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
          {searchHistory.map((item) => (
            <Collapsible key={item.id} className="border rounded-md">
              <CollapsibleTrigger className="w-full p-3 bg-gray-50 flex justify-between items-center text-left">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getTipoBuscaVariant(item.tipoBusca)}>
                      {getTipoBuscaLabel(item.tipoBusca)}
                    </Badge>
                    <span className="font-medium">{item.termoBusca}</span>
                  </div>
                  <div className="flex gap-4 mt-1 text-sm text-gray-600">
                    <span>{formatTimestamp(item.timestamp)}</span>
                    <span>{item.resultados} resultado(s)</span>
                  </div>
                </div>
                <ChevronsUpDown className="h-4 w-4 text-gray-500" />
              </CollapsibleTrigger>
              <CollapsibleContent className="p-4 bg-white">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {item.enderecos && Array.isArray(item.enderecos) && item.enderecos.map((endereco) => (
                    <ResultCard key={endereco.cep} endereco={endereco} />
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchHistory;
