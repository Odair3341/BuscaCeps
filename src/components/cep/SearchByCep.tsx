import { useState } from 'react';
import { useCep } from '@/context/CepContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { FaSearch, FaEraser } from 'react-icons/fa';

const SearchByCep = () => {
  const { 
    searchTerm, 
    setSearchTerm, 
    searchCep, 
    clearSearch, 
    isLoading, 
    error,
    formatCepInput
  } = useCep();
  
  const [validationError, setValidationError] = useState<string | null>(null);
  
  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedCep = formatCepInput(e.target.value);
    setSearchTerm(formattedCep);
    
    // Reset validation error
    setValidationError(null);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate CEP
    const cleanCep = searchTerm.replace(/\D/g, '');
    if (cleanCep.length < 5) {
      setValidationError('O CEP deve ter pelo menos 5 dígitos');
      return;
    }
    
    await searchCep();
  };
  
  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cep">CEP</Label>
            <div className="flex gap-2">
              <div className="flex-grow">
                <Input
                  id="cep"
                  type="text"
                  placeholder="Digite o CEP (Ex: 01001-000)"
                  value={searchTerm}
                  onChange={handleCepChange}
                  maxLength={9}
                  className={validationError ? 'border-red-500' : ''}
                />
                {validationError && (
                  <p className="text-sm text-red-500 mt-1">{validationError}</p>
                )}
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
                ) : (
                  <FaSearch className="mr-2" />
                )}
                Buscar
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={clearSearch}
                disabled={isLoading || !searchTerm}
              >
                <FaEraser className="mr-2" />
                Limpar
              </Button>
            </div>
          </div>
          
          {error && (
            <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default SearchByCep;