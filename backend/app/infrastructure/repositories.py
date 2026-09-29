import logging
from pathlib import Path

import pandas as pd

from backend.app.domain.models import DatasetNotFoundError

logger = logging.getLogger(__name__)

class DataRepository:
    """Infrastructure repository for accessing processed dataset files."""
    def __init__(self):
        self.processed_dir = (
            Path(__file__).parent.parent / "data" / "processed"
        )

    def get_domicilios(self, pais: str = None, ano=None) -> pd.DataFrame:
        path = self.processed_dir / "domicilios_unipessoais_limpo.csv"
        if not path.exists():
            logger.error(f"Dataset not found at {path}")
            raise DatasetNotFoundError(
                "Dataset domicilios_unipessoais não encontrado."
            )
        df = pd.read_csv(path)
        if pais:
            df = df[df['pais'].str.lower() == pais.lower()]
        if ano is not None:
            try:
                ano_int = int(ano)
                df = df[df['ano'] == ano_int]
            except ValueError:
                pass
        return df

    def get_suporte_social(self, pais: str = None, ano=None) -> pd.DataFrame:
        path = self.processed_dir / "suporte_social_limpo.csv"
        if not path.exists():
            logger.error(f"Dataset not found at {path}")
            raise DatasetNotFoundError(
                "Dataset suporte_social não encontrado."
            )
        df = pd.read_csv(path)
        if pais:
            df = df[df['pais'].str.lower() == pais.lower()]
        if ano is not None:
            try:
                ano_int = int(ano)
                df = df[df['ano'] == ano_int]
            except ValueError:
                pass
        return df

    def get_tempo_sozinho(
        self, faixa_etaria_genero: str = None, ano=None
    ) -> pd.DataFrame:
        path = self.processed_dir / "tempo_sozinho_limpo.csv"
        if not path.exists():
            logger.error(f"Dataset not found at {path}")
            raise DatasetNotFoundError(
                "Dataset tempo_sozinho não encontrado."
            )
        df = pd.read_csv(path)
        if faixa_etaria_genero:
            df = df[
                df['faixa_etaria_genero'].str.lower() ==
                faixa_etaria_genero.lower()
            ]
        if ano is not None:
            try:
                ano_int = int(ano)
                df = df[df['ano'] == ano_int]
            except ValueError:
                pass
        return df
