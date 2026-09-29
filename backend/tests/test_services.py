from unittest.mock import MagicMock

import pandas as pd

from backend.app.use_cases.data_service import DataService


def test_data_service_fetch_domicilios():
    mock_repo = MagicMock()
    mock_df = pd.DataFrame([{
        "pais": "Brasil", "ano": 2020, "perc_domicilios_unipessoais": 15.0
    }])
    mock_repo.get_domicilios.return_value = mock_df

    service = DataService(repository=mock_repo)
    result = service.fetch_domicilios()

    assert isinstance(result, list)
    assert len(result) == 1
    assert result[0]["pais"] == "Brasil"
    assert result[0]["perc_domicilios_unipessoais"] == 15.0

def test_data_service_fetch_suporte_social():
    mock_repo = MagicMock()
    mock_df = pd.DataFrame([{
        "pais": "Brasil", "ano": 2021, "perc_suporte_social": 85.0
    }])
    mock_repo.get_suporte_social.return_value = mock_df

    service = DataService(repository=mock_repo)
    result = service.fetch_suporte_social()

    assert isinstance(result, list)
    assert len(result) == 1
    assert result[0]["pais"] == "Brasil"

def test_data_service_fetch_tempo_sozinho():
    mock_repo = MagicMock()
    mock_df = pd.DataFrame([{
        "faixa_etaria_genero": "18-24 Men", "t__who_category_alone": 250.0
    }])
    mock_repo.get_tempo_sozinho.return_value = mock_df

    service = DataService(repository=mock_repo)
    result = service.fetch_tempo_sozinho()

    assert isinstance(result, list)
    assert len(result) == 1
    assert result[0]["faixa_etaria_genero"] == "18-24 Men"
