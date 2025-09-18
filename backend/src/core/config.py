from pydantic_settings import BaseSettings
from typing import Optional
import os

class Settings(BaseSettings):
    # Environment
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    
    # Database
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        "postgresql://user:password@localhost:5432/crypto_trading"
    )
    
    # JWT
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # AWS
    AWS_REGION: str = os.getenv("AWS_REGION", "us-east-1")
    S3_BUCKET_NAME: str = os.getenv("S3_BUCKET_NAME", "crypto-trading-bucket")
    
    # External APIs
    COINGECKO_API_KEY: Optional[str] = os.getenv("COINGECKO_API_KEY")
    COINMARKETCAP_API_KEY: Optional[str] = os.getenv("COINMARKETCAP_API_KEY")
    
    # KYC Service
    KYC_SERVICE_API_KEY: Optional[str] = os.getenv("KYC_SERVICE_API_KEY")
    KYC_SERVICE_URL: Optional[str] = os.getenv("KYC_SERVICE_URL")
    
    # Email/SMS
    SES_REGION: str = os.getenv("SES_REGION", "us-east-1")
    SNS_REGION: str = os.getenv("SNS_REGION", "us-east-1")
    
    # Security
    BCRYPT_ROUNDS: int = 12
    MAX_LOGIN_ATTEMPTS: int = 5
    LOCKOUT_DURATION_MINUTES: int = 30
    
    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = 60
    
    # Pagination
    DEFAULT_PAGE_SIZE: int = 20
    MAX_PAGE_SIZE: int = 100
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()