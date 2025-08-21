export interface Estado {
  id: number;
  codigo: string;
  nome: string;
  sigla: string;
}

export interface Cidade {
  id: number;
  codigo: string;
  nome: string;
  estadoId: number;
}

export interface Endereco {
  cep: string;
  logradouro: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  uf: string;
}

export enum TipoBusca {
  CEP = 'CEP',
  LOGRADOURO = 'LOGRADOURO',
  ENDERECO_COMPLETO = 'ENDERECO_COMPLETO'
}

export interface BuscaHistorico {
  id?: string;
  termoBusca: string;
  tipoBusca: TipoBusca;
  resultados: number;
  timestamp: number;
  enderecos: Endereco[];
}
