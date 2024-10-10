import os
from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import BaseModel

class Settings(BaseSettings):
    DB_URL: str
    AUTHJWT_SECRET_KEY: str

    model_config = SettingsConfigDict(
        env_file=Path(__file__).parent / "../.env",
        case_sensitive=True,
    )

settings = Settings()

class SettingsJWT(BaseModel):
    authjwt_secret_key: str = settings.AUTHJWT_SECRET_KEY
    authjwt_token_location: set = {"cookies"}
    authjwt_cookie_csrf_protect: bool = False

