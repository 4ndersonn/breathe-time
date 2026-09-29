#!/usr/bin/env python3
"""
Pipeline de Limpeza e Processamento de Dados
Lê os datasets brutos de backend/app/data/raw/, aplica padronização e limpeza,
e salva em backend/app/data/processed/.
"""

from pathlib import Path

import pandas as pd


def inspecionar(df, nome):
    print(f"\n{'='*50}")
    print(f" Dataset: {nome}")
    print(f"   Shape: {df.shape}")
    print(f"   Colunas: {list(df.columns)}")
    year_col = next(
        (c for c in df.columns if c.lower() in ['year', 'ano']), None
    )
    if year_col and year_col in df.columns:
        anos = sorted(df[year_col].unique())
    else:
        anos = 'N/A'
    print(f"   Anos disponíveis: {anos}")
    print(f"   Nulos por coluna:\n{df.isnull().sum()}")

def main():
    raw_dir = Path(__file__).parent.parent / "backend" / "app" / "data" / "raw"
    processed_dir = (
        Path(__file__).parent.parent / "backend" / "app" / "data" / "processed"
    )
    processed_dir.mkdir(parents=True, exist_ok=True)

    print("Iniciando processamento e limpeza de dados...")

    # 1. Domicílios Unipessoais
    dom_path = raw_dir / "domicilios_unipessoais.csv"
    if dom_path.exists():
        df_dom = pd.read_csv(dom_path)
        inspecionar(df_dom, "domicilios_unipessoais")
        col_map = {}
        for c in df_dom.columns:
            cl = c.lower()
            if cl == 'entity':
                col_map[c] = 'pais'
            elif cl == 'code':
                col_map[c] = 'codigo_pais'
            elif cl == 'year':
                col_map[c] = 'ano'
        df_dom = df_dom.rename(columns=col_map)
        val_cols = [
            c for c in df_dom.columns
            if c not in ['pais', 'codigo_pais', 'ano']
        ]
        if val_cols:
            df_dom = df_dom.rename(
                columns={val_cols[0]: 'perc_domicilios_unipessoais'}
            )
            subset_cols = ['perc_domicilios_unipessoais']
            if 'codigo_pais' in df_dom.columns:
                subset_cols.append('codigo_pais')
            df_dom = df_dom.dropna(subset=subset_cols)
        out_dom = processed_dir / "domicilios_unipessoais_limpo.csv"
        df_dom.to_csv(out_dom, index=False)
        print(f" Salvo: {out_dom.name} | Shape final: {df_dom.shape}")

    # 2. Suporte Social
    sup_path = raw_dir / "suporte_social.csv"
    if sup_path.exists():
        df_sup = pd.read_csv(sup_path)
        inspecionar(df_sup, "suporte_social")
        col_map = {}
        for c in df_sup.columns:
            cl = c.lower()
            if cl == 'entity':
                col_map[c] = 'pais'
            elif cl == 'code':
                col_map[c] = 'codigo_pais'
            elif cl == 'year':
                col_map[c] = 'ano'
        df_sup = df_sup.rename(columns=col_map)
        val_cols = [
            c for c in df_sup.columns
            if c not in ['pais', 'codigo_pais', 'ano']
        ]
        if val_cols:
            df_sup = df_sup.rename(
                columns={val_cols[0]: 'perc_suporte_social'}
            )
            subset_cols = ['perc_suporte_social']
            if 'codigo_pais' in df_sup.columns:
                subset_cols.append('codigo_pais')
            df_sup = df_sup.dropna(subset=subset_cols)
        out_sup = processed_dir / "suporte_social_limpo.csv"
        df_sup.to_csv(out_sup, index=False)
        print(f" Salvo: {out_sup.name} | Shape final: {df_sup.shape}")

    # 3. Tempo Sozinho
    tempo_path = raw_dir / "tempo_sozinho.csv"
    if tempo_path.exists():
        df_tempo = pd.read_csv(tempo_path)
        inspecionar(df_tempo, "tempo_sozinho")
        col_map = {}
        for c in df_tempo.columns:
            cl = c.lower()
            if cl == 'entity':
                col_map[c] = 'faixa_etaria_genero'
            elif cl in ['year', 'ano']:
                col_map[c] = 'ano'
        df_tempo = df_tempo.rename(columns=col_map)
        target_col = 't__who_category_alone'
        if target_col in df_tempo.columns:
            df_tempo = df_tempo.dropna(subset=[target_col])
        out_tempo = processed_dir / "tempo_sozinho_limpo.csv"
        df_tempo.to_csv(out_tempo, index=False)
        print(f" Salvo: {out_tempo.name} | Shape final: {df_tempo.shape}")

    print("\n Processamento de dados concluído com sucesso!")

if __name__ == "__main__":
    main()
