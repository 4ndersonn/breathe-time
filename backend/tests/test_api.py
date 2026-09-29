import pytest

from backend.app import create_app
from backend.app.domain.models import DatasetNotFoundError
from backend.app.use_cases.data_service import DataService


@pytest.fixture
def client():
    app = create_app()
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client

def test_get_domicilios_endpoint(client, monkeypatch):
    monkeypatch.setattr(
        DataService, "fetch_domicilios",
        lambda self, pais=None, ano=None: [{
            "pais": "Brasil", "ano": 2020,
            "perc_domicilios_unipessoais": 12.5
        }]
    )

    response = client.get("/api/domicilios?pais=Brasil&ano=2020")
    assert response.status_code == 200
    data = response.get_json()
    assert isinstance(data, list)
    assert data[0]["pais"] == "Brasil"

def test_get_suporte_social_endpoint(client, monkeypatch):
    monkeypatch.setattr(
        DataService, "fetch_suporte_social",
        lambda self, pais=None, ano=None: [{
            "pais": "Brasil", "ano": 2016,
            "perc_suporte_social": 90.0
        }]
    )

    response = client.get("/api/suporte-social?pais=Brasil")
    assert response.status_code == 200
    data = response.get_json()
    assert isinstance(data, list)
    assert data[0]["perc_suporte_social"] == 90.0

def test_get_tempo_sozinho_endpoint(client, monkeypatch):
    monkeypatch.setattr(
        DataService, "fetch_tempo_sozinho",
        lambda self, faixa_etaria_genero=None, ano=None: [{
            "faixa_etaria_genero": "Youth", "ano": 15,
            "t__who_category_alone": 300.0
        }]
    )

    response = client.get("/api/tempo-sozinho?faixa_etaria_genero=Youth")
    assert response.status_code == 200
    data = response.get_json()
    assert isinstance(data, list)
    assert data[0]["faixa_etaria_genero"] == "Youth"

def test_endpoint_dataset_not_found(client, monkeypatch):
    def mock_fetch(self, pais=None, ano=None):
        raise DatasetNotFoundError("Dataset not found")
    monkeypatch.setattr(DataService, "fetch_domicilios", mock_fetch)

    response = client.get("/api/domicilios")
    assert response.status_code == 503
    data = response.get_json()
    assert data["status"] == "error"
