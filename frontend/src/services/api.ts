import { DomicilioRecord, SuporteSocialRecord, TempoSozinhoRecord } from '../types';

const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:5000/api';

export async function fetchDomicilios(pais?: string, ano?: string | number): Promise<DomicilioRecord[]> {
  const params = new URLSearchParams();
  if (pais) params.append('pais', pais);
  if (ano) params.append('ano', String(ano));
  const query = params.toString() ? `?${params.toString()}` : '';
  
  const res = await fetch(`${API_BASE_URL}/domicilios${query}`);
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || 'Erro ao carregar dados de domicílios unipessoais.');
  }
  return res.json();
}

export async function fetchSuporteSocial(pais?: string, ano?: string | number): Promise<SuporteSocialRecord[]> {
  const params = new URLSearchParams();
  if (pais) params.append('pais', pais);
  if (ano) params.append('ano', String(ano));
  const query = params.toString() ? `?${params.toString()}` : '';

  const res = await fetch(`${API_BASE_URL}/suporte-social${query}`);
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || 'Erro ao carregar dados de suporte social.');
  }
  return res.json();
}

export async function fetchTempoSozinho(faixaEtaria?: string, ano?: string | number): Promise<TempoSozinhoRecord[]> {
  const params = new URLSearchParams();
  if (faixaEtaria) params.append('faixa_etaria_genero', faixaEtaria);
  if (ano) params.append('ano', String(ano));
  const query = params.toString() ? `?${params.toString()}` : '';

  const res = await fetch(`${API_BASE_URL}/tempo-sozinho${query}`);
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || 'Erro ao carregar dados de tempo sozinho.');
  }
  return res.json();
}
