#!/usr/bin/env python3
"""
Pipeline de Coleta de Dados Brutos (Our World in Data)
Baixa os datasets brutos utilizados pelo Breathe Time e os salva
em backend/app/data/raw/.
"""

from pathlib import Path

import requests

DATASETS = {
    "domicilios_unipessoais": (
        "https://ourworldindata.org/grapher/one-person-households.csv"
    ),
    "suporte_social": (
        "https://ourworldindata.org/grapher/"
        "people-who-report-having-friends-or-relatives-they-can-count-on.csv"
    ),
    "tempo_sozinho": (
        "https://ourworldindata.org/grapher/time-spent-alone-by-age-and-gender.csv"
    ),
}

PARAMS = {
    "v": "1",
    "csvType": "full",
    "useColumnShortNames": "true"
}

HEADERS = {
    "User-Agent": "breathe-time/1.0 (educational project)"
}

def main():
    output_dir = (
        Path(__file__).parent.parent / "backend" / "app" / "data" / "raw"
    )
    output_dir.mkdir(parents=True, exist_ok=True)

    print("Iniciando coleta de dados brutos...")
    for nome, url in DATASETS.items():
        try:
            print(f"Baixando {nome} de {url}...")
            response = requests.get(
                url, params=PARAMS, headers=HEADERS, timeout=30
            )
            response.raise_for_status()
            caminho = output_dir / f"{nome}.csv"
            with open(caminho, "wb") as f:
                f.write(response.content)
            size_kb = caminho.stat().st_size / 1024
            print(f" [SUCESSO] {nome} -> {caminho} ({size_kb:.1f} KB)")
        except requests.exceptions.HTTPError as e:
            print(f" [ERRO HTTP] {nome}: {e}")
        except Exception as e:
            print(f" [ERRO] {nome}: {e}")

if __name__ == "__main__":
    main()
