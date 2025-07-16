import { useCep } from '@/context/CepContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SearchByCep from './SearchByCep';
import SearchByStreet from './SearchByStreet';
import { MdOutlinePin, MdOutlineLocationCity } from "react-icons/md";

const SearchTabs = () => {
  const { searchType, setSearchType, clearSearch } = useCep();
  
  const handleTabChange = (value: string) => {
    setSearchType(value as 'cep' | 'logradouro');
    clearSearch();
  };

  return (
    <Tabs 
      defaultValue={searchType} 
      value={searchType}
      onValueChange={handleTabChange}
      className="w-full"
    >
      <TabsList className="grid grid-cols-2">
        <TabsTrigger value="cep" className="flex items-center">
          <MdOutlinePin className="mr-2" /> Busca por CEP
        </TabsTrigger>
        <TabsTrigger value="logradouro" className="flex items-center">
          <MdOutlineLocationCity className="mr-2" /> Busca por Endereço
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="cep" className="py-4">
        <SearchByCep />
      </TabsContent>
      
      <TabsContent value="logradouro" className="py-4">
        <SearchByStreet />
      </TabsContent>
    </Tabs>
  );
};

export default SearchTabs;