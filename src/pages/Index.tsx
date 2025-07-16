import { useCep } from '@/context/CepContext';
import Layout from '@/components/layout/Layout';
import SearchTabs from '@/components/cep/SearchTabs';
import ResultCard from '@/components/cep/ResultCard';
import ResultsList from '@/components/cep/ResultsList';
import SearchHistory from '@/components/cep/SearchHistory';

const Index = () => {
  const { enderecoResult, multipleResults } = useCep();
  
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="space-y-2 mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Sistema de Busca de CEP</h1>
          <p className="text-muted-foreground">
            Busque CEPs brasileiros por código postal ou endereço
          </p>
        </div>
        
        <div className="space-y-6">
          <SearchTabs />
          
          {enderecoResult && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Resultado da busca</h2>
              <ResultCard endereco={enderecoResult} />
            </div>
          )}
          
          {multipleResults.length > 0 && (
            <ResultsList enderecos={multipleResults} />
          )}
          
          <SearchHistory />
        </div>
      </div>
    </Layout>
  );
};

export default Index;