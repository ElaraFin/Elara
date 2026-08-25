from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    wealth_api_base_url: str = "https://sandbox.wealthapi.eu"
    wealth_api_bearer_token: str | None = None
    wealth_api_poll_interval_seconds: float = 1.5
    wealth_api_report_max_attempts: int = 20

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


@lru_cache
def get_settings() -> Settings:
    return Settings()
