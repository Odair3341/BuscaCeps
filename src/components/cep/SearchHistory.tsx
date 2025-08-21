import { useCep } from '@/context/CepContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TipoBusca } from '@/types/cep';
import { MdHistory, MdDeleteOutline } from "react-icons/md";
import { clearSearchHistory } from '@/services/cepService';

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
      case TipoBusca.ENDERECO_COMPLETO:
        return 'Endereço Completo';
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
      case TipoBusca.ENDERECO_COMPLETO:
        return 'outline';
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
        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
          {searchHistory.map((item) => (
            <div 
              key={item.id} 
              className="border rounded-md p-3 bg-gray-50 flex justify-between items-center"
            >
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant={getTipoBuscaVariant(item.tipoBusca)}>
                    {getTipoBuscaLabel(item.tipoBusca)}
                  </Badge>
                  <span className="font-medium">{item.termoBusca}</span>
                  {item.cep && (
                    <span className="text-sm text-gray-500">{item.cep}</span>
                  )}
                </div>
                <div className="flex gap-4 mt-1 text-sm text-gray-600">
                  <span>{formatTimestamp(item.timestamp)}</span>
                  <span>{item.resultados} resultado(s)</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchHistory;
