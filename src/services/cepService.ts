import { Endereco, Estado, Cidade, BuscaHistorico, TipoBusca } from "@/types/cep";

// Mock data for Estados (will be replaced with API calls in production)
const estados: Estado[] = [
  { id: 1, codigo: "12", nome: "Acre", sigla: "AC" },
  { id: 2, codigo: "27", nome: "Alagoas", sigla: "AL" },
  { id: 3, codigo: "16", nome: "Amapá", sigla: "AP" },
  { id: 4, codigo: "13", nome: "Amazonas", sigla: "AM" },
  { id: 5, codigo: "29", nome: "Bahia", sigla: "BA" },
  { id: 6, codigo: "23", nome: "Ceará", sigla: "CE" },
  { id: 7, codigo: "53", nome: "Distrito Federal", sigla: "DF" },
  { id: 8, codigo: "32", nome: "Espírito Santo", sigla: "ES" },
  { id: 9, codigo: "52", nome: "Goiás", sigla: "GO" },
  { id: 10, codigo: "21", nome: "Maranhão", sigla: "MA" },
  { id: 11, codigo: "51", nome: "Mato Grosso", sigla: "MT" },
  { id: 12, codigo: "50", nome: "Mato Grosso do Sul", sigla: "MS" },
  { id: 13, codigo: "31", nome: "Minas Gerais", sigla: "MG" },
  { id: 14, codigo: "15", nome: "Pará", sigla: "PA" },
  { id: 15, codigo: "25", nome: "Paraíba", sigla: "PB" },
  { id: 16, codigo: "41", nome: "Paraná", sigla: "PR" },
  { id: 17, codigo: "26", nome: "Pernambuco", sigla: "PE" },
  { id: 18, codigo: "22", nome: "Piauí", sigla: "PI" },
  { id: 19, codigo: "33", nome: "Rio de Janeiro", sigla: "RJ" },
  { id: 20, codigo: "24", nome: "Rio Grande do Norte", sigla: "RN" },
  { id: 21, codigo: "43", nome: "Rio Grande do Sul", sigla: "RS" },
  { id: 22, codigo: "11", nome: "Rondônia", sigla: "RO" },
  { id: 23, codigo: "14", nome: "Roraima", sigla: "RR" },
  { id: 24, codigo: "42", nome: "Santa Catarina", sigla: "SC" },
  { id: 25, codigo: "35", nome: "São Paulo", sigla: "SP" },
  { id: 26, codigo: "28", nome: "Sergipe", sigla: "SE" },
  { id: 27, codigo: "17", nome: "Tocantins", sigla: "TO" },
];

// Mock data for cidades by estado
const getCidadesByEstado = (estadoId: number): Cidade[] => {
  // This would be replaced by an API call to get cities for a specific state
  // For now, we'll return a few cities for demonstration
  const cidadesMap: Record<number, Cidade[]> = {
    13: [ // MG
      { id: 1, codigo: "3106200", nome: "Belo Horizonte", estadoId: 13 },
      { id: 2, codigo: "3170206", nome: "Uberlândia", estadoId: 13 },
      { id: 3, codigo: "3154606", nome: "Ouro Preto", estadoId: 13 },
    ],
    25: [ // SP
      { id: 4, codigo: "3550308", nome: "São Paulo", estadoId: 25 },
      { id: 5, codigo: "3548708", nome: "Santos", estadoId: 25 },
      { id: 6, codigo: "3509502", nome: "Campinas", estadoId: 25 },
    ],
    19: [ // RJ
      { id: 7, codigo: "3304557", nome: "Rio de Janeiro", estadoId: 19 },
      { id: 8, codigo: "3301702", nome: "Duque de Caxias", estadoId: 19 },
      { id: 9, codigo: "3303500", nome: "Niterói", estadoId: 19 },
    ],
    12: [ // MS - Mato Grosso do Sul
      { id: 10, codigo: "5005707", nome: "Naviraí", estadoId: 12 },
      { id: 11, codigo: "5002704", nome: "Campo Grande", estadoId: 12 },
      { id: 12, codigo: "5003702", nome: "Dourados", estadoId: 12 },
    ],
  };
  
  return cidadesMap[estadoId] || [];
};

// Format CEP with mask (12345-678)
export const formatCep = (cep: string): string => {
  cep = cep.replace(/\D/g, ''); // Remove non-numeric characters
  if (cep.length > 5) {
    return cep.slice(0, 5) + '-' + cep.slice(5, 8);
  }
  return cep;
};

