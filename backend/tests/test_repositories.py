
import pandas as pd
import pytest

from backend.app.domain.models import DatasetNotFoundError
from backend.app.infrastructure.repositories import DataRepository


def test_repository_files_exist():
    repo = DataRepository()
    # Assuming processed files are present
    dom_df = repo.get_domicilios()
    assert isinstance(dom_df, pd.DataFrame)

    sup_df = repo.get_suporte_social()
    assert isinstance(sup_df, pd.DataFrame)

    tempo_df = repo.get_tempo_sozinho()
    assert isinstance(tempo_df, pd.DataFrame)

def test_repository_raises_error_when_file_missing(monkeypatch, tmp_path):
    repo = DataRepository()
    monkeypatch.setattr(repo, "processed_dir", tmp_path)

    with pytest.raises(DatasetNotFoundError):
        repo.get_domicilios()

    with pytest.raises(DatasetNotFoundError):
        repo.get_suporte_social()

    with pytest.raises(DatasetNotFoundError):
        repo.get_tempo_sozinho()
