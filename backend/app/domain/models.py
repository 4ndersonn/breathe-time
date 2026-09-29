class DatasetRecord:
    """Domain model representing a statistical record."""
    def __init__(self, data: dict):
        self.data = data

    def to_dict(self) -> dict:
        return self.data


class DatasetNotFoundError(Exception):
    """Exception raised when a processed dataset CSV file is not found."""
    pass