// Validate CEP format
export const validateCep = (cep: string): boolean => {
  const cleanCep = cep.replace(/\D/g, '');
  return /^[0-9]{8}$/.test(cleanCep);
};

// Define ViaCEP response type
interface ViaCepResponse {
  cep: string;
  logradouro: string;
  complemento?: string;
  bairro: string;
  localidade: string; // city name
  uf: string;
  ibge?: string;
  gia?: string;
  ddd?: string;
  siafi?: string;
  erro?: boolean;
}

// Convert ViaCEP response to our Endereco type
const mapViaCepResponse = (data: ViaCepResponse): Endereco => {
  return {
    cep: data.cep,
    logradouro: data.logradouro,
    complemento: data.complemento,
    bairro: data.bairro,
    cidade: data.localidade,
    estado: getEstadoNameBySigla(data.uf),
    uf: data.uf,
  };
};

// Get estado name by UF
const getEstadoNameBySigla = (uf: string): string => {
  const estado = estados.find(estado => estado.sigla === uf);
  return estado ? estado.nome : '';
};

// Fetch CEP data from ViaCEP API
export const fetchCepByCode = async (cep: string): Promise<Endereco | null> => {
  try {
    const cleanCep = cep.replace(/\D/g, '');
    if (!validateCep(cleanCep)) {
      throw new Error('CEP inválido');
    }
    
    const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
    const data = await response.json();
    
    if (data.erro) {
      throw new Error('CEP não encontrado');
    }
    
    const endereco = mapViaCepResponse(data);
    // Save search to history
    saveToHistory({
      termoBusca: cleanCep,
      tipoBusca: TipoBusca.CEP,
      resultados: 1,
      timestamp: Date.now(),
      enderecos: [endereco],
    });
    
    return endereco;
  } catch (error) {
    console.error('Erro ao buscar CEP:', error);
    return null;
  }
};

// Fetch addresses by street name (logradouro), state (UF) and city
export const fetchAddressByStreet = async (
  street: string,
  uf: string,
  city: string
): Promise<Endereco[]> => {
  try {
    if (!street || !uf || !city) {
      throw new Error('Todos os campos são obrigatórios');
    }
    
    if (street.length < 3) {
      throw new Error('O nome da rua deve ter pelo menos 3 caracteres');
    }

    // Encode the URI components properly to handle special characters
    const encodedUf = encodeURIComponent(uf);
    const encodedCity = encodeURIComponent(city);
    const encodedStreet = encodeURIComponent(street);
    
    const response = await fetch(`https://viacep.com.br/ws/${encodedUf}/${encodedCity}/${encodedStreet}/json/`);
    const data = await response.json();
    
    if (!data || data.erro) {
      throw new Error('Endereço não encontrado');
    }
    
    const enderecos = data.map(mapViaCepResponse);
    // Save search to history
    saveToHistory({
      termoBusca: `${street}, ${city}/${uf}`,
      tipoBusca: TipoBusca.LOGRADOURO,
      resultados: enderecos.length || 0,
      timestamp: Date.now(),
      enderecos: enderecos,
    });
    
    return enderecos;
  } catch (error) {
    console.error('Erro ao buscar endereço:', error);
    return [];
  }
};

// Get all estados
export const getAllEstados = (): Estado[] => {
  return estados;
};

// Get cidades by estado
export const getCidadesByUf = (uf: string): Cidade[] => {
  const estado = estados.find(estado => estado.sigla === uf);
  if (!estado) return [];
  
  return getCidadesByEstado(estado.id);
};

// Local storage functions for search history
const HISTORY_STORAGE_KEY = 'cepSearchHistory';

// Save search to history
export const saveToHistory = (search: BuscaHistorico): void => {
  try {
    const history = getSearchHistory();
    
    // Add unique ID
    const newSearch = {
      ...search,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    
    // Add to beginning of array
    history.unshift(newSearch);
    
    // Limit history to 20 items
    const limitedHistory = history.slice(0, 20);
    
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(limitedHistory));
  } catch (error) {
    console.error('Erro ao salvar histórico:', error);
  }
};

// Get search history
export const getSearchHistory = (): BuscaHistorico[] => {
  try {
    const history = localStorage.getItem(HISTORY_STORAGE_KEY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('Erro ao recuperar histórico:', error);
    return [];
  }
};

// Clear search history
export const clearSearchHistory = (): void => {
  localStorage.removeItem(HISTORY_STORAGE_KEY);
};
