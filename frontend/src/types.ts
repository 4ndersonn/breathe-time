export interface DomicilioRecord {
  pais: string;
  codigo_pais?: string;
  ano: number;
  perc_domicilios_unipessoais: number;
}

export interface SuporteSocialRecord {
  pais: string;
  codigo_pais?: string;
  ano: number;
  perc_suporte_social: number;
}

export interface TempoSozinhoRecord {
  faixa_etaria_genero: string;
  ano: number;
  t__who_category_family?: number;
  t__who_category_friend?: number;
  t__who_category_co_worker?: number;
  t__who_category_partner?: number;
  t__who_category_children?: number;
  t__who_category_alone?: number;
  [key: string]: any;
}
