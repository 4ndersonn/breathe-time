from backend.app.infrastructure.repositories import DataRepository


class DataService:
    """Use case layer for fetching and processing dataset domain logic."""
    def __init__(self, repository: DataRepository = None):
        self.repository = repository or DataRepository()

    def fetch_domicilios(self, pais: str = None, ano=None) -> list:
        df = self.repository.get_domicilios(pais=pais, ano=ano)
        return df.to_dict(orient="records")

    def fetch_suporte_social(self, pais: str = None, ano=None) -> list:
        df = self.repository.get_suporte_social(pais=pais, ano=ano)
        return df.to_dict(orient="records")

    def fetch_tempo_sozinho(
        self, faixa_etaria_genero: str = None, ano=None
    ) -> list:
        df = self.repository.get_tempo_sozinho(
            faixa_etaria_genero=faixa_etaria_genero, ano=ano
        )
        return df.to_dict(orient="records")
