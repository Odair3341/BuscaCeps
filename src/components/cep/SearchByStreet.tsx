import { useCep } from '@/context/CepContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FaSearch, FaEraser } from 'react-icons/fa';

const SearchByStreet = () => {
  const {
    streetName,
    setStreetName,
    selectedUf,
    setSelectedUf,
    selectedCity,
    setSelectedCity,
    estados,
    cidades,
    searchByStreet,
    clearSearch,
    isLoading,
    error,
  } = useCep();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await searchByStreet();
  };

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="estado">Estado</Label>
              <Select
                value={selectedUf}
                onValueChange={(value) => setSelectedUf(value)}
              >
                <SelectTrigger id="estado">
                  <SelectValue placeholder="Selecione um estado" />
                </SelectTrigger>
                <SelectContent>
                  {estados.map((estado) => (
                    <SelectItem key={estado.id} value={estado.sigla}>
                      {estado.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cidade">Cidade</Label>
              <Select
                value={selectedCity}
                onValueChange={(value) => setSelectedCity(value)}
                disabled={!selectedUf || cidades.length === 0}
              >
                <SelectTrigger id="cidade">
                  <SelectValue placeholder={!selectedUf ? "Selecione um estado primeiro" : "Selecione uma cidade"} />
                </SelectTrigger>
                <SelectContent>
                  {cidades.map((cidade) => (
                    <SelectItem key={cidade.id} value={cidade.nome}>
                      {cidade.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="logradouro">Logradouro</Label>
              <Input
                id="logradouro"
                type="text"
                placeholder="Digite o nome da rua (min. 3 caracteres)"
                value={streetName}
                onChange={(e) => setStreetName(e.target.value)}
                disabled={!selectedUf || !selectedCity}
              />
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              type="submit"
              disabled={isLoading || !selectedUf || !selectedCity || streetName.length < 3}
            >
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
              disabled={isLoading || (!streetName && !selectedUf && !selectedCity)}
            >
              <FaEraser className="mr-2" />
              Limpar
            </Button>
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

export default SearchByStreet;