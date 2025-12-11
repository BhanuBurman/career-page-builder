import os
from typing import List
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()


class Settings:
    def __init__(self):
        self.environment: str = os.getenv("ENVIRONMENT", "development")
        self.debug: bool = os.getenv("DEBUG", "True").lower() == "true"
        self.api_host: str = os.getenv("API_HOST", "0.0.0.0")
        self.api_port: int = int(os.getenv("API_PORT", "8000"))
        
        # Parse CORS origins from comma-separated string
        cors_origins_str = os.getenv(
            "CORS_ORIGINS", 
            "http://localhost:3000,http://localhost:5173"
        )
        self.cors_origins: List[str] = [
            origin.strip() 
            for origin in cors_origins_str.split(",") 
            if origin.strip()
        ]
        
        # Supabase configuration
        # JWT Secret: Used for verifying tokens from frontend (new format)
        # Get this from: Supabase Dashboard -> Project Settings -> API -> JWT Secret
        self.supabase_jwt_secret: str = os.getenv("SUPABASE_JWT_SECRET", "")
        self.supabase_url: str = os.getenv("SUPABASE_URL", "")
        
        # Secret Key: For server-side admin operations (if needed in future)
        # Get this from: Supabase Dashboard -> Project Settings -> API -> Secret Key
        # WARNING: Never expose this in frontend code
        self.supabase_secret_key: str = os.getenv("SUPABASE_SECRET_KEY", "")


settings = Settings()

