import { Endereco } from '@/types/cep';
import ResultCard from './ResultCard';

interface ResultsListProps {
  enderecos: Endereco[];
}

const ResultsList: React.FC<ResultsListProps> = ({ enderecos }) => {
  if (!enderecos || enderecos.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">Resultados da busca</h2>
        <span className="text-sm text-gray-600">{enderecos.length} resultado(s) encontrado(s)</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {enderecos.map((endereco, index) => (
          <ResultCard key={`${endereco.cep}-${index}`} endereco={endereco} />
        ))}
      </div>
    </div>
  );
};

export default ResultsList;