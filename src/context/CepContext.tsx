import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  Endereco, 
  Estado, 
  Cidade, 
  BuscaHistorico, 
  TipoBusca 
} from '@/types/cep';
import { 
  fetchCepByCode, 
  fetchAddressByStreet, 
  getAllEstados, 
  getCidadesByUf, 
  getSearchHistory 
} from '@/services/cepService';

interface CepContextProps {
  // Search states
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  searchType: 'cep' | 'logradouro';
  setSearchType: (type: 'cep' | 'logradouro') => void;
  isLoading: boolean;
  error: string | null;
  
  // Results
  enderecoResult: Endereco | null;
  multipleResults: Endereco[];
  
  // Filters
  selectedUf: string;
  setSelectedUf: (uf: string) => void;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  streetName: string;
  setStreetName: (name: string) => void;
  
  // Data
  estados: Estado[];
  cidades: Cidade[];
  searchHistory: BuscaHistorico[];
  
  // Actions
  searchCep: () => Promise<void>;
  searchByStreet: () => Promise<void>;
  clearSearch: () => void;
  formatCepInput: (input: string) => string;
}

const CepContext = createContext<CepContextProps | undefined>(undefined);

export const useCep = () => {
  const context = useContext(CepContext);
  if (context === undefined) {
    throw new Error('useCep must be used within a CepProvider');
  }
  return context;
};

interface CepProviderProps {
  children: ReactNode;
}

export const CepProvider: React.FC<CepProviderProps> = ({ children }) => {
  // Search states
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchType, setSearchType] = useState<'cep' | 'logradouro'>('cep');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Results
  const [enderecoResult, setEnderecoResult] = useState<Endereco | null>(null);
  const [multipleResults, setMultipleResults] = useState<Endereco[]>([]);
  
  // Filters for logradouro search
  const [selectedUf, setSelectedUf] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [streetName, setStreetName] = useState<string>('');
  
  // Data
  const [estados, setEstados] = useState<Estado[]>([]);
  const [cidades, setCidades] = useState<Cidade[]>([]);
  const [searchHistory, setSearchHistory] = useState<BuscaHistorico[]>([]);
  
  // Load initial data
  useEffect(() => {
    // Load estados
    setEstados(getAllEstados());
    
    // Load search history
    setSearchHistory(getSearchHistory());
  }, []);
  
  // Load cidades when UF changes
  useEffect(() => {
    if (selectedUf) {
      const cidadesDoEstado = getCidadesByUf(selectedUf);
      setCidades(cidadesDoEstado);
      // Reset selected city when state changes
      setSelectedCity('');
    } else {
      setCidades([]);
    }
  }, [selectedUf]);
  
  // Format CEP input with mask (12345-678)
  const formatCepInput = (input: string): string => {
    // Remove non-numeric characters
    const numericValue = input.replace(/\D/g, '');
    
    // Apply mask if length is greater than 5
    if (numericValue.length > 5) {
      return `${numericValue.slice(0, 5)}-${numericValue.slice(5, 8)}`;
    }
    
    return numericValue;
  };
  
  // Search by CEP
  const searchCep = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setEnderecoResult(null);
      setMultipleResults([]);
      
      // Remove non-numeric characters
      const cleanCep = searchTerm.replace(/\D/g, '');
      
      // Validate CEP length (minimum 8 digits)
      if (cleanCep.length < 8) {
        throw new Error('CEP deve ter 8 dígitos');
      }
      
      const result = await fetchCepByCode(cleanCep);
      
      if (!result) {
        throw new Error('CEP não encontrado');
      }
      
      setEnderecoResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido ao buscar CEP');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Search by street name, city and UF
  const searchByStreet = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setEnderecoResult(null);
      setMultipleResults([]);
      
      // Validate fields
      if (!streetName || !selectedCity || !selectedUf) {
        throw new Error('Preencha todos os campos para buscar por logradouro');
      }
      
      if (streetName.length < 3) {
        throw new Error('O nome da rua deve ter pelo menos 3 caracteres');
      }
      
      const results = await fetchAddressByStreet(
        streetName.trim(),
        selectedUf,
        selectedCity
      );
      
      if (!results || results.length === 0) {
        throw new Error('Nenhum endereço encontrado com os critérios informados');
      }
      
      setMultipleResults(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido ao buscar endereço');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Clear search
  const clearSearch = () => {
    setSearchTerm('');
    setStreetName('');
    setEnderecoResult(null);
    setMultipleResults([]);
    setError(null);
  };
  
  // Refresh search history (e.g., after adding new search)
  useEffect(() => {
    const refreshHistory = () => {
      setSearchHistory(getSearchHistory());
    };
    
    // Update history when component mounts
    refreshHistory();
    
    // Listen for storage changes (in case history is updated in another tab)
    window.addEventListener('storage', refreshHistory);
    
    return () => {
      window.removeEventListener('storage', refreshHistory);
    };
  }, []);
  
  return (
    <CepContext.Provider
      value={{
        // Search states
        searchTerm,
        setSearchTerm,
        searchType,
        setSearchType,
        isLoading,
        error,
        
        // Results
        enderecoResult,
        multipleResults,
        
        // Filters
        selectedUf,
        setSelectedUf,
        selectedCity,
        setSelectedCity,
        streetName,
        setStreetName,
        
        // Data
        estados,
        cidades,
        searchHistory,
        
        // Actions
        searchCep,
        searchByStreet,
        clearSearch,
        formatCepInput,
      }}
    >
      {children}
    </CepContext.Provider>
  );
};